async function check() {
  const url = 'https://pedrohagahss.github.io/Idiomas/app/index.html?t=' + Date.now();
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
  const text = await res.text();
  const hasV5 = text.includes('v=20261109_5');
  const hasSpeechMaster = text.includes('speech-master-audio');
  console.log('GitHub Pages Status:', res.status);
  console.log('Has v5 cache tag:', hasV5);
  console.log('Has speech-master-audio:', hasSpeechMaster);
}
check();
