# Scissel

A **mint / coin-press / punch-and-scissel booth** — slag floor, copper die, silver planchet, scrap bin of clipped argv bytes. Fonts **Oswald** (display) + **IBM Plex Sans** (body) + **IBM Plex Mono** (chips). Palette: slag `#121417`, planchet silver `#C8CED6`, copper die `#B87333`, punch ink `#E8F0FF`, hazard amber `#D4A017`, scrap rust `#8B3A2F`. NOT Feoffee (feoffment/chancery/preview-eperm), NOT Apograph (scriptorium/reopen-fork), NOT Airlock (socat-race), NOT Scotoma (command-args-blind), NOT Aneroid (wrong-window-ring), NOT Simulacrum (phantom-navigate), NOT Solenoid (warm-before-message), NOT Scotia (decstbm-undershoot), NOT Canard (onedrive-cwd), NOT Stet/Blindside/Interdict/Schism/Gleaner/Waif/Ashpan/Snatch, NOT Disseisin (court of novel disseisin / home-evaporated). Completely different UI/UX/metaphor. This is specifically: **WINDOWS BASH ARGV `-c` TRANSPORT → 8203 TRUNCATION AND/OR `\\` COLLAPSE.**

The planchet should stay **plenary** (HOLD: full command arrives via stdin / non-argv path; heredocs and `\\` survive). Instead the booth was **scisselled** after an **argv-trunc**.

Primary:

- [anthropics/claude-code#93915](https://github.com/anthropics/claude-code/issues/93915) (OPEN, has repro). Title: `[BUG] Windows: Bash commands >8KB silently truncated, backslash pairs silently collapsed (argv transport to MSYS2 bash)`. Labels: bug, has repro, platform:windows, area:bash. On Windows the Bash tool transports the whole command through argv to MSYS2 `bash -c`. Two failures: (1) commands over ~8,203 chars are silently truncated; bash reports a bogus syntax error pointing at an apostrophe mid-payload (`unexpected EOF while looking for matching '\''`). Line number is constant across sizes → fixed-offset cut. 30/31 failing commands pass `bash -n` when re-fed intact. (2) Doubled backslashes (`\\`) silently collapse to a single `\` at ANY size (reproduced at 295 bytes). No error. Files written wrong (e.g. Python `r'\\d+'` becomes `r'\d+'`). Both disappear when the identical command is passed on bash stdin (`bash -s`) instead of `-c` (byte-identical up to 259 KB). Environment: Windows 11 Pro 10.0.26200; Git Bash 5.3.15(1)-release; MSYS MINGW64_NT-10.0-26200 3.6.9; process chain `claude.exe` → `bash.exe` (no cmd.exe — so the classic 8191 cmd limit is NOT the explanation). Measured: `bash.exe -c` **8,203 chars**; MSYS `echo.exe` 20,000; native `python.exe` 32,000; Windows CreateProcess 32,767 documented. Symptom 1 documented: msys2-runtime `build_argv()` / `glob()` uses a fixed **8192-character stack buffer** (msys2/msys2-runtime#178). Trigger set includes `?*["'(){}`. Symptom 2 measured; argv-escaping cause is reporter inference — unconfirmed. Claude wraps roughly `bash -c "source … && eval '<USER COMMAND>' && pwd -P …"` (~1 KB wrapper) and every `'` expands to 5 chars (`'"'"'`). What does not work: `MSYS=noglob` (raises limit to 32731 but breaks quote reconstruction); chunking (fixes trunc not backslash); base64 (makes argv larger). Cousins cite-only: openai/codex#15003 (same argv class / WinError 206); msys2/msys2-runtime#178; zetaloop/msys2-argv-fix. Backups cite-only (next focus only — do not auto-pick): #93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93929 #93848 #93924 #93925.

11:50 scissel: a mint / coin-press / punch-and-scissel booth for #93915. Idle **plenary** / seeded **scisselled** / path **argv-trunc**. Score scissel or admit plenary.

Score scissel or admit plenary.

Idle word: **plenary** (HOLD: full command arrives via stdin / non-argv path; heredocs and `\\` survive). HOLD aliases: plenary, bash-s, stdin-full, slash-kept. Seeded word: **scisselled** / #93915 (argv `-c` path truncates at ~8203 and/or collapses `\\`). Path word: **argv-trunc**. Product score: **scissel**. Never idle vested / unseised / preview-eperm / singular / apographed / equalized / blown / socat-race / scotoma / legible / scotomized / command-args-blind / aneroid / calibrated / aneroided / wrong-window-ring / simulacrum / tethered / hollow / phantom-navigate / solenoid / engaged / inert / warm-before-message / scotia / flush / scotiated / decstbm-undershoot / canard / candid / canarded / stet / stetted / rewound / blindside / sighted / blindsided / interdict / scoped / interdicted / simplex / deadkey / keyed / gleaner / gleaned / orphaned / inherited / schism / live / rasure / intact / ashpan / swept / seised / disseised / armed / coil-pulled.

Phrase: **Score scissel or admit plenary.**

- **plenary** = IDLE: HOLD; full command arrives via stdin / non-argv path; heredocs and `\\` survive
- **scisselled** = #93915 seeded path: argv `-c` truncates at ~8203 and/or collapses `\\`
- **scissel** = product score word for the mint / punch booth
- **argv-trunc** = path word: argv `-c` punch vs bash `-s` hopper
- **hold** = HOLD alias for idle plenary
- **bash-s** = HOLD alias: stdin hopper; byte-identical up to 259 KB
- **stdin-full** = HOLD alias: payload never traverses argv
- **slash-kept** = HOLD alias: `\\` survives on the hopper
- **trunc-8203** = bash.exe `-c` silently cuts at 8,203 chars
- **stack-8192** = msys2-runtime glob() 8192-character stack buffer
- **slash-collapse** = `\\` becomes `\` at 295 B
- **winerror-206** = 52 KB / 259 KB via `-c` raise WinError 206
- **eval-wrapper** = ~1 KB wrapper around `eval '<USER COMMAND>'`
- **quote-expand** = every `'` expands to 5 chars (`'"'"'`)
- **bash-c** = argv punch path
- **msys-glob** = trigger set `?*["'(){}`
- **has-repro** = published shape: Win 11 / Git Bash 5.3.15 / MSYS 3.6.9
- **cousins** = cite-only openai/codex#15003, msys2-runtime#178, zetaloop/msys2-argv-fix
- **backups** = cite-only #93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93929 #93848 #93924 #93925 — do not auto-pick
- **fixtures** = slag / planchet silver / copper die
- **walk** = published idle plenary → argv-trunc → scisselled → scissel

Verdicts: plenary, scisselled, scissel, argv-trunc, hold, bash-s, stdin-full, slash-kept, trunc-8203, stack-8192, slash-collapse, winerror-206, eval-wrapper, quote-expand, bash-c, msys-glob, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **scisselled** / **scissel** or already **plenary**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Symptom 1 documented in msys2/msys2-runtime#178 — `build_argv()` / `glob()` uses a fixed 8192-character stack buffer. Symptom 2 is measured; the reporter's inference that Windows escaping in the argv rebuild is the cause is unconfirmed. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93915](https://github.com/anthropics/claude-code/issues/93915)
- Cite-only cousins: openai/codex#15003 (same argv class / WinError 206 — complete failure before execution, not a partial cut); msys2/msys2-runtime#178 (8192 stack buffer); zetaloop/msys2-argv-fix. Do not rebuild as separate booths.
- Backups (data only; next focus only — do not auto-pick): #93772, #93770, #93777, #93782, #93889, #93821, #93811, #93809, #93823, #93929, #93848, #93924, #93925

What happened (from the issue text — do not invent):

- OPEN, has repro
- Labels: bug, has repro, platform:windows, area:bash
- Environment: Windows 11 Pro 10.0.26200; Git Bash 5.3.15(1)-release; MSYS MINGW64_NT-10.0-26200 3.6.9
- Process chain `claude.exe` → `bash.exe` (no cmd.exe)
- Symptom 1: silent truncate at ~8,203; bogus `unexpected EOF` at a mid-payload apostrophe; line number constant; 30/31 pass `bash -n` when re-fed
- Symptom 2: `\\` → `\` at any size (295 B); Python `r'\\d+'` becomes `r'\d+'`
- Positive control: `bash -s` byte-identical up to 259 KB
- Documented mechanism (symptom 1): msys2-runtime `glob()` 8192-character stack buffer
- Symptom 2 cause: reporter inference — unconfirmed
- Wrapper ~1 KB; `'` expands to 5 chars so practical failures start ~8 KB of user command
- Rejected: `MSYS=noglob`, chunking, base64

Problem found: WINDOWS BASH ARGV `-c` TRANSPORT CLIPS OR COLLAPSES THE PAYLOAD; STDIN (`bash -s`) DOES NOT.

Why this solution: living catalog page + node diagnostic encoding idle **plenary** / seeded **scisselled** / path **argv-trunc** so operators can score whether the booth is a **scissel** or already **plenary**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Pass the command on bash stdin (`bash -s`) instead of as the `-c` argument
2. Or write the command to a temp file and run `bash <file>`
3. Heredocs and doubled backslashes survive; output byte-identical up to 259 KB

## Why not a clone

This is specifically: **WINDOWS BASH ARGV `-c` TRANSPORT → 8203 TRUNCATION AND/OR `\\` COLLAPSE.**

Novel paradigm: mint / coin-press / punch-and-scissel — the hopper feeds a plenary planchet; the argv die punches clipped scrap.

**NOT Feoffee/#93863** (preview_start getcwd EPERM despite parent FDA). Different defect. NOT medieval feoffment / livery-of-seisin / chancery. Do not reuse vested / unseised / preview-eperm.

**NOT Apograph/#93859** (Desktop reopen forks a full transcript copy). Different defect. NOT scriptorium / stacked parchment leaves / session-ID wax seals. Do not reuse singular / apographed / reopen-fork.

**NOT Airlock/#93862** (sandbox socat proxy readiness race). Different defect. NOT submarine / spacecraft pressure-lock. Do not reuse equalized / blown / socat-race.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT ophthalmology / Humphrey bowl / perimetry. Do not reuse legible / scotomized / command-args-blind.

**NOT Aneroid/#93901** (VS Code context ring ignores autoCompactWindow). Different defect. NOT aneroid-barometer / instrument-panel / sealed gauge. Do not reuse calibrated / aneroided / wrong-window-ring.

**NOT Simulacrum/#93751** (Claude-in-Chrome hollow MCP success). Different defect. NOT Baudrillard / hyperreality museum. Do not reuse tethered / hollow / phantom-navigate.

**NOT Solenoid/#93754** (Desktop Settings RC toggle fidelity). Different defect. NOT industrial switchgear / solenoid-coil. Do not reuse engaged / inert / warm-before-message.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows). Different defect. NOT limestone / shadow-gap. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd). Different defect. NOT press-room. Do not reuse candid / canarded / onedrive-cwd.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work). Different defect. NOT sideline-scout. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Schism/#93797** (SendMessage resumes a second LIVE workflow agent). Different defect. NOT twin-authority glass. Do not reuse live / schismed / resume-while-live.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs). Different defect. NOT wheat leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Waif** (prior catalog). Different defect. Do not reuse that slug.

**NOT Ashpan/#93780** (delete_session burns ledger, jsonl remains). Different defect. NOT industrial grate. Do not reuse swept / ashpanned / orphan-jsonl.

**NOT Snatch** (prior catalog). Different defect. Do not reuse that slug.

**NOT Disseisin/#93574** (Cowork session home evaporates on VM restart). Different defect. NOT court of novel disseisin / freehold manor roll. Do not reuse seised / disseised / home-evaporated.

**NOT Simplex/#93801** (mobile Remote Control send vanishes). Different defect. NOT radio chassis. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Changeling/#93757** (remote reconnect re-injects the global default model). Different defect. Do not reuse pledged / swapped.

**NOT Galley/#93745** (Stop hook dirty-tree billing). Different defect. NOT printer's galley / wet-proof. Do not reuse dry / billed / stop-dirty.

Do NOT rename Scissel to any existing catalog slug. Catalog currently has 328 products; Scissel is #329 after Feoffee #328.
Do NOT reuse idle vested / unseised / preview-eperm / singular / apographed / reopen-fork / equalized / blown / socat-race / legible / scotomized / command-args-blind / calibrated / aneroided / wrong-window-ring / tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / gleaned / orphaned / inherited / seised / disseised / intact / armed / coil-pulled.

Display here is **Oswald**. Body is **IBM Plex Sans**. Mono is **IBM Plex Mono**.

Different surface: Windows argv `-c` truncation / `\\` collapse vs preview_start getcwd EPERM vs Desktop sidebar reopen session-ID fork vs sandbox socat race vs Stop-condition evaluator vs VS Code context-ring vs Claude-in-Chrome MCP hollow registration vs Settings toggle fidelity vs DECSTBM blank-row undershoot vs VS Code OneDrive spawn mislabel vs Cowork home evaporate.

Different UI: slag floor / planchet silver / copper die / punch ink / hazard amber / scrap rust / hopper vs die vs scrap lanes. Oswald / IBM Plex Sans / IBM Plex Mono. NOT oak panel parchment. NOT cream parchment scriptorium. NOT navy hull. NOT Humphrey bowl. NOT sealed gauge. NOT museum vitrine. NOT coil-plunger. NOT limestone column. NOT aged newsprint. NOT court of novel disseisin.

Different verbs: Admit plenary, Score scissel, Walk argv-trunc, Compare plenary / scisselled, Pin idle plenary, Pin seeded scisselled, Pin argv-trunc, Strike the die.

Different idle: **plenary**. Different #93915 seeded path: **scisselled**. HOLD: **plenary** / **hold**. ALARM: **scisselled** / **scissel** / **argv-trunc** / **trunc-8203**. Path: **argv-trunc**.

## How to score

```bash
node --test projects/scissel/scissel.test.mjs
node projects/scissel/scissel.mjs projects/scissel/data/scisselled.json
echo '{"seed":"scisselled"}' | node projects/scissel/scissel.mjs
```

Open the living card at `projects/scissel/index.html` (or the live path `/scissel/`). Buttons: Admit plenary, Score scissel, Walk argv-trunc, Compare plenary / scisselled, Pin idle plenary, Pin seeded scisselled, Pin argv-trunc, Strike the die. Toggle chips for: argv-trunc, trunc-8203, slash-collapse, stack-8192, eval-wrapper — the score flips. Lay a fixture JSON on the press bed. `?embed=1` hides chrome.

The booth reconstructs the reporter’s 8203 / 8192 / 295 B / bash -s walk from the published #93915 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/scissel/
- Folder: `projects/scissel/`
