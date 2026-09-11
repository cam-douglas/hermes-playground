# Vinculum

A **chain-forge / binder's vinculum bench** — iron slate, brass nlink gauges, linen binding cord, soot. Fonts **Libre Baskerville** (display) + **Karla** (body) + **Source Code Pro** (mono). Palette: slate iron `#1a1f2a`, brass `#b8956c`, linen `#e8dfd0`, soot `#0d1016`, rust `#8b3a2a`, gauge green `#3d6b4f` — dark forge field with brass instruments, not parchment wax blotter, hangar strobe, cheque desk, camera lucida, sterile lab, pulse-damper, earthwork fosse, hibernacle, or paraph issuer-seal.

A vinculum is a bond/link. The booth scores whether a workspace file is **solitary** (readable) or **twinlinked** into Claude's upload cache (bridge-refused).

Primary:

- [anthropics/claude-code#93485](https://github.com/anthropics/claude-code/issues/93485) (OPEN, bug, has repro, platform:windows, area:cowork). Title: `[BUG] Cowork: local agent mode hardlinks workspace files into its session upload cache, and the cloud file bridge then refuses to read them (nlink > 1)`. Filed by GBalunis 2026-09-10. Claude Desktop **1.49585.0**. Local agent mode does **not** copy files into a session upload cache. It creates hard links from the user's workspace files into `%APPDATA%\Claude\local-agent-mode-sessions\<a>\<b>\local_<session>\uploads\<filename>`. Every local session that pulls a file in adds another link, and the links are never removed when the session ends. The cloud file bridge refuses to read any file with more than one hard link: `file is hardlinked (nlink > 1) — refused to avoid reading through a link alias; copy the file to break the link and retry`. So local mode manufactures exactly the condition that cloud mode is designed to reject. Now that Cowork sessions default to the cloud, files that were previously fine became unreadable with no action by the user and no change to the files themselves. Evidence: `fsutil hardlink list` (excluding `node_modules`, `.wrangler`, and `.git\objects`) found **20 workspace files carrying 52 alias entries**. Every alias pointed into `local-agent-mode-sessions\...\uploads\`. Representative: `[2 links] <workspace>\context\stack.md`. A skill file used by a recurring local scheduled task had reached **26 links**, one per run. Two others were at 8 and 3. Files touched by a single interactive session sat at 2. Sibling files at 1 link still read. Workaround: delete the alias entries under the Claude upload cache (safe: data survives while one link remains). Suggested (narrative only): copy rather than hard link; clean up the session upload cache when a session ends; let the bridge resolve Claude-owned links. Cousin cite-only: #50268 CLOSED — Cowork uploads use hard links (`fs.link`), locking source files even after the app closed. Related mechanism, different symptom (locking vs cloud refuse).

09:50 vinculum: a chain-forge / binder's vinculum bench for #93485. Idle **solitary** / seeded **twinlinked** / path **bridge-refuse**. Score vinculum or admit solitary.

Score vinculum or admit solitary.

Idle word: **solitary** (HOLD: nlink=1, no Claude-owned alias, cloud bridge accepts). Seeded word: **twinlinked** / #93485 (local agent mode hardlinked into upload cache, nlink>1). Path word: **bridge-refuse**. Product score: **vinculum**. Never idle hit / flattened / string-carrier / cachet / steady / strobing / off-label / strobe / matched / skewed / headers-hash / counterfoil / traced / pathless / image-cache / lucida / scrubbed / contaminated / fomite / gitignore / damped / spinning / mux / snubber / mounted / fossed / plan9 / fosse / warm / paged-out / majflt / hibernacle / sealed / mismatched / issuer / paraph / sterling / debased / hallmark / remanent / collimated / diopter / hysteresis / banked / ephemera.

Phrase: **when local agent mode hardlinks a workspace file into the session upload cache and the cloud file bridge refuses nlink > 1, score vinculum or admit solitary.**

- **solitary** = IDLE: HOLD; nlink=1, no Claude-owned alias, cloud bridge accepts
- **twinlinked** = #93485 seeded path: local agent mode hardlinked into upload cache, nlink>1
- **vinculum** = product score word for the bond local mode forged into the upload cache
- **bridge-refuse** = path word: cloud file bridge refuses nlink > 1
- **hold** = HOLD alias for idle solitary
- **nlink-one** = nlink=1 — solitary inode
- **nlink-rise** = nlink rises to 2 after one local session; skill file reached 26
- **hardlink** = local agent mode creates a hard link, not a copy, into the session upload cache
- **alias** = every alias pointed into `local-agent-mode-sessions/.../uploads/`
- **upload-cache** = `%APPDATA%\Claude\local-agent-mode-sessions\...\uploads\`
- **local-mode** = local agent mode Cowork session with a connected folder
- **cloud-bridge** = cloud file bridge refuses any file with nlink > 1
- **accumulate** = 20 files / 52 aliases; recurring task 26 links, one per run
- **session-end** = links are never removed when the session ends
- **write-through** = true hard links: a write to the cached alias writes through to the original
- **workaround** = delete alias entries under the Claude upload cache; data survives while one link remains
- **fsutil** = `fsutil hardlink list` found 20 workspace files carrying 52 alias entries
- **has-repro** = Claude Desktop 1.49585.0 · GBalunis · win32 x64 · Windows 11 25H2 · 20 files / 52 aliases
- **cousins** = cite-only #50268 — do not rebuild
- **backups** = cite-only #93458 #93482 #93475 #93439 #93438 #93466 — do not auto-pick
- **fixtures** = anvil / tongs / gauge / bridge table for the vinculum booth
- **walk** = published idle solitary → local-session → hardlink → nlink-rise → accumulate → cloud-default → bridge-refuse → sibling-ok → vinculum

Verdicts: solitary, twinlinked, vinculum, bridge-refuse, hold, nlink-one, nlink-rise, hardlink, alias, upload-cache, local-mode, cloud-bridge, accumulate, session-end, write-through, workaround, fsutil, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the bench is **twinlinked** / **vinculum** or already **solitary**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): local agent mode may call `fs.link` into the session upload cache instead of copying; cloud bridge then refuses nlink>1. Invite verify against #93485 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93485](https://github.com/anthropics/claude-code/issues/93485)
- Cite-only cousin: [anthropics/claude-code#50268](https://github.com/anthropics/claude-code/issues/50268) (CLOSED — Cowork uploads use hard links / `fs.link`, locking source files; related mechanism, different symptom; do not rebuild)
- Backup (data only): #93458 SessionStart hook additionalContext silently dropped when source=fork
- Backup (data only): #93482 device_commit_files one-commit lag with fresh mtime (data-loss)
- Backup (data only): #93475 Effort selector requires a very tall terminal
- Backup (data only): #93439 Read tool never triggers PreToolUse hooks for binary files
- Backup (data only): #93438 Agent dispatch isolation worktree cwd bleed
- Backup (data only): #93466 Desktop Directory → Plugins duplicate cards / no uninstall

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:cowork
- Claude Desktop **1.49585.0**; reporter GBalunis; win32 x64; Windows 11 25H2, OS Build 26200.9445
- Session type: Cowork **cloud** session linked to a desktop device
- Workspace: OneDrive-synced folder, 4,195 files
- Local agent mode does not copy; it hardlinks into `%APPDATA%\Claude\local-agent-mode-sessions\...\uploads\`
- Links accumulate and are never cleaned up when sessions end
- Cloud file bridge refuses nlink > 1
- 20 workspace files / 52 alias entries; skill file 26 links; others 8 and 3; interactive sessions 2
- Every alias pointed into `local-agent-mode-sessions\...\uploads\`
- Sibling files at nlink=1 still read
- Workaround: delete the alias entries (safe while one link remains)

Problem found: LOCAL AGENT MODE HARDLINKS WORKSPACE FILES INTO THE SESSION UPLOAD CACHE, AND THE CLOUD FILE BRIDGE THEN REFUSES NLINK > 1.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the workspace file stayed **solitary** or was **twinlinked**. Educational chain-forge / binder's bench for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Copy rather than hard link into the session upload cache (also removes the write-through hazard)
2. Clean up the session upload cache when a session ends, so links do not accumulate indefinitely
3. Let the bridge resolve the case where every link lives in a Claude-owned location
4. nlink=1 workspace files stay readable after Cowork sessions default to the cloud

## Why not a clone

This is specifically: **LOCAL AGENT MODE HARDLINKS WORKSPACE FILES INTO THE SESSION UPLOAD CACHE, AND THE CLOUD FILE BRIDGE THEN REFUSES NLINK > 1** — chain-forge / binder's vinculum bench, not wax-cachet blotter, not hangar strobe, not cheque counterfoil, not camera-lucida atelier.

**NOT Cachet/#93490** (Fable resume string-carrier bust). Different defect. NOT diplomatic wax-cachet blotter.

**NOT Strobe/#93468** (off-label ScheduleWakeup). Different defect. NOT hangar strobe-beacon.

**NOT Counterfoil/#93446** (add-json `--client-secret` headers-hash). Different defect. NOT cheque-counter / ticket-stub.

**NOT Lucida/#93429** (Desktop Code tab paste drops the image source path). Different defect. NOT camera-lucida / drafting plate.

**NOT Fomite/#93423.** **NOT Snubber/#93398.** **NOT Fosse/#93358.** **NOT Hibernacle/#93372.** **NOT Scapegoat/#93348.** **NOT Cartulary/#93331.** **NOT Paraph/#93327** (issuer-seal quotes). Different defect. NOT paraph issuer-seal.

**NOT Procrustes** (MCP tool cull / iron bed). Different defect. NOT an iron-bed schema cull. This booth is a binder's vinculum for hardlink nlink gauges.

**NOT Hallmark** (sterling/debased). **NOT Diopter / Hysteresis / Ephemera.** Those catalog paradigms are different mechanisms — this booth is specifically local-mode hardlink / cloud bridge-refuse.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **chain-forge vinculum — the workspace file should stay solitary (nlink=1, no Claude-owned alias) so the cloud file bridge accepts; instead local agent mode forges a hardlink into the upload cache and cloud mode refuses the same inode.**

Do NOT rename this product Cachet, Strobe, Counterfoil, Lucida, Fomite, Snubber, Fosse, Hibernacle, Scapegoat, Cartulary, Paraph, Hallmark, Diopter, Hysteresis, Ephemera, Procrustes, or any existing catalog slug.
Do NOT reuse idle solitary / twinlinked / bridge-refuse on a later booth.
Display here is **Libre Baskerville**. Body is **Karla**. Mono is **Source Code Pro**.

Different surface: local-mode hardlink / cloud bridge-refuse vs Fable resume string-carrier vs off-label ScheduleWakeup vs add-json headers-hash vs desktop image-cache omit.

Product name stays **Vinculum**. Name/slug `vinculum` unused in catalog.json (280 products before this ship; Cachet is #280).

Different UI: anvil / tongs / brass nlink gauge / linen binding cord / local vs cloud compare chip. Libre Baskerville / Karla / Source Code Pro. Dark forge field. NOT wax-cachet blotter. NOT hangar strobe. NOT cheque-counterfoil. NOT camera-lucida atelier. NOT sterile lab. NOT pulse-damper. NOT earthwork fosse.

Different verbs: Strike the vinculum, Score vinculum, Gauge the nlink, Compare local / cloud, Pin idle solitary, Pin seeded twinlinked, Pin bridge-refuse, Clear the forge.

Different idle: **solitary**. Different #93485 seeded path: **twinlinked**. HOLD: **solitary** / **hold**. ALARM: **twinlinked** / **vinculum** / **bridge-refuse** / **nlink-rise**. Path: **bridge-refuse**.

## How to score

```bash
node --test projects/vinculum/vinculum.test.mjs
node projects/vinculum/vinculum.mjs projects/vinculum/data/twinlinked.json
echo '{"seed":"twinlinked"}' | node projects/vinculum/vinculum.mjs
```

Open the living card at `projects/vinculum/index.html` (or the live path `/vinculum/`). Buttons: Strike the vinculum, Score vinculum, Gauge the nlink, Compare local / cloud, Pin idle solitary, Pin seeded twinlinked, Pin bridge-refuse, Clear the forge. Toggle local agent mode / hardlink into uploads / Claude-owned alias / cloud session / nlink > 1 / bridge refuse — the score flips. Lay a fixture JSON on the anvil. `?embed=1` hides chrome.

The booth reconstructs the reporter’s local-mode hardlink / nlink-rise / cloud bridge-refuse walk from the published #93485 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/vinculum/
- Folder: `projects/vinculum/`
