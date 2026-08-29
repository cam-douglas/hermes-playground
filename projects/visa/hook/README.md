# Visa hook

Border scorer for Claude Code MCP OAuth that omits the RFC 8707 `resource` parameter. POST `{ action, probe? }`; get `stamped`, `omitted`, `audless`, `clientid`, `refused`, `strict`, `slashy`, `mismatched`, `granted`, or `held`.

This is not Sprag's overrunning clutch. It is not Reed's four-contact cabinet. It is not Husk's hollow success envelope. It is not session-id hollow registration (#90477). A harness calls it when a login without a destination is not a hold, and the missing `resource` leaves the token addressed to the client_id.

A login without a destination is not a hold. Score the border. Name the class or admit **stamped**. Slack visa alarm on omitted / audless / clientid / refused / slashy / mismatched. Linear ticket on omitted / clientid / refused. GitHub visa-ledger issue on every scored probe.

Idle word is **stamped**, never the product name, never **empty**, never Sprag's **overrun**, never Lazaret's **pratique**. Do not ship Passport, Border, Blotter, Stamp, Resource, Audience, OAuth, or Visa as the idle word.

## CLI

```bash
node projects/visa/hook/index.mjs < probe.json
```

Empty stdin uses the seeded omitted blotter (`#90497`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `stamped`, `omitted`, `clientid`, `sinks`.

## HTTP

```bash
node projects/visa/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `stamp` / `ink`, `bail` / `stamped` / `still` (return idle **stamped**), `healthy` / `proof` / `clearance` (resource sent, aud matches, 200 → **stamped**), `ledger` / `trace` / `observe` / `sound` (sound the blotter), `omit` / `blotter` / `desk` / `border` / `restore` (show #90497 omitted strike → **omitted**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90497` omitted. Admit does not lie: an omitted probe stays omitted. Blotter on an idle desk produces an omitted strike.

Probe: `{ resourceSentAuthorize, resourceSentToken, resourceValue, audClaim, clientId, canonicalResourceUri, serverStrict, httpStatus, trailingSlashCorruption, oauthCompleted, session, source, issue, scored }`.

Return: `{ verdict, reasons[], cluster[], stamped, omitted, clientid }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/visa/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `omitted` / `audless` / `clientid` / `refused` / `slashy` / `mismatched`, or `permissionDecision: "deny"`, as a stop. A login without a destination is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `VISA_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: omitted/audless/clientid/refused/slashy/mismatched alarm…". Fires on those verdicts only. |
| `VISA_GITHUB_TOKEN` / `GITHUB_TOKEN` | Visa-ledger issue (private gist `visa-ledger.jsonl`). Absent → "Would open a GitHub visa-ledger issue…". Every scored probe. |
| `VISA_LINEAR_KEY` / `LINEAR_API_KEY` | Omitted / clientid / refused opens a border ticket. Absent → demo row. Skip otherwise. |
| `VISA_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/visa/hook/*.test.mjs
```
