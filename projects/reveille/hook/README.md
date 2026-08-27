# Reveille hook

Muster-check middleware. POST a roster in; get `clear`, `hold`, or `orphan`.

This is not a spend fuse. It does not redact `tool_result`. It does not approve grants. A harness calls it with in-flight handles and artifact claims. Heartbeats survive compaction. Duplicate dispatch is held. A missed TTL is orphaned.

## CLI

```bash
node projects/reveille/hook/index.mjs < roster.json
```

Empty stdin uses the seeded collision (`compact-90036`). Stdout is JSON: `decision`, `state`, `snapshot`, `sinks`.

## HTTP

```bash
node projects/reveille/hook/index.mjs --listen 8790
curl -s -X POST http://127.0.0.1:8790 \
  -H 'content-type: application/json' \
  -d '{"session":"compact-90036","action":"dispatch","dispatch":{"id":"retry","role":"implementer","artifact":"src/auth/session.ts"},"roster":[{"id":"implementer","role":"implementer","artifact":"src/auth/session.ts","lastHeartbeat":0,"claimed":true}]}'
```

`action` may be `snapshot` (default), `heartbeat` (re-attach a handle), `compact` (count++, roster stays), `dispatch` (hold on collision), or `clear` (stand down).

## Harness sketch

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/reveille/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `decision: "hold"` or `decision: "orphan"` / `permissionDecision: "deny"` as a stop. Compaction is not a wipe.

## Env

| Variable | Meaning |
| --- | --- |
| `REVEILLE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack". |
| `REVEILLE_GITHUB_TOKEN` | Private gist / comment muster ledger. Absent → demo ledger. |
| `REVEILLE_GITHUB_REPO` | Optional `owner/name` hint. |
| `REVEILLE_LINEAR_KEY` | Missed heartbeat opens an orphan ticket. Absent → demo row. |
| `REVEILLE_LINEAR_TEAM` | Linear team id when live. |

Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/reveille/hook/muster.test.mjs
```
