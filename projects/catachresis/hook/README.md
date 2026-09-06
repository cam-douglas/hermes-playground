# Catachresis hook

Tiny Node scorer for the lexicographer stamp-desk assay. No secrets. No live Claude sessions. No real tokens.

```bash
node projects/catachresis/hook/index.mjs projects/catachresis/data/92518.json
echo '{"seed":"scoped","scoped":true,"namesMissingScope":true,"challengeError":"insufficient_scope"}' | node projects/catachresis/hook/index.mjs
node --test projects/catachresis/hook/catachresis.test.mjs
```

Empty stdin scores the seeded **scoped** ticket. A probe with `seed: "mislabeled"` and the 403 `insufficient_scope` challenge scores **mislabeled**. Bourdon-tube / grammar-desk / glow-plug fields are not this product.

Exports: `CHIPS`, `HOLD`, `ALARM`, `decide()`, `seedMislabeled()`, `seedScoped()`, `parseWwwAuthenticate()`, `classifyChallenge()`.

HOLD = scoped. ALARM = mislabeled / no-401 / no-refresh / token-still-valid / insufficient-scope-challenge / events-write-missing / reauth-widened-scopes / cousins.

Verdicts: mislabeled, scoped, no-401, no-refresh, token-still-valid, insufficient-scope-challenge, events-write-missing, reauth-widened-scopes, cousins.
