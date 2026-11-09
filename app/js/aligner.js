/**
 * ALINHADOR LÉXICO BILÍNGUE DE ALTA PRECISÃO — FRANCÊS ⇄ PORTUGUÊS
 * Garante que ao tocar em qualquer palavra em Francês, seja destacada a
 * tradução real em Português e vice-versa, com suporte a locuções e cognatos.
 */

export class BilingualLexicalAligner {
  constructor() {
    // 1. Mapeamento bruto de vocabulário
    const rawFrToPt = {
      // Artigos, pronomes e conectores
      "en": ["como", "em"],
      "tant": ["como"],
      "que": ["que", "como"],
      "comme": ["como"],
      "comment": ["como"],
      "je": ["eu"],
      "j'ai": ["estudei", "tenho"],
      "ai": ["estudei", "tenho"],
      "etudie": ["estudei"],
      "estudei": ["etudie", "j'ai"],
      "tu": ["voce"],
      "il": ["ele", "e"],
      "elle": ["ela"],
      "nous": ["nos", "compreendamos", "poderiamos", "respeitassemos"],
      "vous": ["voces", "o senhor"],
      "ils": ["eles"],
      "le": ["o", "no"],
      "la": ["a", "na"],
      "les": ["os", "as"],
      "un": ["um"],
      "une": ["uma"],
      "des": ["dos", "das", "de"],
      "du": ["do"],
      "de": ["de", "da", "do"],
      "et": ["e"],
      "ou": ["ou"],
      "mais": ["mas"],
      "pour": ["para"],
      "dans": ["no", "na", "em"],
      "cadre": ["contexto"],
      "contexte": ["contexto"],
      "sur": ["sobre"],
      "avec": ["com"],
      "sans": ["sem"],
      "par": ["por"],
      "ici": ["aqui"],
      "tout": ["todo", "total"],
      "toute": ["toda"],
      "tous": ["todos"],
      "si": ["se"],
      "se": ["se"],
      "afin": ["a fim"],
      "grace": ["gracas"],
      "a": ["a", "em"],
      "d'une": ["por", "um"],
      "part": ["lado"],
      "d'autre": ["por", "outro"],
      "autre": ["outro"],
      "surtout": ["sobretudo"],
      "face": ["diante"],

      // Verbos
      "est": ["e"],
      "suis": ["sou", "estou"],
      "sommes": ["somos"],
      "sont": ["sao"],
      "ont": ["tem"],
      "transforme": ["transformou"],
      "pose": ["lancou"],
      "ouvert": ["abriu"],
      "inspire": ["inspirou"],
      "redefini": ["redefiniu"],
      "nourri": ["nutriu"],
      "developpe": ["desenvolveu"],
      "defendu": ["defendeu"],
      "comprenions": ["compreendamos"],
      "puisse": ["possa"],
      "enrichir": ["enriquecer"],
      "respections": ["respeitassemos"],
      "pourrions": ["poderiamos"],
      "batir": ["construir"],
      "preserver": ["preservar"],
      "illustre": ["ilustra"],
      "exige": ["exige"],
      "demontre": ["demonstra"],
      "montre": ["mostra"],
      "libere": ["liberta"],
      "savoir": ["saber"],
      "concoit": ["concebe"],
      "enonce": ["enuncia"],

      // Substantivos e conceitos históricos, filosóficos e tecnológicos
      "notre": ["nossa", "nosso"],
      "nos": ["nossos", "nossas"],
      "vision": ["visao"],
      "liberte": ["liberdade"],
      "fondations": ["bases", "fundamentos"],
      "droit": ["direito"],
      "droits": ["direitos"],
      "international": ["internacional"],
      "internationale": ["internacional"],
      "voies": ["caminhos"],
      "scientifiques": ["cientificos"],
      "sciences": ["ciencias"],
      "souverainete": ["soberania"],
      "peuples": ["povos"],
      "peuple": ["povo"],
      "relation": ["relacao"],
      "entre": ["entre"],
      "ethique": ["etica"],
      "technologie": ["tecnologia"],
      "tech": ["tecnologia"],
      "esprit": ["espirito"],
      "critique": ["critico"],
      "siecles": ["seculos"],
      "siecle": ["seculo"],
      "algorithmes": ["algoritmos"],
      "ouverts": ["abertos"],
      "acces": ["acesso"],
      "universel": ["universal"],
      "connaissance": ["conhecimento"],
      "primordial": ["primordial"],
      "decisions": ["decisoes"],
      "decision": ["decisao"],
      "lecons": ["licoes"],
      "societe": ["sociedade"],
      "dignite": ["dignidade"],
      "humaine": ["humana"],
      "humain": ["humano"],
      "homme": ["humanos", "homem"],
      "grandeur": ["grandeza"],
      "culture": ["cultura"],
      "rigueur": ["rigor"],
      "constante": ["constante"],
      "langue": ["lingua"],
      "francaise": ["francesa"],
      "francais": ["frances"],
      "clarte": ["clareza"],
      "clairement": ["claramente"],
      "encyclopedie": ["enciclopedia"],
      "donnees": ["dados"],
      "linguistique": ["linguistica"],
      "grammaire": ["gramatica"],
      "cartesienne": ["cartesiana"],
      "existentialisme": ["existencialismo"],
      "memoire": ["memoria"],
      "commerce": ["comercio"],
      "triangulaire": ["triangular"],
      "colonisation": ["colonizacao"],
      "modeles": ["modelos"],
      "multilingues": ["multilingues"],
      "negritude": ["negritude"],
      "gastronomie": ["gastronomia"],
      "negociation": ["negociacao"],
      "traite": ["tratado"],
      "traites": ["tratados"],
      "resistance": ["resistencia"],
      "bataille": ["batalha"],
      "preservation": ["preservacao"],
      "loi": ["lei"],
      "recherche": ["pesquisa"],
      "francophone": ["francofona"],
      "guildes": ["guildas"],
      "architecture": ["arquitetura"],
      "flamande": ["flamenga"],
      "diplomatie": ["diplomacia"],
      "accelerateurs": ["aceleradores"],
      "particules": ["particulas"],
      "naissance": ["nascimento"],
      "conventions": ["convencoes"],
      "humanitaire": ["humanitario"],
      "neutralite": ["neutralidade"],
      "helvetique": ["helvetica"],
      "economie": ["economia"],
      "financiers": ["financeiros"],
      "patrimoine": ["patrimonio"],
      "vehiculaire": ["veicular"],
      "vitalite": ["vitalidade"],
      "voyageurs": ["viajantes"],
      "carrefour": ["encruzilhada", "cruzamento"],
      "civilisations": ["civilizacoes"],
      "bilinguisme": ["bilinguismo"],
      "republique": ["republica"],
      "noire": ["negra"],
      "revolution": ["revolucao"],
      "creole": ["crioula"],
      "resilience": ["resiliencia"],
      "biodiversite": ["biodiversidade"],
      "royaume": ["reino"],
      "influences": ["influencias"],
      "ecologie": ["ecologia"],
      "environnementale": ["ambiental"],
      "jurisprudence": ["jurisprudencia"],
      "europeenne": ["europeia"],
      "europeens": ["europeus"],
      "legislation": ["legislacao"],
      "chiffrement": ["criptografia"],
      "securite": ["seguranca"],
      "souveraine": ["soberana"],
      "deep": ["aprendizado"],
      "learning": ["profundo"],
      "ligne": ["linha"],
      "claire": ["clara"],
      "bande": ["historia"],
      "dessinee": ["quadrinhos"]
    };

    // Normaliza todas as chaves e valores
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
      .replace(/^(l|d|j|m|t|s|c|qu|n)['’]/i, '') // Remove artigos/pronomes elididos
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos para comparação uniforme
      .trim();
  }

  // Compara cognatos por regras de derivação latino-românica
  isCognate(normA, normB) {
    if (!normA || !normB) return false;
    if (normA === normB) return true;

    // Regras fonéticas comuns Francês <-> Português
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

    // Prefixo comum de no mínimo 4 letras
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
   * Encontra o índice (ou índices) da palavra correspondente em Português
   */
  findMatchingPtIndices(rawFrWord, frIndex, frWords, ptWords) {
    const cleanFr = this.normalize(rawFrWord);
    if (!cleanFr) return [];

    const matches = [];

    // 1. Nomes próprios e palavras idênticas (Pedro, Diderot, Voltaire, CERN, etc.)
    for (let j = 0; j < ptWords.length; j++) {
      const cleanPt = this.normalize(ptWords[j]);
      if (cleanPt === cleanFr) {
        matches.push(j);
      }
    }
    if (matches.length > 0) return this.filterClosest(matches, frIndex, frWords.length, ptWords.length);

    // 2. Busca no dicionário léxico
    const mappedPts = this.frToPt[cleanFr];
    if (mappedPts) {
      for (let j = 0; j < ptWords.length; j++) {
        const cleanPt = this.normalize(ptWords[j]);
        for (const target of mappedPts) {
          const normTarget = this.normalize(target);
          if (cleanPt === normTarget || this.isCognate(cleanPt, normTarget)) {
            matches.push(j);
          }
        }
      }
    }
    if (matches.length > 0) return this.filterClosest(matches, frIndex, frWords.length, ptWords.length);

    // 3. Busca por cognato / raiz etimológica
    for (let j = 0; j < ptWords.length; j++) {
      const cleanPt = this.normalize(ptWords[j]);
      if (this.isCognate(cleanFr, cleanPt)) {
        matches.push(j);
      }
    }
    if (matches.length > 0) return this.filterClosest(matches, frIndex, frWords.length, ptWords.length);

    // 4. Fallback: posição contextual relativa
    const ratio = frWords.length > 1 ? frIndex / (frWords.length - 1) : 0;
    const targetIdx = Math.min(ptWords.length - 1, Math.round(ratio * (ptWords.length - 1)));
    return [targetIdx];
  }

  /**
   * Encontra o índice (ou índices) da palavra correspondente em Francês
   */
  findMatchingFrIndices(rawPtWord, ptIndex, ptWords, frWords) {
    const cleanPt = this.normalize(rawPtWord);
    if (!cleanPt) return [];

    const matches = [];

    // 1. Nomes próprios e palavras idênticas
    for (let i = 0; i < frWords.length; i++) {
      const cleanFr = this.normalize(frWords[i]);
      if (cleanFr === cleanPt) {
        matches.push(i);
      }
    }
    if (matches.length > 0) return this.filterClosest(matches, ptIndex, ptWords.length, frWords.length);

    // 2. Busca reversa no dicionário léxico
    const mappedFrs = this.ptToFr[cleanPt];
    if (mappedFrs) {
      for (let i = 0; i < frWords.length; i++) {
        const cleanFr = this.normalize(frWords[i]);
        for (const target of mappedFrs) {
          const normTarget = this.normalize(target);
          if (cleanFr === normTarget || this.isCognate(cleanFr, normTarget)) {
            matches.push(i);
          }
        }
      }
    }
    if (matches.length > 0) return this.filterClosest(matches, ptIndex, ptWords.length, frWords.length);

    // 3. Busca por cognato / raiz
    for (let i = 0; i < frWords.length; i++) {
      const cleanFr = this.normalize(frWords[i]);
      if (this.isCognate(cleanFr, cleanPt)) {
        matches.push(i);
      }
    }
    if (matches.length > 0) return this.filterClosest(matches, ptIndex, ptWords.length, frWords.length);

    // 4. Fallback contextual
    const ratio = ptWords.length > 1 ? ptIndex / (ptWords.length - 1) : 0;
    const targetIdx = Math.min(frWords.length - 1, Math.round(ratio * (frWords.length - 1)));
    return [targetIdx];
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
