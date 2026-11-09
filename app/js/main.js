/**
 * Orquestrador da HQ Digital — Layout Estilo TikTok / Reels
 * Ações Rápidas na Lateral Direita, Balão Compacto e Dossier / Notícia com Leitura por IA
 */

import { massiveEngine } from './story_engine.js';
import { naturalVoice } from './audio.js';
import { speechEngine } from './speech.js';
import { lexicalAligner } from './aligner.js';
import { ambientEngine } from './ambient.js';
import { frenchMiniGame } from './minigame.js';
import { masteryEngine } from './progress.js';

class MassiveComicApp {
  constructor() {
    this.currentSceneNumber = 1;
    this.showTranslation = true;
    this.lastAudioUrl = null;
    this.isDossierReading = false;
    this.dossierMode = 'all'; // 'all', 'selected', 'off'
    this.dossierReadingTimeout = null;
    this.currentDossierLines = [];
    this.retryWordsQueue = [];
    this.currentDrillIndex = 0;
    this.currentDrillSourceEl = null;
    this.preloadedImages = new Set();
    this.isAutoPlay = false;
    this.autoPlayTimer = null;
    this.autoPlayFallbackTimer = null;
    window.__comicApp = this;
  }

  init() {
    console.log('Iniciando HQ Digital estilo TikTok com Dossiers e Voz Neural...');
    this.preloadCoreImages();
    this.setupCoverHub();
    this.setupOpeningTheme();
    this.setupStoryNavigation();
    this.setupTikTokActions();
    this.setupDossierDrawer();
    this.setupSingleWordDrill();
    this.setupPullToCloseGestures();
    this.setupPageLeaveListener();
  }

  preloadCoreImages() {
    const urls = [
      '../assets/img/p1_1.png',
      '../assets/img/p1_2.png',
      '../assets/img/p2_1.png',
      '../assets/img/dakar_goree.png',
      '../assets/img/quebec_frontenac.png'
    ];
    urls.forEach(u => {
      const img = new Image();
      img.src = u;
      img.onload = () => this.preloadedImages.add(u);
    });
  }

  setupOpeningTheme() {
    const btnOpen = document.getElementById('btn-open-opening-theme');
    const modal = document.getElementById('opening-theme-modal');
    const btnClose = document.getElementById('btn-close-theme-modal');
    const btnPlay = document.getElementById('btn-theme-toggle-play');
    const playIcon = document.getElementById('theme-play-icon');
    const playLabel = document.getElementById('theme-play-label');
    const btnStartStory = document.getElementById('btn-theme-start-story');
    const audio = document.getElementById('theme-audio-player');
    const timer = document.getElementById('theme-timer');
    const subViewport = document.getElementById('theme-subtitles-viewport');
    const backdrop = document.getElementById('theme-modal-backdrop');

    if (!btnOpen || !modal || !audio) return;

    const THEME_SUBTITLES = [
      {
        start: 1.5,
        end: 7.0,
        fr: "Des ponts de Recife aux cieux de Paris, l'odyssée du code et de la parole commence.",
        pt: "Das pontes do Recife aos céus de Paris, nasce uma odisseia de código, arte e palavra."
      },
      {
        start: 7.0,
        end: 13.0,
        fr: "Pedro Hagah relie l'intelligence artificielle à l'âme de l'histoire et de la philosophie.",
        pt: "Pedro Hagah conecta a inteligência artificial à alma da história e das ideias."
      },
      {
        start: 13.0,
        end: 18.5,
        fr: "De la mémoire ancestrale de Gorée et Dakar aux grands débats des Lumières en Europe.",
        pt: "Da memória ancestral de Gorée e Dakar aos debates iluministas da Europa."
      },
      {
        start: 18.5,
        end: 23.5,
        fr: "Et par les horizons d'hiver du Québec, là où la technologie et la culture se rencontrent.",
        pt: "E pelos horizontes de inverno do Québec, onde a tecnologia e a cultura se abraçam."
      },
      {
        start: 23.5,
        end: 32.0,
        fr: "Pedro Hagah — L'Aventure Francophone. Le futur parle toutes les langues. Bienvenue !",
        pt: "L'Aventure Francophone — O futuro fala todas as línguas. Prepare-se para a jornada!"
      }
    ];

    if (subViewport) {
      subViewport.innerHTML = THEME_SUBTITLES.map((sub, i) => `
        <div class="theme-sub-card ${i === 0 ? 'active' : ''}" id="theme-sub-${i}">
          <div class="sub-lang-row sub-row-fr">
            <span class="sub-flag">🇫🇷</span>
            <span class="sub-text-fr">${sub.fr}</span>
          </div>
          <div class="sub-lang-row sub-row-pt">
            <span class="sub-flag">🇧🇷</span>
            <span class="sub-text-pt">${sub.pt}</span>
          </div>
        </div>
      `).join('');
    }

    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const updatePlayButtonState = () => {
      if (!playIcon || !playLabel) return;
      if (audio.paused) {
        playIcon.textContent = '▶';
        playLabel.textContent = 'Tocar';
      } else {
        playIcon.textContent = '⏸️';
        playLabel.textContent = 'Pausar';
      }
    };

    btnOpen.onclick = (e) => {
      e.stopPropagation();
      naturalVoice.stop();
      ambientEngine.stopCurrent();
      modal.style.display = 'flex';
      audio.currentTime = 0;
      audio.play().then(updatePlayButtonState).catch(() => updatePlayButtonState());
    };

    const closeModal = () => {
      audio.pause();
      modal.style.display = 'none';
    };

    if (btnClose) btnClose.onclick = (e) => { e.stopPropagation(); closeModal(); };
    if (backdrop) backdrop.onclick = (e) => { e.stopPropagation(); closeModal(); };

    if (btnPlay) {
      btnPlay.onclick = (e) => {
        e.stopPropagation();
        if (audio.paused) {
          audio.play().then(updatePlayButtonState);
        } else {
          audio.pause();
          updatePlayButtonState();
        }
      };
    }

    if (btnStartStory) {
      btnStartStory.onclick = (e) => {
        e.stopPropagation();
        closeModal();
        const hub = document.getElementById('comic-cover-hub');
        const viewport = document.getElementById('story-viewport');
        const arcSelect = document.getElementById('arc-select');
        const startScene = arcSelect ? parseInt(arcSelect.value, 10) : 0;
        if (hub) hub.style.display = 'none';
        if (viewport) viewport.style.display = 'flex';
        ambientEngine.ensureContext();
        this.loadSceneByIndex(startScene);
      };
    }

    audio.ontimeupdate = () => {
      const cur = audio.currentTime;
      const dur = audio.duration || 45;
      if (timer) timer.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;

      THEME_SUBTITLES.forEach((sub, i) => {
        const card = document.getElementById(`theme-sub-${i}`);
        if (!card) return;
        const isActive = cur >= sub.start && cur < sub.end;
        if (isActive && !card.classList.contains('active')) {
          card.classList.add('active');
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (!isActive && card.classList.contains('active')) {
          card.classList.remove('active');
        }
      });
    };

    audio.onended = () => {
      updatePlayButtonState();
    };
  }

  setupCoverHub() {
    const hub = document.getElementById('comic-cover-hub');
    const viewport = document.getElementById('story-viewport');

    // Renderiza a lista única contínua de quadrinhos lado a lado (1º Pedro Hagah + cada país francófono)
    const railAllComics = document.getElementById('rail-all-comics');

    const renderCard = (work, isFirst = false) => {
      const card = document.createElement('div');
      card.className = `rail-comic-card ${isFirst ? 'card-featured-author' : ''}`;
      card.innerHTML = `
        <div class="card-poster-wrap">
          <img src="${work.coverImage}" alt="${work.title}" class="card-poster-img" loading="lazy">
          <span class="card-badge-country">${isFirst ? '⭐ SOBRE MIM' : `${work.flag} ${work.country.split(' ')[0]}`}</span>
          <div class="card-hover-play">
            <span>▶</span>
          </div>
        </div>
        <div class="card-info-box">
          <h4 class="card-title-text">${work.title}</h4>
          <span class="card-sub-pt">${work.title_pt}</span>
          <div class="card-footer-stats">
            <span>${work.duration}</span>
            <span>🎙️ Neural</span>
          </div>
        </div>
      `;

      card.onclick = () => {
        this.openBookModal(work);
      };

      return card;
    };

    if (railAllComics) {
      railAllComics.innerHTML = '';
      // 1º: Obra sobre Pedro Hagah
      const pedroWork = massiveEngine.getWork('pedro_biography');
      if (pedroWork) {
        railAllComics.appendChild(renderCard(pedroWork, true));
      }

      // Restante: Cada um sobre um país francófono, na mesma lista lado a lado
      const countryWorks = massiveEngine.works.filter(w => w.id !== 'pedro_biography');
      countryWorks.forEach(w => railAllComics.appendChild(renderCard(w, false)));
    }

    // Navegação por setas no trilho único horizontal (‹ e ›)
    document.querySelectorAll('.rail-nav-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const railId = btn.getAttribute('data-rail');
        const rail = document.getElementById(railId);
        if (rail) {
          const scrollAmount = btn.classList.contains('prev') ? -320 : 320;
          rail.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      };
    });

    // Ações do Billboard de Destaque
    const btnHeroPlay = document.getElementById('btn-hero-play');
    if (btnHeroPlay) {
      btnHeroPlay.onclick = () => {
        naturalVoice.unlock();
        const defaultWork = massiveEngine.getWork('pedro_biography');
        massiveEngine.selectWork(defaultWork.id);
        hub.style.display = 'none';
        viewport.style.display = 'flex';
        ambientEngine.ensureContext();
        this.loadSceneByIndex(0);
      };
    }

    const btnHeroBook = document.getElementById('btn-hero-book');
    if (btnHeroBook) {
      btnHeroBook.onclick = () => {
        const defaultWork = massiveEngine.getWork('pedro_biography');
        this.openBookModal(defaultWork);
      };
    }

    // Modal de Publicação Real / Livro Aberto
    this.setupBookModal();
  }

  setupBookModal() {
    const modal = document.getElementById('book-catalog-modal');
    const btnClose = document.getElementById('btn-close-book-modal');
    if (btnClose && modal) {
      btnClose.onclick = () => {
        modal.style.display = 'none';
      };
      modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
      };
    }
  }

  openBookModal(work) {
    const modal = document.getElementById('book-catalog-modal');
    if (!modal) return;

    const coverImg = document.getElementById('book-modal-cover-img');
    const countryEl = document.getElementById('book-modal-country');
    const badgeEl = document.getElementById('book-modal-badge');
    const titleFr = document.getElementById('book-modal-title-fr');
    const titlePt = document.getElementById('book-modal-title-pt');
    const durationEl = document.getElementById('book-modal-duration');
    const synFr = document.getElementById('book-modal-synopsis-fr');
    const synPt = document.getElementById('book-modal-synopsis-pt');
    const objText = document.getElementById('book-modal-objective-text');
    const btnPlayMusic = document.getElementById('btn-book-play-music');
    const chaptersList = document.getElementById('book-modal-chapters-list');
    const btnStartAll = document.getElementById('btn-book-start-all');

    if (coverImg) coverImg.src = work.coverImage;
    if (countryEl) countryEl.textContent = `${work.flag} ${work.country}`;
    if (badgeEl) badgeEl.textContent = work.badge;
    if (titleFr) titleFr.textContent = work.title;
    if (titlePt) titlePt.textContent = work.title_pt;
    if (durationEl) durationEl.textContent = work.duration;
    if (synFr) synFr.textContent = work.synopsis_fr;
    if (synPt) synPt.textContent = work.synopsis_pt;
    if (objText) objText.textContent = work.objective || 'Atingir média mínima de 80% em áudio gravado e atividades de verbos para destravar todos os capítulos.';

    if (btnPlayMusic) {
      if (work.soundtrack && work.soundtrack.file) {
        btnPlayMusic.style.display = 'inline-flex';
        btnPlayMusic.innerHTML = '<span>▶ Tocar Trilha Oficial</span>';
        btnPlayMusic.onclick = () => {
          const player = document.getElementById('theme-audio-player');
          if (player) {
            player.src = work.soundtrack.file;
            player.play().catch(() => {});
          }
        };
      } else {
        btnPlayMusic.style.display = 'inline-flex';
        btnPlayMusic.innerHTML = '<span>🎵 Gerar no Suno AI</span>';
        btnPlayMusic.onclick = () => {
          if (btnViewSuno) btnViewSuno.click();
        };
      }
    }

    // Modal de Detalhes do Suno (Letra em 1 parágrafo, Prompt Marie, Influências Underground)
    const btnViewSuno = document.getElementById('btn-book-view-suno');
    const sunoModal = document.getElementById('book-suno-modal');
    const btnCloseSuno = document.getElementById('btn-close-suno-modal');
    const sunoTitle = document.getElementById('suno-modal-title');
    const sunoLyrics = document.getElementById('suno-modal-lyrics');
    const sunoPrompt = document.getElementById('suno-modal-prompt');
    const sunoStyle = document.getElementById('suno-modal-style');
    const btnCopyLyrics = document.getElementById('btn-copy-suno-lyrics');
    const btnCopyPrompt = document.getElementById('btn-copy-suno-prompt');

    if (btnViewSuno && sunoModal) {
      btnViewSuno.onclick = () => {
        const snd = work.soundtrack || {};
        if (sunoTitle) sunoTitle.textContent = `${work.flag} ${snd.title || work.title}`;
        if (sunoLyrics) sunoLyrics.textContent = snd.lyrics_paragraph || work.synopsis_fr;
        if (sunoPrompt) sunoPrompt.textContent = snd.suno_prompt_paragraph || 'Darkwave / Indie Electro-Rock track with French male spoken vocals and Marie crystal-clear high harmonies.';
        if (sunoStyle) sunoStyle.textContent = snd.musical_style_paragraph || 'Estilo Darkwave / Electro-Indie sem clichês tradicionais, ritmo analógico 4x4 e sintetizadores pesados.';

        if (btnCopyLyrics) {
          btnCopyLyrics.onclick = () => {
            navigator.clipboard.writeText(snd.lyrics_paragraph || '').then(() => {
              btnCopyLyrics.textContent = '✅ Letra Copiada!';
              setTimeout(() => btnCopyLyrics.textContent = '📋 Copiar Letra', 2000);
            });
          };
        }

        if (btnCopyPrompt) {
          btnCopyPrompt.onclick = () => {
            navigator.clipboard.writeText(snd.suno_prompt_paragraph || '').then(() => {
              btnCopyPrompt.textContent = '✅ Prompt Copiado!';
              setTimeout(() => btnCopyPrompt.textContent = '📋 Copiar Prompt Suno', 2000);
            });
          };
        }

        sunoModal.style.display = 'flex';
      };
    }

    if (btnCloseSuno && sunoModal) {
      btnCloseSuno.onclick = () => sunoModal.style.display = 'none';
      sunoModal.onclick = (e) => {
        if (e.target === sunoModal) sunoModal.style.display = 'none';
      };
    }

    if (chaptersList) {
      chaptersList.innerHTML = '';
      massiveEngine.selectWork(work.id);
      const chapters = work.chapters || [];
      let globalStartScene = 0;

      chapters.forEach((chap, idx) => {
        const startSceneIndex = globalStartScene;
        const scenesCount = chap.scenes ? chap.scenes.length : 1;
        globalStartScene += scenesCount;

        const isUnlocked = true; // Liberado: navegação livre entre capítulos mesmo sem os 80%
        const prog = masteryEngine.getChapterProgress(chap.id);
        const masteryTag = prog.average >= 80 
          ? `⭐ ${prog.average}% DOMINADO` 
          : (prog.average > 0 ? `✨ ${prog.average}% Concluído` : `🔓 DISPONÍVEL`);

        const row = document.createElement('div');
        row.className = 'toc-item-card';
        row.innerHTML = `
          <div class="toc-item-left">
            <span class="toc-num-badge">${String(idx + 1).padStart(2, '0')}</span>
            <div class="toc-details">
              <span class="toc-title-fr">${chap.avatar || '📖'} ${chap.title}</span>
              <span class="toc-title-pt">${chap.dossier ? chap.dossier.title_pt : ''}</span>
              <span class="toc-location">${chap.location} • ${scenesCount} cena(s) • <strong class="toc-lock-badge unlocked">${masteryTag}</strong></span>
            </div>
          </div>
          <button class="btn-toc-play">📖 Ler Capítulo</button>
        `;

        row.onclick = () => {
          naturalVoice.unlock();
          modal.style.display = 'none';
          document.getElementById('comic-cover-hub').style.display = 'none';
          document.getElementById('story-viewport').style.display = 'flex';
          ambientEngine.ensureContext();
          this.loadSceneByIndex(startSceneIndex);
        };

        chaptersList.appendChild(row);
      });
    }

    if (btnStartAll) {
      btnStartAll.onclick = () => {
        naturalVoice.unlock();
        massiveEngine.selectWork(work.id);
        modal.style.display = 'none';
        document.getElementById('comic-cover-hub').style.display = 'none';
        document.getElementById('story-viewport').style.display = 'flex';
        ambientEngine.ensureContext();
        this.loadSceneByIndex(0);
      };
    }

    modal.style.display = 'flex';
  }

  setupStoryNavigation() {
    const tapNext = document.getElementById('tap-next');
    if (tapNext) {
      tapNext.onclick = () => this.nextScene();
    }

    const tapPrev = document.getElementById('tap-prev');
    if (tapPrev) {
      tapPrev.onclick = () => this.prevScene();
    }

    // Botão de alternar som ambiente de fundo no topo
    const btnAmbience = document.getElementById('btn-toggle-ambience');
    const ambienceIcon = document.getElementById('ambience-icon');
    const ambienceLabel = document.getElementById('ambience-label');
    if (btnAmbience) {
      btnAmbience.onclick = (e) => {
        e.stopPropagation();
        ambientEngine.ensureContext();
        const isPlaying = ambientEngine.toggleMute();
        btnAmbience.classList.toggle('muted', !isPlaying);
        if (ambienceIcon) ambienceIcon.textContent = isPlaying ? '🎵' : '🔇';
        if (ambienceLabel) ambienceLabel.textContent = isPlaying ? 'Fundo' : 'Mudo';
      };
    }

    // Botão de Passagem de Revista Automática (Auto-Play)
    const btnAuto = document.getElementById('btn-toggle-autoplay');
    if (btnAuto) {
      btnAuto.onclick = (e) => {
        e.stopPropagation();
        this.toggleAutoPlay();
      };
    }

    window.addEventListener('keydown', (e) => {
      const viewport = document.getElementById('story-viewport');
      if (viewport && viewport.style.display === 'flex') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          this.nextScene();
        }
        if (e.key === 'ArrowLeft') {
          this.prevScene();
        }
      }
    });
  }

  setupTikTokActions() {
    const btnRecord = document.getElementById('btn-tiktok-record');
    const recordIcon = document.getElementById('tiktok-record-icon');
    const recordLabel = document.getElementById('tiktok-record-label');
    const btnPlayback = document.getElementById('btn-tiktok-playback');
    const player = document.getElementById('story-user-player');

    const btnSpeak = document.getElementById('btn-tiktok-speak');
    const btnDossier = document.getElementById('btn-tiktok-dossier');
    const btnPt = document.getElementById('btn-tiktok-pt');
    const ptLabel = document.getElementById('tiktok-pt-label');
    const btnHome = document.getElementById('btn-tiktok-home');

    // 1. Gravação / Regravação Imediata (Sempre permite regravar por cima!)
    if (btnRecord) {
      btnRecord.onclick = async (e) => {
        e.stopPropagation();
        // Se está gravando: PARAR e salvar tomada
        if (speechEngine.isRecording) {
          btnRecord.classList.remove('recording');
          recordIcon.textContent = '🎙️';
          recordLabel.textContent = 'Regravar';
          
          const sc = massiveEngine.getScene(this.currentSceneNumber - 1);
          const res = await speechEngine.stopRecording(sc.dialogue_fr);
          ambientEngine.resumeAfterRecording();
          if (res && res.audioUrl) {
            this.lastAudioUrl = res.audioUrl;
            player.src = res.audioUrl;
            if (btnPlayback) {
              btnPlayback.style.display = 'flex';
            }
            ambientEngine.duck();
            player.onended = () => ambientEngine.unduck();
            player.onpause = () => ambientEngine.unduck();
            player.play().catch(err => {
              ambientEngine.unduck();
              console.log('Toque no botão para ouvir:', err);
            });

            // Qualifica a fala do aluno e exibe o feedback detalhado
            if (res.evaluation) {
              this.showSpeechQualificationToast(res.evaluation, sc.dialogue_fr);

              // Registra a pontuação do áudio na maestria do capítulo
              masteryEngine.recordAudioScore(sc.chapterId, res.evaluation.score);
              const valEl = document.getElementById('story-mastery-val');
              const prog = masteryEngine.getChapterProgress(sc.chapterId);
              if (valEl) valEl.textContent = `${prog.average}%`;

              // Avalia desbloqueio do próximo capítulo caso atinja 80%
              const chapters = massiveEngine.activeChapters || [];
              const currIdx = chapters.findIndex(c => c.id === sc.chapterId);
              if (currIdx >= 0 && currIdx < chapters.length - 1) {
                const nextChap = chapters[currIdx + 1];
                const unlockRes = masteryEngine.evaluateChapterUnlock(sc.chapterId, nextChap.id);
                if (unlockRes.justUnlocked) {
                  alert(`🎉 PARABÉNS! META DE 80% ATINGIDA!\n\nVocê desbloqueou o próximo capítulo:\n${nextChap.title} 🔓`);
                }
              }
            }
          }
        } 
        // Se não está gravando: INICIAR NOVA GRAVAÇÃO POR CIMA
        else {
          this.pauseAutoPlayTemporarily();
          if (player) {
            try { player.pause(); player.currentTime = 0; } catch(_) {}
          }
          naturalVoice.stop();

          btnRecord.classList.add('recording');
          recordIcon.textContent = '⏹️';
          recordLabel.textContent = 'Parar';
          
          // Para completamente qualquer som de background (silêncio total no microfone)
          ambientEngine.pauseForRecording();
          await speechEngine.startRecording();
        }
      };
    }

    // 2. Ouvir a Minha Própria Gravação
    if (btnPlayback) {
      btnPlayback.onclick = (e) => {
        e.stopPropagation();
        if (this.lastAudioUrl) {
          ambientEngine.duck();
          player.currentTime = 0;
          player.onended = () => ambientEngine.unduck();
          player.onpause = () => ambientEngine.unduck();
          player.play().catch(() => {
            const a = new Audio(this.lastAudioUrl);
            a.onended = () => ambientEngine.unduck();
            a.play().catch(() => ambientEngine.unduck());
          });
        }
      };
    }

    // 3. Ouvir Réplica Completa da Cena
    if (btnSpeak) {
      btnSpeak.onclick = (e) => {
        e.stopPropagation();
        const sc = massiveEngine.getScene(this.currentSceneNumber - 1);
        naturalVoice.speak(sc.dialogue_fr, sc.speaker);
      };
    }

    // 4. Abrir Dossier / Notícia
    if (btnDossier) {
      btnDossier.onclick = (e) => {
        e.stopPropagation();
        this.pauseAutoPlayTemporarily();
        this.openDossierDrawer();
      };
    }

    // 4.5. Abrir Mini-Game / Desafio de Verbos e Reconstrução
    const btnMiniGame = document.getElementById('btn-tiktok-minigame');
    if (btnMiniGame) {
      btnMiniGame.onclick = (e) => {
        e.stopPropagation();
        this.pauseAutoPlayTemporarily();
        const sc = massiveEngine.getScene(this.currentSceneNumber - 1);
        frenchMiniGame.show(sc.verb_challenge || sc);
      };
    }

    // 5. Alternar Tradução PT-BR
    if (btnPt) {
      btnPt.onclick = (e) => {
        e.stopPropagation();
        this.showTranslation = !this.showTranslation;
        btnPt.classList.toggle('active', this.showTranslation);
        if (ptLabel) ptLabel.textContent = this.showTranslation ? 'Trad. ON' : 'Trad. OFF';
        const ptEl = document.getElementById('story-pt-text');
        if (ptEl) ptEl.style.display = this.showTranslation ? 'block' : 'none';
      };
    }

    // 6. Voltar para a Capa (Catálogo Netflix)
    if (btnHome) {
      btnHome.onclick = (e) => {
        e.stopPropagation();
        if (this.isAutoPlay) this.toggleAutoPlay(false);
        naturalVoice.stop();
        ambientEngine.stopCurrent();
        document.getElementById('story-viewport').style.display = 'none';
        document.getElementById('comic-cover-hub').style.display = 'block';
      };
    }

    // Botão de narrador da caixinha amarela (se presente)
    const btnNarrator = document.getElementById('btn-speak-narrator');
    if (btnNarrator) {
      btnNarrator.onclick = (e) => {
        e.stopPropagation();
        const sc = massiveEngine.getScene(this.currentSceneNumber - 1);
        if (sc && sc.caption) {
          naturalVoice.speak(sc.caption, 'NARRATEUR');
        }
      };
    }
  }

  showSpeechQualificationToast(evalData, dialogueFr) {
    const toast = document.getElementById('speech-qualification-toast');
    if (toast) toast.style.display = 'none'; // Desativa a tela gigante que ocupava espaço

    if (!evalData) return;

    // 1. Marca as palavras diretamente no texto da cena dentro do balão (zero poluição de tela)
    const frWords = document.querySelectorAll('#story-fr-text .story-word');
    if (frWords && frWords.length > 0 && evalData.wordFeedback) {
      const clean = (t) => (t || '').toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()«»?"']/g, '').trim();
      const feedbackMap = new Map();
      evalData.wordFeedback.forEach(wf => {
        const k = clean(wf.word);
        if (k) feedbackMap.set(k, wf.correct);
      });

      frWords.forEach(wordEl => {
        const wordText = clean(wordEl.textContent);
        wordEl.classList.remove('word-correct', 'word-retry');
        if (feedbackMap.has(wordText)) {
          const isCorrect = feedbackMap.get(wordText);
          wordEl.classList.add(isCorrect ? 'word-correct' : 'word-retry');
        } else {
          wordEl.classList.add(evalData.score >= 75 ? 'word-correct' : 'word-retry');
        }
      });
    }

    // 2. Insere badge de nota compacto no topo do balão de fala
    let scoreBadge = document.getElementById('bubble-speech-score-badge');
    if (!scoreBadge) {
      scoreBadge = document.createElement('span');
      scoreBadge.id = 'bubble-speech-score-badge';
      const headerRow = document.querySelector('.bubble-header-row');
      if (headerRow) {
        headerRow.appendChild(scoreBadge);
      }
    }
    scoreBadge.className = `bubble-score-badge ${evalData.badgeClass}`;
    scoreBadge.innerHTML = `⭐ ${evalData.score}% • ${evalData.gradeTitle}`;
    scoreBadge.style.display = 'inline-flex';

    // 3. Exibe comentário compacto com botão interativo para treinar palavras com erro
    let commentBox = document.getElementById('bubble-speech-comment');
    if (!commentBox) {
      commentBox = document.createElement('div');
      commentBox.id = 'bubble-speech-comment';
      const bubble = document.getElementById('story-speech-bubble');
      if (bubble) {
        bubble.appendChild(commentBox);
      }
    }
    commentBox.className = 'bubble-feedback-commentary';

    // Monta fila de palavras que precisam de repetição/treino individual
    const retryElements = document.querySelectorAll('#story-fr-text .story-word.word-retry');
    this.retryWordsQueue = [];
    retryElements.forEach(el => {
      const wText = el.textContent.replace(/[.,/#!$%^&*;:{}=\-_`~()«»?"']/g, '').trim();
      if (wText) {
        this.retryWordsQueue.push({
          word: wText,
          ipa: `[${wText.toLowerCase()}]`,
          meaning: 'Palavra da cena',
          sourceEl: el
        });

        // Torna a palavra vermelha clicável individualmente para abrir o treino
        el.title = 'Toque para treinar esta palavra individualmente';
        el.onclick = (e) => {
          e.stopPropagation();
          this.openSingleWordDrill(wText, `[${wText.toLowerCase()}]`, 'Treino focado de pronúncia', el);
        };
      }
    });

    let drillButtonHtml = '';
    if (this.retryWordsQueue.length > 0) {
      drillButtonHtml = ` <button id="btn-bubble-drill-action" style="margin-left: 8px; background: var(--story-yellow); color: #000; border: none; border-radius: 4px; padding: 2px 8px; font-weight: 800; font-size: 0.75rem; cursor: pointer; box-shadow: 1px 1px 0 #000;">🎯 Treinar Palavras (${this.retryWordsQueue.length})</button>`;
    }

    commentBox.innerHTML = `🎯 <strong>Feedback:</strong> ${evalData.commentary}${drillButtonHtml}`;
    commentBox.style.display = 'block';

    const btnDrill = document.getElementById('btn-bubble-drill-action');
    if (btnDrill && this.retryWordsQueue.length > 0) {
      btnDrill.onclick = (e) => {
        e.stopPropagation();
        this.currentDrillIndex = 0;
        this.openSingleWordDrill(
          this.retryWordsQueue[0].word,
          this.retryWordsQueue[0].ipa,
          this.retryWordsQueue[0].meaning,
          this.retryWordsQueue[0].sourceEl
        );
      };
    }

    // 4. Libera botão "Minha Voz" no dock lateral
    const btnPlayback = document.getElementById('btn-tiktok-playback');
    if (btnPlayback) {
      btnPlayback.style.display = 'flex';
    }
  }

  setupSingleWordDrill() {
    const modal = document.getElementById('single-word-drill-modal');
    const btnClose = document.getElementById('btn-close-single-drill');
    const btnDone = document.getElementById('btn-drill-done');
    const btnNext = document.getElementById('btn-drill-next');
    const btnAudioNormal = document.getElementById('btn-drill-audio-normal');
    const btnAudioSlow = document.getElementById('btn-drill-audio-slow');
    const btnRecord = document.getElementById('btn-drill-record');
    const recordIcon = document.getElementById('drill-record-icon');
    const recordLabel = document.getElementById('drill-record-label');
    const statusEl = document.getElementById('drill-status');
    const feedbackBox = document.getElementById('drill-feedback-box');
    const feedbackText = document.getElementById('drill-feedback-text');

    if (btnClose) btnClose.onclick = () => this.closeSingleWordDrill();
    if (btnDone) btnDone.onclick = () => this.closeSingleWordDrill();

    if (btnAudioNormal) {
      btnAudioNormal.onclick = () => {
        const word = document.getElementById('drill-word-target').textContent;
        naturalVoice.speakWord(word, 'PEDRO', 1.0);
      };
    }

    if (btnAudioSlow) {
      btnAudioSlow.onclick = () => {
        const word = document.getElementById('drill-word-target').textContent;
        naturalVoice.speakWord(word, 'PEDRO', 0.75);
      };
    }

    if (btnNext) {
      btnNext.onclick = () => {
        if (this.retryWordsQueue && this.retryWordsQueue.length > this.currentDrillIndex + 1) {
          this.currentDrillIndex++;
          this.displayDrillWord(this.retryWordsQueue[this.currentDrillIndex]);
        }
      };
    }

    let isRecordingDrill = false;
    if (btnRecord) {
      btnRecord.onclick = async () => {
        const targetWord = document.getElementById('drill-word-target').textContent;
        if (!targetWord) return;

        if (isRecordingDrill) {
          isRecordingDrill = false;
          btnRecord.classList.remove('recording');
          if (recordIcon) recordIcon.textContent = '🎙️';
          if (recordLabel) recordLabel.textContent = 'Gravar e Validar Pronúncia';
          if (statusEl) statusEl.textContent = 'Avaliando pronúncia...';

          const res = await speechEngine.stopRecording(targetWord);
          if (res && res.evaluation && feedbackBox && feedbackText) {
            feedbackBox.style.display = 'block';
            const clean = (t) => (t || '').toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()«»?"']/g, '').trim();
            const targetClean = clean(targetWord);
            const recognized = clean(res.recognized);
            const isMatch = recognized.includes(targetClean) || targetClean.includes(recognized) || res.evaluation.score >= 70;

            if (isMatch) {
              feedbackBox.className = 'drill-feedback-box correct';
              feedbackText.innerHTML = `✨ <strong>PARABÉNS! PRONÚNCIA EXATA!</strong><br>Palavra dominada com sucesso!`;
              if (statusEl) statusEl.textContent = 'Excelente! Pronúncia qualificada com sucesso.';

              if (this.currentDrillSourceEl) {
                this.currentDrillSourceEl.classList.remove('word-retry');
                this.currentDrillSourceEl.classList.add('word-correct');
              }

              if (btnNext && this.retryWordsQueue && this.currentDrillIndex < this.retryWordsQueue.length - 1) {
                btnNext.style.display = 'block';
              }
            } else {
              feedbackBox.className = 'drill-feedback-box retry';
              feedbackText.innerHTML = `⚠️ <strong>Você disse: "${res.recognized || '...'}"</strong><br>Tente novamente ouvindo o modo lento 🐢.`;
              if (statusEl) statusEl.textContent = 'Toque em "Ouvir Lento (0.75x)" e depois grave novamente.';
            }
          }
        } else {
          isRecordingDrill = true;
          btnRecord.classList.add('recording');
          if (recordIcon) recordIcon.textContent = '⏹️';
          if (recordLabel) recordLabel.textContent = 'Parar Gravação';
          if (statusEl) statusEl.textContent = 'Fale a palavra claramente agora...';
          if (feedbackBox) feedbackBox.style.display = 'none';
          await speechEngine.startRecording();
        }
      };
    }
  }

  openSingleWordDrill(word, ipa = '', meaning = '', sourceEl = null) {
    this.pauseAutoPlayTemporarily();
    this.currentDrillSourceEl = sourceEl;
    this.displayDrillWord({ word, ipa, meaning, sourceEl });
    const modal = document.getElementById('single-word-drill-modal');
    if (modal) modal.style.display = 'flex';
  }

  displayDrillWord(item) {
    if (!item) return;
    const wordTarget = document.getElementById('drill-word-target');
    const wordIpa = document.getElementById('drill-word-ipa');
    const wordMeaning = document.getElementById('drill-word-meaning');
    const feedbackBox = document.getElementById('drill-feedback-box');
    const statusEl = document.getElementById('drill-status');
    const btnNext = document.getElementById('btn-drill-next');

    if (wordTarget) wordTarget.textContent = item.word;
    if (wordIpa) wordIpa.textContent = item.ipa || '[pronúncia padrão]';
    if (wordMeaning) wordMeaning.textContent = item.meaning || 'Toque para praticar';
    if (feedbackBox) feedbackBox.style.display = 'none';
    if (statusEl) statusEl.textContent = 'Pressione o microfone e fale a palavra em voz alta';
    if (btnNext) {
      btnNext.style.display = (this.retryWordsQueue && this.currentDrillIndex < this.retryWordsQueue.length - 1) ? 'block' : 'none';
    }

    this.currentDrillSourceEl = item.sourceEl || this.currentDrillSourceEl;
    naturalVoice.speakWord(item.word, 'PEDRO');
  }

  closeSingleWordDrill() {
    naturalVoice.stop();
    const modal = document.getElementById('single-word-drill-modal');
    if (modal) modal.style.display = 'none';
  }

  setupDossierDrawer() {
    const backdrop = document.getElementById('dossier-drawer-backdrop');
    const btnClose = document.getElementById('btn-close-dossier');
    const btnReadAi = document.getElementById('btn-read-dossier-ai');

    // Modos de Tradução: Linha a Linha (all), Apenas Selecionado (selected), Ocultar (off)
    const btnModeAll = document.getElementById('btn-mode-all');
    const btnModeSelected = document.getElementById('btn-mode-selected');
    const btnModeOff = document.getElementById('btn-mode-off');
    const linesContainer = document.getElementById('dossier-lines-container');

    const setMode = (mode) => {
      this.dossierMode = mode;
      [btnModeAll, btnModeSelected, btnModeOff].forEach(b => b && b.classList.remove('active'));
      if (mode === 'all' && btnModeAll) btnModeAll.classList.add('active');
      if (mode === 'selected' && btnModeSelected) btnModeSelected.classList.add('active');
      if (mode === 'off' && btnModeOff) btnModeOff.classList.add('active');

      if (linesContainer) {
        linesContainer.className = `dossier-lines-container mode-${mode}`;
      }
    };

    if (btnModeAll) btnModeAll.onclick = () => setMode('all');
    if (btnModeSelected) btnModeSelected.onclick = () => setMode('selected');
    if (btnModeOff) btnModeOff.onclick = () => setMode('off');

    if (btnClose) {
      btnClose.onclick = () => this.closeDossierDrawer();
    }

    if (backdrop) {
      backdrop.onclick = (e) => {
        if (e.target === backdrop) this.closeDossierDrawer();
      };
    }

    if (btnReadAi) {
      btnReadAi.onclick = () => {
        if (this.isDossierReading) {
          this.stopDossierReading();
        } else {
          this.startDossierReading();
        }
      };
    }
  }

  openDossierDrawer() {
    const sc = massiveEngine.getScene(this.currentSceneNumber - 1);
    if (!sc || !sc.dossier) return;

    const dossier = sc.dossier;
    const badgeEl = document.getElementById('drawer-badge');
    const sourceEl = document.getElementById('drawer-source-tag');
    const titleFrEl = document.getElementById('drawer-title-fr');
    const titlePtEl = document.getElementById('drawer-title-pt');
    const container = document.getElementById('dossier-lines-container');

    if (badgeEl) badgeEl.textContent = dossier.badge || '📰 LE MONDE • ACTUALITÉ 2026';
    if (sourceEl) sourceEl.textContent = dossier.source || 'RFI / FRANCE 24';
    if (titleFrEl) titleFrEl.textContent = dossier.title_fr;
    if (titlePtEl) titlePtEl.textContent = dossier.title_pt;

    this.stopDossierReading();

    // Divide em linhas interlineares reais (se dossier.lines não estiver definido, divide o artigo por pontuação)
    let lines = [];
    if (dossier.lines && Array.isArray(dossier.lines) && dossier.lines.length > 0) {
      lines = dossier.lines;
    } else {
      const frSentences = (dossier.article_fr || '').split(/(?<=[.?!:])\s+/).filter(Boolean);
      const ptSentences = (dossier.article_pt || '').split(/(?<=[.?!:])\s+/).filter(Boolean);
      lines = frSentences.map((fr, idx) => ({
        fr: fr.trim(),
        pt: (ptSentences[idx] || '').trim()
      }));
    }
    this.currentDossierLines = lines;

    if (container) {
      container.className = `dossier-lines-container mode-${this.dossierMode || 'all'}`;
      container.innerHTML = '';

      lines.forEach((line, idx) => {
        const card = document.createElement('div');
        card.className = 'dossier-line-card';
        card.id = `dossier-line-${idx}`;

        // Palavras francesas clicáveis individualmente para ouvir pronúncia
        const wordsHtml = line.fr.split(/\s+/).map(w => `<span class="news-word">${w}</span>`).join(' ');

        card.innerHTML = `
          <div class="news-line-top-row">
            <p class="news-line-fr">${wordsHtml}</p>
            <button class="news-speak-btn" title="Ouvir esta frase com IA">🔊</button>
          </div>
          <p class="news-line-pt">${line.pt || ''}</p>
        `;

        // Clique em palavras individuais na notícia
        const wordSpans = card.querySelectorAll('.news-word');
        wordSpans.forEach(ws => {
          ws.onclick = (e) => {
            e.stopPropagation();
            naturalVoice.speakWord(ws.textContent, 'PEDRO');
          };
        });

        // Clique no botão de áudio da frase
        const btnSpeak = card.querySelector('.news-speak-btn');
        if (btnSpeak) {
          btnSpeak.onclick = (e) => {
            e.stopPropagation();
            naturalVoice.speak(line.fr, 'NARRATEUR');
          };
        }

        // Clique no card da linha: seleciona para revelar tradução se no modo 'selected'
        card.onclick = () => {
          const allCards = container.querySelectorAll('.dossier-line-card');
          const isSelected = card.classList.contains('selected');
          allCards.forEach(c => c.classList.remove('selected'));
          if (!isSelected) {
            card.classList.add('selected');
          }
        };

        container.appendChild(card);
      });
    }

    const backdrop = document.getElementById('dossier-drawer-backdrop');
    if (backdrop) backdrop.style.display = 'flex';
  }

  startDossierReading() {
    if (!this.currentDossierLines || this.currentDossierLines.length === 0) return;
    this.isDossierReading = true;
    const btnReadAi = document.getElementById('btn-read-dossier-ai');
    const aiText = document.getElementById('ai-speak-text');
    if (btnReadAi) btnReadAi.classList.add('reading');
    if (aiText) aiText.textContent = "⏹️ PARAR LEITURA IA";

    this.readDossierLineStep(0);
  }

  stopDossierReading() {
    this.isDossierReading = false;
    naturalVoice.stop();
    ambientEngine.unduck();
    if (this.dossierReadingTimeout) {
      clearTimeout(this.dossierReadingTimeout);
      this.dossierReadingTimeout = null;
    }
    const btnReadAi = document.getElementById('btn-read-dossier-ai');
    const aiText = document.getElementById('ai-speak-text');
    if (btnReadAi) btnReadAi.classList.remove('reading');
    if (aiText) aiText.textContent = "OUVIR IA";

    const allCards = document.querySelectorAll('.dossier-line-card');
    allCards.forEach(c => c.classList.remove('line-active'));
  }

  readDossierLineStep(index) {
    if (!this.isDossierReading) return;
    if (!this.currentDossierLines || index >= this.currentDossierLines.length) {
      this.stopDossierReading();
      return;
    }

    const allCards = document.querySelectorAll('.dossier-line-card');
    allCards.forEach(c => c.classList.remove('line-active'));

    const currentCard = document.getElementById(`dossier-line-${index}`);
    if (currentCard) {
      currentCard.classList.add('line-active');
      currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const line = this.currentDossierLines[index];
    naturalVoice.speak(line.fr, 'NARRATEUR');

    const duration = Math.max(2500, (line.fr.length * 75) + 1200);
    this.dossierReadingTimeout = setTimeout(() => {
      if (this.isDossierReading) {
        this.readDossierLineStep(index + 1);
      }
    }, duration);
  }

  closeDossierDrawer() {
    this.stopDossierReading();
    const backdrop = document.getElementById('dossier-drawer-backdrop');
    if (backdrop) backdrop.style.display = 'none';
  }

  loadSceneByIndex(idx) {
    const qualToast = document.getElementById('speech-qualification-toast');
    if (qualToast) qualToast.style.display = 'none';

    // Limpa feedback inline anterior do balão
    const oldScoreBadge = document.getElementById('bubble-speech-score-badge');
    if (oldScoreBadge) oldScoreBadge.remove();
    const oldComment = document.getElementById('bubble-speech-comment');
    if (oldComment) oldComment.remove();

    const total = massiveEngine.totalTargetScenes;
    const clamped = Math.max(0, Math.min(idx, total - 1));
    this.currentSceneNumber = clamped + 1;
    const scene = massiveEngine.getScene(clamped);

    // Atualiza o som ambiente contínuo do ambiente específico
    ambientEngine.setEnvironment(scene.environment);

    // Reseta estado do botão de gravação para a nova cena
    const btnRecord = document.getElementById('btn-tiktok-record');
    const recordIcon = document.getElementById('tiktok-record-icon');
    const recordLabel = document.getElementById('tiktok-record-label');
    const btnPlayback = document.getElementById('btn-tiktok-playback');
    if (btnRecord) {
      btnRecord.classList.remove('recording');
      if (recordIcon) recordIcon.textContent = '🎙️';
      if (recordLabel) recordLabel.textContent = 'Gravar';
    }
    if (btnPlayback) {
      btnPlayback.style.display = 'none';
    }
    this.lastAudioUrl = null;

    // Barra de progresso dos Stories
    const bar = document.getElementById('story-progress-bar');
    if (bar) {
      bar.innerHTML = '';
      const visibleSegments = Math.min(total, 10);
      const progressInTen = (clamped % visibleSegments);
      for (let i = 0; i < visibleSegments; i++) {
        const seg = document.createElement('div');
        seg.className = `story-progress-segment ${i === progressInTen ? 'active' : (i < progressInTen ? 'done' : '')}`;
        seg.innerHTML = '<div class="story-progress-fill"></div>';
        bar.appendChild(seg);
      }
    }

    // 1. Perfil e Localização
    document.getElementById('story-avatar').textContent = scene.avatar;
    document.getElementById('profile-name').textContent = scene.speaker_name;
    document.getElementById('profile-location').textContent = scene.location;
    document.getElementById('story-scene-counter').textContent = `CENA #${scene.sceneNumber} / ${total}`;

    // 2. Imagem Vertical com Pré-carregamento Instantâneo
    const bgImg = document.getElementById('story-bg-img');
    if (bgImg) {
      bgImg.src = scene.image;
      bgImg.onerror = () => {
        bgImg.src = '../assets/img/p1_1.png';
      };
    }
    document.getElementById('story-sfx').textContent = scene.sfx;

    // 3. Caixa de Narrador (se houver)
    const captionCard = document.getElementById('story-caption-card');
    if (scene.caption) {
      captionCard.style.display = 'flex';
      document.getElementById('caption-loc-tag').textContent = `CENA ${scene.sceneNumber} —`;
      document.getElementById('caption-text-body').textContent = scene.caption;
    } else {
      captionCard.style.display = 'none';
    }

    // 4. Balão do Personagem
    const bubble = document.getElementById('story-speech-bubble');
    bubble.className = `story-speech-bubble ${scene.speaker === 'ELENA' || scene.speaker === 'AMINA' ? 'elena-theme' : ''}`;
    document.getElementById('bubble-speaker-tag').textContent = scene.speaker;

    // ========================================================================
    // DESTAQUE BIDIRECIONAL INTERATIVO PALAVRA POR PALAVRA (FRANCÊS ⇄ PORTUGUÊS)
    // ========================================================================
    const frContainer = document.getElementById('story-fr-text');
    const ptContainer = document.getElementById('story-pt-text');

    const frWords = scene.dialogue_fr.split(' ');
    const ptWords = scene.dialogue_pt.split(' ');

    frContainer.innerHTML = frWords.map((w, i) => `<span class="story-word" data-fr-idx="${i}">${w}</span>`).join(' ');
    ptContainer.innerHTML = `<span style="font-weight: 800; color: #0284c7; margin-right: 4px;">Trad.:</span>` + 
      ptWords.map((w, j) => `<span class="pt-word" data-pt-idx="${j}">${w}</span>`).join(' ');
    
    ptContainer.style.display = this.showTranslation ? 'block' : 'none';
    document.getElementById('ipa-code').textContent = scene.ipa;

    // Conecta o evento de toque em palavras francesas
    const frSpans = frContainer.querySelectorAll('.story-word');
    const ptSpans = ptContainer.querySelectorAll('.pt-word');

    frSpans.forEach((frSpan, frIdx) => {
      frSpan.onclick = (e) => {
        e.stopPropagation();

        frSpans.forEach(s => s.classList.remove('active-sync'));
        ptSpans.forEach(s => s.classList.remove('active-sync'));

        // Sincronização lexical perfeita bidirecional (trata locuções compostas e contrações)
        const sync = lexicalAligner.syncSelection('fr', frIdx, frWords, ptWords);
        sync.frIndices.forEach(fi => frSpans[fi] && frSpans[fi].classList.add('active-sync'));
        sync.ptIndices.forEach(pi => ptSpans[pi] && ptSpans[pi].classList.add('active-sync'));

        // Pronuncia a palavra em francês com voz neural de estúdio
        naturalVoice.speakWord(frSpan.textContent, scene.speaker);
      };
    });

    // Conecta o evento de toque em palavras em português
    ptSpans.forEach((ptSpan, ptIdx) => {
      ptSpan.onclick = (e) => {
        e.stopPropagation();

        frSpans.forEach(s => s.classList.remove('active-sync'));
        ptSpans.forEach(s => s.classList.remove('active-sync'));

        // Sincronização lexical perfeita bidirecional
        const sync = lexicalAligner.syncSelection('pt', ptIdx, frWords, ptWords);
        sync.frIndices.forEach(fi => frSpans[fi] && frSpans[fi].classList.add('active-sync'));
        sync.ptIndices.forEach(pi => ptSpans[pi] && ptSpans[pi].classList.add('active-sync'));

        if (sync.frIndices.length > 0 && frSpans[sync.frIndices[0]]) {
          naturalVoice.speakWord(frSpans[sync.frIndices[0]].textContent, scene.speaker);
        }
      };
    });

    // Toque no corpo do balão pronuncia a frase completa
    bubble.onclick = (e) => {
      if (!e.target.classList.contains('story-word') && !e.target.classList.contains('pt-word')) {
        frSpans.forEach(s => s.classList.remove('active-sync'));
        ptSpans.forEach(s => s.classList.remove('active-sync'));
        naturalVoice.speak(scene.dialogue_fr, scene.speaker);
      }
    };

    // Reproduz automaticamente a fala em francês daquela cena (com suporte a Passagem de Revista Automática)
    this.pauseAutoPlayTemporarily();

    if (this.isAutoPlay) {
      const readingDuration = Math.max(4500, (scene.dialogue_fr.length * 85) + 1600);

      const activeFill = document.querySelector('.story-progress-segment.active .story-progress-fill');
      if (activeFill) {
        activeFill.style.width = '0%';
        activeFill.style.transition = 'none';
        activeFill.classList.remove('autoplay-progress');
        void activeFill.offsetWidth;
        activeFill.classList.add('autoplay-progress');
        activeFill.style.transition = `width ${readingDuration}ms linear`;
        activeFill.style.width = '100%';
      }

      naturalVoice.speak(scene.dialogue_fr, scene.speaker, 1.0, () => {
        if (!this.isAutoPlay) return;
        this.autoPlayTimer = setTimeout(() => {
          if (this.isAutoPlay) {
            this.nextScene();
          }
        }, 1200);
      });

      const fallbackMs = readingDuration + 1500;
      this.autoPlayFallbackTimer = setTimeout(() => {
        if (this.isAutoPlay) {
          this.nextScene();
        }
      }, fallbackMs);
    } else {
      naturalVoice.speak(scene.dialogue_fr, scene.speaker);
    }
  }

  nextScene() {
    this.pauseAutoPlayTemporarily();
    if (this.currentSceneNumber < massiveEngine.totalTargetScenes) {
      this.loadSceneByIndex(this.currentSceneNumber);
    } else {
      this.loadSceneByIndex(0);
    }
  }

  prevScene() {
    this.pauseAutoPlayTemporarily();
    if (this.currentSceneNumber > 1) {
      this.loadSceneByIndex(this.currentSceneNumber - 2);
    }
  }

  toggleAutoPlay(forceState = null) {
    if (forceState !== null) {
      this.isAutoPlay = forceState;
    } else {
      this.isAutoPlay = !this.isAutoPlay;
    }

    const btnAuto = document.getElementById('btn-toggle-autoplay');
    const icon = document.getElementById('autoplay-icon');
    const label = document.getElementById('autoplay-label');

    if (btnAuto) {
      btnAuto.classList.toggle('active', this.isAutoPlay);
    }
    if (icon) {
      icon.textContent = this.isAutoPlay ? '⏸️' : '▶';
    }
    if (label) {
      label.textContent = this.isAutoPlay ? 'Pausar' : 'Auto';
    }

    if (this.isAutoPlay) {
      this.loadSceneByIndex(this.currentSceneNumber - 1);
    } else {
      this.pauseAutoPlayTemporarily();
    }
  }

  pauseAutoPlayTemporarily() {
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
    if (this.autoPlayFallbackTimer) {
      clearTimeout(this.autoPlayFallbackTimer);
      this.autoPlayFallbackTimer = null;
    }
    const activeFill = document.querySelector('.story-progress-segment.active .story-progress-fill');
    if (activeFill) {
      activeFill.style.transition = 'none';
      activeFill.classList.remove('autoplay-progress');
    }
  }

  setupPullToCloseGestures() {
    // 1. Fechamento do Leitor de Stories puxando para baixo
    const storyViewport = document.getElementById('story-viewport');
    if (storyViewport) {
      this.attachPullDownHandler(storyViewport, null, () => {
        naturalVoice.stop();
        ambientEngine.stopCurrent();
        storyViewport.style.display = 'none';
        document.getElementById('comic-cover-hub').style.display = 'block';
        if (this.isAutoPlay) this.toggleAutoPlay(false);
      });
    }

    // 2. Fechamento da Gaveta de Notícias / Dossier puxando para baixo
    const dossierDrawer = document.querySelector('.dossier-drawer');
    const dossierBackdrop = document.getElementById('dossier-drawer-backdrop');
    if (dossierDrawer) {
      this.attachPullDownHandler(dossierDrawer, dossierBackdrop, () => {
        this.closeDossierDrawer();
      });
    }

    // 3. Fechamento do Modal de Treino de Palavra Individual puxando para baixo
    const drillCard = document.querySelector('.single-word-drill-card');
    const drillBackdrop = document.getElementById('single-word-drill-modal');
    if (drillCard) {
      this.attachPullDownHandler(drillCard, drillBackdrop, () => {
        this.closeSingleWordDrill();
      });
    }

    // 4. Fechamento do Livro Aberto / Catálogo puxando para baixo
    const bookCard = document.querySelector('.book-modal-card');
    const bookBackdrop = document.getElementById('book-catalog-modal');
    if (bookCard) {
      this.attachPullDownHandler(bookCard, bookBackdrop, () => {
        if (bookBackdrop) bookBackdrop.style.display = 'none';
      });
    }

    // 5. Fechamento do Mini-Game puxando para baixo
    const minigameCard = document.querySelector('.minigame-card');
    const minigameBackdrop = document.getElementById('minigame-modal');
    if (minigameCard) {
      this.attachPullDownHandler(minigameCard, minigameBackdrop, () => {
        frenchMiniGame.close();
      });
    }
  }

  attachPullDownHandler(element, backdrop, closeFn) {
    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let isDragging = false;
    let canPull = false;

    element.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      startY = touch.clientY;
      startX = touch.clientX;
      currentY = startY;
      canPull = (element.scrollTop <= 6);
      isDragging = false;
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
      if (!canPull || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const deltaY = touch.clientY - startY;
      const deltaX = touch.clientX - startX;

      if (deltaY > 12 && deltaY > Math.abs(deltaX) * 1.15) {
        isDragging = true;
        if (e.cancelable) e.preventDefault();
        const translateY = Math.max(0, deltaY * 0.72);
        const opacity = Math.max(0.35, 1 - (translateY / 450));
        element.style.transition = 'none';
        element.style.transform = `translateY(${translateY}px)`;
        if (backdrop) {
          backdrop.style.transition = 'none';
          backdrop.style.opacity = `${opacity}`;
        }
      }
    }, { passive: false });

    const finishGesture = (e) => {
      if (!isDragging) return;
      isDragging = false;
      const touch = e.changedTouches ? e.changedTouches[0] : null;
      const deltaY = touch ? (touch.clientY - startY) : (currentY - startY);

      if (deltaY > 100) {
        element.style.transition = 'transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.22s';
        element.style.transform = 'translateY(100vh)';
        element.style.opacity = '0';
        if (backdrop) {
          backdrop.style.transition = 'opacity 0.22s';
          backdrop.style.opacity = '0';
        }
        setTimeout(() => {
          element.style.transform = '';
          element.style.opacity = '';
          element.style.transition = '';
          if (backdrop) {
            backdrop.style.opacity = '';
            backdrop.style.transition = '';
          }
          closeFn();
        }, 220);
      } else {
        element.style.transition = 'transform 0.2s ease-out, opacity 0.2s';
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
        if (backdrop) {
          backdrop.style.transition = 'opacity 0.2s';
          backdrop.style.opacity = '1';
        }
        setTimeout(() => {
          element.style.transform = '';
          element.style.opacity = '';
          element.style.transition = '';
          if (backdrop) {
            backdrop.style.opacity = '';
            backdrop.style.transition = '';
          }
        }, 200);
      }
    };

    element.addEventListener('touchend', finishGesture, { passive: true });
    element.addEventListener('touchcancel', finishGesture, { passive: true });
  }

  setupPageLeaveListener() {
    const handleLeave = () => {
      naturalVoice.stopAllSounds();
      if (this.isAutoPlay) {
        this.toggleAutoPlay(false);
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        handleLeave();
      }
    });

    window.addEventListener('pagehide', handleLeave);
    window.addEventListener('beforeunload', handleLeave);
    window.addEventListener('blur', handleLeave);
  }

  showStoryCheckpoint(sc, continueCallback) {
    const modal = document.getElementById('story-checkpoint-modal');
    if (!modal) {
      if (continueCallback) continueCallback();
      return;
    }

    const titleEl = document.getElementById('chk-title');
    const descEl = document.getElementById('chk-desc');
    const scoreNumEl = document.getElementById('chk-score-num');
    const fillEl = document.getElementById('chk-progress-fill');
    const statusBadge = document.getElementById('chk-status-badge');
    const btnMinigame = document.getElementById('btn-chk-minigame');
    const btnRecord = document.getElementById('btn-chk-record');
    const btnContinue = document.getElementById('btn-chk-continue');
    const btnClose = document.getElementById('btn-close-checkpoint');

    const prog = masteryEngine.getChapterProgress(sc.chapterId);
    const avg = prog.average || 0;

    if (titleEl) titleEl.textContent = `Ponto de Controle : ${sc.speaker_name}`;
    if (scoreNumEl) scoreNumEl.textContent = `${avg}% / 80%`;
    if (fillEl) fillEl.style.width = `${Math.min(100, avg)}%`;

    if (statusBadge) {
      if (avg >= 80) {
        statusBadge.innerHTML = `🎉 <strong>Meta de 80% superada com sucesso!</strong> Seu progresso está excelente para destravar os próximos capítulos!`;
        statusBadge.style.color = '#00f59b';
        statusBadge.style.borderColor = '#00f59b';
      } else {
        statusBadge.innerHTML = `⚡ <strong>Meta atual: ${avg}% / 80%.</strong> Complete o Desafio dos 4 Tempos ou grave seu áudio para garantir o desbloqueio!`;
        statusBadge.style.color = '#ffee32';
        statusBadge.style.borderColor = 'rgba(255, 238, 50, 0.4)';
      }
    }

    if (btnMinigame) {
      btnMinigame.onclick = (e) => {
        e.stopPropagation();
        modal.style.display = 'none';
        frenchMiniGame.show(sc.verb_challenge || sc, () => {
          this.loadSceneByIndex(this.currentSceneNumber);
        }, sc.chapterId);
      };
    }

    if (btnRecord) {
      btnRecord.onclick = (e) => {
        e.stopPropagation();
        modal.style.display = 'none';
        const docRecordBtn = document.getElementById('btn-tiktok-record');
        if (docRecordBtn) docRecordBtn.click();
      };
    }

    if (btnContinue) {
      btnContinue.onclick = (e) => {
        e.stopPropagation();
        modal.style.display = 'none';
        if (continueCallback) continueCallback();
      };
    }

    if (btnClose) {
      btnClose.onclick = (e) => {
        e.stopPropagation();
        modal.style.display = 'none';
      };
    }

    modal.style.display = 'flex';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new MassiveComicApp();
  app.init();
});
