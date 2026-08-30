# Deadband hook

Tiny control-room deadband scorer for Claude Code's silent `~/.claude/settings.json` data loss. Pipe a probe (`phase` / `timeOnlySuppress` / `externalEditDeltaMs` / suppress + clobber flags) and get **fresh** or **time-blind** (or a named nearby class).

Idle word is **fresh**. NEVER use fresh for a failure.

```bash
node projects/deadband/hook/index.mjs < transcript.txt
node --test projects/deadband/hook/deadband.test.mjs
```

Empty stdin uses the seeded #90789 Phase 3 time-blind board. Stdout is JSON: `verdict`, `reasons[]`, `fresh`, `alarm`.

Probe shape: `{ phase, timeOnlySuppress, contentCompare, echoWindowMs, externalEditDeltaMs, suppressed, reloaded, nextSaveClobber, cacheFresh, cacheStale, foreignKeysDropped, deletedKeysResurrected, fullStringify, atomicRename, debounceCoalesce }` → `{ verdict, reasons[], fresh, alarm }`.

Primary: [anthropics/claude-code#90789](https://github.com/anthropics/claude-code/issues/90789). Nearby-but-different: [#78321](https://github.com/anthropics/claude-code/issues/78321) RMW race, [#84867](https://github.com/anthropics/claude-code/issues/84867) plugin uninstall deletes unrelated keys, [#88113](https://github.com/anthropics/claude-code/issues/88113) strip unknown hook keys, [#80770](https://github.com/anthropics/claude-code/issues/80770) enabledPlugins disappear, [#86935](https://github.com/anthropics/claude-code/issues/86935) watcher parent enumeration. Cross-ecosystem: [openai/codex#36465](https://github.com/openai/codex/issues/36465), [openai/codex#24515](https://github.com/openai/codex/issues/24515).

NOT Palimpsest / Ullage / Damper / Quench / Hasp / Larder / Pawl / Cenotaph / Fetch / Livery / Pinfold.

Slack alarm on time-blind / cache-stale / foreign-dropped / key-resurrected. Linear ticket on time-blind / cache-stale / foreign-dropped.

Ask: decide "is this my own echo?" by content (hash the bytes just written), or re-read and merge from disk at save time — or both.
