# Espagnolette

A **locksmith's espagnolette / casement-fastener bench** — weathered painted sash, brass rod bolt with lever handle, soft north-light workshop, graphite key matrix ledger, oxidized brass vs dead-key iron; Instrument Serif + Figtree + JetBrains Mono — for a real Claude Code defect: **ASKUSERQUESTION SELECTION KEYS DEAD AFTER WINDOW REFOCUS; SINGLE-QUESTION UNANSWERABLE; ANCESTOR TAB/ARROWS STILL LIVE.** When remount restores autoFocus (and resets chat-row isDisabled), the folio is **remounted**.

Primary:

- [anthropics/claude-code#92694](https://github.com/anthropics/claude-code/issues/92694) (OPEN, bug, has repro, platform:windows, platform:macos, area:tui). Title: `AskUserQuestion becomes unresponsive to selection keys after window refocus; single-question prompts unanswerable`. Filed 2026-09-07T16:06:07Z.

09:50 espagnolette: a locksmith's espagnolette / casement-fastener bench that still paints the AskUserQuestion caret after terminal blur/refocus but selection keys are dead; Tab/←/→ live; single-question prompts unanswerable except Ctrl+C; remount recovers. Score deaf or admit remounted.

Idle word: **attentive** (HOLD: AskUserQuestion selection keys stay live; caret and footer match a live prompt). Seeded state: **deaf** / #92694. Admit word: **remounted**. Never idle as waived, clear, bricked, unrung, porous, slipped, severed, misrouted, adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled, unanswered, stripped, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, ambered. Never seeded as refused, imprinted, ambered, bynamed, crenelled, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole, packed, roused, sighted, argbound, cleared.

**Espagnolette** = a locksmith's casement fastener: a long brass rod with a lever that throws bolts at both ends of a sash. After blur/refocus the sash still looks fastened (caret + footer paint) but the throw is deaf.

- **attentive** = IDLE: HOLD; selection keys stay live; caret and footer match a live prompt
- **deaf** = seeded word / #92694 path: caret still paints after blur/refocus; subtree keys (↑ ↓ Enter j/k 1–9 Esc) are dead
- **remounted** = admit hold: remount restores autoFocus and resets chat-row isDisabled
- **blur-deaf** = most of the time when the terminal loses focus and regains it, or after sitting idle
- **ancestor-live** = Tab / ← / → still work (ancestor-owned). Not an escape-sequence problem
- **single-deadend** = single-question prompts have no Submit tab; Ctrl+C is the only way out
- **remount-recovers** = Tab to Submit then back remounts the renderer (multi only)
- **isDisabled-signature** = ↓ Enter j/k 1–9 dying together is the Select isDisabled signature (from issue analysis)
- **focus-lost** = root Box (tabIndex:0, autoFocus:true) has lost ink focus (from issue analysis)
- **cousins** = cite-only #84489, #86918 (AskUserQuestion neighbourhood)
- **has-clear-repro** = issue labeled has repro

Verdicts: attentive, deaf, remounted, blur-deaf, ancestor-live, single-deadend, remount-recovers, isDisabled-signature, focus-lost, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether an AskUserQuestion after blur/refocus would leave the folio **deaf** or already **remounted**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): option list looks isDisabled (Select kills select:* and handleKeyDown together) AND question renderer root Box (tabIndex:0, autoFocus:true) has lost ink focus after blur/focus, while ancestor still handles Tab/arrows. When remount restores focus, the folio is remounted. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92694](https://github.com/anthropics/claude-code/issues/92694)
- Cousins cite-only (NOT primary): #84489 (AskUserQuestion options not selectable), #86918 (AskUserQuestion never times out while terminal focused)

What happened (from the issue body — do not invent):

- Claude Code 2.1.263 (also 2.1.260); macOS 15 / iTerm2 3.6.9 AND Windows — identical; settings `"tui": "fullscreen"`; filed 2026-09-07T16:06:07Z; labels bug, has repro, platform:windows, platform:macos, area:tui; OPEN
- AskUserQuestion still draws the option caret and footer (`Enter to select · Tab/Arrow keys to navigate · Esc to cancel`) after the terminal window loses focus and regains it (or after sitting idle)
- Dead: ↑ ↓ Enter j/k 1–9 Esc. Live: Tab ← → Ctrl+C
- Does not happen when the prompt appears while focused and is interacted with immediately
- Recovery: Tab to Submit then back (multi only); none on single-question except Ctrl+C
- Not escape encoding (ESC[A/B dead while ESC[C/D live; Enter dead while Tab live); not wheel; not chord timeout

Problem found: ASKUSERQUESTION SELECTION KEYS DEAD AFTER WINDOW REFOCUS; SINGLE-QUESTION UNANSWERABLE; ANCESTOR TAB/ARROWS STILL LIVE.

Why this solution: a diagnostic scorer for the attentive → deaf / remounted folio chain, so a reader can pin idle attentive, seed deaf (#92694 path), and score blur-deaf / ancestor-live / single-deadend / remount-recovers / isDisabled-signature / focus-lost / cousins against the published facts.

## Why not a clone

This is specifically: **ASKUSERQUESTION SELECTION KEYS DEAD AFTER WINDOW REFOCUS; SINGLE-QUESTION UNANSWERABLE; ANCESTOR TAB/ARROWS STILL LIVE**.

**NOT #84489** (AskUserQuestion options not selectable — cite-only).

**NOT #86918** (AskUserQuestion never times out while terminal focused — cite-only).

**NOT Imprimatur/#92740** (Skip Artifact first-publish — already shipped). Do not touch Imprimatur.

**NOT Byname/#92738** (Desktop slash false-negative on a bare plugin-skill byname — already shipped). Do not touch Byname.

**NOT Crenel/#92729** (empty-object `resources:{}` capability treated as absent — already shipped). Do not touch Crenel.

**NOT Quietus/#92716**. **NOT Cribble/#92684**. **NOT Springe/#92675**.

Different paradigm: **ASKUSERQUESTION SELECTION KEYS DEAD AFTER WINDOW REFOCUS**.

Cousins cite-only (NOT primary): #84489, #86918. Different surfaces. Do not auto-pick as thesis.

Do NOT rename this product Imprimatur, Byname, Crenel, Quietus, Cribble, Springe, Gangway, Waybill, Snatch, Speakpipe, or Afterimage.
Do NOT reuse idle waived / clear / bricked / unrung / porous / slipped / severed / misrouted / adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled / unanswered / stripped / quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / ambered.
Do NOT reuse seeded refused / imprinted / ambered / bynamed / crenelled / quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole / packed / roused / sighted / argbound / cleared.

Different surface: AskUserQuestion selection keys dead after window refocus vs Skip-mode first Artifact publish / Desktop slash false-negative byname / empty-object resources capability / SubagentStop kill path / denyWrite mid-path wildcards / plugin-native PreToolUse interactive slip.

Product name stays **Espagnolette**. Name/slug `espagnolette` confirmed unused in catalog.json (214 products before this ship; Imprimatur is #214).

Different UI: locksmith's espagnolette / casement-fastener bench / weathered painted sash / brass rod bolt / north-light workshop / graphite key matrix / oxidized brass vs dead-key iron. Instrument Serif / Figtree / JetBrains Mono. NOT Playfair Display / DM Sans / Fira Code (Imprimatur). NOT Newsreader / Sora (Byname). NOT Ibarra Real Nova / Plus Jakarta / Geist Mono (Crenel). NOT Cardo / Public Sans / Fragment Mono (Quietus). NOT Young Serif / Karla (Cribble). NOT Bodoni / Nunito (Springe). NOT crimson wax / parchment / ink-black.

Different verbs: Score deaf, Admit remounted, Pin idle attentive, Seed deaf, Reset to attentive, Load fixtures, Simulate blur / refocus, Remount the folio.

Different idle: **attentive**. Different seeded: **deaf**. HOLD: **attentive** / **remounted**. ALARM: **deaf** / **blur-deaf** / **ancestor-live** / **single-deadend** / **remount-recovers** / **isDisabled-signature** / **focus-lost** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/espagnolette/hook/espagnolette.test.mjs
node projects/espagnolette/hook/espagnolette.mjs projects/espagnolette/data/92694.json
node projects/espagnolette/hook/espagnolette.mjs projects/espagnolette/data/attentive.json
echo '{"seed":"deaf","deaf":true}' | node projects/espagnolette/hook/index.mjs
```

Open the living card at `projects/espagnolette/index.html` (or the live path `/espagnolette/`). Buttons: Score deaf, Admit remounted, Pin idle attentive, Seed deaf, Load fixtures, Reset to attentive. Simulate blur / refocus. Remount the folio. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/espagnolette/
- Subdomain: https://espagnolette.hermes-playground-green.vercel.app
- Folder: `projects/espagnolette/`
