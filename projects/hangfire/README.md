# Hangfire

A **delayed-primer / hangfire chronograph bay** — cordite charcoal, brass and copper faceplates, amber delay fuse, slate powder marks — Anybody + Source Sans 3 + JetBrains Mono — for a real Claude Code defect: **`/COMPACT` QUEUED DURING A RUNNING TURN IS SOMETIMES SENT TO THE MODEL AS A PLAIN PROMPT (`promptSource:"queued"`) INSTEAD OF EXECUTING — 2.1.257.** A queued slash command should fire as `/compact` at the turn boundary (`compact_boundary` + command stub). On 2.1.257 it sometimes hangs through the turn, then fires as ordinary prose (**hangfired**). When the command actually runs (**executed**), that is the hold path.

Primary:

- [anthropics/claude-code#92478](https://github.com/anthropics/claude-code/issues/92478) (live, bug, has repro, platform:macos, area:tui, area:core). Title: `/compact queued during a running turn is sometimes sent to the model as a plain prompt (promptSource:"queued") instead of executing — 2.1.257`. Filed 2026-09-06T12:55:06Z. Reporter: vadimzak. Claude Code 2.1.257.

00:50 hangfire: a delayed-primer chronograph bay that should fire queued `/compact` as a slash command at the turn boundary but sometimes demotes it to a plain prompt (`promptSource:"queued"`) — prose "summary", no `compact_boundary`. Score hangfired or admit executed.

Idle word: **hangfired** (queued `/compact` demoted to a plain prompt). Seeded state: **executed** / #92478 — command stub + `compact_boundary`. Never idle as thrashing, leaking, remanent, rewritten, cleared, maxed, mute, inherited, freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, cold, voided, alongside, shed, latched, quiet, bound, open, sostenutoed, or frozen.

**Hangfire** is a delayed-primer chronograph bay. The queued slash command should fire as `/compact`. Instead the primer hangs, then the round fires as ordinary prose.

- **hangfired** = IDLE: queued `/compact` dispatched as a plain user prompt at the turn boundary
- **executed** = seeded word: command stub + `compact_boundary`
- **promptSource-queued** = failing user row carries `"promptSource":"queued"`; executed echoes never carry `promptSource`
- **plain-prompt-path** = fail path next attachment is `total_tokens_reminder` (executed path is `file-history-snapshot`)
- **missing-compact-boundary** = no `compact_boundary`; model writes a prose "summary"
- **long-args-suggestive** = all 7 failures `/compact` text ≥ 840 chars; most executed queued ≤ 787 (one executed at 1606)
- **idle-prompt-ok** = idle prompt `/compact` always executes (6/6 on 2.1.257)
- **cousins** = cite-only #85697 #76875 #92434 #92424 #90711

Verdicts: hangfired, executed, promptSource-queued, plain-prompt-path, missing-compact-boundary, long-args-suggestive, idle-prompt-ok, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a queued `/compact` would hangfire as a plain prompt or already execute. Fixtures use the issue's JSONL shapes, rate table, and length note only.

Hypothesis only (NON-BINDING): queued slash dispatch may skip command parsing when args are long / when `promptSource` stays `"queued"`, taking the plain prompt path (`total_tokens_reminder`) instead of the command path (`file-history-snapshot` → `compact_boundary`). Verify nothing — encode issue facts only. Encoded from the issue body only. Do not invent runtime source claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92478](https://github.com/anthropics/claude-code/issues/92478)
- Cousins cite-only (NOT primary): [anthropics/claude-code#85697](https://github.com/anthropics/claude-code/issues/85697), [anthropics/claude-code#76875](https://github.com/anthropics/claude-code/issues/76875), [anthropics/claude-code#92434](https://github.com/anthropics/claude-code/issues/92434), [anthropics/claude-code#92424](https://github.com/anthropics/claude-code/issues/92424), [anthropics/claude-code#90711](https://github.com/anthropics/claude-code/issues/90711)

What happened (from the issue — do not invent):

- On Claude Code 2.1.257, `/compact <instructions>` typed while a turn is running (so it is queued) is sometimes dispatched at the turn boundary as a **plain user prompt** instead of being executed as the slash command. The model then answers the text (writes a prose "summary"), no compaction happens, and nothing tells the user or an automation that the command was dropped.
- On 2.1.222 the same flow executed the queued `/compact` every time (30/30).
- Environment: Claude Code 2.1.257 (swallowed cases); 2.1.222 never reproduced it (0/30). macOS 15.6.1, terminal TUI (cmux), interactive session, `claude --resume` sessions included. `/compact` text pasted into the prompt line while the assistant was mid-turn, followed by Return; instructions were 840–1588 chars in the failing cases. Reporter: vadimzak. Filed 2026-09-06T12:55:06Z. Labels: bug, has repro, platform:macos, area:tui, area:core.
- Expected: at the turn boundary the queued `/compact` executes (command stub row, `compact_boundary`, compact summary).
- Actual (7 of 36 queued cases on 2.1.257): the queued text is sent to the model as an ordinary user message. The model replies with a prose summary; no `compact_boundary`, no compaction.
- Every failing case has the same JSONL shape. The `/compact` user row carries `"promptSource":"queued"`; executed echoes never carry `promptSource` (29/29 on 2.1.257, 30/30 on 2.1.222). The queued-command attachment is absent in both classes on 2.1.257.
- Fail path next attachment is `total_tokens_reminder`; executed path is `file-history-snapshot` then `compact_boundary` + command stub.
- From 81 local `/compact` rows: idle prompt → executed 5/5 on 2.1.222 and 6/6 on 2.1.257 (2.1.202: 6/6). Queued mid-turn → executed 30/30 on 2.1.222 and 29/36 on 2.1.257. Queued mid-turn → plain prompt 0 on 2.1.222 and 7 on 2.1.257.
- All 7 failures have the `/compact` text ≥ 840 chars; 27 of the 29 executed queued cases are ≤ 787 chars (one executed at 1606), so length is suggestive but not the rule.
- Impact: any automation that requests compaction by typing `/compact` (orchestrator when context gets high) cannot tell the command was dropped except by reading the JSONL: the session ends up idle with an un-compacted context and a fake "summary" in the transcript. Detection used: `promptSource:"queued"` on a `/compact` user row.

Problem found: queued mid-turn `/compact` → primer hangs through the turn → sometimes fires as a plain prompt (`promptSource:"queued"`) → `total_tokens_reminder` path → prose "summary" → no `compact_boundary`.

Why this solution: a diagnostic scorer for the hangfired primer → executed command chain, so a reader can admit idle hangfired, pin seeded executed, and score promptSource-queued / plain-prompt-path / missing-compact-boundary / long-args-suggestive / idle-prompt-ok / cousins against the published facts.

## Why not a clone

This is specifically: **queued `/compact` mid-turn is sometimes demoted to a plain prompt (`promptSource:"queued"`) on 2.1.257 instead of executing as the slash command — prose "summary", no `compact_boundary`.**

NOT Thrash/#88257 — first-prompt event-loop stall / RSS balloon. Hangfire is queued slash demotion, not a paging-storm freeze.
NOT Muzzle/#92459 — safe-mode skill attachment wire leak. Hangfire is not an attachment-strip leak.
NOT Hysteresis/#92444 — `/effort` cache remanence. Hangfire is not a cache-key loop.
NOT Hardstand/#92452 — Dispatch exclusive-cwd. Different paradigm entirely.
NOT Rheostat/#92436 — `--level low` hardwired high. Hangfire is not review-effort wiring.
NOT Watchdog/#92424 — compaction-nap kill. Different: watchdog vs hangfire demotion-to-prose.
NOT Sostenuto — CoreAudio mic freeze. Different.
NOT #85697 primary (silent drop vs hangfire demotion-to-prose).
NOT #85050 Windows silent startup gaps (backup only).

Do NOT name this after prior paradigm desks.
Do NOT reuse idle thrashing / leaking / remanent / rewritten / cleared / maxed / mute / inherited / freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / cold / voided / alongside / shed / latched / quiet / bound / open / sostenutoed / frozen.
Do NOT reuse seeded responsive / excised / rewritten / refused / hardwired.

Different surface: queued slash-command dispatch vs first-prompt stall / attachment-strip leak / cache remanence / exclusive-cwd / effort-dial / compaction-nap kill / CoreAudio freeze / silent drop.

Product name stays **Hangfire**. Name/slug `hangfire` confirmed unused in catalog.json (183 products).

Different UI: delayed-primer / hangfire chronograph bay / cordite charcoal / brass and copper faceplates / amber delay fuse / slate powder marks. Anybody / Source Sans 3 / JetBrains Mono. NOT phosphor CRT (Thrash — IBM Plex + Orbitron). NOT olive range suppressor (Muzzle — Bebas + Barlow + Source Code Pro). NOT magnetic hysteresis coils (Hysteresis — Syne / Figtree / IBM Plex Mono). Stay OFF CRT / olive range / magnetic loop / night apron / bakelite rheostat.

Different verbs: admit hangfired, pin seeded executed, score hangfired vs executed, load #92478 fixture, score probes.

Different idle: **hangfired**. Different seeded: **executed**. HOLD: **executed**. ALARM: **hangfired** / **promptSource-queued** / **plain-prompt-path** / **missing-compact-boundary** / **long-args-suggestive**. Control: **idle-prompt-ok**.

Cousins cite-only (NOT primary):

- [#85697](https://github.com/anthropics/claude-code/issues/85697) — Queued `/compact` mid-turn silently dropped (different: dropped, not demoted to plain prompt).
- [#76875](https://github.com/anthropics/claude-code/issues/76875) — Input during `/compact` silently cancels compaction.
- [#92434](https://github.com/anthropics/claude-code/issues/92434) — Auto-compact decides from previous turn token count on resume overflow.
- [#92424](https://github.com/anthropics/claude-code/issues/92424) — Workflow stall watchdog kills agents during auto-compaction.
- [#90711](https://github.com/anthropics/claude-code/issues/90711) — Remote Control busy indicator never clears after `/compact`.

## Live catalog path

`/hangfire/` is this static delayed-primer scoring assay. Path `https://hermes-playground-green.vercel.app/hangfire/` and subdomain `https://hangfire.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `00:50 Sydney · hangfire · catalog #184 · #92478`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **hangfired** → queued `/compact` demoted to a plain prompt.
2. Seeded **executed** → command stub + `compact_boundary`.
3. Diagnostic **promptSource-queued** → failing user row carries `promptSource:"queued"`.
4. Diagnostic **plain-prompt-path** → next attachment is `total_tokens_reminder`.
5. Diagnostic **missing-compact-boundary** → no `compact_boundary`; prose "summary".
6. Diagnostic **long-args-suggestive** → all 7 failures ≥ 840 chars; length suggestive, not a rule.
7. Control **idle-prompt-ok** → idle prompt `/compact` always executes (6/6).
8. Diagnostic **cousins** → #85697 #76875 #92434 #92424 #90711 cite-only.
9. Assay UI: brass cartridge, copper primer, amber delay fuse, two chambers (COMMAND vs PLAIN), powder-measure length gauge, slate burn marks.
10. Stay-off strip: CRT paging-storm / olive suppressor / magnetic remanence / night apron / bakelite dial / kennel / piano freeze. Primary stays #92478.
11. **Score probes** walks the probe ticket and lights chips on the chronograph. Chip-switch every verdict. Paste or drop JSON. Bay simulator chips rewrite the primer (hangfired / executed / queued / boundary).

## How to score

Open `projects/hangfire/index.html` in a browser, or serve the repo root and visit `/hangfire/` (Vercel rewrite → `/projects/hangfire`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/hangfire/hook/hangfire.test.mjs
```

Empty paste scores the idle **hangfired** ticket if you admit hangfired. Paste a probe on the page or drop a fixture from `data/`. The living page admits **hangfired** / primer delayed / round fired as prose / #92478.

## Hook

`projects/hangfire/hook/` scores a probe `{ seed, hangfired, executed, promptSource, nextAttachment, compactBoundary, argChars, idlePrompt }` and returns `{ verdict, reasons[], hangfired, executed, chips[] }`. See `hook/README.md`.

```bash
node projects/hangfire/hook/index.mjs projects/hangfire/data/92478.json
echo '{"seed":"executed","executed":true,"hangfired":false,"compactBoundary":true}' | node projects/hangfire/hook/index.mjs
```

`executed` is true ONLY when the verdict is executed or idle-prompt-ok (the command actually ran). Seeded 92478 numbers must produce hangfired / `executed=false` on the queued demotion path. A hangfired primer is never the hold path.
