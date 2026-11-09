/**
 * Roteiro Completo — L'Aventure Francophone de Pedro Hagah
 * Integra história clássica, colonialismo, diplomacia e eventos recentes reais:
 * - França: AI Act europeu, Cúpula de IA de Paris 2025 e reabertura de Notre-Dame (2024)
 * - Senegal: Nova era democrática em Dakar (2024/2025), memória de Gorée e soberania de dados africana
 * - Québec: Lei 96 de proteção da língua e o ecossistema Mila de IA soberana
 */

export const STORY_ARCS = [
  {
    arc_id: 'arc_01',
    title: "Arc 1 : L'Héritage des Lumières & L'IA Act Européen",
    subtitle: "Paris 2024-2026 : De la réouverture de Notre-Dame au sommet mondial de l'IA",
    location: "PARIS, FRANCE",
    stories: [
      {
        id: 'a1_s1',
        speaker: 'PEDRO',
        speaker_name: 'Pedro Hagah',
        avatar: '👨‍💻',
        location: '📍 Recife, Laboratoire IA',
        image: '../assets/img/p1_1.png',
        sfx: 'CONNECT!',
        caption: 'RECIFE — Dans le studio d\'IA, Pedro analyse les retombées de la régulation européenne.',
        dialogue_fr: "Après l'entrée en vigueur de l'AI Act européen et la réouverture de Notre-Dame, Paris est redevenue la capitale mondiale de l'éthique technologique.",
        dialogue_pt: "Após a entrada em vigor do AI Act europeu e a reabertura de Notre-Dame, Paris voltou a ser a capital mundial da ética tecnológica.",
        ipa: "[a.pʁɛ l‿ɑ̃.tʁe ɑ̃ vi.ɡœʁ də l‿e.aj akt ø.ʁɔ.pe.ɛ̃]"
      },
      {
        id: 'a1_s2',
        speaker: 'ELENA',
        speaker_name: 'Elena Rostand',
        avatar: '👩‍🔬',
        location: '📍 Paris, Station F',
        image: '../assets/img/p1_2.png',
        sfx: 'ÉCHO!',
        caption: 'PARIS, STATION F — Elena prépare le sommet pour l\'action sur l\'IA.',
        dialogue_fr: "Exactement Pedro ! Le Président a rappelé lors du Sommet sur l'IA que l'Europe refuse d'être un simple consommateur d'algorithmes étrangers.",
        dialogue_pt: "Exatamente Pedro! O Presidente lembrou durante a Cúpula sobre IA que a Europa se recusa a ser uma simples consumidora de algoritmos estrangeiros.",
        ipa: "[l‿ø.ʁɔp ʁə.fyz d‿ɛtʁ œ̃ sɛ̃pl kɔ̃.sɔ.ma.tœʁ]"
      },
      {
        id: 'a1_s3',
        speaker: 'DOUANIER',
        speaker_name: 'Capitaine Laurent',
        avatar: '👮',
        location: '📍 Roissy Charles-de-Gaulle',
        image: '../assets/img/p2_1.png',
        sfx: 'CONTRÔLE!',
        caption: 'ROISSY-CDG — Contrôle biométrique et accueil diplomatique.',
        dialogue_fr: "Votre accréditation pour le Sommet de Paris est validée. Bienvenue en France pour bâtir une intelligence artificielle responsable et plurielle !",
        dialogue_pt: "Sua credencial para a Cúpula de Paris está validada. Seja bem-vindo à França para construir uma inteligência artificial responsável e plural!",
        ipa: "[vɔtʁ a.kʁe.di.ta.sjɔ̃ puʁ lə sɔ.mɛ də pa.ʁi ɛ va.li.de]"
      }
    ]
  },
  {
    arc_id: 'arc_senegal',
    title: "Arc 2 : Le Sénégal Moderne — De Gorée à la Souveraineté Numérique",
    subtitle: "Dakar 2024-2026 : Le renouveau démocratique et l'Afrique Tech",
    location: "DAKAR & GORÉE, SÉNÉGAL",
    stories: [
      {
        id: 'sen_s1',
        speaker: 'PEDRO',
        speaker_name: 'Pedro Hagah',
        avatar: '👨‍💻',
        location: '📍 Île de Gorée, Maison des Esclaves',
        image: '../assets/img/p1_1.png',
        sfx: 'MÉMOIRE...',
        caption: 'ÎLE DE GORÉE — Face à la porte du voyage sans retour, là où la langue coloniale a d\'abord résonné.',
        dialogue_fr: "Ce lieu nous rappelle le coût tragique de la colonisation. Comprendre le français aujourd'hui, c'est d'abord écouter la mémoire des peuples asservis.",
        dialogue_pt: "Este lugar nos lembra o custo trágico da colonização. Compreender o francês hoje é, antes de tudo, escutar a memória dos povos subjugados.",
        ipa: "[kɔ̃.pʁɑ̃dʁ lə fʁɑ̃.sɛ o.ʒuʁ.dɥi | s‿ɛ d‿a.bɔʁ e.ku.te la me.mwaʁ]"
      },
      {
        id: 'sen_s2',
        speaker: 'AMINA',
        speaker_name: 'Amina Diop',
        avatar: '👩🏾‍💻',
        location: '📍 Dakar, Technopole',
        image: '../assets/img/p1_2.png',
        sfx: 'HORIZON!',
        caption: 'DAKAR — Sous le souffle du renouveau politique et technologique sénégalais.',
        dialogue_fr: "Avec notre nouvelle stratégie nationale de souveraineté numérique, le Sénégal forme des ingénieurs pour créer des modèles d'IA adaptés aux langues et réalités africaines.",
        dialogue_pt: "Com nossa nova estratégia nacional de soberania digital, o Senegal forma engenheiros para criar modelos de IA adaptados às línguas e realidades africanas.",
        ipa: "[lə se.ne.ɡal fɔʁm de z‿ɛ̃.ʒe.njœʁ puʁ kʁe.e de mɔ.dɛl d‿i.a]"
      },
      {
        id: 'sen_s3',
        speaker: 'PEDRO',
        speaker_name: 'Pedro Hagah',
        avatar: '👨‍💻',
        location: '📍 Dakar Silicon Valley',
        image: '../assets/img/p1_1.png',
        sfx: 'AVENIR!',
        caption: 'DAKAR HUB — Coopération Sud-Sud entre le Brésil et le Sénégal.',
        dialogue_fr: "Comme le disait Senghor, le français est devenu un pont entre les cultures. L'Afrique est désormais le cœur battant de la langue mondiale.",
        dialogue_pt: "Como dizia Senghor, o francês se tornou uma ponte entre as culturas. A África é agora o coração pulsante da língua mundial.",
        ipa: "[l‿a.fʁik ɛ de.zɔʁ.mɛ lə kœʁ ba.tɑ̃ də la lɑ̃ɡ mɔ̃.djal]"
      }
    ]
  },
  {
    arc_id: 'arc_quebec',
    title: "Arc 3 : Le Québec — La Loi 96 et les Supercalculateurs de Montréal",
    subtitle: "Résistance culturelle du Traité de Paris jusqu'au laboratoire Mila",
    location: "VIEUX-QUÉBEC & MONTRÉAL",
    stories: [
      {
        id: 'qc_s1',
        speaker: 'PEDRO',
        speaker_name: 'Pedro Hagah',
        avatar: '👨‍💻',
        location: '📍 Vieux-Québec, Remparts',
        image: '../assets/img/p2_1.png',
        sfx: 'HISTOIRE!',
        caption: 'QUÉBEC — Du Traité de 1763 aux récentes lois de protection du français.',
        dialogue_fr: "Avec l'adoption récente de la Loi 96, le Québec réaffirme que la langue française est le fondement indérogeable de son identité en Amérique du Nord.",
        dialogue_pt: "Com a recente adoção da Lei 96, o Québec reafirma que a língua francesa é o fundamento inegociável de sua identidade na América do Norte.",
        ipa: "[lə ke.bɛk ʁe.a.fiʁm kə la lɑ̃ɡ fʁɑ̃.sɛz ɛ lə fɔ̃d.mɑ̃]"
      },
      {
        id: 'qc_s2',
        speaker: 'MATHIEU',
        speaker_name: 'Mathieu Tremblay',
        avatar: '👨🏻‍🔬',
        location: '📍 Mila — Institut Québécois d\'IA',
        image: '../assets/img/p1_2.png',
        sfx: 'CALCUL!',
        caption: 'MONTRÉAL — Au cœur des clusters de calcul de Yoshua Bengio.',
        dialogue_fr: "Ici à Montréal, nous développons des modèles open source pour garantir que le français reste une langue de pointe dans la recherche scientifique mondiale.",
        dialogue_pt: "Aqui em Montreal, desenvolvemos modelos de código aberto para garantir que o francês continue sendo uma língua de ponta na pesquisa científica mundial.",
        ipa: "[nu de.vlɔ.pɔ̃ de mɔ.dɛl o.pən sɔʁs puʁ ɡa.ʁɑ̃.tiʁ]"
      }
    ]
  }
];
