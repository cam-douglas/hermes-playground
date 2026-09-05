# Alarum hook

Tiny night-watchtower / copper-bell classifier notes for the Claude Code defect where a background-task kill/completion notification wakes an ended session and re-reads full context, costing a full model turn with no user input. Filed ~2026-09-05. Labels: enhancement, platform:windows, area:cost, area:core.

Idle word is **stilled**. Seeded state is rung / #92283 (post-goodbye kill notification woke ended session; full context re-read; reply spent; ~10% usage). Never idle as barred / dropped / pared / raw / cast / fouled / flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / careted / ringing / home / indexed / jumped.

This stub is documentation only. The living page at `projects/alarum/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. Diagnostic shapes only (session close, background Bash, OS low-memory kill, notification wake, full-context reread, usage tax). No payloads.

Preferred fix / detection (document only — do not treat this stub as a live hook):

1. Ended session (last turn conversational close, no pending tool state) suppresses/defers background-task wake turns until next real user input.
2. Do not re-read the entire transcript for a turn that only reports an unrelated background process finishing/dying.
3. Surface estimated cost of a notification-driven turn before it runs (related to #92062 — cite only).

Detection: if the last turn was a conversational goodbye, no tool state is pending, a background Bash (`run_in_background: true`) is later killed for low memory, and the kill notification still re-invokes the model on the full all-day transcript, the alarum has already rung after the watch stood down.

Given a probe-shaped payload `{ sessionEnded, goodbye, pendingToolState, event, notification, policy, wakeTurn, fullReread, replySpent, userPresent, usageDrop, persistHold, log }`:

- **STILLED** if the ended session deferred the notice and no model turn ran
- **RUNG** if a kill/completion notification woke the ended session and spent a full turn (#92283)
- **DEFERRED** if the notification is queued for the next real user input
- **SPENT** if usage burned with no user present
- **COLDWAKE** if the wake came after goodbye with no pending tool state
- **FULLREREAD** if the entire transcript reloaded for an informational notice
- **LOWMEMKILL** if the OS killed background Bash for memory and the notification still fired
- **GOODBYE** if conversational close already happened
- **ABSENT** if nobody is present to read the reply
- **TAXED** if ~10% usage drop was measured

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the tower is stilled or already rung.

Primary: [anthropics/claude-code#92283](https://github.com/anthropics/claude-code/issues/92283). Cousin (cite only, not primary): [#92062](https://github.com/anthropics/claude-code/issues/92062) waiting-on-background no-op probes while still in session — different paradigm.

Hypothesis only (NON-BINDING): the interactive desk should make "post-goodbye informational kill notice ≠ a needed call to arms" visceral via a copper bell that still rings after the watch has stood down. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Portcullis castle grate · Skive leather tannery · Lagan salvage-buoy · Snub dockside snubbing post · Ward locksmith iron/brass · Deadlight night-cabin shutter · Oubliette stone-pit · Tocsin fire-bell · Knell passing-bell · Annunciator panel · Reveille morning call. Product name stays Alarum.
