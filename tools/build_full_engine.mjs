import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEST = path.resolve(__dirname, '..', 'app', 'js', 'story_engine.js');

// Lê o arquivo atual para manter o texto integral dos capítulos existentes
const originalContent = fs.readFileSync(DEST, 'utf-8');

// Injeta os novos métodos e estrutura de Obras (Works) no final da classe
const updatedContent = originalContent.replace(
  `  getScene(globalSceneIndex) {`,
  `  // ======================================================================
  // CATÁLOGO COMPLETO DE QUADRINHOS ESTILO NETFLIX (WORKS / OBRAS)
  // ======================================================================
  get works() {
    return [
      {
        id: "pedro_biography",
        category: "featured",
        country: "Recife & Paris (Brésil / France)",
        flag: "🇧🇷🇫🇷",
        badge: "AUTOBIOGRAFIA OFICIAL",
        coverImage: "../assets/img/p1_1.png",
        title: "Pedro Hagah : De Recife à l'IA Mondiale",
        title_pt: "Pedro Hagah: Do Recife à IA Mundial",
        duration: "12 Capítulos • 30 Cenas",
        synopsis_fr: "La trajectoire authentique de Pedro Henrique Soares Silva, des ruelles historiques de Recife et du Porto Digital jusqu'au sommet de l'intelligence artificielle en France et au Québec.",
        synopsis_pt: "A trajetória real de Pedro Henrique Soares Silva, da SAGA e Ariano Suassuna à JT Seu Carro PE e arquitetura de IA em Paris e Montréal.",
        chapters: this.volumes.vol_1
      },
      {
        id: "belgique_bd",
        category: "francophonie",
        country: "Bélgica (Bruxelles)",
        flag: "🇧🇪",
        badge: "NONA ARTE & CULTURA",
        coverImage: "../assets/img/bruxelles_grand_place.jpg",
        title: "Bruxelles & Le Neuvième Art",
        title_pt: "Bruxelas e a Capital da Nona Arte",
        duration: "1 Capítulo • 2 Cenas",
        synopsis_fr: "La Grand-Place de Bruxelles, le Manneken-Pis et la naissance des plus grands classiques de la bande dessinée franco-belge.",
        synopsis_pt: "A imponente Grand-Place, a magia do Manneken-Pis e o berço dos grandes mestres dos quadrinhos na Europa.",
        chapters: [this.volumes.vol_2[0]]
      },
      {
        id: "suisse_tell",
        category: "francophonie",
        country: "Suíça Romanda (Genève)",
        flag: "🇨🇭",
        badge: "DIPLOMACIA & LIBERDADE",
        coverImage: "../assets/img/geneve_lac_leman.jpg",
        title: "Genève & Guillaume Tell",
        title_pt: "Genebra e a Lenda de Guilherme Tell",
        duration: "1 Capítulo • 2 Cenas",
        synopsis_fr: "Le Lac Léman, le Jet d'Eau majestueux et l'acte de bravoure légendaire de Guillaume Tell pour la liberté helvétique.",
        synopsis_pt: "O Jet d'Eau sobre o Lago Léman e a coragem inabalável de Guilherme Tell na fundação da Suíça de língua francesa.",
        chapters: [this.volumes.vol_2[1]]
      },
      {
        id: "senegal_griot",
        category: "francophonie",
        country: "Senegal (Dakar & Gorée)",
        flag: "🇸🇳",
        badge: "TRADIÇÃO ORAL & TERANGA",
        coverImage: "../assets/img/dakar_griot_baobab.jpg",
        title: "Sénégal : Le Baobab et Leuk-le-Lièvre",
        title_pt: "Senegal: O Baobá Sagrado e Leuk-le-Lièvre",
        duration: "1 Capítulo • 2 Cenas",
        synopsis_fr: "Sous le grand baobab de Dakar, la sagesse du Griot et les fables de Leuk-le-Lièvre célèbrent la Teranga et la poésie africaine.",
        synopsis_pt: "A sabedoria imemorial dos griots e as astutas lições de Leuk-le-Lièvre na Terra da Teranga e da Negritude.",
        chapters: [this.volumes.vol_2[2]]
      },
      {
        id: "quebec_chasse",
        category: "francophonie",
        country: "Québec (Canada)",
        flag: "🇨🇦",
        badge: "FOLCLORE NÓRDICO",
        coverImage: "../assets/img/quebec_chasse_galerie.jpg",
        title: "Québec : La Chasse-Galerie boréale",
        title_pt: "Québec: A Canoa Voadora da Chasse-Galerie",
        duration: "1 Capítulo • 2 Cenas",
        synopsis_fr: "La nuit du Réveillon dans les forêts boréales canadiennes : le pacte mystérieux pour survoler le Château Frontenac en canot magique.",
        synopsis_pt: "A lendária canoa que voa sobre as florestas congeladas e as torres do Château Frontenac na noite de Ano Novo.",
        chapters: [this.volumes.vol_2[3]]
      },
      {
        id: "france_pantheon",
        category: "francophonie",
        country: "França (Paris & Bretagne)",
        flag: "🇫🇷",
        badge: "ILUMINISMO & HISTÓRIA",
        coverImage: "../assets/img/p2_1.png",
        title: "Paris : Les Lumières et la Cité d'Ys",
        title_pt: "Paris: O Iluminismo e a Cidade de Ys",
        duration: "2 Capítulos • 4 Cenas",
        synopsis_fr: "Des grands esprits du Panthéon aux légendes celtiques de la baie de Douarnenez et de la cité engloutie d'Ys.",
        synopsis_pt: "O templo dos imortais em Paris e a lenda mágica do Rei Gradlon nas costas oceânicas da Bretanha.",
        chapters: [this.volumes.vol_1[9], this.volumes.vol_2[4]]
      },
      {
        id: "maroc_medina",
        category: "francophonie",
        country: "Marrocos (Fès)",
        flag: "🇲🇦",
        badge: "MEDINA & SABEDORIA",
        coverImage: "../assets/img/p1_2.png",
        title: "Maroc : Fès et l'Héritage d'Al Quaraouiyine",
        title_pt: "Marrocos: Fez e a Sabedoria da Medina",
        duration: "1 Capítulo • 2 Cenas",
        synopsis_fr: "Les ruelles parfumées de la médina de Fès, les fontaines en faïence et la plus ancienne université au monde.",
        synopsis_pt: "O aroma do chá com hortelã, as caravanas e a biblioteca histórica da mais antiga universidade do planeta.",
        chapters: [
          {
            id: "vol2_chap_07",
            title: "Capítulo 7 : Fès (Maroc) — Les Secrets de la Médina",
            location: "FÈS, MAROC",
            environment: "cafe_procope",
            avatar: "🕌",
            image: "../assets/img/p1_2.png",
            dossier: {
              badge: "CULTURA MAGREBINA",
              title_fr: "La Plus Ancienne Université du Monde à Fès",
              title_pt: "A Mais Antiga Universidade do Mundo em Fez",
              article_fr: "Fondée en 859 par Fatima al-Fihriya, l'Université Al Quaraouiyine à Fès est reconnue par l'UNESCO comme le plus ancien établissement d'enseignement supérieur toujours en activité. Le Maroc incarne un carrefour linguistique exceptionnel où le français dialogue avec l'arabe et l'amazigh.",
              article_pt: "Fundada em 859 por Fatima al-Fihriya, a Universidade Al Quaraouiyine em Fez é reconhecida pela UNESCO como a mais antiga instituição de ensino superior em atividade no mundo. O Marrocos representa uma encruzilhada linguística única onde o francês convive com o árabe e o amazigh."
            },
            scenes: [
              {
                speaker: "PEDRO",
                speaker_name: "Pedro Hagah",
                avatar: "👨‍💻",
                location: "📍 Médina de Fès, Maroc",
                image: "../assets/img/p1_2.png",
                sfx: "SALAM!",
                caption: "FÈS — L'immersion dans les ruelles millénaires de la médina.",
                dialogue_fr: "Au cœur de la médina de Fès, la parole et le savoir traversent les siècles avec élégance.",
                dialogue_pt: "No coração da medina de Fez, a palavra e o saber atravessam os séculos com elegância.",
                ipa: "[o kœʁ də la me.di.na də fɛs | la pa.ʁɔl e lə sa.vwaʁ tʁa.vɛʁs le sjɛkl a.vɛk e.le.ɡɑ̃s]"
              },
              {
                speaker: "GUIDE",
                speaker_name: "Tariq (Guide de Fès)",
                avatar: "🕌",
                location: "📍 Université Al Quaraouiyine",
                image: "../assets/img/p1_2.png",
                sfx: "THÉ!",
                caption: "FÈS — Le partage du thé à la menthe et de l'hospitalité.",
                dialogue_fr: "Bienvenue à Fès ! Buvez ce thé à la menthe : le savoir ici commence par l'écoute mutuelle.",
                dialogue_pt: "Bem-vindo a Fez! Beba este chá com hortelã: o conhecimento aqui começa pela escuta mútua.",
                ipa: "[bjɛ̃.və.ny a fɛs | by.ve sə te a la mɑ̃t | lə sa.vwaʁ i.si kɔ.mɑ̃s paʁ l‿e.kut my.tɥɛl]"
              }
            ]
          }
        ]
      },
      {
        id: "haiti_liberte",
        category: "francophonie",
        country: "Haiti (Cap-Haïtien)",
        flag: "🇭🇹",
        badge: "REVOLUÇÃO DE 1804",
        coverImage: "../assets/img/dakar_goree.png",
        title: "Haïti : La Citadelle et les Tambours de 1804",
        title_pt: "Haiti: A Cidadela e os Heróis de 1804",
        duration: "1 Capítulo • 2 Cenas",
        synopsis_fr: "La Citadelle Laferrière, vigie monumentale des Caraïbes et symbole éternel de la première république noire libre.",
        synopsis_pt: "A colossal fortaleza caribenha e o heroísmo de Toussaint Louverture na conquista da liberdade universal.",
        chapters: [
          {
            id: "vol2_chap_08",
            title: "Capítulo 8 : Haïti — La Citadelle Laferrière et la Liberté",
            location: "MILOT, HAÏTI",
            environment: "goree_ocean",
            avatar: "⛰️",
            image: "../assets/img/dakar_goree.png",
            dossier: {
              badge: "HISTOIRE & LIBERTÉ",
              title_fr: "1804 : La Première République Noire du Monde",
              title_pt: "1804: A Primeira República Negra do Mundo",
              article_fr: "Sous l'impulsion de Toussaint Louverture et Jean-Jacques Dessalines, Haïti est devenue en 1804 la première nation indépendante d'Amérique latine et la première république noire du monde. La Citadelle Laferrière, perchée à 900 mètres d'altitude, reste un chef-d'œuvre de souveraineté.",
              article_pt: "Liderado por Toussaint Louverture e Jean-Jacques Dessalines, o Haiti tornou-se em 1804 a primeira nação independente da América Latina e a primeira república negra do mundo. A Cidadela Laferrière permanece até hoje como o maior monumento à liberdade humana no Caribe."
            },
            scenes: [
              {
                speaker: "PEDRO",
                speaker_name: "Pedro Hagah",
                avatar: "👨‍💻",
                location: "📍 Citadelle Laferrière, Haïti",
                image: "../assets/img/dakar_goree.png",
                sfx: "TAMBOUR!",
                caption: "HAÏTI — La fierté devant la plus grande forteresse des Caraïbes.",
                dialogue_fr: "La liberté proclamée ici en 1804 a inspiré le monde entier : la dignité ne se négocie jamais.",
                dialogue_pt: "A liberdade proclamada aqui em 1804 inspirou o mundo inteiro: a dignidade nunca se negocia.",
                ipa: "[la li.bɛʁ.te pʁɔ.kla.me i.si ɑ̃ mil ɥit sɑ̃ katʁ | a ɛ̃s.pi.ʁe lə mɔ̃d ɑ̃.tje]"
              },
              {
                speaker: "MARIE",
                speaker_name: "Yveline (Historienne de Milot)",
                avatar: "🇭🇹",
                location: "📍 Citadelle Laferrière, Haïti",
                image: "../assets/img/dakar_goree.png",
                sfx: "LIBERTÉ!",
                caption: "HAÏTI — La force des racines et de la langue.",
                dialogue_fr: "Nos ancêtres ont brisé les chaînes : le français et le créole sont ici les voix de notre victoire.",
                dialogue_pt: "Nossos ancestrais quebraram as correntes: o francês e o crioulo são aqui as vozes da nossa vitória.",
                ipa: "[noz‿ɑ̃.sɛtʁ ɔ̃ bʁi.ze le ʃɛn | lə fʁɑ̃.sɛ e lə kʁe.ɔl sɔ̃ i.si le vwa də nɔtʁ vik.twaʁ]"
              }
            ]
          }
        ]
      },
      {
        id: "rdc_kinshasa",
        category: "francophonie",
        country: "RD Congo (Kinshasa)",
        flag: "🇨🇩",
        badge: "RUMBA & SAPE",
        coverImage: "../assets/img/p1_1.png",
        title: "RD Congo : Kinshasa et la Rumba du Fleuve",
        title_pt: "RD Congo: Kinshasa e a Elegância dos Sapeurs",
        duration: "1 Capítulo • 2 Cenas",
        synopsis_fr: "Kinshasa la belle, la plus grande mégapole francophone du globe. Des accords de rumba à l'élégance légendaire des Sapeurs.",
        synopsis_pt: "Kinshasa, a maior metrópole francófona do mundo, com o balanço da rumba congolesa e o visual brilhante da SAPE.",
        chapters: [
          {
            id: "vol2_chap_09",
            title: "Capítulo 9 : Kinshasa — Le Fleuve Congo et l'Art de la Sape",
            location: "KINSHASA, RD CONGO",
            environment: "dakar_tech",
            avatar: "🎷",
            image: "../assets/img/p1_1.png",
            dossier: {
              badge: "MÉGAPOLE AFRICAINE",
              title_fr: "Kinshasa : La Capitale Mondiale de la Francophonie",
              title_pt: "Kinshasa: A Capital Mundial da Francofonia",
              article_fr: "Avec plus de dix-sept millions d'habitants, Kinshasa est la ville la plus peuplée de la Francophonie, surpassant Paris. La Rumba congolaise, inscrite au patrimoine immatériel de l'UNESCO, et le mouvement des Sapeurs (Société des Ambianceurs et des Personnes Élégantes) en font un phare culturel mondial.",
              article_pt: "Com mais de 17 milhões de habitantes, Kinshasa é a cidade mais populosa de toda a comunidade de países que falam francês, superando Paris. A rumba congolesa, tombada pela UNESCO, e o movimento da SAPE fazem de Kinshasa uma das capitais criativas mais vibrantes do planeta."
            },
            scenes: [
              {
                speaker: "PEDRO",
                speaker_name: "Pedro Hagah",
                avatar: "👨‍💻",
                location: "📍 Bord du Fleuve Congo, Kinshasa",
                image: "../assets/img/p1_1.png",
                sfx: "RUMBA!",
                caption: "KINSHASA — La contemplation du puissant fleuve Congo.",
                dialogue_fr: "Kinshasa vibre d'une créativité sans égale : le fleuve Congo transporte l'énergie de tout un continent.",
                dialogue_pt: "Kinshasa vibra com uma criatividade sem igual: o rio Congo transporta a energia de todo um continente.",
                ipa: "[kin.ʃa.sa vibʁ d‿yn kʁe.a.ti.vi.te sɑ̃z‿e.ɡal | lə flœv kɔ̃.ɡo tʁɑ̃s.pɔʁt l‿e.nɛʁ.ʒi]"
              },
              {
                speaker: "LUCAS",
                speaker_name: "Dieudonné (Artiste & Sapeur)",
                avatar: "👔",
                location: "📍 Boulevard du 30 Juin, Kinshasa",
                image: "../assets/img/p1_1.png",
                sfx: "STYLE!",
                caption: "KINSHASA — La philosophie de l'élégance et de la paix.",
                dialogue_fr: "La Sape est un art de vivre, un hommage à la joie et à la courtoisie fraternelle.",
                dialogue_pt: "A Sape é uma arte de viver, uma homenagem à alegria e à cortesia fraterna.",
                ipa: "[la sap ɛt‿œ̃n‿aʁ də vivʁ | œ̃n‿ɔ.maʒ a la ʒwa e a la kuʁ.twa.zi]"
              }
            ]
          }
        ]
      },
      {
        id: "madagascar_baobab",
        category: "francophonie",
        country: "Madagascar (Morondava)",
        flag: "🇲🇬",
        badge: "NATUREZA & TRADIÇÃO",
        coverImage: "../assets/img/dakar_griot_baobab.jpg",
        title: "Madagascar : L'Allée des Baobabs et Ibonia",
        title_pt: "Madagascar: A Estrada dos Baobás e Ibonia",
        duration: "1 Capítulo • 2 Cenas",
        synopsis_fr: "L'Île Rouge de l'Océan Indien, ses baobabs millénaires géants et les légendes épiques du héros Ibonia.",
        synopsis_pt: "A Ilha Vermelha do Oceano Índico, seus baobás milenares e os contos heroicos do lendário Ibonia.",
        chapters: [
          {
            id: "vol2_chap_10",
            title: "Capítulo 10 : Madagascar — L'Allée des Baobabs et le Mythe d'Ibonia",
            location: "MORONDAVA, MADAGASCAR",
            environment: "dakar_breeze",
            avatar: "🌳",
            image: "../assets/img/dakar_griot_baobab.jpg",
            dossier: {
              badge: "BIODIVERSITÉ UNIQUE",
              title_fr: "L'Allée des Baobabs et les Récits Malgaches",
              title_pt: "A Alameda dos Baobás e as Tradições Malgaxes",
              article_fr: "Madagascar, la grande île de l'Océan Indien, abrite six des huit espèces de baobabs existant sur Terre. L'épopée d'Ibonia, transmise oralement de génération en génération, raconte la quête héroïque de la vérité et de l'harmonie avec la nature.",
              article_pt: "Madagascar, no Oceano Índico, abriga seis das oito espécies de baobá do planeta Terra. A epopeia de Ibonia, passada oralmente por gerações, narra a jornada heroica pela verdade e pelo equilíbrio com a natureza."
            },
            scenes: [
              {
                speaker: "PEDRO",
                speaker_name: "Pedro Hagah",
                avatar: "👨‍💻",
                location: "📍 Allée des Baobabs, Morondava",
                image: "../assets/img/dakar_griot_baobab.jpg",
                sfx: "WIND!",
                caption: "MADAGASCAR — Le coucher de soleil sur les arbres géants de Menabe.",
                dialogue_fr: "Ces baobabs millénaires sont les sentinelles du temps : ils nous rappellent la beauté de notre terre.",
                dialogue_pt: "Estes baobás milenares são as sentinelas do tempo: eles nos lembram a beleza da nossa terra.",
                ipa: "[se ba.ɔ.bab mi.le.nɛʁ sɔ̃ le sɑ̃.ti.nɛl dy tɑ̃ | il nu ʁa.pɛl la bo.te də nɔtʁ tɛʁ]"
              },
              {
                speaker: "MARIE",
                speaker_name: "Soa (Conteuse de Morondava)",
                avatar: "🌺",
                location: "📍 Allée des Baobabs, Madagascar",
                image: "../assets/img/dakar_griot_baobab.jpg",
                sfx: "CONTES!",
                caption: "MADAGASCAR — La transmission des mythes ancestraux.",
                dialogue_fr: "Écoutez l'histoire d'Ibonia : celui qui respecte la parole juste ne perd jamais son chemin.",
                dialogue_pt: "Escutem a história de Ibonia: quem respeita a palavra justa nunca perde o seu caminho.",
                ipa: "[e.ku.te l‿is.twaʁ d‿i.bɔ.nja | səl.ɥi ki ʁɛs.pɛkt la pa.ʁɔl ʒyst nə pɛʁ ʒa.mɛ sɔ̃ ʃə.mɛ̃]"
              }
            ]
          }
        ]
      }
    ];
  }

  getWorks(category = null) {
    const list = this.works;
    if (!category) return list;
    return list.filter(w => w.category === category);
  }

  getWork(workId) {
    return this.works.find(w => w.id === workId) || this.works[0];
  }

  selectWork(workId) {
    const work = this.getWork(workId);
    if (work) {
      this.activeWork = work;
      this.currentVolume = workId === 'pedro_biography' ? 'vol_1' : 'vol_2';
    }
    return this.activeWork;
  }

  get activeChapters() {
    if (this.activeWork && this.activeWork.chapters) {
      return this.activeWork.chapters;
    }
    return this.chapters;
  }

  get totalTargetScenes() {
    return this.activeChapters.reduce((sum, ch) => sum + ch.scenes.length, 0);
  }

  getSeasonsList() {
    let globalIndex = 0;
    return this.activeChapters.map((chap, idx) => {
      const startIdx = globalIndex;
      globalIndex += chap.scenes.length;
      return {
        index: idx,
        startIndex: startIdx,
        id: chap.id,
        title: chap.title,
        location: chap.location,
        avatar: chap.avatar,
        scenesCount: chap.scenes.length
      };
    });
  }

  getScene(globalSceneIndex) {`
);

fs.writeFileSync(DEST, updatedContent, 'utf-8');
console.log('story_engine.js atualizado com sucesso com todo o catálogo de Obras!');
