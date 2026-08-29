# Cotter hook

Machine-shop cotter-pin scorer for a poison-pill scheduled-task registry. POST `{ action, tray? }` or pipe a `scheduled-tasks.json`; get `snug`, `poison`, `wipe`, `hollow`, `vanish`, or `mute-mcp`.

This is not Fusee's early dispatch. It is not Cinch's partial mounts. It is not Reveille's muster. It is not Fob's keychain litter. It is not Ordo's headless plugin unknown. It is not Ullage's silent context drop. It is not Visa's missing OAuth resource. A harness calls it when a written `fireAt` is not a hold, and one ISO string fail-closes the entire routine set while green proxies lie.

A written fireAt is not a hold. Score the pin. Name the class or admit **snug**. Slack alarm on poison / wipe / hollow / vanish / mute-mcp. Linear ticket on poison / wipe. GitHub cotter-ledger of scored trays on every score.

Idle word is **snug**, never the product name, never **empty**, never Fob's **hung**, never Fusee's **wound**. Do not ship Cotter, Empty, FireAt, Schedule, Registry, or Poison as the idle word.

The #90533 poison (one string `fireAt` → ZodError on `scheduledTasks[n].fireAt` → whole registry fails to load) is **poison**, never **snug**, even when processes, package status, dispatcher heartbeat, and `recordedSkips` stay green.

The hook scores type, Zod reject, wipe, hollow success, vanish, and mute MCP — never invents extra issues.

Primary: [anthropics/claude-code#90533](https://github.com/anthropics/claude-code/issues/90533). Same-class: #85565 #83600 #89811 #88308. NOT Fusee #90485 / Cinch #90506 / Reveille. Cross-ecosystem: [openai/codex#28444](https://github.com/openai/codex/issues/28444) cron silent-fail while heartbeat stays green.

## CLI

```bash
node projects/cotter/hook/index.mjs < tray.json
node projects/cotter/hook/index.mjs tray.json
```

Empty stdin uses the seeded #90533 poison tray. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `snug`, `sinks`.

## HTTP

```bash
node projects/cotter/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `pin`, `bail` / `snug` / `still` / `reset` (return idle **snug**), `control` / `healthy` / `proof` / `bench` (epoch-ms pins that stay **snug**), `ledger` / `trace` / `observe` / `sound` (score the tray), `restore` / `poison` / `incident` (show #90533 poison → **poison**), or `admit`. Nested `{ tray, action: { ... } }` is accepted. Admit does not lie: a poison tray stays poison. Restore on an idle bench produces the #90533 poison tray.

Tray: `{ scheduledTasks[], definitionsOnDisk, registryLoaded, zodError, dispatcherHeartbeat, recordedSkipsWriting, processesGreen, packageStatusGreen, lastFiredAdvances, workDone, toolCalls, mcpToolsPresent, mcpTools, darkHours, expectedRecurring, recurringPresent, spentOneTimeRemain, wiped, vanished, hollow, muteMcp, session, source, issue, scored }`.

Return: `{ verdict, reasons[], snug }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/cotter/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `poison` / `wipe` / `hollow` / `vanish` / `mute-mcp`, or `permissionDecision: "deny"`, as a stop. A written fireAt is not a hold. A green heartbeat is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `COTTER_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: poison/wipe/hollow/vanish/mute-mcp alarm…". Fires on those verdicts only. |
| `COTTER_GITHUB_TOKEN` / `GITHUB_TOKEN` | Cotter-ledger issue (private gist `cotter-ledger.jsonl`). Absent → "Would open a GitHub cotter-ledger issue…". Every scored tray. |
| `COTTER_LINEAR_KEY` / `LINEAR_API_KEY` | Poison / wipe opens a pin ticket. Absent → demo row. Skip otherwise. |
| `COTTER_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/cotter/hook/cotter.test.mjs
```
