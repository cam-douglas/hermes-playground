# Hardstand hook

Tiny Node scorer for the night-apron assay. No secrets. No live Claude sessions.

```bash
node projects/hardstand/hook/index.mjs projects/hardstand/data/refused.json
echo '{"seed":"cleared","cleared":true,"refused":false,"dispatchAccepted":true}' | node projects/hardstand/hook/index.mjs
node --test projects/hardstand/hook/hardstand.test.mjs
```

Empty stdin scores the seeded **refused** ticket (same as the living page). A probe with `seed: "cleared"` and `dispatchAccepted: true` scores **cleared**. `alongside` / harbour berth fields are not this product.

Verdicts: cleared, refused, dispatch-only, exclusive-cwd, non-git-parent, app-concurrent, scheduled-ok, bundle-258-regression, worktree-workaround, stale-block, cousins.
