# Gauntlet fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94029 issue facts: attach ignores DISABLE_MOUSE / DISABLE_MOUSE_CLICKS; direct launch honors DISABLE_MOUSE=1. Score gauntlet or admit ungloved.

Idle word: **ungloved**. Path word: **attach-mouse**. Seeded loss: **gauntlet**. Product: **gauntlet**. HOLD: **ungloved**. ALARM: **gauntlet** / **attach-mouse** / **attach-ignore**. Primary: [anthropics/claude-code#94029](https://github.com/anthropics/claude-code/issues/94029).

Fixtures record the published incident only. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `ungloved.json` | ungloved | Idle lists. HOLD: DISABLE_MOUSE honored; zero enables. |
| `hold.json` | hold | HOLD alias for idle ungloved. |
| `gauntlet.json` | gauntlet | Seeded #94029 path and product. ALARM: iron glove on. |
| `attach-mouse.json` | attach-mouse | Path: attach forces mouse capture. |
| `barehanded.json` | barehanded | HOLD alias: tilter rides with bare hands. |
| `opted.json` | opted | HOLD alias: documented opt-out honored. |
| `native.json` | native | HOLD alias: terminal handles selection natively. |
| `released.json` | released | HOLD alias: cuff released. |
| `openhand.json` | openhand | HOLD alias: PRIMARY paste lands. |
| `direct-honor.json` | direct-honor | Run D: direct + DISABLE_MOUSE not emitted. |
| `attach-ignore.json` | attach-ignore | Run E / Run G: attach ignores both opt-outs. |
| `mouse-1000.json` | mouse-1000 | ESC[?1000h emitted on attach. |
| `mouse-1002.json` | mouse-1002 | ESC[?1002h emitted on attach. |
| `mouse-1003.json` | mouse-1003 | ESC[?1003h emitted on attach. |
| `mouse-1006.json` | mouse-1006 | ESC[?1006h emitted on attach. |
| `primary-paste.json` | primary-paste | Middle-click PRIMARY paste swallowed. |
| `disable-mouse.json` | disable-mouse | CLAUDE_CODE_DISABLE_MOUSE=1 ignored on attach. |
| `disable-clicks.json` | disable-clicks | CLAUDE_CODE_DISABLE_MOUSE_CLICKS=1 ignored on attach. |
| `landing.json` | landing | Tilting-yard / iron glove / riveted cuff. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #91142 #73443 #66957 #71687 #73320. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Tilting-yard / iron glove / riveted cuff. |
| `walk.json` | walk | Published idle ungloved → attach-mouse → gauntlet. |
| `closed.json` | closed | Cousin #73443 closed 2026-08-17. Cite only. |

## Cousins (cite only)

Different surface from #94029 attach-mouse. Do NOT rebuild. Do NOT conflate.

#91142 — attach enables NO mouse modes on Windows (inverse symptom, same code path). Distinct cousin.

#73443 — closed 2026-08-17. Footer nav re-enabled mouse ignoring DISABLE_MOUSE. Distinct cousin.

#66957 — original Linux PRIMARY middle-click, closed pointing at DISABLE_MOUSE=1 which doesn't reach attach. Distinct cousin.

#71687 — docs gap (mouse vars only on fullscreen page). Distinct cousin.

#73320 — DO_NOT_TRACK silently disables mouse clicks. Different mechanism. Distinct cousin.

#94029 is specifically: attach ignores DISABLE_MOUSE / DISABLE_MOUSE_CLICKS (Run E / Run G emitted; Run D not emitted).

## Backups (cite only — do NOT auto-pick or build)

#93987 #93924 #93770 #93777 #94151 #94064 #94251 #94256

Drop any file onto `projects/gauntlet/index.html`. Buttons load the seeded path. The ungloved page admits **ungloved** / idle lists / #94029.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
