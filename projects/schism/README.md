# Schism

An **ecclesiastical schism / twin-authority glass booth** — two facing pulpits or mirrored glass panels claiming the same nave; a live choir versus a resumed ghost twin writing the same score. Fonts **Bodoni Moda** (display) + **Plus Jakarta Sans** (body) + **IBM Plex Mono** (mono). Palette: void `#0B0A12`, glass `#E8E4F5`, ink `#1A1428`, schism-violet `#6B3FA0`, twin-cyan `#3D9EBF`, fracture `#C45C8A`, candle `#F2EDE4`. Twin glass panels / live agent chip / resumed local_agent chip / "Resuming agent" banner / shared task_id badge / workflow_progress-only (no own task_started) / dual-writer collision strip / four-lane duplicate count / conflicting-edit chips. NOT Rasure (parchment / CreationTime wipe), NOT Ashpan (industrial grate / orphan jsonl), NOT Outrider (cavalry / headersHelper race), NOT Necrology (parish death-register / incomplete listing), NOT Innominate/Snuffer/Changeling/Homograph/Galley/Eidolon/Followspot/Calends/Weir millimeter-slider or woodworking leftover. This is specifically the dual-writer resume of a still-running workflow agent: original still in-process; second copy from transcript.

The choir should stay **live** (HOLD: one in-process workflow agent; singular writer; addressable — the good path). Instead a SendMessage pong **schismed** the nave after a **resume-while-live**.

Primary:

- [anthropics/claude-code#93797](https://github.com/anthropics/claude-code/issues/93797) (OPEN, has repro). Title: `[BUG] SendMessage to a LIVE Workflow agent resumes a second copy from its transcript ("Resuming agent") while the original keeps running inside the workflow`. Labels: bug, has repro, platform:macos, area:agents. Environment: Claude Code 2.1.269 (macOS arm64), `--output-format stream-json --verbose`; also `-p` mode. Agents spawned by the Workflow tool (`agent()` in the script) are not addressable while they run. If that agent SendMessages main and main replies `SendMessage {to: that agent id}`, the tool result says `Resuming agent <id>` and a second independent copy starts from the persisted transcript (`system/task_started` `task_type=local_agent`, `task_id` = same agent id) while the original is still executing inside the workflow. Two writers then work the same task and the same files. Repro: workflow agent pings main with its id, then sleeps 60s; main SendMessages pong → second copy; original sleep gets stopped; duplicate completes separately. Observed agent id `a55b7012793deae02`, workflow `dup-probe`, label `slowpoke`. Note: the workflow agent never emitted its own `task_started`; only a `workflow_agent` entry in `task_progress.workflow_progress`. Resume logic consults the task registry, finds no live task for that id, takes the agent-stopped → resume-from-transcript branch. Impact: four parallel lane agents each got a duplicate writer; conflicting Kotlin/Rust/TS edits; duplicates kept editing after the phase finished. Expected: refuse/queue like `in_process` live subagents, OR register workflow agents as live tasks. Cousins cite-only (do not rebuild): #91353 (OPEN) — Duplicate background-agent execution on same target (Agent tool + SendMessage resume after stalled completion). Different mechanism: here the original has not stalled/completed; it is an in-process workflow agent and the resume path does not see it as live. Backups cite-only (next focus only — do not auto-pick): #93794 #93788 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782.

19:50 schism: an ecclesiastical schism / twin-authority glass booth for #93797. Idle **live** / seeded **schismed** / path **resume-while-live**. Score schism or admit live.

Score schism or admit live.

Idle word: **live** (HOLD: one in-process workflow agent; singular writer; addressable — the hold/good path). HOLD aliases: live, singular, in-process, addressable. Seeded word: **schismed** / #93797 (dual-writer resume). Path word: **resume-while-live**. Product score: **schism**. Never idle intact / rasured / rasure / creation-time-flip / swept / ashpanned / ashpan / orphan-jsonl / credentialed / outridden / outrider / early-connect / attested / necrologized / necrology / incomplete-listing / named / innominate / icon-only / lit / snuffed / snuffer / ganged-or / pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / stop-dirty / galley / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / eidolon or seeded rasured / ashpanned / outridden / necrologized / blank / snuffed / swapped / collided / billed / residual / ridden / dark / misfired / dammed / becalmed / raced.

Phrase: **Score schism or admit live.**

- **live** = IDLE: HOLD; one in-process workflow agent; singular writer; addressable
- **schismed** = #93797 seeded path: dual-writer resume while the original still runs
- **schism** = product score word for the twin-authority nave
- **resume-while-live** = path word: resume path does not see the in-process workflow agent as live
- **hold** = HOLD alias for idle live
- **dual-writer** = two writers work the same task and the same files
- **resuming-banner** = tool result says `Resuming agent a55b701`; `resumedAgentId=a55b7012793deae02`
- **local-agent-copy** = `system/task_started` `task_type=local_agent` `task_id=a55b7012793deae02` description=`slowpoke` — SECOND copy
- **workflow-progress-only** = no own `task_started`; only `workflow_agent` entry in `task_progress.workflow_progress`
- **four-lane-dup** = four parallel lane agents each got a duplicate writer
- **conflicting-edits** = conflicting Kotlin/Rust/TS edits; duplicates kept editing after the phase finished
- **has-repro** = published shape: workflow-progress-only; Resuming agent; local_agent copy
- **cousins** = cite-only #91353 — do not rebuild
- **backups** = cite-only #93794 #93788 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 — do not auto-pick
- **fixtures** = twin glass panels / live agent chip / resumed local_agent chip / Resuming agent banner / shared task_id badge / workflow_progress-only / dual-writer collision strip / four-lane duplicate count / conflicting-edit chips
- **walk** = published idle live → workflow-progress-only → resuming-banner → local-agent-copy → dual-writer → four-lane-dup → conflicting-edits → resume-while-live → schism

Verdicts: live, schismed, schism, resume-while-live, hold, dual-writer, resuming-banner, local-agent-copy, workflow-progress-only, four-lane-dup, conflicting-edits, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **schismed** / **schism** or already **live**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): resume path consults task registry only, misses in-process workflow agents that lack their own `task_started`, takes resume-from-transcript. Invite verify against #93797 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93797](https://github.com/anthropics/claude-code/issues/93797)
- Cite-only cousins: #91353 (Duplicate background-agent execution on same target — Agent tool + SendMessage resume after stalled completion). Different mechanism: here the original has not stalled or completed; it is an in-process workflow agent and the resume path does not see it as live.
- Backups (data only; next focus only — do not auto-pick): #93794, #93788, #93766, #93764, #93754, #93751, #93744, #93772, #93770, #93777, #93782

What happened (from the issue text — do not invent):

- OPEN, has repro
- Labels: bug / has repro / platform:macos / area:agents
- Environment: Claude Code 2.1.269 (macOS arm64), stream-json verbose; also `-p` mode
- Agents spawned by the Workflow tool (`agent()` in the script) are not addressable while they run
- If that agent SendMessages main and main replies `SendMessage {to: that agent id}`, the tool result says `Resuming agent <id>` and a second independent copy starts from the persisted transcript
- `system/task_started` `task_type=local_agent`, `task_id` = same agent id, while the original is still executing inside the workflow
- Two writers then work the same task and the same files
- Repro: workflow agent pings main with its id, then sleeps 60s; main SendMessages pong → second copy; original sleep gets stopped; duplicate completes separately
- Observed: `workflow_name=dup-probe`; `SendMessage {"to":"a55b7012793deae02","message":"pong"}`; `Resuming agent a55b701`; `task_id=a55b7012793deae02` description=`slowpoke`
- Workflow agent never emitted its own `task_started`; only `workflow_agent` entry in `task_progress.workflow_progress`
- Resume logic consults the task registry, finds no live task for that id, takes agent-stopped → resume-from-transcript
- Impact: four parallel lane agents each got a duplicate writer; conflicting Kotlin/Rust/TS edits; duplicates kept editing after the phase finished
- Expected: refuse/queue like `in_process` live subagents, OR register workflow agents as live tasks

Problem found: SENDMESSAGE TO A LIVE WORKFLOW AGENT RESUMES A SECOND COPY FROM TRANSCRIPT WHILE THE ORIGINAL KEEPS RUNNING (DUAL WRITERS ON THE SAME TASK AND FILES).

Why this solution: living catalog page + node diagnostic encoding idle **live** / seeded **schismed** / path **resume-while-live** so operators can score whether the booth is a **schism** or already **live**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. SendMessage to an agent currently running inside a Workflow is refused or queued like the `in_process` branch for ordinary live subagents
2. Or the workflow's agents are registered as live tasks so the existing already-waking / message-queued path applies

## Why not a clone

This is specifically: **THE DUAL-WRITER RESUME OF A STILL-RUNNING WORKFLOW AGENT — ORIGINAL IN-PROCESS; SECOND COPY FROM TRANSCRIPT.**

Novel paradigm: ecclesiastical schism / twin-authority glass booth — two facing pulpits claiming the same nave; a live choir versus a resumed ghost twin writing the same score.

**NOT Rasure/#93791** (`~/.claude` wipe + CreationTime flip). Different defect. NOT parchment rasure / wholesale recreate. Do not reuse intact / rasured / creation-time-flip.

**NOT Ashpan/#93780** (delete_session leftover jsonl). Different defect. NOT industrial grate / ashpan / foundry. Do not reuse swept / ashpanned / orphan-jsonl.

**NOT Outrider/#93776** (headersHelper timing race). Different defect. NOT cavalry outrider / dispatch-rider / sealed pouch. Do not reuse credentialed / outridden / early-connect.

**NOT Necrology/#93774** (incomplete `/models` listing asserted as death). Different defect. NOT parish necrology / death-register / incomplete listing. Do not reuse attested / necrologized / incomplete-listing.

**NOT Innominate/#93769** (Send/Stop empty accessible name). Different defect. NOT innominate nameplate / blank-escutcheon. Do not reuse named / icon-only.

**NOT Snuffer/#93746** (`enableArtifact: false` kills scratchpad). Different defect. NOT candle-snuffer / taper / ganged OR. Do not reuse lit / snuffed / ganged-or.

**NOT Changeling/#93757** (remote reconnect discards `/model`). Different defect. NOT fairy-court / cradle-swap. Do not reuse pledged / swapped / remote-reattach.

**NOT Homograph/#93743** (non-ASCII path slug collision). Different defect. NOT lexicographer / headword / lemma. Do not reuse distinct / collided / lossy-slug.

**NOT Galley/#93745** (Stop dirty-tree full-turn bill). Different defect. NOT printer’s tray / unbound sheets. Do not reuse dry / billed / stop-dirty.

**NOT Eidolon** (phantom attach). Different defect. NOT eidolon / phantom. Do not rebuild.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Do not reuse dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Reliquary / Cenotaph / Wraith / Afterimage / Midden / Oubliette**. Different defects. Do not rebuild.

**NOT Aphonia / Muzzle / Escutcheon / Lacuna / Annunciator / Tocsin / Scrim / Knock / Quench** (different metaphors). Different defects. Do not rebuild.

Do NOT rename Schism to any existing catalog slug. Catalog currently has 312 products; Schism is #313 after Rasure #312.
Do NOT reuse idle intact / rasured / swept / ashpanned / credentialed / outridden / attested / necrologized / named / innominate / lit / snuffed / pledged / swapped / distinct / collided / dry / billed / scraped / fresh / residual / plain / ridden / dark / due / flowing / underway / seated / tip / stale / eidolon.

Display here is **Bodoni Moda**. Body is **Plus Jakarta Sans**. Mono is **IBM Plex Mono**.

Different surface: dual-writer resume of a still-running workflow agent vs wholesale `~/.claude` recreate vs leftover spawned-child jsonl vs headersHelper timing race vs incomplete `/models` death-roll vs Send/Stop empty accessible name vs artifact/scratchpad ganged OR vs remote reconnect `/model` swap vs non-ASCII slug collision vs Stop dirty-tree full-turn bill vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist.

Different UI: twin glass panels / live agent chip / resumed local_agent chip / Resuming agent banner / shared task_id badge / workflow_progress-only / dual-writer collision strip / four-lane duplicate count / conflicting-edit chips. Bodoni Moda / Plus Jakarta Sans / IBM Plex Mono. Void / glass / ink / schism-violet / twin-cyan / fracture / candle. NOT parchment. NOT foundry grate. NOT cavalry navy/khaki. NOT parish register. NOT void/amber nameplate. NOT beeswax/snuffer brass. NOT moonlit moss. NOT dictionary cream. NOT printer-galley soot. NOT stage black. NOT marble fasti. NOT mill-house.

Different verbs: Admit live, Score schism, Walk resume-while-live, Compare live / schismed, Pin idle live, Pin seeded schismed, Pin resume-while-live, Hold the live.

Different idle: **live**. Different #93797 seeded path: **schismed**. HOLD: **live** / **hold**. ALARM: **schismed** / **schism** / **resume-while-live** / **dual-writer**. Path: **resume-while-live**.

## How to score

```bash
node --test projects/schism/schism.test.mjs
node projects/schism/schism.mjs projects/schism/data/schismed.json
echo '{"seed":"schismed"}' | node projects/schism/schism.mjs
```

Open the living card at `projects/schism/index.html` (or the live path `/schism/`). Buttons: Admit live, Score schism, Walk resume-while-live, Compare live / schismed, Pin idle live, Pin seeded schismed, Pin resume-while-live, Hold the live. Toggle chips for: resume-while-live, workflow-progress-only, resuming-banner, local-agent-copy, dual-writer, four-lane-dup — the score flips. Lay a fixture JSON on the glass blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s resume-while-live walk from the published #93797 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/schism/
- Folder: `projects/schism/`
