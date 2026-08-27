# Blot hook

PostToolUse darkroom-tray middleware. POST `{ action, tray? }`; get `clear`, `heic`, `lfs`, `spoof`, `rot`, or `replay`.

This is not a splice desk. It does not keep four MCP contacts. It does not pin standing rules. It does not seize a path. It does not score claim-vs-reality. It does not keep a muster. It does not trip a spend fuse. It does not redact `tool_result`. It does not approve grants. A harness calls it when an image frame must still be a real image.

A bad frame is not a hold. One unreadable image kills every later turn. Strip the blot. Replace the poison block with a text placeholder so the session can continue.

Idle word is **clear**, never the product name.

## CLI

```bash
node projects/blot/hook/index.mjs < tray.json
```

Empty stdin uses the seeded OSStatus spoof (`#24387`). Stdout is JSON: `verdict`, `state`, `frames`, `poison`, `sinks`.

## HTTP

```bash
node projects/blot/hook/index.mjs --listen 8850
curl -s -X POST http://127.0.0.1:8850 \
  -H 'content-type: application/json' \
  -d '{"action":"mark"}'
```

`action` may be `mark`, `strip`, `abandon`, or `clear` (empty the tray to **clear**). Nested `{ tray, action: { ... } }` is accepted. Default payload is seed `#24387`.

## Harness sketch

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/blot/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `verdict: "heic"` / `"lfs"` / `"spoof"` / `"rot"` / `"replay"` or `permissionDecision: "deny"` as a stop. A claimed image is not proof the frame is pixels.

## Env

| Variable | Meaning |
| --- | --- |
| `BLOT_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: blot alarm…". Skip if clear. |
| `BLOT_GITHUB_TOKEN` | Private gist `blot-ledger.jsonl`. Absent → "Would append a GitHub blot ledger row…". |
| `BLOT_LINEAR_KEY` | Alarm opens a recovery ticket. Absent → demo row. Skip on clear. |
| `BLOT_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/blot/hook/blot.test.mjs
```
