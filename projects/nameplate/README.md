# Nameplate

A **brass nameplate / hotel door-plate booth** — a *nameplate* is the engraved brass plate on a hotel door. The guest writes a new name; the plate shows it for one frame, then snaps back to the old engraving. The front-desk ledger already recorded the new name — reload the window and the plate is correct. List-rename (the corridor directory) works. Only the header plate rolls back. Fonts **Libre Baskerville** (display) + **Source Sans 3** (body) + **Fragment Mono** (mono). Palette: brass `#B08D57`, plate cream `#F7F1E5`, mahogany `#3B1F14`, ink `#1A1A1A`, verdigris `#2F6F5E`. Fresh trio. Completely different UI/UX/metaphor — hotel corridor / mahogany door / brass screws / front-desk ledger. NOT a lacquer nesting doll. NOT a night blotter. NOT an enrollment desk. NOT a type-foundry. NOT a neurology desk. NOT a gauntlet/lictor/lychgate/ouster/proscription booth.

The plate should stay **affixed** (HOLD: header rename sticks; plate keeps the new engraving; no TypeError rollback). Instead the booth was **nameplate** after a **header-rename**.

Primary:

- [anthropics/claude-code#94349](https://github.com/anthropics/claude-code/issues/94349) (OPEN). Title: `[BUG] [VS Code] Renaming a session from the chat header reverts instantly (2.1.270 regression)`. Labels: bug, has repro, platform:windows, area:ide, platform:vscode, regression. Environment: VS Code extension 2.1.270 (CLI: 2.1.238); last working 2.1.267. Renaming a session from the title in the Claude view header shows the new name for one frame, then reverts. Renaming the same session from the activity-bar session list works. The title IS persisted — reload the window and the new name is there. Only the header view rolls back. Reporter hypothesis (issue text, NON-BINDING): `Comm.renameSessionOnCli` calls `query.renameSession(Q,$)` but `renameSession` does not exist on the SDK query class. The call throws a synchronous `TypeError`, so `.catch(X)` never attaches — the throw escapes `Comm.renameSession`, `handleRequest` returns `{type:"error"}`, and the webview store's `renameBaseline` rollback restores the old title. Header rename originates from the comm that owns the session's live CLI channel (throws). List rename originates from a comm with no channel; fan-out echo adopts the title before the throwing call; `adoptPersistedTitle` early-returns when summary already equals the new title, so echo cannot repair the header path. No close cousins named in the #94349 issue text. Stay off Matryoshka/Dragnet/Matricula/Allograph/Agraphia/Gauntlet/Lictor/Lychgate/Ouster/Proscription/Frisket/Scant/Titulus/Palinode/Epitaph/Escutcheon paradigms. Do NOT pick #94336.

04:50 nameplate: a brass nameplate / hotel door-plate booth for #94349. VS Code header rename shows the new session title for one frame then reverts because query.renameSession is missing on the SDK query class (sync TypeError escapes before .catch; renameBaseline rolls back) while the title is already persisted and list-rename works. Idle **affixed** / seeded **nameplate** / path **header-rename**. Score nameplate or admit affixed.

Score nameplate or admit affixed.

Idle word: **affixed** (HOLD: header rename sticks; plate keeps the new engraving; no TypeError rollback). HOLD aliases: engraved, hung, plated, labeled, titled. Seeded word: **nameplate** / #94349 (the header-rename path). Path word: **header-rename**. Product score: **nameplate**. Never idle unpacked / descended / recursed / opened / nested-ok / walked-in / scoped / fenced / bounded / warranted / project-rooted / cwd-scoped / enrolled / equated / penned / ungloved / attested / reaped / tenanted / barred or seeded Matryoshka / Dragnet / Matricula / Allograph / Agraphia / gauntlet / lictor / lychgate / ouster / proscription / frisket / scant or path subst-nest / root-find / reload-blind / win-posix-mismatch / pre-tool-omit.

Phrase: **Score nameplate or admit affixed.**

- **affixed** = IDLE HOLD: header rename sticks; plate keeps the new engraving; no TypeError rollback
- **nameplate** = seeded path / product score: brass plate snaps back while the ledger already wrote
- **header-rename** = path word
- **hold** = HOLD alias for idle affixed
- **engraved** = HOLD alias: new cut holds
- **hung** = HOLD alias: plate stays hung
- **plated** = HOLD alias: brass holds
- **labeled** = HOLD alias: card labeled
- **titled** = HOLD alias: title sticks
- **typeerror-escape** = sync `TypeError: J.query.renameSession is not a function`; `.catch` never attaches
- **rename-baseline-rollback** = `handleRequest` `{type:"error"}`; store restores the old title
- **list-rename-ok** = activity-bar session list keeps the new name
- **persisted-on-reload** = reload the window and the new name is there
- **header-one-frame** = new name for one frame, then revert
- **live-channel** = header rename originates from the comm that owns the CLI channel
- **adopt-persisted** = `adoptPersistedTitle` early-returns when summary already equals the new title
- **landing** = brass nameplate / hotel door-plate
- **has-repro** = published shape: 2.1.270 VS Code Windows
- **cousins** = none named in #94349 — cite-only related #94017 #94257 #94285 #88992 — do not rebuild; do not conflate
- **backups** = cite-only #93924 #93770 #93777 #94151 #94348 #94336 — do not auto-pick
- **fixtures** = brass plate / mahogany door
- **walk** = published idle affixed → header-rename → nameplate
- **closed** = #94349 remains OPEN — cite only; not this booth

Verdicts: affixed, nameplate, header-rename, hold, engraved, hung, plated, labeled, titled, typeerror-escape, rename-baseline-rollback, list-rename-ok, persisted-on-reload, header-one-frame, live-channel, adopt-persisted, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **nameplate** or already **affixed**. Fixtures use the issue's published incident only. Header-rename rows are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — reporter hypothesis / issue text): `Comm.renameSessionOnCli` calls `query.renameSession(Q,$)` but `renameSession` does not exist on the SDK query class. The call throws a synchronous TypeError, so `.catch(X)` never attaches — the throw escapes `Comm.renameSession`, `handleRequest` returns `{type:"error"}`, and the webview store's `renameBaseline` rollback restores the old title. Invite verify against #94349 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94349](https://github.com/anthropics/claude-code/issues/94349)
- Cousins: no close cousins named in #94349. Cite-only related (search — do NOT rebuild / do NOT conflate): #94017 (renamed sessions revert to auto-generated title; ai-title rewritten), #94257 (session tab reverts on Enter), #94285 (live tabs ignore saved custom title), #88992 (sidebar pencil vs /rename sync). Closed mentions from those texts: #40787 #46587 #65010.
- Backups (data only; next focus only — do not auto-pick): #93924, #93770, #93777, #94151, #94348, #94336 (Agraphia cousin — do not ship)

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:windows, area:ide, platform:vscode, regression
- Environment: VS Code extension 2.1.270 (CLI: 2.1.238); last working 2.1.267
- Header rename shows the new name for one frame, then reverts
- Activity-bar list rename works
- Title is persisted — reload the window and the new name is there
- Only the header view rolls back
- Reporter: `query.renameSession` missing on the SDK query class
- Sync TypeError; `.catch` never attaches
- `handleRequest` returns `{type:"error"}`
- `renameBaseline` rollback restores the old title
- Header path owns the live CLI channel; list path does not
- `adoptPersistedTitle` early-returns when summary already equals the new title
- Output channel: `TypeError: J.query.renameSession is not a function`; trailing `update_session_state` carries the OLD title

Problem found: HEADER-RENAME — header plate snaps back after one frame while the ledger already wrote the new name.

Why Nameplate: A brass hotel *nameplate* is the engraved door card. The guest writes a new name; the plate flickers it then restores the old cut, even though the front-desk ledger already recorded the stay. Matryoshka/#94350 was a lacquer nesting-doll / subst-nest — DIFFERENT. Dragnet/#94064 was a night blotter / root-find — DIFFERENT. Matricula/#93987 was an enrollment desk / reload-blind — DIFFERENT. This booth is specifically header-rename on a VS Code header-only snap-back — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: affixed catalog page + node diagnostic encoding idle **affixed** / seeded **nameplate** / path **header-rename** so operators can score whether the booth is **nameplate** or already **affixed**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The header shows the new title, matching what was persisted and what the activity-bar session list shows
2. A header rename must not roll back after one frame when the title is already persisted
3. A missing `query.renameSession` must not throw a synchronous TypeError past `.catch`
4. `handleRequest` must not return `{type:"error"}` for a rename that already wrote the ledger
5. `renameBaseline` must not restore the old title when the new name is persisted
6. List rename remaining working is the published positive control

## Why not a clone

This is specifically: **VS CODE HEADER RENAME SHOWS THE NEW SESSION TITLE FOR ONE FRAME THEN REVERTS BECAUSE `query.renameSession` IS MISSING ON THE SDK QUERY CLASS (SYNC TYPEERROR ESCAPES BEFORE `.catch`; `renameBaseline` ROLLS BACK) WHILE THE TITLE IS ALREADY PERSISTED AND LIST-RENAME WORKS.**

Novel paradigm: brass hotel door-plate / mahogany corridor / front-desk ledger / verdigris hinge — brass, cream, mahogany, ink, verdigris. New issue, new paradigm (header-rename), new UI/UX/fonts/colors, new scoring vocabulary. A hotel door-plate, not a nesting-doll workshop, night blotter, enrollment desk, type-foundry ledger, neurology clinic, tilting-yard glove, purple fasces aisle, parish porch, bailiff desk, or Roman tablet.

**NOT Matryoshka/#94350** (subst-nest). Different defect. NOT lacquer nesting-doll. Do not reuse unpacked / Matryoshka / subst-nest.

**NOT Dragnet/#94064** (root-find). Different defect. NOT night blotter. Do not reuse scoped / Dragnet / root-find.

**NOT Matricula/#93987** (reload-blind). Different defect. NOT enrollment desk. Do not reuse enrolled / Matricula / reload-blind.

**NOT Allograph/#94256** (win-posix-mismatch). Different defect. NOT type-foundry / punchcutter. Do not reuse equated / Allograph / win-posix-mismatch.

**NOT Agraphia/#94251** (pre-tool-omit). Different defect. NOT clinical writing-desk. Do not reuse penned / Agraphia / pre-tool-omit.

**NOT Gauntlet/#94029** (attach-mouse). Different defect. NOT tilting-yard / iron glove. Do not reuse ungloved / gauntlet / attach-mouse.

**NOT Lictor/#94053** (picker-bypass). Different defect. NOT purple fasces aisle. Do not reuse attested / lictor / picker-bypass.

**NOT Lychgate/#94059** (bg-task-stale). Different defect. NOT parish porch. Do not reuse reaped / lychgate / bg-task-stale.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / proscription / deny-list-hollow.

**NOT Frisket.** Different catalog paradigm. Do not reuse Frisket.

**NOT Scant.** Different catalog paradigm. Do not reuse Scant.

**NOT Titulus / Palinode / Epitaph / Escutcheon.** Different catalog paradigms.

**NOT #94336.** Between-tool text mistyped as thinking — Agraphia cousin. Cite-only. Do not ship.

Live: https://hermes-playground-green.vercel.app/nameplate/

```
node --test projects/nameplate/nameplate.test.mjs
node projects/nameplate/nameplate.mjs projects/nameplate/data/nameplate.json
```
