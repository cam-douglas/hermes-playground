# Strowger

A **Strowger automatic telephone exchange / step-by-step switchboard booth** — brass selectors, bakelite dials, directory boards that still list every subscriber, but the trunk to SendMessage is cut. Fonts **Syne** (display) + **Karla** (UI) + **IBM Plex Mono** (mono). Palette: night switchboard — deep ink, brass contact, bakelite amber, pale directory card, cut-trunk scarlet — for a real Claude Code defect: **DESKTOP APP DISABLES `SendMessage` VIA `--disallowedTools`, BUT `ListAgents` IN THE SAME SESSION STILL LISTS PEERS AND DOCUMENTS IT AS THE ADDRESS.**

Primary:

- [anthropics/claude-code#93218](https://github.com/anthropics/claude-code/issues/93218) (OPEN, bug, has repro, platform:windows, area:tools, area:agents, area:desktop). Title: `Desktop app disables SendMessage via --disallowedTools, but ListAgents in the same session still lists peers and documents it as the address`. Claude Desktop spawns every Claude Code session with `--disallowedTools SendMessage`, plus a permission-layer auto-deny. SendMessage is unavailable in desktop sessions AND every subagent they spawn. Worked through 2.1.258; stopped at 2.1.260. No CHANGELOG, no deprecation, no actionable error. ListAgents, the Agent tool description, and every subagent completion message still instruct the model to use SendMessage — so the model reaches for a tool that is not there. Not a binary regression: the app's own bundled 2.1.260/claude.exe in CLI mode still returns 44 tools including SendMessage. Only the Desktop launcher differs. Six mechanisms that all route through SendMessage / notify_when_idle are silently gone. Filed 2026-09-09T22:59:43Z by harry930216.

10:50 strowger: a Strowger exchange / step-by-step switchboard booth that should keep the trunk **trunked** (SendMessage present; peers addressable; notify_when_idle works); instead Desktop **strowger**s — `--disallowedTools SendMessage` while ListAgents still lists peers and documents SendMessage as the address; six mechanisms dead (#93218). Score strowger or admit trunked.

Score strowger or admit trunked.

Idle word: **trunked** (HOLD: SendMessage present; peers addressable; notify_when_idle works; event-driven supervision intact). Seeded word: **strowger** / #93218 (Desktop `--disallowedTools SendMessage`; ListAgents still lists peers and documents SendMessage as the address; six mechanisms dead). Path word: **exchanged**. Never idle tokenized / mondegreen / parsed / locked / scratched / derby / unmasked / vizard / precedence / carrier / deadair / squelch / moored / scuttled / scuttle / open / seated / stopcock / preserved / discarded / fresh / stamped / cleared / mounded / corked / relayed.

Phrase: **when ListAgents still lists peers and documents SendMessage as the address but Desktop cut the trunk, strowger never stays trunked — score strowger or admit trunked.**

- **trunked** = IDLE: HOLD; SendMessage present; peers addressable; notify_when_idle works; event-driven supervision intact
- **strowger** = #93218 seeded path: Desktop `--disallowedTools SendMessage`; ListAgents still lists; six mechanisms dead
- **exchanged** = path word: directory lists, trunk cut, score the drift
- **hold** = HOLD alias for idle trunked
- **sendmessage-cut** = ListAgents / Agent docs / completion hints still advertise SendMessage; the trunk is cut
- **listagents-lists** = ListAgents in the same session still lists peers (interactive + bg rooms)
- **disallowed-tools** = Desktop spawn flag `--disallowedTools SendMessage` plus permission-layer auto-deny
- **notify-when-idle-gone** = one-shot subscription rides on SendMessage; no substitute
- **six-mechanisms** = supervisor trail, notify_when_idle, converge, escalate, recover, correct-bg — all dead
- **launcher-only** = same bundled binary; only the Desktop launcher differs
- **cli-still-has-tool** = bundled 2.1.260/claude.exe in CLI mode still returns 44 tools including SendMessage
- **has-repro** = Desktop spawn + ListAgents lists + CLI control walk
- **cousins** = cite-only #92646 #92249 #90481 — do not rebuild
- **backups** = cite-only #93219 #93207 #93182 — do not auto-pick as primary
- **fixtures** = row list for the strowger booth
- **walk** = published idle trunked → desktop-launcher → disallowed-tools → listagents-lists → sendmessage-cut → six-mechanisms → cli-still-has-tool → strowger → exchanged

Verdicts: trunked, strowger, exchanged, hold, sendmessage-cut, listagents-lists, disallowed-tools, notify-when-idle-gone, six-mechanisms, launcher-only, cli-still-has-tool, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring exchange booth. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the line is **strowger** or already **trunked**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the Desktop launcher injects `--disallowedTools SendMessage` (plus a permission-layer auto-deny) while leaving ListAgents, the Agent tool description, and every subagent completion message pointing at SendMessage; the same bundled binary started in CLI mode still exposes the tool. Invite verify against #93218 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93218](https://github.com/anthropics/claude-code/issues/93218)
- Cite-only cousin: [anthropics/claude-code#92646](https://github.com/anthropics/claude-code/issues/92646) (Speakpipe — Desktop corks SendMessage; Agent/ListAgents/footers still advertise; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#92249](https://github.com/anthropics/claude-code/issues/92249) (Deadlight — ListAgents/SendMessage missing on scheduled-task and Remote Control; directory shuttered, not listed-with-cut-trunk; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#90481](https://github.com/anthropics/claude-code/issues/90481) (cross-session messaging disappearing after an update; VSCode/CLI-side, no `--disallowedTools`; do not rebuild)
- Backup (data only): [anthropics/claude-code#93219](https://github.com/anthropics/claude-code/issues/93219) (Vernier — macOS effort slider inert, stuck at Max)
- Backup (data only): [anthropics/claude-code#93207](https://github.com/anthropics/claude-code/issues/93207) (iOS plan approval setMode auto discards prePlanMode)
- Backup (data only): [anthropics/claude-code#93182](https://github.com/anthropics/claude-code/issues/93182) (server-side tools unblockable — deny casing mismatch + PreToolUse never fires)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:tools, area:agents, area:desktop
- Claude Desktop 1.49585.0 (Windows 10 Pro 19045, MSIX) spawns every Claude Code session with `--disallowedTools SendMessage`, backed by a permission-layer auto-deny
- SendMessage is unavailable in desktop sessions and in every subagent they spawn
- Worked through 2.1.258 (last successful subagent resume: 2026-09-02); stopped at 2.1.260
- No CHANGELOG entry, no deprecation notice, no actionable error
- ListAgents, the Agent tool description, and every subagent completion message still instruct the model to use SendMessage
- Not a binary regression: the desktop app's own bundled 2.1.260/claude.exe in CLI mode returns 44 tools including SendMessage
- Only the launcher differs
- Six mechanisms silently gone: (1) supervisor file-trail + SendMessage notice, (2) notify_when_idle one-shot, (3) converge review rounds via SendMessage({to: agentId}), (4) escalate to human from scheduled task (unattended_send_message denies), (5) recover after usage-limit kill by resuming subagents, (6) correct a running bg job — ListAgents lists bg rooms but no tool can address them
- Net: supervision degrades from event-driven to polling-plus-manual, silently, in six places
- ListAgents output still lists charter-f1, charter-68, and a bg probe, and its description still names SendMessage as the address

Problem found: WHEN LISTAGENTS STILL LISTS PEERS AND DOCUMENTS SENDMESSAGE AS THE ADDRESS BUT DESKTOP CUT THE TRUNK, STROWGER NEVER STAYS TRUNKED.

Why this solution: a diagnostic step-by-step exchange booth for the trunked → strowger drift, so a reader can pin idle trunked, load the #93218 strowger path, and score exchanged / sendmessage-cut / listagents-lists / six-mechanisms against the published facts. A conceptual directory board still lists every subscriber; a trunk lamp shows whether SendMessage can complete the call. No live Claude session is required.

## Why not a clone

This is specifically: **DESKTOP `--disallowedTools SendMessage` WHILE LISTAGENTS / AGENT DOCS STILL ADVERTISE THE ADDRESS.**

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Derby/#93197** (concurrent npm-global retire race). Different paradigm.

**NOT Vizard/#93190** (Desktop `/plan` intercept so CLI project-command precedence never runs). Different paradigm.

**NOT Dead Air/#93155** (silent 900s API stall with keepalive ACK / zero log). Different paradigm.

**NOT Speakpipe/#92646** (Desktop corks deck-to-ship SendMessage; corked/relayed speakpipe bench). Related agent-messaging catalog — cite only; do not rebuild.

**NOT Mailslot/#92839** (Keychain OAuth packet spill). Different paradigm.

**NOT Deadletter/#90049** (PostToolUse transcript loss). Different paradigm.

**NOT Aphonia** (roster shows choir names, no speaking reed). Related messaging catalog — cite only; do not rebuild.

**NOT Annunciator** (helper lamp is not a trip). Related messaging catalog — cite only; do not rebuild.

**NOT Deadlight/#92249** (ListAgents/SendMessage blanked on scheduled-task / Remote Control). Directory shuttered, not listed-with-cut-trunk — cite only; do not rebuild.

**NOT Scuttle/#93154**. **NOT Stopcock/#93143**. **NOT Parergon/#93122**. **NOT Stereotype/#93108**. **NOT Midden/#93081**. **NOT Guillotine/#92974**.

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **Desktop launcher `--disallowedTools SendMessage` while ListAgents still documents the address** — unused in catalog as this six-mechanism / launcher-only walk.

Do NOT rename this product Mondegreen, Derby, Vizard, Dead Air, Speakpipe, Mailslot, Deadletter, Aphonia, Annunciator, Deadlight, or any existing catalog slug.
Do NOT reuse idle trunked / strowger / exchanged on a later booth.
Do NOT reuse Cormorant Garamond + Outfit + Space Mono (Mondegreen). Do NOT reuse Bodoni Moda + Manrope (Derby). Do NOT reuse Cinzel + Azeret Mono (Vizard). Display here is **Syne**. UI is **Karla**. Mono is **IBM Plex Mono**.

Different surface: Desktop `--disallowedTools SendMessage` + ListAgents still lists vs isolation:worktree substring `git` / npm-global race / Desktop `/plan` intercept / silent 900s API stall / speakpipe cork / deadlight blank.

Product name stays **Strowger**. Name/slug `strowger` unused in catalog.json (257 products before this ship; Mondegreen is #257).

Different UI: Strowger exchange / step-by-step switchboard / brass selectors / bakelite dials / directory board / trunk lamp / night ink / brass contact / bakelite amber / pale directory card / cut-trunk scarlet. Syne / Karla / IBM Plex Mono. NOT ballad-sheet studio (Mondegreen). NOT racecourse (Derby). NOT masquerade atelier (Vizard). NOT charcoal radio studio (Dead Air). NOT brass speakpipe. NOT laryngoscope tray (Aphonia). NOT porthole deadlight.

Different verbs: Ring the exchange, Admit the trunk, Cut the trunk, Pin idle trunked, Pin seeded strowger, Pin exchanged, Flip the selector, Read the directory, Reset the board.

Different idle: **trunked**. Different #93218 seeded path: **strowger**. HOLD: **trunked** / **hold**. ALARM: **strowger** / **exchanged** / **sendmessage-cut** / **listagents-lists** / **disallowed-tools** / **notify-when-idle-gone** / **six-mechanisms** / **launcher-only** / **cli-still-has-tool**. Path: **exchanged**.

## How to score

```bash
node --test projects/strowger/strowger.test.mjs
node projects/strowger/strowger.mjs projects/strowger/data/93218.json
node projects/strowger/strowger.mjs projects/strowger/data/trunked.json
echo '{"seed":"strowger"}' | node projects/strowger/strowger.mjs
```

Open the living card at `projects/strowger/index.html` (or the live path `/strowger/`). Buttons: Ring the exchange, Admit the trunk, Cut the trunk, Pin idle trunked, Pin seeded strowger, Pin exchanged, Flip the selector, Read the directory, Reset the board. Toggle desktop / disallowed / ListAgents / cut — the score flips. Rest a fixture JSON on the jack tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s Desktop `--disallowedTools SendMessage` / ListAgents-still-lists walk from the published #93218 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/strowger/
- Folder: `projects/strowger/`
