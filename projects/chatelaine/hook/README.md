# Chatelaine hook

Housekeeper's waist-chain scorer for Claude Code HTTP MCP OAuth grants stored *inside* the Anthropic account Keychain item. POST `{ action, chatelaine? }` or pipe a `mcpNestedInAccountItem` / `accountLogoutFired` / `accountSwitched` / `perAccountItemsLackMcpOAuth` / `httpMcpServerCount` / `unauthenticatedAfterEvent` / `grantsUnexpired` / `refreshTokensPresent` / `consecutiveMcpAuths` / `tokenlessStub` / `blankedBlob` / `desktopWipe` / `separateMcpStore` probe; get `girt`, `nested`, `cut`, `switched`, `spilled`, `unexpired`, `rebound`, `tokenless`, `blanked`, or `wiped`.

This is not Fob's hash-suffixed Keychain litter (login mints another `Claude Code-credentials-<8hex>`). It is not Visa's missing RFC 8707 resource. A harness calls it when a nested ring is not a hold, and logout of the Anthropic account has burned still-valid MCP grants.

A nested ring is not a hold. Score the chain. Name the class or admit **girt**. Slack chip + Linear ticket on cut / spilled / switched / nested / rebound / unexpired / tokenless / blanked / wiped. GitHub chatelaine-ledger of scored intakes on every score.

Idle word is **girt**, never the product name, never **empty**, never Fob's **hung**, never Visa's **stamped**, never Waif's **sheltered**. Do not ship Chatelaine, Livery, Tabard, Scrip, Baldric, Purse, Sporran as the idle word.

The #90647 cut chain (nested store + identity event + still-valid grants discarded) is **cut**, never **girt**. Unique nearby flags win their own seeds because those seeds do not carry the cut triad.

Priority when multiple match: unique nearby without the triad (**tokenless** > **blanked** > **wiped**) > **cut** > **spilled** > **switched** > **rebound** > **unexpired** > **nested** > **girt**.

The hook scores `{ mcpNestedInAccountItem, accountLogoutFired, accountSwitched, perAccountItemsLackMcpOAuth, httpMcpServerCount, unauthenticatedAfterEvent, grantsUnexpired, refreshTokensPresent, consecutiveMcpAuths, tokenlessStub, blankedBlob, desktopWipe, separateMcpStore }` — never invents extra issues.

Primary: [anthropics/claude-code#90647](https://github.com/anthropics/claude-code/issues/90647). Same-class nearby: [#88487](https://github.com/anthropics/claude-code/issues/88487) [#87405](https://github.com/anthropics/claude-code/issues/87405) [#84331](https://github.com/anthropics/claude-code/issues/84331) [#84274](https://github.com/anthropics/claude-code/issues/84274) [#84614](https://github.com/anthropics/claude-code/issues/84614) [#89671](https://github.com/anthropics/claude-code/issues/89671). Related, different (label, not this): [#90527](https://github.com/anthropics/claude-code/issues/90527) Fob [#90497](https://github.com/anthropics/claude-code/issues/90497) Visa. Cross-ecosystem: [openai/codex#27165](https://github.com/openai/codex/issues/27165) [#38198](https://github.com/openai/codex/issues/38198) [#28201](https://github.com/openai/codex/issues/28201). NOT Fob / Visa / leftover woodworking.

## CLI

```bash
node projects/chatelaine/hook/index.mjs < chatelaine.json
node projects/chatelaine/hook/index.mjs chatelaine.json
```

Empty stdin uses the seeded #90647 cut chain. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `girt`, `sinks`.

## HTTP

```bash
node projects/chatelaine/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `girt` / `still` / `reset` (return idle **girt**), `control` / `healthy` / `proof` / `hold` (honest path that classifies **girt** with `girt` true), `ledger` / `trace` / `observe` / `score-chatelaine` (score the chain), `restore` / `cut` / `incident` / `90647` (show #90647 cut → **cut**), or `admit`. Nested `{ chatelaine, action: { ... } }` is accepted. Admit does not lie: a cut chain stays cut. Restore on an idle chain produces the #90647 cut chain.

Probe: `{ mcpNestedInAccountItem, accountLogoutFired, accountSwitched, perAccountItemsLackMcpOAuth, httpMcpServerCount, unauthenticatedAfterEvent, grantsUnexpired, refreshTokensPresent, consecutiveMcpAuths, tokenlessStub, blankedBlob, desktopWipe, separateMcpStore }`.

Return: `{ verdict, reasons[], girt }`.

`girt` is true ONLY when the verdict is girt (idle, or honest control: mcpOAuth in its own store, logout leaves MCP grants, grants remain usable). Seeded 90647 numbers must produce cut / `girt=false`. Control with a separate store must produce `girt=true`. A nested ring is never girt.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/chatelaine/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `cut` / `spilled` / `switched` / `nested` / `rebound` / `unexpired` / `tokenless` / `blanked` / `wiped`, or `permissionDecision: "deny"`, as a stop. A nested ring is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `CHATELAINE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: Chatelaine cut · …". Fires on fail verdicts only. |
| `CHATELAINE_GITHUB_TOKEN` / `GITHUB_TOKEN` | Chatelaine-ledger (private gist `chatelaine-ledger.jsonl`). Absent → "Would append a GitHub chatelaine-ledger row…". Every scored intake. |
| `CHATELAINE_LINEAR_KEY` / `LINEAR_API_KEY` | Nested-ring alarm opens a ticket. Absent → demo row. Skip otherwise. |
| `CHATELAINE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/chatelaine/hook/chatelaine.test.mjs
```
