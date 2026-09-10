# Hibernacle

A **winter hibernacle / animal wintering-den booth** — cold stone, frost linen, ice-blue breath, moss-green bedding, ember stall-meter. Fonts **Cormorant Garamond** (display) + **Sora** (body) + **JetBrains Mono** (mono). Palette: deep slate night `#0b1018`, frost linen `#dce3ea`, ice blue `#7eb8c9`, moss green `#4a7c59`, ember amber `#e08a3c` — for a real Claude Code defect: **ON WINDOWS, AFTER IDLE ~2+ MINUTES, WINDOWS TRIMS THE PROCESS WORKING SET EVEN WITH 12.5 GB FREE RAM. FIRST ENTER AFTER IDLE BLOCKS THE NODE EVENT LOOP ~5s WITH majflt≈41105 / cpu≈77ms. TUI DOES NOT REPAINT; A SECOND ENTER DOUBLE-SUBMITS.**

Primary:

- [anthropics/claude-code#93372](https://github.com/anthropics/claude-code/issues/93372) (OPEN, bug, has repro, platform:windows, area:tui). Title: `[BUG] Windows: ~5s event-loop stall on first Enter after idle — working-set trim causes 41k major page faults (duplicate message submission)`. Filed by ramgalv 2026-09-10. Build 2.1.261.355; reproduces 2.1.260 through 2.1.266. Windows 11 (10.0.26200), 32 GB RAM. Session idle 2m25s. `[event-loop-stall]` WARN: blocked 4940ms monotonic, cpu=77ms, majflt=41105, rss=664MB, heap=151MB. 12.5 GB RAM free, commit 62%. Working set 504 MB → 946 MB while private stays ~834–858 MB (fault-in, not allocation). Sequential external fault-in of 442 MB takes 441 ms (~10×). Six concurrent sessions sat 40–60% non-resident. Workaround: wait ~5 s, or touch committed private memory on a ~90 s timer (~60 ms).

01:50 hibernacle: a winter hibernacle / animal wintering-den booth for #93372. Idle **warm** / seeded **paged-out** / path **majflt**. Score hibernacle or admit warm.

Score hibernacle or admit warm.

Idle word: **warm** (HOLD: working set stays resident while idle; first Enter after idle paints immediately; no majflt storm). Seeded word: **paged-out** / #93372 (idle trim → majflt storm → stall → duplicate Enter). Path word: **majflt**. Product score: **hibernacle**. Never idle honest / scapegoated / ungranted / scapegoat / bound / accreted / session-url / cartulary / sealed / mismatched / issuer / paraph / routed / inherited / cascade / appanage / afloat / washed / pontoon / concordant / concordat / reaped / revenant / restored / expanded / laid / released / freehold / trunked / replevin / cognate / lemures / escheat / mortmain / strowger / mondegreen / derby / vizard / vernier / slider.

Phrase: **when Windows trims an idle working set and the first Enter after idle storms majflt so the TUI looks dropped and a second Enter double-submits, score hibernacle or admit warm.**

- **warm** = IDLE: HOLD; working set stays resident while idle; first Enter after idle paints immediately; no majflt storm
- **paged-out** = #93372 seeded path: idle trim → majflt storm → stall → duplicate Enter
- **hibernacle** = product score word for the den that went cold and double-submitted
- **majflt** = path word: major page-fault path through first Enter after idle
- **hold** = HOLD alias for idle warm
- **working-set-trim** = Windows pages the idle process out with abundant free RAM
- **event-loop-stall** = `[event-loop-stall]` WARN blocked 4940ms, cpu=77ms
- **tui-frozen** = TUI does not repaint; the keystroke looks dropped
- **duplicate-enter** = second Enter buffered; both newlines deliver
- **abundant-ram** = 12.5 GB free / commit 62% — idle trim, not memory pressure
- **scattered-faults** = 41k individual faults; sequential external fault-in is ~10× faster
- **has-repro** = Claude Code 2.1.261.355 · ramgalv · Windows 11 10.0.26200 · 32 GB RAM
- **cousins** = cite-only #88375 #92005 #87987 #75571 — do not rebuild
- **backups** = cite-only #93348 #93345 #93279; Vernier/#93219 leftover — do not auto-pick
- **fixtures** = warm idle RSS held; paged-out idle with majflt storm + duplicate Enter
- **walk** = published idle warm → idle-2m25s → working-set-trim → first-enter → event-loop-stall → majflt-41105 → tui-frozen → second-enter → both-newlines → duplicate-submit → paged-out → majflt → hibernacle

Verdicts: warm, paged-out, hibernacle, majflt, hold, working-set-trim, event-loop-stall, tui-frozen, duplicate-enter, abundant-ram, scattered-faults, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the den is **paged-out** / **hibernacle** or already **warm**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): first-Enter submit path walks a large structure with a scattered access pattern after Windows idle working-set trim, so the event loop takes tens of thousands of major page faults before the TUI can repaint. Invite verify against #93372 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93372](https://github.com/anthropics/claude-code/issues/93372)
- Cite-only cousin: [anthropics/claude-code#88375](https://github.com/anthropics/claude-code/issues/88375) (Desktop idle freeze — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#92005](https://github.com/anthropics/claude-code/issues/92005) (Desktop hang after sleep — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#87987](https://github.com/anthropics/claude-code/issues/87987) (subagent stream stall — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#75571](https://github.com/anthropics/claude-code/issues/75571) (VS Code extension hang — do not rebuild)
- Backup (data only): #93348 Scapegoat (already shipped)
- Backup (data only): #93345
- Backup (data only): #93279 HTTP MCP ~25s stall
- Backup (data only): #93219 Vernier millimeter-slider leftover — do not ship

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:tui
- Claude Code 2.1.261.355; reproduces 2.1.260 through 2.1.266
- Windows 11 (10.0.26200), 32 GB RAM
- Session idle 2m25s; Enter at 19:56:10.8 local
- Last log before the block: `Hooks: checkForNewResponses returning 0 responses`
- `[event-loop-stall]` WARN 5s later: blocked 4940ms, cpu=77ms, majflt=41105, rss=664MB, heap=151MB, ext=63MB
- clock jump 0ms; sigcont=false; blocked_write=false
- 12.5 GB RAM free, commit 62% — trim because idle, not pressure
- Working set 504 MB → 946 MB; private ~834–858 MB (fault-in, not allocation)
- Sequential external fault-in 442 MB in 441 ms (~10×)
- Six concurrent sessions sat 40–60% non-resident after a few idle minutes
- Impact: Enter looks dropped ~5s; duplicate message submission; catch-up repaint garbling
- Workaround: wait ~5s; or touch committed private memory on a ~90s timer (~60ms)

Problem found: WHEN WINDOWS TRIMS AN IDLE WORKING SET AND THE FIRST ENTER AFTER IDLE STORMS majflt SO THE TUI LOOKS DROPPED AND A SECOND ENTER DOUBLE-SUBMITS.

Why this solution: a diagnostic winter hibernacle / animal wintering-den booth for the warm → paged-out drift, so a reader can pin idle warm, load the #93372 paged-out path, and score majflt against the published facts. Conceptual den, frost linen, ember stall-meter, and moss-stone faults show whether RSS was held or paged to the cold den. No live Claude session is required.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Keep the working set resident while idle so first Enter after idle does not storm majflt
2. Failing that, surface a TUI hint when `event-loop-stall` exceeds a threshold so the user does not press Enter again

## Why not a clone

This is specifically: **WINDOWS IDLE WORKING-SET TRIM → majflt STORM ON FIRST ENTER → EVENT-LOOP STALL → TUI FROZEN → DUPLICATE SUBMIT.**

**NOT Scapegoat/#93348** (ungranted Chrome host makes executeScript hang and blame the page). Different defect. NOT desert altar.

**NOT Cartulary/#93331** (mcpOAuth accretes under a session-scoped `serverUrl`). Different defect. NOT oak scriptorium.

**NOT Paraph/#93327** (Desktop BYO OAuth issuer quotes close `%22`). Different defect.

**NOT Appanage/#93307** (code-review skill fork children inherit the parent fable crown). Different defect.

**NOT Pontoon/#93288** (Desktop restart washes every Remote Control bridge). Different defect.

**NOT Concordat/#93290** (MCP header 2025-11-25 vs `_meta` 2026-07-28). Different defect.

**NOT Revenant/#93274** (Windows WMI peer-liveness timeout-kill orphans). Different defect — Revenant is WMI timeout-kill, Hibernacle is working-set trim / majflt.

**NOT Replevin/#93207.** **NOT Cognate/#93250.** **NOT Lemures/#93256.** **NOT Escheat/#93231.** **NOT Mortmain/#93173.** **NOT Strowger/#93218.** **NOT Mondegreen/#93193.** **NOT Buoy.**

**NOT Vernier/#93219** (millimeter-slider leftover — forbidden as primary).

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **OS working-set reclaim / major page faults / idle→first-keystroke stall + double-submit** — unused in catalog as this winter hibernacle / animal wintering-den walk.

Do NOT rename this product Scapegoat, Cartulary, Paraph, Appanage, Pontoon, Concordat, Revenant, Replevin, Cognate, Lemures, Escheat, Mortmain, Strowger, Mondegreen, or any existing catalog slug.
Do NOT reuse idle warm / paged-out / majflt on a later booth.
Do NOT reuse Libre Bodoni + Outfit + IBM Plex Mono (Scapegoat). Do NOT reuse Fraunces + Karla + IBM Plex Mono (Cartulary). Display here is **Cormorant Garamond**. Body is **Sora**. Mono is **JetBrains Mono**.

Different surface: Windows idle working-set trim / majflt storm vs Chrome host-grant timeout / credential-store accretion / Desktop issuer-quote formatter / skill-fork model inherit / Desktop RC wash / MCP header↔`_meta` discord / WMI timeout-kill orphans.

Product name stays **Hibernacle**. Name/slug `hibernacle` unused in catalog.json (272 products before this ship; Scapegoat is #272).

Different UI: winter hibernacle / animal wintering-den / cold stone / frost linen / ice blue / moss green / ember stall-meter. Cormorant Garamond / Sora / JetBrains Mono. NOT ash altar / ochre dust / goat-bell (Scapegoat). NOT oak lectern / bound quires / inkhorn (Cartulary). NOT notarial wax press (Paraph). NOT royal-grant / heraldic desk (Appanage). NOT harbor pontoon (Pontoon). NOT diplomatic chancery (Concordat). NOT Victorian séance (Revenant). NOT millimeter-slider.

Different verbs: Stir the den, Score hibernacle, Walk the frost, Inspect the working set, Pin idle warm, Pin seeded paged-out, Pin majflt, Reset the den.

Different idle: **warm**. Different #93372 seeded path: **paged-out**. HOLD: **warm** / **hold**. ALARM: **paged-out** / **hibernacle** / **majflt** / **working-set-trim** / **event-loop-stall**. Path: **majflt**.

## How to score

```bash
node --test projects/hibernacle/hibernacle.test.mjs
node projects/hibernacle/hibernacle.mjs projects/hibernacle/data/hibernacle.json
echo '{"seed":"paged-out"}' | node projects/hibernacle/hibernacle.mjs
```

Open the living card at `projects/hibernacle/index.html` (or the live path `/hibernacle/`). Buttons: Stir the den, Score hibernacle, Walk the frost, Inspect the working set, Pin idle warm, Pin seeded paged-out, Pin majflt, Reset the den. Toggle idle 2+ min / working-set trim / majflt storm / TUI frozen / second Enter / abundant RAM — the score flips. Lay a fixture JSON on the frost linen. `?embed=1` hides chrome.

The booth reconstructs the reporter’s idle / trim / first-Enter / majflt / duplicate-Enter walk from the published #93372 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/hibernacle/
- Folder: `projects/hibernacle/`
