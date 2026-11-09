import fs from 'node:fs';

async function check() {
  const url = 'https://pedrohagahss.github.io/Idiomas/app/index.html?t=' + Date.now();
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
  const text = await res.text();
  const hasV6 = text.includes('v=20261109_6');
  console.log('GitHub Pages Status:', res.status);
  console.log('Has v6 cache tag:', hasV6);

  // Test an individual word audio
  const manifest = JSON.parse(fs.readFileSync('assets/audio/manifest.json', 'utf8'));
  const wordKey = Object.keys(manifest).find(k => k.startsWith('fr-FR-HenriNeural_') && k.length < 35);
  if (wordKey) {
    const file = manifest[wordKey];
    const audioRes = await fetch(`https://pedrohagahss.github.io/Idiomas/assets/audio/cache/${file}`, { method: 'HEAD' });
    console.log(`Testing word audio "${wordKey}": HTTP ${audioRes.status} (${audioRes.headers.get('content-type')}, ${audioRes.headers.get('content-length')} bytes)`);
  }
}

check();
