# Escapement

A **clockmaker escapement / pallet-fork atelier** desk — brass escape wheel, pallet fork, balance spring, chapter-ring of cron fires, oil stone, arbor; cool brass-and-enamel on a dark slate ground; hairline graduations; Instrument Serif + Manrope + Azeret Mono — for a real Claude Code defect: **local scheduled tasks stall mid-run with `isRunning: true` forever so the next cron fire is marked "Skipped"; `lastRunAt` updates even for incomplete runs; cloud routines worked the same morning; PushNotification ruled out.**

Primary:

- [anthropics/claude-code#91371](https://github.com/anthropics/claude-code/issues/91371) (OPEN, bug, platform:windows, area:routines, filed 2026-09-02T02:39:41Z). Title: [BUG] Local scheduled tasks silently hang mid-run and block later scheduled fires. Reporter lululin221010.

an escapement that arrests mid-beat is not a hold. Score the pallet or admit **arrested**.

Idle word: **arrested**. Seeded state: **skipped** / #91371 — isRunning stuck true after mid-run stall; next fire Skipped; lastRunAt lies. Never idle as jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / indexed.

An **escapement** is a pallet fork that should **arrest** one tooth per scheduled-task beat so a local cron / Run-now fire can complete or fail loudly. Instead the pallet **arrests mid-beat** with `isRunning: true` forever, `lastRunAt` advances anyway, and the next legitimate fire is marked **Skipped**.

- **skipped** = #91371: isRunning stuck true after mid-run stall; next fire Skipped; lastRunAt lies
- **isrunning-stuck** = stalled session stays `isRunning: true` indefinitely (observed 75+ minutes; `lastActivityAt` unchanged)
- **mid-run-stall** = stall mid-run with no error, timeout, or notification; stall after 4 tool calls / 2 Reads / 1 Glob
- **lastrunat-lies** = `lastRunAt` in `list_scheduled_tasks` updates even for incomplete runs — cannot verify success from that field alone
- **cloud-ok-local-bad** = cloud routine on hourly cron completed successfully; local tasks under `~/.claude/scheduled-tasks/` stalled
- **pushnotification-ruled-out** = removing `PushNotification` (replaced with `Write`) still stalled; 4th call became `mcp__scheduled-tasks__list_scheduled_tasks`
- **run-now-repro** = reproduced 4 times across 3 task definitions; both automatic cron and manual **"Run now"**
- **has-clear-repro** = lululin221010 filed #91371; cron `30 8 * * *`; `mcp__scheduled-tasks__create_scheduled_task`; `~/.claude/scheduled-tasks/`; Windows 11; Claude Desktop
- **hold** = scheduled run completes or fails loudly; isRunning clears; next cron fire is allowed; the pallet is arrested
- **arrested** = HOLD: scheduled run completes or fails loudly; isRunning clears; next cron fire is allowed

Verdicts: arrested, skipped, isrunning-stuck, mid-run-stall, lastrunat-lies, cloud-ok-local-bad, pushnotification-ruled-out, run-now-repro, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the pallet is arrested or skipped.

Hypothesis only (NON-BINDING): local scheduled-task runner fails to clear `isRunning` after a silent mid-session stall, so the scheduler Skips the next fire; `lastRunAt` is stamped on start not completion. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **LOCAL SCHEDULED TASKS STALL MID-RUN WITH `isRunning: true` FOREVER SO THE NEXT CRON FIRE IS MARKED "Skipped"; `lastRunAt` UPDATES EVEN FOR INCOMPLETE RUNS; CLOUD ROUTINES WORKED THE SAME MORNING; PushNotification RULED OUT.**

NOT **Limpet** ([#89275](https://github.com/anthropics/claude-code/issues/89275)) — post-success process never exits / RSS leak — cite-only; here the run never completes.
NOT [#91095](https://github.com/anthropics/claude-code/issues/91095) / [#89811](https://github.com/anthropics/claude-code/issues/89811) — SUCCEEDED / zero-work with no mid-run hang — cite-only.
NOT [#89135](https://github.com/anthropics/claude-code/issues/89135) / [#88825](https://github.com/anthropics/claude-code/issues/88825) / [#83709](https://github.com/anthropics/claude-code/issues/83709) / [#90157](https://github.com/anthropics/claude-code/issues/90157) — cloud RemoteTrigger stalls — cite-only; reporter's cloud worked.
NOT [#89936](https://github.com/anthropics/claude-code/issues/89936) — lastRunAt never updates — cite-only; here lastRunAt lies by updating.
NOT **Scotch** ([#91324](https://github.com/anthropics/claude-code/issues/91324)) — SCM recovery Access denied.
NOT **Geneva** ([#91296](https://github.com/anthropics/claude-code/issues/91296)) — settings.local.json bypassPermissions / Shift+Tab.
NOT **Fibula** ([#91306](https://github.com/anthropics/claude-code/issues/91306)) — mute DISPLAY clipboard hang.
NOT **Virgule** ([#91337](https://github.com/anthropics/claude-code/issues/91337)) — slash/skills menu trigger bound to message index 0.
NOT **Riddle** ([#91327](https://github.com/anthropics/claude-code/issues/91327)) — Devcontainer ipset duplicate + set -e firewall abort.
NOT **Garner** ([#91246](https://github.com/anthropics/claude-code/issues/91246)) — Desktop archive-to-pool no TTL.
NOT **Pintle** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — PreToolUse Bash relative-path deadlock.
NOT **Carillon** — plugin SessionStart first-wins.
NOT **Postern** ([#91223](https://github.com/anthropics/claude-code/issues/91223)) — anyone can bar a postern / who-can-lock.
NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork Toke/File/SeAt leak.
NOT **Catchword** ([#91362](https://github.com/anthropics/claude-code/issues/91362)) / **Spigot** ([#91165](https://github.com/anthropics/claude-code/issues/91165)) — Geneva backups — do not auto-pick.
NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross.

Cousins are cite-only on a cousin strip; primary stays #91371.

Product name stays **Escapement**. Do not rename to Scheduler, Cron, Routines, Tasks, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Limpet.

Different UI: clockmaker's bench / brass escape wheel + pallet fork / balance spring / chapter-ring of cron fires / oil stone / arbor / cool brass-and-enamel / dark slate / hairline graduations. Instrument Serif + Manrope + Azeret Mono. NOT Bodoni/Jost/Space Mono (Geneva). NOT Spectral/Sora/IBM Plex Mono (Scotch). NOT Cormorant/Outfit/Fira (Fibula). NOT Libre Baskerville/Work Sans/JetBrains (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair (Carillon). NOT Cinzel (Postern). NOT Libre Caslon (Alidade).

Different verbs: score the pallet, pin idle arrested, pin seeded skipped, admit arrested, load fixtures, reset to arrested. Not "Score the cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race".

Different idle: **arrested**.

## Live catalog path

`/escapement/` is this static clockmaker pallet-fork atelier desk. Path `https://hermes-playground-green.vercel.app/escapement/` and subdomain `https://escapement.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `12:50 / hermes catalog #113 / #91371`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **arrested** — scheduled run completes or fails loudly; isRunning clears; next cron fire is allowed.
2. Seed **skipped** → #91371: isRunning stuck true after mid-run stall; next fire Skipped; lastRunAt lies.
3. Atelier UI: brass escape wheel / pallet fork / balance spring / chapter-ring of cron fires / oil stone / arbor. Arrested = one tooth per beat. Skipped = pallet arrests mid-beat; next fire Skipped.
4. Cousin cite strip labeled cousin-not-primary: [#89275](https://github.com/anthropics/claude-code/issues/89275) / [#91095](https://github.com/anthropics/claude-code/issues/91095) / [#89811](https://github.com/anthropics/claude-code/issues/89811) / [#89135](https://github.com/anthropics/claude-code/issues/89135) / [#88825](https://github.com/anthropics/claude-code/issues/88825) / [#90157](https://github.com/anthropics/claude-code/issues/90157) / [#89936](https://github.com/anthropics/claude-code/issues/89936). Cite only. Primary stays #91371.
5. **Score the pallet** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/escapement/index.html` in a browser, or serve the repo root and visit `/escapement/` (Vercel rewrite → `/projects/escapement`). No build step. Optional hook:

```bash
node projects/escapement/hook/escapement.mjs projects/escapement/data/91371.json
node projects/escapement/hook/escapement.mjs projects/escapement/data/arrested.json
node --test projects/escapement/hook/escapement.test.mjs
```

Skipped seed → skipped/alarm. Arrested seed → arrested/hold.

`projects/escapement/hook/escapement.mjs` classifies a probe ticket JSON `{ isRunning, nextFireSkipped, lastRunAtUpdated, stalledMidRun, completedOrFailedLoudly }` and returns `{ verdict, chips[], reasons[], arrested, skipped, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91371.json`, `data/skipped.json`, `data/arrested.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts. Use isRunning, Skipped, lastRunAt, PushNotification ruled out, 4 tool calls / 2 Reads / 1 Glob, Run now, cron `30 8 * * *`, `mcp__scheduled-tasks__create_scheduled_task`, `~/.claude/scheduled-tasks/`, cloud-ok-local-bad, lululin221010, Windows 11, 75+ minutes. Never invent counts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91371](https://github.com/anthropics/claude-code/issues/91371). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Slack `#hermes-catalog` mention as the ship notice surface (text only; do not post).
3. Claude Code local scheduled tasks under `~/.claude/scheduled-tasks/` / Routines sidebar as the third native surface. Paste or drop a probe ticket JSON and score it.
4. Atelier UI (clockmaker's bench / brass escape wheel / pallet fork / balance spring / chapter-ring of cron fires / oil stone / arbor). Arrested = one tooth per beat, skipped = pallet arrests mid-beat and the next fire is Skipped.
5. Cousin-not-primary cite strip: #89275, #91095, #89811, #89135, #88825, #90157, #89936.

## Sources

- [anthropics/claude-code#91371](https://github.com/anthropics/claude-code/issues/91371) OPEN — primary. Product stays Escapement.
- Local scheduled tasks (Routines sidebar / `mcp__scheduled-tasks__create_scheduled_task`) stall mid-run with no error, timeout, or notification.
- Stalled session stays `isRunning: true` indefinitely (observed 75+ minutes; `lastActivityAt` unchanged).
- Next cron fire marked **"Skipped"** because prior run still Running.
- Reproduced 4 times across 3 task definitions; both automatic cron and manual **"Run now"**.
- Stall after exactly 4 tool calls in several runs; also after 2 Reads; also after 1 Glob.
- Removing `PushNotification` (replaced with `Write`) still stalled; 4th call became `mcp__scheduled-tasks__list_scheduled_tasks`.
- Pre-existing ~6-week-reliable task `social-metrics-auto-log` also stalled.
- `lastRunAt` in `list_scheduled_tasks` updates even for incomplete runs — cannot verify success from that field alone.
- Cloud routine on hourly cron in the same session completed successfully multiple times.
- Env: Windows 11, Claude Desktop, local tasks under `~/.claude/scheduled-tasks/`, example cron `30 8 * * *`.
- Expected: complete or fail visibly — not hang forever and silently block future fires.
- Cousins (cite, not primaries):
  - [#89275](https://github.com/anthropics/claude-code/issues/89275) — post-success process never exits / RSS leak (cite; here the run never completes).
  - [#91095](https://github.com/anthropics/claude-code/issues/91095) — SUCCEEDED / zero-work with no mid-run hang (cite).
  - [#89811](https://github.com/anthropics/claude-code/issues/89811) — SUCCEEDED / zero-work with no mid-run hang (cite).
  - [#89135](https://github.com/anthropics/claude-code/issues/89135) — cloud RemoteTrigger stall (cite; reporter's cloud worked).
  - [#88825](https://github.com/anthropics/claude-code/issues/88825) — cloud RemoteTrigger stall (cite; reporter's cloud worked).
  - [#90157](https://github.com/anthropics/claude-code/issues/90157) — cloud RemoteTrigger stall (cite; reporter's cloud worked).
  - [#89936](https://github.com/anthropics/claude-code/issues/89936) — lastRunAt never updates (cite; here lastRunAt lies by updating).
