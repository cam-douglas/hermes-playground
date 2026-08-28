# Chute hook

SessionStart chute-ledger scorer. POST `{ action, probe? }`; get `clear`, `typed`, `masked`, `burned`, `echoed`, `retained`, `brokered`, `vaulted`, `leaked`, or `gap`.

This is not outbound I/O DLP. It is not a permission-gate stall. It is not a pairing glass. A harness calls it when a secret may be about to enter the leaky prompt path: the only Claude Code surface is the chat box, which IS the transcript (three on-disk stores, re-sent every turn, five-year retention via /bug).

A typed secret is not a handoff. Drop it through the chute. Name the class or admit **clear**. Slack alarm on typed / burned / echoed / retained / leaked / gap. Linear ticket on burned / echoed. GitHub chute-ledger issue on every scored probe.

Idle word is **clear**, never the product name, never Tain's **paired**, never Husk's **kernel**, never Snib's **latched**, never Blot's image-tray **clear** (same token, different desk).

## CLI

```bash
node projects/chute/hook/index.mjs < probe.json
```

Empty stdin uses the seeded gap night lobby (`#90301`). Stdout is JSON: `verdict`, `state`, `reasons`, `fingerprint`, `secretName`, `secretLength`, `sinks`. The value of a secret is never present.

## HTTP

```bash
node projects/chute/hook/index.mjs --listen 9030
curl -s -X POST http://127.0.0.1:9030 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score`, `drop`, `receive`, `inject`, `admit`, or `clear` (empty the chute to **clear**). Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90301` gap. Admit does not lie: a gap probe stays gap. Inject brokers a masked intake (USE via env, never READ).

## Harness sketch

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/chute/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `typed` / `burned` / `echoed` / `retained` / `leaked` / `gap`, or `permissionDecision: "deny"`, as a stop. A secret in the prompt box is not a sanctioned handoff.

## Env

| Variable | Meaning |
| --- | --- |
| `CHUTE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: typed/burned/echoed/retained/leaked/gap alarm…". Fires on those verdicts only. |
| `CHUTE_GITHUB_TOKEN` | Chute-ledger issue (private gist `chute-ledger.jsonl`). Absent → "Would open a GitHub chute-ledger issue…". Every scored probe. |
| `CHUTE_LINEAR_KEY` | Burned / echoed opens a ticket. Absent → demo row. Skip otherwise. |
| `CHUTE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/chute/hook/chute.test.mjs
```
