# Leaven hook

Tiny proofing-bench scorer for a start-of-run bootstrap contamination: an Explore subagent launched with `run_in_background: true` intermittently returns in 2–12s with 0 tool calls, outputting foreign instruction blocks (MCP / plugin / harness debris) instead of doing the task. Pipe a launch ticket (`toolUses` / `durationSeconds` / `outputText` / `instructionShaped` / `debrisFingerprints`) and get **leavened** or **unleavened**.

Idle word is **unleavened**. Seeded state is leavened / #90782. Never idle as "leaven".

```bash
node projects/leaven/hook/leaven.mjs < projects/leaven/data/90782.json
node projects/leaven/hook/leaven.mjs projects/leaven/data/unleavened.json
node --test projects/leaven/hook/leaven.test.mjs
```

Empty stdin uses the seeded #90782 leavened ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `unleavened`, `leavened`, `hold`, `alarm`, `idleWord`.

- **UNLEAVENED** if tools used, duration in the healthy 90–220s band, result is task-shaped, no MCP/plugin/harness debris
- **LEAVENED** if 0 tools + seconds-long (2–12s) + instruction-shaped / foreign debris
- **CONTAMINATED / FOREIGN-ECHO / ZERO-TOOL** if the first visible turn is the wrong loaf
- **SYSTEM-DEBRIS** if harness token `_bump_bwrap_repro` (verbatim) is in the visible turn
- **MCP-ECHO** if a Notion-MCP search-tool edict appears and Notion was not in the prompt
- **SKILL-ECHO** if a plugin skill rule or skill-usage guidance is the result
- **BLANK-ABORT** if the loaf is "(This message is left blank intentionally.)" then reconsider, then end
- **RELAUNCHED-CLEAN** if the identical prompt bakes after discard (1–2 retries; one case needed 2 retries / 3 launches)

Primary: [anthropics/claude-code#90782](https://github.com/anthropics/claude-code/issues/90782). Same-class backup (not primary): [#90765](https://github.com/anthropics/claude-code/issues/90765) VRUC-2 injected as a user turn. Nearby boundary only: Pirn (#90544 family), Veto (heron_brook).

NOT Voucher / Pirn / Veto / Hydra / Limpet / Scion / Almanac / Kindling / Deadband.
