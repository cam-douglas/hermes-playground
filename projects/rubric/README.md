# Rubric

A **scriptorium / manuscript-rubricator bench** — vermilion rubric numbers on cream parchment, oak desk, iron-gall ink, candle; Cardo + Figtree + Source Code Pro — for a real Claude Code defect: **THE TUI SHOULD ECHO THE USER'S OWN ORDERED-LIST NUMBERS AS PENNED; INSTEAD, WHEN THOSE NUMBERS ARE NOT ALREADY SEQUENTIAL, EVERY ITEM AFTER THE FIRST IS REWRITTEN TO FIRST+1, FIRST+2, … SO TYPED `3. / 2. / 1. / 4. / 5.` DISPLAYS AS `3. / 4. / 5. / 6. / 7.` AND ANSWERS BIND TO THE WRONG QUESTIONS (REGRESSION 2.1.234).** Display-only on current versions: the model still receives the typed digits. Last working 2.1.233; measured on 2.1.263.

Primary:

- [anthropics/claude-code#92855](https://github.com/anthropics/claude-code/issues/92855) (OPEN, bug, has repro, platform:linux, area:tui, regression, area:ui). Title: `[BUG] TUI renumbers the user's own ordered list when echoing it — every item after the first loses its typed number (regression in 2.1.234)`. Claude Code 2.1.263; last working 2.1.233; Ubuntu/Debian Linux; Xterm.

02:50 rubric: a scriptorium rubricator bench that should keep the user's own ordered-list numbers as penned; instead the TUI renumbers every item after the first sequential from the first number so typed 3/2/1/4/5 displays as 3/4/5/6/7 and answers bind to the wrong questions; score rewritten or admit as-penned.

Score rewritten or admit as-penned.

Idle word: **as-penned** (HOLD: the echo keeps every ordered-list number as typed). #92855 path: **rewritten**. Seeded misbind: **misbound**. Never idle as paid (Sheave), vaulted (Mailslot), cleared (Ukase), armed (Scabbard), receipted (Deadletter), fused (Dryjoint), remounted (Espagnolette). Never use fouled, spilled, ukased, stripped, lost, dry, deaf as the #92855-path word either.

**Rubric** = the vermilion number a rubricator pens in the margin of a folio. The TUI should leave those numbers as penned. Instead the echo rewrites every item after the first sequential from the first number, so answers bind to the wrong questions.

- **as-penned** = IDLE: HOLD; echoed ordered-list numbers kept as typed
- **rewritten** = #92855 path: later items become first+1, first+2, …
- **misbound** = seeded misbind: typed 3/2/1/4/5 displays as 3/4/5/6/7
- **start-honoured** = control: lone `2.` stays `2.`; start index preserved
- **sequential-ok** = control: `1. 2. 3.` already sequential; preserved
- **paren-renumbered** = `3) 2) 1)` → `3) 4) 5)`; #75199 workaround dead
- **blank-line-renumbered** = blank lines between `3. 2. 1.` still `3. 4. 5.`
- **display-only** = echo rewrites; `message.content` stays verbatim
- **before-after** = 2.1.233 as-penned; 2.1.234 rewritten

Verdicts: as-penned, rewritten, misbound, start-honoured, sequential-ok, paren-renumbered, blank-line-renumbered, display-only, before-after.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No network to Anthropic. Score whether a non-sequential ordered list would sit **rewritten** or already **as-penned**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): markdown ordered-list renumbering on the echo/render path; invite verify against #92855 only. Do NOT implement a fix in anthropics/claude-code.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92855](https://github.com/anthropics/claude-code/issues/92855)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:linux, area:tui, regression, area:ui
- Claude Code 2.1.263; last working 2.1.233; regression in 2.1.234; Ubuntu/Debian Linux; Xterm
- When a submitted message contains an ordered list whose numbers are not already sequential, the TUI echoes it with the numbers rewritten
- Only the first item's number survives; every later item is replaced by first+1, first+2, …
- Typed `3. / 2. / 1. / 4. / 5.` displays as `3. / 4. / 5. / 6. / 7.` — answers to questions 2 and 1 appear as answers to 4 and 5
- Display-only now. Session JSONL `message.content` carries `3. / 2. / 1. / 4. / 5.` verbatim (checked on v2.1.261)
- Lone `2.` is preserved (start index honoured). `1. 2. 3.` is preserved (already sequential)
- `2. 5.` → `2. 3.`; `3. 2. 1.` → `3. 4. 5.`; same with blank lines between; `3) 2) 1)` → `3) 4) 5)`
- `#75199` `N)` workaround is dead on 2.1.263. `3\.` keeps the number but shows the backslash
- 2.1.234 changelog: "Improved the transcript: your own prompts now render markdown (highlighted code blocks, inline code, lists) the same way replies do."
- User-message counterpart of open #87790 (same renumbering on agent replies)
- Prior closed/locked reports of this area: #51697, #55753, #61463, #64288, #69768, #75199
- Repro: `claude --bare`, paste the five-line list, submit, look at the echo. No credentials needed — the rewrite happens before any request
- Debian 13 (trixie), x86_64, container; `TERM=xterm-256color`, 100×40. Pre-submit input box holds numbers as typed; evidence is after submit

Problem found: A TUI ECHO THAT SHOULD KEEP THE USER'S OWN ORDERED-LIST NUMBERS AS PENNED INSTEAD REWRITES EVERY ITEM AFTER THE FIRST SEQUENTIAL FROM THE FIRST NUMBER, SO TYPED 3/2/1/4/5 DISPLAYS AS 3/4/5/6/7 AND ANSWERS BIND TO THE WRONG QUESTIONS.

Why this solution: a diagnostic scriptorium rubricator for the as-penned → rewritten misbind, so a reader can pin idle as-penned, load the #92855 rewritten path, and score misbound / start-honoured / sequential-ok / paren-renumbered / blank-line-renumbered / display-only / before-after against the published facts.

## Why not a clone

This is specifically: **TUI ECHO REWRITES THE USER'S OWN ORDERED-LIST NUMBERS SEQUENTIAL FROM THE FIRST ITEM (REGRESSION 2.1.234).**

**NOT Espagnolette/#92694** (AskUserQuestion keys dead after blur — already shipped). Cite only. Do not touch Espagnolette.

**NOT Quill/#92788** (AskUserQuestion free-text discard — do not ship Quill). Cite only. Do not ship Quill.

**NOT Sheave/#92827** (queued `/Users` path as slash command — already shipped). Cite only. Do not touch Sheave.

**NOT Mailslot/#92839.** Keychain argv-fallback pbt. Already shipped. Do not touch Mailslot.

**NOT Ukase/#92833. NOT Scabbard/#92820. NOT Deadletter/#90049. NOT Dryjoint/#92809.** Already shipped. Do not touch.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session.

Different paradigm: **the rubricator should leave the user's own numbers as penned; the echo instead sequentializes every item after the first.**

Do NOT rename this product Sheave, Mailslot, Ukase, Scabbard, Deadletter, Dryjoint, Espagnolette, Quill, or any existing catalog slug.
Do NOT reuse idle paid / vaulted / cleared / armed / receipted / fused / remounted. Do NOT reuse seeded fouled / spilled / ukased / stripped / lost / dry / deaf.

Different surface: TUI user-message ordered-list echo vs AskUserQuestion key death / free-text discard / mid-turn `/Users` slash hitch.

Product name stays **Rubric**. Name/slug `rubric` confirmed unused in catalog.json (229 products before this ship; Sheave is #229).

Different UI: scriptorium rubricator desk / vermilion numbers / cream parchment folio / oak desk / candle / iron-gall ink. Cardo / Figtree / Source Code Pro. NOT Fraunces + Plus Jakarta + IBM Plex (Sheave). NOT Libre Bodoni + Karla (Mailslot). NOT Cinzel + Source Sans 3 (Ukase). NOT Cormorant Unicase + Sora (Scabbard). NOT Newsreader + Figtree (Deadletter). NOT Space Grotesk + Manrope (Dryjoint). NOT Instrument Serif + Figtree (Espagnolette). NOT a deck sheave, postal mailslot, imperial wax seal, empty scabbard, or Keychain vault.

Different verbs: Score rewritten, Admit as-penned, Pin idle as-penned, Load rewritten, Load misbound, Reset to as-penned.

Different idle: **as-penned**. Different #92855 path: **rewritten**. HOLD: **as-penned**. ALARM: **rewritten** / **misbound** / **paren-renumbered** / **blank-line-renumbered** / **display-only** / **before-after**.

## How to score

Open the living card at `projects/rubric/index.html` (or the live path `/rubric/`). Buttons: Score rewritten, Admit as-penned, Pin idle as-penned, Load rewritten, Load misbound, Load fixtures, Reset to as-penned. Hang a quire chip. Drop a fixture JSON. Type a list into the pen assay to see as-penned numbers vs rewritten sequential. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/rubric/
- Folder: `projects/rubric/`
