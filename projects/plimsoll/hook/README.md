# Plimsoll hook

Tiny Node scorer for the dry-dock Plimsoll / load-line draught-board assay. No secrets. No live Claude sessions. No real tokens.

```bash
node projects/plimsoll/hook/index.mjs projects/plimsoll/data/92434.json
echo '{"seed":"trimmed","trimmed":true,"evaluatedAgainstSent":true}' | node projects/plimsoll/hook/index.mjs
node --test projects/plimsoll/hook/plimsoll.test.mjs
```

Empty stdin scores the seeded **trimmed** ticket. A probe with `seed: "overladen"` and the resume 400 scores **overladen**. Optical trays / cellar racks / stamp desks / Bourdon tubes / glow-plug bays / hangfire chronographs are not this product.

Exports: `CHIPS`, `HOLD`, `ALARM`, `decide()`, `seedOverladen()`, `seedTrimmed()`, `classifyDraught()`, `scoreFields()`, `MEASURED`, `COUSINS`.

HOLD = trimmed. ALARM = overladen / stale-previous-count / reinject-jump / no-reactive-compact / manual-compact-ok / cousins.

Verdicts: overladen, trimmed, stale-previous-count, reinject-jump, no-reactive-compact, manual-compact-ok, cousins.

`decide()` scores fixture objects by `previousTurnTokens`, `resumeTokens`, `promptTooLong`, `compactAttempted`, and `manualCompactOk`. Idle resume 400 fixture → overladen. Load line evaluated against the request as it will actually be sent → trimmed.
