# Fusee hook

Dial scorer for Claude Code scheduled tasks that dispatch ahead of their configured fireAt / cron slot. POST `{ action, probe? }`; get `wound`, `early`, `sprung`, `raced`, `ahead`, `jumped`, `premature`, `voided`, `held`, or `true`.

This is not path-key identity. It is not an unbounded until-loop. It is not a nested SendMessage misroute. A harness calls it when a written cronExpression or fireAt is not a hold, and the scheduler fires days or hours before the configured slot.

A written cron / fireAt is not a hold. Score the dial. Name the class or admit **wound**. Slack fusee alarm on early / sprung / raced / ahead / jumped / premature / voided. Linear ticket on early / sprung / raced / ahead / premature. GitHub fusee-ledger issue on every scored probe.

Idle word is **wound**, never the product name, never **empty**, never Iota's **bound**, never Leat's **stilled**. Do not ship Escapement, Pallet, Gnomon, Tocsin, Clepsydra, Mainspring, Arbor, Barrel, Crown, Stem, Dial, Strike, Chime, Horology, Chronometer, Premature, Ahead, Jump, Race, Early, Sprung, Clock, Watch, Timer, Cron, Schedule, Alarm, Bell, or Fuse.

## CLI

```bash
node projects/fusee/hook/index.mjs < probe.json
```

Empty stdin uses the seeded early dial (`#90485`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `wound`, `early`, `sprung`, `sinks`.

## HTTP

```bash
node projects/fusee/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `stamp`, `bail` / `wound` / `still` (return idle **wound**), `true` / `proof` / `honor` (configured time matches dispatch → **true**), `ledger` / `trace` / `observe` / `sound` (sound the dial), `dial` / `wind` / `key` (show #90485 early strike → **early**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90485` early. Admit does not lie: an early probe stays early. Dial on an idle arbor produces an early strike.

Probe: `{ configuredAt, dispatchedAt, kind:"cron"|"fireAt", cronExpression, fireAt, earlyByMs, guardCaught, lastRunAt, nextRunAt, reportedSuccess, workDone, observed, session, source, issue, scored }`.

Return: `{ verdict, reasons[], cluster[], wound, early, sprung }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/fusee/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `early` / `sprung` / `raced` / `ahead` / `jumped` / `premature` / `voided`, or `permissionDecision: "deny"`, as a stop. A written cron is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `FUSEE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: early/sprung/raced/ahead/jumped/premature/voided alarm…". Fires on those verdicts only. |
| `FUSEE_GITHUB_TOKEN` / `GITHUB_TOKEN` | Fusee-ledger issue (private gist `fusee-ledger.jsonl`). Absent → "Would open a GitHub fusee-ledger issue…". Every scored probe. |
| `FUSEE_LINEAR_KEY` / `LINEAR_API_KEY` | Early / sprung / raced / ahead / premature opens a dial ticket. Absent → demo row. Skip otherwise. |
| `FUSEE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/fusee/hook/*.test.mjs
```
