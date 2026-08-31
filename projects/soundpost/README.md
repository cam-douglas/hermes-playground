# Soundpost

A **luthier cutaway soundbox** — spruce belly, maple back, spruce dowel, hide-glue pot, workshop lamp; Fraunces + Source Sans 3 + IBM Plex Mono — for a real Claude Code Desktop defect: **the bundled CLI resolves a plugin LSP server, and the Desktop session never seats it**.

Primary:

- [anthropics/claude-code#90926](https://github.com/anthropics/claude-code/issues/90926) (OPEN, filed 2026-08-31T07:46:31Z by volkovprojects). Title: Desktop app never registers plugin LSP servers, though the bundled CLI resolves them (csharp-lsp, 1.40609.0 / CCD 2.1.247, Windows). Labels: bug, has repro, platform:windows, area:lsp, area:plugins, area:desktop. Desktop **1.40609.0**. CCD/CLI **2.1.247**. Node **24.18.1**. Windows 10 Pro 19045. Plugin `csharp-lsp@claude-plugins-official` v1.0.0 enabled, user scope. `csharp-ls` **0.27.0** on PATH. ~80k LOC `.slnx`.

A violin that still looks whole while the soundpost is down is not a hold. Score the plates or admit **coupled**.

Idle word: **coupled**. Seeded state: **fallen** / #90926 — CLI resolves `LSP servers (1) csharp-ls`; Desktop ToolSearch miss, no process, zero log lines, plugin green. Never idle as "soundpost" / "seated" / "mute" / "silent" / "empty" / "fallen" / "sounder" / "reed" / "lsp" / "plugin".

- **coupled** = hold: Desktop exposes LSP and `csharp-ls` is alive; the post couples belly to back
- **fallen** = #90926 primary — CLI-resolved LSP vs Desktop-deaf session; no spawn attempt
- **mute** = advertised code intelligence, Desktop session silent
- **advertised** = all 12 official `*-lsp` plugins claim code intelligence
- **cli-resolved** = `claude plugin details` reports `LSP servers (1) csharp-ls`
- **desktop-deaf** = Desktop never consumes that resolution
- **zero-log** = `%LOCALAPPDATA%\Claude\logs` has no `lsp server|LSP servers loaded|lspServers|language server` matches
- **toolsearch-miss** = `ToolSearch select:WebFetch,LSP,ListSkills` → WebFetch✔ ListSkills✔ LSP✘
- **no-process** = `Get-Process csharp-ls` empty; Claude children are only conhost/pwsh
- **synthesis-drop** = synthesized `.claude-plugin/plugin.json` keeps four keys and drops `lspServers` (related, not this root)
- **plates-uncoupled** = spruce belly (CLI) names the server; maple back (Desktop) never seats the post
- **healthy-lie** = `0 plugin error(s)` while the advertised capability is inactive

Verdicts: fallen, coupled, mute, advertised, cli-resolved, desktop-deaf, zero-log, toolsearch-miss, no-process, synthesis-drop, plates-uncoupled, healthy-lie.

## Why not a clone

This is specifically: **CLI-RESOLVED LSP vs DESKTOP-DEAF SESSION (no spawn attempt)**. Panel and plugin load stay green. The CLI's own `plugin details` names the server. Desktop never attempts to start it.

NOT **Reed** — MCP four-contact Connected≠registered≠callable.
NOT **Sounder** ([#90555](https://github.com/anthropics/claude-code/issues/90555)) — telegraph waiter completion never re-invokes (different product; do not reuse telegraph UI or keyed/muted sounder language as the core metaphor).
NOT **Damper** — chimney/toggle.
NOT **Callboard** ([#90858](https://github.com/anthropics/claude-code/issues/90858)) — skills missing from new-chat slash autocomplete.
NOT **Larder** — plugin-store content clock vs sync stamp freeze.
NOT **Census** / [#90927](https://github.com/anthropics/claude-code/issues/90927) — Plugins panel 51↔0 first-run empty-state race (do not ship).
NOT [#78604](https://github.com/anthropics/claude-code/issues/78604) / [#84857](https://github.com/anthropics/claude-code/issues/84857) / [#90114](https://github.com/anthropics/claude-code/issues/90114) / [#15148](https://github.com/anthropics/claude-code/issues/15148) — marketplace `plugin.json` synthesis drops `lspServers` (same-class cites; here CLI still resolves; Desktop never seats).
NOT **Flong** / **Bulla** / **Trompe** / **Davy** / **Scion** / **Wicket**.

Different UI: luthier cutaway soundbox. Spruce belly (CLI plugin details), maple back (Desktop session), spruce soundpost dowel, bridge, f-holes, soundpost setter, hide-glue pot, warm amber/maple/spruce palette, workshop lamp. Fraunces + Source Sans 3 + IBM Plex Mono. NOT Flong soot/iron foundry. NOT Sounder oak telegraph night desk. NOT Reed laboratory cabinet. NOT Callboard theater board.

Different idle: **coupled**. Never idle as **seated**.

## Live catalog path

`/soundpost/` is this static soundbox desk. Demo works with no secrets and no npm. Mark: `17:50 / hermes catalog #91 / #90926`.

1. Idle demo loads **coupled** — Desktop exposes LSP, process alive, plates couple.
2. Seed **fallen** → #90926 ticket: CLI `LSP servers (1)`, ToolSearch miss, no process, zero log lines, plugin green.
3. Paste or edit a soundbox ticket JSON (`cliLspCount`, `toolSearchLsp`, `processAlive`, `lspLogLines`, `pluginErrors`, `sdkPluginCount`, `synthesisDropped`).
4. **Score the plates** walks the ticket and lights chips on the setter block.
5. Contrast plate: spruce belly (CLI resolved) vs maple back (Desktop deaf) vs related-not-root synthesis drop vs opposite-pole spawn attempts (#75237 / #78099).
6. Evidence drawer with the GitHub issue links.

## How to score

Open `projects/soundpost/index.html` in a browser, or serve the repo root and visit `/soundpost/` (Vercel rewrite → `/projects/soundpost`). No build step. Optional hook:

```bash
node projects/soundpost/hook/soundpost.mjs projects/soundpost/data/90926.json
node projects/soundpost/hook/soundpost.mjs projects/soundpost/data/coupled.json
node --test projects/soundpost/hook/soundpost.test.mjs
```

Fallen seed → fallen/alarm. Coupled seed → coupled/hold.

`projects/soundpost/hook/soundpost.mjs` classifies a ticket and returns `{ verdict, chips[], reasons[], coupled, fallen, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90926.json`, `data/fallen.json`, `data/coupled.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/contrast.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#90926](https://github.com/anthropics/claude-code/issues/90926). Unauthenticated. See `.env.example`.
2. Paste/edit a soundbox ticket JSON and score.
3. Seed chips: coupled / fallen / mute / toolsearch-miss / zero-log / synthesis-drop.
4. Contrast plate: CLI `plugin details` vs Desktop ToolSearch miss vs zero log vs healthy plugin load.
5. Evidence drawer: #78604, #84857, #90114, #15148, #86936; contrast #75237, #78099.

## Sources

- [anthropics/claude-code#90926](https://github.com/anthropics/claude-code/issues/90926) OPEN
- Same-class (cite, not primary): [#78604](https://github.com/anthropics/claude-code/issues/78604) OPEN — LSP plugins installed before the `lspServers` manifest-format change load as silent empty shells; [#84857](https://github.com/anthropics/claude-code/issues/84857) OPEN — clangd-lsp missing `lspServers` after install; [#90114](https://github.com/anthropics/claude-code/issues/90114) OPEN — clangd-lsp never registers an LSP tool; [#15148](https://github.com/anthropics/claude-code/issues/15148) OPEN — `lspServers` from marketplace.json never processed; [#86936](https://github.com/anthropics/claude-code/issues/86936) OPEN — `lspServers` `${user_config.*}` interpolation drops the whole LSP definition.
- Contrast (not this root): [#75237](https://github.com/anthropics/claude-code/issues/75237) OPEN — csharp-ls spawn attempted then disconnect (unsafe location); [#78099](https://github.com/anthropics/claude-code/issues/78099) OPEN — server did start, then stuck in "server is starting". Opposite of zero attempt.
