# Scotia

A **classical scotia / shadow-gap / column-molding booth** — a concave molding that leaves a hollow band under a column. Fonts **Cormorant Garamond** (display) + **Outfit** (body) + **IBM Plex Mono** (mono). Palette: limestone `#D8D0C0`, shadow-gap charcoal `#1A1814`, VTE amber `#C48A2A`, scroll-region teal `#2F6F6A`, blank-row void `#0E0D0B`, flush green `#3F5C3A`, scotia hollow `#5A4E3A`. Column base with scotia hollow profile, DECSTBM scroll-region brackets, VTE chip, 2–3 blank-row void strip under a prompt block, Linux platform chip, XTVERSION strip. NOT Canard (press-room / newspaper-canard), NOT Stet (copy-desk / blue-pencil / galley), NOT Blindside (sideline scout / turf), NOT Interdict (papal/vellum), NOT Simplex (radio chassis), NOT Deadkey (typewriter platen), NOT Gleaner (wheat leftover-harvest), NOT Schism (twin glass), NOT Rasure (parchment scrape), NOT Ashpan (foundry ashpan). This is specifically: **DECSTBM RENDERER LEAVES 2–3 BLANK ROWS UNDER THE PROMPT ON LINUX VTE / BLACK BOX.**

The column should stay **flush** (HOLD: bottom block ends on the last terminal row; no hollow gap). Instead the booth was **scotiated** after a **decstbm-undershoot**.

Primary:

- [anthropics/claude-code#93764](https://github.com/anthropics/claude-code/issues/93764) (OPEN). Title: `[BUG] DECSTBM renderer leaves 2-3 blank rows under the prompt on Linux (VTE / Black Box)`. Labels: bug, has repro, platform:linux, area:tui. Claude Code 2.1.267 native Linux. Terminal: Black Box (VTE 0.84, `XTVERSION` reply `VTE(8401)`), `TERM=xterm-256color`, no tmux/zellij. Once the conversation fills the screen, the TUI stops 2–3 rows short of the window bottom. Blank rows sit below the last line of the bottom block (the auto-mode hint, or the remote-control indicator when shown). Sometimes one more blank row is added during a session. The rows stay empty at all times. On macOS with the same setup (Claude Code 2.1.268 on kitty, iTerm2, Terminal.app) the bottom block ends on the last row. Ruled out: terminal padding (plain shell uses every row), statusLine script variants, env pollution (`env -i` same gap), `LINES`/`COLUMNS`, other Linux emulators still show the gap. Debug: `DECSTBM: enabled` (TMUX/ZELLIJ unset, TERM_PROGRAM=Black Box). Renderer enabled via `CLAUDE_CODE_DECSTBM` or remote gate `tengu_marlin_porch`; env var unset so the gate is on. No local toggle to disable. Looks like the bottom block is laid out taller than drawn; extra rows are cleared instead of being given back to content. Cousins cite-only: #4136 (closed stale — blank space bottom Linux), #83660 (one unused row under tmux). Backups cite-only (next focus only — do not auto-pick): #93754 #93744 #93782 #93821 #93811 #93809 #93751 #93772 #93770 #93777 #93823.

03:50 scotia: a classical scotia / shadow-gap / column-molding booth for #93764. Idle **flush** / seeded **scotiated** / path **decstbm-undershoot**. Score scotia or admit flush.

Score scotia or admit flush.

Idle word: **flush** (HOLD: bottom block ends on last terminal row; no hollow gap). HOLD aliases: flush, seated, last-row, mac-flush. Seeded word: **scotiated** / #93764 (2–3 blank rows under the bottom block on Linux VTE with DECSTBM on). Path word: **decstbm-undershoot**. Product score: **scotia**. Never idle canard / candid / canarded / onedrive-cwd-mislabel / stet / stetted / rewound / mic-resume-wipe / sighted / blindsided / blindside / compare-ref-unreachable / scoped / interdicted / interdict / chrome-prohibit-bleed / duplex / simplexed / simplex / mobile-uplink-silent / keyed / deadkeyed / deadkey / esc-csi-dead / gleaned / orphaned / gleaner / unreaped-ampersand / live / schismed / schism / resume-while-live / intact / rasured / rasure / creation-time-flip / swept / ashpanned / ashpan / orphan-jsonl.

Phrase: **Score scotia or admit flush.**

- **flush** = IDLE: HOLD; bottom block ends on the last terminal row; no hollow gap
- **scotiated** = #93764 seeded path: 2–3 blank rows under the bottom block on Linux VTE with DECSTBM on
- **scotia** = product score word for the column-molding / shadow-gap booth
- **decstbm-undershoot** = path word: reserved chrome taller than drawn; extra rows cleared, not returned
- **hold** = HOLD alias for idle flush
- **seated** = HOLD alias: bottom block seated on the last row
- **last-row** = HOLD alias: last terminal row is the last drawn row
- **mac-flush** = HOLD alias: macOS kitty/iTerm/Terminal.app stay flush
- **blank-band** = 2–3 empty rows under the bottom block; stay empty forever
- **vte-scroll** = VTE(8401) Black Box Linux scroll-region path
- **tengu-marlin-porch** = remote gate enables DECSTBM; env unset; no disable
- **has-repro** = published shape: Linux 2.1.267; Black Box VTE 0.84; DECSTBM on; 2–3 blank rows
- **cousins** = cite-only #4136 (closed stale) and #83660 (tmux unused row)
- **backups** = cite-only #93754 #93744 #93782 #93821 #93811 #93809 #93751 #93772 #93770 #93777 #93823 — do not auto-pick
- **fixtures** = limestone / scotia hollow / DECSTBM brackets / VTE chip / blank-row void / XTVERSION
- **walk** = published idle flush → decstbm-undershoot → scotiated → scotia

Verdicts: flush, scotiated, scotia, decstbm-undershoot, hold, seated, last-row, mac-flush, blank-band, vte-scroll, tengu-marlin-porch, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **scotiated** / **scotia** or already **flush**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): bottom chrome height reservation under DECSTBM is oversized vs what is drawn on VTE Linux, so cleared margin rows appear as a permanent blank band; macOS default path does not hit that undershoot. Invite verify against #93764 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93764](https://github.com/anthropics/claude-code/issues/93764)
- Cite-only cousins: #4136 (closed stale — blank space at the bottom of the terminal on Linux). #83660 (one unused row under tmux, a similar height reservation). Do not rebuild those as separate booths.
- Backups (data only; next focus only — do not auto-pick): #93754, #93744, #93782, #93821, #93811, #93809, #93751, #93772, #93770, #93777, #93823

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:linux, area:tui
- Environment: Claude Code 2.1.267 native Linux; Black Box VTE 0.84 (`XTVERSION` → `VTE(8401)`); `TERM=xterm-256color`; no tmux/zellij
- Once the conversation fills the screen, the TUI stops 2–3 rows short of the window bottom
- Blank rows sit below the last line of the bottom block (auto-mode hint / remote-control indicator)
- Sometimes one more blank row appears mid-session; rows stay empty forever
- macOS 2.1.268 kitty/iTerm/Terminal.app does NOT show the gap — bottom block ends on last row
- Ruled out: terminal padding, statusLine variants, env pollution, LINES/COLUMNS, other Linux emulators still gap
- Debug: `DECSTBM: enabled` (TMUX/ZELLIJ unset, TERM_PROGRAM=Black Box)
- Renderer enabled via `CLAUDE_CODE_DECSTBM` or remote gate `tengu_marlin_porch`; env unset so the gate is on
- No local toggle to disable

Problem found: DECSTBM RENDERER LEAVES 2–3 BLANK ROWS UNDER THE PROMPT ON LINUX VTE / BLACK BOX.

Why this solution: living catalog page + node diagnostic encoding idle **flush** / seeded **scotiated** / path **decstbm-undershoot** so operators can score whether the booth is a **scotia** or already **flush**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The bottom block should end on the last row of the terminal, as it does with the default renderer
2. Reserved chrome height should match what is actually drawn so leftover rows return to content
3. macOS flush behavior (last row seated) should hold on Linux VTE when DECSTBM is on

## Why not a clone

This is specifically: **DECSTBM RENDERER LEAVES 2–3 BLANK ROWS UNDER THE PROMPT ON LINUX VTE / BLACK BOX.**

Novel paradigm: classical scotia / shadow-gap / column-molding — a concave hollow under a stone column.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd, then a musl/glibc false headline). Different defect. NOT press-room / newspaper-canard / duck-press. Do not reuse candid / canarded / onedrive-cwd-mislabel.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits on mic resume). Different defect. NOT copy-desk / blue-pencil / galley-proof. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work; compare ref unreachable). Different defect. NOT sideline-scout / night turf / floodlight. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum / wax seal / diocese. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Simplex/#93801** (mobile Remote Control send vanishes while desktop→phone still reads). Different defect. NOT radio chassis / RX downlink / TX uplink / PTT. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen / dead-key lever. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat/field leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage to a LIVE Workflow agent resumes a second copy). Different defect. NOT twin glass / dual-writer. Do not reuse live / schismed / resume-while-live.

**NOT Rasure/#93791** (`~/.claude` wipe + CreationTime flip). Different defect. NOT parchment rasure / wholesale recreate. Do not reuse intact / rasured / creation-time-flip.

**NOT Ashpan/#93780** (delete_session leftover jsonl). Different defect. NOT industrial grate / ashpan / foundry. Do not reuse swept / ashpanned / orphan-jsonl.

Do NOT rename Scotia to any existing catalog slug. Catalog currently has 320 products; Scotia is #321 after Canard #320.
Do NOT reuse idle candid / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / duplex / simplexed / keyed / deadkeyed / gleaned / orphaned / live / schismed / intact / rasured / swept / ashpanned.

Display here is **Cormorant Garamond**. Body is **Outfit**. Mono is **IBM Plex Mono**.

Different surface: Linux VTE DECSTBM blank-row undershoot vs VS Code OneDrive spawn mislabel vs desktop Windows dictation buffer-over-edit vs worktree compare-ref gap vs chrome MCP jurisdiction bleed vs mobile Remote Control uplink vanish vs ESC-CSI dead composer.

Different UI: limestone / column-base scotia hollow / DECSTBM scroll-region brackets / VTE chip / 2–3 blank-row void strip / Linux platform chip / XTVERSION strip. Cormorant Garamond / Outfit / IBM Plex Mono. Limestone / charcoal / VTE amber / scroll teal / void / flush green / hollow umber. NOT aged newsprint. NOT cream galley. NOT night turf. NOT papal vellum. NOT radio chassis. NOT typewriter platen.

Different verbs: Admit flush, Score scotia, Walk decstbm-undershoot, Compare flush / scotiated, Pin idle flush, Pin seeded scotiated, Pin decstbm-undershoot, Hold the flush.

Different idle: **flush**. Different #93764 seeded path: **scotiated**. HOLD: **flush** / **hold**. ALARM: **scotiated** / **scotia** / **decstbm-undershoot** / **blank-band**. Path: **decstbm-undershoot**.

## How to score

```bash
node --test projects/scotia/scotia.test.mjs
node projects/scotia/scotia.mjs projects/scotia/data/scotiated.json
echo '{"seed":"scotiated"}' | node projects/scotia/scotia.mjs
```

Open the living card at `projects/scotia/index.html` (or the live path `/scotia/`). Buttons: Admit flush, Score scotia, Walk decstbm-undershoot, Compare flush / scotiated, Pin idle flush, Pin seeded scotiated, Pin decstbm-undershoot, Hold the flush. Toggle chips for: decstbm-undershoot, blank-band, vte-scroll, tengu-marlin-porch, seated — the score flips. Lay a fixture JSON on the stone desk. `?embed=1` hides chrome.

The booth reconstructs the reporter’s DECSTBM blank-row walk from the published #93764 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/scotia/
- Folder: `projects/scotia/`
