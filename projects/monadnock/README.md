# Monadnock

A **geological monadnock / residual mountain / trig survey booth** — an isolated residual peak (local main left standing) while the surrounding range (origin/main) moved on. Nested submodule = isolated massif. Fonts **Staatliches** (display) + **Manrope** (sans) + **IBM Plex Mono** (mono). Palette: granite `#2B2F36`, lichen `#6B8F71`, summit sky `#A8C5D4`, iron `#1A1C1F`, cairn `#C4B8A8`, blaze `#E8A54B`. Granite survey-station UI. NOT a clerk desk, followspot, stone calendar, mill weir, sailing irons, bow cathead, film continuity, Nullarbor, petard, greenroom, attainder court, or any prior catalog paradigm.

A trig cairn should mark `origin/main` after a fetch. Instead a desktop worktree session rooted inside a git submodule branches from local `main`, skips the fetch, and records a raw SHA.

Primary:

- [anthropics/claude-code#93703](https://github.com/anthropics/claude-code/issues/93703) (OPEN). Title: `Worktree branched from local main instead of origin/main when the session is rooted inside a git submodule (desktop app)`. Labels: bug, has repro, platform:macos, area:desktop. Desktop app worktree session rooted INSIDE a git submodule branches from local `main` instead of `refs/remotes/origin/main`, and does not fetch first. If local main is behind, the session silently starts on old code. Measured: session started on a month-old base, 204 commits behind origin/main (local main `f84446c12d` dated 2026-08-10; origin/main `a8cef9307a`). CLI does NOT have this problem (even on older 2.1.220) — surfaces behave differently. Same desktop app is CORRECT when session rooted at the superproject; only nested-repo case is wrong. Reflog spelling differs: desktop records raw SHA `f84446c12d9b6ddee03a4d739bd5f56ce6b90fc4`; CLI records ref name `origin/main`. `worktree.baseRef` unset everywhere; documented `fresh` default should apply (branch from origin/<default-branch>, fetching first if not fetched in 24h). Expected: Created from refs/remotes/origin/main. Desktop app 2.1.260 (affected) / CLI 2.1.220 (not affected). macOS. Cousins cite-only: #93231 Escheat (worktree lock), #93193 Mondegreen (isolation:worktree Bash), #93081 Midden (orphaned worktree GC), #93010 Entresol (parent CLAUDE.md for worktree child). Backups cite-only (next focus only — do not auto-pick): #93722 #93672 #93652 #93680 #93618 #93694 #93735 #93733.

08:50 monadnock: a geological monadnock / residual mountain / trig survey booth for #93703. Idle **fresh** / seeded **residual** / path **submodule-base**. Score monadnock or admit fresh.

Score monadnock or admit fresh.

Idle word: **fresh** (HOLD: worktree branched from origin/main after fetch; nested submodule same as superproject). Seeded word: **residual** / #93703 (local main left standing; no fetch; raw SHA base). Path word: **submodule-base**. Product score: **monadnock**. Never idle plain / lit / due / flowing / underway / seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / untainted / voiced / lodged / kindled / flushed / solitary / hit or seeded ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score monadnock or admit fresh.**

- **fresh** = IDLE: HOLD; worktree branched from origin/main after fetch; nested submodule same as superproject
- **residual** = #93703 seeded path: local main left standing; no fetch; raw SHA base
- **monadnock** = product score word for a survey station whose residual peak still stands
- **submodule-base** = path word: nested-repo worktree takes local main, not origin/main
- **hold** = HOLD alias for idle fresh
- **fetch-first** = documented `fresh` default fetches first if not fetched in 24h
- **origin-main** = expected base: `refs/remotes/origin/main`
- **local-main** = desktop branches from local `main` (`f84446c12d`, dated 2026-08-10)
- **nested-repo** = session rooted inside a git submodule — isolated massif
- **superproject-ok** = same desktop app is correct when rooted at the superproject
- **raw-sha** = desktop records `Created from f84446c12d9b6ddee03a4d739bd5f56ce6b90fc4`
- **ref-name** = CLI records `Created from origin/main`
- **behind-204** = month-old base, 204 commits behind origin/main
- **has-repro** = published shape: macOS desktop 2.1.260; CLI 2.1.220; 204 behind; raw SHA vs ref name
- **cousins** = cite-only #93231 #93193 #93081 #93010 — do not rebuild Escheat / Mondegreen / Midden / Entresol
- **backups** = cite-only #93722 #93672 #93652 #93680 #93618 #93694 #93735 #93733 — do not auto-pick
- **fixtures** = trig cairn / residual peak / nested massif / fetch sill / reflog plate
- **walk** = published idle fresh → origin-main → fetch-first → superproject-ok → nested-repo → local-main → behind-204 → raw-sha → ref-name → submodule-base → monadnock

Verdicts: fresh, residual, monadnock, submodule-base, hold, fetch-first, origin-main, local-main, nested-repo, superproject-ok, raw-sha, ref-name, behind-204, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the survey station is **residual** / **monadnock** or already **fresh**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): desktop worktree base resolution may take the nested repo's local default-branch tip (or a raw SHA) instead of the fresh origin/<default> path used at superproject root / CLI. Invite verify against #93703 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93703](https://github.com/anthropics/claude-code/issues/93703)
- Cite-only cousins: #93231 (OPEN — Escheat worktree lock; different defect), #93193 (OPEN — Mondegreen isolation:worktree Bash; different defect), #93081 (OPEN — Midden orphaned worktree GC; different defect), #93010 (OPEN — Entresol parent CLAUDE.md for worktree child; different defect)
- Backups (data only; next focus only — do not auto-pick): #93722, #93672, #93652, #93680, #93618, #93694, #93735, #93733

What happened (from the issue text — do not invent):

- OPEN.
- Labels: bug / has repro / platform:macos / area:desktop
- Desktop app 2.1.260 (affected) / CLI 2.1.220 (not affected)
- Worktree session rooted INSIDE a git submodule
- Branches from local `main` instead of `refs/remotes/origin/main`
- Does not fetch first
- If local main is behind, session silently starts on old code
- Measured: month-old base, 204 commits behind origin/main
- Refs at test time (all three distinct): origin/main `a8cef9307a`; main `f84446c12d` (204 behind, dated 2026-08-10); HEAD `446c96d749` (parked feature branch)
- Desktop nested: `branch: Created from f84446c12d9b6ddee03a4d739bd5f56ce6b90fc4`
- CLI 2.1.220 from the same directory: `branch: Created from origin/main`
- Same desktop app rooted at the superproject: `branch: Created from refs/remotes/origin/main`
- Reflog spelling differs: desktop records raw SHA; CLI records ref name
- `worktree.baseRef` unset everywhere
- Documented `fresh` default should apply (branch from origin/<default-branch>, fetching first if not fetched in 24h)
- Expected: Created from refs/remotes/origin/main
- Published second variant (same desktop version, same submodule, task chip): `Created from HEAD` — 753 commits behind, carrying 4 commits from an unrelated PR. Local main already existed at `f84446c12d` on that date. Included as published text only; not a second booth.
- Impact: silent. ~45 minutes before anyone noticed the code being discussed no longer existed.
- Unknown if a regression; first noticed on 2.1.260. Older CLI 2.1.220 is a different surface.

Problem found: A DESKTOP WORKTREE SESSION ROOTED INSIDE A GIT SUBMODULE BRANCHES FROM LOCAL `main` INSTEAD OF `refs/remotes/origin/main` AND DOES NOT FETCH FIRST; LOCAL MAIN CAN STAND 204 COMMITS BEHIND AS A RAW SHA.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the survey station stayed **fresh** or went **residual**. Educational trig survey booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Created from refs/remotes/origin/main; matching the documented `fresh` default; matching what the same app does when rooted at the superproject; fetch first if not fetched in 24h

## Why not a clone

This is specifically: **A DESKTOP WORKTREE SESSION ROOTED INSIDE A GIT SUBMODULE BRANCHES FROM STALE-STANDING LOCAL `main` INSTEAD OF `origin/main`; NO FETCH; RAW SHA BASE.**

Novel paradigm: geological monadnock / residual mountain / trig survey station whose cairn should mark origin/main after fetch; instead an isolated residual peak (local main) is left standing while the surrounding range (origin/main) moved on. Nested submodule = isolated massif.

**NOT Rider/#93683** (tool-result `type=attachment` rider). Different defect. NOT parliamentary clerk desk / bill-rider. Do not reuse plain / ridden / attachment-rider.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Do not reuse lit / dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Anachronism/#93585** (cloud pre-warm vs session-start checkout race). Different defect. NOT continuity slate / darkroom. Do not reuse tip / prewarm-latch. (Anachronism seeded *stale* is a different surface — cloud pre-warm latch — and is not this booth's seeded word.)

**NOT Nullarbor/#93595** (plugin HTTP MCP `${VAR}` header expands empty). Different defect. NOT saltbush / empty-bearer. Do not reuse stamped / emptied / empty-expand.

**NOT Petard/#93607** (Linux Bash-tool `pkill -f` matches wrapper argv). Different defect. NOT siege petard. Do not reuse standing / hoisted / wrapper-argv.

**NOT Greenroom** (slug taken — theater green room / offstage waiting / mid-turn queue inject). Different defect. Do not reuse held / steered / greenroomed.

**NOT Attainder/#93529** (parked-permission retirement stamps `user-rejected`). Different defect. NOT court-of-attainder. Do not reuse untainted / attainted / retire-parked.

**NOT Escheat/#93231** — cite only (worktree lock left naming a dead PID). Do not rebuild.

**NOT Mondegreen/#93193** — cite only (isolation:worktree Bash substring `git`). Do not rebuild.

**NOT Midden/#93081** — cite only (orphaned worktree remove/GC refuse loop). Do not rebuild.

**NOT Entresol/#93010** — cite only (parent CLAUDE.md bypassed for worktree child). Do not rebuild.

Do NOT rename Monadnock to any existing catalog slug. Catalog currently has 301 products; Monadnock is #302.
Do NOT reuse idle plain / lit / due / flowing / underway / seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / untainted / voiced / lodged / kindled / flushed / solitary / hit, or seeded ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.
Display here is **Staatliches**. Body is **Manrope**. Mono is **IBM Plex Mono**.

Different surface: desktop nested-submodule worktree base (local main, no fetch, raw SHA) vs tool-result attachment rider vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist ignore vs scheduled WebSearch hang vs xnu ptmx race vs cloud pre-warm checkout vs lastRunAt-without-birth vs mid-turn queue inject vs parked-permission attainder vs worktree lock vs isolation:worktree Bash vs orphaned worktree GC vs parent CLAUDE.md cutaway.

Different UI: trig cairn / residual peak / nested massif / fetch sill / reflog plate. Staatliches / Manrope / IBM Plex Mono. Granite with lichen, summit sky, iron, cairn, blaze. NOT parchment clerk desk. NOT stage black. NOT marble fasti. NOT mill-house parchment. NOT Atlantic sailing. NOT oak timber. NOT green-room velvet. NOT court attainder.

Different verbs: Relevel the station, Score monadnock, Walk the massif, Compare fresh / residual, Pin idle fresh, Pin seeded residual, Pin submodule-base, Hold the fresh.

Different idle: **fresh**. Different #93703 seeded path: **residual**. HOLD: **fresh** / **hold**. ALARM: **residual** / **monadnock** / **submodule-base** / **local-main**. Path: **submodule-base**.

## How to score

```bash
node --test projects/monadnock/monadnock.test.mjs
node projects/monadnock/monadnock.mjs projects/monadnock/data/residual.json
echo '{"seed":"residual"}' | node projects/monadnock/monadnock.mjs
```

Open the living card at `projects/monadnock/index.html` (or the live path `/monadnock/`). Buttons: Relevel the station, Score monadnock, Walk the massif, Compare fresh / residual, Pin idle fresh, Pin seeded residual, Pin submodule-base, Hold the fresh. Toggle chips for: local-main, nested-repo, raw-sha, behind-204, fetch-first, origin-main, superproject-ok — the score flips. Lay a fixture JSON on the survey blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s submodule-base walk from the published #93703 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/monadnock/
- Folder: `projects/monadnock/`
