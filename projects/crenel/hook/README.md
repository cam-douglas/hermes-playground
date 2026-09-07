# Crenel hook

Tiny Node scorer for the mason's battlement crenel / embrasure-notch bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/crenel/hook/index.mjs projects/crenel/data/92729.json
echo '{"seed":"crenelled","crenelled":true}' | node projects/crenel/hook/index.mjs
node --test projects/crenel/hook/crenel.test.mjs
```

Empty stdin scores the seeded **crenelled** notch. A probe with `seed: "bricked"` and empty-object-capability + list-no-resources scores **bricked**. Registrar quietuses / miller cribbles / trapper springes / pier gangways / freight waybills / lexicographer stamps are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedBricked()`, `seedCrenelled()`, `fingerprint()`, `signals()`, `courseAdmits()`, `MEASURED`, `WIRE`, `CAPABILITY_COURSES`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`.

HOLD = crenelled. ALARM = bricked / empty-object-capability / list-no-resources / read-unsupported / tools-still-work / stdio-listChanged-works / wire-curl-ok / assertCapability-truthy / upstream-reject / instructions-truncated-proof / cousins / has-clear-repro.

Verdicts: bricked, crenelled, empty-object-capability, list-no-resources, read-unsupported, tools-still-work, stdio-listChanged-works, wire-curl-ok, assertCapability-truthy, upstream-reject, instructions-truncated-proof, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic crenel probe. Idle empty-object resources capability treated as absent → bricked. Empty-object capability acknowledged as support; List+Read work → crenelled.
