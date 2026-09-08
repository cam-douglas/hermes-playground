# Mirage

A **desert observatory / heat-haze mirage bench** — dark desert night, shimmer, false oasis; fonts **Newsreader** (display) + **Lexend** (body) + **Fragment Mono** (mono) — for a real Claude Desktop defect: **A SCHEDULED TASK DISPATCH IS ACKNOWLEDGED BY THE RENDERER (`Dispatch acknowledged by renderer`) BUT NO SESSION EVER STARTS; ~12 MINUTES LATER MAIN LOGS `Cleared stale pending dispatch`, AND `lastRunAt` IS STAMPED ANYWAY SO THE TASK LIST LIES THAT THE RUN HAPPENED.**

Primary:

- [anthropics/claude-code#92920](https://github.com/anthropics/claude-code/issues/92920) (OPEN, bug, has repro, platform:macos, area:desktop, area:routines). Title: `[BUG] Scheduled task dispatch acknowledged by renderer but no session starts; 'Cleared stale pending dispatch' after 12 min, lastRunAt stamped anyway (3 of 18 tasks lost overnight)`. Claude desktop app 1.46388.4 (Code tab), Claude Code 2.1.260, macOS 26.x (Darwin 25.6.0). Filed 2026-09-08T19:03:31Z by geokao.

07:50 mirage: a desert observatory / heat-haze bench that should keep a scheduled dispatch confirmed — Spawning → Dispatch acknowledged by renderer → Confirmed task run within ~1s; instead the renderer acknowledges, no session starts, stale pending dispatch is cleared, and lastRunAt is stamped anyway so the task list lies — score miraged or admit confirmed.

Score miraged or admit confirmed.

Idle word: **confirmed** (HOLD: healthy triple within ~1s; lastRunAt honest because a session started). #92920 path: **miraged**. Never idle loosed / intact / enrolled / as-penned / rove / vaulted / cleared. Never seed clung / relisted / regranted / misbound / fouled / escheated.

**Mirage** = heat that looks like water. The renderer ack looks like a run started. The oasis is not there. `lastRunAt` still paints water on the dunes.

- **confirmed** = IDLE: HOLD; Spawning → Dispatch acknowledged → Confirmed task run within ~1s
- **miraged** = #92920 path: renderer ack, no session, stale clear, lastRunAt lie
- **late-confirm** = morning-checkin-daily confirmed 72 min late after stale clear
- **stale-clear** = `Cleared stale pending dispatch` with no session
- **lastrun-lie** = lastRunAt 2026-09-08T09:21:00Z with no `Starting local session`
- **overnight-loss** = 3 of 18 tasks lost; 14 healthy triples; 1 late
- **cousins** = cite-only #74432 #73927 #76304 #77596 #60144 — do not clone
- **before-after** = before miraged; after expected confirmed triple
- **jitter-delay** = 265s jitter confounder — not the defect
- **global-limit** = concurrency cap confounder — lost tasks were acknowledged
- **fixtures** = row list for the observatory bench

Verdicts: confirmed, miraged, late-confirm, stale-clear, lastrun-lie, overnight-loss, cousins, before-after, jitter-delay, global-limit, fixtures.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No Desktop hooks. No payloads. No secrets. No network to Anthropic. Score whether a log timeline is **miraged** or already **confirmed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): renderer ack without session start leaves a pending dispatch that times out ~12m and falsely stamps lastRunAt. Invite verify against #92920 text only. Do NOT implement a fix in anthropics/claude-code.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92920](https://github.com/anthropics/claude-code/issues/92920)
- Cite-only: [anthropics/claude-code#74432](https://github.com/anthropics/claude-code/issues/74432) (CLOSED)
- Cite-only: [anthropics/claude-code#73927](https://github.com/anthropics/claude-code/issues/73927) (CLOSED)
- Cite-only: [anthropics/claude-code#76304](https://github.com/anthropics/claude-code/issues/76304) (CLOSED)
- Cite-only: [anthropics/claude-code#77596](https://github.com/anthropics/claude-code/issues/77596) (CLOSED)
- Cite-only: [anthropics/claude-code#60144](https://github.com/anthropics/claude-code/issues/60144) (CLOSED)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:desktop, area:routines
- Desktop 1.46388.4 (Code tab); Claude Code 2.1.260; macOS 26.x Darwin 25.6.0; Apple silicon
- Log: `~/Library/Logs/Claude/main.log`, 2026-09-08 local
- Healthy path: `Spawning new session` → `Dispatch acknowledged by renderer` → `Confirmed task run` within ~1s (14 of 18)
- Miraged path: spawn + ack, no session, then `Cleared stale pending dispatch`; lastRunAt stamped anyway
- `voc-weekly-incremental` 03:12:59 spawn/ack → 03:21:00 stale; lastRunAt `2026-09-08T09:21:00Z`; no Starting local session
- `daily-reading` 03:36:05 spawn/ack → 03:51:00 stale (never ran)
- `singularity-research-weekly` 04:28:23 spawn/ack → 04:40:00 stale (never ran)
- `morning-checkin-daily` jitter 265s; 08:39:52 spawn/ack → 08:51:27 stale → 09:51:41 confirmed (72 min late)
- Same warning on 2026-08-29 (`ig-publish-daily` and a one-time task, 3×) and 2026-08-31 (`early-run-sunday-weekly`)
- Laptop awake, AC, no sleep/wake near those dispatches (`pmset -g log`)
- Interactive sessions open in other folders at 08:39
- Same night: `Skipping dispatch … global_limit (active=3, limit=3)` for ~9 minutes — concurrency cap in #91387; the lost dispatches were *not* skipped by that cap
- Expected: acknowledged dispatch starts a session, or stale-clear re-dispatches; lastRunAt should not advance without a session
- Workaround: grep the log every morning for `Cleared stale pending dispatch` and re-fire lost tasks as one-time tasks

Problem found: A DESERT OBSERVATORY THAT SHOULD CONFIRM A REAL SESSION AFTER THE RENDERER ACK INSTEAD SCORES A FALSE OASIS — ACK WITHOUT A SESSION, STALE CLEAR, lastRunAt ALREADY LYING.

Why this solution: a diagnostic desert observatory for the confirmed → miraged drop, so a reader can pin idle confirmed, load the #92920 miraged path, and score late-confirm / stale-clear / lastrun-lie / overnight-loss / cousins / before-after / jitter-delay / global-limit against the published facts.

## Why not a clone

This is specifically: **RENDERER ACK WITHOUT A SESSION + STALE PENDING DISPATCH CLEAR + lastRunAt STAMPED ANYWAY (FALSE COMPLETION RECEIPT AFTER PHANTOM ACK).**

**NOT Oubliette** (Cowork Dispatch child-completion voided against idle/cold parent). Cite only. Do not touch Oubliette.

**NOT Remora/#92934** (PostToolUse child cling — just shipped #233). Cite only. Do not touch Remora.

**NOT Ukase/#92833** (permission ukase on scheduled bash). Cite only. Do not touch Ukase.

**NOT Deadletter/#90049, Callboard, Annunciator, Reveille.** Already shipped. Cite only. Do not touch.

Cousins cite-only #74432 #73927 #76304 #77596 #60144 — similar silent scheduler skips / lastRunAt stamped. Do not clone those closed issues.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. NOT a Desktop automation.

Different paradigm: **the renderer ack looks like water; no session starts; stale clear + lastRunAt paint a run that never happened.**

Do NOT rename this product Remora, Oubliette, Ukase, or any existing catalog slug.
Do NOT reuse idle loosed / intact / enrolled / as-penned / rove / vaulted / cleared. Do NOT reuse seeded clung / relisted / regranted / misbound / fouled / escheated.

Different surface: Desktop scheduled-task renderer-ack-without-session vs PostToolUse child-hold / Cowork child-completion void / scheduled bash permission ukase / worktree tool_result loss.

Product name stays **Mirage**. Name/slug `mirage` confirmed unused in catalog.json (233 products before this ship; Remora is #233).

Different UI: desert observatory / heat-haze / false oasis / dark desert night / dune silhouette / observatory slit. Newsreader / Lexend / Fragment Mono. NOT Ibarra Real Nova + Red Hat Text + Red Hat Mono (Remora hull/kelp). NOT Vollkorn / Cabin / Ubuntu Mono (Procrustes forge). NOT Crimson Pro + Work Sans + Cousine (Cadastre). NOT Cardo + Figtree + Source Code Pro (Rubric). NOT Fraunces + Plus Jakarta + IBM Plex (Sheave).

Different verbs: Score miraged, Admit confirmed, Sight overnight loss, Load #92920, Reset to confirmed.

Different idle: **confirmed**. Different #92920 path: **miraged**. HOLD: **confirmed**. ALARM: **miraged** / **late-confirm** / **stale-clear** / **lastrun-lie** / **overnight-loss** / **cousins** / **before-after** / **jitter-delay** / **global-limit** / **fixtures**.

## How to score

```bash
node --test projects/mirage/mirage.test.mjs
node projects/mirage/mirage.mjs projects/mirage/data/92920.json
node projects/mirage/mirage.mjs projects/mirage/data/confirmed.json
echo '{"seed":"miraged"}' | node projects/mirage/mirage.mjs
```

Open the living card at `projects/mirage/index.html` (or the live path `/mirage/`). Buttons: Score miraged, Admit confirmed, Sight overnight loss, Load #92920, Load fixtures, Reset to confirmed. Toggle spawn / ack / confirm / stale / lastRunAt — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/mirage/
- Folder: `projects/mirage/`
