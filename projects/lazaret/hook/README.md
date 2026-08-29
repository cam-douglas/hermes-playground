# Lazaret hook

Bill-of-health scorer for Claude Code per-Read malware system-reminders that refuse legitimate files. POST `{ action, probe? }`; get `pratique`, `refused`, `lost`, `stranded`, `cordoned`, `yellow`, `false`, `timed`, `held`, or `passed`.

This is not early schedule dispatch. It is not path-key identity. It is not an unbounded until-loop. It is not a nested SendMessage misroute. It is not a stalled permission grant. It is not runtime DLP redaction. It is not a CLAUDE.md overlay. A harness calls it when a written reminder is not a hold, and an unattended cloud seat refuses a legitimate module.

A written reminder is not a hold. Score the desk. Name the class or admit **pratique**. Slack lazaret alarm on refused / lost / stranded / cordoned / yellow / false / timed. Linear ticket on refused / lost / stranded / false. GitHub lazaret-ledger issue on every scored probe.

Idle word is **pratique**, never the product name, never **empty**, never Fusee's **wound**, never Iota's **bound**. Do not ship Quarantine, Cordon, Lazaretto, Plague, Yellow, Flag, Pratique (as a product name), Pest, Hospital, Infirmary, Isolation, Lockdown, Malware, Reminder, Refuse, Safety, Yellowjack, Jack, Quebec, Bill, Health, Scrim, Knock, or Veto.

## CLI

```bash
node projects/lazaret/hook/index.mjs < probe.json
```

Empty stdin uses the seeded lost bill (`#90326`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `pratique`, `refused`, `lost`, `sinks`.

## HTTP

```bash
node projects/lazaret/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `stamp`, `bail` / `pratique` / `still` (return idle **pratique**), `passed` / `proof` / `grant` (human confirmed, work proceeded → **passed**), `ledger` / `trace` / `observe` / `sound` (sound the bill), `bill` / `lantern` / `jack` (show #90326 lost strike → **lost**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90326` lost. Admit does not lie: a lost probe stays lost. Bill on an idle quay produces a lost strike.

Probe: `{ reminderFired, fileKind:"legitimate"|"unknown"|"malware", refused, humanPresent, confirmationRequested, confirmationReceived, budgetMs, stalledMs, timedOut, workDone, observed, session, source, issue, scored }`.

Return: `{ verdict, reasons[], cluster[], pratique, refused, lost }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/lazaret/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `refused` / `lost` / `stranded` / `cordoned` / `yellow` / `false` / `timed`, or `permissionDecision: "deny"`, as a stop. A written reminder is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `LAZARET_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: refused/lost/stranded/cordoned/yellow/false/timed alarm…". Fires on those verdicts only. |
| `LAZARET_GITHUB_TOKEN` / `GITHUB_TOKEN` | Lazaret-ledger issue (private gist `lazaret-ledger.jsonl`). Absent → "Would open a GitHub lazaret-ledger issue…". Every scored probe. |
| `LAZARET_LINEAR_KEY` / `LINEAR_API_KEY` | Refused / lost / stranded / false opens a bill ticket. Absent → demo row. Skip otherwise. |
| `LAZARET_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/lazaret/hook/*.test.mjs
```
