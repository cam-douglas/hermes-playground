# Remora hook

Tiny Node scorer for the hull-clinging remora / process-tree sounding bench (teal-ink deep water, barnacle copper, pale foam linen). Models parent-exit vs child-hold timing from the published #92934 incident. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an attack. Does not spawn PowerShell. Does not sleep 90 seconds.

```bash
node projects/remora/hook/index.mjs projects/remora/data/92934.json
node projects/remora/hook/remora.mjs projects/remora/data/92934.json
echo '{"seed":"clung","childHolds":true}' | node projects/remora/hook/index.mjs
node --test projects/remora/hook/remora.test.mjs
```

Empty stdin scores the idle **loosed** hull. A probe with `seed: "clung"` and a persistent redirected child after parent exit 0 scores **clung**. `async:true` scores **rehitched**. Cite-only cousins: #90049 Deadletter (different symptom). Iron beds / postal trays / cadastral rolls are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `RECOVER`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedLoosed()`, `seedClung()`, `seedRehitched()`, `fingerprint()`, `signals()`, `modelTiming()`, `soundHull()`, `IDLE_WORD`, `SEEDED_WORD`, `RECOVERY_WORD`.

HOLD = loosed. RECOVER = rehitched / async-bypass. ALARM = clung / parent-exited / child-holds / redirected-stdio / sync-stall / async-bypass / cousins / before-after / fixtures.

Verdicts: loosed, clung, rehitched, parent-exited, child-holds, redirected-stdio, sync-stall, async-bypass, cousins, before-after, fixtures.
