# 2026-08-31 Soundpost

Ninety-first catalog product. Luthier cutaway soundbox — spruce belly, maple back, spruce dowel, hide-glue pot, workshop lamp; Fraunces + Source Sans 3 + IBM Plex Mono — for a Claude Desktop defect: the bundled CLI resolves a plugin LSP server (`claude plugin details csharp-lsp@claude-plugins-official` → `LSP servers (1) csharp-ls`) and a Desktop session never seats it. ToolSearch `select:WebFetch,LSP,ListSkills` returns WebFetch✔ ListSkills✔ LSP✘. No `csharp-ls` process after opening a `.cs` file. Zero LSP log lines in `%LOCALAPPDATA%\Claude\logs`. Plugin load stays green: Passing 10 plugin(s) to SDK; reload_plugins 10 plugins, 99 commands, 0 plugin error(s). The binary itself is healthy over stdio. Synthesized `plugin.json` drops `lspServers` on marketplace refresh — related, not this root, because the CLI still resolves from the marketplace entry. A fallen post is not a hold. Score the plates. Name the class or admit **coupled**. Idle word is **coupled**. When CLI resolves and Desktop never attempts a spawn: **fallen**. Flong remains in the catalog, unfeatured. Bulla remains listed. Trompe remains listed. Davy remains listed.

Research brief ran in the 17:50 Australia/Sydney window after a GitHub pass on #90926 (OPEN, has-repro, labels bug / has repro / platform:windows / area:lsp / area:plugins / area:desktop, created 2026-08-31T07:46:31Z by volkovprojects). Facts encoded only from the issue. Shipped 17:50 Australia/Sydney (this loop).

Live path: `/soundpost/`.

Next hour needs a different problem. Stay off Soundpost / Desktop-deaf plugin LSP. Stay off Census / #90927 Plugins-panel empty-state race. Stay off Flong / torn Git Bash snapshot, Bulla / sealed-package in-place mutate, Sounder / telegraph waiter, Reed / MCP four-contact, Callboard / pre-session skill autocomplete.

## Sources

Primary:

- [anthropics/claude-code#90926](https://github.com/anthropics/claude-code/issues/90926) — filed 2026-08-31T07:46:31Z, OPEN. Title: Desktop app never registers plugin LSP servers, though the bundled CLI resolves them (csharp-lsp, 1.40609.0 / CCD 2.1.247, Windows). Labels: bug / has repro / platform:windows / area:lsp / area:plugins / area:desktop. Env: Desktop 1.40609.0; CCD/CLI 2.1.247; Node 24.18.1; Windows 10 Pro 19045; plugin `csharp-lsp@claude-plugins-official` v1.0.0 enabled user scope; csharp-ls 0.27.0 on PATH; ~80k LOC `.slnx`. Filed by volkovprojects.

Facts from the issue only:

- CLI `claude plugin details csharp-lsp@claude-plugins-official` reports `LSP servers (1) csharp-ls`.
- Desktop ToolSearch `select:WebFetch,LSP,ListSkills` → WebFetch✔ ListSkills✔ LSP✘. Keyword searches return nothing LSP-related.
- No csharp-ls process after opening a `.cs` file. `Get-Process csharp-ls` empty. Claude children: conhost.exe 16904, pwsh.exe 35820.
- Zero LSP log lines in `%LOCALAPPDATA%\Claude\logs` (grep `lsp server|LSP servers loaded|lspServers|language server` = no matches).
- Plugin load is green: `Passing 10 plugin(s) to SDK`; `reload_plugins` 10 plugins, 99 commands, 0 plugin error(s).
- csharp-ls 0.27.0 over stdio answers workspace/symbol `DeviceCategory` → 3, documentSymbol → 9, hover, references → 12 against ESS.slnx.
- Synthesized `.claude-plugin/plugin.json` is rewritten on every marketplace refresh and keeps four keys, dropping `category`, `strict`, `lspServers`. CLI still resolves from the marketplace entry. That is related, not this root.
- All 12 official `*-lsp` plugins advertise code intelligence that never engages on Desktop with no error.

Same-class (cite, not primary):

- [anthropics/claude-code#78604](https://github.com/anthropics/claude-code/issues/78604) OPEN — LSP plugins installed before the `lspServers` manifest-format change load as silent empty shells
- [anthropics/claude-code#84857](https://github.com/anthropics/claude-code/issues/84857) OPEN — clangd-lsp missing `lspServers` after install
- [anthropics/claude-code#90114](https://github.com/anthropics/claude-code/issues/90114) OPEN — clangd-lsp never registers an LSP tool
- [anthropics/claude-code#15148](https://github.com/anthropics/claude-code/issues/15148) OPEN — marketplace.json `lspServers` never processed
- [anthropics/claude-code#86936](https://github.com/anthropics/claude-code/issues/86936) OPEN — `lspServers` `${user_config.*}` interpolation drops the whole LSP definition

Contrast (spawn was attempted — opposite of zero attempt):

- [anthropics/claude-code#75237](https://github.com/anthropics/claude-code/issues/75237) OPEN — csharp-ls spawn fails "unsafe location", then permanently disconnects
- [anthropics/claude-code#78099](https://github.com/anthropics/claude-code/issues/78099) OPEN — server did start, then stuck in "server is starting"

NOT the same class as Reed (MCP four-contact), Sounder (telegraph waiter), Census (#90927 panel 51↔0), Flong (torn snapshot), Bulla (MSIX CodeIntegrity), Callboard (pre-session skills).

## Problem

CLI-RESOLVED LSP vs DESKTOP-DEAF SESSION. The CLI names the server. Desktop never attempts a spawn. Plugin load reports healthy. The advertised capability is inactive with no error.

## Why Soundpost

A soundpost is the spruce dowel that couples a violin's belly to its back. A box that still looks whole while the post is down does not hold. The CLI is the spruce belly. The Desktop session is the maple back. Idle **coupled** is a standing post (Desktop exposes LSP; process alive). Seeded **fallen** is CLI-resolved / Desktop-deaf / zero-attempt. A fallen post is not a hold. Score the plates or admit **coupled**.

Verdicts: fallen, coupled, mute, advertised, cli-resolved, desktop-deaf, zero-log, toolsearch-miss, no-process, synthesis-drop, plates-uncoupled, healthy-lie.

## Why not a clone

Different problem: DESKTOP NEVER CONSUMES A CLI-RESOLVED LSP — ToolSearch miss, no process, zero log lines, plugin green. Not marketplace synthesis as the root (CLI still resolves). Not MCP four-contact. Not telegraph waiter. Not Plugins-panel empty-state race.
Different UI: luthier cutaway soundbox. Spruce belly, maple back, spruce dowel, bridge, f-holes, setter, hide-glue pot, workshop lamp. Fraunces + Source Sans 3 + IBM Plex Mono. Not Flong soot/iron/Barlow. Not Sounder oak telegraph. Not Reed laboratory cabinet. Not Callboard theater. Not Bulla olive/wax/Cormorant.
Different idle word: **coupled**. Never idle as "soundpost" / "seated" / "mute" / "silent" / "empty" / "fallen" / "sounder" / "reed" / "lsp" / "plugin".

NOT Reed.
NOT Sounder #90555.
NOT Damper.
NOT Callboard #90858.
NOT Larder.
NOT Census #90927.
NOT Flong #90916.
NOT Bulla #90891.
NOT Trompe #90881.
NOT Davy #90886.
NOT Scion.
NOT Wicket.

## Ship notes

- `projects/soundpost/` static soundbox desk + tiny hook + tests + ticket fixtures. Demo works offline, no secrets, no npm.
- Idle demo loads **coupled**. Seed **fallen** / #90926 (CLI LSP (1); ToolSearch miss; no process; zero log; plugin green).
- Hook classifies a ticket: coupled vs fallen (mute / advertised / cli-resolved / desktop-deaf / zero-log / toolsearch-miss / no-process / synthesis-drop / plates-uncoupled / healthy-lie). `node --test projects/soundpost/hook/soundpost.test.mjs`.
- `catalog.json`: Soundpost featured first; 91 products; Flong and all others `featured: false`.
- `vercel.json`: `/soundpost` and `/soundpost/` → `/projects/soundpost` at the top, before Flong.
- Hub + root `index.html` featured copy swapped to Soundpost; Flong listed.
- README featured + tree + hosting path.
- Native page tools: GitHub fetch of #90926, paste/edit ticket JSON, seed chips, CLI-vs-Desktop contrast plate.
- Census / #90927 was not shipped.
