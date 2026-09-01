# Garner

A **grain loft / garner** — oak loft boards, hessian sacks, wheat sheaf marks, chalk tally on a bin door; warm grain ochre / sackcloth / loft-dust / iron-bin strap; Literata + Atkinson Hyperlegible + IBM Plex Mono — for a real Claude Desktop defect: archiving a session **releases its worktree to a reuse pool** rather than deleting it, with **no TTL / expiry / max-age**, so disk is never reclaimed.

Primary:

- [anthropics/claude-code#91246](https://github.com/anthropics/claude-code/issues/91246) (OPEN, bug, has repro, platform:linux, area:desktop, filed 2026-09-01T15:09:32Z). Title: Desktop: pooled session worktrees are never reclaimed — archiving pools instead of removing, with no expiry. Desktop 1.40609.0, Ubuntu. Reporter secondl1ght.

An archive that stocks the loft instead of airing it is not a hold. Score the loft or admit **aired**.

Idle word: **aired**. Seeded state: **stocked** / #91246 — archive → pool release; leasedBy null; still on disk; git worktree listed; no TTL; artifacts kept. Never idle as stocked / pooled / drained / hinged / pealed / warded / first-wins / seized.

A **garner** is a grain store / granary loft. Archive should empty the bin (air the loft). Instead Desktop releases the filled bin into a silent stock that never expires — grain (build artifacts) sits forever with no TTL and no loft ledger.

- **stocked** = #91246: archive → pool release; leasedBy null; still on disk; git worktree listed; no TTL; artifacts kept
- **archived-to-pool** = cleanup path runs and succeeds then WorktreePool released worktree to pool
- **no-ttl** = `git-worktrees.json` has createdAt + pooledAt but no TTL / expiry / max-age
- **still-on-disk** = cleanup succeeds but does not delete; directory still present
- **git-worktree-listed** = still listed by `git worktree list` after archive
- **leasedBy-null** = pooled with `leasedBy: null`
- **artifacts-kept** = reporter labeled `.next` 5.0G + `node_modules` 1.2G + checkout ~120M = **6.3G** total; mechanism itself ~120M shared objects
- **docs-say-remove** = desktop docs say the archive icon removes the worktree
- **cleanupPeriodDays-misses-desktop** = `cleanupPeriodDays` is transcript-retention; Desktop Code-tab session worktrees fall outside interactive exit, subagent cleanup, and the periodic sweep
- **untrackedDirGc-only** = only GC state is `untrackedDirGc` for `.claude/worktrees` roots
- **pooledAt-for-reuse-not-evict** = `pooledAt` orders reuse, not eviction
- **parallel-multiplies** = concurrent sessions cannot share one worktree; pool only recycles idle ones and never shrinks
- **hold** = archive empties the bin; disk reclaimed
- **aired** = HOLD: archive removes the worktree; bin empty; disk reclaimed

Verdicts: aired, stocked, archived-to-pool, no-ttl, still-on-disk, git-worktree-listed, leasedBy-null, artifacts-kept, docs-say-remove, cleanupPeriodDays-misses-desktop, untrackedDirGc-only, pooledAt-for-reuse-not-evict, parallel-multiplies, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the loft is aired or stocked.

Hypothesis only (NON-BINDING): treat missing pool TTL/eviction + archive-to-pool instead of remove as the defect; docs/archive UX claiming removal while WorktreePool releases is unhealthy; applying `cleanupPeriodDays` (or a size/count bound) to Desktop Code-tab session worktrees is healthy. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **DESKTOP ARCHIVE RELEASES SESSION WORKTREE TO A POOL WITH NO EXPIRY — DOCS SAY REMOVE; DISK NEVER RECLAIMED.**

NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork VM + wcifs/bindflt kernel Toke/File/SeAt paged-pool leak / millrace / sluice-gate / pool-gauge.
NOT **Pintle** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — relative PreToolUse Bash hook cwd-drift deadlock.
NOT **Carillon** ([#91250](https://github.com/anthropics/claude-code/issues/91250)) — plugin SessionStart first-wins peal board.
NOT **Postern** ([#91223](https://github.com/anthropics/claude-code/issues/91223)) — socket-dir squat.
NOT **Alidade** ([#91055](https://github.com/anthropics/claude-code/issues/91055)) — foreign host plane-table.
NOT leftover woodworking / mm-slider.
NOT #83180 alone (allocator reuses idle dirs — race, not missing reclaim).
NOT #88239 alone (teardown refuses on clean worktree — surfaces error).
NOT #76144 (gitdir literal ".git" false-prunable — inverse reclaim bug).
NOT #75911 / #79366 / #85282 (reuse / re-lease while in use).
NOT #84162 (Windows junction unsafe remove).
NOT #88883 (remote/SSH archive cleanup daemon mismatch).
NOT #87963 (Remote Control child exit leaks worktree).

Cousins are cite-only on a cousin strip; primary stays #91246.

Product name stays **Garner**. Do not rename to Granary, Bin, Loft, Silo, Hopper, Crib, Barn, Mill, Sluice, Pool, Gauge.

Different UI: oak loft boards, hessian sacks, wheat sheaf marks, chalk tally on a bin door; warm grain ochre / sackcloth / loft-dust / iron-bin strap. Literata + Atkinson Hyperlegible + IBM Plex Mono. NOT Fraunces millrace (Sluice). NOT Syne/DM Sans tiller (Pintle). NOT Playfair oak belfry (Carillon). NOT Cinzel night bailey (Postern). NOT Libre Caslon plane-table (Alidade).

Different verbs: score the loft, pin idle aired, pin seeded stocked, admit aired, load fixtures, reset to aired. Not "Score the race/hinge/peal/peg/postern".

Different idle: **aired**.

## Live catalog path

`/garner/` is this static loft desk. Path `https://hermes-playground-green.vercel.app/garner/` and subdomain `https://garner.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `06:50 / hermes catalog #107 / #91246`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **aired** — archive removes the worktree; bin empty; disk reclaimed.
2. Seed **stocked** → #91246: archive → pool release; leasedBy null; still on disk; git worktree listed; no TTL; artifacts kept.
3. Loft UI: bin door / archive latch / airing hatch. Aired = empty bin. Stocked = filled pooled bin.
4. Cousin cite strip labeled cousin-not-primary: [#88239](https://github.com/anthropics/claude-code/issues/88239) / [#83180](https://github.com/anthropics/claude-code/issues/83180) / [#76144](https://github.com/anthropics/claude-code/issues/76144) / [#75911](https://github.com/anthropics/claude-code/issues/75911) / [#88883](https://github.com/anthropics/claude-code/issues/88883) / [#87963](https://github.com/anthropics/claude-code/issues/87963) / [#84162](https://github.com/anthropics/claude-code/issues/84162). Cite only. Primary stays #91246.
5. **Score the loft** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/garner/index.html` in a browser, or serve the repo root and visit `/garner/` (Vercel rewrite → `/projects/garner`). No build step. Optional hook:

```bash
node projects/garner/hook/garner.mjs projects/garner/data/91246.json
node projects/garner/hook/garner.mjs projects/garner/data/aired.json
node --test projects/garner/hook/garner.test.mjs
```

Stocked seed → stocked/alarm. Aired seed → aired/hold.

`projects/garner/hook/garner.mjs` classifies a probe ticket JSON `{ archived, poolRelease, leasedBy, stillOnDisk, gitWorktreeListed, ttlPresent, docsSayRemove, artifactBytes, cleanupPeriodDaysApplies }` and returns `{ verdict, chips[], reasons[], aired, stocked, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91246.json`, `data/stocked.json`, `data/aired.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts. Reporter’s 6.3G / 5.0G / 1.2G / 120M only as labeled issue numbers, never invented.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91246](https://github.com/anthropics/claude-code/issues/91246). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Paste/drop a probe ticket JSON and score it.
3. Loft UI (bin door / archive latch / airing hatch). Aired = empty bin, stocked = filled pooled bin.
4. Cousin-not-primary cite strip: #88239, #83180, #76144, #75911, #88883, #87963, #84162.

## Sources

- [anthropics/claude-code#91246](https://github.com/anthropics/claude-code/issues/91246) OPEN — primary. Product stays Garner.
- Follow-up on the same issue: desktop Code-tab session worktrees fall outside every documented cleanup path (interactive exit, subagent worktrees, periodic sweep for subagents/background). Sweep skip list leaves `--worktree` sessions you haven’t backgrounded.
- Cousins (cite, not primaries):
  - [#88239](https://github.com/anthropics/claude-code/issues/88239) OPEN — teardown refuses on a clean worktree and surfaces an error.
  - [#83180](https://github.com/anthropics/claude-code/issues/83180) OPEN — allocator reuses idle dirs — race, not missing reclaim.
  - [#76144](https://github.com/anthropics/claude-code/issues/76144) OPEN — gitdir literal ".git" false-prunable — inverse reclaim bug.
  - [#75911](https://github.com/anthropics/claude-code/issues/75911) OPEN — reuse / re-lease while in use.
  - [#88883](https://github.com/anthropics/claude-code/issues/88883) OPEN — remote/SSH archive cleanup daemon mismatch.
  - [#87963](https://github.com/anthropics/claude-code/issues/87963) OPEN — Remote Control child exit leaks worktree.
  - [#84162](https://github.com/anthropics/claude-code/issues/84162) OPEN — Windows junction unsafe remove.
