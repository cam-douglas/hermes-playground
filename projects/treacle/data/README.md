# Treacle fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94344 issue facts: on Claude Desktop (Code tab) on Windows, every NEW PowerShell tool call waits ~153–160s (median 154.1s / 1244 calls) from tool_use until the command starts. Bash is ~2.7s. Permission dialog after the wait. Repeats 2–3s. Streaming stall 150.0s. `permissionDecisionMs≈150717`. Score treacle or admit brisk.

Idle word: **brisk**. Path word: **streaming-stall**. Seeded loss: **treacle**. Product: **treacle**. HOLD: **brisk**. ALARM: **treacle** / **streaming-stall** / **first-call**. Primary: [anthropics/claude-code#94344](https://github.com/anthropics/claude-code/issues/94344).

Fixtures record the published incident only. Timing reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `brisk.json` | brisk | Idle kettle. HOLD: PowerShell starts promptly like Bash. |
| `treacle.json` | treacle | Seeded #94344 path and product. ALARM: sticky ladle. |
| `94344.json` | treacle | Same seeded path under the issue number. |
| `streaming-stall.json` | streaming-stall | Path: first unique PowerShell waits ~154s before start. |
| `snap.json` | snap | HOLD alias: the first unique pour snaps off the ladle. |
| `ready.json` | ready | HOLD alias: the kettle is ready before the twist. |
| `instant.json` | instant | HOLD alias: first unique command starts now. |
| `bash-fast.json` | bash-fast | HOLD alias: Bash median 2.7s on the same hob. |
| `ast-parser.json` | ast-parser | EncodedCommand AST parser ~1s, then ~150s silence. |
| `first-call.json` | first-call | Every NEW PowerShell shape waits 153–160s. |
| `repeat-cached.json` | repeat-cached | Same command verbatim returns in 2–3s. |
| `permission-dialog-late.json` | permission-dialog-late | Dialog appears only after the wait. |
| `stall-gap.json` | stall-gap | Streaming stall detected: 150.0s gap. |
| `permission-ms.json` | permission-ms | permissionDecisionMs≈150717. |
| `encoded-command.json` | encoded-command | powershell.exe -EncodedCommand AST parser. |
| `probe-before-start.json` | probe-before-start | Command itself is 119ms; wait is before start. |
| `landing.json` | landing | Treacle / copper kettle / treacle-well / sticky-ladle. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Bash-fast desk / sticky-ladle desk. |
| `walk.json` | walk | Published idle brisk → streaming-stall → treacle. |
| `closed.json` | closed | #94344 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#57960 — same bug, closed stale. SAME stall; do not rebuild as a new booth.

#94392 — headless `-p` exits with Tasks still running. DIFFERENT (CLI process exit).

#94344 is specifically: Windows Desktop PowerShell first unique command waits ~154s before start.

## Backups (cite only — do NOT auto-pick or build)

#94398 #94397 #94396 #94393 #94392 #86198 #94417 #93924 #93770 #93777 #94151

Drop any file onto `projects/treacle/index.html`. Buttons load the seeded path. The copper kettle admits **brisk** / idle desk / #94344.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
