# Lemure fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94410 issue facts: Desktop ScheduledTasks still dispatches two deleted/legacy tasks once per minute (`ohayo-morning-report`, `mercari-daily-sales-check`); ENOENT at legacy `~/Claude/Scheduled/.../SKILL.md`; absent from Routines UI, MCP list, and on-disk registry; delete not found; restart does not clear. Score lemure or admit quiet.

Idle word: **quiet**. Path word: **orphan-tick**. Seeded loss: **lemure**. Product: **lemure**. HOLD: **quiet**. ALARM: **lemure** / **orphan-tick** / **minute-tick**. Primary: [anthropics/claude-code#94410](https://github.com/anthropics/claude-code/issues/94410).

Fixtures record the published incident only. Orphan-tick rows are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `quiet.json` | quiet | Idle shrine. HOLD: no orphan minute-ticks. |
| `hold.json` | hold | HOLD alias for idle quiet. |
| `lemure.json` | lemure | Seeded #94410 path and product. ALARM: leftover ids walked. |
| `94410.json` | lemure | Same seeded path under the issue number. |
| `orphan-tick.json` | orphan-tick | Path: leftover dispatcher coal. |
| `rostered.json` | rostered | HOLD alias: every ticking id is on the tablet. |
| `enrolled.json` | enrolled | HOLD alias: names written in the rite. |
| `lararium.json` | lararium | HOLD alias: household shrine holds. |
| `stilled.json` | stilled | HOLD alias: salt-bean rite completed. |
| `listed.json` | listed | HOLD alias: UI + MCP name every ticking id. |
| `removable.json` | removable | HOLD alias: delete accepts the id. |
| `legacy-path.json` | legacy-path | ~/Claude/Scheduled/ does not exist. |
| `enoent-skip.json` | enoent-skip | File not found / not symlink-free. |
| `mcp-absent.json` | mcp-absent | MCP list omits both ghosts. |
| `ui-absent.json` | ui-absent | Routines search empty. |
| `registry-miss.json` | registry-miss | scheduled-tasks.json 0 matches. |
| `restart-survives.json` | restart-survives | Restart rekindles the leftover source. |
| `minute-tick.json` | minute-tick | Once per minute; ~1440 lines/day. |
| `landing.json` | landing | Lararium / salt-bean / Lemuria-rite. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Working roster / ghost dispatcher. |
| `walk.json` | walk | Published idle quiet → orphan-tick → lemure. |
| `closed.json` | closed | #94410 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#93015 — stamp without a session birth. DIFFERENT trigger.

#92920 — renderer ack without a session. DIFFERENT surface.

#92249 — blanked tools on a scheduled session. DIFFERENT (tool registry).

#91527 — scheduler skip / success report with no session. DIFFERENT (stamp family).

#94410 is specifically: leftover dispatcher ticks of deleted ids at a vanished legacy path; unlisted; undeletable; restart-proof.

## Backups (cite only — do NOT auto-pick or build)

#93924 #93770 #93777 #94151

Drop any file onto `projects/lemure/index.html`. Buttons load the seeded path. The quiet page admits **quiet** / idle shrine / #94410.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
