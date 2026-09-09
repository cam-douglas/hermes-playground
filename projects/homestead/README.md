# Homestead

A **prairie land-office / homestead-claim desk** — cream deed paper, oak rail fence posts, brass survey stake, prairie dusk sky, weathered claim stakes, inked boundary metes; fonts **Playfair Display** (display) + **Source Sans 3** (body) + **Fira Code** (mono) — for a real Claude Code defect: **A NEW SESSION WHOSE CWD IS `$HOME` (NOT A GIT REPO) HANGS AFTER AN UNSCOPED `rg` FILE-INDEX WALK HITS MACOS TCC-DENIED TRACTS; `rg` EXITS AND THE PARENT IDLES AT ~0.1% CPU WITH NO FURTHER DEBUG LINE.**

Primary:

- [anthropics/claude-code#92932](https://github.com/anthropics/claude-code/issues/92932) (OPEN, bug, has repro, platform:macos, area:core). Title: `New session hangs indefinitely when cwd is HOME with no git repo - unscoped rg scan hits TCC-denied paths`. Claude Code 2.1.263; macOS 26.6.2 (Build 25G83); Node v26.5.0; zsh; Apple Silicon Darwin. Authored 2026-09-08T20:44:54Z by mcorbett51090.

10:50 homestead: a prairie land-office homestead-claim bench that should keep a HOME-cwd session **deeded** — file-index bounded (or TCC denials handled so the parent still answers); instead an unscoped `$HOME` rg walk hits TCC-denied tracts, rg exits, and the parent hangs forever — score homesteaded or admit deeded.

Score homesteaded or admit deeded.

Idle word: **deeded** (HOLD: session answers; file-index bounded to project/cwd, or HOME only when HOME is the project; TCC permission errors do not freeze the parent). #92932 path: **homesteaded**. Seeded recover: **staked**. Never idle parked / epitaphed / inscribed / collated / stereotyped / emended / confirmed / miraged / loosed / clung / banked / intact / culled / enrolled / escheated.

**Homestead** = the prairie claim a land office stakes by metes and bounds. The file-index should stake a bounded quarter-section. Instead it walks the whole HOME prairie, hits posted TCC tracts, and the clerk never answers.

- **deeded** = IDLE: HOLD; session answers; scan bounded to project/cwd
- **homesteaded** = #92932 path: unscoped `$HOME` rg walk + TCC wall → parent hangs after rg exits
- **staked** = bounded claim / graceful continue after permission-denied stderr
- **unscoped-home** = no git root; scan falls back to the entire `$HOME` tree
- **tcc-wall** = `.Trash`, `Library/Mail`, Photos Library, Messages, HomeKit, and dozens more
- **rg-exited** = rg subprocess exits; none left in `ps`
- **parent-idle** = parent `claude` ~0.1% CPU — blocked, not busy-looping
- **safe-mode-ok** = `--safe-mode` starts and answers
- **bare-ok** = `--bare` starts and answers
- **mcp-ruled-out** = empty `--mcp-config '{"mcpServers":{}}'` still hangs
- **git-root-ok** = sessions inside a git-repo project directory do not reproduce
- **last-debug-line** = the rg-error block is the last debug line ever written
- **cousins** = cite-only #92784 #92908 #92036 #91881 — do not clone
- **before-after** = before homesteaded HOME walk; after expected deeded
- **fixtures** = row list for the land-office bench

Verdicts: deeded, homesteaded, staked, unscoped-home, tcc-wall, rg-exited, parent-idle, safe-mode-ok, bare-ok, mcp-ruled-out, git-root-ok, last-debug-line, cousins, before-after, fixtures.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No Desktop automation. No payloads. No secrets. No network to Anthropic. Score whether a HOME-cwd file-index walk is **homesteaded** or already **deeded**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): when no git root, file-index falls back to `$HOME`; consumer of rg's many TCC error lines hangs after rg exits. Invite verify against #92932 text only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92932](https://github.com/anthropics/claude-code/issues/92932)
- Cite-only: [anthropics/claude-code#92784](https://github.com/anthropics/claude-code/issues/92784)
- Cite-only: [anthropics/claude-code#92908](https://github.com/anthropics/claude-code/issues/92908)
- Cite-only: [anthropics/claude-code#92036](https://github.com/anthropics/claude-code/issues/92036)
- Cite-only: [anthropics/claude-code#91881](https://github.com/anthropics/claude-code/issues/91881)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:core
- Claude Code 2.1.263; macOS 26.6.2 (Build 25G83); Node v26.5.0; zsh; Apple Silicon Darwin
- Repro: `cd ~` (HOME, not a git repo) → `claude --debug` → send any prompt → session never responds; ~0.1% CPU indefinitely
- `--safe-mode` and `--bare` are unaffected
- Empty `--mcp-config '{"mcpServers":{}}'` does **not** avoid the hang (rules out MCP connect)
- Sessions inside a git-repo project directory do not reproduce
- Debug: home-directory-wide `rg` file-index scan runs unscoped against entire `$HOME` (no git root → falls back to `$HOME`)
- Walks macOS TCC-protected paths (`.Trash`, `Library/Mail`, Photos Library, Messages, HomeKit, and dozens more) with many `Operation not permitted (os error 1)` / `code=2` lines
- That rg-error block is the **last** debug line ever written
- `rg` subprocess exits (no rg left in `ps`) but parent `claude` idles ~0.1% CPU — blocked, not busy-looping
- Expected: bound the scan to cwd/project, **or** handle permission-denied gracefully and keep answering
- Workaround: `cd` into a git repo before launching `claude`

Problem found: A LAND-OFFICE DESK THAT SHOULD KEEP A HOME-CWD SESSION DEEDED INSTEAD HOMESTEADS AN UNSCOPED `$HOME` WALK THAT FREEZES THE CLERK AFTER `rg` EXITS.

Why this solution: a diagnostic homestead-claim bench for the deeded → homesteaded drift, so a reader can pin idle deeded, load the #92932 homesteaded path, and score staked / unscoped-home / tcc-wall / rg-exited / parent-idle / safe-mode-ok / bare-ok / mcp-ruled-out / git-root-ok / last-debug-line / cousins / before-after against the published facts.

## Why not a clone

This is specifically: **AN UNSCOPED `$HOME` `rg` FILE-INDEX WALK HITS TCC-DENIED TRACTS; `rg` EXITS; THE PARENT HANGS IDLE.**

**NOT #92784** (TCC AppData grant re-prompt tenure — same platform TCC family, different defect). Cite only.

**NOT #92908** (trust-parcel RMW lock — land metaphor only; different bug). Cite only.

**NOT #92036** (worktree probe timeout hang in a specific project directory). Cite only.

**NOT #91881** (Windows native install hang, zero network). Cite only.

NOT Epitaph / Recension / Mirage / Remora / Procrustes / Cadastre / Rubric / Sheave / Mailslot / Ukase / Scabbard / Deadletter. Do not ship Quill / Colophon / Sallyport this run.

Cousins cite-only #92784 #92908 #92036 #91881. Do not clone those products.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. NOT a Desktop automation.

Different paradigm: **the file-index walks the whole HOME prairie when there is no git root; TCC-denied tracts print; rg leaves; the clerk never answers.**

Do NOT rename this product Cadastre, Rushlight, Epitaph, or any existing catalog slug.
Do NOT reuse idle parked / epitaphed / inscribed / collated / stereotyped / emended / confirmed / miraged / loosed / clung / enrolled / escheated.
Do NOT reuse the Old Standard TT / Work Sans / Ubuntu Mono trio (Epitaph).

Different surface: HOME-cwd unscoped file-index hang vs TCC grant tenure / registry lock / false-completed agent / last-prompt witness.

Product name stays **Homestead**. Name/slug `homestead` unused in catalog.json (236 products before this ship; Epitaph is #236).

Different UI: prairie land-office / cream deed paper / oak rail fence posts / brass survey stake / prairie dusk / weathered claim stakes / inked metes. Playfair Display / Source Sans 3 / Fira Code. NOT Old Standard TT + Work Sans + Ubuntu Mono (Epitaph). NOT Crimson Pro + Work Sans + Cousine (Cadastre green-baize theodolite desk). NOT Petrona + Manrope + IBM Plex Mono (iron sconce atelier).

Different verbs: Score homesteaded, Admit deeded, Stake the bounded claim, Load #92932, Reset to deeded.

Different idle: **deeded**. Different #92932 path: **homesteaded**. HOLD: **deeded**. ALARM: **homesteaded** / **staked** / **unscoped-home** / **tcc-wall** / **rg-exited** / **parent-idle** / **safe-mode-ok** / **bare-ok** / **mcp-ruled-out** / **git-root-ok** / **last-debug-line** / **cousins** / **before-after** / **fixtures**. Seeded recover: **staked**.

## How to score

```bash
node --test projects/homestead/homestead.test.mjs
node projects/homestead/homestead.mjs projects/homestead/data/92932.json
node projects/homestead/homestead.mjs projects/homestead/data/deeded.json
echo '{"seed":"homesteaded"}' | node projects/homestead/homestead.mjs
```

Open the living card at `projects/homestead/index.html` (or the live path `/homestead/`). Buttons: Score homesteaded, Admit deeded, Stake the bounded claim, Load #92932, Load fixtures, Reset to deeded. Toggle HOME cwd / git root / bounded scan / TCC wall / parent answers — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/homestead/
- Folder: `projects/homestead/`
