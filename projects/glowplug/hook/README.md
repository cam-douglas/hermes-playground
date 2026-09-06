# Glowplug hook

Tiny Node scorer for the diesel glow-plug preheat-bay assay. No secrets. No live Claude sessions.

```bash
node projects/glowplug/hook/index.mjs projects/glowplug/data/85050.json
echo '{"seed":"lit","lit":true,"preheating":false,"emptyConfig":true,"wallSec":6}' | node projects/glowplug/hook/index.mjs
node --test projects/glowplug/hook/glowplug.test.mjs
```

Empty stdin scores the seeded **lit** ticket. A probe with `seed: "preheating"` and the two silent gaps scores **preheating**. Delayed-primer / CRT paging-storm / suppressor-bay fields are not this product.

HOLD = lit. ALARM = preheating / gap-skills-idle / gap-scheduler / skills-removed-persists / nonessential-traffic-noop / cert-store-bundled-noop / cousins. Control: empty-config-fast (empty `CLAUDE_CONFIG_DIR` + empty cwd is 6s).

Verdicts: preheating, lit, gap-skills-idle, gap-scheduler, skills-removed-persists, nonessential-traffic-noop, cert-store-bundled-noop, empty-config-fast, cousins.
