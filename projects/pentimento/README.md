# Pentimento

An **art-conservation / underpainting atelier booth** — gallery plaster, linseed umber, cobalt underpaint, varnish amber, charcoal stretcher. Fonts **Fraunces** (display) + **Source Sans 3** (body) + **IBM Plex Mono** (mono). Palette: plaster `#eadfcb`, umber `#6e4a28`, cobalt `#1e4d8c`, varnish `#c9841a`, charcoal `#2a241c` — light atelier field, not chain-forge iron/brass, not parchment wax blotter, hangar strobe, cheque desk, camera lucida, sterile lab, pulse-damper, earthwork fosse, hibernacle, or paraph issuer-seal.

A pentimento is older paint showing through a newer layer. Here the fresh varnish is the advanced mtime; the underpainting is the previous commit's bytes.

Primary:

- [anthropics/claude-code#93482](https://github.com/anthropics/claude-code/issues/93482) (OPEN, bug, has repro, platform:windows, area:cowork, data-loss). Title: `[BUG] Cowork: device_commit_files reports success on overwrites but the on-disk content lags exactly one commit behind (silent stale write, fresh mtime)`. Filed by GBalunis 2026-09-10. Claude Desktop **1.49585.0**. When a cloud Cowork session overwrites an existing file on the linked device, `device_commit_files` returns `{"written":[path],"rejected":[]}`, the file mtime advances to the call moment, but **on-disk content is the payload from the previous commit**. Committing the identical payload a second time lands it. Creating a **new** file is unaffected and correct every time. Only overwrites lag. Silent data-integrity failure: success response + lying fresh mtime; agents and humans think the write landed. Repro table (plain local folder `C:\Users\<USER>\Downloads`, not OneDrive): VERSION-A create OK (43 bytes) → VERSION-B overwrite keeps A (43 bytes) with new mtime → second B lands (82 bytes) → VERSION-C overwrite keeps B (82 bytes) with new mtime → wait 45s still B. Not a read cache (`device_list_dir` and `device_stage_files` agreed). Not OneDrive. Not KB5124008 (Plan9 shares broken; file bridge still working). Not `force` (identical with and without `force: true` / `expectedMtimeMs`). Workaround: commit the same payload twice, then verify content (not byte count / mtime). Claude Code Write/Edit path on the same machine is clean. Cousins cite-only: #83354 silent success on `device_stage_files` when dest exists; #79354 background shell stale overwrite; #38993 virtiofs truncated/stale files; #40175 Cowork global instructions silently revert.

10:50 pentimento: an art-conservation / underpainting atelier booth for #93482. Idle **flushed** / seeded **lagged** / path **one-behind**. Score pentimento or admit flushed.

Score pentimento or admit flushed.

Idle word: **flushed** (HOLD: overwrite landed; disk bytes == committed payload; mtime honest). Seeded word: **lagged** / #93482 (overwrite reported written + fresh mtime but disk still previous commit). Path word: **one-behind**. Product score: **pentimento**. Never idle solitary / twinlinked / bridge-refuse / vinculum / hit / flattened / string-carrier / cachet / steady / strobing / off-label / strobe / matched / skewed / headers-hash / counterfoil / traced / pathless / image-cache / lucida / scrubbed / contaminated / fomite / gitignore / damped / spinning / mux / snubber / mounted / fossed / plan9 / fosse / warm / paged-out / majflt / hibernacle / sealed / mismatched / issuer / paraph / sterling / debased / hallmark / remanent / collimated / diopter / hysteresis / banked / ephemera.

Phrase: **when device_commit_files reports overwrite success with a fresh mtime while on-disk content lags exactly one commit, score pentimento or admit flushed.**

- **flushed** = IDLE: HOLD; overwrite landed; disk bytes == committed payload; mtime honest
- **lagged** = #93482 seeded path: overwrite reported written + fresh mtime but disk still previous commit
- **pentimento** = product score word for the underpainting (stale bytes) showing through fresh varnish (mtime)
- **one-behind** = path word: exactly one commit behind on overwrite
- **hold** = HOLD alias for idle flushed
- **overwrite** = only overwrites lag; create is clean
- **create-ok** = new file VERSION-A (43 bytes) written, no rejections, disk is A
- **written-success** = `{"written":[path],"rejected":[]}`
- **rejected-empty** = no rejections — success indistinguishable from a real write
- **fresh-mtime** = mtime advances to the call moment
- **stale-bytes** = on-disk content is the payload from the previous commit
- **version-a** = create VERSION-A… 43 bytes
- **version-b** = overwrite VERSION-B… 82 bytes keeps A
- **version-c** = overwrite VERSION-C… 89 bytes keeps B
- **second-commit** = committing the identical payload a second time lands it
- **wait-45s** = wait 45 s, re-read, no intervening commit — still B
- **not-onedrive** = reproduced in Downloads, outside OneDrive entirely
- **not-read-cache** = `device_list_dir` and `device_stage_files` agreed at every step
- **not-force** = identical with and without `force: true` / `expectedMtimeMs`
- **workaround** = commit same payload twice, then verify content (not byte count / mtime)
- **write-edit-clean** = Claude Code Write/Edit path on the same machine is clean
- **has-repro** = Claude Desktop 1.49585.0 · GBalunis · win32 x64 · Windows 11 25H2 · Cowork cloud
- **cousins** = cite-only #83354 #79354 #38993 #40175 — do not rebuild
- **backups** = cite-only #93458 #93475 #93439 #93438 #93466 #93495 — do not auto-pick
- **fixtures** = stretcher / varnish / underpaint / tray table for the pentimento booth
- **walk** = published idle flushed → create-ok → overwrite-b → second-commit → overwrite-c → wait-45s → one-behind → pentimento

Verdicts: flushed, lagged, pentimento, one-behind, hold, overwrite, create-ok, written-success, rejected-empty, fresh-mtime, stale-bytes, version-a, version-b, version-c, second-commit, wait-45s, not-onedrive, not-read-cache, not-force, workaround, write-edit-clean, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the easel is **lagged** / **pentimento** or already **flushed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): commit path may buffer/stage and swap the previous payload on overwrite; metadata vs content may come from different sources. The off-by-one shape and the create case staying correct invite that reading. Invite verify against #93482 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93482](https://github.com/anthropics/claude-code/issues/93482)
- Cite-only cousin: [anthropics/claude-code#83354](https://github.com/anthropics/claude-code/issues/83354) (device_stage_files silently skips copy when destination exists; related silent success, different API; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#79354](https://github.com/anthropics/claude-code/issues/79354) (background shell stale overwrite; different surface; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#38993](https://github.com/anthropics/claude-code/issues/38993) (virtiofs truncated/stale files; different mount path; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#40175](https://github.com/anthropics/claude-code/issues/40175) (Cowork global instructions silently revert; different surface; do not rebuild)
- Backup (data only): #93458 SessionStart hook additionalContext silently dropped when source=fork
- Backup (data only): #93475 Effort selector requires a very tall terminal
- Backup (data only): #93439 Read tool never triggers PreToolUse hooks for binary files
- Backup (data only): #93438 Agent dispatch isolation worktree cwd bleed
- Backup (data only): #93466 Desktop Directory → Plugins duplicate cards / no uninstall
- Backup (data only): #93495 Desktop main-thread UNUserNotificationCenter XPC deadlock

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:cowork, data-loss
- Claude Desktop **1.49585.0**; reporter GBalunis; win32 x64; Electron 44.2.0 / Node 24.20.0; Windows 11 25H2, OS Build 26200.9445
- Session type: Cowork **cloud** session linked to a desktop device; model claude-opus-5
- Overwrite: `device_commit_files` returns written, no rejections; mtime advances; disk is the previous commit
- Create: new file is correct every time
- Second identical commit lands the payload
- Repro: VERSION-A 43 B create OK → VERSION-B 82 B overwrite keeps A → second B lands → VERSION-C 89 B overwrite keeps B → wait 45s still B
- Plain local folder, not OneDrive; not a read cache; not force; not KB5124008
- Workaround: commit twice, then verify content. Write/Edit path on the same machine is clean

Problem found: DEVICE_COMMIT_FILES REPORTS OVERWRITE SUCCESS WITH A FRESH MTIME WHILE ON-DISK CONTENT LAGS EXACTLY ONE COMMIT.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the canvas stayed **flushed** or was **lagged**. Educational art-conservation / underpainting atelier for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. After `device_commit_files` returns `written` with no rejections, the file on disk contains the committed payload
2. If the write cannot be completed, the call reports the path in `rejected` rather than returning success
3. mtime and on-disk bytes agree — a fresh timestamp is not a substitute for the committed pigment
4. Overwrite and create are both exact on the first commit; no one-behind lag

## Why not a clone

This is specifically: **DEVICE_COMMIT_FILES REPORTS OVERWRITE SUCCESS WITH A FRESH MTIME WHILE ON-DISK CONTENT LAGS EXACTLY ONE COMMIT** — art-conservation / underpainting atelier, not chain-forge vinculum, not wax-cachet blotter, not hangar strobe, not cheque counterfoil, not camera-lucida atelier.

**NOT Vinculum/#93485** (local-mode hardlink / cloud bridge-refuse). Different defect. NOT chain-forge / nlink gauges.

**NOT Cachet/#93490** (Fable resume string-carrier bust). Different defect. NOT diplomatic wax-cachet blotter.

**NOT Strobe/#93468** (off-label ScheduleWakeup). Different defect. NOT hangar strobe-beacon.

**NOT Counterfoil/#93446** (add-json `--client-secret` headers-hash). Different defect. NOT cheque-counter / ticket-stub.

**NOT Lucida/#93429** (Desktop Code tab paste drops the image source path). Different defect. NOT camera-lucida / drafting plate.

**NOT Fomite/#93423.** **NOT Snubber/#93398.** **NOT Fosse/#93358.** **NOT Hibernacle/#93372.** **NOT Scapegoat/#93348.** **NOT Cartulary/#93331.** **NOT Paraph/#93327** (issuer-seal quotes). Different defect. NOT paraph issuer-seal.

**NOT Procrustes** (MCP tool cull / iron bed). Different defect. NOT an iron-bed schema cull. This booth is a conservation atelier for mtime-vs-pigment gauges.

**NOT Hallmark** (sterling/debased). **NOT Diopter / Hysteresis / Ephemera.** Those catalog paradigms are different mechanisms — this booth is specifically overwrite one-behind / silent stale write.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **underpainting atelier — after device_commit_files reports overwrite success the canvas should stay flushed (disk bytes == committed payload, mtime honest); instead the fresh varnish (mtime) covers a one-behind underpainting (previous commit's bytes).**

Do NOT rename this product Vinculum, Cachet, Strobe, Counterfoil, Lucida, Fomite, Snubber, Fosse, Hibernacle, Scapegoat, Cartulary, Paraph, Hallmark, Diopter, Hysteresis, Ephemera, Procrustes, or any existing catalog slug.
Do NOT reuse idle flushed / lagged / one-behind on a later booth.
Display here is **Fraunces**. Body is **Source Sans 3**. Mono is **IBM Plex Mono**.

Different surface: overwrite one-behind / silent stale write vs local-mode hardlink / cloud bridge-refuse vs Fable resume string-carrier vs off-label ScheduleWakeup vs add-json headers-hash vs desktop image-cache omit.

Product name stays **Pentimento**. Name/slug `pentimento` unused in catalog.json (281 products before this ship; Vinculum is #281).

Different UI: stretcher bars / varnish tray / underpainting reveal / mtime vs pigment gauges. Fraunces / Source Sans 3 / IBM Plex Mono. Light atelier field. NOT chain-forge. NOT wax-cachet blotter. NOT hangar strobe. NOT cheque-counterfoil. NOT camera-lucida atelier. NOT sterile lab. NOT pulse-damper. NOT earthwork fosse.

Different verbs: Lift the varnish, Score pentimento, Rake the underpaint, Compare mtime / pigment, Pin idle flushed, Pin seeded lagged, Pin one-behind, Clear the easel.

Different idle: **flushed**. Different #93482 seeded path: **lagged**. HOLD: **flushed** / **hold**. ALARM: **lagged** / **pentimento** / **one-behind** / **stale-bytes**. Path: **one-behind**.

## How to score

```bash
node --test projects/pentimento/pentimento.test.mjs
node projects/pentimento/pentimento.mjs projects/pentimento/data/lagged.json
echo '{"seed":"lagged"}' | node projects/pentimento/pentimento.mjs
```

Open the living card at `projects/pentimento/index.html` (or the live path `/pentimento/`). Buttons: Lift the varnish, Score pentimento, Rake the underpaint, Compare mtime / pigment, Pin idle flushed, Pin seeded lagged, Pin one-behind, Clear the easel. Toggle overwrite / written success / rejected empty / fresh mtime / stale bytes / one-behind — the score flips. Lay a fixture JSON on the easel. `?embed=1` hides chrome.

The booth reconstructs the reporter’s overwrite / fresh-mtime / one-behind walk from the published #93482 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/pentimento/
- Folder: `projects/pentimento/`
