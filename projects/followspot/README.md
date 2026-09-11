# Followspot

A **theatrical followspot / stage booth** — a beam that should light the full user MCP belt when a `spawn_task` chip opens the session; instead the house stays dark (internal-only `mcp_count` 8–9) until the operator focuses the session, and the model only sees `deferred_tools_delta` on the next queued cue — not on a mid-turn steer. Fonts **Oswald** (display) + **Karla** (sans) + **Space Mono** (mono). Palette: stage black `#0D0B10`, amber beam `#F5C542`, curtain crimson `#8B1E3F`, gel blue `#3D5A80`, chalk `#E8E4DC`, gel violet `#6B4C9A`. Light stage / dark theatre UI. NOT stone calendar, NOT mill weir, NOT sailing irons, NOT bow cathead, NOT film continuity, NOT Nullarbor, NOT petard, NOT greenroom (slug taken).

A followspot should arm the full tool belt when the chip-spawned session starts. Desktop Linux chip-spawn starts internal-only; attach waits for UI focus; tools reach the model only on the next queued turn.

Primary:

- [anthropics/claude-code#93714](https://github.com/anthropics/claude-code/issues/93714) (OPEN). Title: `[BUG] Desktop (Linux): spawn_task sessions still start without claude_desktop_config.json MCP servers; attach happens on UI focus, tools reach the model only on the next queued turn (re: #67432)`. Claude Desktop 1.49585.0 Linux; Claude Code 2.1.260; Ubuntu; 7 local stdio MCP servers in `~/.config/Claude/claude_desktop_config.json`. Sessions started from a `spawn_task` chip begin the first turn with only app-internal MCP servers. ToolSearch for configured servers returns "No matching deferred tools found". CCD start-timing: chip-spawn `mcp_count=8/9` (internal only); normal sessions `mcp_count=15/16`. Configured servers attach (`LocalSessions.replaceEnabledMcpTools` + `reconcileServers`) only when the spawned session is focused (`LocalSessions.setFocusedSession`), not at start. Even after attach, the model gets `deferred_tools_delta` only at the next queued user turn. A message steered into the running turn does not carry it. Labels: bug, has repro, platform:linux, area:mcp, area:agents, area:desktop. Cousins cite-only: #67432 CLOSED (same class; closed by inactivity bot; still reproduces per #93714); #90061 OPEN (related but different: Desktop `replaceRemoteMcpServers` never applied to in-flight turn). Backups cite-only (next focus only — do not auto-pick): #93683 Rider, #93703 Monadnock, #93672 `idle_prompt` while subagents running, #93652 Remote Control capacity silent session substitution, #93680 Bash mkdir via `/proc/self/fd`, #93618 Windows/Git Bash ~8175 truncation + backslash, #93694 WSL Open-in paths.

06:50 followspot: a theatrical followspot / stage booth for #93714. Idle **lit** / seeded **dark** / path **spawn-mcp-focus**. Score followspot or admit lit.

Score followspot or admit lit.

Idle word: **lit** (HOLD: user MCP belt armed at spawn, same as normally started sessions). Seeded word: **dark** / #93714 (chip-spawn starts internal-only; user MCP absent until focus + next queued turn). Path word: **spawn-mcp-focus**. Product score: **followspot**. Never idle due / flowing / underway / seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / untainted / voiced / lodged / kindled / flushed / solitary / hit or seeded misfired / dammed / becalmed / raced / stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score followspot or admit lit.**

- **lit** = IDLE: HOLD; user MCP belt armed at spawn, same as normally started sessions
- **dark** = #93714 seeded path: chip-spawn starts internal-only; user MCP absent until focus + next queued turn
- **followspot** = product score word for a beam that should light the belt at spawn and stays dark
- **spawn-mcp-focus** = path word: attach waits for UI focus; model sees the belt only on the next queued cue
- **hold** = HOLD alias for idle lit
- **chip-spawn** = sessions started from a spawn_task chip
- **internal-only** = mcp_count 8–9 at init (ccd_directory, ccd_session_mgmt, mcp-registry, scheduled-tasks, …)
- **focus-attach** = replaceEnabledMcpTools + reconcileServers fire on setFocusedSession, not at start
- **mid-turn-steer** = a message steered into the running turn carries no deferred_tools_delta
- **next-queued-cue** = the next queued user message finally adds all 7 local servers
- **toolsearch-empty** = ToolSearch returns "No matching deferred tools found"
- **healthy-servers** = MCP servers themselves connected since 20:07; tools/list ~200ms
- **has-repro** = published shape: Linux Desktop; chip-spawn mcp_count 8–9; focus attach; next queued cue
- **cousins** = cite-only #67432 #90061 — do not rebuild
- **backups** = cite-only #93683 #93703 #93672 #93652 #93680 #93618 #93694 — do not auto-pick
- **fixtures** = followspot beam / dark house / operator iris / prompt book / prop belt
- **walk** = published idle lit → healthy servers → chip-spawn → internal-only → focus-attach → toolsearch-empty → mid-turn-steer → next-queued-cue → spawn-mcp-focus → followspot

Verdicts: lit, dark, followspot, spawn-mcp-focus, hold, chip-spawn, internal-only, focus-attach, mid-turn-steer, next-queued-cue, toolsearch-empty, healthy-servers, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the followspot is **dark** / **followspot** or already **lit**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): chip-spawn path may skip the MCP attach that normal session start runs, deferring `replaceEnabledMcpTools` until `setFocusedSession`, and `deferred_tools_delta` may only attach on queued user turns not mid-turn steers. Invite verify against #93714 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93714](https://github.com/anthropics/claude-code/issues/93714)
- Cite-only cousins: #67432 (CLOSED — same class; inactivity bot; still reproduces), #90061 (OPEN — connectors push / in-flight turn; different surface)
- Backups (data only; next focus only — do not auto-pick): #93683, #93703, #93672, #93652, #93680, #93618, #93694

What happened (from the issue text — do not invent):

- OPEN.
- Claude Desktop 1.49585.0 Linux; Claude Code 2.1.260; Ubuntu
- 7 local stdio MCP servers in `~/.config/Claude/claude_desktop_config.json`
- Chip-spawn first turn: only app-internal MCP; ToolSearch finds nothing
- CCD start-timing: chip-spawn `mcp_count=8/9`; normal sessions `mcp_count=15/16`
- Attach (`replaceEnabledMcpTools` + `reconcileServers`) only on `setFocusedSession`
- Mid-turn steer carries no `deferred_tools_delta`; next queued user turn does
- Evidence: normal ×5 mcp_count 15–16 at init, replace same second to +2s; chip A mcp_count 9, first replace +2m6s; chip B mcp_count 9, +2s; chip C mcp_count 8, +37s (same second as `setFocusedSession`)
- Session C UTC: 20:18:49 spawn mcp_count=8; 20:18:50 first-turn delta internal only; 20:19:26 focus → toolCount=243, created=7, total=15; 20:19:45 ToolSearch no match; 20:20:10 steer into running turn → no delta; ~20:20:27 ToolSearch still empty; 20:28:29 next queued message → delta adds all 7 local servers
- MCP servers healthy (connected since 20:07; tools/list ~200ms)
- Labels: bug / has repro / platform:linux / area:mcp / area:agents / area:desktop

Problem found: DESKTOP LINUX SPAWN_TASK CHIP SESSIONS START WITHOUT USER MCP SERVERS; ATTACH WAITS FOR UI FOCUS; TOOLS REACH THE MODEL ONLY ON THE NEXT QUEUED TURN.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the followspot stayed **lit** or went **dark**. Educational stage booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Chip-spawned sessions should attach the same MCP at start as normal/scheduled sessions; mid-turn delta should deliver with the next steered message or tool result

## Why not a clone

This is specifically: **DESKTOP LINUX SPAWN_TASK CHIP SESSIONS START WITHOUT USER MCP; ATTACH ON FOCUS; DELTA ONLY ON THE NEXT QUEUED CUE.**

Novel paradigm: theatrical followspot / stage whose beam should light the full user MCP belt when a `spawn_task` chip opens the session; instead the house stays dark (internal-only `mcp_count` 8–9) until UI focus attaches servers, and the model only sees `deferred_tools_delta` on the next queued cue — not on a mid-turn steer.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Anachronism/#93585** (cloud pre-warm vs session-start checkout race). Different defect. NOT continuity slate / darkroom. Do not reuse tip / stale / prewarm-latch.

**NOT Nullarbor/#93595** (plugin HTTP MCP `${VAR}` header expands empty). Different defect. NOT saltbush / empty-bearer. Do not reuse stamped / emptied / empty-expand.

**NOT Petard/#93607** (Linux Bash-tool `pkill -f` matches wrapper argv). Different defect. NOT siege petard. Do not reuse standing / hoisted / wrapper-argv.

**NOT Greenroom** (slug taken — theater green room / offstage waiting / mid-turn queue inject). Different defect. Do not reuse held / steered / greenroomed.

**NOT #67432** — cite only. Same class; closed by inactivity bot; still reproduces per #93714. Do not rebuild.

**NOT #90061** — cite only (connectors push / in-flight turn; different surface).

Do NOT rename Followspot to any existing catalog slug. Catalog currently has 299 products; Followspot is #300.
Do NOT reuse idle due / flowing / underway / seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / untainted / voiced / lodged / kindled / flushed / solitary / hit, or seeded misfired / dammed / becalmed / raced / stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.
Display here is **Oswald**. Body is **Karla**. Mono is **Space Mono**.

Different surface: chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist ignore vs scheduled WebSearch hang vs xnu ptmx race vs cloud pre-warm checkout vs lastRunAt-without-birth vs mid-turn queue inject.

Different UI: followspot beam / dark house / operator iris / prompt book / prop belt. Oswald / Karla / Space Mono. Stage black with amber beam, curtain crimson, gel blue, chalk, gel violet. NOT marble fasti. NOT mill-house parchment. NOT Atlantic sailing. NOT oak timber. NOT green-room velvet.

Different verbs: Light the belt, Score followspot, Walk the cue, Compare lit / dark, Pin idle lit, Pin seeded dark, Pin spawn-mcp-focus, Hold the lit.

Different idle: **lit**. Different #93714 seeded path: **dark**. HOLD: **lit** / **hold**. ALARM: **dark** / **followspot** / **spawn-mcp-focus** / **chip-spawn**. Path: **spawn-mcp-focus**.

## How to score

```bash
node --test projects/followspot/followspot.test.mjs
node projects/followspot/followspot.mjs projects/followspot/data/dark.json
echo '{"seed":"dark"}' | node projects/followspot/followspot.mjs
```

Open the living card at `projects/followspot/index.html` (or the live path `/followspot/`). Buttons: Light the belt, Score followspot, Walk the cue, Compare lit / dark, Pin idle lit, Pin seeded dark, Pin spawn-mcp-focus, Hold the lit. Toggle chips for: chip-spawn, internal-only, focus-attach, mid-turn-steer, next-queued-cue, toolsearch-empty, healthy-servers — the score flips. Lay a fixture JSON on the chalk blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s chip-spawn walk from the published #93714 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/followspot/
- Folder: `projects/followspot/`
