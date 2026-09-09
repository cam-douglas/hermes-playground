# Greenroom

A **theater green room / offstage waiting booth** — deep green velvet, warm tungsten bulbs, chalk call sheet, brass cue light; fonts **Fraunces** (display) + **DM Sans** (body) + **IBM Plex Mono** (mono) — for a real Claude Desktop defect: **DESKTOP CODE TAB HAS NO WAY TO QUEUE A MESSAGE UNTIL THE TURN FULLY ENDS.**

Primary:

- [anthropics/claude-code#92988](https://github.com/anthropics/claude-code/issues/92988) (OPEN, enhancement, platform:windows, area:desktop). Title: `Desktop Code tab has no way to queue a message until the turn fully ends — Ctrl+Enter is Interrupt, and the CLI's chat:queueSubmit has no Desktop equivalent`. Authored 2026-09-09T03:38:25Z by ahnbu. Claude Desktop Windows 11 app 1.49585.0 Code tab; bundled CLI 2.1.260; empty keybindings.json. While Claude works the send button lists Send (Enter), Interrupt (Ctrl+Enter), Send in a forked session (Ctrl+Alt+Enter). Enter queues but injects at the next tool-call boundary WITHIN the same turn. Ctrl+Enter is Interrupt. CLI already has `chat:queueSubmit` (default Ctrl+X Enter, v2.1.247+). Desktop docs say terminal interactive-mode shortcuts do not apply; Code tab Ctrl+/ has no equivalent. Bundle ships **Queue for later** (message id `8RUKIaTN4d`) but it never appears — no mouse dropdown, no Settings toggle. Restart `1.46388.4` → `1.49585.0` did not change this.

20:50 greenroom: a theater green room / offstage waiting booth that should keep the cue **held** until the entire turn ends (CLI `chat:queueSubmit` parity); instead the cue is **steered** — mid-turn inject / Interrupt, and Queue for later unreachable — score steered or admit held.

Score steered or admit held.

Idle word: **held** (HOLD: message waits until the entire turn ends — chat:queueSubmit parity). Seeded word: **steered** / #92988 (only mid-turn inject / Interrupt; Queue for later unreachable). Path word: **greenroomed**. Never idle raised / fallen / scaffold / lodged / bypassed / cutaway / sterling / debased / rubbed / primed / flashed / flashpanned / unshorn / sheared / secateured / emended / unretracted / palinoded / ferruled / interlocked / passable / admitted / deeded / parked / shibbolethed / countersigned / homesteaded / staked.

Phrase: **a greenroom that cannot hold a cue until the act ends is not held — the cue is steered on mid-scene. Score steered or admit held.**

- **held** = IDLE: HOLD; message waits until the entire turn ends — chat:queueSubmit parity
- **steered** = #92988 seeded path: only mid-turn inject / Interrupt; Queue for later unreachable
- **greenroomed** = path word: a greenroom that cannot hold a cue until the act ends
- **enter-midturn** = Enter injects at the next tool-call boundary WITHIN the same turn
- **ctrl-enter-interrupt** = Ctrl+Enter is Interrupt — opposite of waiting
- **queue-for-later-unreachable** = bundle string 8RUKIaTN4d never appears; no mouse dropdown
- **chat-queueSubmit-cli-only** = CLI has the action; Desktop docs say terminal shortcuts do not apply
- **send-button-trio** = Send / Interrupt / Send in a forked session only
- **has-repro** = Desktop 1.49585.0 Windows 11 Code tab; bundled CLI 2.1.260; empty keybindings.json
- **hold** = HOLD alias for idle held
- **cousins** = cite-only #77724 #71726 — do not clone
- **fixtures** = row list for the greenroom booth
- **walk** = published idle held → Enter mid-turn → Interrupt → trio → Queue for later unreachable → CLI-only → no settings → greenroomed

Verdicts: held, steered, greenroomed, hold, enter-midturn, ctrl-enter-interrupt, queue-for-later-unreachable, chat-queueSubmit-cli-only, send-button-trio, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring green room. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the cue is **steered** or already **held**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the Desktop Code tab maps Ctrl+Enter to Interrupt / sendSteeredNow and never surfaces the existing Queue for later / wait-for-turn-end affordance that the bundle strings and CLI chat:queueSubmit already describe. Invite verify against #92988 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92988](https://github.com/anthropics/claude-code/issues/92988)
- Cite-only: [anthropics/claude-code#77724](https://github.com/anthropics/claude-code/issues/77724) (earlier request, closed; the fix landed in the CLI only)
- Cite-only: [anthropics/claude-code#71726](https://github.com/anthropics/claude-code/issues/71726) (original Desktop-vs-CLI parity gap on mid-task queue injection)

What happened (from the issue body — do not invent):

- OPEN. Labels: enhancement, platform:windows, area:desktop
- Author ahnbu. Filed 2026-09-09T03:38:25Z
- Claude Desktop Windows 11, app 1.49585.0, Code tab
- Bundled CLI 2.1.260
- `~/.claude/keybindings.json` is empty (all defaults)
- Wanted: send a follow-up while Claude works and have it wait until the entire turn finishes
- Send-button tooltip lists exactly three options: Send (Enter), Interrupt (Ctrl+Enter), Send in a forked session (Ctrl+Alt+Enter)
- Enter queues but, per interactive-mode docs, injects as soon as those tool calls finish, within the same turn
- Ctrl+Enter is Interrupt — "Interrupts the current step so only this message is read now"
- CLI `chat:queueSubmit` (default Ctrl+X Enter, v2.1.247+) queues and never interrupts the turn
- Desktop docs say terminal interactive-mode shortcuts do not apply; Code tab Ctrl+/ list has no equivalent
- Bundle ships Queue for later (message id 8RUKIaTN4d + translations) alongside sendSteeredNow / recallSteered
- On the reporter's install Ctrl+Enter renders Interrupt and Queue for later never appears — no mouse dropdown either
- Nothing in the settings JSON schema; nothing in Settings → Claude Code
- Restarting `1.46388.4` → `1.49585.0` did not change this
- Request: expose queue-until-turn-fully-ends (send-button option, keystroke, or setting); CLI parity is enough

Problem found: A GREENROOM THAT CANNOT HOLD A CUE UNTIL THE ACT ENDS IS NOT HELD — THE CUE IS STEERED ON MID-SCENE.

Why this solution: a diagnostic theater green room for the held → steered drift, so a reader can pin idle held, load the #92988 steered path, and score greenroomed / enter-midturn / Ctrl+Enter Interrupt / Queue for later unreachable / CLI-only against the published facts.

## Why not a clone

This is specifically: **DESKTOP CODE TAB HAS NO WAY TO QUEUE A MESSAGE UNTIL THE TURN FULLY ENDS.**

**NOT Guillotine/#92974** (background-mode permission dialog shows only a Deny button). Different paradigm.

**NOT Entresol/#93010** (parent CLAUDE.md skipped for a worktree of that parent's repository). Different paradigm.

**NOT Hallmark/#93021** (resume loses `[1m]` on non-first-party `BASE_URL`). Different paradigm.

**NOT Flashpan/#93015** (`lastRunAt` stamps without a session birth). Different paradigm.

**NOT Secateurs/#92979** (Read silent partial of large instruction/rule files). Different paradigm.

**NOT Palinode/#92998** (MEMORY.md bottom truncation of newest corrections). Different paradigm.

**NOT Ferrule/#92968** / Interlock / Homestead / Shibboleth / #93012 / #93004 / #92987 / #92982 / Quill/#92788 / Colophon/#92918 / Sallyport/#92901.

**NOT leftover woodworking / mm-slider / clones.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **a Desktop Code tab that should hold a follow-up until the entire turn ends instead offers only mid-turn inject and Interrupt, while Queue for later stays unreachable even though the bundle string and CLI chat:queueSubmit already describe it.**

Do NOT rename this product Guillotine, Entresol, Hallmark, Flashpan, Secateurs, Palinode, Ferrule, Interlock, or any existing catalog slug.
Do NOT reuse idle held / steered / greenroomed on a later ship.
Do NOT reuse Spectral (Guillotine display). Do NOT reuse Cinzel (Hallmark display). Do NOT reuse Figtree (Secateurs body). Do NOT reuse Playfair Display + Outfit + Space Mono (Entresol). Do NOT reuse Lato + Fira Code (Hallmark body/mono). Do NOT reuse Newsreader + Manrope + JetBrains Mono (Flashpan). Do NOT reuse Bitter + Roboto Mono (Secateurs display/mono). Do NOT reuse Cardo + Nunito Sans (Palinode). Do NOT reuse Oswald + Source Sans 3 (Ferrule). Do NOT reuse Public Sans + Cousine (Guillotine body/mono).

Different surface: Desktop Code tab missing wait-for-full-turn-end vs Deny-only permission dialog / parent-directory memory skip / resume `[1m]` / scheduled-task `lastRunAt` / Read silent partial / MEMORY.md write-path bottom truncation.

Product name stays **Greenroom**. Name/slug `greenroom` unused in catalog.json (246 products before this ship; Guillotine is #246).

Different UI: theater green room / offstage waiting booth / deep green velvet / warm tungsten bulbs / chalk call sheet / brass cue light. Fraunces / DM Sans / IBM Plex Mono. NOT scaffold / guillotine. NOT gallery mezzanine. NOT silversmith assay. NOT flintlock flash-pan. NOT garden pruning bench. NOT scriptorium wax/vellum.

Different verbs: Walk the call sheet, Hold the cue, Steer the cue, Admit held, Pin idle held, Pin seeded steered, Clip Queue-for-later, Reset to held.

Different idle: **held**. Different #92988 seeded path: **steered**. HOLD: **held**. ALARM: **steered** / **greenroomed** / **enter-midturn** / **ctrl-enter-interrupt** / **queue-for-later-unreachable**. Path: **greenroomed**.

## How to score

```bash
node --test projects/greenroom/greenroom.test.mjs
node projects/greenroom/greenroom.mjs projects/greenroom/data/92988.json
node projects/greenroom/greenroom.mjs projects/greenroom/data/held.json
echo '{"seed":"steered"}' | node projects/greenroom/greenroom.mjs
```

Open the living card at `projects/greenroom/index.html` (or the live path `/greenroom/`). Buttons: Walk the call sheet, Hold the cue, Steer the cue, Admit held, Pin idle held, Pin seeded steered, Clip Queue-for-later, Reset to held. Toggle queue-until-turn-end / Ctrl+Enter Interrupt / mid-turn inject / Queue for later visible — the score flips. Clip a fixture JSON onto the script clip. `?embed=1` hides chrome.

The send-button trio reconstructs the reporter’s Code tab tooltip from the published #92988 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/greenroom/
- Folder: `projects/greenroom/`
