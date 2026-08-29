# Sear hook

Gunsmith-sear scorer for Claude Code Bash-tool `set -e` that is structurally inert: the user command runs inside `eval '...'` that is a non-final member of a `&&` list in the tool wrapper, so POSIX/bash suppress errexit for the whole script (and subshells). POST `{ action, sear? }` or pipe a probe; get `caught`, `inert`, `survived`, `nonfinal`, `phantom-ok`, `continued`, `wiped`, `chained`, `freshbash`, or `suppressed`.

This is not Spile's hook stdin wedge. It is not Grille's Bash-steered edits. It is not Scant's PATH truncation. A harness calls it when a fallen sear is not a hold, and fail-fast never fired.

A fallen sear is not a hold. Score the bench. Name the class or admit **caught**. Slack alarm on inert / survived / nonfinal / phantom-ok / continued / wiped / suppressed. Linear ticket on wiped / phantom-ok / inert. GitHub sear-ledger of scored probes on every score.

Idle word is **caught**, never the product name, never **empty**, never silent / mute / idle / dead, never Cubby's **stowed**, never Grille's **posted**, never Spile's **bunged**. Do not ship Sear, Trap, Fuse, Fusee, Pawl, Detent, Trip, Catch, Escapement, Trigger, Hammer, Striker, Hairpin, Bail, Dog, Chock, Latch, Keeper, Deadman, Failsafe, Errexit, Stopcock, Governor, Ratchet, Tripwire, Snubber, or Sear-block as the idle word.

The #90611 inert bench (set -e present, eval in non-final &&, false then echo survived, tool exit 0, wipe after failed cp) is **inert**, never **caught**. Unique nearby flags win their own seeds because those seeds do not carry the inert pentad.

Priority when multiple match: **inert** > **wiped** > **survived** > **phantom-ok** > **continued** > **nonfinal** > **suppressed** > **chained** > **freshbash** > **caught**.

The hook scores set -e presence, wrapper eval-nonfinal &&, survived-echo, phantom-ok exit, continued-past-fail, wipe-after-failed-cp, &&-chain workaround, bash -ec workaround, and subshell survival — never invents extra issues.

Primary: [anthropics/claude-code#90611](https://github.com/anthropics/claude-code/issues/90611). Nearby (not the same bug): [#90118](https://github.com/anthropics/claude-code/issues/90118) (Bash result channel lies/drops) [#62297](https://github.com/anthropics/claude-code/issues/62297) (exit 144 misreported). NOT Spile / Grille / Scant / Sounder / Leat / Clew / Cubby / Bollard. Cross-ecosystem: [openai/codex#34866](https://github.com/openai/codex/issues/34866) [#41534](https://github.com/openai/codex/issues/41534).

## CLI

```bash
node projects/sear/hook/index.mjs < sear.json
node projects/sear/hook/index.mjs sear.json
```

Empty stdin uses the seeded #90611 inert bench. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `caught`, `sinks`.

## HTTP

```bash
node projects/sear/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `caught` / `still` / `reset` (return idle **caught**), `control` / `healthy` / `proof` / `gunsmith` / `bench` (fresh-bash / final-member path that classifies **caught** with `caught` true), `ledger` / `trace` / `observe` / `score-bench` (score the bench), `restore` / `inert` / `incident` (show #90611 inert → **inert**), or `admit`. Nested `{ sear, action: { ... } }` is accepted. Admit does not lie: an inert bench stays inert. Restore on an idle bench produces the #90611 inert bench.

Probe: `{ session, issue, source, setEPresent, wrapperEvalNonFinalAnd, falseThenEchoSurvived, toolExitZeroDespiteMidFail, continuedPastFail, wipeAfterFailedCopy, chainedWorkaround, freshBashEc, subshellAlsoSurvived, scored }`.

Return: `{ verdict, reasons[], caught }`.

`caught` is true ONLY when set -e would actually abort (fresh bash -ec / final-member context) and the verdict is not a failure class. Seeded 90611 numbers must produce inert / `caught=false`. Control fresh-bash / final-member path must produce `caught=true`. Freshbash classifies **freshbash** with `caught=false` (recovery, not idle control).

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/sear/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `inert` / `survived` / `nonfinal` / `phantom-ok` / `continued` / `wiped` / `suppressed`, or `permissionDecision: "deny"`, as a stop. A fallen sear is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `SEAR_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: inert/survived/… alarm…". Fires on those verdicts only. |
| `SEAR_GITHUB_TOKEN` / `GITHUB_TOKEN` | Sear-ledger issue (private gist `sear-ledger.jsonl`). Absent → "Would open a GitHub sear-ledger issue…". Every scored probe. |
| `SEAR_LINEAR_KEY` / `LINEAR_API_KEY` | Wiped / phantom-ok / inert opens a bench ticket. Absent → demo row. Skip otherwise. |
| `SEAR_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/sear/hook/sear.test.mjs
```
