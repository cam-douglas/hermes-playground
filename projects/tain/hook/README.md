# Tain hook

SessionStart pairing-ledger scorer. POST `{ action, probe? }`; get `paired`, `silvered`, `ghost`, `strayed`, `claimed`, `nameless`, `stale`, `split`, or `dark`.

This is not an MCP registry cabinet. It is not a Trusted Devices latch. It is not a hollow-success threshing desk. A harness calls it when Claude-in-Chrome pairing may be one-way: the extension live-renders a session that `list_connected_browsers` returns as `[]`, two native-host manifests claim the same extension id, Cowork binds to another machine, or `isLocal` lies.

A silvered tain is not a hold. Face the glass. Name the class or admit **paired**. Slack alarm on silvered / strayed. Linear stray-browser ticket on strayed. GitHub pairing-ledger issue on every scored probe.

Idle word is **paired**, never the product name, never Husk's **kernel**, never Snib's **latched**, never Reed's **open**.

## CLI

```bash
node projects/tain/hook/index.mjs < probe.json
```

Empty stdin uses the seeded silvered night window (`#90257`). Stdout is JSON: `verdict`, `state`, `reasons`, `liveRendersSession`, `browsers`, `tainSilvered`, `sinks`.

## HTTP

```bash
node projects/tain/hook/index.mjs --listen 9025
curl -s -X POST http://127.0.0.1:9025 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score`, `face`, `lift`, `admit`, or `clear` (empty the glass to **paired**). Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90257` silvered. Admit does not lie: a one-way probe stays silvered.

## Harness sketch

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/tain/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `silvered` / `strayed` / `ghost` / `split`, or `permissionDecision: "deny"`, as a stop. A live-rendered session is not proof the agent can hear the browser.

## Env

| Variable | Meaning |
| --- | --- |
| `TAIN_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: silvered/strayed pairing alarm…". Fires on silvered / strayed only. |
| `TAIN_GITHUB_TOKEN` | Pairing-ledger issue (private gist `tain-ledger.jsonl`). Absent → "Would open a GitHub pairing-ledger issue…". Every scored probe. |
| `TAIN_LINEAR_KEY` | Strayed opens a stray-browser ticket. Absent → demo row. Skip otherwise. |
| `TAIN_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/tain/hook/tain.test.mjs
```
