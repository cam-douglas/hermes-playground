# Scarph hook

Tiny Node scorer for the shipwright scarph-joint / faying-face assay. No secrets. No live Claude sessions. No real bash.exe spawn.

```bash
node projects/scarph/hook/index.mjs projects/scarph/data/92543.json
echo '{"seed":"fayed","fayed":true,"viaStdin":true}' | node projects/scarph/hook/index.mjs
node --test projects/scarph/hook/scarph.test.mjs
```

Empty stdin scores the seeded **fayed** ticket. A probe with `seed: "sheared"` and the Windows `-c` shear scores **sheared**. Dry-dock load-line boards / optical trays / cellar racks / stamp desks / Bourdon tubes / glow-plug bays / hangfire chronographs are not this product.

Exports: `CHIPS`, `HOLD`, `ALARM`, `decide()`, `seedSheared()`, `seedFayed()`, `classify()`, `scoreFields()`, `MEASURED`, `COUSINS`.

HOLD = fayed. ALARM = sheared / argv-ceiling / backslash-halved / silent-cut / stdin-bypass / cousins.

Verdicts: sheared, fayed, argv-ceiling, backslash-halved, silent-cut, stdin-bypass, cousins.

`decide()` scores fixture objects by `argvLength`, `viaDashC`, `halved`, `unexpectedEof`, and `viaStdin`. Idle Windows `-c` shear fixture → sheared. Script handed via stdin or a temp file → fayed.
