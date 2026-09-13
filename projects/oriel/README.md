# Oriel

A **Gothic / Tudor oriel bay-window architectural booth** — projecting bay, vertical mullion strip, leaded amber glass, stone sill, sash that opens wide while the manuscript column refuses to span. Fonts **Newsreader** (display) + **DM Sans** (body) + **IBM Plex Mono** (chips). Palette: stone `#5C584F`, parchment `#F4EFE4`, mullion ink `#1A1916`, amber glass `#C9953A`, sash green `#3F6B58`, empty-margin blush `#A85A4A`. NOT Anarthria/#93782 (ENT voice clinic). NOT Trismus/#93823 (oral-surgery lockjaw). NOT Foundling/#93889 (subagent Bash orphaning). NOT Crasis (vellum ligature). NOT Tessera (mosaic TCC). NOT Mojibake (compositor). NOT Scissel (mint). NOT Feoffee (chancery). NOT Apograph (scriptorium leaves). NOT Airlock. NOT Scotoma. NOT Aneroid. NOT Stet. NOT Rubric (rubricator list renumber). NOT Galley. NOT Quoin mentions. NOT Casement mentions. Completely different UI/UX/metaphor. This is specifically: **THE ORIEL BAY OPENS WIDE BUT THE PLAN MANUSCRIPT STAYS IN A FIXED COLUMN — CLAUDE DESKTOP macOS POP-OUT/MAXIMISED PLAN WINDOW DOES NOT REFLOW TEXT TO THE AVAILABLE WIDTH (EMPTY RIGHT MARGIN).**

The bay should stay **reflowed** (HOLD: plan text uses available window width). Instead the booth was **oriel** after a **plan-no-reflow**.

Primary:

- [anthropics/claude-code#93809](https://github.com/anthropics/claude-code/issues/93809) (OPEN). Title: `[BUG] Pop-out/maximised plan window: text doesn't reflow to window width (related to #62543, closed not-planned)`. Labels: bug, has repro, platform:macos, area:ui, area:desktop. Claude Code 2.1.268 on macOS Desktop app. When using expand/pop-out for a plan, OR when maximised within the app, plan text does NOT expand/reflow to fill the window width. Large empty margin remains on the right regardless of window size. Expected: plan text should reflow and use available window width. Related cite-only: #62543 CLOSED as duplicate/not-planned ("Plan side panel: content stops expanding at a fixed width — large wasted empty margins on wider panel"). Related cite-only: #57749 CLOSED feature ("Plan mode panel: use available window width on Desktop (currently narrow centered column)") — Windows-labeled but same narrow-column family. Reporter re-raises specifically for the pop-out/maximised-window case as deterministic wasted space. Backups cite-only (next focus only — do not auto-pick): #93772 #93770 #93777 #93821 #93811 #93924 #93925 #93954 #93967 #93957. Stay off Anarthria/Trismus/Foundling/Crasis/Tessera/Mojibake/Scissel/Feoffee/Apograph/Airlock/Scotoma/Stet/Rubric/Galley paradigms.

19:50 oriel: a Gothic / Tudor oriel bay-window booth for #93809. Idle **reflowed** / seeded **oriel** / path **plan-no-reflow**. Score oriel or admit reflowed.

Score oriel or admit reflowed.

Idle word: **reflowed** (HOLD: plan text uses available window width). HOLD aliases: reflowed, spanned, sashed, bayed, projected, fenestrated, width-fit. Seeded word: **oriel** / #93809 (pop-out/maximised plan window does not reflow text to the available width). Path word: **plan-no-reflow**. Product score: **oriel**. Never idle articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / singular / as-penned or seeded anarthria / trismus / foundling / crased / tessellated / mojibaked / scisselled / unseised / apographed.

Phrase: **Score oriel or admit reflowed.**

- **reflowed** = IDLE: HOLD; plan text uses available window width; sash open; manuscript spans
- **oriel** = #93809 seeded path and product score: Claude Desktop macOS pop-out/maximised plan window keeps a fixed column
- **plan-no-reflow** = path word: plan text does not expand/reflow to fill the window width
- **hold** = HOLD alias for idle reflowed
- **spanned** = HOLD alias: manuscript spans the bay
- **sashed** = HOLD alias: sash open; width live
- **bayed** = HOLD alias: projecting bay used in full
- **projected** = HOLD alias: bay projects and the manuscript follows
- **fenestrated** = HOLD alias: leaded panes admit the full width
- **width-fit** = HOLD alias: plan text width-fits the window
- **fixed-column** = plan manuscript stays in a fixed / narrow column
- **empty-margin** = large empty margin remains on the right regardless of window size
- **pop-out** = expand/pop-out for a plan: text does not reflow
- **maximised** = maximised within the app: window grows; manuscript does not
- **macos-desktop** = Claude Code 2.1.268 on macOS Desktop app
- **plan-window** = the plan window surface (pop-out or maximised)
- **landing** = plan window landing / stone sill of the bay
- **has-repro** = published shape: 2.1.268 / macOS Desktop / pop-out or maximised / empty right margin
- **cousins** = cite-only #62543 #57749
- **backups** = cite-only #93772 #93770 #93777 #93821 #93811 #93924 #93925 #93954 #93967 #93957 — do not auto-pick
- **fixtures** = stone / parchment / mullion ink / amber glass / sash green / empty-margin blush
- **walk** = published idle reflowed → plan-no-reflow → oriel

Verdicts: reflowed, oriel, plan-no-reflow, hold, spanned, sashed, bayed, projected, fenestrated, width-fit, fixed-column, empty-margin, pop-out, maximised, macos-desktop, plan-window, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **oriel** or already **reflowed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): a fixed max-width / narrow centered column CSS likely survives into pop-out/maximised surfaces. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93809](https://github.com/anthropics/claude-code/issues/93809)
- Cite-only cousin: [anthropics/claude-code#62543](https://github.com/anthropics/claude-code/issues/62543) (CLOSED as duplicate/not-planned — Plan side panel: content stops expanding at a fixed width). Do not rebuild as a separate booth.
- Cite-only cousin: [anthropics/claude-code#57749](https://github.com/anthropics/claude-code/issues/57749) (CLOSED feature — Plan mode panel: use available window width on Desktop; Windows-labeled but same narrow-column family). Do not rebuild as a separate booth.
- Backups (data only; next focus only — do not auto-pick): #93772, #93770, #93777, #93821, #93811, #93924, #93925, #93954, #93967, #93957

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:ui, area:desktop
- Claude Code 2.1.268 on macOS Desktop app
- When using expand/pop-out for a plan, OR when maximised within the app, plan text does NOT expand/reflow to fill the window width
- Large empty margin remains on the right regardless of window size
- Expected: plan text should reflow and use available window width
- Reporter re-raises specifically for the pop-out/maximised-window case as deterministic wasted space

Problem found: THE ORIEL BAY OPENS WIDE BUT THE PLAN MANUSCRIPT STAYS IN A FIXED COLUMN — CLAUDE DESKTOP macOS POP-OUT/MAXIMISED PLAN WINDOW DOES NOT REFLOW TEXT TO THE AVAILABLE WIDTH (EMPTY RIGHT MARGIN).

Why this solution: living catalog page + node diagnostic encoding idle **reflowed** / seeded **oriel** / path **plan-no-reflow** so operators can score whether the booth is **oriel** or already **reflowed**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Plan text should reflow and use available window width
2. Pop-out / expand for a plan should let the manuscript span the bay
3. Maximised-within-the-app plan window should not keep a large empty right margin

## Why not a clone

This is specifically: **THE ORIEL BAY OPENS WIDE BUT THE PLAN MANUSCRIPT STAYS IN A FIXED COLUMN — CLAUDE DESKTOP macOS POP-OUT/MAXIMISED PLAN WINDOW DOES NOT REFLOW TEXT TO THE AVAILABLE WIDTH (EMPTY RIGHT MARGIN).**

Novel paradigm: Gothic / Tudor oriel bay-window — projecting bay, vertical mullion strip, leaded amber glass, stone sill, sash that opens wide while the manuscript column refuses to span.

**NOT Anarthria/#93782** (Wispr Flow clipboard+Ctrl+V silently dropped in VS Code WSL on 2.1.269). Different defect. NOT ENT / laryngology / voice-clinic. Do not reuse articulate / anarthria / dictation-paste-drop. Anarthria is a mute larynx on a swallowed paste; Oriel is a wide bay with a fixed manuscript column.

**NOT Trismus/#93823** (macOS UNUserNotification / XPC lock-order main-thread deadlock). Different defect. NOT oral-surgery / lockjaw / enamel tile / forceps tray. Do not reuse limber / trismus / notif-xpc-deadlock.

**NOT Foundling/#93889** (subagent lifecycle does not reap `run_in_background` Bash). Different defect. NOT foundling-hospital / parish-ward / foundling-wheel. Do not reuse filiated / foundling / subagent-bash-outlive.

**NOT Crasis/#93960** (non-injective store slug fuses two project paths). Different defect. NOT manuscript crasis / fused ligature / vellum drawers. Do not reuse injective / crased / store-slug-collide.

**NOT Tessera/#93929** (macOS version-named binary path → TCC row per release). Different defect. NOT mosaic / tesserae / privacy-pane. Do not reuse unitary / tessellated / version-path-tcc.

**NOT Mojibake/#93848** (Windows embedded CLAUDE.md UTF-8 → three U+FFFD). Different defect. NOT compositor / foul-proof / geta-tofu. Do not reuse verbatim / mojibaked / fffd-spall.

**NOT Scissel/#93915** (Windows Bash argv `-c` 8203 truncation / `\\` collapse). Different defect. NOT mint / coin-press / punch-and-scissel. Do not reuse plenary / scisselled / argv-trunc.

**NOT Feoffee/#93863** (preview_start getcwd EPERM despite parent FDA). Different defect. NOT medieval feoffment / livery-of-seisin / chancery. Do not reuse vested / unseised / preview-eperm.

**NOT Apograph/#93859** (Desktop reopen forks a full transcript copy). Different defect. NOT scriptorium / stacked parchment leaves / session-ID wax seals. Do not reuse singular / apographed / reopen-fork.

**NOT Airlock/#93862** (sandbox socat proxy readiness race). Different defect. NOT submarine / spacecraft pressure-lock. Do not reuse equalized / blown / socat-race.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT ophthalmology / Humphrey bowl / perimetry. Do not reuse legible / scotomized / command-args-blind.

**NOT Aneroid/#93901** (VS Code context ring ignores autoCompactWindow). Different defect. NOT aneroid-barometer / instrument-panel / sealed gauge. Do not reuse calibrated / aneroided / wrong-window-ring.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Rubric** (rubricator list renumber). Different defect. NOT rubricator numbering.

**NOT Galley** (wet-proof / snapshot-write). Different defect. NOT print-shop galley proofs.

**NOT Quoin mentions** (type-locking quoins). Different hardware. Oriel is the projecting bay, not a chase quoin.

**NOT Casement mentions** (side-hung casement sash). Different fenestration. Oriel is the *projecting* bay window, not a flush casement.

Do NOT rename Oriel to any existing catalog slug. Catalog currently has 335 products; Oriel is #336 after Anarthria #335.
Do NOT reuse idle articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / singular / as-penned or seeded anarthria / trismus / foundling / crased / tessellated / mojibaked / scisselled / unseised / apographed.

Display here is **Newsreader**. Body is **DM Sans**. Mono is **IBM Plex Mono**.

Different surface: macOS Desktop pop-out/maximised plan window whose text does not reflow vs dictation paste swallow vs UNUserNotification XPC lockjaw vs subagent Bash that outlives the child agent vs store-slug collide vs version-named TCC path vs Windows U+FFFD vs argv truncation vs preview_start EPERM vs Desktop sidebar reopen fork vs sandbox socat race.

Different UI: stone / parchment / mullion ink / amber glass / sash green / empty-margin blush / vertical mullion strip / leaded-glass panes / stone sill. Newsreader / DM Sans / IBM Plex Mono. NOT clinic teal. NOT enamel tile. NOT linen hatch. NOT wheat stubble. NOT twin pulpits. NOT vellum ligature. NOT limestone mosaic. NOT rice-paper type case. NOT slag floor copper die. NOT oak panel parchment. NOT cream parchment scriptorium. NOT navy hull. NOT Humphrey bowl. NOT sealed gauge. NOT aged newsprint.

Different verbs: Admit reflowed, Score oriel, Walk plan-no-reflow, Compare reflowed / oriel, Pin idle reflowed, Pin seeded oriel, Pin plan-no-reflow, Span the manuscript.

Different idle: **reflowed**. Different #93809 seeded path: **oriel**. HOLD: **reflowed** / **hold**. ALARM: **oriel** / **plan-no-reflow** / **pop-out** / **empty-margin**. Path: **plan-no-reflow**.

## How to score

```bash
node --test projects/oriel/oriel.test.mjs
node projects/oriel/oriel.mjs projects/oriel/data/oriel.json
echo '{"seed":"oriel"}' | node projects/oriel/oriel.mjs
```

Open the living card at `projects/oriel/index.html` (or the live path `/oriel/`). Buttons: Admit reflowed, Score oriel, Walk plan-no-reflow, Compare reflowed / oriel, Pin idle reflowed, Pin seeded oriel, Pin plan-no-reflow, Span the manuscript. Toggle chips for: plan-no-reflow, pop-out, maximised, empty-margin — the score flips. Lay a fixture JSON on the stone sill. `?embed=1` hides chrome.

The booth reconstructs the reporter’s pop-out / maximised / empty-right-margin walk from the published #93809 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/oriel/
- Folder: `projects/oriel/`
