# Hellbox hook

Tiny letterpress composing-room classifier for the Claude Code defect where `change_directory` leaves `$CLAUDE_PROJECT_DIR` at the launch project and the resulting ENOENT silently erases every user prompt (exit 2 reads as deny). Reporter Rasherb69 (Lewis Bacon). Filed 2026-09-04. Labels: bug, has-repro, platform:macos, area:hooks, data-loss. Claude Code 2.1.204. Claude desktop app. macOS 26.5.2 arm64. Node v24.15.0. python3 3.14.5. Shell-form hooks.

Idle word is **set**. Seeded state is scrapped / #92168 (sticky launch pin + ENOENT + exit 2 read as deny + silent erase). Never idle as pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled.

```bash
node projects/hellbox/hook/hellbox.mjs projects/hellbox/data/92168.json
node projects/hellbox/hook/hellbox.mjs projects/hellbox/data/set.json
echo '{"enoent":true,"exitCode":2}' | node projects/hellbox/hook/hellbox.mjs
node --test projects/hellbox/hook/hellbox.test.mjs
```

Empty stdin uses the idle **set** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `set`, `scrapped`, `hold`, `alarm`, `idleWord`.

Given a form-shaped payload `{ changeDirectory, projectDirRepointed, claudeProjectDir, launchDir, enoent, exitCode, treatExit2AsDeny, promptErased, promptReachedModel }`:

- **SET** if CLAUDE_PROJECT_DIR follows change_directory (the standing line stayed set)
- **SCRAPPED** if sticky launch pin + ENOENT + exit 2 is read as deny (#92168)
- **STICKY** if `change_directory` does not repoint `$CLAUDE_PROJECT_DIR`
- **ENOENT** if newly-adopted UserPromptSubmit hooks resolve under the old launch path
- **EXIT2** if python3/argparse exit 2 is treated as deny
- **ERASE** if the prompt never reaches the model
- **LAUNCH-PIN** if `$CLAUDE_PROJECT_DIR` stays at the launch project
- **HOLD** if the form stays locked on a follow-the-directory ticket

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the form held or already scrapped the standing line.

Primary: [anthropics/claude-code#92168](https://github.com/anthropics/claude-code/issues/92168). Cousins (cite only, not primary): [#88830](https://github.com/anthropics/claude-code/issues/88830), [#81291](https://github.com/anthropics/claude-code/issues/81291), [#87890](https://github.com/anthropics/claude-code/issues/87890). Different-class cite: [#92074](https://github.com/anthropics/claude-code/issues/92074).

Hypothesis only (NON-BINDING): change_directory loads the new project's hooks and settings but leaves $CLAUDE_PROJECT_DIR pinned at the launch directory; UserPromptSubmit then ENOENTs, exits 2, and is read as deny. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.

NOT leftover bone-ash cupel / stone-pit oubliette / cream wick-lit ephemera / commutator drum / hectograph gelatin / congregation placet / print-shop frisket / dockyard hawser. Product name stays Hellbox.
