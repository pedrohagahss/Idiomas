import fs from 'fs';

const filePath = 'C:/Users/seuca/Desktop/Idiomas/app/js/story_engine.js';
let content = fs.readFileSync(filePath, 'utf8');

const dossiersToEnrich = {
  belgique_chap_01: {
    source: "LE SOIR / RTBF • BRUXELLES",
    badge: "ACTUALITÉ CULTURELLE",
    title_fr: "Bruxelles : La Capitale Mondiale de la Bande Dessinée Fête son Héritage",
    title_pt: "Bruxelas: A Capital Mundial dos Quadrinhos Celebra seu Legado",
    lines: [
      {
        fr: "Considérée comme le berceau historique du neuvième art, Bruxelles accueille chaque année des milliers de passionnés de bande dessinée.",
        pt: "Considerada o berço histórico da nona arte, Bruxelas recebe todos os anos milhares de apaixonados por histórias em quadrinhos."
      },
      {
        fr: "De Tintin à Spirou, les fresques murales transforment le cœur de la capitale belge en un véritable musée à ciel ouvert.",
        pt: "De Tintim a Spirou, os murais transformam o coração da capital belga em um verdadeiro museu a céu aberto."
      },
      {
        fr: "Le Centre Belge de la Bande Dessinée préserve des archives inestimables qui inspirent aujourd'hui les créateurs d'art numérique.",
        pt: "O Centro Belga de Quadrinhos preserva arquivos inestimáveis que inspiram hoje os criadores de arte digital."
      }
    ],
    article_fr: "Considérée par Victor Hugo comme l'une des plus belles places du monde, la Grand-Place de Bruxelles est célèbre pour son Hôtel de Ville gothique et ses maisons corporatives baroques richement dorées. La ville célèbre également son statut incontesté de capitale internationale de la bande dessinée.",
    article_pt: "Considerada por Victor Hugo uma das mais belas praças do mundo, a Grand-Place de Bruxelas é famosa por sua prefeitura gótica e casas corporativas douradas. A cidade também celebra seu status indiscutível de capital internacional dos quadrinhos."
  },
  senegal_chap_01: {
    source: "LE SOLEIL / APS • DAKAR",
    badge: "TRADITION ET INNOVATION",
    title_fr: "Dakar : L'Art Millénaire des Griots et la Transmission Orale Africaine",
    title_pt: "Dakar: A Arte Milenar dos Griots e a Transmissão Oral Africana",
    lines: [
      {
        fr: "Au Sénégal, les griots perpétuent une tradition séculaire de transmission de la mémoire historique à travers les récits chantés.",
        pt: "No Senegal, os griots perpetuam uma tradição secular de transmissão da memória histórica através de narrativas cantadas."
      },
      {
        fr: "À l'ombre du baobab ancestral, la parole vivante demeure le pont fondamental entre les générations et l'esprit de communauté.",
        pt: "À sombra do baobá ancestral, a palavra viva continua sendo a ponte fundamental entre as gerações e o espírito comunitário."
      },
      {
        fr: "La jeunesse dakaroise réinvente aujourd'hui cette éloquence ancestrale grâce aux technologies du son et de l'intelligence artificielle.",
        pt: "A juventude de Dakar reinventa hoje essa eloquência ancestral graças às tecnologias de som e inteligência artificial."
      }
    ],
    article_fr: "Au Sénégal, le baobab est bien plus qu'un arbre : c'est le gardien de la mémoire collective et le symbole de la sagesse africaine. Les griots, dépositaires de la tradition orale, transmettent les épopées et les valeurs de génération en génération sous ses branches majestueuses.",
    article_pt: "No Senegal, o baobá é muito mais que uma árvore: é o guardião da memória coletiva e o símbolo da sabedoria africana. Os griots, guardiões da tradição oral, transmitem as epopeias e valores de geração em geração sob seus galhos majestosos."
  },
  quebec_chap_01: {
    source: "RADIO-CANADA / LE DEVOIR • MONTRÉAL",
    badge: "PATRIMOINE VIVANT",
    title_fr: "Montréal : La Survivance et la Fierté de la Langue Française en Amérique du Nord",
    title_pt: "Montréal: A Sobrevivência e o Orgulho da Língua Francesa na América do Norte",
    lines: [
      {
        fr: "Au Québec, la défense et le rayonnement du français représentent un combat culturel et identitaire mené avec ferveur depuis des siècles.",
        pt: "No Québec, a defesa e a difusão do francês representam uma luta cultural e identitária conduzida com fervor há séculos."
      },
      {
        fr: "Les légendes comme la Chasse-Galerie témoignent de la résilience héroïque des bûcherons face aux hivers rigoureux du Grand Nord.",
        pt: "As lendas como a Canoa Voadora testemunham a resiliência heroica dos lenhadores diante dos invernos rigorosos do Extremo Norte."
      },
      {
        fr: "Montréal s'affirme désormais comme un pôle mondial de recherche en intelligence artificielle profondément attaché à la francophonie.",
        pt: "Montréal afirma-se agora como um polo mundial de pesquisa em inteligência artificial profundamente ligado à francofonia."
      }
    ],
    article_fr: "La Chasse-Galerie est l'une des légendes les plus célèbres du folklore québécois. Elle raconte l'histoire de bûcherons isolés dans les chantiers de la forêt boréale qui concluent un pacte avec le diable pour faire voler leur canot au-dessus des forêts et rejoindre leurs fiancées la nuit du Nouvel An.",
    article_pt: "A Chasse-Galerie (Canoa Voadora) é uma das lendas mais famosas do folclore quebequense. Narra a história de lenhadores isolados nos acampamentos da floresta boreal que fazem um pacto com o diabo para fazer sua canoa voar sobre as florestas e reencontrar suas noivas na noite de Ano Novo."
  },
  france_chap_01: {
    source: "LE MONDE / FRANCE INFO • PARIS",
    badge: "HISTOIRE ET LUMIÈRES",
    title_fr: "Paris : Le Siècle des Lumières et le Panthéon Républicain",
    title_pt: "Paris: O Século das Luzes e o Panteão Republicano",
    lines: [
      {
        fr: "Au cœur de Paris, le Siècle des Lumières a façonné les principes universels d'égalité, de rationalité et de liberté d'expression.",
        pt: "No coração de Paris, o Século das Luzes moldou os princípios universais de igualdade, racionalidade e liberdade de expressão."
      },
      {
        fr: "Au Panthéon, la nation rend hommage aux grands esprits dont les écrits ont éclairé le destin de l'humanité entière.",
        pt: "No Panteão, a nação presta homenagem às grandes mentes cujos escritos iluminaram o destino de toda a humanidade."
      },
      {
        fr: "Cette passion pour le savoir continue d'inspirer les chercheurs et artistes qui font de la France un carrefour culturel planétaire.",
        pt: "Essa paixão pelo conhecimento continua a inspirar os pesquisadores e artistas que tornam a França um cruzamento cultural planetário."
      }
    ],
    article_fr: "Le Siècle des Lumières au XVIIIe siècle a fait de Paris le phare intellectuel du monde occidental. Des philosophes comme Voltaire, Rousseau, Diderot et Montesquieu ont remis en question l'absolutisme et posé les jalons des droits fondamentaux de la personne.",
    article_pt: "O Século das Luzes no século XVIII fez de Paris o farol intelectual do mundo ocidental. Filósofos como Voltaire, Rousseau, Diderot e Montesquieu questionaram o absolutismo e lançaram as bases dos direitos fundamentais da pessoa humana."
  },
  maroc_chap_01: {
    source: "LE MATIN / MAP • FÈS",
    badge: "CIVILISATION ET SAVOIR",
    title_fr: "Fès : L'Université Al Quaraouiyine, Berceau Mondial de l'Enseignement Supérieur",
    title_pt: "Fès: A Universidade Al Quaraouiyine, Berço Mundial do Ensino Superior",
    lines: [
      {
        fr: "Fondée en l'an huit cent cinquante-neuf par Fatima al-Fihriya, l'université Al Quaraouiyine à Fès est la plus ancienne en activité au monde.",
        pt: "Fundada no ano de 859 por Fátima al-Fihriya, a universidade Al Quaraouiyine em Fès é a mais antiga em atividade contínua no mundo."
      },
      {
        fr: "Au cœur de la médina médiévale, ses bibliothèques abritent des manuscrits rares de mathématiques, d'astronomie et de philosophie.",
        pt: "No coração da medina medieval, suas bibliotecas abrigam manuscritos raros de matemática, astronomia e filosofia."
      },
      {
        fr: "Le Maroc conjugue aujourd'hui cet illustre passé savant avec une ouverture résolue vers l'avenir technologique et la francophonie.",
        pt: "O Marrocos conjuga hoje esse ilustre passado erudito com uma abertura resoluta ao futuro tecnológico e à francofonia."
      }
    ],
    article_fr: "La médina de Fès el-Bali est un joyau urbain médiéval préservé presque intact depuis plus de mille ans. Classée au patrimoine mondial de l'UNESCO, elle abrite l'université Al Quaraouiyine, fondée en 859 par une femme visionnaire, Fatima al-Fihriya.",
    article_pt: "A medina de Fès el-Bali é uma joia urbana medieval preservada quase intacta por mais de mil anos. Tombada como patrimônio mundial pela UNESCO, abriga a universidade Al Quaraouiyine, fundada em 859 por uma mulher visionária, Fátima al-Fihriya."
  },
  rdc_chap_01: {
    source: "RADIO OKAPI / ACTUALITE.CD • KINSHASA",
    badge: "VITALITÉ ET CULTURE",
    title_fr: "Kinshasa : La Capitale Francophone la Plus Peuplée du Monde et son Effervescence Créative",
    title_pt: "Kinshasa: A Capital Francófona Mais Populosa do Mundo e sua Efervescência Criativa",
    lines: [
      {
        fr: "Bordée par le majestueux fleuve Congo, Kinshasa est désormais la plus grande métropole francophone de la planète avec dix-sept millions d'habitants.",
        pt: "Banhada pelo majestoso rio Congo, Kinshasa é hoje a maior metrópole francófona do planeta, com dezessete milhões de habitantes."
      },
      {
        fr: "Inscrite au patrimoine culturel de l'UNESCO, la rumba congolaise fait danser l'Afrique et incarne l'élégance légendaire des sapeurs kinois.",
        pt: "Inscrita no patrimônio cultural da UNESCO, a rumba congolesa faz a África dançar e encarna a elegância lendária dos sapeurs de Kinshasa."
      },
      {
        fr: "Portée par une jeunesse dynamique, la ville s'impose également comme un foyer d'ingéniosité technique et d'entrepreneuriat solidaire.",
        pt: "Impulsionada por uma juventude dinâmica, a cidade impõe-se também como um polo de engenho técnico e empreendedorismo solidário."
      }
    ],
    article_fr: "Kinshasa, métropole vibrante de plus de dix-sept millions d'âmes, est le cœur battant de la créativité en Afrique centrale. Le fleuve Congo, puissant et majestueux, nourrit l'imaginaire des musiciens, des écrivains et des artistes peintres.",
    article_pt: "Kinshasa, metrópole vibrante com mais de 17 milhões de almas, é o coração pulsante da criatividade na África Central. O rio Congo, poderoso e majestoso, alimenta a imaginação de músicos, escritores e artistas plásticos."
  }
};

let updatedCount = 0;

for (const [chapId, newDossier] of Object.entries(dossiersToEnrich)) {
  const marker = `"id": "${chapId}",`;
  const idx = content.indexOf(marker);
  if (idx === -1) {
    console.warn(`Capítulo não encontrado: ${chapId}`);
    continue;
  }

  const dossierStart = content.indexOf('"dossier": {', idx);
  if (dossierStart === -1 || dossierStart > idx + 400) {
    console.warn(`Dossier não encontrado para: ${chapId}`);
    continue;
  }

  const dossierEnd = content.indexOf('},', dossierStart);
  if (dossierEnd === -1) {
    console.warn(`Fim do dossier não encontrado para: ${chapId}`);
    continue;
  }

  const formattedDossier = `"dossier": ${JSON.stringify(newDossier, null, 10).replace(/^/gm, '        ').trim()}`;
  content = content.slice(0, dossierStart) + formattedDossier + content.slice(dossierEnd + 1);
  updatedCount++;
  console.log(`Enriquecido dossier de: ${chapId}`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Concluído! ${updatedCount} capítulos atualizados com sucesso.`);
