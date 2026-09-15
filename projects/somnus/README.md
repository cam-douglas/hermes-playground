# Somnus

A **somnus / night-nursery / moon-watch / sleep-clinic booth** — a *somnus* is Roman sleep / the god of sleep. A Cowork cloud schedule should keep its **cadence** when the bound Mac sleeps through one fire (skip or catch-up). Instead one lid-closed miss permanently snuffs the trigger with `device_absent` and never wakes it. Fonts **Fraunces** (display) + **Figtree** (UI) + **Source Code Pro** (mono). Palette: indigo night `#12162E`, pale linen `#F3EBDD`, moon silver `#C5CDD8`, accent violet `#8B6FCF`, cool teal `#2E9A96`. Fresh trio. Completely different UI/UX/metaphor — moon-watch desk / sleep ledger / device-absent chip / cadence dial. NOT Cresset keep-awake hold. NOT Dictabelt voice fragments. NOT Lemure household shrine. NOT Cancellans binder. NOT Arras tapestry. NOT Frangible / Nameplate / Matryoshka.

The schedule should stay **cadence** (HOLD: the recurring cloud trigger stays enabled across a sleep miss). Instead the booth was **somnus** after a **device-absent**.

Primary:

- [anthropics/claude-code#94415](https://github.com/anthropics/claude-code/issues/94415) (OPEN). Title: `[BUG] Cowork cloud scheduled task bound to a computer is permanently disabled (suspension_reason=device_absent) after one firing while the computer is asleep, and never auto-resumes`. Labels: bug, has repro, platform:macos, area:cowork. Environment: Claude Desktop (Cowork) macOS 1.49585.0 Apple Silicon; Claude Code 2.1.268. Task via Remote MCP `create_trigger` (`created_via: meta_mcp`); `requires_local_device: true`; cron `45 0-4,13-23 * * *` hourly at :45, 06:45–21:45 America/Los_Angeles. First fire while laptop closed writes `enabled=false` / `suspension_reason=device_absent` at dispatch, before any session; no resume on reconnect; no notification; `next_run_at` freezes. Reporter lost three days of output. Manual `update_trigger(enabled: true)` works until the next miss. Local Desktop scheduled tasks skip a sleep miss and catch up on wake. Docs say scheduled tasks "run on their cadence even when your computer is asleep." Stay off Cresset/Dictabelt/Lemure/Cancellans/Arras/Frangible/Nameplate/Matryoshka paradigms.

14:50 somnus: a somnus / night-nursery / moon-watch / sleep-clinic booth for #94415. Cowork cloud scheduled task with `requires_local_device: true` is permanently disabled (`suspension_reason=device_absent`) after one fire while the bound Mac is asleep. Dispatch stamps the latch before any session; no resume; no notify; `next_run_at` frozen. Idle **cadence** / seeded **somnus** / path **device-absent**. Score somnus or admit cadence.

Score somnus or admit cadence.

Idle word: **cadence** (HOLD: the recurring cloud trigger stays enabled across a sleep miss). HOLD aliases: armed, bound, listed, scheduled, muster-ok. Seeded word: **somnus** / #94415 (the device-absent path). Path word: **device-absent**. Product score: **somnus**. Never idle released / verbatim / quiet / intact / slack / yielding / extinguished / idle-ok / suspend-ready or seeded cresset / dictabelt / lemure or path hold-leak / segment-drop / orphan-tick.

Phrase: **Score somnus or admit cadence.**

- **cadence** = IDLE HOLD: the recurring cloud trigger stays enabled across a sleep miss
- **somnus** = seeded path / product score: one sleep at fire-time permanently disables the cloud trigger
- **device-absent** = path word
- **armed** = HOLD alias: the trigger stays armed through a miss
- **bound** = HOLD alias: the device binding does not kill the series
- **listed** = HOLD alias: the trigger remains listed and enabled
- **scheduled** = HOLD alias: the cron keeps its next slot
- **muster-ok** = HOLD alias: the hourly muster still calls
- **sleep-miss** = first fire while laptop closed writes `device_absent`
- **no-resume** = device reconnects; trigger stays `enabled=false`
- **no-notify** = no push, no run-history row, nothing in the session list
- **frozen-next** = `next_run_at` stays frozen at the missed time
- **lid-closed** = one nap at fire-time ends the hourly series
- **update-trigger** = manual `update_trigger(enabled: true)` works until the next miss
- **requires-device** = `requires_local_device: true` bound to one Mac
- **cloud-bound** = cloud task plus device binding (worse than local skip/catch-up)
- **catch-up** = local Desktop already skips a miss and catch-up on wake
- **landing** = somnus / night-nursery / moon-watch / sleep-clinic
- **has-repro** = published shape: Desktop 1.49585.0 · Code 2.1.268 · macOS Apple Silicon
- **cousins** = cite-only #94420 #94392 #94410 — do not rebuild; do not conflate
- **backups** = cite-only #94344 #94398 #94397 #94396 #94393 #94392 #86198 #94417 #93924 #93770 #93777 #94151 #92268 — do not auto-pick
- **fixtures** = muster-ok desk / absent-chip desk
- **walk** = published idle cadence → device-absent → somnus
- **closed** = #94415 remains OPEN — cite only; not this booth

Verdicts: cadence, somnus, device-absent, armed, bound, listed, scheduled, muster-ok, sleep-miss, no-resume, no-notify, frozen-next, lid-closed, update-trigger, requires-device, cloud-bound, catch-up, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **somnus** or already **cadence**. Fixtures use the issue's published incident only. Ledger rows reconstructed from published trigger dumps are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): dispatch-time `device_absent` path disables the trigger instead of skipping the occurrence; no reconnect re-enable and no suspension notification. Invite verify against #94415 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94415](https://github.com/anthropics/claude-code/issues/94415)
- Cousins: do NOT rebuild / do NOT conflate: #94420 (Cresset — keep-awake GNOME suspend inhibitor never released — keep-awake hold, not schedule `suspension_reason`), #94392 (headless `-p` exits with Tasks still running — CLI process exit vs cloud trigger disable), #94410 (Lemure — leftover ScheduledTasks dispatcher ticks — ghost orphan tasks, not a live cloud trigger killed by `device_absent`). None of them covers a Cowork cloud schedule permanently disabled after one sleep miss.
- Backups (data only; next focus only — do not auto-pick): #94344, #94398, #94397, #94396, #94393, #94392, #86198, #94417, #93924, #93770, #93777, #94151, #92268

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:cowork
- Environment: Claude Desktop (Cowork) macOS 1.49585.0 Apple Silicon; Claude Code 2.1.268
- Cloud scheduled task created with `requires_local_device: true` via Remote MCP `create_trigger` (`created_via: meta_mcp`)
- Cron `45 0-4,13-23 * * *` — hourly at :45, 06:45–21:45 America/Los_Angeles
- Task ids `trig_01CkjM7FPtbe9R8BtVMjYvks` and earlier `trig_01CVWpA4WXHQo5ZQbRtM7aqY` failed identically
- First fire while laptop closed: `enabled=false`, `suspension_reason=device_absent`
- Suspension happens at dispatch, before any session starts, so the task's own "is the device reachable?" guard never runs
- Does not resume when the device reconnects; no notification is sent
- `next_run_at` freezes at the missed time (`2026-09-11T03:45:00Z`); `ended_reason` empty
- Sep 11–13: no firings; device reachable for hours each day; reporter lost three days of output
- Manual `update_trigger(enabled: true)` works until the next miss
- Docs say scheduled tasks "run on their cadence even when your computer is asleep"
- Local Desktop scheduled tasks skip a sleep miss and catch up on wake; cloud+device-bound is worse
- Workaround in use: two extra scheduled tasks whose only job is to re-enable the first

Problem found: DEVICE-ABSENT — Cowork cloud schedule permanently disabled after one sleep miss, with no resume and no notification.

Why Somnus: A *somnus* is Roman sleep / the god of sleep. The cloud schedule should keep its cadence when the bound machine sleeps once (skip or catch-up). Instead one sleep at fire-time permanently snuffs the schedule with `device_absent` and never wakes it. #94420 is a keep-awake GNOME inhibitor hold-leak — DIFFERENT. #94392 is a headless `-p` CLI process that exits while Tasks still run — DIFFERENT. #94410 is leftover dispatcher ticks of deleted ids — DIFFERENT. This booth is specifically **schedule permanent-disable / device_absent**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores device-absent honesty (cadence vs somnus) so operators can see the silent-disable path without needing Claude Desktop. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The missed occurrence is skipped and the recurring schedule is preserved
2. The next hourly trigger runs normally once the computer is back
3. `enabled` stays true and `next_run_at` advances to the next slot
4. If intent is to avoid dispatching to a gone-for-good device: bounded backoff with automatic resumption on reconnect, plus a notification when suspended

## Why not a clone

This is specifically: **COWORK CLOUD SCHEDULED TASK WITH REQUIRES_LOCAL_DEVICE:TRUE PERMANENTLY DISABLED (SUSPENSION_REASON=DEVICE_ABSENT) AFTER ONE FIRING WHILE THE BOUND MAC IS ASLEEP, AND NEVER AUTO-RESUMES. DESKTOP 1.49585.0 / CODE 2.1.268; DISPATCH STAMPS THE LATCH BEFORE ANY SESSION; NO RESUME; NO NOTIFY; NEXT_RUN_AT FROZEN; THREE DAYS OF SILENT LOSS.**

Novel paradigm: somnus / night-nursery / moon-watch / sleep-clinic — indigo, linen, moon-silver, violet, teal. New issue, new paradigm (device-absent), new UI/UX/fonts/colors, new scoring vocabulary. A moon-watch sleep-clinic booth, not a night-wall inhibitor, voice recorder, household shrine, binder folio, or theater tapestry.

**NOT #94420** (Cresset — keep-awake GNOME suspend inhibitor never released). Different defect. Keep-awake hold, not schedule `suspension_reason`. Do not rebuild. Do not conflate.

**NOT #94392** (headless `-p` exits with Tasks still running). Different defect. CLI process exit vs cloud trigger disable. Do not rebuild. Do not conflate.

**NOT #94410** (Lemure — leftover ScheduledTasks dispatcher ticks). Different defect. Ghost orphan tasks, not a live cloud trigger killed by `device_absent`. Do not rebuild. Do not conflate.

**NOT Cresset/#94420** (keep-awake hold-leak). Different defect. Do not reuse released / Cresset / hold-leak.

**NOT Dictabelt/#94406** (voice-dictation fragment path). Different defect. Do not reuse verbatim / Dictabelt / segment-drop.

**NOT Lemure/#94410** (orphan dispatcher ticks). Different defect. NOT household shrine. Do not reuse quiet / Lemure / orphan-tick.

**NOT Cancellans/#94400** (deferred-delta). Different defect. NOT binder folio. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Frangible/#94362** (chmod-failopen). Different defect. Do not reuse Frangible / chmod-failopen as the product.

**NOT Nameplate/#94349** (header-rename). Different defect. Do not reuse affixed / Nameplate / header-rename.

**NOT Matryoshka/#94350** (subst-nest). Different defect. Do not reuse unpacked / Matryoshka / subst-nest.

Live: https://hermes-playground-green.vercel.app/somnus/

```
node --test projects/somnus/somnus.test.mjs
node projects/somnus/somnus.mjs projects/somnus/data/somnus.json
```
