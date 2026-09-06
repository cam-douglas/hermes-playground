# Watchdog fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92424 issue facts: inside a Workflow-tool run, the per-agent stall watchdog (`stalled — no progress for 180000ms`) fires while the agent is auto-compacting its context. Compaction at 180K–350K tokens takes 150–205 seconds and streams nothing the watchdog counts as progress. The runtime then retries the agent from scratch up to six times; each retry re-reads the same material, reaches the same context size, compacts, and dies again. A watchdog that bites during the silent compaction nap is not protecting the flock — it is already choking. Score the pause or admit the agent already retried.

Idle word: **choking**. Seeded word: **retried**. Contrast: **scored** / **streamed-survival** / **sibling-survivors**. Failure rows: **compaction-nap** / **six-retry** / **no-knob**. Primary: [anthropics/claude-code#92424](https://github.com/anthropics/claude-code/issues/92424). Seed primary as retried / six identical stalls during auto-compaction / 180s bite with no assistant output.

| File | Verdict | What it scores |
|---|---|---|
| `choking.json` | choking | Idle kennel fence. Compaction streams silence; the 180s bite is already choking. |
| `retried.json` | retried | Seeded #92424. Six from-scratch retries of the same prompt. Admit the agent already retried. |
| `92424.json` | retried | Primary fixture alias for #92424. |
| `repro.json` | retried | Published 33/751 stall set: last record a tool result, interrupt at 179–180s, no assistant output. |
| `compaction-nap.json` | compaction-nap | Silent compact 150–205s at 180K–350K; watchdog counts no progress. |
| `six-retry.json` | six-retry | Every stalled agent shows six attempts; 0.78M–1.17M cumulative tokens. |
| `streamed-survival.json` | streamed-survival | Contrast hold. Write 35–55KB took 182–288s and was not killed — streamed output counts as progress. |
| `no-knob.json` | no-knob | `CLAUDE_CODE_AUTO_COMPACT_WINDOW` moves the trigger; 180s limit and retry count have no knob. |
| `scored.json` | scored | Contrast hold. Watchdog treats compaction as progress (or pauses). |
| `sibling-survivors.json` | sibling-survivors | Contrast. 166 surviving sibling compactions: last→boundary median 156s / p90 176s / max 180s. |
| `ruled-out-or-workarounds.json` | choking | Ordinary turns at 185K–200K are 3s; Write survival proves stream counts; bounding reads is the only dodge. |
| `cousins.json` | stay-off | Cite-only cousins #85265 #75036 #79017 #90092. |
| `fixtures.json` | index | Row list for the night kennel / dog-watch / stall-watchdog lab. |

Drop any file onto `projects/watchdog/index.html` or paste the JSON. The living page seeds **retried** / six identical stalls during auto-compaction / 180s bite with no assistant output.
