# Canard

A **press-room / newspaper-canard / duck-press booth** — a fabricated wire story. Fonts **Newsreader** (display) + **DM Sans** (body) + **Roboto Mono** (mono). Palette: aged newsprint `#E4D4A4`, ink `#1F1810`, ENOENT stamp `#8B241C`, OneDrive cloud strip `#3E6F96`, wire-service amber `#A67C2A`, candid green `#3F5C3A`. Wire ticker, crossed-out musl/glibc headline, duck silhouette press mark, ENOENT rubber stamp, OneDrive cloud-path strip, VS Code IDE chip. NOT Stet (copy-desk / blue-pencil / galley), NOT Blindside (sideline scout / turf), NOT Interdict (papal/vellum), NOT Simplex (radio chassis), NOT Deadkey (typewriter platen), NOT Gleaner (wheat leftover-harvest), NOT Schism (twin glass), NOT Rasure (parchment scrape), NOT Ashpan (foundry ashpan). This is specifically: **VS CODE EXTENSION SPAWN ENOENT UNDER ONEDRIVE CWD, THEN A MUSL/GLIBC FALSE HEADLINE ON WINDOWS.**

The wire should stay **candid** (HOLD: surface ENOENT / cwd honestly; no Linux linker tale). Instead the booth was **canarded** after an **onedrive-cwd-mislabel**.

Primary:

- [anthropics/claude-code#93766](https://github.com/anthropics/claude-code/issues/93766) (OPEN). Title: `[BUG] VS Code extension fails to spawn \`claude\` binary when workspace folder is under a OneDrive-synced path (misleading "musl/glibc" error on Windows)`. Labels: bug, has repro, platform:windows, area:ide, platform:vscode. Claude Code VS Code extension `anthropic.claude-code-2.1.269-win32-x64` on Windows 10/11. When the workspace folder lives inside a OneDrive-synced directory (here an OneDrive-redirected Desktop), the extension fails to spawn `claude`. The log shows real OS error `spawn C:\Users\<user>\.local\bin\claude.exe ENOENT` even though the exe exists and runs standalone (`claude --version`); then a misleading musl/glibc dynamic-linker mismatch message (Linux-only) on Windows. The same binary config works from a non-OneDrive folder (`C:\Projects\test`). Only workspace/cwd location differs. Same failure with the bundled native-binary and with `claudeCode.claudeProcessWrapper` pointed at a verified standalone CLI. Files fully hydrated, not cloud-only placeholders. Antivirus, corrupted download, stale extension, and wrapper misconfiguration already ruled out. No numbered cousins were cited in #93766 (reporter searched). Backups cite-only (next focus only — do not auto-pick): #93764 #93754 #93744 #93782 #93821 #93811 #93809 #93751 #93772 #93770 #93777.

02:50 canard: a press-room / newspaper-canard booth for #93766. Idle **candid** / seeded **canarded** / path **onedrive-cwd-mislabel**. Score canard or admit candid.

Score canard or admit candid.

Idle word: **candid** (HOLD: surface ENOENT / cwd honestly; no Linux linker tale). HOLD aliases: candid, honest-spawn, plain-enoent, windows-honest. Seeded word: **canarded** / #93766 (misdiagnosed as musl/glibc while spawn ENOENT under OneDrive cwd). Path word: **onedrive-cwd-mislabel**. Product score: **canard**. Never idle stetted / rewound / stet / mic-resume-wipe / sighted / blindsided / blindside / compare-ref-unreachable / scoped / interdicted / interdict / chrome-prohibit-bleed / duplex / simplexed / simplex / mobile-uplink-silent / keyed / deadkeyed / deadkey / esc-csi-dead / gleaned / orphaned / gleaner / unreaped-ampersand / live / schismed / schism / resume-while-live / intact / rasured / rasure / creation-time-flip / swept / ashpanned / ashpan / orphan-jsonl / voiced / muted / sourdine / mid-narration / released / frozen / sostenuto / tabula / rescript / cachet / ukase.

Phrase: **Score canard or admit candid.**

- **candid** = IDLE: HOLD; surface ENOENT / cwd honestly; no Linux linker tale
- **canarded** = #93766 seeded path: musl/glibc printed on Windows after spawn ENOENT under OneDrive cwd
- **canard** = product score word for the newspaper-canard booth
- **onedrive-cwd-mislabel** = path word: OneDrive cwd + ENOENT then a fabricated linker story
- **hold** = HOLD alias for idle candid
- **honest-spawn** = HOLD alias: spawn result named as it is
- **plain-enoent** = HOLD alias: real OS error stays the headline
- **windows-honest** = HOLD alias: no Linux linker tale on Windows
- **spawn-enoent** = real OS error `spawn ...\claude.exe ENOENT` while the exe exists
- **musl-mislabel** = false musl/glibc dynamic-linker mismatch on Windows
- **onedrive-cwd** = workspace cwd under OneDrive-synced path; same binary works from `C:\Projects\test`
- **has-repro** = published shape: VS Code extension 2.1.269; OneDrive Desktop cwd; ENOENT then musl tale
- **cousins** = #93766 cites no numbered cousins — reporter searched
- **backups** = cite-only #93764 #93754 #93744 #93782 #93821 #93811 #93809 #93751 #93772 #93770 #93777 — do not auto-pick
- **fixtures** = aged newsprint / wire ticker / ENOENT stamp / crossed-out musl headline / OneDrive strip
- **walk** = published idle candid → onedrive-cwd-mislabel → canarded → canard

Verdicts: candid, canarded, canard, onedrive-cwd-mislabel, hold, honest-spawn, plain-enoent, windows-honest, spawn-enoent, musl-mislabel, onedrive-cwd, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **canarded** / **canard** or already **candid**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): spawn fails because OneDrive-backed cwd/reparse interacts badly with the extension's spawn, and a Linux linker heuristic mislabels the ENOENT — not because the binary is musl/glibc incompatible on Windows. Invite verify against #93766 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93766](https://github.com/anthropics/claude-code/issues/93766)
- Cite-only cousins: none numbered in the issue text. The reporter searched existing issues and this had not been reported. Do not rebuild catalogued Windows/IDE issues as cousins.
- Backups (data only; next focus only — do not auto-pick): #93764, #93754, #93744, #93782, #93821, #93811, #93809, #93751, #93772, #93770, #93777

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:windows, area:ide, platform:vscode
- Environment: Windows 10/11; VS Code extension `anthropic.claude-code-2.1.269-win32-x64`; Claude Code 2.1.269
- Workspace under OneDrive-synced path (`c:\Users\<user>\OneDrive\Desktop\<project>`), files fully downloaded/hydrated
- Spawn fails: `spawn C:\Users\<user>\.local\bin\claude.exe ENOENT`
- Then: musl-vs-glibc dynamic linker mismatch message (Linux-only concept) on Windows
- Same binary works from `C:\Projects\test` with no config change
- Both bundled `...\resources\native-binary\claude.exe` and standalone `%USERPROFILE%\.local\bin\claude.exe` fail when spawned by the extension
- Ruled out: Antivirus/Defender, corrupted download, stale extension, `claudeProcessWrapper` misconfig, cloud-only placeholders

Problem found: VS CODE EXTENSION SPAWN ENOENT UNDER ONEDRIVE CWD, THEN A MUSL/GLIBC FALSE HEADLINE ON WINDOWS.

Why this solution: living catalog page + node diagnostic encoding idle **candid** / seeded **canarded** / path **onedrive-cwd-mislabel** so operators can score whether the booth is a **canard** or already **candid**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Claude launches normally from a OneDrive-synced workspace
2. When spawn fails, surface the actual OS error (ENOENT, EACCES) rather than a generic musl/glibc message
3. Warn when the workspace cwd sits inside a cloud-sync-managed folder

## Why not a clone

This is specifically: **VS CODE EXTENSION SPAWN ENOENT UNDER ONEDRIVE CWD, THEN A MUSL/GLIBC FALSE HEADLINE ON WINDOWS.**

Novel paradigm: press-room / newspaper-canard / duck-press — a fabricated wire story.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits on mic resume). Different defect. NOT copy-desk / blue-pencil / galley-proof. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work; compare ref unreachable). Different defect. NOT sideline-scout / night turf / floodlight. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum / wax seal / diocese. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Simplex/#93801** (mobile Remote Control send vanishes while desktop→phone still reads). Different defect. NOT radio chassis / RX downlink / TX uplink / PTT. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen / dead-key lever. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat/field leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage to a LIVE Workflow agent resumes a second copy). Different defect. NOT twin glass / dual-writer. Do not reuse live / schismed / resume-while-live.

**NOT Rasure/#93791** (`~/.claude` wipe + CreationTime flip). Different defect. NOT parchment rasure / wholesale recreate. Do not reuse intact / rasured / creation-time-flip.

**NOT Ashpan/#93780** (delete_session leftover jsonl). Different defect. NOT industrial grate / ashpan / foundry. Do not reuse swept / ashpanned / orphan-jsonl.

Do NOT rename Canard to any existing catalog slug. Catalog currently has 319 products; Canard is #320 after Stet #319.
Do NOT reuse idle stetted / rewound / sighted / blindsided / scoped / interdicted / duplex / simplexed / keyed / deadkeyed / gleaned / orphaned / live / schismed / intact / rasured / swept / ashpanned.

Display here is **Newsreader**. Body is **DM Sans**. Mono is **Roboto Mono**.

Different surface: VS Code extension spawn under OneDrive cwd vs desktop Windows dictation buffer-over-edit vs worktree compare-ref gap vs chrome MCP jurisdiction bleed vs mobile Remote Control uplink vanish vs ESC-CSI dead composer.

Different UI: aged newsprint / wire ticker / ENOENT stamp / crossed-out musl headline / OneDrive cloud-path strip / duck press mark. Newsreader / DM Sans / Roboto Mono. Newsprint / ink / stamp crimson / cloud / wire amber. NOT cream galley. NOT night turf. NOT papal vellum. NOT radio chassis. NOT typewriter platen.

Different verbs: Admit candid, Score canard, Walk onedrive-cwd-mislabel, Compare candid / canarded, Pin idle candid, Pin seeded canarded, Pin onedrive-cwd-mislabel, Hold the candid.

Different idle: **candid**. Different #93766 seeded path: **canarded**. HOLD: **candid** / **hold**. ALARM: **canarded** / **canard** / **onedrive-cwd-mislabel** / **spawn-enoent**. Path: **onedrive-cwd-mislabel**.

## How to score

```bash
node --test projects/canard/canard.test.mjs
node projects/canard/canard.mjs projects/canard/data/canarded.json
echo '{"seed":"canarded"}' | node projects/canard/canard.mjs
```

Open the living card at `projects/canard/index.html` (or the live path `/canard/`). Buttons: Admit candid, Score canard, Walk onedrive-cwd-mislabel, Compare candid / canarded, Pin idle candid, Pin seeded canarded, Pin onedrive-cwd-mislabel, Hold the candid. Toggle chips for: onedrive-cwd-mislabel, spawn-enoent, musl-mislabel, onedrive-cwd, honest-spawn — the score flips. Lay a fixture JSON on the wire desk. `?embed=1` hides chrome.

The booth reconstructs the reporter’s OneDrive-cwd spawn walk from the published #93766 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/canard/
- Folder: `projects/canard/`
