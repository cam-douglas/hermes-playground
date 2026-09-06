# Muzzle

A **ballistics range suppressor bay / muzzle-brake chronograph desk** — olive range paint, brass chronograph, suppressor sleeve that looks seated but the blast still vents past the baffle — Bebas Neue + Barlow + Source Code Pro — for a real Claude Code defect: **`--SAFE-MODE` AND `--DISABLE-SLASH-COMMANDS` DO NOT REMOVE SKILL/AGENT ATTACHMENTS FROM THE ACTUAL API REQUEST.** A seated sleeve should silence `skill_listing` and `agent_listing_delta` under the documented disable flags. On live requests the log line is suppressed while the wire still carries the payload (**leaking**). When attachments are actually removed (**excised**), that is the rare `--bare` path — which also kills Agent-tool delegation.

Primary:

- [anthropics/claude-code#92459](https://github.com/anthropics/claude-code/issues/92459) (live, bug, has repro, platform:macos, area:cli, area:skills). Title: `[BUG] --safe-mode and --disable-slash-commands do not remove skill/agent attachments from the actual API request`. Filed 2026-09-06T10:16:41Z. Reporter: Creence. Claude Code 2.1.263.

22:50 muzzle: a range suppressor bay that should silence skill/agent attachments under `--safe-mode`/`--disable-slash-commands` but only quiets the log while the wire still leaks — the sleeve looks seated, the blast still vents past the baffle. Score leaking or admit excised.

Idle word: **leaking** (`skill_listing` / `agent_listing_delta` still on the wire under documented disable flags). Seeded state: **excised** / #92459 — `--bare` strips both attachments (and over-scopes Agent-tool). Never idle as remanent, rewritten, cleared, maxed, mute, inherited, freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, misaimed, cold, voided, alongside, shed, latched, quiet, bound, or open. Never seeded as refused, hardwired, rostered, collided, doubled, clobbered, retried, cohabited, vanished, or clamped.

**Muzzle** is a range suppressor / chronograph desk. The documented disable flags should excise skill/agent attachments. Instead the sleeve looks seated and the blast still vents.

- **leaking** = IDLE: attachments still on the live request under `--safe-mode` / `--disable-slash-commands`
- **excised** = seeded word: `--bare` actually removes both attachments
- **safe-mode-leak** = `--safe-mode` help lists skills; `skill_listing` fully present; tokens nearly identical to baseline
- **disable-slash-leak** = `--disable-slash-commands` documented to disable skills; attachments stay
- **bare-excised** = `--bare` successfully removes both attachments
- **log-suppressed-only** = only `Sending N skills via attachment` is suppressed; underlying attachment unaffected
- **agent-tool-killed** = special `--bare` side-effect: `/plan`, Explore, general-purpose subagents fail/no-op
- **cousins** = cite-only #60251 CLOSED/locked and #89327 live

Verdicts: leaking, excised, safe-mode-leak, disable-slash-leak, bare-excised, log-suppressed-only, agent-tool-killed, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a documented disable flag would leave the wire leaking or already excised. Fixtures use the issue's flag claims, JSONL inspection notes, log-suppression finding, and `--bare` side-effect only.

Hypothesis only (NON-BINDING): flag paths suppress the log / slash surface but skip the attachment-strip step that `--bare` takes (and `--bare` over-scopes by disabling Agent-tool). Verify nothing — encode issue facts only. Encoded from the issue body only. Do not invent runtime source claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92459](https://github.com/anthropics/claude-code/issues/92459)
- Cousins cite-only (NOT primary): [anthropics/claude-code#60251](https://github.com/anthropics/claude-code/issues/60251), [anthropics/claude-code#89327](https://github.com/anthropics/claude-code/issues/89327)

What happened (from the issue — do not invent):

- Both `--safe-mode` and `--disable-slash-commands` are documented to disable skills. Safe-mode help lists "skills" among customizations disabled.
- In practice neither flag removes `skill_listing` or `agent_listing_delta` from the actual API request.
- Confirmed via direct JSONL inspection — attachment content and size unchanged; `input_tokens` nearly identical to an unflagged baseline.
- Only a log line (`Sending N skills via attachment`) is suppressed under `--disable-slash-commands`; the underlying attachment is unaffected under either flag.
- `--bare` successfully removes both attachments, but as an undocumented side effect also disables all Agent-tool delegation (`/plan`, Explore, general-purpose subagents all fail/no-op) — larger scope than `--safe-mode`'s stated behavior.
- Related ancestor #60251 is closed/locked; the underlying issue persists as of Claude Code 2.1.261/2.1.263. #92459 adds that `--safe-mode` leaks the same way.
- Repro (cite only): `test_all_flags.sh` lanes `01_baseline`, `02_safe_mode`, `03_disable_slash_commands`, `04_exclude_dynamic_system_prompt`, `05_bare_mode` on 2.1.263 / macOS / reporter Creence.

Problem found: documented disable flags → log line may go silent → `skill_listing` / `agent_listing_delta` still on the wire → only `--bare` excises, and it kills Agent-tool.

Why this solution: a diagnostic scorer for the leaking wire → excised `--bare` chain, so a reader can admit idle leaking, pin seeded excised, and score safe-mode-leak / disable-slash-leak / log-suppressed-only / bare-excised / agent-tool-killed / cousins against the published facts.

## Why not a clone

This is specifically: **`--safe-mode` and `--disable-slash-commands` leave `skill_listing` / `agent_listing_delta` on the live API request, while docs say skills are disabled; only `--bare` excises, and it kills Agent-tool.**

NOT Hysteresis/#92444 — mid-session `/effort` prompt-cache remanence. Muzzle is attachment-strip under disable flags, not cache-key remanence.
NOT Rheostat/#92436 — bakelite effort dial hardwired high. Muzzle is not review-effort wiring.
NOT Hardstand/#92452 — Dispatch exclusive-cwd. Different paradigm entirely.
NOT Aphonia/#92409 — ListAgents vs SendMessage toolset gap. Muzzle is request attachments, not choir roster vs reed.
NOT Intake — prompt vs attachment stream counting (different paradigm).
NOT Callboard / Deadlight / Knell / Damper / Veto / Scrim / Quench / Portcullis — different problems.
NOT #60251 itself as primary (closed/locked; #92459 is the live persistence with `--safe-mode` too).
NOT a kennel / dog-watch / collar-tag desk — that collides with catalog #174 Watchdog (Bricolage + Karla + Fragment Mono). Muzzle is a range suppressor bay.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle remanent / rewritten / cleared / maxed / mute / inherited / freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / misaimed / cold / voided / alongside / shed / latched / quiet / bound / open.
Do NOT reuse seeded refused / hardwired / rostered / collided / doubled / clobbered / retried / cohabited / vanished / clamped.

Different surface: documented disable flags vs live `skill_listing` / `agent_listing_delta` attachment strip vs mid-session cache remanence / review-effort hardwiring / Dispatch exclusive-cwd / ListAgents-SendMessage / prompt-vs-attachment counting.

Product name stays **Muzzle**. Name/slug `muzzle` confirmed unused in catalog.json (181 products).

Different UI: ballistics range suppressor bay / muzzle-brake chronograph / olive range paint / brass bezel / baffle sleeve / blast vent. Bebas Neue / Barlow / Source Code Pro. NOT kennel/dog-watch (Watchdog — Bricolage / Karla / Fragment Mono). NOT magnetic remanence (Hysteresis — Syne / Figtree / IBM Plex Mono). NOT asphalt/sodium taxiway (Hardstand). NOT bakelite dial (Rheostat). Stay OFF kennel / magnetic loop / night apron / bakelite rheostat / laryngoscope tray / brass beam / windlass deck.

Different verbs: admit leaking, pin seeded excised, score leaking vs excised, load #92459 fixture, score probes.

Different idle: **leaking**. Different seeded: **excised**. HOLD: **excised** / **bare-excised**. ALARM: **leaking** / **safe-mode-leak** / **disable-slash-leak** / **log-suppressed-only**. Special: **agent-tool-killed**.

Cousins cite-only (NOT primary):

- [#60251](https://github.com/anthropics/claude-code/issues/60251) (CLOSED, locked) — `--disable-slash-commands` still ships skills as API attachment in `-p` mode. Underlying issue persists.
- [#89327](https://github.com/anthropics/claude-code/issues/89327) (live) — clean boot sends skill catalog in both Skill tool schema AND `skill_listing` message. Different dual-catalog problem.

## Live catalog path

`/muzzle/` is this static suppressor-bay scoring assay. Path `https://hermes-playground-green.vercel.app/muzzle/` and subdomain `https://muzzle.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `22:50 Sydney · muzzle · catalog #182 · #92459`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **leaking** → attachments still on the wire under documented disable flags.
2. Seeded **excised** → `--bare` strips both attachments.
3. Diagnostic **safe-mode-leak** → `--safe-mode` help lists skills; `skill_listing` fully present.
4. Diagnostic **disable-slash-leak** → `--disable-slash-commands` documented disable; attachments stay.
5. Diagnostic **log-suppressed-only** → log line gone; underlying attachment unaffected.
6. Hold **bare-excised** → `--bare` removes both attachments.
7. Special **agent-tool-killed** → `--bare` also kills Agent-tool delegation.
8. Diagnostic **cousins** → #60251 closed/locked; #89327 live dual catalog.
9. Assay UI: suppressor sleeve, baffle stack, brass chronograph, three firing-point lanes, wire inspector, olive range paint.
10. Stay-off strip: magnetic remanence / bakelite dial / night apron / laryngoscope / Intake counting / kennel dog-watch. Primary stays #92459.
11. **Score probes** walks the probe ticket and lights chips on the chronograph. Chip-switch every verdict. Paste or drop JSON. Range simulator chips rewrite the bay (leaking / excised / safe-mode / bare).

## How to score

Open `projects/muzzle/index.html` in a browser, or serve the repo root and visit `/muzzle/` (Vercel rewrite → `/projects/muzzle`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/muzzle/hook/muzzle.test.mjs
```

Empty paste scores the idle **leaking** ticket if you admit leaking. Paste a probe on the page or drop a fixture from `data/`. The living page admits **leaking** / sleeve seated / blast still vents / #92459.

## Hook

`projects/muzzle/hook/` scores a probe `{ seed, leaking, excised, safeMode, disableSlash, logSuppressed, bare, attachmentsRemoved, agentToolKilled }` and returns `{ verdict, reasons[], leaking, excised, chips[] }`. See `hook/README.md`.

```bash
node projects/muzzle/hook/index.mjs projects/muzzle/data/92459.json
echo '{"seed":"excised","excised":true,"leaking":false,"attachmentsRemoved":true}' | node projects/muzzle/hook/index.mjs
```

`excised` is true ONLY when the verdict is excised, bare-excised, or agent-tool-killed (attachments actually removed). Seeded 92459 numbers must produce leaking / `excised=false` on the disable-flag paths. A leaking wire is never excised.
