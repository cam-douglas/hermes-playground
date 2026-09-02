# Caisson

A **dry-dock caisson / worktree-pool berth atelier** desk — floating gate, numbered cradle slots in a pool basin, returning hull chip with a correct nameplate docking onto the **wrong** cradle, dirty-plates wash spray when recycling, dual transcript path ledger, tide-steel / wet-concrete on a cool dock ground, hairline waterline graduations; Zilla Slab + Epilogue + Overpass Mono — for a real Claude Code defect: **Desktop worktree pool assigns chip-relaunched sessions to the wrong worktree (95.5% measured) and can reset dirty worktrees destroying uncommitted work. Title correct / cwd wrong. `rebindWorktree`. data-loss. Windows Desktop.**

Primary:

- [anthropics/claude-code#91405](https://github.com/anthropics/claude-code/issues/91405) (OPEN, bug, has repro, platform:windows, area:core, data-loss, area:desktop, filed 2026-09-02T06:21:58Z, updated 2026-09-02T06:23:03Z, 0 comments). Title: Worktree pool assigns relaunched sessions to the wrong worktree (95% of sessions measured), and can discard uncommitted work. Reporter IT-RT.

a caisson that reseats the wrong hull is not a hold. Score the seal or admit **rebound**.

Idle word: **sealed**. Seeded state: **rebound** / #91405 — `rebindWorktree` to a wrong recycled slot; `[WorktreePool] Reset dirty worktree … to clean for pooling`; 42/44 (95.5%) wrong berths across 1,764 transcripts. Never idle as fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

A **caisson** is the floating gate and recycled cradle pool that should reseat a returning hull onto its own **branch-bound** cradle. Instead the Desktop automatic worktree pool **rebinds** the hull to a **wrong recycled slot**, and can **power-wash a dirty cradle** to recycle it — permanently destroying uncommitted plates. Session **title/identity stay correct**; only the **working directory** is wrong.

- **rebound** = #91405: `rebindWorktree` reseats the hull on a wrong slot; Reset dirty wipe; 42/44 (95.5%) wrong
- **wrong-worktree** = expected `clever-rosalind-ef53a2` vs actual `elegant-euler-7d5da0`; title correct / cwd wrong
- **dirty-reset-wipe** = `[WorktreePool] Reset dirty worktree … to clean for pooling`; uncommitted files destroyed
- **rebind-without-add** = `[rebindWorktree] Rebound` often without a fresh `git worktree add`; folder may lack `.git`
- **dual-transcript-path** = 11/44 sessions have transcript written into two different project directories (pre- and post-relocation fingerprint)
- **chip-relaunch** = reopen from a background-task chip (“continue this work”) lands in a worktree that does not correspond to the work
- **branch-bind** = bind a reopened session to its **branch** (unique/stable), not a recycled folder path
- **folder-slot-recycle** = pool reseats by recycled folder slot rather than branch identity
- **windows-file-lock** = cleanup fails partway when a preview server or terminal holds files open
- **has-clear-repro** = IT-RT filed #91405; 42/44 (95.5%); 1,764 transcripts; has repro; Claude Code Desktop; Windows 11
- **data-loss** = uncommitted files destroyed, unrecoverable; nothing in stash, reflog, or dangling object
- **hold** = relaunch bound to the correct branch-named cradle; dirty cradles never power-washed to the pool; the caisson is sealed
- **sealed** = HOLD: relaunch bound to the correct branch-named cradle; dirty cradles never power-washed to the pool

Verdicts: sealed, rebound, wrong-worktree, dirty-reset-wipe, rebind-without-add, dual-transcript-path, chip-relaunch, branch-bind, folder-slot-recycle, windows-file-lock, has-clear-repro, data-loss, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the caisson is sealed or rebound.

Hypothesis only (NON-BINDING): pool may key relaunch by recycled folder slot rather than branch identity, and may treat “dirty” as “safe to wipe for reuse.” Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **DESKTOP WORKTREE POOL ASSIGNS CHIP-RELAUNCHED SESSIONS TO THE WRONG WORKTREE (95.5% MEASURED) AND CAN RESET DIRTY WORKTREES DESTROYING UNCOMMITTED WORK; TITLE CORRECT / CWD WRONG; rebindWorktree; data-loss; WINDOWS DESKTOP.**

NOT **Spindle** ([#91402](https://github.com/anthropics/claude-code/issues/91402)) — startup cleanup deletes live sibling Bash task outputs under shared temp — cite as stay-off.
NOT **Knell** ([#91298](https://github.com/anthropics/claude-code/issues/91298)) — Agent-tool custom child silent death after Spawned successfully.
NOT **Tumbler** ([#74256](https://github.com/anthropics/claude-code/issues/74256)) — PermissionRequest ExitPlanMode allow discarded.
NOT **Escapement** ([#91371](https://github.com/anthropics/claude-code/issues/91371) / [#91400](https://github.com/anthropics/claude-code/issues/91400)) — scheduled-task process lifecycle.
NOT **Geneva** / **Scotch** / **Carillon** / **Pintle** / **Fibula** / **Virgule** / **Riddle** / **Garner** / **Postern** / **Sluice**.
NOT **Clew** (sandbox ARG_MAX).
NOT **Hasp** (path lease).
NOT **Berth** catalog entries (different product — do not clone their UI even though nautical).
NOT **Bollard** catalog entries (different product — do not clone their UI even though nautical).
NOT **Sapper** ([#89251](https://github.com/anthropics/claude-code/issues/89251)) — PreToolUse Bash write steer — deferred backup class.
NOT **Quire** ([#91284](https://github.com/anthropics/claude-code/issues/91284)) / **Shear** ([#79879](https://github.com/anthropics/claude-code/issues/79879)) / **Moniker** ([#90153](https://github.com/anthropics/claude-code/issues/90153)) — Spindle backups — do not auto-pick.
NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / escapement / locksmith / campanology / spindle chip-sweep.

Cousins are cite-only on a cousin strip; primary stays #91405.

- [#79366](https://github.com/anthropics/claude-code/issues/79366) — Worktree sessions reuse an existing worktree directory from a previous session instead of creating a fresh one.
- [openai/codex#42001](https://github.com/openai/codex/issues/42001) — Codex desktop intermittently ignores project cwd and runs commands in a stale directory.
- [openai/codex#42201](https://github.com/openai/codex/issues/42201) — Codex built a dirty worktree under a false release SHA.

Backups (do not ship unless primary blocked): **Spigot** / #91414 — MCP HTTP subscriptions/listen first-turn silent stall (MCP_TIMEOUT-5000). **Clevis** / #91408 — approve&&merge chain defeats interrupt. **Effigy** / #91396 — fabricated user authorization → real git commit.

Product name stays **Caisson**. Do not rename to Berth, Bollard, Cradle, Gate, Hull, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Carillon, Sluice, Alidade, Cockade, Lye, Clew, Hasp.

Different UI: dry-dock caisson / worktree-pool berth / floating gate + numbered cradle slots in a pool basin + returning hull chip with correct nameplate on the wrong cradle / dirty-plates wash spray / dual transcript path ledger / tide-steel and wet-concrete / cool dock ground / hairline waterline graduations. Zilla Slab + Epilogue + Overpass Mono. NOT Cardo/Hind/Cousine (Spindle). NOT Bitter/Karla/Inconsolata (Knell). NOT Young Serif/Figtree/Fragment Mono (Tumbler). NOT Instrument Serif/Manrope/Azeret Mono (Escapement). NOT Bodoni/Jost/Space Mono (Geneva). NOT Spectral/Sora/IBM Plex Mono (Scotch). NOT Cormorant/Outfit/Fira (Fibula). NOT Libre Baskerville/Work Sans/JetBrains (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair/Source Serif 4 (Carillon). NOT Cinzel (Postern). Stay OFF spindle chip-sweep / knell mute-bell / tumbler keyway / escapement pallet / carillon peal / sluice millrace / berth-card clone / bollard clone.

Different verbs: score the seal, pin idle sealed, pin seeded rebound, admit rebound, load fixtures, reset to sealed. Not "Score the purge/mute/keyway/pallet/cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race".

Different idle: **sealed**.

## Live catalog path

`/caisson/` is this static dry-dock caisson / worktree-pool berth atelier desk. Path `https://hermes-playground-green.vercel.app/caisson/` and subdomain `https://caisson.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `16:50 / hermes catalog #117 / #91405`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **sealed** — relaunch bound to the correct branch-named cradle; dirty cradles never power-washed to the pool.
2. Seed **rebound** → #91405: `rebindWorktree` to a wrong slot; Reset dirty wipe; 42/44 (95.5%) wrong; title correct / cwd wrong.
3. Atelier UI: floating gate / numbered cradle slots / pool basin / returning hull chip / dirty-plates wash spray / dual transcript path ledger. Sealed = gate closed, hull on its own cradle, plates intact. Rebound = hull on the wrong cradle, wash spray on dirty plates.
4. Cousin cite strip labeled cousin-not-primary: [#79366](https://github.com/anthropics/claude-code/issues/79366) / [openai/codex#42001](https://github.com/openai/codex/issues/42001) / [openai/codex#42201](https://github.com/openai/codex/issues/42201). Cite only. Primary stays #91405.
5. **Score the seal** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/caisson/index.html` in a browser, or serve the repo root and visit `/caisson/` (Vercel rewrite → `/projects/caisson`). No build step. Optional hook:

```bash
node projects/caisson/hook/caisson.mjs projects/caisson/data/91405.json
node projects/caisson/hook/caisson.mjs projects/caisson/data/sealed.json
node --test projects/caisson/hook/caisson.test.mjs
```

Rebound seed → rebound/alarm. Sealed seed → sealed/hold.

`projects/caisson/hook/caisson.mjs` classifies a probe ticket JSON `{ branchBound, dirtyCradlePreserved, correctCradle, wrongWorktree, dirtyResetWipe, rebindWithoutAdd, dualTranscriptPath, chipRelaunch, cwdWrong }` and returns `{ verdict, chips[], reasons[], sealed, rebound, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91405.json`, `data/rebound.json`, `data/sealed.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts. Use `rebindWorktree`, `Reset dirty worktree`, 42/44, 95.5%, 1,764 transcripts, dual project dirs, background-task chip, branch-vs-folder bind, Windows Desktop, IT-RT, clever-rosalind vs elegant-euler. Never invent counts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91405](https://github.com/anthropics/claude-code/issues/91405). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Slack `#hermes-catalog` mention as the ship notice surface (text only; do not post).
3. Claude Code Desktop automatic worktree pool / background-task chip / `rebindWorktree` as the third native surface. Paste or drop a probe ticket JSON and score it.
4. Atelier UI (floating gate / numbered cradle slots / pool basin / returning hull chip / dirty-plates wash spray / dual transcript path ledger). Sealed = gate closed and hull on its own cradle, rebound = hull reseated on a wrong recycled slot.
5. Cousin-not-primary cite strip: #79366, openai/codex#42001, openai/codex#42201.

## Sources

- [anthropics/claude-code#91405](https://github.com/anthropics/claude-code/issues/91405) OPEN — primary. Product stays Caisson.
- Claude Code desktop app on Windows 11. Multiple parallel sessions on one repository, using the app's automatic worktree feature. Repository has ~44 pooled worktrees.
- When a session is reopened from a background-task chip (a “continue this work” card), the app places it in a worktree that does not correspond to the work it was given. The session identity and title are always correct — only the working directory is wrong.
- Separately, and more seriously, the pool has been observed resetting a worktree that contained uncommitted changes in order to recycle it, permanently destroying that work.
- Scanned 1,764 session transcripts covering 2026-08-26 to 2026-09-02. 44 distinct sessions were opened from chips carrying an expected-worktree path. Landed in the **wrong** worktree: **42 / 44 (95.5%)**. Landed correctly: 2 / 44.
- Example: expected `.../worktrees/clever-rosalind-ef53a2`, actual `.../worktrees/elegant-euler-7d5da0` — entirely different worktrees on unrelated branches.
- 11 of the 44 sessions have their transcript written into two different project directories (the pre- and post-relocation path).
- Impact: work performed against the wrong code; folder names / branches drift; **data loss** when the pool resets a dirty worktree (`[WorktreePool] Reset dirty worktree … to clean for pooling`) — uncommitted files destroyed, unrecoverable.
- Mid-use reassignment observed (worktree repointed during a 24-minute test run).
- Mechanism: on close, Cleaning up / unregister then still Releases to pool; later `[rebindWorktree] Rebound` often without fresh `git worktree add`; folder may lack `.git` → fall through to shared root → self-perpetuating; newer variant does real `git worktree add` but wrong branch.
- Windows aggravator: cleanup fails partway when a preview server or terminal holds files open.
- Ask: bind a reopened session to its **branch**, which is unique and stable, rather than to a worktree folder path, which is a recycled slot whose contents change. Additionally, never reset a worktree that has uncommitted changes in order to pool it — refuse to recycle it, or preserve the changes first.
- Version surface: Claude Code Desktop / Windows 11 (issue does not pin a single CC CLI version string).
- Cousins (cite, not primaries):
  - [#79366](https://github.com/anthropics/claude-code/issues/79366) — Worktree sessions reuse an existing worktree directory from a previous session instead of creating a fresh one.
  - [openai/codex#42001](https://github.com/openai/codex/issues/42001) — Codex desktop intermittently ignores project cwd and runs commands in a stale directory.
  - [openai/codex#42201](https://github.com/openai/codex/issues/42201) — Codex built a dirty worktree under a false release SHA.
