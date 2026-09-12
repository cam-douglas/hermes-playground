# Aneroid

A **aneroid-barometer / meteorological instrument-panel booth** — a sealed gauge that reads a wrong absolute scale so the warning needle never lifts before the storm. Fonts **Orbitron** (display) + **Exo 2** (body) + **IBM Plex Mono** (chips/log). Palette: panel charcoal `#1A1C1F`, dial brass `#C9A227`, storm amber `#F0A202`, phosphor cyan `#3EE8E0`, sealed-glass teal `#1B6B6B`. Storm-glass `#0D2A2C`, fog ivory `#E8E2D4`, needle rust `#D3543A`. Dual concentric dial (inner 500k configured / outer 1M model), Settings chip for `autoCompactWindow`, hover-mislabel balloon, U≥50 suppression lamp, barograph timeline of tokens-used vs ring appear vs compact fire. NOT Simulacrum (hyperreality / phantom Chrome navigate), NOT Solenoid (switchgear / RC warm-arm), NOT Scotia (limestone / shadow-gap), NOT Canard (press-room), NOT Stet (copy-desk), NOT Blindside (sideline scout), NOT Interdict (chrome prohibit-bleed on Bash), NOT Scapegoat (Chrome grant blame), NOT Simplex (radio chassis), NOT Deadkey (typewriter platen), NOT Gleaner (wheat leftover-harvest), NOT Schism (twin-authority glass). This is specifically: **CONTEXT RING IGNORES autoCompactWindow — WRONG MODEL WINDOW + HARD 50% SUPPRESSION = NO WARNING BEFORE AUTO-COMPACT.**

The capsule should stay **calibrated** (HOLD: ring scored against `autoCompactWindow`; warning appears with runway before compact). Instead the booth was **aneroided** after a **wrong-window-ring**.

Primary:

- [anthropics/claude-code#93901](https://github.com/anthropics/claude-code/issues/93901) (OPEN). Title: `VS Code extension: context ring ignores autoCompactWindow, giving no warning before auto-compact fires`. Labels: bug, has repro, area:ide, platform:vscode. Claude Code VS Code extension **2.1.269** (win32-x64); CLI **2.1.158**; Windows 11 Enterprise 10.0.26200. Model: Opus 5, 1M context. `~/.claude/settings.json` contains `"autoCompactWindow": 500000`. The context ring and hover are computed against the **model's** context window, not the configured one. The string `autoCompactWindow` does not appear in `webview/index.js` (0 hits) but appears 18 times in `bin/claude.exe`. Webview is handed `contextWindow: usageData.contextWindow - usageData.maxOutputTokens - 13000` then suppresses the ring while `U >= 50` against that wrong window. Ring first appears ~500k tokens used; auto-compaction fires almost immediately. Hover: `50% of context remaining until auto-compact` when none remains. Bottom-right: `50% context used` measured against 1M. Lowering `autoCompactWindow` to compact sooner can remove the warning entirely. Suggested fix in the issue (scoring narrative only — DO NOT implement): thread the CLI-resolved window into the webview. Cousins cite-only (NOT duplicates / do not rebuild as separate booths): #90756 (Desktop UI control to set the value), #91385 (ring vs hard per-prompt window mid-turn). Backups cite-only (next focus only — do not auto-pick): #93744 #93772 #93770 #93777 #93782 #93862 #93859 #93863 #93889 #93821 #93811 #93809 #93823.

06:50 aneroid: an aneroid-barometer / instrument-panel booth for #93901. Idle **calibrated** / seeded **aneroided** / path **wrong-window-ring**. Score aneroid or admit calibrated.

Score aneroid or admit calibrated.

Idle word: **calibrated** (HOLD: ring scored against `autoCompactWindow`; warning appears with runway before compact). HOLD aliases: calibrated, correct-window, ring-ahead, runway. Seeded word: **aneroided** / #93901 (wrong model window + hard 50% suppression = no warning before auto-compact). Path word: **wrong-window-ring**. Product score: **aneroid**. Never idle simulacrum / tethered / hollow / phantom-navigate / solenoid / engaged / inert / warm-before-message / scotia / flush / scotiated / decstbm-undershoot / canard / candid / canarded / stet / stetted / rewound / blindside / sighted / blindsided / interdict / scoped / interdicted / simplex / deadkey / keyed / gleaner / gleaned / schism / live / rasure / intact / ashpan / swept / outrider / credentialed / necrology / attested / innominate / named / snuffer / lit / changeling / pledged / homograph / distinct.

Phrase: **Score aneroid or admit calibrated.**

- **calibrated** = IDLE: HOLD; ring scored against `autoCompactWindow`; warning appears with runway before compact
- **aneroided** = #93901 seeded path: wrong model window + hard 50% suppression = no warning before auto-compact
- **aneroid** = product score word for the instrument-panel booth
- **wrong-window-ring** = path word: webview handed the model window; ring first appears ~500k; compact fires immediately
- **hold** = HOLD alias for idle calibrated
- **correct-window** = HOLD alias: ring uses the CLI-resolved `autoCompactWindow`
- **ring-ahead** = HOLD alias: warning appears far enough ahead of compaction to be actionable
- **runway** = HOLD alias: usable tokens remain between first ring and compact
- **model-window** = webview handed `contextWindow: usageData.contextWindow - maxOutputTokens - 13000`
- **hover-mislabel** = hover says `50% of context remaining until auto-compact` when none remains
- **fifty-suppress** = `if (U >= 50) return null` against the wrong window
- **no-runway** = render threshold and compaction point coincide at 500k
- **settings-absent** = `autoCompactWindow` is in `settings.json` but not in the webview bundle
- **webview-zero-hits** = `grep -aoc autoCompactWindow webview/index.js` → 0
- **cli-eighteen** = `grep -aoc autoCompactWindow bin/claude.exe` → 18
- **compact-immediate** = ring first appears ~500k; auto-compaction fires almost immediately
- **lower-window-worse** = lowering `autoCompactWindow` to compact sooner can remove the warning entirely
- **has-repro** = published shape: VS Code 2.1.269 / Opus 5 1M / `autoCompactWindow` 500000
- **cousins** = cite-only #90756 #91385
- **backups** = cite-only #93744 #93772 #93770 #93777 #93782 #93862 #93859 #93863 #93889 #93821 #93811 #93809 #93823 — do not auto-pick
- **fixtures** = panel charcoal / dial brass / storm amber / phosphor cyan / sealed-glass teal
- **walk** = published idle calibrated → wrong-window-ring → aneroided → aneroid

Verdicts: calibrated, aneroided, aneroid, wrong-window-ring, hold, correct-window, ring-ahead, runway, model-window, hover-mislabel, fifty-suppress, no-runway, settings-absent, webview-zero-hits, cli-eighteen, compact-immediate, lower-window-worse, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **aneroided** / **aneroid** or already **calibrated**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the webview never receives the CLI-resolved `autoCompactWindow`, so percentages and the hard 50% suppress gate run against the model window. The issue grepped 0 hits in `webview/index.js` and 18 in `bin/claude.exe` — offered as the issue's own evidence, not a source-root-cause claim beyond that grep. Invite verify against #93901 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93901](https://github.com/anthropics/claude-code/issues/93901)
- Cite-only cousins: #90756 (Desktop UI control to set the value — different ask). #91385 (ring vs hard per-prompt window mid-turn; compaction cannot help — different problem). Do not rebuild those as separate booths.
- Backups (data only; next focus only — do not auto-pick): #93744, #93772, #93770, #93777, #93782, #93862, #93859, #93863, #93889, #93821, #93811, #93809, #93823

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, area:ide, platform:vscode
- Environment: VS Code extension 2.1.269 (win32-x64), CLI 2.1.158, Windows 11 Enterprise 10.0.26200, Opus 5 1M context, `autoCompactWindow: 500000`
- Ring and hover computed against the model's context window, not `autoCompactWindow`
- `autoCompactWindow` does not appear in `webview/index.js` (0 hits); 18 hits in `bin/claude.exe`
- Webview handed `contextWindow: usageData.contextWindow - usageData.maxOutputTokens - 13000`
- Ring suppressed while `U >= 50` against that wrong window
- Ring first appears ~500k tokens used; auto-compaction fires almost immediately
- Hover: `50% of context remaining until auto-compact` when none remains
- Bottom-right: `50% context used` measured against 1M
- Lowering `autoCompactWindow` to compact sooner can remove the warning entirely
- CLI `xRH`/`yX4` is correct against the resolved window; `$88` reports source as `settings`
- On a 1M model the ring cannot render below roughly 461k–494k tokens used
- Workaround in the issue: set `autoCompactWindow` above ~500k; usable runway ≈ `autoCompactWindow - 500000`
- Scope caveat: measured against the VS Code extension bundle; desktop likely shares the webview but was not verified

Problem found: CONTEXT RING IGNORES autoCompactWindow — WRONG MODEL WINDOW + HARD 50% SUPPRESSION = NO WARNING BEFORE AUTO-COMPACT.

Why this solution: living catalog page + node diagnostic encoding idle **calibrated** / seeded **aneroided** / path **wrong-window-ring** so operators can score whether the booth is an **aneroid** or already **calibrated**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Thread the CLI-resolved window — the issue's `ul(model, autoCompactWindow).window` — through to the webview
2. Use that window both for the percentage and for the render threshold
3. The suppression threshold should be derived from that window rather than hard-coded at 50, otherwise a small configured window still yields no warning

## Why not a clone

This is specifically: **CONTEXT RING IGNORES autoCompactWindow — WRONG MODEL WINDOW + HARD 50% SUPPRESSION = NO WARNING BEFORE AUTO-COMPACT.**

Novel paradigm: aneroid-barometer / meteorological instrument-panel booth — a sealed gauge that reads a wrong absolute scale so the warning needle never lifts before the storm.

**NOT Simulacrum/#93751** (Claude-in-Chrome hollow MCP success — list connected + Navigated stamp with no process). Different defect. NOT Baudrillard / hyperreality museum / wax-museum CRT. Do not reuse tethered / hollow / phantom-navigate.

**NOT Solenoid/#93754** (Desktop Settings RC toggle fidelity + arm-at-warm vs arm-at-first-message). Different defect. NOT industrial switchgear / solenoid-coil. Do not reuse engaged / inert / warm-before-message.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum / wax seal / diocese. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Scapegoat** (Chrome grant blame). Different defect. Do not reuse that slug.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows under the prompt on Linux VTE). Different defect. NOT limestone / shadow-gap / column-molding. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd). Different defect. NOT press-room / newspaper-canard. Do not reuse candid / canarded / onedrive-cwd-mislabel.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk / blue-pencil. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work). Different defect. NOT sideline-scout. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Simplex/#93801** (mobile Remote Control send vanishes). Different defect. NOT radio chassis. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage resumes a second LIVE workflow agent). Different defect. NOT twin-authority glass. Do not reuse live / schismed / resume-while-live.

Do NOT rename Aneroid to any existing catalog slug. Catalog currently has 323 products; Aneroid is #324 after Simulacrum #323.
Do NOT reuse idle tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / duplex / simplexed / keyed / deadkeyed / gleaned.

Display here is **Orbitron**. Body is **Exo 2**. Mono is **IBM Plex Mono**.

Different surface: VS Code extension context-ring vs Claude-in-Chrome MCP hollow registration vs Settings toggle fidelity vs DECSTBM blank-row undershoot vs Chrome-MCP Bash bleed vs VS Code OneDrive spawn mislabel.

Different UI: panel charcoal / dial brass / storm amber / phosphor cyan / sealed-glass teal / dual concentric dial / Settings chip / hover balloon / suppression lamp / barograph strip. Orbitron / Exo 2 / IBM Plex Mono. NOT museum vitrine. NOT coil-plunger. NOT limestone column. NOT aged newsprint. NOT cream galley. NOT papal vellum.

Different verbs: Admit calibrated, Score aneroid, Walk wrong-window-ring, Compare calibrated / aneroided, Pin idle calibrated, Pin seeded aneroided, Pin wrong-window-ring, Seal the capsule.

Different idle: **calibrated**. Different #93901 seeded path: **aneroided**. HOLD: **calibrated** / **hold**. ALARM: **aneroided** / **aneroid** / **wrong-window-ring** / **hover-mislabel**. Path: **wrong-window-ring**.

## How to score

```bash
node --test projects/aneroid/aneroid.test.mjs
node projects/aneroid/aneroid.mjs projects/aneroid/data/aneroided.json
echo '{"seed":"aneroided"}' | node projects/aneroid/aneroid.mjs
```

Open the living card at `projects/aneroid/index.html` (or the live path `/aneroid/`). Buttons: Admit calibrated, Score aneroid, Walk wrong-window-ring, Compare calibrated / aneroided, Pin idle calibrated, Pin seeded aneroided, Pin wrong-window-ring, Seal the capsule. Toggle chips for: wrong-window-ring, model-window, hover-mislabel, fifty-suppress, no-runway — the score flips. Lay a fixture JSON on the storm blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s wrong-window / fifty-suppress / hover-mislabel walk from the published #93901 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/aneroid/
- Folder: `projects/aneroid/`
