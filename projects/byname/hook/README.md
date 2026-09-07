# Byname hook

Tiny Node scorer for the herald's byname / epithet registration desk. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/byname/hook/index.mjs projects/byname/data/92738.json
echo '{"seed":"ambered","ambered":true}' | node projects/byname/hook/index.mjs
node --test projects/byname/hook/byname.test.mjs
```

Empty stdin scores the idle **clear** folio. A probe with `seed: "ambered"` and bare-submit-warns + resolves-anyway scores **ambered**. Diocesan advowsons / trapper springes / speaking-tubes / range muzzles / hangfire primers / laryngoscope trays / mason crenels are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedClear()`, `seedAmbered()`, `seedBynamed()`, `fingerprint()`, `signals()`, `columnWarns()`, `MEASURED`, `NAME_COLUMNS`, `AUTOCOMPLETE`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`.

HOLD = clear / bynamed. ALARM = ambered / bare-submit-warns / namespaced-clean / resolves-anyway / autocomplete-offers-bare / alias-missing / misleading-terminal-copy / cousins / has-clear-repro.

Verdicts: clear, ambered, bynamed, bare-submit-warns, namespaced-clean, resolves-anyway, autocomplete-offers-bare, alias-missing, misleading-terminal-copy, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic folio probe. Idle no false warning; namespaced path or no bare submit → clear. Bare `/orc-version` after dismissing autocomplete stamps orange wax then resolves → ambered. Bare epithet registered as an alias, or warning suppressed when resolution succeeds → bynamed.
