# Fomite

A **sterile-lab / epidemiology booth** — glass slide, culture dish, agar plate, pathogen droplet hitchhiking on a directory-marketplace install copy. Fonts **Alegreya** (display) + **Nunito Sans** (body) + **Fira Code** (mono). Palette: sterile white `#f3f7f6`, teal `#0d7377`, agar amber `#c99212`, pathogen crimson `#b42318`, glass cyan `#2ec4ce` — bright lab, not wet-clay trench or orchard graft.

Primary:

- [anthropics/claude-code#93423](https://github.com/anthropics/claude-code/issues/93423) (OPEN, bug, has repro, platform:macos, area:security, area:plugins). Title: `[BUG] plugin install copies gitignored files, including a root .env, from a directory marketplace`. Filed by bostonaholic 2026-09-10. Claude Code **2.1.266**. macOS 26.6.2 arm64 zsh. `claude plugin install` / `claude plugin update` from a directory marketplace copies the marketplace root into `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/` WITHOUT honoring `.gitignore`. Measured on github.com/bostonaholic/team (90 skills, 13 agents): cache copy **128M** vs git-tracked **4.5M**; `node_modules/` **51M**. A root `.env` (gitignored secrets by convention) is copied with no warning and persists until the install is replaced. Copy already excludes `.git` but does not read `.gitignore` / global excludes / `core.excludesFile`.

03:50 fomite: a sterile-lab / epidemiology booth for #93423. Idle **scrubbed** / seeded **contaminated** / path **gitignore**. Score fomite or admit scrubbed.

Score fomite or admit scrubbed.

Idle word: **scrubbed** (HOLD: gitignore honored; no .env / node_modules in versioned cache; install matches tracked tree). Seeded word: **contaminated** / #93423 (directory marketplace install copies gitignored files including root .env). Path word: **gitignore**. Product score: **fomite**. Never idle mounted / fossed / plan9 / fosse / warm / paged-out / majflt / hibernacle / damped / spinning / mux / snubber / honest / scapegoated / cleared / grafted / copy-forward / graft / slipped / sprung / springe.

Phrase: **when a directory marketplace install copies gitignored files including a root .env into the versioned plugin cache with no warning, score fomite or admit scrubbed.**

- **scrubbed** = IDLE: HOLD; gitignore honored; no .env / node_modules in versioned cache; install matches tracked tree
- **contaminated** = #93423 seeded path: directory marketplace install copies gitignored files including root .env
- **fomite** = product score word for the object that carried infection on the install copy
- **gitignore** = path word: copy excludes `.git` but never consults ignore rules
- **hold** = HOLD alias for idle scrubbed
- **env-hitch** = root `.env` probe `TEAM_DEV_COPY_PROBE=not-a-real-secret`
- **node-modules** = `node_modules/` accounts for 51M of the cache vs tracked gap
- **cache-bloat** = cache copy 128M vs content tracked by git 4.5M
- **no-warning** = the install prints no warning
- **excludes-git** = copy already excludes `.git` — some filtering happens
- **skip-gitignore** = does not read `.gitignore` / global excludes / `core.excludesFile`
- **directory-source** = marketplace source is a `directory`
- **persists** = copied file stays until the install is replaced
- **has-repro** = Claude Code 2.1.266 · bostonaholic · macOS 26.6.2 arm64 · team-dev/team
- **cousins** = cite-only #93426 #92354 — do not rebuild
- **backups** = cite-only #93429 #93403 #93405 #93402 #93426 — do not auto-pick
- **fixtures** = glass-slide / culture-dish / copy table for the fomite booth
- **walk** = published idle scrubbed → marketplace-add → plugin-install → copy-excludes-git → skip-gitignore → env-hitch → node-modules-51M → cache-128M → scratch-hitch → no-warning → persists-until-replaced → contaminated → gitignore → fomite

Verdicts: scrubbed, contaminated, fomite, gitignore, hold, env-hitch, node-modules, cache-bloat, no-warning, excludes-git, skip-gitignore, directory-source, persists, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the bench is **contaminated** / **fomite** or already **scrubbed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): directory-marketplace install walks the marketplace root with a naive copy that excludes `.git` but never consults `.gitignore`, global excludes, or `core.excludesFile`, so gitignored secrets and scratch hitchhike into the versioned cache. Invite verify against #93423 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93423](https://github.com/anthropics/claude-code/issues/93423)
- Cite-only cousin: [anthropics/claude-code#93426](https://github.com/anthropics/claude-code/issues/93426) (host writes `.in_use` / `.orphaned_at` into pinned plugin tree; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#92354](https://github.com/anthropics/claude-code/issues/92354) (Graft — plugin cache copy-forward of untracked files across version dirs; do not rebuild)
- Backup (data only): #93429 Desktop drops image source path
- Backup (data only): #93403 nested skills never load in auto mode
- Backup (data only): #93405 autoMode trusted-repo path pinned user-global
- Backup (data only): #93402 Cmd+Enter interrupts instead of queues
- Backup (data only): #93426 host writes `.in_use` / `.orphaned_at` into pinned plugin tree

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:security, area:plugins
- Claude Code **2.1.266**; macOS 26.6.2 arm64; zsh
- Reporter: bostonaholic; checkout github.com/bostonaholic/team (90 skills, 13 agents)
- `claude plugin install` / `claude plugin update` copy the marketplace root into `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/`
- When the marketplace source is a `directory`, the copy includes files git ignores
- Measured: cache copy **128M** vs content tracked by git **4.5M**; `node_modules/` **51M**
- Rest is local scratch: `.playwright-mcp/`, `.claude/worktrees/`, `.agents/friction-log/`
- Copy already excludes `.git`, so some filtering happens, but it does not read `.gitignore`
- Root `.env` reserved for an eval-suite API key; probe `TEAM_DEV_COPY_PROBE=not-a-real-secret` confirmed in `~/.claude/plugins/cache/team-dev/team/0.97.0-claude.20260910173552/.env`
- The install prints no warning; the copied file stays until the install is replaced
- `--plugin-dir` skips the copy for a session; the reporter's dev install script still goes through `plugin install`

Problem found: DIRECTORY-MARKETPLACE PLUGIN INSTALL COPIES GITIGNORED FILES INCLUDING SECRETS (`.env`) INTO VERSIONED PLUGIN CACHE WITH NO WARNING.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether an install stayed scrubbed. Educational fomite / contamination booth for the catalog; encodes scrubbed vs contaminated vs gitignore path. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. When the marketplace source is a directory, skip files git ignores
2. Honor global excludes and `core.excludesFile`
3. An explicit exclude list in `marketplace.json` or `plugin.json` would work too

## Why not a clone

This is specifically: **DIRECTORY-MARKETPLACE INSTALL COPIES GITIGNORED FILES INCLUDING ROOT `.env` INTO VERSIONED CACHE** — sterile-lab fomite, not earthwork fosse / winter den / pulse-damper / orchard graft / hook snare.

**NOT Fosse/#93358** (Win10 Plan9 host-honest / guest 0/4 EINVAL). Different defect. NOT wet clay trench.

**NOT Hibernacle/#93372** (Windows idle working-set trim / majflt stall). Different defect. NOT winter den.

**NOT Snubber/#93398** (sandboxed Bash EPIPE spin on leaked srt-mux). Different defect. NOT pulse-damper.

**NOT Graft/#92354** (plugin cache copy-forward of prior version untracked tree). Related surface, different defect: this is a *first* directory-marketplace copy that never consults `.gitignore`, not a scion inheriting the previous version dir. NOT orchard cambium.

**NOT Springe/#92675** (plugin-native PreToolUse deny no-op). Different defect. NOT snare bench.

**NOT Scapegoat/#93348.** **NOT Cartulary/#93331.** **NOT Paraph/#93327.** **NOT Appanage/#93307.** **NOT Pontoon/#93288.** **NOT Concordat/#93290.** **NOT Revenant/#93274.**

**NOT leftover woodworking / mm-slider Vernier/#93219.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **epidemiology / fomite — an object that carries infection on a marketplace directory copy** — unused in catalog as this sterile-lab walk.

Do NOT rename this product Fosse, Hibernacle, Snubber, Graft, Springe, Scapegoat, Cartulary, Paraph, Appanage, Pontoon, Concordat, Revenant, or any existing catalog slug.
Do NOT reuse idle scrubbed / contaminated / gitignore on a later booth.
Do NOT reuse Source Serif 4, Karla, Roboto Mono, Cormorant Garamond, Literata, Libre Bodoni. Display here is **Alegreya**. Body is **Nunito Sans**. Mono is **Fira Code**.

Different surface: directory-marketplace gitignore-blind copy vs Plan9 host/guest mount vs idle working-set trim vs plugin-cache copy-forward vs hook deny no-op.

Product name stays **Fomite**. Name/slug `fomite` unused in catalog.json (275 products before this ship; Snubber is #275).

Different UI: sterile-lab / epidemiology / glass slide / culture dish / agar / pathogen hitchhiking on install copy. Alegreya / Nunito Sans / Fira Code. NOT earthwork / sod lip (Fosse). NOT winter den (Hibernacle). NOT pulse-damper (Snubber). NOT orchard graft / cambium (Graft). NOT trapper springe. NOT millimeter-slider.

Different verbs: Culture the slide, Score fomite, Stain the dish, Audit the hitch, Pin idle scrubbed, Pin seeded contaminated, Pin gitignore, Autoclave the bench.

Different idle: **scrubbed**. Different #93423 seeded path: **contaminated**. HOLD: **scrubbed** / **hold**. ALARM: **contaminated** / **fomite** / **gitignore** / **env-hitch**. Path: **gitignore**.

## How to score

```bash
node --test projects/fomite/fomite.test.mjs
node projects/fomite/fomite.mjs projects/fomite/data/contaminated.json
echo '{"seed":"contaminated"}' | node projects/fomite/fomite.mjs
```

Open the living card at `projects/fomite/index.html` (or the live path `/fomite/`). Buttons: Culture the slide, Score fomite, Stain the dish, Audit the hitch, Pin idle scrubbed, Pin seeded contaminated, Pin gitignore, Autoclave the bench. Toggle honor .gitignore / hitch .env / copy node_modules / directory marketplace / exclude .git only / no warning / persist until replaced — the score flips. Lay a fixture JSON on the glass slide. `?embed=1` hides chrome.

The booth reconstructs the reporter’s directory-marketplace copy / `.gitignore` unread / `.env` hitch / 128M vs 4.5M walk from the published #93423 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/fomite/
- Folder: `projects/fomite/`
