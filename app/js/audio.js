/**
 * Motor de Áudio Híbrido de Alta Fidelidade (Studio Quality)
 * - Prioridade 1: Áudio Estático Pré-Renderizado via MP3 em assets/audio/cache (funciona 100% no celular no GitHub Pages).
 * - Prioridade 2: Síntese Dinâmica Neural Microsoft Edge via /api/tts (quando em servidor local/túnel).
 * - Prioridade 3: Web Speech API sincronizada como fallback de contingência.
 * - Encerramento automático de TODOS os sons ao sair da página ou trocar de aba.
 */

import { ambientEngine } from './ambient.js';

export class NaturalVoiceEngine {
  constructor() {
    this.currentAudio = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.manifest = null;
    this.isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    this.isMobile = typeof navigator !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1));
    this.speechUnlocked = false;

    this.loadManifest();
    this.initVoices();
    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.initVoices();
    }

    this.setupMobileUnlock();
    this.setupPageLeaveListener();
  }

  async loadManifest() {
    try {
      const res = await fetch('../assets/audio/manifest.json');
      if (res.ok) {
        this.manifest = await res.json();
      }
    } catch (_) {}
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

  setupMobileUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      if (this.speechUnlocked) return;
      this.speechUnlocked = true;
      if (this.synth) {
        try {
          this.synth.resume();
        } catch (_) {}
      }
      ambientEngine.ensureContext();
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('touchend', unlock);
      window.removeEventListener('click', unlock);
    };

    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('touchend', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
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
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (_) {}
      this.currentAudio = null;
    }
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
        const audio = new Audio(`../assets/audio/cache/${staticFile}`);
        audio.preload = 'auto';
        audio.playsInline = true;
        this.currentAudio = audio;
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
          await playPromise;
          return;
        }
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
        const audio = new Audio(audioUrl);
        audio.playsInline = true;
        this.currentAudio = audio;
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
          await playPromise;
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
      try {
        const audio = new Audio(`../assets/audio/cache/${this.manifest[manifestKey]}`);
        audio.preload = 'auto';
        audio.playsInline = true;
        this.currentAudio = audio;
        if (rate && rate !== 1.0) audio.playbackRate = rate;

        let done = false;
        const finalize = () => {
          if (done) return;
          done = true;
          ambientEngine.unduck();
          if (onEndCallback) onEndCallback();
        };

        audio.onended = finalize;
        audio.onerror = () => {
          this.speakWithWebSpeech(cleanWord, character, 0.85 * rate, onEndCallback);
        };
        audio.onpause = () => ambientEngine.unduck();

        const p = audio.play();
        if (p !== undefined) {
          await p;
          return;
        }
      } catch (_) {}
    }

    if (typeof window !== 'undefined' && !window.location.hostname.includes('github.io')) {
      try {
        const audioUrl = `/api/tts?text=${encodeURIComponent(cleanWord)}&speaker=${encodeURIComponent(character)}`;
        const audio = new Audio(audioUrl);
        audio.playsInline = true;
        this.currentAudio = audio;
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
          this.speakWithWebSpeech(cleanWord, character, 0.85 * rate, onEndCallback);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          return;
        }
      } catch (_) {}
    }

    this.speakWithWebSpeech(cleanWord, character, 0.85 * rate, onEndCallback);
  }

  speakWithWebSpeech(text, character, customRate = null, onEndCallback = null) {
    if (!this.synth) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      this.synth.cancel();
      this.synth.resume();
    } catch (_) {}

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    const charUpper = (character || '').toUpperCase();
    const isFemale = charUpper.includes('ELENA') || 
                     charUpper.includes('AMINA') || 
                     charUpper.includes('MARIE') || 
                     charUpper.includes('CHARLINE') || 
                     charUpper.includes('SYLVIE') || 
                     charUpper.includes('FEMME') || 
                     charUpper.includes('DAME') || 
                     charUpper.includes('FILLE');

    if (isFemale) {
      utter.pitch = this.isIOS ? 1.15 : 1.2;
      utter.rate = customRate || 0.88;
    } else if (charUpper.includes('PEDRO')) {
      utter.pitch = this.isIOS ? 0.98 : 0.95;
      utter.rate = customRate || 0.87;
    } else {
      utter.pitch = 0.92;
      utter.rate = customRate || 0.84;
    }

    if (!this.voices || this.voices.length === 0) {
      this.initVoices();
    }

    if (this.voices && this.voices.length > 0) {
      if (isFemale) {
        const femaleVoice = this.voices.find(v => /female|denise|hortense|celine|julie|marie|ariane|amelie|aurelie|virginie/i.test(v.name));
        utter.voice = femaleVoice || this.voices[0];
      } else {
        const maleVoice = this.voices.find(v => /male|henri|paul|jean|nicolas|gerard|mathieu|thomas|alain/i.test(v.name));
        utter.voice = maleVoice || this.voices[0];
      }
    }

    let finished = false;
    const finalize = () => {
      if (finished) return;
      finished = true;
      ambientEngine.unduck();
      if (onEndCallback) onEndCallback();
    };

    utter.onstart = () => ambientEngine.duck();
    utter.onend = finalize;
    utter.onerror = finalize;

    try {
      this.synth.speak(utter);
      const maxDuration = Math.max(2500, (text.length * 85) + 1000);
      setTimeout(() => {
        if (!finished && (!this.synth.speaking || !this.synth.pending)) {
          finalize();
        }
      }, maxDuration);
    } catch (e) {
      console.warn('Erro speechSynthesis:', e);
      finalize();
    }
  }
}

export const naturalVoice = new NaturalVoiceEngine();
