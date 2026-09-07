# Kerf

A **joiner's / sawyer's kerf-gauge bench** — mill-dust oak, brass kerf gauge, indigo chalk lines, saw-kerf groove, path-ribbon that cleaves at the first space with a glowing cut; Libre Baskerville + DM Sans + Space Mono — for a real Claude Code defect: **ON WINDOWS, THE BUILT-IN REMOVE-ITEM PROTECTION BLOCKS A COMMAND WHENEVER THE COMMAND TEXT CONTAINS ANY WINDOWS PATH WITH A SPACE, REGARDLESS OF WHAT IS ACTUALLY BEING DELETED.** The guard appears to split the path at the first space and treat the leading fragment as a protected drive root. When the guard binds only the argument actually passed to Remove-Item (**argbound**), that is the hold path.

Primary:

- [anthropics/claude-code#92539](https://github.com/anthropics/claude-code/issues/92539) (OPEN, bug, has repro, platform:windows, area:sandbox). Title: `Windows: Remove-Item guard blocks any command containing a path with a space`. Updated 2026-09-06T19:25:55Z. Reporter: tonibunaiasu. Claude Code desktop (Code tab). Windows 11 Pro 10.0.22631. PowerShell 7.6.5. Opus 4.5.

09:50 kerf: a joiner's kerf-gauge bench that should bind Remove-Item protection to the real delete argument but instead rives any spaced Windows path in the whole command — Program Files → "C:\Program, AI Projects → "C:\AI — and blocks TEMP cleanup (#92539). Score riven or admit argbound.

Idle word: **riven** (path cleaved at whitespace; false positive on fragment). Seeded state: **argbound** / #92539 — guard resolves only the real Remove-Item argument(s) against the protected list. Never idle as accruing, cleared, sheared, fayed, overladen, trimmed, defocused, sharp, skimmed, intact, mislabeled, scoped, saturating, vented, preheating, lit, hangfired, executed, thrashing, responsive, leaking, excised, remanent, rewritten, or truncated.

**Kerf** = the groove a saw leaves — the width of the cut itself. The Remove-Item guard should inspect the argument actually passed to Remove-Item. Instead it scans the whole command text for the verb plus anything path-shaped, rives at the first space (even inside quotes), and treats the leading fragment as a protected drive root.

- **riven** = IDLE: path cleaved at whitespace; false positive on fragment (`'"C:\Program'`, `'"C:\AI'`)
- **argbound** = seeded word: guard resolves only the real Remove-Item argument(s) against the protected list
- **baseline-pass** = Set-Content + Remove-Item on `$env:TEMP\probe.txt` — passes
- **nospace-pass** = same cleanup + `$other = "C:\Python314\python.exe"` — passes
- **program-files-block** = `& "C:\Program Files\Git\bin\bash.exe" -c "echo hello"` → `'"C:\Program' is blocked`
- **user-dir-block** = `$other = "C:\AI Projects\README.md"` → `'"C:\AI' is blocked` — user working dir, not a system path
- **reversed-order-block** = spaced path BEFORE Remove-Item — still blocked; not proximity/line based
- **cousins** = cite-only #90645 #73524 #73882 #66549 #78513

Verdicts: riven, argbound, baseline-pass, nospace-pass, program-files-block, user-dir-block, reversed-order-block, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a Windows Remove-Item command would sail **riven** on a cleaved fragment or already **argbound**. Fixtures use the issue's repros, error fragments, TEMP target, and environment only.

Hypothesis only (NON-BINDING): the Remove-Item guard tokenizes command text on whitespace without respecting quotes and pairs the Remove-Item verb with any path-shaped substring, never consulting the actual AST argument to Remove-Item. Verify nothing in closed source — encode issue facts only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92539](https://github.com/anthropics/claude-code/issues/92539)
- Cousins cite-only (NOT primary): [anthropics/claude-code#90645](https://github.com/anthropics/claude-code/issues/90645), [anthropics/claude-code#73524](https://github.com/anthropics/claude-code/issues/73524), [anthropics/claude-code#73882](https://github.com/anthropics/claude-code/issues/73882), [anthropics/claude-code#66549](https://github.com/anthropics/claude-code/issues/66549), [anthropics/claude-code#78513](https://github.com/anthropics/claude-code/issues/78513)

What happened (from the issue — do not invent):

- On Windows, built-in Remove-Item protection blocks a command whenever the command text contains ANY Windows path with a space, regardless of what is actually being deleted.
- Guard appears to split the path at the first space and treat the leading fragment as a protected drive root.
- Error names a fragment, not a real path: `Remove-Item on system path '"C:\Program' is blocked. This path is protected from removal.` — leading quote included; cut at the space.
- Repro (each a single PowerShell tool call; deleted file always throwaway in %TEMP%):
  1. Baseline — passes: Set-Content + Remove-Item on `$env:TEMP\probe.txt`
  2. Path without space mentioned — passes: same cleanup + `$other = "C:\Python314\python.exe"`
  3. Path with space — BLOCKED: same cleanup + `& "C:\Program Files\Git\bin\bash.exe" -c "echo hello"` → `Remove-Item on system path '"C:\Program' is blocked.`
  4. Ordinary user directory with space — BLOCKED: `$other = "C:\AI Projects\README.md"` → `'"C:\AI' is blocked.` — C:\AI Projects is a user working dir, not a system path
  5. Reversed order (spaced path BEFORE Remove-Item) — still BLOCKED — not proximity/line based
- Expected: guard inspects argument(s) actually passed to Remove-Item and blocks only if THAT resolves to a protected location.
- Actual: guard scans whole command text for verb Remove-Item AND anything path-shaped; blocks on the pair; deletion target never consulted.
- Impact: any project folder with a space makes every cleanup unrunnable; mentioning the project path anywhere triggers the guard. Common hits: C:\Program Files → C:\Program; C:\Users\…\My Documents. Practical effect: agents drop cleanup → checks silently reuse stale artifacts.
- Environment: Claude Code desktop (Code tab), Windows 11 Pro 10.0.22631, PowerShell 7.6.5, Opus 4.5. Message string `protected from removal` is in bundled claude.exe under claude_agent_sdk/_bundled/ — product behaviour, not a user hook.
- Suggested fix (from reporter, cite as suggestion only): resolve actual Remove-Item args against protected list; if text pre-filter kept, do not cut inside quoted paths; do not treat two-segment fragments like C:\AI as drive roots.

Problem found: Windows Remove-Item sandbox guard false-positive — whole-command path scan + whitespace cleave inside quotes → fragment treated as protected root while actual delete target is TEMP.

Why this solution: a diagnostic scorer for the riven → argbound kerf chain, so a reader can admit idle riven, pin seeded argbound, and score baseline-pass / nospace-pass / program-files-block / user-dir-block / reversed-order-block / cousins against the published facts.

## Why not a clone

This is specifically: **Windows Remove-Item sandbox guard false-positive — whole-command path scan + whitespace cleave inside quotes → fragment treated as protected root while actual delete target is TEMP.**

NOT Demurrage/#92548 — remote-daemon chat process overstay / ~300MB ccd-cli.
NOT Scarph/#92543 — Windows Bash -c ~8181 cut + backslash halving.
NOT Plimsoll/#92434 — stale auto-compact threshold on resume.
NOT Bourdon/#92510 — Cowork VM host fd climb.
NOT Wastegate/#92059 — client memory governor.
NOT Cringle/#92542 — deny unwrap wrapper bypass (DIFFERENT — permissions.deny AST unwrap list; do not ship that this hour).
NOT Diopter/Decant/Catachresis/Glowplug/Hangfire/Thrash/Muzzle/Hysteresis/Hardstand or any prior catalog slug.

Stay OFF all prior catalog slugs/paradigms: Demurrage / Scarph / Plimsoll / Bourdon / Wastegate / Thrash / Diopter / Decant / Catachresis / Glowplug / Hangfire and every existing slug in catalog.json.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle accruing / cleared / sheared / fayed / overladen / trimmed / defocused / sharp / skimmed / intact / mislabeled / scoped / saturating / vented / preheating / lit / hangfired / executed / thrashing / responsive / leaking / excised / remanent / rewritten / truncated.
Do NOT reuse seeded cleared / fayed / trimmed / sharp / intact / scoped / lit / executed / responsive / excised / rewritten / vented.

Different surface: Windows Remove-Item whole-command path rive vs remote-daemon overstay / Windows `-c` shear / stale auto-compact / VM host fd climb / client memory governor / deny unwrap.

Product name stays **Kerf**. Name/slug `kerf` confirmed unused in catalog.json (192 products).

Different UI: mill-dust oak / brass kerf gauge / indigo chalk lines / saw-kerf groove / path-ribbon that visibly cleaves at the first space with a glowing cut / argument-bound vs whole-command scan toggle. Libre Baskerville / DM Sans / Space Mono. NOT Newsreader/Public Sans/IBM Plex Mono (Demurrage). NOT Cormorant Garamond/Outfit/Roboto Mono (Scarph). NOT Spectral/Karla. NOT Fraunces/Manrope. NOT harbour teal. NOT shipwright stone.

Different verbs: admit riven, pin seeded argbound, score riven vs argbound, load #92539 fixture, score the kerf.

Different idle: **riven**. Different seeded: **argbound**. HOLD: **argbound**. ALARM: **riven** / **baseline-pass** / **nospace-pass** / **program-files-block** / **user-dir-block** / **reversed-order-block** / **cousins**.

Cousins cite-only (NOT primary):

- [#90645](https://github.com/anthropics/claude-code/issues/90645) — OPEN. PowerShell safety guard: Spanish word `del` inside a quoted commit message treated as Remove-Item, then blocks on a quote-split path fragment. Primary stays #92539.
- [#73524](https://github.com/anthropics/claude-code/issues/73524) — OPEN. PowerShell tool: non-overridable `Remove-Item on system path` guard over-blocks legitimate commands (AST target mis-attribution). Primary stays #92539.
- [#73882](https://github.com/anthropics/claude-code/issues/73882) — OPEN. PowerShell safety guard false positive: here-string body text with paths like `/requirements.txt` blocked as `Remove-Item on system path`. Primary stays #92539.
- [#66549](https://github.com/anthropics/claude-code/issues/66549) — CLOSED historical: built-in command-safety analyzer false-positives on quoted Windows paths with spaces. Primary stays #92539.
- [#78513](https://github.com/anthropics/claude-code/issues/78513) — CLOSED historical: PowerShell guard blocks Remove-Item for any direct child of a drive root. Primary stays #92539.

#92543 is a different Windows Bash `-c` cut — neighbourhood contrast only, not a cousin of this groove.
#92542 is a different deny unwrap wrapper bypass — not a cousin of this groove.

## Live catalog path

`/kerf/` is this static joiner's kerf-gauge scoring assay. Path `https://hermes-playground-green.vercel.app/kerf/` and subdomain `https://kerf.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `09:50 Sydney · kerf · catalog #193 · #92539`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **riven** → whole-command scan; path cleaved at the first space; fragment treated as a protected root.
2. Seeded **argbound** → guard binds only the real Remove-Item argument.
3. Diagnostic **baseline-pass** → TEMP cleanup alone proceeds.
4. Diagnostic **nospace-pass** → `C:\Python314\python.exe` mentioned; no space to cleave.
5. Diagnostic **program-files-block** → `C:\Program Files` → `'"C:\Program'`.
6. Diagnostic **user-dir-block** → `C:\AI Projects` → `'"C:\AI'`.
7. Diagnostic **reversed-order-block** → spaced path before Remove-Item; still blocked.
8. Diagnostic **cousins** → #90645 #73524 #73882 #66549 #78513 cite-only.
9. Assay UI: mill-dust oak, brass kerf gauge, indigo chalk, saw groove, path-ribbon with glowing cut, argument-bound vs whole-command toggle.
10. Stay-off strip: remote-daemon overstay / Windows `-c` cut / stale auto-compact / VM host fd climb. Primary stays #92539.
11. **Score the kerf** walks the probe ticket and lights chips on the mill bench. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/kerf/index.html` in a browser, or serve the repo root and visit `/kerf/` (Vercel rewrite → `/projects/kerf`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/kerf/hook/kerf.test.mjs
```

Empty paste scores the idle **riven** ticket if you admit riven. Paste a probe on the page or drop a fixture from `data/`. The living page admits **riven** / Windows Remove-Item whole-command rive / #92539.

## Hook

`projects/kerf/hook/` scores a probe `{ seed, riven, argbound, command, deleteTarget }` and returns `{ verdict, reasons[], riven, argbound, chips[], kerf }`. See `hook/README.md`.

```bash
node projects/kerf/hook/index.mjs projects/kerf/data/92539.json
echo '{"seed":"argbound","argbound":true}' | node projects/kerf/hook/index.mjs
```

`argbound` is true ONLY when the verdict is argbound (the guard binds the real Remove-Item argument). Seeded 92539 numbers must produce riven / `argbound=false` on the whole-command rive path. A riven groove is never the hold path.
