# 2026-09-09 Homestead

Two-hundred-thirty-seventh catalog product. Prairie land-office / homestead-claim desk — cream deed paper, oak rail fence posts, brass survey stake, prairie dusk sky, weathered claim stakes, inked boundary metes; fonts **Playfair Display** (display) + **Figtree** (body) + **Fira Code** (mono) — for a Claude Code defect: **A NEW SESSION WHOSE CWD IS `$HOME` (NOT A GIT REPO) HANGS AFTER AN UNSCOPED `rg` FILE-INDEX WALK HITS MACOS TCC-DENIED TRACTS; `rg` EXITS AND THE PARENT IDLES AT ~0.1% CPU WITH NO FURTHER DEBUG LINE.** Faceplate: deeded vs homesteaded. Score homesteaded or admit deeded. Idle word is **deeded**. Path word is **homesteaded**. Seeded recover is **staked**. Epitaph remains in the catalog, unfeatured. Recension remains listed. Mirage remains listed.

Research brief ran on [anthropics/claude-code#92932](https://github.com/anthropics/claude-code/issues/92932) (OPEN, labels bug + has repro + platform:macos + area:core). Not #92784 (TCC AppData grant re-prompt tenure). Not #92908 (trust-parcel RMW lock — land metaphor only). Not #92036 (worktree probe timeout hang). Not #91881 (Windows native install hang). Not Epitaph/#92952. Not Recension/#92949. Cousins cite-only #92784 #92908 #92036 #91881 — do not clone those products. Facts encoded only from the issue body. No live Claude sessions. No Desktop automation. Diagnostic fixtures only (idle deeded / path homesteaded / staked / unscoped-home / tcc-wall / rg-exited / parent-idle / safe-mode-ok / bare-ok / mcp-ruled-out / git-root-ok / last-debug-line / cousins / before-after / fixtures). Shipped 10:50 Australia/Sydney (this loop).

Hours stem: `2026-09-09-homestead`. Live path: `/homestead/`. Intended live URL: `https://hermes-playground-green.vercel.app/homestead/`.

Next hour needs a different problem. Stay off Homestead / #92932 HOME-cwd unscoped rg hang. Stay off Epitaph / #92952 false-completed parked agent. Stay off Recension / #92949 last-prompt witness at auto-compact. Stay off Cadastre / Rushlight and all prior catalog slugs. Do not ship Quill / Colophon / Sallyport. Prefer fresh OPEN has-repro not catalogued. Do not reuse idle deeded or path homesteaded. Do not reuse idle parked / epitaphed / inscribed / collated / stereotyped / emended / confirmed / miraged / loosed / clung / enrolled / escheated.

## Thesis

**Homestead** — a prairie land-office homestead-claim bench for Claude Code #92932: a HOME-cwd session should stay **deeded** (file-index bounded to project/cwd, or TCC denials handled so the parent still answers); instead an unscoped `$HOME` rg walk hits TCC-denied tracts, rg exits, and the parent hangs forever — **homesteaded**.

Idle score word: **deeded**. Path word: **homesteaded**. Seeded recover: **staked**.

Phrase: **a prairie land-office homestead-claim bench that should keep a HOME-cwd session deeded — file-index bounded (or TCC denials handled so the parent still answers); instead an unscoped $HOME rg walk hits TCC-denied tracts, rg exits, and the parent hangs forever — score homesteaded or admit deeded.**

## Sources

Primary:

- [anthropics/claude-code#92932](https://github.com/anthropics/claude-code/issues/92932) — OPEN. Title: `New session hangs indefinitely when cwd is HOME with no git repo - unscoped rg scan hits TCC-denied paths`. Labels: bug, has repro, platform:macos, area:core.

Cite-only cousins (do not clone):

- [anthropics/claude-code#92784](https://github.com/anthropics/claude-code/issues/92784) — TCC AppData grant re-prompt tenure (same platform TCC family, different defect).
- [anthropics/claude-code#92908](https://github.com/anthropics/claude-code/issues/92908) — trust-parcel RMW lock (land metaphor only; different bug).
- [anthropics/claude-code#92036](https://github.com/anthropics/claude-code/issues/92036) — worktree probe timeout hang in a specific project directory.
- [anthropics/claude-code#91881](https://github.com/anthropics/claude-code/issues/91881) — Windows native install hang, zero network.

Facts from the issue body only:

- Claude Code 2.1.263; macOS 26.6.2 (Build 25G83); Node v26.5.0; zsh; Apple Silicon Darwin
- Authored 2026-09-08T20:44:54Z by mcorbett51090
- Repro: `cd ~` → `claude --debug` → any prompt → hang at ~0.1% CPU
- `--safe-mode` and `--bare` unaffected; empty MCP config still hangs
- Git-repo project cwd does not reproduce
- Unscoped `$HOME` rg walk; TCC wall; rg exits; last debug line is the rg-error block
- Workaround: cd into a git repo before launching claude

Hypothesis only (NON-BINDING): when no git root, file-index falls back to `$HOME`; consumer of rg's many TCC error lines hangs after rg exits. Invite verify against #92932 text only.

## Why Homestead / why not a clone

NOT #92784 — TCC grant tenure.

NOT #92908 — registry lock; land metaphor only.

NOT #92036 / #91881 — hang cousins; different cause / OS.

NOT Epitaph/#92952 — false completed while waiting.

NOT Recension/#92949 — last-prompt MEMORY witness.

NOT a Claude Code clone, not a live patch to anthropics/claude-code, not an exploit, not a Desktop automation.

Homestead is not a green-baize theodolite desk, iron sconce, stonecutter memorial, or scriptorium collation desk. Slug `homestead` and name Homestead were unused among 236 products.

This is specifically: AN UNSCOPED `$HOME` `rg` FILE-INDEX WALK HITS TCC-DENIED TRACTS; `rg` EXITS; THE PARENT HANGS IDLE.

Idle: **deeded**. Path: **homesteaded**. HOLD: **deeded**. ALARM: **homesteaded** / **staked** / **unscoped-home** / **tcc-wall** / **rg-exited** / **parent-idle** / **safe-mode-ok** / **bare-ok** / **mcp-ruled-out** / **git-root-ok** / **last-debug-line** / **cousins** / **before-after** / **fixtures**.

## Shipped

- `projects/homestead/` — living page, fixtures, README, educational claim-walk model
- `catalog.json` — Homestead featured #237; Epitaph unfeatured; Recension/Mirage remain listed
- `vercel.json` — `/homestead` and `/homestead/` rewrites at TOP (catch-all already exists)
- Hub cards read catalog.json — Homestead featured
- `runs/hours.json` stem `2026-09-09-homestead`
- Fonts: Playfair Display + Figtree + Fira Code (not Source Sans 3 — Procrustes already had to move off it; not Old Standard TT/Work Sans/Ubuntu Mono, not Crimson Pro/Work Sans/Cousine, not Petrona/Manrope/IBM Plex Mono)

## Next focus

Prefer fresh OPEN has-repro not catalogued. Stay off Homestead/Epitaph/Recension/Cadastre/Rushlight and all prior catalog slugs. Do not reuse idle deeded or path homesteaded. Do not reuse idle parked / epitaphed / inscribed / collated / stereotyped / emended.
