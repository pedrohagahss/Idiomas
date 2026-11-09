/**
 * Script de Enriquecimento do Catálogo de Histórias
 * Adiciona todas as obras francófonas, capítulos, desafios verbais e suporte ao catálogo Netflix
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENGINE_PATH = path.resolve(__dirname, '..', 'app', 'js', 'story_engine.js');

const VERB_CHALLENGES = {
  vol1_chap_01: {
    verb: "S'APPELER",
    verb_pt: "Chamar-se / Ter como nome",
    tenses: {
      present: { fr: "je m'appelle", pt: "eu me chamo" },
      passe_compose: { fr: "je me suis appelé", pt: "eu me chamei" },
      imparfait: { fr: "je m'appelais", pt: "eu me chamava" },
      futur_simple: { fr: "je m'appellerai", pt: "eu me chamarei" }
    },
    quiz: {
      question_fr: "Comment dit-on 'eu me chamava' (Imparfait) ?",
      options: ["je m'appelais", "je m'appelle", "je m'appellerai"],
      correctIndex: 0,
      explanation: "'Je m'appelais' é o Imparfait, expressando um estado contínuo no passado."
    },
    sentence_puzzle: {
      sentence_fr: "Bonjour ! Je m'appelle Pedro Henrique Soares Silva.",
      words_scrambled: ["Silva.", "Bonjour", "!", "Soares", "m'appelle", "Pedro", "Henrique", "Je"]
    }
  },
  vol1_chap_02: {
    verb: "ÉTUDIER",
    verb_pt: "Estudar / Aprender",
    tenses: {
      present: { fr: "j'étudie", pt: "eu estudo" },
      passe_compose: { fr: "j'ai étudié", pt: "eu estudei" },
      imparfait: { fr: "j'étudiais", pt: "eu estudava" },
      futur_simple: { fr: "j'étudierai", pt: "eu estudarei" }
    },
    quiz: {
      question_fr: "Quel est le Passé Composé de 'étudier' ?",
      options: ["j'étudiais", "j'ai étudié", "j'étudierai"],
      correctIndex: 1,
      explanation: "No Passé Composé regular dos verbos em -er: usa-se o auxiliar 'avoir' + particípio 'étudié'."
    },
    sentence_puzzle: {
      sentence_fr: "Le théâtre m'a appris à poser ma voix.",
      words_scrambled: ["poser", "Le", "voix.", "appris", "à", "ma", "théâtre", "m'a"]
    }
  },
  vol1_chap_03: {
    verb: "OBTENIR",
    verb_pt: "Obter / Conquistar",
    tenses: {
      present: { fr: "j'obtiens", pt: "eu obtenho" },
      passe_compose: { fr: "j'ai obtenu", pt: "eu obtive" },
      imparfait: { fr: "j'obtenais", pt: "eu obtinha" },
      futur_simple: { fr: "j'obtiendrai", pt: "eu obterei" }
    },
    quiz: {
      question_fr: "Comment dit-on 'eu obtive' (Passé Composé) ?",
      options: ["j'obtiens", "j'ai obtenu", "j'obtenais"],
      correctIndex: 1,
      explanation: "O particípio passado de 'obtenir' é 'obtenu' (verbo irregular de 3º grupo)."
    },
    sentence_puzzle: {
      sentence_fr: "J'ai obtenu ma certification internationale Autodesk Maya.",
      words_scrambled: ["Maya.", "J'ai", "certification", "Autodesk", "ma", "internationale", "obtenu"]
    }
  },
  vol1_chap_04: {
    verb: "RENCONTRER",
    verb_pt: "Encontrar / Conhecer",
    tenses: {
      present: { fr: "je rencontre", pt: "eu encontro" },
      passe_compose: { fr: "j'ai rencontré", pt: "eu encontrei" },
      imparfait: { fr: "je rencontrais", pt: "eu encontrava" },
      futur_simple: { fr: "je rencontrerai", pt: "eu encontrarei" }
    },
    quiz: {
      question_fr: "Comment dit-on 'eu encontrei' (Passé Composé) ?",
      options: ["j'ai rencontré", "je rencontrais", "je rencontre"],
      correctIndex: 0,
      explanation: "'J'ai rencontré' indica uma ação pontual e concluída no passado."
    },
    sentence_puzzle: {
      sentence_fr: "Ariano Suassuna m'a transmis la passion du Mouvement Armorial.",
      words_scrambled: ["Armorial.", "la", "Suassuna", "passion", "Ariano", "du", "m'a", "transmis", "Mouvement"]
    }
  },
  vol1_chap_05: {
    verb: "GÉRER",
    verb_pt: "Gerenciar / Administrar",
    tenses: {
      present: { fr: "je gère", pt: "eu gerencio" },
      passe_compose: { fr: "j'ai géré", pt: "eu gerenciei" },
      imparfait: { fr: "je gérais", pt: "eu gerenciava" },
      futur_simple: { fr: "je gérerai", pt: "eu gerenciarei" }
    },
    quiz: {
      question_fr: "Quel est le Futur Simple de 'gérer' ?",
      options: ["je gérais", "je gère", "je gérerai"],
      correctIndex: 2,
      explanation: "'Je gérerai' expressa uma ação futura certa."
    },
    sentence_puzzle: {
      sentence_fr: "J'ai dirigé les opérations et les partenariats stratégiques.",
      words_scrambled: ["partenariats", "les", "opérations", "dirigé", "stratégiques.", "J'ai", "et", "les"]
    }
  },
  vol1_chap_06: {
    verb: "CONCEVOIR",
    verb_pt: "Conceber / Projetar / Desenhar",
    tenses: {
      present: { fr: "je conçois", pt: "eu concebo/projeto" },
      passe_compose: { fr: "j'ai conçu", pt: "eu concebi/projetei" },
      imparfait: { fr: "je concevais", pt: "eu concebia" },
      futur_simple: { fr: "je concevrai", pt: "eu conceberei/projetarei" }
    },
    quiz: {
      question_fr: "Comment dit-on 'eu projetei' (Passé Composé) ?",
      options: ["j'ai conçu", "je conçois", "je concevais"],
      correctIndex: 0,
      explanation: "O particípio passado de 'concevoir' é 'conçu'."
    },
    sentence_puzzle: {
      sentence_fr: "Nous avons automatisé les processus juridiques avec l'intelligence artificielle.",
      words_scrambled: ["l'intelligence", "processus", "automatisé", "artificielle.", "avec", "les", "juridiques", "Nous", "avons"]
    }
  },
  vol1_chap_07: {
    verb: "APPRENDRE",
    verb_pt: "Aprender / Ensinar",
    tenses: {
      present: { fr: "j'apprends", pt: "eu aprendo" },
      passe_compose: { fr: "j'ai appris", pt: "eu aprendi" },
      imparfait: { fr: "j'apprenais", pt: "eu aprendia" },
      futur_simple: { fr: "j'apprendrai", pt: "eu aprenderei" }
    },
    quiz: {
      question_fr: "Quel est l'Imparfait de 'apprendre' ?",
      options: ["j'apprends", "j'ai appris", "j'apprenais"],
      correctIndex: 2,
      explanation: "'J'apprenais' indica o processo contínuo de aprendizado no passado."
    },
    sentence_puzzle: {
      sentence_fr: "L'Executive MBA m'a apporté la rigueur financière et la gouvernance.",
      words_scrambled: ["rigueur", "L'Executive", "m'a", "la", "financière.", "MBA", "apporté", "et", "la", "gouvernance"]
    }
  },
  vol1_chap_08: {
    verb: "DÉPLOYER",
    verb_pt: "Implantar / Fazer deploy",
    tenses: {
      present: { fr: "je déploie", pt: "eu implanto" },
      passe_compose: { fr: "j'ai déployé", pt: "eu implantei" },
      imparfait: { fr: "je déployais", pt: "eu implantava" },
      futur_simple: { fr: "je déploierai", pt: "eu implantarei" }
    },
    quiz: {
      question_fr: "Comment dit-on 'eu implantarei' (Futur Simple) ?",
      options: ["je déploierai", "j'ai déployé", "je déploie"],
      correctIndex: 0,
      explanation: "'Je déploierai' é o Futur Simple regular dos verbos terminados em -oyer."
    },
    sentence_puzzle: {
      sentence_fr: "Les agents autonomes résolvent des missions complexes avec précision.",
      words_scrambled: ["avec", "autonomes", "résolvent", "précision.", "des", "missions", "Les", "complexes", "agents"]
    }
  },
  vol1_chap_09: {
    verb: "ARRIVER",
    verb_pt: "Chegar / Acontecer",
    tenses: {
      present: { fr: "j'arrive", pt: "eu chego" },
      passe_compose: { fr: "je suis arrivé", pt: "eu cheguei" },
      imparfait: { fr: "j'arrivais", pt: "eu chegava" },
      futur_simple: { fr: "j'arriverai", pt: "eu chegarei" }
    },
    quiz: {
      question_fr: "Comment dit-on 'eu cheguei' (Passé Composé) ?",
      options: ["j'ai arrivé", "je suis arrivé", "j'arrivais"],
      correctIndex: 1,
      explanation: "ATENÇÃO: O verbo 'arriver' usa o auxiliar ÊTRE no Passé Composé: 'je suis arrivé(e)'."
    },
    sentence_puzzle: {
      sentence_fr: "Bienvenue en France Monsieur Soares Silva !",
      words_scrambled: ["France", "Bienvenue", "Silva", "en", "!", "Monsieur", "Soares"]
    }
  },
  vol1_chap_10: {
    verb: "PENSAGE_PENSER",
    verb: "PENSER",
    verb_pt: "Pensar / Refletir",
    tenses: {
      present: { fr: "je pense", pt: "eu penso" },
      passe_compose: { fr: "j'ai pensé", pt: "eu pensei" },
      imparfait: { fr: "je pensais", pt: "eu pensava" },
      futur_simple: { fr: "je penserai", pt: "eu pensarei" }
    },
    quiz: {
      question_fr: "Comment dit-on 'eu pensava' (Imparfait) ?",
      options: ["je pensais", "j'ai pensé", "je penserai"],
      correctIndex: 0,
      explanation: "'Je pensais' descreve a reflexão contínua no passado."
    },
    sentence_puzzle: {
      sentence_fr: "Aux grands hommes la patrie reconnaissante.",
      words_scrambled: ["reconnaissante.", "la", "hommes", "Aux", "patrie", "grands"]
    }
  },
  vol1_chap_11: {
    verb: "RESSENTIR",
    verb_pt: "Sentir / Experimentar sentimento",
    tenses: {
      present: { fr: "je ressens", pt: "eu sinto" },
      passe_compose: { fr: "j'ai ressenti", pt: "eu senti" },
      imparfait: { fr: "je ressentais", pt: "eu sentia" },
      futur_simple: { fr: "je ressentirai", pt: "eu sentirei" }
    },
    quiz: {
      question_fr: "Comment dit-on 'eu senti' (Passé Composé) ?",
      options: ["j'ai ressenti", "je ressens", "je ressentais"],
      correctIndex: 0,
      explanation: "O particípio passado de 'ressentir' é 'ressenti'."
    },
    sentence_puzzle: {
      sentence_fr: "La langue française devient ici le chant de la poésie.",
      words_scrambled: ["poésie.", "La", "le", "devient", "de", "langue", "chant", "la", "française", "ici"]
    }
  },
  vol1_chap_12: {
    verb: "CONSTRUIRE",
    verb_pt: "Construir / Edificar",
    tenses: {
      present: { fr: "je construis", pt: "eu construo" },
      passe_compose: { fr: "j'ai construit", pt: "eu construí" },
      imparfait: { fr: "je construisais", pt: "eu construía" },
      futur_simple: { fr: "je construirai", pt: "eu construirei" }
    },
    quiz: {
      question_fr: "Quel est le Futur Simple de 'construire' ?",
      options: ["je construis", "j'ai construit", "je construirai"],
      correctIndex: 2,
      explanation: "'Je construirai' expressa o compromisso com a criação futura."
    },
    sentence_puzzle: {
      sentence_fr: "Montréal réunit la recherche scientifique et la culture francophone.",
      words_scrambled: ["francophone.", "la", "scientifique", "Montréal", "culture", "réunit", "la", "et", "recherche"]
    }
  },
  vol2_chap_01: {
    verb: "DESSINER",
    verb_pt: "Desenhar / Ilustrar",
    tenses: {
      present: { fr: "je dessine", pt: "eu desenho" },
      passe_compose: { fr: "j'ai dessiné", pt: "eu desenhei" },
      imparfait: { fr: "je dessinais", pt: "eu desenhava" },
      futur_simple: { fr: "je designerai", pt: "eu desenharei" }
    },
    quiz: {
      question_fr: "Comment dit-on 'eu desenhei' (Passé Composé) ?",
      options: ["j'ai dessiné", "je dessinais", "je dessine"],
      correctIndex: 0,
      explanation: "Verbo regular em -er: particípio 'dessiné' com auxiliar avoir."
    },
    sentence_puzzle: {
      sentence_fr: "La Grand-Place de Bruxelles est le cœur vivant de la bande dessinée.",
      words_scrambled: ["vivant", "La", "Bruxelles", "est", "dessinée.", "bande", "le", "de", "cœur", "Grand-Place", "la", "de"]
    }
  },
  vol2_chap_02: {
    verb: "DÉFENDRE",
    verb_pt: "Defender / Proteger",
    tenses: {
      present: { fr: "je défends", pt: "eu defendo" },
      passe_compose: { fr: "j'ai défendu", pt: "eu defendi" },
      imparfait: { fr: "je défendais", pt: "eu defendia" },
      futur_simple: { fr: "je défendrai", pt: "eu defenderei" }
    },
    quiz: {
      question_fr: "Quel est le Passé Composé de 'défendre' ?",
      options: ["je défends", "j'ai défendu", "je défendais"],
      correctIndex: 1,
      explanation: "Verbo do 3º grupo terminado em -dre: particípio 'défendu'."
    },
    sentence_puzzle: {
      sentence_fr: "Guillaume Tell a osé défier la tyrannie pour la liberté.",
      words_scrambled: ["défier", "la", "Guillaume", "tyrannie", "osé", "pour", "liberté.", "Tell", "la", "a"]
    }
  },
  vol2_chap_03: {
    verb: "TRANSMETTRE",
    verb_pt: "Transmitir / Passar adiante",
    tenses: {
      present: { fr: "je transmets", pt: "eu transmito" },
      passe_compose: { fr: "j'ai transmis", pt: "eu transmiti" },
      imparfait: { fr: "je transmettais", pt: "eu transmitia" },
      futur_simple: { fr: "je transmettrai", pt: "eu transmitirei" }
    },
    quiz: {
      question_fr: "Comment dit-on 'eu transmiti' (Passé Composé) ?",
      options: ["j'ai transmis", "je transmettais", "je transmets"],
      correctIndex: 0,
      explanation: "O particípio passado de 'transmettre' é 'transmis'."
    },
    sentence_puzzle: {
      sentence_fr: "Le sage sait écouter la voix du vent et la ruse de Leuk.",
      words_scrambled: ["vent", "Le", "sait", "la", "Leuk.", "sage", "écouter", "voix", "du", "et", "ruse", "de", "la"]
    }
  },
  vol2_chap_04: {
    verb: "VOLER",
    verb_pt: "Voar / Plainar",
    tenses: {
      present: { fr: "je vole", pt: "eu voo" },
      passe_compose: { fr: "j'ai volé", pt: "eu voei" },
      imparfait: { fr: "je volais", pt: "eu voava" },
      futur_simple: { fr: "je volerai", pt: "eu voarei" }
    },
    quiz: {
      question_fr: "Comment dit-on 'eu voava' (Imparfait) ?",
      options: ["je volais", "j'ai volé", "je volerai"],
      correctIndex: 0,
      explanation: "'Je volais' indica a ação contínua de voar no passado."
    },
    sentence_puzzle: {
      sentence_fr: "Le canot magique s'envole au-dessus des forêts enneigées du Québec.",
      words_scrambled: ["des", "Le", "canot", "enneigées", "au-dessus", "magique", "s'envole", "forêts", "du", "Québec."]
    }
  }
};

console.log('Desafios verbais preparados para', Object.keys(VERB_CHALLENGES).length, 'capítulos!');
