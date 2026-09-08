# Clepsydra hook

Tiny Node scorer for the marble cistern / bronze-spout water-clock meter (stone basin, teal water column, bronze fittings, limestone paper). No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/clepsydra/hook/index.mjs projects/clepsydra/data/92776.json
node projects/clepsydra/hook/clepsydra.mjs projects/clepsydra/data/92776.json
echo '{"seed":"arrested","arrested":true}' | node projects/clepsydra/hook/index.mjs
node --test projects/clepsydra/hook/clepsydra.test.mjs
```

Empty stdin scores the idle **dripping** cistern. A probe with `seed: "arrested"` and a mid-session OTel spout stop scores **arrested**. Cite-only cousin: #33904 CLOSED (Session Recording Failure & Massive Token Usage Surge; Windows/VS Code, different shape). Piano let-off gauges / CRT phosphor plates / cargo-hold cribs / letterpress tympans / locksmith casements are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedDripping()`, `seedArrested()`, `seedCredited()`, `fingerprint()`, `signals()`, `spoutWasArrested()`, `exporterStillHealthy()`, `MEASURED`, `CISTERN_LEDGER`, `CAPTURE_TABLE`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `ADMIT_WORD`.

HOLD = dripping / credited. ALARM = arrested / partial-credit / exporter-healthy / other-instruments-advance / onset-sharp / process-age-guess / ruled-out-matrix / transcript-ground-truth / cousins / has-clear-repro.

Verdicts: dripping, arrested, credited, partial-credit, exporter-healthy, other-instruments-advance, onset-sharp, process-age-guess, ruled-out-matrix, transcript-ground-truth, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic cistern summary. Token and cost drips credited for the whole session → dripping. Mid-session OTel spout stop; usage lost → arrested. After a hypothetical whole-session credit path → credited.
