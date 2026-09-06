# Watchdog

A **night kennel / dog-watch / stall-watchdog lab** — coal slats, brass collar tags, leash rails, progress-silence chronograph, compaction-nap vs bite timeline, six-retry kennel cards — Bricolage Grotesque + Karla + Fragment Mono — for a real Claude Code defect: **INSIDE A WORKFLOW-TOOL RUN, THE PER-AGENT STALL WATCHDOG (`stalled — no progress for 180000ms`) FIRES WHILE THE AGENT IS AUTO-COMPACTING ITS CONTEXT.** A watchdog that bites during the silent compaction nap is not protecting the flock — it is already choking. Score the pause or admit the agent already retried.

Primary:

- [anthropics/claude-code#92424](https://github.com/anthropics/claude-code/issues/92424) (OPEN, bug, has-repro, platform:macos, area:core, area:agents). Title: `Workflow stall watchdog kills agents during auto-compaction`. Filed 2026-09-06. Reporter: salah-oumla.

14:50 watchdog: a watchdog that bites during the silent compaction nap is not protecting the flock — it is already choking. Score the pause or admit the agent already retried.

Idle word: **choking**. Seeded state: **retried** / #92424 — Workflow stall watchdog fires during auto-compaction; six from-scratch retries of the same prompt. Never idle as miscast, inherited, unguided, dropped, strobing, stolen, dawnlocked, or misaimed.

**Watchdog** is kennel work. Compaction is a runtime action. Here the 180s bite treats the silent nap as a stall, then the runtime retries the same prompt into the same compaction band six times. Score whether a pause (scored vs streamed-survival vs sibling-survivors vs compaction-nap vs six-retry vs no-knob) would stay choking, scored, or leave the agent already retried.

- **choking** = IDLE: silent compact; 180s bite already set
- **retried** = seeded word: six from-scratch retries; same material; same death
- **compaction-nap** = 150–205s silent compact at 180K–350K; nothing counted as progress
- **six-retry** = six identical attempts; 0.78M–1.17M cumulative tokens
- **no-knob** = `CLAUDE_CODE_AUTO_COMPACT_WINDOW` moves trigger; 180s and retry count have no knob
- **scored** = contrast hold: watchdog treats compaction as progress (or pauses)
- **streamed-survival** = contrast hold: Write 35–55KB 182–288s not killed
- **sibling-survivors** = contrast hold: 166 sibling naps survived
- **ruled-out-or-workarounds** = ordinary 3s turns; Write survival; bounding reads is the only dodge

Verdicts: choking, retried, compaction-nap, six-retry, no-knob, scored, streamed-survival, sibling-survivors, ruled-out-or-workarounds.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a Workflow compaction nap would leave the kennel choking or already retried. Fixtures use the issue's 33/751 stall set, sibling survivor timings, streamed-Write contrast, six-retry loop, and the no-knob workaround only.

Hypothesis only (NON-BINDING): The workflow per-agent 180s no-progress timer does not pause or tick during auto-compaction, so silent compaction that takes ~median 156–160s (p90 into the bite window) looks like a stall; retries replay the same prompt into the same compaction band. Verify against issue evidence only. Discard if issue evidence disagrees. Encoded from the issue body only. Do not invent runtime source claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92424](https://github.com/anthropics/claude-code/issues/92424)

What happened (from the issue — do not invent):

- Environment: Claude Code **2.1.252, 2.1.257 and 2.1.260** (native binary); macOS **25.5**. Headless `claude -p` driver, `--output-format stream-json`, `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0`. Workflow scripts with `parallel()` fan-outs of 7 to 15 Sonnet 5 / Opus 5 agents, `--allowedTools` explicit.
- Inside a Workflow-tool run, the per-agent stall watchdog (`stalled — no progress for 180000ms`) fires while the agent is auto-compacting its context.
- Compaction at 180K to 350K tokens takes 150 to 205 seconds and streams nothing the watchdog counts as progress.
- The runtime then retries the agent from scratch up to six times; each retry re-reads the same material, reaches the same context size, compacts, and dies again.
- Data: 751 workflow agent transcripts from one project, 2026-08-31 to 2026-09-02. 33 agents failed with the stall message. In all 33 the last persisted record is a tool result and the interrupt lands 179 to 180 s later with no assistant output in between.
- Final-attempt context of those 33: 160K to 358K tokens; 28 of 33 within 185K to 195K.
- 166 auto compactions that survived in sibling agents: last record to `compact_boundary` median 156 s, p90 176 s, max 180 s; to the first post-compaction assistant record median 160 s, p90 183 s, max 205 s. Context at compaction: median 224K.
- Ordinary completed turns at 185K to 200K context: median 3 s, p90 7 s. Completed `Write` calls of 35KB to 55KB took 182 to 288 s and were not killed, so streamed output does count as progress.
- Every stalled agent shows six attempts in the workflow state file, 0.78M to 1.17M cumulative tokens each.
- Expected: Compaction is a runtime action. The watchdog should treat it as progress (or pause during it), and a stall retry should not restart with an identical prompt six times.
- Workarounds: `CLAUDE_CODE_AUTO_COMPACT_WINDOW` moves the compaction trigger but the 180 s limit and the retry count have no knob. Bounding each agent's reads below the compaction band avoids the kill.

## Why not a clone

This is specifically: **Workflow per-agent 180s stall watchdog bites a silent auto-compaction nap, then retries the identical prompt six times.**

NOT Understudy/#92426 — Agent() ignores the subagent definition under dispatch. Watchdog is not a dressing-room.
NOT Fairlead/#92403 — URI scheme `file://`-only remote Explorer drop. Watchdog is not a hawse-pipe.
NOT Stroboscope/#92395 — Desktop Code-tab Terminal panel flicker + focus steal. Watchdog is not an optics strobe bench.
NOT Heliostat/#92389 — theme auto DECSET 2031. Watchdog is not an observatory heliostat.
NOT Lethe/#92335 — Chrome silent re-auth. Watchdog is not an underworld ferry.
NOT Frizzen/#92353 — UserPromptSubmit listed-but-never-invoked. Watchdog is not a flintlock desk.
NOT Nixie/#92383 — auto-mode send_message 45s no-ack settle. Watchdog is not a USPS nixie desk.
NOT Embrasure/#92365 — sandbox denyRead fail-open. Watchdog is not a battlement.
NOT Elision/#92347 — summarize-up-to-here drops summaries. Watchdog is not a blue-pencil folio.
NOT Graft/#92354 — plugin-cache copy-forward. Watchdog is not an orchard grafting bench.
Do NOT name this Fetch, Sluice, Parison, Understudy, Fairlead, Stroboscope, Heliostat, or any existing catalog slug.
Do NOT reuse idle miscast / seeded inherited / unguided / dropped / strobing / stolen / dawnlocked / misaimed.

Different surface: Workflow 180s stall-watchdog vs silent auto-compaction vs those.

Cousins cite-only (NOT primary):

- [#85265](https://github.com/anthropics/claude-code/issues/85265) OPEN — async 600s stall
- [#75036](https://github.com/anthropics/claude-code/issues/75036) OPEN — no recovery path
- [#79017](https://github.com/anthropics/claude-code/issues/79017) OPEN — 180s hard-coded / stallMs
- [#90092](https://github.com/anthropics/claude-code/issues/90092) OPEN — six identical stalls

Product name stays **Watchdog**. Do not rename to Understudy, Fairlead, Stroboscope, Heliostat, Lethe, Frizzen, Nixie, Embrasure, Elision, Graft, Fetch, Sluice, or any existing catalog slug. Name/slug `watchdog` confirmed unused in catalog.json.

Different UI: night kennel / dog-watch / stall-watchdog lab — coal slats, brass collar tags, leash rails, progress-silence chronograph, compaction-nap vs bite timeline, six-retry kennel cards. Bricolage Grotesque + Karla + Fragment Mono. NOT Syne / Manrope / IBM Plex Mono (Stroboscope optics — do not reuse Syne). NOT Bodoni Moda / Source Sans 3 / IBM Plex Mono (Understudy dressing-room). NOT Fraunces / Outfit / Fragment Mono as a trio (Fairlead hawse — Fragment Mono here is paired with Bricolage Grotesque + Karla, not Fraunces + Outfit). NOT Bricolage Grotesque / Sora / JetBrains Mono (Heliostat — Bricolage Grotesque here is paired with Karla + Fragment Mono, not Sora). Stay OFF dressing-room call-board / hawse-pipe / optics strobe / rooftop observatory / underworld ferry / flintlock lockplate / postal pigeonholes / battlement merlons / blue-pencil folio / orchard cambium.

Different verbs: Score the pause, pin idle choking, pin seeded retried, admit the agent already retried, flip nap vs bite vs six-retry vs streamed Write, load fixtures, reset to scored.

Different idle: **choking**. Different seeded: **retried**. Contrast: **scored** / **streamed-survival** / **sibling-survivors**.

## Live catalog path

`/watchdog/` is this static night-kennel scoring assay. Path `https://hermes-playground-green.vercel.app/watchdog/` and subdomain `https://watchdog.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `14:50 / hermes catalog #174 / #92424`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **retried** — six from-scratch retries; same prompt; same death.
2. Idle **choking** → silent compact; 180s bite already set.
3. Contrast **scored** → watchdog treats compaction as progress (or pauses).
4. Contrast **streamed-survival** → Write 35–55KB 182–288s not killed.
5. Contrast **sibling-survivors** → 166 sibling naps survived.
6. Failure **compaction-nap** → 150–205s silent; nothing counted as progress.
7. Failure **six-retry** → identical prompt six times.
8. Failure **no-knob** → 180s limit and retry count have no knob.
9. Assay UI: kennel slats, collar tags, leash rails, chronograph, nap/bite timeline, six kennel cards.
10. Stay-off strip: Understudy / Fairlead / Stroboscope / Heliostat / Lethe / Frizzen / Nixie / Embrasure / Elision / Graft. Primary stays #92424.
11. **Score the pause** walks the probe ticket and lights chips on the board. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the kennel (nap / bite / six-retry / streamed Write).

## How to score

Open `projects/watchdog/index.html` in a browser, or serve the repo root and visit `/watchdog/` (Vercel rewrite → `/projects/watchdog`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **choking** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **retried** / six identical stalls during auto-compaction / 180s bite with no assistant output.
