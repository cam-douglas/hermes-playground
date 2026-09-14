# Epitome

A **classical scriptorium / abridger's desk / folio-compress / quill-knife / binding-press / gold-rule booth** — oak desk, vellum, gall ink, gold-rule, quill-knife, wash, blot. Fonts **Cormorant Garamond** (display) + **Source Sans 3** (body) + **IBM Plex Mono** (mono). Palette: desk `#1A1410`, vellum `#F3E6C8`, gall `#2A1C12`, gold-rule `#C4A35A`, knife `#8B4513`, wash `#6B7F8A`, blot `#A63D40`. Fresh trio. NOT Diabolica/#94040. NOT Sallyport/#94082. NOT Palilalia/#94041. NOT Sepulchre/#94055. NOT Sneck/#94052. NOT Drawbridge/#94049. NOT Chirograph/#94045. NOT Titulus. NOT Derelict. NOT Vestry. NOT Mondegreen. NOT Afterimage/#92596. NOT Phosphene. NOT Scotoma. NOT Scrim (runtime DLP redaction — different product). Completely different UI/UX/metaphor. This is specifically: **DESKTOP/MOBILE HARD-FORCE EMPTY THINKING CONTENT; NO OPT-OUT TO FULL CHAINS.**

The folio should stay **unabridged** (HOLD: full-chain / verbatim / open-folio / intact-thinking / chain-open). Instead the booth was **epitome** after a **summarized-thinking-force**.

Primary:

- [anthropics/claude-code#94032](https://github.com/anthropics/claude-code/issues/94032) (OPEN). Title: `[BUG] Desktop & Mobile: summarizedThinking feature flag (3531779070) forces --thinking-display summarized on all models with no user opt-out — full thinking chains completely inaccessible`. Labels: bug, has repro, platform:macos, platform:ios, area:desktop. Desktop and mobile apps inject `--thinking-display summarized` into every CLI spawn via hardcoded feature flag `summarizedThinking` (ID 3531779070). Thinking blocks arrive with empty content: `"thinking": ""` (signature present). `thinking_tokens` in usage is non-zero — model IS thinking; content is stripped. User pref `showThinkingSummaries` only toggles between "summarized" (empty content) and "omitted" (no thinking blocks) — neither restores full chains. No user-facing setting, env var, or CLI flag to opt out on desktop/mobile. Confirmed across models: claude-opus-4-6/4-7/4-8, claude-sonnet-5/4-6, claude-haiku-4-5 on macOS desktop and iOS mobile. Pro subscription. Logs: `[CCD] thinking display → summarized (view_open)` in ~/Library/Logs/Claude/main1.log. Continuation sessions (CLI on context overflow) return FULL thinking — API supports it; desktop/mobile layer strips it. Workarounds that work: Terminal CLI; continuation sessions (CLI self-spawn bypasses desktop `buildBaseExtraArgs()`). Reverse-engineered note in issue: flag hardcoded true via WC(true); both branches of buildBaseExtraArgs set a thinking-display value; no path leaves it unset for full thinking. Regression; last working unknown; ~before 2026-08-25. Claude Code Version 2.1.247. Cousins cite-only (do NOT rebuild / do NOT conflate): #49268 (Opus 4.7 display omitted default — different mechanism, same symptom), #77460 (Desktop ignores showThinkingSummaries on 4.7+/Fable 5 — closed, partial fix), #31326 (Terminal analog). Backups cite-only (next focus only — do not auto-pick): #94031 #94029 #93987 #93924 #93770 #93777 #94059 #94053. Stay off Epitome/Diabolica/Sallyport/Palilalia/Sepulchre/Sneck/Drawbridge/Chirograph/Titulus/Derelict/Vestry/Mondegreen/Afterimage/Phosphene/Scotoma paradigms.

12:50 epitome: a classical scriptorium / abridger's-desk / folio-compress / quill-knife / binding-press booth for #94032. Desktop & mobile hardcoded summarizedThinking (3531779070) injects --thinking-display summarized so thinking blocks arrive with empty content; showThinkingSummaries only toggles summarized↔omitted — no full-chain opt-out. Idle **unabridged** / seeded **epitome** / path **summarized-thinking-force**. Score epitome or admit unabridged.

Score epitome or admit unabridged.

Idle word: **unabridged** (HOLD: full-chain / verbatim). HOLD aliases: unabridged, full-chain, verbatim, open-folio, intact-thinking, chain-open. Seeded word: **epitome** / #94032 (the summarized-thinking-force path). Path word: **summarized-thinking-force**. Product score: **epitome**. Never idle innocent / sealed / silenced / living / cleared / spanned / matched / inscribed / berthed / pegged / latent / flushed or seeded diabolica / sallyport / palilalia / sepulchre / sneck / drawbridge / chirograph / titulus / derelict / vestry / mondegreen / afterimage / phosphene / scotoma / scrim / cannot-show-not-git / reminder-secret-bypass / goal-stop-refire / bash-nul-poison.

Phrase: **Score epitome or admit unabridged.**

- **unabridged** = IDLE: HOLD; folio open; knife sheathed; press idle
- **epitome** = #94032 seeded path and product score: forced abridgement; empty thinking body
- **summarized-thinking-force** = path word: hardcoded summarizedThinking injection
- **hold** = HOLD alias for idle unabridged
- **full-chain** = HOLD alias: thinking chains stay intact
- **verbatim** = HOLD alias: the folio body is kept
- **open-folio** = HOLD alias: vellum stays open on the gold-rule
- **intact-thinking** = HOLD alias: thinking text is not stripped
- **chain-open** = HOLD alias: the full-chain path stays open
- **empty-thinking** = thinking blocks arrive with `"thinking": ""`
- **signature-only** = signature present; folio body gone
- **thinking-tokens-nonzero** = usage tokens non-zero; content stripped
- **show-summaries-toggle** = showThinkingSummaries only toggles summarized ↔ omitted
- **omitted-vs-summarized** = neither restores full chains
- **continuation-full** = CLI self-spawn returns full thinking
- **desktop-inject** = `--thinking-display summarized` on every CLI spawn
- **flag-3531779070** = summarizedThinking hardcoded WC(true)
- **landing** = desk / vellum / gold-rule / knife / press
- **has-repro** = published shape: macOS desktop + iOS mobile · 2.1.247 · Pro
- **cousins** = cite-only #49268 #77460 #31326 — do not conflate
- **backups** = cite-only #94031 #94029 #93987 #93924 #93770 #93777 #94059 #94053 — do not auto-pick
- **fixtures** = desk / vellum / gold-rule / knife / press
- **walk** = published idle unabridged → summarized-thinking-force → epitome

Verdicts: unabridged, epitome, summarized-thinking-force, hold, full-chain, verbatim, open-folio, intact-thinking, chain-open, empty-thinking, signature-only, thinking-tokens-nonzero, show-summaries-toggle, omitted-vs-summarized, continuation-full, desktop-inject, flag-3531779070, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **epitome** or already **unabridged**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): desktop/mobile hardcodes summarizedThinking so buildBaseExtraArgs always sets --thinking-display summarized; preference cannot request full; continuation CLI spawn bypasses injection. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94032](https://github.com/anthropics/claude-code/issues/94032)
- Cousins: #49268 cite-only (Opus 4.7 display omitted default — different mechanism, same symptom). #77460 cite-only (Desktop ignores showThinkingSummaries on 4.7+/Fable 5 — closed, partial fix). #31326 cite-only (Terminal analog). Adjacent only. Different defects. Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #94031, #94029, #93987, #93924, #93770, #93777, #94059, #94053

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, platform:ios, area:desktop
- Claude Code 2.1.247; macOS desktop + iOS mobile; Pro subscription
- Feature flag summarizedThinking (3531779070) hardcoded true via WC(true)
- Both branches of buildBaseExtraArgs set a thinking-display value
- Thinking blocks: `"thinking": ""` with signature present; thinking_tokens non-zero
- showThinkingSummaries toggles summarized ↔ omitted only
- Continuation CLI spawn returns full thinking; Terminal CLI bypasses injection
- Regression; last working unknown; ~before 2026-08-25

Problem found: SUMMARIZED-THINKING-FORCE — desktop/mobile hard-force empty thinking content; no opt-out to full chains.

Why Epitome: An *epitome* is a condensed abridgement of a longer text. Desktop injects summarized thinking so the folio becomes an epitome with an empty body — signature/spine remains, the thinking text is gone. Afterimage/#92596 was Windows text paint latency (CRT phosphor). Phosphene/Scotoma were vision metaphors for other defects. This booth is specifically forced abridgement of thinking content by a hardcoded feature flag — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: unabridged catalog page + node diagnostic encoding idle **unabridged** / seeded **epitome** / path **summarized-thinking-force** so operators can score whether the booth is **epitome** or already **unabridged**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Users should be able to see full thinking chains, not empty strings
2. There should be a way to opt out of the summarizedThinking feature flag
3. A thinkingDisplay: "full" setting, an environment variable, or a CLI flag
4. showThinkingSummaries must not be the only control
5. Desktop/mobile must not hard-force --thinking-display summarized on every CLI spawn

## Why not a clone

This is specifically: **DESKTOP/MOBILE HARD-FORCE EMPTY THINKING CONTENT; NO OPT-OUT TO FULL CHAINS.**

Novel paradigm: classical scriptorium / abridger's desk / folio-compress / quill-knife / binding-press / gold-rule — desk, vellum, gold-rule, knife, wash, blot. New issue, new paradigm (summarized-thinking-force), new UI/UX/fonts/colors, new scoring vocabulary. Horizontal desk with an emptied folio, not a parchment court, CRT phosphor, fortress sallyport, clinic groove, or burial vault.

**NOT Diabolica/#94040** (cannot-show-not-git). Different defect. NOT inquisitorial parchment-court. Do not reuse innocent / diabolica / cannot-show-not-git.

**NOT Sallyport/#94082** (reminder-secret-bypass). Different defect. NOT fortress / gatehouse. Do not reuse sealed / sallyport / reminder-secret-bypass.

**NOT Palilalia/#94041** (goal-stop-refire). Different defect. NOT speech-pathology / phonograph-groove. Do not reuse silenced / palilalia / goal-stop-refire.

**NOT Sepulchre/#94055** (bash-nul-poison). Different defect. NOT stone burial vault / ossuary. Do not reuse living / sepulchre / bash-nul-poison.

**NOT Sneck/#94052** (chip dismiss ephemeral). Different defect. NOT Northern cottage / brass sneck-latch. Do not reuse cleared / sneck / chip-dismiss-ephemeral.

**NOT Drawbridge/#94049** (RC bridge auto-update drop). Different defect. NOT raised span / bailey. Do not reuse spanned / drawbridge / rc-bridge-update-drop.

**NOT Chirograph/#94045** (recorded branch never refreshed after `git branch -m`). Different defect. NOT medieval lectern / indenture. Do not reuse matched / chirograph / worktree-rename-stale.

**NOT Titulus** (iOS rename vs desktop sidebar / resume-stale-title). Different defect. NOT Roman marble plaque. Do not reuse inscribed / titulus.

**NOT Derelict** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict.

**NOT Vestry** (Linux bwrap placeholder mount cleanup is per-process). Different defect. NOT liturgical sacristy. Do not reuse pegged / vestry.

**NOT Mondegreen** (substring "git" false-positive). Different defect. NOT lyric-ballad / mishearing.

**NOT Afterimage/#92596** (Windows text paint latency). Different defect. NOT CRT phosphor.

**NOT Phosphene** (WindowServer CA layer-tree thrash). Different defect. NOT vision flash.

**NOT Scotoma.** Different defect. NOT vision gap.

**NOT Scrim** (runtime DLP redaction). Different product. Do not reuse flushed / scrim.

Live: https://hermes-playground-green.vercel.app/epitome/

```
node --test projects/epitome/epitome.test.mjs
node projects/epitome/epitome.mjs projects/epitome/data/epitome.json
```
