# Cotter

Machine-shop cotter-pin / axle-pin bench for a real Claude Code failure class: poison-pill scheduled-task registry schema. Claude Desktop’s own `update_scheduled_task` MCP writes `fireAt` as an ISO-8601 string (schema docs say ISO). `loadScheduledTasksFromDisk` Zod-expects epoch milliseconds. **One string entry rejects the whole `scheduled-tasks.json`**. Every routine goes dark (55h in the primary report) while liveness proxies stay green (processes, package status, dispatcher heartbeat, even `recordedSkips` keep writing).

A written schedule is not a hold. Score the pin tray or admit **snug**.

Idle word: **snug** (every `fireAt` is epoch ms, Zod loads the whole tray, dispatches match the written hold, MCP tools present).
NEVER use the product name cotter / empty / fireAt / schedule / registry / poison as the idle/state word.
NEVER reuse prior idles: hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised.

Verdicts: **snug**, **poison**, **wipe**, **hollow**, **vanish**, **mute-mcp**. Slack alarm on poison / wipe / hollow / vanish / mute-mcp. Linear ticket on poison / wipe. GitHub cotter-ledger of scored trays on every score.

The #90533 poison (one string `fireAt` → ZodError on `scheduledTasks[n].fireAt` → whole registry fails to load) is **poison**, never **snug**, even when every green gauge still reads healthy.

## Why not a clone

NOT Fusee (early schedule dispatch / #90485).
NOT Cinch (partial folder mounts on scheduled Cowork runs / #90506).
NOT Reveille (muster / heartbeat survival).
NOT Fob (keychain litter).
NOT Ordo (headless plugin slash).
NOT Ullage (silent context drop / prefix-freeze).
NOT Visa (MCP OAuth missing RFC 8707 resource).
NOT Sprag (boot-cached MCP attach).
NOT Larder (plugin-store freeze).
NOT Hasp (file-lease).
NOT Wicket (worktree isolation).
NOT Tappet (silent hook injection).
NOT leftover woodworking / millimetre-slider products.

Different problem: POISON-PILL REGISTRY SCHEMA. Did one ISO string fail-close the entire routine set while green proxies lied?
Different UI: machine-shop cotter-pin / axle-pin tray. Steel bench, oil-stained felt, calipers, numbered pin slots, lying green pressure/grease gauges, a poison pin glowing wrong-typed. Fonts: Big Shoulders Stencil + Sora + Share Tech Mono — not Italiana/IBM Plex Mono/Newsreader (Fob), not Cormorant/Crimson (Ordo), not Spectral/Nunito Sans (Cinch), not Fraunces/Barlow Condensed (Ullage), not Libre Baskerville/Source Sans 3 (Visa).
Different idle word: **snug**.

## Live catalog path

`/cotter/` is this static machine-shop pin tray. Felt bed, numbered slots, split pins, lying gauges, caliper readout, registry intake. Demo works with no secrets and no npm. Mark: `18:50 Sydney · cotter`.

1. Seeded `#90533` **poison** is already on the tray: 35 pins, index 33 typed ISO `2026-08-27T07:30:00+01:00` → Zod reject → **poison**.
2. Switch **wipe** — `scheduledTasks: []`, SKILL.md still on disk → **wipe**.
3. Switch **hollow** — lastFired advances, zero work → **hollow**.
4. Switch **vanish** — recurring gone, spent one-time remain → **vanish**.
5. Switch **mute-mcp** — scheduled-task tools absent from session → **mute-mcp**.
6. Switch **control** — every fireAt epoch ms, Zod loads, dispatches match → **snug**.
7. Switch **Reset · snug** — idle bench → **snug**. Idle word is **snug** when the tray is reset. One snug pin stays on the felt; never an empty or error state.
8. **Score** scores. **Admit snug** scores honestly. **Reset · snug** returns idle snug. **Restore · poison** shows the #90533 pin. Admit does not lie: a poison tray stays poison.

## Hook

`projects/cotter/hook/` scores a tray `{ scheduledTasks, definitionsOnDisk, registryLoaded, dispatcherHeartbeat, lastFiredAdvances, workDone, mcpToolsPresent, session, source, issue, scored }` and returns `{ verdict, reasons[], snug }`. See `hook/README.md`.

```bash
node projects/cotter/hook/index.mjs --listen 9090
node --test projects/cotter/hook/cotter.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90533](https://github.com/anthropics/claude-code/issues/90533) — one string `fireAt` (written by the app’s own `update_scheduled_task` MCP) → ZodError on `scheduledTasks[n].fireAt` → whole registry fails to load → zero dispatches for 55h while liveness proxies stay green.

Same-class / shape (not new primaries):

- [anthropics/claude-code#85565](https://github.com/anthropics/claude-code/issues/85565) — Desktop update silently wiped `scheduledTasks: []`; all tasks died at once, zero notification.
- [anthropics/claude-code#83600](https://github.com/anthropics/claude-code/issues/83600) — scheduled tasks silently disappear (recurring vanished twice in 5 days).
- [anthropics/claude-code#89811](https://github.com/anthropics/claude-code/issues/89811) — scheduled tasks report success but silently perform zero work.
- [anthropics/claude-code#88308](https://github.com/anthropics/claude-code/issues/88308) — scheduled-task MCP tools missing from session context on Windows.

Cross-check nearby schedule bugs are DIFFERENT (cite only as “not this”):

- NOT Fusee / [anthropics/claude-code#90485](https://github.com/anthropics/claude-code/issues/90485) early schedule dispatch.
- NOT Cinch / [anthropics/claude-code#90506](https://github.com/anthropics/claude-code/issues/90506) partial folder mounts on scheduled Cowork runs.
- NOT Reveille muster / heartbeat survival.
- NOT Fob keychain litter, Ordo headless plugin slash, Ullage context drop, Visa MCP OAuth resource, Sprag boot MCP, Larder plugin-store freeze, Hasp file-lease, Wicket worktree, Tappet silent hooks.

Cross-ecosystem (real silent-fail shape, not a new primary):

- [openai/codex#28444](https://github.com/openai/codex/issues/28444) — cron automations never fire while heartbeat automations stay green.
- [openai/codex#37973](https://github.com/openai/codex/issues/37973) is NOT this (wrong fire time; Fusee-class).
