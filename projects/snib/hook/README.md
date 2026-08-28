# Snib hook

SessionStart night-latch scorer. POST `{ action, probe? }`; get `latched`, `dismissed`, `revoked`, `unobserved`, `attached`, `phantom`, `open`, or `restored`.

This is not a grant inbox. It is not a file-path lease. It is not a worktree gate. It is not a heron_brook palimpsest. It is not a muster. A harness calls it when a Remote Control attachment may be cookie-only after Trusted Device revoke, or after "Not now" on "Sign in again to verify your device".

A turned snib is not a hold. Throw the snib. Name the class or admit **latched**. Fail-closed on dismissed / revoked / unobserved. Slack alarm on those three. Linear Trusted-device incident on dismissed / revoked. GitHub ledger row on every scored probe.

Idle word is **latched**, never the product name, never **locked**, never Veto's **upheld**, never Assay's **sterling**, never Wicket's **home**.

## CLI

```bash
node projects/snib/hook/index.mjs < probe.json
```

Empty stdin uses the seeded dismissed night-latch (`#90265`). Stdout is JSON: `verdict`, `state`, `reasons`, `liveSessionStillAttached`, `modalChoice`, `restored`, `sinks`.

## HTTP

```bash
node projects/snib/hook/index.mjs --listen 9026
curl -s -X POST http://127.0.0.1:9026 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score`, `throw`, `not-now`, `revoke`, `observe`, `restore`, or `clear` (empty the latch to **latched**). Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90265` dismissed.

## Harness sketch

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/snib/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `dismissed` / `revoked` / `unobserved`, or `permissionDecision: "deny"`, as a stop. A thrown snib is not proof the door is shut.

## Env

| Variable | Meaning |
| --- | --- |
| `SNIB_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: fail-open alarm…". Fires on dismissed / revoked / unobserved only. |
| `SNIB_GITHUB_TOKEN` | Private gist `snib-ledger.jsonl`. Absent → "Would append a GitHub snib ledger row…". Every scored probe. |
| `SNIB_LINEAR_KEY` | Dismissed or revoked opens a Trusted-device incident. Absent → demo row. Skip otherwise. |
| `SNIB_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/snib/hook/snib.test.mjs
```
