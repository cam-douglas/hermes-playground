# Midden

An **archaeological refuse-heap / ash-and-bone strata booth** — soil umber, bone white, charcoal strata layers, ash gray, kiln amber glints; fonts **Fraunces** (display) + **Source Sans 3** (body) + **IBM Plex Mono** (mono) — for a real Claude Desktop defect: **ORPHANED WORKTREE ENTRY IS RETRIED EVERY 30 MINUTES FOREVER; CLEANUP CAN NEVER SUCCEED.**

Primary:

- [anthropics/claude-code#93081](https://github.com/anthropics/claude-code/issues/93081) (OPEN, bug, has repro, platform:windows, area:desktop). Title: `[BUG] Orphaned worktree entry is retried every 30 minutes forever; cleanup can never succeed`. Authored 2026-09-09T12:45:23Z by emanon-i. Claude desktop for Windows **1.49585.0.0** (first observed on 1.34493.1.0; unchanged across 13 versions). Claude Code **2.1.216**. Windows 11 Pro build 26220. git **2.53.0.windows.1**. Worktree `clever-bassi-12c5dc` under `<repo>\.claude\worktrees\`. Same five-line sequence every 30 minutes — **853 repeats over 20 days** (first 2026-08-21, still going 2026-09-09) across restarts and 13 app updates. Deadlock: (1) `git worktree remove --force` fails with `fatal: is not a working tree` because the `.git` link is gone; (2) manual-cleanup fallback refuses with `.git link missing (partial remove); not safe to rm` — same reason. Store entry is **not** pruned despite `[WorktreePool] Pruning orphaned store entry … (directory gone or not a worktree)`. Expected: fallback treats partial-remove as expected and removes (after `git worktree prune`), or prune/mark permanently-failed after first failure so GC stops; surface once to the user.

22:50 midden: an archaeological refuse-heap booth that should keep a partial-remove worktree **cleared** (one GC pass); instead the midden is **mounded** — git worktree remove and manual fallback both refuse for the same missing `.git` link, store entry never pruned, same cycle every 30m (853×/20d) — score mounded or admit cleared.

Score mounded or admit cleared.

Idle word: **cleared** (HOLD: GC treats partial-remove as expected, removes the directory after `git worktree prune`, or marks the store entry permanently-failed after the first failure so the loop stops). Seeded word: **mounded** / #93081 (git remove fails; fallback refuses; store claims prune but the entry remains; 853 repeats / 20 days / 13 updates). Path word: **midden**. Never idle distinct / held / raised / sterling / primed / lodged or seeded conflated / steered / fallen / debased / flashed / greenroomed / scaffold.

Phrase: **a WorktreePool that remounds the same orphan every half hour is not cleared — it is a midden. Score mounded or admit cleared.**

- **cleared** = IDLE: HOLD; one GC pass removes the partial-remove orphan and stops
- **mounded** = #93081 seeded path: git remove and fallback both refuse; store stays; 30m retry
- **midden** = path word: a WorktreePool that remounds the same orphan every half hour is not cleared
- **partial-remove** = `.git` link file gone, directory still exists
- **git-remove-fails** = `git worktree remove --force` → `fatal: is not a working tree` (exit 128)
- **fallback-refuses** = `.git link missing (partial remove); not safe to rm`
- **store-not-pruned** = log claims pruning orphaned store entry; entry remains
- **thirty-minute-cadence** = same five-line sequence every 30 minutes; 853× / 20d / 13 updates
- **has-repro** = Desktop 1.49585.0.0 Windows 11; Claude Code 2.1.216; worktree `clever-bassi-12c5dc`
- **hold** = HOLD alias for idle cleared
- **cousins** = cite-only #75911 #78350 #91405 #91246 #92078 — do not clone
- **fixtures** = row list for the midden booth
- **walk** = published idle cleared → partial-remove → git-remove-fails → fallback-refuses → store-not-pruned → thirty-minute-cadence → midden

Verdicts: cleared, mounded, midden, hold, partial-remove, git-remove-fails, fallback-refuses, store-not-pruned, thirty-minute-cadence, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring refuse-heap booth. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the heap is **mounded** or already **cleared**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): WorktreePool GC may treat the same missing `.git` link as both "not a working tree" (so git remove fails) and "not safe to rm" (so fallback refuses), then log a prune that does not remove the store entry — so the next 30-minute tick rediscovers the same orphan. Invite verify against #93081 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93081](https://github.com/anthropics/claude-code/issues/93081)
- Cite-only: [anthropics/claude-code#75911](https://github.com/anthropics/claude-code/issues/75911) (WorktreePool reclaims/re-leases while a session is still using it — premature reclaim race)
- Cite-only: [anthropics/claude-code#78350](https://github.com/anthropics/claude-code/issues/78350) (WorktreePool reaps a worktree while its leasing session is actively running)
- Cite-only: [anthropics/claude-code#91405](https://github.com/anthropics/claude-code/issues/91405) (pool assigns relaunched sessions to the wrong worktree)
- Cite-only: [anthropics/claude-code#91246](https://github.com/anthropics/claude-code/issues/91246) (pooled worktrees never reclaimed — archive pools with no expiry)
- Cite-only: [anthropics/claude-code#92078](https://github.com/anthropics/claude-code/issues/92078) (background full checkout of pooled worktrees is unthrottled)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:desktop
- Author emanon-i. Filed 2026-09-09T12:45:23Z
- Claude desktop for Windows 1.49585.0.0 (first observed 1.34493.1.0; 13 updates unchanged)
- Claude Code 2.1.216. Windows 11 Pro build 26220. git 2.53.0.windows.1
- Worktree name kept: `clever-bassi-12c5dc`. Path: `<repo>\.claude\worktrees\clever-bassi-12c5dc`. Leased by none
- Partially-removed state: `.git` link file gone, directory still exists
- `git worktree remove --force` fails with `fatal: is not a working tree` (exit 128)
- Manual-cleanup fallback refuses: `.git link missing (partial remove); not safe to rm`
- `[WorktreePool] Pruning orphaned store entry clever-bassi-12c5dc (directory gone or not a worktree)` is emitted every iteration; the entry is not pruned
- Same five-line sequence every 30 minutes. 853 cycles across `main1.log` + `main.log`. First appearance 2026-08-21; still going 2026-09-09
- Survives app restarts and auto-updates — state lives in the on-disk worktree store
- Suggested in the issue (narrative only — do NOT implement a Claude Code fix): treat partial-remove as expected and remove after `git worktree prune`; or prune/mark permanently-failed after first failure; surface once to the user

Problem found: A WORKTREEPOOL THAT REMOUNDS THE SAME ORPHAN EVERY HALF HOUR IS NOT CLEARED — IT IS A MIDDEN.

Why this solution: a diagnostic archaeological refuse-heap booth for the cleared → mounded drift, so a reader can pin idle cleared, load the #93081 mounded path, and score midden / partial-remove / git-remove-fails / fallback-refuses / store-not-pruned / thirty-minute-cadence against the published facts.

## Why not a clone

This is specifically: **ORPHANED WORKTREE ENTRY IS RETRIED EVERY 30 MINUTES FOREVER; CLEANUP CAN NEVER SUCCEED.**

**NOT Diplopia/#93012** (Remote Control web and mobile derive the environment label from different payload fields). Different paradigm.

**NOT Greenroom/#92988** (Desktop Code tab has no way to queue a message until the turn fully ends). Different paradigm.

**NOT Guillotine/#92974** (background-mode permission dialog shows only a Deny button). Different paradigm.

**NOT Entresol/#93010** (parent CLAUDE.md skipped for a worktree of that parent's repository). Different paradigm.

**NOT Hallmark/#93021** (resume loses `[1m]` on non-first-party `BASE_URL`). Different paradigm.

**NOT Flashpan/#93015** (`lastRunAt` stamps without a session birth). Different paradigm.

**NOT Secateurs/#92979** (Read silent partial of large instruction/rule files). Different paradigm.

**NOT Palinode/#92998** (MEMORY.md bottom truncation of newest corrections). Different paradigm.

**NOT Ferrule/#92968** / Interlock / Homestead / Shibboleth / Quill/#92788 / Colophon/#92918 / Sallyport/#92901.

**NOT leftover woodworking / mm-slider / clones.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **a WorktreePool GC that should keep a partial-remove worktree cleared after one pass instead remounds the same orphan every 30 minutes, because git worktree remove and the manual fallback both refuse for the same missing `.git` link, and the store entry is never pruned.**

Do NOT rename this product Diplopia, Greenroom, Guillotine, Entresol, Hallmark, Flashpan, Secateurs, Palinode, Ferrule, Interlock, or any existing catalog slug.
Do NOT reuse idle cleared / mounded / midden on a later ship.
Do NOT reuse Atkinson Hyperlegible. Do NOT reuse Cormorant Garamond. Do NOT reuse Source Code Pro (Diplopia). Do NOT reuse Spectral (Guillotine display). Do NOT reuse Cinzel (Hallmark display). Do NOT reuse Figtree (Secateurs body). Do NOT reuse Playfair Display + Outfit + Space Mono (Entresol). Do NOT reuse Lato + Fira Code (Hallmark body/mono). Do NOT reuse Newsreader + Manrope + JetBrains Mono (Flashpan). Do NOT reuse Bitter + Roboto Mono (Secateurs display/mono). Do NOT reuse Cardo + Nunito Sans (Palinode). Do NOT reuse Oswald (Ferrule display). Do NOT reuse Public Sans + Cousine (Guillotine body/mono). Do NOT reuse DM Sans (Greenroom body).

Different surface: Desktop WorktreePool orphaned-GC deadlock on a partial-remove directory vs Remote Control environment-label field split / Desktop Code tab missing wait-for-full-turn-end queue / Deny-only permission dialog / parent-directory memory skip / resume `[1m]` / scheduled-task `lastRunAt` / Read silent partial / MEMORY.md write-path bottom truncation.

Product name stays **Midden**. Name/slug `midden` unused in catalog.json (248 products before this ship; Diplopia is #248).

Different UI: archaeological midden / refuse-heap / ash-and-bone strata booth / soil umber / bone white / charcoal strata / ash gray / kiln amber glints. Fraunces / Source Sans 3 / IBM Plex Mono. NOT ophthalmology acuity / phoropter / Snellen. NOT green velvet / tungsten. NOT scaffold / guillotine. NOT gallery mezzanine. NOT silversmith assay. NOT flintlock flash-pan. NOT garden pruning bench. NOT scriptorium wax/vellum. NOT ferrule clamp. NOT interlock lockout.

Different verbs: Walk the strata, Admit cleared, Score mounded, Pin idle cleared, Pin seeded mounded, Trowel the git refuse, Sieve the fallback, Reset to cleared.

Different idle: **cleared**. Different #93081 seeded path: **mounded**. HOLD: **cleared**. ALARM: **mounded** / **midden** / **partial-remove** / **git-remove-fails** / **fallback-refuses** / **store-not-pruned** / **thirty-minute-cadence**. Path: **midden**.

## How to score

```bash
node --test projects/midden/midden.test.mjs
node projects/midden/midden.mjs projects/midden/data/93081.json
node projects/midden/midden.mjs projects/midden/data/cleared.json
echo '{"seed":"mounded"}' | node projects/midden/midden.mjs
```

Open the living card at `projects/midden/index.html` (or the live path `/midden/`). Buttons: Walk the strata, Admit cleared, Score mounded, Pin idle cleared, Pin seeded mounded, Pin midden, Trowel the git refuse, Sieve the fallback, Reset to cleared. Toggle git-remove-fails / fallback-refuses / store-not-pruned / thirty-minute-cadence / partial-remove — the score flips. Rest a fixture JSON on the ash-sieve tray. `?embed=1` hides chrome.

The strata reconstruct the reporter’s five-line cycle from the published #93081 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/midden/
- Folder: `projects/midden/`
