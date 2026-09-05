# Graft

An **orchard grafting bench / scion-stock / cambium desk** — bark browns, sap green, cambium cream, pruning-knife steel, soft daylight under leaf canopy — Literata + DM Sans + JetBrains Mono — for a real Claude Code defect: **PLUGIN CACHE: A NEW VERSION DIR INHERITS THE PREVIOUS ONE'S UNTRACKED FILES, REPLICATING THEM FOREVER.**

Primary:

- [anthropics/claude-code#92354](https://github.com/anthropics/claude-code/issues/92354) (OPEN, bug, has repro, platform:macos, area:plugins). Title: `Plugin cache: a new version dir inherits the previous one's untracked files, replicating them forever`. Filed 2026-09-05. Reporter: cameronsjo.

04:50 graft: a scion that carries the previous trunk's dead wood into every new stock is not a clean update — it is already grafted. Score the cambium or admit the cache already grafted.

Idle word: **cleared**. Seeded state: **grafted** / #92354 — new version dir inherits prior untracked tree. Never idle as released, pruned, sealed, waiting, standing, razed, once, doubled, stuck, missed, gated, spilled, hushed, blurted, lit, blanked, cold, voided, banked, rewritten, miskeyed, leaked, cued, discarded, frozen, adrift, or any prior catalog idle.

**Graft** is orchard work: a scion is supposed to take on a clean stock. Here the cache seeds each new version directory from the previous one before fetched content is overlaid. Untracked, gitignored, and session-written files — a one-time `npm install` `node_modules`, scratch, logs, even credentials — copy-forward forever. The cache stops being a cache and becomes an append-only accumulation.

- **cleared** = HOLD: new version dir is a clean scion (clean fetch, or only paths the plugin declares); no copy-forward dead wood
- **grafted** = #92354: new version dir seeded from previous before overlay; untracked tree replicates
- **copy-forward** = shipped populate: seed-from-previous then overlay fetch
- **clean-fetch** = expected: populate from a clean fetch; fetched content and nothing else
- **declare-only** = expected alternative: carry forward only paths the plugin declares
- **mtime-chain** = stray `node_modules` mtime equals the previous version dir mtime; nine of thirteen listed rows chain exactly
- **inode-copy** = copies are real, not hardlinks; distinct inodes; `st_nlink=1`
- **remote-clean** = plugin remote gitignores `node_modules`; absent from default branch; no hooks; no install scripts
- **pollution** = scratch / logs / credentials become permanent self-replicating accumulation
- **clean-populate** = remediation: do not seed the new dir from the previous dir

Verdicts: cleared, grafted, copy-forward, clean-fetch, declare-only, mtime-chain, inode-copy, remote-clean, pollution, clean-populate.

This is a diagnostic scoring desk. Not an exploit. No secrets. No live plugin cache. Score whether a new version scion would be cleared or already grafted. Fixtures use the issue's mtime-chain table and the published size balloon only.

Hypothesis only (NON-BINDING): the issue's own expected behavior — a new version directory contains the plugin's fetched content and nothing else; either populate it from a clean fetch, or carry forward only paths the plugin declares — is the encoded fix. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92354](https://github.com/anthropics/claude-code/issues/92354)

What happened (from the issue — do not invent):

- Environment: Claude Code 2.1.261, macOS 15 (arm64). Plugin installed from a marketplace entry with `source: { source: "url", url: "…git" }`.
- When a plugin updates, the new cache version directory appears to be seeded from the previous version directory before the fetched content is overlaid.
- Files that are not part of the plugin at all — untracked, gitignored, or written by a session — are carried into every subsequent version and never collected.
- One `npm install`, run once inside a plugin cache directory in August, had been replicated into 13 version directories by early September: **1.2 GB for a plugin whose actual content is ~100 MB.**
- Each version directory's stray `node_modules` carries the **previous version directory's** mtime. Nine of thirteen listed rows chain exactly.
- The copies are real, not hardlinks — distinct inodes, `st_nlink = 1` on both sides of a sampled pair. Inode numbers were not published.
- The plugin's own remote is clean: `node_modules` is gitignored, untracked, and absent from the default branch (checked via the contents API). The plugin declares no hooks and no install scripts. Nothing about the plugin explains the directory's presence — only the copy-forward does.
- Anything ever written into a plugin cache directory becomes permanent and self-replicating. A scratch artifact, a log, a credential a session wrote while debugging, propagates into every future version and survives updates that were expected to replace the tree. The cache stops being a cache and becomes an append-only accumulation, and nothing surfaces it.
- Expected: a new version directory contains the plugin's fetched content and nothing else. Either populate it from a clean fetch, or carry forward only paths the plugin declares.

Mtime-chain rows from the issue (year 2026; four unlisted hashes not invented):

| dir | dir mtime | node_modules mtime | prior |
|---|---|---|---|
| `0ad050c57d55` | 09-03 21:03 | 09-03 20:12 | `9293c4174301` |
| `9293c4174301` | 09-03 20:12 | 09-02 19:50 | — |
| `18305c8e2988` | 09-02 20:24 | 09-02 10:50 | `afa75660303d` |
| `afa75660303d` | 09-02 10:50 | 09-01 16:24 | `8da88c0b75c8` |
| `8da88c0b75c8` | 09-01 16:24 | 09-01 15:52 | — |
| `dcf0e39243ff` | 09-01 16:21 | 08-29 15:15 | `55e352c658c7` |
| `55e352c658c7` | 08-29 15:15 | 08-28 08:55 | `cdd94257f637` |
| `cdd94257f637` | 08-28 08:55 | 08-25 18:59 | `b1659cee6616` (19:12) |
| `b1659cee6616` | 08-25 19:12 | 08-23 16:06 | `1699ab277632` |

Suggested fix from the issue (document only): populate from a clean fetch, or carry forward only paths the plugin declares. Do not seed a new version directory from the previous version's untracked tree.

## Why not a clone

This is specifically: **plugin-cache copy-forward / scion-stock inheritance of untracked files.**

NOT Jetsam ([#92338](https://github.com/anthropics/claude-code/issues/92338)) — stale tracking-ref Stop hook after a squash-merged PR whose branch was auto-deleted. Graft is not a teak quay.
NOT Sostenuto ([#92360](https://github.com/anthropics/claude-code/issues/92360)) — hold-to-talk CoreAudio main-thread freeze. Graft is not an ebony piano.
NOT Priory ([#92345](https://github.com/anthropics/claude-code/issues/92345)) — stray `priconfig.xml` in the shipped MSIX root. Graft is not a limestone cloister.
NOT Latchkey ([#92330](https://github.com/anthropics/claude-code/issues/92330)) — Remote Control auto-start false `/login` while refreshToken still renewable. Graft is not an oak latchkey board.
NOT Stubble ([#92328](https://github.com/anthropics/claude-code/issues/92328)) — Write UTF-8 LF `.cmd` + CP932 empty del / CWD wipe. Graft is not a stubble field.
NOT Intake ([#92305](https://github.com/anthropics/claude-code/issues/92305)) — piped stdin double-composition. Graft is not an intake pipe.
NOT Kindling — WarmLifecycle. Graft is not kindling.
NOT Clew — sandbox E2BIG. Graft is not a clew.
NOT Limpet / Scion — different paradigms. Graft is orchard grafting / cambium, not those desks.

Different surface: plugin-cache version-dir inheritance vs Stop-hook tracking-ref vs CoreAudio hold vs MSIX packaging leak vs OAuth startup-guard vs Write `.cmd` OEM wipe vs piped-stdin token double-count vs WarmLifecycle vs sandbox E2BIG vs Limpet/Scion.

Cousins cite-only (NOT primary):

- [#15642](https://github.com/anthropics/claude-code/issues/15642) — closed: `CLAUDE_PLUGIN_ROOT` points to stale version after update
- [#14061](https://github.com/anthropics/claude-code/issues/14061) — `/plugin update` does not invalidate cache
- [#69020](https://github.com/anthropics/claude-code/issues/69020) — Cowork installs stale cached plugin
- [#80042](https://github.com/anthropics/claude-code/issues/80042) — duplicate SHA-named dirs when `~/.claude` is a git repo
- [#75094](https://github.com/anthropics/claude-code/issues/75094) — undeclared version caches under `unknown`
- [#90781](https://github.com/anthropics/claude-code/issues/90781) — `temp_git_*` staging dirs survive install

Backups (document only, do not auto-switch unless slug `graft` collides): [#92347](https://github.com/anthropics/claude-code/issues/92347) Elision (Summarize-up-to-here drops prior summaries); [#92365](https://github.com/anthropics/claude-code/issues/92365) non-string sandbox deny silently disables permissions; [#92353](https://github.com/anthropics/claude-code/issues/92353) UserPromptSubmit never fires Git Bash.

Product name stays **Graft**. Do not rename to Jetsam, Sostenuto, Priory, Latchkey, Stubble, Intake, Kindling, Clew, Limpet, Scion, or any existing catalog slug.

Different UI: orchard grafting bench / bark + sap + cambium cream + pruning-knife steel / leaf-canopy daylight. Literata + DM Sans + JetBrains Mono. NOT Fraunces / Outfit (Sostenuto). NOT Instrument Serif / Manrope (Jetsam). NOT Cormorant Garamond (Latchkey). Stay OFF ebony piano / teak quay / limestone cloister / oak latch / stubble field / intake pipe.

Different verbs: Score the cambium, pin idle cleared, pin seeded grafted, admit the cache already grafted, load fixtures, reset to cleared.

Different idle: **cleared**. Different seeded: **grafted**.

## Live catalog path

`/graft/` is this static grafting-bench scoring desk. Path `https://hermes-playground-green.vercel.app/graft/` and subdomain `https://graft.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `04:50 / hermes catalog #164 / #92354`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **grafted** — seed-from-previous; 13 version dirs; 1.2 GB; mtime-chain; distinct inodes.
2. Idle **cleared** → clean fetch (or declare-only carry); no dead wood; idle word cleared.
3. Desk UI: orchard canopy, grafting bench, version-dir stocks, cambium tape, pruning knife, size balloon, mtime-chain table, shipped / clean-fetch / declare-only paths. Grafted = dead wood flowing stock-to-scion. Cleared = clean whip, waxed union, no knots.
4. Stay-off strip: Jetsam / Sostenuto / Priory / Latchkey / Stubble / Intake / Kindling / Clew / Limpet / Scion. Primary stays #92354.
5. **Score the cambium** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Bench simulator chips rewrite populate mode (seed-from-previous / clean-fetch / declare-only) and whether previous dead wood exists.

## How to score

Open `projects/graft/index.html` in a browser, or serve the repo root and visit `/graft/` (Vercel rewrite → `/projects/graft`). No build step.

```bash
# No live plugin cache. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **cleared** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **grafted**.
