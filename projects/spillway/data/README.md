# Spillway fixtures

Diagnostic JSON only. No credentials. No payloads. Cap=3, ultracode early-return, Workflow `agentCount:16`, sweep-line overlap 7 at 2026-09-05T08:21:20.624Z, SubagentStart hook exit 2 only.

Idle word: **gated**. Seeded word: **spilled**. Primary: [anthropics/claude-code#92311](https://github.com/anthropics/claude-code/issues/92311).

| File | Verdict | What it scores |
|---|---|---|
| `gated.json` | gated | Idle hold. Cap holds; ≤3 concurrent; no ultracode bypass. |
| `spilled.json` | spilled | Seeded #92311. Ultracode early-return; 7 overlapping under cap 3. |
| `capped.json` | capped | Settings `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS=3`. |
| `exempt.json` | exempt | Ultracode sessions exempt (docs one sentence; impact not stated). |
| `overlapped.json` | overlapped | Peak overlap 7 at 2026-09-05T08:21:20.624Z; FAIL transcript-gate 4,5,6,7. |
| `hooked.json` | hooked | SubagentStart hook exit 2 when live count would exceed cap. |
| `refused.json` | refused | Hook refused the spawn before the lane filled. |
| `cousins.json` | cite-only | #80082 (closed docs omitted the cap). #90483 (Workflow concurrency from CPU count). Cite only. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/spillway/index.html` or paste the JSON. The living page seeds **spilled**.
