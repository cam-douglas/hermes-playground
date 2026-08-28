# Tappet hook

UserPromptSubmit valve-train scorer. POST `{ action, probe? }`; get `seated`, `missed`, `slipped`, `folded`, `mute`, `oversize`, `misfiled`, `inert`, `blind`, or `wave`.

This is not a standing-rule sounding plate. It is not an MCP registry cabinet. It is not a main-turn splice desk. It is not a `/btw` wing. A harness calls it when a UserPromptSubmit (or sibling) hook may fail silently: mid-turn submissions never spawn the process, or `additionalContext` returns and never reaches the transcript.

A fired hook is not a seated injection. Score the valve train. Name the class or admit **seated**. Slack alarm on missed / slipped / folded / mute / oversize / misfiled / inert / wave. Linear ticket on missed / slipped / inert. GitHub tappet-ledger issue on every scored probe.

Idle word is **seated**, never the product name, never Aside's **heard**, never Chute's **clear**, never Tain's **paired**.

## CLI

```bash
node projects/tappet/hook/index.mjs < probe.json
```

Empty stdin uses the seeded missed bay (`#90296` mode A). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `midTurn`, `hookSpawned`, `additionalContextInTranscript`, `sinks`.

## HTTP

```bash
node projects/tappet/hook/index.mjs --listen 9296
curl -s -X POST http://127.0.0.1:9296 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score`, `strike`, `admit`, or `clear` (empty the bay to **seated**). Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90296` missed. Admit does not lie: a missed probe stays missed. Strike on an idle bay produces a seated injection.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/tappet/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `missed` / `slipped` / `folded` / `mute` / `oversize` / `misfiled` / `inert` / `wave`, or `permissionDecision: "deny"`, as a stop. A fired hook is not a seated injection.

## Env

| Variable | Meaning |
| --- | --- |
| `TAPPET_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: missed/slipped/folded/mute/oversize/misfiled/inert/wave alarm…". Fires on those verdicts only. |
| `TAPPET_GITHUB_TOKEN` / `GITHUB_TOKEN` | Tappet-ledger issue (private gist `tappet-ledger.jsonl`). Absent → "Would open a GitHub tappet-ledger issue…". Every scored probe. |
| `TAPPET_LINEAR_KEY` / `LINEAR_API_KEY` | Missed / slipped / inert opens a ticket. Absent → demo row. Skip otherwise. |
| `TAPPET_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/tappet/hook/tappet.test.mjs
```
