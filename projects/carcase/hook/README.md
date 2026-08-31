# Carcase hook

Tiny cabinetmaker's-bench scorer for a stealth continuity lie: Claude Desktop restarts itself to apply an update. `[stealth-relaunch]` restores the window and 50 navigation entries. `onQuitCleanup: local-session-stop-all` has already killed the CLI children. Sidebar cards look healthy. Sending a message fails `computer_unreachable`. Pipe a probe ticket (`stealthRelaunch` / `navRestored` / `navEntryCount` / `sessionsKilled` / `processesRestarted` / `cardsHealthy` / `bannerUnreachable` / `machineAwake` / `transcriptPresent` / `beforeFirstTurn` / `userConsented`) and get **gutted** or **fitted**.

Idle word is **fitted**. Seeded state is gutted / #90867. Never idle as "carcase" / "cabinet" / "drawer" / "update" / "window".

```bash
node projects/carcase/hook/carcase.mjs < projects/carcase/data/90867.json
node projects/carcase/hook/carcase.mjs projects/carcase/data/fitted.json
node --test projects/carcase/hook/carcase.test.mjs
```

Empty stdin uses the seeded #90867 gutted ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `fitted`, `gutted`, `hold`, `alarm`, `idleWord`.

- **FITTED** if the restored carcase still has drawers in (CLI children still running / sessions actually resume)
- **GUTTED** if stealth relaunch restored chrome and the processes are gone
- **HOLLOW** if the box is present and the interiors are empty
- **STEALTH-KILLED** if `[stealth-relaunch]` / `local-session-stop-all` killed live PTYs
- **CHROME-ONLY** if the window and 50 nav entries came back and zero sessions restarted
- **UNCONSENTED** if the restart fired without user action (#90870 nearby)
- **EMPTIED** if nine sessions were killed in one second
- **DUMMY** if the cards look healthy and send fails `computer_unreachable`
- **OCCUPIED** if a tally of live local processes sits behind the cards (hold chip)
- **RESTORED-NAV** if the nav-restore marker loaded 50 entries and 0 sessions

Primary: [anthropics/claude-code#90867](https://github.com/anthropics/claude-code/issues/90867). Same-class (cite, not primary): [#90874](https://github.com/anthropics/claude-code/issues/90874) borrowed `computer_unreachable` taxonomy; [openai/codex#40969](https://github.com/openai/codex/issues/40969) auto-update force-kills after a 60s drain. Nearby: #90868–#90873, #86556, #90864, #77871. Opposite: Kindling #90798; [openai/codex#41039](https://github.com/openai/codex/issues/41039) Install-on-Quit.

NOT Kindling / Scion / Cenotaph / Limpet / Callboard / Leaven / Hydra / Manikin.
