# Deadletter fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #90049 issue facts: on Windows interactive CLI, after a worktree context transition, the first Bash or PowerShell tool call can complete with `tool_dispatch_end outcome=ok` yet never persist a matching `tool_result`. Transcript ends at assistant `tool_use`. Print/SDK still delivers. Score lost or admit filed.

Idle word: **receipted**. Seeded word: **lost**. HOLD: **receipted** / **filed**. ALARM: **lost** / **dispatch-ok-no-persist** / **posttooluse-orchestration** / **worktree-transition** / **print-sdk-ok** / **async-hook-mitigation** / **bash-and-powershell** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#90049](https://github.com/anthropics/claude-code/issues/90049).

Fixtures record the published incident (`tool_dispatch_end outcome=ok`; command side-effects real; no matching `tool_result`; hooks A/B; `async: true` mitigation). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `receipted.json` | receipted | Idle pigeonhole. HOLD: completed `tool_result` stays receipted. |
| `lost.json` | lost | Seeded #90049 path. ALARM: PostToolUse loses the result after dispatch-ok. |
| `filed.json` | filed | Admit hold. Hypothetical stream close/consume. |
| `90049.json` | lost | Primary fixture alias for #90049. |
| `dispatch-ok-no-persist.json` | dispatch-ok-no-persist | `outcome=ok`; command completed; no `tool_result`. |
| `posttooluse-orchestration.json` | posttooluse-orchestration | `await tool.call` → dispatch-ok → PostToolUse → missing persist. |
| `worktree-transition.json` | worktree-transition | First call after EnterWorktree / ExitWorktree / session start. |
| `print-sdk-ok.json` | print-sdk-ok | `claude -p` / SDK delivers; interactive loses. |
| `async-hook-mitigation.json` | async-hook-mitigation | `async:true` PostToolUse persists `tool_result`. |
| `bash-and-powershell.json` | bash-and-powershell | Not Bash-specific. |
| `cousins.json` | cousins | Cite-only #84154 CLOSED/stale. Primary stays #90049. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the pigeonhole. |

Drop any file onto `projects/deadletter/index.html` or paste the JSON. The living page admits **receipted** / idle pigeonhole / #90049.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
