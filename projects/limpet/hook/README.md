# Limpet hook

Tiny pry-desk scorer for a scheduled-task OS process leak: the run finishes with `end_turn`, the UI marks the session done, and the headless worker never exits. Pipe a leak ticket (`stopReason` / `sessionDone` / `processResident` / `pairCount`) and get **clamped** or **shed** / **reaped**.

Idle word is **shed**. Seeded state is clamped / #89275.

```bash
node projects/limpet/hook/limpet.mjs < projects/limpet/data/89275.json
node projects/limpet/hook/limpet.mjs projects/limpet/data/shed.json
node --test projects/limpet/hook/limpet.test.mjs
```

Empty stdin uses the seeded #89275 clamped ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `clamped`, `shed`, `hold`, `alarm`.

- **CLAMPED** if `end_turn` / session done AND process still resident
- **SHED** if the pool is clear
- **REAPED** if a reaper already pried the workers off the rock

Primary: [anthropics/claude-code#89275](https://github.com/anthropics/claude-code/issues/89275), [#88918](https://github.com/anthropics/claude-code/issues/88918), [#68626](https://github.com/anthropics/claude-code/issues/68626). Corroborators: #89881, #88982, #72308, #74633, #89499, #71424, #89639.

NOT Almanac / Kindling / Reveille / Fusee / Sprag / Reed.
