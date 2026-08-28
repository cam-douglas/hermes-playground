# Assay hook

PreToolUse argument-integrity middleware. POST `{ action, charge? }`; get `sterling`, `tainted`, `absorbed`, `leaked`, `hollow`, `garbled`, `spoiled`, or `retried`.

This is not a splice desk for dropped assistant text. It is not a suture tray. It is not a wax-seal clinic. It is not an MCP cabinet. It is not a worktree gatehouse. It is not a plan fence, darkroom, sounding plate, file lease, claim board, muster, fuse, DLP veil, or grant inbox. A harness calls it when a tool call *parsed* and the delivered arguments still need to be weighed against the schema and the raw markup.

A parsed call is not a hold. Heat the envelope. Weigh delivered arguments. Name the impurity or admit **sterling**. Fail-closed on tainted / absorbed / garbled. Slack alarm on absorbed / hollow. Linear tool-assay incident on absorbed / tainted.

Idle word is **sterling**, never the product name.

## CLI

```bash
node projects/assay/hook/index.mjs < charge.json
```

Empty stdin uses the seeded tainted envelope (`#84405`). Stdout is JSON: `verdict`, `state`, `impurity`, `missing`, `residue`, `sinks`.

## HTTP

```bash
node projects/assay/hook/index.mjs --listen 9070
curl -s -X POST http://127.0.0.1:9070 \
  -H 'content-type: application/json' \
  -d '{"action":"weigh"}'
```

`action` may be `fire`, `weigh`, `admit`, `refuse`, `hold`, or `clear` (empty the cupel to **sterling**). Nested `{ charge, action: { ... } }` is accepted. Default payload is seed `#84405`.

## Harness sketch

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/assay/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat any non-`sterling` verdict, or `permissionDecision: "deny"`, as a stop. A successful parse is not proof the arguments are sterling.

## Env

| Variable | Meaning |
| --- | --- |
| `ASSAY_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: impurity alarm…". Fires on absorbed / hollow only. |
| `ASSAY_GITHUB_TOKEN` | Private gist `assay-ledger.jsonl`. Absent → "Would append a GitHub assay ledger row…". |
| `ASSAY_LINEAR_KEY` | Absorbed or tainted opens a tool-assay incident. Absent → demo row. Skip otherwise. |
| `ASSAY_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/assay/hook/assay.test.mjs
```
