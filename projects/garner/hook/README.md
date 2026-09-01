# Garner hook

Tiny grain-loft classifier for Desktop session worktree pool retain. Archiving a Desktop session releases its worktree to a reuse pool rather than deleting it. Docs say the archive icon removes the worktree. Cleanup runs and succeeds but does not delete. The directory stays on disk and stays listed by `git worktree list`. `git-worktrees.json` has `createdAt` + `pooledAt` but no TTL. Artifacts inside the worktree (reporter labeled `.next` 5.0G + `node_modules` 1.2G + checkout ~120M = 6.3G) are kept.

Idle word is **aired**. Seeded state is stocked / #91246 (archive → pool release; leasedBy null; still on disk; git worktree listed; no TTL; artifacts kept). Never idle as stocked / pooled / drained / hinged / pealed / warded / first-wins / seized.

```bash
node projects/garner/hook/garner.mjs projects/garner/data/91246.json
node projects/garner/hook/garner.mjs projects/garner/data/aired.json
echo '{"archived":true,"poolRelease":true,"leasedBy":null,"stillOnDisk":true,"gitWorktreeListed":true,"ttlPresent":false,"docsSayRemove":true,"artifactBytes":"6.3G","cleanupPeriodDaysApplies":false}' | node projects/garner/hook/garner.mjs
node --test projects/garner/hook/garner.test.mjs
```

Empty stdin uses the idle **aired** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `aired`, `stocked`, `hold`, `alarm`, `idleWord`.

Given `{ archived, poolRelease, leasedBy, stillOnDisk, gitWorktreeListed, ttlPresent, docsSayRemove, artifactBytes, cleanupPeriodDaysApplies }`:

- **AIRED** if archive removes the worktree; bin empty; disk reclaimed
- **STOCKED** if archive → pool release; leasedBy null; still on disk; listed; no TTL; artifacts kept (#91246)
- **ARCHIVED-TO-POOL** if cleanup succeeds then WorktreePool released the worktree to the pool
- **NO-TTL** if createdAt + pooledAt exist with no TTL / expiry / max-age
- **STILL-ON-DISK** if the directory is still present after archive
- **GIT-WORKTREE-LISTED** if `git worktree list` still shows it
- **LEASEDBY-NULL** if pooled with `leasedBy: null`
- **ARTIFACTS-KEPT** if labeled issue sizes remain (6.3G / 5.0G / 1.2G / ~120M)
- **DOCS-SAY-REMOVE** if docs claim the archive icon removes the worktree
- **CLEANUPPERIODDAYS-MISSES-DESKTOP** if `cleanupPeriodDays` does not apply to Desktop Code-tab session worktrees
- **UNTRACKEDDIRGC-ONLY** if the only GC state is `untrackedDirGc` for `.claude/worktrees` roots
- **POOLEDAT-FOR-REUSE-NOT-EVICT** if `pooledAt` orders reuse, not eviction
- **PARALLEL-MULTIPLIES** if concurrent sessions each need a worktree and the pool never shrinks
- **HOLD** if the loft is aired (archive emptied the bin)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the loft is aired or stocked.

Primary: [anthropics/claude-code#91246](https://github.com/anthropics/claude-code/issues/91246). Cousins (cite only, not primaries): [#88239](https://github.com/anthropics/claude-code/issues/88239) OPEN teardown refuses on a clean worktree; [#83180](https://github.com/anthropics/claude-code/issues/83180) OPEN allocator reuses idle dirs; [#76144](https://github.com/anthropics/claude-code/issues/76144) OPEN gitdir literal ".git" false-prunable; [#75911](https://github.com/anthropics/claude-code/issues/75911) OPEN reuse / re-lease while in use; [#88883](https://github.com/anthropics/claude-code/issues/88883) OPEN remote/SSH archive daemon mismatch; [#87963](https://github.com/anthropics/claude-code/issues/87963) OPEN Remote Control child exit leak; [#84162](https://github.com/anthropics/claude-code/issues/84162) OPEN Windows junction unsafe remove.

Hypothesis only (NON-BINDING): missing pool TTL/eviction + archive-to-pool instead of remove is the defect; docs/archive UX claiming removal while WorktreePool releases is unhealthy; applying `cleanupPeriodDays` (or a size/count bound) to Desktop Code-tab session worktrees is healthy. Do not claim a root cause in Claude Code source you have not seen.

NOT millrace / sluice-gate / pool-gauge / peal-board / belfry / carillon / postern-gate / night bailey / plane-table / alidade / rudder pintle / gudgeon / woodworking / mm-slider. Product name stays Garner. Do not rename to Granary / Bin / Loft / Silo / Hopper / Crib / Barn / Mill / Sluice / Pool / Gauge.
