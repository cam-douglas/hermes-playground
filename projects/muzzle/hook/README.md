# Muzzle hook

Tiny Node scorer for the suppressor-bay chronograph assay. No secrets. No live Claude sessions.

```bash
node projects/muzzle/hook/index.mjs projects/muzzle/data/92459.json
echo '{"seed":"excised","excised":true,"leaking":false,"attachmentsRemoved":true}' | node projects/muzzle/hook/index.mjs
node --test projects/muzzle/hook/muzzle.test.mjs
```

Empty stdin scores the seeded **excised** ticket. A probe with `seed: "leaking"` and `skillListingPresent: true` scores **leaking**. Magnetic remanence / night-apron / bakelite / kennel fields are not this product.

HOLD = excised / bare-excised. ALARM = leaking / safe-mode-leak / disable-slash-leak / log-suppressed-only / cousins. Special note: agent-tool-killed for the `--bare` Agent-tool side-effect.

Verdicts: leaking, excised, safe-mode-leak, disable-slash-leak, bare-excised, log-suppressed-only, agent-tool-killed, cousins.
