# Binnacle hook

Ship's brass binnacle scorer for an interactive TUI that still probes `api.anthropic.com` after `ANTHROPIC_BASE_URL` is named. POST `{ action, binnacle? }` or pipe a probe; get `housed`, `swung`, `refused`, `printed`, `split`, `fatal`, `demanded`, `blind`, `boxed`, or `stripped`.

This is not Visa's MCP OAuth missing resource. It is not Husk's hollow headless SUCCESS (inverse: here headless works, interactive dies). It is not Sprag / Reed MCP lifecycle. It is not Gasket's sandbox allowlist discard. It is not Tain's Chrome pairing. A harness calls it when a named heading is not a hold, and the interactive TUI still knocks magnetic north.

A named heading is not a hold. Score the binnacle. Name the class or admit **housed**. Slack alarm on swung / refused / fatal / split / blind / boxed / demanded / stripped. Linear ticket on refused / swung. GitHub binnacle-ledger of scored headings on every score.

Idle word is **housed**, never the product name, never **empty**, never magnetic / gyro / origin, never Pirn's **beamed**, never Tocsin's **rung**. Do not ship Binnacle, Empty, Magnetic, Gyro, or Origin as the idle word.

The #90551 refused (BASE_URL set and serving `/v1/messages`, `claude -p` works, TUI refuses because `api.anthropic.com` is unreachable) is **refused**, never **housed**, even when the gateway-serves and -p lamps stay lit.

Priority when multiple match: **refused** > **swung** > **fatal** > **split** > **blind** > **boxed** > **demanded** > **stripped** > **printed** > **housed**.

The hook scores named heading, TUI start, -p, hello split, fatal/advisory polarity, proxy-named errors, stripped path, and sandbox box — never invents extra issues.

Primary: [anthropics/claude-code#90551](https://github.com/anthropics/claude-code/issues/90551). Same-class: #89211 #88345 #89972 #89973 #88536 (nearby shape). NOT Visa / Husk / Sprag / Reed / Gasket / Tain. Cross-ecosystem: [openai/codex#36597](https://github.com/openai/codex/issues/36597) inverse polarity; [openai/codex#40435](https://github.com/openai/codex/issues/40435) unnamed custom base.

## CLI

```bash
node projects/binnacle/hook/index.mjs < binnacle.json
node projects/binnacle/hook/index.mjs binnacle.json
```

Empty stdin uses the seeded #90551 refused binnacle. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `housed`, `sinks`.

## HTTP

```bash
node projects/binnacle/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `house`, `bail` / `housed` / `still` / `reset` (return idle **housed**), `control` / `healthy` / `proof` / `bench` (TUI on the named origin that stays **housed**), `ledger` / `trace` / `observe` / `sound` (score the heading), `restore` / `refused` / `incident` (show #90551 refused → **refused**), or `admit`. Nested `{ binnacle, action: { ... } }` is accepted. Admit does not lie: a refused binnacle stays refused. Restore on an idle chart produces the #90551 refused binnacle.

Probe: `{ session, issue, source, baseUrl, publicOriginReachable, namedGatewayServesMessages, interactiveTuiStarts, headlessPrintWorks, helloToBaseUrl, helloToPublic, oauthProfileToPublic, eventLoggingToPublic, checkFatalInTui, checkAdvisoryInPrint, errorNamesProxy, errorNamesBaseUrl, pathStripped, denyByDefaultSandbox, scored }`.

Return: `{ verdict, reasons[], housed }`.

`housed` only when: named `baseUrl` && `interactiveTuiStarts` && `headlessPrintWorks` && `helloToBaseUrl` && !`oauthProfileToPublic` && !`eventLoggingToPublic` && !`helloToPublic` && !`pathStripped`. A working `-p` and a gateway that serves `/v1/messages` must not force housed when the TUI refuses.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/binnacle/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `refused` / `swung` / `fatal` / `split` / `blind` / `boxed` / `demanded` / `stripped`, or `permissionDecision: "deny"`, as a stop. A named heading is not a hold. A green gateway lamp is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `BINNACLE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: refused/swung/… alarm…". Fires on those verdicts only. |
| `BINNACLE_GITHUB_TOKEN` / `GITHUB_TOKEN` | Binnacle-ledger issue (private gist `binnacle-ledger.jsonl`). Absent → "Would open a GitHub binnacle-ledger issue…". Every scored heading. |
| `BINNACLE_LINEAR_KEY` / `LINEAR_API_KEY` | Refused / swung opens a heading ticket. Absent → demo row. Skip otherwise. |
| `BINNACLE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/binnacle/hook/binnacle.test.mjs
```
