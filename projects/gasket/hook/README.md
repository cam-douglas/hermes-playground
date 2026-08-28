# Gasket hook

Steam-flange scorer for project-scoped `sandbox.network.strictAllowlist` silent discard. POST `{ action, probe? }`; get `tight`, `dropped`, `blown`, `nested`, `skipped`, `open`, `dry`, `warned`, `sheared`, or `made`.

This is not a chimney damper. It is not a valve train. It is not a night-latch. A harness calls it when a written project security key is accepted, schema-valid, and then dropped at resolution: no warning at startup, `--debug`, `/status`, `/sandbox`, or `claude doctor`.

A written project key is not a seal. Score the joint. Name the class or admit **tight**. Slack alarm on dropped / blown / nested / open / sheared. Linear incident on dropped / blown / open. GitHub gasket-ledger issue on every scored probe.

Idle word is **tight**, never the product name, never **empty**, never Damper's **banked**, never Tappet's **seated**.

## CLI

```bash
node projects/gasket/hook/index.mjs < probe.json
```

Empty stdin uses the seeded dropped flange (`#90355`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `sealed`, `leak`, `discarded`, `skipped`, `sinks`.

## HTTP

```bash
node projects/gasket/hook/index.mjs --listen 9355
curl -s -X POST http://127.0.0.1:9355 \
  -H 'content-type: application/json' \
  -d '{"action":"press"}'
```

`action` may be `press` / `score`, `seat` / `clear` (return idle **tight**), `observe` (check schema / doctor / status), `cut` (show fail-open), `make` (right-scope hold → **made**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90355` dropped. Admit does not lie: a dropped probe stays dropped. Cut on an idle joint produces a blown fail-open.

Probe: `{ projectSettingsHasStrictAllowlist, userOrManagedOrCliScope, sandboxEnabled, startupWarning, debugMentionsDiscard, statusMentionsDiscard, sandboxPanelMentionsDiscard, doctorMentionsDiscard, schemaMarksScope, schemaSaysUndocumented, bashEgressBlocked, webfetchEgressBlocked, writeGated, nestedProjectReplacedParent, socatOrBwrapMissing, warningFired, nonAllowlistedHostReached }`.

Return: `{ verdict, reasons[], sealed, leak, discarded, skipped }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/gasket/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `dropped` / `blown` / `nested` / `open` / `sheared`, or `permissionDecision: "deny"`, as a stop. A written project key is not a seal.

## Env

| Variable | Meaning |
| --- | --- |
| `GASKET_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: dropped/blown/nested/open/sheared alarm…". Fires on those verdicts only. |
| `GASKET_GITHUB_TOKEN` / `GITHUB_TOKEN` | Gasket-ledger issue (private gist `gasket-ledger.jsonl`). Absent → "Would open a GitHub gasket-ledger issue…". Every scored probe. |
| `GASKET_LINEAR_KEY` / `LINEAR_API_KEY` | Dropped / blown / open opens a ticket. Absent → demo row. Skip otherwise. |
| `GASKET_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/gasket/hook/gasket.test.mjs
```
