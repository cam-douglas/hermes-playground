# Decant hook

Tiny Node scorer for the gravity-pour cellar-rack assay. No secrets. No live Claude sessions. No real tokens.

```bash
node projects/decant/hook/index.mjs projects/decant/data/92515.json
echo '{"seed":"intact","intact":true,"route":"terminal","probedHitCount":8}' | node projects/decant/hook/index.mjs
node --test projects/decant/hook/decant.test.mjs
```

Empty stdin scores the seeded **intact** ticket. A probe with `seed: "skimmed"` and the Desktop PATH-only pour scores **skimmed**. Stamp-desk / Bourdon-tube / glow-plug fields are not this product.

Exports: `CHIPS`, `HOLD`, `ALARM`, `decide()`, `seedSkimmed()`, `seedIntact()`, `classifyPour()`, `scoreFields()`, `normalizeMarker()`, `normalizePathKind()`.

HOLD = intact. ALARM = skimmed / path-only / marker-unset / probed-0-of-8 / disclaimer-path-merge / spawn-inherits / cousins.

Verdicts: skimmed, intact, path-only, marker-unset, probed-0-of-8, disclaimer-path-merge, spawn-inherits, cousins.

`decide()` scores fixture objects by `varCount`, `pathKind`, `probedHitCount`, `marker`, and `route` (`desktop` | `terminal` | `vscode` | `rider` | `zed`). Idle desktop fixture → skimmed. Terminal / VS Code / Rider / Zed full → intact.
