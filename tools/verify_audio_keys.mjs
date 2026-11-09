import fs from 'node:fs';
import { MassiveStoryEngine } from '../app/js/story_engine.js';

const manifest = JSON.parse(fs.readFileSync('assets/audio/manifest.json', 'utf8'));
const engine = new MassiveStoryEngine();

function getVoice(speaker) {
  const s = (speaker || '').toUpperCase();
  if (s.includes('ELENA')) return 'fr-FR-DeniseNeural';
  if (s.includes('AMINA')) return 'fr-FR-VivienneMultilingualNeural';
  if (s.includes('MARIE')) return 'fr-CH-ArianeNeural';
  if (s.includes('CHARLINE') || s.includes('BELGE_FEMME')) return 'fr-BE-CharlineNeural';
  if (s.includes('SYLVIE') || s.includes('QUEBEC_FEMME')) return 'fr-CA-SylvieNeural';
  if (s.includes('MATHIEU') || s.includes('MARIN') || s.includes('JEAN-BAPTISTE')) return 'fr-CA-JeanNeural';
  if (s.includes('YANN')) return 'fr-BE-GerardNeural';
  if (s.includes('LUCAS')) return 'fr-CH-FabriceNeural';
  if (s.includes('GRIOT') || s.includes('NARRATEUR') || s.includes('PROF') || s.includes('GUIDE')) return 'fr-FR-RemyMultilingualNeural';
  if (s.includes('FEMME') || s.includes('DAME') || s.includes('FILLE') || s.includes('WOMAN')) return 'fr-FR-DeniseNeural';
  return 'fr-FR-HenriNeural';
}

let totalScenes = 0;
let matched = 0;
let missing = [];

engine.works.forEach(w => {
  w.chapters.forEach(ch => {
    (ch.scenes || []).forEach(sc => {
      totalScenes++;
      const text = (sc.dialogue_fr || '').replace(/[«»"]/g, '').trim();
      const voice = getVoice(sc.speaker);
      const key = `${voice}_${text}`;
      if (manifest[key]) {
        matched++;
      } else {
        missing.push({ key, text });
      }
    });
  });
});

console.log(`Matched ${matched} / ${totalScenes} scenes in manifest.`);
if (missing.length > 0) {
  console.log(`Missing sample:`, missing.slice(0, 5));
}
