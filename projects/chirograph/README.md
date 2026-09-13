# Chirograph

A **medieval chirograph / bipartite indenture / wavy-cut charter-desk / scriptorium lectern booth** — two matching parchment moieties, wax seal, gall ink, oak lectern, chalk margin rules. Fonts **Cormorant Garamond** (display) + **Figtree** (body) + **IBM Plex Mono** (chips). Palette: parchment cream `#E8D7B0`, gall-ink black `#14110C`, wax-seal crimson `#A11F38`, oxidized copper `#3A6A52`, oak lectern brown `#6A3D18`, chalk `#F0E4C8`, margin rule `#B8A47A`, ink `#1B140E`. Fresh trio. NOT Titulus/#94025. NOT Derelict/#93996. NOT Vestry/#94008. NOT Mondegreen/#93193. NOT Monadnock. NOT Escheat. NOT Midden. NOT Entresol / Deadletter / Gland. NOT Surfeit/#94012. NOT Phosphene/#94003. Completely different UI/UX/metaphor. This is specifically: **RECORDED BRANCH NEVER REFRESHED AFTER `git branch -m` → RECYCLE RECOVERY INVALID-REF → FALLBACK TO MAIN REPO → UNCOMMITTED LOSS + FALSE REASSURANCE BRANCH.**

The indenture should stay **matched** (HOLD: bipartite / moiety / indenture / current). Instead the booth was **chirograph** after a **worktree-rename-stale**.

Primary:

- [anthropics/claude-code#94045](https://github.com/anthropics/claude-code/issues/94045) (OPEN). Title: `Worktree branch rename is never seen by the harness, and recovery then drops the session into the main repo`. Labels: bug, has repro, platform:macos, data-loss. Desktop Claude Code creates a per-session git worktree and records the branch it created it on. If that branch is renamed inside the worktree with `git branch -m`, the recorded name is never updated. When the worktree is later recycled or removed, recovery runs `git worktree add <path> <recorded branch>`, which fails (`fatal: invalid reference`). The session falls back to the shared main repository. The notice claims commits on `claude/<slug>` are safe, but that branch no longer exists, and uncommitted files weren't carried over. Log: `git worktree add --no-checkout .../sweet-herschel-c84baa claude/dev-28493-25a631` → `fatal: invalid reference`; `[CCD] Pool re-lease and fresh-create both failed`; falling back to origin repo. Reflog: renamed `claude/dev-28493-25a631` to `dev-28493-fold-messenger-uis-version-file-into-the-vite-build-and`. 45 fallbacks on one machine. Claude Code desktop 2.1.269, macOS 15. Cousins cite-only: #54653 (closed feature rename), #53061 (UI View PR sticks to original branch), #85114 (worktree dir/branch diverge), #85195 (status bar disappears after branch rename). Backups cite-only (next focus only — do not auto-pick): #93987 #93924 #94032 #94029 #94031 #93770 #93777 #94040. Stay off Titulus/Derelict/Vestry/Mondegreen/Monadnock/Escheat/Midden/Entresol/Surfeit/Phosphene paradigms.

05:50 chirograph: a medieval chirograph / bipartite-indenture booth for #94045. Desktop records the worktree branch at create and never refreshes after git branch -m; recycle recovery invalid-ref falls back to the main repo; uncommitted work is lost and the notice names a branch that no longer exists. Idle **matched** / seeded **chirograph** / path **worktree-rename-stale**. Score chirograph or admit matched.

Score chirograph or admit matched.

Idle word: **matched** (HOLD: bipartite / moiety). HOLD aliases: matched, bipartite, moiety, indenture, current. Seeded word: **chirograph** / #94045 (the worktree-rename-stale path). Path word: **worktree-rename-stale**. Product score: **chirograph**. Never idle inscribed / titulus / resume-stale-title / plaque / latest-wins / synced / pegged / tempered / quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / solvent / frugal / berthed or seeded titulus / derelict / vestry / surfeit / phosphene / parablepsis / demesne / cartouche / attaint / oriel / mondegreen / monadnock / escheat / midden / mount-refcount-race / quota-spawn-cascade / layer-tree-walk / latin1-edit-wipe / home-bind-overreach / session-kill-orphan.

Phrase: **Score chirograph or admit matched.**

- **matched** = IDLE: HOLD; chirograph moieties still correspond; recorded branch == live branch; reclaim succeeds; uncommitted work preserved
- **chirograph** = #94045 seeded path and product score: recorded moiety stale after `git branch -m`; reclaim invalid-ref; fallback to main
- **worktree-rename-stale** = path word: recycle recovery runs `git worktree add` against the stale recorded name
- **hold** = HOLD alias for idle matched
- **bipartite** = HOLD alias: both moieties of the indenture still correspond
- **moiety** = HOLD alias: recorded half matches the live half
- **indenture** = HOLD alias: wavy-cut charter still one deed
- **current** = HOLD alias: recorded branch is current with the live worktree
- **recorded-branch** = recorded name stays at worktree-create (`claude/dev-28493-25a631`)
- **branch-m** = inside the worktree, `git branch -m` cuts a new live name
- **invalid-reference** = `git worktree add` dies `fatal: invalid reference`
- **pool-re-lease-failed** = `[CCD] Pool re-lease and fresh-create both failed`
- **fallback-main-repo** = session falls back to the shared main checkout
- **uncommitted-lost** = uncommitted files weren't carried over
- **false-reassurance** = notice names `claude/<slug>` which no longer exists
- **landing** = oak lectern landing / parchment blotter
- **has-repro** = published shape: 2.1.269 / `git branch -m` / invalid reference / 45 fallbacks
- **cousins** = cite-only #54653 #53061 #85114 #85195 — do not conflate
- **backups** = cite-only #93987 #93924 #94032 #94029 #94031 #93770 #93777 #94040 — do not auto-pick
- **fixtures** = parchment / gall / wax / copper / oak / chalk / rule / ink
- **walk** = published idle matched → worktree-rename-stale → chirograph

Verdicts: matched, chirograph, worktree-rename-stale, hold, bipartite, moiety, indenture, current, recorded-branch, branch-m, invalid-reference, pool-re-lease-failed, fallback-main-repo, uncommitted-lost, false-reassurance, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **chirograph** or already **matched**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): session/harness caches the branch name at worktree create and never observes `git branch -m` / never refreshes the recorded name before `git worktree add`. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94045](https://github.com/anthropics/claude-code/issues/94045)
- Cousins: #54653 cite-only (closed feature request for mid-session worktree branch rename). #53061 cite-only (UI View PR sticks to original branch). #85114 cite-only (worktree dir/branch diverge). #85195 cite-only (status bar disappears after branch rename). Adjacent only. Different defects. Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #93987, #93924, #94032, #94029, #94031, #93770, #93777, #94040

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, data-loss
- Claude Code desktop 2.1.269, macOS 15 (Darwin 24.5.0)
- Desktop creates a per-session worktree and records the branch it created it on
- `git branch -m` inside the worktree never updates the recorded name
- Recycle/remove recovery runs `git worktree add <path> <recorded branch>`
- Fails: `fatal: invalid reference: claude/dev-28493-25a631`
- `[CCD] Pool re-lease and fresh-create both failed for session local_b9c668a3…`
- Session falls back to the shared main repository
- Notice claims commits on `claude/<slug>` are safe; that branch no longer exists
- Uncommitted files weren't carried over
- Reflog: renamed `claude/dev-28493-25a631` to `dev-28493-fold-messenger-uis-version-file-into-the-vite-build-and`
- 45 of these fallbacks appear across retained logs on one machine
- Expected (scoring narrative only): rename must refresh the recorded branch; reclaim must not drop into the shared main checkout; the notice must not name a dead branch

Problem found: RECORDED BRANCH NEVER REFRESHED AFTER `git branch -m` → RECYCLE RECOVERY INVALID-REF → FALLBACK TO MAIN REPO → UNCOMMITTED LOSS + FALSE REASSURANCE BRANCH.

Why Chirograph: a medieval chirograph is a bipartite indenture — one charter cut with a wavy line so the two moieties must still correspond. Here the harness keeps one moiety (the recorded `claude/<slug>`) while `git branch -m` recuts the live moiety; when the worktree is reclaimed the halves no longer match, recovery fails, and the session is dropped onto the shared main desk. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: living catalog page + node diagnostic encoding idle **matched** / seeded **chirograph** / path **worktree-rename-stale** so operators can score whether the booth is **chirograph** or already **matched**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A rename made with `git branch -m` inside the worktree should update the recorded branch
2. Recovery must not run `git worktree add` against a stale recorded name
3. `fatal: invalid reference` must not drop the session into the shared main repository
4. Uncommitted files must be carried over, or the session must stop and let the user decide
5. The fallback notice must not name a branch that no longer exists

## Why not a clone

This is specifically: **RECORDED BRANCH NEVER REFRESHED AFTER `git branch -m` → RECYCLE RECOVERY INVALID-REF → FALLBACK TO MAIN REPO → UNCOMMITTED LOSS + FALSE REASSURANCE BRANCH.**

Novel paradigm: medieval chirograph / bipartite indenture / wavy-cut charter desk / scriptorium lectern / two parchment moieties / wax seal / gall ink — parchment cream, gall, wax, copper, oak, chalk. New issue, new paradigm (worktree-rename-stale), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Titulus/#94025** (iOS rename vs desktop sidebar / resume-stale-title). Different defect. NOT Roman marble plaque. Do not reuse inscribed / titulus / resume-stale-title.

**NOT Derelict/#93996** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict / session-kill-orphan.

**NOT Vestry/#94008** (Linux bwrap placeholder mount cleanup is per-process). Different defect. NOT liturgical sacristy / peg-rail. Do not reuse pegged / vestry / mount-refcount-race.

**NOT Mondegreen/#93193** (worktree Bash false-block on substring git). Different worktree defect. Do not reuse mondegreen.

**NOT Monadnock** (submodule worktree branches from stale local main). Different stale-ref family. Do not reuse monadnock.

**NOT Escheat** (worktree lock not released on session end). Different lifecycle. Do not reuse escheat.

**NOT Midden** (WorktreePool partial-remove remound). Different GC path. Do not reuse midden.

**NOT Entresol / Deadletter / Gland / Titulus/#94025** (resume-stale-title across iOS/desktop). Title cache, not recorded worktree branch.

**NOT Surfeit/#94012** (workflow keeps spawning after terminal session-limit). Different defect. Do not reuse tempered / surfeit / quota-spawn-cascade.

**NOT Phosphene/#94003** (WindowServer CA layer-tree thrash while streaming). Different defect. Do not reuse quiescent / phosphene / layer-tree-walk.

**NOT Parablepsis** (Edit/Write UTF-8-decode of Latin-1 PHP). Different defect.

**NOT Demesne/#93989** (bwrap binds entire `/home` instead of `$HOME`). Different defect.

**NOT Cartouche** (ask-for-diagram defaults to a section-summary poster). Different defect.

**NOT Attaint** (cyber-safeguard false-positive). Different defect.

**NOT Oriel** (macOS Desktop pop-out/maximised plan window does not reflow). Different defect.

**NOT Diplopia / Fulcrum** (title-adjacent cousins of Titulus). Different defects.

Do NOT rename Chirograph to any existing catalog slug. Catalog currently has 345 products; Chirograph is #346 after Titulus #345.
Do NOT reuse idle inscribed / titulus / resume-stale-title / plaque / latest-wins / synced / pegged / tempered / quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / solvent / frugal / berthed or seeded titulus / derelict / vestry / surfeit / phosphene / parablepsis / demesne / cartouche / attaint / oriel / mondegreen / monadnock / escheat / midden / mount-refcount-race / quota-spawn-cascade / layer-tree-walk / latin1-edit-wipe / home-bind-overreach / session-kill-orphan.

Display here is **Cormorant Garamond**. Body is **Figtree**. Mono is **IBM Plex Mono**.

Different surface: worktree-rename-stale (recorded branch never refreshed after `git branch -m`; recycle recovery invalid-ref; fallback to main) vs resume-stale-title vs session-kill-orphan vs mount-refcount-race.

Different UI: parchment cream / gall ink / wax-seal crimson / oxidized copper / oak lectern / chalk margin rules / wavy indenture cut / two moieties. Cormorant Garamond / Figtree / IBM Plex Mono.

Different verbs: Admit matched, Score chirograph, Walk worktree-rename-stale, Compare matched / chirograph, Pin idle matched, Pin seeded chirograph, Pin worktree-rename-stale, Seal the moieties.

Different idle: **matched**. Different #94045 seeded path: **chirograph**. HOLD: **matched** / **hold**. ALARM: **chirograph** / **worktree-rename-stale** / **recorded-branch** / **invalid-reference**. Path: **worktree-rename-stale**.

## How to score

```bash
node --test projects/chirograph/chirograph.test.mjs
node projects/chirograph/chirograph.mjs projects/chirograph/data/chirograph.json
echo '{"seed":"chirograph"}' | node projects/chirograph/chirograph.mjs
```

Open the living card at `projects/chirograph/index.html` (or the live path `/chirograph/`). Buttons: Admit matched, Score chirograph, Walk worktree-rename-stale, Compare matched / chirograph, Pin idle matched, Pin seeded chirograph, Pin worktree-rename-stale, Seal the moieties, Score booth. Toggle chips for: worktree-rename-stale, recorded-branch, branch-m, invalid-reference — the score flips. Lay a fixture JSON on the parchment blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s `git branch -m` / stale recorded name / invalid-reference / pool re-lease / fallback-to-main walk from the published #94045 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/chirograph/
- Folder: `projects/chirograph/`
