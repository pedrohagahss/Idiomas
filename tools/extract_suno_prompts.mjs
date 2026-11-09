import { MassiveStoryEngine } from '../app/js/story_engine.js';

const engine = new MassiveStoryEngine();

console.log('--- SUNO TRACKS FOR ALL 10 BOOKS ---');
engine.works.forEach((w, index) => {
  console.log(`\n========================================`);
  console.log(`LIVRO ${index + 1}: ${w.title}`);
  console.log(`País/Região: ${w.country || w.id}`);
  console.log(`Arquivo atual: ${w.soundtrack ? w.soundtrack.file : 'nenhum'}`);
  if (w.soundtrack) {
    console.log(`Título da Música: ${w.soundtrack.title}`);
    console.log(`Estilo Musical: ${w.soundtrack.musical_style_paragraph}`);
    console.log(`Prompt para Suno AI: ${w.soundtrack.suno_prompt_paragraph}`);
    console.log(`Letra em Francês: \n"${w.soundtrack.lyrics_paragraph}"`);
  }
});
