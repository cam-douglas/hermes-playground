# Sounder hook

Telegraph sounder scorer for a background Bash waiter that completes while its notification never re-invokes the session. POST `{ action, sounder? }` or pipe a probe; get `keyed`, `muted`, `stalled`, `orphaned`, `relayed`, `deaf`, `armed`, `dropped`, `stranded`, or `cut`.

This is not Leat's never-exiting until-loop (inverse: here the waiter DID exit). It is not Fusee's early schedule. It is not Cotter's poison fireAt. It is not Reveille's living muster. It is not Shunt's nested SendMessage. It is not Husk's hollow SUCCESS. It is not Binnacle's TUI origin split. It is not Pirn's instruction-shaped truncation. A harness calls it when a completed waiter is not a hold, and the session sits until a human types.

A completed waiter is not a hold. Score the sounder. Name the class or admit **keyed**. Slack alarm on muted / stalled / orphaned / deaf / dropped / stranded / cut / armed. Linear ticket on muted / stalled. GitHub sounder-ledger of scored circuits on every score.

Idle word is **keyed**, never the product name, never **empty**, never silent / mute / idle / dead, never Binnacle's **housed**, never Tocsin's **rung**. Do not ship Sounder, Empty, Silent, Mute, Idle, or Dead as the idle word.

The #90555 muted (waiter completed, notification never re-invoked, session idled until human) is **muted**, never **keyed**, even when the command exited cleanly and no error was printed.

Priority when multiple match: **muted** > **stalled** > **orphaned** > **dropped** > **stranded** > **cut** > **armed** > **deaf** > **relayed** > **keyed**.

The hook scores waiter exit, notification delivery, session re-invoke, idle hours, waiter IDs, resume autofire, enqueue-loss, teammate stall, and headless cut — never invents extra issues.

Primary: [anthropics/claude-code#90555](https://github.com/anthropics/claude-code/issues/90555). Same-class: #90534 #87689 #89505 #88423 #85534 #77300 #85129 #76174 (nearby shape). NOT Leat / Fusee / Cotter / Reveille / Shunt / Husk / Binnacle / Pirn. NOT #88702. Cross-ecosystem: [openai/codex#15723](https://github.com/openai/codex/issues/15723) background completion never wakes the caller.

## CLI

```bash
node projects/sounder/hook/index.mjs < sounder.json
node projects/sounder/hook/index.mjs sounder.json
```

Empty stdin uses the seeded #90555 muted sounder. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `keyed`, `sinks`.

## HTTP

```bash
node projects/sounder/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `key`, `bail` / `keyed` / `still` / `reset` (return idle **keyed**), `control` / `healthy` / `proof` / `bench` (armed circuit that stays **keyed**), `ledger` / `trace` / `observe` / `click` (score the circuit), `restore` / `muted` / `incident` (show #90555 muted → **muted**), or `admit`. Nested `{ sounder, action: { ... } }` is accepted. Admit does not lie: a muted sounder stays muted. Restore on an idle desk produces the #90555 muted sounder.

Probe: `{ session, issue, source, waiterCompleted, notificationDelivered, sessionReinvoked, humanInputRequired, idleHours, waiterIds, resumeAutofire, enqueuedNotDelivered, teammateIdle, headlessKilledAtTurnEnd, sessionPresent, circuitArmed, scored }`.

Return: `{ verdict, reasons[], keyed }`.

`keyed` only when idle, or when `circuitArmed` && !`waiterCompleted` && !`resumeAutofire` && !`enqueuedNotDelivered` && !`teammateIdle` && !`headlessKilledAtTurnEnd` && !`humanInputRequired`. A completed waiter and a clean exit must not force keyed when the session was never re-invoked.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/sounder/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `muted` / `stalled` / `orphaned` / `deaf` / `dropped` / `stranded` / `cut` / `armed`, or `permissionDecision: "deny"`, as a stop. A completed waiter is not a hold. A clean exit is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `SOUNDER_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: muted/stalled/… alarm…". Fires on those verdicts only. |
| `SOUNDER_GITHUB_TOKEN` / `GITHUB_TOKEN` | Sounder-ledger issue (private gist `sounder-ledger.jsonl`). Absent → "Would open a GitHub sounder-ledger issue…". Every scored circuit. |
| `SOUNDER_LINEAR_KEY` / `LINEAR_API_KEY` | Muted / stalled opens a circuit ticket. Absent → demo row. Skip otherwise. |
| `SOUNDER_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/sounder/hook/sounder.test.mjs
```
