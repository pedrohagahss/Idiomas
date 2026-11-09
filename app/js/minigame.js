/**
 * MÓDULO INTERATIVO DE DESAFIOS & TREINO DE TEMPOS VERBAIS (MINI-GAME)
 * Permite ao aluno treinar conjugação em 4 tempos (Présent, Passé Composé, Imparfait, Futur)
 * com áudio neural nativo para repetição, quiz rápido de fixação e reconstrução de frases.
 */

/**
 * MÓDULO INTERATIVO DE DESAFIOS & TREINO DE TEMPOS VERBAIS (MINI-GAME)
 * Permite ao aluno treinar conjugação em 4 tempos (Présent, Passé Composé, Imparfait, Futur)
 * com áudio neural nativo normal/lento, quiz de fixação, reconstrução de frases e treino oral.
 */

import { naturalVoice } from './audio.js';
import { speechEngine } from './speech.js';
import { masteryEngine } from './progress.js';

export class FrenchMiniGame {
  constructor() {
    this.container = null;
    this.currentChallenge = null;
    this.currentChapterId = null;
    this.assembledWords = [];
    this.originalWords = [];
    this.onCompleteCallback = null;
    this.isRecordingSpeechDrill = false;
  }

  init() {
    if (document.getElementById('french-minigame-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'french-minigame-overlay';
    overlay.className = 'minigame-overlay';
    overlay.style.display = 'none';

    overlay.innerHTML = `
      <div class="minigame-card">
        <header class="minigame-header">
          <div class="minigame-badge">🎮 DÉFI FRANÇAIS • TREINO DE FRANCÊS</div>
          <button class="minigame-close-btn" id="btn-close-minigame" title="Voltar para a História">✕</button>
        </header>

        <div class="minigame-tabs">
          <button class="minigame-tab active" id="tab-verbs">⚡ 4 Tempos Verbais</button>
          <button class="minigame-tab" id="tab-puzzle">🧩 Remonte a Frase</button>
          <button class="minigame-tab" id="tab-speech">🎙️ Treino Oral</button>
        </div>

        <div class="minigame-body">
          <!-- PAINEL 1: CONJUGAÇÃO E REPETIÇÃO DE VERBOS -->
          <div class="minigame-pane active" id="pane-verbs">
            <div class="verb-hero-box">
              <span class="verb-tag">VERBO ESSENCIAL DA CENA</span>
              <h3 class="verb-title" id="minigame-verb-title">PRENDRE</h3>
              <p class="verb-meaning" id="minigame-verb-meaning">Pegar / Tomar / Compreender</p>
            </div>

            <p class="section-instruction">Toque para ouvir em velocidade normal ou lenta e repita:</p>

            <div class="tenses-grid" id="tenses-grid">
              <!-- Gerado dinamicamente com botões 🔊 e 🐢 -->
            </div>

            <div class="verb-quiz-card" id="verb-quiz-card">
              <span class="quiz-badge">DESAFIO RÁPIDO</span>
              <h4 class="quiz-question" id="quiz-question">Como se diz "eu peguei" no Passé Composé?</h4>
              <div class="quiz-options-dock" id="quiz-options-dock">
                <!-- Botões de opção -->
              </div>
              <div class="quiz-feedback" id="quiz-feedback" style="display: none;"></div>
            </div>
          </div>

          <!-- PAINEL 2: RECONSTRUÇÃO DA FRASE DA CENA -->
          <div class="minigame-pane" id="pane-puzzle" style="display: none;">
            <div class="puzzle-header-box">
              <span class="puzzle-tag">MONTAGEM DE FRASE</span>
              <p class="puzzle-instruction">Toque nas palavras na ordem correta para reconstruir a frase dita pelo personagem:</p>
            </div>

            <div class="puzzle-slot-target" id="puzzle-slot-target">
              <span class="puzzle-placeholder" id="puzzle-placeholder">Toque nas palavras abaixo...</span>
            </div>

            <div class="puzzle-pool" id="puzzle-pool">
              <!-- Palavras desordenadas para clicar -->
            </div>

            <div class="puzzle-feedback" id="puzzle-feedback" style="display: none;"></div>
          </div>

          <!-- PAINEL 3: TREINO ORAL & REPETIÇÃO -->
          <div class="minigame-pane" id="pane-speech" style="display: none;">
            <div class="speech-drill-container">
              <div class="verb-hero-box">
                <span class="verb-tag">PRÁTICA ORAL AO VIVO</span>
                <p class="section-instruction">Ouça a frase modelo e treine sua pronúncia com validação instantânea:</p>
              </div>

              <div class="speech-phrase-card">
                <span class="puzzle-tag">FALA DA CENA</span>
                <p class="speech-phrase-target" id="minigame-speech-fr">...</p>
                <p class="speech-phrase-ipa" id="minigame-speech-ipa">[ipa]</p>
                <p class="speech-phrase-pt" id="minigame-speech-pt">Tradução</p>

                <div class="speech-drill-actions">
                  <button class="btn-speech-audio" id="btn-minigame-speech-normal">
                    <span>🔊 Ouvir Normal (1.0x)</span>
                  </button>
                  <button class="btn-speech-audio slow" id="btn-minigame-speech-slow">
                    <span>🐢 Ouvir Lento (0.75x)</span>
                  </button>
                </div>

                <div style="margin-top: 10px;">
                  <button class="btn-speech-mic-record" id="btn-minigame-speech-mic">
                    <span id="minigame-mic-icon">🎙️</span>
                    <span id="minigame-mic-label">Gravar e Validar Fala</span>
                  </button>
                </div>

                <div class="speech-drill-feedback" id="minigame-speech-feedback" style="display: none;"></div>
              </div>
            </div>
          </div>
        </div>

        <footer class="minigame-footer">
          <button class="btn-minigame-continue" id="btn-minigame-continue">
            <span>CONTINUAR A HISTÓRIA ▶</span>
          </button>
        </footer>
      </div>
    `;

    document.body.appendChild(overlay);
    this.container = overlay;
    this.bindEvents();
  }

  bindEvents() {
    const btnClose = document.getElementById('btn-close-minigame');
    const btnContinue = document.getElementById('btn-minigame-continue');
    const tabVerbs = document.getElementById('tab-verbs');
    const tabPuzzle = document.getElementById('tab-puzzle');
    const tabSpeech = document.getElementById('tab-speech');
    const paneVerbs = document.getElementById('pane-verbs');
    const panePuzzle = document.getElementById('pane-puzzle');
    const paneSpeech = document.getElementById('pane-speech');

    if (btnClose) btnClose.onclick = () => this.hide();
    if (btnContinue) {
      btnContinue.onclick = () => {
        this.hide();
        if (this.onCompleteCallback) this.onCompleteCallback();
      };
    }

    const switchTab = (activeTab, activePane) => {
      [tabVerbs, tabPuzzle, tabSpeech].forEach(t => t && t.classList.remove('active'));
      [paneVerbs, panePuzzle, paneSpeech].forEach(p => p && (p.style.display = 'none'));
      if (activeTab) activeTab.classList.add('active');
      if (activePane) activePane.style.display = 'block';
    };

    if (tabVerbs) tabVerbs.onclick = () => switchTab(tabVerbs, paneVerbs);
    if (tabPuzzle) tabPuzzle.onclick = () => switchTab(tabPuzzle, panePuzzle);
    if (tabSpeech) tabSpeech.onclick = () => switchTab(tabSpeech, paneSpeech);

    // Controles do Treino Oral (Aba 3)
    const btnSpeechNormal = document.getElementById('btn-minigame-speech-normal');
    const btnSpeechSlow = document.getElementById('btn-minigame-speech-slow');
    const btnSpeechMic = document.getElementById('btn-minigame-speech-mic');
    const micIcon = document.getElementById('minigame-mic-icon');
    const micLabel = document.getElementById('minigame-mic-label');
    const speechFeedback = document.getElementById('minigame-speech-feedback');

    if (btnSpeechNormal) {
      btnSpeechNormal.onclick = () => {
        const text = document.getElementById('minigame-speech-fr').textContent;
        naturalVoice.speak(text, 'PEDRO', 1.0);
      };
    }

    if (btnSpeechSlow) {
      btnSpeechSlow.onclick = () => {
        const text = document.getElementById('minigame-speech-fr').textContent;
        naturalVoice.speak(text, 'PEDRO', 0.75);
      };
    }

    if (btnSpeechMic) {
      btnSpeechMic.onclick = async () => {
        const targetText = document.getElementById('minigame-speech-fr').textContent;
        if (!targetText) return;

        if (this.isRecordingSpeechDrill) {
          this.isRecordingSpeechDrill = false;
          btnSpeechMic.classList.remove('recording');
          if (micIcon) micIcon.textContent = '🎙️';
          if (micLabel) micLabel.textContent = 'Gravar e Validar Fala';

          const res = await speechEngine.stopRecording(targetText);
          if (res && res.evaluation && speechFeedback) {
            speechFeedback.style.display = 'block';
            if (res.evaluation.score >= 70) {
              speechFeedback.className = 'speech-drill-feedback success';
              speechFeedback.innerHTML = `🎉 <strong>MUITO BEM! Pontuação: ${res.evaluation.score}%</strong> (${res.evaluation.gradeTitle})<br>${res.evaluation.commentary}`;
              if (this.currentChapterId) {
                masteryEngine.recordAudioScore(this.currentChapterId, res.evaluation.score);
              }
            } else {
              speechFeedback.className = 'speech-drill-feedback retry';
              speechFeedback.innerHTML = `⚡ <strong>Pontuação: ${res.evaluation.score}%</strong>. Tente novamente articulando com calma cada palavra.`;
            }
          }
        } else {
          this.isRecordingSpeechDrill = true;
          btnSpeechMic.classList.add('recording');
          if (micIcon) micIcon.textContent = '⏹️';
          if (micLabel) micLabel.textContent = 'Parar e Avaliar';
          if (speechFeedback) speechFeedback.style.display = 'none';
          await speechEngine.startRecording();
        }
      };
    }
  }

  show(challengeData, onComplete = null, chapterId = null) {
    this.init();
    this.currentChallenge = challengeData;
    this.currentChapterId = chapterId || (challengeData ? challengeData.chapterId : null);
    this.onCompleteCallback = onComplete;
    this.renderVerbs(challengeData.verb_challenge);
    this.renderPuzzle(challengeData.sentence_puzzle || challengeData.dialogue_fr);
    this.renderSpeechDrill(challengeData);
    this.container.style.display = 'flex';
  }

  renderSpeechDrill(data) {
    const frEl = document.getElementById('minigame-speech-fr');
    const ipaEl = document.getElementById('minigame-speech-ipa');
    const ptEl = document.getElementById('minigame-speech-pt');
    const feedback = document.getElementById('minigame-speech-feedback');

    const frText = data.dialogue_fr || (data.sentence_puzzle ? data.sentence_puzzle.sentence_fr : '');
    const ptText = data.dialogue_pt || '';
    const ipaText = data.ipa || '';

    if (frEl) frEl.textContent = frText;
    if (ipaEl) ipaEl.textContent = ipaText;
    if (ptEl) ptEl.textContent = ptText;
    if (feedback) feedback.style.display = 'none';
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
    naturalVoice.stop();
  }

  renderVerbs(verbData) {
    if (!verbData) return;

    const titleEl = document.getElementById('minigame-verb-title');
    const meaningEl = document.getElementById('minigame-verb-meaning');
    const gridEl = document.getElementById('tenses-grid');

    if (titleEl) titleEl.textContent = verbData.verb;
    if (meaningEl) meaningEl.textContent = verbData.verb_pt;

    if (gridEl) {
      gridEl.innerHTML = '';
      const tenses = [
        { key: 'present', label: 'Présent (Presente)', data: verbData.tenses.present },
        { key: 'passe_compose', label: 'Passé Composé (Passado Pontual)', data: verbData.tenses.passe_compose },
        { key: 'imparfait', label: 'Imparfait (Passado Contínuo)', data: verbData.tenses.imparfait },
        { key: 'futur_simple', label: 'Futur Simple (Futuro)', data: verbData.tenses.futur_simple }
      ];

      tenses.forEach(t => {
        const row = document.createElement('div');
        row.className = 'tense-card-row';
        row.innerHTML = `
          <div class="tense-info">
            <span class="tense-name">${t.label}</span>
            <span class="tense-fr">${t.data.fr}</span>
            <span class="tense-pt">${t.data.pt}</span>
          </div>
          <div class="tense-actions">
            <button class="btn-tense-audio" title="Ouvir normal (1.0x)">
              <span>🔊</span>
            </button>
            <button class="btn-tense-audio slow" title="Ouvir lento (0.75x)">
              <span>🐢</span>
            </button>
          </div>
        `;

        const btnAudioNormal = row.querySelector('.btn-tense-audio:not(.slow)');
        const btnAudioSlow = row.querySelector('.btn-tense-audio.slow');

        btnAudioNormal.onclick = (e) => {
          e.stopPropagation();
          row.classList.add('playing');
          naturalVoice.speak(t.data.fr, 'PEDRO', 1.0);
          setTimeout(() => row.classList.remove('playing'), 1500);
        };

        btnAudioSlow.onclick = (e) => {
          e.stopPropagation();
          row.classList.add('playing');
          naturalVoice.speakSlow(t.data.fr, 'PEDRO');
          setTimeout(() => row.classList.remove('playing'), 1800);
        };

        row.onclick = () => btnAudioNormal.click();
        gridEl.appendChild(row);
      });
    }

    // Render Quiz
    this.renderQuiz(verbData.quiz);
  }

  renderQuiz(quiz) {
    const quizCard = document.getElementById('verb-quiz-card');
    const qEl = document.getElementById('quiz-question');
    const dockEl = document.getElementById('quiz-options-dock');
    const feedbackEl = document.getElementById('quiz-feedback');

    if (!quiz) {
      if (quizCard) quizCard.style.display = 'none';
      return;
    }

    if (quizCard) quizCard.style.display = 'block';
    if (qEl) qEl.textContent = quiz.question_fr;
    if (feedbackEl) {
      feedbackEl.style.display = 'none';
      feedbackEl.className = 'quiz-feedback';
    }

    if (dockEl) {
      dockEl.innerHTML = '';
      quiz.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn-quiz-opt';
        btn.textContent = opt;

        btn.onclick = () => {
          const isCorrect = idx === quiz.correctIndex;
          const allBtns = dockEl.querySelectorAll('.btn-quiz-opt');
          allBtns.forEach(b => b.disabled = true);

          if (isCorrect) {
            btn.classList.add('correct');
            feedbackEl.className = 'quiz-feedback success';
            feedbackEl.innerHTML = `✨ <strong>EXCELENTE!</strong> ${quiz.explanation || 'Resposta correta!'} (+100% no Quiz)`;
            feedbackEl.style.display = 'block';
            naturalVoice.speak(opt, 'PEDRO');
            if (this.currentChapterId) {
              masteryEngine.recordQuizScore(this.currentChapterId, 100);
            }
          } else {
            btn.classList.add('wrong');
            if (allBtns[quiz.correctIndex]) allBtns[quiz.correctIndex].classList.add('correct');
            feedbackEl.className = 'quiz-feedback error';
            feedbackEl.innerHTML = `⚠️ <strong>Quase lá!</strong> A resposta certa é: <em>${quiz.options[quiz.correctIndex]}</em>. ${quiz.explanation || ''}`;
            feedbackEl.style.display = 'block';
          }
        };

        dockEl.appendChild(btn);
      });
    }
  }

  renderPuzzle(sentenceOrPuzzle) {
    let sentence = '';
    let scrambled = [];

    if (typeof sentenceOrPuzzle === 'string') {
      sentence = sentenceOrPuzzle;
      scrambled = sentence.split(/\s+/).sort(() => Math.random() - 0.5);
    } else if (sentenceOrPuzzle && sentenceOrPuzzle.sentence_fr) {
      sentence = sentenceOrPuzzle.sentence_fr;
      scrambled = (sentenceOrPuzzle.words_scrambled || sentence.split(/\s+/)).slice();
    }

    this.originalWords = sentence.split(/\s+/);
    this.assembledWords = [];

    const slotTarget = document.getElementById('puzzle-slot-target');
    const pool = document.getElementById('puzzle-pool');
    const feedbackEl = document.getElementById('puzzle-feedback');

    if (feedbackEl) feedbackEl.style.display = 'none';

    this.updatePuzzleUI(scrambled, pool, slotTarget, sentence, feedbackEl);
  }

  updatePuzzleUI(remainingWords, pool, slotTarget, fullSentence, feedbackEl) {
    if (!slotTarget || !pool) return;

    // Atualiza slots montados
    slotTarget.innerHTML = '';
    if (this.assembledWords.length === 0) {
      slotTarget.innerHTML = `<span class="puzzle-placeholder">Toque nas palavras abaixo na ordem certa...</span>`;
    } else {
      this.assembledWords.forEach((word, idx) => {
        const tag = document.createElement('span');
        tag.className = 'puzzle-tag-item placed';
        tag.textContent = word;
        tag.title = 'Toque para remover';
        tag.onclick = () => {
          this.assembledWords.splice(idx, 1);
          remainingWords.push(word);
          this.updatePuzzleUI(remainingWords, pool, slotTarget, fullSentence, feedbackEl);
        };
        slotTarget.appendChild(tag);
      });
    }

    // Atualiza pool de palavras restantes
    pool.innerHTML = '';
    remainingWords.forEach((word, idx) => {
      const btn = document.createElement('button');
      btn.className = 'puzzle-word-btn';
      btn.textContent = word;
      btn.onclick = () => {
        remainingWords.splice(idx, 1);
        this.assembledWords.push(word);
        this.updatePuzzleUI(remainingWords, pool, slotTarget, fullSentence, feedbackEl);

        // Se colocou todas as palavras, valida
        if (remainingWords.length === 0) {
          const constructed = this.assembledWords.join(' ');
          const cleanConstructed = constructed.replace(/[.,/#!$%^&*;:{}=\-_`~()«»?"']/g, '').trim().toLowerCase();
          const cleanOriginal = fullSentence.replace(/[.,/#!$%^&*;:{}=\-_`~()«»?"']/g, '').trim().toLowerCase();

          if (cleanConstructed === cleanOriginal) {
            feedbackEl.className = 'puzzle-feedback success';
            feedbackEl.innerHTML = `🎉 <strong>PARABÉNS!</strong> Frase perfeitamente montada! (+100% no Desafio)`;
            feedbackEl.style.display = 'block';
            naturalVoice.speak(fullSentence, 'PEDRO');
            if (this.currentChapterId) {
              masteryEngine.recordPuzzleScore(this.currentChapterId, 100);
            }
          } else {
            feedbackEl.className = 'puzzle-feedback error';
            feedbackEl.innerHTML = `⚠️ A ordem ainda não está exata. Tente reorganizar tocando nas palavras para retirá-las.`;
            feedbackEl.style.display = 'block';
          }
        }
      };
      pool.appendChild(btn);
    });
  }
}

export const frenchMiniGame = new FrenchMiniGame();
