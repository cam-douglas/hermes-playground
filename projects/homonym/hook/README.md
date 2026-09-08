# Homonym hook

Tiny Node scorer for the lexicographer / registrar twin-nameplate desk (parchment folio, ink ruling, brass nameplate, UUID ghost plate). No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/homonym/hook/index.mjs projects/homonym/data/92787.json
node projects/homonym/hook/homonym.mjs projects/homonym/data/92787.json
echo '{"seed":"orphaned","orphaned":true}' | node projects/homonym/hook/index.mjs
node --test projects/homonym/hook/homonym.test.mjs
```

Empty stdin scores the idle **matched** desk. A probe with `seed: "orphaned"` and a Desktop UUID guidon scores **orphaned**. Cite-only cousins: #77598 CLOSED stale (same class), #82532 OPEN (identity rotation). Marble cisterns / piano let-off gauges / CRT phosphor plates / cargo-hold cribs / letterpress tympans / locksmith casements are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedMatched()`, `seedOrphaned()`, `seedKeyed()`, `fingerprint()`, `signals()`, `deskWasOrphaned()`, `namedLedgerMatched()`, `MEASURED`, `NAMEPLATE_LEDGER`, `EVIDENCE_TABLE`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `ADMIT_WORD`.

HOLD = matched / keyed. ALARM = orphaned / cli-named-mount / desktop-uuid-mount / ask-rule-silent-miss / no-startup-warning / uuid-undocumented / cousins / has-clear-repro.

Verdicts: matched, orphaned, keyed, cli-named-mount, desktop-uuid-mount, ask-rule-silent-miss, no-startup-warning, uuid-undocumented, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic nameplate summary. Named ledger stays matched across entrypoints → matched. Desktop UUID guidon; named rules silently miss → orphaned. After a hypothetical keyed alias path → keyed.
