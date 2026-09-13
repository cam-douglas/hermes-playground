# Drawbridge fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94049 issue facts: desktop auto-update restarts the app and terminates the machine-wide Remote Control bridge; every RC session across unrelated projects goes offline at once; conversations resume and keep writing locally; no notification; bridge-state.json freezes with a stale localSessionId; the settings checkbox only admits future sessions. Score drawbridge or admit spanned.

Idle word: **spanned**. Path word: **rc-bridge-update-drop**. Seeded loss: **drawbridge**. Product: **drawbridge**. HOLD: **spanned**. ALARM: **drawbridge** / **rc-bridge-update-drop** / **auto-update-restart** / **bridge-state-stale**. Primary: [anthropics/claude-code#94049](https://github.com/anthropics/claude-code/issues/94049).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `spanned.json` | spanned | Idle approach. HOLD: span down; remote carts reach the keep. |
| `hold.json` | hold | HOLD alias for idle spanned. |
| `drawbridge.json` | drawbridge | Seeded #94049 path and product. ALARM: auto-update raises the machine-wide span. |
| `rc-bridge-update-drop.json` | rc-bridge-update-drop | Path: machine-wide Remote Control span hauled up on auto-update. |
| `open-span.json` | open-span | HOLD alias: the bailey approach stays an open span. |
| `linked.json` | linked | HOLD alias: remote carts stay linked to the keep. |
| `moored.json` | moored | HOLD alias: the span stays moored to both banks. |
| `joined.json` | joined | HOLD alias: bailey and keep stay joined. |
| `auto-update-restart.json` | auto-update-restart | All claude processes restarted ~20:09:31. |
| `bridge-state-stale.json` | bridge-state-stale | Gatehouse ledger frozen on a stale localSessionId. |
| `silent-drop.json` | silent-drop | No horn; remote approach cut while halls stay lit. |
| `future-sessions-only.json` | future-sessions-only | Checkbox only admits future carts. |
| `multi-project-offline.json` | multi-project-offline | Unrelated baileys lose remote approach together. |
| `transcript-survives.json` | transcript-survives | Halls stay lit; jsonl keeps appending. |
| `landing.json` | landing | Gatehouse landing / bailey approach / ditch water. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #90387 #84793 #84805 #90172 #85413 #82462 #80400. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Bailey stone / keep iron / portcullis rust / moss / torch / ditch / chalk / ink. |
| `walk.json` | walk | Published idle spanned → rc-bridge-update-drop → drawbridge. |

## Cousins (cite only)

#90387 — RC archived on teardown after auto-update. Do not conflate.

#84793 — remoteControlAtStartup not honored on resume after auto-update. Do not conflate.

#84805 — restored sessions never re-register RC. Do not conflate.

#90172 — stealth relaunch destroys hosts. Do not conflate.

#85413 — auto-update kills live session hosts. Do not conflate.

#82462 / #80400 — registration-lost cousins. Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#94052 #94041 #94040 #94032 #94031 #94029 #93987 #93924 #93770 #93777

Drop any file onto `projects/drawbridge/index.html`. Buttons load the seeded path. The living page admits **spanned** / idle approach / #94049.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
