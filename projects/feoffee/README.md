# Feoffee

A **medieval feoffment / livery-of-seisin / chancery chamber booth** — letters patent of Full Disk Access, a Documents demesne map, lord lane vs mesne tenant lane vs rival-bundle walk. Fonts **Cinzel** (display) + **EB Garamond** (body) + **Fira Code** (chips/mono). Palette: oak panel `#2C2118`, parchment `#F3E6C8`, oxblood seal `#7A1F1F`, brass `#B08D57`, ink `#1A120C`, moss `#3F5D4A`. NOT Apograph (scriptorium/reopen-fork), NOT Airlock (socat-race), NOT Scotoma (command-args-blind), NOT Aneroid (wrong-window-ring), NOT Simulacrum (phantom-navigate), NOT Solenoid (warm-before-message), NOT Scotia (decstbm-undershoot), NOT Canard (onedrive-cwd), NOT Stet/Blindside/Interdict/Schism/Gleaner/Waif/Ashpan/Snatch, NOT Disseisin (court of novel disseisin / home-evaporated). Completely different UI/UX/metaphor. This is specifically: **PREVIEW_START NAMED LAUNCH.JSON → GETCWD EPERM ON DOCUMENTS DESPITE PARENT FDA.**

The charter should stay **vested** (HOLD: FDA vested through the child spawn chain; preview_start children can getcwd under Documents; TCC grants reach bash/python children). Instead the booth was **unseised** after a **preview-eperm**.

Primary:

- [anthropics/claude-code#93863](https://github.com/anthropics/claude-code/issues/93863) (OPEN, has repro). Title: `preview_start named launch.json server fails with getcwd EPERM despite confirmed Full Disk Access`. Labels: bug, has repro, platform:macos, area:desktop. A `.claude/launch.json` named dev-server (`preview_start({name: "..."})`) fails when its working directory is under `~/Documents/...`, even though desktop app `com.anthropic.claudefordesktop` holds Full Disk Access confirmed via TCC DB (`kTCCServiceSystemPolicyAllFiles|com.anthropic.claudefordesktop|2`). Failure: `getcwd: cannot access parent directories: Operation not permitted` at shell-init; then python can't open the script (Errno 1 Operation not permitted). Ruled out: directory permissions, iCloud/FileProvider, missing/stale target dir, missing FDA on the desktop app itself. Unified log: System Policy (TCC) deny against spawned bash/python3 child PIDs — not Seatbelt/App-Sandbox. Contrast: Bash-tool-spawned processes under different bundle id `com.anthropic.claude-code` can read/write/execute the SAME directory at the same time. Environment: macOS Darwin 25.6.0; Claude for Desktop 1.52386.3. Cousin cite-only: #93766 Canard (OneDrive cwd mislabel — spawn ENOENT + wrong linker message, not TCC getcwd EPERM on Documents). Backups cite-only (next focus only — do not auto-pick): #93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93924 #93848 #93929 #93915.

10:50 feoffee: a medieval feoffment / livery-of-seisin chancery booth for #93863. Idle **vested** / seeded **unseised** / path **preview-eperm**. Score feoffee or admit vested.

Score feoffee or admit vested.

Idle word: **vested** (HOLD: FDA vested through the child spawn chain; preview_start children can getcwd under Documents; TCC grants reach bash/python children). HOLD aliases: vested, letters-patent, demesne-open, rival-bundle-ok. Seeded word: **unseised** / #93863 (preview_start children hit getcwd EPERM / System Policy deny despite parent FDA). Path word: **preview-eperm**. Product score: **feoffee**. Never idle singular / apographed / equalized / blown / socat-race / scotoma / legible / scotomized / command-args-blind / aneroid / calibrated / aneroided / wrong-window-ring / simulacrum / tethered / hollow / phantom-navigate / solenoid / engaged / inert / warm-before-message / scotia / flush / scotiated / decstbm-undershoot / canard / candid / canarded / stet / stetted / rewound / blindside / sighted / blindsided / interdict / scoped / interdicted / simplex / deadkey / keyed / gleaner / gleaned / orphaned / inherited / schism / live / rasure / intact / ashpan / swept / seised / disseised.

Phrase: **Score feoffee or admit vested.**

- **vested** = IDLE: HOLD; FDA vested through the child spawn chain; preview_start children can getcwd under Documents
- **unseised** = #93863 seeded path: preview_start children hit getcwd EPERM / System Policy deny despite parent FDA
- **feoffee** = product score word for the chancery booth
- **preview-eperm** = path word: named launch.json spawn vs rival-bundle walk
- **hold** = HOLD alias for idle vested
- **letters-patent** = HOLD alias: FDA letters patent on `com.anthropic.claudefordesktop`
- **demesne-open** = HOLD alias: Documents demesne open to mesne tenants
- **rival-bundle-ok** = HOLD alias: `com.anthropic.claude-code` already walks the path
- **getcwd-eperm** = shell-init getcwd EPERM; python3 Errno 1
- **tcc-deny** = System Policy deny against spawned bash/python3 child PIDs
- **named-launch** = `preview_start({name: "..."})` against `.claude/launch.json`
- **documents-demesne** = working directory under `~/Documents/...`
- **bash-python-child** = spawned mesne tenants
- **desktop-fda** = lord holds FDA auth_value 2
- **rival-bundle** = Bash-tool children under `com.anthropic.claude-code` walk freely
- **has-repro** = published shape: Desktop 1.52386.3 / Darwin 25.6.0
- **cousins** = cite-only #93766
- **backups** = cite-only #93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93924 #93848 #93929 #93915 — do not auto-pick
- **fixtures** = oak panel / parchment / oxblood seal
- **walk** = published idle vested → preview-eperm → unseised → feoffee

Verdicts: vested, unseised, feoffee, preview-eperm, hold, letters-patent, demesne-open, rival-bundle-ok, getcwd-eperm, tcc-deny, named-launch, documents-demesne, bash-python-child, desktop-fda, rival-bundle, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **unseised** / **feoffee** or already **vested**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): child processes on the preview_start named-config path do not inherit / are not granted the desktop app's Full Disk Access. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93863](https://github.com/anthropics/claude-code/issues/93863)
- Cite-only cousin: #93766 (Canard: OneDrive cwd mislabel — spawn ENOENT + wrong linker message, not TCC getcwd EPERM on Documents). Do not rebuild as a separate booth.
- Backups (data only; next focus only — do not auto-pick): #93772, #93770, #93777, #93782, #93889, #93821, #93811, #93809, #93823, #93924, #93848, #93929, #93915

What happened (from the issue text — do not invent):

- OPEN, has repro
- Labels: bug, has repro, platform:macos, area:desktop
- Environment: macOS Darwin 25.6.0; Claude for Desktop 1.52386.3
- `.claude/launch.json` named `preview_start({name: "..."})` fails under `~/Documents/...`
- Desktop app `com.anthropic.claudefordesktop` holds FDA (`kTCCServiceSystemPolicyAllFiles|...|2`)
- Failure: getcwd EPERM at shell-init; python3 Errno 1 Operation not permitted
- Ruled out: directory permissions, iCloud/FileProvider, missing/stale target dir, missing FDA on the app itself
- Unified log: System Policy (TCC) deny against spawned bash/python3 child PIDs — not Seatbelt/App-Sandbox
- Contrast: Bash-tool processes under `com.anthropic.claude-code` read/write/execute the SAME directory at the same time

Problem found: PREVIEW_START NAMED-CONFIG CHILDREN DO NOT RECEIVE THE DESKTOP APP'S FDA ON DOCUMENTS.

Why this solution: living catalog page + node diagnostic encoding idle **vested** / seeded **unseised** / path **preview-eperm** so operators can score whether the booth is a **feoffee** or already **vested**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. `preview_start({name: "..."})` children can getcwd under `~/Documents/...` when the desktop app holds Full Disk Access
2. TCC grants on `com.anthropic.claudefordesktop` reach spawned bash/python3 children on the named-config path
3. System Policy does not deny getcwd against preview_start child PIDs while the lord bundle is vested

## Why not a clone

This is specifically: **PREVIEW_START NAMED LAUNCH.JSON → GETCWD EPERM ON DOCUMENTS DESPITE PARENT FDA.**

Novel paradigm: medieval feoffment / livery-of-seisin / chancery chamber — the lord holds letters patent, mesne tenants are barred from the Documents demesne, a rival bundle walks freely.

**NOT Apograph/#93859** (Desktop reopen forks a full transcript copy). Different defect. NOT scriptorium / stacked parchment leaves / session-ID wax seals. Do not reuse singular / apographed / reopen-fork.

**NOT Airlock/#93862** (sandbox socat proxy readiness race). Different defect. NOT submarine / spacecraft pressure-lock. Do not reuse equalized / blown / socat-race.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT ophthalmology / Humphrey bowl / perimetry. Do not reuse legible / scotomized / command-args-blind.

**NOT Aneroid/#93901** (VS Code context ring ignores autoCompactWindow). Different defect. NOT aneroid-barometer / instrument-panel / sealed gauge. Do not reuse calibrated / aneroided / wrong-window-ring.

**NOT Simulacrum/#93751** (Claude-in-Chrome hollow MCP success). Different defect. NOT Baudrillard / hyperreality museum. Do not reuse tethered / hollow / phantom-navigate.

**NOT Solenoid/#93754** (Desktop Settings RC toggle fidelity). Different defect. NOT industrial switchgear / solenoid-coil. Do not reuse engaged / inert / warm-before-message.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows). Different defect. NOT limestone / shadow-gap. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd). Different defect — spawn ENOENT + wrong linker message, not TCC getcwd EPERM on Documents. NOT press-room. Do not reuse candid / canarded / onedrive-cwd-mislabel.

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

Do NOT rename Feoffee to any existing catalog slug. Catalog currently has 327 products; Feoffee is #328 after Apograph #327.
Do NOT reuse idle singular / apographed / reopen-fork / equalized / blown / socat-race / legible / scotomized / command-args-blind / calibrated / aneroided / wrong-window-ring / tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / gleaned / orphaned / inherited / seised / disseised.

Display here is **Cinzel**. Body is **EB Garamond**. Mono is **Fira Code**.

Different surface: preview_start named launch.json getcwd EPERM vs Desktop sidebar reopen session-ID fork vs sandbox socat race vs Stop-condition evaluator vs VS Code context-ring vs Claude-in-Chrome MCP hollow registration vs Settings toggle fidelity vs DECSTBM blank-row undershoot vs VS Code OneDrive spawn mislabel vs Cowork home evaporate.

Different UI: oak panel / parchment / oxblood seal / brass / ink / moss / letters patent / demesne map / lord vs mesne vs rival lanes. Cinzel / EB Garamond / Fira Code. NOT cream parchment scriptorium. NOT navy hull. NOT Humphrey bowl. NOT sealed gauge. NOT museum vitrine. NOT coil-plunger. NOT limestone column. NOT aged newsprint. NOT court of novel disseisin.

Different verbs: Admit vested, Score feoffee, Walk preview-eperm, Compare vested / unseised, Pin idle vested, Pin seeded unseised, Pin preview-eperm, Deliver seisin.

Different idle: **vested**. Different #93863 seeded path: **unseised**. HOLD: **vested** / **hold**. ALARM: **unseised** / **feoffee** / **preview-eperm** / **getcwd-eperm**. Path: **preview-eperm**.

## How to score

```bash
node --test projects/feoffee/feoffee.test.mjs
node projects/feoffee/feoffee.mjs projects/feoffee/data/unseised.json
echo '{"seed":"unseised"}' | node projects/feoffee/feoffee.mjs
```

Open the living card at `projects/feoffee/index.html` (or the live path `/feoffee/`). Buttons: Admit vested, Score feoffee, Walk preview-eperm, Compare vested / unseised, Pin idle vested, Pin seeded unseised, Pin preview-eperm, Deliver seisin. Toggle chips for: preview-eperm, getcwd-eperm, tcc-deny, documents-demesne, named-launch — the score flips. Lay a fixture JSON on the chancery blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s getcwd-eperm / tcc-deny / rival-bundle walk from the published #93863 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/feoffee/
- Folder: `projects/feoffee/`
