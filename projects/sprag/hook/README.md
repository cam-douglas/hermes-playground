# Sprag hook

Race scorer for Claude Code boot-cached MCP attach failure. POST `{ action, probe? }`; get `overrun`, `locked`, `mixed`, `late`, `refused`, `cached`, `stale`, `spun`, `held`, or `live`.

This is not Reed's four-contact cabinet. It is not a malware-reminder refusal. It is not early schedule dispatch. It is not a plugin-store freeze. It is not silent hook injection. A harness calls it when a failed attach at boot is not a hold, and the first refuse locks the race for the process lifetime.

A failed attach at boot is not a hold. Score the race. Name the class or admit **overrun**. Slack sprag alarm on locked / mixed / late / refused / cached / stale. Linear ticket on locked / mixed. GitHub sprag-ledger issue on every scored probe.

Idle word is **overrun**, never the product name, never **empty**, never Lazaret's **pratique**, never Fusee's **wound**. Do not ship Clutch, Overrun, Ratchet, Pawl, Detent, Freewheel, Race, Inner, Outer, Sprag (as idle), Reed, Larder, Tappet, Fusee, Quarantine.

## CLI

```bash
node projects/sprag/hook/index.mjs < probe.json
```

Empty stdin uses the seeded locked race (`#90494`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `overrun`, `locked`, `mixed`, `sinks`.

## HTTP

```bash
node projects/sprag/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `stamp`, `bail` / `overrun` / `still` (return idle **overrun**), `live` / `proof` / `freewheel` (server up at boot, tools available → **live**), `ledger` / `trace` / `observe` / `sound` (sound the race), `race` / `clutch` / `lock` (show #90494 locked strike → **locked**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90494` locked. Admit does not lie: a locked probe stays locked. Race on an idle bench produces a locked strike.

Probe: `{ serverRunningAtBoot, serverRunningNow, attachFailed, retried, reconnectAttempted, reconnectError, transportPinnedAtBoot, transportNow, credentialsNow, tokenDataFound, processRestarted, toolsAvailable, observed, session, source, issue, scored }`.

Return: `{ verdict, reasons[], cluster[], overrun, locked, mixed }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/sprag/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `locked` / `mixed` / `late` / `refused` / `cached` / `stale`, or `permissionDecision: "deny"`, as a stop. A failed attach at boot is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `SPRAG_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: locked/mixed/late/refused/cached/stale alarm…". Fires on those verdicts only. |
| `SPRAG_GITHUB_TOKEN` / `GITHUB_TOKEN` | Sprag-ledger issue (private gist `sprag-ledger.jsonl`). Absent → "Would open a GitHub sprag-ledger issue…". Every scored probe. |
| `SPRAG_LINEAR_KEY` / `LINEAR_API_KEY` | Locked / mixed opens a race ticket. Absent → demo row. Skip otherwise. |
| `SPRAG_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/sprag/hook/*.test.mjs
```
