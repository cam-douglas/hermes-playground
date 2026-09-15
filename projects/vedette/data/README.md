# Vedette fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94392 issue facts: headless `claude -p` exits with its own background subagents still running; every in-flight Task is reported `stopped` and the run still ends `result.subtype=success`, exit code 0. Score vedette or admit stationed.

Idle word: **stationed**. Path word: **idle-exit**. Seeded loss: **vedette**. Product: **vedette**. HOLD: **stationed**. ALARM: **vedette** / **idle-exit** / **six-hundred**. Primary: [anthropics/claude-code#94392](https://github.com/anthropics/claude-code/issues/94392).

Fixtures record the published incident only. `-p` reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `stationed.json` | stationed | Idle picket. HOLD: parent stays until Tasks return. |
| `vedette.json` | vedette | Seeded #94392 path and product. ALARM: idle-exit march. |
| `94392.json` | vedette | Same seeded path under the issue number. |
| `idle-exit.json` | idle-exit | Path: ~600s idle window; parent exits; Tasks still running. |
| `crewed.json` | crewed | HOLD alias: column and vedettes stay crewed. |
| `posted.json` | posted | HOLD alias: picket still posted. |
| `vigil.json` | vigil | HOLD alias: lantern stays on vigil. |
| `tethered.json` | tethered | HOLD alias: column stays tethered to its vedettes. |
| `backgrounded.json` | backgrounded | is_backgrounded: true when run_in_background is omitted. |
| `six-hundred.json` | six-hundred | No completion within ~600s of the previous turn. |
| `false-success.json` | false-success | result.subtype=success, is_error=false, exit code 0. |
| `stopped-tasks.json` | stopped-tasks | Every in-flight Task gets status stopped. |
| `disable-bg.json` | disable-bg | Workaround: CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1. |
| `landing.json` | landing | Cavalry vedette / outpost lantern / picket-line. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Picket-line / outpost lantern / field-desk. |
| `walk.json` | walk | Published idle stationed → idle-exit → vedette. |
| `closed.json` | closed | #94392 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#63023 — Background agents silently die on session pause/resume. Idle/pause harvest. DIFFERENT.

#65968 — Closed as a duplicate of #63023; idle/suspend boundaries. DIFFERENT.

#94392 is specifically: headless `claude -p` idle-exit with false success while Tasks are still running.

## Backups (cite only — do NOT auto-pick or build)

#94393 #86198 #94417 #94452 #94451 #94430 #94458 #93924 #93770 #93777 #94151

Drop any file onto `projects/vedette/index.html`. Buttons load the seeded path. The picket admits **stationed** / idle desk / #94392.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
