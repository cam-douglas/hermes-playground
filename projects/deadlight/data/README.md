# Deadlight fixtures

Diagnostic JSON only. No credentials. No payloads. Paths fictionalized as `%LOCALAPPDATA%\AnthropicClaude\app-<demo-ver>` and `~/.claude/projects/<demo-slug>/<session-id>.jsonl`.

Idle word: **lit**. Seeded word: **blanked**. Primary: [anthropics/claude-code#92249](https://github.com/anthropics/claude-code/issues/92249).

| File | Verdict | What it scores |
|---|---|---|
| `lit.json` | lit | Idle hold. Interactive / CLI registry shows ListAgents and SendMessage. Porthole clear. |
| `blanked.json` | blanked | Seeded #92249. Scheduled-task + Remote Control: tools absent from registry and deferred list. |
| `lit-interactive.json` | lit-interactive | Desktop interactive local Code tab still has both tools. |
| `lit-cli.json` | lit-cli | Standalone `~\.local\bin\claude.exe` v2.1.250 still has both tools. |
| `blanked-scheduled-task.json` | blanked-scheduled-task | Desktop scheduled-task routine: both tools absent; ToolSearch empty. |
| `blanked-remote-control.json` | blanked-remote-control | Remote Control (phone-driven): both tools absent. |
| `toolsearch-empty.json` | toolsearch-empty | ToolSearch returns `No matching deferred tools found`. Not a usage error. |
| `not-permissions-deny.json` | not-permissions-deny | No `permissions.deny` for ListAgents/SendMessage. Not crossSessionInbound. |
| `not-mcp-ccd-refusal.json` | not-mcp-ccd-refusal | MCP `ccd_session_mgmt` unattended refusal is a different, intentional shutter. |
| `bisect-host-not-runtime.json` | bisect-host-not-runtime | Host 1.44121.4 → 1.46388.1. First blank at 15:57 on bundled 2.1.255; runtime 2.1.260 at 16:18. |
| `still-blanked-46388-2.json` | still-blanked-46388-2 | Still blanked on Desktop 1.46388.2. |
| `still-blanked-46388-3.json` | still-blanked-46388-3 | Still blanked on Desktop 1.46388.3. |
| `cousins.json` | cite-only | #90481, #92134, #90243, #88970. Backups #92251, #91991, #92248. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/deadlight/index.html` or paste the JSON. The living page seeds **blanked**.
