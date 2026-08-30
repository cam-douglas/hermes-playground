# Tally

Stevedore / dock **tally** — a chalk-stick cargo desk and a keep-versus-remove gate — for a real Claude Code defect: the interactive worktree `/exit` dialog counts commits since worktree *creation* (`git rev-list --count CLAUDE_BASE..HEAD`, `CLAUDE_BASE` stored in `.git/worktrees/<name>/CLAUDE_BASE`), not unmerged or unpushed work. It warns "You have N commits… All changes and commits will be lost" even when `git rev-list --count origin/main..HEAD` is 0. After `git merge --ff-only origin/main` inside the worktree the dialog count can *grow* while risk shrinks. Only resetting HEAD to the creation-time state returns N to 0.

Primary: [anthropics/claude-code#90692](https://github.com/anthropics/claude-code/issues/90692) (OPEN, filed 2026-08-30, labels: bug, has repro, platform:linux, area:tools). Title: Worktree exit dialog counts commits since worktree creation (CLAUDE_BASE), not unmerged work — warns 'will be lost' for fully pushed and merged commits.

A birth-counted tally is not a hold. Score the board or admit **squared**.

Idle word: **squared** (accounts squared / dock tally squared).
NEVER use squared for a failure. NEVER use the product name tally / notch / chalk / quittance / remanet / ledger / stumpage / docket / waybill / manifest / arrear / reckon / escrow / staddle / kerf / freeboard / plimsoll / cadastre / bailey / soke / stile / empty / silent / mute / idle / bound / girt / sheltered / alongside / seated / credited / level / verbatim / fronted / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / nested / cut / switched / spilled as the idle/state word.

Verdicts: **squared**, **birth-counted**, **false-loss**, **merged-still-n**, **push-blind**, **base-frozen**, **remount-grew**, **origin-zero**, **chalked**, **keep-or-lose**. Slack chip + Linear ticket on false-loss / remount-grew / merged-still-n / push-blind / origin-zero / base-frozen / chalked / birth-counted. GitHub tally-ledger of scored intakes on every score.

The #90692 false-loss board (birth count > 0 + origin/main..HEAD = 0 + dialog claims loss after push and regular/ff merge, no squash) is **false-loss**, never **squared**. Unique nearby flags win their own seeds because those seeds do not carry the #90692 triad. #84856 squash-ancestry ExitWorktree *tool* is labeled **keep-or-lose**, not this dialog.

## Why not a clone

NOT **Wicket** — worktree isolation. Different defect class.
NOT **Fascia** — trust dialog names spawn cwd while the session runs elsewhere ([#90638](https://github.com/anthropics/claude-code/issues/90638)).
NOT **Berth** — spawn_task chip shares the parent working tree ([#90668](https://github.com/anthropics/claude-code/issues/90668)).
NOT **Pale** — hooks silently absent when the project root is not the repo root ([#90683](https://github.com/anthropics/claude-code/issues/90683)).
NOT **#84856** squash-ancestry ExitWorktree *tool* refusal ([#84856](https://github.com/anthropics/claude-code/issues/84856), closed) and the open tool-side reports [#78355](https://github.com/anthropics/claude-code/issues/78355) / [#40137](https://github.com/anthropics/claude-code/issues/40137) / [#71135](https://github.com/anthropics/claude-code/issues/71135). Those false-positive after **squash** merges against the default branch. Tally is the *interactive* `/exit` dialog with baseline = worktree birth (`CLAUDE_BASE`). No squash needed; regular and fast-forward merges still leave N>0.
NOT leftover woodworking / millimetre-slider / Tudor oak pale / Victorian chatelaine / foundling ward / harbour berth / library carrel clones.
Do NOT ship alternate names Notch, Chalk, Quittance, Remanet, Ledger, Stumpage, Docket, Waybill, Manifest, Arrear, Reckon, Escrow, Staddle, Kerf, Freeboard, Plimsoll, Cadastre, Bailey, Soke, Stile. Product name is **Tally** only.

Different problem: the interactive worktree exit dialog counts commits since worktree creation, then claims they will be lost, even when everything is already pushed and merged.
Different UI: stevedore chalk-stick dock desk — slate board, cargo crates, keep-versus-remove gate, sodium vapor, rust stencil. Black Ops One + Patrick Hand + DM Sans + IBM Plex Mono. Not Tudor oak, not a waist-chain, not a foundling home, not a harbour berth, not a library carrel.
Different idle word: **squared**.

## Live catalog path

`/tally/` is this static dock-tally desk. Demo works with no secrets and no npm. Mark: `16:50 Sydney · tally`.

1. Seeded `#90692` **false-loss** is already on the ledger: birth count 3; `origin/main..HEAD` is 0; dialog warns "All changes and commits will be lost" → **false-loss**. Never squared.
2. Switch **remount-grew** — after `git merge --ff-only origin/main` the birth count grew from 3 to 4 while risk shrank.
3. Switch **merged-still-n** — regular or fast-forward merge on the remote; `CLAUDE_BASE..HEAD` still N>0.
4. Switch **push-blind** — commits already on the remote; dialog still chalks birth notches.
5. Switch **origin-zero** — `git rev-list --count origin/main..HEAD` prints 0.
6. Switch **base-frozen** — `CLAUDE_BASE` stuck at worktree birth; only a reset to creation returns N to 0.
7. Switch **chalked** — the `/exit` slate notched N since birth; the number measures age, not risk.
8. Switch **birth-counted** — N is `git rev-list --count CLAUDE_BASE..HEAD`; baseline is worktree creation.
9. Switch **keep-or-lose** — #84856 squash-ancestry ExitWorktree *tool*. Labeled contrast, not this dialog.
10. Switch **honest squared** — HEAD == `CLAUDE_BASE`; birth count 0 → **squared** true.
11. **Score** scores. **Admit squared** scores honestly. **Restore · #90692** shows the false-loss board. Admit does not lie.
12. Simulate on the dock: **Commit**, **Push**, **Merge on remote**, **Remount ff**, **Reset to birth**. Watch birth notches versus the origin crate.

## Hook

`projects/tally/hook/` scores a probe `{ birthCount, originCount, dialogClaimsLoss, pushed, merged, squash, remountGrew, birthBeforeRemount, baseFrozen, chalked, baseline, claudeBase, head, worktree }` and returns `{ verdict, reasons[], squared }`. See `hook/README.md`.

```bash
node projects/tally/hook/index.mjs --listen 9090
node --test projects/tally/hook/tally.test.mjs
```

`squared` is true ONLY when the verdict is squared (idle, or honest control: HEAD == CLAUDE_BASE; birth count 0). Seeded 90692 numbers must produce false-loss / `squared=false`. Honest control with HEAD at birth produces `squared=true`. A birth-counted tally is never squared.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90692](https://github.com/anthropics/claude-code/issues/90692) — OPEN, filed 2026-08-30. Title: Worktree exit dialog counts commits since worktree creation (CLAUDE_BASE), not unmerged work — warns 'will be lost' for fully pushed and merged commits. Labels: bug, has repro, platform:linux, area:tools. Body: N is `git rev-list --count CLAUDE_BASE..HEAD`. Observed N = 3 while `origin/main..HEAD` was 0. After `git merge --ff-only origin/main` the dialog showed N = 4.

Related but DISTINCT (cite as contrast, not as this product):

- [anthropics/claude-code#84856](https://github.com/anthropics/claude-code/issues/84856) — closed. ExitWorktree *tool* ancestry check against the default branch false-positives after **squash** merges.
- [anthropics/claude-code#78355](https://github.com/anthropics/claude-code/issues/78355) — open. Canonical tool-side squash-ancestry report.
- [anthropics/claude-code#40137](https://github.com/anthropics/claude-code/issues/40137) — tool-side squash ancestry.
- [anthropics/claude-code#71135](https://github.com/anthropics/claude-code/issues/71135) — tool-side squash ancestry.

Same-class / nearby priors (cross-ecosystem lifecycle confusion, not clones):

- [openai/codex#35383](https://github.com/openai/codex/issues/35383) — worktree lifecycle / auto-delete confusion.
- [openai/codex#34352](https://github.com/openai/codex/issues/34352) — continue-in-worktree cwd confusion.

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Wicket (worktree isolation), Fascia #90638, Berth #90668, Pale #90683, Chatelaine #90647, Waif #90672, leftover woodworking.

Suggested consumer fix from #90692 (document, do not implement against Claude Code itself): count work that would actually be lost (unpushed / unmerged commits against the remote default branch, plus uncommitted files), or have the dialog state what the number measures ("N commits since this worktree was created") instead of claiming loss.
