# Forksink

A **municipal storm-drain / catch-basin / grate booth** — wet asphalt, iron grate, sodium-vapor amber, runoff teal. Fonts **Syne** (display) + **Figtree** (body) + **IBM Plex Mono** (mono). Palette: asphalt `#12151a`, grate iron `#2a3038`, sodium `#FFB020`, runoff `#3ECFBF`, mist water `#9ab0b8`, ink `#0a0c10` — light-on-dark drain field, not marsh foxfire green, not conservation atelier plaster/umber, not chain-forge iron/brass, not parchment wax blotter, hangar strobe, basement sump rust, or dam-gate spillway.

Forksink is the street grate whose surface runoff stays lodged after rain, while the same water vanishes into the sink on a fork with no alarm. Here startup/compact additionalContext stays on the street; rewind `source=fork` swallows it.

Primary:

- [anthropics/claude-code#93458](https://github.com/anthropics/claude-code/issues/93458) (OPEN, bug, has repro, platform:windows, area:hooks, area:desktop). Title: `SessionStart hook additionalContext silently dropped when source=fork (rewind); startup/compact inject normally`. Filed by turtleziv 2026-09-10. Claude Code runtime **2.1.263**. A `SessionStart` hook that returns `hookSpecificOutput.additionalContext` **runs and produces output** when the session is created by a rewind (`source=fork`), but the model never receives the text. The same hook, same machine, same project, same settings injects correctly on `source=startup` and `source=compact`. Hook exits 0 and emits valid JSON; nothing reports failure. Without a side effect inside the hook, "didn't run" and "ran but output discarded" are indistinguishable. Docs say `additionalContext` on SessionStart is seen by Claude; `fork` is a documented SessionStart source alongside startup/resume/clear/compact. No stated exception for fork. Environment: Windows 10 (10.0.19045); Claude Code desktop app, Code tab — not the terminal CLI and not the VS Code extension; hook commands run through Git Bash; Opus 5 (`claude-opus-5`); Anthropic API (Claude subscription). Evidence: app log `[Rewind] resumeSessionAt=80b720a2-3ec9-4011-a5a2-c6e516465920 + forkSession` at `2026-09-11 03:36:24`; hook self-trace one second later `SessionStart ran：source=fork 注入 2430 字元` (emitted 2430 characters of additionalContext); the forked session contained none of those characters. Neighbouring SessionEnd hooks fired normally. Repro: register a SessionStart hook that logs `source` and prints `MARKER_ABC123`; start a session and ask if the marker is in context → yes; change the marker to `MARKER_XYZ789` and rewind; ask if `MARKER_XYZ789` is in context → no; hook log has a new `source=fork` line. Five `[Rewind] ... forkSession` entries in the current `main.log`. Cousins cite-only: #69848 CLOSED (Windows-wide additionalContext injection failure), #88086 OPEN (VS Code extension SessionStart plugin hook additionalContext logged succeeded but never injected).

12:50 forksink: a municipal storm-drain / catch-basin booth for #93458. Idle **lodged** / seeded **dropped** / path **source-fork**. Score forksink or admit lodged.

Score forksink or admit lodged.

Idle word: **lodged** (HOLD: additionalContext reached the model on fork the same way it does on startup/compact). Seeded word: **dropped** / #93458 (hook ran, exit 0, valid JSON, but the model never received additionalContext when source=fork). Path word: **source-fork**. Product score: **forksink**. Never idle kindled / painted / foxfire / never-turns / flushed / lagged / one-behind / pentimento / solitary / twinlinked / bridge-refuse / vinculum / hit / flattened / string-carrier / cachet / steady / strobing / off-label / strobe / matched / skewed / headers-hash / counterfoil / traced / pathless / image-cache / lucida / scrubbed / contaminated / fomite / gitignore / damped / spinning / mux / snubber / mounted / fossed / plan9 / fosse / warm / paged-out / majflt / hibernacle / sealed / mismatched / issuer / paraph / sterling / debased / hallmark / remanent / collimated / diopter / hysteresis / banked / ephemera / afloat / washed / pontoon.

Phrase: **when a SessionStart hook's additionalContext vanishes on source=fork while startup/compact still lodge it, score forksink or admit lodged.**

- **lodged** = IDLE: HOLD; additionalContext reached the model on fork the same way it does on startup/compact
- **dropped** = #93458 seeded path: hook ran, exit 0, valid JSON, but the model never received additionalContext when source=fork
- **forksink** = product score word for the municipal grate whose street-surface runoff lodges while fork/rewind vanishes into the sink
- **source-fork** = path word: rewind creates source=fork and silently drops the payload
- **hold** = HOLD alias for idle lodged
- **hook-ran** = SessionStart hook ran and wrote a self-trace
- **exit-zero** = hook exits 0; nothing reports failure
- **valid-json** = hook emits valid JSON `hookSpecificOutput.additionalContext`
- **no-model-text** = model never received the text; ask MARKER_XYZ789 → no
- **silent-drop** = no alarm; without a side effect, ran-but-discarded looks like did-not-run
- **rewind-fork** = desktop `[Rewind] resumeSessionAt=... + forkSession` at 03:36:24
- **startup-lodged** = source=startup injects MARKER_ABC123; model says yes
- **compact-lodged** = source=compact injects correctly; output visible in those sessions' context
- **marker-abc** = first-session marker `MARKER_ABC123`
- **marker-xyz** = changed marker `MARKER_XYZ789` after rewind
- **stale-inherit** = possible inherited parent snapshot is stale for session-changing state
- **no-alarm** = nothing reports a failure
- **session-end-live** = neighbouring SessionEnd hooks fire normally; hooks as a whole were live
- **self-trace** = hook wrote `source=fork 注入 2430 字元` as its last act
- **emitted-2430** = 2430 characters of additionalContext produced and then discarded
- **has-repro** = Claude Code 2.1.263 · turtleziv · Windows 10 · desktop Code tab · Git Bash
- **cousins** = cite-only #69848 #88086 — do not rebuild
- **backups** = cite-only #93475 #93439 #93438 #93466 #93495 #93507 #93512 #93508 — do not auto-pick
- **fixtures** = grate / basin / street / sink table for the forksink booth
- **walk** = published idle lodged → startup-lodged → compact-lodged → marker-change → rewind-fork → hook-ran → valid-json → no-model-text → source-fork → forksink

Verdicts: lodged, dropped, forksink, source-fork, hold, hook-ran, exit-zero, valid-json, no-model-text, silent-drop, rewind-fork, startup-lodged, compact-lodged, marker-abc, marker-xyz, stale-inherit, no-alarm, session-end-live, self-trace, emitted-2430, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the grate is **dropped** / **forksink** or already **lodged**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): a forked session may inherit the parent's context snapshot and skip re-applying SessionStart additionalContext, so state that changes during a session (parity check failures, SessionEnd findings, a to-do queue) stays stale after rewind with no alarm. Docs list fork as a SessionStart source and say additionalContext is seen by Claude, with no stated exception. Invite verify against #93458 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93458](https://github.com/anthropics/claude-code/issues/93458)
- Cite-only cousin: [anthropics/claude-code#69848](https://github.com/anthropics/claude-code/issues/69848) (CLOSED Windows-wide additionalContext injection failure; broader surface; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#88086](https://github.com/anthropics/claude-code/issues/88086) (OPEN VS Code extension SessionStart plugin hook additionalContext logged succeeded but never injected; do not rebuild)
- Backup (data only): #93475 Effort selector needs a very tall terminal
- Backup (data only): #93439 Binary Read skips PreToolUse
- Backup (data only): #93438 Worktree cwd bleed
- Backup (data only): #93466 Directory Plugins duplicate cards
- Backup (data only): #93495 Desktop UNUserNotificationCenter deadlock
- Backup (data only): #93507 / #93512 Cowork egress allowlist regressions
- Backup (data only): #93508 Documents preview_start TCC getcwd deny

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:hooks, area:desktop
- Claude Code **2.1.263**; reporter turtleziv; Windows 10 (10.0.19045); desktop Code tab; Git Bash hooks; Opus 5
- Same hook lodges additionalContext on `source=startup` and `source=compact`
- Rewind logs `[Rewind] resumeSessionAt=... + forkSession`; SessionStart runs with `source=fork` and emits 2430 characters
- Hook exits 0 and emits valid JSON; the forked session contained none of those characters
- Five rewind/forkSession entries in the current main.log, each silently dropping that session's orientation payload

Problem found: SESSIONSTART HOOK ADDITIONALCONTEXT SILENTLY DROPPED WHEN SOURCE=FORK WHILE STARTUP/COMPACT STILL LODGE IT.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the grate stayed **lodged** or was **dropped**. Educational municipal storm-drain / catch-basin booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. additionalContext reaches the model on `source=fork` the same way it does on `source=startup` and `source=compact`
2. or the documented SessionStart contract records the fork exception
3. without an in-hook side effect, ran-but-discarded stays indistinguishable from did-not-run
4. if inheritance is intentional, the inherited copy is a snapshot from the fork point and goes stale for session-changing state

## Why not a clone

This is specifically: **SESSIONSTART HOOK ADDITIONALCONTEXT SILENTLY DROPPED WHEN SOURCE=FORK** — municipal storm-drain grate booth, not marsh foxfire lantern, not conservation atelier pentimento, not chain-forge vinculum, not wax-cachet blotter, not basement sump, not dam-gate spillway.

**NOT Foxfire/#93502** (Remote Control idle composer paint-without-turn). Different defect. NOT marsh lantern / peat / bioluminescence.

**NOT Pentimento/#93482** (device_commit_files overwrite one-behind). Different defect. NOT art-conservation / underpainting atelier.

**NOT Vinculum/#93485** (local-mode hardlink / cloud bridge-refuse). Different defect. NOT chain-forge / nlink gauges.

**NOT Cachet/#93490** (Fable resume string-carrier bust). Different defect. NOT diplomatic wax-cachet blotter.

**NOT Sump** (worktree LFS hooks to a literal `dev/null/` directory). Different defect. NOT basement catch-pit rust.

**NOT Spillway** (ultracode skips max concurrent subagents). Different defect. NOT hydroelectric dam-gate.

**NOT Quietus.** **NOT Rubric.** **NOT Recension.** **NOT Afterimage/#92596** (Windows assistant paint deltas stay latent). Different defects.

**NOT Strobe/#93468.** **NOT Counterfoil/#93446.** **NOT Lucida/#93429.** **NOT Fomite/#93423.** **NOT Snubber/#93398.** **NOT Fosse/#93358.** **NOT Hibernacle/#93372.** **NOT Paraph/#93327.** Different defects.

**NOT Procrustes** (MCP tool cull / iron bed). Different defect. NOT an iron-bed schema cull. This booth is a municipal grate for street-lodge vs sink-drop gauges.

**NOT Hallmark** (sterling/debased). **NOT Diopter / Hysteresis / Ephemera.** Those catalog paradigms are different mechanisms — this booth is specifically SessionStart additionalContext vanishing on source=fork.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **municipal storm-drain booth — startup/compact runoff should stay lodged on the street (additionalContext reaches the model); instead rewind source=fork vanishes into the sink with no alarm (hook ran, exit 0, valid JSON, model never received the text).**

Do NOT rename this product Foxfire, Pentimento, Vinculum, Cachet, Strobe, Counterfoil, Lucida, Fomite, Snubber, Fosse, Hibernacle, Sump, Spillway, Quietus, Rubric, Recension, Afterimage, or any existing catalog slug.
Do NOT reuse idle lodged / dropped / source-fork on a later booth.
Display here is **Syne**. Body is **Figtree**. Mono is **IBM Plex Mono**.

Different surface: SessionStart additionalContext drop on source=fork vs idle Remote Control paint-without-turn vs overwrite one-behind vs local-mode hardlink vs Fable resume string-carrier.

Different UI: iron grate / catch-basin / street surface / sodium lamp gauges. Syne / Figtree / IBM Plex Mono. Wet asphalt drain field. NOT marsh lantern. NOT conservation atelier. NOT chain-forge. NOT wax-cachet blotter. NOT basement sump. NOT dam-gate spillway.

Different verbs: Lift the grate, Score forksink, Sound the basin, Compare street / sink, Pin idle lodged, Pin seeded dropped, Pin source-fork, Clear the grate.

Different idle: **lodged**. Different #93458 seeded path: **dropped**. HOLD: **lodged** / **hold**. ALARM: **dropped** / **forksink** / **source-fork** / **hook-ran**. Path: **source-fork**.

## How to score

```bash
node --test projects/forksink/forksink.test.mjs
node projects/forksink/forksink.mjs projects/forksink/data/dropped.json
echo '{"seed":"dropped"}' | node projects/forksink/forksink.mjs
```

Open the living card at `projects/forksink/index.html` (or the live path `/forksink/`). Buttons: Lift the grate, Score forksink, Sound the basin, Compare street / sink, Pin idle lodged, Pin seeded dropped, Pin source-fork, Clear the grate. Toggle hook ran / exit 0 / valid JSON / source=fork / model missed / silent drop — the score flips. Lay a fixture JSON on the grate. `?embed=1` hides chrome.

The booth reconstructs the reporter’s rewind / source-fork walk from the published #93458 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/forksink/
- Folder: `projects/forksink/`
