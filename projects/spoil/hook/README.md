# Spoil hook

Tiny mining spoil-tip / assay-bank classifier for a stale private git index. Concurrent Claude Code sessions in one working tree. Each session sets `GIT_INDEX_FILE` to a private index. That trades a visible collision for **silent data loss**. A stale private index, relative to the new HEAD, lacks a path the other session added (commit **deletes** it) and holds the pre-commit blob for a path the other changed (commit **reverts** it). Exit 0. No conflict. No prompt. Pipe a probe ticket (`privateIndex` / `staleIndex` / `cotenantSessions` / `sharedHead` / `otherAddedMissing` / `otherChangedStale` / `silentExit0` / `noConflict` / `worktree` / `stagedDeletionExists` / `indexMatchesHead`) and get **spoiled** or **banked**.

Idle word is **banked**. Seeded state is spoiled / #90943. Never idle as "spoil" / "spoiled" / "stale" / "revert" / "delete" / "index" / "lag" / "concurrent" / "cotenant" / "banked-as-seed" / "trammel" / "hunting" / "traced" / "soundpost" / "flong" / "bulla" / "trompe" / "davy" / "moviola" / "clepsydra" / "dripping".

```bash
node projects/spoil/hook/spoil.mjs projects/spoil/data/90943.json
node projects/spoil/hook/spoil.mjs projects/spoil/data/banked.json
echo '{"privateIndex":true,"staleIndex":true}' | node projects/spoil/hook/spoil.mjs
node --test projects/spoil/hook/spoil.test.mjs
```

Empty stdin uses the idle **banked** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`.

- **BANKED** if the index matches HEAD — the spoil tip is properly banked; a commit would not delete living paths
- **SPOILED** if a stale private `GIT_INDEX_FILE` on a shared HEAD deletes the other's adds and reverts the other's blobs, exit 0, no conflict (#90943)
- **STALE-INDEX** if the private index predates another session's commit
- **PRIVATE-INDEX** if the session set `GIT_INDEX_FILE`
- **COTENANT** if two sessions (or a session plus scheduled automation) share one working tree
- **DELETE-ADD** if the stale index lacks a path the other session added → commit deletes it
- **REVERT-BLOB** if the stale index holds the pre-commit blob → commit reverts the file to old content
- **SILENT-OK** if the operation succeeds, exits 0, and prints nothing
- **NO-CONFLICT** if there is no conflict and no prompt
- **SHARED-HEAD** if both sessions share one repo, one branch, one HEAD
- **WORKTREE-IMMUNE** if a linked worktree has its own HEAD and own index
- **STAGED-DELETION-EXISTS** if a staged deletion's file still exists on disk (section 5); genuine deletion does not trip the guard (section 6)

Primary: [anthropics/claude-code#90943](https://github.com/anthropics/claude-code/issues/90943). Same-class (cite, not primary): [#86304](https://github.com/anthropics/claude-code/issues/86304), [#52051](https://github.com/anthropics/claude-code/issues/52051). Cross-ecosystem: [openai/codex#28972](https://github.com/openai/codex/issues/28972). Contrast: linked worktree has own HEAD+index → immune.

NOT Trammel / Soundpost / Flong / Bulla / Trompe / Davy / Moviola / Berth / Carrel / Clepsydra.
