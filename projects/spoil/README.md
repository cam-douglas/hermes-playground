# Spoil

A **mining spoil-tip / assay-bank desk** — slag-grey pit, ochre heaps, coal-black, rust-orange, zinc-white chalk on a corrugated tin assay shed; Instrument Serif + Source Serif 4 + JetBrains Mono — for a real Claude Code defect: **concurrent sessions in one working tree using a private `GIT_INDEX_FILE` — a stale private index commit silently deletes paths another session added and reverts paths another session changed, with exit 0, no conflict, no prompt**.

Primary:

- [anthropics/claude-code#90943](https://github.com/anthropics/claude-code/issues/90943) (OPEN, has repro, filed 2026-08-31T09:46:58Z by capraCoder). Title: [BUG] Concurrent sessions in one working tree: a stale git index silently deletes and reverts another session's committed work. Labels: bug, has repro, platform:windows, area:core, data-loss. Claude Code **2.1.251**. Windows 11 (the git behaviour itself is platform-independent). Repro gist: https://gist.github.com/capraCoder/343fd4749b8b57b06e8a65d8163e0ec8 (git 2.54.0).

A spoiled index is not a hold. Score the spoil or admit **banked**.

Idle word: **banked**. Seeded state: **spoiled** / #90943 — one repo, one branch, two sessions; B seeds a private index and stages one file; A stages different paths and commits; B commits → A's adds arrive as deletions, A's mods revert. Never idle as "spoil" / "spoiled" / "stale" / "revert" / "delete" / "index" / "lag" / "concurrent" / "cotenant" / "banked-as-seed" / "trammel" / "hunting" / "traced" / "soundpost" / "flong" / "bulla" / "trompe" / "davy" / "moviola" / "clepsydra" / "dripping".

- **banked** = hold: index matches HEAD; spoil tip properly banked; commit would not delete living paths
- **spoiled** = #90943 primary — stale private `GIT_INDEX_FILE` deletes the other's adds and reverts the other's blobs; exit 0
- **stale-index** = private index predates another session's commit
- **private-index** = session set `GIT_INDEX_FILE`
- **cotenant** = two sessions (or a session plus scheduled automation) share one working tree
- **delete-add** = stale index lacks a path the other added → commit deletes it
- **revert-blob** = stale index holds the pre-commit blob → commit reverts the file to old content
- **silent-ok** = operation succeeds, exits 0, prints nothing
- **no-conflict** = no conflict, no prompt
- **shared-head** = one repo, one branch, one HEAD
- **worktree-immune** = linked worktree has own HEAD + own index
- **staged-deletion-exists** = staged deletion whose file still exists on disk (section 5); genuine deletion does not trip the guard (section 6)

Verdicts: spoiled, banked, stale-index, private-index, cotenant, delete-add, revert-blob, silent-ok, no-conflict, shared-head, worktree-immune, staged-deletion-exists.

## Why not a clone

This is specifically: **A STALE PRIVATE `GIT_INDEX_FILE` ON A SHARED HEAD SILENTLY DELETES THE OTHER SESSION'S ADDS AND REVERTS THE OTHER SESSION'S BLOBS**. The commit title looks like "add b.txt". The victim's `git status` shows ordinary modified + untracked.

NOT **Trammel** ([#90936](https://github.com/anthropics/claude-code/issues/90936)) — VS Code focus ping-pong.
NOT **Soundpost** ([#90926](https://github.com/anthropics/claude-code/issues/90926)) — CLI-resolved LSP vs Desktop-deaf.
NOT **Flong** ([#90916](https://github.com/anthropics/claude-code/issues/90916)) — torn Git Bash snapshot.
NOT **Bulla** ([#90891](https://github.com/anthropics/claude-code/issues/90891)) — MSIX integrity.
NOT **Trompe** ([#90881](https://github.com/anthropics/claude-code/issues/90881)) — phantom /clear.
NOT **Davy** ([#90886](https://github.com/anthropics/claude-code/issues/90886)) — false boot-canary.
NOT **Moviola** ([#90716](https://github.com/anthropics/claude-code/issues/90716)) — prefix-mutating image eviction.
NOT **Berth** / **Carrel**.
NOT **Clepsydra** / [#90930](https://github.com/anthropics/claude-code/issues/90930) — do not ship.

Different UI: mining spoil tip and corrugated tin assay shed. Slag-grey, ochre heaps, coal-black, rust-orange, zinc-white chalk. Instrument Serif + Source Serif 4 + JetBrains Mono. NOT Trammel mahogany / Prussian-blue / Newsreader. NOT Soundpost amber / maple / spruce / Fraunces. NOT Flong soot / iron. NOT Bulla papal lead.

Different verbs: bank the tip, pin idle banked, pin seeded spoiled, score the spoil, assay the index. Not "Score the grooves" / "Pin idle traced" / "Score the plates".

Different idle: **banked**.

## Live catalog path

`/spoil/` is this static assay desk. Demo works with no secrets and no npm. Mark: `19:50 / hermes catalog #93 / #90943`.

1. Idle demo loads **banked** — index matches HEAD; the spoil tip is properly banked.
2. Seed **spoiled** → #90943 ticket: private `GIT_INDEX_FILE`, stale vs new HEAD, cotenant sessions, D a.txt / A b.txt / M shared.txt (shared back to v1), exit 0.
3. Paste or edit an assay ticket JSON (`privateIndex`, `staleIndex`, `cotenantSessions`, `sharedHead`, `otherAddedMissing`, `otherChangedStale`, `silentExit0`, `noConflict`, `worktree`, `stagedDeletionExists`, `indexMatchesHead`).
4. **Score the spoil** walks the ticket and lights chips on the chalk rail.
5. Contrast: linked worktree has own HEAD+index → immune. **Bank the tip** moves session B onto that separate bank.
6. Evidence drawer with the GitHub issue links. Fetch #90943 without a token (idle copy is fine). **Assay the index** does that fetch.

## How to score

Open `projects/spoil/index.html` in a browser, or serve the repo root and visit `/spoil/` (Vercel rewrite → `/projects/spoil`). No build step. Optional hook:

```bash
node projects/spoil/hook/spoil.mjs projects/spoil/data/90943.json
node projects/spoil/hook/spoil.mjs projects/spoil/data/banked.json
node --test projects/spoil/hook/spoil.test.mjs
```

Spoiled seed → spoiled/alarm. Banked seed → banked/hold.

`projects/spoil/hook/spoil.mjs` classifies a ticket and returns `{ verdict, chips[], reasons[], hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90943.json`, `data/spoiled.json`, `data/banked.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/contrast.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#90943](https://github.com/anthropics/claude-code/issues/90943). Unauthenticated. See `.env.example`.
2. Paste/edit an assay ticket JSON and score.
3. Seed chips: banked / spoiled / stale-index / private-index / delete-add / revert-blob.
4. Contrast plate: linked worktree (immune) vs shared-HEAD private index.
5. Evidence drawer: #86304, #52051; cross openai/codex#28972.

## Sources

- [anthropics/claude-code#90943](https://github.com/anthropics/claude-code/issues/90943) OPEN
- Repro: [gist 343fd4749b8b57b06e8a65d8163e0ec8](https://gist.github.com/capraCoder/343fd4749b8b57b06e8a65d8163e0ec8)
- Same-class (cite, not primary): [#86304](https://github.com/anthropics/claude-code/issues/86304) — silent index destruction via `git stash`/`pop` inside one session (different mechanism); [#52051](https://github.com/anthropics/claude-code/issues/52051) closed not-planned — working-tree collisions, not this data loss.
- Cross-ecosystem: [openai/codex#28972](https://github.com/openai/codex/issues/28972) OPEN — Codex VS Code extension corrupted my index file.
- Contrast: linked worktree has own HEAD+index → immune.
