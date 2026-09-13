# Sneck

A **Northern cottage / workshop door / brass sneck-latch / slate threshold / wool draft / iron latch plate / rain-on-the-stoop booth** — oak plank leaf, cold brass lever, wool sausage at the sill. Fonts **Fraunces** (display) + **Nunito Sans** (body) + **Source Code Pro** (chips/mono). Palette: slate `#2F343B`, oak `#8B6914` / `#C4A35A`, brass `#B08D57`, wool `#E8E0D5`, iron `#1C1F24`, rain `#5B7C99`, ink `#12141A`. Fresh trio. NOT Drawbridge/#94049. NOT Chirograph/#94045. NOT Titulus/#94025. NOT Derelict/#93996. NOT Vestry/#94008. NOT Snib (medieval night-latch already shipped). NOT Hasp. NOT Fibula. NOT Cockade. NOT Bulla. NOT Livery. NOT Surfeit/#94012. NOT Phosphene/#94003. Completely different UI/UX/metaphor. This is specifically: **HIDE TOGGLE REPLACED BY X → DISMISS IS PER-FILE AND EPHEMERAL ACROSS TAB FOCUS → NO SETTING GOVERNS CONTEXT AUTO-ATTACH.**

The latch should stay **cleared** (HOLD: undone / open-latch / stayed-off / withheld). Instead the booth was **sneck** after a **chip-dismiss-ephemeral**.

Primary:

- [anthropics/claude-code#94052](https://github.com/anthropics/claude-code/issues/94052) (OPEN). Title: `[BUG] VS Code 2.1.268: current-file chip Hide toggle replaced by X - context auto-attach opt-out no longer persists`. Labels: bug, has repro, platform:windows, area:ide, platform:vscode. In 2.1.268 the VS Code extension replaced the current-file chip's Hide toggle with an X. The changelog presents this as an improvement. It removed the only working opt-out from IDE context auto-attach. There is now no supported way — setting, command, keybinding, or environment variable — to stop the active editor file and selection from being injected into every prompt. From shipped `webview/index.js` in 2.1.270: the X calls `dismissSelection()`, which stores `dismissedSelection`, and `applySelectionUpdate()` then suppresses re-attachment only while that same file remains active. Dismissal is scoped per file, not per session or conversation. Switch tabs and the chip returns. Switch back and it returns again. A reference file kept open must be dismissed every time focus returns. The Hide toggle held its state. That is the regression. The indicator also moved from the status line into the composer. Repro: open `a.md` and `b.ts`; chip shows `a.md`; click X; switch to `b.ts` (chip shows `b.ts`); switch back to `a.md` → chip returns despite dismiss. On 2.1.267 the Hide toggle stayed off. Expected: dismiss persists until the user reverses it, as Hide did; better a setting like `claudeCode.autoAttachActiveFile` default true. Extension contributes 17 settings and 28 commands in 2.1.270; none governs context attachment. Cousins cite-only: #82492 (no visible chip / confirmation), #93667 (keep IDE selection in footer), #40869 / #24726 (opt-in auto-attach settings proposals), #92516 (diff selection dismiss), #20886 / #26577 (discoverability of removal). Backups cite-only (next focus only — do not auto-pick): #94041 #94040 #94032 #94031 #94029 #93987 #93924 #93770 #93777. Stay off Drawbridge/Chirograph/Titulus/Derelict/Vestry/Snib/Hasp/Fibula/Cockade/Mondegreen/Diplopia/Fulcrum/Followspot paradigms.

07:50 sneck: a Northern cottage / workshop-door / brass-sneck-latch booth for #94052. VS Code 2.1.268 replaced the current-file chip Hide toggle with an X; dismissSelection stores dismissedSelection and applySelectionUpdate only suppresses re-attachment while that same file stays active, so a tab switch and return brings the chip back; there is no setting, command, keybinding, or env to stop auto-attach. Idle **cleared** / seeded **sneck** / path **chip-dismiss-ephemeral**. Score sneck or admit cleared.

Score sneck or admit cleared.

Idle word: **cleared** (HOLD: undone / open-latch). HOLD aliases: cleared, undone, open-latch, stayed-off, withheld. Seeded word: **sneck** / #94052 (the chip-dismiss-ephemeral path). Path word: **chip-dismiss-ephemeral**. Product score: **sneck**. Never idle spanned / matched / inscribed / berthed / pegged / tempered / quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / singular / equalized / legible / calibrated / tethered / engaged / flush / candid / stetted / lit / primed / raised / preserved / tokenized / sprung / unpinned / latched / sealed / liveried or seeded drawbridge / chirograph / titulus / derelict / vestry / surfeit / phosphene / parablepsis / demesne / cartouche / attaint / oriel / anarthria / trismus / foundling / crasis / tessera / mojibake / scissel / feoffee / apograph / fibula / cockade / hasp / snib / bulla / livery / mondegreen / diplopia / fulcrum / followspot / rc-bridge-update-drop / worktree-rename-stale / resume-stale-title.

Phrase: **Score sneck or admit cleared.**

- **cleared** = IDLE: HOLD; sneck stays undone; Hide toggle held; active file withheld from every prompt
- **sneck** = #94052 seeded path and product score: Hide replaced by X; dismiss is per-file; tab return snaps the latch shut
- **chip-dismiss-ephemeral** = path word: applySelectionUpdate only while the same file stays active
- **hold** = HOLD alias for idle cleared
- **undone** = HOLD alias: the sneck stays undone once lifted
- **open-latch** = HOLD alias: the cottage leaf stays an open latch
- **stayed-off** = HOLD alias: Hide stayed off
- **withheld** = HOLD alias: active file is withheld from every prompt
- **hide-toggle** = 2.1.268 replaced Hide with X; Hide held its state
- **dismiss-selection** = X calls dismissSelection()
- **dismissed-selection** = stores dismissedSelection for the current leaf
- **apply-selection-update** = applySelectionUpdate suppresses re-attachment only while that same file remains active
- **per-file-scope** = dismissal scoped per file, not per session or conversation
- **tab-return** = a.md → b.ts → a.md; chip returns despite dismiss
- **composer-chip** = indicator moved from the status line into the composer
- **no-setting** = 17 settings and 28 commands in 2.1.270; none governs context attachment
- **landing** = cottage stoop landing / oak plank / slate threshold / wool draft
- **has-repro** = published shape: 2.1.268 Hide→X / 2.1.270 dismissSelection / a.md + b.ts / 17 settings
- **cousins** = cite-only #82492 #93667 #40869 #24726 #92516 #20886 #26577 — do not conflate
- **backups** = cite-only #94041 #94040 #94032 #94031 #94029 #93987 #93924 #93770 #93777 — do not auto-pick
- **fixtures** = slate / oak / brass / wool / iron / rain / ink
- **walk** = published idle cleared → chip-dismiss-ephemeral → sneck

Verdicts: cleared, sneck, chip-dismiss-ephemeral, hold, undone, open-latch, stayed-off, withheld, hide-toggle, dismiss-selection, dismissed-selection, apply-selection-update, per-file-scope, tab-return, composer-chip, no-setting, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **sneck** or already **cleared**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): X/dismissSelection stores dismissedSelection and applySelectionUpdate only suppresses re-attachment while the same file remains active; dismissal is per-file not per-session, so a tab switch clears the suppression and the chip re-latches. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94052](https://github.com/anthropics/claude-code/issues/94052)
- Cousins: #82492 cite-only (no visible chip / confirmation). #93667 cite-only (keep IDE selection in footer). #40869 / #24726 cite-only (opt-in auto-attach settings proposals). #92516 cite-only (diff selection dismiss). #20886 / #26577 cite-only (discoverability of removal — mentioned in issue). Adjacent only. Different defects. Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #94041, #94040, #94032, #94031, #94029, #93987, #93924, #93770, #93777

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:windows, area:ide, platform:vscode
- Claude Code for VS Code 2.1.268–2.1.270; last working 2.1.267; Windows
- 2.1.268 replaced the current-file chip Hide toggle with an X
- Changelog presents the X as an improvement
- Removed the only working opt-out from IDE context auto-attach
- No setting, command, keybinding, or env stops the active editor file and selection from being injected
- From shipped webview/index.js in 2.1.270: X calls dismissSelection(); stores dismissedSelection; applySelectionUpdate suppresses re-attachment only while that same file remains active
- Dismissal scoped per file, not per session or conversation
- Switch tabs → chip returns. Switch back → returns again
- A reference file kept open must be dismissed every time focus returns
- Hide toggle held its state — that is the regression
- Indicator moved from the status line into the composer
- Repro: a.md + b.ts; X on a.md; switch to b.ts; switch back to a.md → chip returns
- Expected (scoring narrative only): dismiss persists until reversed; better `claudeCode.autoAttachActiveFile` default true
- 17 settings and 28 commands in 2.1.270; none governs context attachment

Problem found: HIDE TOGGLE REPLACED BY X → DISMISS IS PER-FILE AND EPHEMERAL ACROSS TAB FOCUS → NO SETTING GOVERNS CONTEXT AUTO-ATTACH.

Why Sneck: a sneck is a Northern English / Scots door latch. The Hide toggle was a sticky sneck that stayed undone once lifted. The X is a spring sneck — it lifts for the current leaf, then snaps shut the moment you pass another door (tab) and return. Context keeps latching itself back onto every prompt. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: living catalog page + node diagnostic encoding idle **cleared** / seeded **sneck** / path **chip-dismiss-ephemeral** so operators can score whether the booth is **sneck** or already **cleared**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Dismissing the current-file chip should persist until the user reverses it, as Hide did
2. Better: a setting `claudeCode.autoAttachActiveFile` (or `autoAttachContext` / `shareIdeSelection`), default true
3. An X and a persistent opt-out are orthogonal — keep the X and restore persistence
4. There must be a supported way to stop the active editor file and selection from being injected into every prompt
5. A reference file kept open must not have to be dismissed every time focus returns

## Why not a clone

This is specifically: **HIDE TOGGLE REPLACED BY X → DISMISS IS PER-FILE AND EPHEMERAL ACROSS TAB FOCUS → NO SETTING GOVERNS CONTEXT AUTO-ATTACH.**

Novel paradigm: Northern cottage / workshop door / brass sneck-latch / slate threshold / wool draft / rain on the stoop — slate, oak, brass, wool, iron, rain. New issue, new paradigm (chip-dismiss-ephemeral), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Drawbridge/#94049** (RC bridge auto-update drop). Different defect. NOT castle gatehouse / portcullis / bailey. Do not reuse spanned / drawbridge / rc-bridge-update-drop.

**NOT Chirograph/#94045** (recorded branch never refreshed after `git branch -m`). Different defect. NOT medieval lectern / indenture. Do not reuse matched / chirograph / worktree-rename-stale.

**NOT Titulus/#94025** (iOS rename vs desktop sidebar / resume-stale-title). Different defect. NOT Roman marble plaque. Do not reuse inscribed / titulus.

**NOT Derelict/#93996** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict.

**NOT Vestry/#94008** (Linux bwrap placeholder mount cleanup is per-process). Different defect. NOT liturgical sacristy. Do not reuse pegged / vestry.

**NOT Snib** (medieval night-latch already shipped). Different paradigm. NOT a snib night-latch. Do not reuse snib.

**NOT Hasp / Fibula / Cockade / Bulla / Livery** (already-shipped latch / pin / hat / seal / livery paradigms). Different metaphors.

**NOT Surfeit/#94012** (workflow keeps spawning after terminal session-limit). Different defect.

**NOT Phosphene/#94003** (WindowServer CA layer-tree thrash). Different defect.

**NOT Parablepsis / Demesne / Cartouche / Attaint / Oriel / Diplopia / Fulcrum / Followspot / Mondegreen.** Different defects.

Live: https://hermes-playground-green.vercel.app/sneck/

```
node --test projects/sneck/sneck.test.mjs
node projects/sneck/sneck.mjs projects/sneck/data/sneck.json
```
