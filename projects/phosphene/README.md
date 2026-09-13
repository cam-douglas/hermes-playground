# Phosphene

An **ophthalmology / entoptic / visual-field clinic booth** — charcoal vitreous chamber, lilac isopters, phosphene-flash stimulus, sclera chart paper, iris-teal depth rings. Fonts **Syne** (display) + **Sora** (body) + **JetBrains Mono** (chips). Palette: charcoal `#12151C`, vitreous lilac `#8B7CFF`, phosphene flash `#E8FF6A`, sclera `#F4F1EA`, iris teal `#1F6F6A`, slate `#4A5568`. Fresh trio — not the last-ten catalog faces, not Parablepsis's collation trio, not Demesne's manor trio, not Scotoma's Humphrey faces, not Afterimage's CRT faces. NOT Parablepsis/#93954. NOT Demesne/#93989. NOT Cartouche/#93772. NOT Attaint/#93821. NOT Oriel/#93809. NOT Anarthria/#93782. NOT Trismus/#93823. NOT Foundling/#93889. NOT Crasis, Tessera, Mojibake, Afterimage, Thrash, Scotoma, Followspot, Scrim, Relict, Pentimento. Completely different UI/UX/metaphor. This is specifically: **WINDOWSERVER CA LAYER-TREE THRASH — WHILE A RESPONSE STREAMS, WINDOWSERVER RE-WALKS A ~50-LEVEL COREANIMATION TREE AT 120 HZ (~47% CPU; IDLE 3-6%).**

The field should stay **quiescent** (HOLD: cooled / steady-frame / idle-ws / no-rewalk). Instead the booth was **phosphene** after a **layer-tree-walk**.

Primary:

- [anthropics/claude-code#94003](https://github.com/anthropics/claude-code/issues/94003) (OPEN). Title: `Claude Code Desktop WindowServer ~47% CPU while a response streams (deep CoreAnimation layer tree re-walked at 120 Hz)`. Labels: bug, has-repro, platform:macos, performance, area:desktop. Claude desktop 1.52386.3; macOS 26.6.2; MacBook Pro M3 Pro; Liquid Retina XDR 1512x982 @ 3024x1964; 120 Hz. Streaming: WindowServer ~47% one core; idle same window: 3-6%. Stack: WindowServer main thread re-walks Claude CA layer tree ~50 levels deep each refresh via `ca_prepare_begin_window_update` / `prepare_layer0` recursion. 2-minute trace: streaming 41-51%; idle 3-6%; tracks reply start/stop; one window accounts for cost. Cousin cite-only: #93811 (Windows desktop CPU spikes). Backups cite-only (next focus only — do not auto-pick): #93770 #93777 #93924 #93925 #93967 #93957 #93987 #93996. Stay off Phosphene/Parablepsis/Demesne/Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis/Tessera/Mojibake paradigms.

00:50 phosphene: an ophthalmology / entoptic / visual-field booth for #94003. While a response streams, WindowServer re-walks a ~50-level CoreAnimation tree at 120 Hz (~47% CPU; idle 3-6%). Idle **quiescent** / seeded **phosphene** / path **layer-tree-walk**. Score phosphene or admit quiescent.

Score phosphene or admit quiescent.

Idle word: **quiescent** (HOLD: cooled / steady-frame). HOLD aliases: quiescent, cooled, steady-frame, idle-ws, no-rewalk. Seeded word: **phosphene** / #94003 (the WindowServer CA layer-tree thrash). Path word: **layer-tree-walk**. Product score: **phosphene**. Never idle diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary or seeded parablepsis / demesne / cartouche / attaint / oriel / anarthria / trismus / foundling / crasis / tessera / mojibake / latin1-edit-wipe / home-bind-overreach.

Phrase: **Score phosphene or admit quiescent.**

- **quiescent** = IDLE: HOLD; WindowServer 3-6%; cooled field; no CA re-walk
- **phosphene** = #94003 seeded path and product score: WindowServer re-walks the CA tree while tokens stream
- **layer-tree-walk** = path word: compositor does 120 Hz vsync work the user did not ask for
- **hold** = HOLD alias for idle quiescent
- **cooled** = HOLD alias: field cooled; no entoptic flash
- **steady-frame** = HOLD alias: vsync without a deep CA re-walk
- **idle-ws** = HOLD alias: WindowServer stays 3-6%
- **no-rewalk** = HOLD alias: prepare_layer0 does not recurse ~50 levels
- **ca-prepare** = `ca_prepare_begin_window_update` starts a window update each vsync
- **prepare-layer0** = `prepare_layer0` recursion re-walks the Claude CA layer tree
- **windowserver-47** = streaming ~47% of one core
- **layer-depth-50** = ~50-level CoreAnimation tree
- **refresh-120** = 120 Hz re-walk on Liquid Retina XDR
- **streaming-cpu** = 2-minute trace 41-51% while the reply streams
- **idle-cpu** = idle same window 3-6%
- **liquid-xdr** = 1512x982 @ 3024x1964; 120 Hz
- **m3-pro** = MacBook Pro M3 Pro
- **landing** = clinic landing / vitreous sill
- **has-repro** = published shape: desktop 1.52386.3 / macOS 26.6.2 / 47% vs 3-6%
- **cousins** = cite-only #93811 Windows desktop CPU spikes — do not conflate
- **backups** = cite-only #93770 #93777 #93924 #93925 #93967 #93957 #93987 #93996 — do not auto-pick
- **fixtures** = charcoal / vitreous lilac / phosphene flash / sclera / iris teal
- **walk** = published idle quiescent → layer-tree-walk → phosphene

Verdicts: quiescent, phosphene, layer-tree-walk, hold, cooled, steady-frame, idle-ws, no-rewalk, ca-prepare, prepare-layer0, windowserver-47, layer-depth-50, refresh-120, streaming-cpu, idle-cpu, liquid-xdr, m3-pro, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **phosphene** or already **quiescent**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): deep Electron/CA nesting causes prepare_layer0 thrash each vsync during streaming invalidation. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94003](https://github.com/anthropics/claude-code/issues/94003)
- Cousins: #93811 cite-only (Windows desktop CPU spikes). Different OS compositor path. Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #93770, #93777, #93924, #93925, #93967, #93957, #93987, #93996

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has-repro, platform:macos, performance, area:desktop
- Claude desktop 1.52386.3; macOS 26.6.2; MacBook Pro M3 Pro
- Liquid Retina XDR 1512x982 @ 3024x1964; 120 Hz
- Streaming: WindowServer ~47% one core
- Idle same window: 3-6%
- WindowServer main thread re-walks Claude CA layer tree ~50 levels deep each refresh via `ca_prepare_begin_window_update` / `prepare_layer0` recursion
- 2-minute trace: streaming 41-51%; idle 3-6%; tracks reply start/stop; one window accounts for cost
- Expected (scoring narrative only): WindowServer stays near idle while tokens stream; no 120 Hz deep CA re-walk

Problem found: WINDOWSERVER CA LAYER-TREE THRASH — WHILE A RESPONSE STREAMS, WINDOWSERVER RE-WALKS A ~50-LEVEL COREANIMATION TREE AT 120 HZ (~47% CPU; IDLE 3-6%).

Why Phosphene: a phosphene is an entoptic light flash with no external light (pressure/electrical). Here the compositor does expensive vsync work the user did not ask for beyond streaming tokens. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: living catalog page + node diagnostic encoding idle **quiescent** / seeded **phosphene** / path **layer-tree-walk** so operators can score whether the booth is **phosphene** or already **quiescent**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. WindowServer should stay near idle (3-6%) while a response streams, not jump to ~47% of one core
2. The compositor should not re-walk a ~50-level CoreAnimation tree at 120 Hz on every refresh
3. `ca_prepare_begin_window_update` / `prepare_layer0` should not recurse the full Claude layer tree each vsync
4. Streaming-token invalidation should not force a deep CA re-walk the user did not ask for
5. One window should not account for the entire WindowServer cost once the reply starts

## Why not a clone

This is specifically: **WINDOWSERVER CA LAYER-TREE THRASH — WHILE A RESPONSE STREAMS, WINDOWSERVER RE-WALKS A ~50-LEVEL COREANIMATION TREE AT 120 HZ (~47% CPU; IDLE 3-6%).**

Novel paradigm: ophthalmology / entoptic clinic / vitreous chamber / nested layer-depth isopters — charcoal, vitreous lilac, phosphene flash, sclera chart, iris teal. New issue, new paradigm (layer-tree-walk), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Parablepsis/#93954** (Edit/Write UTF-8-decode of Latin-1 PHP). Different defect. NOT paleography / collation desk. Do not reuse diplomatic / parablepsis / latin1-edit-wipe.

**NOT Demesne/#93989** (bwrap binds entire `/home` instead of `$HOME`). Different defect. NOT manor charter. Do not reuse demesned / demesne / home-bind-overreach.

**NOT Cartouche/#93772** (ask-for-diagram defaults to a section-summary poster). Different defect. NOT Egyptian name-oval. Do not reuse diagrammed / cartouche / section-poster.

**NOT Attaint/#93821** (cyber-safeguard false-positive; one flag stains the session). Different defect. NOT court-roll attainder. Do not reuse unattainted / attaint / session-attainder.

**NOT Oriel/#93809** (macOS Desktop pop-out/maximised plan window does not reflow). Different defect. Do not reuse reflowed / oriel / plan-no-reflow.

**NOT Anarthria/#93782** (Wispr Flow clipboard+Ctrl+V silently dropped). Different defect. Do not reuse articulate / anarthria / dictation-paste-drop.

**NOT Trismus/#93823** (macOS UNUserNotification / XPC lock-order deadlock). Different defect. Do not reuse limber / trismus / notif-xpc-deadlock.

**NOT Foundling/#93889** (subagent lifecycle does not reap `run_in_background` Bash). Different defect. Do not reuse filiated / foundling / subagent-bash-outlive.

**NOT Crasis/#93960** (non-injective store slug). Different defect. Do not reuse injective / crased / store-slug-collide.

**NOT Tessera/#93929** (macOS version-named binary path → TCC). Different defect. Do not reuse unitary / tessellated / version-path-tcc.

**NOT Mojibake/#93848** (intermittent U+FFFD of multibyte Korean in CLAUDE.md). Different defect. Do not reuse verbatim / mojibaked / fffd-spall.

**NOT Afterimage** (CRT phosphor residual). Different defect. NOT CRT arcade.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT Humphrey bowl. Do not reuse legible / scotomized / command-args-blind.

**NOT Followspot / Thrash / Scrim / Relict / Pentimento** (different visual metaphors). Different defects.

Do NOT rename Phosphene to any existing catalog slug. Catalog currently has 340 products; Phosphene is #341 after Parablepsis #340.
Do NOT reuse idle diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary or seeded parablepsis / demesne / cartouche / attaint / oriel / anarthria / trismus / foundling / crasis / tessera / mojibake / latin1-edit-wipe / home-bind-overreach.

Display here is **Syne**. Body is **Sora**. Mono is **JetBrains Mono**. Do NOT use IBM Plex Mono this ship.

Different surface: layer-tree-walk (WindowServer CA re-walk while streaming) vs latin1-edit-wipe vs home-bind overreach vs wrong diagram type vs session-flag contamination vs plan-window no-reflow vs dictation paste swallow vs Humphrey command-args-blind.

Different UI: charcoal / vitreous lilac / phosphene flash / sclera / iris teal / nested layer-depth meter / idle vs streaming WindowServer %. Syne / Sora / JetBrains Mono. NOT cool vellum / indigo / oxblood. NOT parchment / oak / heraldic green. NOT Humphrey bowl / gold / carmine. NOT CRT phosphor / amber scanlines.

Different verbs: Admit quiescent, Score phosphene, Walk layer-tree-walk, Compare quiescent / phosphene, Pin idle quiescent, Pin seeded phosphene, Pin layer-tree-walk, Chart the field.

Different idle: **quiescent**. Different #94003 seeded path: **phosphene**. HOLD: **quiescent** / **hold**. ALARM: **phosphene** / **layer-tree-walk** / **ca-prepare** / **prepare-layer0**. Path: **layer-tree-walk**.

## How to score

```bash
node --test projects/phosphene/phosphene.test.mjs
node projects/phosphene/phosphene.mjs projects/phosphene/data/phosphene.json
echo '{"seed":"phosphene"}' | node projects/phosphene/phosphene.mjs
```

Open the living card at `projects/phosphene/index.html` (or the live path `/phosphene/`). Buttons: Admit quiescent, Score phosphene, Walk layer-tree-walk, Compare quiescent / phosphene, Pin idle quiescent, Pin seeded phosphene, Pin layer-tree-walk, Chart the field, Score booth. Toggle chips for: layer-tree-walk, ca-prepare, prepare-layer0, windowserver-47 — the score flips. Lay a fixture JSON on the vitreous blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s WindowServer ~47% / ~50-level CA / 120 Hz walk from the published #94003 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/phosphene/
- Folder: `projects/phosphene/`
