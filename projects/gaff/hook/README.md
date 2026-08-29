# Gaff hook

Vaudeville-gaff scorer for Claude Code background Bash that the harness kills (timeout, SIGKILL of the process group, or turn-boundary reap) and then reports as a successful completion: status completed, exit code 0. POST `{ action, gaff? }` or pipe a playbill; get `yanked`, `billed`, `truncated`, `midloop`, `sigkilled`, `group-reaped`, `turn-killed`, `empty-ok`, or `hours-lost`.

This is not Spile's unenforced timeout. It is not Sounder's missing wakeup. It is not Sear's inert `set -e`. A harness calls it when a billed full house is not a hold, and the receipt lied.

A billed full house is not a hold. Score the crook. Name the class or admit **yanked**. Slack alarm on billed / truncated / empty-ok / hours-lost / sigkilled. Linear ticket on billed / hours-lost. GitHub gaff-ledger of scored playbills on every score.

Idle word is **yanked**, never the product name, never **empty**, never silent / mute / idle / dead, never Sear's **caught**, never Cubby's **stowed**, never Grille's **posted**, never Spile's **bunged**. Do not ship Gaff, Crook, Hook, Cane, Usher, Curtain, Wings, or Bill as the idle word.

The #90616 billed stage (timeout/harness-kill + completed + exit 0) is **billed**, never **yanked**. Unique nearby flags win their own seeds because those seeds do not carry the billed pentad.

Priority when multiple match: **billed** > **hours-lost** > **sigkilled** > **empty-ok** > **group-reaped** > **turn-killed** > honest yanked-hold > **midloop** > **truncated** > **yanked**.

The hook scores a task-notification (XML or #90616 prose) plus an optional captured-output tail and wrapper/trace — never invents extra issues.

Primary: [anthropics/claude-code#90616](https://github.com/anthropics/claude-code/issues/90616). Same class: [#87055](https://github.com/anthropics/claude-code/issues/87055) [#88754](https://github.com/anthropics/claude-code/issues/88754). Nearby silence (not this): [#84625](https://github.com/anthropics/claude-code/issues/84625) [#90490](https://github.com/anthropics/claude-code/issues/90490). NOT Spile / Sounder / Sear / Leat / Quench / Knock / Reveille. Cross-ecosystem: [openai/codex#19309](https://github.com/openai/codex/issues/19309).

## CLI

```bash
node projects/gaff/hook/index.mjs < gaff.json
node projects/gaff/hook/index.mjs gaff.json
```

Empty stdin uses the seeded #90616 billed stage. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `yanked`, `sinks`.

## HTTP

```bash
node projects/gaff/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `yanked` / `still` / `reset` (return idle **yanked**), `control` / `healthy` / `proof` / `house` / `stage` (honest timed_out/nonzero that classifies **yanked** with `yanked` true), `ledger` / `trace` / `observe` / `score-stage` (score the stage), `restore` / `billed` / `incident` (show #90616 billed → **billed**), or `admit`. Nested `{ gaff, action: { ... } }` is accepted. Admit does not lie: a billed stage stays billed. Restore on an idle stage produces the #90616 billed stage.

Probe: `{ session, issue, source, notification, outputTail, wrapperTrace, reportedStatus, exitCode, timeoutKilled, harnessKill, outputTruncated, midloopPrefix, trapsNeverFired, afterMarkerMissing, processGroupReaped, turnBoundary, statusMismatch, emptyOutput, remainingUnits, userToldSuccess, donePresent, scored }`.

Return: `{ verdict, reasons[], yanked }`.

`yanked` is true ONLY when the kill is reported as a kill (timed_out/killed + nonzero) OR there was no kill and DONE is present OR the desk is idle, and the verdict is yanked. Seeded 90616 numbers must produce billed / `yanked=false`. Control timed_out/nonzero must produce `yanked=true`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/gaff/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `billed` / `truncated` / `empty-ok` / `hours-lost` / `sigkilled`, or `permissionDecision: "deny"`, as a stop. A billed full house is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `GAFF_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: billed/truncated/… alarm…". Fires on those verdicts only. |
| `GAFF_GITHUB_TOKEN` / `GITHUB_TOKEN` | Gaff-ledger issue (private gist `gaff-ledger.jsonl`). Absent → "Would open a GitHub gaff-ledger issue…". Every scored playbill. |
| `GAFF_LINEAR_KEY` / `LINEAR_API_KEY` | Billed / hours-lost opens a house ticket. Absent → demo row. Skip otherwise. |
| `GAFF_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/gaff/hook/gaff.test.mjs
```
