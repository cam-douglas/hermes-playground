# Tessera

A **mosaic / tesserae / privacy-pane atelier booth** — limestone panel wall, stone tessera tiles, mica grout, a privacy pane that cannot pry a tile off. Fonts **Big Shoulders Display** (display) + **DM Sans** (body) + **DM Mono** (chips). Palette: limestone `#E8E2D6`, basalt `#1C1A17`, mica gold `#C4A35A`, lichen `#3F6F5C`, fracture `#8B3A3A`, panel `#F7F3EA`. NOT Mojibake (compositor/fffd-spall), NOT Scissel (mint/argv-trunc), NOT Feoffee (feoffment/TCC/preview-eperm), NOT Apograph (reopen-fork), NOT Airlock (socat-race), NOT Scotoma (command-args-blind), NOT Aneroid (wrong-window-ring), NOT Simulacrum (phantom-navigate), NOT Solenoid (warm-before-message), NOT Scotia (decstbm-undershoot), NOT Canard (onedrive-cwd), NOT Stet/Blindside/Interdict/Schism/Gleaner/Waif/Ashpan/Snatch/Disseisin. Completely different UI/UX/metaphor. This is specifically: **NATIVE MACOS INSTALLER RUNS EACH CLAUDE CODE RELEASE FROM A VERSION-NAMED PATH, SO TCC ACCUMULATES ONE PERMISSION ROW PER RELEASE.**

The pane should stay **unitary** (HOLD: run from stable Claude.app bundle / version-independent path; one TCC identity survives updates). Instead the booth was **tessellated** after a **version-path-tcc**.

Primary:

- [anthropics/claude-code#93929](https://github.com/anthropics/claude-code/issues/93929) (OPEN, has repro). Title: `[BUG] macOS permission rows accumulate one per release: version-named binary path defeats stable signing identity (refiling stale-closed #76615)`. Labels: bug, has repro, platform:macos, area:packaging. Refiling of stale-closed #76615 (itself a follow-up to #38722). The native installer runs each release from a version-named path (`~/.local/share/claude/versions/<version>`). macOS TCC attributes grants to the executable path, so every release registers a new client. System Settings then collects one permission row per release, labeled with a bare version number, in App Management and in Files & Folders. The updater deletes old binaries but leaves their rows behind; users cannot remove those rows one at a time: `tccutil` cannot target a path, and the panes have no remove control. Signing identity is already stable (`com.anthropic.claude-code`, team Q6L2SF6YDW). Only the path changes. Checked 2026-09-12 on Claude Code 2.1.263 / macOS 27.0 (26A428): bundle `~/.local/share/claude/ClaudeCode.app/Contents/MacOS/claude` inode=319832836 links=1 mtime=2026-07-14 23:48; live `~/.local/share/claude/versions/2.1.263` inode=336626048 links=1 mtime=2026-09-07 10:13. The stable `ClaudeCode.app` bundle is still frozen at Jul 14, with no hardlink to the live binary. Cousins cite-only: #76080 (permission prompt shows version string as app name); #93747 (Desktop Documents EPERM / fragmented duplicate claude identities). Backups cite-only (next focus only — do not auto-pick): #93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93924 #93925. Stay off Mojibake/Scissel/Feoffee/Apograph/Airlock/Scotoma/Aneroid/Simulacrum/Solenoid/Scotia/Canard/Stet paradigms. Skip #93954 (Latin-1 byte corruption — too close to Mojibake).

14:50 tessera: a mosaic / tesserae / privacy-pane booth for #93929. Idle **unitary** / seeded **tessellated** / path **version-path-tcc**. Score tessera or admit unitary.

Score tessera or admit unitary.

Idle word: **unitary** (HOLD: run from stable Claude.app bundle / version-independent path; one TCC identity survives updates). HOLD aliases: unitary, bundled, stable-path, one-row, identity-kept. Seeded word: **tessellated** / #93929 (version-named binary path → new TCC permission row every release). Path word: **version-path-tcc**. Product score: **tessera**. Never idle verbatim / plenary / vested / singular / equalized / legible / calibrated / tethered / engaged / flush / candid / stetted / scisselled / unseised / apographed / mojibaked / mojibake / fffd-spall.

Phrase: **Score tessera or admit unitary.**

- **unitary** = IDLE: HOLD; run from stable Claude.app bundle / version-independent path; one TCC identity survives updates
- **tessellated** = #93929 seeded path: version-named binary path → new TCC permission row every release
- **tessera** = product score word for the mosaic / privacy-pane booth
- **version-path-tcc** = path word: version-named binary vs stable-path bundle
- **hold** = HOLD alias for idle unitary
- **bundled** = HOLD alias: live binary is the ClaudeCode.app bundle
- **stable-path** = HOLD alias: version-independent path
- **one-row** = HOLD alias: one TCC row per permission service
- **identity-kept** = HOLD alias: signing identity and path stay one client
- **stale-tcc-row** = updater deletes binaries; TCC rows remain
- **bare-version-label** = Settings row labeled with a bare version number
- **bundle-frozen** = ClaudeCode.app Jul 14 inode 319832836; no hardlink to live
- **live-versioned** = running binary at `~/.local/share/claude/versions/2.1.263`
- **has-repro** = published shape: macOS 27.0 / 2.1.263 / Q6L2SF6YDW / Jul 14
- **cousins** = cite-only #76080, #93747
- **backups** = cite-only #93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93924 #93925 — do not auto-pick
- **fixtures** = limestone / basalt / mica gold / lichen / fracture
- **walk** = published idle unitary → version-path-tcc → tessellated → tessera

Verdicts: unitary, tessellated, tessera, version-path-tcc, hold, bundled, stable-path, one-row, identity-kept, stale-tcc-row, bare-version-label, bundle-frozen, live-versioned, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **tessellated** / **tessera** or already **unitary**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): macOS TCC keys grants to the executable path rather than the stable signing identity, so a version-named binary path (`~/.local/share/claude/versions/<version>`) registers a new TCC client every release even though `com.anthropic.claude-code` / team Q6L2SF6YDW is already stable. The updater deletes old binaries but cannot retract their TCC rows; `tccutil` cannot target a path and the panes have no remove control. The frozen ClaudeCode.app bundle (Jul 14 inode) is not the live binary. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93929](https://github.com/anthropics/claude-code/issues/93929)
- Prior stale-closed reports (cite only): #76615, #38722
- Cite-only cousins: #76080 (permission prompt shows version string as app name); #93747 (Desktop Documents EPERM / fragmented duplicate claude identities). Do not rebuild as separate booths.
- Backups (data only; next focus only — do not auto-pick): #93772, #93770, #93777, #93782, #93889, #93821, #93811, #93809, #93823, #93924, #93925

What happened (from the issue text — do not invent):

- OPEN, has repro
- Labels: bug, has repro, platform:macos, area:packaging
- Environment: Claude Code 2.1.263 native macOS; macOS 27.0 (26A428); checked 2026-09-12
- Native installer runs each release from `~/.local/share/claude/versions/<version>`
- macOS TCC attributes grants to the executable path → new client every release
- System Settings accumulates one permission row per release, labeled with a bare version number, in App Management and Files & Folders
- Updater deletes old binaries but leaves TCC rows
- Users cannot remove rows one-by-one: `tccutil` cannot target a path; panes have no remove control
- Signing identity already stable: `com.anthropic.claude-code`, team Q6L2SF6YDW — only the path changes
- Bundle `~/.local/share/claude/ClaudeCode.app/Contents/MacOS/claude` inode 319832836, mtime 2026-07-14 23:48
- Live `~/.local/share/claude/versions/2.1.263` inode 336626048, mtime 2026-09-07 10:13
- Stable bundle frozen at Jul 14; no hardlink to the live binary

Problem found: NATIVE MACOS INSTALLER RUNS EACH RELEASE FROM A VERSION-NAMED PATH; TCC ACCUMULATES ONE PERMISSION ROW PER RELEASE THAT USERS CANNOT PRY OFF.

Why this solution: living catalog page + node diagnostic encoding idle **unitary** / seeded **tessellated** / path **version-path-tcc** so operators can score whether the booth is a **tessera** or already **unitary**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. One persistent "Claude Code" entry per permission service that survives updates
2. Attribute grants to the existing ClaudeCode.app bundle and refresh it on every update, or run from a version-independent path
3. No accumulating bare-version TCC rows after each release

## Why not a clone

This is specifically: **NATIVE MACOS INSTALLER RUNS EACH CLAUDE CODE RELEASE FROM A VERSION-NAMED PATH, SO TCC ACCUMULATES ONE PERMISSION ROW PER RELEASE.**

Novel paradigm: mosaic / tesserae / privacy-pane atelier — limestone panel wall, stone tessera tiles, mica grout, a privacy pane that cannot pry a tile off.

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

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work). Different defect. NOT sideline-scout. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Schism/#93797** (SendMessage resumes a second LIVE workflow agent). Different defect. NOT twin-authority glass. Do not reuse live / schismed / resume-while-live.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs). Different defect. NOT wheat leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Waif** (prior catalog). Different defect. Do not reuse that slug.

**NOT Ashpan/#93780** (delete_session burns ledger, jsonl remains). Different defect. NOT industrial grate. Do not reuse swept / ashpanned / orphan-jsonl.

**NOT Snatch** (prior catalog). Different defect. Do not reuse that slug.

**NOT Disseisin/#93574** (Cowork session home evaporates on VM restart). Different defect. NOT court of novel disseisin / freehold manor roll. Do not reuse seised / disseised / home-evaporated.

Do NOT rename Tessera to any existing catalog slug. Catalog currently has 330 products; Tessera is #331 after Mojibake #330.
Do NOT reuse idle verbatim / plenary / vested / unseised / preview-eperm / singular / apographed / reopen-fork / equalized / blown / socat-race / legible / scotomized / command-args-blind / calibrated / aneroided / wrong-window-ring / tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / gleaned / orphaned / inherited / seised / disseised / intact / armed / coil-pulled / scisselled / argv-trunc / mojibaked / mojibake / fffd-spall.

Display here is **Big Shoulders Display**. Body is **DM Sans**. Mono is **DM Mono**.

Different surface: native macOS version-named binary path → new TCC row vs Windows embedded CLAUDE.md U+FFFD vs argv `-c` truncation vs preview_start getcwd EPERM vs Desktop sidebar reopen session-ID fork vs sandbox socat race vs Stop-condition evaluator vs VS Code context-ring vs Claude-in-Chrome MCP hollow registration vs Settings toggle fidelity vs DECSTBM blank-row undershoot vs VS Code OneDrive spawn mislabel vs Cowork home evaporate.

Different UI: limestone / basalt / mica gold / lichen / fracture / panel / mosaic wall / privacy pane / stuck tesserae. Big Shoulders Display / DM Sans / DM Mono. NOT rice-paper type case. NOT slag floor copper die. NOT oak panel parchment. NOT cream parchment scriptorium. NOT navy hull. NOT Humphrey bowl. NOT sealed gauge. NOT museum vitrine. NOT coil-plunger. NOT limestone column-molding. NOT aged newsprint. NOT court of novel disseisin.

Different verbs: Admit unitary, Score tessera, Walk version-path-tcc, Compare unitary / tessellated, Pin idle unitary, Pin seeded tessellated, Pin version-path-tcc, Press the grout.

Different idle: **unitary**. Different #93929 seeded path: **tessellated**. HOLD: **unitary** / **hold**. ALARM: **tessellated** / **tessera** / **version-path-tcc** / **stale-tcc-row**. Path: **version-path-tcc**.

## How to score

```bash
node --test projects/tessera/tessera.test.mjs
node projects/tessera/tessera.mjs projects/tessera/data/tessellated.json
echo '{"seed":"tessellated"}' | node projects/tessera/tessera.mjs
```

Open the living card at `projects/tessera/index.html` (or the live path `/tessera/`). Buttons: Admit unitary, Score tessera, Walk version-path-tcc, Compare unitary / tessellated, Pin idle unitary, Pin seeded tessellated, Pin version-path-tcc, Press the grout. Toggle chips for: version-path-tcc, stale-tcc-row, bare-version-label, bundle-frozen — the score flips. Lay a fixture JSON on the limestone tablet. `?embed=1` hides chrome.

The booth reconstructs the reporter’s version-named path / frozen Jul 14 bundle / Q6L2SF6YDW walk from the published #93929 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/tessera/
- Folder: `projects/tessera/`
