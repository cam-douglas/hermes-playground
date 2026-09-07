# Imprimatur hook

Tiny Node scorer for the censor's imprimatur / nihil-obstat stamp desk. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/imprimatur/hook/index.mjs projects/imprimatur/data/92740.json
node projects/imprimatur/hook/imprimatur.mjs projects/imprimatur/data/92740.json
echo '{"seed":"refused","refused":true}' | node projects/imprimatur/hook/index.mjs
node --test projects/imprimatur/hook/imprimatur.test.mjs
```

Empty stdin scores the idle **waived** folio. A probe with `seed: "refused"` and skip-refuses + no-card-rendered scores **refused**. Cloud-routines Artifact permission cousins are cite-only. Herald bynames / mason crenels / registrar quietus ledgers are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedWaived()`, `seedRefused()`, `seedImprinted()`, `fingerprint()`, `signals()`, `modeRefuses()`, `MEASURED`, `MODE_COLUMNS`, `FIRST_PUBLISH_GATE`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`.

HOLD = waived / imprinted. ALARM = refused / skip-refuses / auto-succeeds / no-card-rendered / first-publish-gate / noninteractive-self-report / cousins / has-clear-repro.

Verdicts: waived, refused, imprinted, skip-refuses, auto-succeeds, no-card-rendered, first-publish-gate, noninteractive-self-report, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic folio probe. Idle Skip would cover the Artifact tool → waived. First publish under Skip all approvals refuses immediately, no card rendered → refused. Skip treated like Auto at the gate, or the gate documented/routed → imprinted.
