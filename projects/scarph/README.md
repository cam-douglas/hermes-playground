# Scarph

A **shipwright scarph-joint / bevelled timber splice bench** — oak and teak faying faces, shipwright chalk, iron drift bolts, resin lamp amber-green, sawdust marks at the ~8181 shear; Cormorant Garamond + Outfit + Roboto Mono — for a real Claude Code defect: **WINDOWS BASH TOOL COMMANDS ARE SILENTLY SHEARED AT ~8,181 CHARS OF THE bash.exe `-c` ARGUMENT, AND EVERY `\\` IS HALVED.** On Windows the Bash tool passes the whole command to Git's `bash.exe` as a single `-c` argument. The `-c` argument is cut off between 8,181 and 8,190 characters. Every doubled backslash arrives halved. When the script is handed via stdin or a temp file (**fayed**), that is the hold path.

Primary:

- [anthropics/claude-code#92543](https://github.com/anthropics/claude-code/issues/92543) (OPEN, bug, has repro, platform:windows, area:bash). Title: `[BUG] Windows: Bash tool commands are silently truncated at ~8,181 chars of the bash.exe -c argument, and every \\ is halved`. Filed 2026-09-06T19:43:06Z. Reporter: bilbospocketses. Claude Code 2.1.263. Windows 11 Enterprise. Node v24.19.0. Git for Windows 2.55.0 (`bin\bash.exe` → `usr\bin\bash.exe`, MSYS2 bash 5.3.15).

07:50 scarph: a shipwright scarph-joint bench that should carry the full Bash -c timber through the faying faces but instead shears the plank between 8181–8190 chars and halves every doubled backslash on Windows (#92543). Score sheared or admit fayed.

Idle word: **sheared** (the `-c` bevel cuts the plank mid-scarf; faying faces do not meet). Seeded state: **fayed** / #92543 — script handed via stdin or a temp file so the joint carries the full timber. Never idle as overladen, trimmed, defocused, sharp, skimmed, intact, mislabeled, scoped, saturating, vented, preheating, lit, hangfired, executed, thrashing, responsive, leaking, excised, remanent, rewritten, or truncated.

**Scarph** = a hull-plank end-to-end scarph — the bevelled timber splice that should carry the full length through the joint. Here the `-c` bevel shears the plank mid-scarf and halves every doubled backslash like a mis-cut faying surface.

- **sheared** = IDLE: `-c` bevel cuts the plank mid-joint between 8181–8190; every doubled backslash arrives halved
- **fayed** = seeded word: script handed via stdin or a temp file (`bash <file>` / `bash -s`); full timber through the joint
- **argv-ceiling** = cut window 8181–8190; libuv only refuses at 32,767 ENAMETOOLONG; census 0 under 8K, 25 of 29 at 9K+; user ceiling ~7,000 / ~100 lines
- **backslash-halved** = `A\\B` → `A\B`, `G\\\\H` → `G\\H`; MS-CRT vs MSYS2; file path is byte-exact
- **silent-cut** = 8100/8180 START+END; 8190+ START only; unexpected EOF / phantom quoting bug
- **stdin-bypass** = suggested rail only: hand script via stdin/temp file, or refuse assembled `-c` over ~8,100
- **cousins** = cite-only #85856 #89392 #88311 #88561 #90421

Verdicts: sheared, fayed, argv-ceiling, backslash-halved, silent-cut, stdin-bypass, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a Windows Bash `-c` hand-off would sail **sheared** on the ~8181 bevel or already **fayed**. Fixtures use the issue's cut window, ENAMETOOLONG, census, user ceiling, and versions only.

Hypothesis only (NON-BINDING): CreateProcess/libuv argv quoting on Windows applies MS-CRT escaping incompatible with MSYS2 bash `-c` parsing, and an undocumented ~8K practical ceiling shears before ENAMETOOLONG. Verify nothing in closed source — encode issue facts only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92543](https://github.com/anthropics/claude-code/issues/92543)
- Cousins cite-only (NOT primary): [anthropics/claude-code#85856](https://github.com/anthropics/claude-code/issues/85856), [anthropics/claude-code#89392](https://github.com/anthropics/claude-code/issues/89392), [anthropics/claude-code#88311](https://github.com/anthropics/claude-code/issues/88311), [anthropics/claude-code#88561](https://github.com/anthropics/claude-code/issues/88561), [anthropics/claude-code#90421](https://github.com/anthropics/claude-code/issues/90421)

What happened (from the issue — do not invent):

- On Windows the Bash tool passes the whole command to Git's `bash.exe` as a single `-c` argument (wrapper: source snapshot && export TEMP=... && eval '<command with each ' rewritten as `'"'"'`>' && pwd -P >| cwdfile).
- The `-c` argument is cut off between 8,181 and 8,190 characters. Bash then reports `unexpected EOF while looking for matching '` (or here-document delimited by end-of-file) and nothing runs. The `'` rewrite makes the error line point at the last quote before the cut — a phantom quoting bug.
- libuv only refuses at 32,767 (ENAMETOOLONG), so ~7.5K–32K fails with no length diagnostic.
- Every doubled backslash arrives halved: `A\\B` → `A\B`, `G\\\\H` → `G\\H`, including inside quoted heredocs. Cause: libuv quotes by MS-CRT rules (backslash doubled only before `"`) while MSYS2 parses `\\` inside double-quoted args as escape. Writing the same script to a file and running the file is byte-exact.
- Census: 7,815 Bash commands / 37 sessions — 0 shear failures under 8K expanded chars; 25 of 29 at 9K+; plus Python heredoc SyntaxError from halving.
- Through the Bash tool the user's command ceiling is lower (~7,000 chars / ~100 lines) because wrapper text + `'"'"'` expansion share the same ~8K budget.
- Repro needs no Claude Code: Node spawnSync of bash.exe `-c` with script lengths 8100/8180 OK (START+END), 8190+ only START (tail gone, sometimes no error). Same with CLAUDE_CODE_GIT_BASH_PATH unset.
- Expected: command runs OR tool says too long. Today: silent shear + misleading quoting error.
- Suggested fix (assay rails only, not claimed implemented): hand script via stdin/temp file (`bash <file>` / `bash -s`) instead of `-c`; or refuse assembled `-c` over ~8,100 with a clear message.
- Environment: Claude Code 2.1.263, Windows 11 Enterprise, Node v24.19.0, Git for Windows 2.55.0 (`bin\bash.exe` → `usr\bin\bash.exe`, MSYS2 bash 5.3.15).

Problem found: Windows node→bash.exe `-c` transport ceiling (~8181) + MS-CRT/MSYS2 backslash halving — silent shear of the command joint.

Why this solution: a diagnostic scorer for the sheared → fayed scarph chain, so a reader can admit idle sheared, pin seeded fayed, and score argv-ceiling / backslash-halved / silent-cut / stdin-bypass / cousins against the published facts.

## Why not a clone

This is specifically: **Windows node→bash.exe `-c` transport ceiling (~8181) + MS-CRT/MSYS2 backslash halving — silent shear of the command joint.**

NOT Plimsoll/#92434 — stale auto-compact previous-turn tokens.
NOT Diopter/#92524 — scratchpad UUID cache bust.
NOT Decant/#92515 — PATH-only login-shell skim.
NOT Catachresis/#92518 — insufficient_scope stamped token expired.
NOT Bourdon/#92510 — VM host fd climb.
NOT Glowplug/#85050 — Windows silent startup preheat — different Windows paradigm.
NOT Hangfire/#92478, Thrash/#88257, Muzzle, Hysteresis, Hardstand, Embrasure/Holdfast/Knock families.
NOT #92548 — remote daemon chat process leak.
NOT #92539 — Remove-Item spaced-path false-positive guard (cite for contrast only — not a cousin of this joint).
NOT #92542 — deny unwrap wrapper bypass.
NOT #92533 — function-hook worktree isolation lost.

Stay OFF all prior catalog slugs/paradigms: Plimsoll / Diopter / Decant / Catachresis / Bourdon / Glowplug / Hangfire / Thrash / Muzzle / Hysteresis / Hardstand / Rheostat / Watchdog and every existing slug in catalog.json.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle overladen / trimmed / defocused / sharp / skimmed / intact / mislabeled / scoped / saturating / vented / preheating / lit / hangfired / executed / thrashing / responsive / leaking / excised / remanent / rewritten / truncated.
Do NOT reuse seeded trimmed / sharp / intact / scoped / lit / executed / responsive / excised / rewritten / vented.

Different surface: Windows `-c` argv ceiling + backslash halving vs stale auto-compact threshold / UUID-in-system cache miss / PATH skim / first-prompt stall / Windows silent startup preheat.

Product name stays **Scarph**. Name/slug `scarph` confirmed unused in catalog.json (190 products).

Different UI: oak/teak scarph-joint bench / bevelled faying faces / shipwright chalk / iron drift bolts / resin lamp amber-green / sawdust chalk marks at ~8181. Cormorant Garamond / Outfit / Roboto Mono. NOT Libre Baskerville/Nunito Sans/IBM Plex Mono (Plimsoll). NOT Petrona/Outfit/Fragment Mono (Diopter — Outfit is shared as UI only; display and mono differ). NOT Spectral/Karla/Roboto Mono (Decant). NOT Fraunces/Manrope/JetBrains Mono (Catachresis). NOT Anybody/Source Sans/JetBrains (Hangfire). NOT Bebas/Barlow. NOT dry-dock Plimsoll board, NOT optical diopter tray, NOT gravity cellar, NOT lexicographer stamps, NOT bourdon pressure, NOT glow-plug bay, NOT hangfire chronograph.

Different verbs: admit sheared, pin seeded fayed, score sheared vs fayed, load #92543 fixture, score the joint.

Different idle: **sheared**. Different seeded: **fayed**. HOLD: **fayed**. ALARM: **sheared** / **argv-ceiling** / **backslash-halved** / **silent-cut** / **stdin-bypass** / **cousins**.

Cousins cite-only (NOT primary):

- [#85856](https://github.com/anthropics/claude-code/issues/85856) — Windows/Git Bash silently halves backslashes (MSVCRT vs MSYS2). Primary stays #92543.
- [#89392](https://github.com/anthropics/claude-code/issues/89392) — Bash tool silently strips backslashes on Windows/Git Bash. Primary stays #92543.
- [#88311](https://github.com/anthropics/claude-code/issues/88311) — long-lived sessions: inlined shell snapshot exceeds command-line length. Primary stays #92543.
- [#88561](https://github.com/anthropics/claude-code/issues/88561) — `\\` collapses to `\` corrupting regex and paths. Primary stays #92543.
- [#90421](https://github.com/anthropics/claude-code/issues/90421) — Desktop snapshot sheared at ~7.2KB with unexpected EOF. Primary stays #92543.

#92539 is a different Remove-Item spaced-path false-positive guard — neighbourhood contrast only, not a cousin of this joint.

## Live catalog path

`/scarph/` is this static shipwright scarph-joint scoring assay. Path `https://hermes-playground-green.vercel.app/scarph/` and subdomain `https://scarph.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `07:50 Sydney · scarph · catalog #191 · #92543`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **sheared** → `-c` bevel mid-scarf; faying faces do not meet.
2. Seeded **fayed** → stdin / temp file carries the full timber.
3. Diagnostic **argv-ceiling** → cut window 8181–8190; ENAMETOOLONG 32767; 0 under 8K; 25 of 29 at 9K+; user ~7000.
4. Diagnostic **backslash-halved** → `A\\B` → `A\B`; MS-CRT vs MSYS2.
5. Diagnostic **silent-cut** → 8100/8180 START+END; 8190+ START only; phantom quote.
6. Diagnostic **stdin-bypass** → suggested rail: `bash <file>` / `bash -s` or refuse over ~8100.
7. Diagnostic **cousins** → #85856 #89392 #88311 #88561 #90421 cite-only.
8. Assay UI: oak/teak scarph, bevelled faying faces, iron drift bolts, resin lamp, sawdust chalk at ~8181.
9. Stay-off strip: Plimsoll dry-dock / Diopter trial-lens / Decant cellar / Glowplug preheat / CRT paging-storm. Primary stays #92543.
10. **Score the joint** walks the probe ticket and lights chips on the bench. Chip-switch every verdict. Paste or drop JSON. Bench simulator chips rewrite the mark (sheared / fayed / ceiling / halving).

## How to score

Open `projects/scarph/index.html` in a browser, or serve the repo root and visit `/scarph/` (Vercel rewrite → `/projects/scarph`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/scarph/hook/scarph.test.mjs
```

Empty paste scores the idle **sheared** ticket if you admit sheared. Paste a probe on the page or drop a fixture from `data/`. The living page admits **sheared** / Windows `-c` bevel / #92543.

## Hook

`projects/scarph/hook/` scores a probe `{ seed, sheared, fayed, argvLength, viaDashC, halved, unexpectedEof, viaStdin }` and returns `{ verdict, reasons[], sheared, fayed, chips[], joint }`. See `hook/README.md`.

```bash
node projects/scarph/hook/index.mjs projects/scarph/data/92543.json
echo '{"seed":"fayed","fayed":true,"viaStdin":true}' | node projects/scarph/hook/index.mjs
```

`fayed` is true ONLY when the verdict is fayed (the script is handed via stdin or a temp file). Seeded 92543 numbers must produce sheared / `fayed=false` on the Windows `-c` shear path. A sheared plank is never the hold path.
