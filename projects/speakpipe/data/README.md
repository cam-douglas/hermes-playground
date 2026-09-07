# Speakpipe fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92646 issue facts: Claude Desktop corks the whole SendMessage tool because deck-to-ship hails are banned, so below-decks subagent continuation is corked too. Score corked or admit relayed.

Idle word: **corked**. Seeded word: **relayed**. HOLD: **relayed**. ALARM: **corked** / **dual-purpose-tool** / **overbroad-disallow** / **pretooluse-auto-deny** / **mcp-replacement-gap** / **footer-still-advertises** / **toolsearch-empty** / **listagents-dead-instruction** / **cli-flag-honoured** / **desktop-app-ban** / **timeline-zero-after-1.46388.4** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92646](https://github.com/anthropics/claude-code/issues/92646).

Fixtures record the published incident (`--disallowedTools SendMessage`, `desktop_ccd_permission_auto_denied` / `cli_native_send_message`, MCP replacement gap, footer still advertises, ToolSearch empty, ListAgents 29 peers, CLI flag honoured, Desktop 1.46388.4 timeline). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `corked.json` | corked | Idle speakpipe. ALARM: pipe corked; subagent continuation unreachable. |
| `relayed.json` | relayed | Seeded hold. Continuation hail can pass the speakpipe. |
| `92646.json` | corked | Primary fixture alias for #92646. |
| `dual-purpose-tool.json` | dual-purpose-tool | Cross-session AND continuation. |
| `overbroad-disallow.json` | overbroad-disallow | `--disallowedTools SendMessage` on the whole tool. |
| `pretooluse-auto-deny.json` | pretooluse-auto-deny | `desktop_ccd_permission_auto_denied` / `cli_native_send_message`. |
| `mcp-replacement-gap.json` | mcp-replacement-gap | `mcp__ccd_session_mgmt__send_message` does not cover continuation. |
| `footer-still-advertises.json` | footer-still-advertises | `use SendMessage with to:` still printed. |
| `toolsearch-empty.json` | toolsearch-empty | `No matching deferred tools found`. |
| `listagents-dead-instruction.json` | listagents-dead-instruction | ListAgents lists 29 peers; tool missing. |
| `cli-flag-honoured.json` | cli-flag-honoured | CLI honours the flag; version is not the variable. |
| `desktop-app-ban.json` | desktop-app-ban | Desktop 1.46388.4 applies the ban. |
| `timeline-zero-after-1.46388.4.json` | timeline-zero-after-1.46388.4 | Zero calls from 2026-09-06. |
| `cousins.json` | cousins | Cite-only #89543 / #92583 / #92624. Primary stays #92646. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the speakpipe card. |

Drop any file onto `projects/speakpipe/index.html` or paste the JSON. The living page admits **corked** / overbroad-disallow + footer-still-advertises / #92646.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
