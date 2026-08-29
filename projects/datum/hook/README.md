# Datum hook

Surveyor's-datum scorer for Claude Code built-in **code-review** skill: `/code-review` and the Skill tool diff against the wrong base branch (e.g. local `master` / `origin/master`) instead of the PR's actual merge base, so findings cite files and lines that are not part of the PR's real diff. POST `{ action, datum? }` or pipe a probe; get `level`, `wrong-base`, `scope-bleed`, `unrelated`, `master-lie`, `develop-base`, `findings-bleed`, `merge-missed`, or `skill-review`.

This is not Calque's PowerShell Spanish del false alias. It is not Fascia's trust-path consent lie. It is not Quoin's quoted-heredoc unescape. It is not Parity's generic claim-vs-reality paste-check. A harness calls it when a review is measured from the wrong datum.

A wrong base is not a hold. Score the plate. Name the class or admit **level**. Slack alarm on wrong-base / master-lie / scope-bleed / findings-bleed / unrelated / merge-missed. Linear ticket on wrong-base / master-lie / findings-bleed. GitHub datum-ledger of scored probes on every score.

Idle word is **level**, never the product name, never **empty**, never silent / mute / idle / dead / sealed / fronted, never Calque's **verbatim**, never Fascia's **fronted**, never Quoin's **locked**, never Gaff's **yanked**, never Sear's **caught**. Do not ship Datum, Bench, Trammel, Offset, Kerf, Fiducial, Staff, Gage, Plumb, Azimuth, Bearing, Transit, Sextant, Chain, Benchmark, Base, Scope, Bleed, Mergebase, or Reviewbase as the idle word.

The #90620 wrong-base plate (PR base develop + measured local master + off-diff findings + code-review skill) is **wrong-base**, never **level**. Unique nearby flags win their own seeds because those seeds do not carry the wrong-base triad.

Priority when multiple match: **wrong-base** > **master-lie** > **scope-bleed** > **findings-bleed** > **unrelated** > **merge-missed** > **skill-review** > **develop-base** > **level**.

The hook scores `{ prUrl, prBase, measuredBase, findingsTotal, findingsInDiff, findingsOffDiff, offDiffFiles[], skill, issue }` — never invents extra issues.

Primary: [anthropics/claude-code#90620](https://github.com/anthropics/claude-code/issues/90620). Related (not identical): [#82397](https://github.com/anthropics/claude-code/issues/82397) [#78257](https://github.com/anthropics/claude-code/issues/78257) [#69232](https://github.com/anthropics/claude-code/issues/69232). NOT Calque / Fascia / Quoin / Gaff / Sear / Cubby / Grille / Spile / Bollard / Clew / Sounder / Binnacle / Pirn / Cotter / Fob / Visa / Snib / Knock / Veto / Iota / Wicket / Parity.

Hypothesis (from #90620 body only): the skill uses local master instead of the PR's `baseRefName` / merge base.

## CLI

```bash
node projects/datum/hook/index.mjs < datum.json
node projects/datum/hook/index.mjs datum.json
```

Empty stdin uses the seeded #90620 wrong-base plate. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `level`, `sinks`.

## HTTP

```bash
node projects/datum/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `level` / `still` / `reset` (return idle **level**), `control` / `healthy` / `proof` / `plate` / `desk` (honest path that classifies **level** with `level` true), `ledger` / `trace` / `observe` / `score-plate` (score the plate), `restore` / `wrong-base` / `incident` (show #90620 wrong-base → **wrong-base**), or `admit`. Nested `{ datum, action: { ... } }` is accepted. Admit does not lie: a wrong-base plate stays wrong-base. Restore on an idle plate produces the #90620 wrong-base plate.

Probe: `{ session, issue, source, prUrl, prBase, measuredBase, findingsTotal, findingsInDiff, findingsOffDiff, offDiffFiles[], skill, scored }`.

Return: `{ verdict, reasons[], level }`.

`level` is true ONLY when the verdict is level (idle, or honest control: findings scoped only to files in the PR's true merge-base diff). Seeded 90620 numbers must produce wrong-base / `level=false`. Honest control with in-diff findings must produce `level=true`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/datum/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `wrong-base` / `master-lie` / `scope-bleed` / `findings-bleed` / `unrelated` / `merge-missed`, or `permissionDecision: "deny"`, as a stop. A wrong base is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `DATUM_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: wrong-base/master-lie/… alarm…". Fires on those verdicts only. |
| `DATUM_GITHUB_TOKEN` / `GITHUB_TOKEN` | Datum-ledger issue (private gist `datum-ledger.jsonl`). Absent → "Would open a GitHub datum-ledger issue…". Every scored probe. |
| `DATUM_LINEAR_KEY` / `LINEAR_API_KEY` | Wrong-base / master-lie / findings-bleed opens a plate ticket. Absent → demo row. Skip otherwise. |
| `DATUM_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/datum/hook/datum.test.mjs
```
