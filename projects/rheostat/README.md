# Rheostat

An **electronics / instrument-bench effort-dial lab** — bakelite rheostat knob, copper traces, brass bezel, amber filament glow for maxed, cool teal for attenuated, deep charcoal panel, subtle grid PCB texture — Oxanium + Lexend + Kode Mono — for a real Claude Code defect: **`/CODE-REVIEW <TARGET> --LEVEL LOW` ECHOES THE LEVEL INTO REVIEW TARGET, BUT THE EFFORT-SCALING TEMPLATE STAYS HARDWIRED AT HIGH (8 ANGLES / RECALL-BIASED / 5 BATCHES).** The faceplate reads `--level low`. The copper behind is already lit at high. Score the dial or admit the pipeline already maxed.

Primary:

- [anthropics/claude-code#92436](https://github.com/anthropics/claude-code/issues/92436) (OPEN, bug, has repro, area:cost, area:skills). Title: `code-review skill: --level low still runs the full high-effort 8-angle pipeline`. Filed 2026-09-06T05:12:55Z. Reporter: dvojir. Comments: none at research time.

19:50 rheostat: a bakelite effort dial that reads `--level low` on the faceplate but the copper behind stays hardwired at high — eight angles already lit, five batches already queued. Score the dial or admit the pipeline already maxed.

Idle word: **maxed**. Seeded state: **hardwired** / #92436 — `--level` echoed; scaling template hardcoded to high. Never idle as mute, inherited, freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, misaimed, cold, or voided. Never seeded as rostered, collided, doubled, clobbered, or retried.

**Rheostat** is a variable-resistor / effort-dial electronics bench. Turning `--level low` should drop resistance on the review pipeline. Instead the knob moves on the faceplate and the copper stays soldered to high.

- **maxed** = IDLE: requested low still launches the full high-effort pipeline (8 angles / 5 batches / recall-biased)
- **hardwired** = seeded word: Review target echoes `--level low`; effort-scaling instructions stay the high-effort text
- **attenuated** = contrast hold: low/medium actually runs fewer, high-confidence findings
- **level-honored** = contrast hold: parsed `--level` drives the scaling map
- **angle-scaled** = contrast hold: angle count differs per level
- **framing-matched** = contrast hold: framing matches requested level, not always recall-biased high
- **cost-honest** = contrast hold: token burn matches requested level; no silent full-pipeline cost
- **cousins** = cite-only #90020 #88852 #87847 #88034 #79580 #90162 #92444

Verdicts: maxed, hardwired, attenuated, level-honored, angle-scaled, framing-matched, cost-honest, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a `--level low` review would leave the dial maxed or already hardwired. Fixtures use the issue's Review target echo (`HEAD --level low`), the hardcoded high-effort scaling line, the 8-angle / 6-candidate / 5-batch coordinator run, the recall-biased framing, the skill-tool scope description, and the prior `--level medium` word-for-word match only.

Hypothesis only (NON-BINDING): skill template does not branch on parsed `--level` (or falls through to high-effort text/angle-count in every case); Review target string interpolation works but scaling map is dead. Verify against issue evidence only. Discard if issue evidence disagrees. Encoded from the issue body only. Do not invent runtime source claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92436](https://github.com/anthropics/claude-code/issues/92436)

What happened (from the issue — do not invent):

- `/code-review <target> --level low` does NOT actually run at low effort.
- `--level` is correctly echoed into the "Review target" line of the coordinator's own prompt (e.g. `Review target: \`HEAD --level low\``).
- BUT the effort-scaling instructions underneath are hardcoded to the high-effort configuration regardless of requested level.
- Coordinator transcript shows: `high effort → 3+5 angles × 6 candidates → 1-vote verify (recall-biased) → ≤10 findings`
- Framing: "You are reviewing for **recall** at high effort... Err on the side of surfacing."
- Phase 1: Run **8 independent finder angles** via the Agent tool (3 correctness + 3 cleanup + 1 altitude + 1 conventions, up to 6 each).
- The high-effort text/angle-count matched word-for-word an earlier `--level medium` run in the same session the day before.
- Coordinator spawned 5 parallel Agent-tool batches covering all 8 angles — same as higher-effort run.
- Skill tool description says effort level controls scope ("low/medium: fewer, high-confidence findings; high→max: broader coverage, may include uncertain findings"), so this is a behavior regression / wiring bug, not a docs gap — template appears not to branch on parsed level (or falls through to high).
- Impact: cost — "low effort" silently launches full 8-angle / 5-subagent-batch high-effort pipeline at full token cost with no visible indication the requested level was ignored.
- Suggested fix direction (cite only, do not implement as product code): verify level-to-scaling-text mapping is wired to parsed `--level`, add regression check per level (low/medium/high/xhigh/max) confirming angle count and framing differ.

Problem found: `--level low` captured on the Review target line → effort-scaling template stays hardcoded to high → silent full-cost 8-angle / 5-batch pipeline.

Why this solution: a diagnostic scorer for the maxed dial → hardwired copper chain, so a reader can pin idle maxed, seed hardwired, and score attenuated / level-honored / angle-scaled / framing-matched / cost-honest against the published facts.

## Why not a clone

This is specifically: **`/code-review --level low` echoes the level into Review target, but effort-scaling template stays hardcoded to high (8 angles / recall-biased / 5 batches) → silent full-cost pipeline.**

NOT Aphonia/#92409 — ListAgents present, SendMessage missing from toolset. Rheostat is effort-level wiring, not voice/toolset asymmetry.
NOT Fulcrum/#92377 — `--name` discarded / foreign auto title / registry collision. Rheostat is not a naming lever.
NOT Wildcat/#92399 — `run_in_background` freewheel. Rheostat is not a windlass.
NOT Clobber/#92419 — inode rename → deaf watcher. Rheostat is not a print shop.
NOT Watchdog/#92424 — stall-watchdog vs auto-compaction. Rheostat is not a kennel.
NOT Understudy/#92426 — Agent() definition ignored under dispatch. Rheostat is not a dressing-room.
NOT Fairlead/#92403 — `file://`-only remote drop. Rheostat is not a hawse-pipe.
NOT Stroboscope/Heliostat/Lethe/Frizzen/Nixie/Embrasure/Elision/Graft and all prior catalog desks.
Do NOT name this Aphonia, Fulcrum, Wildcat, Clobber, Watchdog, Understudy, Fairlead, Stroboscope, Heliostat, Lethe, Attenuator, or any existing catalog slug.
Do NOT reuse idle mute / inherited / freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / misaimed / cold / voided.
Do NOT reuse seeded rostered / collided / doubled / clobbered / retried.

Different surface: code-review skill `--level` echoed but scaling template hardwired to high vs ListAgents/SendMessage toolset asymmetry / naming collision / bg completion / inode watcher / stall watchdog / casting / URI drop.

Cousins cite-only (NOT primary — different root cause):

- [#90020](https://github.com/anthropics/claude-code/issues/90020) — /code-review --fix reports unavailable ReportFindings tool
- [#88852](https://github.com/anthropics/claude-code/issues/88852) — /code-review ultra fails on large repo (agents terminate early)
- [#87847](https://github.com/anthropics/claude-code/issues/87847) — /code-review ultra fails server-side, burns free-review quota
- [#88034](https://github.com/anthropics/claude-code/issues/88034) — Code review agents stall out completely
- [#79580](https://github.com/anthropics/claude-code/issues/79580) — Code review subagent spawns subagents
- [#90162](https://github.com/anthropics/claude-code/issues/90162) — Focus mode hides /code-review findings render
- [#92444](https://github.com/anthropics/claude-code/issues/92444) — mid-session /effort invalidates prompt cache on Sonnet 5 / Opus 5 (docs say no effect) — different: cache key vs skill template level wiring

Product name stays **Rheostat**. Do not rename to Aphonia, Fulcrum, Wildcat, Clobber, Watchdog, Understudy, Fairlead, Stroboscope, Heliostat, Lethe, Attenuator, or any existing catalog slug. Name/slug `rheostat` confirmed unused in catalog.json (178 products).

Different UI: electronics instrument bench, bakelite dials, copper traces, brass bezel, amber filament for maxed, cool teal for attenuated, deep charcoal PCB panel. Oxanium / Lexend / Kode Mono. NOT Fraunces / Karla / IBM Plex Mono (Aphonia laryngoscope clinic). NOT Cormorant / DM Sans / Fira Code (Fulcrum balance-beam). NOT Syne / Sora (Wildcat windlass). Stay OFF voice-clinic tray / brass beam / windlass deck / forme/ink/plate / kennel slats / dressing-room / hawse-pipe / optics strobe / rooftop observatory / underworld ferry.

Different verbs: pin idle maxed, pin seeded hardwired, score attenuated vs maxed, flip level-honored vs hardwired, load fixtures, reset to attenuated.

Different idle: **maxed**. Different seeded: **hardwired**. Contrast: **attenuated** / **level-honored** / **angle-scaled** / **framing-matched** / **cost-honest**.

## Live catalog path

`/rheostat/` is this static effort-dial scoring assay. Path `https://hermes-playground-green.vercel.app/rheostat/` and subdomain `https://rheostat.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `19:50 / hermes catalog #179 / #92436`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **hardwired** — Review target echoes `--level low`; scaling template is `high effort → 3+5 angles × 6 candidates → 1-vote verify (recall-biased)`; 8 finder angles; 5 Agent-tool batches.
2. Idle **maxed** → requested low still burns the full high-effort pipeline.
3. Contrast **attenuated** → low/medium actually runs fewer, high-confidence findings.
4. Contrast **level-honored** → parsed `--level` drives the scaling map.
5. Contrast **angle-scaled** → angle count differs per level.
6. Contrast **framing-matched** → framing matches requested level, not always recall-biased high.
7. Contrast **cost-honest** → token burn matches requested level.
8. Assay UI: bakelite rheostat, review-target echo strip, hardcoded scaling-template panel, 8-angle grid, 5-batch meter, expected-low vs actual-high cost gauge.
9. Stay-off strip: Aphonia / Fulcrum / Wildcat / Clobber / Watchdog / Understudy / Fairlead / Stroboscope / Heliostat / Lethe / Attenuator. Primary stays #92436.
10. **Score the dial** walks the probe ticket and lights chips on the bench. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the copper (echo / hardwire / attenuate / honor-level).

## How to score

Open `projects/rheostat/index.html` in a browser, or serve the repo root and visit `/rheostat/` (Vercel rewrite → `/projects/rheostat`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **maxed** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **hardwired** / `--level low` echoed / scaling template high / 8 angles / 5 batches.
