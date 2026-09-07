# Snatch fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92583 issue facts: Bash tool commands auto-backgrounded on timeout are never cleaned up when the session ends, so Windows orphans leak OS handles / kernel pool for days. Score adrift or admit reaped.

Idle word: **adrift**. Seeded word: **reaped**. HOLD: **reaped**. ALARM: **adrift** / **unreaped-on-session-end** / **timeout-to-background** / **immortal-background-commands** / **handle-pool-exhaustion** / **nine-of-nine-orphans** / **dead-parent-git-bash** / **wall-clock-not-handle-ceiling** / **find-orphans-11-days** / **handle-pool-20gb** / **mycroft-9-of-9** / **immortal-tail-http** / **wall-clock-ceiling** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92583](https://github.com/anthropics/claude-code/issues/92583).

Fixtures record the published incident (timeout→background, session-end orphans, six `find.exe` up to 11 days, 61,252,162 handles, ~20.8 GB paged pool, Mycroft 9/9 including immortal `tail -f` / `http.server`). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `adrift.json` | adrift | Idle snatch-block. ALARM: line adrift; auto-backgrounded Bash children unreaped. |
| `reaped.json` | reaped | Seeded hold. Session-end tracks and reaps those PIDs. |
| `92583.json` | adrift | Primary fixture alias for #92583. |
| `unreaped-on-session-end.json` | unreaped-on-session-end | Window closed / session finished leaves Windows children orphaned. |
| `timeout-to-background.json` | timeout-to-background | Documented timeout promote; 120s Win32_Product \| tail mid-investigation. |
| `immortal-background-commands.json` | immortal-background-commands | `tail -f`, `grep --line-buffered`, `python -m http.server`. |
| `handle-pool-exhaustion.json` | handle-pool-exhaustion | 61,252,162 handles; ~10–11M each; 98% memory. |
| `nine-of-nine-orphans.json` | nine-of-nine-orphans | Mycroft 9 of 9, ages 22.1h–54.0h. |
| `dead-parent-git-bash.json` | dead-parent-git-bash | Parent shells already exited; snapshot-bash descendants. |
| `wall-clock-not-handle-ceiling.json` | wall-clock-not-handle-ceiling | 129–165 handles each (1,267 total); handle-count ceiling would miss. |
| `find-orphans-11-days.json` | find-orphans-11-days | Six `find.exe` since Aug 27–31; reparse-point cycle. |
| `handle-pool-20gb.json` | handle-pool-20gb | Kernel Paged Pool ~20.8 GB; kill dropped handles to ~247,000. |
| `mycroft-9-of-9.json` | mycroft-9-of-9 | Mycroft / tonydzi confirmation on 2026-09-07. |
| `immortal-tail-http.json` | immortal-tail-http | `nohup python -m http.server 41888` + `tail -f` age-matched pairs. |
| `wall-clock-ceiling.json` | wall-clock-ceiling | Suggested hard ceiling; wall-clock catches the immortal class. |
| `cousins.json` | cousins | Cite-only #91642 / #92593 / #92586. Primary stays #92583. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the snatch-block card. |

Drop any file onto `projects/snatch/index.html` or paste the JSON. The living page admits **adrift** / unreaped-on-session-end + timeout-to-background / #92583.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
