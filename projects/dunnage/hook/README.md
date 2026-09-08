# Dunnage hook

Tiny Node scorer for the stevedore's dunnage crib (cargo-hold page ledger: dark hold timber, hemp rope chalk tallies, crate stencil numbers, north-port skylight). No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/dunnage/hook/index.mjs projects/dunnage/data/92746.json
node projects/dunnage/hook/dunnage.mjs projects/dunnage/data/92746.json
echo '{"seed":"echoed","echoed":true}' | node projects/dunnage/hook/index.mjs
node --test projects/dunnage/hook/dunnage.test.mjs
```

Empty stdin scores the idle **berthed** crib. A probe with `seed: "echoed"` and a cursor that reissues the identical first page scores **echoed**. Cite-only cousins: #24785 CLOSED and #39586 CLOSED (MCP `tools/list` `nextCursor`). Letterpress tympans / locksmith casements / censor stamps / herald bynames / mason crenels / mill cribbles / trapper springes / pier gangways / freight waybills are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedBerthed()`, `seedEchoed()`, `seedAdvanced()`, `fingerprint()`, `signals()`, `sameFirstPage()`, `cursorWasIgnored()`, `MEASURED`, `PAGE_LEDGER`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `ADMIT_WORD`.

HOLD = berthed / advanced. ALARM = echoed / same-page / has-more-lied / cursor-ignored / twenty-cap / pages-incomplete / list-vs-list-runs / cousins / has-clear-repro.

Verdicts: berthed, echoed, advanced, same-page, has-more-lied, cursor-ignored, twenty-cap, pages-incomplete, list-vs-list-runs, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic page-ledger summary. List fits one page with `has_more` false, or cursor advances → berthed. Cursor ignored and first page reissued → echoed. After a hypothetical restow that yields page 2+ or stops advertising `has_more`/`next_cursor` → advanced.
