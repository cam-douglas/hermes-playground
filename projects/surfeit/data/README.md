# Surfeit fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94012 issue facts: workflow keeps spawning after a terminal session-limit; resumeFromRunId doubles the bleed; both runs report status: completed. Score surfeit or admit tempered.

Idle word: **tempered**. Path word: **quota-spawn-cascade**. Seeded loss: **surfeit**. Product: **surfeit**. HOLD: **tempered**. ALARM: **surfeit** / **quota-spawn-cascade** / **session-limit** / **resume-amplify**. Primary: [anthropics/claude-code#94012](https://github.com/anthropics/claude-code/issues/94012).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `tempered.json` | tempered | Idle cellar. HOLD: solvent; circuit held; no spawn after quota. |
| `hold.json` | hold | HOLD alias for idle tempered. |
| `surfeit.json` | surfeit | Seeded #94012 path and product. ALARM: kitchen plating after empty cellar. |
| `quota-spawn-cascade.json` | quota-spawn-cascade | Path: orchestrator feeds the queue after a terminal session-limit. |
| `solvent.json` | solvent | HOLD alias: cellar still has stock; quota remaining. |
| `frugal.json` | frugal | HOLD alias: kitchen plates only what the cellar can pour. |
| `circuit-held.json` | circuit-held | HOLD alias: terminal session-limit trips a run-wide breaker. |
| `no-spawn.json` | no-spawn | HOLD alias: no more agents after the first quota death. |
| `session-limit.json` | session-limit | `You've hit your session limit · resets <time>`. |
| `resume-amplify.json` | resume-amplify | `resumeFromRunId` doubles the bleed. |
| `status-completed-lie.json` | status-completed-lie | Both runs headline `status: completed`. |
| `agents-108.json` | agents-108 | 108 agents on each run. |
| `killed-34.json` | killed-34 | Run 1: 34 killed by quota. |
| `killed-42.json` | killed-42 | Run 2 resume: 42 killed by quota. |
| `after-first-133.json` | after-first-133 | 133 more agents after the first failure. |
| `tokens-16m.json` | tokens-16m | 16.6M subagent tokens. |
| `journal-424.json` | journal-424 | Shared journal.jsonl 424 records. |
| `landing.json` | landing | Cellar landing / linen sill. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #91449 #92631 #91942. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Deep claret / candle gold / linen / ink / wine-stain / pewter. |
| `walk.json` | walk | Published idle tempered → quota-spawn-cascade → surfeit. |

## Cousins (cite only)

#91449 — in-flight subagent checkpoint after usage-limit (inside-agent resume). Different: inside-agent resume, not orchestrator spawn-after-terminal-quota. Do not conflate.

#92631 — Ultracode overrides workflow size guideline / no agent ceiling. Different: sizing. Do not conflate.

#91942 — Ultracode reported ON without enabling; 160 subagents exhaust session. Different: enablement. Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#93770 #93777 #93924 #93925 #93967 #93957 #93987 #93996

Drop any file onto `projects/surfeit/index.html`. Buttons load the seeded path. The living page admits **tempered** / idle cellar / #94012.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
