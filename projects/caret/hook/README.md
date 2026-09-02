# Caret hook

Tiny proof-desk / typesetter-caret argv classifier for the Claude Code defect where native Windows launches stdio MCP servers through `cmd.exe /d /s /c` when `command` is `npx`, then reparses password arguments containing `^ & | < > %`. MCP server `universal-db-mcp`. Reporter Maomaoxion. Filed 2026-09-02. Labels: bug, has-repro, platform:windows, area:mcp.

Idle word is **verbatim**. Seeded state is mangled / #91526 (`cmd.exe /d /s /c` around `npx`; FAKE password `P@ss^&w0rd` reparsed before the server). Never idle as moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

```bash
node projects/caret/hook/caret.mjs projects/caret/data/91526.json
node projects/caret/hook/caret.mjs projects/caret/data/verbatim.json
echo '{"configuredPassword":"P@ss^&w0rd","receivedPassword":"P@ss&w0rd"}' | node projects/caret/hook/caret.mjs
node --test projects/caret/hook/caret.test.mjs
```

Empty stdin uses the idle **verbatim** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `verbatim`, `mangled`, `careted`, `reparsed`, `hold`, `alarm`, `idleWord`.

Given `{ persistArgv, verbatim, mangled, configuredPassword, receivedPassword, cmdWrapped, reparsed, careted, npxShim, metachar, passwordSplit, extraCaret, nodeBypass }`:

- **VERBATIM** if configured args reach the MCP server unchanged
- **MANGLED** if the `cmd.exe` wrapper already careted the password (#91526)
- **CARETED** if the wrapper doubled the carets in the serialized command line
- **REPARSED** if `cmd.exe` consumed the caret escape (`P@ss^&w0rd` → `P@ss&w0rd`)
- **CMD-WRAPPER** if Claude Code launches `npx` through `cmd.exe /d /s /c`
- **NPX-SHIM** if the `npx.cmd` batch shim forces the `cmd.exe` hop
- **METACHAR** if `^ & | < > %` in MCP args are reparsed, not passed literally
- **PASSWORD-SPLIT** if unescaped `&` splits the FAKE password at a cmd operator
- **EXTRA-CARET** if an extra `^` remains after one parse layer
- **NODE-BYPASS** if `command: node` with an absolute path bypasses the shim
- **HOLD** if the galley is verbatim (configured === received)

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Fake demo passwords only. Score whether the argv is verbatim or already careted.

Primary: [anthropics/claude-code#91526](https://github.com/anthropics/claude-code/issues/91526). Cousins (cite only, not primaries): [#58510](https://github.com/anthropics/claude-code/issues/58510) Windows `npx` spawn ENOENT (CLOSED stale); [#91581](https://github.com/anthropics/claude-code/issues/91581) `CLAUDE_CODE_SHELL_PREFIX` used as MCP executable; [#90495](https://github.com/anthropics/claude-code/issues/90495) exec-form hook args dropped through `bash.exe`.

Hypothesis only (NON-BINDING): Windows stdio MCP launch path serializes the args array into shell text for `cmd.exe /d /s /c` around the `npx.cmd` shim; `cmd.exe` then reparses `^ & | < > %` before the MCP server sees argv. Codex CLI does not add this wrapper. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.

NOT leftover harbor-buoy / solecism usage-desk / coffer vault / codicil probate / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging / reglet letterpress. Product name stays Caret.
