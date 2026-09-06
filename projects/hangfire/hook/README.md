# Hangfire hook

Tiny Node scorer for the delayed-primer / hangfire chronograph assay. No secrets. No live Claude sessions.

```bash
node projects/hangfire/hook/index.mjs projects/hangfire/data/92478.json
echo '{"seed":"executed","executed":true,"hangfired":false,"compactBoundary":true}' | node projects/hangfire/hook/index.mjs
node --test projects/hangfire/hook/hangfire.test.mjs
```

Empty stdin scores the seeded **executed** ticket. A probe with `seed: "hangfired"` and `promptSource: "queued"` scores **hangfired**. CRT paging-storm / suppressor-bay / remanence fields are not this product.

HOLD = executed. ALARM = hangfired / promptSource-queued / plain-prompt-path / missing-compact-boundary / long-args-suggestive / cousins. Control: idle-prompt-ok (idle `/compact` always executes).

Verdicts: hangfired, executed, promptSource-queued, plain-prompt-path, missing-compact-boundary, long-args-suggestive, idle-prompt-ok, cousins.
