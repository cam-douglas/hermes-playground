# Homonym fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92787 issue facts: Desktop local sessions mount claude.ai connectors under connection UUIDs so documented `mcp__claude_ai_<name>__*` ask/deny rules silently miss. Score orphaned or admit keyed.

Idle word: **matched**. Seeded word: **orphaned**. HOLD: **matched** / **keyed**. ALARM: **orphaned** / **cli-named-mount** / **desktop-uuid-mount** / **ask-rule-silent-miss** / **no-startup-warning** / **uuid-undocumented** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92787](https://github.com/anthropics/claude-code/issues/92787).

Fixtures record the published incident (CLI named mount vs Desktop UUID mount; Gmail / Calendar / Asana pairs; transcript counts 522–1602 vs 0; no startup warning; UUID undocumented). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `matched.json` | matched | Idle desk. HOLD: named ledger stays matched across entrypoints. |
| `orphaned.json` | orphaned | Seeded #92787 path. ALARM: Desktop orphans the rule under a UUID guidon. |
| `keyed.json` | keyed | Admit hold. Same server name in every entrypoint, or named rules resolve as an alias. |
| `92787.json` | orphaned | Primary fixture alias for #92787. |
| `cli-named-mount.json` | cli-named-mount | CLI mounts as `claude_ai_<display name>`; uuid-named 0. |
| `desktop-uuid-mount.json` | desktop-uuid-mount | Desktop mounts under connection UUID; claude_ai-named 0. |
| `ask-rule-silent-miss.json` | ask-rule-silent-miss | Named ask/deny silently ineffective; no prompt in Desktop. |
| `no-startup-warning.json` | no-startup-warning | Rule looks valid; match-no-tool check skipped for `_` / `*`. |
| `uuid-undocumented.json` | uuid-undocumented | Docs document only the named form; UUID not shown in /mcp. |
| `cousins.json` | cousins | Cite-only #77598 CLOSED stale, #82532 OPEN. Primary stays #92787. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the desk. |

Drop any file onto `projects/homonym/index.html` or paste the JSON. The living page starts **orphaned** / seeded desk / #92787.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
