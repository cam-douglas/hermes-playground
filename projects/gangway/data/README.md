# Gangway fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92662 issue facts: after Chrome relaunches, the session client never re-dials the new native-host socket while the host is healthy, and the restored MCP tab group cannot be re-adopted. Score severed or admit remoored.

Idle word: **severed**. Seeded word: **remoored**. HOLD: **remoored**. ALARM: **severed** / **never-redial** / **healthy-socket-ignored** / **reconnect-noop** / **tab-group-orphan** / **session-mapping-lost** / **createIfEmpty-new-tab-only** / **chrome-relaunch-not-sleep** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92662](https://github.com/anthropics/claude-code/issues/92662).

Fixtures record the published incident (Chrome relaunch, never-redial, healthy socket, reconnect-noop, restored tab-group orphan, memory-only session map, createIfEmpty new-tab-only). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `severed.json` | severed | Idle gangway. ALARM: brow stays up. |
| `remoored.json` | remoored | Seeded hold. Client re-dials; group re-adopted. |
| `92662.json` | severed | Primary fixture alias for #92662. |
| `never-redial.json` | never-redial | 100 attempts; subsequent calls do not re-dial. |
| `healthy-socket-ignored.json` | healthy-socket-ignored | Host answers `execute_tool` on the socket. |
| `reconnect-noop.json` | reconnect-noop | Reconnect extension / Select browser do not recover. |
| `tab-group-orphan.json` | tab-group-orphan | Restored Claude group `isMcp: true`; rejected. |
| `session-mapping-lost.json` | session-mapping-lost | Memory-only map lost on Chrome restart. |
| `createIfEmpty-new-tab-only.json` | createIfEmpty-new-tab-only | Only recovery opens a NEW tab. |
| `chrome-relaunch-not-sleep.json` | chrome-relaunch-not-sleep | Trigger is Chrome relaunch, not sleep/wake. |
| `cousins.json` | cousins | Cite-only #88558 / #86793 / #61117 / #73903 / #87774 / #89335. Primary stays #92662. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the gangway brow. |

Drop any file onto `projects/gangway/index.html` or paste the JSON. The living page admits **severed** / never-redial + healthy-socket / #92662.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
