# Apograph

A **scriptorium / manuscript apograph booth** — stacked parchment leaves that duplicate on each Desktop “reopen”, session-ID wax seals, MB size chain, CLI lane (append, one leaf) vs Desktop lane (fork stack). Fonts **Spectral** (display) + **Source Sans 3** (UI) + **IBM Plex Mono** (chips). Palette: cream parchment `#F6ECD4`, iron-gall brown `#3D2A1A`, vermilion seal `#A31610`, gilt `#8B6332`, desk ink `#1F1610`. NOT Airlock (socat listen race), NOT Scotoma (command-args-blind /goal), NOT Aneroid (context ring), NOT Simulacrum (phantom browser), NOT Solenoid (RC coil-arm), NOT Scotia/Canard/Stet/Blindside/Interdict, NOT Schism (#93797 SendMessage→resume twin while live workflow — different mechanism: live dual-writer vs Desktop sidebar reopen fork). NOT Changeling. Completely different UI/UX/metaphor. This is specifically: **DESKTOP REOPEN → FULL-TRANSCRIPT-FORK VS CLI APPEND-IN-PLACE.**

The quire should stay **singular** (HOLD: one conversation = one leaf; CLI appends in place; session-ID wax seal intact). Instead the booth was **apographed** after a **reopen-fork**.

Primary:

- [anthropics/claude-code#93859](https://github.com/anthropics/claude-code/issues/93859) (OPEN, has repro). Title: `[BUG] Desktop app forks a new session ID (full transcript copy) on every reopen; /resume shows many rows with the same title`. Labels: bug, has repro, platform:macos, area:core, area:desktop. Claude Code **2.1.269**; Claude Desktop **1.52386.3**; macOS 26.6.2 (Darwin 25.6.0). Reopening a conversation from the Desktop app sidebar creates a new session ID and a full copy of the transcript every time, instead of appending to the existing session. After a day, one custom-titled conversation exists as 7 separate `.jsonl` files; `/resume` shows 5+ rows with the same title and different sizes. Docs (sessions.md) say a plain resume reuses the session ID; only `--fork-session` / `/branch` create a new one. Desktop does not follow that. Evidence: 7 files share same `customTitle`, first user message, first timestamp `2026-09-12T10:15:44Z`; each later file is a superset; sizes 1.5→4.6 MB; birth times seconds after previous last write; all `entrypoint: claude-desktop`. Same conversation resumed from CLI ~32 times with **no** further fork. No `--fork-session`; no `.superseded-*` / `.orphaned-*`. Cousin cite-only: #93797 Schism. Backups cite-only (next focus only — do not auto-pick): #93772 #93770 #93777 #93782 #93863 #93889 #93821 #93811 #93809 #93823 #93924 #93848.

09:50 apograph: a scriptorium / exact-copy booth for #93859. Idle **singular** / seeded **apographed** / path **reopen-fork**. Score apograph or admit singular.

Score apograph or admit singular.

Idle word: **singular** (HOLD: one conversation = one leaf; CLI appends in place; session-ID wax seal intact). HOLD aliases: singular, cli-append, one-leaf, seal-intact. Seeded word: **apographed** / #93859 (Desktop reopen forks a full transcript copy). Path word: **reopen-fork**. Product score: **apograph**. Never idle equalized / blown / socat-race / scotoma / legible / scotomized / command-args-blind / aneroid / calibrated / aneroided / wrong-window-ring / simulacrum / tethered / hollow / phantom-navigate / solenoid / engaged / inert / warm-before-message / scotia / flush / scotiated / decstbm-undershoot / canard / candid / canarded / stet / stetted / rewound / blindside / sighted / blindsided / interdict / scoped / interdicted / simplex / deadkey / keyed / gleaner / gleaned / schism / live / rasure / intact / ashpan / swept / outrider / credentialed / necrology / attested / innominate / named / snuffer / lit / changeling / pledged / homograph / distinct / galley / billed / stop-dirty / primed / warm.

Phrase: **Score apograph or admit singular.**

- **singular** = IDLE: HOLD; one conversation = one leaf; CLI appends in place; session-ID wax seal intact
- **apographed** = #93859 seeded path: Desktop sidebar reopen forks a new session ID and a full transcript copy
- **apograph** = product score word for the scriptorium booth
- **reopen-fork** = path word: Desktop sidebar copy vs CLI append-in-place
- **hold** = HOLD alias for idle singular
- **cli-append** = HOLD alias: CLI resume appends; ~32 times with no further fork
- **one-leaf** = HOLD alias: one conversation = one transcript file
- **seal-intact** = HOLD alias: plain resume reuses the session ID
- **desktop-fork** = sidebar reopen creates a new session ID and a full copy
- **session-id** = each Desktop reopen mints a new session ID
- **transcript-superset** = each later file is a superset of the previous
- **custom-title** = 7 files share the same user-set customTitle
- **resume-rows** = `/resume` shows 5+ rows with the same title and different sizes
- **entrypoint-desktop** = all records carry `entrypoint: claude-desktop`
- **no-fork-flag** = no `--fork-session`; no `.superseded-*` / `.orphaned-*`
- **mb-chain** = sizes 1.5 → 1.6 → 2.2 → 2.3 → 3.1 → 3.1 → 4.6 MB
- **has-repro** = published shape: Claude Code 2.1.269 / Desktop 1.52386.3 / macOS
- **cousins** = cite-only #93797
- **backups** = cite-only #93772 #93770 #93777 #93782 #93863 #93889 #93821 #93811 #93809 #93823 #93924 #93848 — do not auto-pick
- **fixtures** = cream parchment / iron-gall brown / vermilion seal
- **walk** = published idle singular → reopen-fork → apographed → apograph

Verdicts: singular, apographed, apograph, reopen-fork, hold, cli-append, one-leaf, seal-intact, desktop-fork, session-id, transcript-superset, custom-title, resume-rows, entrypoint-desktop, no-fork-flag, mb-chain, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **apographed** / **apograph** or already **singular**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Desktop sidebar reopen creates a new session ID and copies the full transcript instead of appending to the existing session, contrary to docs that say plain resume reuses the session ID. Confirming the exact Desktop reopen path is inferred from the published evidence (7 jsonl supersets, birth times seconds after the previous last write, all entrypoint claude-desktop) — not verified from source. Invite verify against #93859 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93859](https://github.com/anthropics/claude-code/issues/93859)
- Cite-only cousin: #93797 (Schism: SendMessage resumes a second LIVE workflow agent — live dual-writer, not Desktop sidebar reopen fork). Do not rebuild as a separate booth.
- Backups (data only; next focus only — do not auto-pick): #93772, #93770, #93777, #93782, #93863, #93889, #93821, #93811, #93809, #93823, #93924, #93848

What happened (from the issue text — do not invent):

- OPEN, has repro
- Labels: bug, has repro, platform:macos, area:core, area:desktop
- Environment: Claude Code 2.1.269, Claude Desktop 1.52386.3, macOS 26.6.2
- Desktop sidebar reopen creates a new session ID and a full transcript copy
- After a day: 7 `.jsonl` files for one custom-titled conversation
- `/resume` shows 5+ rows with the same title and different sizes
- Docs: plain resume reuses session ID; only `--fork-session` / `/branch` create a new one
- 7 files share customTitle, first user message, first timestamp `2026-09-12T10:15:44Z`
- Each later file is a superset; sizes 1.5→4.6 MB
- Birth times seconds after previous last write
- All `entrypoint: claude-desktop`
- CLI resume of the same conversation ~32 times with no further fork
- No `--fork-session`; no `.superseded-*` / `.orphaned-*`

Problem found: DESKTOP REOPEN FORKS FULL TRANSCRIPT / SESSION ID; CLI APPENDS.

Why this solution: living catalog page + node diagnostic encoding idle **singular** / seeded **apographed** / path **reopen-fork** so operators can score whether the booth is an **apograph** or already **singular**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Reopening a session from Desktop should resume the existing session ID, exactly like `claude --resume`
2. One conversation = one transcript file = one row in `/resume`
3. A custom-titled conversation should not appear as 7 `.jsonl` files after a day of Desktop reopens
4. Desktop should follow sessions.md: plain resume reuses the session ID

## Why not a clone

This is specifically: **DESKTOP REOPEN → FULL-TRANSCRIPT-FORK VS CLI APPEND-IN-PLACE.**

Novel paradigm: scriptorium / manuscript apograph booth — stacked parchment leaves that duplicate on each Desktop reopen. CLI lane stays one leaf.

**NOT Airlock/#93862** (sandbox socat proxy readiness race). Different defect. NOT submarine / spacecraft pressure-lock. Do not reuse equalized / blown / socat-race.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT ophthalmology / Humphrey bowl / perimetry. Do not reuse legible / scotomized / command-args-blind.

**NOT Aneroid/#93901** (VS Code context ring ignores autoCompactWindow). Different defect. NOT aneroid-barometer / instrument-panel / sealed gauge. Do not reuse calibrated / aneroided / wrong-window-ring.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work). Different defect. NOT sideline-scout. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Galley/#93745** (Stop hook dirty-tree billing). Different defect. NOT printer's galley / wet-proof. Do not reuse dry / billed / stop-dirty.

**NOT Simulacrum/#93751** (Claude-in-Chrome hollow MCP success). Different defect. NOT Baudrillard / hyperreality museum. Do not reuse tethered / hollow / phantom-navigate.

**NOT Solenoid/#93754** (Desktop Settings RC toggle fidelity). Different defect. NOT industrial switchgear / solenoid-coil. Do not reuse engaged / inert / warm-before-message.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Scapegoat** (Chrome grant blame). Different defect. Do not reuse that slug.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows). Different defect. NOT limestone / shadow-gap. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd). Different defect. NOT press-room. Do not reuse candid / canarded / onedrive-cwd-mislabel.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Simplex/#93801** (mobile Remote Control send vanishes). Different defect. NOT radio chassis. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs). Different defect. NOT wheat leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage resumes a second LIVE workflow agent). Different defect. NOT twin-authority glass. Live dual-writer vs Desktop sidebar reopen fork. Do not reuse live / schismed / resume-while-live.

**NOT Changeling/#93757** (remote reconnect re-injects the global default model). Different defect. Do not reuse pledged / swapped.

**NOT Sprag** (boot attach). Different defect. Do not reuse that slug.

**NOT Leat** (blocked sleep). Different defect. Do not reuse that slug.

**NOT Pontoon/#93288** (RC restart wash). Different defect. Do not reuse washed / afloat / bridge-loss.

Do NOT rename Apograph to any existing catalog slug. Catalog currently has 326 products; Apograph is #327 after Airlock #326.
Do NOT reuse idle equalized / blown / socat-race / legible / scotomized / command-args-blind / calibrated / aneroided / wrong-window-ring / tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / duplex / simplexed / keyed / deadkeyed / gleaned / primed / lit / warm.

Display here is **Spectral**. Body is **Source Sans 3**. Mono is **IBM Plex Mono**.

Different surface: Desktop sidebar reopen session-ID fork vs sandbox socat race vs Stop-condition evaluator vs `/goal` command-args vs VS Code context-ring vs Claude-in-Chrome MCP hollow registration vs Settings toggle fidelity vs DECSTBM blank-row undershoot vs Chrome-MCP Bash bleed vs VS Code OneDrive spawn mislabel vs live SendMessage twin.

Different UI: cream parchment / iron-gall brown / vermilion seal / gilt / stacked leaves / session-ID wax seals / MB chain / CLI lane vs Desktop lane. Spectral / Source Sans 3 / IBM Plex Mono. NOT navy hull. NOT Humphrey bowl. NOT sealed gauge. NOT museum vitrine. NOT coil-plunger. NOT limestone column. NOT aged newsprint. NOT cream galley. NOT papal vellum. NOT sideline turf.

Different verbs: Admit singular, Score apograph, Walk reopen-fork, Compare singular / apographed, Pin idle singular, Pin seeded apographed, Pin reopen-fork, Turn the leaf.

Different idle: **singular**. Different #93859 seeded path: **apographed**. HOLD: **singular** / **hold**. ALARM: **apographed** / **apograph** / **reopen-fork** / **desktop-fork**. Path: **reopen-fork**.

## How to score

```bash
node --test projects/apograph/apograph.test.mjs
node projects/apograph/apograph.mjs projects/apograph/data/apographed.json
echo '{"seed":"apographed"}' | node projects/apograph/apograph.mjs
```

Open the living card at `projects/apograph/index.html` (or the live path `/apograph/`). Buttons: Admit singular, Score apograph, Walk reopen-fork, Compare singular / apographed, Pin idle singular, Pin seeded apographed, Pin reopen-fork, Turn the leaf. Toggle chips for: reopen-fork, desktop-fork, session-id, transcript-superset, mb-chain — the score flips. Lay a fixture JSON on the quire blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s desktop-fork / session-id / transcript-superset walk from the published #93859 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/apograph/
- Folder: `projects/apograph/`
