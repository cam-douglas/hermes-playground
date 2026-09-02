# Escapement hook

Tiny clockmaker escapement / pallet-fork classifier for the local scheduled-task mid-run stall. Local scheduled tasks (Routines sidebar / `mcp__scheduled-tasks__create_scheduled_task`) stall mid-run with no error, timeout, or notification. Stalled session stays `isRunning: true` indefinitely. Next cron fire marked **"Skipped"**. `lastRunAt` updates even for incomplete runs. Cloud routines worked the same morning. PushNotification ruled out.

Idle word is **arrested**. Seeded state is skipped / #91371 (isRunning stuck true after mid-run stall; next fire Skipped; lastRunAt lies). Never idle as jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / indexed.

```bash
node projects/escapement/hook/escapement.mjs projects/escapement/data/91371.json
node projects/escapement/hook/escapement.mjs projects/escapement/data/arrested.json
echo '{"isRunning":true,"nextFireSkipped":true,"lastRunAtUpdated":true}' | node projects/escapement/hook/escapement.mjs
node --test projects/escapement/hook/escapement.test.mjs
```

Empty stdin uses the idle **arrested** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `arrested`, `skipped`, `hold`, `alarm`, `idleWord`.

Given `{ isRunning, nextFireSkipped, lastRunAtUpdated, stalledMidRun, completedOrFailedLoudly }`:

- **ARRESTED** if scheduled run completes or fails loudly; isRunning clears; next cron fire is allowed
- **SKIPPED** if isRunning stuck true after mid-run stall; next fire Skipped; lastRunAt lies (#91371)
- **ISRUNNING-STUCK** if stalled session stays `isRunning: true` indefinitely (observed 75+ minutes)
- **MID-RUN-STALL** if stall after 4 tool calls / 2 Reads / 1 Glob with no error, timeout, or notification
- **LASTRUNAT-LIES** if `lastRunAt` updates even for incomplete runs
- **CLOUD-OK-LOCAL-BAD** if cloud routine completed and local tasks under `~/.claude/scheduled-tasks/` stalled
- **PUSHNOTIFICATION-RULED-OUT** if removing PushNotification (replaced with Write) still stalled
- **RUN-NOW-REPRO** if reproduced 4 times across 3 task definitions; both cron and "Run now"
- **HAS-CLEAR-REPRO** if lululin221010 filed #91371; Windows 11; Claude Desktop; cron `30 8 * * *`
- **HOLD** if the pallet is arrested (complete or fail loudly; isRunning clears)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the pallet is arrested or skipped.

Primary: [anthropics/claude-code#91371](https://github.com/anthropics/claude-code/issues/91371). Cousins (cite only, not primaries): [#89275](https://github.com/anthropics/claude-code/issues/89275) post-success RSS leak; [#91095](https://github.com/anthropics/claude-code/issues/91095) / [#89811](https://github.com/anthropics/claude-code/issues/89811) SUCCEEDED / zero-work; [#89135](https://github.com/anthropics/claude-code/issues/89135) / [#88825](https://github.com/anthropics/claude-code/issues/88825) / [#90157](https://github.com/anthropics/claude-code/issues/90157) cloud RemoteTrigger; [#89936](https://github.com/anthropics/claude-code/issues/89936) lastRunAt never updates.

Hypothesis only (NON-BINDING): local scheduled-task runner fails to clear `isRunning` after a silent mid-session stall, so the scheduler Skips the next fire; `lastRunAt` is stamped on start not completion. Do not claim a root cause in Claude Code source you have not seen.

NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross. Product name stays Escapement. Do not rename to Scheduler / Cron / Routines / Tasks / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Postern / Limpet.
