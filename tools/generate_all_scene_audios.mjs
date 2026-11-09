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
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
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

async function main() {
  const engine = new MassiveStoryEngine();
  const manifest = {};
  const tasks = [];

  engine.works.forEach(w => {
    w.chapters.forEach(ch => {
      (ch.scenes || []).forEach(sc => {
        const text = (sc.dialogue_fr || '').replace(/[«»"]/g, '').trim();
        if (!text) return;
        const voice = getVoice(sc.speaker);
        const hash = crypto.createHash('md5').update(`${voice}_${text}`).digest('hex');
        const filename = `${hash}.mp3`;
        const dest = path.join(CACHE_DIR, filename);
        manifest[`${voice}_${text}`] = filename;
        tasks.push({ text, voice, dest, filename });
      });
    });
  });

  console.log(`Verificando ${tasks.length} cenas para síntese rápida paralela...`);
  const missing = tasks.filter(t => !fs.existsSync(t.dest) || fs.statSync(t.dest).size <= 1000);
  console.log(`Já em cache: ${tasks.length - missing.length} | Faltando sintetizar: ${missing.length}`);

  const CONCURRENCY = 10;
  for (let i = 0; i < missing.length; i += CONCURRENCY) {
    const chunk = missing.slice(i, i + CONCURRENCY);
    await Promise.allSettled(chunk.map(t => synthesizeText(t.text, t.voice, t.dest)));
    console.log(`Progresso: ${Math.min(i + CONCURRENCY, missing.length)} / ${missing.length} sintetizados...`);
  }

  console.log(`✅ Síntese completa!`);
  const manifestPath = path.join(ROOT, 'assets', 'audio', 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Manifesto salvo em ${manifestPath}`);
}

main().catch(console.error);
