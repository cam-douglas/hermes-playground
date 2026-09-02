# Caisson hook

Tiny dry-dock caisson / worktree-pool berth classifier for the Desktop automatic worktree pool that reseats a chip-relaunched session onto the wrong cradle and can power-wash a dirty cradle to recycle it. Session title and identity stay correct; only the working directory is wrong. Measured 42/44 (95.5%) wrong berths across 1,764 transcripts. Claude Code Desktop, Windows 11. Reporter IT-RT.

Idle word is **sealed**. Seeded state is rebound / #91405 (`rebindWorktree` to a wrong slot; `[WorktreePool] Reset dirty worktree … to clean for pooling`; 95.5% wrong berth). Never idle as fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

```bash
node projects/caisson/hook/caisson.mjs projects/caisson/data/91405.json
node projects/caisson/hook/caisson.mjs projects/caisson/data/sealed.json
echo '{"wrongWorktree":true,"chipRelaunch":true,"cwdWrong":true}' | node projects/caisson/hook/caisson.mjs
node --test projects/caisson/hook/caisson.test.mjs
```

Empty stdin uses the idle **sealed** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `sealed`, `rebound`, `hold`, `alarm`, `idleWord`.

Given `{ branchBound, dirtyCradlePreserved, correctCradle, wrongWorktree, dirtyResetWipe, rebindWithoutAdd, dualTranscriptPath, chipRelaunch, folderSlotRecycle, windowsFileLock, dataLoss, cwdWrong }`:

- **SEALED** if relaunch is bound to the correct branch-named cradle and dirty cradles are never power-washed to the pool
- **REBOUND** if `rebindWorktree` reseats the hull on a wrong recycled slot and/or Reset dirty wipe destroys uncommitted plates (#91405)
- **WRONG-WORKTREE** if expected cradle (`clever-rosalind-ef53a2`) does not match actual (`elegant-euler-7d5da0`)
- **DIRTY-RESET-WIPE** if `[WorktreePool] Reset dirty worktree … to clean for pooling` destroys uncommitted files
- **REBIND-WITHOUT-ADD** if `[rebindWorktree] Rebound` runs without a fresh `git worktree add`
- **DUAL-TRANSCRIPT-PATH** if the transcript is written into two different project directories (pre- and post-relocation fingerprint)
- **CHIP-RELAUNCH** if reopen from a background-task chip (“continue this work”) lands in a worktree that does not correspond to the work
- **BRANCH-BIND** if the ask is to bind the reopened session to its **branch** (unique/stable), not a recycled folder path
- **FOLDER-SLOT-RECYCLE** if the pool reseats by recycled folder slot rather than branch identity
- **WINDOWS-FILE-LOCK** if cleanup fails partway when a preview server or terminal holds files open
- **HAS-CLEAR-REPRO** if IT-RT filed #91405; 42/44 (95.5%); 1,764 transcripts; labels include has repro; Windows 11 Desktop
- **DATA-LOSS** if uncommitted plates are permanently destroyed by a dirty-cradle power-wash
- **HOLD** if the caisson is sealed (branch-named cradle; dirty cradles never power-washed)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the caisson is sealed or rebound.

Primary: [anthropics/claude-code#91405](https://github.com/anthropics/claude-code/issues/91405). Cousins (cite only, not primaries): [#79366](https://github.com/anthropics/claude-code/issues/79366) worktree sessions reuse an existing directory; [openai/codex#42001](https://github.com/openai/codex/issues/42001) Desktop ignores project cwd; [openai/codex#42201](https://github.com/openai/codex/issues/42201) dirty worktree under a false release SHA.

Hypothesis only (NON-BINDING): pool may key relaunch by recycled folder slot rather than branch identity, and may treat “dirty” as “safe to wipe for reuse.” Do not claim a root cause in Claude Code source you have not seen.

NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / escapement / locksmith / campanology / spindle chip-sweep. Product name stays Caisson. Do not rename to Berth / Bollard / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew / Hasp.
