# Allograph fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94256 issue facts: shared PreToolUse path-guard compares Windows tool_input paths to POSIX $PWD/$HOME and fails closed. Score allograph or admit equated.

Idle word: **equated**. Path word: **win-posix-mismatch**. Seeded loss: **allograph**. Product: **allograph**. HOLD: **equated**. ALARM: **allograph** / **win-posix-mismatch** / **prefix-fail**. Primary: [anthropics/claude-code#94256](https://github.com/anthropics/claude-code/issues/94256).

Fixtures record the published incident only. Path pairs are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `equated.json` | equated | Idle ledger. HOLD: scripts would match after unification. |
| `hold.json` | hold | HOLD alias for idle equated. |
| `allograph.json` | allograph | Seeded #94256 path and product. ALARM: dual-script fail-closed. |
| `94256.json` | allograph | Same seeded path under the issue number. |
| `win-posix-mismatch.json` | win-posix-mismatch | Path: Windows punch vs POSIX matrix. |
| `matched.json` | matched | HOLD alias: scripts match after unification. |
| `congruent.json` | congruent | HOLD alias: same grapheme, two glyphs. |
| `aligned.json` | aligned | HOLD alias: scripts aligned. |
| `normalized.json` | normalized | HOLD alias: unified to one script. |
| `samepath.json` | samepath | HOLD alias: one path after unification. |
| `settings-lockout.json` | settings-lockout | `.claude/settings.json` denied. |
| `scratchpad-temp.json` | scratchpad-temp | USER~1 Temp vs /tmp/claude. |
| `deny-message-only.json` | deny-message-only | Only feedback is the hook deny. |
| `prefix-fail.json` | prefix-fail | String prefix fails closed. |
| `fail-closed.json` | fail-closed | Shared guard fails closed. |
| `windows-path.json` | windows-path | tool_input.file_path is D:\... |
| `posix-shell.json` | posix-shell | Hook $PWD/$HOME are POSIX. |
| `windows-vs-posix.json` | fixtures | Published path-pair examples. |
| `landing.json` | landing | Type-foundry / punchcutter / dual-script ledger. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #89392 #88578 #90122 #93356 #79414. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Type-foundry / punchcutter / dual-script ledger. |
| `walk.json` | walk | Published idle equated → win-posix-mismatch → allograph. |
| `closed.json` | closed | Cousins remain OPEN — cite only; not this booth. |

## Cousins (cite only)

Different surfaces from #94256 shared path-guard. Do NOT rebuild. Do NOT conflate.

#89392 — Bash strips backslashes on Windows/Git Bash. Distinct cousin.

#88578 — hook commands with backslash paths never execute. Distinct cousin.

#90122 — commandWindows ignored, forces Git Bash. Distinct cousin.

#93356 — hooks fail when Windows username has space. Distinct cousin.

#79414 — plugin marketplace PATH POSIX-style. Distinct cousin.

#94256 is specifically: shared path-guard comparing Windows tool_input paths to POSIX $PWD/$HOME and failing closed.

## Backups (cite only — do NOT auto-pick or build)

#93987 #93924 #93770 #93777 #94151 #94064

Drop any file onto `projects/allograph/index.html`. Buttons load the seeded path. The equated page admits **equated** / idle ledger / #94256.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
