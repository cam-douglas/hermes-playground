# Sigil hook

PostToolUse signature-clinic middleware. POST `{ action, desk? }`; get `valid`, `hollow`, `unsigned`, `wedged`, `stripped`, or `resume-safe`.

This is not a plan fence. It is not a suture tray. It is not a darkroom. It is not a splice desk. It does not keep four MCP contacts. It does not pin standing rules. It does not seize a path. It does not score claim-vs-reality. It does not keep a muster. It does not trip a spend fuse. It does not redact `tool_result`. It does not approve grants. It is not a leftover woodworking slider. It is not a compaction-vault transcript wipe (Ark). A harness calls it when thinking / `redacted_thinking` / reasoning blocks would poison resume.

Hollow or unsigned thinking is not a hold. Scan assistant content blocks. Classify poison. Strip or quarantine. Never invent signatures. Preserve `text` / `tool_use` / `tool_result` byte-stable. If a message would be empty after the drop, insert a placeholder text block.

Idle word is **valid**, never the product name.

## CLI

```bash
node projects/sigil/hook/index.mjs < desk.json
```

Empty stdin uses the seeded hollow signature case (`#63147`). Stdout is JSON: `verdict`, `state`, `content`, `findings`, `poison`, `sinks`.

## HTTP

```bash
node projects/sigil/hook/index.mjs --listen 9050
curl -s -X POST http://127.0.0.1:9050 \
  -H 'content-type: application/json' \
  -d '{"action":"mark"}'
```

`action` may be `mark`, `strip`, `quarantine`, `hold`, or `clear` (empty the desk to **valid**). Nested `{ desk, action: { ... } }` is accepted. Default payload is seed `#63147`.

## Harness sketch

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/sigil/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `verdict: "hollow"` / `"unsigned"` / `"wedged"` or `permissionDecision: "deny"` as a stop. A signed empty thinking block is not proof the session can resume.

## Env

| Variable | Meaning |
| --- | --- |
| `SIGIL_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: brick alarm…". Skip if valid / stripped / resume-safe. |
| `SIGIL_GITHUB_TOKEN` | Private gist `sigil-ledger.jsonl`. Absent → "Would append a GitHub repair ledger row…". Always written on repair. |
| `SIGIL_LINEAR_KEY` | Wedged opens a wedged-session incident. Absent → demo row. Skip unless wedged. |
| `SIGIL_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/sigil/hook/sigil.test.mjs
```
