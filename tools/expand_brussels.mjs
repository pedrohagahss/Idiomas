import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEST = path.resolve(__dirname, '..', 'app', 'js', 'story_engine.js');

let content = fs.readFileSync(DEST, 'utf-8');

const expandedBelgiumChapters = `[
          {
            id: "vol2_chap_01",
            title: "Capítulo 1 : La Grand-Place et le Manneken-Pis — L'Humour et la Liberté",
            location: "BRUXELLES, BELGIQUE",
            environment: "cafe_procope",
            avatar: "🇧🇪",
            image: "../assets/img/bruxelles_grand_place.jpg",
            dossier: {
              badge: "PATRIMOINE MONDIAL UNESCO",
              title_fr: "La Grand-Place et la Philosophie de la Zwanze",
              title_pt: "A Grand-Place e a Filosofia da Zwanze",
              article_fr: "Considérée par Victor Hugo comme l'une des plus belles places du monde, la Grand-Place de Bruxelles est célèbre pour son Hôtel de Ville gothique et ses maisons corporatives baroques richement dorées. Tout près, la statue malicieuse du Manneken-Pis incarne l'esprit de la 'zwanze' : un humour populaire bruxellois fondé sur la dérision, la liberté d'esprit et le refus de toute arrogance.",
              article_pt: "Considerada por Victor Hugo como uma das mais belas praças do mundo, a Grand-Place de Bruxelas é célebre por sua Prefeitura gótica e pelas Casas das Guildas ricamente douradas. Logo ao lado, a estátua do Manneken-Pis traduz o espírito da 'zwanze': um humor popular bruxelense calcado na irreverência, na liberdade de pensamento e na recusa a qualquer soberba."
            },
            scenes: [
              {
                speaker: "PEDRO",
                speaker_name: "Pedro Hagah",
                avatar: "👨‍💻",
                location: "📍 Grand-Place de Bruxelles",
                image: "../assets/img/bruxelles_grand_place.jpg",
                sfx: "WOUAH!",
                caption: "BRUXELLES — L'émerveillement devant les façades dorées de la Grand-Place.",
                dialogue_fr: "La Grand-Place de Bruxelles est un chef-d'œuvre : chaque façade dorée raconte l'histoire des artisans.",
                dialogue_pt: "A Grand-Place de Bruxelas é uma obra-prima: cada fachada dourada conta a história dos artesãos.",
                ipa: "[la ɡʁɑ̃.plas də bʁy.sɛl ɛt‿œ̃ ʃɛf.d‿œvʁ | ʃak fa.sad dɔ.ʁe ʁa.kɔ̃t l‿is.twaʁ de.z‿aʁ.ti.zɑ̃]"
              },
              {
                speaker: "YANN",
                speaker_name: "Yann (Dessinateur Belge)",
                avatar: "🇧🇪",
                location: "📍 Rue de l'Étuve, Bruxelles",
                image: "../assets/img/bruxelles_grand_place.jpg",
                sfx: "HAHA!",
                caption: "BRUXELLES — La rencontre avec le Manneken-Pis et le sourire bruxellois.",
                dialogue_fr: "Voici le Manneken-Pis ! Notre plus grand trésor est un symbole d'humour et de courage pacifique.",
                dialogue_pt: "Eis o Manneken-Pis! Nosso maior tesouro é um símbolo de humor e coragem pacífica.",
                ipa: "[vwa.si lə man.kən.pis | nɔtʁ ply ɡʁɑ̃ tʁe.zɔʁ ɛt‿œ̃ sɛ̃.bɔl d‿y.muʁ e də ku.ʁaʒ pa.si.fik]"
              },
              {
                speaker: "PEDRO",
                speaker_name: "Pedro Hagah",
                avatar: "👨‍💻",
                location: "📍 Grand-Place de Bruxelles",
                image: "../assets/img/bruxelles_grand_place.jpg",
                sfx: "CLAC!",
                caption: "BRUXELLES — Le lien fraternel entre le rire nordestin et la zwanze belge.",
                dialogue_fr: "Cet esprit de liberté me rappelle le Nordeste brésilien : l'humour est l'arme des peuples dignes.",
                dialogue_pt: "Esse espírito de liberdade me lembra o Nordeste brasileiro: o humor é a arma dos povos dignos.",
                ipa: "[sɛt‿ɛs.pʁi də li.bɛʁ.te mə ʁa.pɛl lə nɔʁ.dɛst bʁe.zi.ljɛ̃ | l‿y.muʁ ɛ l‿aʁm de pœpl diɲ]"
              }
            ]
          },
          {
            id: "vol2_chap_01_b",
            title: "Capítulo 2 : Le Centre Belge de la BD — Victor Horta et la Ligne Claire",
            location: "RUE DES SABLES, BRUXELLES",
            environment: "studio_tech",
            avatar: "🎨",
            image: "../assets/img/bruxelles_cbbd.jpg",
            dossier: {
              badge: "TEMPLE DE LA NONA ARTE",
              title_fr: "Le Centre Belge de la Bande Dessinée (CBBD)",
              title_pt: "O Centro Belga dos Quadrinhos (CBBD)",
              article_fr: "Installé dans un somptueux grand magasin Art Nouveau conçu en 1906 par Victor Horta, le CBBD est le sanctuaire mondial du 9e Art. De Tintin d'Hergé aux Schtroumpfs de Peyo et à Gaston Lagaffe de Franquin, la Belgique a inventé l'école de la 'Ligne Claire' : une lisibilité graphique absolue et une maîtrise narrative sans égale.",
              article_pt: "Instalado em um magnífico edifício Art Nouveau concebido em 1906 por Victor Horta, o CBBD é o santuário mundial da Nona Arte. De Tintin de Hergé aos Smurfs de Peyo e Gaston Lagaffe de Franquin, a Bélgica inventou a escola da 'Linha Clara': nitidez gráfica impecável e narrativa sequencial incomparável."
            },
            scenes: [
              {
                speaker: "PEDRO",
                speaker_name: "Pedro Hagah",
                avatar: "👨‍💻",
                location: "📍 Atrium Victor Horta, CBBD",
                image: "../assets/img/bruxelles_cbbd.jpg",
                sfx: "CLIC!",
                caption: "BRUXELLES — L'entrée dans le temple Art Nouveau de la bande dessinée.",
                dialogue_fr: "Quelle émotion d'être ici ! Victor Horta a créé un palais de lumière pour célébrer le dessin et l'imaginaire.",
                dialogue_pt: "Que emoção estar aqui! Victor Horta criou um palácio de luz para celebrar o desenho e a imaginação.",
                ipa: "[kɛl e.mo.sjɔ̃ d‿ɛtʁ i.si | vik.tɔʁ ɔʁ.ta a kʁe.e œ̃ pa.lɛ də ly.mjɛʁ puʁ se.le.bʁe lə dɛ.sɛ̃]"
              },
              {
                speaker: "ELENA",
                speaker_name: "Charlotte (Conservatrice du Musée)",
                avatar: "👩‍🎨",
                location: "📍 Galerie des Planches Originales, CBBD",
                image: "../assets/img/bruxelles_cbbd.jpg",
                sfx: "REGARDE!",
                caption: "BRUXELLES — L'explication de la Ligne Claire devant la fusée lunaire de Tintin.",
                dialogue_fr: "Regardez cette fusée rouge et blanche ! La Ligne Claire exige une pureté du trait où chaque détail compte.",
                dialogue_pt: "Olhe este foguete vermelho e branco! A Linha Clara exige uma pureza de traço onde cada detalhe importa.",
                ipa: "[ʁə.ɡaʁ.de sɛt fy.ze ʁuʒ e blɑ̃ʃ | la liɲ klɛʁ ɛɡ.ziʒ yn pyʁ.te dy tʁɛ u ʃak de.taj kɔ̃t]"
              },
              {
                speaker: "PEDRO",
                speaker_name: "Pedro Hagah",
                avatar: "👨‍💻",
                location: "📍 CBBD, Rue des Sables",
                image: "../assets/img/bruxelles_cbbd.jpg",
                sfx: "INSPIRATION!",
                caption: "BRUXELLES — La synthèse entre la BD classique et le design moderne.",
                dialogue_fr: "La bande dessinée est une grammaire vivante : elle unit la rigueur du code à la liberté de la poésie.",
                dialogue_pt: "Os quadrinhos são uma gramática viva: unem o rigor do código à liberdade da poesia.",
                ipa: "[la bɑ̃d dɛ.si.ne ɛt‿yn ɡʁa.mɛʁ vi.vɑ̃t | ɛl y.ni la ʁi.ɡœʁ dy kɔd a la li.bɛʁ.te də la pɔ.e.zi]"
              }
            ]
          },
          {
            id: "vol2_chap_01_c",
            title: "Capítulo 3 : Le Grand Sablon et les Chocolats — Les Saveurs Royales",
            location: "PLACE DU GRAND SABLON, BRUXELLES",
            environment: "cafe_procope",
            avatar: "🍫",
            image: "../assets/img/bruxelles_sablon.jpg",
            dossier: {
              badge: "GASTRONOMIE D'EXCEPTION",
              title_fr: "Le Sablon et l'Artisanat du Chocolat Belge",
              title_pt: "O Sablon e o Artesanato do Chocolate Belga",
              article_fr: "Le quartier du Grand Sablon est le cœur gourmand de la capitale européenne. C'est en 1912 à Bruxelles que Jean Neuhaus invente la 'praline' : un chocolat fourré d'une ganache onctueuse protégé par un coffret appelé ballotin. Avec les gaufres dorées au sucre perlé de Liège, la Belgique a élevé la gourmandise au rang de grand art.",
              article_pt: "O bairro do Grand Sablon é o coração gastronômico da capital europeia. Foi em 1912 em Bruxelas que Jean Neuhaus inventou o bombom recheado batizado de praliné. Junto com as waffles quentes douradas no açúcar perolado de Liège, a Bélgica transformou a gastronomia em alta arte cultural."
            },
            scenes: [
              {
                speaker: "PEDRO",
                speaker_name: "Pedro Hagah",
                avatar: "👨‍💻",
                location: "📍 Place du Grand Sablon",
                image: "../assets/img/bruxelles_sablon.jpg",
                sfx: "HUMMM!",
                caption: "BRUXELLES — Le parfum des gaufres chaudes et du chocolat sous les pavés du Sablon.",
                dialogue_fr: "L'arôme du chocolat artisanal et des gaufres caramélisées transforme cette promenade en fête pour les sens.",
                dialogue_pt: "O aroma do chocolate artesanal e das waffles caramelizadas transforma este passeio em uma festa para os sentidos.",
                ipa: "[l‿a.ʁom dy ʃɔ.kɔ.la aʁ.ti.za.nal e de ɡofʁ ka.ʁa.me.li.ze tʁɑ̃s.fɔʁm sɛt pʁɔm.nad ɑ̃ fɛt]"
              },
              {
                speaker: "YANN",
                speaker_name: "Pierre (Maître Chocolatier)",
                avatar: "🍫",
                location: "📍 Atelier Chocolaterie du Sablon",
                image: "../assets/img/bruxelles_sablon.jpg",
                sfx: "SAVOURE!",
                caption: "BRUXELLES — La dégustation d'une praline noire à la ganache de cacao.",
                dialogue_fr: "Goûtez cette praline au cacao noir : elle fond doucement en bouche avec une touche subtile de vanille.",
                dialogue_pt: "Prove este praliné de cacau amargo: ele derrete suavemente na boca com um toque sutil de baunilha.",
                ipa: "[ɡu.te sɛt pʁa.lin o ka.ka.o nwaʁ | ɛl fɔ̃ dus.mɑ̃ ɑ̃ buʃ a.vɛk yn tuʃ syb.til də va.nij]"
              },
              {
                speaker: "PEDRO",
                speaker_name: "Pedro Hagah",
                avatar: "👨‍💻",
                location: "📍 Place du Grand Sablon",
                image: "../assets/img/bruxelles_sablon.jpg",
                sfx: "MERCI!",
                caption: "BRUXELLES — La convivialité et la chaleur de l'accueil belge.",
                dialogue_fr: "La langue française se savoure aussi à travers la table : partager une saveur, c'est créer une amitié.",
                dialogue_pt: "A língua francesa também se saboreia à mesa: compartilhar um sabor é criar uma amizade.",
                ipa: "[la lɑ̃ɡ fʁɑ̃.sɛz sə sa.vuʁ o.si a tʁa.vɛʁ la tabl | paʁ.ta.ʒe yn sa.vœʁ s‿ɛ kʁe.e yn a.mi.tje]"
              }
            ]
          }
        ]`;

// Substitui a definição de capítulos de belgique_bd
const targetRegex = /id:\s*"belgique_bd"[\s\S]*?chapters:\s*\[this\.volumes\.vol_2\[0\]\]/g;
const replacement = `id: "belgique_bd",
        category: "francophonie",
        country: "Bélgica (Bruxelles)",
        flag: "🇧🇪",
        badge: "NONA ARTE & CHOCOLATE",
        coverImage: "../assets/img/bruxelles_grand_place.jpg",
        title: "Bruxelles : Grand-Place, BD & Chocolat",
        title_pt: "Bruxelas: Grand-Place, Nona Arte e Chocolates",
        duration: "3 Capítulos • 9 Cenas",
        synopsis_fr: "Une plongée fascinante au cœur de Bruxelles : la Grand-Place scintillante, le Centre Belge de la BD de Victor Horta avec Hergé et la Ligne Claire, et les saveurs inoubliables des chocolatiers du Sablon.",
        synopsis_pt: "Uma jornada inesquecível pelo coração de Bruxelas: a deslumbrante Grand-Place, o Museu da BD de Victor Horta com a Linha Clara de Hergé e os aromas dos chocolates artesanais e waffles do Sablon.",
        chapters: ${expandedBelgiumChapters}`;

content = content.replace(targetRegex, replacement);

fs.writeFileSync(DEST, content, 'utf-8');
console.log('Obra de Bruxelas expandida com sucesso com 3 capítulos e 9 cenas!');
