# Scissel fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93915 issue facts: Windows Bash tool transports the whole command through argv to MSYS2 `bash -c`. Commands over ~8,203 chars are silently truncated; doubled backslashes collapse at 295 B. Both disappear on `bash -s`. Score scissel or admit plenary.

Idle word: **plenary**. Path word: **argv-trunc**. Seeded loss: **scisselled**. Product: **scissel**. HOLD: **plenary**. ALARM: **scisselled** / **scissel** / **argv-trunc** / **trunc-8203**. Primary: [anthropics/claude-code#93915](https://github.com/anthropics/claude-code/issues/93915).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `plenary.json` | plenary | Idle hopper. HOLD: full command via stdin. |
| `hold.json` | hold | HOLD alias for idle plenary. |
| `scisselled.json` | scisselled | Seeded #93915 path. ALARM: 8203 cut / `\\` collapse. |
| `scissel.json` | scissel | Product score for the mint booth. |
| `argv-trunc.json` | argv-trunc | Path: argv `-c` punch vs bash `-s` hopper. |
| `trunc-8203.json` | trunc-8203 | bash.exe `-c` silently cuts at 8,203. |
| `stack-8192.json` | stack-8192 | glob() 8192-character stack buffer. |
| `slash-collapse.json` | slash-collapse | `\\` → `\` at 295 B. |
| `winerror-206.json` | winerror-206 | 52 KB / 259 KB via `-c` raise WinError 206. |
| `eval-wrapper.json` | eval-wrapper | ~1 KB `eval '<USER COMMAND>'` wrapper. |
| `quote-expand.json` | quote-expand | every `'` expands to 5 chars. |
| `bash-c.json` | bash-c | argv punch path. |
| `msys-glob.json` | msys-glob | trigger set `?*["'(){}`. |
| `bash-s.json` | bash-s | HOLD alias: stdin hopper. |
| `stdin-full.json` | stdin-full | HOLD alias: payload never traverses argv. |
| `slash-kept.json` | slash-kept | HOLD alias: `\\` survives. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #15003 / #178 / msys2-argv-fix. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Slag / planchet / copper die. |
| `walk.json` | walk | Published idle plenary → argv-trunc → scisselled → scissel. |

## Cousins (cite only)

openai/codex#15003 (same argv class / WinError 206). msys2/msys2-runtime#178 (8192 stack buffer). zetaloop/msys2-argv-fix. Do not rebuild as separate booths.

## Backups (cite only — do NOT auto-pick or build)

#93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93929 #93848 #93924 #93925

Drop any file onto `projects/scissel/index.html`. Buttons load the seeded path. The living page admits **plenary** / idle hopper / #93915.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
