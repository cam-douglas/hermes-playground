# Mortmain

A **medieval muniment-room / dead-hand charter booth** — dark parchment, wax seals, iron chest drawers that should stay alienable, but the dead hand freezes tracked `.claude` paths so git cannot unlink them. Fonts **Cinzel** (display) + **Source Sans 3** (UI) + **JetBrains Mono** (mono). Palette: hall oak, iron chest, ruled parchment, sealing-wax crimson, gold leaf — for a real Claude Code defect: **BASH SANDBOX DENIES WRITES TO `<repo>/.claude/` PATHS, SILENTLY CORRUPTING THE GIT WORKING TREE IN REPOS THAT TRACK FILES THERE.**

Primary:

- [anthropics/claude-code#93173](https://github.com/anthropics/claude-code/issues/93173) (OPEN, bug, has repro, platform:macos, area:bash, area:sandbox). Title: `Bash sandbox denies writes to /.claude/ paths, silently corrupting the git working tree in repos that track files there`. Claude Code 2.1.255 desktop Code tab; macOS 15.7.9 arm64; git 2.50.1; `sandbox.enabled` true; `autoAllowBashIfSandboxed` true; pnpm monorepo tracking ~12 files under `.claude/skills/**`. `touch <worktree>/.claude/skills/sandbox-write-probe` → Operation not permitted; touch elsewhere succeeds. `git switch -c` unable to unlink `.claude/skills/**`; may fail locking `.git/config`; `rev-parse` still old branch while tree updated → hundreds of staged phantoms; plain `git switch` recovers HEAD. Filed 2026-09-09T19:14:43Z by jakes-space.

11:50 mortmain: a muniment-room / dead-hand charter booth that should keep tracked agent-config paths **freehold** (git can check them out; tree matches HEAD; no phantom authorship); instead sandbox **mortmain**s — `denyWithinAllow` freezes writes under tracked `.claude/skills`, `.claude/hooks`, `.claude/settings.json` so switch leaves a half-updated tree that looks like deliberate WIP (#93173). Score mortmain or admit freehold.

Score mortmain or admit freehold.

Idle word: **freehold** (HOLD: tracked `.claude` paths alienable; git can checkout; tree matches HEAD; no authorless diffs). Seeded word: **mortmain** / #93173 (`denyWithinAllow` freezes tracked `.claude` paths; unlink denied; HEAD may lag; phantoms appear). Path word: **phantom**. Never idle trunked / strowger / exchanged / tokenized / mondegreen / parsed / locked / scratched / derby / unmasked / vizard / precedence / carrier / deadair / squelch / moored / scuttled / scuttle / open / seated / stopcock / preserved / discarded / fresh / stamped / cleared / mounded / corked / relayed.

Phrase: **when denyWithinAllow freezes tracked .claude paths so git cannot unlink them and the tree fills with authorless diffs, mortmain never stays freehold — score mortmain or admit freehold.**

- **freehold** = IDLE: HOLD; tracked `.claude` paths alienable; git can checkout; tree matches HEAD; no phantom authorship
- **mortmain** = #93173 seeded path: `denyWithinAllow` freezes tracked `.claude`; unlink denied; HEAD may lag
- **phantom** = path word: authorless diffs after a half-updated tree
- **hold** = HOLD alias for idle freehold
- **deny-within-allow** = sandbox `denyWithinAllow` lists repo-relative `.claude/skills`, `.claude/hooks`, `.claude/settings.json`
- **tracked-claude-paths** = pnpm monorepo tracks ~12 files under `.claude/skills/**`
- **unlink-denied** = `git switch` unable to unlink `.claude/skills/**`; may fail locking `.git/config`
- **head-behind** = `rev-parse` still old branch while the working tree has been updated
- **authorless-diff** = hundreds of staged phantoms; git records no author; later sessions treat them as real work
- **silent-warning** = step exits in a way that reads as success apart from `warning:` lines
- **has-repro** = touch-denied + switch unlink + HEAD-behind walk
- **cousins** = cite-only #53891 #85072 #54189 #79945 — do not rebuild
- **backups** = cite-only #93182 #93219 #93207 #93198 #93177 #93210 — do not auto-pick as primary
- **fixtures** = row list for the mortmain booth
- **walk** = published idle freehold → deny-within-allow → tracked-claude-paths → unlink-denied → head-behind → authorless-diff → silent-warning → mortmain → phantom

Verdicts: freehold, mortmain, phantom, hold, deny-within-allow, tracked-claude-paths, unlink-denied, head-behind, authorless-diff, silent-warning, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring muniment booth. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the charter is **mortmain** or already **freehold**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): `denyWithinAllow` lists repo-relative agent-config paths and never reconciles them against `git ls-files`, so a version-controlled `.claude` file is treated as agent config and git cannot unlink it. Invite verify against #93173 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93173](https://github.com/anthropics/claude-code/issues/93173)
- Cite-only cousin: [anthropics/claude-code#53891](https://github.com/anthropics/claude-code/issues/53891) (closed — sandbox write-deny on `.claude/commands` blocks git worktree/checkout for tracked slash commands; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#85072](https://github.com/anthropics/claude-code/issues/85072) (closed — sandbox auto write-protection of `.claude/skills` undocumented / cannot lift via allowWrite; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#54189](https://github.com/anthropics/claude-code/issues/54189) (closed — CLI sandbox intercepts `.claude/**` writes even when permission-prompt-tool grants; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#79945](https://github.com/anthropics/claude-code/issues/79945) (open — sandbox write-deny on `.claude/.cc-writes` prevents git worktree removal after ExitWorktree; do not rebuild)
- Backup (data only): [anthropics/claude-code#93182](https://github.com/anthropics/claude-code/issues/93182) (server-side tools unblockable)
- Backup (data only): [anthropics/claude-code#93219](https://github.com/anthropics/claude-code/issues/93219) (Vernier — macOS effort slider inert)
- Backup (data only): [anthropics/claude-code#93207](https://github.com/anthropics/claude-code/issues/93207) (iOS plan approval setMode auto discards prePlanMode)
- Backup (data only): [anthropics/claude-code#93198](https://github.com/anthropics/claude-code/issues/93198) (Cedilla accented path file panel)
- Backup (data only): [anthropics/claude-code#93177](https://github.com/anthropics/claude-code/issues/93177) (opusplan stays on Opus after exiting plan mode)
- Backup (data only): [anthropics/claude-code#93210](https://github.com/anthropics/claude-code/issues/93210) (sidebar groups stale order key)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:bash, area:sandbox
- Claude Code 2.1.255, desktop app (Code tab); macOS 15.7.9 arm64; git 2.50.1
- Sandbox enabled (`sandbox.enabled: true`, `autoAllowBashIfSandboxed: true`)
- A pnpm monorepo that tracks `.claude/skills/**` as ordinary version-controlled content (~12 files)
- `denyWithinAllow` includes repo-relative `.claude/skills`, `.claude/settings.json`, `.claude/hooks`
- `touch <worktree>/.claude/skills/sandbox-write-probe` → Operation not permitted; touch elsewhere succeeds
- `git switch -c my-branch origin/some-branch` → unable to unlink `.claude/skills/**`; may fail locking `.git/config`
- `git rev-parse --abbrev-ref HEAD` still reports the old branch while the working tree has been updated (488 staged changes in the filed case)
- A plain `git switch` afterwards recovers HEAD
- Silent working-tree corruption; false provenance (session nearly proposed phantom rollback as deliberate WIP)
- Expected: do not deny tracked paths (reconcile deny vs `git ls-files`) OR fail loud that the tree may disagree with HEAD

Problem found: WHEN DENYWITHINALLOW FREEZES TRACKED `.CLAUDE` PATHS SO GIT CANNOT UNLINK THEM AND THE TREE FILLS WITH AUTHORLESS DIFFS, MORTMAIN NEVER STAYS FREEHOLD.

Why this solution: a diagnostic muniment-room / dead-hand charter booth for the freehold → mortmain drift, so a reader can pin idle freehold, load the #93173 mortmain path, and score phantom / deny-within-allow / unlink-denied / head-behind / authorless-diff against the published facts. A conceptual iron chest still holds every tracked drawer; a wax seal shows whether git can alienate the charter. No live Claude session is required.

## Why not a clone

This is specifically: **SANDBOX `denyWithinAllow` FREEZES TRACKED `.claude` PATHS SO GIT CANNOT UNLINK THEM AND THE TREE FILLS WITH AUTHORLESS DIFFS.**

**NOT Strowger/#93218** (Desktop `--disallowedTools SendMessage` while ListAgents still lists). Different paradigm.

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Derby/#93197** (concurrent npm-global retire race). Different paradigm.

**NOT Vizard/#93190** (Desktop `/plan` intercept so CLI project-command precedence never runs). Different paradigm.

**NOT Dead Air/#93155** (silent 900s API stall with keepalive ACK / zero log). Different paradigm.

**NOT Scuttle/#93154**. **NOT Stopcock/#93143**. **NOT Parergon/#93122**. **NOT Stereotype/#93108**. **NOT Midden/#93081**. **NOT Oubliette**. **NOT Ephemera**. **NOT Embrasure**.

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **sandbox `denyWithinAllow` vs tracked `.claude` paths / git unlink / HEAD-behind phantoms** — unused in catalog as this muniment / dead-hand walk.

Do NOT rename this product Strowger, Mondegreen, Derby, Vizard, Dead Air, Scuttle, Stopcock, Parergon, Stereotype, Midden, Oubliette, Ephemera, Embrasure, or any existing catalog slug.
Do NOT reuse idle freehold / mortmain / phantom on a later booth.
Do NOT reuse Syne + Karla + IBM Plex Mono (Strowger). Do NOT reuse Cormorant Garamond + Outfit + Space Mono (Mondegreen). Do NOT reuse Bodoni Moda + Manrope (Derby). Display here is **Cinzel**. UI is **Source Sans 3**. Mono is **JetBrains Mono**.

Different surface: sandbox write-deny on tracked `.claude/**` vs Desktop `--disallowedTools SendMessage` / isolation:worktree substring `git` / npm-global race / Desktop `/plan` intercept / silent 900s API stall.

Product name stays **Mortmain**. Name/slug `mortmain` unused in catalog.json (258 products before this ship; Strowger is #258).

Different UI: muniment room / sealed charter / dead-hand deed hall / dark parchment / wax seals / iron chest drawers. Cinzel / Source Sans 3 / JetBrains Mono. NOT Strowger exchange / switchboard / bakelite / trunk lamp. NOT ballad-sheet studio (Mondegreen). NOT racecourse (Derby). NOT masquerade atelier (Vizard). NOT charcoal radio studio (Dead Air).

Different verbs: Unseal the charter, Admit freehold, Score mortmain, Pin idle freehold, Pin seeded mortmain, Pin phantom, Open the chest, Read the roll, Reset the hall.

Different idle: **freehold**. Different #93173 seeded path: **mortmain**. HOLD: **freehold** / **hold**. ALARM: **mortmain** / **phantom** / **deny-within-allow** / **tracked-claude-paths** / **unlink-denied** / **head-behind** / **authorless-diff** / **silent-warning**. Path: **phantom**.

## How to score

```bash
node --test projects/mortmain/mortmain.test.mjs
node projects/mortmain/mortmain.mjs projects/mortmain/data/93173.json
node projects/mortmain/mortmain.mjs projects/mortmain/data/freehold.json
echo '{"seed":"mortmain"}' | node projects/mortmain/mortmain.mjs
```

Open the living card at `projects/mortmain/index.html` (or the live path `/mortmain/`). Buttons: Unseal the charter, Admit freehold, Score mortmain, Pin idle freehold, Pin seeded mortmain, Pin phantom, Open the chest, Read the roll, Reset the hall. Toggle deny / tracked / unlink / HEAD — the score flips. Rest a fixture JSON on the charter roll. `?embed=1` hides chrome.

The booth reconstructs the reporter’s `denyWithinAllow` / unable-to-unlink / HEAD-behind walk from the published #93173 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/mortmain/
- Folder: `projects/mortmain/`
