# Flashpan

A **flintlock flash-pan / priming-pan booth** — warm brass pan, iron lockplate, damp priming powder, flint and steel sparks that flash without discharging the main charge; warm brass/iron + damp-powder palette; fonts **Newsreader** (display) + **Manrope** (body) + **JetBrains Mono** (mono) — for a real Claude Code defect: **SCHEDULED TASKS STAMP `lastRunAt` BUT NEVER LAUNCH A SESSION (NO ERROR, NO FAILED-RUN STATE).**

Primary:

- [anthropics/claude-code#93015](https://github.com/anthropics/claude-code/issues/93015) (OPEN, bug, platform:macos, area:routines). Title: `Scheduled tasks stamp lastRunAt but never launch a session (no error, no failed-run state)`. Authored 2026-09-09T06:39:28Z by sathishrao02. Product: Claude Code desktop app (Code tab), macOS 15.6 (Darwin 25.6.0).

16:50 flashpan: a flintlock flash-pan / priming-pan booth that should keep `lastRunAt` **primed** (stamp only when a session transcript is born by birth time); instead the pan powder **flashes** — `lastRunAt` fresh, enabled true, stamp-clusters across differently-scheduled tasks within <1s, zero new session births, Run now launches nothing, no error/failed-run — score flashed or admit primed.

Score flashed or admit primed.

Idle word: **primed** (HOLD: `lastRunAt` advances only when a new session transcript is actually created — birth-time proof; failed launches leave a failed-run state / notification; Run now and cron share the same honest path). Seeded word: **flashed** / #93015 (`lastRunAt` fresh, enabled true, `nextRunAt` sensible, clusters of stamps across differently-scheduled tasks within <1s, zero new session births by birth time; Run now also launches nothing; no error/notification/failed-run). Path word: **flashpanned**. Never idle flashed / sheared / unretracted / emended / palinoded / ephemeral / voided / fouled / cold / banked / secateured.

Phrase: **a flashpan that stamps lastRunAt without birthing a session is not a run — it is damp powder still believed fired. Score flashed or admit primed.**

- **primed** = IDLE: HOLD; `lastRunAt` advances only with a real session birth; failed launches leave a failed-run / notification; Run now and cron share the same honest path
- **flashed** = #93015 seeded path: `lastRunAt` stamps; no session born; stamp-cluster <1s; Run now launches nothing; registry looks healthy
- **flashpanned** = path word: a flash-pan that stamps `lastRunAt` without birthing a session
- **lastRunAt-false-signal** = the stamp is currently the strongest false signal in the system
- **zero-births** = daily session births 8–12 through 5 Sep; 6–7 Sep: 0; 9 Sep: 0 while `lastRunAt` kept moving
- **stamp-cluster** = differently-scheduled tasks stamp within ~0.43s of each other — silent dispatch retry, not real work
- **run-now-same-fail** = manual Run now produces no session, no side effect, no transcript — session launcher broken, not just cron
- **birth-time-not-mtime** = session transcripts at `~/.claude/projects/<project>/<uuid>.jsonl`; only `stat -f '%SB'` counts real launches; mtime/`find -newermt` misleads (GNU-only / resumes look new)
- **no-failed-run-state** = no error, no notification, no failed-run indicator anywhere
- **silent-healthy-registry** = `enabled: true`, sensible `cronExpression`, moving `nextRunAt`, fresh `lastRunAt`
- **restart-window-only** = 8 Sep: 6 births only within 25 minutes of an app restart; restart alone is not a permanent fix
- **has-repro** = concrete birth-time census + stamp cluster + Run now twice (8 and 9 Sep)
- **hold** = HOLD alias for idle primed
- **cousins** = cite-only #91527 #80671 #92429 #89936 #90215 #72195 #92972 — do not clone
- **fixtures** = row list for the flashpan booth
- **walk** = published lastRunAt-false-signal → zero-births → stamp-cluster → run-now-same-fail → no-failed-run-state → silent-healthy-registry → restart-window-only → birth-time-not-mtime

Verdicts: primed, flashed, lastRunAt-false-signal, zero-births, stamp-cluster, run-now-same-fail, birth-time-not-mtime, no-failed-run-state, silent-healthy-registry, restart-window-only, has-repro, hold, flashpanned, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the pan is **flashed** or already **primed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): session launcher fails closed after uptime while the scheduler still stamps `lastRunAt` as success. Invite verify against #93015 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93015](https://github.com/anthropics/claude-code/issues/93015)
- Cite-only: [anthropics/claude-code#91527](https://github.com/anthropics/claude-code/issues/91527) (scheduler skips / reports success (`lastRunAt`) with no session)
- Cite-only: [anthropics/claude-code#80671](https://github.com/anthropics/claude-code/issues/80671) (Cowork `lastRunAt` advances without session executing)
- Cite-only: [anthropics/claude-code#92429](https://github.com/anthropics/claude-code/issues/92429) (marks completed without actually running)
- Cite-only: [anthropics/claude-code#89936](https://github.com/anthropics/claude-code/issues/89936) (INVERSE class: `lastRunAt` never updates while `nextRunAt` advances — silent never-executes)
- Cite-only: [anthropics/claude-code#90215](https://github.com/anthropics/claude-code/issues/90215) (silent fail with no `lastRunAt`)
- Cite-only: [anthropics/claude-code#72195](https://github.com/anthropics/claude-code/issues/72195) (CLOSED — same shape historically)
- Cite-only: [anthropics/claude-code#92972](https://github.com/anthropics/claude-code/issues/92972) (DIFFERENT: task runs but session never registers with Remote Control / mobile — Flashpan is no session born at all)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, platform:macos, area:routines
- Product: Claude Code desktop app (Code tab), macOS 15.6 (Darwin 25.6.0)
- First observed 2026-09-06; still occurring 2026-09-09
- Scheduled tasks fire on time and update `lastRunAt`, but no session is created and no work is done
- No error, no notification, no failed-run state
- From the registry the tasks look perfectly healthy — `enabled: true`, sensible `cronExpression`, a moving `nextRunAt` and a fresh `lastRunAt`
- A manual **Run now** from the sidebar fails in exactly the same way
- Session transcripts live at `~/.claude/projects/<project>/<uuid>.jsonl`; birth time (`stat -f '%SB'`) counts real launches; mtime / `find -newermt` misleads (GNU-only / resumes look new)
- Daily session births 8–12 through 5 Sep; 6–7 Sep: 0; 8 Sep: 6 only within 25 minutes of an app restart; 9 Sep: 0 while `lastRunAt` kept moving
- On 9 Sep, stamp clusters: `04:11:21.158Z` task A (scheduled 07:07 local), `04:11:21.160Z` task B (scheduled 09:35 local), `04:11:21.586Z` task C (scheduled 07:07 local) — three differently-scheduled tasks within ~0.43s
- Later the same morning: `04:27:19.860Z` A/B/C again; `04:43:19.871Z` D/E; `04:58–04:59Z` F/G — roughly ten silent retries, launching nothing
- Ruled out (each measured): empty/broken task files; machine sleep; stale session reattach; app restart alone as a permanent fix
- The only period that worked in four days was the 25 minutes after an app restart (including a deliberate one-per-minute probe)
- Impact: eight scheduled tasks stopped — daily reporting, database integrity checks, CI monitoring; three days lost before diagnosis
- Asks: (1) do not stamp `lastRunAt` unless a session was actually created; (2) surface a failed-run state or notification; (3) confirm or deny whether an open session can block a scheduled launch

Problem found: A FLASHPAN THAT STAMPS `lastRunAt` WITHOUT BIRTHING A SESSION IS NOT A RUN — IT IS DAMP POWDER STILL BELIEVED FIRED.

Why this solution: a diagnostic flintlock flash-pan booth for the primed → flashed drift, so a reader can pin idle primed, load the #93015 flashed path, and score flashpanned / lastRunAt-false-signal / zero-births / stamp-cluster / run-now-same-fail / birth-time-not-mtime / no-failed-run-state / silent-healthy-registry / restart-window-only / has-repro against the published facts.

## Why not a clone

This is specifically: **SCHEDULED TASKS STAMP `lastRunAt` BUT NEVER LAUNCH A SESSION (NO ERROR, NO FAILED-RUN STATE).**

**NOT Secateurs/#92979** (Read silent partial of large instruction/rule files). Different paradigm.

**NOT Palinode/#92998** (MEMORY.md bottom truncation of newest corrections). Different paradigm.

**NOT Ferrule/#92968** (Desktop MCP OAuth hardcoded TCP 53280). Different paradigm.

**NOT Interlock/#92976** (UI-warmed idle session interlocks cwd against Dispatch). Different paradigm.

**NOT Shibboleth/#92966**. **NOT Hangfire**. **NOT Homestead / Epitaph / Recension / Mirage / Remora / Procrustes / Cadastre / Rubric / Sheave / Mailslot / Ukase / Scabbard / Deadletter / Detent / Oubliette / Ephemera** paradigms.

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **`lastRunAt` stamps as success while zero session transcripts are born by birth time; Run now fails the same way; the registry looks healthy.**

Do NOT rename this product Secateurs, Palinode, Ferrule, Interlock, Hangfire, Frizzen, or any existing catalog slug.
Do NOT reuse idle flashed / sheared / unretracted / emended / palinoded / ephemeral / voided / fouled / cold / banked / secateured.
Do NOT reuse Bitter + Figtree (Secateurs). Do NOT reuse Cardo + Nunito Sans (Palinode). Do NOT reuse Oswald + Source Sans 3 + Share Tech Mono (Ferrule). Do NOT reuse Bodoni Moda + Commissioner + Space Mono (Frizzen — also flintlock, different defect: UserPromptSubmit hook never invoked).

Different surface: scheduled-task session launcher stamps `lastRunAt` with no session birth vs Read silent partial / MEMORY.md write-path bottom truncation / Desktop OAuth port clamp / plant-floor cwd interlock / queued `/compact` hangfire / frizzen hook miss.

Product name stays **Flashpan**. Name/slug `flashpan` unused in catalog.json (242 products before this ship; Secateurs is #242).

Different UI: flintlock flash-pan / priming-pan booth / warm brass pan / iron lockplate / damp powder / flint-steel sparks that flash without discharge. Newsreader / Manrope / JetBrains Mono. NOT garden pruning bench. NOT scriptorium wax/vellum. NOT metalwork ferrule gunmetal/cyan. NOT plant interlock. NOT frizzen walnut/Bodoni.

Different verbs: Score the flash, Pin idle primed, Pin seeded flashed, Admit primed, Load fixtures, Reset to primed.

Different idle: **primed**. Different #93015 seeded path: **flashed**. HOLD: **primed**. ALARM: **flashed** / **flashpanned** / **lastRunAt-false-signal** / **zero-births** / **stamp-cluster** / **run-now-same-fail** / **birth-time-not-mtime** / **no-failed-run-state** / **silent-healthy-registry** / **restart-window-only** / **has-repro** / **cousins** / **fixtures**. Path: **flashpanned**.

## How to score

```bash
node --test projects/flashpan/flashpan.test.mjs
node projects/flashpan/flashpan.mjs projects/flashpan/data/93015.json
node projects/flashpan/flashpan.mjs projects/flashpan/data/primed.json
echo '{"seed":"flashed"}' | node projects/flashpan/flashpan.mjs
```

Open the living card at `projects/flashpan/index.html` (or the live path `/flashpan/`). Buttons: Score the flash, Pin idle primed, Pin seeded flashed, Admit primed, Load fixtures, Reset to primed. Toggle `lastRunAt` stamped / session born / failed-run surfaced / stamp cluster / Run now launched / error-notification — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/flashpan/
- Folder: `projects/flashpan/`
