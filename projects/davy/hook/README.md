# Davy hook

Tiny miner's safety-lamp scorer for a false boot-canary: on a machine running many concurrent Claude Code sessions, lost updates on a PID-keyed pending map in shared `~/.claude.json` bank false strikes from a single burst, then the working flame is snuffed and the classic renderer is forced. `fullscreenAutoDisabled.strikes` lands at 4 against a sticky threshold of 2. Pipe a probe ticket (`concurrentSessions` / `strikes` / `autoDisabled` / `pendingOrphans` / `lostUpdate` / `fullscreenWorks` / `envNoFlicker`) and get **snuffed** or **lit**.

Idle word is **lit**. Seeded state is snuffed / #90886. Never idle as "davy" / "lamp" / "canary" / "flame" / "pit" / "gauze" / "strike" / "fullscreen" / "tui".

```bash
node projects/davy/hook/davy.mjs < projects/davy/data/90886.json
node projects/davy/hook/davy.mjs projects/davy/data/lit.json
node --test projects/davy/hook/davy.test.mjs
```

Empty stdin uses the seeded #90886 snuffed ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `lit`, `snuffed`, `hold`, `alarm`, `idleWord`.

- **LIT** if tui=fullscreen, renderer actually fullscreen, strikes 0 or honestly earned, no orphaned pending, no auto-disable
- **SNUFFED** if working fullscreen auto-disabled by false boot-canary (#90886)
- **STRUCK** if `fullscreenAutoDisabled.strikes` banked (4 vs sticky threshold 2)
- **ORPHANED** if leftover `fullscreenBootPending` entries for PIDs that are gone
- **REUSED** if `pid === ownPid` counted as a strike without `startedAt` vs process start
- **WITHDRAWN** if signal-driven exit settles withdrawn, removes own PID, preserves strike counter
- **RATCHETED** if machines that terminate rather than quit only ratchet the counter up
- **BURST** if 10–20 concurrent sessions launched together; lost read-modify-write
- **LOST-UPDATE** if concurrent RMW against one `~/.claude.json`
- **CLASSIC** if fell back to classic renderer despite fullscreen working
- **PID-KEYED** if pending map keyed by PID in the single shared `~/.claude.json`
- **ENV-ON** if `CLAUDE_CODE_NO_FLICKER=1` / env_on path excluded from canary (workaround)

Primary: [anthropics/claude-code#90886](https://github.com/anthropics/claude-code/issues/90886). Same-class (cite, not primary): [#85583](https://github.com/anthropics/claude-code/issues/85583), Deadband [#90789](https://github.com/anthropics/claude-code/issues/90789), Carrel [#90661](https://github.com/anthropics/claude-code/issues/90661), [#88977](https://github.com/anthropics/claude-code/issues/88977) `.claude.json` lock deadlock, [#78439](https://github.com/anthropics/claude-code/issues/78439) concurrent-write corruption, [#85461](https://github.com/anthropics/claude-code/issues/85461) `lastReleaseNotesSeen` race, [#73719](https://github.com/anthropics/claude-code/issues/73719) fullscreen force-enabled on attach, [#90733](https://github.com/anthropics/claude-code/issues/90733) fullscreen hides slash-command output. Cross-ecosystem: [openai/codex#24224](https://github.com/openai/codex/issues/24224), [openai/codex#37226](https://github.com/openai/codex/issues/37226), [openai/codex#39642](https://github.com/openai/codex/issues/39642), [openai/codex#40109](https://github.com/openai/codex/issues/40109). Nearby TUI (do not ship): #88372, #84940, #76022, #85573, #82886, #85712, #78693. Backups (do not ship): Cartouche/Chimera #90881, Gyre #90800. Reject #90889 (Limpet clone).

NOT Moviola / Carcase / Callboard / Leaven / Hydra / Limpet / Scion / Almanac / Deadband / Carrel / Binnacle / Fetch / Kindling.
