# Fathom hook

Standing-rule sounding after compaction. POST `{ action, draft, board? }`; get `still`, `bound`, `drift`, `lost`, or `ack`.

This is not a muster. It does not score claim-vs-reality. It does not seize a file lease. It does not trip a spend fuse. It does not redact `tool_result`. It does not approve grants. A harness calls it after compact, on stop, or at subagent spawn. Acknowledgment is not a hold.

Idle word is **still**, never the product name.

## CLI

```bash
node projects/fathom/hook/index.mjs < sounding.json
```

Empty stdin uses the seeded compaction ack (`#89733`). Stdout is JSON: `verdict`, `state`, `idleWord`, `injection`, `sinks`.

## HTTP

```bash
node projects/fathom/hook/index.mjs --listen 8793
curl -s -X POST http://127.0.0.1:8793 \
  -H 'content-type: application/json' \
  -d '{"action":"score","draft":"Across the eight cases the average is 12.4 and the total is 99...","board":{"pins":[{"check":"forbid-total","acknowledged":true}],"compacted":true,"bound":false}}'
```

`GET /health` returns `{ product: "fathom" }`.

`action` may be `inspect`, `compact` (sets compacted, clears bound), `bind` (sets bound + inherited, returns `MUST:` injection), `score`, `acknowledge` (marks pins acknowledged), `spawn` (spawned, inherited false, bound false), or `clear` (stand the plate down to **still**).

`hook_event_name` is `SubagentStart` on spawn, `PostCompact` on compact/bind, otherwise `Stop`. `permissionDecision` is `deny` with `interrupt` on `lost`, `ack`, and `drift`.

## Harness sketch

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/fathom/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `verdict: "lost"` / `"ack"` / `"drift"` or `permissionDecision: "deny"` as a stop. A spoken acknowledgment is not proof the rule will hold after compact.

## Env

| Variable | Meaning |
| --- | --- |
| `FATHOM_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: lost-rule alarm…". Skip if still/bound. |
| `FATHOM_GITHUB_TOKEN` | Private gist `fathom-sounding.jsonl`. Absent → "Would append a GitHub sounding ledger row…". |
| `FATHOM_LINEAR_KEY` | Lost/ack/drift opens an ack ticket. Absent → demo row. Skip on still/bound. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/fathom/hook/fathom.test.mjs
```
