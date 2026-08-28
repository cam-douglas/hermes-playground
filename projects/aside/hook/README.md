# Aside hook

SessionStart aside-ledger scorer. POST `{ action, probe? }`; get `heard`, `preamble`, `muted`, `poisoned`, `toolish`, `inherited`, `ghost`, `sticky`, `noticed`, or `forked`.

This is not a main-turn splice desk. It is not a stream-tear tray. It is not an inbound secret chute. A harness calls it when a `/btw` side question may inherit tool-first context (project CLAUDE.md or a SessionStart hook saying must call a tool before ANY response) while `/btw` forbids tools.

A preamble is not an answer. Score the wing. Name the class or admit **heard**. Slack alarm on preamble / muted / poisoned / toolish / inherited / ghost / sticky / forked. Linear ticket on preamble / poisoned. GitHub aside-ledger issue on every scored probe.

Idle word is **heard**, never the product name, never Coda's **intact**, never Suture's **sealed**, never Chute's **clear**, never Tain's **paired**.

## CLI

```bash
node projects/aside/hook/index.mjs < probe.json
```

Empty stdin uses the seeded preamble wing (`#90314`). Stdout is JSON: `verdict`, `state`, `reasons`, `preambleText`, `noticeSuppressed`, `skipTranscript`, `sinks`.

## HTTP

```bash
node projects/aside/hook/index.mjs --listen 9314
curl -s -X POST http://127.0.0.1:9314 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score`, `ask`, `admit`, or `clear` (empty the wing to **heard**). Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90314` preamble. Admit does not lie: a preamble probe stays preamble. Ask submits a `/btw` — inherited tool-first context produces preamble; a quiet wing produces heard.

## Harness sketch

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/aside/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `preamble` / `muted` / `poisoned` / `sticky` / `ghost`, or `permissionDecision: "deny"`, as a stop. A short preamble is not a side answer.

## Env

| Variable | Meaning |
| --- | --- |
| `ASIDE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: preamble/muted/poisoned/toolish/inherited/ghost/sticky/forked alarm…". Fires on those verdicts only. |
| `ASIDE_GITHUB_TOKEN` | Aside-ledger issue (private gist `aside-ledger.jsonl`). Absent → "Would open a GitHub aside-ledger issue…". Every scored probe. |
| `ASIDE_LINEAR_KEY` | Preamble / poisoned opens a ticket. Absent → demo row. Skip otherwise. |
| `ASIDE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`, `GITHUB_TOKEN`, `LINEAR_API_KEY`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/aside/hook/aside.test.mjs
```
