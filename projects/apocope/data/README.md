# Detent fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94565 issue facts: after 2.1.271 shared mouse dispatch, claude agents session-row left-clicks land but selection does nothing — hit-test/detent feedback gone on fullscreen macOS Terminal.app. Score detent or admit notched.

Idle word: **notched**. Path word: **mouse-dead**. Seeded loss: **deaf-click**. Product: **detent**. HOLD: **notched**. ALARM: **deaf-click** / **mouse-dead** / **hit-test**. Primary: [anthropics/claude-code#94565](https://github.com/anthropics/claude-code/issues/94565).

Fixtures record the published incident only. Request reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `notched.json` | notched | Idle ratchet. HOLD: click seats in the detent; session opens. |
| `deaf-click.json` | deaf-click | Seeded #94565 path and product. ALARM: mouse-dead miss. |
| `94565.json` | deaf-click | Same seeded path under the issue number. |
| `mouse-dead.json` | mouse-dead | Path: shared hit-testing change after 2.1.271. |
| `engaged.json` | engaged | HOLD alias: the pin is still engaged. |
| `indexed.json` | indexed | HOLD alias: the wheel is still indexed. |
| `seated-click.json` | seated-click | HOLD alias: the click still seats. |
| `hit-test.json` | hit-test | Click resolved separately; row not found. |
| `hover-scope.json` | hover-scope | New hover scope / elementKey. |
| `element-key.json` | element-key | elementKey added to shared mouse dispatch. |
| `fullscreen-tui.json` | fullscreen-tui | tui fullscreen on Apple Terminal.app. |
| `row-onclick.json` | row-onclick | Session row onClick looks unchanged. |
| `keyboard-ok.json` | keyboard-ok | Arrows + Enter still open. |
| `shared-dispatch.json` | shared-dispatch | 2.1.271 shared mouse dispatch changed. |
| `ratchet.json` | hit-test | Four-row bench log fixture. |
| `landing.json` | landing | Mechanical detent / ratchet / hit-test / notched-wheel atelier. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Issue text names no cousin tickets. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Ratchet wheel / detent pin / click pawl. |
| `walk.json` | walk | Published idle notched → mouse-dead → deaf-click. |
| `closed.json` | closed | #94565 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Issue text names no cousin tickets. Do NOT rebuild. Do NOT conflate.

#94565 is specifically: after 2.1.271 shared mouse dispatch, claude agents session-row left-clicks land but selection does nothing on fullscreen macOS Terminal.app.

## Backups (cite only — do NOT auto-pick or build)

#94564 #94553 #94560 #93924 #93770 #93777 #94151

Drop any file onto `projects/detent/index.html`. Buttons load the seeded path. The ratchet admits **notched** / idle bench / #94565.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
