# Cote hook

Resume-hub loft scorer. POST `{ action, probe? }`; get `roosted`, `lofted`, `flown`, `drained`, `parked`, `stray`, `banded`, `crossed`, `consumed`, or `late`.

This is not a stillroom. It is not a valve train. It is not a hollow SUCCESS envelope. It is not a `/btw` wing. A harness calls it when `--resume` registers the agent-team hub under a startup placeholder: `SendMessage` returns `success:true`, the inbox empties to `[]`, and the parent transcript never sees the `msg_id`.

A success receipt is not a roost. Score the loft. Name the class or admit **roosted**. Slack alarm on drained / parked / stray / crossed / consumed / late. Linear ticket on drained / parked / consumed. GitHub cote-ledger issue on every scored probe.

Idle word is **roosted**, never the product name, never Larder's **stocked**, never Tappet's **seated**, never Aside's **heard**, never Husk's **kernel**. Never **empty**.

## CLI

```bash
node projects/cote/hook/index.mjs < probe.json
```

Empty stdin uses the seeded drained loft (`#90332`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `leadSessionId`, `inboxEmptied`, `msgIdInParent`, `sinks`.

## HTTP

```bash
node projects/cote/hook/index.mjs --listen 9332
curl -s -X POST http://127.0.0.1:9332 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score`, `band`, `admit`, `load`, or `clear` (empty the loft to **roosted**). Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90332` drained. Admit does not lie: a drained probe stays drained. Band on an idle loft produces a roosted hold.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/cote/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `drained` / `parked` / `stray` / `crossed` / `consumed` / `late`, or `permissionDecision: "deny"`, as a stop. A success receipt is not a roost.

## Env

| Variable | Meaning |
| --- | --- |
| `COTE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: drained/parked/stray/crossed/consumed/late alarm…". Fires on those verdicts only. |
| `COTE_GITHUB_TOKEN` / `GITHUB_TOKEN` | Cote-ledger issue (private gist `cote-ledger.jsonl`). Absent → "Would open a GitHub cote-ledger issue…". Every scored probe. |
| `COTE_LINEAR_KEY` / `LINEAR_API_KEY` | Drained / parked / consumed opens a ticket. Absent → demo row. Skip otherwise. |
| `COTE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/cote/hook/cote.test.mjs
```
