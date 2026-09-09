# Derby

A **racecourse / starting-gate / photo-finish atelier booth** — paddock earth, turf stripe, white rail, claret and canary silks, gunmetal gate, photo-finish amber; fonts **Bodoni Moda** (display) + **Manrope** (body) + **IBM Plex Mono** (mono) — for a real Claude Code defect: **TWO CONCURRENT SESSIONS RACE ON THE NPM-GLOBAL INSTALL AND DELETE THE CLAUDE PACKAGE (DANGLING SYMLINK, 'COMMAND NOT FOUND').**

Primary:

- [anthropics/claude-code#93197](https://github.com/anthropics/claude-code/issues/93197) (OPEN, bug, has repro, platform:macos, area:packaging). Title: `Auto-updater: two concurrent sessions race on the npm-global install and delete the claude package (dangling symlink, 'command not found')`. Claude Code 2.1.266, npm-global install (`npm install -g @anthropic-ai/claude-code`) under Homebrew node; npm 11.12.1; Node 25.9.0; macOS 26.x (Darwin 25.6.0), Apple Silicon. Two Claude Code sessions launched ~90 ms apart (one interactive session in one project dir, one in another dir with a different `CLAUDE_CONFIG_DIR`). Each started its own background auto-update: `npm install --global @anthropic-ai/claude-code@2.1.266`. Both npm runs "retired" the live package dir to the same temp path (`/opt/homebrew/lib/node_modules/@anthropic-ai/.claude-code-2DTsDk1V`). One run ended with `error process terminated / error signal SIGHUP / exit 1`; the other logged `exit 0 / info ok`. Afterward `/opt/homebrew/lib/node_modules/@anthropic-ai/` was empty and `/opt/homebrew/bin/claude` was a dangling symlink, so every new shell got `claude: command not found` until a manual `npm install -g @anthropic-ai/claude-code@2.1.266`. Expected: the updater should take a lock (or skip when another update is already in flight) so two concurrent sessions cannot clobber the shared global install. Repro: npm-global install, auto-updates enabled, a newer version available; start two `claude` sessions at the same moment; observe two `npm install --global` debug logs with near-identical timestamps in `~/.npm/_logs/` and a missing package dir afterward. Evidence: `~/.npm/_logs/2026-09-09T14_02_34_904Z-debug-0.log` and `…14_02_34_992Z-debug-0.log` (both `install --global @anthropic-ai/claude-code@2.1.266`); preceding `npm view @anthropic-ai/claude-code@latest version --prefer-online` log at `14_02_33`. Symlink mtime 07:05:03 PDT; reinstall 07:08. Filed 2026-09-09T20:45:46Z by saltydoctor.

07:50 derby: a racecourse / starting-gate booth that should keep the npm-global install **locked** (one updater in flight, or skip-in-flight); instead concurrent sessions race — both retire the live package to the same temp path, one SIGHUPs, the other exits 0, dangling symlink, command not found (#93197). Score scratched or admit locked.

Score scratched or admit locked.

Idle word: **locked** (HOLD: one updater in flight; others skip; install stays intact). Seeded word: **scratched** / #93197 (same temp retire path, dangling symlink, command not found). Path word: **derby**. Never idle unmasked / vizard / precedence / carrier / deadair / squelch / moored / scuttled / scuttle / open / seated / stopcock / preserved / discarded / fresh / stamped / cleared / mounded / distinct / conflated / held / steered / raised / fallen / sterling / primed / flashed / lodged / bypassed / greenroomed / scaffold / diplopic / freewheeling / doubled.

Phrase: **when concurrent runners leave the gate together and scratch the shared plate, derby never stays locked — score scratched or admit locked.**

- **locked** = IDLE: HOLD; one updater in flight; others skip; install stays intact
- **scratched** = #93197 seeded path: same temp retire; SIGHUP vs ok; dangling symlink; command not found
- **derby** = path word: packaging concurrency / global-install race
- **skip-in-flight** = HOLD alias: lock or skip when another update is already in flight
- **hold** = HOLD alias for idle locked
- **concurrent-sessions** = two sessions ~90 ms apart; different `CLAUDE_CONFIG_DIR`
- **shared-temp-retire** = both retire to `.claude-code-2DTsDk1V`
- **sighup-vs-ok** = SIGHUP / exit 1 vs exit 0 / info ok
- **dangling-symlink** = `/opt/homebrew/bin/claude` dangling
- **command-not-found** = `claude: command not found` until manual reinstall
- **empty-package-dir** = `/opt/homebrew/lib/node_modules/@anthropic-ai/` empty
- **npm-debug-pair** = `14_02_34_904Z` and `14_02_34_992Z` debug logs
- **has-repro** = 2.1.266 + npm 11.12.1 + Node 25.9.0 + Darwin 25.6.0 walk
- **cousins** = cite-only #88091 #90233 #86496 #86941 #84081 #84224 #85154 #996 — do not clone
- **fixtures** = row list for the derby booth
- **walk** = published idle locked → concurrent-sessions → npm-debug-pair → shared-temp-retire → sighup-vs-ok → empty-package-dir → dangling-symlink → command-not-found → scratched → derby

Verdicts: locked, scratched, derby, hold, skip-in-flight, concurrent-sessions, shared-temp-retire, sighup-vs-ok, dangling-symlink, command-not-found, empty-package-dir, npm-debug-pair, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring starting-gate booth. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the plate is **scratched** or already **locked**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the auto-updater does not take a cross-process lock (or skip-in-flight) before launching `npm install --global`, so two sessions ~90 ms apart both retire the live package to the same temp path. Invite verify against #93197 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93197](https://github.com/anthropics/claude-code/issues/93197)
- Cite-only: [anthropics/claude-code#88091](https://github.com/anthropics/claude-code/issues/88091) (concurrent sessions ENOTEMPTY leftover temp dir + missing native binary)
- Cite-only: [anthropics/claude-code#90233](https://github.com/anthropics/claude-code/issues/90233) (Windows npm-global `claude.exe.old` leak / `update_apply_exe_locked`)
- Cite-only: [anthropics/claude-code#86496](https://github.com/anthropics/claude-code/issues/86496) (unwritable npm global folder + forced re-login)
- Cite-only: [anthropics/claude-code#86941](https://github.com/anthropics/claude-code/issues/86941) (npm 12 allowScripts blocks postinstall)
- Cite-only: [anthropics/claude-code#84081](https://github.com/anthropics/claude-code/issues/84081) (500-byte stub when allowScripts blocks postinstall)
- Cite-only: [anthropics/claude-code#84224](https://github.com/anthropics/claude-code/issues/84224) (auto-updater installs into PATH-resolved npm prefix)
- Cite-only: [anthropics/claude-code#85154](https://github.com/anthropics/claude-code/issues/85154) (stub binary + missing `bin/claude` symlink, no rollback)
- Cite-only: [anthropics/claude-code#996](https://github.com/anthropics/claude-code/issues/996) (ENOTEMPTY rename leftover)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:packaging
- Claude Code 2.1.266; npm-global under Homebrew node; npm 11.12.1; Node 25.9.0; Darwin 25.6.0 Apple Silicon
- Two sessions launched ~90 ms apart; different `CLAUDE_CONFIG_DIR`
- Both started `npm install --global @anthropic-ai/claude-code@2.1.266`
- Both retired the live package to `/opt/homebrew/lib/node_modules/@anthropic-ai/.claude-code-2DTsDk1V`
- One SIGHUP / exit 1; the other exit 0 / info ok
- Package dir empty; `/opt/homebrew/bin/claude` dangling symlink
- `claude: command not found` until manual reinstall
- Expected: lock, or skip when another update is already in flight
- Debug logs `14_02_34_904Z` and `14_02_34_992Z`; preceding `npm view` at `14_02_33`
- Symlink mtime 07:05:03 PDT; reinstall 07:08

Problem found: WHEN CONCURRENT RUNNERS LEAVE THE GATE TOGETHER AND SCRATCH THE SHARED PLATE, DERBY NEVER STAYS LOCKED.

Why this solution: a diagnostic starting-gate booth for the locked → scratched drift, so a reader can pin idle locked, load the #93197 scratched path, and score derby / shared-temp-retire / dangling-symlink / command-not-found against the published facts. Interactive booth that makes the concurrent npm-global race tangible — operator scores locked vs scratched against fixture chips from the issue (two npm debug logs ~90ms apart, shared temp retire path, dangling symlink, command not found).

## Why not a clone

This is specifically: **TWO CONCURRENT SESSIONS RACE ON THE NPM-GLOBAL INSTALL AND DELETE THE CLAUDE PACKAGE.**

**NOT Vizard/#93190** (Desktop `/plan` intercept so CLI project-command precedence never runs). Different paradigm.

**NOT Dead Air/#93155** (silent 900s API stall with keepalive ACK / zero log). Different paradigm.

**NOT Scuttle/#93154** (remote SSH warm-up-failure `server.shutdown` SIGKILL). Different paradigm.

**NOT Stopcock/#93143** (Streamable HTTP MCP ~6min hard seat). Different paradigm.

**NOT Parergon/#93122** (stealth idle over an open `/btw` side chat). Different paradigm.

**NOT Stereotype/#93108** (plugin update version-string-only freshness). Different paradigm.

**NOT Midden/#93081** (WorktreePool partial-remove GC remound loop). Different paradigm.

**NOT Diplopia/#93012** (Remote Control environment-label field split). Different paradigm.

**NOT Greenroom/#92988** (Desktop Code tab missing wait-for-full-turn-end queue). Different paradigm.

**NOT Guillotine/#92974** (background-mode Deny-only permission dialog). Different paradigm.

**NOT Understudy / Mirage / Trompe / Homonym / Shibboleth / Procrustes / Interlock** (different slash/MCP/name paradigms).

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **packaging concurrency / global-install race** — unused in catalog.

Do NOT rename this product Vizard, Dead Air, Scuttle, Stopcock, Parergon, Stereotype, Midden, Guillotine, Understudy, Mirage, Trompe, Homonym, Shibboleth, or any existing catalog slug.
Do NOT reuse idle locked / scratched / derby on a later booth.
Do NOT reuse Cinzel + Karla + Azeret Mono (Vizard). Do NOT reuse Oswald + Source Sans 3 + Share Tech Mono (Dead Air). Do NOT reuse DM Serif Display + Lexend + JetBrains Mono (Scuttle). Do NOT reuse Literata + Source Sans 3 + IBM Plex Mono as a stack (Stopcock — IBM Plex Mono is shared here, display and body are not). Do NOT reuse Instrument Serif + Schibsted Grotesk + Fragment Mono (Parergon). Do NOT reuse Alegreya + Karla + Noto Sans Mono (Stereotype). Display here is **Bodoni Moda**. Body is **Manrope**. Mono is **IBM Plex Mono**.

Different surface: concurrent npm-global retire race vs Desktop `/plan` intercept / silent 900s API stall / remote-SSH `server.shutdown` / Streamable HTTP MCP hard seat / stealth-/btw-aside discard / version-string-only plugin freshness / WorktreePool orphaned-GC deadlock / Deny-only permission dialog.

Product name stays **Derby**. Name/slug `derby` unused in catalog.json (255 products before this ship; Vizard is #255).

Different UI: racecourse / starting-gate / photo-finish / paddock earth / turf stripe / white rail / claret silk / canary silk / gunmetal gate / photo-finish amber. Bodoni Moda / Manrope / IBM Plex Mono. NOT masquerade atelier (Vizard). NOT charcoal radio studio (Dead Air). NOT naval shipyard (Scuttle). NOT brass plumbing (Stopcock). NOT parchment/manuscript aside (Parergon). NOT letterpress (Stereotype). NOT scaffold/guillotine. NOT theater green room.

Different verbs: Drop the gate, Hold the lock, Scratch the plate, Pin idle locked, Pin seeded scratched, Pin derby, Call the photo, Open stall A, Open stall B, Reset the card.

Different idle: **locked**. Different #93197 seeded path: **scratched**. HOLD: **locked** / **skip-in-flight**. ALARM: **scratched** / **derby** / **concurrent-sessions** / **shared-temp-retire** / **sighup-vs-ok** / **dangling-symlink** / **command-not-found** / **empty-package-dir** / **npm-debug-pair**. Path: **derby**.

## How to score

```bash
node --test projects/derby/derby.test.mjs
node projects/derby/derby.mjs projects/derby/data/93197.json
node projects/derby/derby.mjs projects/derby/data/locked.json
echo '{"seed":"scratched"}' | node projects/derby/derby.mjs
```

Open the living card at `projects/derby/index.html` (or the live path `/derby/`). Buttons: Drop the gate, Hold the lock, Scratch the plate, Pin idle locked, Pin seeded scratched, Pin derby, Call the photo, Open stall A, Open stall B, Reset the card. Toggle lock / concurrent / shared temp / SIGHUP / dangling / command-not-found — the score flips. Rest a fixture JSON on the paddock tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s concurrent npm-global retire walk from the published #93197 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/derby/
- Folder: `projects/derby/`
