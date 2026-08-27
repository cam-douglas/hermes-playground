# Parity hook

Claim-check middleware. POST a claim plus probes; get `match`, `drift`, `unverified`, `fabricated`, or idle `even`.

This is not a spend fuse. It does not redact `tool_result`. It does not approve grants. A harness calls it with what the agent asserted and what GitHub / Vercel / Linear / a functional probe actually show. Cosmetic green is not enough. Unchecked channels do not downgrade a decided board.

## CLI

```bash
node projects/parity/hook/index.mjs < claim.json
```

Empty stdin uses the seeded false completion (`claim-40861`). Stdout is JSON: `verdict`, `state`, `claim`, `channels`, `sinks`.

## HTTP

```bash
node projects/parity/hook/index.mjs --listen 8791
curl -s -X POST http://127.0.0.1:8791 \
  -H 'content-type: application/json' \
  -d '{"session":"claim-40861","text":"Deployed and working. Outreach bot fixed.","claims":{"deployed":true,"working":true},"probes":{"github":{"checked":true,"deployStatus":"success","cosmetic":true},"vercel":{"checked":true,"ready":true,"cosmetic":true},"linear":{"checked":false},"functional":{"checked":true,"messagesSent":0}}}'
```

`action` may be `check` (default) or `clear` (stand the board down to **even**).

## Harness sketch

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/parity/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `verdict: "drift"` or `verdict: "fabricated"` / `permissionDecision: "deny"` as a stop. A green deploy banner is not a match.

## Env

| Variable | Meaning |
| --- | --- |
| `PARITY_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack". |
| `PARITY_GITHUB_TOKEN` | Private gist / comment claim ledger. Absent → demo ledger. |
| `PARITY_GITHUB_REPO` | Optional `owner/name` hint. |
| `PARITY_LINEAR_KEY` | Drift / fabricated opens a reality ticket. Absent → demo row. |
| `PARITY_LINEAR_TEAM` | Linear team id when live. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/parity/hook/parity.test.mjs
```
