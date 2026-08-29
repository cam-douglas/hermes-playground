# Datum

Surveyor's **datum** desk — a field leveling plate where every finding is measured from a declared reference — for a real Claude Code defect: **the built-in `code-review` skill (via `/code-review` and the Skill tool) diffs against the wrong base branch (e.g. local `master`/`origin/master`) instead of the PR's actual merge base, so review findings cite files and lines that are not part of the PR's real diff (scope bleed from already-merged history).**

Primary: [anthropics/claude-code#90620](https://github.com/anthropics/claude-code/issues/90620) (OPEN, filed 2026-08-29, labels bug/has repro/area:skills). Title: code-review skill diffs against wrong base branch, pulls in unrelated files as findings. Deterministic repro:

```
/code-review https://github.com/seismic/email-background-worker/pull/254
```

PR base is `develop` (not master). `/code-review` on the PR URL returns findings for files absent from `gh pr diff`. Run 1 admitted "PR's actual base is develop… Diffing against local master pulled in ~50 unrelated commits" yet still reported findings from that history (`SendEmailCommandHandler.cs:83`). Run 2: 7 findings, only 2 in the real PR diff. Off-diff files: `GovernanceWorkflowMappingProfile.cs`, `ProcessEmailArchivalCommandHandler.cs`, `LibraryServiceClient.cs`, `SendEmailCommandHandler.cs`, `GovernanceWorkflowPayloadConverter.cs`.

Hypothesis (from #90620 body only — not independently verified beyond that report): the skill uses local master instead of the PR's `baseRefName` / merge base.

A wrong base is not a hold. Score the plate or admit **level**.

Idle word: **level** (true merge-base; findings only from the PR's actual diff; hold is quiet).
NEVER use the product name datum / empty / silent / mute / idle / dead / sealed / fronted / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / bound / stilled / stabled / drained / flat / fit / spoilt / laid / unlinked / tight / banked / roosted / stocked / seated / heard / clear / paired / kernel / latched / upheld / sterling / home / valid / dry / quiet / seised / rung / moored / verbatim / calqued as the idle/state word.

Verdicts: **level**, **wrong-base**, **scope-bleed**, **unrelated**, **master-lie**, **develop-base**, **findings-bleed**, **merge-missed**, **skill-review**. Slack alarm on wrong-base / master-lie / scope-bleed / findings-bleed / unrelated / merge-missed. Linear ticket on wrong-base / master-lie / findings-bleed. GitHub datum-ledger of scored probes on every score.

The #90620 wrong-base plate (PR base develop + measured local master + off-diff findings + code-review skill) is **wrong-base**, never **level**. Unique nearby flags win their own seeds because those seeds do not carry the wrong-base triad. Measured against master while the PR base is develop, without the triad → **master-lie**. Named files absent from `gh pr diff`, bases match, not majority → **scope-bleed**. Majority off-diff (e.g. 5 of 7) → **findings-bleed**. Findings from already-merged history, none in this PR → **unrelated**. `baseRefName` available but unused → **merge-missed**. Invoked via `/code-review` → **skill-review**. PR actual base is develop (control fact) → **develop-base**. Honest control with findings scoped only to the true merge-base diff → **level**.

## Why not a clone

NOT **Calque** — PowerShell Spanish del false alias #90645.
NOT **Fascia** — trust-path consent lie #90638.
NOT **Quoin** — Bash quoted-heredoc unescape #90630.
NOT **Gaff** — timeout-kill false complete #90616.
NOT **Sear** — inert set -e #90611.
NOT **Cubby** / **Grille** / **Spile** / **Bollard** / **Clew** / **Sounder** / **Binnacle** / **Pirn** / **Cotter**.
NOT **Fob** (keychain split) / **Visa** (RFC 8707) / **Snib** / **Knock** / **Veto** (auth).
NOT **Iota** / **Wicket** (path-key / worktree trust).
NOT **Parity** (claim vs reality paste-check) — Datum is specifically review-scope / merge-base, not generic claim-vs-reality.
Do NOT ship leftover woodworking / millimetre-slider clones.
Do NOT ship alternate names Bench, Trammel, Offset, Kerf, Fiducial, Staff, Gage, Plumb, Azimuth, Bearing, Transit, Sextant, Chain, Benchmark, Base, Scope, Bleed, Mergebase, Reviewbase. Product name is **Datum** only.

Different problem: code-review skill measures findings from the wrong datum (local master) instead of the PR merge base → scope bleed.
Different UI: surveyor's field desk / brass leveling plate / benchmark stake — topo map grid, stamped elevations, plumb bob idle. Fonts: Special Elite + Barlow Condensed + Share Tech Mono.
Different idle word: **level**.

## Live catalog path

`/datum/` is this static surveyor's datum desk. Brass leveling plate, topo grid, stamped elevations. Demo works with no secrets and no npm. Mark: `09:50 Sydney · datum`.

1. Seeded `#90620` **wrong-base** is already on the plate: PR `email-background-worker#254` base `develop`, measured `master`, 7 findings / 2 in diff → **wrong-base**. Never level.
2. Switch **master-lie** — review measured against master while the PR base is develop, without the off-diff triad.
3. Switch **scope-bleed** — findings cite named files absent from `gh pr diff`; bases match; not a majority.
4. Switch **findings-bleed** — majority of returned findings are off-diff (5 of 7).
5. Switch **unrelated** — findings come from already-merged history; none in this PR.
6. Switch **merge-missed** — `gh pr view --json baseRefName` was available but unused.
7. Switch **skill-review** — invoked via built-in code-review skill / `/code-review` / Skill tool.
8. Switch **develop-base** — PR's actual base is develop (control fact).
9. Switch **honest level** — findings scoped only to the PR's true merge-base diff → **level** true.
10. **Score** scores. **Admit level** scores honestly. **Restore · #90620** shows the wrong-base plate. Admit does not lie.

## Hook

`projects/datum/hook/` scores a probe `{ prUrl, prBase, measuredBase, findingsTotal, findingsInDiff, findingsOffDiff, offDiffFiles[], skill, issue }` and returns `{ verdict, reasons[], level }`. See `hook/README.md`.

```bash
node projects/datum/hook/index.mjs --listen 9090
node --test projects/datum/hook/datum.test.mjs
```

`level` is true ONLY when the verdict is level (idle, or honest control: findings scoped only to files in the PR's true merge-base diff). Seeded 90620 numbers must produce wrong-base / `level=false`. Honest control with in-diff findings produces `level=true`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90620](https://github.com/anthropics/claude-code/issues/90620) — OPEN, filed 2026-08-29, labels bug/has repro/area:skills. Title: code-review skill diffs against wrong base branch, pulls in unrelated files as findings.

Same-class nearby (complementary, not identical — cite as priors, not as the product problem):

- [anthropics/claude-code#82397](https://github.com/anthropics/claude-code/issues/82397) — project skill named code-review silently shadows built-in /code-review (shadowing, not wrong base).
- [anthropics/claude-code#78257](https://github.com/anthropics/claude-code/issues/78257) — /code-review ignores effort argument.
- [anthropics/claude-code#69232](https://github.com/anthropics/claude-code/issues/69232) — two first-party /code-review commands collide.

Hypothesis from #90620 body: the skill (or its internal review sub-agents) computes the diff/scope against the wrong base ref (e.g. local `master`, or full repo history) instead of the PR's actual merge base.

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Calque. PowerShell Spanish del false alias.
- NOT Fascia. Trust-path consent lie.
- NOT Quoin. Bash quoted-heredoc unescape.
- NOT Gaff / Sear. Timeout-kill false complete / inert set -e.
- NOT Fob / Visa / Snib / Knock / Veto. Keychain / RFC 8707 / auth.
- NOT Iota / Wicket. Path-key / worktree trust.
- NOT Parity. Generic claim-vs-reality paste-check.

## Integrations

Slack alarm on wrong-base / master-lie / scope-bleed / findings-bleed / unrelated / merge-missed. Linear ticket on wrong-base / master-lie / findings-bleed. GitHub datum-ledger of scored probes on every score. Demo mode needs no Slack / GitHub / Linear secrets and no npm. Native stubs fire in the UI (ledger tape / alarm card) without requiring live tokens.
