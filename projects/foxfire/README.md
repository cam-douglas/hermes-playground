# Foxfire

A **marsh foxfire / bioluminescence observation booth** — peat banks, night mist, lantern glass, dark water, bioluminescent green glow. Fonts **Eczar** (display) + **Work Sans** (body) + **Inconsolata** (mono). Palette: marsh night `#0e1a14`, peat `#2a3428`, foxfire `#7CFF9A` / `#3DFF8A`, mist `#a8c4b0`, lantern glass `#c9e8d4`, ink `#06100c` — light-on-dark marsh field, not atelier plaster/umber/cobalt, not chain-forge iron/brass, not parchment wax blotter, hangar strobe, cheque desk, camera lucida, sterile lab, pulse-damper, earthwork fosse, hibernacle, harbor pontoon, or CRT afterimage.

Foxfire is marsh bioluminescence that glows like fire but is not combustion. Here the dim composer paint looks like a pending prompt/turn but is not a real turn.

Primary:

- [anthropics/claude-code#93502](https://github.com/anthropics/claude-code/issues/93502) (OPEN, bug, has repro, platform:macos, area:tui). Title: `Remote Control message paints in idle CLI composer but never starts a turn`. Filed by kschzt 2026-09-11. Claude Code runtime **2.1.267**. With Remote Control attached to an otherwise idle Claude Code CLI, a submitted message can be painted as dim text in the local composer but never start a turn. No corresponding transcript user row or queue-operation row. Session remains idle until somebody returns to the local terminal and cancels/retypes the prompt. Still reproduces after #78177 was closed as stale. Environment: macOS; Remote Control client `claude.ai/code` from another device; CLI idle after a completed turn. Timeline: prior assistant response ended `2026-09-10T21:38:01.662Z`; Stop hooks completed normally (`continue:true` then `{}`); `preventedContinuation:false` at `21:38:02.199Z`; at `21:38:03.640Z` (1.44s later) PTY output painted remote message as dim composer text (`build the F-831 control`) with no matching PTY input, transcript user row, or queue-operation — no turn began. Positive control: message delivered while a turn was active produced transcript queue-operation enqueue, `absorbed_mid_turn`, and the assistant followed it (~12.172s). Hooks themselves do not prevent Remote Control delivery. Expected: Remote Control message to idle CLI becomes a user turn without local terminal input. Actual: text visible only in terminal composer; not model input; no turn; remote users get no delivery failure; local UI paint is the only evidence. Workaround: return to local terminal, Escape, retype — defeats unattended Remote Control. Cousins cite-only: #78177, #51267, pontoon/#93288, afterimage/#92596, espagnolette/#92694, trompe/#90881, diplopia/#93012, shibboleth/#92966, deadlight/#92249.

11:50 foxfire: a marsh foxfire / bioluminescence observation booth for #93502. Idle **kindled** / seeded **painted** / path **never-turns**. Score foxfire or admit kindled.

Score foxfire or admit kindled.

Idle word: **kindled** (HOLD: remote message became a real user turn; transcript user row + turn started; not mere composer paint). Seeded word: **painted** / #93502 (dim composer text only; no transcript user row; no queue-operation; no turn; session stays idle). Path word: **never-turns**. Product score: **foxfire**. Never idle flushed / lagged / one-behind / pentimento / solitary / twinlinked / bridge-refuse / vinculum / hit / flattened / string-carrier / cachet / steady / strobing / off-label / strobe / matched / skewed / headers-hash / counterfoil / traced / pathless / image-cache / lucida / scrubbed / contaminated / fomite / gitignore / damped / spinning / mux / snubber / mounted / fossed / plan9 / fosse / warm / paged-out / majflt / hibernacle / sealed / mismatched / issuer / paraph / sterling / debased / hallmark / remanent / collimated / diopter / hysteresis / banked / ephemera / afloat / washed / pontoon.

Phrase: **when a Remote Control message to an idle CLI paints dim composer text without starting a turn, score foxfire or admit kindled.**

- **kindled** = IDLE: HOLD; remote message became a real user turn; transcript user row + turn started; not mere composer paint
- **painted** = #93502 seeded path: dim composer text only; no transcript user row; no queue-operation; no turn; session stays idle
- **foxfire** = product score word for marsh glow that looks like fire but is not combustion
- **never-turns** = path word: session remains idle after composer paint
- **hold** = HOLD alias for idle kindled
- **composer-paint** = PTY output painted the remote message as dim composer text
- **no-transcript** = no corresponding transcript user row
- **no-queue** = no transcript queue-operation row
- **no-pty-input** = no matching PTY input record
- **stop-clean** = Stop hooks completed normally (`continue:true` then `{}`)
- **mid-turn-absorbed** = positive control: mid-turn delivery was absorbed
- **queue-enqueue** = mid-turn queue-operation enqueue at 21:47:05.062Z
- **absorbed-mid-turn** = removed with reason `absorbed_mid_turn` at 21:47:17.234Z (~12.172s)
- **prevented-false** = Stop summary recorded `preventedContinuation:false`
- **continue-true** = first hook returned `{"continue":true}`
- **dim-text** = lantern glass shows dim composer paint
- **f-831** = remote message `build the F-831 control`
- **idle-after-stop** = CLI idle after a completed turn; 1.44s after clean Stop
- **no-delivery-failure** = remote users receive no delivery failure
- **workaround** = return to local terminal, Escape, retype — defeats unattended Remote Control
- **has-repro** = Claude Code 2.1.267 · kschzt · macOS · claude.ai/code · idle after completed turn
- **cousins** = cite-only #78177 #51267 #93288 #92596 #92694 #90881 #93012 #92966 #92249 — do not rebuild
- **backups** = cite-only #93458 #93475 #93439 #93438 #93466 #93495 #93469 #93474 — do not auto-pick
- **fixtures** = lantern / peat / mist / water table for the foxfire booth
- **walk** = published idle kindled → stop-clean → remote-submit → painted-composer → no-transcript → no-queue → never-turns → foxfire

Verdicts: kindled, painted, foxfire, never-turns, hold, composer-paint, no-transcript, no-queue, no-pty-input, stop-clean, mid-turn-absorbed, queue-enqueue, absorbed-mid-turn, prevented-false, continue-true, dim-text, f-831, idle-after-stop, no-delivery-failure, workaround, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the lantern is **painted** / **foxfire** or already **kindled**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): idle path may paint PTY composer without enqueueing a turn / queue-operation after a clean Stop. The mid-turn positive control (queue-operation enqueue, `absorbed_mid_turn`, assistant followed) shows hooks themselves do not prevent Remote Control delivery. Invite verify against #93502 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93502](https://github.com/anthropics/claude-code/issues/93502)
- Cite-only cousin: [anthropics/claude-code#78177](https://github.com/anthropics/claude-code/issues/78177) (closed stale prior of the same paint stall; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#51267](https://github.com/anthropics/claude-code/issues/51267) (broader input-stall; do not rebuild)
- Cite-only catalog cousin: pontoon/#93288 (RC bridges washed on Desktop restart; different defect; do not rebuild)
- Cite-only catalog cousin: afterimage/#92596 (Windows assistant paint deltas; different defect; do not rebuild)
- Cite-only catalog cousin: espagnolette/#92694 (AskUserQuestion caret paint after blur; different defect; do not rebuild)
- Cite-only catalog cousin: trompe/#90881 (painted clear; different defect; do not rebuild)
- Cite-only catalog cousin: diplopia/#93012 (RC environment-label split; different defect; do not rebuild)
- Cite-only catalog cousin: shibboleth/#92966 (RC GrowthBook 400; different defect; do not rebuild)
- Cite-only catalog cousin: deadlight/#92249 (RC tool blanking; different defect; do not rebuild)
- Backup (data only): #93458 SessionStart hook additionalContext silently dropped when source=fork
- Backup (data only): #93475 Effort selector requires a very tall terminal
- Backup (data only): #93439 Read tool never triggers PreToolUse hooks for binary files
- Backup (data only): #93438 Agent dispatch isolation worktree cwd bleed
- Backup (data only): #93466 Desktop Directory → Plugins duplicate cards / no uninstall
- Backup (data only): #93495 Desktop main-thread UNUserNotificationCenter XPC deadlock
- Backup (data only): #93469 ~/.claude silent reset
- Backup (data only): #93474 LSP plugins missing lspServers

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:tui
- Claude Code **2.1.267**; reporter kschzt; macOS; Remote Control client claude.ai/code from another device
- Session type: Remote Control attached to an otherwise idle Claude Code CLI after a completed turn
- Idle remote submit: PTY paints dim composer text; no PTY input; no transcript user row; no queue-operation; no turn
- Stop hooks: first returned `{"continue":true}` at 21:38:02.014Z; second returned `{}` at 21:38:02.195Z; `preventedContinuation:false` at 21:38:02.199Z
- Paint: 21:38:03.640Z, 1.44s later, `build the F-831 control`
- Positive control: mid-turn enqueue at 21:47:05.062Z; `absorbed_mid_turn` at 21:47:17.234Z (~12.172s); assistant followed
- Workaround: return to local terminal, Escape, retype

Problem found: REMOTE CONTROL MESSAGE TO AN IDLE CLI PAINTS DIM COMPOSER TEXT WITHOUT STARTING A TURN.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the lantern stayed **kindled** or was **painted**. Educational marsh foxfire / bioluminescence observation booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A Remote Control message submitted to an idle CLI becomes a user turn without local terminal input
2. The message appears as a transcript user row, not only as dim composer paint
3. A queue-operation records delivery when the session is idle, just as mid-turn enqueue/absorb already does
4. Remote users receive a delivery failure if the idle path cannot start a turn

## Why not a clone

This is specifically: **REMOTE CONTROL MESSAGE TO AN IDLE CLI PAINTS DIM COMPOSER TEXT WITHOUT STARTING A TURN** — marsh foxfire observation booth, not conservation atelier pentimento, not chain-forge vinculum, not wax-cachet blotter, not hangar strobe, not harbor pontoon, not CRT afterimage.

**NOT Pentimento/#93482** (device_commit_files overwrite one-behind). Different defect. NOT art-conservation / underpainting atelier.

**NOT Vinculum/#93485** (local-mode hardlink / cloud bridge-refuse). Different defect. NOT chain-forge / nlink gauges.

**NOT Cachet/#93490** (Fable resume string-carrier bust). Different defect. NOT diplomatic wax-cachet blotter.

**NOT Pontoon/#93288** (RC bridges washed on Desktop restart). Different defect. NOT harbor pontoon / floating-bridge pier.

**NOT Afterimage/#92596** (Windows assistant paint deltas stay latent). Different defect. NOT CRT phosphor afterimage.

**NOT Espagnolette/#92694** (AskUserQuestion caret paint after blur). Different defect. NOT locksmith casement fastener.

**NOT Trompe/#90881** (painted clear that never ran). Different defect. NOT trompe-l'œil gallery pane.

**NOT Diplopia/#93012** (RC environment-label split). Different defect. NOT ophthalmology double-vision.

**NOT Shibboleth/#92966** (RC GrowthBook 400). Different defect. NOT river-ford watchword.

**NOT Deadlight/#92249** (RC tool blanking). Different defect. NOT shuttered porthole.

**NOT Strobe/#93468.** **NOT Counterfoil/#93446.** **NOT Lucida/#93429.** **NOT Fomite/#93423.** **NOT Snubber/#93398.** **NOT Fosse/#93358.** **NOT Hibernacle/#93372.** **NOT Paraph/#93327.** Different defects.

**NOT Procrustes** (MCP tool cull / iron bed). Different defect. NOT an iron-bed schema cull. This booth is a marsh lantern for idle-composer vs real-turn gauges.

**NOT Hallmark** (sterling/debased). **NOT Diopter / Hysteresis / Ephemera.** Those catalog paradigms are different mechanisms — this booth is specifically idle Remote Control paint-without-turn.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **marsh foxfire booth — after a clean Stop a Remote Control message to an idle CLI should stay kindled (transcript user row + turn started); instead the lantern glass paints dim composer text that is not combustion (no transcript, no queue-operation, no turn).**

Do NOT rename this product Pentimento, Vinculum, Cachet, Strobe, Counterfoil, Lucida, Fomite, Snubber, Fosse, Hibernacle, Pontoon, Afterimage, Espagnolette, Trompe, Diplopia, Shibboleth, Deadlight, or any existing catalog slug.
Do NOT reuse idle kindled / painted / never-turns on a later booth.
Display here is **Eczar**. Body is **Work Sans**. Mono is **Inconsolata**.

Different surface: idle Remote Control paint-without-turn vs overwrite one-behind vs local-mode hardlink vs Fable resume string-carrier vs RC bridges washed vs Windows assistant paint deltas.

Different UI: lantern glass / peat bank / mist veil / dark water gauges. Eczar / Work Sans / Inconsolata. Dark marsh field. NOT conservation atelier. NOT chain-forge. NOT wax-cachet blotter. NOT hangar strobe. NOT harbor pontoon. NOT CRT afterimage.

Different verbs: Kindle the lantern, Score foxfire, Sweep the mist, Compare lantern / peat, Pin idle kindled, Pin seeded painted, Pin never-turns, Clear the lantern.

Different idle: **kindled**. Different #93502 seeded path: **painted**. HOLD: **kindled** / **hold**. ALARM: **painted** / **foxfire** / **never-turns** / **composer-paint**. Path: **never-turns**.

## How to score

```bash
node --test projects/foxfire/foxfire.test.mjs
node projects/foxfire/foxfire.mjs projects/foxfire/data/painted.json
echo '{"seed":"painted"}' | node projects/foxfire/foxfire.mjs
```

Open the living card at `projects/foxfire/index.html` (or the live path `/foxfire/`). Buttons: Kindle the lantern, Score foxfire, Sweep the mist, Compare lantern / peat, Pin idle kindled, Pin seeded painted, Pin never-turns, Clear the lantern. Toggle dim composer paint / no transcript / no queue / no PTY input / session idle / never-turns — the score flips. Lay a fixture JSON on the lantern. `?embed=1` hides chrome.

The booth reconstructs the reporter’s idle-paint / never-turns walk from the published #93502 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/foxfire/
- Folder: `projects/foxfire/`
