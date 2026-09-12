# Aneroid fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93901 issue facts: the context ring ignores `autoCompactWindow` and scores against the model's 1M window, then suppresses while `U >= 50`. Score aneroid or admit calibrated.

Idle word: **calibrated**. Path word: **wrong-window-ring**. Seeded loss: **aneroided**. Product: **aneroid**. HOLD: **calibrated**. ALARM: **aneroided** / **aneroid** / **wrong-window-ring** / **model-window** / **hover-mislabel** / **fifty-suppress**. Primary: [anthropics/claude-code#93901](https://github.com/anthropics/claude-code/issues/93901).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `calibrated.json` | calibrated | Idle panel. HOLD: ring scored against autoCompactWindow; runway before compact. |
| `hold.json` | hold | HOLD alias for idle calibrated. |
| `aneroided.json` | aneroided | Seeded #93901 path. ALARM: wrong model window + hard 50% suppression. |
| `aneroid.json` | aneroid | Product score for the instrument-panel booth. |
| `wrong-window-ring.json` | wrong-window-ring | Path: model-window score plus hard 50% suppress. |
| `model-window.json` | model-window | Webview handed the model's window minus maxOutputTokens minus 13000. |
| `hover-mislabel.json` | hover-mislabel | Hover says 50% remaining until auto-compact when none remains. |
| `fifty-suppress.json` | fifty-suppress | `if (U >= 50) return null` against the wrong window. |
| `no-runway.json` | no-runway | Render threshold and compaction point coincide at 500k. |
| `settings-absent.json` | settings-absent | Key is in settings.json; absent from the webview bundle. |
| `webview-zero-hits.json` | webview-zero-hits | `autoCompactWindow` has 0 hits in `webview/index.js`. |
| `cli-eighteen.json` | cli-eighteen | 18 hits in `bin/claude.exe`. |
| `compact-immediate.json` | compact-immediate | Ring first appears ~500k; compact fires almost immediately. |
| `lower-window-worse.json` | lower-window-worse | Lowering the window to compact sooner can hide the warning. |
| `correct-window.json` | correct-window | HOLD alias: ring uses the CLI-resolved window. |
| `ring-ahead.json` | ring-ahead | HOLD alias: warning appears with runway. |
| `runway.json` | runway | HOLD alias: tokens remain between first ring and compact. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #90756 #91385. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Panel charcoal / dial brass / storm amber / phosphor cyan / teal. |
| `walk.json` | walk | Published idle calibrated → wrong-window-ring → aneroided → aneroid. |
| `wrong-window-usage.json` | (sample) | Usage at the published 500k storm line. |
| `calibrated-usage.json` | (sample) | Calibrated usage with runway. |
| `hover-strings.json` | (sample) | Published hover and bottom-right strings. |
| `settings-snippet.json` | (sample) | `autoCompactWindow: 500000` in settings.json. |

## Cousins (cite only)

#90756 (Desktop UI control to set the value). #91385 (ring vs hard per-prompt window mid-turn). Different problems — this booth is the ring misreporting once the value is already set, because the configured window is absent from the webview.

## Backups (cite only — do NOT auto-pick or build)

#93744 #93772 #93770 #93777 #93782 #93862 #93859 #93863 #93889 #93821 #93811 #93809 #93823

Drop any file onto `projects/aneroid/index.html`. Buttons load the seeded path. The living page admits **calibrated** / idle capsule / #93901.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
