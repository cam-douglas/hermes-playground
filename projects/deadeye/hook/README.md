# Deadeye hook

Tiny standing-rigging / lignum-vitae deadeye classifier for the Claude Code PreToolUse Bash hook whose relative `command` path is resolved against the Bash tool's mutable, `cd`-able working directory rather than the stable project root (`$CLAUDE_PROJECT_DIR`). After `cd some/subdirectory && ...`, further Bash fails with PreToolUse:Bash hook error ENOENT. The hook script still exists at `<repo_root>/scripts/...`. Corrective `cd` also goes through the broken hook. Fresh non-worktree subagent inherits the broken state; `isolation: "worktree"` resets cwd and escapes. Recurrence of closed #32361 / #5176 / #50960. Reporter hamazinger. Claude Code 2.1.252; macOS Darwin 25.6.0. Filed 2026-09-01.

Idle word is **reeved**. Seeded state is fouled / #91226 (relative hook path fouled against drifted Bash cwd → ENOENT seize → permanent deadlock). Never idle as creased / bled / latched / vanished / sealed / rebound / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

```bash
node projects/deadeye/hook/deadeye.mjs projects/deadeye/data/91226.json
node projects/deadeye/hook/deadeye.mjs projects/deadeye/data/reeved.json
echo '{"relativePath":true,"driftedCwd":true}' | node projects/deadeye/hook/deadeye.mjs
node --test projects/deadeye/hook/deadeye.test.mjs
```

Empty stdin uses the idle **reeved** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `reeved`, `fouled`, `hold`, `alarm`, `idleWord`.

Given `{ lanyardReevedAgainstMast, projectRootStable, relativePath, driftedCwd, enoentSeize, pretooluseBeforeCommand, persistentBashCwd, correctiveCdFails, subagentInherit, isolationWorktreeEscape, claudeProjectDirFix }`:

- **REEVED** if the deadeye reeves the hook lanyard against the mast (`$CLAUDE_PROJECT_DIR`) and Bash stays free
- **FOULED** if a relative PreToolUse Bash hook path resolves against drifted Bash cwd → ENOENT seize → permanent deadlock (#91226)
- **RELATIVE-PATH** if PreToolUse Bash matcher, `type: command`, relative `command` e.g. `python3 scripts/harness_health_dashboard/guard-deploy-commands.py`
- **DRIFTED-CWD** if after `cd some/subdirectory && ...` resolution is against the subdirectory, not project root
- **ENOENT-SEIZE** if PreToolUse:Bash hook error ENOENT; hook script still exists at `<repo_root>/scripts/...`; `pwd` and `echo` fail
- **PRETOOLUSE-BEFORE-COMMAND** if PreToolUse runs before the user command so every subsequent Bash call fails the same way
- **PERSISTENT-BASH-CWD** if Bash tool cwd persists across tool calls (documented behavior)
- **CORRECTIVE-CD-FAILS** if a corrective `cd` also goes through the broken hook and is rejected — no in-session recovery
- **SUBAGENT-INHERIT** if a fresh non-worktree subagent inherits the broken cwd state
- **ISOLATION-WORKTREE-ESCAPE** if `isolation: "worktree"` subagent gets working Bash (fresh cwd)
- **CLAUDE-PROJECT-DIR-FIX** if `$CLAUDE_PROJECT_DIR` is documented mitigation; expected: relative hook paths resolve against a stable root
- **RECURRENCE** if closed #32361 / #5176 / #50960 — same relative PreToolUse × cd CWD class; bare relative paths still ship
- **HAS-CLEAR-REPRO** if hamazinger filed #91226; has repro; macOS; area:bash; area:hooks
- **HOLD** if the deadeye is reeved (lanyard against mast; Bash free)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the lanyard is reeved or fouled.

Primary: [anthropics/claude-code#91226](https://github.com/anthropics/claude-code/issues/91226). Cousins (cite only, not primaries): [#32361](https://github.com/anthropics/claude-code/issues/32361) same relative PreToolUse × cd CWD class (closed); [#5176](https://github.com/anthropics/claude-code/issues/5176) hooks not found after cd (closed); [#50960](https://github.com/anthropics/claude-code/issues/50960) process CWD drifts; bare-relative hooks (closed); [#88830](https://github.com/anthropics/claude-code/issues/88830) hook failures invisible in desktop; [#87890](https://github.com/anthropics/claude-code/issues/87890) EnterWorktree does not propagate to PreToolUse (opposite polarity); [openai/codex#26675](https://github.com/openai/codex/issues/26675) Codex plugin PostToolUse relative command.

Hypothesis only (NON-BINDING): hook spawn may resolve relative commands against the Bash tool's current process cwd rather than project root. Do not claim source you have not seen beyond the issue's measured repro.

NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / berth clones / letterpress galley Reglet UI. Product name stays Deadeye. Do not rename to Reglet / Reliquary / Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew / Hasp / Berth / Bollard / Reveille / Callboard.
