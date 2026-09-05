# Jetsam

A **salt pier / weathered teak quay / stop-hook scoring desk** — seafoam, rust iron bollards, tide chart, salt-wet planks — Instrument Serif + Manrope + IBM Plex Mono — for a real Claude Code defect: **STOP HOOK REPORTS PHANTOM "UNPUSHED COMMIT(S)" AFTER A SQUASH-MERGED PR WHOSE BRANCH WAS AUTO-DELETED.**

Primary:

- [anthropics/claude-code#92338](https://github.com/anthropics/claude-code/issues/92338) (OPEN, bug, has repro, area:hooks, area:claude-code-web). Title: `[BUG] Stop hook reports phantom "unpushed commit(s)" after a squash-merged PR whose branch was auto-deleted`. Filed 2026-09-05. Reporter: Heirlift.

02:50 jetsam: a quay that hauls a tracking-ref as cargo after the remote already jettisoned it is not an unpushed commit — it is already adrift. Score the prune or admit the branch already jetsamed.

Idle word: **pruned**. Seeded state: **adrift** / #92338 — stale `origin/<feature>` still resolves after remote head deleted; Stop hook exit 2 phantom unpushed. Never idle as sealed, waiting, standing, razed, once, doubled, stuck, missed, gated, spilled, hushed, blurted, lit, blanked, cold, voided, banked, rewritten, miskeyed, leaked, or any prior catalog idle.

**Jetsam** is harbor debris the remote already threw overboard. GitHub auto-deletes a squash-merged head branch. The local `origin/<branch>` tracking ref survives until something prunes it. `~/.claude/stop-hook-git-check.sh` asks `git rev-parse "origin/$current_branch"` — that answers "does this local ref exist", not "does this branch still exist on the remote". The stale ref still resolves. `origin/<stale>..HEAD` counts the squash commit as unpushed. The Stop hook then blocks every stop indefinitely and tells the agent to push to a branch that no longer exists. Push fails or recreates the deleted branch. The same stale ref made `git push --force-with-lease` fail with "stale info".

- **pruned** = HOLD: tracking-ref gone (full `git fetch --prune`) or HEAD already contained in the default branch; Stop hook exit 0
- **adrift** = #92338: stale `origin/<feature>` still resolves after remote head deleted; shipped hook exit 2
- **stale-ref** = local `origin/<branch>` survives GitHub auto-delete; `git rev-parse` still succeeds
- **containment** = suggested fix: `git merge-base --is-ancestor HEAD $default_ref` before the `unpushed=` line; exit 0 if contained
- **naive-sub** = WRONG: substitute `origin/main` as upstream; silences this case but reports every commit on a fully pushed feature branch as unpushed
- **phantom-unpushed** = shipped hook exit 2 for work already merged; banner "There are 1 unpushed commit(s)"
- **force-lease-stale** = `git push --force-with-lease` fails with "stale info" against a ref the remote no longer has
- **scoped-fetch-survives** = `git fetch origin main` with `fetch.prune=true` still leaves the stale ref (prune applies only to the refspec being fetched)
- **full-fetch-prunes** = `git fetch origin` with `fetch.prune=true` prunes the debris; hook goes quiet
- **re-provision-overwrite** = `~/.claude/` is managed and restored on re-provision (~6 min overwrite); users cannot locally patch

Verdicts: pruned, adrift, stale-ref, containment, naive-sub, phantom-unpushed, force-lease-stale, scoped-fetch-survives, full-fetch-prunes, re-provision-overwrite.

This is a diagnostic scoring desk. Not an exploit. No secrets. No live git remote required. Score whether the Stop hook would exit 0 or exit 2. Fixtures use the issue's five-scenario matrix and the published hook paths only.

Hypothesis only (NON-BINDING): the issue's own suggested containment check (try `origin/HEAD` then `origin/main` then `origin/master`; if HEAD is an ancestor of `default_ref`, exit 0) is the encoded fix. The reporter's separate observation — when `origin/HEAD` is unset, a never-pushed local branch can take the `upstream=origin/HEAD` path and `|| unpushed=0` swallows genuine work — is cite-only, not this product's primary. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92338](https://github.com/anthropics/claude-code/issues/92338)

What happened (from the issue — do not invent):

- Environment: Claude Code 2.1.261; Claude Code on the web (remote session). Hook registered as Stop in `~/.claude/launcher-settings.json`. That directory is managed and restored on re-provision — a local patch was overwritten ~6 minutes after being applied — so this cannot be fixed by users.
- `~/.claude/stop-hook-git-check.sh` selects its comparison ref with `git rev-parse "origin/$current_branch"`. That answers "does this local ref exist", not "does this branch still exist on the remote".
- After GitHub auto-deletes a squash-merged head branch, the local `origin/<branch>` tracking ref survives until pruned, still resolves, and `origin/<stale>..HEAD` counts the squash commit as unpushed.
- Stop hook then blocks every stop indefinitely with advice the agent cannot satisfy (push to a branch that no longer exists). Pushing either fails or recreates a deleted branch.
- In one session it fired three times across two branches.
- The same stale ref also made `git push --force-with-lease` fail with "stale info", since the lease was checked against a ref the remote no longer had.
- Error: `There are 1 unpushed commit(s) on branch 'claude/<branch>'. Please push these changes to the remote repository.` (hook exit code 2, repeated on every stop).
- Repro note: `git push origin --delete <branch>` does NOT reproduce — it also removes the local tracking ref. GitHub's server-side auto-delete does not, so the repro deletes the ref inside the bare remote (`git --git-dir=../remote.git update-ref -d refs/heads/feature`) to match.
- What should happen: when every commit reachable from HEAD is already contained in the default branch, the work is merged and there is nothing to push. The hook should exit 0 silently, regardless of what any stale remote-tracking ref claims.

Suggested fix from the issue (document only) — containment check against the default branch BEFORE the `unpushed=` line:

```
default_ref=""
for candidate in \
    "$(git symbolic-ref -q --short refs/remotes/origin/HEAD 2>/dev/null)" \
    origin/main origin/master; do
  if [[ -n "$candidate" ]] && git rev-parse -q --verify "$candidate" >/dev/null 2>&1; then
    default_ref="$candidate"
    break
  fi
done
if [[ -n "$default_ref" ]] && git merge-base --is-ancestor HEAD "$default_ref" 2>/dev/null; then
  exit 0
fi
```

`origin/HEAD` first, falling back to `origin/main` then `origin/master`, because `origin/HEAD` is unset in some clone shapes — including this CCR container. No placement change is needed relative to the signing block above it: that block already scopes to `HEAD --not --remotes`, which is empty once HEAD is contained in a remote ref, so it no-ops on its own here.

Naive fix WRONG: substituting the default branch as upstream (`upstream="origin/main"`) silences this case but reports every commit on a fully pushed feature branch as unpushed, since such a branch is legitimately ahead of the default branch. That is far more common than the case being fixed.

Workaround: `git fetch --prune` after a merge clears the stale ref. Note that `fetch.prune=true` does NOT help a scoped fetch — prune applies only to the refspec being fetched, so the common `git fetch origin main` prunes nothing. Measured in the issue:

- `git fetch origin main` + `fetch.prune=on` → stale ref survives, false alarm
- `git fetch origin` + `fetch.prune=on` → pruned, quiet
- either + `fetch.prune=off` → survives, false alarm

Test matrix from the issue (five scenarios: shipped / naive / suggested):

1. squash-merged, stale ref, nothing to push — shipped FAIL, naive pass, suggested pass
2. genuinely unpushed commit on a tracked branch — all pass
3. fully pushed feature branch, 2 ahead of main — shipped pass, naive FAIL, suggested pass
4. never-pushed branch with work — all pass
5. on the default branch, in sync — all pass

Separate observation (cite-only, not this product's primary): when `origin/HEAD` is unset, a never-pushed local branch can take the `upstream=origin/HEAD` path, `git rev-list` errors, and `|| unpushed=0` swallows genuine work. Present in the shipped hook and unaffected by the suggested fix.

## Why not a clone

This is specifically: **Stop hook / stale remote-tracking ref after GitHub auto-delete of a squash-merged head / phantom unpushed.**

NOT Priory ([#92345](https://github.com/anthropics/claude-code/issues/92345)) — stray `priconfig.xml` in the shipped MSIX root rings phantom Language|Scale|DXFeatureLevel packages. Jetsam is not a limestone cloister.
NOT Latchkey ([#92330](https://github.com/anthropics/claude-code/issues/92330)) — Remote Control auto-start false `/login` while refreshToken still renewable. Jetsam is not an oak latchkey board.
NOT Stubble ([#92328](https://github.com/anthropics/claude-code/issues/92328)) — Write UTF-8 LF `.cmd` + CP932 empty del / CWD wipe. Jetsam is not a stubble field.
NOT Intake ([#92305](https://github.com/anthropics/claude-code/issues/92305)) — piped stdin double-composition. Jetsam is not a kraft intake pipe.
NOT Pasteboard ([#92312](https://github.com/anthropics/claude-code/issues/92312)) — platform-conditional Alt+V image-paste miss. Jetsam is not pasteboard.
NOT Spillway ([#92311](https://github.com/anthropics/claude-code/issues/92311)) — ultracode concurrency cap bypass. Jetsam is not a dam spillway.
NOT Lagan — process fouled after the session is cast. Jetsam is tracking-ref debris, not a fouled process pile.
NOT Snub — 512-byte pipe filled before the drain child starts. Jetsam is not a pipe snub.
NOT Hawser ([process reap / MCP children](https://github.com/anthropics/claude-code/issues)) — dockyard hawser that never slips after idle. Jetsam is not an MCP reap.

Different surface: Stop-hook git comparison ref vs MSIX packaging leak vs OAuth startup-guard vs Write `.cmd` OEM wipe vs piped-stdin token double-count vs image-paste chord vs ultracode cap skip vs process fouling vs pipe snub vs MCP reap.

Cousins cite-only (NOT primary):

- [#83924](https://github.com/anthropics/claude-code/issues/83924) — Stop hook false unpushed after PR merge when head auto-deleted
- [#86018](https://github.com/anthropics/claude-code/issues/86018) — Stop hook fabricates ahead count when origin/HEAD unset after squash-merge
- [#83490](https://github.com/anthropics/claude-code/issues/83490) — Stop hook tells agent to rewrite published history after PR
- [#82624](https://github.com/anthropics/claude-code/issues/82624) — Web/CCR git stop hook two false positives
- [#86379](https://github.com/anthropics/claude-code/issues/86379) — Stop hook blocks on dirty/untracked and is reprovisioned

Backups (document only, do not build): [#92354](https://github.com/anthropics/claude-code/issues/92354) Plugin cache inherits untracked files forever; [#92353](https://github.com/anthropics/claude-code/issues/92353) UserPromptSubmit hook registered but never invoked; [#92347](https://github.com/anthropics/claude-code/issues/92347) Summarize up to here drops earlier compact summaries (data-loss); [#92335](https://github.com/anthropics/claude-code/issues/92335) Claude in Chrome silent re-auth fails after session end; [#92317](https://github.com/anthropics/claude-code/issues/92317) claude-security scan-changes wrong diff.

Product name stays **Jetsam**. Do not rename to Priory, Latchkey, Stubble, Intake, Pasteboard, Spillway, Lagan, Snub, Hawser, or any existing catalog slug.

Different UI: salt pier / weathered teak quay / seafoam + rust iron bollards + tide chart. Instrument Serif + Manrope + IBM Plex Mono. NOT Alegreya / Nunito Sans / Source Code Pro (Priory). NOT Cormorant Garamond / Outfit (Latchkey). Stay OFF limestone cloister / oak latchkey board / stubble field / kraft intake pipe / pasteboard / dam spillway / CRT blurt.

Different verbs: Score the quay, pin idle pruned, pin seeded adrift, admit the branch already jetsamed, score the prune, load fixtures, reset to pruned.

Different idle: **pruned**. Different seeded: **adrift**.

## Live catalog path

`/jetsam/` is this static stop-hook quay scoring desk. Path `https://hermes-playground-green.vercel.app/jetsam/` and subdomain `https://jetsam.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `02:50 / hermes catalog #162 / #92338`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **adrift** — stale `origin/<feature>` still resolves after remote head deleted; shipped Stop hook exit 2; phantom unpushed; naive-sub would pass this case and fail the fully-pushed feature branch; containment would exit 0.
2. Idle **pruned** → tracking-ref gone or HEAD contained in default; Stop hook exit 0; idle word pruned.
3. Desk UI: teak pier, rust bollards, tide chart, cargo crate, three-path exit scoreboard (shipped / naive / suggested), five-scenario matrix, rev-parse / merge-base / fetch-prune panes, GitHub issue chip. Adrift = crate floating, tide high, shipped exit 2. Pruned = crate gone, tide ebb, exit 0.
4. Stay-off strip: Priory / Latchkey / Stubble / Intake / Pasteboard / Spillway / Lagan / Snub / Hawser. Primary stays #92338.
5. **Score the quay** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Quay simulator chips rewrite tracking-ref (stale / pruned), containment (yes / no), ahead-of-main (0 / 2), and fetch (scoped / full).

## How to score

Open `projects/jetsam/index.html` in a browser, or serve the repo root and visit `/jetsam/` (Vercel rewrite → `/projects/jetsam`). No build step. Hook is a documentation / diagnostic fixture only:

```bash
# No live git remote. The living page scores probes in-browser.
# See projects/jetsam/hook/README.md
# Educational fixture: bash projects/jetsam/hook/stop-hook-jetsam.sh matrix
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **pruned** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **adrift**.
