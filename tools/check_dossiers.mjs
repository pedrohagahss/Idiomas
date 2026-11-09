import fs from 'fs';
import path from 'path';

const file = 'C:/Users/seuca/Desktop/Idiomas/app/js/story_engine.js';
const content = fs.readFileSync(file, 'utf8');

// Parse chapters
const chapRegex = /\{\s*"id":\s*"([^"]+)",[\s\S]*?"title":\s*"([^"]+)",[\s\S]*?"dossier":\s*\{([\s\S]*?)\}/g;
let m;
const results = [];
while ((m = chapRegex.exec(content)) !== null) {
  const id = m[1];
  const title = m[2];
  const dossierBody = m[3];
  const hasLines = dossierBody.includes('"lines":');
  const hasSource = dossierBody.includes('"source":');
  results.push({ id, title: title.slice(0, 40), hasLines, hasSource });
}

console.log(JSON.stringify(results, null, 2));
