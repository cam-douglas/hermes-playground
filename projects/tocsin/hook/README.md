# Tocsin hook

Tiny watchhouse fire-bell classifier for the Claude Code defect where a **subagent** starts `Bash(run_in_background: true)`, ends its turn, and the script's completion notification is created and queued — but nothing delivers it to an **idle** subagent. There is no idle-wake consumer. The main session's identical completions dequeue within milliseconds. Measured on Claude Code 2.1.258 / Windows 11 across three instrumented runs (`queue-operation` records). Reporter ManufactoryOfCode. Filed 2026-09-02.

Idle word is **armed**. Seeded state is unheard / #91503 (completion notification queued; no idle-wake consumer for subagent; hangs until human nudge; main wakes in ms). Never idle as unbolted / snagged / reeved / fouled / creased / bled / latched / vanished / sealed / rebound / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

```bash
node projects/tocsin/hook/tocsin.mjs projects/tocsin/data/91503.json
node projects/tocsin/hook/tocsin.mjs projects/tocsin/data/armed.json
echo '{"noIdleWake":true,"notificationQueued":true}' | node projects/tocsin/hook/tocsin.mjs
node --test projects/tocsin/hook/tocsin.test.mjs
```

Empty stdin uses the idle **armed** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `armed`, `unheard`, `hold`, `alarm`, `idleWord`.

Given `{ wakeFair, subagentWakesOnIdle, mainWakes, notificationQueued, idleWakeConsumer, subagent, queuedNotLost, noIdleWake, humanNudge, runInBackground, queueOperation, hangUntilTurn }`:

- **ARMED** if background-task completion wakes an idle subagent the same way it wakes the main session
- **UNHEARD** if the completion notification is queued with no idle-wake consumer for the subagent (#91503)
- **SUBAGENT** if the owner starts `Bash(run_in_background: true)` then ends its turn
- **MAIN-WAKES** if identical background-task completions dequeue within milliseconds
- **QUEUED-NOT-LOST** if the script completion notification is created and queued on exit
- **NO-IDLE-WAKE** if nothing delivers that notification to an idle subagent
- **HUMAN-NUDGE** if delivery happens the moment the subagent is already in a turn
- **RUN-IN-BACKGROUND** if `Bash(run_in_background: true)`
- **QUEUE-OPERATION** if `queue-operation` records across three instrumented runs
- **HANG-UNTIL-TURN** if the subagent stays idle indefinitely and the parent hangs
- **HAS-CLEAR-REPRO** if ManufactoryOfCode filed #91503; has repro; area:agents; platform:windows
- **HOLD** if the tocsin is armed (idle subagent wakes the same way the main session wakes)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the wake is armed or unheard.

Primary: [anthropics/claude-code#91503](https://github.com/anthropics/claude-code/issues/91503). Cousins (cite only, not primaries): [#78338](https://github.com/anthropics/claude-code/issues/78338) passively queued command with no idle-wake consumer; [#21048](https://github.com/anthropics/claude-code/issues/21048) Windows `run_in_background` completion does not wake Claude from idle; [#29163](https://github.com/anthropics/claude-code/issues/29163) team agents go idle without responding.

Hypothesis only (NON-BINDING): the queue entry for a subagent-owned background task has no idle-wake consumer; `absorbed_mid_turn` is the only path it ever takes; the dequeue-and-start-a-turn path that serves the main session never fires for it. Encoded from the issue's measured claim.

NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / standing-rigging deadeye / flour-mill bolter / letterpress galley Reglet UI. Product name stays Tocsin. Do not rename to Bolter / Deadeye / Reglet / Reliquary / Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew / Hasp / Berth / Bollard / Reveille / Callboard / Toggle.
