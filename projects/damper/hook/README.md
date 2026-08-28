# Damper hook

Chimney-damper scorer for Remote Control auto-enable. POST `{ action, probe? }`; get `banked`, `drawn`, `vented`, `ajar`, `forced`, `defaulted`, `bridged`, `disclosed`, `sealed`, or `lit`.

This is not a night-latch. It is not a dove cote. It is not a permission stall. A harness calls it when a new Claude Code session starts with Remote Control already on: no `/rc`, no `--rc`, `disableClaudeAiConnectors: true` ignored, a settings toggle that reads off, or a VS Code tab that ignores `remoteControl=default`.

A settings toggle that reads off is not a hold. Score the draft. Name the class or admit **banked**. Slack alarm on defaulted / drawn / forced / disclosed. Linear incident on defaulted / disclosed. GitHub damper-ledger issue on every scored probe.

Idle word is **banked**, never the product name, never **empty**, never Snib's **latched**.

## CLI

```bash
node projects/damper/hook/index.mjs < probe.json
```

Empty stdin uses the seeded defaulted plate (`#90341`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `flueOpen`, `damperClosed`, `consented`, `bridged`, `sinks`.

## HTTP

```bash
node projects/damper/hook/index.mjs --listen 9341
curl -s -X POST http://127.0.0.1:9341 \
  -H 'content-type: application/json' \
  -d '{"action":"throw"}'
```

`action` may be `throw` / `score`, `bank` / `clear` (close the plate to **banked**), `draw` (open draft), `observe` (check notification stamp / settings), `sever` (disconnect RC), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90341` defaulted. Admit does not lie: a defaulted probe stays defaulted. Draw on an idle plate produces a drawn draft.

Probe: `{ neverInvokedRc, uiDefaultToggleOff, remoteControlAtStartupAbsent, remoteControlAtStartupFalse, disableClaudeAiConnectorsTrue, rcActive, liveRemoteUrl, toolResultsCrossing, fileContentsExposed, seenAutoOnNotification, vscodeNewTab, surface }`.

Return: `{ verdict, reasons[], flueOpen, damperClosed, consented, bridged }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/damper/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `defaulted` / `drawn` / `forced` / `disclosed`, or `permissionDecision: "deny"`, as a stop. A settings toggle that reads off is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `DAMPER_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: defaulted/drawn/forced/disclosed alarm…". Fires on those verdicts only. |
| `DAMPER_GITHUB_TOKEN` / `GITHUB_TOKEN` | Damper-ledger issue (private gist `damper-ledger.jsonl`). Absent → "Would open a GitHub damper-ledger issue…". Every scored probe. |
| `DAMPER_LINEAR_KEY` / `LINEAR_API_KEY` | Defaulted / disclosed opens a ticket. Absent → demo row. Skip otherwise. |
| `DAMPER_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/damper/hook/damper.test.mjs
```
