# Titulus fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94025 issue facts: desktop Windows Code sidebar keeps the auto-generated title after an iOS rename; resume appends a stale custom-title and clobbers the phone name. Score titulus or admit inscribed.

Idle word: **inscribed**. Path word: **resume-stale-title**. Seeded loss: **titulus**. Product: **titulus**. HOLD: **inscribed**. ALARM: **titulus** / **resume-stale-title** / **sidebar-stale** / **custom-title-clobber**. Primary: [anthropics/claude-code#94025](https://github.com/anthropics/claude-code/issues/94025).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `inscribed.json` | inscribed | Idle plaque. HOLD: latest rename wins; phone name and desktop cache stay synced. |
| `hold.json` | hold | HOLD alias for idle inscribed. |
| `titulus.json` | titulus | Seeded #94025 path and product. ALARM: stale desktop letters recut the phone name. |
| `resume-stale-title.json` | resume-stale-title | Path: quit/reopen resume appends stale custom-title. |
| `current.json` | current | HOLD alias: latest name is current on every surface. |
| `plaque.json` | plaque | HOLD alias: marble face keeps the newest letters. |
| `latest-wins.json` | latest-wins | HOLD alias: newest rename wins across surfaces. |
| `synced.json` | synced | HOLD alias: phone plaque and desktop cache stay synced. |
| `sidebar-stale.json` | sidebar-stale | Windows Code sidebar keeps Title A. |
| `custom-title-clobber.json` | custom-title-clobber | Resume appends stale custom-title. |
| `ios-rename.json` | ios-rename | iOS app writes Title B into the transcript. |
| `list-sessions-stale.json` | list-sessions-stale | get_session / list_sessions still return Title A. |
| `landing.json` | landing | Marble landing / bronze sill. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only diplopia #93012, fulcrum #92377. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Marble / bronze / terracotta / lapis / soot / chalk / oxide / ink. |
| `walk.json` | walk | Published idle inscribed → resume-stale-title → titulus. |

## Cousins (cite only)

diplopia #93012 — room-label conflation (web vs mobile environment names). Do not conflate.

fulcrum #92377 — auto-title overwrites `--name` custom-title on the peer registry. Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#93987 #93924 #94032 #94029 #94031 #93770 #93777

Drop any file onto `projects/titulus/index.html`. Buttons load the seeded path. The living page admits **inscribed** / idle plaque / #94025.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
