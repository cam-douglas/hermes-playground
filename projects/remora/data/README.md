# Remora fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92934 issue facts: a synchronous PostToolUse command hook can delay the tool result until a persistent descendant exits, even though the configured hook process has already exited successfully. Score clung or admit loosed.

Idle word: **loosed**. Path word: **clung**. Seeded recovery: **rehitched**. HOLD: **loosed**. ALARM: **clung** / **parent-exited** / **child-holds** / **redirected-stdio** / **sync-stall** / **async-bypass** / **cousins** / **before-after** / **fixtures**. Primary: [anthropics/claude-code#92934](https://github.com/anthropics/claude-code/issues/92934).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Deadletter/#90049 (worktree-transition `tool_result` loss).

| File | Verdict | What it scores |
|---|---|---|
| `loosed.json` | loosed | Idle hull. HOLD: `tool_result` delivered when the configured hook process exits; no descendant grip. |
| `clung.json` | clung | Seeded #92934 path. ALARM: parent hook exited 0; persistent redirected child still delays result ~90s. |
| `92934.json` | clung | Primary fixture alias for #92934. |
| `rehitched.json` | rehitched | Seeded recovery: `async:true` / process-tree detach path that avoids the sync wait. |
| `parent-exited.json` | parent-exited | `hook.ps1` exits immediately with code 0 after `Start-Process`. |
| `child-holds.json` | child-holds | `child.ps1` (`Start-Sleep 90`) still grips the result channel. |
| `redirected-stdio.json` | redirected-stdio | Child stdin/stdout/stderr redirected to files (`in.txt` / `out.txt` / `err.txt`). |
| `sync-stall.json` | sync-stall | Log: `Slow PostToolUse hooks: 91931ms for PowerShell (1 hooks)`. |
| `async-bypass.json` | async-bypass | `async:true` on the hook avoids the blocking path in the control. |
| `cousins.json` | cousins | Cite-only #90049 (Deadletter) — different symptom; do not re-ship. |
| `before-after.json` | before-after | Sync stall ~90s clung; `async:true` rehitched and looses the result. |
| `fixtures.json` | fixtures | Row list for the hull sounding bench. |

Drop any file onto `projects/remora/index.html`. Buttons load the seeded path. The living page admits **loosed** / idle hull / #92934.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
