# Crimp hook

Tiny bench / crimping-pliers classifier for the Claude Code defect where `~/.claude/settings.json` is persisted with an unlocked, non-atomic read-modify-write. Concurrent sessions tear the file (0-byte mid-truncate or valid JSON + stale trailing bytes) and silently drop each other's keys. Measured on Claude Code CLI 2.1.258 / VS Code extension 2.1.246→2.1.258; Ubuntu WSL2; up to ten concurrent processes. Reporter Lukasmolvaer. Filed 2026-09-02.

Idle word is **swaged**. Seeded state is torn / #91520 (unlocked non-atomic RMW; 1.3% torn reads under load; write-to-sibling+rename → 0 torn). Never idle as homed / armed / unheard / unbolted / snagged / reeved / fouled / creased / bled / latched / vanished / sealed / rebound / dark / spurious / fenced / swept / tolled / mute / discarded / arrested / indexed / chocked / clasped / sprung / hinged / pealed / crossed.

```bash
node projects/crimp/hook/crimp.mjs projects/crimp/data/91520.json
node projects/crimp/hook/crimp.mjs projects/crimp/data/swaged.json
echo '{"unlockedRmw":true,"torn":true}' | node projects/crimp/hook/crimp.mjs
node --test projects/crimp/hook/crimp.test.mjs
```

Empty stdin uses the idle **swaged** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `swaged`, `torn`, `hold`, `alarm`, `idleWord`.

Given `{ atomicWrite, lockedRmw, unlockedRmw, tmpRename, torn, truncate, staleTail, lostUpdate, permissionsDrop, hooksDrop, hasClearRepro }`:

- **SWAGED** if writeUserSettingsAndPush uses tmp+rename + lock; concurrent sessions cannot tear settings.json
- **TORN** if unlocked non-atomic RMW tears the file and/or loses updates (#91520)
- **TRUNCATE** if a reader observes the 0-byte mid-truncate window
- **STALE-TAIL** if a reader observes valid JSON + stale trailing bytes
- **LOST-UPDATE** if a later writer silently discards the other session's keys
- **PERMISSIONS-DROP** if parse failure falls back to defaults and drops permissions
- **HOOKS-DROP** if parse failure falls back to defaults and drops hooks
- **HAS-CLEAR-REPRO** if Lukasmolvaer filed #91520; has repro; area:core; 1.3% torn
- **HOLD** if the crimp is swaged (atomic join)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the settings join is swaged or torn.

Primary: [anthropics/claude-code#91520](https://github.com/anthropics/claude-code/issues/91520). Cousins (cite only, not primaries): [#79403](https://github.com/anthropics/claude-code/issues/79403) VS Code model toggle corrupts settings; [#82167](https://github.com/anthropics/claude-code/issues/82167) / [#76749](https://github.com/anthropics/claude-code/issues/76749) lost update / stale in-memory config; [#2810](https://github.com/anthropics/claude-code/issues/2810); [#78764](https://github.com/anthropics/claude-code/issues/78764) impact.

Hypothesis only (NON-BINDING): concurrent writeFile without flock/tmp+rename is the root; discard if issue evidence disagrees.

NOT leftover jackfield / tocsin / bolter / deadeye / reglet / vault-latch / annunciator / caisson / spindle / knell / tumbler / escapement. Product name stays Crimp.
