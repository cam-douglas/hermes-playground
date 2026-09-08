# Sheave

A **deck sheave / snatch-block bench** — night-watch block station, hemp line through an iron wheel, brass pin, false hitch on a leading `/`; Fraunces + Plus Jakarta Sans + IBM Plex Mono — for a real Claude Code defect: **A MID-TURN QUEUE SHOULD PAY ANY NON-COMMAND STRING AT THE NEXT TOOL BOUNDARY (`absorbed_mid_turn`); A FINDER-DRAGGED `/Users/…` PATH FOULS BECAUSE A LEADING `/` IS MISTAKEN FOR A SLASH COMMAND (`startsWith("/") && !skipSlashCommands`), SO THE FILE SITS QUEUED FOR THE WHOLE TURN (21+ MIN THROUGH ASKUSERQUESTION / PLAN / EXEC) WHILE THE MODEL ASKS FOR THAT FILE.** The same text typed while idle reaches the model as an ordinary prompt. Inverse of Hangfire (where `/compact` is demoted to prose).

Primary:

- [anthropics/claude-code#92827](https://github.com/anthropics/claude-code/issues/92827) (OPEN, bug, has repro, platform:macos, area:tui). Title: `Queued message that starts with a dragged file path ("/Users/…") is never delivered mid-turn; it waits for the whole turn to end`. Claude Code 2.1.263; macOS; Apple Terminal; plan mode.

00:50 sheave: a deck sheave / snatch-block bench that should pay any mid-turn queue line through at the next tool boundary; instead a Finder-dragged /Users/… path fouls on a false slash-command hitch and waits for the whole turn while the model asks for the file already queued; score fouled or admit paid.

Score fouled or admit paid.

Idle word: **paid** (HOLD: any non-command mid-turn line pays at the next tool boundary). #92827 path: **fouled**. Seeded held-until-end: **hitched**. Never idle as rove (Clew), vaulted, spilled, cleared, armed, receipted, fused, closed, keyed, tenured. Never use spilled, voided, ukased, stripped, lost, dry, leaked, orphaned as the #92827-path word either.

**Sheave** = the grooved wheel in a snatch-block that should pay line at every tool boundary. A Finder-dragged absolute path always starts with `/`. The absorb filter treats that leading `/` as a slash command and refuses to pay. The line sits hitched on the pin for 21+ minutes while the model asks for the file already on the drum.

- **paid** = IDLE: HOLD; mid-turn queue line absorbed_mid_turn at the next tool boundary
- **fouled** = #92827 path: leading `/Users/…` mistaken for a slash command; never absorbed mid-turn
- **hitched** = seeded held-until-end: path sits queued 21+ min through AskUserQuestion / plan / exec; user popAll at 10:09
- **slash-false-positive** = filter `startsWith("/") && !skipSlashCommands` hitch on a file path, not a registered command
- **plain-absorbed** = control: "look at the message I sent" absorbs in ~30s on the same turn
- **enqueue-timeline** = 09:48 enqueue → 09:50 AskUserQuestion asks for the file → 10:09 popAll
- **before-after** = idle / turn-start `/Users/…` pays as ordinary prompt; mid-turn the same leading `/` fouls

Verdicts: paid, fouled, hitched, slash-false-positive, plain-absorbed, enqueue-timeline, before-after.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No network to Anthropic. Score whether a mid-turn `/Users/…` queue line would sit **fouled** or already **paid**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): the mid-turn absorb filter treats any string that `trim().startsWith("/")` as a slash command unless `skipSlashCommands`, so Finder-dragged absolute paths never pay until the turn ends; at turn start the same text is an ordinary prompt. Invite verify against #92827 text only. Do NOT implement a fix in anthropics/claude-code.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92827](https://github.com/anthropics/claude-code/issues/92827)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:tui
- Claude Code 2.1.263, macOS, Apple Terminal, plan mode
- Mid-turn queue normally absorbs at the tool boundary (`absorbed_mid_turn`)
- Filter drops `typeof value === "string" && value.trim().startsWith("/") && !skipSlashCommands`
- Dragged absolute paths always start with `/Users/…` so they never absorb mid-turn
- Transcript: enqueue path msg 09:48 → AskUserQuestion asks for that file 09:50 → plain "look at the message I sent" absorbs in ~30s → path msg only popAll'd by user at 10:09 after 21 minutes; never absorbed_mid_turn
- At turn start the same text is passed to the model as an ordinary prompt (not a registered command)

Problem found: A MID-TURN QUEUE SHEAVE THAT SHOULD PAY ANY NON-COMMAND STRING AT THE NEXT TOOL BOUNDARY INSTEAD HITCHES A FINDER-DRAGGED `/Users/…` PATH AS A FALSE SLASH COMMAND, SO THE FILE WAITS THE WHOLE TURN WHILE THE MODEL ASKS FOR IT.

Why this solution: a diagnostic deck sheave for the paid → fouled hitch, so a reader can pin idle paid, load the #92827 fouled path, and score hitched / slash-false-positive / plain-absorbed / enqueue-timeline / before-after against the published facts.

## Why not a clone

This is specifically: **MID-TURN QUEUE SHOULD PAY ANY NON-COMMAND STRING AT THE NEXT TOOL BOUNDARY; A DRAGGED `/Users/…` PATH FOULS ON `startsWith("/")` AND WAITS THE WHOLE TURN.**

**NOT Hangfire/#92478** (queued `/compact` demoted to prose — inverse hitch). Cite only. Do not touch Hangfire.

**NOT Mailslot/#92839** (Keychain argv-fallback pbt after successful OAuth — already shipped). Do not touch Mailslot.

**NOT Ukase/#92833** (scheduled Cowork permission-rule deny — already shipped). Do not touch Ukase.

**NOT Scabbard/#92820** (custom subagent Bash silently omitted — already shipped). Do not touch Scabbard.

**NOT Deadletter/#90049** (PostToolUse lost tool_results — already shipped). Do not touch Deadletter.

**NOT Ptybind. NOT Espagnolette.** Already shipped. Do not touch.

**NOT Snatch/#92583** (Windows Bash auto-background orphans — already shipped). Same family of deck hardware, different failure: unreaped PIDs vs a false slash hitch on a queued path. Do not touch Snatch.

**NOT Clew.** Idle **rove** already used. Sheave idle is **paid**.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session.

Different paradigm: **the sheave should pay any line that is not a command; a leading `/` on a file path fouls the wheel for the whole turn.**

Do NOT rename this product Mailslot, Ukase, Scabbard, Deadletter, Hangfire, Snatch, Clew, Ptybind, Espagnolette, or any existing catalog slug.
Do NOT reuse idle rove / vaulted / spilled / cleared / armed / receipted / fused / closed / keyed / tenured. Do NOT reuse seeded spilled / voided / ukased / stripped / lost / dry / leaked / orphaned.

Different surface: mid-turn queue absorb vs Keychain persist / scheduled permission-rule deny / custom-subagent tool omit / PostToolUse lost results / queued `/compact` demoted to prose.

Product name stays **Sheave**. Name/slug `sheave` confirmed unused in catalog.json (228 products before this ship; Mailslot is #228).

Different UI: night-watch deck sheave / snatch-block / hemp through an iron wheel / brass pin / false hitch on `/`. Fraunces / Plus Jakarta Sans / IBM Plex Mono. NOT Libre Bodoni + Karla + JetBrains Mono (Mailslot). NOT Cinzel + Source Sans 3 (Ukase). NOT Cormorant Unicase + Sora (Scabbard). NOT Newsreader + Figtree (Deadletter / Snatch). NOT Anybody + Source Sans 3 (Hangfire). NOT a postal mailslot, imperial wax seal, empty scabbard, or Keychain vault.

Different verbs: Score fouled, Admit paid, Pin idle paid, Load fouled, Load hitched, Reset to paid.

Different idle: **paid**. Different #92827 path: **fouled**. HOLD: **paid**. ALARM: **fouled** / **hitched** / **slash-false-positive** / **plain-absorbed** / **enqueue-timeline** / **before-after**.

## How to score

Open the living card at `projects/sheave/index.html` (or the live path `/sheave/`). Buttons: Score fouled, Admit paid, Pin idle paid, Load fouled, Load hitched, Load fixtures, Reset to paid. Hang a block chip. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/sheave/
- Folder: `projects/sheave/`
