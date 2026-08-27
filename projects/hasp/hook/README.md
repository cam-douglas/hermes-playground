# Hasp hook

PreToolUse file-lease middleware. POST `{ action, session, path, expectedHash?, nextHash?, board? }`; get `loose`, `seized`, `yield`, `stale`, or `clobber`.

This is not a muster. It does not score claim-vs-reality. It does not trip a spend fuse. It does not redact `tool_result`. It does not approve grants. A harness calls it before Write. Last writer must not silently win.

Idle word is **loose**, never the product name.

## CLI

```bash
node projects/hasp/hook/index.mjs < lease.json
```

Empty stdin uses the seeded worktree race (`#90146`). Stdout is JSON: `verdict`, `state`, `holder`, `session`, `path`, `currentHash`, `sinks`.

## HTTP

```bash
node projects/hasp/hook/index.mjs --listen 8792
curl -s -X POST http://127.0.0.1:8792 \
  -H 'content-type: application/json' \
  -d '{"action":"write","session":"session-b","path":".claude/worktrees/clever-jepsen-93ab22/src/wip.ts","nextHash":"b9f201","board":{"path":".claude/worktrees/clever-jepsen-93ab22/src/wip.ts","holder":"session-a","hash":"a1c4e9"}}'
```

`action` may be `inspect`, `seize`, `write`, `release`, or `clear` (stand the plate down to **loose**). Nested `{ board, action: { ... } }` is accepted.

## Harness sketch

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/hasp/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `verdict: "clobber"` / `"yield"` / `"stale"` or `permissionDecision: "deny"` as a stop. A clean git status is not proof the first session's bytes survived.

## Env

| Variable | Meaning |
| --- | --- |
| `HASP_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: clobber alarm…". Skip if loose. |
| `HASP_GITHUB_TOKEN` | Private gist / comment lease ledger. Absent → "Would append a GitHub lease ledger row…". |
| `HASP_LINEAR_KEY` | Clobber opens a lost-work ticket. Absent → demo row. Skip on loose/seized. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/hasp/hook/hasp.test.mjs
```
