import fs from 'fs';
import { bookPedro } from './books/book_pedro.js';
import { bookBelgique } from './books/book_belgique.js';
import { bookSuisse } from './books/book_suisse.js';
import { bookSenegal } from './books/book_senegal.js';
import { bookQuebec } from './books/book_quebec.js';
import { bookFrance } from './books/book_france.js';
import { bookMaroc } from './books/book_maroc.js';
import { bookHaiti } from './books/book_haiti.js';
import { bookRdc } from './books/book_rdc.js';
import { bookMadagascar } from './books/book_madagascar.js';

const allBooks = [
  bookPedro,
  bookBelgique,
  bookSuisse,
  bookSenegal,
  bookQuebec,
  bookFrance,
  bookMaroc,
  bookHaiti,
  bookRdc,
  bookMadagascar
];

console.log('Montando app/js/story_engine.js com', allBooks.length, 'livros e', allBooks.reduce((sum, b) => sum + b.chapters.reduce((s, c) => s + c.scenes.length, 0), 0), 'cenas...');

const code = `/**
 * MOTOR DE HISTÓRIAS EM QUADRINHOS — CATÁLOGO COMPLETO ESTILO NETFLIX
 * Mínimo de 30 cenas por livro garantido (Total: 306 cenas reais e pedagógicas)
 * 10 Obras completas com trilhas underground e objetivos pedagógicos.
 */

export class MassiveStoryEngine {
  constructor() {
    this._works = ${JSON.stringify(allBooks, null, 2)};
    this.activeWork = this._works[0];
    this.currentVolume = 'pedro_biography';
  }

  get works() {
    return this._works;
  }

  getWorks(category = null) {
    if (!category) return this._works;
    return this._works.filter(w => w.category === category);
  }

  getWork(workId) {
    return this._works.find(w => w.id === workId) || this._works[0];
  }

  selectWork(workId) {
    const work = this.getWork(workId);
    if (work) {
      this.activeWork = work;
      this.currentVolume = workId;
    }
    return this.activeWork;
  }

  get activeChapters() {
    if (this.activeWork && this.activeWork.chapters) {
      return this.activeWork.chapters;
    }
    return this._works[0].chapters;
  }

  get totalTargetScenes() {
    return this.activeChapters.reduce((sum, ch) => sum + (ch.scenes ? ch.scenes.length : 0), 0);
  }

  getSeasonsList() {
    let globalIndex = 0;
    return this.activeChapters.map((chap, idx) => {
      const startIdx = globalIndex;
      const count = chap.scenes ? chap.scenes.length : 0;
      globalIndex += count;
      return {
        index: idx,
        startIndex: startIdx,
        id: chap.id,
        title: chap.title,
        location: chap.location,
        avatar: chap.avatar,
        scenesCount: count
      };
    });
  }

  getVerbChallenge(chapterId) {
    const challenges = {
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
          explanation: "No Passé Composé dos verbos em -er: usa-se o auxiliar 'avoir' + particípio 'étudié'."
        },
        sentence_puzzle: {
          sentence_fr: "Le théâtre m'a appris à poser ma voix.",
          words_scrambled: ["poser", "Le", "voix.", "appris", "à", "ma", "théâtre", "m'a"]
        }
      },
      belgique_chap_01: {
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
      suisse_chap_01: {
        verb: "REGARDER",
        verb_pt: "Olhar / Contemplar",
        tenses: {
          present: { fr: "je regarde", pt: "eu olho" },
          passe_compose: { fr: "j'ai regardé", pt: "eu olhei" },
          imparfait: { fr: "je regardais", pt: "eu olhava" },
          futur_simple: { fr: "je regarderai", pt: "eu olharei" }
        },
        quiz: {
          question_fr: "Comment dit-on 'eu olharei' (Futur Simple) ?",
          options: ["je regarderai", "j'ai regardé", "je regardais"],
          correctIndex: 0,
          explanation: "'Je regarderai' é a forma regular no Futur Simple."
        },
        sentence_puzzle: {
          sentence_fr: "Le Jet d'Eau domine le Léman avec majesté.",
          words_scrambled: ["majesté.", "Le", "Léman", "domine", "avec", "d'Eau", "Jet", "le"]
        }
      },
      senegal_chap_01: {
        verb: "ÉCOUTER",
        verb_pt: "Escutar / Ouvir com atenção",
        tenses: {
          present: { fr: "j'écoute", pt: "eu escuto" },
          passe_compose: { fr: "j'ai écouté", pt: "eu escutei" },
          imparfait: { fr: "j'écoutais", pt: "eu escutava" },
          futur_simple: { fr: "j'écouterai", pt: "eu escutarei" }
        },
        quiz: {
          question_fr: "Comment dit-on 'eu escutava' (Imparfait) ?",
          options: ["j'écoutais", "j'ai écouté", "j'écoute"],
          correctIndex: 0,
          explanation: "'J'écoutais' é o Imparfait descritivo da tradição oral."
        },
        sentence_puzzle: {
          sentence_fr: "Sous le grand baobab nous écoutions la parole des anciens.",
          words_scrambled: ["anciens.", "Sous", "écoutions", "baobab", "la", "des", "le", "grand", "nous", "parole"]
        }
      },
      quebec_chap_01: {
        verb: "VOULOIR",
        verb_pt: "Querer / Desejar",
        tenses: {
          present: { fr: "je veux", pt: "eu quero" },
          passe_compose: { fr: "j'ai voulu", pt: "eu quis" },
          imparfait: { fr: "je voulais", pt: "eu queria" },
          futur_simple: { fr: "je voudrai", pt: "eu quererei" }
        },
        quiz: {
          question_fr: "Comment dit-on 'nós gostaríamos/querríamos' (Conditionnel) ?",
          options: ["nous voudrions", "nous voulons", "nous voulions"],
          correctIndex: 0,
          explanation: "'Nous voudrions' é o Conditionnel Présent de polidez e desejo."
        },
        sentence_puzzle: {
          sentence_fr: "Le canot volant s'élève au-dessus du Saint-Laurent.",
          words_scrambled: ["Saint-Laurent.", "Le", "s'élève", "volant", "canot", "du", "au-dessus"]
        }
      },
      france_chap_01: {
        verb: "RÉFLÉCHIR",
        verb_pt: "Refletir / Pensar profundamente",
        tenses: {
          present: { fr: "je réfléchis", pt: "eu reflito" },
          passe_compose: { fr: "j'ai réfléchi", pt: "eu refleti" },
          imparfait: { fr: "je réfléchissais", pt: "eu refletia" },
          futur_simple: { fr: "je réfléchirai", pt: "eu refletirei" }
        },
        quiz: {
          question_fr: "Comment dit-on 'eu refleti' (Passé Composé) ?",
          options: ["j'ai réfléchi", "je réfléchissais", "je réfléchis"],
          correctIndex: 0,
          explanation: "Verbo do 2º grupo (-ir): particípio 'réfléchi' com auxiliar avoir."
        },
        sentence_puzzle: {
          sentence_fr: "Au Café Procope les philosophes ont éclairé l'esprit humain.",
          words_scrambled: ["humain.", "Au", "les", "Procope", "éclairé", "Café", "philosophes", "ont", "l'esprit"]
        }
      },
      maroc_chap_01: {
        verb: "SAVOIR",
        verb_pt: "Saber / Conhecer",
        tenses: {
          present: { fr: "je sais", pt: "eu sei" },
          passe_compose: { fr: "j'ai su", pt: "eu soube" },
          imparfait: { fr: "je savais", pt: "eu sabia" },
          futur_simple: { fr: "je saurai", pt: "eu saberei" }
        },
        quiz: {
          question_fr: "Quel est le Passé Composé de 'savoir' ?",
          options: ["j'ai su", "je savais", "je sais"],
          correctIndex: 0,
          explanation: "O particípio passado de 'savoir' é irregular: 'su'."
        },
        sentence_puzzle: {
          sentence_fr: "La patience construit ce que la hâte détruit.",
          words_scrambled: ["détruit.", "La", "ce", "construit", "patience", "que", "hâte", "la"]
        }
      },
      haiti_chap_01: {
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
          options: ["j'ai défendu", "je défendais", "je défends"],
          correctIndex: 0,
          explanation: "Verbo do 3º grupo: particípio 'défendu'."
        },
        sentence_puzzle: {
          sentence_fr: "La Citadelle Laferrière protège la liberté conquise en mille huit cent quatre.",
          words_scrambled: ["quatre.", "La", "protège", "Laferrière", "liberté", "Citadelle", "la", "conquise", "en", "mille", "huit", "cent"]
        }
      },
      rdc_chap_01: {
        verb: "CRÉER",
        verb_pt: "Criar / Produzir / Inventar",
        tenses: {
          present: { fr: "je crée", pt: "eu crio" },
          passe_compose: { fr: "j'ai créé", pt: "eu criei" },
          imparfait: { fr: "je créais", pt: "eu criava" },
          futur_simple: { fr: "je créerai", pt: "eu criarei" }
        },
        quiz: {
          question_fr: "Comment dit-on 'eu criei' (Passé Composé) ?",
          options: ["j'ai créé", "je créais", "je crée"],
          correctIndex: 0,
          explanation: "Verbo regular em -er: particípio 'créé'."
        },
        sentence_puzzle: {
          sentence_fr: "À Kinshasa la musique transforme la ville en fête éclatante.",
          words_scrambled: ["éclatante.", "À", "la", "Kinshasa", "transforme", "musique", "la", "ville", "en", "fête"]
        }
      },
      madagascar_chap_01: {
        verb: "PROTÉGER",
        verb_pt: "Proteger / Preservar",
        tenses: {
          present: { fr: "je protège", pt: "eu protejo" },
          passe_compose: { fr: "j'ai protégé", pt: "eu protegi" },
          imparfait: { fr: "je protégeais", pt: "eu protegia" },
          futur_simple: { fr: "je protégerai", pt: "eu protegerei" }
        },
        quiz: {
          question_fr: "Quel est le Subjonctif de 'nous protégeons' ?",
          options: ["que nous protégions", "nous protégeons", "nous protégerons"],
          correctIndex: 0,
          explanation: "No Subjonctif Présent: 'que nous protégions' com desinência -ions."
        },
        sentence_puzzle: {
          sentence_fr: "Il faut que nous protégions les baobabs millénaires.",
          words_scrambled: ["millénaires.", "Il", "les", "faut", "que", "protégions", "nous", "baobabs"]
        }
      }
    };

    return challenges[chapterId] || {
      verb: "AVANCER",
      verb_pt: "Avançar / Progredir",
      tenses: {
        present: { fr: "j'avance", pt: "eu avanço" },
        passe_compose: { fr: "j'ai avancé", pt: "eu avancei" },
        imparfait: { fr: "j'avançais", pt: "eu avançava" },
        futur_simple: { fr: "j'avancerai", pt: "eu avançarei" }
      },
      quiz: {
        question_fr: "Quel est le Passé Composé de 'avancer' ?",
        options: ["j'ai avancé", "j'avançais", "j'avance"],
        correctIndex: 0,
        explanation: "No Passé Composé: auxiliar avoir + particípio 'avancé'."
      },
      sentence_puzzle: {
        sentence_fr: "Chaque pas nous rapproche de la maîtrise du français.",
        words_scrambled: ["français.", "Chaque", "rapproche", "pas", "de", "nous", "la", "maîtrise", "du"]
      }
    };
  }

  getScene(globalSceneIndex) {
    const total = this.totalTargetScenes;
    const clampedIndex = Math.max(0, Math.min(globalSceneIndex, total - 1));

    let remaining = clampedIndex;
    let targetChapter = this.activeChapters[0];
    let sceneInChapter = 0;

    for (let c = 0; c < this.activeChapters.length; c++) {
      const chap = this.activeChapters[c];
      const count = chap.scenes ? chap.scenes.length : 0;
      if (remaining < count) {
        targetChapter = chap;
        sceneInChapter = remaining;
        break;
      }
      remaining -= count;
    }

    const scene = targetChapter.scenes[sceneInChapter] || targetChapter.scenes[0];

    return {
      sceneNumber: clampedIndex + 1,
      totalScenes: total,
      chapterId: targetChapter.id,
      seasonTitle: targetChapter.title,
      location: scene.location,
      speaker: scene.speaker,
      speaker_name: scene.speaker_name,
      avatar: scene.avatar,
      image: scene.image || targetChapter.image,
      sfx: scene.sfx || "POW!",
      caption: scene.caption,
      dialogue_fr: scene.dialogue_fr,
      dialogue_pt: scene.dialogue_pt,
      ipa: scene.ipa,
      environment: targetChapter.environment || 'studio_tech',
      dossier: targetChapter.dossier,
      verb_challenge: this.getVerbChallenge(targetChapter.id)
    };
  }
}

export const massiveEngine = new MassiveStoryEngine();
`;

fs.writeFileSync('app/js/story_engine.js', code, 'utf8');
console.log('app/js/story_engine.js montado com sucesso absoluto!');
