/**
 * ALINHADOR LÉXICO BILÍNGUE ULTRA-PRECISO — FRANCÊS ⇄ PORTUGUÊS
 * Sincronização perfeita de palavras simples, contrações e expressões compostas.
 * Resolve desacoplamentos de palavras compostas (ex: "l'art" ⇄ "a arte", "d'accord" ⇄ "de acordo").
 */

export class BilingualLexicalAligner {
  constructor() {
    // 1. Locuções e Expressões Compostas (Multi-Word Expressions)
    this.compoundFrToPt = [
      { fr: ["l'intelligence", "artificielle"], pt: ["a", "inteligência", "artificial"] },
      { fr: ["intelligence", "artificielle"], pt: ["inteligência", "artificial"] },
      { fr: ["l'ai", "act"], pt: ["o", "ai", "act"] },
      { fr: ["ai", "act"], pt: ["ai", "act"] },
      { fr: ["notre-dame"], pt: ["notre-dame"] },
      { fr: ["station", "f"], pt: ["station", "f"] },
      { fr: ["charles-de-gaulle"], pt: ["charles-de-gaulle"] },
      { fr: ["loi", "96"], pt: ["lei", "96"] },
      { fr: ["traite", "de", "paris"], pt: ["tratado", "de", "paris"] },
      { fr: ["main", "dans", "la", "main"], pt: ["de", "mãos", "dadas"] },
      { fr: ["sur", "scène"], pt: ["no", "palco"] },
      { fr: ["dès", "mon", "enfance"], pt: ["desde", "a", "infância"] },
      { fr: ["au", "cœur", "de"], pt: ["no", "coração", "de"] },
      { fr: ["au", "cœur", "du"], pt: ["no", "coração", "do"] },
      { fr: ["d'accord"], pt: ["de", "acordo"] },
      { fr: ["au", "revoir"], pt: ["até", "logo"] },
      { fr: ["peut-être"], pt: ["talvez"] },
      { fr: ["c'est-à-dire"], pt: ["isto", "é"] },
      { fr: ["s'il", "vous", "plaît"], pt: ["por", "favor"] },
      { fr: ["tout", "à", "fait"], pt: ["com", "certeza"] },
      { fr: ["en", "fait"], pt: ["na", "verdade"] },
      { fr: ["parce", "que"], pt: ["porque"] },
      { fr: ["à", "cause", "de"], pt: ["por", "causa", "de"] },
      { fr: ["grâce", "à"], pt: ["graças", "a"] },
      { fr: ["grâce", "au"], pt: ["graças", "ao"] },
      { fr: ["grâce", "aux"], pt: ["graças", "aos"] },
      { fr: ["en", "train", "de"], pt: ["a", "ponto", "de"] },
      { fr: ["de", "plus"], pt: ["além", "disso"] },
      { fr: ["au-delà"], pt: ["além"] },
      { fr: ["tout", "le", "monde"], pt: ["todo", "mundo"] },
      { fr: ["il", "y", "a"], pt: ["há"] },
      { fr: ["face", "à"], pt: ["diante", "de"] },
      { fr: ["avant", "tout"], pt: ["antes", "de", "tudo"] },
      { fr: ["rendez-vous"], pt: ["encontro"] },
      { fr: ["aujourd'hui"], pt: ["hoje"] }
    ];

    // 2. Mapeamento Léxico Base (Francês -> Português)
    const rawFrToPt = {
      // Artigos & Pronomes com contração elidida
      "en": ["como", "em"],
      "tant": ["como"],
      "que": ["que", "como"],
      "comme": ["como"],
      "comment": ["como"],
      "je": ["eu"],
      "j'ai": ["eu", "tenho", "estudei", "nasci", "compreendi", "aprendi"],
      "ai": ["tenho", "estudei"],
      "tu": ["você"],
      "il": ["ele", "é"],
      "elle": ["ela"],
      "nous": ["nós", "compreendamos", "poderíamos", "desenvolvemos", "temos"],
      "vous": ["vocês", "o", "senhor", "sua", "seu"],
      "ils": ["eles"],
      "le": ["o", "no"],
      "la": ["a", "na"],
      "les": ["os", "as", "dos", "das"],
      "un": ["um"],
      "une": ["uma"],
      "des": ["dos", "das", "de", "uns"],
      "du": ["do", "no"],
      "de": ["de", "da", "do"],
      "d'un": ["de", "um"],
      "d'une": ["de", "uma"],
      "et": ["e"],
      "ou": ["ou"],
      "mais": ["mas"],
      "pour": ["para", "por"],
      "dans": ["no", "na", "em"],
      "sur": ["sobre", "em", "no"],
      "avec": ["com"],
      "sans": ["sem"],
      "par": ["por", "pelo", "pela"],
      "ici": ["aqui"],
      "tout": ["todo", "total"],
      "toute": ["toda"],
      "tous": ["todos"],
      "toutes": ["todas"],
      "si": ["se"],
      "se": ["se"],
      "afin": ["a", "fim"],
      "face": ["diante"],
      "autre": ["outro"],
      "autres": ["outros"],
      "surtout": ["sobretudo"],
      "aussi": ["também"],
      "toujours": ["sempre"],

      // Verbos
      "est": ["é", "está"],
      "c'est": ["é", "isto", "é"],
      "suis": ["sou", "estou", "nasci"],
      "sommes": ["somos"],
      "sont": ["são", "estão"],
      "ont": ["têm", "possuem"],
      "a": ["tem", "há", "a"],
      "va": ["vai"],
      "vont": ["vão"],
      "peut": ["pode"],
      "peuvent": ["podem"],
      "doit": ["deve"],
      "doivent": ["devem"],
      "veut": ["quer"],
      "veulent": ["querem"],
      "sait": ["sabe"],
      "savent": ["sabem"],
      "faire": ["fazer"],
      "fait": ["faz", "feito"],
      "dire": ["dizer"],
      "dit": ["diz", "dizia"],
      "parler": ["falar"],
      "parle": ["fala"],
      "voir": ["ver"],
      "vu": ["visto"],
      "comprendre": ["compreender", "entender"],
      "compris": ["compreendi", "entendi"],
      "apprendre": ["aprender"],
      "appris": ["aprendi"],
      "creer": ["criar"],
      "bâtir": ["construir"],
      "batir": ["construir"],
      "partager": ["compartilhar"],
      "developper": ["desenvolver"],
      "développer": ["desenvolver"],
      "garantir": ["garantir"],
      "rester": ["ficar", "permanecer", "continue"],
      "reste": ["continua", "permanece"],
      "redevenue": ["voltou", "a", "ser"],
      "rappele": ["lembrou"],
      "rappele": ["lembra"],
      "refuse": ["recusa"],
      "validee": ["validada"],
      "bienvenue": ["bem-vindo", "bem-vinda"],

      // Vocabulário de Pedro Hagah & Países Francófonos
      "bonjour": ["olá", "bom", "dia"],
      "m'appelle": ["chamo", "nome"],
      "nom": ["nome"],
      "ne": ["nasci", "nascido"],
      "enfance": ["infância"],
      "logique": ["lógica"],
      "creativite": ["criatividade"],
      "theatre": ["teatro"],
      "voix": ["voz"],
      "mot": ["palavra"],
      "clarte": ["clareza"],
      "esprits": ["mentes", "espíritos"],
      "art": ["arte"],
      "oratoire": ["oratória"],
      "ecoute": ["escuta"],
      "humilite": ["humildade"],
      "public": ["público"],
      "design": ["design"],
      "jeux": ["jogos"],
      "effets": ["efeitos"],
      "visuels": ["visuais"],
      "honneur": ["honra"],
      "culture": ["cultura"],
      "populaire": ["popular"],
      "mouvement": ["movimento"],
      "armorial": ["armorial"],
      "justice": ["justiça"],
      "travail": ["trabalho"],
      "droit": ["direito"],
      "automobile": ["automotivo"],
      "pericia": ["perícia"],
      "vehicules": ["veículos"],
      "donnees": ["dados"],
      "modeles": ["modelos"],
      "langue": ["língua"],
      "francophone": ["francófona", "francófono"],
      "afrique": ["áfrica"],
      "quebec": ["québec"],
      "france": ["frança"],
      "belgique": ["bélgica"],
      "suisse": ["suíça"],
      "monaco": ["mônaco"],
      "senegal": ["senegal"],
      "haiti": ["haiti"],
      "madagascar": ["madagáscar"],
      "etoile": ["estrela"],
      "sommet": ["cúpula"],
      "ethique": ["ética"],
      "technologique": ["tecnológica"],
      "responsable": ["responsável"],
      "plurielle": ["plural"]
    };

    this.frToPt = {};
    this.ptToFr = {};

    for (const [rawK, rawVList] of Object.entries(rawFrToPt)) {
      const normK = this.normalize(rawK);
      const normList = rawVList.map(v => this.normalize(v));
      this.frToPt[normK] = normList;

      for (const normV of normList) {
        if (!this.ptToFr[normV]) this.ptToFr[normV] = [];
        if (!this.ptToFr[normV].includes(normK)) this.ptToFr[normV].push(normK);
      }
    }
  }

  normalize(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()«»?"'']/g, '')
      .replace(/^(l|d|j|m|t|s|c|qu|n)['’]/i, '') // Extrai raiz tirando artigo/pronome elidido
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  rawClean(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()«»?"'']/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  isCognate(normA, normB) {
    if (!normA || !normB) return false;
    if (normA === normB) return true;

    // -te <-> -dade (liberte / liberdade)
    if (normA.endsWith('te') && normB.endsWith('dade')) {
      if (normA.slice(0, -2) === normB.slice(0, -4)) return true;
    }
    // -tion <-> -cao (nation / nacao)
    if (normA.endsWith('tion') && normB.endsWith('cao')) {
      if (normA.slice(0, -4) === normB.slice(0, -3)) return true;
    }
    // -ique <-> -ico/-ica (ethique / etica)
    if (normA.endsWith('ique') && (normB.endsWith('ico') || normB.endsWith('ica'))) {
      if (normA.slice(0, -4) === normB.slice(0, -3)) return true;
    }
    // -eur <-> -or/-eza (grandeur / grandeza)
    if (normA.endsWith('eur') && (normB.endsWith('or') || normB.endsWith('eza'))) {
      if (normA.slice(0, -3) === normB.slice(0, -2) || normA.slice(0, -3) === normB.slice(0, -3)) return true;
    }
    // -aire <-> -ario (humanitaire / humanitario)
    if (normA.endsWith('aire') && (normB.endsWith('ario') || normB.endsWith('aria'))) {
      if (normA.slice(0, -4) === normB.slice(0, -4)) return true;
    }

    if (normA.length >= 4 && normB.length >= 4) {
      const minLen = Math.min(normA.length, normB.length);
      const prefixLen = Math.min(5, minLen);
      if (normA.slice(0, prefixLen) === normB.slice(0, prefixLen)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Encontra o índice ou grupo de índices em Português para uma palavra em Francês
   */
  findMatchingPtIndices(rawFrWord, frIndex, frWords, ptWords) {
    const rawCleanFr = this.rawClean(rawFrWord);
    const rootFr = this.normalize(rawFrWord);
    if (!rootFr && !rawCleanFr) return [];

    // 1. Checa se faz parte de uma expressão composta (MWE)
    for (const comp of this.compoundFrToPt) {
      const frMwe = comp.fr.map(w => this.rawClean(w));
      const ptMwe = comp.pt.map(w => this.rawClean(w));

      // Verifica se a sequência em francês ocorre aqui
      for (let offset = 0; offset < frMwe.length; offset++) {
        const startFr = frIndex - offset;
        if (startFr >= 0 && startFr + frMwe.length <= frWords.length) {
          let match = true;
          for (let k = 0; k < frMwe.length; k++) {
            if (this.rawClean(frWords[startFr + k]) !== frMwe[k] && this.normalize(frWords[startFr + k]) !== frMwe[k]) {
              match = false;
              break;
            }
          }
          if (match) {
            // Encontra a sequência correspondente em Português
            for (let pj = 0; pj <= ptWords.length - ptMwe.length; pj++) {
              let ptMatch = true;
              for (let pk = 0; pk < ptMwe.length; pk++) {
                if (this.rawClean(ptWords[pj + pk]) !== ptMwe[pk] && this.normalize(ptWords[pj + pk]) !== ptMwe[pk]) {
                  ptMatch = false;
                  break;
                }
              }
              if (ptMatch) {
                const indices = [];
                for (let pk = 0; pk < ptMwe.length; pk++) indices.push(pj + pk);
                return indices;
              }
            }
          }
        }
      }
    }

    // 2. Nomes Próprios ou Palavras Idênticas
    const directMatches = [];
    for (let j = 0; j < ptWords.length; j++) {
      const cleanPt = this.rawClean(ptWords[j]);
      if (cleanPt === rawCleanFr || cleanPt === rootFr) {
        directMatches.push(j);
      }
    }
    if (directMatches.length > 0) return this.filterClosest(directMatches, frIndex, frWords.length, ptWords.length);

    // 3. Busca no Dicionário Léxico
    const targets = (this.frToPt[rootFr] || []).concat(this.frToPt[rawCleanFr] || []);
    const dictMatches = [];
    if (targets.length > 0) {
      for (let j = 0; j < ptWords.length; j++) {
        const cleanPt = this.rawClean(ptWords[j]);
        const normPt = this.normalize(ptWords[j]);
        for (const t of targets) {
          if (cleanPt === t || normPt === t || this.isCognate(normPt, t)) {
            dictMatches.push(j);
          }
        }
      }
    }
    if (dictMatches.length > 0) {
      const filtered = this.filterClosest(dictMatches, frIndex, frWords.length, ptWords.length);
      // Se a palavra em francês tinha contração (ex: l'intelligence), inclui o artigo correspondente em português se vizinho
      if (/^[ldjmtsc]['’]/i.test(rawFrWord)) {
        const baseIdx = filtered[0];
        if (baseIdx > 0 && /^(o|a|os|as|do|da|dos|das|no|na|nos|nas|um|uma|de)$/i.test(ptWords[baseIdx - 1])) {
          return [baseIdx - 1, baseIdx];
        }
      }
      return filtered;
    }

    // 4. Busca por Cognatos
    const cognateMatches = [];
    for (let j = 0; j < ptWords.length; j++) {
      const normPt = this.normalize(ptWords[j]);
      if (this.isCognate(rootFr, normPt)) {
        cognateMatches.push(j);
      }
    }
    if (cognateMatches.length > 0) return this.filterClosest(cognateMatches, frIndex, frWords.length, ptWords.length);

    // 5. Fallback Relativo com Suavização de Posição
    const ratio = frWords.length > 1 ? frIndex / (frWords.length - 1) : 0;
    const targetIdx = Math.min(ptWords.length - 1, Math.round(ratio * (ptWords.length - 1)));
    return [targetIdx];
  }

  /**
   * Encontra o índice ou grupo de índices em Francês para uma palavra em Português
   */
  findMatchingFrIndices(rawPtWord, ptIndex, ptWords, frWords) {
    const rawCleanPt = this.rawClean(rawPtWord);
    const rootPt = this.normalize(rawPtWord);
    if (!rootPt && !rawCleanPt) return [];

    // 1. Checa expressões compostas
    for (const comp of this.compoundFrToPt) {
      const frMwe = comp.fr.map(w => this.rawClean(w));
      const ptMwe = comp.pt.map(w => this.rawClean(w));

      for (let offset = 0; offset < ptMwe.length; offset++) {
        const startPt = ptIndex - offset;
        if (startPt >= 0 && startPt + ptMwe.length <= ptWords.length) {
          let match = true;
          for (let k = 0; k < ptMwe.length; k++) {
            if (this.rawClean(ptWords[startPt + k]) !== ptMwe[k] && this.normalize(ptWords[startPt + k]) !== ptMwe[k]) {
              match = false;
              break;
            }
          }
          if (match) {
            for (let fi = 0; fi <= frWords.length - frMwe.length; fi++) {
              let frMatch = true;
              for (let fk = 0; fk < frMwe.length; fk++) {
                if (this.rawClean(frWords[fi + fk]) !== frMwe[fk] && this.normalize(frWords[fi + fk]) !== frMwe[fk]) {
                  frMatch = false;
                  break;
                }
              }
              if (frMatch) {
                const indices = [];
                for (let fk = 0; fk < frMwe.length; fk++) indices.push(fi + fk);
                return indices;
              }
            }
          }
        }
      }
    }

    // 2. Nomes Próprios ou Palavras Idênticas
    const directMatches = [];
    for (let i = 0; i < frWords.length; i++) {
      const cleanFr = this.rawClean(frWords[i]);
      const normFr = this.normalize(frWords[i]);
      if (cleanFr === rawCleanPt || normFr === rootPt) {
        directMatches.push(i);
      }
    }
    if (directMatches.length > 0) return this.filterClosest(directMatches, ptIndex, ptWords.length, frWords.length);

    // 3. Busca Reversa no Dicionário
    const targets = (this.ptToFr[rootPt] || []).concat(this.ptToFr[rawCleanPt] || []);
    const dictMatches = [];
    if (targets.length > 0) {
      for (let i = 0; i < frWords.length; i++) {
        const cleanFr = this.rawClean(frWords[i]);
        const normFr = this.normalize(frWords[i]);
        for (const t of targets) {
          if (cleanFr === t || normFr === t || this.isCognate(normFr, t)) {
            dictMatches.push(i);
          }
        }
      }
    }
    if (dictMatches.length > 0) return this.filterClosest(dictMatches, ptIndex, ptWords.length, frWords.length);

    // 4. Cognatos
    const cognateMatches = [];
    for (let i = 0; i < frWords.length; i++) {
      const normFr = this.normalize(frWords[i]);
      if (this.isCognate(rootPt, normFr)) {
        cognateMatches.push(i);
      }
    }
    if (cognateMatches.length > 0) return this.filterClosest(cognateMatches, ptIndex, ptWords.length, frWords.length);

    // 5. Fallback Relativo
    const ratio = ptWords.length > 1 ? ptIndex / (ptWords.length - 1) : 0;
    const targetIdx = Math.min(frWords.length - 1, Math.round(ratio * (frWords.length - 1)));
    return [targetIdx];
  }

  /**
   * Sincronização Perfeita Bidirecional (Francês ⇄ Português)
   * Ilumina todas as palavras da locução composta em AMBOS os lados sem desvio
   */
  syncSelection(sourceLang, index, frWords, ptWords) {
    if (sourceLang === 'fr') {
      const rawFrWord = frWords[index] || '';
      // 1. Checa se faz parte de MWE
      for (const comp of this.compoundFrToPt) {
        const frMwe = comp.fr.map(w => this.rawClean(w));
        const ptMwe = comp.pt.map(w => this.rawClean(w));

        for (let offset = 0; offset < frMwe.length; offset++) {
          const startFr = index - offset;
          if (startFr >= 0 && startFr + frMwe.length <= frWords.length) {
            let match = true;
            for (let k = 0; k < frMwe.length; k++) {
              if (this.rawClean(frWords[startFr + k]) !== frMwe[k] && this.normalize(frWords[startFr + k]) !== frMwe[k]) {
                match = false;
                break;
              }
            }
            if (match) {
              for (let pj = 0; pj <= ptWords.length - ptMwe.length; pj++) {
                let ptMatch = true;
                for (let pk = 0; pk < ptMwe.length; pk++) {
                  if (this.rawClean(ptWords[pj + pk]) !== ptMwe[pk] && this.normalize(ptWords[pj + pk]) !== ptMwe[pk]) {
                    ptMatch = false;
                    break;
                  }
                }
                if (ptMatch) {
                  const frIndices = [];
                  for (let k = 0; k < frMwe.length; k++) frIndices.push(startFr + k);
                  const ptIndices = [];
                  for (let pk = 0; pk < ptMwe.length; pk++) ptIndices.push(pj + pk);
                  return { frIndices, ptIndices };
                }
              }
            }
          }
        }
      }

      // Palavra individual
      const ptIndices = this.findMatchingPtIndices(rawFrWord, index, frWords, ptWords);
      return { frIndices: [index], ptIndices };
    } else {
      const rawPtWord = ptWords[index] || '';
      // 1. Checa se faz parte de MWE no lado PT
      for (const comp of this.compoundFrToPt) {
        const frMwe = comp.fr.map(w => this.rawClean(w));
        const ptMwe = comp.pt.map(w => this.rawClean(w));

        for (let offset = 0; offset < ptMwe.length; offset++) {
          const startPt = index - offset;
          if (startPt >= 0 && startPt + ptMwe.length <= ptWords.length) {
            let match = true;
            for (let k = 0; k < ptMwe.length; k++) {
              if (this.rawClean(ptWords[startPt + k]) !== ptMwe[k] && this.normalize(ptWords[startPt + k]) !== ptMwe[k]) {
                match = false;
                break;
              }
            }
            if (match) {
              for (let fi = 0; fi <= frWords.length - frMwe.length; fi++) {
                let frMatch = true;
                for (let fk = 0; fk < frMwe.length; fk++) {
                  if (this.rawClean(frWords[fi + fk]) !== frMwe[fk] && this.normalize(frWords[fi + fk]) !== frMwe[fk]) {
                    frMatch = false;
                    break;
                  }
                }
                if (frMatch) {
                  const ptIndices = [];
                  for (let k = 0; k < ptMwe.length; k++) ptIndices.push(startPt + k);
                  const frIndices = [];
                  for (let fk = 0; fk < frMwe.length; fk++) frIndices.push(fi + fk);
                  return { frIndices, ptIndices };
                }
              }
            }
          }
        }
      }

      // Palavra individual
      const frIndices = this.findMatchingFrIndices(rawPtWord, index, ptWords, frWords);
      return { frIndices, ptIndices: [index] };
    }
  }

  filterClosest(indices, srcIndex, srcTotal, targetTotal) {
    if (indices.length <= 1) return indices;
    const targetRatio = srcTotal > 1 ? srcIndex / (srcTotal - 1) : 0;
    const expectedTarget = targetRatio * (targetTotal - 1);

    indices.sort((a, b) => Math.abs(a - expectedTarget) - Math.abs(b - expectedTarget));
    return [indices[0]];
  }
}

export const lexicalAligner = new BilingualLexicalAligner();
