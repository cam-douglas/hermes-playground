# Cringle

A **sailmaker's loft / cringle-and-grommet splicing bench** — weathered canvas ecru, navy rope, brass cringle rings, salt-white chalk, teak bench, indigo sailcloth; Alegreya + Source Sans 3 + Fira Code — for a real Claude Code defect: **`permissions.deny` BASH RULES MATCH AGAINST THE PROGRAM NAME OF EACH SUB-COMMAND AFTER UNWRAPPING ONLY A FIXED EIGHT-ITEM LIST. ANY OTHER PATH WRAPPER THAT FORWARDS ARGS SHIFTS THE PROGRAM NAME SO THE DENY RULE NEVER SEES THE REAL COMMAND.** When matching is unwrap-aware and unmatched escalates (**sighted**), that is the hold path.

Primary:

- [anthropics/claude-code#92542](https://github.com/anthropics/claude-code/issues/92542) (OPEN, bug, has repro, platform:linux, area:security, area:bash, area:permissions). Title: `[BUG] Bash deny rules bypassed by any wrapper program outside ax()'s 8-item unwrap list`. Updated 2026-09-06T19:38:38Z. Reporter: ppravdin. Claude Code 2.1.258. Linux.

10:50 cringle: a sailmaker's loft that should reeve the real program through the deny eye after peeling known wrappers but instead lets any PATH wrapper outside ax()'s eight-item list shift the token so the rope slips past — `git add -A` denied six times, then ran four times behind a wrapper (#92542). Score slipped or admit sighted.

Idle word: **slipped** (unknown wrapper shifts the program token past the eye; deny never consulted). Seeded state: **sighted** / #92542 — matching is unwrap-aware; unmatched escalates. Never idle as riven, argbound, accruing, cleared, sheared, fayed, overladen, trimmed, defocused, sharp, skimmed, intact, mislabeled, scoped, saturating, vented, preheating, lit, hangfired, executed, thrashing, responsive, leaking, excised, remanent, rewritten, truncated, voided, or banked.

**Cringle** = the reinforced eye in a sail through which a rope is reeved. Claude Code's Bash `permissions.deny` matching unwraps only a fixed eight-item wrapper list before reading the program name. Any other PATH wrapper that execs its arguments shifts the program name so the deny rule never sees the real command — the rope slips past the eye.

- **slipped** = IDLE: unknown wrapper shifts the program token; deny never consulted
- **sighted** = seeded word: unwrap-aware matching; unmatched escalates to a prompt
- **eight-unwrap** = listed wrappers: `timeout`, `time`, `nice`, `stdbuf`, `nohup`, `command`, `builtin`, `noglob` plus leading `VAR=value`
- **wrapper-shift** = any other PATH wrapper that forwards args; deny/allow silently skipped
- **compound-caught** = `cd <dir>; git revert ...`, `rm -f <path>; git add -A ...`, `git add -A && git status` denied correctly
- **path-wrapper-bypass** = six denials then four runs · 103 files / 657,373 insertions
- **cousins** = cite-only #49874 #31558 #4956

Verdicts: slipped, sighted, eight-unwrap, wrapper-shift, compound-caught, path-wrapper-bypass, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a Bash deny probe would sail **slipped** past the eight brass eyes or already **sighted**. Fixtures use the issue's unwrap list, repro, timestamps, and environment only.

Hypothesis only (NON-BINDING): `ax()` peels only the eight named wrappers and env-prefix tokens, then binds `Bash(...)` rules to the remaining leading program token; an unknown wrapper is treated as the program itself, so the deny pattern never sees the forwarded command. Verify nothing in closed source — encode issue facts only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92542](https://github.com/anthropics/claude-code/issues/92542)
- Cousins cite-only (NOT primary): [anthropics/claude-code#49874](https://github.com/anthropics/claude-code/issues/49874), [anthropics/claude-code#31558](https://github.com/anthropics/claude-code/issues/31558), [anthropics/claude-code#4956](https://github.com/anthropics/claude-code/issues/4956)

What happened (from the issue — do not invent):

- `permissions.deny` Bash rules match against the program name of each sub-command in the parsed AST.
- Before matching, Claude Code unwraps a **fixed eight-item list** of wrapper programs (function `ax()` in `~/.local/share/claude/versions/2.1.258` per reporter):
  `timeout`, `time`, `nice`, `stdbuf`, `nohup`, `command`, `builtin`, `noglob`
  plus leading `VAR=value` assignments.
- No fallback; no attempt to resolve what an unknown wrapper actually executes.
- Any other wrapper binary/script on PATH that forwards args shifts the program name → deny/allow rules for the underlying program are silently skipped.
- NOT the env-var prefix case (#31558, closed) and NOT command-chaining (#4956).
- Compound splitting works: `cd <dir>; git revert ...`, `rm -f <path>; git add -A ...`, `git add -A && git status` were denied correctly in the same environment.
- Repro: `permissions.deny` includes `Bash(git add -A*)` → bare `git add -A` denied; same op preceded by any non-listed wrapper on PATH that forwards args → **runs** (deny never consulted).
- Real impact: `git add -A` denied six times over weeks, then ran four times behind a wrapper, committing 103 unintended files / 657,373 insertions. Denials: 2026-08-27T18:15:51Z, 2026-08-28T07:23:26Z, 07:42:37Z, 07:59:53Z, 09:35:12Z, 09:41:26Z. Bypasses: 2026-09-06T16:57:28Z, 17:12:26Z, 18:44:10Z, 19:01:59Z.
- Related: #49874 recommends putting commands behind a wrapper so allowlist matching stops seeing them — same mechanism that defeats deny.
- Suggested directions (cite as suggestion only, not implemented): (1) unknown wrapper → treat unmatched / escalate to prompt rather than fall through; (2) warn at config-load that Bash(...) rules bind literal program name; (3) check every token of a sub-command against deny rules; at minimum document the eight-item list.
- Environment: Claude Code 2.1.258, Linux. Permission prompts suppressed for the session so unmatched ran silently; bypass itself does not depend on that.

Problem found: Bash `permissions.deny` unwrap allowlist — fixed eight wrappers + `VAR=value`; unknown PATH wrapper shifts the program token; deny never consulted.

Why this solution: a diagnostic scorer for the slipped → sighted cringle chain, so a reader can admit idle slipped, pin seeded sighted, and score eight-unwrap / wrapper-shift / compound-caught / path-wrapper-bypass / cousins against the published facts.

## Why not a clone

This is specifically: **Bash `permissions.deny` unwrap — fixed eight-item wrapper list; unknown PATH wrapper shifts the program name so deny/allow never see the real command.**

NOT Kerf/#92539 — Windows Remove-Item whole-command path rive (sandbox path guard; DIFFERENT paradigm).
NOT Demurrage/#92548 — remote daemon chat process leak.
NOT Scarph/#92543 — Windows Bash -c ~8181 truncate + `\\` halving.
NOT Plimsoll/#92434 — stale auto-compact previous-turn tokens.
NOT Diopter/#92524, Decant/#92515, Catachresis/#92518, Bourdon/#92510, Glowplug/#85050, Hangfire/#92478, Thrash/#88257, or any prior catalog slug.

Stay OFF all prior catalog slugs/paradigms: Kerf / Demurrage / Scarph / Plimsoll / Diopter / Decant / Catachresis / Bourdon / Glowplug / Hangfire / Thrash and every existing slug in catalog.json.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle riven / argbound / accruing / cleared / sheared / fayed / overladen / trimmed / defocused / sharp / skimmed / intact / mislabeled / scoped / saturating / vented / preheating / lit / hangfired / executed / thrashing / responsive / leaking / excised / remanent / rewritten / truncated / voided / banked.
Do NOT reuse seeded argbound / cleared / fayed / trimmed / sharp / intact / scoped / lit / executed / responsive / excised / rewritten / vented.

Different surface: deny unwrap wrapper bypass vs Windows Remove-Item whole-command path rive / remote-daemon overstay / Windows `-c` shear / stale auto-compact.

Product name stays **Cringle**. Name/slug `cringle` confirmed unused in catalog.json (193 products).

Different UI: weathered canvas ecru / navy rope / brass cringle rings / salt-white chalk / teak bench / indigo sailcloth / eight-item unwrap list as brass eyes / unknown wrapper shifting the program token past the eye. Alegreya / Source Sans 3 / Fira Code. NOT Libre Baskerville/DM Sans/Space Mono. NOT Newsreader/Public Sans/IBM Plex Mono. NOT Cormorant/Outfit/Roboto Mono. NOT Libre Baskerville/Nunito. NOT Petrona/Fragment Mono. NOT Spectral/Karla. NOT Fraunces/Manrope/JetBrains. NOT Archivo Black/Sora. NOT Bebas/Barlow. NOT Teko. NOT Anybody/Source Sans.

Different verbs: admit slipped, pin seeded sighted, score slipped vs sighted, load #92542 fixture, score the cringle.

Different idle: **slipped**. Different seeded: **sighted**. HOLD: **sighted**. ALARM: **slipped** / **eight-unwrap** / **wrapper-shift** / **compound-caught** / **path-wrapper-bypass** / **cousins**.

Cousins cite-only (NOT primary):

- [#49874](https://github.com/anthropics/claude-code/issues/49874) — CLOSED. Bash(cmd *) allowlist silently bypassed for commands interpolating user env vars; uninformative denial (recommends wrappers). Primary stays #92542.
- [#31558](https://github.com/anthropics/claude-code/issues/31558) — CLOSED. Bypass deny via env variable prefix. Issue is explicit this is NOT that case. Primary stays #92542.
- [#4956](https://github.com/anthropics/claude-code/issues/4956) — CLOSED. Bash Permission Bypass via Command Chaining. Issue is explicit this is NOT that case; compound splitting works. Primary stays #92542.

Do NOT treat Kerf/#92539 Remove-Item spaced-path cousins (#90645 #73524 #73882 #66549 #78513) as this product's cousins — that is a different paradigm (sandbox path guard).

## Live catalog path

`/cringle/` is this static sailmaker's loft scoring assay. Path `https://hermes-playground-green.vercel.app/cringle/` and subdomain `https://cringle.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `10:50 Sydney · cringle · catalog #194 · #92542`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **slipped** → eight-item unwrap; unknown PATH wrapper shifts the program token past the eye; deny never consulted.
2. Seeded **sighted** → matching unwrap-aware; unmatched escalates.
3. Diagnostic **eight-unwrap** → listed wrappers + `VAR=value`; no fallback.
4. Diagnostic **wrapper-shift** → unknown PATH wrapper forwards args.
5. Diagnostic **compound-caught** → semicolon and `&&` still denied.
6. Diagnostic **path-wrapper-bypass** → six denials then four runs.
7. Diagnostic **cousins** → #49874 #31558 #4956 cite-only.
8. Assay UI: canvas ecru, navy rope, brass eyes, salt chalk, teak, indigo sailcloth, token slipping past the grommet.
9. Stay-off strip: Windows Remove-Item whole-command path rive / remote-daemon overstay / Windows `-c` cut / stale auto-compact. Primary stays #92542.
10. **Score the cringle** walks the probe ticket and lights chips on the loft bench. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/cringle/index.html` in a browser, or serve the repo root and visit `/cringle/` (Vercel rewrite → `/projects/cringle`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this matcher ships in Claude Code.
node --test projects/cringle/hook/cringle.test.mjs
```

Empty paste scores the idle **slipped** ticket if you admit slipped. Paste a probe on the page or drop a fixture from `data/`. The living page admits **slipped** / Bash deny unwrap wrapper bypass / #92542.

## Hook

`projects/cringle/hook/` scores a probe `{ seed, slipped, sighted, command }` and returns `{ verdict, reasons[], slipped, sighted, chips[], cringle }`. See `hook/README.md`.

```bash
node projects/cringle/hook/index.mjs projects/cringle/data/92542.json
echo '{"seed":"sighted","sighted":true}' | node projects/cringle/hook/index.mjs
```

`sighted` is true ONLY when the verdict is sighted (matching is unwrap-aware / unmatched escalates). Seeded 92542 numbers must produce slipped / `sighted=false` on the unknown-wrapper path. A slipped rope is never the hold path.
