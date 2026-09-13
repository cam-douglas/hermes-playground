# Anarthria

An **ENT / laryngology / voice-clinic booth** — vertical voice-strip, laryngoscope chart, glottis rings, clipboard-to-larynx stack, mute-rose when the paste is swallowed. Fonts **Fraunces** (display) + **Karla** (body) + **JetBrains Mono** (chips). Palette: clinic teal `#2A6F6A`, warm paper `#F7F3EB`, ink `#1C1A17`, voice-amber `#C47A2C`, mute-rose `#A84B5B`. NOT Trismus/#93823 (oral-surgery lockjaw / enamel tile). NOT Foundling/#93889 (subagent Bash orphaning). NOT Gleaner/#93794 (unreaped `&`). NOT Schism/#93797 (dual-writer). NOT Tessera (mosaic), NOT Crasis (vellum/ligature), NOT Mojibake (compositor), NOT Scissel (mint), NOT Feoffee (chancery), NOT Apograph (scriptorium leaves), NOT Airlock (pressure-lock), NOT Scotoma (perimetry), NOT Aneroid (barometer), NOT Simulacrum (museum mannequins), NOT Solenoid (switchgear), NOT Scotia (molding), NOT Canard (press room), NOT Stet (copy desk), NOT Deadkey (platen), NOT Rasure (parchment scrape). Completely different UI/UX/metaphor. This is specifically: **VOICE ARRIVES AT THE CLIPBOARD BUT THE LARYNX OF THE PROMPT STAYS SILENT — CLAUDE CODE 2.1.269 SILENTLY DROPS WISPR FLOW DICTATION PASTE (CLIPBOARD + CTRL+V) IN THE VS CODE INTEGRATED TERMINAL OVER REMOTE-WSL.**

The larynx should stay **articulate** (HOLD: paste lands; prompt receives dictation). Instead the booth was **anarthria** after a **dictation-paste-drop**.

Primary:

- [anthropics/claude-code#93782](https://github.com/anthropics/claude-code/issues/93782) (OPEN). Title: `[BUG] Regression in 2.1.269: dictation-tool paste (clipboard + simulated Ctrl+V) not inserted in VS Code integrated terminal (WSL2) — 2.1.268 works`. Labels: bug, has repro, area:tui, area:ide, platform:vscode, regression, platform:wsl. After auto-updating to 2.1.269, text inserted by a voice dictation tool (Wispr Flow — clipboard + simulated Ctrl+V) is no longer inserted into the Claude Code prompt when Claude Code runs in the VS Code integrated terminal (Remote-WSL). Nothing appears in the prompt; the text is silently dropped. Running 2.1.268 in the exact same terminal works. 2.1.269 in Windows Terminal (same WSL distro) works. Plain bash and PowerShell in the same VS Code terminal work. Failure is exactly the intersection *2.1.269 × VS Code integrated terminal*. Ruled out: VS Code screen-reader mode, Claude Code voice mode, extension version, IDE integration, Wispr Flow version. Cousin cite-only: microsoft/vscode#282290 (Wispr/screen-reader detection — ruled out by reporter). Backups cite-only (next focus only — do not auto-pick): #93772 #93770 #93777 #93821 #93811 #93809 #93924 #93925 #93954 #93967 #93957 #93823. Stay off Trismus/Foundling/Gleaner/Schism/Crasis/Tessera/Mojibake/Scissel/Feoffee/Apograph/Airlock/Scotoma/Aneroid/Simulacrum/Solenoid/Scotia/Canard/Stet/Deadkey/Rasure paradigms.

18:50 anarthria: an ENT / laryngology / voice-clinic booth for #93782. Idle **articulate** / seeded **anarthria** / path **dictation-paste-drop**. Score anarthria or admit articulate.

Score anarthria or admit articulate.

Idle word: **articulate** (HOLD: paste lands; prompt receives dictation). HOLD aliases: articulate, phonated, received, landing, larynx-open, clipboard-heard. Seeded word: **anarthria** / #93782 (dictation Ctrl+V silently dropped in VS Code WSL terminal on 2.1.269). Path word: **dictation-paste-drop**. Product score: **anarthria**. Never idle limber / trismus / filiated / injective / crased / unitary / tessellated / verbatim / plenary / vested / singular / equalized / legible / calibrated / tethered / engaged / flush / candid / stetted / scisselled / unseised / apographed / mojibaked / fffd-spall / gleaned / orphaned / intact / rasured / bonded / registered / warded / parented.

Phrase: **Score anarthria or admit articulate.**

- **articulate** = IDLE: HOLD; paste lands; prompt receives dictation; larynx open
- **anarthria** = #93782 seeded path and product score: 2.1.269 × VS Code WSL terminal silently drops Wispr Flow Ctrl+V
- **dictation-paste-drop** = path word: clipboard + simulated Ctrl+V never reaches the Claude Code prompt
- **hold** = HOLD alias for idle articulate
- **phonated** = HOLD alias: voice produced; prompt phonates the paste
- **received** = HOLD alias: prompt receives dictation
- **landing** = HOLD alias: paste lands in the prompt
- **larynx-open** = HOLD alias: glottis open; insert path live
- **clipboard-heard** = HOLD alias: voice arrived at the clipboard and the prompt took it
- **wispr-ctrlv** = Wispr Flow writes the clipboard and simulates Ctrl+V
- **vscode-wsl** = Claude Code in the VS Code integrated terminal over Remote-WSL
- **regression-21269** = 2.1.269 silently swallows paste that 2.1.268 accepted
- **windows-terminal-ok** = contrast: 2.1.269 in Windows Terminal inserts dictation
- **plain-bash-ok** = contrast: plain bash in the same VS Code terminal inserts dictation
- **silent-drop** = nothing appears in the prompt; the text is silently dropped
- **has-repro** = published shape: 2.1.269 / VS Code WSL / Wispr clipboard+Ctrl+V / silent prompt
- **cousins** = cite-only microsoft/vscode#282290
- **backups** = cite-only #93772 #93770 #93777 #93821 #93811 #93809 #93924 #93925 #93954 #93967 #93957 #93823 — do not auto-pick
- **fixtures** = clinic teal / warm paper / ink / voice-amber / mute-rose
- **walk** = published idle articulate → dictation-paste-drop → anarthria

Verdicts: articulate, anarthria, dictation-paste-drop, hold, phonated, received, landing, larynx-open, clipboard-heard, wispr-ctrlv, vscode-wsl, regression-21269, windows-terminal-ok, plain-bash-ok, silent-drop, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **anarthria** or already **articulate**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): 2.1.269 terminal keyboard-input parser changes (F1/F2/F4 in kitty-protocol terminals, Delete in st, Alt+arrows in rxvt-unicode, Shift+punctuation in WezTerm) have a side effect on how pasted input from xterm.js (VS Code's terminal) is consumed. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93782](https://github.com/anthropics/claude-code/issues/93782)
- Cite-only cousin: [microsoft/vscode#282290](https://github.com/microsoft/vscode/issues/282290) (Wispr/screen-reader detection — ruled out by reporter). Do not rebuild as a separate booth.
- Backups (data only; next focus only — do not auto-pick): #93772, #93770, #93777, #93821, #93811, #93809, #93924, #93925, #93954, #93967, #93957, #93823

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, area:tui, area:ide, platform:vscode, regression, platform:wsl
- Claude Code 2.1.269 (native installer, WSL2 Ubuntu); Windows 11; VS Code 1.137.0 Remote-WSL; extension 2.1.269
- Wispr Flow 1.6.827 inserts text via clipboard + simulated Ctrl+V
- After auto-updating to 2.1.269, dictation is no longer inserted into the Claude Code prompt in the VS Code integrated terminal
- Nothing appears in the prompt; the text is silently dropped
- 2.1.268 in the exact same terminal works
- 2.1.269 in Windows Terminal (same WSL distro) works
- Plain bash and PowerShell in the same VS Code terminal work
- Failure is exactly 2.1.269 × VS Code integrated terminal
- Ruled out: screen-reader mode, Claude Code voice mode, extension version, IDE integration, Wispr Flow version

Problem found: VOICE ARRIVES AT THE CLIPBOARD BUT THE LARYNX OF THE PROMPT STAYS SILENT — CLAUDE CODE 2.1.269 SILENTLY DROPS WISPR FLOW DICTATION PASTE (CLIPBOARD + CTRL+V) IN THE VS CODE INTEGRATED TERMINAL OVER REMOTE-WSL.

Why this solution: living catalog page + node diagnostic encoding idle **articulate** / seeded **anarthria** / path **dictation-paste-drop** so operators can score whether the booth is **anarthria** or already **articulate**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Dictation paste (clipboard + simulated Ctrl+V) must insert into the Claude Code prompt
2. Same insert behavior in the VS Code integrated terminal as in Windows Terminal / plain bash / PowerShell
3. 2.1.269 must not silently drop paste that 2.1.268 accepted in the same terminal

## Why not a clone

This is specifically: **VOICE ARRIVES AT THE CLIPBOARD BUT THE LARYNX OF THE PROMPT STAYS SILENT — CLAUDE CODE 2.1.269 SILENTLY DROPS WISPR FLOW DICTATION PASTE (CLIPBOARD + CTRL+V) IN THE VS CODE INTEGRATED TERMINAL OVER REMOTE-WSL.**

Novel paradigm: ENT / laryngology / voice-clinic — vertical voice-strip, laryngoscope chart, glottis rings, clipboard-to-larynx stack.

**NOT Trismus/#93823** (macOS UNUserNotification / XPC lock-order main-thread deadlock). Different defect. NOT oral-surgery / lockjaw / enamel tile / forceps tray. Do not reuse limber / trismus / notif-xpc-deadlock. Trismus is a completion-chime freeze; Anarthria is a dictation paste that never reaches the prompt.

**NOT Foundling/#93889** (subagent lifecycle does not reap `run_in_background` Bash). Different defect. NOT foundling-hospital / parish-ward / foundling-wheel. Do not reuse filiated / foundling / subagent-bash-outlive.

**NOT Gleaner/#93794** (Background `&` jobs in a Bash tool call orphaned to PID 1). Different defect. NOT agricultural leftover-harvest / wheat / stubble / sickle. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage resumes a second copy while the original still runs). Different defect. NOT twin-authority glass / dual-writer. Do not reuse live / schismed / resume-while-live.

**NOT Crasis/#93960** (non-injective store slug fuses two project paths). Different defect. NOT manuscript crasis / fused ligature / vellum drawers. Do not reuse injective / crased / store-slug-collide.

**NOT Tessera/#93929** (macOS version-named binary path → TCC row per release). Different defect. NOT mosaic / tesserae / privacy-pane. Do not reuse unitary / tessellated / version-path-tcc.

**NOT Mojibake/#93848** (Windows embedded CLAUDE.md UTF-8 → three U+FFFD). Different defect. NOT compositor / foul-proof / geta-tofu. Do not reuse verbatim / mojibaked / fffd-spall.

**NOT Scissel/#93915** (Windows Bash argv `-c` 8203 truncation / `\\` collapse). Different defect. NOT mint / coin-press / punch-and-scissel. Do not reuse plenary / scisselled / argv-trunc.

**NOT Feoffee/#93863** (preview_start getcwd EPERM despite parent FDA). Different defect. NOT medieval feoffment / livery-of-seisin / chancery. Do not reuse vested / unseised / preview-eperm.

**NOT Apograph/#93859** (Desktop reopen forks a full transcript copy). Different defect. NOT scriptorium / stacked parchment leaves / session-ID wax seals. Do not reuse singular / apographed / reopen-fork.

**NOT Airlock/#93862** (sandbox socat proxy readiness race). Different defect. NOT submarine / spacecraft pressure-lock. Do not reuse equalized / blown / socat-race.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT ophthalmology / Humphrey bowl / perimetry. Do not reuse legible / scotomized / command-args-blind.

**NOT Aneroid/#93901** (VS Code context ring ignores autoCompactWindow). Different defect. NOT aneroid-barometer / instrument-panel / sealed gauge. Do not reuse calibrated / aneroided / wrong-window-ring.

**NOT Simulacrum/#93751** (Claude-in-Chrome hollow MCP success). Different defect. NOT Baudrillard / hyperreality museum. Do not reuse tethered / hollow / phantom-navigate.

**NOT Solenoid/#93754** (Desktop Settings RC toggle fidelity). Different defect. NOT industrial switchgear / solenoid-coil. Do not reuse engaged / inert / warm-before-message.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows). Different defect. NOT limestone / shadow-gap. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd). Different defect. NOT press-room. Do not reuse candid / canarded / onedrive-cwd.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk. Do not reuse stetted / rewound / mic-resume-wipe. Stet is a composer buffer rewrite; Anarthria is a terminal paste that never lands.

**NOT Deadkey/#93788** (ESC-CSI never resolve). Different defect. NOT typewriter platen. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Rasure/#93791** (CreationTime flip / parchment scrape). Different defect. Do not reuse intact / rasured / creation-time-flip.

**NOT Hysteresis** (B-H curve / remanence / Syne+Figtree+IBM Plex Mono). Different defect and different fonts.

Do NOT rename Anarthria to any existing catalog slug. Catalog currently has 334 products; Anarthria is #335 after Trismus #334.
Do NOT reuse idle limber / trismus / notif-xpc-deadlock / filiated / injective / crased / store-slug-collide / unitary / tessellated / version-path-tcc / verbatim / plenary / vested / unseised / preview-eperm / singular / apographed / reopen-fork / equalized / blown / socat-race / legible / scotomized / command-args-blind / calibrated / aneroided / wrong-window-ring / tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / gleaned / orphaned / inherited / unreaped-ampersand / credentialed / outridden / early-connect / intact / rasured / creation-time-flip / scisselled / argv-trunc / mojibaked / mojibake / fffd-spall / bonded / registered / warded / parented.

Display here is **Fraunces**. Body is **Karla**. Mono is **JetBrains Mono**.

Different surface: dictation→clipboard→Ctrl+V insert that never reaches the Claude Code prompt in the VS Code WSL terminal on 2.1.269 vs macOS UNUserNotification XPC lockjaw vs subagent `run_in_background` Bash that outlives the child agent vs Bash-call `&` leftover harvest vs dual-writer resume vs non-injective store slug vs version-named TCC path vs Windows embedded CLAUDE.md U+FFFD vs argv `-c` truncation vs preview_start getcwd EPERM vs Desktop sidebar reopen session-ID fork vs sandbox socat race.

Different UI: clinic teal / warm paper / ink / voice-amber / mute-rose / vertical voice-strip / laryngoscope chart / glottis rings. Fraunces / Karla / JetBrains Mono. NOT enamel tile. NOT linen hatch. NOT wheat stubble. NOT twin pulpits. NOT vellum ligature. NOT limestone mosaic. NOT rice-paper type case. NOT slag floor copper die. NOT oak panel parchment. NOT cream parchment scriptorium. NOT navy hull. NOT Humphrey bowl. NOT sealed gauge. NOT museum vitrine. NOT coil-plunger. NOT limestone column-molding. NOT aged newsprint. NOT B-H remanence curve. NOT bilge limber-hole.

Different verbs: Admit articulate, Score anarthria, Walk dictation-paste-drop, Compare articulate / anarthria, Pin idle articulate, Pin seeded anarthria, Pin dictation-paste-drop, Unmute the larynx.

Different idle: **articulate**. Different #93782 seeded path: **anarthria**. HOLD: **articulate** / **hold**. ALARM: **anarthria** / **dictation-paste-drop** / **wispr-ctrlv** / **silent-drop**. Path: **dictation-paste-drop**.

## How to score

```bash
node --test projects/anarthria/anarthria.test.mjs
node projects/anarthria/anarthria.mjs projects/anarthria/data/anarthria.json
echo '{"seed":"anarthria"}' | node projects/anarthria/anarthria.mjs
```

Open the living card at `projects/anarthria/index.html` (or the live path `/anarthria/`). Buttons: Admit articulate, Score anarthria, Walk dictation-paste-drop, Compare articulate / anarthria, Pin idle articulate, Pin seeded anarthria, Pin dictation-paste-drop, Unmute the larynx. Toggle chips for: dictation-paste-drop, wispr-ctrlv, vscode-wsl, silent-drop — the score flips. Lay a fixture JSON on the voice chart. `?embed=1` hides chrome.

The booth reconstructs the reporter’s Wispr Flow / clipboard+Ctrl+V / 2.1.269 × VS Code WSL walk from the published #93782 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/anarthria/
- Folder: `projects/anarthria/`
