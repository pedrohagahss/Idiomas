import { MassiveStoryEngine } from '../app/js/story_engine.js';
import fs from 'node:fs';

const engine = new MassiveStoryEngine();

const formattedTracks = engine.works.map((w, i) => {
  const st = w.soundtrack || {};
  return {
    bookIndex: i + 1,
    bookTitle: w.title,
    country: w.country || w.id,
    trackTitle: st.title || 'Thème Musical',
    musicalStyle: st.musical_style_paragraph || '',
    sunoPrompt: st.suno_prompt_paragraph || '',
    lyricsFr: st.lyrics_paragraph || '',
    synopsisPt: w.synopsis_pt || ''
  };
});

fs.writeFileSync('tools/all_suno_tracks.json', JSON.stringify(formattedTracks, null, 2), 'utf8');
console.log(`Exported ${formattedTracks.length} tracks to tools/all_suno_tracks.json`);
