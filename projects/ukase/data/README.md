# Ukase fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92833 issue facts: locally-run Cowork **scheduled** task sessions deny `mcp__workspace__bash` and `mcp__workspace__web_fetch` at call time by a permission **rule** (`decision_reason_type: rule`, `non_execution_kind: permission-rule`) since the 2026-09-02 Desktop update (bundled Claude Code 2.1.258). Tools stay listed in `init.tools`. Interactive Cowork tasks on the same machine still clear. Score ukased or admit cleared.

Idle word: **cleared**. Seeded word: **ukased**. HOLD: **cleared**. ALARM: **ukased** / **scheduled-deny** / **interactive-clear** / **tools-listed-but-denied** / **echo-ok-denied** / **web_fetch-denied** / **before-after-227** / **bypass-and-auto**. Primary: [anthropics/claude-code#92833](https://github.com/anthropics/claude-code/issues/92833).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic.

| File | Verdict | What it scores |
|---|---|---|
| `cleared.json` | cleared | Idle chancery. HOLD: scheduled workspace MCP callable. |
| `ukased.json` | ukased | Seeded #92833 path. ALARM: permission-rule deny. |
| `92833.json` | ukased | Primary fixture alias for #92833. |
| `scheduled-deny.json` | scheduled-deny | Scheduled sessions 100% denied after the update. |
| `interactive-clear.json` | interactive-clear | Control: ordinary interactive task still clears `echo ok`. |
| `tools-listed.json` | tools-listed-but-denied | Tools remain in `init.tools`; call-time deny, not omit. |
| `echo-ok.json` | echo-ok-denied | Trivial `echo ok` denied; command content irrelevant. |
| `web-fetch.json` | web_fetch-denied | Whole workspace MCP server blocked. |
| `before-after.json` | before-after-227 | Same task: 227 bash / 0 denied before; 1/1 after. |
| `bypass-and-auto.json` | bypass-and-auto | Denied in bypassPermissions and auto. |
| `fixtures.json` | index | Row list for the chancery dockets. |

Drop any file onto `projects/ukase/index.html`. Buttons load the seeded path. The living page admits **cleared** / idle open edict / #92833.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
