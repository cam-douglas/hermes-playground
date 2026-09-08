# Deadletter hook

Tiny Node scorer for the postal dead-letter / undeliverable-mail bench (sorting desk, pigeonholes, stamped envelopes, undeliverable tray). No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/deadletter/hook/index.mjs projects/deadletter/data/90049.json
node projects/deadletter/hook/deadletter.mjs projects/deadletter/data/90049.json
echo '{"seed":"lost","lost":true}' | node projects/deadletter/hook/index.mjs
node --test projects/deadletter/hook/deadletter.test.mjs
```

Empty stdin scores the idle **receipted** pigeonhole. A probe with `seed: "lost"` and dispatch-ok with no persisted `tool_result` scores **lost**. Cite-only cousins: #84154 CLOSED/stale. PCB benches / compositor galleys / twin-nameplate desks are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedReceipted()`, `seedLost()`, `seedFiled()`, `fingerprint()`, `signals()`, `dispatchEndedOk()`, `toolResultPersisted()`, `hooksBlocking()`, `asyncHookBypasses()`, `printSdkDelivers()`, `bothShellsHit()`, `letterWasLost()`, `letterFiled()`, `MEASURED`, `TRAY_LEDGER`, `REPRO_TABLE`, `DISPATCH_OK`, `HOOKS_AB`, `FLOW`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `ADMIT_WORD`.

HOLD = receipted / filed. ALARM = lost / dispatch-ok-no-persist / posttooluse-orchestration / worktree-transition / print-sdk-ok / async-hook-mitigation / bash-and-powershell / cousins / has-clear-repro.

Verdicts: receipted, lost, filed, dispatch-ok-no-persist, posttooluse-orchestration, worktree-transition, print-sdk-ok, async-hook-mitigation, bash-and-powershell, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic tray summary. Completed `tool_result` stays receipted after a worktree transition → receipted. `tool_dispatch_end outcome=ok` then no persist → lost. After a hypothetical stream-close path → filed.
