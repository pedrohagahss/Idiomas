/**
 * MOTOR DE ÁUDIO AMBIENTAL REAL (FIELD RECORDINGS)
 * Utiliza gravações reais em alta fidelidade: escritório tech, aeroporto com anúncios,
 * bistrô parisiense com trânsito e buzinas, ondas reais do mar em Gorée e vento de Québec.
 * Cross-fade suave, auto-ducking ao falar no microfone e controle de mudo.
 */

export class AmbientSoundEngine {
  constructor() {
    this.currentEnv = null;
    this.isMuted = false;
    this.isDucked = false;
    this.audioPool = new Map();
    this.activeTracks = []; // { audio: HTMLAudioElement, baseVolume: number }
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
  }

  ensureContext() {
    this.init();
    // Em navegadores mobile (iOS/Android), despausa faixas ativas se necessário
    this.activeTracks.forEach(({ audio }) => {
      if (audio && audio.paused && !this.isMuted) {
        audio.play().catch(() => {});
      }
    });
  }

  getAudioElement(name) {
    if (!this.audioPool.has(name)) {
      const audio = new Audio(`../assets/audio/ambient/${name}`);
      audio.loop = true;
      audio.preload = 'auto';
      audio.playsInline = true;
      this.audioPool.set(name, audio);
    }
    return this.audioPool.get(name);
  }

  // Define os arquivos de áudio reais para cada localidade com volumes suaves
  getLayersForEnvironment(env) {
    switch (env) {
      // 1. Aeroporto Roissy-CDG: Anúncios reais, malas e saguão suave
      case 'airport_cdg':
        return [
          { file: 'airport.mp3', volume: 0.10 }
        ];

      // 2. Café Procope & Ruas de Paris: Bistrô parisiense suave + leve trânsito
      case 'cafe_procope':
        return [
          { file: 'cafe.mp3', volume: 0.08 },
          { file: 'traffic.mp3', volume: 0.03 }
        ];

      // 3. Panthéon: Reverberação e atmosfera solene de monumento histórico
      case 'pantheon':
        return [
          { file: 'church.mp3', volume: 0.08 }
        ];

      // 4. Ilha de Gorée: Ondas suaves do Oceano Atlântico batendo na costa
      case 'goree_ocean':
        return [
          { file: 'waves.mp3', volume: 0.09 }
        ];

      // 5. Dakar / Monumento da Renascença: Brisa do litoral e mar ao fundo
      case 'dakar_breeze':
        return [
          { file: 'waves.mp3', volume: 0.07 },
          { file: 'wind.mp3', volume: 0.03 }
        ];

      // 6. Dakar Tech: Ambiente de inovação com leve movimento urbano
      case 'dakar_tech':
        return [
          { file: 'office.mp3', volume: 0.08 },
          { file: 'traffic.mp3', volume: 0.03 }
        ];

      // 7. Québec (Inverno): Vento nórdico e água do Rio São Lourenço
      case 'quebec_winter':
        return [
          { file: 'wind.mp3', volume: 0.08 },
          { file: 'river.mp3', volume: 0.04 }
        ];

      // 8. Escritórios Tech / Station F / Mila Montreal
      case 'studio_tech':
      case 'station_f':
      case 'montreal_mila':
      default:
        return [
          { file: 'office.mp3', volume: 0.08 }
        ];
    }
  }

  setEnvironment(envType) {
    if (this.currentEnv === envType) return;
    this.currentEnv = envType;

    // Fade-out e pausa das faixas anteriores
    this.stopCurrent();

    if (this.isMuted) return;

    const layers = this.getLayersForEnvironment(envType);
    this.activeTracks = layers.map(({ file, volume }) => {
      const audio = this.getAudioElement(file);
      const targetVol = this.isDucked ? 0 : volume;
      audio.volume = 0; // Inicia em 0 para fade-in
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.fadeVolume(audio, 0, targetVol, 800);
        }).catch(err => {
          console.log('Autoplay do som ambiente aguardando interação do usuário:', err.message);
        });
      }

      return { audio, baseVolume: volume };
    });
  }

  fadeVolume(audio, startVol, endVol, durationMs) {
    const steps = 16;
    const stepTime = durationMs / steps;
    const volStep = (endVol - startVol) / steps;
    let currentVol = startVol;

    const interval = setInterval(() => {
      currentVol += volStep;
      if ((volStep > 0 && currentVol >= endVol) || (volStep < 0 && currentVol <= endVol)) {
        audio.volume = Math.max(0, Math.min(1, endVol));
        clearInterval(interval);
      } else {
        audio.volume = Math.max(0, Math.min(1, currentVol));
      }
    }, stepTime);
  }

  stopCurrent() {
    this.activeTracks.forEach(({ audio }) => {
      try {
        this.fadeVolume(audio, audio.volume, 0, 400);
        setTimeout(() => {
          try { audio.pause(); } catch (_) {}
        }, 420);
      } catch (_) {}
    });
    this.activeTracks = [];
  }

  // Para completamente qualquer som de fundo na hora de gravar a voz (silêncio total no microfone)
  pauseForRecording() {
    this.isRecordingPaused = true;
    this.activeTracks.forEach(({ audio }) => {
      try {
        audio.volume = 0;
        audio.pause();
      } catch (_) {}
    });

    // Se houver música/trilha tocando no theme-audio-player, pausa imediatamente
    const themePlayer = typeof document !== 'undefined' ? document.getElementById('theme-audio-player') : null;
    if (themePlayer && !themePlayer.paused) {
      this._themeWasPlayingBeforeRecording = true;
      try { themePlayer.pause(); } catch(_) {}
    }
  }

  // Retoma o som ambiente e trilha após terminar a gravação da voz
  resumeAfterRecording() {
    this.isRecordingPaused = false;
    if (this.isMuted) return;

    this.activeTracks.forEach(({ audio, baseVolume }) => {
      try {
        const targetVol = this.isDucked ? 0.015 : baseVolume;
        if (audio.paused) {
          audio.volume = 0;
          audio.play().then(() => {
            this.fadeVolume(audio, 0, targetVol, 400);
          }).catch(() => {});
        } else {
          this.fadeVolume(audio, audio.volume, targetVol, 400);
        }
      } catch (_) {}
    });

    const themePlayer = typeof document !== 'undefined' ? document.getElementById('theme-audio-player') : null;
    if (themePlayer && this._themeWasPlayingBeforeRecording) {
      this._themeWasPlayingBeforeRecording = false;
      try { themePlayer.play().catch(() => {}); } catch(_) {}
    }
  }

  // Auto-Ducking: na hora de reproduzir qualquer som (fala, áudio, palavra), o fundo fica BEM BAIXINHO (quase inaudível)
  duck() {
    this.isDucked = true;
    if (this.isRecordingPaused) return;

    // Reduz faixas ambientes a volume quase zero (0.015)
    this.activeTracks.forEach(({ audio }) => {
      try {
        this.fadeVolume(audio, audio.volume, 0.015, 150);
      } catch (_) {}
    });

    // Também reduz drasticamente a trilha musical de fundo se estiver tocando
    const themePlayer = typeof document !== 'undefined' ? document.getElementById('theme-audio-player') : null;
    if (themePlayer && !themePlayer.paused) {
      if (this._themeOriginalVol === undefined || this._themeOriginalVol === null) {
        this._themeOriginalVol = themePlayer.volume || 0.4;
      }
      themePlayer.volume = 0.02; // Bem baixinho durante a reprodução
    }
  }

  // Restaura o som ambiente e música de fundo suavemente após terminar de reproduzir o som
  unduck() {
    this.isDucked = false;
    if (this.isMuted || this.isRecordingPaused) return;

    // Restaura as faixas de ambiente ao volume base
    this.activeTracks.forEach(({ audio, baseVolume }) => {
      try {
        if (audio.paused) audio.play().catch(() => {});
        this.fadeVolume(audio, audio.volume, baseVolume, 500);
      } catch (_) {}
    });

    // Restaura a música de fundo ao volume original
    const themePlayer = typeof document !== 'undefined' ? document.getElementById('theme-audio-player') : null;
    if (themePlayer && !themePlayer.paused && this._themeOriginalVol !== undefined && this._themeOriginalVol !== null) {
      this.fadeVolume(themePlayer, themePlayer.volume, this._themeOriginalVol, 500);
      this._themeOriginalVol = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.activeTracks.forEach(({ audio }) => {
        try { audio.volume = 0; audio.pause(); } catch (_) {}
      });
      return false;
    } else {
      if (this.currentEnv) {
        const env = this.currentEnv;
        this.currentEnv = null;
        this.setEnvironment(env);
      }
      return true;
    }
  }
}

export const ambientEngine = new AmbientSoundEngine();
