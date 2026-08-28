# Leat hook

Race scorer for Claude Code Bash-tool guidance that steers agents from a bounded `sleep N` into an unbounded `until`-loop, which then becomes an unkillable background task lasting days and blocking app restart. POST `{ action, probe? }`; get `stilled`, `racing`, `unbounded`, `promoted`, `lingering`, `flooded`, `spun`, `capped`, `live`, or `shut`.

This is not a nested SendMessage misroute. It is not literal `dev/null/` LFS hook litter. It is not a spend-kill fuse. A harness calls it when a blocked `sleep` is answered with `until <check>; do sleep 2; done`, the loop has no iteration cap, and the foreground timeout promotes it to a background task that is still live days later.

A blocked sleep is not a hold. Score the race. Name the class or admit **stilled**. Slack leat alarm on racing / unbounded / promoted / lingering / flooded / live. Linear ticket on racing / unbounded / promoted / lingering. GitHub leat-ledger issue on every scored probe.

Idle word is **stilled**, never the product name, never **empty**, never Shunt's **stabled**, never Sump's **drained**. Do not ship Millrace, Flume, Sluice, Culvert, Weir, Noria, Capstan, Flywheel, Eddy, Gyre, Quern, Lade, Tread, Spindle, Rotor, Whorl, Gimbal, Ratchet, Escapement, Verge, Fusee, Pallet, Points, Frog, Wye, Siding, Drain, Null, Sink, Gutter, Pit, Ash, Ashcan, Bung, Void, Limbo, or Oubliette.

## CLI

```bash
node projects/leat/hook/index.mjs < probe.json
```

Empty stdin uses the seeded racing channel (`#90475`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `stilled`, `racing`, `unbounded`, `sinks`.

## HTTP

```bash
node projects/leat/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `stamp`, `bail` / `stilled` / `still` (return idle **stilled**), `shut` / `taskstop` / `kill` (TaskStop closed the race → **shut**), `ledger` / `trace` / `observe` / `sound` (sound the race), `race` / `channel` / `gate` (show #90475 racing channel → **racing**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90475` racing. Admit does not lie: a racing probe stays racing. Race on an idle gate produces a racing channel.

Probe: `{ sleepBlocked, recommendedUntil, hasIterationCap, hasDeadline, foregroundTimeoutMs, promotedToBackground, backgroundStillLive, daysAlive, restartBlocked, taskCount, ppidOne, outputUnlinked, wroteUntilLoop, spunCpu, taskStopped, outputMtimeLive, observed, session, source, issue, scored }`.

Return: `{ verdict, reasons[], cluster[], stilled, racing, unbounded }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/leat/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `racing` / `unbounded` / `promoted` / `lingering` / `flooded` / `live`, or `permissionDecision: "deny"`, as a stop. A blocked sleep is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `LEAT_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: racing/unbounded/promoted/lingering/flooded/live alarm…". Fires on those verdicts only. |
| `LEAT_GITHUB_TOKEN` / `GITHUB_TOKEN` | Leat-ledger issue (private gist `leat-ledger.jsonl`). Absent → "Would open a GitHub leat-ledger issue…". Every scored probe. |
| `LEAT_LINEAR_KEY` / `LINEAR_API_KEY` | Racing / unbounded / promoted / lingering opens a race ticket. Absent → demo row. Skip otherwise. |
| `LEAT_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/leat/hook/*.test.mjs
```
