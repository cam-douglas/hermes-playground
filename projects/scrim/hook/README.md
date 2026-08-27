# Scrim hook

PostToolUse / tool-result middleware. POST a payload in; get the same shape back with secrets veiled.

This is not a permission gate. It does not approve or deny tools. It redacts `tool_result`, stdio, and jsonl **before** the next model turn, the transcript on disk, or a Slack/GitHub sink.

## CLI

```bash
node projects/scrim/hook/index.mjs < payload.json
```

Stdin may be JSON or raw text. Stdout is JSON: `redacted`, `findings` (forensic ids), `sinks`.

## HTTP

```bash
node projects/scrim/hook/index.mjs --listen 8787
curl -s -X POST http://127.0.0.1:8787 \
  -H 'content-type: application/json' \
  -d '{"hook_event_name":"PostToolUse","tool_name":"Read","tool_result":{"content":"token ghp_ plus a DEMO suffix"}}'
```

## Claude Code settings

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/scrim/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

## Env

| Variable | Meaning |
| --- | --- |
| `SCRIM_SLACK_WEBHOOK` | Incoming webhook. Absent → ledger row "would post to Slack". |
| `SCRIM_GITHUB_TOKEN` | Creates a private gist ledger. Absent → demo ledger. |
| `SCRIM_GITHUB_REPO` | Optional `owner/name` hint. |
| `SCRIM_LINEAR_KEY` | High-severity family opens a rotate ticket. Absent → demo row. |
| `SCRIM_LINEAR_TEAM` | Linear team id when live. |

Missing keys keep the hook in honest demo mode. The catalog static page never needs them.
