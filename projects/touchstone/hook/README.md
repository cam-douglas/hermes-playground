# Touchstone hook

Tiny Node scorer for the Lydian-slab touchstone bench. No secrets. No live Claude sessions. No live session JSONL. No payloads.

```bash
node projects/touchstone/hook/index.mjs projects/touchstone/data/92599.json
echo '{"seed":"proved","proved":true}' | node projects/touchstone/hook/index.mjs
node --test projects/touchstone/hook/touchstone.test.mjs
```

Empty stdin scores the seeded **proved** ticket. A probe with `seed: "fouled"` and an extension-gated permission-rule 401 scores **fouled**. Dockside bitts / bosun seizing yarn / stuffing-box glands / watchtower larums / sail cringles / kerf-gauge joiners / scarph shipwrights / demurrage ledgers / assay furnaces / cupel hearths / stencil desks are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedFouled()`, `seedProved()`, `fingerprint()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`.

HOLD = proved. ALARM = fouled / extension-gate / false-401 / auto-disabled / precedes-pretooluse / desktop-session-only / bypass-permissions / auth-shape / cousins / has-clear-repro.

Verdicts: fouled, proved, extension-gate, false-401, auto-disabled, precedes-pretooluse, desktop-session-only, bypass-permissions, auth-shape, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic Write/Edit validation probe. Idle extension-gated permission-rule 401 → fouled. Validation authenticates for script extensions; Auto mode works → proved.
