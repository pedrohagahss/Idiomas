// Teste do gerador/agendador de flashcards. Uso: node tools/test_flashcards.mjs
import { massiveEngine } from '../app/js/story_engine.js';
import { buildChapterCards, splitAligned, makeCloze, schedule, suggestRating, pickSession, INTERVALS } from '../app/js/flashcards.js';
let fail = 0;
const check = (name, ok, extra = '') => { if (!ok) fail++; console.log(`${ok ? '✓' : '✗'} ${name} ${extra}`); };

const sp = splitAligned("Bonjour ! Je m'appelle Pedro, mais on me connaît sous le nom de Pedro Hagah.", "Olá! Meu nome é Pedro, mas me conhecem pelo nome de Pedro Hagah.");
check('divide FR e PT nos mesmos pontos', sp.length === 2 && sp[0].fr === "Bonjour ! Je m'appelle Pedro," && sp[0].pt === 'Olá! Meu nome é Pedro,', JSON.stringify(sp.map(x => x.fr)));
check('pontuação diferente → frase inteira', splitAligned('Un, deux, trois quatre cinq.', 'Um dois três quatro cinco.').length === 1);
const cz = makeCloze("Je suis né à Recife,");
check('lacuna esconde palavra longa e mantém pontuação', cz.hidden === 'Recife' && cz.masked === 'Je suis né à _____,', JSON.stringify(cz));

const ids = new Set(); let total = 0, chapters = 0, short = 0; const types = {};
for (const w of massiveEngine.works) for (const ch of w.chapters) {
  const cards = buildChapterCards(w.id, ch, massiveEngine.getVerbChallenge(ch.id));
  chapters++;
  if (cards.length < ch.scenes.length) short++;
  cards.forEach(c => { total++; ids.add(c.id); types[c.type] = (types[c.type] || 0) + 1; if (!c.answer || (c.type !== 'listen' && !c.prompt)) fail++; });
  const head = cards.slice(0, 8).map(c => c.type);
  if (ch.scenes.length >= 3 && new Set(head).size < 3) { fail++; console.log('✗ pouca variedade em', ch.id, head.join(',')); }
}
check('ids únicos em todas as obras', ids.size === total, `(${total} cartões, ${chapters} capítulos)`);
check('todo capítulo tem ao menos 1 cartão por cena', short === 0);
console.log('  tipos:', JSON.stringify(types));

let st = schedule(undefined, 'good', 100);
check('novo + bom → caixa 1, amanhã', st.box === 1 && st.due === 101 && st.n === 1);
st = schedule(st, 'easy', 101);
check('fácil pula 2 caixas (7 dias)', st.box === 3 && st.due === 101 + INTERVALS[3]);
st = schedule(st, 'hard', 108);
check('difícil mantém a caixa', st.box === 3);
st = schedule(st, 'again', 115);
check('errei → volta amanhã', st.box === 1 && st.due === 116);
check('sugestão pela nota', suggestRating(100) === 'easy' && suggestRating(80) === 'good' && suggestRating(60) === 'hard' && suggestRating(10) === 'again');
const cards = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
const sess = pickSession(cards, { a: { due: 5 }, b: { due: 99 }, c: { due: 3 } }, 10, { limit: 3, newLimit: 6 });
check('sessão: vencidos (mais atrasado antes), depois novos; futuros fora', sess.map(c => c.id).join('') === 'cad');
console.log(fail ? `\n${fail} falha(s)` : '\nTodos os testes passaram');
process.exit(fail ? 1 : 0);
