# Gland fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92533 issue facts: any function-hook `tool.call` on Bash strips worktree isolation — every `pwd` refused with `context_lost`. Score stripped or admit packed.

Idle word: **stripped**. Seeded word: **packed**. HOLD: **packed** / **passthrough-ok**. ALARM: **stripped** / **context-lost** / **parent-switched** / **cousins**. Primary: [anthropics/claude-code#92533](https://github.com/anthropics/claude-code/issues/92533).

Fixtures record the published error, bisection, parent side-effect, and environment. No live session. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `stripped.json` | stripped | Idle gland. Bash `tool.call` hook registered; isolation lost. |
| `packed.json` | packed | Seeded hold. Isolation survives; pwd prints worktree. |
| `92533.json` | stripped | Primary fixture alias for #92533. |
| `context-lost.json` | context-lost | `context_lost` / `tengu_agent_worktree_cwd_escape_blocked`. |
| `parent-switched.json` | parent-switched | EnterWorktree recovery switches the parent session. |
| `passthrough-ok.json` | passthrough-ok | session.start only, or function hooks env off. |
| `cousins.json` | cousins | Cite-only #92112 #89102 #91932 #86340 #84704 #87953 #88950 #90432 #87643 #87959. |
| `fixtures.json` | index | Row list for the shaft-seal bench. |

Drop any file onto `projects/gland/index.html` or paste the JSON. The living page admits **stripped** / Bash-hook-strips-isolation / #92533.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
