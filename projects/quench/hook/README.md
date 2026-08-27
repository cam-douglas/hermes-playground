# Quench hook

Usage-snapshot circuit breaker. POST burn in; get `continue` or `kill`.

This is not a permission gate. It does not redact `tool_result`. A harness calls it with tokens-by-source. If the fuse is blown, the answer is a hard kill.

## CLI

```bash
node projects/quench/hook/index.mjs < snapshot.json
```

Empty stdin uses the seeded 82-agent runaway (`fanout-83025`). Stdout is JSON: `decision`, `state`, `snapshot`, `sinks`.

## HTTP

```bash
node projects/quench/hook/index.mjs --listen 8788
curl -s -X POST http://127.0.0.1:8788 \
  -H 'content-type: application/json' \
  -d '{"session":"fanout-83025","sources":{"parent":842000,"subagents":2614000,"hooks":184000,"workflows":544000}}'
```

`action` may be `snapshot` (default), `kill` (throw the breaker), or `raise` (lift the fuse 1.4×).

## Harness sketch

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/quench/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `decision: "kill"` / `permissionDecision: "deny"` as a hard stop. A 99% banner is not a stop.

## Env

| Variable | Meaning |
| --- | --- |
| `QUENCH_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack". |
| `QUENCH_GITHUB_TOKEN` | Private gist / comment spend ledger. Absent → demo ledger. |
| `QUENCH_GITHUB_REPO` | Optional `owner/name` hint. |
| `QUENCH_LINEAR_KEY` | Trip opens a quota-blown ticket. Absent → demo row. |
| `QUENCH_LINEAR_TEAM` | Linear team id when live. |

Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/quench/hook/fuse.test.mjs
```
