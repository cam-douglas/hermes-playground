# Freshet fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94430 issue facts: Desktop Remote Control re-sends `initialize` every 60s; `system/init`+`status` flood pushes past the 2,000-event transcript window so the session opens as No messages yet. Score freshet or admit buoyed.

Idle word: **buoyed**. Path word: **init-flood**. Seeded loss: **freshet**. Product: **freshet**. HOLD: **buoyed**. ALARM: **freshet** / **init-flood** / **window-drown**. Primary: [anthropics/claude-code#94430](https://github.com/anthropics/claude-code/issues/94430).

Fixtures record the published incident only. Request reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `buoyed.json` | buoyed | Idle gauge. HOLD: conversation still findable above the waterline. |
| `freshet.json` | freshet | Seeded #94430 path and product. ALARM: init-flood miss. |
| `94430.json` | freshet | Same seeded path under the issue number. |
| `init-flood.json` | init-flood | Path: desktop timer re-init + system/init+status surge. |
| `surfaced.json` | surfaced | HOLD alias: conversation still above stage. |
| `charted.json` | charted | HOLD alias: staff gauge still reads talk. |
| `sounding.json` | sounding | HOLD alias: the bed is still measurable. |
| `initialize-cadence.json` | initialize-cadence | Desktop re-sends initialize + get_workspace_diff every 60s. |
| `window-drown.json` | window-drown | Newest 2,000 events then stop; four pages of 500. |
| `no-messages-yet.json` | no-messages-yet | Plaque while conversation sits under the flood. |
| `desktop-poll.json` | desktop-poll | Only the desktop app polls. |
| `browser-quiet.json` | browser-quiet | A plain browser tab does not timer-reinitialize. |
| `system-init.json` | system-init | CLI appends system/init + system/status. |
| `load-earlier.json` | load-earlier | Eight clicks of 500 to surface the conversation. |
| `gauge.json` | window-drown | Six-row stage log fixture. |
| `landing.json` | landing | River-stage / staff-gauge / flood-crest / floodplain. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Staff gauge / crest mark / event spool. |
| `walk.json` | walk | Published idle buoyed → init-flood → freshet. |
| `closed.json` | closed | #94430 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#94396 — fork never Remote Control eligible. DIFFERENT.

#94397 — mobile brief echo. DIFFERENT.

#94451 — known_marketplaces never repaired once invalid. DIFFERENT.

#94452 — directory marketplace dead `installLocation`. DIFFERENT.

#93490 — resume flatten. DIFFERENT.

#94430 is specifically: desktop Remote Control initialize every 60s; system/init+status flood; 2,000-event window drowns conversation; No messages yet.

## Backups (cite only — do NOT auto-pick or build)

#94458 #93924 #93770 #93777 #94151 #94496 #94499 #94522 #94520 #94509 #94507 #94547 #94546 #94530 #94516

Drop any file onto `projects/freshet/index.html`. Buttons load the seeded path. The gauge admits **buoyed** / idle desk / #94430.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
