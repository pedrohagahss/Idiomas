import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('assets/audio/manifest.json', 'utf8'));

const jsContent = `/**
 * AUDIO MANIFEST (ES Module)
 * Carregamento síncrono instantâneo no navegador sem requisições HTTP adicionais.
 * Mapeia 308 cenas para seus arquivos estáticos .mp3 pré-renderizados em assets/audio/cache/
 */

export const AUDIO_MANIFEST = ${JSON.stringify(manifest, null, 2)};
`;

fs.writeFileSync('app/js/audio_manifest.js', jsContent, 'utf8');
console.log('Gerado app/js/audio_manifest.js com sucesso!');
