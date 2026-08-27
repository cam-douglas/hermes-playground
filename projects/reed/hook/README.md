# Reed hook

PreToolUse reed-relay middleware. POST `{ action, cabinet? }`; get `open`, `set`, `stuck`, `chatter`, `leak`, or `drop`.

This is not a sounding plate. It does not seize a path. It does not score claim-vs-reality. It does not keep a muster. It does not trip a spend fuse. It does not redact `tool_result`. It does not approve grants. A harness calls it when MCP contacts must still hold.

Four contacts per server: **alive**, **handshake**, **listed**, **callable**. Connected is not registered. One served call is not a hold.

Idle word is **open**, never the product name.

## CLI

```bash
node projects/reed/hook/index.mjs < cabinet.json
```

Empty stdin uses the seeded playwright chatter (`#83838`). Stdout is JSON: `verdict`, `state`, `reeds`, `sinks`.

## HTTP

```bash
node projects/reed/hook/index.mjs --listen 8794
curl -s -X POST http://127.0.0.1:8794 \
  -H 'content-type: application/json' \
  -d '{"action":"probe","cabinet":{"reeds":[{"id":"playwright","transport":"stdio","alive":true,"handshake":true,"listed":false,"oneShot":true}]}}'
```

`action` may be `probe`, `kill`, `respawn`, `reseat`, `drop`, or `clear` (empty the cabinet to **open**). Nested `{ cabinet, action: { ... } }` is accepted.

## Harness sketch

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__.*",
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/reed/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `verdict: "stuck"` / `"chatter"` / `"leak"` / `"drop"` or `permissionDecision: "deny"` as a stop. `/mcp` saying connected is not proof the tools are registered.

## Env

| Variable | Meaning |
| --- | --- |
| `REED_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: registry alarm…". Skip if open/set. |
| `REED_GITHUB_TOKEN` | Private gist / comment reed ledger. Absent → "Would append a GitHub reed ledger row…". |
| `REED_LINEAR_KEY` | Alarm opens a reseat ticket. Absent → demo row. Skip on open/set. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/reed/hook/reed.test.mjs
```
