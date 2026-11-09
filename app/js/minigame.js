/**
 * MÓDULO INTERATIVO DE DESAFIOS & TREINO DE TEMPOS VERBAIS (MINI-GAME)
 * Permite ao aluno treinar conjugação em 4 tempos (Présent, Passé Composé, Imparfait, Futur)
 * com áudio neural nativo para repetição, quiz rápido de fixação e reconstrução de frases.
 */

import { naturalVoice } from './audio.js';
import { masteryEngine } from './progress.js';

export class FrenchMiniGame {
  constructor() {
    this.container = null;
    this.currentChallenge = null;
    this.currentChapterId = null;
    this.assembledWords = [];
    this.originalWords = [];
    this.onCompleteCallback = null;
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
        </div>

        <div class="minigame-body">
          <!-- PAINEL 1: CONJUGAÇÃO E REPETIÇÃO DE VERBOS -->
          <div class="minigame-pane active" id="pane-verbs">
            <div class="verb-hero-box">
              <span class="verb-tag">VERBO ESSENCIAL DA CENA</span>
              <h3 class="verb-title" id="minigame-verb-title">PRENDRE</h3>
              <p class="verb-meaning" id="minigame-verb-meaning">Pegar / Tomar / Compreender</p>
            </div>

            <p class="section-instruction">Toque para ouvir e repita em voz alta:</p>

            <div class="tenses-grid" id="tenses-grid">
              <!-- Gerado dinamicamente -->
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
    const paneVerbs = document.getElementById('pane-verbs');
    const panePuzzle = document.getElementById('pane-puzzle');

    if (btnClose) btnClose.onclick = () => this.hide();
    if (btnContinue) {
      btnContinue.onclick = () => {
        this.hide();
        if (this.onCompleteCallback) this.onCompleteCallback();
      };
    }

    if (tabVerbs && tabPuzzle) {
      tabVerbs.onclick = () => {
        tabVerbs.classList.add('active');
        tabPuzzle.classList.remove('active');
        paneVerbs.style.display = 'block';
        panePuzzle.style.display = 'none';
      };
      tabPuzzle.onclick = () => {
        tabPuzzle.classList.add('active');
        tabVerbs.classList.remove('active');
        paneVerbs.style.display = 'none';
        panePuzzle.style.display = 'block';
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
    this.container.style.display = 'flex';
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
          <button class="btn-tense-audio" title="Ouvir pronúncia neural">
            <span>🔊</span>
          </button>
        `;

        const btnAudio = row.querySelector('.btn-tense-audio');
        btnAudio.onclick = (e) => {
          e.stopPropagation();
          row.classList.add('playing');
          naturalVoice.speak(t.data.fr, 'PEDRO');
          setTimeout(() => row.classList.remove('playing'), 1500);
        };

        row.onclick = () => btnAudio.click();
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
