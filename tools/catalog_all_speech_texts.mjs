import fs from 'node:fs';
import { MassiveStoryEngine } from '../app/js/story_engine.js';

const engine = new MassiveStoryEngine();

const sceneDialogues = new Set();
const sceneCaptions = new Set();
const dossierLines = new Set();
const words = new Set();

function addWord(w) {
  if (!w) return;
  const clean = w.replace(/[.,/#!$%^&*;:{}=\-_`~()«»?"'’[\]]/g, '').trim();
  if (clean && clean.length > 1 && !/^\d+$/.test(clean)) {
    words.add(clean);
  }
}

engine.works.forEach(w => {
  w.chapters.forEach(ch => {
    // Dossier lines
    if (ch.dossier && ch.dossier.lines) {
      ch.dossier.lines.forEach(l => {
        if (l.fr) {
          dossierLines.add(l.fr.trim());
          l.fr.split(/\s+/).forEach(addWord);
        }
      });
    }

    // Scenes
    (ch.scenes || []).forEach(sc => {
      if (sc.dialogue_fr) {
        sceneDialogues.add(sc.dialogue_fr.replace(/[«»"]/g, '').trim());
        sc.dialogue_fr.split(/\s+/).forEach(addWord);
      }
      if (sc.caption) {
        sceneCaptions.add(sc.caption.replace(/[«»"]/g, '').trim());
      }
    });
  });
});

console.log('--- CONTAGEM DE TEXTOS DE VOZ NO APP ---');
console.log('Diálogos de Cenas:', sceneDialogues.size);
console.log('Legendas de Narrador:', sceneCaptions.size);
console.log('Linhas de Dossier:', dossierLines.size);
console.log('Palavras Únicas para Treino/Clique:', words.size);
