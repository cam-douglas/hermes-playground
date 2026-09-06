# Thrash hook

Tiny Node scorer for the CRT working-set / paging-storm assay. No secrets. No live Claude sessions.

```bash
node projects/thrash/hook/index.mjs projects/thrash/data/88257.json
echo '{"seed":"responsive","responsive":true,"thrashing":false}' | node projects/thrash/hook/index.mjs
node --test projects/thrash/hook/thrash.test.mjs
```

Empty stdin scores the seeded **responsive** ticket. A probe with `seed: "thrashing"` and `stallMs: 40808` scores **thrashing**. Suppressor-bay / remanence / night-apron / bakelite / strobe / piano / kennel / stone-pit fields are not this product.

HOLD = responsive. ALARM = thrashing / event-loop-stall / rss-balloon / cpu-bound-gap / safe-mode-still-stalls / sleep-wake-mislabelled / cousins.

Verdicts: thrashing, responsive, event-loop-stall, rss-balloon, cpu-bound-gap, safe-mode-still-stalls, sleep-wake-mislabelled, cousins.
