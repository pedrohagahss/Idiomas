/**
 * Motor de Áudio Híbrido de Alta Fidelidade (Studio Quality)
 * - Prioridade 1: Áudio Estático Pré-Renderizado via MP3 em assets/audio/cache (funciona 100% no celular no GitHub Pages).
 * - Carregamento síncrono instantâneo via AUDIO_MANIFEST (zero 404, zero latência).
 * - Suporte especial e desbloqueio nativo para iOS Safari e WebKit Mobile.
 * - Encerramento automático de TODOS os sons ao sair da página ou trocar de aba.
 */

import { ambientEngine } from './ambient.js';
import { AUDIO_MANIFEST } from './audio_manifest.js';

export class NaturalVoiceEngine {
  constructor() {
    this.currentAudio = null;
    this.masterAudio = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.manifest = AUDIO_MANIFEST || {};
    this.isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    this.isMobile = typeof navigator !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1));
    this.speechUnlocked = false;

    this.initVoices();
    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.initVoices();
    }

    this.setupMobileUnlock();
    this.setupPageLeaveListener();
  }

  getMasterAudio() {
    if (this.masterAudio && document.contains(this.masterAudio)) {
      return this.masterAudio;
    }
    if (typeof document !== 'undefined') {
      let el = document.getElementById('speech-master-audio');
      if (!el) {
        el = document.createElement('audio');
        el.id = 'speech-master-audio';
        el.setAttribute('playsinline', '');
        el.setAttribute('webkit-playsinline', '');
        el.style.display = 'none';
        document.body.appendChild(el);
      }
      this.masterAudio = el;
      return this.masterAudio;
    }
    return null;
  }

  getVoice(speaker) {
    const s = (speaker || '').toUpperCase();
    if (s.includes('ELENA')) return 'fr-FR-DeniseNeural';
    if (s.includes('AMINA')) return 'fr-FR-VivienneMultilingualNeural';
    if (s.includes('MARIE')) return 'fr-CH-ArianeNeural';
    if (s.includes('CHARLINE') || s.includes('BELGE_FEMME')) return 'fr-BE-CharlineNeural';
    if (s.includes('SYLVIE') || s.includes('QUEBEC_FEMME')) return 'fr-CA-SylvieNeural';
    if (s.includes('MATHIEU') || s.includes('MARIN') || s.includes('JEAN-BAPTISTE')) return 'fr-CA-JeanNeural';
    if (s.includes('YANN')) return 'fr-BE-GerardNeural';
    if (s.includes('LUCAS')) return 'fr-CH-FabriceNeural';
    if (s.includes('GRIOT') || s.includes('NARRATEUR') || s.includes('PROF') || s.includes('GUIDE')) return 'fr-FR-RemyMultilingualNeural';
    if (s.includes('FEMME') || s.includes('DAME') || s.includes('FILLE') || s.includes('WOMAN')) return 'fr-FR-DeniseNeural';
    return 'fr-FR-HenriNeural';
  }

  initVoices() {
    if (!this.synth) return;
    try {
      this.voices = (this.synth.getVoices() || []).filter(v => v.lang && v.lang.toLowerCase().startsWith('fr'));
    } catch (_) {}
  }

  unlock() {
    if (this.speechUnlocked) return;
    this.speechUnlocked = true;

    // 1. Desbloqueia elemento de áudio nativo para o WebKit/Safari
    const audio = this.getMasterAudio();
    if (audio) {
      try {
        audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
        const p = audio.play();
        if (p !== undefined) {
          p.then(() => {
            audio.pause();
            audio.currentTime = 0;
          }).catch(() => {});
        }
      } catch (_) {}
    }

    // 2. Desbloqueia síntese de voz nativa no iOS
    if (this.synth) {
      try {
        this.synth.resume();
        const silent = new SpeechSynthesisUtterance(' ');
        silent.volume = 0.01;
        this.synth.speak(silent);
      } catch (_) {}
    }

    ambientEngine.ensureContext();
  }

  setupMobileUnlock() {
    if (typeof window === 'undefined') return;
    const unlockHandler = () => {
      this.unlock();
      window.removeEventListener('touchstart', unlockHandler);
      window.removeEventListener('touchend', unlockHandler);
      window.removeEventListener('click', unlockHandler);
    };

    window.addEventListener('touchstart', unlockHandler, { passive: true });
    window.addEventListener('touchend', unlockHandler, { passive: true });
    window.addEventListener('click', unlockHandler, { passive: true });
  }

  setupPageLeaveListener() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const stopHandler = () => {
      this.stopAllSounds();
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopHandler();
    });
    window.addEventListener('pagehide', stopHandler);
    window.addEventListener('beforeunload', stopHandler);
    window.addEventListener('blur', stopHandler);
  }

  stop() {
    const audio = this.getMasterAudio();
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_) {}
    }
    if (this.currentAudio && this.currentAudio !== audio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (_) {}
    }
    this.currentAudio = null;

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (_) {}
    }
    ambientEngine.unduck();
  }

  stopAllSounds() {
    this.stop();
    ambientEngine.stopAll();

    if (typeof document !== 'undefined') {
      const allAudios = document.querySelectorAll('audio');
      allAudios.forEach(a => {
        try {
          a.pause();
          a.currentTime = 0;
        } catch (_) {}
      });
    }

    if (typeof window !== 'undefined' && window.__comicApp && window.__comicApp.isAutoPlay) {
      window.__comicApp.toggleAutoPlay(false);
    }
  }

  async speak(text, character = 'PEDRO', rate = 1.0, onEndCallback = null) {
    if (!text) {
      if (onEndCallback) onEndCallback();
      return;
    }
    this.stop();

    const cleanText = text.replace(/[«»"]/g, '').trim();
    if (!cleanText) {
      if (onEndCallback) onEndCallback();
      return;
    }

    ambientEngine.duck();

    const voice = this.getVoice(character);
    const manifestKey = `${voice}_${cleanText}`;

    // 1. TENTA REPRODUÇÃO DIRETA DO ARQUIVO MP3 ESTÁTICO (Zero latência, funciona no GitHub Pages no celular)
    let staticFile = null;
    if (this.manifest && this.manifest[manifestKey]) {
      staticFile = this.manifest[manifestKey];
    }

    if (staticFile) {
      try {
        const audio = this.getMasterAudio() || new Audio();
        audio.preload = 'auto';
        audio.playsInline = true;
        this.currentAudio = audio;
        audio.src = `../assets/audio/cache/${staticFile}`;
        audio.currentTime = 0;
        if (rate && rate !== 1.0) audio.playbackRate = rate;

        let finished = false;
        const finalize = () => {
          if (finished) return;
          finished = true;
          ambientEngine.unduck();
          if (onEndCallback) onEndCallback();
        };

        audio.onended = finalize;
        audio.onerror = () => {
          this.speakFallback(cleanText, character, rate, onEndCallback);
        };
        audio.onpause = () => ambientEngine.unduck();

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn('Playback suspenso pelo navegador (Safari aguardando toque):', err);
            // Em caso de bloqueio por falta de toque no Safari, ainda executa o callback para não travar a UI
            if (onEndCallback) onEndCallback();
          });
        }
        return;
      } catch (err) {
        console.warn('Fallback após erro de reprodução estática:', err);
      }
    }

    // 2. Se não estiver no cache estático, tenta fallback
    this.speakFallback(cleanText, character, rate, onEndCallback);
  }

  async speakFallback(cleanText, character, rate, onEndCallback) {
    // Se estiver em ambiente com servidor Node / túnel ativo
    if (typeof window !== 'undefined' && !window.location.hostname.includes('github.io')) {
      try {
        const audioUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&speaker=${encodeURIComponent(character)}`;
        const audio = this.getMasterAudio() || new Audio(audioUrl);
        audio.playsInline = true;
        this.currentAudio = audio;
        audio.src = audioUrl;
        audio.currentTime = 0;
        if (rate && rate !== 1.0) audio.playbackRate = rate;

        let done = false;
        const onFinish = () => {
          if (done) return;
          done = true;
          ambientEngine.unduck();
          if (onEndCallback) onEndCallback();
        };

        audio.onended = onFinish;
        audio.onerror = () => {
          this.speakWithWebSpeech(cleanText, character, 0.9 * rate, onEndCallback);
        };
        audio.onpause = () => ambientEngine.unduck();

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.speakWithWebSpeech(cleanText, character, 0.9 * rate, onEndCallback);
          });
          return;
        }
      } catch (_) {}
    }

    // 3. Fallback Web Speech API síncrona
    this.speakWithWebSpeech(cleanText, character, 0.9 * rate, onEndCallback);
  }

  speakSlow(text, character = 'PEDRO', onEndCallback = null) {
    return this.speak(text, character, 0.75, onEndCallback);
  }

  async speakWord(word, character = 'PEDRO', rate = 1.0, onEndCallback = null) {
    if (!word) {
      if (onEndCallback) onEndCallback();
      return;
    }
    this.stop();

    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()«»?"']/g, '').trim();
    if (!cleanWord) {
      if (onEndCallback) onEndCallback();
      return;
    }

    ambientEngine.duck();

    const voice = this.getVoice(character);
    const manifestKey = `${voice}_${cleanWord}`;

    if (this.manifest && this.manifest[manifestKey]) {
      const staticFile = this.manifest[manifestKey];
      try {
        const audio = this.getMasterAudio() || new Audio();
        audio.playsInline = true;
        this.currentAudio = audio;
        audio.src = `../assets/audio/cache/${staticFile}`;
        audio.currentTime = 0;
        if (rate && rate !== 1.0) audio.playbackRate = rate;

        let finished = false;
        const finalize = () => {
          if (finished) return;
          finished = true;
          ambientEngine.unduck();
          if (onEndCallback) onEndCallback();
        };

        audio.onended = finalize;
        audio.onerror = () => {
          this.speakWithWebSpeech(cleanWord, character, 0.9 * rate, onEndCallback);
        };
        audio.onpause = () => ambientEngine.unduck();

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.speakWithWebSpeech(cleanWord, character, 0.9 * rate, onEndCallback);
          });
        }
        return;
      } catch (_) {}
    }

    this.speakWithWebSpeech(cleanWord, character, 0.9 * rate, onEndCallback);
  }

  speakWithWebSpeech(cleanText, character, rate = 1.0, onEndCallback = null) {
    if (!this.synth) {
      ambientEngine.unduck();
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      this.synth.cancel();
      this.synth.resume();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'fr-FR';
      utterance.rate = Math.max(0.65, Math.min(1.4, rate));
      utterance.pitch = 1.0;

      const speakerUpper = (character || '').toUpperCase();
      if (speakerUpper.includes('ELENA') || speakerUpper.includes('MARIE') || speakerUpper.includes('FEMME') || speakerUpper.includes('CHARLINE') || speakerUpper.includes('SYLVIE')) {
        utterance.pitch = 1.15;
      } else if (speakerUpper.includes('GRIOT') || speakerUpper.includes('NARRATEUR') || speakerUpper.includes('PROF')) {
        utterance.pitch = 0.9;
      }

      if (this.voices.length > 0) {
        let bestVoice = this.voices.find(v => v.lang === 'fr-FR' && !v.localService);
        if (!bestVoice) bestVoice = this.voices.find(v => v.lang && v.lang.startsWith('fr'));
        if (bestVoice) utterance.voice = bestVoice;
      }

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        ambientEngine.unduck();
        if (onEndCallback) onEndCallback();
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      this.synth.speak(utterance);
    } catch (_) {
      ambientEngine.unduck();
      if (onEndCallback) onEndCallback();
    }
  }
}

export const naturalVoice = new NaturalVoiceEngine();
