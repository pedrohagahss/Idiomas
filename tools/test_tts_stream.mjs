import { createRequire } from 'node:module';
import fs from 'node:fs';

const req = createRequire('C:\\Users\\seuca\\.gemini\\config\\scripts\\piper\\package.json');
const { MsEdgeTTS, OUTPUT_FORMAT } = req('msedge-tts');

async function test() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata('fr-FR-RemyMultilingualNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const out = 'd:\\Projetos\\Idiomas\\assets\\audio\\cache\\test_stream.mp3';
  const { audioStream } = tts.toStream("Dans l'écosystème technologique mondial de 2026, l'intelligence artificielle est souveraine.");
  const writer = fs.createWriteStream(out);
  audioStream.pipe(writer);
  
  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    audioStream.on('error', reject);
    writer.on('error', reject);
  });
  
  console.log('Stream finished! File size:', fs.statSync(out).size);
  process.exit(0);
}

test().catch(e => { console.error('Error:', e); process.exit(1); });
