import { lexicalAligner } from '../app/js/aligner.js';

const frText = "En tant que PEDRO, j'ai étudié comment Diderot et l'Encyclopédie a transformé notre vision de la liberté dans le cadre de Café Procope.";
const ptText = "Como PEDRO, estudei como Diderot e a Enciclopédia transformou nossa visão de liberdade no contexto de Café Procope.";

const fr = frText.split(' ');
const pt = ptText.split(' ');

console.log('=== TESTE FR -> PT ===');
const testFr = ['étudié', 'liberté', 'Encyclopédie', 'notre', 'cadre', 'Diderot', 'transformé'];
for (const w of testFr) {
  const frIdx = fr.findIndex(x => x.toLowerCase().includes(w.toLowerCase()));
  const ptMatches = lexicalAligner.findMatchingPtIndices(fr[frIdx], frIdx, fr, pt);
  console.log(`FR [${fr[frIdx]}] -> PT [${ptMatches.map(i => pt[i]).join(', ')}]`);
}

console.log('\n=== TESTE PT -> FR ===');
const testPt = ['estudei', 'liberdade', 'Enciclopédia', 'nossa', 'contexto', 'Diderot', 'transformou'];
for (const w of testPt) {
  const ptIdx = pt.findIndex(x => x.toLowerCase().includes(w.toLowerCase()));
  const frMatches = lexicalAligner.findMatchingFrIndices(pt[ptIdx], ptIdx, pt, fr);
  console.log(`PT [${pt[ptIdx]}] -> FR [${frMatches.map(i => fr[i]).join(', ')}]`);
}
