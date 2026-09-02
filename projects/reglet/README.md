# Reglet

A **letterpress line-spacing strip / galley** atelier — thin spacing-strip plaque, empty-index stageCheckout dial, `.gitattributes` missing-from-stage-1 fault lamp, CRLF vs LF eol split (`.claude/**` bled / tree LF), autocrlf Windows default callout, prettier-check vs git-status-clean paradox; warm ink / cream paper / brass rule — EB Garamond + Hanken Grotesk + Noto Sans Mono — for a real Claude Code defect: **DESKTOP WINDOWS STAGED WORKTREE CHECKOUT BEFORE .GITATTRIBUTES IS IN THE INDEX → .claude/** AND CLAUDE.md GET CRLF UNDER core.autocrlf=true; PRETTIER FAILS WHILE GIT STATUS CLEAN; CLI WORKTREES STAY LF; PLAIN-GIT REPRO; AREA:DESKTOP.**

Primary:

- [anthropics/claude-code#91443](https://github.com/anthropics/claude-code/issues/91443) (OPEN, bug, has repro, platform:windows, area:desktop, filed 2026-09-02T09:12:57Z, updated 2026-09-02T09:13:58Z, 0 comments). Title: [BUG] Desktop: staged worktree checkout runs before .gitattributes is in the index, so .claude/** and CLAUDE.md get CRLF on Windows (core.autocrlf=true). Reporter mortenklungland-ai.

a reglet that seats type before the attributes rule is not spacing — it is bleed. Score the strip or admit the CRLF already set.

Idle word: **creased**. Seeded state: **bled** / #91443 — CRLF bleed into `.claude/**` + `CLAUDE.md` from empty-index stageCheckout under autocrlf. Never idle as latched / vanished / sealed / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

A **reglet** is the thin spacing strip that should seat **LF** line-ending rules (`.gitattributes`) before any agent-file type is set. Desktop `createWorktree` → `stageCheckout` runs a selective checkout of `.claude/**` and `CLAUDE.md` while the worktree **index is still empty** (after `git worktree add --no-checkout`), so git never sees attributes. With Windows default `core.autocrlf=true`, those paths are written **CRLF**. The later full checkout uses `:(exclude).claude` and leaves the bleed. Symptom: `prettier --check .` (`endOfLine: lf`) fails on untouched `.claude/launch.json` while `git status` is clean. CLI `EnterWorktree` / Agent `isolation:"worktree"` stay LF. Plain-git repro in the issue.

- **bled** = #91443: CRLF bleed into `.claude/**` + `CLAUDE.md` from empty-index stageCheckout under `core.autocrlf=true`
- **crlf-bleed** = CRLF in `.claude/**` and `CLAUDE.md` only; rest of tree LF per `.gitattributes` (`* text=auto eol=lf`)
- **empty-index** = `git worktree add --no-checkout` leaves the new worktree empty index so git never sees attributes
- **stage-checkout** = `createWorktree` → `stageCheckout` selective `checkout HEAD --` includes `.claude/**` and `CLAUDE.md` but not `.gitattributes`
- **autocrlf-true** = Windows default `core.autocrlf=true` writes CRLF when no attributes are in the index
- **gitattributes-missing** = `.gitattributes` is not in the stage-1 selective checkout path list
- **prettier-fails** = `prettier --check .` (`endOfLine: lf`) fails on untouched `.claude/launch.json`
- **git-status-clean** = `git status` reports the tree clean (autocrlf makes CRLF match the LF blob on read)
- **cli-worktree-lf** = CLI `EnterWorktree` / Agent `isolation:"worktree"` stay LF throughout
- **exclude-claude** = background full checkout uses `:(exclude).claude` and does not rewrite already-checked-out files
- **plain-git-repro** = worktree add `--no-checkout`, `checkout HEAD -- .claude/launch.json CLAUDE.md`, `ls-files --eol` shows `w/crlf` attr/; full checkout still leaves those CRLF
- **attributes-in-stage1-fix** = including `.gitattributes` in the same selective checkout makes step 2 come out LF
- **autocrlf-false-fix** = `git -c core.autocrlf=false checkout HEAD -- …` makes step 2 come out LF
- **has-clear-repro** = mortenklungland-ai filed #91443; has repro; platform:windows; area:desktop; Claude Desktop 1.40609.1.0 (MSIX); Windows 11; CLI 2.1.255; git 2.55.0; observed 2026-08-31 and 2026-09-02
- **hold** = reglet seated flat; LF flush across the galley; agent files uncreased
- **creased** = HOLD: reglet seated flat; LF flush across the galley; agent files uncreased

Verdicts: creased, bled, crlf-bleed, empty-index, stage-checkout, autocrlf-true, gitattributes-missing, prettier-fails, git-status-clean, cli-worktree-lf, exclude-claude, plain-git-repro, attributes-in-stage1-fix, autocrlf-false-fix, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the strip is creased or bled.

Hypothesis only (NON-BINDING): Desktop may optimize spawn latency with stage-1 selective checkout before attributes land. Do not claim source you have not seen beyond the issue's measured repro.

## Why not a clone

This is specifically: **DESKTOP WINDOWS STAGED WORKTREE CHECKOUT BEFORE .GITATTRIBUTES IS IN THE INDEX → .claude/** AND CLAUDE.md GET CRLF UNDER core.autocrlf=true; PRETTIER FAILS WHILE GIT STATUS CLEAN; CLI WORKTREES STAY LF; PLAIN-GIT REPRO; AREA:DESKTOP.**

NOT **Reliquary** ([#91433](https://github.com/anthropics/claude-code/issues/91433)) — aarch64 O_* EINVAL session vanish / data-loss — cite as stay-off.
NOT **Annunciator** ([#91419](https://github.com/anthropics/claude-code/issues/91419)) — StopFailure false alarms on parent — loud polarity — cite as stay-off.
NOT **Caisson** ([#91405](https://github.com/anthropics/claude-code/issues/91405)) — worktree pool wrong rebind + dirty wipe — related worktree surface, different failure: binding/wipe ≠ CRLF bleed — cite as stay-off.
NOT **Spindle** ([#91402](https://github.com/anthropics/claude-code/issues/91402)) — startup cleanup deletes live sibling Bash outputs — cite as stay-off.
NOT **Knell** ([#91298](https://github.com/anthropics/claude-code/issues/91298)) — Agent-tool silent child death.
NOT **Tumbler**.
NOT **Escapement**.
NOT **Geneva** / **Scotch** / **Carillon** / **Pintle** / **Fibula**.
NOT **Reveille** / **callboard** / slype muster-roster ink metaphors.
NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / berth clones.
NOT **Berth** catalog entries (different product — do not clone their UI).
NOT **Bollard** catalog entries (different product — do not clone their UI).

Cousins are cite-only on a cousin strip; primary stays #91443.

- [#91405](https://github.com/anthropics/claude-code/issues/91405) — Caisson — worktree pool wrong rebind; different failure.
- [#88747](https://github.com/anthropics/claude-code/issues/88747) — absolute hooksPath into worktree.
- [#86010](https://github.com/anthropics/claude-code/issues/86010) — detached window image viewer — closed; different path.
- [#91438](https://github.com/anthropics/claude-code/issues/91438) — detached preview dead-click — Platen backup.

Backups (do not ship unless primary blocked): **Platen** / #91438 — Detached window file/preview link click does nothing. **Jalousie** / #87730 — Inline `` !`cmd` `` preprocessor executes fenced markdown examples. **Fairlead** / #88423 — In-process subagent bg Bash/Monitor completions enqueue to lead, deliver to no one.

Product name stays **Reglet**. Do not rename to Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Carillon, Sluice, Alidade, Cockade, Lye, Clew, Hasp, Berth, Bollard, Reveille, Callboard.

Different UI: letterpress reglet / galley / thin spacing-strip plaque + empty-index stageCheckout dial + `.gitattributes` missing-from-stage-1 fault lamp + CRLF vs LF eol split + autocrlf Windows default callout + prettier-check vs git-status-clean paradox / warm ink / cream paper / brass rule. EB Garamond + Hanken Grotesk + Noto Sans Mono. NOT Crimson Pro/Plus Jakarta Sans/Ubuntu Mono (Reliquary). NOT Chakra Petch/Barlow/Share Tech Mono (Annunciator). NOT Zilla Slab/Epilogue/Overpass Mono (Caisson). NOT Cardo/Hind/Cousine (Spindle). NOT Bitter/Karla/Inconsolata (Knell). NOT Young Serif/Figtree/Fragment Mono (Tumbler). NOT Instrument Serif/Manrope/Azeret Mono (Escapement). NOT Bodoni/Jost/Space Mono (Geneva). NOT Spectral/Sora/IBM Plex Mono (Scotch). NOT Cormorant/Outfit/Fira (Fibula). NOT Libre Baskerville/Work Sans/JetBrains (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair/Source Serif 4 (Carillon). NOT Cinzel (Postern). Stay OFF reliquary vault-latch / annunciator lamps / caisson berth / spindle chip-sweep / knell mute-bell / tumbler keyway / escapement pallet / carillon peal / sluice millrace / reveille muster / callboard roster / berth-card clone / bollard clone.

Different verbs: Seat the reglet, pin idle creased, pin seeded bled, admit the CRLF already set, load fixtures, reset to creased. Not "Score the latch/seal/purge/mute/keyway/pallet/cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race". Score the strip is this desk's phrase.

Different idle: **creased**.

## Live catalog path

`/reglet/` is this static letterpress reglet / galley atelier desk. Path `https://hermes-playground-green.vercel.app/reglet/` and subdomain `https://reglet.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `19:50 / hermes catalog #120 / #91443`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **creased** — reglet seated flat; LF flush across the galley; agent files uncreased.
2. Seed **bled** → #91443: CRLF bleed into `.claude/**` + `CLAUDE.md` from empty-index stageCheckout under `core.autocrlf=true`; prettier fails while git status is clean; CLI worktrees stay LF; plain-git repro.
3. Atelier UI: spacing-strip plaque / empty-index stageCheckout dial / `.gitattributes` missing-from-stage-1 fault lamp / CRLF vs LF eol split. Creased = strip seated, LF flush. Bled = agent files CRLF, tree LF, prettier fail / git status clean paradox.
4. Cousin cite strip labeled cousin-not-primary: [#91405](https://github.com/anthropics/claude-code/issues/91405) / [#88747](https://github.com/anthropics/claude-code/issues/88747) / [#86010](https://github.com/anthropics/claude-code/issues/86010) / [#91438](https://github.com/anthropics/claude-code/issues/91438). Cite only. Primary stays #91443.
5. **Seat the reglet** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/reglet/index.html` in a browser, or serve the repo root and visit `/reglet/` (Vercel rewrite → `/projects/reglet`). No build step. Optional hook:

```bash
node projects/reglet/hook/reglet.mjs projects/reglet/data/91443.json
node --test projects/reglet/hook/reglet.test.mjs
```

Empty stdin scores the idle **creased** ticket. Paste a probe on the page or drop a fixture from `data/`.
