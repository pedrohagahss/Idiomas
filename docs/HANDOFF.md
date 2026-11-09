# HANDOFF — Estado do projeto (fonte da verdade do progresso)

**Última sessão:** 2026-11-09 · Antigravity — Pipeline de áudio neural completo integrado: 3.142 clipes MP3 de estúdio gerados para todos os 308 diálogos, 308 legendas do narrador, dossiês culturais e 2.325 palavras de vocabulário, eliminando qualquer voz robótica do navegador. Safari iOS e desktop 100% responsivos: removido o `zoom: 0.8` (que causava cortes na viewport do Safari) e implementada escala proporcional multi-dispositivo pura (82% font-base + elementos compactos sem truncar tela nem dock). Gerador Suno AI customizado em modal com prompts por livro. Versão v7 publicada com sucesso no GitHub Pages (`https://pedrohagahss.github.io/Idiomas/app/index.html?v=20261109_7`).
**Próxima tarefa:** Testes de usabilidade ao vivo com o usuário em Safari mobile e demais dispositivos; criação das músicas Suno AI conforme os prompts gerados.

## Como continuar (para o próximo modelo)
1. Leia `AGENTS.md` (regras) — contém as regras do usuário (PT-BR, opções numeradas, voz Piper).
2. Para testar o app web: execute `node tools/serve.mjs 5173` e acesse http://localhost:5173/app/ (ou via Cloudflare Tunnel ativo).
3. Validação de dados: execute `node tools/validate.mjs`

### Índice do texto-fonte (`content/fr/partie_01/_source/manual_original.md`, 303 linhas)
| Seção | Linhas |
|---|---|
| 1. Cadre pédagogique + payload exemplo | 5–43 |
| Chapitre 1 (✅ convertido) | 44–122 |
| Chapitre 2 — Routine / pronominaux / prendre (✅ convertido) | 123–186 |
| Chapitre 3 — Design 3D / SAGA / passé composé (✅ convertido) | 187–235 |
| Chapitre 4 — JT Seu Carro PE / ConsutIA / connecteurs (✅ convertido) | 236–275 |
| 6. Spécifications techniques (→ `module.json`) (✅ integrado) | 276–303 |

---

## Fase 1 — Arquitetura e registro ✅
- [x] T1.1 Estrutura de pastas + `AGENTS.md`
- [x] T1.2 `docs/ARQUITETURA.md` (schema, engine, fases)
- [x] T1.3 Manual original salvo intacto em `_source/manual_original.md`
- [x] T1.4 `module.json` (métricas, vocabulário, lista de capítulos)
- [x] T1.5 `chap_01.json` MODELO-OURO (3 painéis, breath groups, IPA revisado, quizzes, gramática, exercícios, vocabulário)
- [x] T1.6 `tools/validate.mjs` testado (0 erros)
- [x] T1.7 `docs/ERRATA.md` com correções pedagógicas do manual

## Fase 2 — Conversão de conteúdo ✅
- [x] T2.1 `chap_02.json` (vinhetas 2.1, 2.2; gramática: pronominais + prendre; exercício múltipla escolha com `options`) — ERRATA Cap. 2 aplicada
- [x] T2.2 `chap_03.json` (vinhetas 3.1, 3.2; marcos 2006–2016 em `context.bullets_fr`; gramática passé composé + tabela de particípios) — ERRATA Cap. 3 aplicada + exercício extra fill_in_the_blank
- [x] T2.3 `chap_04.json` (vinhetas 4.1, 4.2; conectores grâce à / afin de / en tant que como `grammar`; exercício múltipla escolha de conectores) — ERRATA Cap. 4 aplicada
- [x] T2.4 `node tools/validate.mjs` → 0 erros, 0 avisos

## Fase 3 — Engine web mínima (`app/`) ✅
- [x] T3.1 `app/index.html` + `styles.css` (layout HQ mobile-first, balão, painel IPA, toggle PT)
- [x] T3.2 `js/loader.js` (fetch `../content/fr/partie_01/module.json` e capítulos) + `js/main.js` (rota hash `#/chap_01/p1_1`, menu de capítulos)
- [x] T3.3 `js/comic.js` (renderiza cena/painel, SVG estilizado dinâmico com retícula BD, navegação ◀ ▶)
- [x] T3.4 `js/audio.js` (loop breath-group com `speechSynthesis` fr-FR, barra "Sua vez!" durante `pause_ms`, botões ▶ 🐢 🔁)
- [x] T3.5 `js/quiz.js` (fill_in_the_blank / multiple_choice com opções embaralhadas, feedback + `explanation_pt`; modais de `grammar` e `exercises`)
- [x] T3.6 Teste ao vivo: servidor leve `tools/serve.mjs` testado com retorno HTTP 200 em todas as rotas estáticas

## Fase 4 — Treino oral e gamificação ✅
- [x] T4.1 `js/speech.js`: MediaRecorder (gravar/ouvir a si mesmo) + SpeechRecognition fr-FR + score Levenshtein por palavra vs `pronunciation_accuracy_threshold`; fallback autoavaliação
- [x] T4.2 Exercício `audio_recording` (script completo em cada capítulo)
- [x] T4.3 `js/progress.js`: XP (+10 ouvir, +20 repetição aprovada, +15 quiz, +50 capítulo), streak diário; `localStorage` `hq_fr_progress_v1`; barra de progresso no topo
- [x] T4.4 Modais de vocabulário e exercícios práticos com reprodução de áudio palavra por palavra

## Fase 5 — Mídia (Ilustrações finais e áudio)
- [ ] T5.1 Gerar ilustrações estilo HQ por painel a partir de `visual_description` (salvar em `assets/img/<panel_id>.png`)
- [ ] T5.2 (Opcional) Áudios fr-FR com Piper local (voz `fr_FR-siwis-medium`) em `assets/audio/<panel_id>_<n>.wav`

## Fase 6 — Próximas partes do manual
- [ ] Criar `content/fr/partie_02/` com o mesmo schema e adicionar o caminho em `PARTS` no validador e no loader.

---
## Decisões registradas
- Sem frameworks pesados (React/Vue/Webpack desnecessários): Vanilla JS ES Modules puro.
- Servidor local sem dependências externas (`tools/serve.mjs`).
- IPA com notação de ligadura `‿` e pausas de respiração ativas `|` e `‖`.
