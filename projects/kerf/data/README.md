# Kerf fixtures

Diagnostic JSON only. No live Claude sessions. No live PowerShell. Encoded from #92539 issue facts: on Windows, built-in Remove-Item protection blocks a command whenever the command text contains any Windows path with a space, regardless of what is actually being deleted. Score riven or admit argbound.

Idle word: **riven**. Seeded word: **argbound**. HOLD: **argbound**. ALARM: **riven** / **baseline-pass** / **nospace-pass** / **program-files-block** / **user-dir-block** / **reversed-order-block** / **cousins**. Primary: [anthropics/claude-code#92539](https://github.com/anthropics/claude-code/issues/92539).

Fixtures record the published repros, error fragments (`'"C:\Program'`, `'"C:\AI'`), TEMP delete target, and environment. No live session. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `riven.json` | riven | Idle kerf-gauge bench. Whole-command scan cleaves at the first space. |
| `argbound.json` | argbound | Seeded hold. Guard binds only the real Remove-Item argument. |
| `92539.json` | riven | Primary fixture alias for #92539. |
| `baseline-pass.json` | baseline-pass | Repro 1. TEMP cleanup alone — passes. |
| `nospace-pass.json` | nospace-pass | Repro 2. `C:\Python314\python.exe` mentioned — passes. |
| `program-files-block.json` | program-files-block | Repro 3. `C:\Program Files` → `'"C:\Program'` blocked. |
| `user-dir-block.json` | user-dir-block | Repro 4. `C:\AI Projects` → `'"C:\AI'` blocked. |
| `reversed-order-block.json` | reversed-order-block | Repro 5. Spaced path before Remove-Item — still blocked. |
| `cousins.json` | cousins | Cite-only #73882 #73524. |
| `fixtures.json` | index | Row list for the kerf-gauge bench. |

Drop any file onto `projects/kerf/index.html` or paste the JSON. The living page admits **riven** / Windows Remove-Item whole-command rive / #92539.

Repro in the issue is a single PowerShell tool call. This assay does not run that call.
