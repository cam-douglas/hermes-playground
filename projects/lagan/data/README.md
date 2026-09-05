# Lagan fixtures

Diagnostic JSON only. No credentials. No payloads. No process-kill scripts. Counts, close method, parent-alive, CPU %, `kernel_task` only.

Idle word: **cast**. Seeded word: **fouled**. Primary: [anthropics/claude-code#92266](https://github.com/anthropics/claude-code/issues/92266).

| File | Verdict | What it scores |
|---|---|---|
| `cast.json` | cast | Idle hold. `/exit` or Ctrl+D released the pair; expected PIDs match live sessions. |
| `fouled.json` | fouled | Seeded #92266. Window/tab close · 2 live · 38 `claude` · parent alive. |
| `pair-per-session.json` | pair-per-session | Each session starts 2 processes (wrapper + entity). |
| `thermal-throttle.json` | thermal-throttle | 38 remnants vs 2 live → `kernel_task` ~189% · typing lag. |
| `cpu-8-12.json` | cpu-8-12 | Each remnant burns ~8–12% CPU continuously. |
| `parent-alive.json` | parent-alive | Remnants not detected as orphans while Claude.app lives. |
| `exit-mitigation.json` | exit-mitigation | `/exit` or Ctrl+D; quitting the app clears the batch. |
| `regression-58915.json` | regression-58915 | Cite-only recurrence of closed #58915/#61748. |
| `cousins.json` | cite-only | #58915, #61748, #45507, #77459. Backups #92264, #92228, #92244. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/lagan/index.html` or paste the JSON. The living page seeds **fouled**.
