# Leaven

A **bakery / proofing-bench** — maple dough boards, glass starter crocks labeled Notion-MCP / superpowers / harness-system / skill-guidance, proofing baskets, flour-dust chalk scorecards, a peel and a kiln — for a real Claude Code defect: **during heavy parallel Agent/Task Explore launches (`run_in_background: true`), ~5/20 subagents return in 2–12s with 0 tool calls, outputting foreign instruction blocks instead of doing the task**. Identical relaunch succeeds. Siblings launched the same instant often clean. Hypothesis: bootstrap context assembly race — the subagent's first visible turn intermittently contains fragments of parent/system context (MCP server instruction blocks, plugin skill injections, raw system-prompt text) presented as if they were the incoming message.

Primary:

- [anthropics/claude-code#90782](https://github.com/anthropics/claude-code/issues/90782) (OPEN, filed 2026-08-30T15:29:59Z). Title: Subagent (Agent/Task tool) intermittently starts with contaminated bootstrap context and echoes foreign instruction blocks instead of executing (0 tool calls). Labels: bug, has repro, platform:macos, area:agents. Author Beppo90. Claude Code CLI on macOS **darwin 25.5.0**, model **claude-fable-5**. MCP servers (claude.ai connectors incl. Notion; supabase; context7; vercel plugin); plugins (superpowers, mattpocock-skills). Signature 100% consistent: 0 tool uses; duration 2–12 seconds (healthy same prompts 90–220s with 10–20 tool uses); result is instruction-shaped text not task output. Workaround: detect 0-tool + seconds-long + instruction-shaped → discard → relaunch; works within 1–2 retries. One case needed 2 retries (3 launches total).

A first turn of foreign starter is not a bake. Score the crocks or admit **unleavened**.

Idle word: **unleavened**. Seeded state: **leavened** / #90782 — 0-tool, 2–12s, instruction-shaped foreign echo. Never idle as "leaven".

- **unleavened** = hold: tools used, duration in the healthy band, result is task-shaped not instruction-shaped, no MCP/plugin/harness debris fingerprints
- **leavened** = #90782 primary failure
- **contaminated** = bootstrap assembled the wrong starter
- **foreign-echo** = first visible turn is instruction-shaped, not the task
- **zero-tool** = 0 tool uses in a seconds-long Explore launch
- **system-debris** = harness token `_bump_bwrap_repro` (verbatim) plus agent-identity/context-priority fragments
- **mcp-echo** = Notion-MCP search-tool edict; nothing in the prompt mentioned Notion
- **skill-echo** = plugin skill rule or skill-usage guidance echoed as the result
- **blank-abort** = "(This message is left blank intentionally.) Wait, I need to actually do the task. Let me reconsider." then the run ended
- **relaunched-clean** = discard the 0-tool loaf; the identical prompt bakes

Verdicts: unleavened, leavened, contaminated, foreign-echo, zero-tool, system-debris, mcp-echo, skill-echo, blank-abort, relaunched-clean.

Seed-chip aliases: spanish-skill → skill-echo; notion-mcp → mcp-echo.

## Why not a clone

This is specifically: **start-of-run bootstrap contamination**. The "result" is echoed foreign instructions with 0 tools.

NOT **Voucher** ([#90807](https://github.com/anthropics/claude-code/issues/90807)) — end-of-run nested fan-out presents never-returned child findings as verified fact. Leaven is start-of-run bootstrap contamination so the "result" is echoed foreign instructions with 0 tools.
NOT **Pirn** — truncates instruction-shaped idle_notification at ~2.5k. Leaven delivers wrong content at bootstrap, not truncated right content.
NOT **Veto** — heron_brook security palimpsest. Leaven is harness/MCP/plugin debris race into the visible first turn.
NOT **Hydra** ([#90856](https://github.com/anthropics/claude-code/issues/90856)) — dual-ledger marketplace resurrection.
NOT **Limpet** ([#89275](https://github.com/anthropics/claude-code/issues/89275)) — OS process leak after end_turn.
NOT **Scion** ([#90815](https://github.com/anthropics/claude-code/issues/90815)) — empty RC fork identity.
NOT **Almanac** ([#90804](https://github.com/anthropics/claude-code/issues/90804)) — ghost Loop schedule UI.
NOT **Kindling** ([#90798](https://github.com/anthropics/claude-code/issues/90798)) — throwaway WarmLifecycle session mint. Leaven corrupts a real Explore launch.
NOT **Deadband** ([#90789](https://github.com/anthropics/claude-code/issues/90789)) — time-blind settings watcher.

Stay off Pawl / Cenotaph / Fetch / Livery / Pinfold / Palimpsest / Escutcheon / Lacuna / Ambo / Slype / Tally / Pale / Chatelaine problems and UI metaphors.

Different UI: maple dough boards, glass starter crocks, proofing baskets, flour-dust chalk scorecards, peel and kiln. Palette: warm maple, flour-dust cream, sourdough tan, kiln brick, starter-crock glass, chalk white, oven-alarm ember. Fonts: Newsreader + Karla + Source Code Pro. NOT millimetre sliders. NOT woodworking leftover. NOT marble registry / bronze fountain / twin ledgers / tide-pool / orchard / feast-page / cashier / hearth / control-room.

## Live catalog path

`/leaven/` is this static proofing bench. Demo works with no secrets and no npm. Mark: `09:50 Sydney · leaven`.

1. Seeded demo loads **leavened** (#90782 — 0-tool, 2–12s, instruction-shaped foreign echo).
2. Quarantine the loaf → discard. Relaunch the identical prompt → **unleavened** (tools used, healthy band, task-shaped).
3. Chip-switch seeds: leavened / unleavened / contaminated / foreign-echo / zero-tool / system-debris / mcp-echo / skill-echo / blank-abort / relaunched-clean / spanish-skill / notion-mcp.
4. Paste or edit an Explore launch ticket JSON and score the crocks.
5. Export a launch ticket.

## How to score

Open `projects/leaven/index.html` in a browser, or serve the repo root and visit `/leaven/` (Vercel rewrite → `/projects/leaven`). No build step. Optional hook:

```bash
node projects/leaven/hook/leaven.mjs < projects/leaven/data/90782.json
node projects/leaven/hook/leaven.mjs projects/leaven/data/unleavened.json
node --test projects/leaven/hook/leaven.test.mjs
```

Leavened seed → leavened/alarm. Unleavened seed → unleavened/hold.

`projects/leaven/hook/leaven.mjs` scores a launch ticket `{ toolUses, durationSeconds, outputText, instructionShaped, debrisFingerprints[], relaunchSucceeded, siblingClean, mcpMentionedInPrompt }` and returns `{ verdict, chips[], reasons[], unleavened, leavened, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90782.json`, `data/unleavened.json`, plus the five occurrence variants (`notion-mcp`, `spanish-skill`, `system-debris`, `blank-abort`, `skill-echo`), `data/fingerprints.json`, `data/chips.json`. Numbers from the issue only.

## Native integrations

1. Live fetch `https://api.github.com/repos/anthropics/claude-code/issues/90782`. Unauthenticated. See `.env.example`.
2. Local seed JSON under `data/`.
3. Hook CLI: `node projects/leaven/hook/leaven.mjs`.
4. Slack / Linear adapters are honest demo rows when no secrets are present.

## Sources

- [anthropics/claude-code#90782](https://github.com/anthropics/claude-code/issues/90782) OPEN
- Same-class backup (cite on the bench, not as primary): [#90765](https://github.com/anthropics/claude-code/issues/90765) OPEN — VRUC-2 (Values Ranking Under Uncertainty) injected as a user turn
- Nearby boundary only (do not treat as same mechanism): Pirn (#90544 family instruction-shaped idle_notification truncations) and Veto (heron_brook injection)
