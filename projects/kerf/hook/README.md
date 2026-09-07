# Kerf hook

Tiny Node scorer for the joiner's / sawyer's kerf-gauge assay. No secrets. No live Claude sessions. No live PowerShell.

```bash
node projects/kerf/hook/index.mjs projects/kerf/data/92539.json
echo '{"seed":"argbound","argbound":true}' | node projects/kerf/hook/index.mjs
node --test projects/kerf/hook/kerf.test.mjs
```

Empty stdin scores the seeded **argbound** ticket. A probe with `seed: "riven"` and the Windows Remove-Item whole-command rive scores **riven**. Harbour laytime ledgers / shipwright scarph benches / dry-dock load-line boards are not this product.

Exports: `CHIPS`, `HOLD`, `ALARM`, `decide()`, `seedRiven()`, `seedArgbound()`, `classify()`, `scoreFields()`, `rivenFragments()`, `removeItemArgs()`, `rivenWouldBlock()`, `MEASURED`, `REPROS`, `COUSINS`.

HOLD = argbound. ALARM = riven / baseline-pass / nospace-pass / program-files-block / user-dir-block / reversed-order-block / cousins.

Verdicts: riven, argbound, baseline-pass, nospace-pass, program-files-block, user-dir-block, reversed-order-block, cousins.

`decide()` scores fixture objects by `command`, `riven`, `argbound`, and the published repro seeds. Idle whole-command whitespace rive → riven. Guard bound to the real Remove-Item argument → argbound.
