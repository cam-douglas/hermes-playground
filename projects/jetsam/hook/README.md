# Jetsam hook

Tiny stop-hook-quay diagnostic notes for the Claude Code defect where `~/.claude/stop-hook-git-check.sh` reports phantom "unpushed commit(s)" after a squash-merged PR whose head branch was auto-deleted. The comparison ref is picked with `git rev-parse "origin/$current_branch"` — that answers "does this local ref exist", not "does this branch still exist on the remote". After GitHub auto-deletes the merged head, the local `origin/<branch>` tracking ref survives until pruned, still resolves, and `origin/<stale>..HEAD` counts the squash commit as unpushed. Stop hook exit 2, indefinitely. OPEN. Labels: bug, has repro, area:hooks, area:claude-code-web.

IDLE_WORD=pruned. SEEDED_WORD=adrift. Seeded state is adrift / #92338 (stale `origin/<feature>` still resolves after remote head deleted; Stop hook exit 2 phantom unpushed). Never idle as sealed / waiting / standing / razed / once / doubled / stuck / missed / gated / spilled / hushed / blurted / lit / blanked / cold / voided / banked / rewritten / miskeyed / leaked.

This stub is documentation only. It does **not** ship in Claude Code. The living page at `projects/jetsam/index.html` scores probes in-browser. `stop-hook-jetsam.sh` is an educational fixture that demonstrates shipped vs naive vs suggested logic against in-memory scenario tables. No npm. No secrets. No real hooks. No exploits. No live git remote required. Diagnostic shapes only (published comparison-ref choice, containment check, fetch-prune measurements, five-scenario matrix).

Preferred comparison (document only — do not treat this stub as a live hook):

1. Do **not** treat `git rev-parse "origin/$current_branch"` succeeding as proof the branch still exists on the remote, and
2. Do **not** substitute the default branch as upstream (naive-sub: silences stale-ref, then reports every commit on a fully pushed feature branch as unpushed), and
3. Insert a containment check against the default branch BEFORE the `unpushed=` line — try `origin/HEAD` then `origin/main` then `origin/master`; if HEAD is an ancestor of `default_ref`, exit 0.

Detection: if the Stop hook prints `There are 1 unpushed commit(s)` after a squash-merged PR whose head was auto-deleted, `git rev-parse origin/<branch>` still succeeds, HEAD is already contained in `origin/main`, and `git fetch origin main` with `fetch.prune=true` leaves the stale ref, the quay is already adrift.

Given a probe-shaped payload `{ trackingRefExistsLocally, trackingRefExistsOnRemote, commitsAheadOfTracking, commitsAheadOfDefault, headContainedInDefault, hasUnpushedWork, originHeadUnset, scopedFetchPrune, persistHold, pruned, adrift, log }`:

- **PRUNED** if the tracking-ref is gone or HEAD is contained in the default branch and the shipped hook would exit 0
- **ADRIFT** if a stale `origin/<feature>` still resolves and the shipped hook exits 2 (#92338)
- **STALE-REF** if `git rev-parse origin/<branch>` succeeds after the remote head was deleted
- **CONTAINMENT** if the suggested `merge-base --is-ancestor HEAD $default_ref` would exit 0
- **NAIVE-SUB** if default-branch substitution is the comparison (wrong for a fully pushed feature branch ahead of main)
- **PHANTOM-UNPUSHED** if shipped exit 2 for work already merged
- **FORCE-LEASE-STALE** if `--force-with-lease` failed with "stale info"
- **SCOPED-FETCH-SURVIVES** if `git fetch origin main` + `fetch.prune=true` left the stale ref
- **FULL-FETCH-PRUNES** if `git fetch origin` + `fetch.prune=true` cleared it
- **RE-PROVISION-OVERWRITE** if citing the ~6 min `~/.claude/` restore that overwrites a local patch

This is a diagnostic scoring desk. Not an exploit. No secrets. No live remote. Score whether the Stop hook would exit 0 or exit 2.

Primary: [anthropics/claude-code#92338](https://github.com/anthropics/claude-code/issues/92338). Cousins cite-only: [#83924](https://github.com/anthropics/claude-code/issues/83924), [#86018](https://github.com/anthropics/claude-code/issues/86018), [#83490](https://github.com/anthropics/claude-code/issues/83490), [#82624](https://github.com/anthropics/claude-code/issues/82624), [#86379](https://github.com/anthropics/claude-code/issues/86379).

Hypothesis only (NON-BINDING): the issue's containment check is the encoded fix. The `origin/HEAD` unset swallow is a separate observation, not this product's primary. Discard if issue evidence disagrees.

NOT leftover Priory cloister / Latchkey board / Stubble furrow / Intake gauge-house / Pasteboard kraft / Spillway dam / Lagan process / Snub pipe / Hawser MCP reap. Product name stays Jetsam.
