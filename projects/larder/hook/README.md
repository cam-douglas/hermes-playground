# Larder hook

Plugin-store stillroom scorer. POST `{ action, probe? }`; get `stocked`, `stamped`, `frozen`, `greened`, `toggled`, `drifted`, `lagged`, `aisled`, `aged`, or `served`.

This is not a valve train. It is not a hollow SUCCESS envelope. It is not an MCP registry cabinet. It is not a `/btw` wing. A harness calls it when a per-workspace plugin store reports healthy sync while downloading nothing: `lastUpdated` advances, plugin folders stand still, every indicator stays green.

A sync stamp is not a delivery. Score the shelf. Name the class or admit **stocked**. Slack alarm on stamped / frozen / greened / drifted / aged / served. Linear ticket on frozen / greened / served. GitHub larder-ledger issue on every scored probe.

Idle word is **stocked**, never the product name, never Tappet's **seated**, never Aside's **heard**, never Husk's **kernel**.

## CLI

```bash
node projects/larder/hook/index.mjs < probe.json
```

Empty stdin uses the seeded stamped shelf (`#90329`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `lastUpdatedAdvanced`, `pluginFolderMoved`, `versionsBehind`, `sinks`.

## HTTP

```bash
node projects/larder/hook/index.mjs --listen 9329
curl -s -X POST http://127.0.0.1:9329 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score`, `strike`, `admit`, or `clear` (empty the shelf to **stocked**). Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90329` stamped. Admit does not lie: a stamped probe stays stamped. Strike on an idle shelf produces a stocked delivery.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/larder/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `stamped` / `frozen` / `greened` / `drifted` / `aged` / `served`, or `permissionDecision: "deny"`, as a stop. A sync stamp is not a delivery.

## Env

| Variable | Meaning |
| --- | --- |
| `LARDER_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: stamped/frozen/greened/drifted/aged/served alarm…". Fires on those verdicts only. |
| `LARDER_GITHUB_TOKEN` / `GITHUB_TOKEN` | Larder-ledger issue (private gist `larder-ledger.jsonl`). Absent → "Would open a GitHub larder-ledger issue…". Every scored probe. |
| `LARDER_LINEAR_KEY` / `LINEAR_API_KEY` | Frozen / greened / served opens a ticket. Absent → demo row. Skip otherwise. |
| `LARDER_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/larder/hook/larder.test.mjs
```
