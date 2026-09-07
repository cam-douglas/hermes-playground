# Waybill fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92624 issue facts: named agent spawn resolves the team file under a foreign session id (0/21 match). Score misrouted or admit addressed.

Idle word: **misrouted**. Seeded word: **addressed**. HOLD: **addressed**. ALARM: **misrouted** / **foreign-session-id** / **zero-of-twenty-one** / **regression-2-1-247** / **team-dir-never-created** / **not-permissions** / **not-only-concurrency** / **name-param-path** / **unnamed-spawn-ok** / **mailbox-addressing-lost** / **second-string-cite-only** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92624](https://github.com/anthropics/claude-code/issues/92624).

Fixtures record the published incident (named spawn `name:` looks up a foreign session id, 0/21 match, regression 2.1.247+, team dir never created, permissions ruled out, unnamed spawn 73/73). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `misrouted.json` | misrouted | Idle waybill. ALARM: stamp on a foreign berth. |
| `addressed.json` | addressed | Seeded hold. Named spawn stamps THIS session id. |
| `92624.json` | misrouted | Primary fixture alias for #92624. |
| `foreign-session-id.json` | foreign-session-id | 7470f9d6 vs live 1b331b27. |
| `zero-of-twenty-one.json` | zero-of-twenty-one | 0/21 match; 21/21 mismatches. |
| `regression-2-1-247.json` | regression-2-1-247 | ≤2.1.241 clean; ≥2.1.247 broken; live 2.1.263. |
| `team-dir-never-created.json` | team-dir-never-created | Failing id never gets a team dir (2 of 6). |
| `not-permissions.json` | not-permissions | `~/.claude/teams/` writable; error is not found. |
| `not-only-concurrency.json` | not-only-concurrency | 52% with 1 session; 77% with 2. |
| `name-param-path.json` | name-param-path | Only the `name:` mailbox path is broken. |
| `unnamed-spawn-ok.json` | unnamed-spawn-ok | Spawn without `name:` works 73/73. |
| `mailbox-addressing-lost.json` | mailbox-addressing-lost | `SendMessage({to:name})` unavailable. |
| `second-string-cite-only.json` | second-string-cite-only | #82627 unreadable string is cite-only. |
| `cousins.json` | cousins | Cite-only #82627 / #82493 / #83366 / #81852 / #85949. Primary stays #92624. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the waybill desk. |

Drop any file onto `projects/waybill/index.html` or paste the JSON. The living page admits **misrouted** / foreign-session-id + 0/21 / #92624.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
