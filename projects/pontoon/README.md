# Pontoon

A **harbor pontoon / floating-bridge pier** — timber decking, salt fog, navigation lights, rope, tide marks. Fonts **Petrona** (display) + **Figtree** (body) + **Azeret Mono** (mono). Palette: ink navy, wet timber, fog silver, nav-light amber, rope tan — for a real Claude Code defect: **DESKTOP RESTART DESTROYS EVERY REMOTE CONTROL SESSION BRIDGE WITH NO RECOVERY AND NO NOTICE.**

Primary:

- [anthropics/claude-code#93288](https://github.com/anthropics/claude-code/issues/93288) (OPEN, bug, has repro, area:desktop, platform:macos). Title: `Desktop restart destroys every Remote Control session bridge with no recovery and no notice`. Claude Code CCD 2.1.260. Claude Desktop 1.49585.0 (previously 1.46388.4). macOS 15.6 arm64 (Mac mini, always on). Filed by joshwillett 2026-09-10. When Claude Desktop restarts (stealth update / quit), every live Claude Code session and its Remote Control bridge is destroyed and nothing re-establishes them. Navigation history *is* returned so the desktop sidebar looks intact; the phone's session list is empty. No notice on either device. Sessions remain eligible (`remoteControlAutoEligible: true`, no `remoteControlUserToggled`) but `maybeAutoEnableRemoteControl` only runs from `first_turn` / `cold_resume` / `warm_send` — no trigger at session load. Updater deferral uses `hasActiveClaudeWork()` (turn running); an idle phone-bridged session is not "working", so restart proceeds and bridges die. Liveness = compute, not attached remote client. Log from 9 September: `onQuitCleanup: local-session-stop-all`, Stopping 10 active session(s), stealth-relaunch nav 50 entries. Manual repair the next morning: one `cold_resume` message per conversation, ~2s each, all ten in ~20s.

18:50 pontoon: a harbor pontoon / floating-bridge pier booth that should keep Remote Control bridges afloat after a Desktop restart; instead stealth relaunch / onQuitCleanup washes every session bridge while the sidebar still looks intact, and the phone list is empty (#93288). Score pontoon or admit afloat.

Score pontoon or admit afloat.

Idle word: **afloat** (HOLD: bridges afloat; RC attached; phone can reach). Seeded word: **washed** / #93288 (stealth relaunch / onQuitCleanup stops sessions; bridges gone; sidebar still looks intact). Path word: **bridge-loss**. Product score: **pontoon**. Never idle reaped / restored / expanded / laid / released / freehold / trunked / tokenized / locked / scratched / unmasked / revenant / replevin / cognate / lemures / escheat / mortmain / strowger / mondegreen / derby / vizard / concordant / mismatched / concordat / header-mismatch / moored / scuttled / held.

Phrase: **when Desktop restart washes every Remote Control bridge while the sidebar still looks intact, score pontoon or admit afloat.**

- **afloat** = IDLE: HOLD; RC attached; phone can reach; floating span stays up
- **washed** = #93288 seeded path: stealth relaunch / onQuitCleanup; bridges gone; sidebar still looks intact
- **pontoon** = product score word for the floating span that washed away
- **bridge-loss** = path word: the timber pier stays; the floating span is gone
- **hold** = HOLD alias for idle afloat
- **sidebar-lie** = desktop sidebar still lists every conversation
- **phone-empty** = phone session list is empty; no notice
- **eligible-but-dark** = `remoteControlAutoEligible: true`; no `remoteControlUserToggled`
- **no-load-trigger** = `maybeAutoEnableRemoteControl` only from first_turn / cold_resume / warm_send
- **compute-only-liveness** = `hasActiveClaudeWork()` tests a running turn
- **stealth-relaunch** = update install / quit / managed-config relaunch
- **on-quit-stop-all** = `onQuitCleanup: local-session-stop-all` — Stopping 10 sessions
- **nav-restore** = navigation history 50 entries, active=49
- **has-repro** = Desktop 1.49585.0 / CCD 2.1.260 macOS · joshwillett
- **cousins** = cite-only #73565 CLOSED — do not rebuild
- **backups** = cite-only #93279 #93270 #93269 #93265 #93257 #93239; Vernier/#93219 leftover — do not auto-pick
- **fixtures** = row list for the pontoon booth
- **walk** = published idle afloat → stealth-relaunch → on-quit-stop-all → nav-restore → sidebar-lie → phone-empty → eligible-but-dark → no-load-trigger → compute-only-liveness → washed → bridge-loss

Verdicts: afloat, washed, pontoon, bridge-loss, hold, sidebar-lie, phone-empty, eligible-but-dark, no-load-trigger, compute-only-liveness, stealth-relaunch, on-quit-stop-all, nav-restore, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring harbor pier. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the span is **washed** / **pontoon** or already **afloat**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): `maybeAutoEnableRemoteControl` only runs from first_turn / cold_resume / warm_send — no trigger at session load; `hasActiveClaudeWork()` tests a running turn, so an idle phone-bridged session is not working and stealth relaunch washes every bridge. Invite verify against #93288 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93288](https://github.com/anthropics/claude-code/issues/93288)
- Cite-only cousin: [anthropics/claude-code#73565](https://github.com/anthropics/claude-code/issues/73565) (CLOSED — standalone `claude rc` bridge restart rotates environment id / `auto_disabled_env_not_found`; different defect; do not rebuild)
- Backup (data only): #93279 HTTP MCP ~25s stall
- Backup (data only): #93270 Workflow kill leaks agents blocking archive
- Backup (data only): #93269 archive_session live-work names four causes
- Backup (data only): #93265 ShipIt non-ASCII env double-encode
- Backup (data only): #93257 agents auto-update relaunch drops flags
- Backup (data only): #93239 Enter-interrupts
- Backup (data only): #93219 Vernier millimeter-slider leftover — do not ship

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:desktop
- Claude Code CCD 2.1.260
- Claude Desktop 1.49585.0 (previously 1.46388.4)
- macOS 15.6 arm64, Mac mini always on
- Stealth update / quit / managed-config relaunch all reproduce
- `onQuitCleanup: local-session-stop-all` stops 10 active sessions
- Navigation history returns (50 entries, active=49); sidebar looks intact
- Phone session list empty; no notice on either device
- Sessions stay eligible (`remoteControlAutoEligible: true`, no user toggle)
- `maybeAutoEnableRemoteControl` only from first_turn / cold_resume / warm_send
- `hasActiveClaudeWork()` = turn running; idle phone-bridged session is not working
- Manual repair: one message per conversation (`trigger=cold_resume`), ~2s, all ten in ~20s
- No `rcAutoEnable` pass for ten hours after the wash

Problem found: WHEN DESKTOP RESTART WASHES EVERY REMOTE CONTROL BRIDGE WHILE THE SIDEBAR STILL LOOKS INTACT.

Why this solution: a diagnostic harbor pontoon / floating-bridge pier for the afloat → washed drift, so a reader can pin idle afloat, load the #93288 washed path, and score bridge-loss against the published facts. Conceptual timber pier, floating span, and phone lantern show whether the bridges stayed afloat. No live Claude session is required.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Re-bridge on startup for sessions that had a bridge
2. Or make the loss visible
3. Count attached remote clients as active work for updater deferral

## Why not a clone

This is specifically: **DESKTOP RESTART / ONQUITCLEANUP DESTROYS EVERY REMOTE CONTROL BRIDGE; SIDEBAR STILL LOOKS INTACT; PHONE LIST EMPTY; NO SESSION-LOAD RE-BRIDGE.**

**NOT Concordat/#93290** (MCP header 2025-11-25 vs `_meta` 2026-07-28 after SEP-2575 discover). Different defect.

**NOT Revenant/#93274** (Windows WMI peer-liveness timeout-kill orphans). Different defect.

**NOT Replevin/#93207** (iOS ExitPlanMode setMode auto + default fallback). Different defect.

**NOT Cognate/#93250** (plugin MCP `${PLUGIN_ROOT}` left unexpanded). Different defect.

**NOT Lemures/#93256** (mid-turn task-summary classifier keeps previous `latestAsk` across `/clear`). Different defect.

**NOT Escheat/#93231** (VS Code window-close leaves git worktree `locked` naming a dead PID). Different defect.

**NOT Mortmain/#93173** (sandbox `denyWithinAllow` freezes tracked `.claude` paths). Different defect.

**NOT Strowger/#93218** (Desktop `--disallowedTools SendMessage` while ListAgents still lists). Different paradigm.

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Buoy** (macOS main window left at floating layer after Computer Use side panel). Different harbor; different defect. Do not reuse Buoy's layer-latch walk.

**NOT Bollard. NOT Bitts. NOT Hawser.** Different harbor fittings; different defects.

**NOT #73565 itself** (standalone `claude rc` env-id rotate / `auto_disabled_env_not_found`) — cite only; primary is Desktop per-session bridge wash on restart.

**NOT Vernier/#93219** (millimeter-slider leftover — forbidden as primary).

**NOT Derby/#93197.** **NOT Vizard/#93190.** **NOT Flashpan/#93015.** **NOT Clepsydra.**

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **Desktop stealth relaunch washes idle Remote Control bridges because liveness is compute-only and session load never re-enables RC** — unused in catalog as this pontoon / floating-bridge pier walk.

Do NOT rename this product Concordat, Revenant, Replevin, Cognate, Lemures, Escheat, Mortmain, Strowger, Mondegreen, Buoy, Bollard, Bitts, Hawser, Flashpan, Clepsydra, or any existing catalog slug.
Do NOT reuse idle afloat / washed / bridge-loss on a later booth.
Do NOT reuse Vollkorn + DM Sans + Inconsolata (Concordat). Do NOT reuse Young Serif + Mulish + DM Mono (Revenant). Do NOT reuse Literata + Sora + Roboto Mono (Replevin). Do NOT reuse Fraunces + Source Sans 3 + IBM Plex Mono (Cognate). Do NOT reuse Libre Baskerville + Red Hat Text + JetBrains Mono (Lemures). Display here is **Petrona**. Body is **Figtree**. Mono is **Azeret Mono**.

Different surface: Desktop Remote Control bridge wash vs MCP header↔`_meta` discord / WMI timeout-kill orphans / iOS setMode auto / unexpanded PLUGIN_ROOT / remanent classifier / worktree lock leftover / sandbox freeze / SendMessage cut / git substring / scheduled flash / OTel stall / floating window layer.

Product name stays **Pontoon**. Name/slug `pontoon` unused in catalog.json (267 products before this ship; Concordat is #267).

Different UI: harbor pontoon / floating-bridge pier / timber decking / salt fog / navigation lights / rope / tide marks. Petrona / Figtree / Azeret Mono. NOT diplomatic chancery / treaty desk / parchment / seal-wax (Concordat). NOT Victorian séance parlor / process-tomb (Revenant). NOT legal replevin chamber / writ desk (Replevin). NOT comparative philology / manuscript cognate desk (Cognate). NOT Roman Lemuria night courtyard (Lemures). NOT feudal escheat chamber (Escheat). NOT muniment room (Mortmain). NOT Strowger exchange / switchboard. NOT ballad-sheet studio (Mondegreen). NOT Buoy layer sounding board. NOT flintlock flash-pan (Flashpan). NOT water clock (Clepsydra).

Different verbs: Sound the fog, Score pontoon, Walk the pier, Check the bridges, Pin idle afloat, Pin seeded washed, Pin bridge-loss, Reset the deck.

Different idle: **afloat**. Different #93288 seeded path: **washed**. HOLD: **afloat** / **hold**. ALARM: **washed** / **pontoon** / **bridge-loss** / **sidebar-lie** / **phone-empty**. Path: **bridge-loss**.

## How to score

```bash
node --test projects/pontoon/pontoon.test.mjs
node projects/pontoon/pontoon.mjs projects/pontoon/data/pontoon.json
echo '{"seed":"washed"}' | node projects/pontoon/pontoon.mjs
```

Open the living card at `projects/pontoon/index.html` (or the live path `/pontoon/`). Buttons: Sound the fog, Score pontoon, Walk the pier, Check the bridges, Pin idle afloat, Pin seeded washed, Pin bridge-loss, Reset the deck. Toggle stealth relaunch / onQuitCleanup / nav history / sidebar / phone empty / eligible / compute-only — the score flips. Lay a fixture JSON on the deck. `?embed=1` hides chrome.

The booth reconstructs the reporter’s stealth-relaunch / stop-all / nav-restore / phone-empty walk from the published #93288 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/pontoon/
- Folder: `projects/pontoon/`
