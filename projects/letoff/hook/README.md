# Letoff hook

Tiny Node scorer for the piano let-off / action-rail gauge (ivory-and-ebony keybed, cream workshop, brass rail, felt hammer). No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/letoff/hook/index.mjs projects/letoff/data/92771.json
node projects/letoff/hook/letoff.mjs projects/letoff/data/92771.json
echo '{"seed":"flattened","flattened":true}' | node projects/letoff/hook/index.mjs
node --test projects/letoff/hook/letoff.test.mjs
```

Empty stdin scores the idle **chorded** rail. A probe with `seed: "flattened"` and a Shift+Enter → 0d collision scores **flattened**. Cite-only cousins: #87888 OPEN (Windows Terminal matcher miss), #92021 OPEN (WezTerm kitty shifted-key field never parsed), generic node/libuv uv_tty console-to-VT. CRT phosphor plates / cargo-hold cribs / letterpress tympans / locksmith casements are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedChorded()`, `seedFlattened()`, `seedMeshed()`, `fingerprint()`, `signals()`, `shiftWasFlattened()`, `consoleStillIntact()`, `MEASURED`, `ACTION_RAIL`, `CONTROL_MATRIX`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `ADMIT_WORD`.

HOLD = chorded / meshed. ALARM = flattened / runtime-split / console-intact / libuv-collision / kitty-allowlist / kitty-parsed-unused / ctrl-enter-workaround / control-matrix / cousins / has-clear-repro.

Verdicts: chorded, flattened, meshed, runtime-split, console-intact, libuv-collision, kitty-allowlist, kitty-parsed-unused, ctrl-enter-workaround, control-matrix, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic action-rail summary. Shift retained / chat:newline would fire → chorded. Shift+Enter → 0d collision; dwControlKeyState discarded → flattened. After a hypothetical ENABLE_VIRTUAL_TERMINAL_INPUT or ReadConsoleInputW path → meshed.
