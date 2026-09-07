# Larum hook

Tiny Node scorer for the limestone watchtower / larum-bell / wake chronograph. No secrets. No live Claude sessions. No live session JSONL.

```bash
node projects/larum/hook/index.mjs projects/larum/data/92563.json
echo '{"seed":"roused","roused":true}' | node projects/larum/hook/index.mjs
node --test projects/larum/hook/larum.test.mjs
```

Empty stdin scores the seeded **roused** ticket. A probe with `seed: "unanswered"` and a completed `<task-notification>` that never starts an assistant turn scores **unanswered**. Sailmaker lofts / joiner benches / stone-pit oubliettes / copper alarum towers are not this product.

Exports: `CHIPS`, `HOLD`, `ALARM`, `decide()`, `seedUnanswered()`, `seedRoused()`, `classify()`, `scoreFields()`, `fingerprint()`, `isCompletedTaskNotification()`, `isMetaContinue()`, `isSyntheticNoResponse()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`.

HOLD = roused / delivered-and-roused. ALARM = unanswered / last-of-batch / synthetic-repair / cousins.

Verdicts: unanswered, roused, last-of-batch, delivered-and-roused, synthetic-repair, cousins.

`decide()` scores fixture objects by `seed`, flags, or a sample JSONL `entries` array. Idle completed-notice-with-no-turn → unanswered. Assistant turn starts after the notice → roused.
