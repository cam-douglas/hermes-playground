# Dinkus hook

Tiny Node scorer for the compositor's hairline-rule bench (cool slate desk, zinc chase, vermilion dinkus mark, cream galley slip). No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/dinkus/hook/index.mjs projects/dinkus/data/92798.json
node projects/dinkus/hook/dinkus.mjs projects/dinkus/data/92798.json
echo '{"seed":"leaked","leaked":true}' | node projects/dinkus/hook/index.mjs
node --test projects/dinkus/hook/dinkus.test.mjs
```

Empty stdin scores the idle **bound** folio. A probe with `seed: "leaked"` and a body hairline that reopens the sed range scores **leaked**. Cite-only cousins: #52755 CLOSED (TUI `---` divider), #44901 CLOSED (plugin frontmatter docs), #19377 CLOSED (rules `paths:` frontmatter docs). Twin-nameplate desks / marble cisterns / iron sconces / piano let-off gauges are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedBound()`, `seedLeaked()`, `seedClosed()`, `fingerprint()`, `signals()`, `sedRangeExtract()`, `closedExtract()`, `lookupField()`, `publishedReproOutput()`, `chaseWasLeaked()`, `folioClosed()`, `MEASURED`, `CHASE_LEDGER`, `REPRO_TABLE`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `ADMIT_WORD`.

HOLD = bound / closed. ALARM = leaked / sed-range-reopen / body-hr-bleed / enabled-true-false-concat / silent-disabled-path / false-as-missing / validate-hr-count / cousins / has-clear-repro.

Verdicts: bound, leaked, closed, sed-range-reopen, body-hr-bleed, enabled-true-false-concat, silent-disabled-path, false-as-missing, validate-hr-count, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic chase summary. Frontmatter stops at the first closing `---` → bound. Sed range reopens on a body hairline; body keys bleed → leaked. After a hypothetical line-1 open / quit-at-first-close path → closed.
