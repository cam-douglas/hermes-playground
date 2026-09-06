# Scarph fixtures

Diagnostic JSON only. No live Claude sessions. No real `bash.exe` spawn. Encoded from #92543 issue facts: Windows Bash tool `-c` argument is sheared between 8,181 and 8,190 characters, and every doubled backslash arrives halved. Score sheared or admit fayed.

Idle word: **sheared**. Seeded word: **fayed**. HOLD: **fayed**. ALARM: **sheared** / **argv-ceiling** / **backslash-halved** / **silent-cut** / **stdin-bypass** / **cousins**. Primary: [anthropics/claude-code#92543](https://github.com/anthropics/claude-code/issues/92543).

Fixtures record the published cut window, ENAMETOOLONG, census, user ceiling, and versions. No live spawn. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `sheared.json` | sheared | Idle scarph bench. `-c` bevel mid-scarf; faying faces do not meet. |
| `fayed.json` | fayed | Seeded hold. Script handed via stdin or a temp file. |
| `92543.json` | sheared | Primary fixture alias for #92543. |
| `argv-ceiling.json` | argv-ceiling | Cut window 8181–8190; libuv 32767; census 0 / 25 of 29. |
| `backslash-halved.json` | backslash-halved | `A\\B` arrives as `A\B`; MS-CRT vs MSYS2. |
| `silent-cut.json` | silent-cut | 8100/8180 START+END; 8190+ START only; phantom quote. |
| `stdin-bypass.json` | stdin-bypass | Suggested rail: `bash <file>` / `bash -s` or refuse over ~8100. |
| `cousins.json` | cousins | Cite-only #85856 #89392 #88311 #88561 #90421. |
| `fixtures.json` | index | Row list for the scarph bench. |

Drop any file onto `projects/scarph/index.html` or paste the JSON. The living page admits **sheared** / Windows `-c` bevel / #92543.

Repro in the issue is Node `spawnSync` of Git `bash.exe -c` with script lengths 8100/8180/8190+. This assay does not run that spawn.
