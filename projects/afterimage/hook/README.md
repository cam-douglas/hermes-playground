# Afterimage hook

Tiny Node scorer for the CRT / ophthalmology afterimage bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/afterimage/hook/index.mjs projects/afterimage/data/92596.json
echo '{"seed":"flushed","flushed":true}' | node projects/afterimage/hook/index.mjs
node --test projects/afterimage/hook/afterimage.test.mjs
```

Empty stdin scores the seeded **flushed** ticket. A probe with `seed: "latent"` and thinking-paints + text-zero-frames scores **latent**. Bilge limber-holes / timber wheel-chock yards / locomotive deadman cabs / glass-plate rpm bays / stroboscope flicker desks / diopter trial-lens trays / scrim lofts are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedLatent()`, `seedFlushed()`, `fingerprint()`, `signals()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `PHOSPHOR_PHASES`.

HOLD = flushed. ALARM = latent / thinking-paints / text-zero-frames / mega-frame-stop / linux-progressive / nonstreaming-fallback-ruled-out / fine-grained-no-effect / cousins / has-clear-repro.

Verdicts: latent, flushed, thinking-paints, text-zero-frames, mega-frame-stop, linux-progressive, nonstreaming-fallback-ruled-out, fine-grained-no-effect, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic frame-timing probe. Idle text-zero-frames + mega-frame-stop → latent. Windows text content blocks paint per-delta the same way thinking already does → flushed.
