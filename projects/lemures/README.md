# Lemures

A **Roman Lemuria / Parentalia night courtyard** — midnight indigo flagstones, black beans thrown over the shoulder, bronze cymbals, chalk circles, bone-white masks. Fonts **Libre Baskerville** (display) + **Red Hat Text** (body) + **JetBrains Mono** (mono). Palette: midnight indigo, charcoal, bronze, bone — for a real Claude Code defect: **MID-TURN TASK-SUMMARY CLASSIFIER KEEPS THE PREVIOUS CONVERSATION'S `latestAsk` ACROSS `/clear`; IMAGE-BEARING PROMPTS NEVER REFRESH IT.**

Primary:

- [anthropics/claude-code#93256](https://github.com/anthropics/claude-code/issues/93256) (OPEN, bug, has repro, platform:windows, area:tui, area:core, platform:vscode). Title: `Mid-turn task-summary classifier keeps the previous conversation's latestAsk across /clear (and image-bearing prompts never refresh it) — activity line describes a cleared conversation`. Claude Code 2.1.267; Windows 11, interactive REPL in the VS Code integrated terminal; Opus 5 (1M context), high effort; Remote Control enabled. Previous session last string ask `03:21:09Z`. `/clear` at `03:24:39Z`. Unrelated image+text prompt `03:27:20Z`. Bash of the new work at `03:32:08Z`. Same `bridgeSessionId` survives `/clear`.

13:50 lemures: a Roman Lemuria / Parentalia night-courtyard booth that should keep the mid-turn task-summary classifier **laid** across `/clear` (reset latestAsk / capturedIntent / taskSummary on conversation reset; multimodal prompts refresh latestAsk); instead process-scoped classifier state remanently keeps the previous conversation's latestAsk, image-bearing prompts never refresh it, emit stamps Date.now() so the staleness guard passes, and Remote Control mirrors the wrong task_summary (#93256). Score lemures or admit laid.

Score lemures or admit laid.

Idle word: **laid** (HOLD: classifier laid to rest on conversation reset; multimodal prompts refresh latestAsk). Seeded word: **lemures** / #93256 (process-scoped latestAsk remanent after `/clear`; image+text never refreshes it). Path word: **remanent**. Never idle released / escheat / stale / freehold / mortmain / phantom / trunked / strowger / exchanged / tokenized / mondegreen / parsed / locked / scratched / derby / unmasked / vizard / precedence / carrier / moored / scuttled / open / seated / stopcock / preserved / discarded / cleared / mounded / distinct / held / raised / fallen / primed / flashed / greenroomed / scaffold / stereotype / parergon / lacuna / hangfire / afterimage / remora / quieted / unrung / latent / flushed / collated / stereotyped.

Phrase: **when the mid-turn task-summary classifier remanently keeps the previous conversation's latestAsk across /clear, lemures never stay laid — score lemures or admit laid.**

- **laid** = IDLE: HOLD; classifier laid on conversation reset; multimodal prompts refresh latestAsk
- **lemures** = #93256 seeded path: remanent latestAsk after `/clear`; image+text never refreshes it
- **remanent** = path word: leftover ask that was never laid
- **hold** = HOLD alias for idle laid
- **process-scoped** = classifier job state lives on the process; `/clear` keeps the host
- **never-reset** = conversation_reset never clears latestAsk / capturedIntent / taskSummary
- **string-only** = `findLatestRealUserAsk` only accepts string content
- **image-skip** = array content `[{type:"image"},{type:"text"}]` returns undefined
- **emit-now** = emit stamps `at: Date.now()`
- **guard-passes** = TUI staleness guard compares emit time, so the remanent headline stands
- **rc-mirror** = Remote Control mirrors the wrong topic via `external_metadata.task_summary`
- **bridge-survives** = `bridgeSessionId` survives `/clear` so process-scoped state carries across
- **has-repro** = RC → text-only distinctive ask → `/clear` → image+text that runs tools → `●` describes step 2
- **cousins** = cite-only #87533 — do not rebuild
- **backups** = cite-only #93219 #93207 #93250 #93239 — do not auto-pick as primary
- **fixtures** = row list for the lemures booth
- **walk** = published idle laid → remote-control → text-ask → conversation-reset → process-scoped → image-skip → emit-now → guard-passes → rc-mirror → bridge-survives → lemures → remanent

Verdicts: laid, lemures, remanent, hold, process-scoped, never-reset, string-only, image-skip, emit-now, guard-passes, rc-mirror, bridge-survives, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring night courtyard. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the shade is **lemures** or already **laid**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): process-scoped classifier job state is never reset on conversation reset; `findLatestRealUserAsk` only accepts string content so image+text returns undefined; emit stamps `Date.now()` so the staleness guard does not suppress the remanent headline. Invite verify against #93256 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93256](https://github.com/anthropics/claude-code/issues/93256)
- Cite-only cousin: [anthropics/claude-code#87533](https://github.com/anthropics/claude-code/issues/87533) (same classifier hard-truncates latestAsk at 300 chars with no marker and renders the complaint as the activity line — do not rebuild)
- Backup (data only): [anthropics/claude-code#93219](https://github.com/anthropics/claude-code/issues/93219) (Vernier — effort slider inert)
- Backup (data only): [anthropics/claude-code#93207](https://github.com/anthropics/claude-code/issues/93207) (iOS plan approval setMode auto)
- Backup (data only): [anthropics/claude-code#93250](https://github.com/anthropics/claude-code/issues/93250) (`${PLUGIN_ROOT}` not expanded)
- Backup (data only): [anthropics/claude-code#93239](https://github.com/anthropics/claude-code/issues/93239) (Enter interrupts instead of queueing)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:tui, area:core, platform:vscode
- Claude Code 2.1.267; Windows 11, interactive REPL in the VS Code integrated terminal; Opus 5 (1M context), high effort
- Remote Control enabled — activates the summary/headline surfaces of the mid-turn classifier
- Previous session last user message with string content, `03:21:09Z`
- `/clear` at `03:24:39Z`; conversation_reset fires; classifier is never subscribed
- Current prompt `03:27:20Z` has `content: [image, text]`; `findLatestRealUserAsk` returns undefined
- Rendered Bash at `03:32:08Z` is current work; only the `●` headline is remanent
- Both sessions carry the same `bridgeSessionId`
- Emit stamps `at: Date.now()` so the TUI staleness guard does not suppress
- Remote Control mirrors the wrong topic via `external_metadata.task_summary`

Problem found: WHEN THE MID-TURN TASK-SUMMARY CLASSIFIER REMANENTLY KEEPS THE PREVIOUS CONVERSATION'S LATESTASK ACROSS `/CLEAR`, LEMURES NEVER STAY LAID.

Why this solution: a diagnostic Roman Lemuria / Parentalia night courtyard for the laid → lemures drift, so a reader can pin idle laid, load the #93256 lemures path, and score remanent / process-scoped / image-skip / emit-now against the published facts. Conceptual black beans, bronze cymbals, and a chalk circle show whether the shade was laid. No live Claude session is required.

## Why not a clone

This is specifically: **MID-TURN TASK-SUMMARY CLASSIFIER KEEPS THE PREVIOUS CONVERSATION'S `latestAsk` ACROSS `/clear`; IMAGE-BEARING PROMPTS NEVER REFRESH IT.**

**NOT Escheat/#93231** (VS Code window-close leaves git worktree `locked` naming a dead PID). Different defect.

**NOT Mortmain/#93173** (sandbox `denyWithinAllow` freezes tracked `.claude` paths). Different defect.

**NOT Strowger/#93218** (Desktop `--disallowedTools SendMessage` while ListAgents still lists). Different paradigm.

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Afterimage.** **NOT Mirage.** **NOT Ephemera.** **NOT Palimpsest.** **NOT Recension.** **NOT Quietus.**

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **process-scoped mid-turn classifier latestAsk across `/clear` + string-only finder + Date.now() emit** — unused in catalog as this lemures / courtyard walk.

Do NOT rename this product Escheat, Mortmain, Strowger, Mondegreen, Afterimage, Mirage, Ephemera, Palimpsest, Recension, Quietus, or any existing catalog slug.
Do NOT reuse idle laid / lemures / remanent on a later booth.
Do NOT reuse Cardo + Figtree + Fragment Mono (Escheat). Do NOT reuse Cinzel + Source Sans 3 (Mortmain). Do NOT reuse Syne + Karla + IBM Plex Mono (Strowger). Do NOT reuse Cormorant Garamond + Outfit + Space Mono (Mondegreen). Display here is **Libre Baskerville**. Body is **Red Hat Text**. Mono is **JetBrains Mono**.

Different surface: mid-turn classifier remanent latestAsk vs window-close worktree lock leftover / sandbox `denyWithinAllow` / Desktop `--disallowedTools SendMessage` / isolation:worktree substring `git`.

Product name stays **Lemures**. Name/slug `lemures` unused in catalog.json (260 products before this ship; Escheat is #260).

Different UI: Roman Lemuria / Parentalia night courtyard / black beans / bronze cymbals / chalk circles / bone-white masks / midnight indigo + charcoal + bronze + bone. Libre Baskerville / Red Hat Text / JetBrains Mono. NOT feudal escheat chamber / struck PID ledger / iron coffer (Escheat). NOT muniment room / sealed charter (Mortmain). NOT Strowger exchange / switchboard. NOT ballad-sheet studio (Mondegreen).

Different verbs: Lay the shade, Score lemures, Throw black beans, Clash bronze, Pin idle laid, Pin seeded lemures, Pin remanent, Reset the courtyard.

Different idle: **laid**. Different #93256 seeded path: **lemures**. HOLD: **laid** / **hold**. ALARM: **lemures** / **remanent** / **process-scoped** / **never-reset** / **string-only** / **image-skip** / **emit-now** / **guard-passes** / **rc-mirror** / **bridge-survives**. Path: **remanent**.

## How to score

```bash
node --test projects/lemures/lemures.test.mjs
node projects/lemures/lemures.mjs projects/lemures/data/lemures.json
echo '{"seed":"lemures"}' | node projects/lemures/lemures.mjs
```

Open the living card at `projects/lemures/index.html` (or the live path `/lemures/`). Buttons: Lay the shade, Score lemures, Throw black beans, Clash bronze, Pin idle laid, Pin seeded lemures, Pin remanent, Reset the courtyard. Toggle Remote Control / text-only ask / `/clear` / image+text / emit now / bridge survives — the score flips. Rest a fixture JSON on the chalk circle. `?embed=1` hides chrome.

The booth reconstructs the reporter’s Remote Control / text-only ask / `/clear` / image+text walk from the published #93256 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/lemures/
- Folder: `projects/lemures/`
