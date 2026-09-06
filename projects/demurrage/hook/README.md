# Demurrage hook

Tiny Node scorer for the demurrage clerk's laytime / overstay ledger. No secrets. No live Claude sessions. No network.

```bash
node projects/demurrage/hook/index.mjs projects/demurrage/data/92548.json
echo '{"seed":"cleared","cleared":true,"released":true}' | node projects/demurrage/hook/index.mjs
node --test projects/demurrage/hook/demurrage.test.mjs
```

Empty stdin scores the seeded **cleared** ticket. A probe with `seed: "accruing"` and the remote-daemon overstay scores **accruing**. Wastegate valves / Bourdon tubes / Plimsoll discs / scarph benches / Thrash CRTs are not this product.

Exports: `CHIPS`, `HOLD`, `ALARM`, `decide()`, `seedAccruing()`, `seedCleared()`, `classify()`, `scoreFields()`, `MEASURED`, `COUSINS`, `PROCESSES`, `DAEMONS`, `FILING_CENSUS`.

HOLD = cleared. ALARM = accruing / duplicate-resume / daemon-orphan / deleted-binary / no-lifecycle-flags / outage-census / cousins.

Verdicts: accruing, cleared, duplicate-resume, daemon-orphan, deleted-binary, no-lifecycle-flags, outage-census, cousins.

`decide()` scores fixture objects by `--resume` duplicates, orphan sockets, deleted-binary hulks, missing lifecycle flags, and the two hard outages. Idle remote-daemon overstay → accruing. Chat released or reused → cleared.
