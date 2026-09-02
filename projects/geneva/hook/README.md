# Geneva hook

Tiny watchmaker geneva-drive / maltese-cross classifier for the project-local `defaultMode: bypassPermissions` miss. `permissions.defaultMode: "bypassPermissions"` in a project's `.claude/settings.local.json` is silently ignored. Bypass never appears in the Shift+Tab mode cycle; session starts in a different mode. `/status` lists the file as a setting source. CLI flags still restore the mode.

Idle word is **indexed**. Seeded state is jumped / #91296 (local file listed as a setting source but bypass slot missing from the cycle; value ignored). Never idle as jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked.

```bash
node projects/geneva/hook/geneva.mjs projects/geneva/data/91296.json
node projects/geneva/hook/geneva.mjs projects/geneva/data/indexed.json
echo '{"settingsSourceListed":true,"valueApplied":false,"bypassInCycle":false}' | node projects/geneva/hook/geneva.mjs
node --test projects/geneva/hook/geneva.test.mjs
```

Empty stdin uses the idle **indexed** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `indexed`, `jumped`, `hold`, `alarm`, `idleWord`.

Given `{ settingsSourceListed, valueApplied, bypassInCycle, sessionStartsBypass, projectLocalHonored }`:

- **INDEXED** if project-local defaultMode honored; bypassPermissions present in Shift+Tab cycle; session starts in bypass
- **JUMPED** if local file listed as a setting source but bypass slot missing from the cycle; value ignored (#91296)
- **SETTINGS-LOADED** if `/status` lists Setting sources: User settings, Shared project settings, Project local settings
- **VALUE-IGNORED** if `permissions.defaultMode: bypassPermissions` in `.claude/settings.local.json` is silently ignored
- **CYCLE-MISSING-BYPASS** if Shift+Tab cycle is only default / acceptEdits / plan / auto
- **FLAG-WORKAROUND** if `--permission-mode bypassPermissions` and `--dangerously-skip-permissions` restore bypass
- **USER-AUTO-CONFLICT** if user-level `~/.claude/settings.json` has `defaultMode: auto` while project-local has bypass
- **HAS-REPRO** if jimmyjayp filed #91296; labels include has repro; 2.1.257 / comment 2.1.258
- **HOLD** if the cross is indexed (project-local honored; bypass in the cycle)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the cross is indexed or jumped.

Primary: [anthropics/claude-code#91296](https://github.com/anthropics/claude-code/issues/91296). Cousins (cite only, not primaries): [#75235](https://github.com/anthropics/claude-code/issues/75235) Desktop settings.json defaultMode; [#86478](https://github.com/anthropics/claude-code/issues/86478) flags also ignored; [#88051](https://github.com/anthropics/claude-code/issues/88051) home settings.local.json only in $HOME; [#90415](https://github.com/anthropics/claude-code/issues/90415) Browser confirmation; [#83421](https://github.com/anthropics/claude-code/issues/83421).

Hypothesis only (NON-BINDING): settings merger lists project-local as a source but drops `defaultMode: bypassPermissions` from the cycle set when user-level defaultMode is `"auto"`. Flags inject the mode after cycle construction. Do not claim a root cause in Claude Code source you have not seen.

NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick. Product name stays Geneva. Do not rename to Settings / Cycle / Bypass / Permissions / Mode / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Postern.
