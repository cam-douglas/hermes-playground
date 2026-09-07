# Deadman fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92593 issue facts: timeout auto-backgrounded a destructive Git Bash command; TaskStop killed the shell only; MSYS turned a quoted backslash into the drive root. Score runaway or admit latched.

Idle word: **runaway**. Seeded word: **latched**. HOLD: **latched**. ALARM: **runaway** / **timeout-background** / **taskstop-shell-only** / **msys-backslash-root** / **drive-wipe** / **job-object-missing** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92593](https://github.com/anthropics/claude-code/issues/92593).

Fixtures record the published incident (timeout promote, TaskStop shell-only, MSYS mangle, C:\ walk, Job Object gap). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `runaway.json` | runaway | Idle cab. Timeout backgrounded the wipe; TaskStop left rm.exe alive. |
| `latched.json` | latched | Seeded hold. Timeout kills; TaskStop kills the tree; targets denied. |
| `92593.json` | runaway | Primary fixture alias for #92593. |
| `timeout-background.json` | timeout-background | ~2-minute Bash timeout AUTO-BACKGROUNDED instead of killed. |
| `taskstop-shell-only.json` | taskstop-shell-only | TaskStop success; shell dead; rm.exe survived ~5 minutes. |
| `msys-backslash-root.json` | msys-backslash-root | Quoted backslash → current-drive root via MSYS. |
| `drive-wipe.json` | drive-wipe | C:\ alphabetical walk ~7 minutes; C:\dev destroyed; VSS recovered. |
| `job-object-missing.json` | job-object-missing | No Job Object / taskkill /T around Bash children. |
| `cousins.json` | cousins | Cite-only #92583 / #91642. Primary stays #92593. |
| `has-clear-repro.json` | has-clear-repro | Narrative treated as has-clear-repro even without the label. |
| `fixtures.json` | index | Row list for the deadman cab. |

Drop any file onto `projects/deadman/index.html` or paste the JSON. The living page admits **runaway** / timeout-background + TaskStop incomplete kill / #92593.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
