# Somnus fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94415 issue facts: Cowork cloud scheduled task with `requires_local_device: true` is permanently disabled (`suspension_reason=device_absent`) after one fire while the bound Mac is asleep. Dispatch stamps the latch before any session. No resume. No notify. `next_run_at` frozen. Score somnus or admit cadence.

Idle word: **cadence**. Path word: **device-absent**. Seeded loss: **somnus**. Product: **somnus**. HOLD: **cadence**. ALARM: **somnus** / **device-absent** / **sleep-miss**. Primary: [anthropics/claude-code#94415](https://github.com/anthropics/claude-code/issues/94415).

Fixtures record the published incident only. Ledger reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `cadence.json` | cadence | Idle desk. HOLD: trigger stays enabled across a sleep miss. |
| `somnus.json` | somnus | Seeded #94415 path and product. ALARM: absent chip. |
| `94415.json` | somnus | Same seeded path under the issue number. |
| `device-absent.json` | device-absent | Path: dispatch disables the trigger on one sleep miss. |
| `armed.json` | armed | HOLD alias: the trigger stays armed through a miss. |
| `bound.json` | bound | HOLD alias: the device binding does not kill the series. |
| `listed.json` | listed | HOLD alias: the trigger remains listed and enabled. |
| `scheduled.json` | scheduled | HOLD alias: the cron keeps its next slot. |
| `muster-ok.json` | muster-ok | HOLD alias: the hourly muster still calls. |
| `sleep-miss.json` | sleep-miss | First fire while laptop closed writes `device_absent`. |
| `no-resume.json` | no-resume | Device reconnects; trigger stays `enabled=false`. |
| `no-notify.json` | no-notify | No push, no run-history row, nothing in the session list. |
| `frozen-next.json` | frozen-next | `next_run_at` stays frozen at the missed time. |
| `lid-closed.json` | lid-closed | One nap at fire-time ends the hourly series. |
| `update-trigger.json` | update-trigger | Manual re-enable works until the next miss. |
| `requires-device.json` | requires-device | `requires_local_device:true` bound to one Mac. |
| `cloud-bound.json` | cloud-bound | Cloud+device-bound is worse than local skip/catch-up. |
| `catch-up.json` | catch-up | Local Desktop already skips a miss and catch-up on wake. |
| `landing.json` | landing | Somnus / night-nursery / moon-watch / sleep-clinic. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Muster-ok desk / absent-chip desk. |
| `walk.json` | walk | Published idle cadence → device-absent → somnus. |
| `closed.json` | closed | #94415 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#94420 — Desktop keep-awake GNOME suspend inhibitor never released. DIFFERENT (keep-awake hold).

#94392 — headless `-p` exits with Tasks still running. DIFFERENT (CLI process exit).

#94410 — leftover ScheduledTasks dispatcher ticks. DIFFERENT (ghost orphan tasks).

#94415 is specifically: Cowork cloud schedule permanently disabled after one sleep miss.

## Backups (cite only — do NOT auto-pick or build)

#94344 #94398 #94397 #94396 #94393 #94392 #86198 #94417 #93924 #93770 #93777 #94151 #92268

Drop any file onto `projects/somnus/index.html`. Buttons load the seeded path. The moon-watch admits **cadence** / idle desk / #94415.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
