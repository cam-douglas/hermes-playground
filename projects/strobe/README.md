# Strobe

An **aviation / photography strobe-beacon booth** — hangar beacon rail, flash capacitor, loop-mode false-positive strobe. Fonts **Newsreader** (display) + **Figtree** (body) + **Red Hat Mono** (mono). Palette: hangar night `#0b1220`, beacon cyan `#3de0ff`, caution amber `#f0b429`, capacitor violet `#7c5cff`, false-loop crimson `#e11d48` — dark strobe booth, not flintlock flashpan, desert mirage, diesel glowplug, deadlight porthole, imperial ukase, cheque counterfoil, camera lucida, sterile lab, pulse-damper, earthwork fosse, or hibernacle.

Primary:

- [anthropics/claude-code#93468](https://github.com/anthropics/claude-code/issues/93468) (OPEN, bug, has repro, area:core). Title: `ScheduleWakeup off-label use outside /loop (per skill guidance) causes spurious loop-mode UI and prompt redelivery`. Filed by lanej 2026-09-10. Claude Code **2.1.267**. Interactive tmux session mid-execution of a Superpowers `subagent-driven-development` plan, never invoked `/loop`, called `ScheduleWakeup` while waiting on a dispatched background implementer subagent. `ScheduleWakeup`'s own tool description says it's for "/loop dynamic mode" and "you don't call it directly", but it is the *only* wakeup/scheduling primitive Claude Code exposes. Skills that instruct a bounded idle wait drive off-label calls because there is no alternative bounded-wait primitive for non-`/loop` sessions (`/goal` is condition-driven, not wait-and-resume). Observed: (1) CLI banner "Claude resuming /loop wakeup (...)" on wakeup despite `/loop` never invoked; (2) available-skills list truncated to "1 skill available" on wakeup vs full list normally; (3) on 2–3 occasions the identical prior prompt ("check whether Task N's implementer has reported") was redelivered as if a new user message. Related #88205 (ScheduleWakeup rejects `noop:true` outside `/loop`) — same off-label root cause, different symptom. Changelog 2.1.257 fixed a *background* session's `state.json` prompt-repeat; this repro is on an *interactive* session, still reproduces on 2.1.267.

06:50 strobe: an aviation/photography strobe-beacon booth for #93468. Idle **steady** / seeded **strobing** / path **off-label**. Score strobe or admit steady.

Score strobe or admit steady.

Idle word: **steady** (HOLD: no `/loop`; ScheduleWakeup not called off-label; full skills list; no false loop banner). Seeded word: **strobing** / #93468 (off-label ScheduleWakeup paints loop UI + may redeliver prompt). Path word: **off-label**. Product score: **strobe**. Never idle matched / skewed / headers-hash / counterfoil / traced / pathless / image-cache / lucida / scrubbed / contaminated / fomite / gitignore / damped / spinning / mux / snubber / mounted / fossed / plan9 / fosse / warm / paged-out / majflt / hibernacle / honest / scapegoated / ungranted / scapegoat / bound / accreted / session-url / cartulary / sealed / mismatched / issuer / paraph / routed / inherited / cascade / appanage / afloat / washed / pontoon / concordant.

Phrase: **when ScheduleWakeup is used off-label outside /loop and paints spurious loop-mode UI plus prompt redelivery, score strobe or admit steady.**

- **steady** = IDLE: HOLD; no `/loop`; ScheduleWakeup not called off-label; full skills list; no false loop banner
- **strobing** = #93468 seeded path: off-label ScheduleWakeup paints loop UI + may redeliver prompt
- **strobe** = product score word for the hangar beacon that flashed a false `/loop` when the capacitor discharged off-label
- **off-label** = path word: ScheduleWakeup used outside `/loop` because no bounded-wait primitive exists
- **hold** = HOLD alias for idle steady
- **schedule-wakeup** = the only wakeup/scheduling primitive Claude Code exposes
- **never-loop** = `/loop` never invoked
- **loop-banner** = CLI banner "Claude resuming /loop wakeup (...)"
- **skills-truncated** = available-skills list truncated to "1 skill available"
- **prompt-redeliver** = identical prior prompt redelivered as if a new user message
- **interactive** = interactive session (not the background `state.json` path)
- **tmux** = interactive tmux session v2.1.267
- **subagent-driven** = Superpowers `subagent-driven-development` bounded-wait instruction
- **noop-88205** = related #88205 rejects `noop:true` outside `/loop`
- **changelog-257** = 2.1.257 fixed a *background* session's `state.json` prompt-repeat; this repro is interactive
- **goal-condition** = `/goal` is condition-driven, not wait-and-resume
- **has-repro** = Claude Code 2.1.267 · lanej · interactive tmux · never `/loop`
- **cousins** = cite-only #88205 #82634 #86245 #74569 #82633 #77235 #93114 — do not rebuild
- **backups** = cite-only #93458 #93439 #93475 #93438 #93466 — do not auto-pick
- **fixtures** = rail / capacitor / beacon / lamps table for the strobe booth
- **walk** = published idle steady → bounded-wait → implementer-wait → schedule-wakeup-off-label → loop-banner → skills-truncated → prompt-redeliver → strobing → off-label → strobe

Verdicts: steady, strobing, strobe, off-label, hold, schedule-wakeup, never-loop, loop-banner, skills-truncated, prompt-redeliver, interactive, tmux, subagent-driven, noop-88205, changelog-257, goal-condition, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the hangar rail is **strobing** / **strobe** or already **steady**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Off-label ScheduleWakeup may flip session loop-mode flags / wakeup UI path even when `/loop` was never entered, truncating skill injection and sometimes replaying the wakeup prompt. Invite verify against #93468 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93468](https://github.com/anthropics/claude-code/issues/93468)
- Cite-only cousin: [anthropics/claude-code#88205](https://github.com/anthropics/claude-code/issues/88205) (ScheduleWakeup rejects `noop:true` outside `/loop` — same off-label root cause, hard rejection vs silent side effects; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#82634](https://github.com/anthropics/claude-code/issues/82634) (text streamed with ScheduleWakeup destroyed from jsonl; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#86245](https://github.com/anthropics/claude-code/issues/86245) (no fallback when tengu_kairos_loop_dynamic is off; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#74569](https://github.com/anthropics/claude-code/issues/74569) (queued wakeup silently dropped; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#82633](https://github.com/anthropics/claude-code/issues/82633) (reports a scheduled time outside `/loop`, then never fires; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#77235](https://github.com/anthropics/claude-code/issues/77235) (`/clear` does not cancel pending wakeups; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#93114](https://github.com/anthropics/claude-code/issues/93114) (self-paced loop never fires; do not rebuild)
- Backup (data only): #93458 SessionStart hook additionalContext silently dropped when source=fork
- Backup (data only): #93439 Read tool never triggers PreToolUse hooks for binary files
- Backup (data only): #93475 Effort selector requires a very tall terminal
- Backup (data only): #93438 Agent dispatch isolation worktree cwd bleed
- Backup (data only): #93466 Desktop Directory → Plugins duplicate cards / no uninstall

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, area:core
- Claude Code **2.1.267**; reporter lanej; interactive tmux
- `ScheduleWakeup` description: "/loop dynamic mode"; "you don't call it directly"
- It is the only wakeup/scheduling primitive
- Superpowers `subagent-driven-development` instructs a bounded idle wait
- `/goal` is condition-driven, not wait-and-resume
- Repro never invoked `/loop`; called `ScheduleWakeup` while waiting on a dispatched background implementer
- Observed: false `/loop` banner; skills truncated to 1; prior prompt redelivered 2–3 times
- Related #88205 (hard rejection of `noop:true` outside `/loop`)
- Changelog 2.1.257 fixed a *background* session `state.json` prompt-repeat; this is interactive

Problem found: OFF-LABEL SCHEDULEWAKEUP OUTSIDE /LOOP PAINTS A FALSE LOOP-MODE STROBE AND MAY REDELIVER THE PRIOR PROMPT.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the hangar beacon stayed **steady** or started **strobing**. Educational aviation/photography booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Make `ScheduleWakeup` safe or rejected cleanly outside `/loop`
2. Or document a supported bounded-wait primitive for non-loop sessions
3. No spurious "Claude resuming /loop wakeup (...)" banner when `/loop` was never invoked
4. Full skills list remains injected on wakeup
5. The prior prompt is not redelivered as a new user message

## Why not a clone

This is specifically: **SCHEDULEWAKEUP USED OFF-LABEL OUTSIDE /LOOP PAINTS SPURIOUS LOOP-MODE UI PLUS PROMPT REDELIVERY** — aviation/photography strobe-beacon booth, not flintlock flashpan, not desert mirage, not diesel glowplug, not deadlight porthole, not imperial ukase, not cheque counterfoil, not camera-lucida atelier.

**NOT Flashpan** (lastRunAt priming). Different defect. NOT flintlock flashpan.

**NOT Mirage** (dispatch confirm). Different defect. NOT desert mirage.

**NOT Glowplug** (Windows preheat). Different defect. NOT diesel glowplug.

**NOT Deadlight** (ListAgents blank). Different defect. NOT deadlight porthole.

**NOT Ukase** (mcp workspace bash). Different defect. NOT imperial ukase.

**NOT Almanac** (one-shot feast). Different defect.

**NOT Counterfoil/#93446** (add-json `--client-secret` headers-hash). Different defect. NOT cheque-counter / ticket-stub.

**NOT Lucida/#93429** (Desktop Code tab paste drops the image source path). Different defect. NOT camera-lucida / drafting plate.

**NOT Fomite/#93423.** **NOT Snubber/#93398.** **NOT Fosse/#93358.** **NOT Hibernacle/#93372.** **NOT Scapegoat/#93348.** **NOT Cartulary/#93331.** **NOT Paraph/#93327.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **hangar strobe-beacon — the capacitor discharges a false /loop flash when ScheduleWakeup is used off-label** — unused in catalog as this hangar walk. Nearby `stroboscope` is a different product.

Do NOT rename this product Flashpan, Mirage, Glowplug, Deadlight, Ukase, Almanac, Counterfoil, Lucida, Fomite, Snubber, Fosse, Hibernacle, Scapegoat, Cartulary, Paraph, or any existing catalog slug.
Do NOT reuse idle steady / strobing / off-label on a later booth.
Display here is **Newsreader**. Body is **Figtree**. Mono is **Red Hat Mono**.

Different surface: off-label ScheduleWakeup loop-mode UI + prompt redelivery vs lastRunAt priming vs dispatch confirm vs Windows preheat vs ListAgents blank vs mcp workspace bash vs add-json headers-hash vs desktop image-cache omit.

Product name stays **Strobe**. Name/slug `strobe` unused in catalog.json (278 products before this ship; Counterfoil is #278).

Different UI: hangar beacon rail / flash capacitor / loop-mode false-positive strobe. Newsreader / Figtree / Red Hat Mono. NOT cheque-counterfoil. NOT camera-lucida atelier. NOT sterile lab. NOT pulse-damper. NOT earthwork fosse.

Different verbs: Arm the beacon, Score strobe, Kill the flash, Audit skills list, Pin idle steady, Pin seeded strobing, Pin off-label, Clear the rail.

Different idle: **steady**. Different #93468 seeded path: **strobing**. HOLD: **steady** / **hold**. ALARM: **strobing** / **strobe** / **off-label** / **loop-banner**. Path: **off-label**.

## How to score

```bash
node --test projects/strobe/strobe.test.mjs
node projects/strobe/strobe.mjs projects/strobe/data/strobing.json
echo '{"seed":"strobing"}' | node projects/strobe/strobe.mjs
```

Open the living card at `projects/strobe/index.html` (or the live path `/strobe/`). Buttons: Arm the beacon, Score strobe, Kill the flash, Audit skills list, Pin idle steady, Pin seeded strobing, Pin off-label, Clear the rail. Toggle invoked `/loop` / never `/loop` / ScheduleWakeup off-label / skills truncated to 1 / prompt redelivered / interactive session — the score flips. Lay a fixture JSON on the hangar rail. `?embed=1` hides chrome.

The booth reconstructs the reporter’s off-label ScheduleWakeup / false `/loop` banner / skills truncated to 1 / prompt redelivery walk from the published #93468 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/strobe/
- Folder: `projects/strobe/`
