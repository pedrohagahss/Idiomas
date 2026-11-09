export const bookQuebec = {
  id: "quebec_chasse",
  category: "francophonie",
  country: "Québec (Canada)",
  flag: "⚜️🇨🇦",
  badge: "LÉGENDES DU NORD",
  coverImage: "../assets/img/quebec_chasse_galerie.jpg",
  title: "Québec : La Chasse-Galerie boréale",
  title_pt: "Québec: A Lenda da Canoa Voadora",
  duration: "5 Capítulos • 30 Cenas",
  objective: "Dominar o Conditionnel Présent (voudrions, faudrait), as expressões quebequenses e a resistência cultural sob frio extremo.",
  musicTrack: "../assets/audio/opening_theme.mp3",
  soundtrack: {
    title: "Chasse Boréale Fuzz (Nordic Post-Rock)",
    file: "../assets/audio/opening_theme.mp3",
    lyrics_paragraph: "Si le blizzard déchirait le ciel noir au-dessus du Saint-Laurent, nous voudrions voler plus haut que les conifères gelés pour échapper aux ombres du pacte. Il faudrait garder le cap malgré le vertige de l'orage, serrer la rame contre sa poitrine et refuser de céder son âme à la tempête, car même dans l'hiver le plus rude la flamme intérieure ne s'éteint pas.",
    suno_prompt_paragraph: "Nordic indie rock / post-rock with heavy fuzz bass, 132 BPM, driving live-sounding compressed drums, distorted tremolo guitar layers. Male vocal urgent, raw, textured, trading verses with Marie whose voice is clear and fierce. Challenging articulatory phrases: 'blizzard déchirait' [bli.zaʁ de.ʃi.ʁɛ], 'échapper aux ombres' [e.ʃa.pe o.z‿ɔ̃bʁ], and the conditionnel endings 'nous voudrions / il faudrait' [nu vu.dʁi.jɔ̃ / il fo.dʁɛ]. Marie sings the climactic counterpoint on the final hook.",
    musical_style_paragraph: "Influências musicais: Arcade Fire (era Funeral), Godspeed You! Black Emperor, Malajube e Hubert Lenoir. Estilo Post-Rock Laurentino / Indie Rock Boreale com guitarras elétricas épicas, energia crua e reverbs imensos do inverno quebequense."
  },
  synopsis_fr: "Dans l'immensité blanche des Laurentides et les ruelles fortifiées du Vieux-Québec, la légende envoûtante de la Chasse-Galerie, la résistance francophone du 'Je me souviens' et la chaleur humaine des cabanes à sucre.",
  synopsis_pt: "Na imensidão branca de Laurentides e ruelas fortificadas de Québec, a lenda da Canoa Voadora, a resistência francófona do 'Je me souviens' e o calor das cabanas de açúcar.",
  chapters: [
    {
      id: "quebec_chap_01",
      title: "Capítulo 1 : La Forêt Boréale des Laurentides et la Nuit d'Hiver",
      location: "CAMP FORESTIÈRE DES LAURENTIDES, QUÉBEC",
      environment: "quebec_winter",
      avatar: "🌲",
      image: "../assets/img/quebec_chasse_galerie.jpg",
      dossier: {
        badge: "NATURE SAUVAGE",
        title_fr: "L'Hiver Québécois et la Vie des Bûcherons dans les Chantiers",
        title_pt: "O Inverno Quebequense e a Vida dos Lenhadores nas Florestas",
        article_fr: "Isolés pendant six mois dans les forêts denses du bouclier canadien par des températures atteignant -30°C, les bûcherons québécois forgeaient des mythes pour braver la solitude.",
        article_pt: "Isolados por seis meses sob temperaturas de até -30°C, os lenhadores do Québec criavam lendas em torno da fogueira para espantar a solidão."
      },
      scenes: [
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Forêt des Laurentides, Québec",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "CRUNCH!",
          caption: "QUÉBEC — La neige poudreuse crépitant sous les raquettes à neige.",
          dialogue_fr: "La neige recouvre les sapins géants des Laurentides : à moins vingt degrés, le silence boréal est total.",
          dialogue_pt: "A neve cobre os pinheiros gigantes de Laurentides: a vinte graus abaixo de zero, o silêncio polar é absoluto.",
          ipa: "[la nɛʒ ʁə.kuvʁ le sa.pɛ̃ ʒe.ɑ̃ de lo.ʁɑ̃.tid | a mwɛ̃ vɛ̃t də.ɡʁe | lə si.lɑ̃s bɔ.ʁe.al ɛ tɔ.tal]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Camp de Bûcherons, Laurentides",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "FUMÉE!",
          caption: "QUÉBEC — La cheminée de rondins fumant dans la nuit glaciale.",
          dialogue_fr: "Attache bien ta tuque et mets tes mitaines Pedro : ici, l'hiver ne pardonne pas aux imprudents !",
          dialogue_pt: "Aperte bem seu gorro e calce suas luvas, Pedro: aqui o inverno não perdoa os desatentos!",
          ipa: "[a.taʃ bjɛ̃ ta tyk e mɛ te mi.tɛn pe.dʁo | i.si | l‿i.vɛʁ nə paʁ.dɔn pa o.z‿ɛ̃.pʁy.dɑ̃]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Intérieur de la Cabane de Rondins",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "POÊLE!",
          caption: "QUÉBEC — La chaleur réconfortante du poêle à bois au centre de la pièce.",
          dialogue_fr: "L'odeur du bois d'érable qui brûle et la vapeur du thé chaud réchauffent instantanément le corps.",
          dialogue_pt: "O cheiro de lenha de bordo queimando e o vapor do chá quente aquecem o corpo na hora.",
          ipa: "[l‿o.dœʁ dy bwa d‿e.ʁabl ki bʁyl e la va.pœʁ dy te ʃo ʁe.ʃof ɛ̃s.tɑ̃.ta.ne.mɑ̃ lə kɔʁ]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Près de la Fenêtre Gelée",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "VENT!",
          caption: "QUÉBEC — La tempête de vent hurlant dans les branches nues.",
          dialogue_fr: "La veille du Nouvel An, les anciens parlaient toujours d'un canot capable de voler au-dessus des nuages.",
          dialogue_pt: "Na véspera de Ano Novo, os antigos sempre falavam de uma canoa capaz de voar por cima das nuvens.",
          ipa: "[la vɛj dy nu.vɛl ɑ̃ | le.z‿ɑ̃.sjɛ̃ paʁ.lɛ tu.ʒuʁ d‿œ̃ ka.no ka.pabl də vɔ.le o.də.sy de nɥaʒ]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Table de Bois Brut",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "YEUX!",
          caption: "QUÉBEC — La curiosité éveillée par le conte légendaire.",
          dialogue_fr: "Un canot qui vole dans le ciel d'hiver ? Raconte-moi cette légende fascinante de la Chasse-Galerie !",
          dialogue_pt: "Uma canoa voando no céu de inverno? Conte-me essa lenda fascinante da Chasse-Galerie!",
          ipa: "[œ̃ ka.no ki vɔl dɑ̃ lə sjɛl d‿i.vɛʁ | ʁa.kɔ̃t mwa sɛt le.ʒɑ̃d fa.si.nɑ̃t də la ʃas ɡal.ʁi]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Autour du Foyer, Laurentides",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "PACT!",
          caption: "QUÉBEC — Le pacte mystérieux conclu au cœur de la nuit.",
          dialogue_fr: "Écoute bien : c'était la nuit du trente-et-un décembre, au fond des bois les plus sombres...",
          dialogue_pt: "Ouça com atenção: era a noite de trinta e um de dezembro, nas entranhas da floresta mais escura...",
          ipa: "[e.kut bjɛ̃ | s‿e.tɛ la nɥi dy tʁɑ̃t.e.œ̃ de.sɑ̃bʁ | o fɔ̃ de bwa le ply sɔ̃bʁ]"
        }
      ]
    },
    {
      id: "quebec_chap_02",
      title: "Capítulo 2 : Le Pacte du Nouvel An et le Canot Volant",
      location: "AU-DESSUS DU FLEUVE SAINT-LAURENT, QUÉBEC",
      environment: "quebec_winter",
      avatar: "🛶",
      image: "../assets/img/quebec_chasse_galerie.jpg",
      dossier: {
        badge: "MYTHE QUÉBÉCOIS",
        title_fr: "La Légende de la Chasse-Galerie par Honoré Beaugrand",
        title_pt: "A Lenda da Canoa Voadora por Honoré Beaugrand",
        article_fr: "Pour rejoindre leurs fiancées le soir du réveillon, les bûcherons passent un pacte avec le Diable afin de faire voler leur canot en écorce.",
        article_pt: "Para ver suas noivas no Réveillon, lenhadores selam um pacto para fazer sua canoa voar, com a condição de nunca tocar numa cruz."
      },
      scenes: [
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Envol du Canot dans le Ciel",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "WHOOSH!",
          caption: "QUÉBEC — Le canot d'écorce s'élevant au-dessus de la cime des arbres.",
          dialogue_fr: "Acabris, acabras, acabram ! Le canot s'est arraché à la terre pour fendre l'air glacé de la nuit !",
          dialogue_pt: "Acabris, acabras, acabram! A canoa decolou da terra para rasgar o ar gelado da noite!",
          ipa: "[a.ka.bʁis | a.ka.bʁas | a.ka.bʁam | lə ka.no s‿ɛt‿a.ʁa.ʃe a la tɛʁ puʁ fɑ̃dʁ l‿ɛʁ ɡla.se də la nɥi]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Au-dessus des Nuages, Québec",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "ÉTOILES!",
          caption: "QUÉBEC — Le spectacle féerique de la terre enneigée vue du ciel.",
          dialogue_fr: "La lune brillante éclaire les méandres gelés du fleuve Saint-Laurent : une vision digne d'un songe.",
          dialogue_pt: "A lua brilhante ilumina as curvas congeladas do Rio São Lourenço: uma visão digna de um sonho.",
          ipa: "[la lyn bʁi.jɑ̃t e.klɛʁ le me.ɑ̃dʁ ʒə.le dy flœv sɛ̃.lo.ʁɑ̃ | yn vi.zjɔ̃ diɲ d‿œ̃ sɔ̃ʒ]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 En Plein Vol, Québec",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "ATTENTION!",
          caption: "QUÉBEC — La règle fatale : ne jamais toucher une croix d'église ni prononcer le nom sacré.",
          dialogue_fr: "Attention aux clochers des églises ! Si nous touchons une croix, nos âmes appartiendront au démon !",
          dialogue_pt: "Cuidado com os campanários das igrejas! Se tocarmos numa cruz, nossas almas pertencerão ao diabo!",
          ipa: "[a.tɑ̃.sjɔ̃ o klɔ.ʃe de.z‿e.ɡliz | si nu tu.ʃɔ̃ yn kʁwa | no.z‿am a.paʁ.tjɛ̃.dʁɔ̃ o de.mɔ̃]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Au-dessus de Lavaltrie",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "RAME!",
          caption: "QUÉBEC — Les coups de rame coordonnés défiant la gravitation.",
          dialogue_fr: "Les bûcherons rament avec énergie : l'amour de leurs familles est plus fort que la peur des ténèbres.",
          dialogue_pt: "Os lenhadores remam com vigor: o amor por suas famílias é mais forte que o medo da escuridão.",
          ipa: "[le by.ʃə.ʁɔ̃ ʁam a.vɛk e.nɛʁ.ʒi | l‿a.muʁ də lœʁ fa.mij ɛ ply fɔʁ kə la pœʁ de te.nɛbʁ]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Atterrissage dans un Banc de Neige",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "POUF!",
          caption: "QUÉBEC — L'atterrissage spectaculaire dans un immense banc de neige fraîche.",
          dialogue_fr: "Le canot s'écrase sain et sauf dans la poudreuse : le pacte est rompu, les âmes sont sauvées !",
          dialogue_pt: "A canoa aterrissa sã e salva na neve fofa: o pacto foi quebrado, as almas estão a salvo!",
          ipa: "[lə ka.no s‿e.kʁaz sɛ̃ e sof dɑ̃ la pu.dʁøz | lə pakt ɛ ʁɔ̃.py | le.z‿am sɔ̃ so.ve]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Rives de Québec",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "VILLE!",
          caption: "QUÉBEC — La vue des remparts éclairés du Vieux-Québec.",
          dialogue_fr: "Devant nous se dressent les remparts du Vieux-Québec et le fabuleux Château Frontenac !",
          dialogue_pt: "Diante de nós erguem-se as muralhas do Velho Québec e o imponente Château Frontenac!",
          ipa: "[də.vɑ̃ nu sə dʁɛs le ʁɑ̃.paʁ dy vjø ke.bɛk e lə fa.by.lø ʃa.to fʁɔ̃t.nak]"
        }
      ]
    },
    {
      id: "quebec_chap_03",
      title: "Capítulo 3 : Le Château Frontenac et les Ruelles du Vieux-Québec",
      location: "VIEUX-QUÉBEC, CITÉ FORTIFIÉE",
      environment: "quebec_winter",
      avatar: "🏰",
      image: "../assets/img/quebec_frontenac.jpg",
      dossier: {
        badge: "PATRIMOINE UNESCO",
        title_fr: "Le Vieux-Québec : La Seule Ville Fortifiée au Nord du Mexique",
        title_pt: "O Velho Québec: A Única Cidade Fortificada ao Norte do México",
        article_fr: "Fondée en 1608 par Samuel de Champlain sur le cap Diamant, Québec a conservé ses remparts d'origine et son Château Frontenac emblématique.",
        article_pt: "Fundada em 1608 por Samuel de Champlain, a cidade de Québec preserva suas muralhas de pedra e o histórico Château Frontenac."
      },
      scenes: [
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Terrasse Dufferin, Québec",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "CLAC!",
          caption: "QUÉBEC — La silhouette de château de conte de fées dominant le Saint-Laurent.",
          dialogue_fr: "Le Château Frontenac est majestueux avec ses toits de cuivre vert et ses tours néo-médiévales.",
          dialogue_pt: "O Château Frontenac é majestoso com seus telhados de cobre verde e torres neomedievais.",
          ipa: "[lə ʃa.to fʁɔ̃t.nak ɛ ma.ʒɛs.tjø a.vɛk se twa də kɥivʁ vɛʁ e se tuʁ ne.o me.dje.val]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Terrasse Dufferin, Québec",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "GLISSE!",
          caption: "QUÉBEC — La glissade centenaire des Dufferin sur des luges en bois.",
          dialogue_fr: "Ici sur la glissade Dufferin, on dévale la pente glacée à soixante-dix kilomètres à l'heure depuis 1884 !",
          dialogue_pt: "Aqui no tobogã Dufferin, descemos a rampa de gelo a 70 km/h desde 1884!",
          ipa: "[i.si syʁ la ɡli.sad dyf.ʁɛ̃ | ɔ̃ de.val la pɑ̃t ɡla.se a swa.sɑ̃t.dis ki.lɔ.mɛtʁ a l‿œʁ də.pɥi mil ɥi sɑ̃ katʁ.vɛ̃.katʁ]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Escalier Casse-Cou, Petit-Champlain",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "DESCENTE!",
          caption: "QUÉBEC — La descente vers le quartier historique du Petit-Champlain.",
          dialogue_fr: "L'escalier Casse-Cou porte bien son nom : chaque marche de bois recouverte de neige invite à la prudence.",
          dialogue_pt: "A escadaria Quebra-Pescoço faz jus ao nome: cada degrau com neve exige atenção redobrada.",
          ipa: "[l‿ɛs.ka.lje kas.ku pɔʁt bjɛ̃ sɔ̃ nɔ̃ | ʃak maʁʃ də bwa ʁə.ku.vɛʁt də nɛʒ ɛ̃.vit a la pʁy.dɑ̃s]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Quartier Petit-Champlain, Québec",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "LUMIÈRE!",
          caption: "QUÉBEC — Les guirlandes lumineuses illuminant les toits enneigés.",
          dialogue_fr: "Le Petit-Champlain est la plus ancienne rue commerciale d'Amérique du Nord : un véritable bijou historique.",
          dialogue_pt: "O Petit-Champlain é a rua comercial mais antiga da América do Norte: uma joia histórica.",
          ipa: "[lə pə.ti ʃɑ̃.plɛ̃ ɛ la ply.z‿ɑ̃.sjɛn ʁy kɔ.mɛʁ.sjal d‿a.me.ʁik dy nɔʁ | œ̃ ve.ʁi.tabl bi.ʒu is.tɔ.ʁik]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Place Royale, Québec",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "CHAMPLAIN!",
          caption: "QUÉBEC — Le buste de Samuel de Champlain sur la place fondatrice.",
          dialogue_fr: "C'est ici en 1608 que Champlain a planté le drapeau français : quatre siècles de langue préservée.",
          dialogue_pt: "Foi aqui em 1608 que Champlain hasteou a bandeira francesa: quatro séculos de língua preservada.",
          ipa: "[s‿ɛt‿i.si ɑ̃ mil sis sɑ̃ ɥit kə ʃɑ̃.plɛ̃ a plɑ̃.te lə dʁa.po fʁɑ̃.sɛ | katʁ sjɛkl də lɑ̃ɡ pʁe.zɛʁ.ve]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Porte Saint-Louis, Québec",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "SERMENT!",
          caption: "QUÉBEC — La devise nationale gravée sur chaque plaque d'immatriculation.",
          dialogue_fr: "Sur toutes nos voitures et nos monuments est gravée notre devise sacrée : Je me souviens !",
          dialogue_pt: "Em todos os nossos carros e monumentos está gravado nosso lema sagrado: Je me souviens!",
          ipa: "[syʁ tut no vwa.tyʁ e no mɔ.ny.mɑ̃ ɛ ɡʁa.ve nɔtʁ də.vwaz sa.kʁe | ʒə mə su.vjɛ̃]"
        }
      ]
    },
    {
      id: "quebec_chap_04",
      title: "Capítulo 4 : La Mémoire Vivante : 'Je me souviens' et la Francophonie",
      location: "PARLEMENT DE QUÉBEC & PLAINS D'ABRAHAM",
      environment: "quebec_winter",
      avatar: "⚜️",
      image: "../assets/img/quebec_frontenac.jpg",
      dossier: {
        badge: "RÉSISTANCE CULTURELLE",
        title_fr: "Je Me Souviens : La Fière Résistance Francophone d'Amérique",
        title_pt: "Je Me Souviens: A Brava Resistência Francófona na América do Norte",
        article_fr: "Inscrite en 1883 par l'architecte Eugène-Étienne Taché sur la façade de l'Hôtel du Parlement, la devise rappelle l'attachement indéfectible à l'histoire et à la langue française.",
        article_pt: "Gravada em 1883 no Parlamento de Québec, a divisa simboliza a defesa incansável da língua francesa cercada por um continente anglófono."
      },
      scenes: [
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Hôtel du Parlement, Québec",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "HISTOIRE!",
          caption: "QUÉBEC — La façade néo-renaissance ornée des statues des pionniers.",
          dialogue_fr: "Cette devise 'Je me souviens' est bien plus qu'une phrase : c'est un bouclier contre l'oubli de son identité.",
          dialogue_pt: "O lema 'Je me souviens' é muito mais que uma frase: é um escudo contra o esquecimento da própria identidade.",
          ipa: "[sɛt də.viz ʒə mə su.vjɛ̃ ɛ bjɛ̃ ply k‿yn fʁaz | s‿ɛt‿œ̃ bu.klje kɔ̃tʁ l‿u.bli də sɔ̃.n‿i.dɑ̃.ti.te]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Plaines d'Abraham, Québec",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "BATAILLE!",
          caption: "QUÉBEC — Le champ de bataille historique de 1759.",
          dialogue_fr: "Sur ces plaines en 1759, la Nouvelle-France a perdu une bataille militaire, mais le peuple a préservé sa langue.",
          dialogue_pt: "Nestas planícies em 1759, a Nova França perdeu uma batalha militar, mas o povo preservou sua língua.",
          ipa: "[syʁ se plɛn ɑ̃ mil sɛt sɑ̃ sɛ̃.kɑ̃t.nœf | la nu.vɛl fʁɑ̃s a pɛʁ.dy yn ba.taj mi.li.tɛʁ | me lə pœpl a pʁe.zɛʁ.ve sa lɑ̃ɡ]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Plaines d'Abraham, Québec",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "RESPECT!",
          caption: "QUÉBEC — L'admiration pour la vigueur de la loi 101 et de l'accent québécois.",
          dialogue_fr: "Au milieu d'un continent anglophone de trois cents millions d'habitants, faire vivre le français est un exploit admirable.",
          dialogue_pt: "No meio de um continente anglófono de 300 milhões de habitantes, manter o francês vivo é um feito admirável.",
          ipa: "[o mi.ljø d‿œ̃ kɔ̃.ti.nɑ̃ ɑ̃.ɡlɔ.fɔn də tʁwa sɑ̃ mi.ljɔ̃ d‿a.bi.tɑ̃ | fɛʁ vivʁ lə fʁɑ̃.sɛ ɛt‿œ̃.n‿ɛks.plwa ad.mi.ʁabl]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Promenade des Gouverneurs",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "FIERTÉ!",
          caption: "QUÉBEC — L'attachement viscéral au parler québécois authentique.",
          dialogue_fr: "Nos expressions viennent du cœur : nous disons 'bonjour' avec le sourire et 'bienvenue' pour dire merci !",
          dialogue_pt: "Nossas expressões vêm do coração: dizemos 'bonjour' com um sorriso e 'bienvenue' para responder um obrigado!",
          ipa: "[no.z‿ɛks.pʁe.sjɔ̃ vjɛn dy kœʁ | nu di.zɔ̃ bɔ̃.ʒuʁ a.vɛk lə su.ʁiʁ e bjɛ̃.və.ny puʁ diʁ mɛʁ.si]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Rue Saint-Jean, Québec",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "LIVRE!",
          caption: "QUÉBEC — La vitalité des librairies et de la chanson francophone.",
          dialogue_fr: "Félix Leclerc, Gilles Vigneault, Céline Dion : vos poètes et chanteurs ont fait rayonner cette voix dans le monde entier.",
          dialogue_pt: "Félix Leclerc, Gilles Vigneault, Céline Dion: seus poetas e cantores fizeram esta voz ecoar no mundo inteiro.",
          ipa: "[fe.liks lə.klɛʁ | ʒil vi.ɲo | se.lin djɔ̃ | vo pɔ.ɛt e ʃɑ̃.tœʁ ɔ̃ fɛ ʁɛ.jɔ.ne sɛt vwa dɑ̃ lə mɔ̃d ɑ̃.tje]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Sortie de la Ville de Québec",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "ÉRABLE!",
          caption: "QUÉBEC — En route pour l'Île d'Orléans et la cabane à sucre.",
          dialogue_fr: "Après tant d'émotions historiques, allons déguster la tire d'érable sur la neige à la cabane à sucre !",
          dialogue_pt: "Depois de tantas emoções históricas, vamos saborear o xarope de bordo puxado na neve na cabana de açúcar!",
          ipa: "[a.pʁɛ tɑ̃ d‿e.mo.sjɔ̃ is.tɔ.ʁik | a.lɔ̃ de.ɡys.te la tiʁ d‿e.ʁabl syʁ la nɛʒ a la ka.ban a sykʁ]"
        }
      ]
    },
    {
      id: "quebec_chap_05",
      title: "Capítulo 5 : Le Carnaval, la Cabane à Sucre et la Chaleur du Cœur",
      location: "ÎLE D'ORLÉANS & CARNAVAL DE QUÉBEC",
      environment: "quebec_winter",
      avatar: "🍁",
      image: "../assets/img/quebec_chasse_galerie.jpg",
      dossier: {
        badge: "TRADITION GOURMANDE",
        title_fr: "Le Temps des Sucres et la Magie du Bonhomme Carnaval",
        title_pt: "A Temporada do Maple e a Alegria do Bonhomme Carnaval",
        article_fr: "Au printemps boréal, l'eau d'érable coule des troncs centenaires. Réduite en sirop doré dans les cabanes à sucre, elle rassemble les familles autour de violons traditionnels.",
        article_pt: "Na virada da primavera, a seiva do bordo é fervida em xarope dourado e servida sobre a neve, celebrando a vida ao som de violinos tradicionais."
      },
      scenes: [
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Cabane à Sucre, Île d'Orléans",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "SIROP!",
          caption: "QUÉBEC — L'évaporateur fumant où bouillonne la sève d'érable.",
          dialogue_fr: "Quarante litres d'eau d'érable pour produire un seul litre de ce sirop pur et ambré : quel travail d'orfèvre !",
          dialogue_pt: "Quarenta litros de seiva de bordo para produzir um único litro de xarope puro e âmbar: que obra de arte!",
          ipa: "[ka.ʁɑ̃t litʁ d‿o d‿e.ʁabl puʁ pʁɔ.dɥiʁ œ̃ sœl litʁ də sə si.ʁo pyʁ e ɑ̃.bʁe | kɛl tʁa.vaj d‿ɔʁ.fɛvʁ]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Auge de Neige Fraîche",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "TIRE!",
          caption: "QUÉBEC — Le sirop bouillant versé en ruban doré sur un lit de neige propre.",
          dialogue_fr: "Prends ce bâtonnet de bois Pedro : enroule le sirop chaud qui durcit au contact de la neige pour faire la tire !",
          dialogue_pt: "Pegue este palito de madeira, Pedro: enrole o xarope quente que endurece na neve para fazer o pirulito!",
          ipa: "[pʁɑ̃ sə ba.tɔ.nɛ də bwa pe.dʁo | ɑ̃.ʁul lə si.ʁo ʃo ki dyʁ.si o kɔ̃.takt də la nɛʒ puʁ fɛʁ la tiʁ]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Terrasse Enneigée de la Cabane",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "DÉLICE!",
          caption: "QUÉBEC — La saveur inimitable du sucre d'érable fondant en bouche.",
          dialogue_fr: "C'est délicieux, velouté et doux : la nature québécoise transforme le froid extrême en pure douceur.",
          dialogue_pt: "É delicioso, aveludado e suave: a natureza do Québec transforma o frio polar em pura doçura.",
          ipa: "[s‿ɛ de.li.sjø | və.lu.te e du | la na.tyʁ ke.be.kwaz tʁɑ̃s.fɔʁm lə fʁwa ɛks.tʁɛm ɑ̃ pyʁ du.sœʁ]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Piste de Danse Traditionnelle",
          image: "../assets/img/quebec_chasse_galerie.jpg",
          sfx: "VIOLON!",
          caption: "QUÉBEC — Les pieds tapant le rythme au son des cuillères et du violon québécois.",
          dialogue_fr: "Écoute les cuillères de bois et la gigue québécoise : le froid reste dehors, la joie règne dedans !",
          dialogue_pt: "Ouça as colheres de madeira e o violino: o frio fica lá fora, a alegria reina aqui dentro!",
          ipa: "[e.kut le kɥi.jɛʁ də bwa e la ʒiɡ ke.be.kwaz | lə fʁwa ʁɛst də.ɔʁ | la ʒwa ʁɛɲ də.dɑ̃]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Palais de Glace du Bonhomme Carnaval",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "CARNAVAL!",
          caption: "QUÉBEC — Le géant de neige Bonhomme Carnaval saluant la foule joyeuse.",
          dialogue_fr: "Le Carnaval de Québec montre que l'on peut célébrer la fête et la chaleur humaine même sous la neige.",
          dialogue_pt: "O Carnaval de Québec demonstra que podemos celebrar a alegria e o afeto humano mesmo sob a nevasca.",
          ipa: "[lə kaʁ.na.val də ke.bɛk mɔ̃tʁ kə l‿ɔ̃ pø se.le.bʁe la fɛt e la ʃa.lœʁ y.mɛn mɛm su la nɛʒ]"
        },
        {
          speaker: "MATHIEU",
          speaker_name: "Mathieu Tremblay (Guide Boréal)",
          avatar: "🧔‍♂️",
          location: "📍 Port de Québec sur le Saint-Laurent",
          image: "../assets/img/quebec_frontenac.jpg",
          sfx: "AUREVOIR!",
          caption: "QUÉBEC — Les glaces dérivant sur le fleuve vers l'Océan Atlantique.",
          dialogue_fr: "Merci Pedro ! Tu as conquis nos cœurs boréaux : Paris et les Lumières de France t'appellent désormais !",
          dialogue_pt: "Obrigado, Pedro! Você conquistou nossos corações do norte: Paris e as Luzes da França chamam por você agora!",
          ipa: "[mɛʁ.si pe.dʁo | ty a kɔ̃.ki no kœʁ bɔ.ʁe.o | pa.ʁi e le ly.mjɛʁ də fʁɑ̃s t‿a.pɛl de.zɔʁ.mɛ]"
        }
      ]
    }
  ]
};
