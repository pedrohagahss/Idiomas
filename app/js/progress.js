/**
 * PROGRESSO DO ALUNO (persistente)
 * - Notas por capítulo (áudio, quiz, montagem) e média — API antiga mantida.
 * - Posição de leitura por obra + última obra aberta ("Continuar de onde parei").
 * - Cenas vistas e melhor nota de pronúncia por cena.
 * - Preferências (tradução ligada/desligada).
 * - Código de backup para levar o progresso a outro aparelho/navegador.
 * Gravado em localStorage a cada mudança; pede armazenamento persistente ao navegador.
 */

const KEY = 'pedro_hagah_progress_v2';
const LEGACY_KEY = 'pedro_hagah_mastery_progress_v1';

function emptyData() {
  return { v: 2, chapters: {}, works: {}, last: null, settings: {}, updatedAt: 0 };
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

  // ---------- Preferências ----------
  getSetting(name, fallback) {
    return name in this.data.settings ? this.data.settings[name] : fallback;
  }
  setSetting(name, value) {
    this.data.settings[name] = value;
    this.save();
  }

  // ---------- Backup ----------
  exportCode() {
    const json = JSON.stringify(this.data);
    return 'HQFR2.' + btoa(unescape(encodeURIComponent(json)));
  }

  importCode(code) {
    try {
      const body = String(code || '').trim().replace(/^HQFR2\./, '');
      const parsed = JSON.parse(decodeURIComponent(escape(atob(body))));
      if (!parsed || parsed.v !== 2) return false;
      this.data = this.normalize(parsed);
      this.save();
      return true;
    } catch (_) {
      return false;
    }
  }

  reset() {
    this.data = emptyData();
    this.save();
  }
}

export const masteryEngine = new MasteryProgressEngine();
export const progress = masteryEngine;
