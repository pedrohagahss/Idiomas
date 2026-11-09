/**
 * Motor de Interação Narrativa de HQ (Decisões e Fixação)
 */

import { progress } from './progress.js';

export class QuizManager {
  constructor() {
    this.currentPanel = null;
    this.answered = false;
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  renderPanelQuiz(panel, containerEl, questionEl, feedbackEl) {
    this.currentPanel = panel;
    this.answered = false;
    const quiz = panel.interactive_quiz;

    if (!quiz) {
      containerEl.innerHTML = '';
      questionEl.textContent = 'Continuez la lecture de la bande dessinée.';
      feedbackEl.style.display = 'none';
      return;
    }

    feedbackEl.style.display = 'none';
    feedbackEl.textContent = '';
    feedbackEl.className = 'decision-feedback';

    questionEl.textContent = quiz.sentence_masked || 'Choisissez la bonne réplique :';

    const options = this.shuffle([quiz.correct_answer, ...quiz.distractors]);
    containerEl.innerHTML = '';

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'btn-comic-choice';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.handleAnswer(opt, quiz, btn, containerEl, feedbackEl));
      containerEl.appendChild(btn);
    });
  }

  handleAnswer(selected, quiz, clickedBtn, containerEl, feedbackEl) {
    if (this.answered) return;
    this.answered = true;

    const isCorrect = selected === quiz.correct_answer;
    const allButtons = containerEl.querySelectorAll('.btn-comic-choice');

    allButtons.forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === quiz.correct_answer) {
        btn.classList.add('correct');
      } else if (btn === clickedBtn && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    feedbackEl.style.display = 'block';
    if (isCorrect) {
      feedbackEl.innerHTML = `<strong>⚡ PARFAIT !</strong> ${quiz.explanation_pt || 'Réplique exacte !'}`;
      progress.markQuizPassed(this.currentPanel.panel_id);
    } else {
      feedbackEl.innerHTML = `<strong>⚠️ ATTENTION :</strong> La bonne forme est <em>"${quiz.correct_answer}"</em>. ${quiz.explanation_pt || ''}`;
    }
  }

  renderModalExercises(exercises, containerEl) {
    if (!exercises || !exercises.length) {
      containerEl.innerHTML = '<p>Aucun défi supplémentaire pour ce numéro.</p>';
      return;
    }

    containerEl.innerHTML = '';

    exercises.forEach((ex, idx) => {
      const card = document.createElement('div');
      card.style.marginBottom = '18px';
      card.style.padding = '14px';
      card.style.border = '3px solid #000';
      card.style.boxShadow = '3px 3px 0px #000';
      card.style.borderRadius = '8px';
      card.style.background = '#1f2937';

      const title = document.createElement('h3');
      title.style.color = '#ffee32';
      title.style.fontFamily = "'Bangers', cursive";
      title.style.fontSize = '1.25rem';
      title.style.marginBottom = '6px';
      title.textContent = `DÉFI #${idx + 1} — ${ex.instruction_pt || ex.instruction_fr}`;
      card.appendChild(title);

      if (ex.type === 'audio_recording') {
        const p = document.createElement('p');
        p.style.fontStyle = 'italic';
        p.style.marginBottom = '8px';
        p.textContent = `Script à prononcer : « ${ex.script_fr} »`;
        card.appendChild(p);
      } else if (ex.items) {
        ex.items.forEach((item, itemIdx) => {
          const itemDiv = document.createElement('div');
          itemDiv.style.margin = '10px 0';

          const prompt = document.createElement('div');
          prompt.textContent = `${itemIdx + 1}. ${item.prompt}`;
          prompt.style.fontWeight = 'bold';
          itemDiv.appendChild(prompt);

          if (item.options) {
            const optGroup = document.createElement('div');
            optGroup.style.display = 'flex';
            optGroup.style.gap = '8px';
            optGroup.style.marginTop = '6px';
            optGroup.style.flexWrap = 'wrap';

            item.options.forEach(opt => {
              const optBtn = document.createElement('button');
              optBtn.className = 'btn-comic-choice';
              optBtn.style.padding = '6px 12px';
              optBtn.textContent = opt;
              optBtn.onclick = () => {
                optGroup.querySelectorAll('button').forEach(b => b.disabled = true);
                if (opt === item.answer) {
                  optBtn.classList.add('correct');
                  progress.addXP(5, 'Défi bonus');
                } else {
                  optBtn.classList.add('wrong');
                }
              };
              optGroup.appendChild(optBtn);
            });
            itemDiv.appendChild(optGroup);
          } else {
            const revealBtn = document.createElement('button');
            revealBtn.className = 'comm-btn mode';
            revealBtn.textContent = 'Voir la solution';
            revealBtn.style.marginTop = '6px';
            const ansSpan = document.createElement('span');
            ansSpan.style.display = 'none';
            ansSpan.style.marginLeft = '10px';
            ansSpan.style.color = '#00f59b';
            ansSpan.style.fontWeight = 'bold';
            ansSpan.textContent = `Solution : ${item.answer} ${item.explanation_pt ? `(${item.explanation_pt})` : ''}`;

            revealBtn.onclick = () => {
              ansSpan.style.display = 'inline';
              revealBtn.disabled = true;
            };

            itemDiv.appendChild(revealBtn);
            itemDiv.appendChild(ansSpan);
          }

          card.appendChild(itemDiv);
        });
      }

      containerEl.appendChild(card);
    });
  }
}

export const quizManager = new QuizManager();
