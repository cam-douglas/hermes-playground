# Cringle hook

Tiny Node scorer for the sailmaker's loft / cringle-and-grommet assay. No secrets. No live Claude sessions. No live Bash deny matching.

```bash
node projects/cringle/hook/index.mjs projects/cringle/data/92542.json
echo '{"seed":"sighted","sighted":true}' | node projects/cringle/hook/index.mjs
node --test projects/cringle/hook/cringle.test.mjs
```

Empty stdin scores the seeded **sighted** ticket. A probe with `seed: "slipped"` and the PATH-wrapper program-token shift scores **slipped**. Joiner's kerf-gauge benches / harbour laytime ledgers / shipwright scarph benches / dry-dock load-line boards are not this product.

Exports: `CHIPS`, `HOLD`, `ALARM`, `decide()`, `seedSlipped()`, `seedSighted()`, `classify()`, `scoreFields()`, `unwrapProgram()`, `denyConsulted()`, `isAssignment()`, `MEASURED`, `REPROS`, `COUSINS`, `EIGHT_UNWRAP`.

HOLD = sighted. ALARM = slipped / eight-unwrap / wrapper-shift / compound-caught / path-wrapper-bypass / cousins.

Verdicts: slipped, sighted, eight-unwrap, wrapper-shift, compound-caught, path-wrapper-bypass, cousins.

`decide()` scores fixture objects by `command`, `slipped`, `sighted`, and the published repro seeds. Idle eight-item unwrap + unknown PATH wrapper → slipped. Matching unwrap-aware / unmatched escalates → sighted.
