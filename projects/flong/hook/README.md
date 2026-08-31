# Flong hook

Tiny stereotype-foundry classifier for a torn Git Bash shell snapshot. Claude Code writes `~/.claude/shell-snapshots/snapshot-bash-*.sh` and sources it before every Bash tool. The writer serializes git-completion as `eval $'__git_* () \n{ ... }'`. The file is unparseable. `bash -n` dies at unexpected token `(`. Sourcing exits **127** with empty stdout/stderr. Interactive Git Bash works. Codex *discards* an unparseable snapshot; Claude Code *sources* it.

Idle word is **struck**. Seeded state is torn / #90916. Never idle as "flong" / "foundry" / "chase" / "proof" / "mold" / "stereotype" / "snapshot" / "bash".

```bash
node projects/flong/hook/flong.mjs projects/flong/data/90916.json
node projects/flong/hook/flong.mjs projects/flong/data/struck.json
node --test projects/flong/hook/flong.test.mjs
```

Empty stdin uses the idle **struck** flong (PATH + aliases). Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `struck`, `torn`, `hold`, `alarm`, `idleWord`, `walk`, `contrast`.

- **STRUCK** if the snapshot is a small valid flong (PATH + aliases); proof pulls clean; builtins live
- **TORN** if the parse-fail shape is present: mid-token head, eval-replay `__git_*` plate, dangling Shadow pkill comment
- **PARSE-FAIL** if the bash -n equivalent walk hits unexpected token `(`
- **EXIT-127** if sourcing the torn flong would kill the tool with empty stdio
- **GIT-COMPLETE** if `__git_*` completion functions were serialized into the mold
- **EVAL-REPLAY** if the writer used `eval $'__git_* () \n{ ... }'`
- **MID-TOKEN** if a line begins mid-token (`ord" in`)
- **DANGLING-COMMENT** if the tail is `# Shadow pkill…` with no function body
- **BYTE-IDENTICAL** if regenerated snapshots match (reporter: 65284 bytes)
- **BUILTINS-DEAD** if even `pwd` and `/usr/bin/…` die
- **INTERACTIVE-OK** if interactive Git Bash still works (witness)
- **SOURCE-KILLED** if the tool sources the torn flong instead of discarding it

Primary: [anthropics/claude-code#90916](https://github.com/anthropics/claude-code/issues/90916). Same-class (cite, not primary): [#15128](https://github.com/anthropics/claude-code/issues/15128), [#16377](https://github.com/anthropics/claude-code/issues/16377), [#61293](https://github.com/anthropics/claude-code/issues/61293), [#19053](https://github.com/anthropics/claude-code/issues/19053). Cross: [openai/codex#36589](https://github.com/openai/codex/issues/36589).

NOT Bulla / Trompe / Davy / Slype / Escutcheon / Quoin.
