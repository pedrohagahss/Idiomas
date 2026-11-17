// Teste do avaliador de pronúncia. Uso: node tools/test_scoring.mjs
import { evaluatePronunciation as ev, numberToFrench, phon } from '../app/js/scoring.js';
let fail = 0;
const check = (name, ok, extra = '') => { if (!ok) fail++; console.log(`${ok ? '✓' : '✗'} ${name} ${extra}`); };
const T = "Je suis né à Recife le 25 juin 1990, au cœur du Pernambouc.";

check('frase idêntica = 100', ev(T, T).score === 100);
check('números por extenso = 100', ev("je suis né à recife le vingt-cinq juin mille neuf cent quatre-vingt-dix au cœur du pernambouc", T).score === 100);
check('homófonos (parler/parlé, et/est)', ev("il et allé parler", "Il est allé parlé").score === 100);
check('silêncio = 0 (sem nota inventada)', ev("", T).score === 0);
const half = ev("je suis né à recife", T);
check('metade da frase fica bem abaixo de 75', half.score > 20 && half.score < 60, `(${half.score})`);
check('outra frase fica baixa', ev("bonjour comment allez vous aujourd'hui", T).score < 25, `(${ev("bonjour comment allez vous aujourd'hui", T).score})`);
const ord = ev("Pedro Je m'appelle", "Je m'appelle Pedro");
check('ordem importa', ord.score < 100, `(${ord.score})`);
const fb = ev("bonjour je m'appelle pedro", "Bonjour ! Je m'appelle Paulo");
check('feedback por índice de palavra', fb.wordFeedback.length === 5 && fb.wordFeedback[1].status === 'skip' && fb.wordFeedback[4].status === 'miss' && fb.wordFeedback[3].status === 'ok');
check('palavra isolada errada reprova', ev("bonsoir", "bonjour").score < 75, `(${ev("bonsoir", "bonjour").score})`);
check('palavra isolada certa aprova', ev("Bonjour.", "bonjour").score === 100);
check('1990 → francês', numberToFrench(1990) === 'mille neuf cent quatre-vingt-dix' && numberToFrench(71) === 'soixante et onze' && numberToFrench(2006) === 'deux mille six');
check('chave fonética', phon('parlez') === phon('parler') && phon('eau') === phon('au') && phon('temps') === phon('tant'), `${phon('temps')}/${phon('tant')}`);
console.log(fail ? `\n${fail} teste(s) falharam` : '\nTodos os testes passaram');
process.exit(fail ? 1 : 0);
