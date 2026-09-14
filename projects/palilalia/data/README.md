# Palilalia fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94041 issue facts: A session-scoped `/goal` Stop hook can re-fire indefinitely with unchanged or stale text, even after the assistant provides verifiable evidence the condition is met, or after the session enters a deliberate hold. Only the built-in repeated-block safety valve ends the loop ("A hook blocked the turn from ending 9 consecutive times"), and the pattern resumes on a later turn. Score palilalia or admit silenced.

Idle word: **silenced**. Path word: **goal-stop-refire**. Seeded loss: **palilalia**. Product: **palilalia**. HOLD: **silenced**. ALARM: **palilalia** / **goal-stop-refire** / **nine-consecutive** / **safety-valve**. Primary: [anthropics/claude-code#94041](https://github.com/anthropics/claude-code/issues/94041).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `silenced.json` | silenced | Idle groove. HOLD: stylus lifts; /goal does not re-fire. |
| `hold.json` | hold | HOLD alias for idle silenced. |
| `palilalia.json` | palilalia | Seeded #94041 path and product. ALARM: stylus stuck after goal-stop-refire. |
| `goal-stop-refire.json` | goal-stop-refire | Path: native /goal Stop hook re-fires indefinitely. |
| `acknowledged.json` | acknowledged | HOLD alias: the hold is acknowledged. |
| `stood-down.json` | stood-down | HOLD alias: the evaluator stands down. |
| `met.json` | met | HOLD alias: live transcript evidence the condition is met. |
| `once.json` | once | HOLD alias: the groove plays once then lifts. |
| `hold-compaction.json` | hold-compaction | Deliberate hold while waiting on scheduled context compaction. |
| `stale-goal.json` | stale-goal | Ordinary autonomous work quoting a stale multi-part goal. |
| `nine-consecutive.json` | nine-consecutive | Live /goal re-fired ≥9 consecutive times. |
| `twenty-one-consecutive.json` | twenty-one-consecutive | /goal re-fired ≥21 consecutive times. |
| `safety-valve.json` | safety-valve | A hook blocked the turn from ending 9 consecutive times. |
| `evidence-ignored.json` | evidence-ignored | Two in-transcript corrections did not change the re-fired text. |
| `no-acknowledge.json` | no-acknowledge | No supported hold-acknowledge signal. |
| `landing.json` | landing | Clinic chart / wax-cylinder platter. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #82546 #83266 #78121 #91601 #92242 #93744. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Cream / slate / amber / coral / teal / paper / groove / stylus. |
| `walk.json` | walk | Published idle silenced → goal-stop-refire → palilalia. |

## Cousins (cite only)

#82546 — `/goal` at compact boundary never starts its turn. Do not conflate.

#83266 — `/goal` Stop hook skipped while background task live, never re-evaluated. Do not conflate.

#78121 — Stop hook re-fires despite stop_hook_active: true. Do not conflate.

#91601 — Stop-hook goal-condition re-fires identically forever ignoring stand-down. Do not conflate.

#92242 — `/goal` Stop hook re-fires after user accepts blocked outcome. Do not conflate.

#93744 — `/goal` evaluator cannot see instruction via `/goal`, loops until unachievable. Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#94040 #94032 #94031 #94029 #93987 #93924 #93770 #93777 #94059 #94053

Drop any file onto `projects/palilalia/index.html`. Buttons load the seeded path. The silenced page admits **silenced** / idle groove / #94041.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
