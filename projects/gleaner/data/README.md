# Gleaner fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93794 issue facts: background `&` jobs in a Bash tool call are orphaned, not reaped — 39 `yes` processes pegged ~7 cores for 8h42m. Score gleaner or admit gleaned.

Idle word: **gleaned**. Path word: **unreaped-ampersand**. Seeded loss: **orphaned**. Product: **gleaner**. HOLD: **gleaned**. ALARM: **orphaned** / **gleaner** / **unreaped-ampersand** / **ppid-one** / **process-group** / **nice-five** / **task-output-fd** / **sigkill-escalate** / **eight-hour-spin** / **yes-wall**. Primary: [anthropics/claude-code#93794](https://github.com/anthropics/claude-code/issues/93794).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `gleaned.json` | gleaned | Idle field. HOLD: process-group reaped when Bash call ends; no orphan PPID-1 spinners. |
| `hold.json` | hold | HOLD alias for idle gleaned. |
| `orphaned.json` | orphaned | Seeded #93794 path. ALARM: unreaped `&` jobs reparented to PID 1. |
| `gleaner.json` | gleaner | Product score for the leftover-harvest field. |
| `unreaped-ampersand.json` | unreaped-ampersand | Path: Bash call ended; `&` jobs left in the stubble. |
| `ppid-one.json` | ppid-one | Every survivor PPID 1. |
| `process-group.json` | process-group | Two leaked groups: pgid 40734 / 42141. |
| `nice-five.json` | nice-five | Survivors ran at nice 5. |
| `task-output-fd.json` | task-output-fd | fd2 at the Bash tool output file. |
| `sigkill-escalate.json` | sigkill-escalate | SIGTERM failed; needed kill -9. |
| `eight-hour-spin.json` | eight-hour-spin | 8h42m elapsed leak. |
| `yes-wall.json` | yes-wall | Activity Monitor wall of yes×39. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #92583 #77593. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Wheat/stubble / sickle basket / yes×39 / PPID-1 fixtures. |
| `walk.json` | walk | Published idle gleaned → unreaped-ampersand → orphaned → gleaner. |

## Backups (cite only — do NOT auto-pick or build)

#93788 #93801 #93798 #93786 #93778 #93800 #93795 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782

Drop any file onto `projects/gleaner/index.html`. Buttons load the seeded path. The living page admits **gleaned** / idle field / #93794.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
