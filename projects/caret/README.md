# Caret

A **proof desk / typesetter caret bench** — argv before/after `cmd.exe` reparse strip, metacharacter chip board (`^ & | < > %`), password-survival gauge, wrapper pipeline (`npx` → `cmd.exe /d /s /c` → reparsed args); parchment cream / ink black / proof-red caret / slate graphite — Playfair Display + DM Sans + Fragment Mono — for a real Claude Code defect: **WINDOWS STDIO MCP PASSWORD ARGUMENTS CORRUPTED WHEN CLAUDE CODE LAUNCHES NPX THROUGH CMD.EXE /D /S /C; AREA:MCP; PLATFORM:WINDOWS.**

Primary:

- [anthropics/claude-code#91526](https://github.com/anthropics/claude-code/issues/91526) (OPEN, bug, has-repro, platform:windows, area:mcp, filed 2026-09-02T14:33:51Z, updated 2026-09-02T15:04:35Z). Title: [BUG] Windows: Claude Code CLI corrupts stdio MCP password arguments when launching npx through cmd.exe. Reporter Maomaoxion. Native Windows 11, not WSL. MCP server `universal-db-mcp`. Transport stdio.

a caret that doubles the carets before the password reaches the server is not a faithful handoff — it is a reparse already mangled. Score the argv or admit the wrapper already careted.

Idle word: **verbatim**. Seeded state: **mangled** / #91526 — on native Windows, when MCP config uses `command: "npx"`, Claude Code launches npx through `cmd.exe /d /s /c`. Args containing cmd metacharacters (`^ & | < > %`) are reparsed before they reach the MCP server. FAKE demo password `P@ss^&w0rd` does not survive. Observed child cmdline: `cmd.exe /d /s /c "npx ^"universal-db-mcp^" ... ^"--password^" ^"P@ss^^&w0rd^" ..."`. Extra caret escaping can sometimes compensate for one parse layer but is inconsistent. Codex CLI does not add this wrapper. Workaround: `command: "node"` with an absolute path to the MCP entry bypasses the `npx.cmd`/`cmd.exe` shim. Never idle as moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

A **caret** should hand the configured argv to the MCP subprocess unchanged. The Windows `npx` launch path instead serializes args through `cmd.exe` and lets the shell reparse them.

- **mangled** = #91526: `cmd.exe /d /s /c` around `npx`; FAKE password `P@ss^&w0rd` reparsed before `universal-db-mcp`
- **careted** = wrapper already doubled the carets; serialized `^"P@ss^^&w0rd^"`
- **reparsed** = `cmd.exe` consumed the caret escape; configured `P@ss^&w0rd` arrived as `P@ss&w0rd`
- **cmd-wrapper** = Claude Code launches `npx` through `cmd.exe /d /s /c`; Codex CLI does not add this wrapper
- **npx-shim** = `npx.cmd` batch shim forces the `cmd.exe` hop; bare `npx` is not `node.exe`
- **metachar** = cmd.exe metacharacters `^ & | < > %` in MCP args are reparsed, not passed literally
- **password-split** = unescaped `&` splits the FAKE password at a cmd.exe operator; received `P@ss^`
- **extra-caret** = an extra `^` remains after one parse layer; received `P@ss^^&w0rd`; layer count is unpredictable
- **node-bypass** = workaround: `command: node` with an absolute path to `universal-db-mcp/dist/index.js` bypasses the shim
- **hold** = configured args reach the MCP server unchanged; the galley holds
- **verbatim** = HOLD: configured args reach the MCP server unchanged

Verdicts: verbatim, mangled, careted, reparsed, cmd-wrapper, npx-shim, metachar, password-split, extra-caret, node-bypass, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. FAKE demo passwords only (`P@ss^&w0rd`). Score whether the argv is verbatim or already careted.

Hypothesis only (NON-BINDING): Windows stdio MCP launch path serializes the args array into shell text for `cmd.exe /d /s /c` around the `npx.cmd` shim; `cmd.exe` then reparses `^ & | < > %` before the MCP server sees argv. Codex CLI does not add this wrapper. Discard if issue evidence disagrees. Encoded from the issue's filed comparison (Claude Code `npx` path vs Codex CLI vs `command: node` bypass). Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **WINDOWS STDIO MCP PASSWORD ARGUMENTS CORRUPTED WHEN CLAUDE CODE LAUNCHES NPX THROUGH CMD.EXE /D /S /C; AREA:MCP; PLATFORM:WINDOWS.**

NOT Buoy ([#91569](https://github.com/anthropics/claude-code/issues/91569)) — macOS main window left at Floating level (layer=3) after Computer Use side panel restores.
NOT Solecism ([#91558](https://github.com/anthropics/claude-code/issues/91558)) — worktree provisioning writes the git exclude to a literal `--git-common-dir/` directory.
NOT Coffer ([#91571](https://github.com/anthropics/claude-code/issues/91571)) — Windows OAuth file-store refresh rotation never persisted; failed refresh blanks tokens.
NOT Codicil ([#91513](https://github.com/anthropics/claude-code/issues/91513)) — shared multi-agent worktree; `git commit --amend` does not re-check HEAD; silently rewrites a concurrent teammate's commit message.
NOT Crimp ([#91520](https://github.com/anthropics/claude-code/issues/91520)) — settings.json unlocked RMW; concurrent sessions tear the file and drop keys.
NOT Jackfield ([#91511](https://github.com/anthropics/claude-code/issues/91511)) — desktop cross-machine session mix-up; Windows input executes on unrelated macOS session.
NOT Tocsin ([#91503](https://github.com/anthropics/claude-code/issues/91503)) — idle-wake / background Bash; subagent completion queued with no idle-wake consumer.
NOT Buoy / Solecism / Coffer / Codicil / Crimp / Jackfield / Tocsin / Bolter / Deadeye / Reglet paradigms.
NOT leftover harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging / reglet letterpress.

Cousins are cite-only on a cousin strip; primary stays #91526.

- [#58510](https://github.com/anthropics/claude-code/issues/58510) — CLOSED (stale) — Windows plugin-shipped MCP servers using bare `npx` fail with `spawn ENOENT` — process never starts; #91526 is the process starting with corrupted args — cite-only.
- [#91581](https://github.com/anthropics/claude-code/issues/91581) — OPEN — Windows `CLAUDE_CODE_SHELL_PREFIX` used as the executable for stdio MCP server spawns — another spawn-wrapper defect, not password reparse — cite-only.
- [#90495](https://github.com/anthropics/claude-code/issues/90495) — OPEN — Windows exec-form hook args dropped, still routed through `bash.exe` — same class of Windows shell-wrapper argv loss, different area — cite-only.

Backups (do not ship unless primary blocked): **Hawser** / #91578. **Frisket** / #91574.

Product name stays **Caret**. Do not rename to Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet.

Different UI: proof desk / typesetter caret bench + argv before/after reparse galley + metacharacter chip board + password-survival composing stick + wrapper pipeline / parchment cream / ink black / proof-red caret / slate graphite. Playfair Display + DM Sans + Fragment Mono. NOT Petrona/Sora/Fira (Buoy). NOT Source Serif 4/Work Sans/Inconsolata (Solecism). NOT Spectral/Karla/IBM Plex Mono (Coffer). NOT Cormorant/Figtree/Azeret (Codicil). NOT Newsreader/Manrope/JetBrains (Crimp). NOT Brygada/Atkinson/DM Mono (Jackfield). NOT Fraunces/Source Sans 3 (Tocsin). Stay OFF harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging / reglet letterpress.

Different verbs: Score the argv, pin idle verbatim, pin seeded mangled, admit the wrapper already careted, load fixtures, reset to verbatim. Score the argv is this desk's phrase.

Different idle: **verbatim**.

## Live catalog path

`/caret/` is this static proof desk. Path `https://hermes-playground-green.vercel.app/caret/` and subdomain `https://caret.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `07:50 / hermes catalog #130 / #91526`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **verbatim** — configured args reach the MCP server unchanged; no `cmd.exe` wrapper.
2. Seed **mangled** → #91526: `cmd.exe /d /s /c` around `npx`; FAKE password `P@ss^&w0rd` reparsed; observed child cmdline careted; Codex CLI does not wrap; `command: node` bypass works.
3. Atelier UI: argv galley / metacharacter sorts / password-survival stick / wrapper pipeline. Verbatim = faithful handoff. Mangled = wrapper already careted.
4. Cousin cite strip labeled cousin-not-primary: [#58510](https://github.com/anthropics/claude-code/issues/58510), [#91581](https://github.com/anthropics/claude-code/issues/91581), [#90495](https://github.com/anthropics/claude-code/issues/90495). Cite only. Primary stays #91526.
5. **Score the argv** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/caret/index.html` in a browser, or serve the repo root and visit `/caret/` (Vercel rewrite → `/projects/caret`). No build step. Optional hook:

```bash
node projects/caret/hook/caret.mjs projects/caret/data/91526.json
node --test projects/caret/hook/caret.test.mjs
```

Empty stdin scores the idle **verbatim** ticket. Paste a probe on the page or drop a fixture from `data/`.
