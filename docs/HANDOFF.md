# HANDOFF — Estado do projeto (fonte da verdade do progresso)

**Última sessão:** 2026-11-17 · Claude — **v9 (ainda NÃO publicada; está no branch `claude/busy-fermi-wt121b`)**. (A) **Flashcards "Révision"**: `js/flashcards.js` (puro; `node tools/test_flashcards.mjs`) gera os cartões das próprias cenas, sem conteúdo novo — tipos `recall` (PT→falar FR), `cloze` (lacuna), `listen` (só áudio) e `verb` (tempos do `verb_challenge`); frases longas são divididas na pontuação quando FR e PT casam. Repetição espaçada Leitner (1/3/7/16/35 dias) guardada em `progress.data.cards`. `js/review.js` é a interface: frente → falar (opcional) → virar → Errei/Difícil/Bom/Fácil (microfone só sugere). Gatilhos: fim de capítulo em `nextScene()` (1x por dia por capítulo, pulável) e botão "REVISÃO DO DIA (N)" na capa. Decisões do usuário: sem cartão-relâmpago no meio do capítulo; marcação manual; revisão pulável. (B) **Link de progresso**: "MEU PROGRESSO" → "Enviar link para o WhatsApp" gera `…/app/index.html#p=HQFR3.<deflate+base64url>`; ao abrir, `importProgressFromLink()` FUNDE o progresso (maiores notas, união de cenas, cartão mais revisado) e limpa a URL. (C) v8 anterior: `progress.js` v2 com retomada, `scoring.js`/`speech.js` com avaliação honesta ao vivo, fluxo sem fala automática após acerto. Testado ao vivo em Chromium com microfone e reconhecedor simulados.
**Próxima tarefa:** Validar em aparelho real (Safari iOS e Chrome Android) o reconhecimento de fala e o modo "só transcrição"; publicar a v8 no GitHub Pages (merge do branch `claude/busy-fermi-wt121b` em `main`). Pendência conhecida: `tools/serve.mjs` tem caminho Windows fixo e não roda em Linux (use `python3 -m http.server 5173`).

## Como continuar (para o próximo modelo)
1. Leia `AGENTS.md` (regras) — contém as regras do usuário (PT-BR, opções numeradas, voz Piper).
2. Para testar o app web: execute `node tools/serve.mjs 5173` e acesse http://localhost:5173/app/ (ou via Cloudflare Tunnel ativo).
3. Validação de dados: execute `node tools/validate.mjs` `node tools/test_scoring.mjs` e `node tools/test_flashcards.mjs`

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

## Fase 4.5 — Persistência e pronúncia v8 ✅
- [x] T4.5 `progress.js` v2 (retomada, cenas, backup) + correção do minigame sem `chapterId`
- [x] T4.6 `scoring.js` + `speech.js` (avaliação honesta, ao vivo, parada automática)
- [x] T4.7 Fluxo sem fala automática após acerto; "Próxima ▶"; pré-carregamento
- [x] T4.9 Flashcards Révision (fim de capítulo + revisão do dia, repetição espaçada)
- [x] T4.10 Link de progresso pelo WhatsApp (`#p=`), com fusão de progresso
- [ ] T4.8 Teste em aparelho real (iOS Safari / Android Chrome)

## Fase 5 — Mídia (Ilustrações finais e áudio)
- [ ] T5.1 Gerar ilustrações estilo HQ por painel a partir de `visual_description` (salvar em `assets/img/<panel_id>.png`)
- [ ] T5.2 (Opcional) Áudios fr-FR com Piper local (voz `fr_FR-siwis-medium`) em `assets/audio/<panel_id>_<n>.wav`

## Fase 7 — Outros idiomas (pedido do usuário, não iniciado)
- [ ] Usuário quer espanhol, alemão, italiano, russo e outros em paralelo. Exige: histórias traduzidas por idioma, áudios gerados (edge-tts não é acessível da sessão em nuvem), `lang` do reconhecedor e chave fonética por idioma em `scoring.js`.

## Fase 6 — Próximas partes do manual
- [ ] Criar `content/fr/partie_02/` com o mesmo schema e adicionar o caminho em `PARTS` no validador e no loader.

---
## Decisões registradas
- Sem frameworks pesados (React/Vue/Webpack desnecessários): Vanilla JS ES Modules puro.
- Servidor local sem dependências externas (`tools/serve.mjs`).
- IPA com notação de ligadura `‿` e pausas de respiração ativas `|` e `‖`.
