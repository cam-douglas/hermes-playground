# Espagnolette hook

Tiny Node scorer for the locksmith's espagnolette / casement-fastener bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/espagnolette/hook/index.mjs projects/espagnolette/data/92694.json
node projects/espagnolette/hook/espagnolette.mjs projects/espagnolette/data/92694.json
echo '{"seed":"deaf","deaf":true}' | node projects/espagnolette/hook/index.mjs
node --test projects/espagnolette/hook/espagnolette.test.mjs
```

Empty stdin scores the idle **attentive** folio. A probe with `seed: "deaf"` and blur-deaf + ancestor-live scores **deaf**. AskUserQuestion cousins #84489 / #86918 are cite-only. Censor stamp desks / herald bynames / mason crenels are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedAttentive()`, `seedDeaf()`, `seedRemounted()`, `fingerprint()`, `signals()`, `keyIsDead()`, `MEASURED`, `KEY_MATRIX`, `QUESTION_PANES`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`.

HOLD = attentive / remounted. ALARM = deaf / blur-deaf / ancestor-live / single-deadend / remount-recovers / isDisabled-signature / focus-lost / cousins / has-clear-repro.

Verdicts: attentive, deaf, remounted, blur-deaf, ancestor-live, single-deadend, remount-recovers, isDisabled-signature, focus-lost, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic folio probe. Idle selection keys stay live → attentive. After blur/refocus the caret still paints but subtree keys are dead → deaf. Remount restores autoFocus → remounted.
