# Pintle hook

Tiny rudder-pintle classifier for relative PreToolUse Bash hook deadlock. A `PreToolUse` hook on Bash registered with a **relative** command path breaks irrecoverably as soon as the Bash tool cwd (which persists across calls) drifts. Resolution uses the drifted cwd → ENOENT. Then every later Bash call fails before running. A corrective `cd` also goes through the broken hook.

Idle word is **hinged**. Seeded state is seized / #91226 (cwd drifted; hook ENOENT; every Bash blocked including corrective cd). Never idle as seized / pealed / drained / pooled / warded / first-wins.

```bash
node projects/pintle/hook/pintle.mjs projects/pintle/data/91226.json
node projects/pintle/hook/pintle.mjs projects/pintle/data/hinged.json
echo '{"projectRoot":"/opt/project","bashCwd":"/opt/project/src","hookCommand":"python3 scripts/guard.py","resolveMode":"bashCwd"}' | node projects/pintle/hook/pintle.mjs
node --test projects/pintle/hook/pintle.test.mjs
```

Empty stdin uses the idle **hinged** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hinged`, `seized`, `hold`, `alarm`, `idleWord`.

Given `{ projectRoot, bashCwd, hookCommand, resolveMode }`:

- **HINGED** if a relative hook resolves from project root (or cwd still equals root); Bash still works after cd
- **SEIZED** if a relative hook resolves against drifted `bashCwd` → ENOENT; every later Bash call is blocked (#91226)
- **CWD-DRIFTED** if Bash cwd persisted after `cd some/subdirectory`
- **HOOK-ENOENT** if the relative command cannot be opened from the drifted cwd
- **SESSION-DEADLOCK** if every subsequent Bash call fails before running (even `pwd` / `echo test`)
- **CORRECTIVE-CD-BLOCKED** if a corrective `cd` also goes through the broken hook
- **WORKTREE-ESCAPE** if `isolation: worktree` was the only in-session escape
- **ORDINARY-SUBAGENT-INHERITS** if a non-worktree subagent inherited the broken state
- **ABSOLUTE-OK** if an absolute hook path is always hinged
- **PROJECT-DIR-ANCHORED** if `$CLAUDE_PROJECT_DIR` / project-root resolution is healthy
- **HOLD** if the pintle seats the gudgeon (cwd still at root, or root-anchored resolve)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the hinge is hinged or seized.

Primary: [anthropics/claude-code#91226](https://github.com/anthropics/claude-code/issues/91226). Cousins (cite only, not primaries): [#32361](https://github.com/anthropics/claude-code/issues/32361) CLOSED same-class relative path after Bash cd; [#5176](https://github.com/anthropics/claude-code/issues/5176) CLOSED hooks not found after cd; [#87890](https://github.com/anthropics/claude-code/issues/87890) OPEN EnterWorktree does not propagate to PreToolUse (inverse); [#65378](https://github.com/anthropics/claude-code/issues/65378) OPEN hooks ENOENT when session cwd deleted (distinct). openai/codex [codex#26675](https://github.com/openai/codex/issues/26675) OPEN Plugin PostToolUse relative command from workspace cwd; [codex#23996](https://github.com/openai/codex/issues/23996) OPEN project hooks in linked worktrees cwd mismatch.

Hypothesis only (NON-BINDING): resolution against bashCwd for relative paths is the defect; anchoring to projectRoot / `$CLAUDE_PROJECT_DIR` is healthy. Spawn/ENOENT must not hard-block the whole Bash tool forever. Do not claim a root cause in Claude Code source you have not seen.

NOT millrace / sluice-gate / pool-gauge / peal-board / belfry / carillon / postern-gate / night bailey / plane-table / alidade / garner grain-bin / woodworking / mm-slider. Product name stays Pintle. Do not rename to Gudgeon / Tiller / Rudder / Hinge / Pin / Strap / Stock.
