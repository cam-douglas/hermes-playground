# Oubliette

A **stone-pit / trapdoor dungeon desk** — iron hatch (parent process), queue pit (child-completion notice), depth gauge (unbounded delay), cold moonlight lantern / voided rust lantern, child-completion slips stamped 1m44s / 12m06s / 48m34s / 11h35m, drain-on-wake strip; charcoal stone / rust iron / cold blue-grey moonlight — Eczar + Schibsted Grotesk + Martian Mono — for a real Claude Code defect: **COWORK DISPATCH CHILD-COMPLETION NOTIFICATIONS QUEUE AGAINST AN IDLE PARENT AND ONLY DRAIN ON THE PARENT'S NEXT UNRELATED TURN; AREA:COWORK; PLATFORM:WINDOWS.**

Primary:

- [anthropics/claude-code#92095](https://github.com/anthropics/claude-code/issues/92095) (OPEN, bug, has repro, platform:windows, area:cowork, filed 2026-09-04T14:08:24Z, updated 2026-09-04T14:09:40Z). Title: `[BUG] Cowork Dispatch: child-completion notifications queue against an idle parent and only drain on the parent's next unrelated turn`. Reporter AllyOmega. Claude Desktop (Cowork / Code tab) 1.44121.4.0, MSIX. CCD 2.1.258. Windows 11 (10.0.26200) x64.

a oubliette that drops a finished child's notice into the pit under a cold parent is not a push — it is a queue already forgotten. Score the trapdoor or admit the queue already drained.

Idle word: **cold**. Seeded state: **voided** / #92095 — a Dispatch child finishes, the completion is queued against a cold parent, and nothing wakes that parent; the notice sits until the next unrelated user turn. Never idle as banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / crossed / homed / slipped / fouled / mangled / verbatim / unbolted / snagged.

**Oubliette** is a dungeon pit reached only by a trapdoor — a place where a thing is dropped and forgotten. The Dispatch child's completion is that notice: when the parent is cold, the hatch opens onto an empty shaft and the queue is already forgotten (**voided**) instead of draining on a **cold** (warm-listening) desk.

- **voided** = #92095: cold parent + queued child completion; the notice sits until the next unrelated wake
- **queued** = `12:07:59 [Dispatch] Queued notification for cold parent`; result, queue, and child `running → idle` land in the same second
- **trapdoor** = parent is not listening while idle; every wake relaunches `Starting local session local_ditto_<PARENT> in /home/<generated-name>`
- **drain-on-wake** = the queue drains only on the parent's `idle → initializing`
- **nine-of-nine** = every completion in the log hit the cold path, 9 out of 9; the warm path never ran
- **unbounded** = same parent delays 1m44s, 12m06s, 48m34s, 11h35m; last finished 21:00, relayed 08:35
- **no-os-notify** = no OS notification on child completion; `ccd_session_mgmt__send_message` cannot reach unattended or remote-dispatched sessions
- **hold** = warm parent drained the notice on the same turn; the trapdoor stayed shut
- **cold** = HOLD: warm parent drained; the pit stayed empty; idle word cold

Verdicts: cold, voided, queued, trapdoor, drain-on-wake, nine-of-nine, unbounded, no-os-notify, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the trapdoor held or already dropped the notice into the pit. Fixtures use the log lines and delay stamps from the issue.

Hypothesis only (NON-BINDING): a Dispatch child completion is queued against the parent orchestrator; when the parent is idle there is no process alive to receive a push (every wake relaunches the session), so the notice sits until the next unrelated user turn. The child cannot `ccd_session_mgmt__send_message` into unattended or remote-dispatched sessions. Discard if issue evidence disagrees. Encoded from the issue's log excerpts, delay stamps, 9/9 cold path, and version history. Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **COLD-PARENT DISPATCH CHILD-COMPLETION QUEUE UNDER AN IDLE COWORK ORCHESTRATOR — area:cowork.**

NOT Ephemera ([#92090](https://github.com/anthropics/claude-code/issues/92090)) — Fable 5.1 five-minute subagent cache wick rewrite.
NOT Commutator ([#91958](https://github.com/anthropics/claude-code/issues/91958)) — streamable-http concurrent batch JSON-RPC id mis-correlation.
NOT Hectograph ([#92056](https://github.com/anthropics/claude-code/issues/92056)) — OTEL `tool_input` / `tool_parameters` scrub-flag leak.
NOT Placet ([#92040](https://github.com/anthropics/claude-code/issues/92040)) — ExitPlanMode Accept vs Accept-and-implement consent-scope mismatch.
NOT Frisket ([#91574](https://github.com/anthropics/claude-code/issues/91574)) — PreToolUse deny unenforced on Write-family.
NOT Hawser ([#91578](https://github.com/anthropics/claude-code/issues/91578)) — Windows desktop idle warm sessions never release MCP child processes.
NOT Tocsin / Annunciator — fire-bell / false-alarm notification products. This is a queue that never pushes.
NOT Fusee — scheduled-task early dispatch. This is not a cron fusee.

Different surface: diagnostic scoring of cold-parent Dispatch child-completion queue. Completely different UI (iron hatch + queue pit + depth gauge + moonlight lantern + delay slips), backend (dispatch-shaped JSON of queued / drained / cold-path rows), and UX.

Cousins are cite-only on a cousin strip; primary stays #92095.

- [#39335](https://github.com/anthropics/claude-code/issues/39335) — CLOSED / LOCKED — Background subagent completion notifications are delayed until user interaction. Same class. Cite-only.
- [#54214](https://github.com/anthropics/claude-code/issues/54214) — CLOSED — Cowork Dispatch should proactively notify user when child tasks complete. Closed as a duplicate of #53605. Cite-only.
- [#53605](https://github.com/anthropics/claude-code/issues/53605) — CLOSED — Dispatch doesn't know when tasks complete. Closed as a duplicate of #39335. Cite-only.
- [#20754](https://github.com/anthropics/claude-code/issues/20754) — OPEN — notifications lost when agents finish simultaneously. Different class. Cite-only.
- [#79268](https://github.com/anthropics/claude-code/issues/79268) — OPEN — configurable idle timeout. Different class. Cite-only.

Backups (document only, do not build): [#92079](https://github.com/anthropics/claude-code/issues/92079) (Detent — one-time scheduled task re-fires), [#92112](https://github.com/anthropics/claude-code/issues/92112) (Holdfast — worktree cwd guard blocks Bash), [#92059](https://github.com/anthropics/claude-code/issues/92059) (Wastegate — Windows memory-pressure governor evicts `0 of 0`).

Product name stays **Oubliette**. Do not rename to Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle or any existing catalog slug.

Different UI: stone-pit trapdoor dungeon desk + iron hatch + queue pit + depth gauge + cold/voided lantern + delay slips + drain-on-wake strip / charcoal stone / rust iron / cold moonlight. Eczar + Schibsted Grotesk + Martian Mono. NOT Newsreader / Figtree / Source Code Pro (Ephemera). NOT Fraunces / Outfit / Fira Code (Hectograph). Stay OFF cream wick atelier / rotary copper drum / gelatin hectograph / congregation chamber / print-shop frisket / dockyard hawser.

Different verbs: Score the trapdoor, pin idle cold, pin seeded voided, admit the queue already drained, load fixtures, reset to cold. Score the trapdoor is this desk's phrase.

Different idle: **cold**.

## Live catalog path

`/oubliette/` is this static stone-pit / trapdoor dungeon desk. Path `https://hermes-playground-green.vercel.app/oubliette/` and subdomain `https://oubliette.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `00:50 / hermes catalog #138 / #92095`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **cold** — warm parent drained the notice on the same turn; the trapdoor stayed shut; the pit is empty.
2. Seed **voided** → #92095: cold parent; `Queued notification for cold parent`; drain waits on `idle → initializing`; 9/9 cold path; delays 1m44s, 12m06s, 48m34s, 11h35m.
3. Dungeon UI: iron hatch / queue pit / depth gauge / moonlight lantern / delay slips / drain-on-wake strip. Cold = the trapdoor stayed shut. Voided = the notice already fell in.
4. Cousin cite strip labeled cousin-not-primary: [#39335](https://github.com/anthropics/claude-code/issues/39335), [#54214](https://github.com/anthropics/claude-code/issues/54214), [#53605](https://github.com/anthropics/claude-code/issues/53605). Different-class: [#20754](https://github.com/anthropics/claude-code/issues/20754), [#79268](https://github.com/anthropics/claude-code/issues/79268). Cite only. Primary stays #92095.
5. **Score the trapdoor** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/oubliette/index.html` in a browser, or serve the repo root and visit `/oubliette/` (Vercel rewrite → `/projects/oubliette`). No build step. Optional hook:

```bash
node projects/oubliette/hook/oubliette.mjs projects/oubliette/data/92095.json
node --test projects/oubliette/hook/oubliette.test.mjs
```

Empty stdin scores the idle **cold** ticket. Paste a probe on the page or drop a fixture from `data/`.
