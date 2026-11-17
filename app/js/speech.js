/**
 * Captura e avaliação da fala do aluno.
 * - SpeechRecognition (fr-FR) com resultado ao vivo, melhor alternativa e parada automática
 *   quando o aluno termina de falar.
 * - MediaRecorder para o aluno se ouvir ("Minha voz").
 * - Alguns celulares não deixam gravar e transcrever ao mesmo tempo: se a gravação tem voz
 *   mas a transcrição vem vazia, o motor passa a usar só a transcrição nesse aparelho.
 * - Nunca inventa nota: sem transcrição, devolve `evaluation: null`.
 */

import { evaluatePronunciation } from './scoring.js';

const SOLO_KEY = 'hq_fr_sr_solo_v1';
const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

function readFlag(key) {
  try { return localStorage.getItem(key) === '1'; } catch (_) { return false; }
}
function writeFlag(key) {
  try { localStorage.setItem(key, '1'); } catch (_) {}
}

export class SpeechEngine {
  constructor() {
    this.isRecording = false;
    this.hasRecognition = !!SR;
    this.recordedAudioUrl = null;
    this.lastTranscript = '';
    this.session = null;
  }

  getSupportedMimeType() {
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac', 'audio/ogg'];
    if (typeof window === 'undefined' || !window.MediaRecorder) return '';
    return types.find(t => MediaRecorder.isTypeSupported(t)) || '';
  }

  /**
   * @param {object} opts
   * @param {string} opts.targetText  texto esperado (habilita feedback ao vivo e parada automática)
   * @param {(ev:object)=>void} opts.onInterim  avaliação parcial a cada trecho reconhecido
   * @param {()=>void} opts.onAutoStop  chamado quando o aluno terminou de falar
   * @returns {Promise<boolean>} false se o microfone não pôde ser aberto
   */
  async startRecording(opts = {}) {
    if (this.isRecording) return true;
    if (typeof opts === 'function') opts = {};
    const s = {
      target: opts.targetText || '',
      onInterim: opts.onInterim || null,
      onAutoStop: opts.onAutoStop || null,
      solo: this.hasRecognition && readFlag(SOLO_KEY),
      chunks: [], stream: null, recorder: null, mime: '',
      audioCtx: null, levelTimer: null, peak: 0,
      rec: null, recEnded: true, recError: '', transcript: '',
      silenceTimer: null, capTimer: null, autoStopped: false, startedAt: Date.now()
    };
    this.session = s;
    this.isRecording = true;
    this.lastTranscript = '';

    if (!s.solo) {
      try {
        s.stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });
        s.mime = this.getSupportedMimeType();
        s.recorder = new MediaRecorder(s.stream, s.mime ? { mimeType: s.mime } : {});
        s.recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) s.chunks.push(e.data); };
        s.recorder.start(100);
        this.watchLevel(s);
      } catch (err) {
        console.warn('Microfone indisponível:', err);
        this.cleanup(s);
        this.isRecording = false;
        this.session = null;
        return false;
      }
    }

    if (SR) this.startRecognition(s);

    // Teto de segurança: nunca fica gravando para sempre
    const words = s.target ? s.target.split(/\s+/).length : 12;
    s.capTimer = setTimeout(() => this.autoStop(s), Math.max(9000, words * 1300 + 6000));
    return true;
  }

  watchLevel(s) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      s.audioCtx = new AC();
      const analyser = s.audioCtx.createAnalyser();
      analyser.fftSize = 512;
      s.audioCtx.createMediaStreamSource(s.stream).connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      s.levelTimer = setInterval(() => {
        analyser.getByteTimeDomainData(buf);
        let max = 0;
        for (let i = 0; i < buf.length; i++) max = Math.max(max, Math.abs(buf[i] - 128));
        s.peak = Math.max(s.peak, max / 128);
      }, 120);
    } catch (_) {}
  }

  startRecognition(s) {
    try {
      const rec = new SR();
      rec.lang = 'fr-FR';
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 3;
      s.rec = rec;
      s.recEnded = false;

      rec.onresult = (event) => {
        const parts = [];
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          let best = res[0].transcript;
          if (s.target && res.length > 1) {
            // Entre as hipóteses do reconhecedor, fica a mais próxima da frase-alvo
            let bestScore = -1;
            for (let a = 0; a < res.length; a++) {
              const sc = evaluatePronunciation(res[a].transcript, s.target).score;
              if (sc > bestScore) { bestScore = sc; best = res[a].transcript; }
            }
          }
          parts.push(best.trim());
        }
        s.transcript = parts.join(' ').trim();
        this.lastTranscript = s.transcript;

        let done = false;
        if (s.target) {
          const ev = evaluatePronunciation(s.transcript, s.target);
          done = ev.score >= 100;
          if (s.onInterim) { try { s.onInterim(ev); } catch (_) {} }
        }
        // Parada automática: pouco depois da última palavra reconhecida
        clearTimeout(s.silenceTimer);
        s.silenceTimer = setTimeout(() => this.autoStop(s), done ? 450 : 1700);
      };
      rec.onerror = (e) => { s.recError = e.error || 'error'; };
      rec.onend = () => {
        s.recEnded = true;
        if (s.onRecEnd) s.onRecEnd();
        // O navegador encerrou a escuta sozinho (comum no iOS): fecha a tomada
        else if (this.session === s) setTimeout(() => this.autoStop(s), 250);
      };
      rec.start();
    } catch (err) {
      s.recEnded = true;
      s.recError = 'start-failed';
    }
  }

  autoStop(s) {
    if (this.session !== s || !this.isRecording || s.autoStopped) return;
    s.autoStopped = true;
    if (s.onAutoStop) s.onAutoStop();
  }

  cleanup(s) {
    clearTimeout(s.silenceTimer);
    clearTimeout(s.capTimer);
    clearInterval(s.levelTimer);
    if (s.audioCtx) { try { s.audioCtx.close(); } catch (_) {} }
    if (s.stream) s.stream.getTracks().forEach(t => t.stop());
  }

  /**
   * @returns {Promise<null | {audioUrl:string|null, transcript:string, evaluation:object|null,
   *   reason:''|'unsupported'|'denied'|'network'|'not-heard'|'switched-solo', durationMs:number}>}
   */
  async stopRecording(targetText = '') {
    const s = this.session;
    if (!this.isRecording || !s) { this.isRecording = false; return null; }
    this.isRecording = false;
    this.session = null;
    const target = targetText || s.target;

    // 1. Espera o reconhecedor entregar o resultado final (antes ele era lido cedo demais)
    const recDone = new Promise((resolve) => {
      if (!s.rec || s.recEnded) return resolve();
      s.onRecEnd = resolve;
      try { s.rec.stop(); } catch (_) { resolve(); }
      setTimeout(resolve, 1500);
    });

    // 2. Fecha a gravação
    const audioDone = new Promise((resolve) => {
      if (!s.recorder || s.recorder.state === 'inactive') return resolve(null);
      s.recorder.onstop = () => {
        const blob = new Blob(s.chunks, { type: s.mime || 'audio/webm' });
        if (this.recordedAudioUrl) URL.revokeObjectURL(this.recordedAudioUrl);
        this.recordedAudioUrl = blob.size > 0 ? URL.createObjectURL(blob) : null;
        resolve(this.recordedAudioUrl);
      };
      try { s.recorder.stop(); } catch (_) { resolve(null); }
      setTimeout(() => resolve(null), 1500);
    });

    const [, audioUrl] = await Promise.all([recDone, audioDone]);
    this.cleanup(s);

    const transcript = s.transcript;
    let evaluation = null;
    let reason = '';
    if (transcript && target) {
      evaluation = evaluatePronunciation(transcript, target);
    } else if (!SR) {
      reason = 'unsupported';
    } else if (s.recError === 'not-allowed' || s.recError === 'service-not-allowed') {
      reason = 'denied';
    } else if (s.recError === 'network') {
      reason = 'network';
    } else if (!s.solo && s.peak > 0.12) {
      // Havia voz na gravação, mas nenhuma transcrição: o aparelho não divide o microfone
      writeFlag(SOLO_KEY);
      reason = 'switched-solo';
    } else {
      reason = 'not-heard';
    }

    return { audioUrl, transcript, evaluation, reason, durationMs: Date.now() - s.startedAt };
  }

  /** Mensagem pronta para a interface quando não houve avaliação. */
  describeReason(reason, hasAudio) {
    const compare = hasAudio ? ' Toque em "Minha voz" para se ouvir e comparar com o original.' : '';
    switch (reason) {
      case 'unsupported': return `Este navegador não transcreve fala (use Chrome, Edge ou Safari).${compare}`;
      case 'denied': return 'O reconhecimento de fala está bloqueado. Libere o microfone e o ditado nas permissões do navegador.';
      case 'network': return `O reconhecimento de fala precisa de internet e não respondeu agora.${compare}`;
      case 'switched-solo': return 'Seu aparelho não grava e transcreve ao mesmo tempo. Ajustei para priorizar a avaliação: toque em gravar e repita a frase.';
      default: return `Não consegui entender a fala. Chegue mais perto do microfone e tente de novo.${compare}`;
    }
  }

  playRecordedAudio(audioElement) {
    if (!this.recordedAudioUrl) return;
    const el = audioElement || new Audio();
    el.src = this.recordedAudioUrl;
    el.play().catch(e => console.warn('Erro ao reproduzir voz gravada:', e));
  }
}

export const speechEngine = new SpeechEngine();
