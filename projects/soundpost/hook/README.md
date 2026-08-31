# Soundpost hook

Tiny luthier cutaway-soundbox classifier for a Desktop-deaf LSP seat. The bundled CLI resolves `csharp-lsp@claude-plugins-official` (`LSP servers (1) csharp-ls`). A Desktop session never exposes the LSP tool, never spawns `csharp-ls`, and writes **zero** LSP log lines, while plugin load stays green (`Passing 10 plugin(s) to SDK`; `reload_plugins` 10 plugins, 99 commands, 0 plugin error(s)). Pipe a probe ticket (`cliLspCount` / `toolSearchLsp` / `processAlive` / `lspLogLines` / `pluginErrors` / `sdkPluginCount` / `synthesisDropped`) and get **fallen** or **coupled**.

Idle word is **coupled**. Seeded state is fallen / #90926. Never idle as "soundpost" / "seated" / "mute" / "silent" / "empty" / "fallen" / "sounder" / "reed" / "lsp" / "plugin".

```bash
node projects/soundpost/hook/soundpost.mjs projects/soundpost/data/90926.json
node projects/soundpost/hook/soundpost.mjs projects/soundpost/data/coupled.json
node --test projects/soundpost/hook/soundpost.test.mjs
```

Empty stdin uses the idle **coupled** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `coupled`, `fallen`, `hold`, `alarm`, `idleWord`.

- **COUPLED** if Desktop exposes LSP, `csharp-ls` is alive, and log lines exist — the post couples belly to back
- **FALLEN** if CLI resolves LSP servers (1) while Desktop ToolSearch misses, no process, zero log lines, plugin green (#90926)
- **MUTE** if the plugin advertises code intelligence and the Desktop session stays silent
- **ADVERTISED** if official `*-lsp` plugins claim code intelligence
- **CLI-RESOLVED** if `claude plugin details` reports `LSP servers (1) csharp-ls`
- **DESKTOP-DEAF** if the Desktop session never consumes that resolution
- **ZERO-LOG** if `%LOCALAPPDATA%\Claude\logs` has no `lsp server|LSP servers loaded|lspServers|language server` matches
- **TOOLSEARCH-MISS** if `ToolSearch select:WebFetch,LSP,ListSkills` → WebFetch✔ ListSkills✔ LSP✘
- **NO-PROCESS** if `Get-Process csharp-ls` is empty (only conhost/pwsh under Claude)
- **SYNTHESIS-DROP** if synthesized `.claude-plugin/plugin.json` keeps four keys and drops `lspServers` (related, not this root)
- **PLATES-UNCOUPLED** if spruce belly (CLI) names the server and maple back (Desktop) never seats the post
- **HEALTHY-LIE** if plugin load reports `0 plugin error(s)` while the advertised capability is inactive

Primary: [anthropics/claude-code#90926](https://github.com/anthropics/claude-code/issues/90926). Same-class (cite, not primary): [#78604](https://github.com/anthropics/claude-code/issues/78604), [#84857](https://github.com/anthropics/claude-code/issues/84857), [#90114](https://github.com/anthropics/claude-code/issues/90114), [#15148](https://github.com/anthropics/claude-code/issues/15148), [#86936](https://github.com/anthropics/claude-code/issues/86936). Contrast (spawn was attempted): [#75237](https://github.com/anthropics/claude-code/issues/75237), [#78099](https://github.com/anthropics/claude-code/issues/78099).

NOT Reed / Sounder / Damper / Callboard / Larder / Census / Flong / Bulla / Trompe / Davy / Scion / Wicket.
