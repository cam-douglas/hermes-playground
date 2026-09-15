# Orloj fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94393 issue facts: Monitor schema caps `timeout_ms` at 3600000 and ignores persistent; even at the allowed max the tool reports expires in 30m and dies ~30 minutes during an active session. Score orloj or admit lasting.

Idle word: **lasting**. Path word: **half-life**. Seeded loss: **orloj**. Product: **orloj**. HOLD: **lasting**. ALARM: **orloj** / **half-life** / **thirty-minute**. Primary: [anthropics/claude-code#94393](https://github.com/anthropics/claude-code/issues/94393).

Fixtures record the published incident only. Monitor reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `lasting.json` | lasting | Idle tower. HOLD: schema-promised hour honored. |
| `orloj.json` | orloj | Seeded #94393 path and product. ALARM: half-life chime. |
| `94393.json` | orloj | Same seeded path under the issue number. |
| `half-life.json` | half-life | Path: silent ~30m cap during active use. |
| `hourlong.json` | hourlong | HOLD alias: gilt hand sweeps a full circle. |
| `promised.json` | promised | HOLD alias: confirmation names the accepted timeout. |
| `diurnal.json` | diurnal | HOLD alias: the tower's day cycle holds. |
| `calendar.json` | calendar | HOLD alias: calendar dial still names the hour. |
| `schema-cap.json` | schema-cap | InputValidationError: timeout_ms must be <= 3600000. |
| `thirty-minute.json` | thirty-minute | Confirmation says expires in 30m, not 1h. |
| `persistent-reject.json` | persistent-reject | persistent is ignored / hard-rejected. |
| `re-arm.json` | re-arm | Re-arming produces the same ~30-minute lifetime again. |
| `active-session.json` | active-session | Session never idle; task-notification every ~30m. |
| `docs-promise.json` | docs-promise | Docs imply longer/persistent watches. |
| `landing.json` | landing | Prague orloj / astronomical clock / zodiac dial. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Clock face / zodiac ring / automaton walk. |
| `walk.json` | walk | Published idle lasting → half-life → orloj. |
| `closed.json` | closed | #94393 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#63023 — Background agents silently die on session pause/resume. Idle/pause harvest. DIFFERENT.

#65968 — Closed as a duplicate of #63023; idle/suspend boundaries. DIFFERENT.

#94393 is specifically: Monitor schema caps `timeout_ms` at 3600000 and ignores persistent; even at the allowed max the tool reports expires in 30m and dies ~30 minutes during an active session.

## Backups (cite only — do NOT auto-pick or build)

#94392 #86198 #94417 #94452 #94451 #94430 #94458 #93924 #93770 #93777 #94151

Drop any file onto `projects/orloj/index.html`. Buttons load the seeded path. The tower admits **lasting** / idle desk / #94393.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
