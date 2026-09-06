# Wildcat

A **windlass-deck / chain-wildcat / freewheel lab** — sprocket, brake lever, freewheel indicator, generation A/B process timeline, duplicate-row ledger, shell-exit vs work-finished dial, ps-visibility lag gauge — Syne + Sora + IBM Plex Mono — for a real Claude Code defect: **`RUN_IN_BACKGROUND` BASH CALL RETURNS "COMPLETED" AS SOON AS THE PARENT SHELL EXITS, EVEN WHEN THE COMMAND DETACHES CHILDREN VIA `nohup … &`. A FOLLOW-UP `ps` RIGHT AFTER THE BELL SOMETIMES SHOWS NOTHING, SO THE MODEL RELAUNCHES; BOTH GENERATIONS WRITE THE SAME FILE AND PRODUCE ~1.8× DUPLICATE ROWS.** When the clutch drops, the wildcat keeps spinning — the deck bell already rang completed. The bosun checks the chain locker too early, thinks the launch failed, and starts a second crew. Score the descendants or admit the writers already doubled.

Primary:

- [anthropics/claude-code#92399](https://github.com/anthropics/claude-code/issues/92399) (OPEN, bug, has-repro, platform:macos, area:bash). Title: `` `run_in_background` Bash call returns "completed" immediately when the script backgrounds its own children, and a follow-up `ps` can miss the still-running children` ``. Filed 2026-09-05. Reporter: cortrothems-ai.

16:50 wildcat: when the clutch drops the wildcat keeps freewheeling and the deck bell already rang completed — the bosun checks the locker too early and a second crew doubles the hawser. Score the descendants or admit the writers already doubled.

Idle word: **freewheeling**. Seeded state: **doubled** / #92399 — completed ~1s exit 0; immediate ps sometimes empty; wait ~5s and the process is listed; later two processes for the same `--worker-id`; ~1.8× duplicate rows. Never idle as deaf, choking, miscast, inherited, unguided, dropped, strobing, stolen, dawnlocked, or misaimed. Never seeded as clobbered or retried.

**Wildcat** is windlass work. The clutch (parent shell) drops; the wildcat (detached children) keeps spinning; the deck bell already rang "completed". The bosun's immediate `ps` can miss the still-running children. A second crew hauls the same hawser. Score whether completion reports live descendants, waits for work-finished, documents shell-exit-only, or a delayed-ps-recheck would have kept the locker from being doubled.

- **freewheeling** = IDLE: clutch dropped; children still writing; bell already rang completed
- **doubled** = seeded word: immediate ps miss → relaunch → two writers → ~1.8× duplicate rows
- **shell-exit-only** = contrast hold: completed means parent shell exited; docs should say so
- **work-finished** = contrast hold: completion means the work finished
- **descendant-count-at-exit** = contrast hold: report live descendants when the parent shell exits
- **delayed-ps-recheck** = contrast hold: wait ~5s and re-check ps before assuming launch failed
- **visibility-lag** = immediate ps empty; process appears ~5s later; log still growing
- **ruled-out-or-workarounds** = never nest `nohup … &`; not timeout cousin #88702; not opposite polarity #91869
- **cousins** = cite-only #88702 #91869 #88048 #87689 #91225

Verdicts: freewheeling, doubled, shell-exit-only, work-finished, descendant-count-at-exit, delayed-ps-recheck, visibility-lag, ruled-out-or-workarounds, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a shell-exit bell would leave the wildcat freewheeling or already doubled. Fixtures use the issue's nested-nohup repro, the ~1s completed / exit 0 observation, the ~5s visibility window, the two-process same `--worker-id` ledger, and the ~1.8× duplicate-row factor only.

Hypothesis only (NON-BINDING): harness treats `run_in_background` completion as parent-shell exit; detached children are invisible to that signal and briefly to follow-up `ps`, causing false-fail relaunch and duplicate output. Verify against issue evidence only. Discard if issue evidence disagrees. Encoded from the issue body only. Do not invent runtime source claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92399](https://github.com/anthropics/claude-code/issues/92399)

What happened (from the issue — do not invent):

- Environment: Claude Code **2.1.2xx** (observed 2026-08-20; still the same behaviour on **2.1.260**); **macOS arm64**; **zsh**; `permissions.defaultMode: "auto"`.
- When Bash is called with `run_in_background: true` and the command itself spawns detached children via `nohup <cmd> > log 2>&1 &`, the harness reports the background task as **completed** as soon as the parent shell exits, even though the children keep running.
- A follow-up Bash `ps aux | grep <cmd>` right after the completion notification sometimes showed **no** matching processes, so the model concluded the launch failed and relaunched the same workers.
- The original children were in fact alive (later ps showed two processes for the same `--worker-id`); both generations wrote to the same output file concurrently, producing ~1.8× duplicate rows.
- Two separable issues: (1) Completion semantics: "completed" means shell exited, not work finished — nothing distinguishes when children detach. (2) Process visibility right after notification: immediate ps can miss processes that appear ~5s later.
- Minimal repro: `run_in_background` true with `nohup sh -c 'for i in $(seq 1 60); do echo tick $i >> /tmp/bg_probe.log; sleep 1; done' > /dev/null 2>&1 &` → completion within ~1s exit 0; immediate ps sometimes empty; wait ~5s and ps lists the process; log keeps growing for 60s after "completed".
- Expected: completion should report live descendants at exit, OR docs should state shell-exit-only and that detaching children inside `run_in_background` is unsupported; document any teardown visibility window.
- Workaround: never nest `nohup … &` inside `run_in_background`; re-check ps after a few seconds before assuming launch failed.

Problem found: shell-exit completion + brief process-visibility gap → false-fail relaunch → duplicate writers.

Why this solution: a diagnostic scorer for the freewheeling wildcat → doubled-crew chain, so a reader can pin idle freewheeling, seed doubled, and score shell-exit-only / work-finished / descendant-count-at-exit / delayed-ps-recheck against the published facts.

## Why not a clone

This is specifically: **`run_in_background` completion = shell-exit while nohup-detached children keep running; immediate ps miss → relaunch → duplicate writers.**

NOT Clobber/#92419 — inode rename → deaf watcher → autosave clobber. Wildcat is not a print shop.
NOT Watchdog/#92424 — Workflow 180s stall-watchdog vs silent auto-compaction. Wildcat is not a kennel.
NOT Understudy/#92426 — Agent() definition ignored under dispatch. Wildcat is not a dressing-room.
NOT Fairlead/#92403 — URI scheme `file://`-only remote drop. Wildcat is not a hawse-pipe.
NOT Stroboscope/#92395 — Terminal flicker. Wildcat is not an optics strobe.
NOT Heliostat/Lethe/Frizzen and prior catalog desks.
Do NOT name this Clobber, Watchdog, Understudy, Fairlead, Stroboscope, Heliostat, or any existing catalog slug.
Do NOT reuse idle deaf / choking / miscast / inherited / unguided / dropped / strobing / stolen / dawnlocked / misaimed.
Do NOT reuse seeded clobbered / retried.

Different surface: Bash `run_in_background` parent-shell-exit completion vs detached children vs inode-blind watcher / stall watchdog / casting / drag-drop URI / terminal focus.

Cousins cite-only (NOT primary — different root cause):

- [#88702](https://github.com/anthropics/claude-code/issues/88702) — timeout ignored / never-exiting bg
- [#91869](https://github.com/anthropics/claude-code/issues/91869) — Windows never signals completion — opposite polarity
- [#88048](https://github.com/anthropics/claude-code/issues/88048) — Agent tool returns before subagent stops
- [#87689](https://github.com/anthropics/claude-code/issues/87689) — bg completion notification never delivered
- [#91225](https://github.com/anthropics/claude-code/issues/91225) — `run_in_background=false` ignored on Fork path

Product name stays **Wildcat**. Do not rename to Clobber, Watchdog, Understudy, Fairlead, Stroboscope, Heliostat, Lethe, Frizzen, Gypsy, or any existing catalog slug. Name/slug `wildcat` confirmed unused in catalog.json.

Different UI: windlass deck, chain wildcat sprocket, brake lever, freewheel indicator, generation A/B process timeline, duplicate-row ledger, shell-exit vs work-finished dial, ps-visibility lag gauge. Syne + Sora + IBM Plex Mono. NOT DM Serif Display / Figtree / JetBrains Mono (Clobber print-shop). NOT Bricolage Grotesque / Karla / Fragment Mono (Watchdog kennel). NOT Bodoni Moda / Source Sans (Understudy). NOT Fraunces / Outfit (Fairlead hawse-pipe). Stay OFF forme/ink/plate / kennel slats / dressing-room call-board / hawse-pipe / optics strobe / rooftop observatory / underworld ferry / flintlock lockplate.

Different verbs: Score the descendants, pin idle freewheeling, pin seeded doubled, admit the writers already doubled, flip shell-exit vs work-finished vs descendant-count vs delayed-ps, load fixtures, reset to work-finished.

Different idle: **freewheeling**. Different seeded: **doubled**. Contrast: **shell-exit-only** / **work-finished** / **descendant-count-at-exit** / **delayed-ps-recheck**.

## Live catalog path

`/wildcat/` is this static windlass scoring assay. Path `https://hermes-playground-green.vercel.app/wildcat/` and subdomain `https://wildcat.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `16:50 / hermes catalog #176 / #92399`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **doubled** — immediate ps miss → relaunch → two crews → ~1.8× duplicate rows.
2. Idle **freewheeling** → clutch dropped; wildcat still spinning; bell already rang completed.
3. Contrast **shell-exit-only** → completed means parent shell exited; document the contract.
4. Contrast **work-finished** → completion means the work finished.
5. Contrast **descendant-count-at-exit** → report live descendants at parent-shell exit.
6. Contrast **delayed-ps-recheck** → wait ~5s; do not start a second crew on an empty locker glance.
7. Failure **visibility-lag** → immediate ps empty; process appears ~5s later.
8. Assay UI: sprocket, brake, freewheel lamp, generation A/B timeline, duplicate ledger, shell-exit dial, lag gauge.
9. Stay-off strip: Clobber / Watchdog / Understudy / Fairlead / Stroboscope / Heliostat / Lethe / Frizzen. Primary stays #92399.
10. **Score the descendants** walks the probe ticket and lights chips on the board. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the windlass (clutch / locker / ledger / descendants).

## How to score

Open `projects/wildcat/index.html` in a browser, or serve the repo root and visit `/wildcat/` (Vercel rewrite → `/projects/wildcat`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **freewheeling** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **doubled** / completed ~1s exit 0 / immediate ps miss / ~1.8× duplicate rows.
