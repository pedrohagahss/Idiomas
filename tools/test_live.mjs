import http from 'http';
import https from 'https';

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, length: data.length }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('--- TESTE LOCAL HTTP ---');
  const index = await fetchUrl('http://localhost:5173/app/index.html');
  console.log('App Index:', index.status, `(${index.length} bytes)`);

  const engine = await fetchUrl('http://localhost:5173/app/js/story_engine.js');
  console.log('Story Engine:', engine.status, `(${engine.length} bytes)`);

  const main = await fetchUrl('http://localhost:5173/app/js/main.js');
  console.log('Main JS:', main.status, `(${main.length} bytes)`);

  const minigame = await fetchUrl('http://localhost:5173/app/js/minigame.js');
  console.log('Minigame JS:', minigame.status, `(${minigame.length} bytes)`);

  const tts = await fetchUrl('http://localhost:5173/api/tts?text=bonjour&speaker=PEDRO');
  console.log('TTS Neural API:', tts.status, `(${tts.length} bytes, type: ${tts.headers['content-type']})`);

  console.log('--- TESTE CLOUDFLARE TUNNEL ---');
  try {
    const cf = await fetchUrl('https://lets-keen-plane-mesh.trycloudflare.com/app/index.html');
    console.log('Cloudflare Tunnel Index:', cf.status, `(${cf.length} bytes)`);
  } catch (err) {
    console.error('Cloudflare Tunnel Error:', err.message);
  }
}

run();
