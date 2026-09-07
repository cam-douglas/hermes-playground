# Larum

A **limestone watchtower / larum-bell / wake chronograph** — dusk ashlar, bronze larum, moonwash ledger, merlon clock; Fraunces + Figtree + JetBrains Mono — for a real Claude Code defect: **A COMPLETED BACKGROUND-TASK `<task-notification>` IS ENQUEUED, DEQUEUED, AND APPENDED TO THE SESSION AS A USER-ROLE MESSAGE — THEN NO ASSISTANT TURN EVER STARTS.** The notice is in history. The missing piece is the model invocation / turn schedule. When an assistant turn starts after that append (**roused**), that is the hold path.

Primary:

- [anthropics/claude-code#92563](https://github.com/anthropics/claude-code/issues/92563) (OPEN, bug, has repro, area:core, area:agents, platform:wsl). Title: `Completed background-task notification is appended to the session but never triggers an assistant turn; session idles until user input`. Updated 2026-09-06T23:06:39Z. Reporter: sergey-gusev94. Claude Code 2.1.250–2.1.259. WSL2. `permissionMode: bypassPermissions`. Model: claude-fable-5.

11:50 larum: a watchtower larum that should start an assistant turn the moment a completed background `<task-notification>` is written into the session but instead leaves the notice unanswered in history until a human nudge — ~1% drops, worst on the last of a parallel batch (#92563). Score unanswered or admit roused.

Idle word: **unanswered** (notice written into history; no assistant turn; session idles until a human nudge). Seeded state: **roused** / #92563 — assistant turn starts after the persisted notice. Never idle as slipped, sighted, riven, argbound, accruing, cleared, sheared, fayed, overladen, trimmed, defocused, sharp, skimmed, intact, mislabeled, scoped, saturating, or vented.

**Larum** = the watchtower alarm that should ring the moment a completed background notice is written into the ledger. Claude Code enqueues, dequeues, and appends the `<task-notification>` as a user-role message (`origin.kind: task-notification`, `<status>completed</status>`) — then no assistant turn ever starts. The result is already in context. The bell stays unanswered until a human nudge.

- **unanswered** = IDLE: notice fully written; zero assistant entries; session idles with no error
- **roused** = seeded word: assistant turn starts after the notice (~99% path)
- **last-of-batch** = last pending notice of a parallel batch; nothing else left to wake the session
- **delivered-and-roused** = ~575 of ~580 notifications answered within seconds to two minutes
- **synthetic-repair** = harness pair after nudge: isMeta user `Continue from where you left off.` + synthetic assistant `No response requested.` (`model:"<synthetic>"`) whose `parentUuid` references the stalled notice
- **cousins** = cite-only #21165 #39632 #75043 #23909 #67524 #88742 #90555 #45581 #20754

Verdicts: unanswered, roused, last-of-batch, delivered-and-roused, synthetic-repair, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a completed task-notification would leave the watch **unanswered** or already **roused**. Fixtures use the issue's fingerprint, representative timeline, drop rate, and environment only.

Hypothesis only (NON-BINDING): after the harness writes the completed task-notification into conversation history, the turn scheduler sometimes fails to start an assistant pass — worst on the last notification of a parallel batch, because a later sibling would otherwise mask the miss. Verify nothing in closed source — encode issue facts only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92563](https://github.com/anthropics/claude-code/issues/92563)
- Cousins cite-only (NOT primary): [anthropics/claude-code#21165](https://github.com/anthropics/claude-code/issues/21165), [#39632](https://github.com/anthropics/claude-code/issues/39632), [#75043](https://github.com/anthropics/claude-code/issues/75043), [#23909](https://github.com/anthropics/claude-code/issues/23909), [#67524](https://github.com/anthropics/claude-code/issues/67524), also related [#88742](https://github.com/anthropics/claude-code/issues/88742), [#90555](https://github.com/anthropics/claude-code/issues/90555), [#45581](https://github.com/anthropics/claude-code/issues/45581), [#20754](https://github.com/anthropics/claude-code/issues/20754)

What happened (from the issue — do not invent):

- Interactive session using background subagents (`Agent` tool with `run_in_background`) and background Bash tasks.
- The `<task-notification>` for a completed task is sometimes enqueued, dequeued, and appended to the conversation as a user-role message — and then **no assistant turn ever starts**.
- Session sits idle indefinitely with no error recorded. Any later user message (e.g. "continue") resumes immediately and correctly, using the notification content already in context.
- Frequency: **7 dropped wakes out of ~580 delivered task-notifications (~1%)**, spread over 5 sessions, 4 projects, and 4 CLI versions. Not a single-version regression.
- Disproportionately the **last pending notification of a parallel batch** (slowest of three parallel agents). A drop on a non-final notice is masked when the next completion wakes the session; the final one leaves nothing else to trigger a turn. Six of seven incidents were dropped agent completions; one was a dropped background-Bash completion.
- Representative timeline: assistant ends waiting → T+8s enqueue/dequeue → user entry with full task-notification → NOTHING (no assistant, no API error) → minutes later (T+3m36s in the typed incident; other stalls ~4–85 minutes) a user nudge resumes correctly.
- Grep-able fingerprint:
  1. `type:"user"` with `origin.kind:"task-notification"` and `<status>completed</status>`
  2. zero assistant entries between it and the next real user message
  3. at next message, harness repair pair: isMeta user `"Continue from where you left off."` + synthetic assistant `"No response requested."` (`model:"<synthetic>"`) whose `parentUuid` references the stalled notification
- Ruled out from transcripts: model behavior, permissions (`bypassPermissions`), API errors, payload size (stalled 0.4–12 kB vs 36–56 kB that processed), compaction, agent failure, host suspend.
- Environment: Claude Code 2.1.250–2.1.259; interactive terminal; transcripts record entrypoint `sdk-ts`; WSL2; model claude-fable-5.
- Impact: long multi-agent orchestrations silently stop mid-run. Recovery is trivial when a human is watching; unattended runs lose remaining wall-clock — one stall cost 85 minutes.

Problem found: completed task-notification fully persisted into conversation history; the missing piece is specifically the model invocation / turn schedule after that append.

Why this solution: a diagnostic scorer for the unanswered → roused larum chain, so a reader can admit idle unanswered, pin seeded roused, and score last-of-batch / delivered-and-roused / synthetic-repair / cousins against the published facts.

## Why not a clone

This is specifically: **completed background `<task-notification>` written into session history; no assistant turn starts; session idles until a human nudge.**

**NOT Oubliette/#92095** — Oubliette voids/forgets child notices against a cold parent (queue never lands until an unrelated wake). Larum: the notice IS fully written into conversation history; the missing piece is specifically the model invocation / turn schedule after that append.

**NOT Tocsin / Alarum / Knell / Hangfire / Heliostat / Nixie** — those are different wake/queue/delivery paradigms. Cite only as cousins. Alarum in particular is the opposite polarity: a post-goodbye kill notification wakes an ended session. Hangfire demotes a queued `/compact`. Heliostat waits on DECSET 2031. Nixie reports queued then settles undelivered.

**NOT #88742** — related, different: enqueue succeeds but the wake effect is missed; the item may sit undelivered. Larum's notice is already in the ledger.

Stay OFF all prior catalog slugs/paradigms.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle slipped / sighted / riven / argbound / accruing / cleared / sheared / fayed / overladen / trimmed / defocused / sharp / skimmed / intact / mislabeled / scoped / saturating / vented.

Different surface: written-notice-with-no-turn vs cold-parent forgotten queue / unwanted post-goodbye wake / queued-compact demotion / terminal wake-bell.

Product name stays **Larum**. Name/slug `larum` confirmed unused in catalog.json (194 products).

Different UI: limestone ashlar watchtower / bronze larum bell / moonwash ledger / merlon chronograph / dusk violet sky / circular wake clock. Fraunces / Figtree / JetBrains Mono. NOT Alegreya/Source Sans 3/Fira Code. NOT Libre Baskerville/DM Sans/Space Mono. NOT Newsreader/Public Sans/IBM Plex Mono. NOT Cormorant/Outfit/Roboto Mono. NOT Eczar/Schibsted/Martian Mono. NOT Outfit/IBM Plex (Alarum). NOT Source Sans 3 (Tocsin/Hangfire).

Different verbs: admit unanswered, pin seeded roused, score unanswered vs roused, load #92563 fixture, score the larum.

Different idle: **unanswered**. Different seeded: **roused**. HOLD: **roused** / **delivered-and-roused**. ALARM: **unanswered** / **last-of-batch** / **synthetic-repair** / **cousins**.
