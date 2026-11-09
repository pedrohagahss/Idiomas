# AGENTS.md — Regras para qualquer agente que continuar este projeto

> Projeto: **HQ Gamificada de Francês (Pedro Hagah)** — app web que ensina francês oral/escrito via quadrinhos em 1ª pessoa.
> Leia **somente** `docs/HANDOFF.md` para saber onde parou. Não releia o projeto inteiro (economia de tokens).

## Ordem de leitura (mínima)
1. `docs/HANDOFF.md` → status + próxima tarefa (checklist).
2. Só se necessário: `docs/ARQUITETURA.md` (schema e engine) e `docs/ERRATA.md` (correções do manual).
3. Modelo-ouro de conteúdo: `content/fr/partie_01/chap_01.json` — **copie este formato** para os demais capítulos.
4. Texto-fonte: `content/fr/partie_01/_source/manual_original.md` (leia apenas a seção do capítulo que estiver convertendo, usando StartLine/EndLine).

## Regras de economia de IA
- Conteúdo = **dados JSON**; código = **uma engine genérica**. Novo capítulo = só novo JSON + 1 linha em `module.json`. Nunca codificar conteúdo dentro do JS.
- Sem frameworks, sem build, sem dependências npm. HTML + CSS + JS (ES modules) puros.
- TTS/STT no navegador via **Web Speech API** (custo zero). Nada de APIs pagas.
- Imagens: placeholders SVG/CSS primeiro; ilustrações geradas só no fim (Fase 5), em lote.
- Edite arquivos com edições pontuais; não reescreva arquivos inteiros sem necessidade.
- Após cada tarefa: rodar `node tools/validate.mjs` e **marcar o checkbox** no `docs/HANDOFF.md` + atualizar "Última sessão".

## Regras do usuário (obrigatórias)
- Responder sempre em **português do Brasil**.
- Sempre oferecer **opções numeradas** de resposta ao final.
- Ao terminar algo: **testar ao vivo** e dar **aviso de voz** (sucesso ou erro) com a voz natural Piper — NUNCA SAPI:
  `powershell -ExecutionPolicy Bypass -File "C:\Users\seuca\.gemini\config\scripts\piper\speak_natural.ps1" "Texto"`

## Comandos
- Validar conteúdo: `node tools/validate.mjs`
- Servir app (Fase 2+): `npx --yes http-server app -p 5173 -c-1` ou `node tools/serve.mjs` (a criar). Abrir http://localhost:5173
