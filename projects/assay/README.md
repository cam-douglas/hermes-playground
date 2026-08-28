# Assay

Furnace / cupel for silent tool-argument corruption. A parsed call is not a hold. Heat the envelope. Weigh delivered arguments against the declared schema and the raw markup. Name the impurity or admit **intact**.

Verdicts: **intact**, **ghost**, **absorb**, **mix**, **prefix**, **silent**, **retry**, **mangled**. Idle word is **intact**. Fail-closed on ghost / absorb / mangled.

NOT Coda (silent assistant *text block* loss). NOT Suture (SSE / stream tear at a tool boundary). NOT Sigil (thinking-block signature / hollow thinking). NOT Reed (MCP connected-vs-registered). NOT Scrim (secret DLP at I/O). NOT Knock (permission-grant stalls). NOT Wicket / Plumb (worktree isolation / cwd identity). NOT Stencil (plan-mode bleed). NOT Blot (image poison). NOT Hasp (file lease). NOT Fathom (standing rules after compact). NOT Parity (claim vs GitHub/Vercel/Linear). NOT Reveille (muster / duplicate dispatch). NOT Quench (token-burn fuse). Not a leftover woodworking slider, packed-sky lattice, or millimetre leftover.

## Live catalog path

`/assay/` is this static cupellation house. Demo works with no secrets and no npm.

1. Seeded ghost `#84405` is already in the cupel: parse succeeds, a string holds an injected `<parameter name=` → **ghost**.
2. Switch `#84362` — mangled close tag, a declared field vanishes into a host field → **absorb**.
3. Switch `#64774` — unparseable; retry also failed → **retry**.
4. Switch `#49747` — legacy XML tool-use mixed into JSON → **mix**.
5. Switch `#63879` / `#70544` — stray `court` token / dropped `antml:` namespace → **prefix**.
6. Switch `#69522` — long unicode-escaped arguments fail JSON parse → **mangled**.
7. Switch `#70657` — malformed leftover contaminates later history → **mangled**.
8. Switch Codex `#19765` — truncated `function_call.arguments` JSON → **mangled**.
9. Switch Codex `#31517` — arguments arrived as a JSON string → **mangled**.
10. Switch the intact control — delivered arguments match schema and markup → **intact**.
11. **Fire** heats the envelope. **Weigh** scores it. **Admit** lets only intact through. **Refuse** keeps the named impurity. **Clear · intact** empties the cupel to **intact**.
12. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.
13. Idle word is **intact**. Never the product name.

## Hook

`projects/assay/hook/` is a PreToolUse argument-integrity scorer. Score envelopes. Name the impurity. Fail-closed on ghost / absorb / mangled. See `hook/README.md`.

```bash
node projects/assay/hook/index.mjs --listen 9070
node --test projects/assay/hook/assay.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#84405](https://github.com/anthropics/claude-code/issues/84405) — tool call parses successfully but a string parameter is silently corrupted with an adjacent parameter's boundary tag (`<parameter name=`), correlated with parameter count (open, PRIMARY seed)
- [anthropics/claude-code#84362](https://github.com/anthropics/claude-code/issues/84362) — tag-grammar parser silently absorbs parameter blocks on mismatched/mangled close tags; measured 6.2% silent field loss on parameter-rich MCP calls
- [anthropics/claude-code#64774](https://github.com/anthropics/claude-code/issues/64774) — Opus 4.8 emits unparseable tool calls at ~1.5%; retry also failed
- [anthropics/claude-code#49747](https://github.com/anthropics/claude-code/issues/49747) — Opus 4.7 mixes legacy XML tool-use format into JSON tool calls on longer payloads
- [anthropics/claude-code#63879](https://github.com/anthropics/claude-code/issues/63879) — tool-use block markup intermittently corrupted with a stray token prefix
- [anthropics/claude-code#70544](https://github.com/anthropics/claude-code/issues/70544) — malformed tool-call emission (dropped antml: namespace + spurious "court" token) under multibyte-dense context
- [anthropics/claude-code#69522](https://github.com/anthropics/claude-code/issues/69522) — long unicode-escaped tool arguments fail JSON parse
- [anthropics/claude-code#62123](https://github.com/anthropics/claude-code/issues/62123) — "Model's tool call could not be parsed (retry also failed)" (high-traffic)
- [anthropics/claude-code#70657](https://github.com/anthropics/claude-code/issues/70657) — malformed tool call triggers context contamination and fabricated conversation history
- [openai/codex#19765](https://github.com/openai/codex/issues/19765) — truncated JSON in function_call.arguments
- [openai/codex#31517](https://github.com/openai/codex/issues/31517) — tool_search_call.arguments sent as a JSON string (invalid_type)
- [openai/codex#26379](https://github.com/openai/codex/issues/26379) — malformed tool_search_call arguments persist and poison resume
