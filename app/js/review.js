/**
 * RÉVISION — sessão de flashcards (interface)
 * Frente (pista) → o aluno fala de memória → vira o cartão → marca Errei/Difícil/Bom/Fácil.
 * O microfone só SUGERE a marcação; quem decide é o aluno. A sessão sempre pode ser pulada.
 */

import { massiveEngine } from './story_engine.js';
import { naturalVoice } from './audio.js';
import { speechEngine } from './speech.js';
import { ambientEngine } from './ambient.js';
import { masteryEngine } from './progress.js';
import { buildChapterCards, pickSession, suggestRating, dayNumber, INTERVALS } from './flashcards.js';

const TYPE_INFO = {
  recall: { badge: '🧠 LEMBRAR', ask: 'Como se diz em francês?' },
  cloze: { badge: '🧩 LACUNA', ask: 'Fale a frase completa, com a palavra que falta.' },
  listen: { badge: '👂 OUVIR', ask: 'Ouça e repita o que entendeu.' },
  verb: { badge: '⚡ VERBO', ask: 'Como se diz em francês?' }
};
const RATING_LABEL = { again: 'Errei', hard: 'Difícil', good: 'Bom', easy: 'Fácil' };

const esc = (t) => String(t || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export class ReviewSession {
  constructor() {
    this.el = null;
    this.queue = [];
    this.index = 0;
    this.done = 0;
    this.stats = { again: 0, hard: 0, good: 0, easy: 0 };
    this.retried = new Set();
    this.onClose = null;
    this.result = null;
    this.flipped = false;
    this.decks = null;
  }

  // ---------- Baralhos ----------
  chapterDeck(workId, chapterId) {
    const work = massiveEngine.getWork(workId);
    const chapter = work && work.chapters.find(c => c.id === chapterId);
    return chapter ? buildChapterCards(workId, chapter, massiveEngine.getVerbChallenge(chapterId)) : [];
  }

  /** Cartões de todos os capítulos em que o aluno já viu ao menos uma cena. */
  readDecks() {
    const cards = [];
    massiveEngine.works.forEach(work => {
      const seen = (masteryEngine.data.works[work.id] || {}).seen || {};
      let start = 0;
      work.chapters.forEach(ch => {
        const count = ch.scenes ? ch.scenes.length : 0;
        let read = false;
        for (let i = start; i < start + count; i++) if (seen[i]) { read = true; break; }
        start += count;
        if (read) cards.push(...buildChapterCards(work.id, ch, massiveEngine.getVerbChallenge(ch.id)));
      });
    });
    return cards;
  }

  dailyCards() {
    return pickSession(this.readDecks(), masteryEngine.getCardStates(), dayNumber(), { limit: 15, newLimit: 6 });
  }

  /** Cartões da revisão de fim de capítulo: os vencidos ou novos entre os 8 primeiros do baralho. */
  chapterCards(workId, chapterId) {
    const lead = this.chapterDeck(workId, chapterId).slice(0, 8);
    return pickSession(lead, masteryEngine.getCardStates(), dayNumber(), { limit: 8, newLimit: 8 });
  }

  // ---------- Sessão ----------
  ensureDom() {
    if (this.el) return;
    const el = document.createElement('div');
    el.id = 'review-overlay';
    el.className = 'review-overlay';
    el.style.display = 'none';
    el.innerHTML = `
      <div class="review-shell">
        <header class="review-header">
          <span class="review-title" id="review-title">RÉVISION</span>
          <span class="review-count" id="review-count"></span>
          <button class="review-skip" id="review-skip">Pular ✕</button>
        </header>
        <div class="review-progress"><div class="review-progress-fill" id="review-progress-fill"></div></div>
        <div class="review-body" id="review-body"></div>
      </div>`;
    document.body.appendChild(el);
    this.el = el;
    el.querySelector('#review-skip').onclick = () => this.close();
  }

  /**
   * @param {object} opts {cards, title, continueLabel, onClose}
   * @returns {boolean} false se não havia cartões (nada é mostrado)
   */
  open({ cards, title, continueLabel, onClose }) {
    if (!cards || !cards.length) return false;
    this.ensureDom();
    this.queue = cards.slice();
    this.index = 0;
    this.done = 0;
    this.stats = { again: 0, hard: 0, good: 0, easy: 0 };
    this.retried = new Set();
    this.onClose = onClose || null;
    this.continueLabel = continueLabel || 'Concluir';
    this.el.querySelector('#review-title').textContent = title || 'RÉVISION';
    naturalVoice.stop();
    this.el.style.display = 'flex';
    this.renderFront();
    return true;
  }

  async close() {
    if (speechEngine.isRecording) {
      await speechEngine.stopRecording();
      ambientEngine.resumeAfterRecording();
    }
    naturalVoice.stop();
    if (this.el) this.el.style.display = 'none';
    const cb = this.onClose;
    this.onClose = null;
    if (cb) cb();
  }

  card() { return this.queue[this.index]; }

  updateHeader() {
    const total = this.queue.length;
    this.el.querySelector('#review-count').textContent = `${Math.min(this.index + 1, total)} / ${total}`;
    this.el.querySelector('#review-progress-fill').style.width = `${Math.round(100 * this.index / total)}%`;
  }

  playAnswer(slow = false) {
    const c = this.card();
    if (c) naturalVoice.speak(c.fullFr, c.speaker, slow ? 0.75 : 1.0);
  }

  renderFront() {
    const c = this.card();
    if (!c) return this.renderSummary();
    this.flipped = false;
    this.result = null;
    this.updateHeader();
    const info = TYPE_INFO[c.type];
    const body = this.el.querySelector('#review-body');

    let prompt;
    if (c.type === 'listen') {
      prompt = `<button class="review-big-audio" id="review-play">🔊 Ouvir a frase</button>
                <button class="review-link" id="review-play-slow">🐢 mais devagar</button>`;
    } else if (c.type === 'cloze') {
      prompt = `<p class="review-prompt fr">${esc(c.prompt)}</p><p class="review-hint">${esc(c.hint)}</p>`;
    } else if (c.type === 'verb') {
      prompt = `<p class="review-verb-tag">${esc(c.verb)} · ${esc(c.tense)}</p><p class="review-prompt">${esc(c.prompt)}</p>`;
    } else {
      prompt = `<p class="review-prompt">${esc(c.prompt)}</p>`;
    }

    body.innerHTML = `
      <div class="review-card front">
        ${c.image && c.type !== 'verb' ? `<img class="review-thumb" src="${esc(c.image)}" alt="">` : ''}
        <span class="review-badge">${info.badge}</span>
        <p class="review-ask">${info.ask}</p>
        ${prompt}
        <p class="review-status" id="review-status"></p>
      </div>
      <div class="review-actions">
        <button class="review-btn mic" id="review-mic">🎙️ Falar a resposta</button>
        <button class="review-btn flip" id="review-flip">Virar o cartão ↻</button>
      </div>`;

    const mic = body.querySelector('#review-mic');
    mic.onclick = () => (speechEngine.isRecording ? this.finishSpeaking() : this.startSpeaking());
    body.querySelector('#review-flip').onclick = async () => {
      if (speechEngine.isRecording) await this.finishSpeaking();
      else this.renderBack();
    };
    if (c.type === 'listen') {
      body.querySelector('#review-play').onclick = () => this.playAnswer(false);
      body.querySelector('#review-play-slow').onclick = () => this.playAnswer(true);
      this.playAnswer(false);
    }
  }

  async startSpeaking() {
    const c = this.card();
    const mic = this.el.querySelector('#review-mic');
    const status = this.el.querySelector('#review-status');
    naturalVoice.stop();
    ambientEngine.pauseForRecording();
    mic.classList.add('recording');
    mic.textContent = '⏹️ Ouvindo… (para sozinho)';
    if (status) status.textContent = '';
    const ok = await speechEngine.startRecording({
      targetText: c.answer,
      onAutoStop: () => this.finishSpeaking(),
      onLevel: (l) => mic.style.setProperty('--mic-level', l.toFixed(2))
    });
    if (!ok) {
      ambientEngine.resumeAfterRecording();
      mic.classList.remove('recording');
      mic.textContent = '🎙️ Falar a resposta';
      if (status) status.textContent = 'Não consegui abrir o microfone. Você pode virar o cartão e marcar sozinho.';
    }
  }

  async finishSpeaking() {
    if (!speechEngine.isRecording) return;
    const c = this.card();
    const res = await speechEngine.stopRecording(c.answer);
    ambientEngine.resumeAfterRecording();
    if (c !== this.card() || this.el.style.display === 'none') return;
    this.result = res;
    this.renderBack();
  }

  renderBack() {
    const c = this.card();
    if (!c) return;
    this.flipped = true;
    const res = this.result;
    const ev = res && res.evaluation;
    const body = this.el.querySelector('#review-body');
    const suggested = ev ? suggestRating(ev.score) : null;
    const state = masteryEngine.getCardStates()[c.id];
    const box = state ? state.box : 0;

    const words = c.answer.split(' ').map((w, i) => {
      const wf = ev && ev.wordFeedback[i];
      const cls = !wf || wf.status === 'skip' ? '' : (wf.correct ? 'ok' : 'miss');
      return `<span class="review-word ${cls}">${esc(w)}</span>`;
    }).join(' ');

    let spoken = '';
    if (ev) {
      spoken = `<p class="review-score ${ev.badgeClass}">${ev.score}% · ${esc(ev.gradeTitle)}</p>
                <p class="review-heard">Entendi: « ${esc(res.transcript)} »</p>`;
    } else if (res) {
      spoken = `<p class="review-heard">${esc(speechEngine.describeReason(res.reason, !!res.audioUrl))}</p>`;
    }

    const nextDays = (r) => {
      const b = r === 'again' ? 1 : r === 'hard' ? Math.max(1, box) : r === 'easy' ? Math.min(5, box + 2) : Math.min(5, box + 1);
      return INTERVALS[b];
    };
    const buttons = ['again', 'hard', 'good', 'easy'].map(r => `
      <button class="review-rate ${r} ${suggested === r ? 'suggested' : ''}" data-rating="${r}">
        <strong>${RATING_LABEL[r]}</strong><small>${r === 'again' ? 'repete já' : `${nextDays(r)} d`}</small>
      </button>`).join('');

    body.innerHTML = `
      <div class="review-card back">
        <span class="review-badge">RESPOSTA</span>
        <p class="review-answer">${words}</p>
        ${c.whole && c.ipa ? `<p class="review-ipa">${esc(c.ipa)}</p>` : ''}
        <p class="review-hint">${esc(c.hint)}</p>
        ${!c.whole ? `<p class="review-context">Na cena: ${esc(c.fullFr)}</p>` : ''}
        ${spoken}
        <div class="review-listen-row">
          <button class="review-link" id="review-play">🔊 Ouvir${c.whole ? '' : ' a frase inteira'}</button>
          <button class="review-link" id="review-play-slow">🐢 Devagar</button>
          ${res && res.audioUrl ? '<button class="review-link" id="review-mine">▶ Minha voz</button>' : ''}
        </div>
      </div>
      <p class="review-rate-title">${suggested ? 'Sugestão do microfone em destaque — você decide:' : 'Como foi?'}</p>
      <div class="review-rate-row">${buttons}</div>`;

    body.querySelector('#review-play').onclick = () => this.playAnswer(false);
    body.querySelector('#review-play-slow').onclick = () => this.playAnswer(true);
    const mine = body.querySelector('#review-mine');
    if (mine) mine.onclick = () => { naturalVoice.stop(); new Audio(res.audioUrl).play().catch(() => {}); };
    body.querySelectorAll('.review-rate').forEach(btn => {
      btn.onclick = () => this.rate(btn.getAttribute('data-rating'));
    });
    if (ev) naturalVoice.chime(ev.score >= 75);
  }

  rate(rating) {
    const c = this.card();
    if (!c) return;
    naturalVoice.stop();
    if (this.retried.has(c.id)) {
      // Segunda passada de um cartão errado: é só treino, a marcação "Errei" de hoje continua valendo
      this.done++;
    } else {
      masteryEngine.rateCard(c.id, rating);
      this.stats[rating]++;
      if (rating === 'again') {
        this.retried.add(c.id);
        this.queue.push(c);
      } else {
        this.done++;
      }
    }
    this.index++;
    this.renderFront();
  }

  renderSummary() {
    this.el.querySelector('#review-count').textContent = '✓';
    this.el.querySelector('#review-progress-fill').style.width = '100%';
    const s = this.stats;
    const body = this.el.querySelector('#review-body');
    body.innerHTML = `
      <div class="review-card summary">
        <span class="review-badge">🎉 RÉVISION TERMINÉE</span>
        <p class="review-prompt">${this.done} cartão(ões) revisado(s)</p>
        <p class="review-hint">Fácil ${s.easy} · Bom ${s.good} · Difícil ${s.hard} · Errei ${s.again}</p>
        <p class="review-hint">Eles voltam sozinhos na "Revisão do dia" quando chegar a hora.</p>
      </div>
      <div class="review-actions">
        <button class="review-btn flip" id="review-finish">${esc(this.continueLabel)}</button>
      </div>`;
    body.querySelector('#review-finish').onclick = () => this.close();
    naturalVoice.chime(true);
  }
}

export const reviewSession = new ReviewSession();
