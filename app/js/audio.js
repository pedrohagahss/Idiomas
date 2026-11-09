/**
 * Motor de Áudio Híbrido — Vozes Neurais de Alta Fidelidade (Studio Quality)
 * Prioridade 1: Áudio Neural Microsoft Edge via /api/tts (Zero som robótico no iPhone/Safari).
 * Prioridade 2 (Fallback): Web Speech API sintetizada.
 */

import { ambientEngine } from './ambient.js';

export class NaturalVoiceEngine {
  constructor() {
    this.currentAudio = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    this.initFallbackVoices();
    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.initFallbackVoices();
    }
  }

  initFallbackVoices() {
    if (!this.synth) return;
    this.voices = (this.synth.getVoices() || []).filter(v => v.lang && v.lang.toLowerCase().startsWith('fr'));
  }

  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (_) {}
      this.currentAudio = null;
    }
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    // Restaura o som ambiente ao parar qualquer áudio
    ambientEngine.unduck();
  }

  async speak(text, character = 'PEDRO') {
    if (!text) return;
    this.stop();

    const cleanText = text.replace(/[«»"]/g, '').trim();
    if (!cleanText) return;

    // Reduz o som ambiente imediatamente para destacar a voz falada
    ambientEngine.duck();

    // Tenta áudio neural da API local/remota (100% natural, sem tom metálico de robô)
    try {
      const audioUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&speaker=${encodeURIComponent(character)}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        ambientEngine.unduck();
      };
      audio.onerror = () => {
        console.warn('Erro na reprodução neural, caindo para Web Speech API...');
        ambientEngine.unduck();
        this.speakWithWebSpeech(cleanText, character);
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
      console.warn('Fallback para Web Speech API após erro no áudio neural:', err);
    }

    // Fallback: Web Speech API caso offline
    this.speakWithWebSpeech(cleanText, character);
  }

  async speakWord(word, character = 'PEDRO') {
    if (!word) return;
    this.stop();

    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()«»?"']/g, '').trim();
    if (!cleanWord) return;

    ambientEngine.duck();

    try {
      const audioUrl = `/api/tts?text=${encodeURIComponent(cleanWord)}&speaker=${encodeURIComponent(character)}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        ambientEngine.unduck();
      };
      audio.onerror = () => {
        ambientEngine.unduck();
        this.speakWithWebSpeech(cleanWord, character, 0.82);
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

    this.speakWithWebSpeech(cleanWord, character, 0.82);
  }

  speakWithWebSpeech(text, character, customRate = null) {
    if (!this.synth) return;

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

    if (this.voices.length > 0) {
      // Procura voz feminina se personagem for mulher
      if (isFemale) {
        const femaleVoice = this.voices.find(v => /female|denise|hortense|celine|julie|marie|ariane|amelie/i.test(v.name));
        utter.voice = femaleVoice || this.voices[0];
      } else {
        const maleVoice = this.voices.find(v => /male|henri|paul|jean|nicolas|gerard|mathieu/i.test(v.name));
        utter.voice = maleVoice || this.voices[0];
      }
    }

    utter.onstart = () => {
      ambientEngine.duck();
    };
    utter.onend = () => {
      ambientEngine.unduck();
    };
    utter.onerror = () => {
      ambientEngine.unduck();
    };

    this.synth.speak(utter);
  }
}

export const naturalVoice = new NaturalVoiceEngine();
