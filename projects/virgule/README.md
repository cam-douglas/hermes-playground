# Virgule

A **compositor’s type-case / composing stick** desk — lead sorts in oak drawers, a brass composing stick, ink black on cream paper, a vermilion virgule mark; Libre Baskerville + Work Sans + JetBrains Mono — for a real Claude Code defect: typing `/` **no longer opens the slash-command / skill menu** unless `/` is at **index 0 of the message**. Mid-message `/` inserts a literal slash. Line-start after a newline is also broken. The menu itself is healthy at index 0. Full-name invocation still works.

Primary:

- [anthropics/claude-code#91337](https://github.com/anthropics/claude-code/issues/91337) (OPEN, bug, has repro, platform:macos, area:tui, regression, area:skills, filed 2026-09-01T22:31:58Z). Title: [BUG] `/` no longer opens the slash-command menu mid-message — only at index 0 (regressed in 2.1.247, last good 2.1.246). Reporter MaksimCher.

A virgule that only strikes at index zero is not a hold. Score the stick or admit **cased**.

Idle word: **cased**. Seeded state: **literal** / #91337 — `/` mid-message inserts literal slash; menu only at message index 0; line-start after newline also broken; menu healthy at index 0; full-name invocation still works; regression 2.1.246→2.1.247. Never idle as literal / jammed / sifted / stocked / aired / drained / hinged / pealed / warded / first-wins / seized / pooled.

A **virgule** is the typographic slash. A compositor seats it in the composing stick at a word boundary so the next sort can be picked. The slash/skills rail should open wherever `/` is typed at a word boundary. Instead the trigger is bound to message index 0 — a virgule that only strikes at the left of the stick.

- **literal** = #91337: `/` mid-message inserts literal slash; menu only at message index 0; line-start after newline also broken; menu healthy at index 0; full-name invocation still works; regression 2.1.246→2.1.247
- **index-zero-only** = slash/skills menu trigger bound to message index 0 only
- **mid-message-literal** = after any preceding character, `/` is inserted as a literal slash and no menu appears
- **line-start-broken** = bound to index 0, not to the start of a line; `/` as the first character of the second line does nothing either
- **menu-healthy-at-zero** = at index 0 the menu opens and lists everything correctly; this is not #48963 / #49148
- **discovery-dead** = mid-message menu gone; built-in commands, plugin commands, and file-based skills from `~/.claude/skills/` alike are unreachable mid-message
- **invocation-still-works** = typing a skill name in full mid-message still gets picked up and run; only the menu is gone
- **regression-2-1-247** = last working version **2.1.246**; first bad **2.1.247**; desktop-app logs installed 2.1.246 on 2026-08-26; 2.1.247 on 2026-08-28; 2.1.255 on 2026-09-01
- **word-boundary-expected** = `/` at a word boundary should open the menu, filter as you type, insert selection at caret; `/` inside a token stays silent (`src/utils`, `and/or`, `http://`)
- **hold** = `/` at word boundary opens slash/skills menu; mid-message discovery works; selection inserts at caret; the stick is cased
- **cased** = HOLD: `/` at word boundary opens slash/skills menu; mid-message discovery works; selection inserts at caret; tokens like `src/utils` stay silent

Verdicts: cased, literal, index-zero-only, mid-message-literal, line-start-broken, menu-healthy-at-zero, discovery-dead, invocation-still-works, regression-2-1-247, word-boundary-expected, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the stick is cased or literal.

Hypothesis only (NON-BINDING): the 2.1.247 fix tightening what counts as a slash command (`/--` prompts) may also have tightened *where* the menu is allowed to trigger (index 0 only). Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **SLASH / SKILLS MENU TRIGGER BOUND TO MESSAGE INDEX 0 ONLY (regression 2.1.246→2.1.247); MID-MESSAGE DISCOVERY DEAD WHILE FULL-NAME INVOCATION STILL WORKS.**

NOT **Riddle** ([#91327](https://github.com/anthropics/claude-code/issues/91327)) — devcontainer ipset duplicate + set -e firewall abort / mesh sieve.
NOT **Garner** ([#91246](https://github.com/anthropics/claude-code/issues/91246)) — Desktop archive-to-pool no TTL / loft.
NOT **Pintle** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — PreToolUse Bash relative-path cwd-drift deadlock.
NOT **Carillon** ([#91250](https://github.com/anthropics/claude-code/issues/91250)) — plugin SessionStart first-wins.
NOT **Postern** ([#91223](https://github.com/anthropics/claude-code/issues/91223)) — socket-dir squat.
NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork Toke/File/SeAt kernel pool leak / millrace.
NOT **Alidade** ([#91055](https://github.com/anthropics/claude-code/issues/91055)) — silent foreign host.
NOT **Cockade** ([#91033](https://github.com/anthropics/claude-code/issues/91033)) — ultracode badge / effort slider mismatch.
NOT leftover woodworking / mm-slider.
NOT #48963 / #49148 (picker entries missing — menu is healthy at index 0 here).

Cousins are cite-only on a cousin strip; primary stays #91337.

Product name stays **Virgule**. Do not rename to Slash, Menu, Trigger, Index, Composer, Stick, Case, Sort, Riddle, Garner, Pintle.

Different UI: brass composing stick / lead type sorts / ink black / cream paper / vermilion virgule mark / oak type-case drawers. Libre Baskerville + Work Sans + JetBrains Mono. NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson/IBM Plex Mono (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair (Carillon). NOT Cinzel (Postern). NOT Libre Caslon (Alidade).

Different verbs: score the stick, pin idle cased, pin seeded literal, admit cased, load fixtures, reset to cased. Not "Score the mesh/loft/hinge/peal/peg/postern/race".

Different idle: **cased**.

## Live catalog path

`/virgule/` is this static composing-stick desk. Path `https://hermes-playground-green.vercel.app/virgule/` and subdomain `https://virgule.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `08:50 / hermes catalog #109 / #91337`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **cased** — `/` at word boundary opens slash/skills menu; mid-message discovery works; selection inserts at caret; tokens like `src/utils` stay silent.
2. Seed **literal** → #91337: `/` mid-message inserts literal slash; menu only at message index 0; line-start after newline also broken; menu healthy at index 0; full-name invocation still works; regression 2.1.246→2.1.247.
3. Stick UI: oak type-case drawers / brass composing stick / lead sorts / vermilion virgule. Cased = stick open at a word boundary. Literal = virgule only at index 0.
4. Cousin cite strip labeled cousin-not-primary: [#48963](https://github.com/anthropics/claude-code/issues/48963) / [#49148](https://github.com/anthropics/claude-code/issues/49148) / [#55173](https://github.com/anthropics/claude-code/issues/55173) / [#44488](https://github.com/anthropics/claude-code/issues/44488) / [#40413](https://github.com/anthropics/claude-code/issues/40413) / [#29752](https://github.com/anthropics/claude-code/issues/29752) / [#13073](https://github.com/anthropics/claude-code/issues/13073). Cite only. Primary stays #91337.
5. **Score the stick** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/virgule/index.html` in a browser, or serve the repo root and visit `/virgule/` (Vercel rewrite → `/projects/virgule`). No build step. Optional hook:

```bash
node projects/virgule/hook/virgule.mjs projects/virgule/data/91337.json
node projects/virgule/hook/virgule.mjs projects/virgule/data/cased.json
node --test projects/virgule/hook/virgule.test.mjs
```

Literal seed → literal/alarm. Cased seed → cased/hold.

`projects/virgule/hook/virgule.mjs` classifies a probe ticket JSON `{ caretIndex, menuOpens, slashLiteral, wordBoundary, lineStartBroken, menuHealthyAtZero, discoveryDead, invocationWorks }` and returns `{ verdict, chips[], reasons[], cased, literal, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91337.json`, `data/literal.json`, `data/cased.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts. Use versions 2.1.246 / 2.1.247 / 2.1.255 / 2.1.257, index 0, exact changelog phrases, related issue numbers. Never invent counts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91337](https://github.com/anthropics/claude-code/issues/91337). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Slack `#hermes-catalog` mention as the ship notice surface (text only; do not post).
3. Claude Code TUI / skills composer (caret index, word-boundary virgule) as the third native surface. Paste or drop a probe ticket JSON and score it.
4. Stick UI (oak type-case drawers / brass composing stick / lead sorts / vermilion virgule). Cased = stick open at a word boundary, literal = virgule only at index 0.
5. Cousin-not-primary cite strip: #48963, #49148, #55173, #44488, #40413, #29752, #13073.

## Sources

- [anthropics/claude-code#91337](https://github.com/anthropics/claude-code/issues/91337) OPEN — primary. Product stays Virgule.
- Typing `/` no longer opens the slash-command / skill menu unless `/` is at **index 0 of the message**. After any preceding character, `/` is inserted as a literal slash and no menu appears.
- Bound to index 0, **not** to the start of a line: in a multi-line message, `/` as the first character of the second line does nothing either.
- Not limited to skills: built-in commands, plugin commands, and file-based skills from `~/.claude/skills/` alike are unreachable mid-message.
- The menu itself is healthy at index 0 (lists everything correctly) — this is not #48963 / #49148; only the trigger position.
- Invocation still works, discovery doesn’t: typing a skill name in full mid-message still gets picked up and run; only the menu is gone.
- Both surfaces: Claude Code desktop app and terminal CLI.
- Used to work until ~2026-08-29; last working version **2.1.246**; first bad **2.1.247**.
- Desktop-app logs: installed 2.1.246 on 2026-08-26; 2.1.247 on 2026-08-28; 2.1.255 on 2026-09-01.
- 2.1.247 changelog suspect: “Fixed prompts beginning with `/--` … being rejected as an unknown slash command instead of being sent to Claude”.
- 2.1.250 (landed after onset): “Changed the action menu to list slash commands in a filterable Slash commands dialog instead of inline”.
- Expected: `/` at a **word boundary** opens the menu, filters as you type, inserts selection at caret; `/` inside a token stays silent (`src/utils`, `and/or`, `http://`).
- Versions: CLI 2.1.257 and desktop embedded 2.1.255 both reproduce; macOS 26.4 arm64; Terminal.app zsh + desktop app.
- No console error — keystroke simply inserted as text.
- Cousins (cite, not primaries):
  - [#48963](https://github.com/anthropics/claude-code/issues/48963) — picker entries missing (different failure mode).
  - [#49148](https://github.com/anthropics/claude-code/issues/49148) — picker/list completeness (different).
  - [#55173](https://github.com/anthropics/claude-code/issues/55173) — related slash/skills UX cite.
  - [#44488](https://github.com/anthropics/claude-code/issues/44488) — mid-prompt slash FR history (cite; this issue is a regression of formerly-working behavior).
  - [#40413](https://github.com/anthropics/claude-code/issues/40413) — cite-only slash UX.
  - [#29752](https://github.com/anthropics/claude-code/issues/29752) — cite-only.
  - [#13073](https://github.com/anthropics/claude-code/issues/13073) — cite-only.
