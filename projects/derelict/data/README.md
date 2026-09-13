# Derelict fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93996 issue facts: session teardown does not kill Bash-tool children; tsc/vitest survive stop/crash/clear, reparent to PID 1, run unsupervised for hours. Score derelict or admit berthed.

Idle word: **berthed**. Path word: **session-kill-orphan**. Seeded loss: **derelict**. Product: **derelict**. HOLD: **berthed**. ALARM: **derelict** / **session-kill-orphan** / **ppid-one** / **tsc-orphan**. Primary: [anthropics/claude-code#93996](https://github.com/anthropics/claude-code/issues/93996).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `berthed.json` | berthed | Idle pier. HOLD: process-group shepherded; session death kills the Bash-tool tree. |
| `hold.json` | hold | HOLD alias for idle berthed. |
| `derelict.json` | derelict | Seeded #93996 path and product. ALARM: unsupervised hulk at PID 1. |
| `session-kill-orphan.json` | session-kill-orphan | Path: session death does not kill the Bash-tool process tree. |
| `moored.json` | moored | HOLD alias: hulk moored; process-group shepherded. |
| `reaped.json` | reaped | HOLD alias: Bash-tool tree reaped on session death. |
| `shepherded.json` | shepherded | HOLD alias: process-group shepherded through teardown. |
| `process-group.json` | process-group | HOLD alias: session death signals the Bash-tool process group. |
| `ppid-one.json` | ppid-one | In-flight Bash-tool child reparents to PID 1. |
| `tsc-orphan.json` | tsc-orphan | `tsc --noEmit` still steaming 5h32m / 472+ CPU-minutes. |
| `vitest-orphan.json` | vitest-orphan | `vitest run` in flight at session stop. |
| `swap-hot.json` | swap-hot | Earlier-day swap 23.2/24.5 GB. |
| `is-running-false.json` | is-running-false | Session list reports stopped while the orphan burns. |
| `teardown-signal.json` | teardown-signal | Session death does not signal the process group. |
| `landing.json` | landing | Fogbound pier landing / salt-plank deck. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #93794 #93889. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Hull rust / sea fog / bilge / lantern amber / tide teal / salt / iron / ink. |
| `walk.json` | walk | Published idle berthed → session-kill-orphan → derelict. |

## Cousins (cite only)

#93794 — Gleaner / unreaped `&` jobs inside a *live* Bash tool call. Do not conflate.

#93889 — Foundling / subagent finished; `run_in_background` Bash left with no owner. Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#93987 #93924 #93925 #93967 #93957 #93770 #93777

Drop any file onto `projects/derelict/index.html`. Buttons load the seeded path. The living page admits **berthed** / idle pier / #93996.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
