# Foundling fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93889 issue facts: when a subagent starts Bash with `run_in_background: true` and then finishes, those Bash tasks keep running. TaskStop covers the parent's own tasks, not a child agent's. Score foundling or admit filiated.

Idle word: **filiated**. Path word: **subagent-bash-outlive**. Seeded loss: **foundling**. Product: **foundling**. HOLD: **filiated**. ALARM: **foundling** / **subagent-bash-outlive** / **polling-loop** / **taskstop-gap**. Primary: [anthropics/claude-code#93889](https://github.com/anthropics/claude-code/issues/93889).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `filiated.json` | filiated | Idle ward. HOLD: parent on the register; Bash bonded. |
| `hold.json` | hold | HOLD alias for idle filiated. |
| `foundling.json` | foundling | Seeded #93889 path and product. ALARM: left at the hatch. |
| `subagent-bash-outlive.json` | subagent-bash-outlive | Path: subagent lifecycle does not reap or hand off Bash. |
| `bonded.json` | bonded | HOLD alias: Bash still bonded to a living parent. |
| `registered.json` | registered | HOLD alias: parent name still on the ward register. |
| `warded.json` | warded | HOLD alias: cradle stays in the ward. |
| `acknowledged.json` | acknowledged | HOLD alias: parent still names the loop. |
| `parented.json` | parented | HOLD alias: living parent still owns the token. |
| `polling-loop.json` | polling-loop | `until false; do sleep 3; done` still turns. |
| `taskstop-gap.json` | taskstop-gap | TaskStop covers the parent's own tasks only. |
| `background-panel.json` | background-panel | Hour-old tasks with no owner. |
| `cmdline-self-match.json` | cmdline-self-match | `while ps \| grep` matches its own cmdline. |
| `agent-finished.json` | agent-finished | Subagent reported completion; parent departed. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #93794 / #93126 / #88702 / #92583 / #91523 / #81462 / #93880 / #93387. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Linen / soot / rose-ribbon / brass / ward-green / panel. |
| `walk.json` | walk | Published idle filiated → subagent-bash-outlive → foundling. |

## Cousins (cite only)

#93794 (Gleaner already shipped — unreaped `&`). #93126, #88702, #92583, #91523, #81462, #93880, #93387. Do not rebuild as separate booths.

## Backups (cite only — do NOT auto-pick or build)

#93772 #93770 #93777 #93782 #93821 #93811 #93809 #93823 #93924 #93925 #93954

Drop any file onto `projects/foundling/index.html`. Buttons load the seeded path. The living page admits **filiated** / idle ward / #93889.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
