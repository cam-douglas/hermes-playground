# Husk

Threshing desk / grain floor for **hollow headless success envelopes**. A husk is not a hold. Score the envelope. Name the class or admit **kernel**.

Claude Code (and Agent SDK / Actions) reports `subtype:"success"`, `is_error:false`, exit 0, empty `result`, and `num_turns:0` when the model **never ran**. A husk is not a hold. Score the envelope. Name the class or admit **kernel**.

Idle word: **kernel** (a real turn ran — seed present).
When hollow: **husked**.

Verdicts: **kernel**, **husked**, **aborted**, **denied**, **nested**, **contended**, **zeroed**, **ghosted**.

## Evidence (do not invent more)

Primary cluster — same failure *shape*, different triggers:

1. [anthropics/claude-code#87159](https://github.com/anthropics/claude-code/issues/87159) — Headless `-p "/skill"` with failing `` !`preamble` `` silently aborts pre-turn; reports success, num_turns:0, duration_api_ms:0. Only visible with stream-json --verbose as a user event. Confirmed reproduced 2.1.234.
2. [anthropics/claude-code#80223](https://github.com/anthropics/claude-code/issues/80223) — Denied skill-frontmatter shell substitution: typed `permission_denials:[]` empty, envelope is SDKResultSuccess, only signal is untyped `<local-command-stderr>` in a synthetic user message. Reproduced.
3. [anthropics/claude-plugins-official#2197](https://github.com/anthropics/claude-plugins-official/issues/2197) — nested `claude -p` while any parent interactive session is alive → num_turns=0 success (global single-flight lock). Hooks cannot reliably get a turn.

GHA / Max OAuth paths have produced the identical success+num_turns:0 envelope. Treat as corroboration of the shape, not a separate product.

## Explicit contrasts

- NOT Knock (fail-loud stalled permission grants / approval UI)
- NOT Coda (silent last-text-block loss after the model DID run)
- NOT Assay (tool-arg corruption on a real call)
- NOT Suture (stream tear mid-turn)
- NOT Reed (MCP register/contact matrix)
- NOT Snib / Veto / Wicket / Sigil / Stencil / Blot / Fathom / Hasp / Parity / Reveille / Quench / Scrim

Different failure (pre-turn abort with success-shaped envelope), different UI, different backend, different idle word.

## Live catalog path

`/husk/` is this static threshing floor. Warm straw, chaff, barn timber, millstone, amber wheat, dusk barn light. Demo works with no secrets and no npm.

1. Seeded `#87159` is already on the floor: failing `!`-preamble, success, num_turns:0, stream user event `probe stderr boom` → **aborted**.
2. Switch `#80223` — `<local-command-stderr>` permission denial, typed `permission_denials:[]` → **denied**.
3. Switch `#2197` — nested `claude -p` / CLAUDECODE / parent session / single-flight lock → **nested**.
4. Switch kernel control — num_turns≥1, non-empty result, live usage → **kernel**.
5. Switch plain husked, contended lock, zeroed GHA, ghosted stream.
6. Paste a headless result JSON envelope (and optional stream-json lines). **Thresh the envelope**.
7. **Clear · kernel** empties the floor to the idle word.

## Hook

`projects/husk/hook/` scores a result envelope object → `{ verdict, reasons[], signals }`. Pipe `claude -p ... --output-format json` into husk. Treat **husked** as failure even when Claude exited 0.

```bash
claude -p "/skill" --output-format json | node projects/husk/hook/index.mjs
node --test projects/husk/hook/husk.test.mjs
```

See `hook/README.md`.
