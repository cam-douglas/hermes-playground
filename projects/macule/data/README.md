# Macule fixtures

Diagnostic JSON only. No credentials. No payloads. show_widget args, -32602 validation error, title omit/include, duplicate cards, schema required list only.

Idle word: **single**. Seeded word: **maculed**. Primary: [anthropics/claude-code#92294](https://github.com/anthropics/claude-code/issues/92294).

| File | Verdict | What it scores |
|---|---|---|
| `single.json` | single | Idle hold. One card; validation failure never printed. |
| `maculed.json` | maculed | Seeded #92294. Failed call printed a ghost card; same-title retry printed a second; two cards remain. |
| `ghosted.json` | ghosted | Failed validation still rendered a widget card. |
| `validated.json` | validated | Retry with title included succeeded. |
| `mismatched.json` | mismatched | Schema lists title optional; backend requires title. |
| `retried.json` | retried | Same-title retry after the failed pull. |
| `persisted.json` | persisted | Ghost card remains alongside the success card. |
| `cleared.json` | cleared | Expected: validation failure never renders UI. |
| `schema.json` | schema | Declared required list is `["loading_messages"]` only. |
| `backend.json` | backend | Backend throws MCP `-32602` when title is missing. |
| `cousins.json` | cite-only | #53030 (transient HTTP 400 disappear). #60052 (deferred MCP first-call / ToolSearch). Cite only. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/macule/index.html` or paste the JSON. The living page seeds **maculed**.
