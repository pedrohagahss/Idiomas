import crypto from 'crypto';
import fs from 'fs';
import { MassiveStoryEngine } from '../app/js/story_engine.js';

const engine = new MassiveStoryEngine();
const cacheDir = './assets/audio/cache';
const files = new Set(fs.existsSync(cacheDir) ? fs.readdirSync(cacheDir) : []);

let totalScenes = 0;
let foundCache = 0;
const manifest = {};

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

engine.works.forEach(w => {
  w.chapters.forEach(ch => {
    (ch.scenes || []).forEach(sc => {
      totalScenes++;
      const text = (sc.dialogue_fr || '').replace(/[«»"]/g, '').trim();
      const voice = getVoice(sc.speaker);
      const hash = crypto.createHash('md5').update(voice + '_' + text).digest('hex');
      const filename = hash + '.mp3';
      if (files.has(filename)) {
        foundCache++;
        manifest[`${sc.speaker}_${text}`] = `../assets/audio/cache/${filename}`;
      }
    });
  });
});

console.log('Total de cenas:', totalScenes);
console.log('Total com áudio MP3 em cache:', foundCache);
fs.writeFileSync('./assets/audio/manifest.json', JSON.stringify(manifest, null, 2));
console.log('Manifesto salvo em assets/audio/manifest.json');
