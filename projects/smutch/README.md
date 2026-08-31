# Smutch

A **binder’s smutch bench** — blotter paper, ink pads, folder cards, Icon\r specimen plaques; Fraunces + DM Sans + IBM Plex Mono — for a real Claude Desktop defect: **since the ~2026-08-27 update (app 1.40609.0, engine 2.1.247), a background process continuously stamps a custom folder icon across working directories of registered sessions**. Classic `Icon\r`: **0-byte data fork**, `com.apple.FinderInfo` (32 bytes) + `com.apple.ResourceFork` (**163,057 bytes**, identical everywhere, `icns` at offset 260). Sets `kHasCustomIcon` (`0x04` at byte 8) on the folder. The stamped image is always the **stock macOS home-folder icon** (blue folder + person silhouette) — as if `NSWorkspace.icon(forFile: NSHomeDirectory())` were written back via `setIcon:forFile:options:` onto every visited folder. Scale: **~20,000 Icon\r files in 3 days** (2026-08-28 15:44 → 2026-08-31 09:35), crawling day and night including `.git/objects/*`, `.git/refs/`, Python `.venv` trees, `.app` bundles in `~/Downloads`. Attribution: every affected folder shares Claude Desktop's `com.apple.provenance` key; geography only trees where Claude sessions work; timing coincides to the second with `LocalSessions` refresh / `getPrChecks` in main.log. Impact: `fatal: bad object refs/Icon` breaks git fetch/worktree; 3,689 files in venvs; PDF nightly fail with `no FontName found ... /fonts//standard/Icon`.

Primary:

- [anthropics/claude-code#90993](https://github.com/anthropics/claude-code/issues/90993) (OPEN, bug, has-repro, platform:macos, area:desktop, filed 2026-08-31T13:40:42Z by gme1204). Title: [BUG] macOS desktop app stamps custom folder icons (0-byte Icon\r files) on thousands of folders — breaks git fetch and Python venvs.

A home-folder Icon\r on every crate is not a hold. Score the smutches or admit **plain**.

Idle word: **plain**. Seeded state: **smutched** / #90993 — the blotter is stained with the same home-folder Icon\r on every crate the crawl touches. Never idle as "smutch" / "smutched" / "icon" / "stamp" / "provenance" / "crawl" / "bitting" / "seated" / "bound" / "hallmarked" / "pointed" / "collapsed" / "spoiled" / "banked" / "misstruck" / "hunting" / "traced".

A **smutch** is a dirty mark or stain. The desktop crawls and smutches every folder it touches with the same home-folder Icon\r. An unmarked folder is not a hold until you score the smutches or admit **plain**.

- **plain** = hold: folder unmarked; no Icon\r; FinderInfo clean
- **smutched** = #90993 primary — home-folder Icon\r stamped; crawl walking
- **icon-r** = classic `Icon\r` in the folder
- **zero-byte** = 0-byte data fork
- **resource-fork** = `com.apple.ResourceFork` 163,057 bytes
- **finderinfo** = `com.apple.FinderInfo` 32 bytes
- **khas-custom-icon** = `kHasCustomIcon` (`0x04` at byte 8)
- **home-icon** = stock macOS home-folder icon (blue folder + person silhouette)
- **provenance-key** = Claude Desktop `com.apple.provenance` key `01 02 00 52 3B A0 18 62 9D 1B 4C`
- **git-refs-poison** = `fatal: bad object refs/Icon`
- **venv-poison** = 3,689 files in Python `.venv` trees
- **local-sessions-crawl** = timing coincides with `LocalSessions` / `getPrChecks`
- **icns-identical** = `icns` at offset 260, identical everywhere
- **continuous-crawl** = ~20,000 Icon\r files, 2026-08-28 15:44 → 2026-08-31 09:35

Verdicts: smutched, plain, icon-r, zero-byte, resource-fork, finderinfo, khas-custom-icon, home-icon, provenance-key, git-refs-poison, venv-poison, local-sessions-crawl, icns-identical, continuous-crawl.

Overlapping proof from the issue: every affected folder shares Claude Desktop's `com.apple.provenance` key; geography only trees where Claude sessions work; timing coincides to the second with `LocalSessions` refresh / `getPrChecks` in main.log. The resource fork is 163,057 bytes and identical everywhere.

## Why not a clone

This is specifically: **DESKTOP BACKGROUND CRAWL + Icon\r RESOURCE-FORK STAMP + HOME-FOLDER ICNS + PROVENANCE ATTRIBUTION + GIT REFS/VENV POISON**.

NOT **Bitting** ([#90970](https://github.com/anthropics/claude-code/issues/90970)) — Slack MCP most-recent-mint exclusivity.
NOT **Puncheon** ([#90962](https://github.com/anthropics/claude-code/issues/90962)) — Write-tool BOM-less `.ps1`.
NOT **Gnomon** ([#90954](https://github.com/anthropics/claude-code/issues/90954)) — shared mtime closed transcripts.
NOT **Spoil** ([#90943](https://github.com/anthropics/claude-code/issues/90943)) — stale private `GIT_INDEX_FILE`.
NOT **Bulla** ([#90891](https://github.com/anthropics/claude-code/issues/90891)) — MSIX integrity crash.
NOT **Carcase** ([#90867](https://github.com/anthropics/claude-code/issues/90867)) — stealth relaunch.
NOT **Hydra** ([#90856](https://github.com/anthropics/claude-code/issues/90856)) — marketplace re-clone.

Different UI: binder / printshop smutch bench. Blotter cream #f4efe4, ink #1a1410, stamp indigo #2a3a6a, stain umber #6b3a1e, brass clip #b89a5a. Fraunces + DM Sans + IBM Plex Mono. NOT Bitting Libre Bodoni / Figtree / JetBrains felt-green. NOT Puncheon Cinzel / Outfit / Spline Sans Mono walnut/gold/oxblood. NOT Gnomon Libre Baskerville / IBM Plex Sans / Space Mono slate/brass. NOT Spoil Instrument Serif / Source Serif 4 slag/ochre.

Different verbs: score the smutch, pin idle plain, pin seeded smutched, admit plain. Not "Score the bitting" / "Pin idle seated" / "Score the gold" / "Score the gnomon" / "Score the spoil" / "Score the grooves".

Different idle: **plain**.

## Live catalog path

`/smutch/` is this static binder bench. Demo works with no secrets and no npm. Mark: `23:50 / hermes catalog #97 / #90993`.

1. Idle demo loads **plain** — folder unmarked; no Icon\r; FinderInfo clean.
2. Seed **smutched** → #90993 ticket: ~20,000 Icon\r files, home-folder icns, provenance key, git-refs poison, venv poison.
3. Crawl map of crates: `.git/objects/*`, `.git/refs/`, `.venv`, `~/Downloads/*.app`, `fonts/standard`.
4. Icon\r specimen plaque: 0-byte data fork + 163,057-byte ResourceFork, `icns` at offset 260.
5. Provenance plaque: `01 02 00 52 3B A0 18 62 9D 1B 4C`.
6. Git-refs poison demo: `fatal: bad object refs/Icon`.
7. Venv poison plaque: 3,689 files.
8. **Score the smutch** walks the ticket and lights chips on the brass rail.

## How to score

Open `projects/smutch/index.html` in a browser, or serve the repo root and visit `/smutch/` (Vercel rewrite → `/projects/smutch`). No build step. Optional hook:

```bash
node projects/smutch/hook/smutch.mjs projects/smutch/data/90993.json
node projects/smutch/hook/smutch.mjs projects/smutch/data/plain.json
node --test projects/smutch/hook/smutch.test.mjs
```

Smutched seed → smutched/alarm. Plain seed → plain/hold.

`projects/smutch/hook/smutch.mjs` classifies a ticket and returns `{ verdict, chips[], reasons[], hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90993.json`, `data/smutched.json`, `data/plain.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`. Evidence only from issue facts. 20,000 is a count, not a list of invented session IDs.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#90993](https://github.com/anthropics/claude-code/issues/90993). Unauthenticated. See `.env.example`.
2. Crawl map of folder crates; stamp / wipe the blotter.
3. Pin idle plain / pin seeded smutched / score the smutch / admit plain.
4. Icon\r specimen (0-byte data fork + 163,057-byte resource fork).
5. Provenance plaque (`01 02 00 52 3B A0 18 62 9D 1B 4C`).
6. Git-refs poison demo and venv poison plaque.

## Sources

- [anthropics/claude-code#90993](https://github.com/anthropics/claude-code/issues/90993) OPEN
- Same-class (cite, not primary): [#90996](https://github.com/anthropics/claude-code/issues/90996) — duplicate of the same bug.
- History only: isolated bursts 2026-05-11, 2026-07-27 mentioned in the issue.
