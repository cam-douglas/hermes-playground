# Snatch hook

Tiny Node scorer for the deck snatch-block / openable pulley bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/snatch/hook/index.mjs projects/snatch/data/92583.json
echo '{"seed":"reaped","reaped":true}' | node projects/snatch/hook/index.mjs
node --test projects/snatch/hook/snatch.test.mjs
```

Empty stdin scores the seeded **reaped** ticket. A probe with `seed: "adrift"` and unreaped-on-session-end + timeout-to-background scores **adrift**. Brass speakpipes / CRT afterimage tubes / bilge limber-holes / timber wheel-chock yards / locomotive deadman cabs / glass-plate rpm bays / Sounder / Callboard / Knock / Annunciator desks are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedAdrift()`, `seedReaped()`, `fingerprint()`, `signals()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `BLOCKS`.

HOLD = reaped. ALARM = adrift / unreaped-on-session-end / timeout-to-background / immortal-background-commands / handle-pool-exhaustion / nine-of-nine-orphans / dead-parent-git-bash / wall-clock-not-handle-ceiling / find-orphans-11-days / handle-pool-20gb / mycroft-9-of-9 / immortal-tail-http / wall-clock-ceiling / cousins / has-clear-repro.

Verdicts: adrift, reaped, unreaped-on-session-end, timeout-to-background, immortal-background-commands, handle-pool-exhaustion, nine-of-nine-orphans, dead-parent-git-bash, wall-clock-not-handle-ceiling, find-orphans-11-days, handle-pool-20gb, mycroft-9-of-9, immortal-tail-http, wall-clock-ceiling, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic snatch-block probe. Idle timeout-to-background + unreaped-on-session-end → adrift. Session-end tracks and reaps those PIDs → reaped.
