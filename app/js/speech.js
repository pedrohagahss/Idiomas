/**
 * Captura e avaliação da fala do aluno.
 *
 * Dois recursos do navegador disputam o microfone: MediaRecorder ("Minha voz") e
 * SpeechRecognition (nota). Em alguns celulares eles não convivem, por isso há 3 modos
 * (escolhidos em "Meu progresso"):
 *   auto  – tenta os dois juntos; se o aparelho não aguenta (2 falhas seguidas), passa a só avaliar
 *   audio – só grava a voz (sem nota); "Minha voz" sempre funciona
 *   eval  – só avalia (nota); não guarda a voz
 *
 * - O reconhecedor que encerra sozinho (comum no celular) é reiniciado; a gravação só fecha
 *   quando o aluno terminou de falar, no teto de segurança ou quando ele toca em parar.
 * - Nunca inventa nota: sem transcrição, devolve `evaluation: null` e o motivo.
 */

import { evaluatePronunciation } from './scoring.js';

const MODE_KEY = 'hq_fr_rec_mode_v1';
const STRIKE_KEY = 'hq_fr_rec_strikes_v1';
const MIN_AUDIO_BYTES = 1200;
const MAX_SR_RESTARTS = 4;
const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch (_) { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, String(value)); } catch (_) {}
}

export class SpeechEngine {
  constructor() {
    this.isRecording = false;
    this.hasRecognition = !!SR;
    this.recordedAudioUrl = null;
    this.lastTranscript = '';
    this.session = null;
    this.urls = [];
  }

  // ---------- Modo ----------
  getMode() {
    const m = lsGet(MODE_KEY, 'auto');
    return ['auto', 'audio', 'eval'].includes(m) ? m : 'auto';
  }

  setMode(mode) {
    lsSet(MODE_KEY, mode);
    lsSet(STRIKE_KEY, 0);
  }

  getStrikes() { return parseInt(lsGet(STRIKE_KEY, '0'), 10) || 0; }

  /** True quando, neste aparelho, a gravação de voz está desligada para priorizar a nota. */
  isEvalOnly() {
    const mode = this.getMode();
    if (!SR) return false;
    return mode === 'eval' || (mode === 'auto' && this.getStrikes() >= 2);
  }

  getSupportedMimeType() {
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac', 'audio/ogg'];
    if (typeof window === 'undefined' || !window.MediaRecorder) return '';
    return types.find(t => MediaRecorder.isTypeSupported(t)) || '';
  }

  /** Guarda a URL da gravação; só revoga as mais antigas (outras telas ainda podem usá-las). */
  keepUrl(blob) {
    const url = URL.createObjectURL(blob);
    this.urls.push(url);
    while (this.urls.length > 6) URL.revokeObjectURL(this.urls.shift());
    this.recordedAudioUrl = url;
    return url;
  }

  /**
   * @param {object} opts
   * @param {string} opts.targetText  texto esperado (habilita feedback ao vivo e parada automática)
   * @param {(ev:object)=>void} opts.onInterim  avaliação parcial a cada trecho reconhecido
   * @param {()=>void} opts.onAutoStop  chamado quando o aluno terminou de falar
   * @param {(level:number)=>void} opts.onLevel  volume do microfone (0..1) para animar o botão
   * @returns {Promise<boolean>} false se o microfone não pôde ser aberto
   */
  async startRecording(opts = {}) {
    if (this.isRecording) return true;
    if (typeof opts === 'function') opts = {};
    const mode = this.getMode();
    const useSR = !!SR && mode !== 'audio';
    const useRec = !this.isEvalOnly() && typeof MediaRecorder !== 'undefined';
    const s = {
      target: opts.targetText || '',
      onInterim: opts.onInterim || null,
      onAutoStop: opts.onAutoStop || null,
      onLevel: opts.onLevel || null,
      mode, useSR, useRec,
      chunks: [], stream: null, recorder: null, mime: '',
      audioCtx: null, levelTimer: null, peak: 0,
      rec: null, recEnded: true, recError: '', transcript: '', srRestarts: 0, srTimer: null,
      silenceTimer: null, capTimer: null, autoStopped: false, stopping: false, startedAt: Date.now()
    };
    if (!useSR && !useRec) return false;
    this.session = s;
    this.isRecording = true;
    this.lastTranscript = '';

    if (useRec) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });
        // O aluno já tocou em parar enquanto o navegador pedia a permissão do microfone
        if (this.session !== s || s.stopping) {
          stream.getTracks().forEach(t => t.stop());
          return true;
        }
        s.stream = stream;
        s.mime = this.getSupportedMimeType();
        s.recorder = new MediaRecorder(stream, s.mime ? { mimeType: s.mime } : {});
        s.recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) s.chunks.push(e.data); };
        s.recorder.start(100);
        this.watchLevel(s);
      } catch (err) {
        console.warn('Microfone indisponível:', err);
        this.cleanup(s);
        if (this.session === s) { this.session = null; this.isRecording = false; }
        return false;
      }
    }

    if (useSR) this.startRecognition(s);

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
        const level = max / 128;
        s.peak = Math.max(s.peak, level);
        if (s.onLevel) { try { s.onLevel(Math.min(1, level * 2.5)); } catch (_) {} }
      }, 100);
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

      rec.onerror = (e) => {
        // "no-speech" e "aborted" são normais (silêncio / reinício): o reinício cuida deles
        if (e.error && e.error !== 'no-speech' && e.error !== 'aborted') s.recError = e.error;
      };

      rec.onend = () => {
        s.recEnded = true;
        if (s.stopping || this.session !== s) {
          if (s.onRecEnd) s.onRecEnd();
          return;
        }
        // O navegador encerrou a escuta sozinho (silêncio inicial, limite do celular).
        if (s.transcript) {
          this.autoStop(s); // já havia entendido algo: o aluno terminou de falar
        } else if (s.srRestarts < MAX_SR_RESTARTS && !s.recError) {
          s.srRestarts++;
          s.srTimer = setTimeout(() => {
            if (this.session === s && !s.stopping) this.startRecognition(s);
          }, 200);
        } else {
          // Várias tentativas seguidas sem entender nenhuma palavra: encerra e avisa.
          // (Cada tentativa dura vários segundos no celular, então quem hesita não é cortado.)
          this.autoStop(s);
        }
      };
      rec.start();
    } catch (err) {
      s.recEnded = true;
      s.recError = 'start-failed';
    }
  }

  autoStop(s) {
    if (this.session !== s || !this.isRecording || s.autoStopped || s.stopping) return;
    s.autoStopped = true;
    if (s.onAutoStop) s.onAutoStop();
  }

  cleanup(s) {
    clearTimeout(s.silenceTimer);
    clearTimeout(s.capTimer);
    clearTimeout(s.srTimer);
    clearInterval(s.levelTimer);
    if (s.onLevel) { try { s.onLevel(0); } catch (_) {} }
    if (s.audioCtx) { try { s.audioCtx.close(); } catch (_) {} }
    if (s.stream) s.stream.getTracks().forEach(t => t.stop());
  }

  /**
   * @returns {Promise<null | {audioUrl:string|null, transcript:string, evaluation:object|null,
   *   reason:string, audioMissing:boolean, durationMs:number}>}
   * reason: ''|'audio-only'|'unsupported'|'denied'|'network'|'not-heard'|'switched-solo'
   */
  async stopRecording(targetText = '') {
    const s = this.session;
    if (!this.isRecording || !s) { this.isRecording = false; return null; }
    this.isRecording = false;
    this.session = null;
    s.stopping = true;
    clearTimeout(s.srTimer);
    clearTimeout(s.silenceTimer);
    const target = targetText || s.target;

    // 1. Espera o reconhecedor entregar o resultado final
    const recDone = new Promise((resolve) => {
      if (!s.rec || s.recEnded) return resolve();
      s.onRecEnd = resolve;
      try { s.rec.stop(); } catch (_) { resolve(); }
      setTimeout(resolve, 1500);
    });

    // 2. Fecha a gravação de voz
    const audioDone = new Promise((resolve) => {
      if (!s.recorder || s.recorder.state === 'inactive') return resolve(null);
      s.recorder.onstop = () => {
        const blob = new Blob(s.chunks, { type: s.mime || 'audio/webm' });
        resolve(blob.size >= MIN_AUDIO_BYTES ? this.keepUrl(blob) : null);
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
    } else if (!s.useSR) {
      reason = 'audio-only';
    } else if (s.recError === 'not-allowed' || s.recError === 'service-not-allowed') {
      reason = 'denied';
    } else if (s.recError === 'network') {
      reason = 'network';
    } else {
      reason = 'not-heard';
    }

    // Conflito de microfone: contagem de falhas seguidas (2 → só avaliar neste aparelho)
    if (s.mode === 'auto' && s.useSR && s.useRec) {
      const conflict = s.peak > 0.12 && (!transcript || !audioUrl) && !['denied', 'network'].includes(reason);
      if (!conflict && transcript && audioUrl) lsSet(STRIKE_KEY, 0);
      else if (conflict) {
        const strikes = this.getStrikes() + 1;
        lsSet(STRIKE_KEY, strikes);
        if (strikes >= 2 && !transcript) reason = 'switched-solo';
      }
    }

    return {
      audioUrl, transcript, evaluation, reason,
      audioMissing: !audioUrl && s.useRec === false,
      durationMs: Date.now() - s.startedAt
    };
  }

  /** Mensagem pronta para a interface quando não houve avaliação. */
  describeReason(reason, hasAudio) {
    const compare = hasAudio ? ' Toque em "Minha voz" para se ouvir e comparar com o original.' : '';
    switch (reason) {
      case 'audio-only': return `Gravado ✓${compare || ' (modo só gravar: sem nota).'}`;
      case 'unsupported': return `Este navegador não transcreve fala (use Chrome, Edge ou Safari).${compare}`;
      case 'denied': return 'O reconhecimento de fala está bloqueado. Libere o microfone e o ditado nas permissões do navegador.';
      case 'network': return `O reconhecimento de fala precisa de internet e não respondeu agora.${compare}`;
      case 'switched-solo': return 'Seu aparelho não consegue gravar e avaliar ao mesmo tempo. Passei a priorizar a nota. Para guardar sua voz, escolha "Só gravar minha voz" em Meu progresso.';
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
