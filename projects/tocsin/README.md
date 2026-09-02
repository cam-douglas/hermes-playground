# Tocsin

A **watchhouse fire-bell** atelier — brass tocsin plaque, main-session idle-wake vs subagent queue-only dial, background `Bash(run_in_background: true)` completion lamp, human-nudge rescue strip, queue-operation ledger; night-navy / brass / ember — Fraunces + Source Sans 3 + IBM Plex Mono — for a real Claude Code defect: **SUBAGENT BASH(RUN_IN_BACKGROUND:TRUE) COMPLETION NOTIFICATION QUEUED WITH NO IDLE-WAKE CONSUMER; MAIN SESSION WAKES IN MS; HANGS UNTIL HUMAN NUDGE; AREA:AGENTS+WINDOWS.**

Primary:

- [anthropics/claude-code#91503](https://github.com/anthropics/claude-code/issues/91503) (OPEN, bug, has repro, platform:windows, area:agents, filed 2026-09-02T13:15:54Z, updated 2026-09-02T13:17:10Z). Title: Windows: a subagent's background-task completion notification is queued but has no idle-wake consumer — the subagent hangs until something else gives it a turn (refs #78338, #21048, #29163). Reporter ManufactoryOfCode. Measured on Claude Code 2.1.258 / Windows 11 across three instrumented runs (`queue-operation` records).

a tocsin that only rings into ears already on duty is not a fire-bell; it is an unheard queue. Score the wake or admit the subagent already slept through the all-clear.

Idle word: **armed**. Seeded state: **unheard** / #91503 — completion notification queued; no idle-wake consumer for subagent; hangs until human nudge; main wakes in ms. Never idle as unbolted / snagged / reeved / fouled / creased / bled / latched / vanished / sealed / rebound / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

A **tocsin** is the watchhouse fire-bell that should wake a sleeping watch when a background task completes. When a **subagent** starts `Bash(run_in_background: true)` and then ends its turn, the script's completion notification is created and queued, but nothing delivers it to the idle subagent — there is **no idle-wake consumer**. The subagent hangs until a human nudge puts it in a turn. The identical mechanism wakes the **main session** within milliseconds.

- **unheard** = #91503: completion notification queued; no idle-wake consumer for subagent; hangs until human nudge; main wakes in ms
- **subagent** = starts `Bash(run_in_background: true)` then ends its turn
- **main-wakes** = identical background-task completions dequeue within milliseconds and start a new turn
- **queued-not-lost** = script completion notification is created and queued on exit (not lost)
- **no-idle-wake** = nothing delivers that notification to an idle subagent (no idle-wake consumer)
- **human-nudge** = delivery happens the moment the subagent is already in a turn (human nudge in practice)
- **run-in-background** = `Bash(run_in_background: true)`
- **queue-operation** = `queue-operation` records across three instrumented runs in one session
- **hang-until-turn** = subagent stays idle indefinitely; parent waiting on its report hangs
- **has-clear-repro** = ManufactoryOfCode filed #91503; has repro; area:agents; platform:windows; Claude Code 2.1.258; Windows 11; three instrumented runs
- **hold** = background-task completion wakes an idle subagent the same way it wakes the main session
- **armed** = HOLD: background-task completion wakes an idle subagent the same way it wakes the main session

Verdicts: armed, unheard, subagent, main-wakes, queued-not-lost, no-idle-wake, human-nudge, run-in-background, queue-operation, hang-until-turn, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the wake is armed or unheard.

Hypothesis only (NON-BINDING): the queue entry for a subagent-owned background task has no idle-wake consumer; `absorbed_mid_turn` is the only path it ever takes; the dequeue-and-start-a-turn path that serves the main session never fires for it. Encoded from the issue's measured claim. Verify against the issue text and discard if wrong.

## Why not a clone

This is specifically: **SUBAGENT BASH(RUN_IN_BACKGROUND:TRUE) COMPLETION NOTIFICATION QUEUED WITH NO IDLE-WAKE CONSUMER; MAIN SESSION WAKES IN MS; HANGS UNTIL HUMAN NUDGE; AREA:AGENTS+WINDOWS.**

NOT **Bolter** ([#91422](https://github.com/anthropics/claude-code/issues/91422)) — dontAsk cp/mv option-token matcher.
NOT **Deadeye** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — relative PreToolUse Bash hook path × drifted cwd → permanent Bash deadlock.
NOT **Reglet** ([#91443](https://github.com/anthropics/claude-code/issues/91443)) — CRLF / empty-index stageCheckout before `.gitattributes`.
NOT **Reliquary** ([#91433](https://github.com/anthropics/claude-code/issues/91433)) — aarch64 O_* EINVAL session vanish / data-loss — cite as stay-off.
NOT **Annunciator** ([#91419](https://github.com/anthropics/claude-code/issues/91419)) — StopFailure false alarms on parent — loud polarity — cite as stay-off.
NOT **Caisson** ([#91405](https://github.com/anthropics/claude-code/issues/91405)) — worktree pool wrong rebind + dirty wipe — cite as stay-off.
NOT **Spindle** ([#91402](https://github.com/anthropics/claude-code/issues/91402)) — startup cleanup deletes live sibling Bash outputs — cite as stay-off.
NOT **Knell** ([#91298](https://github.com/anthropics/claude-code/issues/91298)) — Agent-tool silent child death.
NOT **Tumbler**.
NOT **Escapement**.
NOT **Geneva** / **Scotch** / **Carillon** / **Pintle** / **Fibula**.
NOT **Virgule** / **Riddle** / **Garner** / **Postern** / **Sluice**.
NOT **Reveille** / callboard / standing-rigging deadeye / flour-mill bolter metaphors.
NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / berth clones / letterpress galley Reglet UI.
NOT **Toggle** — this hour ships **Tocsin**.

Cousins are cite-only on a cousin strip; primary stays #91503.

- [#78338](https://github.com/anthropics/claude-code/issues/78338) — closed — Linux; notification as a passively queued command with no idle-wake consumer, so a long-idle parent stays unwoken.
- [#21048](https://github.com/anthropics/claude-code/issues/21048) — closed — Windows, `run_in_background` completion notification does not appear and does not wake Claude from idle. Reported 2026-01-26 on 2.1.19 with `has repro`, marked `stale`, then closed as not planned. Same platform, same symptom, main-agent variant. The #91503 runs find the main-session path working on 2.1.258.
- [#29163](https://github.com/anthropics/claude-code/issues/29163) — closed as duplicate — macOS; team agents go idle without responding. There SendMessage did **not** revive the agents; here any message does, which localises this to the wake path only.

Related mentions inside #91503 (cite only, not primaries): #75043 nested subagents / child completion notifications delivered to the wrong parent; #29271, #24108, #47930, #85047 surrounding Agent Teams idle-notification cluster. This is not #50572: the background shell is *not* killed when the subagent ends its turn.

Backups (do not ship unless primary blocked): **Blackhole** / #91502. **Skipjack** / #91480 — auto-update skipped with --effort max. **Clepsydra** / #91414 — MCP HTTP subscriptions/listen first-turn freeze. **Platen** / #91438 — detached window preview click no-op.

Product name stays **Tocsin**. Do not rename to Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Carillon, Sluice, Alidade, Cockade, Lye, Clew, Hasp, Berth, Bollard, Reveille, Callboard.

Different UI: watchhouse fire-bell / brass tocsin plaque + main-session idle-wake vs subagent queue-only dial + background Bash(run_in_background:true) completion lamp + human-nudge rescue strip + queue-operation ledger / night-navy / brass / ember. Fraunces + Source Sans 3 + IBM Plex Mono. NOT Piazzolla/Nunito/Roboto Mono (Bolter). NOT Literata/Red Hat Text/Red Hat Mono (Deadeye). NOT EB Garamond/Hanken Grotesk/Noto Sans Mono (Reglet). Stay OFF bolter flour-mill / deadeye standing-rigging / reglet letterpress / reliquary vault-latch / annunciator lamps / caisson berth / spindle chip-sweep / knell mute-bell / tumbler keyway / escapement pallet / carillon peal / sluice millrace / reveille muster.

Different verbs: Sound the tocsin, pin idle armed, pin seeded unheard, admit the subagent already slept through the all-clear, load fixtures, reset to armed. Not "Score the cloth/reeve/strip/latch/seal/purge/mute/keyway/pallet/cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race". Score the wake is this desk's phrase.

Different idle: **armed**.

## Live catalog path

`/tocsin/` is this static watchhouse fire-bell atelier desk. Path `https://hermes-playground-green.vercel.app/tocsin/` and subdomain `https://tocsin.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `23:50 / hermes catalog #123 / #91503`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **armed** — background-task completion wakes an idle subagent the same way it wakes the main session.
2. Seed **unheard** → #91503: completion notification queued; no idle-wake consumer for subagent; hangs until human nudge; main wakes in ms.
3. Atelier UI: brass tocsin plaque / main-session idle-wake vs subagent queue-only dial / background Bash completion lamp / human-nudge rescue strip / queue-operation ledger. Armed = idle wake present. Unheard = queued all-clear; no idle-wake consumer.
4. Cousin cite strip labeled cousin-not-primary: [#78338](https://github.com/anthropics/claude-code/issues/78338) / [#21048](https://github.com/anthropics/claude-code/issues/21048) / [#29163](https://github.com/anthropics/claude-code/issues/29163). Cite only. Primary stays #91503.
5. **Sound the tocsin** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/tocsin/index.html` in a browser, or serve the repo root and visit `/tocsin/` (Vercel rewrite → `/projects/tocsin`). No build step. Optional hook:

```bash
node projects/tocsin/hook/tocsin.mjs projects/tocsin/data/91503.json
node --test projects/tocsin/hook/tocsin.test.mjs
```

Empty stdin scores the idle **armed** ticket. Paste a probe on the page or drop a fixture from `data/`.
