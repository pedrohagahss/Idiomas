/**
 * Avaliação de pronúncia (função pura, sem DOM — testável em Node: tools/test_scoring.mjs)
 *
 * Compara o que o reconhecedor de fala ouviu com o texto-alvo:
 * - alinhamento em ordem (programação dinâmica), não "a palavra aparece em algum lugar";
 * - chave fonética do francês: homófonos contam como acerto (parlé/parler/parlez, est/et);
 * - números: "1990" ⇄ "mille neuf cent quatre-vingt-dix";
 * - sem nota mínima nem bônus: a nota é só o que foi realmente reconhecido.
 */

const UNITS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
  'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];

export function numberToFrench(n) {
  n = Math.floor(Math.abs(n));
  if (n < 20) return UNITS[n];
  if (n < 70) {
    const t = Math.floor(n / 10), u = n % 10;
    if (u === 0) return TENS[t];
    return u === 1 ? `${TENS[t]} et un` : `${TENS[t]}-${UNITS[u]}`;
  }
  if (n < 80) return n === 71 ? 'soixante et onze' : `soixante-${UNITS[n - 60]}`;
  if (n < 100) return n === 80 ? 'quatre-vingts' : `quatre-vingt-${UNITS[n - 80]}`;
  if (n < 1000) {
    const h = Math.floor(n / 100), r = n % 100;
    const head = h === 1 ? 'cent' : `${UNITS[h]} cent`;
    return r ? `${head} ${numberToFrench(r)}` : head;
  }
  if (n < 1000000) {
    const k = Math.floor(n / 1000), r = n % 1000;
    const head = k === 1 ? 'mille' : `${numberToFrench(k)} mille`;
    return r ? `${head} ${numberToFrench(r)}` : head;
  }
  return String(n);
}

/** Quebra uma palavra exibida em 0..n tokens comparáveis. */
export function tokenize(text) {
  let s = (text || '').toLowerCase().replace(/[’`´]/g, "'");
  s = s.replace(/(\d)[.\s](\d{3})\b/g, '$1$2');
  s = s.replace(/\b1er\b/g, 'premier').replace(/\b1re\b/g, 'première');
  s = s.replace(/\d+/g, d => ` ${numberToFrench(parseInt(d, 10))} `);
  s = s.replace(/[^a-zàâäæçéèêëîïôöœùûüÿ'\s-]/g, ' ');
  return s.split(/[\s-]+/).map(t => t.replace(/'/g, '')).filter(Boolean);
}

const IRREGULAR = { est: 'E', es: 'E', et: 'E', ai: 'E', les: 'lE', des: 'dE', mes: 'mE', tes: 'tE', ses: 'sE', ces: 'sE', cest: 'sE', sest: 'sE' };

/** Chave fonética aproximada do francês (só para tolerar homófonos). */
export function phon(word) {
  let s = word;
  if (IRREGULAR[s]) return IRREGULAR[s];
  s = s.replace(/[éèêë]/g, 'E').replace(/[àâä]/g, 'a').replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u').replace(/ÿ/g, 'i').replace(/ç/g, 's').replace(/œ/g, 'eu').replace(/æ/g, 'E');
  if (s.length > 2) s = s.replace(/(aient|ais|ait|ai|er|ez|Ees|Es|Ee|et)$/, 'E');
  s = s.replace(/eaux?/g, 'o').replace(/aux?/g, 'o');
  s = s.replace(/ph/g, 'f').replace(/qu/g, 'k').replace(/ch/g, 'S').replace(/gn/g, 'N');
  s = s.replace(/c(?=[eiyE])/g, 's').replace(/c/g, 'k').replace(/g(?=[eiyE])/g, 'j').replace(/q/g, 'k');
  s = s.replace(/(ain|ein|in|im|un|um|yn|ym)(?![aeiouyEnm])/g, '1')
    .replace(/(an|am|en|em)(?![aeiouyEnm])/g, '2')
    .replace(/(on|om)(?![aeiouyEnm])/g, '3');
  s = s.replace(/ou/g, 'u').replace(/oi/g, 'wa').replace(/ai|ei/g, 'E').replace(/eu/g, 'e');
  s = s.replace(/h/g, '').replace(/y/g, 'i').replace(/(.)\1+/g, '$1');
  if (s.length > 2) s = s.replace(/[sxztdpe]+$/, '') || s;
  return s;
}

function lev(a, b) {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = tmp;
    }
  }
  return prev[b.length];
}

/** Crédito de um par (alvo, falado): 1 = certo, 0.6 = quase, 0 = diferente. */
export function credit(target, spoken) {
  if (target === spoken) return 1;
  const pt = phon(target), ps = phon(spoken);
  if (pt === ps) return 1;
  const len = Math.max(pt.length, ps.length);
  if (len <= 2) return 0;
  return 1 - lev(pt, ps) / len >= 0.7 ? 0.6 : 0;
}

function grade(score) {
  if (score >= 90) return { stars: '⭐⭐⭐⭐⭐', gradeTitle: 'EXCELLENT !', badgeClass: 'grade-excellent', commentary: 'Pronúncia clara: o reconhecedor entendeu praticamente tudo.' };
  if (score >= 75) return { stars: '⭐⭐⭐⭐', gradeTitle: 'TRÈS BIEN !', badgeClass: 'grade-good', commentary: 'Muito bom! Só as palavras em vermelho não foram entendidas.' };
  if (score >= 55) return { stars: '⭐⭐⭐', gradeTitle: 'BON ESSAI !', badgeClass: 'grade-fair', commentary: 'Bom começo. Ouça de novo e repita as palavras em vermelho.' };
  return { stars: '⭐⭐', gradeTitle: 'ENCORE UNE FOIS !', badgeClass: 'grade-retry', commentary: 'Poucas palavras foram entendidas. Ouça no modo lento e tente outra vez.' };
}

/**
 * @returns {{score:number, wordFeedback:Array<{word:string,status:'ok'|'close'|'miss'|'skip',correct:boolean}>, recognizedText:string, ...}}
 * wordFeedback tem o MESMO índice de targetText.split(' ') (usado para colorir o balão).
 */
export function evaluatePronunciation(spokenText, targetText) {
  const display = (targetText || '').split(' ');
  const owner = [];
  const tgt = [];
  display.forEach((w, i) => tokenize(w).forEach(t => { tgt.push(t); owner.push(i); }));
  const spk = tokenize(spokenText);

  const n = tgt.length, m = spk.length;
  const dp = Array.from({ length: n + 1 }, () => new Float32Array(m + 1));
  const cr = Array.from({ length: n }, (_, i) => spk.map(s => credit(tgt[i], s)));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const c = cr[i - 1][j - 1];
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1], c > 0 ? dp[i - 1][j - 1] + c : 0);
    }
  }
  const got = new Array(n).fill(0);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    const c = cr[i - 1][j - 1];
    if (c > 0 && Math.abs(dp[i][j] - (dp[i - 1][j - 1] + c)) < 1e-6) { got[i - 1] = c; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }

  const sums = display.map(() => ({ total: 0, count: 0 }));
  got.forEach((c, k) => { sums[owner[k]].total += c; sums[owner[k]].count++; });
  const wordFeedback = display.map((word, k) => {
    const { total, count } = sums[k];
    if (!count) return { word, status: 'skip', correct: true };
    const avg = total / count;
    const status = avg >= 0.99 ? 'ok' : (avg >= 0.5 ? 'close' : 'miss');
    return { word, status, correct: status !== 'miss' };
  });

  const score = n ? Math.round(100 * got.reduce((a, b) => a + b, 0) / n) : 0;
  return { score, ...grade(score), recognizedText: spokenText || '', wordFeedback };
}
