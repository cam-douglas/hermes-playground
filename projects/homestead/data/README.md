# Homestead fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92932 issue facts: a new session whose cwd is `$HOME` (not a git repo) hangs after an unscoped `rg` file-index walk hits macOS TCC-denied tracts; `rg` exits and the parent idles at ~0.1% CPU. Score homesteaded or admit deeded.

Idle word: **deeded**. Path word: **homesteaded**. Seeded recover: **staked**. HOLD: **deeded**. ALARM: **homesteaded** / **staked** / **unscoped-home** / **tcc-wall** / **rg-exited** / **parent-idle** / **safe-mode-ok** / **bare-ok** / **mcp-ruled-out** / **git-root-ok** / **last-debug-line** / **cousins** / **before-after** / **fixtures**. Primary: [anthropics/claude-code#92932](https://github.com/anthropics/claude-code/issues/92932).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No Desktop automation. No patch to anthropics/claude-code. Not #92784 (TCC grant tenure). Not #92908 (trust-parcel RMW lock). Not #92036 (worktree probe timeout). Not #91881 (Windows install hang).

| File | Verdict | What it scores |
|---|---|---|
| `deeded.json` | deeded | Idle bench. HOLD: bounded project scan; parent answers. |
| `homesteaded.json` | homesteaded | Seeded #92932 path. ALARM: unscoped HOME walk + TCC wall + hang. |
| `92932.json` | homesteaded | Primary fixture alias for #92932. |
| `staked.json` | staked | Bounded claim / graceful continue after permission-denied. |
| `walk.json` | homesteaded | Published cd ~ → scan → TCC → rg exit → hang walk. |
| `unscoped-home.json` | unscoped-home | No git root; scan falls back to `$HOME`. |
| `tcc-wall.json` | tcc-wall | `.Trash` Mail Photos Messages HomeKit denied. |
| `rg-exited.json` | rg-exited | rg subprocess exits; none left in ps. |
| `parent-idle.json` | parent-idle | Parent ~0.1% CPU; blocked, not busy-looping. |
| `safe-mode-ok.json` | safe-mode-ok | `--safe-mode` starts and answers. |
| `bare-ok.json` | bare-ok | `--bare` starts and answers. |
| `mcp-ruled-out.json` | mcp-ruled-out | Empty `mcpServers` still hangs. |
| `git-root-ok.json` | git-root-ok | Git-repo project cwd does not reproduce. |
| `last-debug-line.json` | last-debug-line | rg-error block is the last debug line. |
| `cousins.json` | cousins | Cite-only #92784 #92908 #92036 #91881. |
| `before-after.json` | before-after | Before homesteaded; after expected deeded. |
| `fixtures.json` | fixtures | Row list for the land-office bench. |

Drop any file onto `projects/homestead/index.html`. Buttons load the seeded path. The living page admits **deeded** / idle bench / #92932.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
