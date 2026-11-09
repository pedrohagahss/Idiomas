import fs from 'node:fs';

let content = fs.readFileSync('app/js/story_engine.js', 'utf8');

// Replace opening_theme.mp3 occurrences with null
content = content.replace(/"musicTrack":\s*"\.\.\/assets\/audio\/opening_theme\.mp3",/g, '"musicTrack": null,');
content = content.replace(/"file":\s*"\.\.\/assets\/audio\/opening_theme\.mp3",/g, '"file": null,');

fs.writeFileSync('app/js/story_engine.js', content, 'utf8');
console.log('Atualizado app/js/story_engine.js com sucesso! (opening_theme.mp3 removido dos livros 2 a 10)');
