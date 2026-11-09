// Validador de conteúdo — sem dependências. Uso: node tools/validate.mjs
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PARTS = ['content/fr/partie_01'];
let errors = 0, warns = 0;
const err = (f, m) => { errors++; console.log(`  ✗ [${f}] ${m}`); };
const warn = (f, m) => { warns++; console.log(`  ! [${f}] ${m}`); };
const req = (o, keys, f, ctx) => keys.forEach(k => {
  if (o?.[k] === undefined || o[k] === '') err(f, `${ctx}: campo obrigatório "${k}" ausente`);
});
const load = (p, f) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch (e) { err(f, `JSON inválido: ${e.message}`); return null; } };
const norm = s => s.replace(/\s+/g, ' ').trim();

for (const part of PARTS) {
  const dir = join(ROOT, part);
  console.log(`\n▶ ${part}`);
  const mod = load(join(dir, 'module.json'), 'module.json');
  if (!mod) continue;
  req(mod, ['module_name', 'target_language', 'native_language', 'evaluation_metrics', 'chapters'], 'module.json', 'module');

  for (const ch of mod.chapters) {
    const f = ch.file, p = join(dir, f);
    if (!existsSync(p)) { (ch.status === 'done' ? err : warn)(f, `arquivo não existe (status: ${ch.status})`); continue; }
    const c = load(p, f); if (!c) continue;
    req(c, ['chapter_id', 'order', 'title_fr', 'title_pt', 'scenes'], f, 'capítulo');
    if (c.chapter_id !== ch.id) err(f, `chapter_id "${c.chapter_id}" ≠ module.json "${ch.id}"`);
    const ids = new Set(); let n = 0;
    for (const s of c.scenes || []) {
      req(s, ['scene_id', 'title_fr', 'panels'], f, `cena ${s.scene_id}`);
      for (const pn of s.panels || []) {
        n++; const ctx = `painel ${pn.panel_id}`;
        req(pn, ['panel_id', 'visual_description', 'dialogue_fr', 'dialogue_pt', 'breath_groups', 'audio_target_duration_ms', 'pause_repetition_ms', 'phonetics_guide', 'interactive_quiz'], f, ctx);
        if (ids.has(pn.panel_id)) err(f, `${ctx}: panel_id duplicado`); ids.add(pn.panel_id);
        if (pn.breath_groups?.length) {
          const joined = norm(pn.breath_groups.map(b => b.fr).join(' '));
          if (joined !== norm(pn.dialogue_fr)) err(f, `${ctx}: breath_groups não reconstroem dialogue_fr`);
          pn.breath_groups.forEach((b, i) => { if (!(b.pause_ms > 0)) err(f, `${ctx}: breath_group ${i} sem pause_ms`); });
        }
        if (pn.phonetics_guide && !/^\[.*\]$/.test(pn.phonetics_guide)) warn(f, `${ctx}: IPA deve estar entre [ ]`);
        const q = pn.interactive_quiz;
        if (q) {
          req(q, ['type', 'sentence_masked', 'correct_answer', 'distractors'], f, `${ctx} quiz`);
          if (!q.sentence_masked?.includes('_____')) err(f, `${ctx}: sentence_masked sem "_____"`);
          if (q.distractors?.includes(q.correct_answer)) err(f, `${ctx}: resposta está nos distractors`);
          if ((q.distractors?.length || 0) < 2) warn(f, `${ctx}: menos de 2 distractors`);
          if (q.sentence_masked && norm(q.sentence_masked.replace('_____', q.correct_answer)) !== norm(pn.dialogue_fr))
            err(f, `${ctx}: sentence_masked + resposta ≠ dialogue_fr`);
        }
      }
    }
    for (const ex of c.exercises || []) {
      req(ex, ['id', 'type', 'instruction_fr', 'instruction_pt'], f, `exercício ${ex.id}`);
      if (ex.type === 'audio_recording' && !ex.script_fr) err(f, `exercício ${ex.id}: falta script_fr`);
      if (ex.type !== 'audio_recording' && !ex.items?.length) err(f, `exercício ${ex.id}: sem items`);
      for (const it of ex.items || []) if (ex.type === 'multiple_choice' && !it.options?.includes(it.answer)) err(f, `exercício ${ex.id}: answer fora de options`);
    }
    console.log(`  ✓ ${f}: ${c.scenes?.length || 0} cena(s), ${n} painel(is), ${c.exercises?.length || 0} exercício(s)`);
  }
}
console.log(`\n${errors ? '❌' : '✅'} ${errors} erro(s), ${warns} aviso(s)`);
process.exit(errors ? 1 : 0);
