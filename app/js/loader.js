/**
 * Carregador de Conteúdo da HQ Gamificada
 * Lê ../content/fr/partie_01/module.json e capítulos
 */

export class ContentLoader {
  constructor(basePath = '../content/fr/partie_01/') {
    this.basePath = basePath;
    this.module = null;
    this.chapters = {};
  }

  async init() {
    try {
      const res = await fetch(`${this.basePath}module.json`);
      if (!res.ok) throw new Error(`Falha ao carregar module.json: ${res.statusText}`);
      this.module = await res.json();

      for (const item of this.module.chapters) {
        try {
          const chapRes = await fetch(`${this.basePath}${item.file}`);
          if (chapRes.ok) {
            const chapData = await chapRes.json();
            this.chapters[item.id] = chapData;
          }
        } catch (e) {
          console.warn(`Não foi possível carregar o capítulo ${item.id}:`, e);
        }
      }

      return {
        module: this.module,
        chapters: this.chapters
      };
    } catch (err) {
      console.error('Erro na inicialização do ContentLoader:', err);
      throw err;
    }
  }

  getChapter(chapterId) {
    return this.chapters[chapterId] || null;
  }

  getAllChapters() {
    return Object.values(this.chapters);
  }

  findPanel(chapterId, panelId) {
    const chap = this.getChapter(chapterId);
    if (!chap) return null;

    for (const scene of chap.scenes || []) {
      for (const panel of scene.panels || []) {
        if (panel.panel_id === panelId) {
          return { scene, panel, chapter: chap };
        }
      }
    }
    return null;
  }
}

export const loader = new ContentLoader();
