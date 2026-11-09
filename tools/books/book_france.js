export const bookFrance = {
  id: "france_pantheon",
  category: "francophonie",
  country: "France (Paris & Lumières)",
  flag: "🇫🇷",
  badge: "LUMIÈRES & RÉVOLUTION",
  coverImage: "../assets/img/paris_pantheon.jpg",
  title: "Paris : Les Lumières et la Cité d'Ys",
  title_pt: "Paris: As Luzes e a Cidade Mítica d'Ys",
  duration: "5 Capítulos • 30 Cenas",
  objective: "Dominar o discurso argumentativo, conectores de oposição (pourtant, néanmoins, bien que) e o legado dos filósofos iluministas.",
  musicTrack: "../assets/audio/opening_theme.mp3",
  soundtrack: {
    title: "Bitume Incendie (French Synth-Punk)",
    file: "../assets/audio/opening_theme.mp3",
    lyrics_paragraph: "Dans les catacombes oubliées sous le bitume de Paris, la nuit gronde bien que les réverbères prétendent éclairer nos pas. Pourtant nous avançons les yeux ouverts sans céder aux illusions dorées des salons, néanmoins chaque mot gravé dans la pierre témoigne d'un combat silencieux pour que la liberté ne soit pas un vain refrain mais un incendie lucide qui traverse les siècles.",
    suno_prompt_paragraph: "French synth-punk / coldwave track, 136 BPM, aggressive driving synth bass, metallic snare, motorik drum pulse. Spoken-word deliver in sharp rhythmic Parisian French, paired with Marie singing rapid anthemic refrains. Difficult phonetic transitions: 'bitume de Paris' [bi.tym də pa.ʁi], 'bien que les réverbères' [bjɛ̃ kə le ʁe.vɛʁ.bɛʁ], and 'incendie lucide' [ɛ̃.sɑ̃.di ly.sid]. Marie sings the chorus with raw post-punk urgency.",
    musical_style_paragraph: "Influências musicais: La Femme, Frustration, Rendez-Vous e Sexy Sushi. Estilo French Post-Punk / Synth-Punk parisiense, direto, visceral, urbano e livre de nostalgia romântica."
  },
  synopsis_fr: "Du Café Procope des Encyclopédistes et de la prise de la Bastille en 1789 jusqu'à la crypte solennelle du Panthéon, les combats de Victor Hugo et la métropole numérique moderne.",
  synopsis_pt: "Do Café Procope dos enciclopedistas e da queda da Bastilha em 1789 à cripta solene do Panthéon, os embates de Victor Hugo e a Paris digital contemporânea.",
  chapters: [
    {
      id: "france_chap_01",
      title: "Capítulo 1 : Le Café Procope et l'Esprit des Lumières",
      location: "SAINT-GERMAIN-DES-PRÉS, PARIS",
      environment: "cafe_procope",
      avatar: "☕",
      image: "../assets/img/paris_pantheon.jpg",
      dossier: {
        badge: "PHILOSOPHIE HISTORIQUE",
        title_fr: "Le Café Procope : Foyer de la Raison et de l'Encyclopédie",
        title_pt: "O Café Procope: Berço da Razão e da Enciclopédia",
        article_fr: "Fondé en 1686 par Francesco Procopio dei Coltelli, le Café Procope est le plus ancien café littéraire du monde. Voltaire y buvait quarante cafés par jour en rédigeant ses essais contre le fanatisme.",
        article_pt: "Fundado em 1686, o Procope foi ponto de encontro de Voltaire, Diderot e d'Alembert para a redação da Enciclopédia, mudando a história ocidental."
      },
      scenes: [
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Rue de l'Ancienne Comédie, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "ENTRÉE!",
          caption: "PARIS — La façade en fer forgé du plus vieux café du monde.",
          dialogue_fr: "Pousser cette porte en bois poli du Procope, c'est pénétrer directement dans le siècle des Lumières.",
          dialogue_pt: "Empurrar esta porta de madeira do Procope é adentrar diretamente no Século das Luzes.",
          ipa: "[pu.se sɛt pɔʁt ɑ̃ bwa pɔ.li dy pʁɔ.kɔp | s‿ɛ pe.ne.tʁe di.ʁɛk.tə.mɑ̃ dɑ̃ lə sjɛkl de ly.mjɛʁ]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Table de Voltaire, Café Procope",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "VERRE!",
          caption: "PARIS — La table en marbre préservée du philosophe de Candide.",
          dialogue_fr: "Voltaire s'asseyait exactement ici : il soutenait que la tolérance est l'apanage suprême de l'humanité.",
          dialogue_pt: "Voltaire sentava-se exatamente aqui: sustentava que a tolerância é a prerrogativa suprema da humanidade.",
          ipa: "[vɔl.tɛʁ s‿a.sɛ.jɛ ɛɡ.zak.tə.mɑ̃ i.si | il sut.nɛ kə la tɔ.le.ʁɑ̃s ɛ l‿a.pa.naʒ sy.pʁɛm də l‿y.ma.ni.te]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Salon Révolutionnaire, Café Procope",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "ENCYCLOPÉDIE!",
          caption: "PARIS — Les tomes monumentaux de l'Encyclopédie de Diderot.",
          dialogue_fr: "Diderot et d'Alembert ont voulu rassembler tous les savoirs humains pour libérer le peuple de l'ignorance.",
          dialogue_pt: "Diderot e d'Alembert quiseram reunir todo o conhecimento humano para libertar o povo da ignorância.",
          ipa: "[di.də.ʁo e d‿a.lɑ̃.bɛʁ ɔ̃ vu.ly ʁa.sɑ̃.ble tu le sa.vwaʁ.z‿y.mɛ̃ puʁ li.be.ʁe lə pœpl də l‿i.ɲɔ.ʁɑ̃s]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Salon des Miroirs, Procope",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "IDÉE!",
          caption: "PARIS — L'esprit de libre examen des idées reçues.",
          dialogue_fr: "Bien que le pouvoir de l'époque censurât leurs écrits, la raison a fini par triompher des dogmes aveugles.",
          dialogue_pt: "Embora o poder da época censurasse seus textos, a razão acabou por triunfar sobre os dogmas cegos.",
          ipa: "[bjɛ̃ kə lə pu.vwaʁ də l‿e.pɔk sɑ̃.sy.ʁa lœʁ.z‿e.kʁi | la ʁɛ.zɔ̃ a fi.ni paʁ tʁi.jɔ̃.fe de dɔɡm a.vœɡl]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Café Procope, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "CLAC!",
          caption: "PARIS — L'analogie avec l'accès universel à l'information par internet.",
          dialogue_fr: "L'encyclopédisme du dix-huitième siècle a posé les bases de ce que le Web et l'IA accomplissent aujourd'hui.",
          dialogue_pt: "O enciclopedismo do século XVIII lançou as bases do que a Web e a IA realizam nos dias de hoje.",
          ipa: "[l‿ɑ̃.si.klɔ.pe.dism dy diz.ɥi.tjɛm sjɛkl a po.ze le baz də sə kə lə wɛb e l‿i.a a.kɔ̃.plis o.ʒuʁ.dɥi]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Rue des Cordeliers, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "BASTILLE!",
          caption: "PARIS — Du débat d'idées au grand soulèvement de 1789.",
          dialogue_fr: "Mais les idées n'étaient que le prélude : en 1789, le peuple de Paris s'est levé pour abattre la Bastille !",
          dialogue_pt: "Mas as ideias eram apenas o prelúdio: em 1789, o povo de Paris se levantou para derrubar a Bastilha!",
          ipa: "[me le.z‿i.de n‿e.tɛ kə lə pʁe.lyd | ɑ̃ mil sɛt sɑ̃ katʁ.vɛ̃.nœf | lə pœpl də pa.ʁi s‿ɛ lə.ve puʁ a.batʁ la bas.tij]"
        }
      ]
    },
    {
      id: "france_chap_02",
      title: "Capítulo 2 : La Révolution de 1789 et la Prise de la Bastille",
      location: "PLACE DE LA BASTILLE & RUE SAINT-ANTOINE",
      environment: "cafe_procope",
      avatar: "🔥",
      image: "../assets/img/paris_pantheon.jpg",
      dossier: {
        badge: "DATE FONDATRICE",
        title_fr: "Le 14 Juillet 1789 : La Liberté Brise ses Chaînes",
        title_pt: "14 de Julho de 1789: A Liberdade Rompe suas Correntes",
        article_fr: "Symbole de l'arbitraire royal où l'on pouvait être emprisonné sur simple lettre de cachet, la forteresse de la Bastille est prise d'assaut par les artisans du faubourg Saint-Antoine.",
        article_pt: "Símbolo da tirania monárquica, a fortaleza da Bastilha foi tomada pelo povo de Paris em 14 de julho, dando início à Revolução Francesa."
      },
      scenes: [
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Colonne de Juillet, Place de la Bastille",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "CANON!",
          caption: "PARIS — La Colonne de Juillet surmontée du Génie de la Liberté doré.",
          dialogue_fr: "C'est sur ces pavés que le quatorze juillet mille sept cent quatre-vingt-neuf a bouleversé l'histoire du monde.",
          dialogue_pt: "Foi sobre estes paralelepípedos que o 14 de julho de 1789 transformou a história mundial.",
          ipa: "[s‿ɛ syʁ se pa.ve kə lə ka.tɔʁz ʒɥi.jɛ mil sɛt sɑ̃ katʁ.vɛ̃.nœf a bul.vɛʁ.se l‿is.twaʁ dy mɔ̃d]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Tracé des Murs de la Bastille au Sol",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "PAVÉS!",
          caption: "PARIS — Les lignes pavées marquant au sol l'emplacement des huit tours médiévales.",
          dialogue_fr: "Ces pavés sombres au sol dessinent le contour des tours : les citoyens ont démoli la forteresse pierre par pierre.",
          dialogue_pt: "Estes blocos escuros desenham as oito torres: os cidadãos demoliram a fortaleza pedra por pedra.",
          ipa: "[se pa.ve sɔ̃bʁ o sɔl de.sin lə kɔ̃.tuʁ de tuʁ | le si.twa.jɛ̃ ɔ̃ de.mɔ.li la fɔʁ.tʁɛs pjɛʁ paʁ pjɛʁ]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Faubourg Saint-Antoine, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "DROITS!",
          caption: "PARIS — La rédaction de la Déclaration des Droits de l'Homme et du Citoyen.",
          dialogue_fr: "Les hommes naissent et demeurent libres et égaux en droits : cette déclaration universelle a éclairé tous les continents.",
          dialogue_pt: "Os homens nascem e permanecem livres e iguais em direitos: esta declaração iluminou todos os continentes.",
          ipa: "[le.z‿ɔm nɛs e də.mœʁ libʁ e e.ɡo ɑ̃ dʁwa | sɛt de.kla.ʁa.sjɔ̃ y.ni.vɛʁ.sɛl a e.klɛ.ʁe tu le kɔ̃.ti.nɑ̃]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Port de l'Arsenal, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "CANAL!",
          caption: "PARIS — Les ponts et le canal reliant la Bastille à la Seine.",
          dialogue_fr: "Pourtant la conquête de la liberté ne fut jamais facile : elle a exigé un courage constant face aux retours de la tyrannie.",
          dialogue_pt: "No entanto a conquista da liberdade nunca foi fácil: exigiu coragem constante frente ao retorno das tiranias.",
          ipa: "[puʁ.tɑ̃ la kɔ̃.kɛt də la li.bɛʁ.te nə fy ʒa.mɛ fa.sil | ɛl a ɛɡ.zi.ʒe œ̃ ku.ʁaʒ kɔ̃s.tɑ̃ fas o ʁə.tuʁ də la ti.ʁa.ni]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Place de la Bastille",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "DEVISE!",
          caption: "PARIS — Liberté, Égalité, Fraternité.",
          dialogue_fr: "Liberté, Égalité, Fraternité : un idéal exigeant qui nous rappelle chaque jour nos devoirs envers autrui.",
          dialogue_pt: "Liberdade, Igualdade, Fraternidade: um ideal exigente que nos lembra diariamente nossos deveres para com o próximo.",
          ipa: "[li.bɛʁ.te | e.ɡa.li.te | fʁa.tɛʁ.ni.te | œ̃.n‿i.de.al ɛɡ.zi.ʒɑ̃ ki nu ʁa.pɛl ʃak ʒuʁ no də.vwaʁ ɑ̃.vɛʁ o.tʁɥi]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Vers la Montagne Sainte-Geneviève",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "PANTHÉON!",
          caption: "PARIS — Ascension vers le Panthéon sur la Montagne Sainte-Geneviève.",
          dialogue_fr: "Montons maintenant vers la Montagne Sainte-Geneviève : la patrie y honore ceux qui ont combattu pour ces valeurs !",
          dialogue_pt: "Subamos agora até a Colina Santa Genoveva: a pátria honra ali aqueles que lutaram por esses valores!",
          ipa: "[mɔ̃.tɔ̃ mɛ̃t.nɑ̃ vɛʁ la mɔ̃.taɲ sɛ̃t.ʒə.nə.vjɛv | la pa.tʁi i ɔ.nɔʁ sø ki ɔ̃ kɔ̃.ba.ty puʁ se va.lœʁ]"
        }
      ]
    },
    {
      id: "france_chap_03",
      title: "Capítulo 3 : Le Panthéon : Aux Grands Hommes la Patrie Reconnaissante",
      location: "MONTAGNE SAINTE-GENEVIÈVE, 5E ARRONDISSEMENT",
      environment: "pantheon",
      avatar: "🏛️",
      image: "../assets/img/paris_pantheon.jpg",
      dossier: {
        badge: "SANCTUAIRE RÉPUBLICAIN",
        title_fr: "Le Panthéon : Du Vœu de Louis XV au Temple des Héros Civiques",
        title_pt: "O Panthéon: Do Voto Monárquico ao Templo Cívico da República",
        article_fr: "Conçu par Soufflot avec un dôme grandiose inspiré de Rome, le Panthéon abrite les sépultures de Voltaire, Rousseau, Victor Hugo, Émile Zola, Jean Jaurès, Marie Curie et Jean Moulin.",
        article_pt: "Projetado por Soufflot, o Panthéon abriga na cripta os túmulos dos maiores defensores da liberdade, da ciência e dos direitos humanos na França."
      },
      scenes: [
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Façade du Panthéon, Place du Panthéon",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "FRONTISPICE!",
          caption: "PARIS — La célèbre inscription dorée gravée sous les colonnes corinthiennes.",
          dialogue_fr: "Aux grands hommes la patrie reconnaissante : cette façade imposante proclame l'immortalité des justes.",
          dialogue_pt: "Aos grandes homens a pátria agradecida: esta fachada monumental proclama a imortalidade dos justos.",
          ipa: "[o ɡʁɑ̃.z‿ɔm la pa.tʁi ʁə.kɔ.nɛ.sɑ̃t | sɛt fa.sad ɛ̃.po.zɑ̃t pʁɔ.klam l‿i.mɔʁ.ta.li.te de ʒyst]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Pendule de Foucault, Nef du Panthéon",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "OSCILLATION!",
          caption: "PARIS — La sphère de laiton du pendule prouvant scientifiquement la rotation de la Terre.",
          dialogue_fr: "Sous la coupole, le pendule de Léon Foucault oscille majestueusement : la science démontre que la Terre tourne sans cesse.",
          dialogue_pt: "Sob a cúpula, o pêndulo de Foucault oscila com elegância: a ciência comprova que a Terra gira sem cessar.",
          ipa: "[su la ku.pɔl | lə pɑ̃.dyl də le.ɔ̃ fu.ko ɔ.sil ma.ʒɛs.tjøz.mɑ̃ | la sjɑ̃s de.mɔ̃tʁ kə la tɛʁ tuʁn sɑ̃ sɛs]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Crypte du Panthéon, Caveau de Voltaire et Rousseau",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "PAIX!",
          caption: "PARIS — Les deux géants de la philosophie face à face dans l'éternité.",
          dialogue_fr: "Voltaire et Rousseau reposent face à face : leurs débats vifs ont forgé la modernité intellectuelle du monde.",
          dialogue_pt: "Voltaire e Rousseau repousam frente a frente: seus acesos debates forjaram a modernidade intelectual.",
          ipa: "[vɔl.tɛʁ e ʁu.so ʁə.poz fas a fas | lœʁ de.ba vif ɔ̃ fɔʁ.ʒe la mɔ.dɛʁ.ni.te ɛ̃.tɛ.lɛk.tɥɛl dy mɔ̃d]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Caveau de Marie Curie, Crypte",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "SCIENCE!",
          caption: "PARIS — La première femme panthéonisée pour ses mérites scientifiques propres.",
          dialogue_fr: "Marie Curie repose ici : double prix Nobel de physique et de chimie, elle a consacré sa vie à guérir l'humanité.",
          dialogue_pt: "Marie Curie descansa aqui: duplo prêmio Nobel de física e química, dedicou a vida a curar a humanidade.",
          ipa: "[ma.ʁi ky.ʁi ʁə.poz i.si | dubl pʁi nɔ.bɛl də fi.zik e də ʃi.mi | ɛl a kɔ̃.sa.kʁe sa vi a ɡe.ʁiʁ l‿y.ma.ni.te]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Caveau de Jean Moulin, Crypte",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "RÉSISTANCE!",
          caption: "PARIS — L'hommage au chef héroïque du Conseil National de la Résistance.",
          dialogue_fr: "Jean Moulin a préféré le silence sous la torture plutôt que de trahir ses compagnons d'armes : un modèle absolu d'honneur.",
          dialogue_pt: "Jean Moulin preferiu o silêncio sob tortura a trair seus companheiros: um exemplo absoluto de bravura.",
          ipa: "[ʒɑ̃ mu.lɛ̃ a pʁe.fe.ʁe lə si.lɑ̃s su la tɔʁ.tyʁ ply.to kə də tʁa.iʁ se kɔ̃.pa.ɲɔ̃ d‿aʁm | œ̃ mɔ.dɛl ab.sɔ.ly d‿ɔ.nœʁ]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Caveau de Victor Hugo, Crypte",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "POÈTE!",
          caption: "PARIS — Devant la sépulture du géant des lettres françaises.",
          dialogue_fr: "Et voici Victor Hugo : deux millions de personnes ont suivi son cercueil depuis l'Arc de Triomphe jusqu'ici !",
          dialogue_pt: "E eis Victor Hugo: dois milhões de parisienses acompanharam seu caixão do Arco do Triunfo até aqui!",
          ipa: "[e vwa.si vik.tɔʁ y.ɡo | dø mi.ljɔ̃ də pɛʁ.sɔn ɔ̃ sɥi.vi sɔ̃ sɛʁ.kœj də.pɥi l‿aʁk də tʁi.jɔ̃f ʒys.k‿i.si]"
        }
      ]
    },
    {
      id: "france_chap_04",
      title: "Capítulo 4 : Victor Hugo, Notre-Dame et les Misérables de Paris",
      location: "ÎLE DE LA CITÉ & PLACE DES VOSGES",
      environment: "cafe_procope",
      avatar: "📖",
      image: "../assets/img/paris_pantheon.jpg",
      dossier: {
        badge: "GÉANT DES LETTRES",
        title_fr: "Victor Hugo : La Voix des Sans-Voix et le Sauveur de Notre-Dame",
        title_pt: "Victor Hugo: A Voz dos Excluídos e o Defensor de Notre-Dame",
        article_fr: "En publiant Notre-Dame de Paris en 1831, Hugo sauve la cathédrale gothique de la démolition. Avec Les Misérables en 1862, il combat la misère sociale.",
        article_pt: "Ao publicar O Corcunda de Notre-Dame, Hugo evitou a demolição da catedral. Com Os Miseráveis, colocou os oprimidos no centro da literatura."
      },
      scenes: [
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Parvis de Notre-Dame, Île de la Cité",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "CLOCHES!",
          caption: "PARIS — Les deux tours carrées et les gargouilles veillant sur la Seine.",
          dialogue_fr: "Notre-Dame renaît de ses cendres après l'incendie : la pierre médiévale résiste au passage des siècles.",
          dialogue_pt: "Notre-Dame renasce das cinzas após o incêndio: a cantaria medieval desafia a passagem dos séculos.",
          ipa: "[nɔtʁ dam ʁə.nɛ də se sɑ̃dʁ a.pʁɛ l‿ɛ̃.sɑ̃.di | la pjɛʁ me.dje.val ʁe.zist o pa.saʒ de sjɛkl]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Parvis Notre-Dame, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "HUGO!",
          caption: "PARIS — Le roman qui a sauvé la cathédrale d'une destruction programmée.",
          dialogue_fr: "Victor Hugo a écrit son roman pour réveiller la nation : grâce à son livre, les Français ont sauvé leur patrimoine.",
          dialogue_pt: "Victor Hugo escreveu seu romance para despertar o país: graças a ele, os franceses salvaram o patrimônio.",
          ipa: "[vik.tɔʁ y.ɡo a e.kʁi sɔ̃ ʁɔ.mɑ̃ puʁ ʁe.vɛ.je la na.sjɔ̃ | ɡʁas a sɔ̃ livʁ | le fʁɑ̃.sɛ ɔ̃ so.ve lœʁ pa.tʁi.mwan]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Pont Saint-Louis, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "MISÉRABLES!",
          caption: "PARIS — Jean Valjean, Fantine, Cosette et Gavroche sur les barricades.",
          dialogue_fr: "Les Misérables démontre que même au cœur de la faim et du mépris, la compassion rachète toute l'existence.",
          dialogue_pt: "Os Miseráveis demonstra que mesmo em meio à miséria e ao desprezo, a compaixão redime toda a existência.",
          ipa: "[le mi.ze.ʁabl de.mɔ̃tʁ kə mɛm o kœʁ də la fɛ̃ e dy me.pʁi | la kɔ̃.pa.sjɔ̃ ʁa.ʃɛt tut l‿ɛɡ.zis.tɑ̃s]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Maison de Victor Hugo, Place des Vosges",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "PLUME!",
          caption: "PARIS — Le cabinet de travail du maître dans le Marais.",
          dialogue_fr: "Hugo écrivait debout face à son pupitre : il affirmait que faire aimer la justice est le premier devoir de l'écrivain.",
          dialogue_pt: "Hugo escrevia de pé em sua escrivaninha: afirmava que fazer amar a justiça é o primeiro dever do escritor.",
          ipa: "[y.ɡo e.kʁi.vɛ də.bu fas a sɔ̃ py.pitʁ | il a.fiʁ.mɛ kə fɛʁ e.me la ʒys.tis ɛ lə pʁə.mje də.vwaʁ də l‿e.kʁi.vɛ̃]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Place des Vosges, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "HARMONIE!",
          caption: "PARIS — Les arcades parfaites de briques rouges et de pierre blanche.",
          dialogue_fr: "Cette harmonie classique cache un engagement politique révolutionnaire : la beauté et la justice sont inséparables.",
          dialogue_pt: "Essa harmonia arquitetônica oculta um combate político revolucionário: beleza e justiça são inseparáveis.",
          ipa: "[sɛt aʁ.mɔ.ni kla.sik kaʃ œ̃.n‿ɑ̃.ɡaʒ.mɑ̃ pɔ.li.tik ʁe.vɔ.ly.sjɔ.nɛʁ | la bo.te e la ʒys.tis sɔ̃.t‿ɛ̃.se.pa.ʁabl]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Quais de Seine, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "SEINE!",
          caption: "PARIS — Cap sur les ponts parisiens et la révolution numérique.",
          dialogue_fr: "Paris regarde toujours vers l'avenir : découvrons maintenant la capitale numérique qui réinvente le monde !",
          dialogue_pt: "Paris sempre olha para o horizonte: descubramos agora a capital digital que reinventa o mundo!",
          ipa: "[pa.ʁi ʁə.ɡaʁd tu.ʒuʁ vɛʁ l‿av.niʁ | de.ku.vʁɔ̃ mɛ̃t.nɑ̃ la ka.pi.tal ny.me.ʁik ki ʁe.ɛ̃.vɑ̃t lə mɔ̃d]"
        }
      ]
    },
    {
      id: "france_chap_05",
      title: "Capítulo 5 : Paris Moderne, la Cité Numérique et l'Éternel Éclat",
      location: "STATION F & BORDS DE SEINE, PARIS",
      environment: "station_f",
      avatar: "💡",
      image: "../assets/img/paris_pantheon.jpg",
      dossier: {
        badge: "AVENIR & CULTURE",
        title_fr: "Paris Cité des Arts et de l'Innovation Mondiale",
        title_pt: "Paris Cidade das Artes e da Inovação Global",
        article_fr: "De la Sorbonne fondée au Moyen Âge aux grands campus de technologie comme Station F, Paris maintient son rôle de phare intellectuel mondial.",
        article_pt: "Da Sorbonne medieval aos centros de inteligência artificial de ponta, Paris combina patrimônio histórico e vanguarda digital."
      },
      scenes: [
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Passerelle Simone-de-Beauvoir sur la Seine",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "REFLETS!",
          caption: "PARIS — La Seine scintillant sous les ponts illuminés de la capitale.",
          dialogue_fr: "Sur la passerelle moderne enjambant le fleuve, Paris prouve qu'elle sait marier son passé et son avenir.",
          dialogue_pt: "Na passarela contemporânea sobre o rio, Paris comprova sua maestria em unir passado e futuro.",
          ipa: "[syʁ la pas.ʁɛl mɔ.dɛʁn ɑ̃.ʒɑ̃.bɑ̃ lə flœv | pa.ʁi pʁuv k‿ɛl sɛ ma.ʁje sɔ̃ pa.se e sɔ̃.n‿av.niʁ]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Esplanade de la Bibliothèque Nationale de France",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "LIVRES!",
          caption: "PARIS — Les quatre tours en forme de livres ouverts de la BnF.",
          dialogue_fr: "Les quatre tours de la Bibliothèque François-Mitterrand conservent quarante millions de documents pour l'humanité.",
          dialogue_pt: "As quatro torres da Biblioteca Nacional preservam quarenta milhões de obras para a humanidade.",
          ipa: "[le katʁ tuʁ də la bi.bli.jɔ.tɛk fʁɑ̃.swa mi.te.ʁɑ̃ kɔ̃.sɛʁv ka.ʁɑ̃t mi.ljɔ̃ də dɔ.ky.mɑ̃ puʁ l‿y.ma.ni.te]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Station F, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "STARTUP!",
          caption: "PARIS — La ruche technologique de la Halle Freyssinet.",
          dialogue_fr: "La langue française accueille aujourd'hui les ingénieurs du monde entier pour coder l'intelligence éthique de demain.",
          dialogue_pt: "A língua francesa acolhe hoje programadores do mundo inteiro para codificar a inteligência ética do amanhã.",
          ipa: "[la lɑ̃ɡ fʁɑ̃.sɛz a.kœj o.ʒuʁ.dɥi le.z‿ɛ̃.ʒe.njœʁ dy mɔ̃d ɑ̃.tje puʁ kɔ.de l‿ɛ̃.te.li.ʒɑ̃s e.tik də də.mɛ̃]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Toit de l'Institut du Monde Arabe, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "DIAPHRAGME!",
          caption: "PARIS — La façade aux moucharabiehs mécaniques conçue par Jean Nouvel.",
          dialogue_fr: "Regarde ces moucharabiehs numériques : ils s'ouvrent avec le soleil, créant un pont fraternel avec l'Orient et le Maghreb.",
          dialogue_pt: "Veja esses muxarabis computadorizados: abrem-se com a luz solar, criando uma ponte fraterna com o Oriente e o Magreb.",
          ipa: "[ʁə.ɡaʁd se mu.ʃa.ʁa.bje ny.me.ʁik | il s‿uvʁ a.vɛk lə sɔ.lɛj | kʁe.ɑ̃ œ̃ pɔ̃ fʁa.tɛʁ.nɛl a.vɛk l‿ɔ.ʁjɑ̃ e lə ma.ɡʁɛb]"
        },
        {
          speaker: "PEDRO",
          speaker_name: "Pedro Hagah",
          avatar: "👨‍💻",
          location: "📍 Pont des Arts au Crépuscule",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "ÉCLAT!",
          caption: "PARIS — Le reflet doré du soleil couchant sur l'Institut de France et la coupole.",
          dialogue_fr: "Apprendre le français, ce n'est pas seulement conjuguer des verbes : c'est embrasser un combat universel pour la clarté.",
          dialogue_pt: "Aprender francês não é apenas conjugar verbos: é abraçar uma luta universal pela lucidez e pela dignidade.",
          ipa: "[a.pʁɑ̃dʁ lə fʁɑ̃.sɛ | sə n‿ɛ pa sœl.mɑ̃ kɔ̃.ʒy.ɡe de vɛʁb | s‿ɛt‿ɑ̃.bʁa.se œ̃ kɔ̃.ba y.ni.vɛʁ.sɛl puʁ la klaʁ.te]"
        },
        {
          speaker: "ELENA",
          speaker_name: "Elena Rostand (Historienne de Paris)",
          avatar: "👩‍💼",
          location: "📍 Pont des Arts, Paris",
          image: "../assets/img/paris_pantheon.jpg",
          sfx: "MERCI!",
          caption: "PARIS — Le salut fraternel ouvrant la voie vers le Maghreb et la Méditerranée.",
          dialogue_fr: "Merci Pedro ! Que le souffle des Lumières guide ton voyage vers la fascinante Médina de Fès !",
          dialogue_pt: "Obrigado, Pedro! Que a chama das Luzes guie sua jornada rumo à fascinante Medina de Fez!",
          ipa: "[mɛʁ.si pe.dʁo | kə lə sufl de ly.mjɛʁ ɡid tɔ̃ vwa.jaʒ vɛʁ la fa.si.nɑ̃t me.di.na də fɛs]"
        }
      ]
    }
  ]
};
