# Rushlight hook

Tiny Node scorer for the iron sconce / rush-pith candle atelier (soot wall, amber wick, parchment ledger, iron fittings). No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/rushlight/hook/index.mjs projects/rushlight/data/92784.json
node projects/rushlight/hook/rushlight.mjs projects/rushlight/data/92784.json
echo '{"seed":"snuffed","snuffed":true}' | node projects/rushlight/hook/index.mjs
node --test projects/rushlight/hook/rushlight.test.mjs
```

Empty stdin scores the idle **lit** sconce. A probe with `seed: "snuffed"` and a session-scoped TCC grant scores **snuffed**. Cite-only cousins: #63130 OPEN, #66216 CLOSED, #36832 CLOSED, #36675 CLOSED, #41297 CLOSED, #59608 CLOSED. Marble water-clocks / piano let-off gauges / CRT phosphor plates / cargo-hold cribs / letterpress tympans / locksmith casements are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedLit()`, `seedSnuffed()`, `seedTenured()`, `fingerprint()`, `signals()`, `rushWasSnuffed()`, `sessionScopedInvalid()`, `MEASURED`, `SCONCE_LEDGER`, `PROMPT_TABLE`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `ADMIT_WORD`.

HOLD = lit / tenured. ALARM = snuffed / session-scoped-auth-invalid / same-version-reprompt / startup-appdata-enumeration / fda-desktop-ineffective / child-worker-identity / cousins / has-clear-repro.

Verdicts: lit, snuffed, tenured, session-scoped-auth-invalid, same-version-reprompt, startup-appdata-enumeration, fda-desktop-ineffective, child-worker-identity, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic sconce summary. TCC AppData grant persists across sessions of the same version → lit. Session-scoped grant evaporates; same version 2.1.258 re-prompts → snuffed. After a hypothetical persistently-authorizable identity → tenured.
