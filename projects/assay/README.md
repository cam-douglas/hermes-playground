# Assay

Touchstone / assay furnace for silent tool-argument corruption. A parsed call is not a hold. Heat the envelope. Weigh delivered arguments against the declared schema and the raw markup. Name the impurity or admit **sterling**.

Verdicts: **sterling**, **tainted**, **absorbed**, **leaked**, **hollow**, **garbled**, **spoiled**, **retried**. Idle word is **sterling**. Fail-closed on tainted / absorbed / garbled. Slack alarm on absorbed / hollow. Linear tool-assay incident on absorbed / tainted.

NOT Coda (silent assistant *text block* loss). NOT Suture (SSE / stream tear at a tool boundary). NOT Sigil (thinking-block signature / hollow thinking). NOT Reed (MCP connected-vs-registered). NOT Scrim (secret DLP at I/O). NOT Knock (permission-grant stalls). NOT Wicket / Plumb (worktree isolation / cwd identity). NOT Stencil (plan-mode bleed). NOT Blot (image poison). NOT Hasp (file lease). NOT Fathom (standing rules after compact). NOT Parity (claim vs GitHub/Vercel/Linear). NOT Reveille (muster / duplicate dispatch). NOT Quench (token-burn fuse). Not a leftover woodworking slider, packed-sky lattice, or millimetre leftover. Not a desk, tray, clinic, gate, fence, or cabinet.

## Live catalog path

`/assay/` is this static cupellation house. Ore samples sit on a crucible rail. A purity spectrogram names the class. Demo works with no secrets and no npm.

1. Seeded tainted `#84405` is already in the cupel: parse succeeds, a string holds an injected `<parameter name=` → **tainted**.
2. Switch `#84362` — mangled close tag, a declared field vanishes (6.2% silent field loss) → **absorbed**.
3. Switch `#64774` / `#62123` — unparseable; retry also failed → **retried**.
4. Switch `#63604` — malformed tool_use JSON, whole response discarded → **garbled**.
5. Switch `#49747` — legacy XML tool-use leaked into JSON → **leaked**.
6. Switch `#63870` / `#64108` / `#66153` / `#67307` — `court` / `call` + invoke rendered as plain text; Bash/Edit never ran → **hollow**.
7. Switch `#70657` — malformed leftover contaminates later history → **spoiled**.
8. Switch Codex `#19765` / `#31517` — truncated or string-typed arguments → **garbled**.
9. Switch Codex `#26379` — malformed arguments persist and poison resume → **spoiled**.
10. Switch the sterling control — delivered arguments match schema and markup → **sterling**.
11. **Fire** heats the envelope. **Weigh** scores it. **Admit** lets only sterling through. **Refuse** keeps the named impurity. **Clear · sterling** empties the cupel to **sterling**.
12. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.
13. Idle word is **sterling**. Never the product name.

## Hook

`projects/assay/hook/` is a PreToolUse argument-integrity scorer. Score envelopes. Name the impurity. Fail-closed on tainted / absorbed / garbled. See `hook/README.md`.

```bash
node projects/assay/hook/index.mjs --listen 9070
node --test projects/assay/hook/assay.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#84405](https://github.com/anthropics/claude-code/issues/84405) — tool call parses successfully but a string parameter is silently corrupted with an adjacent parameter's boundary tag (`<parameter name=`), correlated with parameter count (open, PRIMARY seed)
- [anthropics/claude-code#84362](https://github.com/anthropics/claude-code/issues/84362) — tag-grammar parser silently absorbs parameter blocks on mismatched/mangled close tags; measured 6.2% silent field loss on parameter-rich MCP calls
- [anthropics/claude-code#64774](https://github.com/anthropics/claude-code/issues/64774) — Opus 4.8 emits unparseable tool calls at ~1.5%; retry also failed
- [anthropics/claude-code#49747](https://github.com/anthropics/claude-code/issues/49747) — Opus 4.7 mixes legacy XML tool-use format into JSON tool calls on longer payloads
- [anthropics/claude-code#62123](https://github.com/anthropics/claude-code/issues/62123) — "Model's tool call could not be parsed (retry also failed)" (high-traffic)
- [anthropics/claude-code#63604](https://github.com/anthropics/claude-code/issues/63604) — Opus 4.8 repeatedly emits malformed tool_use blocks; entire response discarded
- [anthropics/claude-code#63870](https://github.com/anthropics/claude-code/issues/63870) — Bash tool calls emitted as raw `call` text instead of executing
- [anthropics/claude-code#64108](https://github.com/anthropics/claude-code/issues/64108) — tool calls emitted as literal text (stray `court` + raw invoke) instead of executing
- [anthropics/claude-code#66153](https://github.com/anthropics/claude-code/issues/66153) — tool-use markup generated as `court` instead of `antml:invoke`
- [anthropics/claude-code#67307](https://github.com/anthropics/claude-code/issues/67307) — stray `count`/`call` token, then tool call without `antml:` rendered as plain text
- [anthropics/claude-code#70657](https://github.com/anthropics/claude-code/issues/70657) — malformed tool call triggers context contamination and fabricated conversation history
- [openai/codex#19765](https://github.com/openai/codex/issues/19765) — truncated JSON in function_call.arguments
- [openai/codex#31517](https://github.com/openai/codex/issues/31517) — tool_search_call.arguments sent as a JSON string (invalid_type)
- [openai/codex#26379](https://github.com/openai/codex/issues/26379) — malformed tool_search_call arguments persist and poison resume
