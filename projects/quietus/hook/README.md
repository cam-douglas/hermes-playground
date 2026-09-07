# Quietus hook

Tiny Node scorer for the registrar's quietus / death-knell ledger bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. No instructions to bypass hooks or sandbox. Educational diagnostic only — not an exploit.

```bash
node projects/quietus/hook/index.mjs projects/quietus/data/92716.json
echo '{"seed":"quieted","quieted":true}' | node projects/quietus/hook/index.mjs
node --test projects/quietus/hook/quietus.test.mjs
```

Empty stdin scores the seeded **quieted** knell. A probe with `seed: "unrung"` and taskstop-silent + exit-stop-silent scores **unrung**. Miller cribbles / trapper springes / pier gangways / freight waybills / oubliette voids / larum bells / Deadman / Watchdog / Knell / Tocsin / Aphonia desks are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedUnrung()`, `seedQuieted()`, `fingerprint()`, `signals()`, `pathRings()`, `MEASURED`, `HOOK_LOG`, `KILL_PATHS`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`.

HOLD = quieted. ALARM = unrung / start-without-stop / taskstop-silent / exit-stop-silent / control-completion-tolls / debug-file-missing / registry-cleared / pairing-drift / cousins / has-clear-repro.

Verdicts: unrung, quieted, start-without-stop, taskstop-silent, exit-stop-silent, control-completion-tolls, debug-file-missing, registry-cleared, pairing-drift, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic quietus probe. Idle TaskStop / Exit-and-stop miss → unrung. Every kill path rings SubagentStop → quieted.
