# Parergon

A **manuscript marginalia / aside-panel booth** — parchment cream, iron-gall ink, vermilion rubric, soft graphite margin rules, cool slate frame for the aside panel; fonts **Instrument Serif** (display) + **Schibsted Grotesk** (body) + **Fragment Mono** (mono) — for a real Claude Desktop defect: **STEALTH UPDATE RESTARTS OVER AN OPEN `/btw` SIDE CHAT AND DISCARDS IT.**

Primary:

- [anthropics/claude-code#93122](https://github.com/anthropics/claude-code/issues/93122) (OPEN, bug, has repro, platform:macos, area:desktop). Title: `[BUG] Stealth update restarts over an open `/btw` side chat and discards it`. Claude Desktop stealth auto-update relaunch treats an open `/btw` side chat as idle, restarts on top of it, and loses it. Side chat state is in-memory only, so the seamless relaunch cannot restore it. The idle gate that exists to prevent exactly this does not count side chats as active work. Environment: Claude Desktop update 1.46388.1 → 1.49585.0 (macOS arm64); Claude Code 2.1.260 bundled; macOS 26.6.2. Sequence: Desktop launched cold after several days; updater staged an update; in a Claude Code session ran `/btw <question>` — side chat panel mounted and remained open with content; focus moved to another app (terminal); Desktop window unfocused, not fullscreen; after ~10 minutes idle, stealth updater fired, quit, installed, relaunched; main view and navigation came back; side chat and its answer were gone. Elapsed from first update check to install ~41 minutes; 72h enforcement window nowhere near expiry — idle path, not deadline path. Actual: side chat destroyed with no warning and no recovery path. Expected: either defer restart while a side chat is open, or restore the side chat alongside navigation state. Log evidence (relative times; T0 = quit): T-0m01s `[popout-restore] Saving 0 session + 0 pane popout(s) for next launch`; T+0m00s `[stealth-update] Triggering stealth update after idle timeout`; T+0m01s Successfully run onQuitCleanup: local-session-stop-all; T+0m19s `[stealth-relaunch] Restoring navigation (3 entries, active=2, dropped=0)`. `Restoring navigation` restores which views were open, not live session state. `Saving 0 session + 0 pane popout(s)` correctly reports nothing persistable to save for the side chat.

01:50 parergon: a manuscript marginalia / aside-panel booth that should keep an open `/btw` side chat **preserved** (idle gate counts it as active work, or stealth relaunch restores the aside); instead the aside is **discarded** — stealth update treats the open side chat as idle, quits, and restores navigation only; in-memory side chat is gone — score discarded or admit preserved.

Score discarded or admit preserved.

Idle word: **preserved** (HOLD: idle gate counts an open `/btw` side chat as active work, or stealth relaunch restores the aside alongside navigation). Seeded word: **discarded** / #93122 (stealth idle timeout over an open `/btw` panel; Saving 0 session + 0 pane popout(s); Restoring navigation only; side chat and its answer gone). Path word: **parergon**. Never idle fresh / stamped / cleared / mounded / distinct / conflated / held / steered / raised / fallen / sterling / primed / flashed / lodged / bypassed / greenroomed / scaffold / diplopic / freewheeling / doubled.

Phrase: **a stealth update that treats an open /btw side chat as idle is not preserving the aside — it is a discarded parergon. Score discarded or admit preserved.**

- **preserved** = IDLE: HOLD; idle gate counts the open aside; stealth deferred; or relaunch restores the aside
- **discarded** = #93122 seeded path: stealth idle over open `/btw`; navigation only; aside gone
- **parergon** = path word: treating the open aside as idle is not preserved
- **stealth-idle** = idle gate ignores side chat; ~10 minutes unfocused; stealth fires; 72h enforcement far — idle path, not deadline
- **side-chat-in-memory** = `/btw` panel mounted and remained open; state is in-memory only
- **zero-popouts** = T-0m01s Saving 0 session + 0 pane popout(s) for next launch
- **restore-navigation-only** = T+0m19s Restoring navigation (3 entries, active=2, dropped=0) — views, not live session
- **has-repro** = Desktop 1.46388.1 → 1.49585.0 macos desktop `/btw` walk
- **hold** = HOLD alias for idle preserved
- **cousins** = cite-only #92207 #92010 #91915 — do not clone
- **fixtures** = row list for the parergon booth
- **walk** = published idle preserved → side-chat-in-memory → stealth-idle → zero-popouts → restore-navigation-only → discarded → parergon

Verdicts: preserved, discarded, parergon, hold, stealth-idle, side-chat-in-memory, zero-popouts, restore-navigation-only, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring manuscript alcove. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the aside is **discarded** or already **preserved**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the idle gate that exists to prevent a stealth relaunch over live work may omit side chats from active work, and because side-chat state is in-memory only the seamless relaunch can restore navigation without the aside. Invite verify against #93122 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93122](https://github.com/anthropics/claude-code/issues/93122)
- Cite-only: [anthropics/claude-code#92207](https://github.com/anthropics/claude-code/issues/92207) (Stealth update relaunches desktop on idle, severing Remote Control sessions — labeled duplicate)
- Cite-only: [anthropics/claude-code#92010](https://github.com/anthropics/claude-code/issues/92010) (Remote Control session paused by idle timeout ~15 min after stealth-update relaunch)
- Cite-only: [anthropics/claude-code#91915](https://github.com/anthropics/claude-code/issues/91915) (Remote control never re-established after idle-triggered auto-update relaunch)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:desktop
- Claude Desktop stealth auto-update relaunch treats an open `/btw` side chat as idle, restarts on top of it, and loses it
- Side chat state is in-memory only, so the seamless relaunch cannot restore it
- The idle gate that exists to prevent exactly this does not count side chats as active work
- Environment: Claude Desktop update 1.46388.1 → 1.49585.0 (macOS arm64); Claude Code 2.1.260 bundled; macOS 26.6.2
- Sequence: Desktop launched cold after several days; updater staged an update; in a Claude Code session ran `/btw <question>` — side chat panel mounted and remained open with content; focus moved to another app (terminal); Desktop window unfocused, not fullscreen; after ~10 minutes idle, stealth updater fired, quit, installed, relaunched; main view and navigation came back; side chat and its answer were gone
- Elapsed from first update check to install ~41 minutes; 72h enforcement window nowhere near expiry — idle path, not deadline path
- Actual: side chat destroyed with no warning and no recovery path
- Expected: either defer restart while a side chat is open, or restore the side chat alongside navigation state
- Log evidence (relative times; T0 = quit):
  - T-0m01s `[popout-restore] Saving 0 session + 0 pane popout(s) for next launch`
  - T+0m00s `[stealth-update] Triggering stealth update after idle timeout`
  - T+0m01s Successfully run onQuitCleanup: local-session-stop-all
  - T+0m19s `[stealth-relaunch] Restoring navigation (3 entries, active=2, dropped=0)`
- `Restoring navigation` restores which views were open, not live session state
- `Saving 0 session + 0 pane popout(s)` correctly reports nothing persistable to save for the side chat

Problem found: A STEALTH UPDATE THAT TREATS AN OPEN /BTW SIDE CHAT AS IDLE IS NOT PRESERVING THE ASIDE — IT IS A DISCARDED PARERGON.

Why this solution: a diagnostic manuscript alcove for the preserved → discarded drift, so a reader can pin idle preserved, load the #93122 discarded path, and score parergon / stealth-idle / side-chat-in-memory / zero-popouts / restore-navigation-only against the published facts.

## Why not a clone

This is specifically: **STEALTH UPDATE RESTARTS OVER AN OPEN `/btw` SIDE CHAT AND DISCARDS IT.**

**NOT Stereotype/#93108** (plugin update version-string-only freshness). Different paradigm.

**NOT Midden/#93081** (WorktreePool partial-remove GC remound loop). Different paradigm.

**NOT Diplopia/#93012** (Remote Control web vs mobile label fields). Different paradigm.

**NOT Greenroom/#92988** (Desktop Code tab missing wait-until-turn-ends queue — different Desktop defect; Greenroom is cue-queue, Parergon is stealth-update discarding `/btw` side chat). Different paradigm.

**NOT Guillotine/#92974** (background-mode Deny-only permission dialog). Different paradigm.

**NOT Entresol/#93010** (parent CLAUDE.md skipped for worktree-of-that-repo). Different paradigm.

**NOT Hallmark/#93021** (`[1m]` lost on resume non-first-party BASE_URL). Different paradigm.

**NOT Flashpan/#93015** (lastRunAt without session birth). Different paradigm.

**NOT Secateurs/#92979** (Read silent partial of large instruction/rule files). Different paradigm.

**NOT Palinode/#92998** (MEMORY.md bottom truncation of newest corrections). Different paradigm.

**NOT Ferrule/#92968** / Wildcat/#92399.

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **stealth idle over an open `/btw` side chat vs navigation-only restore.**

Do NOT rename this product Stereotype, Midden, Diplopia, Greenroom, Guillotine, Entresol, Hallmark, Flashpan, Secateurs, Palinode, Ferrule, Wildcat, or any existing catalog slug.
Do NOT reuse idle preserved / discarded / parergon on a later ship.
Do NOT reuse Alegreya. Do NOT reuse Karla. Do NOT reuse Noto Sans Mono (Stereotype). Do NOT reuse Fraunces. Do NOT reuse Source Sans 3. Do NOT reuse IBM Plex Mono (Midden). Do NOT reuse Cormorant Garamond. Do NOT reuse Atkinson Hyperlegible. Do NOT reuse Source Code Pro (Diplopia). Do NOT reuse Spectral (Guillotine display). Do NOT reuse Public Sans + Cousine (Guillotine body/mono). Do NOT reuse Playfair Display + Outfit + Space Mono (Entresol). Do NOT reuse Cinzel (Hallmark display). Do NOT reuse Lato + Fira Code (Hallmark body/mono). Do NOT reuse Newsreader + Manrope + JetBrains Mono (Flashpan). Do NOT reuse DM Sans (Greenroom). Do NOT reuse Bitter + Figtree + Roboto Mono (Secateurs).

Different surface: stealth-/btw-aside discard vs version-string-only plugin freshness / WorktreePool orphaned-GC deadlock / Remote Control environment-label field split / Desktop Code tab missing wait-for-full-turn-end queue / Deny-only permission dialog / parent-directory memory skip / resume `[1m]` / scheduled-task `lastRunAt` / Read silent partial / MEMORY.md write-path bottom truncation.

Product name stays **Parergon**. Name/slug `parergon` unused in catalog.json (250 products before this ship; Stereotype is #250).

Different UI: manuscript desk / marginalia alcove / side-folio booth / parchment cream / iron-gall ink / vermilion rubric / soft graphite margin rules / cool slate frame. Instrument Serif / Schibsted Grotesk / Fragment Mono. NOT letterpress foundry. NOT archaeological midden / refuse-heap. NOT ophthalmology acuity / phoropter / Snellen. NOT green velvet / tungsten. NOT scaffold / guillotine. NOT gallery mezzanine. NOT silversmith assay. NOT flintlock flash-pan. NOT garden pruning bench. NOT windlass / wildcat.

Different verbs: Walk the folio, Admit preserved, Score discarded, Pin idle preserved, Pin seeded discarded, Rule the margin, Count the aside, Call the stealth clerk, Reset the folio.

Different idle: **preserved**. Different #93122 seeded path: **discarded**. HOLD: **preserved**. ALARM: **discarded** / **parergon** / **stealth-idle** / **side-chat-in-memory** / **zero-popouts** / **restore-navigation-only**. Path: **parergon**.

## How to score

```bash
node --test projects/parergon/parergon.test.mjs
node projects/parergon/parergon.mjs projects/parergon/data/93122.json
node projects/parergon/parergon.mjs projects/parergon/data/preserved.json
echo '{"seed":"discarded"}' | node projects/parergon/parergon.mjs
```

Open the living card at `projects/parergon/index.html` (or the live path `/parergon/`). Buttons: Walk the folio, Admit preserved, Score discarded, Pin idle preserved, Pin seeded discarded, Pin parergon, Rule the margin, Count the aside, Call the stealth clerk, Reset the folio. Toggle idle-gate-counts / stealth-fired / zero-popouts / restore-navigation-only — the score flips. Rest a fixture JSON on the folio tray. `?embed=1` hides chrome.

The folio reconstructs the reporter’s stealth-/btw walk from the published #93122 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/parergon/
- Folder: `projects/parergon/`
