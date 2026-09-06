# Hysteresis hook

Tiny Node scorer for the magnetic remanence assay. No secrets. No live Claude sessions.

```bash
node projects/hysteresis/hook/index.mjs projects/hysteresis/data/rewritten.json
echo '{"seed":"remanent","remanent":true,"rewritten":false,"cachePreserved":true}' | node projects/hysteresis/hook/index.mjs
node --test projects/hysteresis/hook/hysteresis.test.mjs
```

Empty stdin scores the seeded **rewritten** ticket (same as the living page). A probe with `seed: "remanent"` and `cachePreserved: true` scores **remanent**. Dial-bench / night-apron fields are not this product.

Verdicts: remanent, rewritten, sonnet-partial, opus-full, fable-preserved, docs-mismatch, dialog-false-alarm, mid-session-switch, cousins.
