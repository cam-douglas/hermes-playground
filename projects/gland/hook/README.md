# Gland hook

Tiny Node scorer for the stuffing-box packing gland / shaft-seal bench. No secrets. No live Claude sessions. No live session JSONL.

```bash
node projects/gland/hook/index.mjs projects/gland/data/92533.json
echo '{"seed":"packed","packed":true}' | node projects/gland/hook/index.mjs
node --test projects/gland/hook/gland.test.mjs
```

Empty stdin scores the seeded **packed** ticket. A probe with `seed: "stripped"` and a Bash `tool.call` function-hook that loses worktree isolation scores **stripped**. Watchtower larums / sailmaker lofts / joiner benches / stone-pit oubliettes are not this product.

Exports: `CHIPS`, `HOLD`, `ALARM`, `decide()`, `seedStripped()`, `seedPacked()`, `classify()`, `scoreFields()`, `fingerprint()`, `isBashToolCallHook()`, `isSessionStartHook()`, `lostError()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`.

HOLD = packed / passthrough-ok. ALARM = stripped / context-lost / parent-switched / cousins.

Verdicts: stripped, packed, context-lost, parent-switched, passthrough-ok, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic hook/call probe. Idle Bash-hook-strips-isolation → stripped. Isolation survives; pwd prints worktree → packed.
