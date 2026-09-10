# Appanage

A **royal-grant / heraldic inheritance desk** — letters patent, cadency marks, wax cost-seal, lesser coronet versus the parent crown. Fonts **Playfair Display** (display) + **Source Sans 3** (body) + **IBM Plex Mono** (mono). Palette: plum field, gold leaf, seal vermilion, vellum, purpure — for a real Claude Code defect: **CODE-REVIEW SKILL FORKED CHILDREN INHERIT THE PARENT MODEL WITH NO ROUTING, NO COST GATE ON MODEL-INITIATED INVOCATION, USER POLICY CANNOT REACH THEM.**

Primary:

- [anthropics/claude-code#93307](https://github.com/anthropics/claude-code/issues/93307) (OPEN, bug, has repro, area:cost, area:agents, area:skills, platform:macos). Title: `code-review skill: forked children inherit the parent model with no routing, no cost gate on model-initiated invocation, user policy cannot reach them`. Claude Code 2.1.267. macOS (darwin 24.6.0). Filed by elaye-canopy 2026-09-10. The bundled `code-review` skill runs as a forked agent on the parent session's model and then dispatches finder and verifier agents through the `Agent` tool with no `model` set. Every child inherits the parent model. In a session whose model is `claude-fable-5-1`, one model-initiated `/code-review 223 high` produced 10 fable agents (the fork plus 9 children) and consumed about 1.5M cache-creation tokens and 13.7M cache-read tokens in 13 minutes before it was killed, with no report produced.

19:50 appanage: a royal-grant / heraldic inheritance-grant booth for #93307. Idle **routed** / seeded **inherited** / path **cascade**. Score appanage or admit routed.

Score appanage or admit routed.

Idle word: **routed** (HOLD: children carry an explicit cheaper model; cost gate shown; policy reaches children). Seeded word: **inherited** / #93307 (Agent calls omit model → parent tier cascade). Path word: **cascade**. Product score: **appanage**. Never idle afloat / washed / bridge-loss / pontoon / concordant / mismatched / header-mismatch / concordat / reaped / revenant / wedged / restored / expanded / laid / released / freehold / trunked / tokenized / locked / scratched / unmasked / replevin / cognate / lemures / escheat / mortmain / strowger / mondegreen / derby / vizard / held.

Phrase: **when a model-initiated code-review fork lets children inherit the parent fable tier with no model, no cost gate, and no policy reach, score appanage or admit routed.**

- **routed** = IDLE: HOLD; children carry an explicit cheaper model; cost gate shown; policy reaches children
- **inherited** = #93307 seeded path: Agent calls omit model; parent fable cascade; 10 agents; no report
- **appanage** = product score word for the royal grant the cadets inherited instead of receiving
- **cascade** = path word: cost/model inheritance from the parent crown to every cadet
- **hold** = HOLD alias for idle routed
- **model-absent** = 9 Agent tool calls, all `model` absent, all `subagent_type: general-purpose`
- **cost-gate-missing** = no consent or cost gate on model-initiated Skill invoke; Skill tool has no `model` param
- **self-invoke** = assistant invoked `code-review` after "do a review (no changes)"; user never typed `/code-review`
- **fork-policy-blind** = SessionStart orchestration policy present in the fork; skill prompt wins; no hook rejects unset `model`
- **finder-on-fable** = 8 independent finder angles ran on `claude-fable-5-1`
- **verifier-on-fable** = one verifier via the Agent tool also inherited fable
- **has-repro** = Claude Code 2.1.267 macOS · elaye-canopy
- **cousins** = cite-only #73323 #88003 #90902 — do not rebuild
- **backups** = cite-only #93279 #93270 #93269 #93265 #93280 #93257; Vernier/#93219 leftover — do not auto-pick
- **fixtures** = row list for the appanage booth
- **walk** = published idle routed → parent-fable → self-invoke → cost-gate-missing → fork-on-parent → model-absent → finder-on-fable → verifier-on-fable → fork-policy-blind → inherited → cascade

Verdicts: routed, inherited, appanage, cascade, hold, model-absent, cost-gate-missing, self-invoke, fork-policy-blind, finder-on-fable, verifier-on-fable, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring grant desk. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the grant is **inherited** / **appanage** or already **routed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): unset `model` on Agent calls defaults to the parent tier; the Skill tool has no model param; a fork inherits the conversation but the skill prompt wins over policy. Invite verify against #93307 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93307](https://github.com/anthropics/claude-code/issues/93307)
- Cite-only cousin: [anthropics/claude-code#73323](https://github.com/anthropics/claude-code/issues/73323) (model selector for code-review; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#88003](https://github.com/anthropics/claude-code/issues/88003) (usage limits exhausted in 10 minutes; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#90902](https://github.com/anthropics/claude-code/issues/90902) (fork chain token consumption; do not rebuild)
- Backup (data only): #93279 HTTP MCP ~25s stall
- Backup (data only): #93270 Workflow kill leaks agents blocking archive
- Backup (data only): #93269 archive_session live-work names four causes
- Backup (data only): #93265 ShipIt non-ASCII env double-encode
- Backup (data only): #93280 dame-moji registry
- Backup (data only): #93257 agents auto-update relaunch drops flags
- Backup (data only): #93219 Vernier millimeter-slider leftover — do not ship

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:cost, area:agents, area:skills
- Claude Code 2.1.267
- macOS (darwin 24.6.0)
- `~/.claude/settings.json`: `"model": "claude-fable-5-1[1m]"`, `"effortLevel": "high"`, `"permissions.defaultMode": "auto"`
- Skill invoked with args `223 high`
- User asked, in plain words, for a review; did not type `/code-review`
- Assistant invoked the skill as a fork ("forked execution, running in the background")
- 9 Agent tool calls, all `subagent_type: "general-purpose"`, all with `model` absent
- 8 finder angles + 1 verifier ran on the parent fable tier
- Fork + 9 children = 10 fable agents
- Cache-creation 1,533,907; cache-read 13,651,479; output 11,939
- Window 08:14 to 08:31 UTC; stopped by hand; no report
- Same review done by 3 hand-routed agents (opus, opus, sonnet) finished and reported
- SessionStart policy "never leave `model=` default; never run subagents on fable" was present; skill prompt won
- `SubagentStart` fired for the fork; no hook point lets a user reject an Agent call whose `model` is unset
- Docs put the average cost at $15-25 per review; nothing at invocation time surfaces that
- The `Skill` tool has no `model` parameter

Problem found: WHEN A MODEL-INITIATED CODE-REVIEW FORK LETS CHILDREN INHERIT THE PARENT FABLE TIER WITH NO MODEL, NO COST GATE, AND NO POLICY REACH.

Why this solution: a diagnostic royal-grant / heraldic inheritance desk for the routed → inherited drift, so a reader can pin idle routed, load the #93307 inherited path, and score cascade against the published facts. Conceptual letters patent, child appanage, and cost seal show whether the cadets received their own modest grant. No live Claude session is required.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Finder and verifier agents spawned by bundled skills should carry an explicit `model`, defaulting to a lower tier
2. A model-initiated invocation of a skill that forks and fans out should require confirmation, or print the documented cost band
3. A hook point should let a user block unset-`model` Agent dispatch inside forks
4. The per-skill disable switch should be documented

## Why not a clone

This is specifically: **CODE-REVIEW SKILL FORK DISPATCHES FINDER/VERIFIER WITH NO MODEL; CHILDREN INHERIT PARENT FABLE; NO COST GATE ON SELF-INVOKE; SESSIONSTART POLICY CANNOT REACH CHILDREN.**

**NOT Pontoon/#93288** (Desktop restart washes every Remote Control bridge). Different defect.

**NOT Concordat/#93290** (MCP header 2025-11-25 vs `_meta` 2026-07-28 after SEP-2575 discover). Different defect.

**NOT Revenant/#93274** (Windows WMI peer-liveness timeout-kill orphans). Different defect.

**NOT Replevin/#93207** (iOS ExitPlanMode setMode auto + default fallback). Different defect.

**NOT Cognate/#93250** (plugin MCP `${PLUGIN_ROOT}` left unexpanded). Different defect.

**NOT Lemures/#93256** (mid-turn task-summary classifier keeps previous `latestAsk` across `/clear`). Different defect.

**NOT Escheat/#93231** (VS Code window-close leaves git worktree `locked` naming a dead PID). Different defect.

**NOT Mortmain/#93173** (sandbox `denyWithinAllow` freezes tracked `.claude` paths). Different defect.

**NOT Strowger/#93218** (Desktop `--disallowedTools SendMessage` while ListAgents still lists). Different paradigm.

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Buoy** (macOS main window left at floating layer after Computer Use side panel). Different defect.

**NOT Scion.** Name taken. Different product.

**NOT #73323 itself** (model selector for code-review) — cite only; primary is the inherit-by-default cascade on model-initiated invoke.

**NOT Vernier/#93219** (millimeter-slider leftover — forbidden as primary).

**NOT Derby/#93197.** **NOT Vizard/#93190.** **NOT Flashpan/#93015.** **NOT Clepsydra.** **NOT Dead Air.** **NOT Scuttle.** **NOT Stopcock.** **NOT Parergon.** **NOT Stereotype.** **NOT Guillotine.** **NOT Ephemera.** **NOT Oubliette.** **NOT Commutator.** **NOT Heddle.**

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **bundled skill fork fans out Agent children with no model, so they inherit the parent crown; model-initiated invoke has no cost seal; user policy cannot reach the cadets** — unused in catalog as this royal-grant / heraldic inheritance desk walk.

Do NOT rename this product Pontoon, Concordat, Revenant, Replevin, Cognate, Lemures, Escheat, Mortmain, Strowger, Mondegreen, Derby, Vizard, Dead Air, Scuttle, Stopcock, Parergon, Stereotype, Flashpan, Guillotine, Ephemera, Oubliette, Commutator, Heddle, Scion, or any existing catalog slug.
Do NOT reuse idle routed / inherited / cascade on a later booth.
Do NOT reuse Petrona + Figtree + Azeret Mono (Pontoon). Do NOT reuse Vollkorn + DM Sans + Inconsolata (Concordat). Do NOT reuse Young Serif + Mulish + DM Mono (Revenant). Do NOT reuse Literata + Sora + Roboto Mono (Replevin). Do NOT reuse Fraunces + Source Sans 3 + IBM Plex Mono as a trio (Cognate uses Fraunces). Display here is **Playfair Display**. Body is **Source Sans 3**. Mono is **IBM Plex Mono**. Do NOT reuse Karla.

Different surface: model-inherit cascade on a bundled skill fork vs Desktop RC wash / MCP header↔`_meta` discord / WMI timeout-kill orphans / iOS setMode auto / unexpanded PLUGIN_ROOT / remanent classifier / worktree lock leftover / sandbox freeze.

Product name stays **Appanage**. Name/slug `appanage` unused in catalog.json (268 products before this ship; Pontoon is #268).

Different UI: royal-grant / heraldic inheritance desk / letters patent / cadency marks / wax cost-seal / lesser coronet versus parent crown. Playfair Display / Source Sans 3 / IBM Plex Mono. NOT harbor pontoon / floating-bridge pier (Pontoon). NOT diplomatic chancery / treaty desk / parchment / seal-wax (Concordat). NOT Victorian séance parlor / process-tomb (Revenant). NOT legal replevin chamber / writ desk (Replevin). NOT comparative philology / manuscript cognate desk (Cognate). NOT Roman Lemuria night courtyard (Lemures). NOT feudal escheat chamber (Escheat). NOT muniment room (Mortmain). NOT millimeter-slider.

Different verbs: Open the grant, Score appanage, Walk the grant, Inspect the cadency, Pin idle routed, Pin seeded inherited, Pin cascade, Reset the desk.

Different idle: **routed**. Different #93307 seeded path: **inherited**. HOLD: **routed** / **hold**. ALARM: **inherited** / **appanage** / **cascade** / **model-absent** / **cost-gate-missing**. Path: **cascade**.

## How to score

```bash
node --test projects/appanage/appanage.test.mjs
node projects/appanage/appanage.mjs projects/appanage/data/appanage.json
echo '{"seed":"inherited"}' | node projects/appanage/appanage.mjs
```

Open the living card at `projects/appanage/index.html` (or the live path `/appanage/`). Buttons: Open the grant, Score appanage, Walk the grant, Inspect the cadency, Pin idle routed, Pin seeded inherited, Pin cascade, Reset the desk. Toggle parent fable / self-invoke / cost-gate / model-absent / finder-on-fable / verifier-on-fable / fork-policy-blind — the score flips. Lay a fixture JSON on the desk. `?embed=1` hides chrome.

The booth reconstructs the reporter’s model-initiated fork / model-absent Agent / fable-cascade walk from the published #93307 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/appanage/
- Folder: `projects/appanage/`
