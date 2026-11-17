/**
 * FLASHCARDS — geração e agendamento (funções puras, testáveis em Node: tools/test_flashcards.mjs)
 *
 * Os cartões nascem das cenas que já existem (frase, tradução, IPA, verbo do capítulo):
 * nenhum conteúdo novo é escrito à mão.
 *  - recall : mostra a tradução → o aluno fala em francês
 *  - cloze  : frase em francês com uma palavra escondida → fala a frase completa
 *  - listen : só o áudio → repete o que ouviu
 *  - verb   : "eu me chamava (Imparfait)" → fala "je m'appelais"
 * Repetição espaçada em caixas (Leitner): 1, 3, 7, 16 e 35 dias.
 */

export const INTERVALS = [0, 1, 3, 7, 16, 35];
export const RATINGS = ['again', 'hard', 'good', 'easy'];

const TENSE_LABELS = {
  present: 'Présent',
  passe_compose: 'Passé composé',
  imparfait: 'Imparfait',
  futur_simple: 'Futur simple'
};

const wordCount = (t) => t.split(/\s+/).filter(Boolean).length;

/** Quebra a frase e a tradução nos mesmos pontos de pontuação; se não casarem, devolve inteira. */
export function splitAligned(fr, pt) {
  const cut = (t) => (t || '').trim().split(/(?<=[,;:!?.…])\s+/).filter(Boolean);
  let a = cut(fr), b = cut(pt);
  if (a.length !== b.length || a.length < 2) return [{ fr: (fr || '').trim(), pt: (pt || '').trim() }];
  // Junta pedaços curtos demais ao vizinho (nos dois idiomas ao mesmo tempo)
  const out = [];
  for (let i = 0; i < a.length; i++) {
    const prev = out[out.length - 1];
    if (prev && (wordCount(prev.fr.replace(/[!?:;,.]/g, '')) < 3 || wordCount(a[i].replace(/[!?:;,.]/g, '')) < 3)) {
      prev.fr += ' ' + a[i];
      prev.pt += ' ' + b[i];
    } else {
      out.push({ fr: a[i], pt: b[i] });
    }
  }
  return out;
}

/** Escolhe a palavra a esconder: a mais longa (≥ 5 letras) que não seja a primeira. */
export function makeCloze(fr) {
  const words = fr.split(' ');
  let pick = -1, len = 4;
  words.forEach((w, i) => {
    const core = w.replace(/[^a-zàâäæçéèêëîïôöœùûüÿ'’-]/gi, '');
    if (i > 0 && core.length > len && !/\d/.test(w)) { pick = i; len = core.length; }
  });
  if (pick < 0) return null;
  const hidden = words[pick].replace(/[.,;:!?…]+$/, '');
  const tail = words[pick].slice(hidden.length);
  const masked = words.map((w, i) => (i === pick ? '_____' + tail : w)).join(' ');
  return { masked, hidden };
}

/**
 * Baralho fixo de um capítulo (ids estáveis → o agendamento sobrevive a recargas).
 * Os primeiros cartões (1 por cena + 2 verbos) formam a revisão do fim do capítulo.
 */
export function buildChapterCards(workId, chapter, verbChallenge) {
  const first = [], extra = [];
  const base = { workId, chapterId: chapter.id, chapterTitle: chapter.title };

  (chapter.scenes || []).forEach((sc, i) => {
    if (!sc.dialogue_fr || !sc.dialogue_pt) return;
    const scene = {
      ...base, sceneIdx: i, fullFr: sc.dialogue_fr, fullPt: sc.dialogue_pt, ipa: sc.ipa || '',
      speaker: sc.speaker || 'PEDRO', image: sc.image || chapter.image || ''
    };
    const chunks = splitAligned(sc.dialogue_fr, sc.dialogue_pt);
    const whole = chunks.length === 1;
    const made = [];

    chunks.forEach((ch, k) => {
      made.push({ ...scene, id: `${chapter.id}:${i}:r${k}`, type: 'recall', prompt: ch.pt, answer: ch.fr, hint: ch.pt, whole });
      const cz = makeCloze(ch.fr);
      if (cz) made.push({ ...scene, id: `${chapter.id}:${i}:c${k}`, type: 'cloze', prompt: cz.masked, hidden: cz.hidden, answer: ch.fr, hint: ch.pt, whole });
    });
    made.push({ ...scene, id: `${chapter.id}:${i}:l`, type: 'listen', prompt: '', answer: sc.dialogue_fr, hint: sc.dialogue_pt, whole: true });

    // Um tipo diferente por cena na primeira passada: lembrar → lacuna → ouvir
    const want = ['recall', 'cloze', 'listen'][i % 3];
    const lead = made.find(c => c.type === want) || made[0];
    first.push(lead);
    made.forEach(c => { if (c !== lead) extra.push(c); });
  });

  const verbs = [];
  if (verbChallenge && verbChallenge.tenses) {
    Object.keys(TENSE_LABELS).forEach(key => {
      const t = verbChallenge.tenses[key];
      if (!t || !t.fr) return;
      verbs.push({
        ...base, id: `${chapter.id}:v:${key}`, type: 'verb', sceneIdx: -1,
        prompt: t.pt, tense: TENSE_LABELS[key], verb: verbChallenge.verb,
        answer: t.fr, hint: t.pt, fullFr: t.fr, fullPt: t.pt, ipa: '', speaker: 'PEDRO', image: '', whole: true
      });
    });
  }

  return [...first, ...verbs.slice(1, 3), ...extra, ...verbs.slice(0, 1), ...verbs.slice(3)];
}

/** Dia local como número inteiro (muda à meia-noite do aparelho). */
export function dayNumber(date = new Date()) {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 86400000);
}

/** Novo estado do cartão após a resposta. */
export function schedule(state, rating, today) {
  const box = state ? state.box : 0;
  let next;
  if (rating === 'again') next = 1;
  else if (rating === 'hard') next = Math.max(1, box);
  else if (rating === 'easy') next = Math.min(5, box + 2);
  else next = Math.min(5, box + 1);
  return { box: next, due: today + INTERVALS[next], n: (state ? state.n : 0) + 1 };
}

/** Sugestão de marcação a partir da nota do microfone (o aluno decide). */
export function suggestRating(score) {
  if (score >= 95) return 'easy';
  if (score >= 75) return 'good';
  if (score >= 50) return 'hard';
  return 'again';
}

/**
 * Monta uma sessão: primeiro os vencidos (mais atrasados antes), depois os novos.
 * No máximo um cartão por frase da história, para um cartão não entregar a resposta do outro.
 */
export function pickSession(cards, states, today, { limit = 15, newLimit = 6 } = {}) {
  const due = [], fresh = [];
  cards.forEach(c => {
    const st = states[c.id];
    if (!st) fresh.push(c);
    else if (st.due <= today) due.push(c);
  });
  due.sort((x, y) => states[x.id].due - states[y.id].due);

  const used = new Set();
  const picked = [];
  const take = (list, max) => {
    let taken = 0;
    for (const c of list) {
      if (picked.length >= limit || taken >= max) break;
      const key = c.sceneIdx >= 0 ? `${c.chapterId}:${c.sceneIdx}` : c.id;
      if (used.has(key)) continue;
      used.add(key);
      picked.push(c);
      taken++;
    }
  };
  take(due, limit);
  take(fresh, newLimit);
  return picked;
}
