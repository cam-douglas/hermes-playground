# Coda hook

PostToolUse splice-desk middleware. POST `{ action, galley? }`; get `intact`, `snip`, `split`, `void`, `swallow`, or `raw`.

This is not a reed-relay cabinet. It does not pin standing rules. It does not seize a path. It does not score claim-vs-reality. It does not keep a muster. It does not trip a spend fuse. It does not redact `tool_result`. It does not approve grants. A harness calls it when delivered assistant text must still be the whole.

A last text block is not a hold. max_tokens is not a truncation marker. Swallowed mid-turn text cannot be spliced from the JSONL — it was never persisted.

Idle word is **intact**, never the product name.

## CLI

```bash
node projects/coda/hook/index.mjs < galley.json
```

Empty stdin uses the seeded max_tokens split (`#81838`). Stdout is JSON: `verdict`, `state`, `delivered`, `whole`, `sinks`.

## HTTP

```bash
node projects/coda/hook/index.mjs --listen 8795
curl -s -X POST http://127.0.0.1:8795 \
  -H 'content-type: application/json' \
  -d '{"action":"mark"}'
```

`action` may be `mark`, `splice`, or `clear` (empty the galley to **intact**). Nested `{ galley, action: { ... } }` is accepted. Default payload is seed `#81838`.

## Harness sketch

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/coda/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `verdict: "snip"` / `"split"` / `"void"` / `"swallow"` / `"raw"` or `permissionDecision: "deny"` as a stop. The last text block is not proof the parent received the whole.

## Env

| Variable | Meaning |
| --- | --- |
| `CODA_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: splice alarm…". Skip if intact. |
| `CODA_GITHUB_TOKEN` | Private gist `coda-ledger.jsonl`. Absent → "Would append a GitHub coda ledger row…". |
| `CODA_LINEAR_KEY` | Alarm opens a recovery ticket. Absent → demo row. Skip on intact. |
| `CODA_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/coda/hook/coda.test.mjs
```
