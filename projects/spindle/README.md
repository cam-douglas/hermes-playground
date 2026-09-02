# Spindle

A **machine-shop spindle / shared-ways chip-sweep atelier** desk — headstock, shared ways, chip-sweep bar, chip fence, sibling bay, swarf pile, chip ledger with blank rows; cutting-oil and brass on a dark shop-floor ground; hairline way graduations; Cardo + Hind + Cousine — for a real Claude Code defect: **new-session startup cleanup deletes live sibling Bash task outputs under the shared project temp root because liveness is judged by output-file mtime, not process or lock. Silent mid-execution loss. CC 2.1.211 Windows.**

Primary:

- [anthropics/claude-code#91402](https://github.com/anthropics/claude-code/issues/91402) (OPEN, bug, platform:windows, area:core, area:bash, filed 2026-09-02T05:44:45Z, updated 2026-09-02T05:45:55Z, 0 comments). Title: [BUG] Startup cleanup deletes live sibling sessions' Bash task output under the shared project temp root. Reporter Row-Nation.

a spindle that sweeps a live sibling is not a hold. Score the purge or admit **swept**.

Idle word: **fenced**. Seeded state: **swept** / #91402 — new-session startup cleanup deletes live sibling Bash background-task captures (`tasks/<task-id>.output`) under shared project temp `%LOCALAPPDATA%\Temp\claude\<project-slug>\<session-id>\` because liveness is judged by output-file mtime not process/lock. Silent; parent sees empty or truncated capture. Never idle as tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed.

A **spindle** is the machine-shop arbor whose **chip-sweep** should stay **fenced** off live sibling ways. Instead a new session's startup cleanup walks the shared project temp and treats stale output-file **mtime** as dead, so a still-running sibling Bash capture under `tasks/<task-id>.output` is **swept** mid-execution.

- **swept** = #91402: new-session startup cleanup deletes live sibling Bash task output; mtime false-liveness; silent mid-execution loss
- **sibling-live** = session A's still-running `tasks/<task-id>.output` deleted by session B startup cleanup
- **mtime-false-liveness** = liveness judged by output file mtime rather than process or lock
- **startup-cleanup** = session B startup cleanup deletes session A's still-running Bash background-task captures
- **shared-temp-root** = multi-session plus background subagents share project temp `%LOCALAPPDATA%\Temp\claude\<project-slug>\<session-id>\`
- **output-truncated** = parent session reads an empty or truncated `.output` file; capture lost mid-execution
- **silent-deletion** = none; the deletion is silent; parent sees empty or truncated capture
- **multi-session** = several interactive sessions plus background subagents share one project temp root
- **has-clear-repro** = Row-Nation filed #91402; 2.1.211 Windows; long `run_in_background` in A then start B same project; first seen 1 Sep 2026; recurring
- **hold** = cleanup never touches alive sibling dirs; liveness is process/lock; process-gone or lock-stale required before delete; the spindle is fenced
- **fenced** = HOLD: cleanup never touches alive sibling dirs; liveness is process/lock; process-gone or lock-stale required before delete

Verdicts: fenced, swept, sibling-live, mtime-false-liveness, startup-cleanup, shared-temp-root, output-truncated, silent-deletion, multi-session, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the spindle is fenced or swept.

Hypothesis only (NON-BINDING): new-session startup cleanup walks the shared project temp and treats stale output-file mtime as dead, so a long-running sibling Bash capture under `tasks/<task-id>.output` is purged while the process is still live. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **NEW-SESSION STARTUP CLEANUP DELETES LIVE SIBLING BASH TASK OUTPUTS (mtime false-liveness).**

NOT **Knell** ([#91298](https://github.com/anthropics/claude-code/issues/91298)) — Agent tool Spawned successfully mute child death — cite as stay-off.
NOT **Tumbler** ([#74256](https://github.com/anthropics/claude-code/issues/74256)) — PermissionRequest ExitPlanMode allow discarded / chooser blocks.
NOT **Escapement** ([#91400](https://github.com/anthropics/claude-code/issues/91400)) — scheduled mid-run stall — cite as stay-off.
NOT **Clew**.
NOT **Hasp**.
NOT **Quire** ([#91284](https://github.com/anthropics/claude-code/issues/91284)) — silent session-transcript writer death / data-loss — backup, not primary.
NOT **Shear** ([#79879](https://github.com/anthropics/claude-code/issues/79879)) — Bash timeout silently hard-kills (exit 143) — backup/cousin, cite-only.
NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross / escapement pallet-fork / locksmith pin-tumbler / funeral-bell.

Cousins are cite-only on a cousin strip; primary stays #91402.

Product name stays **Spindle**. Do not rename to Sweep, Ways, Chip, Purge, Knell, Tumbler, Escapement, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Carillon, Sluice, Alidade, Cockade, Lye, Clew, Hasp, Shear, Quire.

Different UI: machine-shop spindle / shared-ways chip-sweep / headstock + chip-sweep bar + chip fence + sibling bay / chip ledger with blank rows / swarf pile / cutting-oil and brass / dark shop floor / hairline way graduations. Cardo + Hind + Cousine. NOT Bitter/Karla/Inconsolata (Knell). NOT Young Serif/Figtree/Fragment Mono (Tumbler). NOT Instrument Serif/Manrope/Azeret Mono (Escapement). NOT Bodoni/Jost/Space Mono (Geneva). NOT Spectral/Sora/IBM Plex Mono (Scotch). NOT Cormorant/Outfit/Fira (Fibula). NOT Libre Baskerville/Work Sans/JetBrains (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair/Source Serif 4 (Carillon). NOT Cinzel (Postern). NOT Libre Caslon (Alidade). Stay OFF Knell visual language.

Different verbs: score the purge, pin idle fenced, pin seeded swept, admit swept, load fixtures, reset to fenced. Not "Score the mute/keyway/pallet/cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race".

Different idle: **fenced**.

## Live catalog path

`/spindle/` is this static machine-shop spindle / chip-sweep atelier desk. Path `https://hermes-playground-green.vercel.app/spindle/` and subdomain `https://spindle.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `15:50 / hermes catalog #116 / #91402`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **fenced** — cleanup never touches alive sibling dirs; liveness is process/lock; process-gone or lock-stale required before delete.
2. Seed **swept** → #91402: new-session startup cleanup deletes live sibling Bash task output; mtime false-liveness; silent mid-execution loss.
3. Atelier UI: headstock / shared ways / chip-sweep bar / chip fence / sibling bay / chip ledger / swarf pile. Fenced = sweep parked behind the fence, sibling capture intact. Swept = sweep crossed the fence, sibling bay bare.
4. Cousin cite strip labeled cousin-not-primary: [#79879](https://github.com/anthropics/claude-code/issues/79879) / [openai/codex#35433](https://github.com/openai/codex/issues/35433). Cite only. Primary stays #91402.
5. **Score the purge** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/spindle/index.html` in a browser, or serve the repo root and visit `/spindle/` (Vercel rewrite → `/projects/spindle`). No build step. Optional hook:

```bash
node projects/spindle/hook/spindle.mjs projects/spindle/data/91402.json
node projects/spindle/hook/spindle.mjs projects/spindle/data/fenced.json
node --test projects/spindle/hook/spindle.test.mjs
```

Swept seed → swept/alarm. Fenced seed → fenced/hold.

`projects/spindle/hook/spindle.mjs` classifies a probe ticket JSON `{ startupCleanup, siblingLive, outputDeleted, mtimeLiveness, silentDeletion, siblingDirsUntouched }` and returns `{ verdict, chips[], reasons[], fenced, swept, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91402.json`, `data/swept.json`, `data/fenced.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts. Use startup cleanup, live sibling, `tasks/<task-id>.output`, mtime false-liveness, `%LOCALAPPDATA%\Temp\claude`, `run_in_background`, silent deletion, 2.1.211, Windows, Row-Nation, first seen 1 Sep 2026. Never invent counts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91402](https://github.com/anthropics/claude-code/issues/91402). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Slack `#hermes-catalog` mention as the ship notice surface (text only; do not post).
3. Claude Code Bash `run_in_background` / shared project temp / startup cleanup as the third native surface. Paste or drop a probe ticket JSON and score it.
4. Atelier UI (headstock / shared ways / chip-sweep bar / chip fence / sibling bay / chip ledger / swarf pile). Fenced = sweep parked and sibling capture intact, swept = startup cleanup crossed the fence.
5. Cousin-not-primary cite strip: #79879, openai/codex#35433.

## Sources

- [anthropics/claude-code#91402](https://github.com/anthropics/claude-code/issues/91402) OPEN — primary. Product stays Spindle.
- Multi-session use on one machine (several interactive Claude Code sessions plus background subagents) share one project temp root under `%LOCALAPPDATA%\Temp\claude\<project-slug>\<session-id>\`.
- A new session's startup cleanup deletes the Bash background-task output captures (`tasks/<task-id>.output`) of sibling sessions that are still running.
- Liveness appears to be judged by the output file's modification time rather than the session's process or lock.
- Result: monitors, background dispatches and parent sessions lose their task output mid-execution, silently.
- First seen 1 Sep 2026, recurring since.
- Error messages: none. The deletion is silent; the parent session reads an empty or truncated `.output` file.
- Repro: in project P, start session A and run a Bash command with `run_in_background` that lasts more than a few minutes; before it finishes, start session B in the same project; session B's startup cleanup runs; session A's `tasks/<task-id>.output` has been deleted or truncated while the command is still running. Observed pattern, timing-dependent; repeatable under heavy multi-session use.
- Expected: cleanup must not touch directories or files of other sessions that are alive. Liveness should be judged by the session process or lock state; a genuinely dead session should need evidence (process gone, lock stale beyond a fixed threshold) before deletion.
- Environment: Claude Code 2.1.211, Windows, Windows Terminal, Anthropic API.
- Workarounds adopted: judge long-running dispatch outcomes from a durable project log rather than the harness capture; write background outputs to durable project paths; avoid starting new sessions mid-dispatch.
- Root cause is harness-side; no local hooks or settings trigger or control this. Session and task ids with timestamps available on request.
- Cousins (cite, not primaries):
  - [#79879](https://github.com/anthropics/claude-code/issues/79879) — Bash timeout silently hard-kills (exit 143) commands that fail an undocumented auto-background eligibility check (Shear backup/cousin, cite-only).
  - [openai/codex#35433](https://github.com/openai/codex/issues/35433) — [Windows] Background shell child can exhaust system memory without visible lifecycle or resource safeguards (cite-only).
