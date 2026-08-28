# Sump

Basement catch-pit / wet-concrete desk for Claude Code worktree provisioning that writes Git LFS hooks into a **literal relative path `dev/null/`** (a real directory with `post-checkout`, `post-commit`, `post-merge`, `pre-push` LFS shims) instead of the shared `.git/hooks/` / `core.hookspath` target. Hooks are inert (real hookspath is correct) but litter `git status` as untracked clutter. A path that should vanish into null became a shelf of silt. A null path is **not** a hold. Score the silt or admit **drained**.

Idle word: **drained** (sump emptied; no literal `dev/null/` litter).
NEVER use the product name sump as the idle/state word.
NEVER use empty.
NEVER reuse flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed (as idle), quiet, seised. Do not ship Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Livery, Nixie, Crypt, Fold, Accordion, Bellows, Drain, Null, Sink, Gutter, Pit, Ash, Ashcan, Sluice, Culvert, Weir, Bung, Void, Limbo, or Oubliette.

Verdicts: **drained**, **silted**, **clogged**, **fouled**, **pooled**, **diverted**, **littered**, **phantom**, **absolute**, **hooked**. Slack sump alarm on silted / clogged / fouled / littered. Linear ticket on silted / clogged / fouled. GitHub sump-ledger of silt events on every scored probe.

## Why not a clone

NOT Wicket (gatehouse / worktree isolation probe). Wicket scores isolation pin vs promise; Sump scores a wrong-path LFS hook install that materializes `/dev/null` as a folder.
NOT Scant (timber yard / shell-snapshot PATH truncation).
NOT Pleat (tailor fold / mid-turn Desktop collapse).
NOT Chad / Kist / Wraith / Gasket / Damper / Cote / Larder / Tappet / Aside / Chute / Tain / Husk / Snib / Veto / Assay / Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom / Hasp / Parity / Reveille / Quench / Scrim / Knock.
NOT leftover woodworking / millimetre-slider clones. A sump is a basement catch-pit metaphor for a diagnostic desk, not a leftover instrument.
Do NOT ship Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Livery, Nixie, Crypt, Fold, Accordion, Bellows, Drain, Null, Sink, Gutter, Pit, Ash, Ashcan, Sluice, Culvert, Weir, Bung, Void, Limbo, Oubliette as alternate product names this hour. Product name is **Sump** only.

Different problem: literal `dev/null/` LFS hook litter during worktree provision.
Different UI: industrial basement sump pit / wet concrete / rust grate / bilge pump / silt tray. NOT timber yard. NOT tailor board. NOT ballot. NOT coffin. NOT steam flange. NOT dove-cote.
Different idle word: **drained**.

## Live catalog path

`/sump/` is this static catch-pit. Rust grate, bilge pump, silt tray. Demo works with no secrets and no npm. Mark: `06:50 Sydney · sump`.

1. Seeded `#90456` **silted** is already in the pit: worktree-scoped hookspath correct; literal `dev/null/` fully populated with valid LFS shims → **silted** (cluster clogged / fouled / littered / diverted / phantom / absolute / hooked).
2. Switch **clogged** — grate packed with all four LFS hook shims → **clogged**.
3. Switch **fouled** — LFS shims contaminate the pit, partial → **fouled**.
4. Switch **pooled** — empty literal `dev/null/` directory only (objective-dijkstra) → **pooled**.
5. Switch **diverted** — path resolved relative; null became a folder → **diverted**.
6. Switch **littered** — git status shows untracked `dev/null/` clutter → **littered**.
7. Switch **phantom** — hooks look real but never fire → **phantom**.
8. Switch **absolute** — claimed hookspath is absolute; write targeted relative null → **absolute**.
9. Switch **hooked** — LFS shims present; install ran against the wrong hold → **hooked**.
10. Switch **Bail · drained** — sump emptied, nothing scored → **drained**. Idle word is **drained** when the probe is idle.
11. **Score** scores. **Bail** returns idle drained. **Silt** shows the populated pit. Admit does not lie: a silted probe stays silted.

## Hook

`projects/sump/hook/` scores a probe `{ literalNullDir, hookFiles, emptyNullDir, fullyPopulated, hooksLandedInNull, hooksAreLfsShims, gitStatusUntracked, pathResolvedRelative, hooksNeverFire, hooksLookReal, realHookspathCorrect, hookspathClaimed, hookspathIsAbsolute, relativeNullWrite, lfsInstallRaced, lfsShimsPresent }` and returns `{ verdict, reasons[], cluster[], drained, silted, clogged }`. See `hook/README.md`.

```bash
node projects/sump/hook/index.mjs --listen 9070
node --test projects/sump/hook/sump.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90456](https://github.com/anthropics/claude-code/issues/90456) — filed 2026-08-28. Worktree provisioning writes Git LFS hooks to a literal `dev/null/` directory instead of `.git/hooks/`. Evidence table: worktrees with worktree-scoped `core.hookspath` got `dev/null/` (empty or fully populated with valid LFS hook scripts); correlation with LFS install racing before hookspath is established. Hypothesis from the issue: a relative `dev/null` resolved before the worktree hookspath was absolute. Suggested fix: skip per-worktree LFS install OR resolve hooks dir via `git rev-parse --git-common-dir` / read-back of `core.hookspath` as an absolute path.

Corroboration (cite as shape, not a new primary):

- [anthropics/claude-code#69453](https://github.com/anthropics/claude-code/issues/69453) — Windows: worktree creation leaves a junk `dev/null/` directory of git-lfs hooks (open).
- [anthropics/claude-code#74033](https://github.com/anthropics/claude-code/issues/74033) — Windows: worktrees in git-lfs repos get stray `dev/null/` via `GIT_CONFIG_PARAMETERS` (closed).
- [anthropics/claude-code#79923](https://github.com/anthropics/claude-code/issues/79923) — Worktree isolation litters `dev\null\` hook files in Git LFS repos on Windows (closed).
- [anthropics/claude-code#81812](https://github.com/anthropics/claude-code/issues/81812) — Windows: worktree creation in an LFS repo creates a literal `dev\null\` directory (closed).
- [anthropics/claude-code#72714](https://github.com/anthropics/claude-code/issues/72714) — `/worktree` can silently write `core.hooksPath` into the MAIN repo shared `.git/config` (related hooksPath confusion; cite as shape only).
