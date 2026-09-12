# Galley

A **printer’s galley / wet-proof / unbound-signature booth** — a galley is the long tray that carries composed type before it is bound. The press should wait while ink-wet sheets are still being set. Instead the dirty-tree Stop hook pulls a proof of the wet signature, bills a full turn, and cannot tell in-progress work from abandoned type. Fonts **Young Serif** (display) + **Sora** (sans) + **Azeret Mono** (mono). Palette: ink-wet paper `#DDD6C8`, lead type soot `#141210`, vermilion proof marks `#C2301A`, brass composing stick `#A67C3D`, wet-sheet `#3E4A42`, ink `#221F1B`. Composing stick / wet-proof / pull-press UI. NOT a chancery/wax-seal (Rescript), NOT trig survey (Monadnock), NOT parliamentary rider (Rider), NOT theatrical followspot (Followspot), NOT calendar/weir/sailing.

A composing stick should wait on live type. Instead the dirty-tree Stop hook fires whenever the working tree has uncommitted or untracked files at the moment the **main** agent’s turn ends.

Primary:

- [anthropics/claude-code#93745](https://github.com/anthropics/claude-code/issues/93745) (OPEN). Title: `Stop hook blocks and bills a full turn when a background agent is mid-write; no way to distinguish in-progress work from abandoned work`. Labels: bug, area:cost, area:hooks, area:agents, area:claude-code-web, platform:web. Dirty-tree Stop hook fires when the working tree has uncommitted/untracked files at the moment the MAIN agent’s turn ends. With background subagents, a dirty tree at turn-end is the **normal correct state** (subagent writes for minutes, commits last). Hook cannot tell in-progress-by-design from abandoned mid-edit, so it fires every main turn for the whole subagent run. Stop hook exit 2 injects a synthetic user turn and re-invokes the model against the entire conversation (full context re-read). Acting on the message (commit mid-write) would race the subagent and produce broken intermediate commits. Measured one session: 4 firings, $3.25, ~5.5M billable tokens; ~85% cache reads; one firing produced multiple model calls via tool rounds. Hook never fires for the subagents themselves — tax hits the main session (largest context) which is NOT writing. Stop payload already knows about background work elsewhere (related: idle_prompt/#93672 has `background_tasks`); this Stop dirty-tree path does not skip when agents are live. Ask: skip/block-downgrade while background agents occupy the tree; make advisory after first firing; related #83924 unpushed false positive. Cousins cite-only: #83924 (unpushed false positive), #85787 (exit-time uncommitted warning), #69586 (signature/Unverified), #40442 (different Stop-hook loop). Backups cite-only (next focus only — do not auto-pick): #93743 #93722 #93746 #93744 #93672 #93652 #93680 #93618 #93694 #93735 #93733.

10:50 galley: a printer’s galley / wet-proof booth for #93745. Idle **dry** / seeded **billed** / path **stop-dirty**. Score galley or admit dry.

Score galley or admit dry.

Idle word: **dry** (HOLD: no false Stop billing; tree mid-write respected). Seeded word: **billed** / #93745 (Stop dirty-tree blocks + full-turn bill while background agent mid-write). Path word: **stop-dirty**. Product score: **galley**. Never idle intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / lit / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / nullarbor / standing / petard / raised / aposiopesis / seised / disseisin / ordered / analepsis / viewed / monstrance / sealed / cipherlock / untainted / attainder / voiced / sourdine / kindled / foxfire / flushed / pentimento or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score galley or admit dry.**

- **dry** = IDLE: HOLD; no false Stop billing; tree mid-write respected
- **billed** = #93745 seeded path: Stop dirty-tree blocks + full-turn bill while background agent mid-write
- **galley** = product score word for a press that bills a wet proof as abandoned type
- **stop-dirty** = path word: dirty-tree Stop fires at main turn-end on live type
- **hold** = HOLD alias for idle dry
- **skip-live** = expected write: skip or downgrade dirty-tree while background agents occupy the tree
- **advisory-once** = make the Stop dirty-tree path advisory after the first firing
- **wet-proof** = ink-wet unbound signature; background agent still writing; commit is last
- **composing-stick** = main agent ended its turn with type still loose
- **unbound-signature** = dirty tree at turn-end is the normal correct state, not a warning
- **four-firings** = 4 firings, $3.25, 5,525,683 billable tokens, 17 model calls
- **cache-read** = ~85% of the cost is cache reads — re-reading the conversation
- **main-session-tax** = tax hits the main session (largest context) which is not writing
- **background-exempt** = hook never fires for the subagents themselves — 0 firings on four transcripts
- **unpushed-cousin** = cite-only #83924 unpushed false positive
- **has-repro** = published shape: 4 firings; $3.25; ~5.5M tokens; 85% cache; exit 2; 0 subagent firings
- **cousins** = cite-only #83924 #85787 #69586 #40442 — do not rebuild
- **backups** = cite-only #93743 #93722 #93746 #93744 #93672 #93652 #93680 #93618 #93694 #93735 #93733 — do not auto-pick
- **fixtures** = composing stick / wet sheet / pull press / type bill / live forme
- **walk** = published idle dry → composing-stick → wet-proof → unbound-signature → stop-dirty → four-firings → cache-read → main-session-tax → background-exempt → stop-dirty → galley

Verdicts: dry, billed, galley, stop-dirty, hold, skip-live, advisory-once, wet-proof, composing-stick, unbound-signature, four-firings, cache-read, main-session-tax, background-exempt, unpushed-cousin, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the galley is **billed** / **galley** or already **dry**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): harness could consult live `background_tasks` / agent status before blocking Stop. Invite verify against #93745 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93745](https://github.com/anthropics/claude-code/issues/93745)
- Cite-only cousins: #83924 (same script, unpushed-commit false positive; related ask, different trigger), #85787 (exit-time uncommitted warning; non-blocking TUI; different surface), #69586 (same script, signature/Unverified on branch divergence; different defect), #40442 (different infinite Stop-hook loop on plugin cache dir; different defect)
- Backups (data only; next focus only — do not auto-pick): #93743, #93722, #93746, #93744, #93672, #93652, #93680, #93618, #93694, #93735, #93733

What happened (from the issue text — do not invent):

- OPEN.
- Labels: bug / area:cost / area:hooks / area:agents / area:claude-code-web / platform:web
- Dirty-tree Stop hook fires when the working tree has uncommitted/untracked files at the moment the MAIN agent’s turn ends
- With background subagents, a dirty tree at turn-end is the normal correct state
- Subagent writes files for several minutes and commits as its final step
- Hook cannot tell in-progress-by-design from abandoned mid-edit
- Fires on every turn for the whole duration of the subagent's run
- Because it is a Stop hook exiting 2, the message is injected as a synthetic user turn
- Model is re-invoked against the entire conversation — full context re-read per firing
- Acting on the message would race the subagent and produce a broken intermediate commit
- Measured one session: 4 firings, $3.25, 5,525,683 billable tokens
- 85% of the cost is cache reads ($2.75) — re-reading the conversation, not generating output
- One firing is not one model call — these four produced 17 via tool rounds
- Hook never fires for the subagents themselves (four transcripts, 0 each)
- Tax hits the main session (largest context) which is NOT writing
- Stop payload already knows about background work elsewhere (`idle_prompt` / #93672 has `background_tasks`)
- This Stop dirty-tree path does not skip when agents are live
- Ask: skip/block-downgrade while background agents occupy the tree; make advisory after first firing; apply #83924 unpushed fix

Problem found: STOP DIRTY-TREE BLOCKS AND BILLS A FULL TURN WHEN A BACKGROUND AGENT IS MID-WRITE; NO WAY TO DISTINGUISH IN-PROGRESS WORK FROM ABANDONED WORK.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the galley stayed **dry** or went **billed**. Educational printer’s-galley booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Do not block while a background agent occupies the tree; skip the dirty-tree check or downgrade it to non-blocking; make it advisory after the first firing; apply the #83924 unpushed check

## Why not a clone

This is specifically: **DIRTY-TREE STOP FIRES AT MAIN TURN-END WHILE A BACKGROUND AGENT IS STILL WRITING; EXIT 2 BILLS A FULL CONTEXT RE-READ; TAX HITS THE MAIN SESSION, NOT THE WRITERS.**

Novel paradigm: printer’s galley / wet-proof / unbound signature whose composing stick should wait on live type; instead the pull press bills a wet proof as if the type were abandoned.

**NOT Rescript/#93742** (`/model` save-as-default scrapes settings.json). Different defect. NOT chancery / wax-seal. Do not reuse intact / scraped / snapshot-write.

**NOT Monadnock/#93703** (nested submodule worktree from local main). Different defect. NOT trig survey / residual mountain. Do not reuse fresh / residual / submodule-base.

**NOT Rider/#93683** (tool-result `type=attachment` rider). Different defect. NOT parliamentary clerk desk / bill-rider. Do not reuse plain / ridden / attachment-rider.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Do not reuse lit / dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Anachronism/#93585** (cloud pre-warm vs session-start checkout race). Different defect. NOT continuity slate / darkroom. Do not reuse tip / prewarm-latch.

**NOT Nullarbor/#93595** (plugin HTTP MCP `${VAR}` header expands empty). Different defect. NOT saltbush / empty-bearer. Do not reuse stamped / emptied / empty-expand.

**NOT Petard/#93607** (Linux Bash-tool `pkill -f` matches wrapper argv). Different defect. NOT siege petard. Do not reuse standing / hoisted / wrapper-argv.

**NOT Palimpsest** (slug taken — scraped-vellum underpainting / prior catalog paradigm). Different defect. Do not rebuild.

**NOT Palinode/#92998** (MEMORY.md overflow sheds newest corrections). Different defect. NOT scriptorium retract. Do not rebuild.

Do NOT rename Galley to any existing catalog slug. Catalog currently has 303 products; Galley is #304.
Do NOT reuse idle intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / lit / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / standing / raised / seised / ordered / viewed / sealed / untainted / voiced / kindled / flushed, or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted.
Display here is **Young Serif**. Body is **Sora**. Mono is **Azeret Mono**.

Different surface: Stop dirty-tree full-turn bill on a mid-write tree vs `/model` snapshot-write vs nested-submodule worktree base vs tool-result attachment rider vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist vs scheduled WebSearch hang vs xnu ptmx race vs cloud pre-warm checkout vs MEMORY.md retract vs scraped-vellum palimpsest.

Different UI: composing stick / wet sheet / pull press / type bill / live forme. Young Serif / Sora / Azeret Mono. Ink-wet paper with lead-type soot, vermilion proof marks, brass stick. NOT parchment chancery. NOT granite survey. NOT parchment clerk desk. NOT stage black. NOT marble fasti. NOT mill-house. NOT Atlantic sailing. NOT oak timber.

Different verbs: Dry the sheets, Score galley, Walk the galley, Compare dry / billed, Pin idle dry, Pin seeded billed, Pin stop-dirty, Hold the dry.

Different idle: **dry**. Different #93745 seeded path: **billed**. HOLD: **dry** / **hold**. ALARM: **billed** / **galley** / **stop-dirty** / **wet-proof**. Path: **stop-dirty**.

## How to score

```bash
node --test projects/galley/galley.test.mjs
node projects/galley/galley.mjs projects/galley/data/billed.json
echo '{"seed":"billed"}' | node projects/galley/galley.mjs
```

Open the living card at `projects/galley/index.html` (or the live path `/galley/`). Buttons: Dry the sheets, Score galley, Walk the galley, Compare dry / billed, Pin idle dry, Pin seeded billed, Pin stop-dirty, Hold the dry. Toggle chips for: wet-proof, dirty-tree, stop-dirty, four-firings, cache-read, main-session-tax, background-exempt — the score flips. Lay a fixture JSON on the galley tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s stop-dirty walk from the published #93745 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/galley/
- Folder: `projects/galley/`
