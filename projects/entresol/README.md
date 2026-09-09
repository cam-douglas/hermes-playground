# Entresol

A **gallery mezzanine / intermediate-floor booth** — walnut floor, brass rail, cream plaster loft; fonts **Playfair Display** (display) + **Outfit** (body) + **Space Mono** (mono) — for a real Claude Code defect: **`CLAUDE.md` IN THE DIRECTORY ABOVE A GIT WORKTREE IS NOT LOADED WHEN THAT DIRECTORY HOLDS THE WORKTREE'S REPOSITORY.**

Primary:

- [anthropics/claude-code#93010](https://github.com/anthropics/claude-code/issues/93010) (OPEN, bug, has repro, platform:macos, area:core). Title: `CLAUDE.md in the directory above a git worktree is not loaded when that directory holds the worktree's repository`. Authored 2026-09-09T06:09:19Z by jdavidbush. Reproduced on Claude Code 2.1.266 and 2.1.251, macOS 15 (Darwin 25.6.0), both `-p` print mode and interactive. Plain `claude` from the shell (no VS Code).

18:50 entresol: a gallery mezzanine booth that should keep parent `CLAUDE.md` **lodged** when a child is a worktree of the repository that parent holds; instead the mezzanine is **cut away** — parent `CLAUDE.md` **bypassed** for that pairing only (plain child of same parent still loads) — score bypassed or admit lodged.

Score bypassed or admit lodged.

Idle word: **lodged** (HOLD: parent `CLAUDE.md` reaches the worktree session). Seeded word: **bypassed** / #93010 (parent `CLAUDE.md` absent for worktree child of that parent's repository). Path word: **cutaway**. Never idle sterling / debased / rubbed / primed / flashed / flashpanned / unshorn / sheared / secateured / emended / unretracted / palinoded / ephemeral / voided / fouled / cold / banked / ferruled / interlocked / passable / admitted / deeded / parked.

Phrase: **a mezzanine whose CLAUDE.md never reaches the worktree below is not lodged — it is a cutaway floor, bypassed. Score bypassed or admit lodged.**

- **lodged** = IDLE: HOLD; parent `CLAUDE.md` reaches the worktree session
- **bypassed** = #93010 seeded path: parent `CLAUDE.md` absent for worktree child of that parent's repository; `zorb-parent-WORKTREE` does not appear
- **cutaway** = path word: the mezzanine floor whose shared instructions are cut away
- **case-d-worktree-child** = Case D fail: parent holds bare repo; child is WORKTREE of that repo → parent `CLAUDE.md` ABSENT
- **case-c-plain-child** = Case C control: same parent shape, child is PLAIN directory → parent `CLAUDE.md` LOADS; `zorb-parent-PLAIN` present
- **bare-parent-alone-ok** = bare-repo-in-parent alone does not fail
- **worktree-elsewhere-ok** = child-is-worktree alone does not fail
- **worktree-of-different-repo-ok** = parent worktree of a different repository still loads parent `CLAUDE.md`
- **parent-dot-claude-also-skipped** = both `parent/CLAUDE.md` and `parent/.claude/CLAUDE.md` fail to arrive in the failing shape
- **has-repro** = six fixtures; only the pairing fails; 2.1.266 and 2.1.251; macOS 15; print and interactive
- **hold** = HOLD alias for idle lodged
- **cousins** = cite-only #23565 #39920 #27994 #90572 #83411 #87824 #76119 #16600 — do not clone
- **fixtures** = row list for the entresol booth / six-fixture case-matrix
- **walk** = published docs-every-ancestor → case C control → case D fail → `.claude` also skipped → controls → cutaway

Verdicts: lodged, bypassed, cutaway, hold, case-d-worktree-child, case-c-plain-child, bare-parent-alone-ok, worktree-elsewhere-ok, worktree-of-different-repo-ok, parent-dot-claude-also-skipped, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring mezzanine. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the floor is **bypassed** or already **lodged**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): memory walk may treat the worktree's gitdir/parent boundary as a stop so the directory holding the bare repository is skipped even though docs say every ancestor is read. Invite verify against #93010 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93010](https://github.com/anthropics/claude-code/issues/93010)
- Cite-only: [anthropics/claude-code#23565](https://github.com/anthropics/claude-code/issues/23565) (memory files loaded twice in worktree — opposite symptom)
- Cite-only: [anthropics/claude-code#39920](https://github.com/anthropics/claude-code/issues/39920) (auto-memory of manual worktree resolves to main worktree path)
- Cite-only: [anthropics/claude-code#27994](https://github.com/anthropics/claude-code/issues/27994) (project root resolves to bare-repo directory not worktree)
- Cite-only: [anthropics/claude-code#90572](https://github.com/anthropics/claude-code/issues/90572) (built-in worktree silently disregards project CLAUDE.md)
- Cite-only: [anthropics/claude-code#83411](https://github.com/anthropics/claude-code/issues/83411) (Desktop worktrees don't init submodules — CLAUDE.md imports broken)
- Cite-only: [anthropics/claude-code#87824](https://github.com/anthropics/claude-code/issues/87824) (CLAUDE.md re-injected on cd via different relative path)
- Cite-only: [anthropics/claude-code#76119](https://github.com/anthropics/claude-code/issues/76119) (desktop worktree sessions should inherit base repo .claude config)
- Cite-only: [anthropics/claude-code#16600](https://github.com/anthropics/claude-code/issues/16600) (memory traversal should respect git worktree boundaries)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:core
- Author jdavidbush. Filed 2026-09-09T06:09:19Z
- Reproduced on 2.1.266 and 2.1.251, macOS 15 (Darwin 25.6.0), both `-p` print mode and interactive
- Docs (Manage Claude's memory): reads recursively from cwd up to but not including `/`
- Case D (fail): parent holds bare repo; child is WORKTREE of that repo → parent `CLAUDE.md` ABSENT; `zorb-parent-WORKTREE` does not appear
- Case C (control): same parent shape, child is PLAIN directory → parent `CLAUDE.md` LOADS; `zorb-parent-PLAIN` present
- Six fixtures: only the pairing "parent holds bare repository + child is worktree of THAT repository" fails
- Neither bare-repo-in-parent alone nor child-is-worktree alone fails
- Parent worktree of a different repository still loads parent `CLAUDE.md`
- Both `parent/CLAUDE.md` and `parent/.claude/CLAUDE.md` fail to arrive in the failing shape
- No symlinks in fixtures
- Fresh sessions only (memory read once at startup); unique child words prove probe works (`zorb-child-D` / `zorb-child-C`)
- `/context` Memory files total rounds away the difference
- Not a recent regression (same on 2.1.251); plain `claude` from shell (no VS Code)
- Impact: standard parallel-worktree layout — shared instructions in the one directory that gets skipped; `@-import` workaround drifts (16 worktrees, corrected text on shared branch while 15 still read old)

Problem found: A MEZZANINE WHOSE `CLAUDE.md` NEVER REACHES THE WORKTREE BELOW IS NOT LODGED — IT IS A CUTAWAY FLOOR, BYPASSED.

Why this solution: a diagnostic gallery mezzanine booth for the lodged → bypassed drift, so a reader can pin idle lodged, load the #93010 bypassed path, and score cutaway / case D / case C / six-fixture matrix against the published facts.

## Why not a clone

This is specifically: **`CLAUDE.md` IN THE DIRECTORY ABOVE A GIT WORKTREE IS NOT LOADED WHEN THAT DIRECTORY HOLDS THE WORKTREE'S REPOSITORY.**

**NOT Hallmark/#93021** (resume loses `[1m]` on non-first-party `BASE_URL`). Different paradigm.

**NOT Flashpan/#93015** (`lastRunAt` stamps without a session birth). Different paradigm.

**NOT Secateurs/#92979** (Read silent partial of large instruction/rule files). Different paradigm.

**NOT Palinode/#92998** (MEMORY.md bottom truncation of newest corrections). Different paradigm.

**NOT Ferrule/#92968** / Interlock / Guillotine/#92974 / Greenroom/#92988.

**NOT leftover woodworking / mm-slider / clones.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **a worktree child of the repository its parent directory holds skips that parent's `CLAUDE.md`; a plain child of the same parent still loads it.**

Do NOT rename this product Hallmark, Flashpan, Secateurs, Palinode, Ferrule, Interlock, Guillotine, Greenroom, or any existing catalog slug.
Do NOT reuse idle lodged / bypassed / cutaway on a later ship.
Do NOT reuse Cinzel + Lato + Fira Code (Hallmark). Do NOT reuse Newsreader + Manrope + JetBrains Mono (Flashpan). Do NOT reuse Bitter + Figtree (Secateurs). Do NOT reuse Cardo + Nunito Sans (Palinode). Do NOT reuse Oswald + Source Sans 3 (Ferrule).

Different surface: parent-directory memory skip for a worktree of that parent's repository vs resume `[1m]` / scheduled-task `lastRunAt` / Read silent partial / MEMORY.md write-path bottom truncation.

Product name stays **Entresol**. Name/slug `entresol` unused in catalog.json (244 products before this ship; Hallmark is #244).

Different UI: gallery mezzanine / loft / brass rail / walnut floor / cream plaster. Playfair Display / Outfit / Space Mono. NOT silversmith assay. NOT flintlock flash-pan. NOT garden pruning bench. NOT scriptorium wax/vellum.

Different verbs: Walk the mezzanine, Pin idle lodged, Pin seeded bypassed, Admit lodged, Load case-matrix, Reset to lodged.

Different idle: **lodged**. Different #93010 seeded path: **bypassed**. HOLD: **lodged**. ALARM: **bypassed** / **cutaway** / **case-d-worktree-child** / **parent-dot-claude-also-skipped**. Path: **cutaway**.

## How to score

```bash
node --test projects/entresol/entresol.test.mjs
node projects/entresol/entresol.mjs projects/entresol/data/93010.json
node projects/entresol/entresol.mjs projects/entresol/data/lodged.json
echo '{"seed":"bypassed"}' | node projects/entresol/entresol.mjs
```

Open the living card at `projects/entresol/index.html` (or the live path `/entresol/`). Buttons: Walk the mezzanine, Pin idle lodged, Pin seeded bypassed, Admit lodged, Load case-matrix, Reset to lodged. Toggle parent-holds-repo / child-is-worktree-of-that-repo / parent `CLAUDE.md` loaded — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/entresol/
- Folder: `projects/entresol/`
