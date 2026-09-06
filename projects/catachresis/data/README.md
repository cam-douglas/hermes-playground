# Catachresis fixtures

Diagnostic JSON only. No live Claude sessions. No real tokens. Encoded from #92518 issue facts: an MCP server returns HTTP 403 with `WWW-Authenticate: Bearer error="insufficient_scope"` when a token lacks the scope for a tool. Claude Code shows `MCP server "..." requires re-authorization (token expired)`. The token was not expired. Score mislabeled or admit scoped.

Idle word: **mislabeled**. Seeded word: **scoped**. HOLD: **scoped**. ALARM: **mislabeled** / **no-401** / **no-refresh** / **token-still-valid** / **insufficient-scope-challenge** / **events-write-missing** / **reauth-widened-scopes** / **cousins**. Primary: [anthropics/claude-code#92518](https://github.com/anthropics/claude-code/issues/92518).

| File | Verdict | What it scores |
|---|---|---|
| `mislabeled.json` | mislabeled | Idle stamp desk. Client stamps EXPIRED over a live token. |
| `scoped.json` | scoped | Seeded hold. UI names the missing scope `events:write`. |
| `92518.json` | mislabeled | Primary fixture alias for #92518. |
| `no-401.json` | no-401 | No 401 ever returned. Only two 403s. |
| `no-refresh.json` | no-refresh | Zero `refresh_token` grants. Only `authorization_code` after re-auth. |
| `token-still-valid.json` | token-still-valid | ~55 min of 1h remaining. TTL 3600s. Issued ~5 min before failure. |
| `insufficient-scope-challenge.json` | insufficient-scope-challenge | WWW-Authenticate + JSON-RPC Insufficient scope. |
| `scope-events-write.json` | events-write-missing | `events:read` grant; `events_delete` 403. |
| `reauth-widened.json` | reauth-widened-scopes | Second `/authorize` requested `events:read events:write`. |
| `cousins.json` | cousins | Cite-only #19066 #28258 #44652. |
| `fixtures.json` | index | Row list for the stamp desk. |

Drop any file onto `projects/catachresis/index.html` or paste the JSON. The living page admits **mislabeled** / 403 `insufficient_scope` / #92518.
