# Plimsoll

A **dry-dock Plimsoll / load-line draught board** — hull chalk marks, iron Plimsoll disc, teak batten, tide-stained steel, harbour lamp amber; Libre Baskerville + Nunito Sans + IBM Plex Mono — for a real Claude Code defect: **AUTO-COMPACT APPEARS TO DECIDE FROM THE PREVIOUS TURN'S TOKEN COUNT, SO RE-INJECTED INSTRUCTION FILES OVERFLOW THE WINDOW INSTEAD OF COMPACTING.** Resume re-reads `CLAUDE.md` and `.claude/rules/*.md` into the request. The auto-compact check appears to trust the **previous turn's reported token count**, which cannot include what this turn is about to add. The client sees headroom; the API sees a request over the limit → 400 `prompt is too long` rather than compaction. When the load line is evaluated against the request as it will actually be sent (**trimmed**), that is the hold path.

Primary:

- [anthropics/claude-code#92434](https://github.com/anthropics/claude-code/issues/92434) (OPEN, bug, has repro, platform:macos, area:core). Title: `[BUG] Auto-compact appears to decide from the previous turn's token count, so re-injected instruction files overflow the window instead of compacting`. Filed 2026-09-06T04:27:48Z. Reporter: willmcginnis. Claude Code 2.1.261 (also 2.1.257; 2.1.263 untested). Opus 1M-window. Anthropic API. macOS. Terminal.app.

06:50 plimsoll: a dry-dock Plimsoll load-line board that should re-chalk the draught against the cargo about to sail but instead trusts the previous turn's mark so resume re-injected CLAUDE.md/rules push the hull over the window with no auto-compact (#92434). Score overladen or admit trimmed.

Idle word: **overladen** (sailed on yesterday's chalk mark while a fresh hold of instructions was already aboard). Seeded state: **trimmed** / #92434 — load line evaluated against the request as it will actually be sent. Never idle as defocused, sharp, skimmed, intact, mislabeled, scoped, saturating, vented, preheating, lit, hangfired, executed, thrashing, responsive, leaking, excised, remanent, or rewritten.

**Plimsoll** = the load-line disc and draught marks on a hull. Auto-compact should re-chalk the draught against the cargo about to sail. Here the board trusts yesterday's mark.

- **overladen** = IDLE: sailed on yesterday's chalk mark while a fresh hold of instructions was already aboard
- **trimmed** = seeded word: load line evaluated against the request as it will actually be sent
- **stale-previous-count** = auto-compact appears to consult the previous turn's reported token count (~646k)
- **reinject-jump** = resume fail `prompt is too long: 1043785 tokens > 1000000 maximum` (~398k jump; instruction set largest share but not all)
- **no-reactive-compact** = client sees headroom; API sees over-limit → 400 rather than compaction
- **manual-compact-ok** = `/compact` immediately afterwards succeeds — compaction was available
- **cousins** = cite-only #91709 #85489

Verdicts: overladen, trimmed, stale-previous-count, reinject-jump, no-reactive-compact, manual-compact-ok, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a resume turn would sail **overladen** on a stale previous-turn mark or already **trimmed**. Fixtures use the issue's token counts, error string, 200k-window threshold, and pathless-rules repro only.

Hypothesis only (NON-BINDING): auto-compact consults previous-turn reported tokens and misses harness reinjection on resume. Verify nothing — encode issue facts only. Encoded from the issue body only. Do not invent runtime source claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92434](https://github.com/anthropics/claude-code/issues/92434)
- Cousins cite-only (NOT primary): [anthropics/claude-code#91709](https://github.com/anthropics/claude-code/issues/91709), [anthropics/claude-code#85489](https://github.com/anthropics/claude-code/issues/85489)

What happened (from the issue — do not invent):

- Resuming a session whose project carries a large instruction set can fail immediately with `prompt is too long`, with no compaction attempted, even though the session was below the auto-compact threshold on the previous turn. Running `/compact` by hand right afterwards succeeds and the session continues normally, so compaction was available. It just did not happen on its own.
- Resume re-reads and re-injects `CLAUDE.md` and `.claude/rules/*.md` into the request. Where the instruction set is large, that is a substantial amount of content added to a turn that has not been measured yet.
- The auto-compact decision appears to be made from the previous turn's reported token count, which cannot include what this turn is about to add. The client therefore sees headroom, the API sees a request over the limit, and the turn ends in a 400 rather than in a compaction.
- Observed on several sessions on 1M-window Opus models. Every failing turn carries a large re-injected instruction attachment while the turns that succeed do not.
- Instruction files are the largest single component of what gets re-added on resume, but not the only one; in the clearest case they account for roughly a third of the jump. The trigger is not simply "instruction set exceeds remaining headroom"; no exact threshold is given.
- Two shapes get large enough to matter: many small files accumulated under `.claude/rules/`, or a single `CLAUDE.md` grown by appends over months. The reporter has only seen the failure with a combination of both, and is not claiming either reaches the failing size alone.
- Error: `prompt is too long: 1043785 tokens > 1000000 maximum`. Previous turn reported roughly 646k tokens used, so the resume added around 398k.
- Environment: Claude Code 2.1.261 (also 2.1.257; 2.1.263 untested). Opus. Anthropic API. macOS. Terminal.app. Reporter: willmcginnis. Filed 2026-09-06T04:27:48Z. Labels: bug, has repro, platform:macos, area:core. OPEN.
- Repro (200k-window cheaper starting point): 40 pathless rules under `.claude/rules/` (500 filler lines each; no `paths:` frontmatter — unconditional load); work until `/context` is close under the auto-compact threshold (reported at roughly 167k on a 200k window); exit; resume (`claude --resume` or `claude --continue`); send any short message → `prompt is too long`, no compaction; `/compact` then succeeds immediately.
- Flagged: seen after session restarts and after re-authentication; #91709 reports the same symptom after `--resume`. Which reload paths re-inject the instruction files is not isolated.
- Suggested remedies from the issue (assay rails, not claimed implemented code):
  1. Evaluate the compaction decision against the request as it will actually be sent
  2. Failing that, a `prompt is too long` on a request the harness itself inflated should route into reactive compaction and be retried
  3. Independently: when a request is rejected for length, report how much of it was injected instructions

Problem found: resume re-injects instruction files → auto-compact appears to trust the previous turn's mark → 1043785 > 1000000 with no compaction → manual `/compact` then works.

Why this solution: a diagnostic scorer for the overladen → trimmed draught chain, so a reader can admit idle overladen, pin seeded trimmed, and score stale-previous-count / reinject-jump / no-reactive-compact / manual-compact-ok / cousins against the published facts.

## Why not a clone

This is specifically: **stale auto-compact threshold on resume reinjection — previous-turn token count cannot include CLAUDE.md / `.claude/rules/*.md` about to be added, so the hull goes over the window with no auto-compact.**

NOT Hangfire/#92478 — queued mid-turn `/compact` demoted to a plain prompt (`promptSource:"queued"`). Plimsoll is stale auto-compact **threshold** on resume reinjection, not slash demotion. #92434 was cite-only cousin on Hangfire; now primary here with a different paradigm.
NOT Watchdog/#92424 — compaction-nap kill.
NOT Diopter/#92524 — scratchpad UUID cache bust.
NOT Decant/#92515 — login-shell env skim.
NOT Thrash/#88257 — RSS/event-loop stall.
NOT Catachresis/#92518 — MCP 403 `insufficient_scope` stamped as token expired.
NOT Bourdon/#92510 — Cowork Apple Virtualization host fd climb.
NOT Glowplug/#85050 — Windows silent startup preheat gaps.

Stay OFF all prior catalog slugs/paradigms: Diopter / Decant / Catachresis / Bourdon / Glowplug / Hangfire / Thrash / Muzzle / Hysteresis / Hardstand / Rheostat / Watchdog and every existing slug in catalog.json.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle defocused / sharp / skimmed / intact / mislabeled / scoped / saturating / vented / preheating / lit / hangfired / executed / thrashing / responsive / leaking / excised / remanent / rewritten.
Do NOT reuse seeded sharp / intact / scoped / lit / executed / responsive / excised / rewritten / vented.

Different surface: stale auto-compact threshold on resume reinjection vs queued slash demotion / compaction-nap kill / UUID-in-system cache miss / PATH skim / first-prompt stall.

Product name stays **Plimsoll**. Name/slug `plimsoll` confirmed unused in catalog.json (189 products). The word appears only as a reserved stay-off token in older Tally/Clew word lists — not as a shipped product.

Different UI: dry-dock Plimsoll / load-line draught board / hull chalk marks / iron Plimsoll disc / teak batten / tide-stained steel / harbour lamp amber. Libre Baskerville / Nunito Sans / IBM Plex Mono. NOT Petrona/Outfit/Fragment Mono (Diopter). NOT Spectral/Karla/Roboto Mono (Decant). NOT Fraunces/Manrope/JetBrains Mono (Catachresis). NOT Anybody/Source Sans/JetBrains (Hangfire). NOT Bebas/Barlow. NOT optical diopter tray, NOT gravity cellar, NOT lexicographer stamps, NOT bourdon pressure, NOT glow-plug bay, NOT hangfire chronograph.

Different verbs: admit overladen, pin seeded trimmed, score overladen vs trimmed, load #92434 fixture, score the draught.

Different idle: **overladen**. Different seeded: **trimmed**. HOLD: **trimmed**. ALARM: **overladen** / **stale-previous-count** / **reinject-jump** / **no-reactive-compact** / **manual-compact-ok** / **cousins**.

Cousins cite-only (NOT primary):

- [#91709](https://github.com/anthropics/claude-code/issues/91709) — same symptom after `--resume` but the error string ends `auto-compact is off`, so nothing there was expected to compact. Primary stays #92434.
- [#85489](https://github.com/anthropics/claude-code/issues/85489) — same re-injection with the opposite outcome: compaction firing repeatedly rather than not at all. Primary stays #92434.

The issue also names #91385, #91232, #86699, #86507 as neighbourhood (warning / memory-cap / Bedrock sanitized 400). They are not this product's cousins.

#92434 was cite-only cousin on Hangfire; now primary here with a different paradigm.

## Live catalog path

`/plimsoll/` is this static dry-dock load-line scoring assay. Path `https://hermes-playground-green.vercel.app/plimsoll/` and subdomain `https://plimsoll.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `06:50 Sydney · plimsoll · catalog #190 · #92434`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **overladen** → yesterday's chalk mark; fresh hold already aboard.
2. Seeded **trimmed** → load line evaluated against the request as it will actually be sent.
3. Diagnostic **stale-previous-count** → decision appears made from previous turn ~646k.
4. Diagnostic **reinject-jump** → 1043785 > 1000000; jump around 398k.
5. Diagnostic **no-reactive-compact** → 400 `prompt is too long`; no compaction attempted.
6. Diagnostic **manual-compact-ok** → `/compact` immediately afterwards succeeds.
7. Diagnostic **cousins** → #91709 #85489 cite-only.
8. Assay UI: hull chalk marks, iron Plimsoll disc, teak batten, tide-stained steel, harbour lamp amber, draught ledger.
9. Stay-off strip: Hangfire delayed-primer / Watchdog kennel / Diopter trial-lens / Decant cellar / CRT paging-storm. Primary stays #92434.
10. **Score the draught** walks the probe ticket and lights chips on the board. Chip-switch every verdict. Paste or drop JSON. Dock simulator chips rewrite the mark (overladen / trimmed / stale / jump).

## How to score

Open `projects/plimsoll/index.html` in a browser, or serve the repo root and visit `/plimsoll/` (Vercel rewrite → `/projects/plimsoll`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/plimsoll/hook/plimsoll.test.mjs
```

Empty paste scores the idle **overladen** ticket if you admit overladen. Paste a probe on the page or drop a fixture from `data/`. The living page admits **overladen** / stale previous-turn mark / #92434.

## Hook

`projects/plimsoll/hook/` scores a probe `{ seed, overladen, trimmed, previousTurnTokens, resumeTokens, promptTooLong, compactAttempted, manualCompactOk }` and returns `{ verdict, reasons[], overladen, trimmed, chips[], draught }`. See `hook/README.md`.

```bash
node projects/plimsoll/hook/index.mjs projects/plimsoll/data/92434.json
echo '{"seed":"trimmed","trimmed":true,"evaluatedAgainstSent":true}' | node projects/plimsoll/hook/index.mjs
```

`trimmed` is true ONLY when the verdict is trimmed (the load line is evaluated against the request as it will actually be sent). Seeded 92434 numbers must produce overladen / `trimmed=false` on the resume 400 path. An overladen hull is never the hold path.
