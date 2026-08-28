# Veto hook

UserPromptSubmit overlay scorer. POST `{ action, probe? }`; get `upheld`, `shadowed`, `vetoed`, `misattributed`, `ghost`, `deadlock`, `silent`, or `restored`.

This is not a sounding plate for rules dropped by compaction. It is not a furnace. It is not a grant inbox. It is not a muster. A harness calls it when a system prompt may contain an unlabeled `heron_brook` / `tengu_heron_brook` clamp that outranks the user's CLAUDE.md.

A standing CLAUDE.md is not a hold. Lift the overlay. Name the class or admit **upheld**. Fail-closed on vetoed / misattributed / deadlock. Slack alarm on vetoed / misattributed / deadlock. Linear silent-override incident on vetoed / misattributed. GitHub ledger row on every scored probe.

Idle word is **upheld**, never the product name, never Fathom's **still**, never Assay's **sterling**.

## CLI

```bash
node projects/veto/hook/index.mjs < probe.json
```

Empty stdin uses the seeded vetoed overlay (`#80988`). Stdout is JSON: `verdict`, `state`, `reasons`, `overlayPresent`, `namesGhostTool`, `restored`, `sinks`.

## HTTP

```bash
node projects/veto/hook/index.mjs --listen 9088
curl -s -X POST http://127.0.0.1:9088 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score`, `lift`, `drop`, `restore`, or `clear` (empty the palimpsest to **upheld**). Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#80988`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/veto/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `vetoed` / `misattributed` / `deadlock`, or `permissionDecision: "deny"`, as a stop. A standing CLAUDE.md is not proof the model will dispatch.

The real workaround from #80988 / #82371 is a UserPromptSubmit `additionalContext` that says the user requested the Agent / subagent, satisfying "unless the user requested it".

## Env

| Variable | Meaning |
| --- | --- |
| `VETO_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: overlay alarm…". Fires on vetoed / misattributed / deadlock only. |
| `VETO_GITHUB_TOKEN` | Private gist `veto-ledger.jsonl`. Absent → "Would append a GitHub veto ledger row…". Every scored probe. |
| `VETO_LINEAR_KEY` | Vetoed or misattributed opens a silent-override incident. Absent → demo row. Skip otherwise. |
| `VETO_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/veto/hook/veto.test.mjs
```
