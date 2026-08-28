# Suture hook

PostToolUse suture-tray middleware. POST `{ action, tray? }`; get `sealed`, `torn`, `stalled`, `partial`, `resumed`, or `discarded`.

This is not a darkroom. It is not a splice desk. It does not keep four MCP contacts. It does not pin standing rules. It does not seize a path. It does not score claim-vs-reality. It does not keep a muster. It does not trip a spend fuse. It does not redact `tool_result`. It does not approve grants. A harness calls it when an SSE / streaming turn tears before `message_stop`.

A partial turn is not a hold. Last complete tool boundary is the only safe suture point. Detect tears (idle timeout / mid-response close / stall with no `message_stop`). Snapshot events up to the last complete `tool_use`↔`tool_result` pair.

Idle word is **sealed**, never the product name.

## CLI

```bash
node projects/suture/hook/index.mjs < tray.json
```

Empty stdin uses the seeded stream idle timeout (`#46987`). Stdout is JSON: `verdict`, `state`, `events`, `tear`, `checkpoint`, `sinks`.

## HTTP

```bash
node projects/suture/hook/index.mjs --listen 8950
curl -s -X POST http://127.0.0.1:8950 \
  -H 'content-type: application/json' \
  -d '{"action":"mark"}'
```

`action` may be `mark`, `suture`, `discard`, `hold`, or `clear` (empty the tray to **sealed**). Nested `{ tray, action: { ... } }` is accepted. Default payload is seed `#46987`.

## Harness sketch

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/suture/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `verdict: "torn"` / `"stalled"` / `"partial"` or `permissionDecision: "deny"` as a stop. A partial turn is not proof the stream finished.

## Env

| Variable | Meaning |
| --- | --- |
| `SUTURE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: tear alarm…". Skip if sealed / resumed / discarded. |
| `SUTURE_GITHUB_TOKEN` | Private gist `suture-ledger.jsonl`. Absent → "Would append a GitHub suture ledger row…". |
| `SUTURE_LINEAR_KEY` | Alarm opens an unrecovered-tear ticket. Absent → demo row. Skip on sealed / resumed / discarded. |
| `SUTURE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/suture/hook/suture.test.mjs
```
