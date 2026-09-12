# Ashpan fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93780 issue facts: `delete_session` (MCP or UI) removes a spawned/child task session from the app session index, but the underlying transcript `.jsonl` named by the mapped CLI UUID stays on disk fully intact and readable. Score ashpan or admit swept.

Idle word: **swept**. Path word: **orphan-jsonl**. Seeded loss: **ashpanned**. Product: **ashpan**. HOLD: **swept**. ALARM: **ashpanned** / **ashpan** / **orphan-jsonl** / **spawned-child** / **index-gone** / **cli-uuid-split** / **file-lingers** / **list-blank**. Primary: [anthropics/claude-code#93780](https://github.com/anthropics/claude-code/issues/93780).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `swept.json` | swept | Idle grate. HOLD: transcript gone with the index. |
| `hold.json` | hold | HOLD alias for idle swept. |
| `ashpanned.json` | ashpanned | Seeded #93780 path. ALARM: index cleared; orphan jsonl remains. |
| `ashpan.json` | ashpan | Product score for leftover ash under the grate. |
| `orphan-jsonl.json` | orphan-jsonl | Path: leftover CLI-uuid file after index delete. |
| `spawned-child.json` | spawned-child | spawn_task / scheduled-task-launched child, not top-level. |
| `index-gone.json` | index-gone | LocalSessions.delete completed; get_session not found. |
| `cli-uuid-split.json` | cli-uuid-split | Internal `local_<uuid>` vs CLI uuid mapping. |
| `file-lingers.json` | file-lingers | `…/98d5ed86-….jsonl` still exists at ~2.9MB, parseable. |
| `list-blank.json` | list-blank | list_sessions and search_session_transcripts show no trace. |
| `cousins.json` | cousins | Cite-only #81843 #82788 #71773 #79293. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `walk.json` | walk | Published idle swept → ashpanned walk. |

## Backups (cite only — do NOT auto-pick or build)

#93778 #93777 #93754 #93751 #93750 #93744 #93733 #93782 #93779 #93766 #93764

Drop any file onto `projects/ashpan/index.html`. Buttons load the seeded path. The living page admits **swept** / idle grate / #93780.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
