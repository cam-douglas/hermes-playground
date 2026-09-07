# Bitts hook

Tiny Node scorer for the dockside mooring bitts bench. No secrets. No live Claude sessions. No live session JSONL. No payloads.

```bash
node projects/bitts/hook/index.mjs projects/bitts/data/92573.json
echo '{"seed":"belayed","belayed":true}' | node projects/bitts/hook/index.mjs
node --test projects/bitts/hook/bitts.test.mjs
```

Empty stdin scores the seeded **belayed** ticket. A probe with `seed: "razed"` and a mid-session `.claude/worktrees/*` pool recycle scores **razed**. Isolation-collar glands / bosun seizing yarn / watchtower larums / sail cringles / kerf-gauge joiners / scarph shipwrights / demurrage ledgers are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedRazed()`, `seedBelayed()`, `fingerprint()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`.

HOLD = belayed / hold. ALARM = razed / slot-recycle / reflog-churn / keep-active / mass-deletions / cousins / has-clear-repro.

Verdicts: razed, belayed, slot-recycle, reflog-churn, keep-active, mass-deletions, cousins, hold, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic pool-slot probe. Idle mid-session recycle → razed. Slot stays assigned to the live session; tree intact → belayed.
