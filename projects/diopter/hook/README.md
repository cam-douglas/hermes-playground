# Diopter hook

Tiny Node scorer for the optical diopter trial-lens / refraction-bench assay. No secrets. No live Claude sessions. No real tokens.

```bash
node projects/diopter/hook/index.mjs projects/diopter/data/92524.json
echo '{"seed":"sharp","sharp":true,"uuidNormalized":true,"input_tokens":5}' | node projects/diopter/hook/index.mjs
node --test projects/diopter/hook/diopter.test.mjs
```

Empty stdin scores the seeded **sharp** ticket. A probe with `seed: "defocused"` and the next-session UUID-only change scores **defocused**. Cellar-rack / stamp-desk / Bourdon-tube fields are not this product.

Exports: `CHIPS`, `HOLD`, `ALARM`, `decide()`, `seedDefocused()`, `seedSharp()`, `classifyLens()`, `scoreFields()`, `UUID_A`, `UUID_B`, `MEASURED`, `DIFF`.

HOLD = sharp. ALARM = defocused / uuid-diff / cache-miss / rewrite-16157 / normalized-hit / cousins.

Verdicts: defocused, sharp, uuid-diff, cache-miss, rewrite-16157, normalized-hit, cousins.

`decide()` scores fixture objects by `input_tokens`, `wall`, `toolsIdentical`, `messagesIdentical`, `systemDiffers`, and `uuidNormalized`. Idle next-session fixture → defocused. UUID-normalised 0.4 s / 5 tokens → sharp.
