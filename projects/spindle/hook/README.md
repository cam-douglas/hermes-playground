# Spindle hook

Tiny machine-shop spindle / shared-ways chip-sweep classifier for the new-session startup cleanup that deletes live sibling Bash task outputs. Multi-session use plus background subagents share one project temp root under `%LOCALAPPDATA%\Temp\claude\<project-slug>\<session-id>\`. Session B startup cleanup deletes session A's still-running `tasks/<task-id>.output`. Liveness is judged by output-file mtime, not process or lock. Silent; parent sees empty or truncated capture. First seen 1 Sep 2026, recurring. Claude Code 2.1.211 Windows.

Idle word is **fenced**. Seeded state is swept / #91402 (startup cleanup deletes live sibling Bash background-task captures; mtime false-liveness; silent mid-execution loss). Never idle as tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed.

```bash
node projects/spindle/hook/spindle.mjs projects/spindle/data/91402.json
node projects/spindle/hook/spindle.mjs projects/spindle/data/fenced.json
echo '{"startupCleanup":true,"siblingLive":true,"outputDeleted":true}' | node projects/spindle/hook/spindle.mjs
node --test projects/spindle/hook/spindle.test.mjs
```

Empty stdin uses the idle **fenced** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `fenced`, `swept`, `hold`, `alarm`, `idleWord`.

Given `{ startupCleanup, siblingLive, outputDeleted, mtimeLiveness, silentDeletion, siblingDirsUntouched, processLockLiveness }`:

- **FENCED** if cleanup never touches alive sibling dirs; liveness is process/lock; process-gone or lock-stale required before delete
- **SWEPT** if new-session startup cleanup deletes live sibling Bash task output; mtime false-liveness; silent mid-execution loss (#91402)
- **SIBLING-LIVE** if session A's still-running `tasks/<task-id>.output` is deleted by session B startup cleanup
- **MTIME-FALSE-LIVENESS** if liveness is judged by output file mtime rather than process or lock
- **STARTUP-CLEANUP** if session B startup cleanup deletes session A's still-running Bash background-task captures
- **SHARED-TEMP-ROOT** if multi-session plus background subagents share project temp `%LOCALAPPDATA%\Temp\claude\<project-slug>\<session-id>\`
- **OUTPUT-TRUNCATED** if parent session reads an empty or truncated `.output` file
- **SILENT-DELETION** if the deletion is silent; parent sees empty or truncated capture
- **MULTI-SESSION** if several interactive sessions plus background subagents share one project temp root
- **HAS-CLEAR-REPRO** if Row-Nation filed #91402; 2.1.211 Windows; long `run_in_background` in A then start B same project
- **HOLD** if the spindle is fenced (cleanup never touches alive sibling dirs)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the spindle is fenced or swept.

Primary: [anthropics/claude-code#91402](https://github.com/anthropics/claude-code/issues/91402). Cousins (cite only, not primaries): [#79879](https://github.com/anthropics/claude-code/issues/79879) Bash timeout silently hard-kills (exit 143) — Shear backup/cousin; [openai/codex#35433](https://github.com/openai/codex/issues/35433) Windows background shell child without visible lifecycle.

Hypothesis only (NON-BINDING): new-session startup cleanup walks the shared project temp and treats stale output-file mtime as dead, so a long-running sibling Bash capture under `tasks/<task-id>.output` is purged while the process is still live. Do not claim a root cause in Claude Code source you have not seen.

NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross / escapement pallet-fork / locksmith pin-tumbler / funeral-bell. Product name stays Spindle. Do not rename to Sweep / Ways / Chip / Purge / Knell / Tumbler / Escapement / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew / Hasp / Shear / Quire.
