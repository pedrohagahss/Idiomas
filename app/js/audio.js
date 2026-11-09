/**
 * Motor de Áudio Híbrido — Vozes Neurais e Síntese Web Speech Mobile
 * - Em servidor local/túnel: Áudio Neural Microsoft Edge de Estúdio via /api/tts.
 * - No GitHub Pages / Mobile: Web Speech API direta e síncrona com desbloqueio touch nativo (iOS/Android).
 * - Encerramento automático de TODOS os sons ao sair da página, mudar de aba ou minimizar.
 */

import { ambientEngine } from './ambient.js';

export class NaturalVoiceEngine {
  constructor() {
    this.currentAudio = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    this.isMobile = typeof navigator !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1));
    this.isStaticHost = typeof window !== 'undefined' && (
      window.location.hostname.includes('github.io') ||
      (!window.location.port && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('trycloudflare') && !window.location.hostname.includes('127.0.0.1'))
    );
    this.speechUnlocked = false;

    this.initVoices();
    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.initVoices();
    }

    this.setupMobileUnlock();
    this.setupPageLeaveListener();
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
          const dummy = new SpeechSynthesisUtterance(' ');
          dummy.volume = 0.01;
          this.synth.speak(dummy);
          setTimeout(() => {
            try { this.synth.cancel(); } catch (_) {}
          }, 40);
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

    // Quando o usuário sai da página, troca de aba ou minimiza o navegador
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAllSounds();
      }
    });

    window.addEventListener('pagehide', () => {
      this.stopAllSounds();
    });

    window.addEventListener('beforeunload', () => {
      this.stopAllSounds();
    });

    window.addEventListener('blur', () => {
      this.stopAllSounds();
    });
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

    // Interrompe qualquer elemento <audio> presente no documento
    if (typeof document !== 'undefined') {
      const allAudios = document.querySelectorAll('audio');
      allAudios.forEach(a => {
        try {
          a.pause();
          a.currentTime = 0;
        } catch (_) {}
      });
    }

    // Notifica app para pausar auto-play se estiver ativo
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

    // No GitHub Pages ou dispositivos móveis sem backend ativo:
    // Dispara a Web Speech API IMEDIATAMENTE de forma síncrona para preservar o gesto do usuário!
    if (this.isStaticHost) {
      this.speakWithWebSpeech(cleanText, character, 0.9 * rate, onEndCallback);
      return;
    }

    // Em servidor local ou túnel Cloudflare: Áudio Neural Microsoft Edge Studio
    try {
      const audioUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&speaker=${encodeURIComponent(character)}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      if (rate && rate !== 1.0) {
        audio.playbackRate = rate;
      }

      let done = false;
      const onFinish = () => {
        if (done) return;
        done = true;
        ambientEngine.unduck();
        if (onEndCallback) onEndCallback();
      };

      audio.onended = onFinish;
      audio.onerror = () => {
        ambientEngine.unduck();
        // Fallback síncrono para Web Speech
        this.speakWithWebSpeech(cleanText, character, 0.9 * rate, onEndCallback);
      };
      audio.onpause = () => {
        ambientEngine.unduck();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        return;
      }
    } catch (err) {
      console.warn('Fallback para Web Speech API:', err);
    }

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

    if (this.isStaticHost) {
      this.speakWithWebSpeech(cleanWord, character, 0.85 * rate, onEndCallback);
      return;
    }

    try {
      const audioUrl = `/api/tts?text=${encodeURIComponent(cleanWord)}&speaker=${encodeURIComponent(character)}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      if (rate && rate !== 1.0) {
        audio.playbackRate = rate;
      }

      let done = false;
      const onFinish = () => {
        if (done) return;
        done = true;
        ambientEngine.unduck();
        if (onEndCallback) onEndCallback();
      };

      audio.onended = onFinish;
      audio.onerror = () => {
        ambientEngine.unduck();
        this.speakWithWebSpeech(cleanWord, character, 0.85 * rate, onEndCallback);
      };
      audio.onpause = () => {
        ambientEngine.unduck();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        return;
      }
    } catch (_) {}

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

    utter.onstart = () => {
      ambientEngine.duck();
    };
    utter.onend = finalize;
    utter.onerror = finalize;

    try {
      this.synth.speak(utter);
      // Proteção Safari iOS: garante timeout caso o evento onend seja suprimido
      const maxDuration = Math.max(2800, (text.length * 85) + 1200);
      setTimeout(() => {
        if (!finished && (!this.synth.speaking || !this.synth.pending)) {
          finalize();
        }
      }, maxDuration);
    } catch (e) {
      console.warn('Erro ao disparar speechSynthesis:', e);
      finalize();
    }
  }
}

export const naturalVoice = new NaturalVoiceEngine();
