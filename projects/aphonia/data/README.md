# Aphonia fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92409 issue facts: on Claude Code 2.1.258 in a Windows 11 Claude desktop Code-tab session (reports "running within the Claude Agent SDK"), `ListAgents` lists 21 peers and instructs the model to send with `SendMessage({to: name, message: ...})`, but `SendMessage` is not in that session's toolset. `ToolSearch` with `select:SendMessage` returns "No matching deferred tools found". A sibling session on the same machine and account ("Orchestration", cwd `D:\dev\GitHub`) did have `SendMessage` and used it successfully to message the same peer. Score the voice or admit the session already muted.

Idle word: **mute**. Seeded word: **rostered**. Contrast: **voiced** / **tool-present**. Score also **sibling-has-voice** / **deferred-search-miss** / **mcp-not-substitute**. Primary: [anthropics/claude-code#92409](https://github.com/anthropics/claude-code/issues/92409). Seed primary as rostered / mute tray / ListAgents present / SendMessage absent.

| File | Verdict | What it scores |
|---|---|---|
| `mute.json` | mute | Idle voice-clinic fence. The speaking reed was never laid on this session's tray. |
| `rostered.json` | rostered | Seeded #92409. ListAgents advertised 21 peers and SendMessage instructions while the tool is missing. |
| `92409.json` | rostered | Primary fixture alias for #92409. |
| `repro.json` | rostered | Published repro: Code tab, `ListAgents then SendMessage aria-80 hello`; ListAgents succeeds; SendMessage absent. |
| `list-agents.json` | rostered | ListAgents roster sample: 21 peers including `aria-80 [056652] · interactive · idle`. |
| `toolsearch-miss.json` | deferred-search-miss | ToolSearch `select:SendMessage` → "No matching deferred tools found". |
| `sibling-has-sendmessage.json` | sibling-has-voice | Sibling "Orchestration" (cwd `D:\dev\GitHub`) had SendMessage and used it on the same peer. |
| `settings.json` | mute | `permissions.defaultMode: dontAsk`, `crossSessionInbound: accept`; no deny; no project settings gate. |
| `voiced.json` | voiced | Contrast hold. SendMessage available whenever ListAgents reports peers. |
| `tool-present.json` | tool-present | Contrast hold. SendMessage is in the session toolset (and ToolSearch can find it). |
| `sibling-has-voice.json` | sibling-has-voice | Sibling booth already sings; this booth does not. |
| `deferred-search-miss.json` | deferred-search-miss | Deferred catalog miss for SendMessage. |
| `mcp-not-substitute.json` | mcp-not-substitute | Desktop `send_message` MCP (session_mgmt) needs a CCD session id; cannot resolve `aria-80`. |
| `cousins.json` | stay-off | Cite-only cousins #92249 #92134 #92016 #92289 #90481 #81185 #79931. |
| `fixtures.json` | index | Row list for the voice-clinic / laryngoscope lab. |

Drop any file onto `projects/aphonia/index.html` or paste the JSON. The living page seeds **rostered** / ListAgents present / SendMessage absent / sibling already voiced.
