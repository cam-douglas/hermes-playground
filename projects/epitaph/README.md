# Epitaph

A **stonecutter / memorial masonry bench** — dark slate, pale limestone lettering, chisel marks, epitaph tablet UI; fonts **Old Standard TT** (display) + **Work Sans** (body) + **Ubuntu Mono** (mono) — for a real Claude Code defect: **WHEN A SUBAGENT STARTS A BACKGROUND BASH (`run_in_background: true`) AND ENDS ITS TURN TO WAIT, THE PARENT IMMEDIATELY RECEIVES A `<task-notification>` WITH `status=completed` AND A SUMMARY SAYING THE AGENT "FINISHED". THE AGENT HAS NOT FINISHED — IT IS RE-INVOKED WHEN THE BACKGROUND TASK COMPLETES.**

Primary:

- [anthropics/claude-code#92952](https://github.com/anthropics/claude-code/issues/92952) (OPEN, bug, has repro, area:agents). Title: `[BUG] Agent task notification reports status=completed for an agent still waiting on its own background task`. Claude Code 2.1.260; Windows 11; desktop app, no terminal; Bash tool resolving to Git Bash; Anthropic API; model Opus. Filed 2026-09-08T23:55:59Z by ivo-doko.

09:50 epitaph: a stonecutter memorial bench that should keep a waiting agent **parked** — status not completed, live-children count can be non-zero, parking utterance not framed as a result; instead the first `<task-notification>` **epitaphed** FINISHED on a living agent — score epitaphed or admit parked.

Score epitaphed or admit parked.

Idle word: **parked** (HOLD: a parked agent is distinguishable from a finished one). #92952 path: **epitaphed**. Seeded late-true-complete: **inscribed**. Never idle collated / stereotyped / emended / confirmed / miraged / loosed / banked / intact / enrolled / as-penned / rove / vaulted / cleared / fouled / voided / rewritten.

**Epitaph** = the inscription a stonecutter carves on a memorial tablet. The system carves FINISHED on a living (parked) agent.

- **parked** = IDLE: HOLD; honest parked / waiting / idle while a background child is live
- **epitaphed** = #92952 path: `status=completed` + "finished" while parked with a live child
- **inscribed** = second notification after the real finish; usage 104094 / 16
- **live-child** = background Bash still running (`sleep 150` / incident 109s)
- **false-finished** = `status=completed` and the summary word "finished"
- **parking-result** = `<result>` holds "I'll stop polling now and wait…"
- **note-contradicts** = note claims no live background children — one was live
- **usage-rise** = 99124→104094 tokens / 12→16 tool uses
- **task-stop** = parent TaskStops a live agent ~2s after it had reported success
- **contending-rebuild** = two writers in one working tree; one running `clean`
- **status-check** = TaskOutput `block=false` headed DEPRECATED
- **filler-calls** = seven filler calls over 35 seconds before parking
- **cousins** = cite-only #88001 #91503 #76594 #92095 — do not clone
- **before-after** = before epitaphed completed+live; after expected parked
- **fixtures** = row list for the memorial bench

Verdicts: parked, epitaphed, inscribed, live-child, false-finished, parking-result, note-contradicts, usage-rise, task-stop, contending-rebuild, status-check, filler-calls, cousins, before-after, fixtures.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No Desktop automation. No payloads. No secrets. No network to Anthropic. Score whether a task-notification is **epitaphed** or already **parked**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the "no live background children" check does not account the agent's own background Bash child toward the agent, so parking looks like completion. The issue marks this inferred, not established. Invite verify against #92952 text only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92952](https://github.com/anthropics/claude-code/issues/92952)
- Cite-only: [anthropics/claude-code#88001](https://github.com/anthropics/claude-code/issues/88001)
- Cite-only: [anthropics/claude-code#91503](https://github.com/anthropics/claude-code/issues/91503)
- Cite-only: [anthropics/claude-code#76594](https://github.com/anthropics/claude-code/issues/76594)
- Cite-only: [anthropics/claude-code#92095](https://github.com/anthropics/claude-code/issues/92095) — Oubliette already shipped

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, area:agents
- Claude Code 2.1.260; Windows 11; desktop app, no terminal; Git Bash; Anthropic API; Opus
- Subagent starts Bash with `run_in_background: true` and ends its turn to wait
- Parent immediately receives `<task-notification>` with `status=completed` and summary "finished"
- Agent has not finished; re-invoked when the background task completes — measured 109s then 46s, both unprompted
- Three false signals: (1) `status=completed` + "finished"; (2) note claims notification fires when the agent stops with no live background children — one was live; (3) `<result>` holds the parking utterance
- Usage counters rise 99124→104094 tokens / 12→16 tool uses between successive "completed" notifications
- Envelope: tokens 99124, tool uses 12, duration_ms 357035; result "I'll stop polling now and wait for the background build's completion notification before proceeding."
- Consequence: parent TaskStops a live agent ~2s after it had reported success; starts a duplicate build in the same working tree (two writers, one `clean`)
- Repro: spawn agent "Run `sleep 150` as a background Bash task then stop; report once it finishes" → parent gets completed within seconds while sleep still runs → later second completed with higher usage
- Seven filler calls over 35 seconds before parking
- TaskOutput(`block=false`, `timeout=30000`) is the only status check; headed DEPRECATED
- Distinct from wake-lost cousins #88001 #91503 #76594 and Oubliette/#92095 — this is a FALSE COMPLETED while parked with live children

Problem found: A MEMORIAL BENCH THAT SHOULD KEEP A WAITING AGENT PARKED INSTEAD EPITAPHS FINISHED ON A LIVING CHILD.

Why this solution: a diagnostic masonry bench for the parked → epitaphed drift, so a reader can pin idle parked, load the #92952 epitaphed path, and score inscribed / live-child / false-finished / parking-result / note-contradicts / usage-rise / task-stop / contending-rebuild / status-check / filler-calls / cousins / before-after against the published facts.

## Why not a clone

This is specifically: **A TASK-NOTIFICATION ASSERTS `status=completed` WHILE THE AGENT IS PARKED WITH A LIVE BACKGROUND CHILD.**

**NOT Oubliette/#92095** (void against a cold parent). Cite only. Do not touch Oubliette.

**NOT Mirage/#92920** (scheduler false lastRunAt). Cite only. Do not touch Mirage.

**NOT Remora/#92934** (hook child cling). Cite only. Do not touch Remora.

**NOT Recension/#92949** (last-prompt MEMORY witness). Cite only. Do not touch Recension.

**NOT Ephemera / Hangfire / Deadletter / Ukase / Mailslot / Scabbard.**

**NOT Cenotaph** (vacant monument after away/return re-assembly — different older product; do not touch).

Stay off Homestead/#92932, Quill/#92788, Colophon/#92918, Sallyport/#92901 (security — do not pick).

Cousins cite-only #88001 #91503 #76594 #92095 — wake-lost neighbours. Do not clone those products.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. NOT a Desktop automation.

Different paradigm: **the first task-notification carves FINISHED on a parked agent whose own background Bash child is still live.**

Do NOT rename this product Cenotaph, Oubliette, Recension, Mirage, Remora, or any existing catalog slug.
Do NOT reuse idle collated / stereotyped / emended / confirmed / miraged / loosed / banked / intact / enrolled / as-penned / rove / vaulted / cleared / fouled / voided / rewritten.

Different surface: false completed-while-parked vs cold-parent void / renderer-ack oasis / PostToolUse child-hold / last-prompt MEMORY witness / vacant advisor pair.

Product name stays **Epitaph**. Name/slug `epitaph` unused in catalog.json (235 products before this ship; Recension is #235). Cenotaph exists and is a different older product.

Different UI: stonecutter / memorial masonry bench / dark slate / pale limestone / chisel marks / epitaph tablet. Old Standard TT / Work Sans / Ubuntu Mono. NOT Literata + Public Sans + JetBrains Mono (Recension oak). NOT Newsreader + Lexend + Fragment Mono (Mirage desert). NOT Ibarra Real Nova + Red Hat Text + Red Hat Mono (Remora hull). NOT Cinzel + Fraunces + IBM Plex Mono (Cenotaph vacant monument).

Different verbs: Score epitaphed, Admit parked, Inscribe the late complete, Load #92952, Reset to parked.

Different idle: **parked**. Different #92952 path: **epitaphed**. HOLD: **parked**. ALARM: **epitaphed** / **inscribed** / **live-child** / **false-finished** / **parking-result** / **note-contradicts** / **usage-rise** / **task-stop** / **contending-rebuild** / **status-check** / **filler-calls** / **cousins** / **before-after** / **fixtures**. Seeded late-true-complete: **inscribed**.

## How to score

```bash
node --test projects/epitaph/epitaph.test.mjs
node projects/epitaph/epitaph.mjs projects/epitaph/data/92952.json
node projects/epitaph/epitaph.mjs projects/epitaph/data/parked.json
echo '{"seed":"epitaphed"}' | node projects/epitaph/epitaph.mjs
```

Open the living card at `projects/epitaph/index.html` (or the live path `/epitaph/`). Buttons: Score epitaphed, Admit parked, Inscribe the late complete, Load #92952, Load fixtures, Reset to parked. Toggle completed-while-live vs honest parked — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/epitaph/
- Folder: `projects/epitaph/`
