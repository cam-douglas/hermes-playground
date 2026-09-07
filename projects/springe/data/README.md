# Springe fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92675 issue facts: plugin-native PreToolUse hooks auto-discovered from `hooks/hooks.json` are not enforced in interactive sessions. Score slipped or admit sprung.

Idle word: **slipped**. Seeded word: **sprung**. HOLD: **sprung**. ALARM: **slipped** / **settings-exit2-blocks** / **plugin-exit2-interactive-slip** / **plugin-exit2-print-blocks** / **plugin-json-deny-both-modes-slip** / **matcher-general-not-bash-only** / **hook-logic-correct-standalone** / **cache-byte-identical** / **three-axis-isolation** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92675](https://github.com/anthropics/claude-code/issues/92675).

Fixtures record the published incident (settings.json exit-2 control blocks; plugin exit-2 slips interactive / blocks print; plugin JSON deny slips both modes; matcher-general; standalone logic correct; cache byte-identical). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `slipped.json` | slipped | Idle springe. ALARM: plugin deny silently no-ops. |
| `sprung.json` | sprung | Seeded hold. Deny correctly enforced. |
| `92675.json` | slipped | Primary fixture alias for #92675. |
| `settings-exit2-blocks.json` | settings-exit2-blocks | Control: settings.json exit-2 blocks interactive. |
| `plugin-exit2-interactive-slip.json` | plugin-exit2-interactive-slip | Plugin exit-2 does not block interactive. |
| `plugin-exit2-print-blocks.json` | plugin-exit2-print-blocks | Plugin exit-2 does block print. |
| `plugin-json-deny-both-modes-slip.json` | plugin-json-deny-both-modes-slip | JSON deny slips interactive and print. |
| `matcher-general-not-bash-only.json` | matcher-general-not-bash-only | Edit\|Write exit-2 also slips interactive. |
| `hook-logic-correct-standalone.json` | hook-logic-correct-standalone | Module / dispatcher / bootstrap emit correct deny JSON. |
| `cache-byte-identical.json` | cache-byte-identical | Cached plugin snapshot matches source. |
| `three-axis-isolation.json` | three-axis-isolation | Source × protocol × mode. |
| `cousins.json` | cousins | Cite-only #10875 / #52822 / #31250. Primary stays #92675. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the springe desk. |

Drop any file onto `projects/springe/index.html` or paste the JSON. The living page admits **slipped** / plugin-exit2-interactive-slip + JSON deny both modes / #92675.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
