# Wicket hook

PreToolUse isolation-scorer middleware. POST `{ action, gate? }`; get `home`, `escape`, `latch`, `reap`, `swap`, `misbind`, `hijack`, or `split`.

This is not a file lease. It is not a plan fence. It is not a muster. It is not a wax-seal clinic. It is not a suture tray. It is not a darkroom. It is not a splice desk. It does not keep four MCP contacts. It does not pin standing rules. It does not score claim-vs-reality. It does not trip a spend fuse. It does not redact `tool_result`. It does not approve grants. It is not a leftover woodworking slider. A harness calls it when `isolation:"worktree"` / EnterWorktree is only a pin, and Edit/Write/Bash might still leave the pinned root.

Isolation is a pin, not a promise. Score the probe against the pinned worktree root. Admit the write (**home**) or name the failure class. Path check is component-containment (`is_relative_to` / parents walk), never a string prefix — `/tmp/wt-other` is not inside `/tmp/wt`.

Idle word is **home**, never the product name.

## CLI

```bash
node projects/wicket/hook/index.mjs < gate.json
```

Empty stdin uses the seeded absolute-path escape (`#74726`). Stdout is JSON: `verdict`, `state`, `pin`, `filePath`, `contained`, `dataLoss`, `sinks`.

## HTTP

```bash
node projects/wicket/hook/index.mjs --listen 9060
curl -s -X POST http://127.0.0.1:9060 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score`, `admit`, `refuse`, `rebound`, `hold`, or `clear` (empty the gate to **home**). Nested `{ gate, action: { ... } }` is accepted. Default payload is seed `#74726`.

## Harness sketch

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/wicket/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `verdict: "escape"` / `"latch"` / `"reap"` / `"hijack"` / `"split"` or `permissionDecision: "deny"` as a stop. A default cwd is not proof the write stayed home. A successful EnterWorktree report is not a hold — logical cwd, shell cwd, and guard claim must agree.

## Env

| Variable | Meaning |
| --- | --- |
| `WICKET_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: isolation alarm…". Skip if home / swap / misbind. |
| `WICKET_GITHUB_TOKEN` | Private gist `wicket-ledger.jsonl`. Absent → "Would append a GitHub isolation ledger row…". |
| `WICKET_LINEAR_KEY` | Escape that mutated main or `git reset --hard` opens a data-loss incident. Absent → demo row. Skip unless data-loss. |
| `WICKET_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/wicket/hook/wicket.test.mjs
```
