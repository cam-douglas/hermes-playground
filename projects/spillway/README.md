# Spillway

A **hydroelectric dam control / spillway desk** — wet concrete, teal reservoir water, steel railings, gauge panels, amber alarm lamps — Teko + Hind + Fira Code — for a real Claude Code defect: **`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` IS SKIPPED WHEN ULTRACODE IS ACTIVE — A WORKFLOW RAN 7 AGENTS UNDER A CAP OF 3 (2.1.261).**

Primary:

- [anthropics/claude-code#92311](https://github.com/anthropics/claude-code/issues/92311) (OPEN, bug, has repro, platform:linux, area:agents). Title: `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS is skipped when ultracode is active — a Workflow ran 7 agents under a cap of 3 (2.1.261)`.

20:50 spillway: a spillway that opens because ultracode returned early is not a held dam — it is already spilled. Score the gate or admit the concurrency already spilled.

Idle word: **gated**. Seeded state: **spilled** / #92311 — ultracode early-return; 7 overlapping under cap 3. Never idle as hushed, blurted, maculed, stilled, rung, barred, dropped, pared, raw, cast, fouled, flowing, snubbed, matched, warded, lit, blanked, afloat, careened, caught, slipping, locked, wiped, seated, channel, stranded, scratched, live, orphaned, set, scrapped, pure, scorched, cold, voided, banked, rewritten, or any prior catalog idle.

**Spillway** is the controlled overflow path past a dam — here ultracode opens the spillway so the concurrency dam never holds.

- **gated** = HOLD: cap holds; ≤3 concurrent; no ultracode bypass
- **spilled** = #92311: ultracode early-return; 7 overlapping under cap 3
- **capped** = settings `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS=3`
- **exempt** = ultracode sessions exempt (docs, one sentence; impact not stated)
- **overlapped** = peak overlap 7 at 2026-09-05T08:21:20.624Z (FAIL transcript-gate 4,5,6,7)
- **hooked** = SubagentStart hook exit 2 when live count would exceed cap
- **refused** = hook refused the spawn before the lane filled

Verdicts: gated, spilled, capped, exempt, overlapped, hooked, refused.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the concurrency dam held or the spillway already opened. Fixtures use diagnostic shapes only (cap, ultracode flag, Workflow `agentCount`, sweep-line overlap, hook exit 2).

Hypothesis only (NON-BINDING): the desk should make “ultracode early-return skips `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` so Workflow fans out past the operator’s cap” visceral via a dam board where the spillway opens and agent lanes flood past the red 3-line. Discard if evidence disagrees. Encoded from the issue’s facts. Do not claim unseen source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92311](https://github.com/anthropics/claude-code/issues/92311)
- Cousin cite-only (different symptom, NOT primary): [#80082](https://github.com/anthropics/claude-code/issues/80082), [#90483](https://github.com/anthropics/claude-code/issues/90483)

What happened (from the issue):

- In Claude Code 2.1.261 the subagent launch guard returns early when `appState.ultracode === true` (and effort resolves to xhigh), so `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` never gates the Workflow tool that ultracode uses.
- Measured: settings cap=3, ultracode on; Workflow `agentCount:16` planned; sweep-line over `agent-*.jsonl` timestamps showed peak overlap 7 concurrent at 2026-09-05T08:21:20.624Z (FAIL transcript-gate lines for 4,5,6,7).
- Workflow runtime concurrency is `min(16, availableParallelism()−2)` (16 on a 48-CPU host), not the env var.
- Docs say ultracode sessions are exempt in one sentence; impact (cap does not apply to the fan-out mode) is not stated.
- Guard also has an unrelated early return via feature flag `tengu_amber_kestrel`.
- Workaround measured: SubagentStart hook exit 2 when live count would exceed cap (28 Agent dispatches under a hook cap of 2 → never more than 2 running, 11 refused before spawn).
- Environment: Claude Code 2.1.261 (`BUILD_TIME 2026-09-04T16:49:50Z`); Linux 6.8.0-90-generic, x86_64, 48 CPUs; settings `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS=3`, `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`, `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`.
- Expected: with the cap at 3, no more than 3 subagents run at once for any executor, or the documentation states plainly that ultracode is the exception and how to cap it.

## Why not a clone

This is specifically: **`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` SKIPPED WHEN ULTRACODE IS ACTIVE — WORKFLOW RAN 7 AGENTS UNDER A CAP OF 3.**

NOT Blurt ([#92275](https://github.com/anthropics/claude-code/issues/92275)) — cooked ECHO / XTVERSION leak — CRT phosphor. Spillway is not a terminal atelier.
NOT Macule ([#92294](https://github.com/anthropics/claude-code/issues/92294)) — show_widget duplicate — letterpress.
NOT Alarum ([#92283](https://github.com/anthropics/claude-code/issues/92283)) — post-goodbye kill-wake — watchtower.
NOT Portcullis/Skive/Lagan/Snub/Ward/Deadlight or any existing catalog slug.
NOT Sluice ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork kernel pool leak on a millrace. Spillway is a hydroelectric concurrency dam, not a paged-pool mill pond.
NOT #80082 / #90483 — cousins only.

Different surface: agent concurrency guard bypass under ultracode vs TUI ECHO race vs widget macule vs watchtower.

Cousins are cite-only on a cousin strip; primary stays #92311.

- [#80082](https://github.com/anthropics/claude-code/issues/80082) — closed docs. Docs omitted the concurrent cap entirely. Cite-only. Do not ship as primary.
- [#90483](https://github.com/anthropics/claude-code/issues/90483) — open enhancement. Workflow concurrency derives from CPU count (too low on 2-vCPU cloud). Cite-only. Do not ship as primary.

Backups (document only, do not build): [#92286](https://github.com/anthropics/claude-code/issues/92286) (Cresset), [#92292](https://github.com/anthropics/claude-code/issues/92292) (Symlink), [#92269](https://github.com/anthropics/claude-code/issues/92269) (Louver).

Product name stays **Spillway**. Do not rename to Blurt, Macule, Alarum, Portcullis, Skive, Lagan, Snub, Ward, Deadlight, Sluice, Careen, Ratchet, Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator or any existing catalog slug.

Different UI: hydroelectric dam control / spillway desk — wet concrete, teal reservoir, steel railings, gauge panels, amber alarm lamps, sluice/spillway schematic with concurrent-agent lanes filling past a red cap line at 3. Dark industrial board — slate concrete (#1a1e22), reservoir teal (#2ec4b6), steel (#9aa4b2), alarm amber (#f0a14a), over-cap crimson (#e85d4c). Teko + Hind + Fira Code. NOT Syne / IBM Plex (Blurt CRT). NOT Bodoni Moda / Barlow / Share Tech Mono (Macule). NOT Fraunces / Outfit (Alarum). Stay OFF millrace indigo/brass (Sluice).

Different verbs: Score the gate, pin idle gated, pin seeded spilled, admit the concurrency already spilled, load fixtures, reset to gated. Score the gate is this desk’s phrase.

Different idle: **gated**.

## Live catalog path

`/spillway/` is this static dam-control scoring desk. Path `https://hermes-playground-green.vercel.app/spillway/` and subdomain `https://spillway.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `20:50 / hermes catalog #156 / #92311`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **spilled** — ultracode on; settings cap=3; Workflow `agentCount:16` planned; launch guard returned early (`appState.ultracode === true`, effort xhigh); Workflow runtime used `min(16, availableParallelism()−2)` = 16 on a 48-CPU host; sweep-line over `agent-*.jsonl` timestamps peaked at 7 concurrent at 2026-09-05T08:21:20.624Z; FAIL transcript-gate for 4, 5, 6, 7.
2. Idle **gated** → cap holds; ≤3 concurrent; no ultracode bypass; idle word gated.
3. Desk UI: wet concrete board, teal reservoir, steel railings, gauge panels, amber over-cap lamps. Gated = three lanes below the red 3-line; spillway closed. Spilled = seven lanes flood past the cap; spillway open. Ultracode toggle (gated vs spilled). Timeline of concurrent overlap 1→7.
4. Cousin cite strip labeled cousin-not-primary: [#80082](https://github.com/anthropics/claude-code/issues/80082), [#90483](https://github.com/anthropics/claude-code/issues/90483). Cite only. Primary stays #92311.
5. **Score the gate** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Spillway simulator chips rewrite ultracode (on / off), Workflow plan (16 / 3), and hook (none / SubagentStart exit 2).

## How to score

Open `projects/spillway/index.html` in a browser, or serve the repo root and visit `/spillway/` (Vercel rewrite → `/projects/spillway`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/spillway/hook/README.md
```

Empty paste scores the idle **gated** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **spilled**.
