/**
 * GERENCIADOR DE PROGRESSO & MASTERY (META DE 80% DE APROVEITAMENTO)
 * - Salva notas de áudio e exercícios no localStorage
 * - Calcula a média do capítulo e da obra
 * - Controla o desbloqueio gamificado de capítulos (exige 80% para destravar o próximo)
 */

export class MasteryProgressEngine {
  constructor() {
    this.STORAGE_KEY = 'pedro_hagah_mastery_progress_v1';
    this.TARGET_PASSING_GRADE = 80; // 80% de precisão mínima exigida
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}

    return {
      chapters: {
        // Exemplo: "vol1_chap_01": { audioScore: 90, quizScore: 85, puzzleScore: 100, average: 91, unlocked: true }
        "vol1_chap_01": { unlocked: true, average: 0, audioScore: 0, quizScore: 0, puzzleScore: 0 },
        "vol2_chap_01": { unlocked: true, average: 0, audioScore: 0, quizScore: 0, puzzleScore: 0 }
      },
      unlockedWorks: {
        "pedro_biography": true,
        "belgique_bd": true,
        "suisse_tell": true,
        "senegal_griot": true,
        "quebec_chasse": true,
        "france_pantheon": true,
        "maroc_medina": true,
        "haiti_liberte": true,
        "rdc_kinshasa": true,
        "madagascar_baobab": true
      }
    };
  }

  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (_) {}
  }

  getChapterProgress(chapterId) {
    if (!this.data.chapters[chapterId]) {
      this.data.chapters[chapterId] = {
        unlocked: true,
        average: 0,
        audioScore: 0,
        quizScore: 0,
        puzzleScore: 0
      };
    } else {
      this.data.chapters[chapterId].unlocked = true;
    }
    return this.data.chapters[chapterId];
  }

  isChapterUnlocked(chapterId, indexInWork = 0) {
    // Livre: permite seguir para o próximo story/capítulo livremente sem travas
    return true;
  }

  recordAudioScore(chapterId, score) {
    const prog = this.getChapterProgress(chapterId);
    prog.audioScore = Math.max(prog.audioScore || 0, score);
    this.recalculateAverage(chapterId);
    return prog;
  }

  recordQuizScore(chapterId, score) {
    const prog = this.getChapterProgress(chapterId);
    prog.quizScore = Math.max(prog.quizScore || 0, score);
    this.recalculateAverage(chapterId);
    return prog;
  }

  recordPuzzleScore(chapterId, score) {
    const prog = this.getChapterProgress(chapterId);
    prog.puzzleScore = Math.max(prog.puzzleScore || 0, score);
    this.recalculateAverage(chapterId);
    return prog;
  }

  recalculateAverage(chapterId) {
    const prog = this.getChapterProgress(chapterId);
    const scores = [];
    if (prog.audioScore > 0) scores.push(prog.audioScore);
    if (prog.quizScore > 0) scores.push(prog.quizScore);
    if (prog.puzzleScore > 0) scores.push(prog.puzzleScore);

    if (scores.length > 0) {
      const sum = scores.reduce((a, b) => a + b, 0);
      prog.average = Math.round(sum / scores.length);
    } else {
      prog.average = 0;
    }

    this.save();
    return prog.average;
  }

  /**
   * Avalia se o capítulo atual atingiu a meta de 80% e destrava o próximo
   */
  evaluateChapterUnlock(currentChapterId, nextChapterId) {
    const prog = this.getChapterProgress(currentChapterId);
    const passed = (prog.average >= this.TARGET_PASSING_GRADE) || (prog.audioScore >= this.TARGET_PASSING_GRADE);

    let justUnlocked = false;
    if (passed && nextChapterId) {
      const nextProg = this.getChapterProgress(nextChapterId);
      if (!nextProg.unlocked) {
        nextProg.unlocked = true;
        justUnlocked = true;
        this.save();
      }
    }

    return {
      passed,
      average: prog.average,
      target: this.TARGET_PASSING_GRADE,
      justUnlocked,
      currentProg: prog
    };
  }

  markQuizPassed(panelId) {
    this.recordQuizScore(panelId, 100);
  }

  addXP(amount, reason) {
    // Compatibilidade com eventos de XP legados
  }
}

export const masteryEngine = new MasteryProgressEngine();
export const progress = masteryEngine;
