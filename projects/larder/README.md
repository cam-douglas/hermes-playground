# Larder

Stillroom / cold larder for silent plugin-store freeze. A sync stamp is not a delivery. Score the shelf or admit **stocked**.

Per-workspace Claude Desktop plugin stores report healthy sync on a timer while downloading nothing. `manifest.json` `lastUpdated` advances; plugin folders stand still; claude.ai Plugins page and auto-sync indicators stay green; `main.log` is silent. Sessions (Desktop / Cowork) load weeks-stale plugin content with no fault. A plugin off/on toggle is a one-shot unstick (whole store re-downloads) then the store re-freezes. Fault is per-store, not machine-wide: sibling workspaces on the same machine take content normally.

Idle word: **stocked** (content arrived on the shelf; hold is current).
NEVER use the product name larder as the idle/state word.

Verdicts: **stocked**, **stamped**, **frozen**, **greened**, **toggled**, **drifted**, **lagged**, **aisled**, **aged**, **served**. Slack alarm on stamped / frozen / greened / drifted / aged / served. Linear ticket on frozen / greened / served. GitHub larder-ledger issue on every scored probe.

## Why not a clone

NOT Husk (hollow headless SUCCESS envelopes from tools / kernel vs husk).
NOT Reed (MCP four contacts: connected vs registered vs served call).
NOT Parity (paste-in claim vs GitHub/Vercel/Linear/probe).
NOT Tappet (silent hook injection / valve train).
NOT Aside (/btw silent truncation).
NOT Chute (sanctioned secret handoff).
NOT Tain (Chrome pairing one-way glass).
NOT Snib (Trusted Devices fail-open).
NOT Veto (heron_brook palimpsest).
NOT Assay (tool-arg furnace).
NOT Wicket (worktree isolation gatehouse).
NOT Sigil (thinking-block signature).
NOT Stencil (plan-mode fence).
NOT Suture (stream tear).
NOT Blot (image-poison darkroom).
NOT Coda (silent text-block loss).
NOT Fathom (standing rules dropped by compact).
NOT Hasp, Reveille, Quench, Scrim, Knock.
NOT leftover woodworking (Nick, Gouge, Dent, Scuff, Creep, Stub, Holiday, Shaving, Gap, etc.).

Different problem: plugin-store **content clock** vs **sync stamp**. A healthy `lastUpdated` is not a hold. Content must arrive on the shelf.
Different UI: a stillroom / cold larder. Zinc shelves, butcher-paper labels, hanging spring-scale, slate content clock on the wall, ice-room light. One shelf that either takes a delivery or stays empty while the clock ticks. Palette: zinc silver, butcher-paper cream, slate charcoal, hanging-scale brass, ice-room blue-green, spoiled-meat rust for frozen/aged. NOT oil-black/brass tappet, NOT theatre wing, NOT mail chute, NOT one-way glass, NOT threshing floor, NOT night-latch, NOT palimpsest, NOT furnace, NOT gatehouse, NOT seal desk, NOT blueprint fence, NOT suture tray, NOT darkroom.
Different idle word: **stocked**.

## Live catalog path

`/larder/` is this static stillroom desk. Zinc, butcher paper, slate clock, ice-room light. Demo works with no secrets and no npm.

1. Seeded `#90329` **stamped** is already on the shelf: `lastUpdated` advanced, plugin folders stood still → **stamped**.
2. Switch **stocked** — folders moved and versions match → **stocked** (idle).
3. Switch **frozen** — toggle unstuck once (26 Aug); 28 Aug the store stayed frozen → **frozen**.
4. Switch **greened** — every indicator green, `main.log` silent, stamp did not move → **greened**.
5. Switch **toggled** — this-tick off/on caused a full re-download → **toggled**.
6. Switch **drifted** — CLI pins behind with autoUpdate on; not a store tick → **drifted**.
7. Switch **lagged** — two clocks; content arrival behind the sync stamp → **lagged**.
8. Switch **aisled** — sibling workspaces took content; this store did not → **aisled**.
9. Switch **aged** — 37 versions behind, 3 days stale (the real `#90329` figures) → **aged**.
10. Switch **served** — Desktop / Cowork session loaded from THIS frozen store → **served**.
11. **Score** names the class. **Admit stocked** does not lie. **Clear** empties the shelf to the idle word.

## Hook

`projects/larder/hook/` scores a probe `{ autoSyncOn, lastUpdatedAdvanced, pluginFolderMoved, marketplaceVersion, localVersion, versionsBehind, daysStale, otherWorkspacesCurrent, logsPresent, indicatorsGreen, marketplacePageCurrent, toggleUnstick, reFroze, contentClockBehind, cliPinsBehind, autoUpdateOn, sessionsLoadFromStore, … }` and returns `{ verdict, reasons[], feed, slack, linear, github }`. See `hook/README.md`.

```bash
node projects/larder/hook/index.mjs --listen 9329
node --test projects/larder/hook/larder.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90329](https://github.com/anthropics/claude-code/issues/90329) — Desktop app: per-workspace plugin store syncs on schedule but never downloads (silent, every indicator green) (filed 2026-08-28, has repro)

Corroboration (plugin marketplace / Cowork / auto-update stale-while-green):

- [anthropics/claude-code#84401](https://github.com/anthropics/claude-code/issues/84401) — Plugin auto-update is silent in both directions
- [anthropics/claude-code#86139](https://github.com/anthropics/claude-code/issues/86139) — Plugin marketplace auto-update silently disabled on Homebrew/package-manager installs despite autoUpdate:true
- [anthropics/claude-code#73673](https://github.com/anthropics/claude-code/issues/73673) — Desktop: personal git-marketplace plugins never auto-update; Update button is a silent no-op
- [anthropics/claude-code#36700](https://github.com/anthropics/claude-code/issues/36700) — Cowork remote plugins: no path to force-update stale marketplace cache (Windows)
- [anthropics/claude-code#69020](https://github.com/anthropics/claude-code/issues/69020) — Cowork installs stale cached plugin version; ignores marketplace repo updates
- [anthropics/claude-code#88005](https://github.com/anthropics/claude-code/issues/88005) — Cowork stays pinned to stale plugin version from custom git marketplace
- [anthropics/claude-code#74609](https://github.com/anthropics/claude-code/issues/74609) — Agent mode serves a stale per-session plugin snapshot after a plugin update
- [anthropics/claude-code#14061](https://github.com/anthropics/claude-code/issues/14061) — `/plugin update` does not invalidate plugin cache
- [anthropics/claude-code#83987](https://github.com/anthropics/claude-code/issues/83987) — `/reload-plugins` errors when marketplace checkout updated ahead of installed versions; retrying never heals
- [anthropics/claude-code#59385](https://github.com/anthropics/claude-code/issues/59385) — Skills from marketplace plugins not activated after installation (missing copy to `~/.claude/skills/`)
