# Gland

A **stuffing-box packing gland / shaft-seal bench** — oily iron housing, graphite packing rings, bronze gland nut, lantern-ring spacer, seafoam oil film, deep bilge; Lora + Plus Jakarta Sans + Martian Mono — for a real Claude Code defect: **ANY FUNCTION-HOOK `tool.call` ON BASH BREAKS AGENT `isolation: "worktree"` — EVERY BASH CALL REFUSED WITH "ISOLATION CONTEXT FOR THIS AGENT WAS LOST".** The hook can be a pure passthrough `next(e)`. Read/Edit and MCP keep working. When isolation survives and `pwd` prints the worktree path (**packed**), that is the hold path.

Primary:

- [anthropics/claude-code#92533](https://github.com/anthropics/claude-code/issues/92533) (OPEN, bug, has repro, platform:macos, area:bash, area:hooks, area:agents). Title: `Any function-hook tool.call on Bash breaks Agent isolation: "worktree" — every Bash call refused with "isolation context for this agent was lost"`. Updated 2026-09-06T18:57:22Z. Reporter: navidemad. Claude Code 2.1.263. macOS Darwin 25.6.0 Apple Silicon. zsh. Model Fable 5.1 (also default in `claude -p`).

12:50 gland: a stuffing-box packing gland that should keep the worktree isolation collar seated through a Bash tool.call passthrough but instead strips the packing the moment any function-hook registers on Bash — every pwd refused with context_lost (#92533). Score stripped or admit packed.

Idle word: **stripped** (packing gland stripped — isolation context lost; Bash refused). Seeded state: **packed** / #92533 — isolation survives; pwd prints worktree path. Never idle as unanswered, roused, slipped, sighted, riven, argbound, accruing, cleared, sheared, fayed, overladen, trimmed, defocused, sharp, skimmed, intact, mislabeled, scoped, saturating, or vented.

**Gland** = the stuffing-box packing gland that should keep the worktree isolation collar seated when a function-hook touches Bash. Claude Code loses that collar the moment any `tool.call` hook registers on Bash — even a pure `next(e)` — so every `pwd` and `true` is refused (`tengu_agent_worktree_cwd_escape_blocked` / `context_lost`).

- **stripped** = IDLE: Bash `tool.call` hook registered; isolation context lost; every pwd refused
- **packed** = seeded word: isolation survives; pwd prints `<repo>/.claude/worktrees/agent-xxx`
- **context-lost** = verbatim refuse: isolation context lost; would run in the parent session directory; 6 retries
- **parent-switched** = EnterWorktree recovery on the child switches the parent session into that worktree
- **passthrough-ok** = session.start-only plugin, or function hooks env off — pwd prints the worktree (also `session-start-ok`)
- **cousins** = cite-only #92112 #89102 #91932 #86340 #84704 #87953 #88950 #90432 #87643 #87959

Verdicts: stripped, packed, context-lost, parent-switched, passthrough-ok, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a Bash `tool.call` function-hook would leave the gland **stripped** or already **packed**. Fixtures use the issue's error, bisection, parent side-effect, and environment only.

Hypothesis only (NON-BINDING): registering a Bash `tool.call` function hook drops the worktree isolation context before the command runs, so the cwd guard refuses rather than let Bash execute in the parent session directory. Verify nothing in closed source — encode issue facts only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92533](https://github.com/anthropics/claude-code/issues/92533)
- Cousins cite-only (NOT primary): [anthropics/claude-code#92112](https://github.com/anthropics/claude-code/issues/92112), [#89102](https://github.com/anthropics/claude-code/issues/89102), [#91932](https://github.com/anthropics/claude-code/issues/91932), [#86340](https://github.com/anthropics/claude-code/issues/86340), [#84704](https://github.com/anthropics/claude-code/issues/84704), [#87953](https://github.com/anthropics/claude-code/issues/87953), [#88950](https://github.com/anthropics/claude-code/issues/88950), [#90432](https://github.com/anthropics/claude-code/issues/90432), [#87643](https://github.com/anthropics/claude-code/issues/87643), [#87959](https://github.com/anthropics/claude-code/issues/87959)

What happened (from the issue — do not invent):

- When `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` and a function-hooks plugin registers **any** `tool.call` hook on `Bash`, a subagent spawned with `Agent(isolation: "worktree")` has **every** Bash call refused, including `pwd` and `true`.
- Error: `The working-directory isolation context for this agent was lost, so this command would run in the parent session's directory instead of this agent's worktree (...). Refusing to run it.` Retry never helps (6 retries observed).
- Read/Edit and MCP tools keep working; only Bash is blocked.
- The hook can be a pure passthrough `next(e)` with no logic — mere registration of a Bash `tool.call` hook triggers loss (`tengu_agent_worktree_cwd_escape_blocked` / `context_lost`).
- Bisection: project plugin with Bash hooks → refused; same with function hooks env off → OK; fresh repo + plugin with only `session.start` hook → OK (pwd prints worktree); fresh repo + plugin with only Bash `tool.call` passthrough → refused.
- Side effect: if the blocked subagent calls `EnterWorktree(path: <its worktree>)` to recover, the **parent session** gets switched into that worktree (parent git commands then refused outside that directory until ExitWorktree).
- Claude Code 2.1.263; macOS Darwin 25.6.0 Apple Silicon; zsh; model Fable 5.1 (also default in `claude -p`).
- Workaround noted by reporter: create worktrees by hand and spawn agents without isolation, prefixing commands with `cd <worktree> &&`.

Problem found: any Bash `tool.call` function-hook registration strips the worktree isolation context; Bash is refused rather than allowed to run in the parent directory.

Why this solution: a diagnostic scorer for the stripped → packed gland chain, so a reader can admit idle stripped, pin seeded packed, and score context-lost / parent-switched / passthrough-ok / cousins against the published facts.

## Why not a clone

This is specifically: **any function-hook `tool.call` on Bash strips `Agent(isolation: "worktree")` — every Bash call refused with context_lost.**

**NOT Holdfast/#92112** — mid-session `--worktree` cwd guard permanently blocks Bash while MCP retains filesystem access. Different mechanism; different surface. Cite #92112 as cousin only.

**NOT Oubliette/#92095** — cold parent voids child-completion queue.

**NOT Larum/#92563** — task-notification written into history but no assistant turn.

**NOT Pintle / Wicket / Fairlead / Deadeye / Frizzen / Tappet / Pinfold** — prior isolation/hook paradigms; different defects.

Cousins cite-only (NOT primary): #92112, #89102 (EnterWorktree flips session-wide isolation latch), #91932 (Bash cwd pin does not follow after EnterWorktree), #86340 (parser abort blocks Bash under worktree isolation), #84704, #87953, #88950, #90432, #87643, #87959.

Stay OFF all prior catalog slugs/paradigms.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle unanswered / roused / slipped / sighted / riven / argbound / accruing / cleared / sheared / fayed / overladen / trimmed / defocused / sharp / skimmed / intact / mislabeled / scoped / saturating / vented.

Different surface: Bash-hook-strips-worktree-isolation vs mid-session `--worktree` cwd guard / cold-parent forgotten queue / written-notice-with-no-turn.

Product name stays **Gland**. Name/slug `gland` confirmed unused in catalog.json (195 products).

Different UI: stuffing-box packing gland / bronze gland nut / graphite packing rings / lantern-ring spacer / polished shaft / cast housing / oily iron / seafoam oil film / deep bilge / industrial dockyard seal lab. Lora / Plus Jakarta Sans / Martian Mono. NOT Fraunces/Figtree/JetBrains Mono. NOT Alegreya/Source Sans 3/Fira Code. NOT Libre Baskerville/DM Sans/Space Mono. NOT Newsreader/Public Sans/IBM Plex Mono. NOT Cormorant/Outfit/Roboto Mono. NOT Petrona/Outfit/Fragment Mono. NOT Spectral/Karla.

Different verbs: score stripped, admit packed, seat the packing, strip the packing, load #92533 fixture, score the gland.

Different idle: **stripped**. Different seeded: **packed**. HOLD: **packed** / **passthrough-ok**. ALARM: **stripped** / **context-lost** / **parent-switched** / **cousins**.
