import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { MassiveStoryEngine } from '../app/js/story_engine.js';

const req = createRequire('C:\\Users\\seuca\\.gemini\\config\\scripts\\piper\\package.json');
const { MsEdgeTTS, OUTPUT_FORMAT } = req('msedge-tts');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(ROOT, 'assets', 'audio', 'cache');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

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

async function synthesizeText(text, voice, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 600) {
    return true;
  }
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);
  const writer = fs.createWriteStream(destPath);
  audioStream.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    audioStream.on('error', reject);
    writer.on('error', reject);
  });
}

function cleanWord(w) {
  if (!w) return '';
  return w.replace(/[.,/#!$%^&*;:{}=\-_`~()«»?"'’[\]]/g, '').trim();
}

async function main() {
  const engine = new MassiveStoryEngine();
  const manifestPath = path.join(ROOT, 'assets', 'audio', 'manifest.json');
  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (_) {}
  }

  const tasksMap = new Map(); // key: filename -> { text, voice, destPath, filename, manifestKeys: [] }

  function registerTask(text, voice) {
    if (!text || !text.trim()) return;
    const clean = text.trim();
    const manifestKey = `${voice}_${clean}`;
    const hash = crypto.createHash('md5').update(manifestKey).digest('hex');
    const filename = `${hash}.mp3`;
    const destPath = path.join(CACHE_DIR, filename);

    manifest[manifestKey] = filename;

    if (!tasksMap.has(filename)) {
      tasksMap.set(filename, { text: clean, voice, destPath, filename });
    }
  }

  console.log('1. Coletando todas as falas das cenas, legendas, dossiês e palavras...');

  const uniqueWords = new Set();

  engine.works.forEach(w => {
    w.chapters.forEach(ch => {
      // 1. Dossiês
      if (ch.dossier && ch.dossier.lines) {
        ch.dossier.lines.forEach(l => {
          if (l.fr) {
            registerTask(l.fr, 'fr-FR-RemyMultilingualNeural');
            registerTask(l.fr, 'fr-FR-HenriNeural');
            l.fr.split(/\s+/).forEach(w => {
              const cw = cleanWord(w);
              if (cw && cw.length > 1 && !/^\d+$/.test(cw)) uniqueWords.add(cw);
            });
          }
        });
      }

      // 2. Cenas e Legendas
      (ch.scenes || []).forEach(sc => {
        if (sc.dialogue_fr) {
          const cleanDiag = sc.dialogue_fr.replace(/[«»"]/g, '').trim();
          const voice = getVoice(sc.speaker);
          registerTask(cleanDiag, voice);
          cleanDiag.split(/\s+/).forEach(w => {
            const cw = cleanWord(w);
            if (cw && cw.length > 1 && !/^\d+$/.test(cw)) uniqueWords.add(cw);
          });
        }

        if (sc.caption) {
          const cleanCap = sc.caption.replace(/[«»"]/g, '').trim();
          registerTask(cleanCap, 'fr-FR-RemyMultilingualNeural');
        }
      });
    });
  });

  // 3. Palavras isoladas para cliques rápidos e drills
  console.log(`Palavras únicas identificadas: ${uniqueWords.size}`);
  uniqueWords.forEach(w => {
    registerTask(w, 'fr-FR-HenriNeural');
  });

  const allTasks = Array.from(tasksMap.values());
  const missing = allTasks.filter(t => !fs.existsSync(t.destPath) || fs.statSync(t.destPath).size <= 600);

  console.log(`Total de clipes neurais mapeados: ${allTasks.length}`);
  console.log(`Já em cache: ${allTasks.length - missing.length} | Faltando sintetizar: ${missing.length}`);

  const CONCURRENCY = 15;
  for (let i = 0; i < missing.length; i += CONCURRENCY) {
    const chunk = missing.slice(i, i + CONCURRENCY);
    await Promise.allSettled(chunk.map(t => synthesizeText(t.text, t.voice, t.destPath)));
    if (i % 60 === 0 || i + CONCURRENCY >= missing.length) {
      console.log(`Sintetizando... ${Math.min(i + CONCURRENCY, missing.length)} / ${missing.length}`);
    }
  }

  console.log('✅ Síntese de 100% das vozes neurais concluída!');

  // Salva manifest.json
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  // Atualiza app/js/audio_manifest.js
  const jsContent = `/**
 * AUDIO MANIFEST (ES Module)
 * Contém o mapa completo de todas as cenas, legendas, dossiês e palavras neurais em alta fidelidade.
 */

export const AUDIO_MANIFEST = ${JSON.stringify(manifest, null, 2)};
`;
  const jsManifestPath = path.join(ROOT, 'app', 'js', 'audio_manifest.js');
  fs.writeFileSync(jsManifestPath, jsContent, 'utf8');
  console.log(`Manifestos salvos: ${manifestPath} e ${jsManifestPath}`);
}

main().catch(console.error);
