# Seizing hook

Tiny Node scorer for the sailmaker's / bosun's seizing bench. No secrets. No live Claude sessions. No live session JSONL.

```bash
node projects/seizing/hook/index.mjs projects/seizing/data/92586.json
echo '{"seed":"sole","sole":true}' | node projects/seizing/hook/index.mjs
node --test projects/seizing/hook/seizing.test.mjs
```

Empty stdin scores the seeded **sole** ticket. A probe with `seed: "culled"` and an EDR nlink spike that false-triggers the output-file identity check scores **culled**. Stuffing-box glands / sail cringle lofts / kerf-gauge joiners / scarph shipwrights / demurrage ledgers / watchtower larums are not this product.

Exports: `CHIPS`, `HOLD`, `ALARM`, `decide()`, `seedCulled()`, `seedSole()`, `classify()`, `scoreFields()`, `fingerprint()`, `replacedError()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`.

HOLD = sole / ramdisk-ok. ALARM = culled / nlink-spike / sigkill-5s / cousins.

Verdicts: culled, sole, nlink-spike, sigkill-5s, ramdisk-ok, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic nlink/kill probe. Idle EDR-transient-hard-link-false-replacement → culled. nlink=1 identity holds; command survives → sole.
