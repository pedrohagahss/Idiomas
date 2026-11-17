/**
 * PROGRESSO DO ALUNO (persistente)
 * - Notas por capítulo (áudio, quiz, montagem) e média — API antiga mantida.
 * - Posição de leitura por obra + última obra aberta ("Continuar de onde parei").
 * - Cenas vistas e melhor nota de pronúncia por cena.
 * - Preferências (tradução ligada/desligada).
 * - Código de backup para levar o progresso a outro aparelho/navegador.
 * Gravado em localStorage a cada mudança; pede armazenamento persistente ao navegador.
 */

import { schedule, dayNumber } from './flashcards.js';

const KEY = 'pedro_hagah_progress_v2';
const LEGACY_KEY = 'pedro_hagah_mastery_progress_v1';

function emptyData() {
  return { v: 2, chapters: {}, works: {}, cards: {}, offered: {}, last: null, settings: {}, updatedAt: 0 };
}

export class MasteryProgressEngine {
  constructor() {
    this.STORAGE_KEY = KEY;
    this.TARGET_PASSING_GRADE = 80;
    this.storageOk = true;
    this.data = this.load();
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }

  load() {
    const data = emptyData();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return this.normalize(JSON.parse(raw));
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const old = JSON.parse(legacy);
        if (old && old.chapters) data.chapters = old.chapters;
      }
    } catch (_) {
      this.storageOk = false;
    }
    return data;
  }

  normalize(d) {
    const base = emptyData();
    if (!d || typeof d !== 'object') return base;
    return {
      v: 2,
      chapters: d.chapters && typeof d.chapters === 'object' ? d.chapters : {},
      works: d.works && typeof d.works === 'object' ? d.works : {},
      cards: d.cards && typeof d.cards === 'object' ? d.cards : {},
      offered: d.offered && typeof d.offered === 'object' ? d.offered : {},
      last: d.last && d.last.workId ? d.last : null,
      settings: d.settings && typeof d.settings === 'object' ? d.settings : {},
      updatedAt: d.updatedAt || 0
    };
  }

  save() {
    this.data.updatedAt = Date.now();
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
      this.storageOk = true;
    } catch (_) {
      this.storageOk = false;
    }
  }

  // ---------- Capítulos (API antiga) ----------
  getChapterProgress(chapterId) {
    if (!this.data.chapters[chapterId]) {
      this.data.chapters[chapterId] = { unlocked: true, average: 0, audioScore: 0, quizScore: 0, puzzleScore: 0 };
    }
    return this.data.chapters[chapterId];
  }

  isChapterUnlocked() { return true; }

  recordScore(chapterId, field, score) {
    if (!chapterId) return null;
    const prog = this.getChapterProgress(chapterId);
    prog[field] = Math.max(prog[field] || 0, Math.round(score));
    this.recalculateAverage(chapterId);
    return prog;
  }
  recordAudioScore(chapterId, score) { return this.recordScore(chapterId, 'audioScore', score); }
  recordQuizScore(chapterId, score) { return this.recordScore(chapterId, 'quizScore', score); }
  recordPuzzleScore(chapterId, score) { return this.recordScore(chapterId, 'puzzleScore', score); }

  recalculateAverage(chapterId) {
    const prog = this.getChapterProgress(chapterId);
    const scores = [prog.audioScore, prog.quizScore, prog.puzzleScore].filter(s => s > 0);
    prog.average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    this.save();
    return prog.average;
  }

  evaluateChapterUnlock(currentChapterId) {
    const prog = this.getChapterProgress(currentChapterId);
    const passed = prog.average >= this.TARGET_PASSING_GRADE || prog.audioScore >= this.TARGET_PASSING_GRADE;
    return { passed, average: prog.average, target: this.TARGET_PASSING_GRADE, justUnlocked: false, currentProg: prog };
  }

  markQuizPassed(panelId) { this.recordQuizScore(panelId, 100); }
  addXP() {}

  // ---------- Posição de leitura e cenas ----------
  getWork(workId) {
    if (!this.data.works[workId]) this.data.works[workId] = { pos: 0, seen: {}, best: {} };
    return this.data.works[workId];
  }

  setPosition(workId, sceneIdx, total) {
    if (!workId) return;
    const w = this.getWork(workId);
    w.pos = sceneIdx;
    w.total = total;
    w.seen[sceneIdx] = 1;
    this.data.last = { workId, sceneIdx, ts: Date.now() };
    this.save();
  }

  getLast() { return this.data.last; }

  getPosition(workId) {
    const w = this.data.works[workId];
    return w ? (w.pos || 0) : 0;
  }

  recordSceneScore(workId, sceneIdx, score) {
    if (!workId) return 0;
    const w = this.getWork(workId);
    w.best[sceneIdx] = Math.max(w.best[sceneIdx] || 0, Math.round(score));
    this.save();
    return w.best[sceneIdx];
  }

  getSceneBest(workId, sceneIdx) {
    const w = this.data.works[workId];
    return w && w.best[sceneIdx] ? w.best[sceneIdx] : 0;
  }

  getWorkStats(workId, total) {
    const w = this.data.works[workId];
    if (!w) return { seen: 0, spoken: 0, total, percent: 0, pos: 0 };
    const seen = Object.keys(w.seen).length;
    const spoken = Object.values(w.best).filter(s => s >= 75).length;
    const t = total || w.total || seen || 1;
    return { seen, spoken, total: t, percent: Math.min(100, Math.round(100 * seen / t)), pos: w.pos || 0 };
  }

  // ---------- Flashcards (repetição espaçada) ----------
  getCardStates() { return this.data.cards; }

  rateCard(cardId, rating) {
    this.data.cards[cardId] = schedule(this.data.cards[cardId], rating, dayNumber());
    this.save();
    return this.data.cards[cardId];
  }

  /** A revisão automática de um capítulo é oferecida no máximo uma vez por dia. */
  wasOfferedToday(chapterId) { return this.data.offered[chapterId] === dayNumber(); }
  markOffered(chapterId) {
    this.data.offered[chapterId] = dayNumber();
    this.save();
  }

  // ---------- Preferências ----------
  getSetting(name, fallback) {
    return name in this.data.settings ? this.data.settings[name] : fallback;
  }
  setSetting(name, value) {
    this.data.settings[name] = value;
    this.save();
  }

  // ---------- Backup e link de progresso ----------
  exportCode() {
    const json = JSON.stringify(this.data);
    return 'HQFR2.' + btoa(unescape(encodeURIComponent(json)));
  }

  /** Código compacto (deflate + base64url) para caber em um link de WhatsApp. */
  async exportCompact() {
    try {
      const bytes = new TextEncoder().encode(JSON.stringify(this.data));
      const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
      const buf = new Uint8Array(await new Response(stream).arrayBuffer());
      let bin = '';
      buf.forEach(b => { bin += String.fromCharCode(b); });
      return 'HQFR3.' + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (_) {
      return this.exportCode().replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
  }

  async decode(code) {
    const text = String(code || '').trim();
    const body = text.replace(/^HQFR[23]\./, '').replace(/-/g, '+').replace(/_/g, '/');
    if (text.startsWith('HQFR3.')) {
      const bytes = Uint8Array.from(atob(body), c => c.charCodeAt(0));
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      return JSON.parse(await new Response(stream).text());
    }
    return JSON.parse(decodeURIComponent(escape(atob(body))));
  }

  /**
   * Junta o progresso recebido com o deste navegador, sem perder nada dos dois lados:
   * maiores notas, união das cenas vistas, cartão mais revisado, posição mais recente.
   */
  async importCode(code) {
    let other;
    try {
      other = this.normalize(await this.decode(code));
      if (!other || (!other.updatedAt && !other.last && !Object.keys(other.chapters).length)) return false;
    } catch (_) {
      return false;
    }
    const mine = this.data;
    const newer = (other.updatedAt || 0) > (mine.updatedAt || 0);

    Object.entries(other.chapters).forEach(([id, c]) => {
      const m = this.getChapterProgress(id);
      ['audioScore', 'quizScore', 'puzzleScore'].forEach(f => { m[f] = Math.max(m[f] || 0, c[f] || 0); });
      const scores = [m.audioScore, m.quizScore, m.puzzleScore].filter(x => x > 0);
      m.average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    });
    Object.entries(other.works).forEach(([id, w]) => {
      const m = this.getWork(id);
      Object.assign(m.seen, w.seen || {});
      Object.entries(w.best || {}).forEach(([k, v]) => { m.best[k] = Math.max(m.best[k] || 0, v); });
      if (newer || !m.pos) m.pos = w.pos || m.pos || 0;
      m.total = m.total || w.total;
    });
    Object.entries(other.cards).forEach(([id, c]) => {
      const m = mine.cards[id];
      if (!m || (c.n || 0) > (m.n || 0)) mine.cards[id] = c;
    });
    if (other.last && (!mine.last || (other.last.ts || 0) > (mine.last.ts || 0))) mine.last = other.last;
    if (newer) mine.settings = { ...mine.settings, ...other.settings };
    this.save();
    return true;
  }

  reset() {
    this.data = emptyData();
    this.save();
  }
}

export const masteryEngine = new MasteryProgressEngine();
export const progress = masteryEngine;
