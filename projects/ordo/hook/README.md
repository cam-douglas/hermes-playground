# Ordo hook

Sacristan's missal desk for headless plugin-command resolution. POST `{ action, office? }` or pipe JSON; get `appointed`, `unknown`, `silent`, `hollow`, `builtin`, `missing`, `loud`, `stale`, `resolved`, or `cache-ok`.

This is not Larder's plugin-store freeze. It is not Tappet's hook injection. It is not Reed's MCP registry. It is not Assay's tool-arg furnace. It is not Cinch's silent partial mounts. It is not Sprag's boot-cached MCP attach. It is not Visa. A harness calls it when a written plugin command is not a hold, and `-p` returned Unknown command with `is_error` false and exit 0.

A written plugin command is not a hold. Score the missal. Name the class or admit **appointed**. Slack alarm on silent / hollow / unknown. Linear ticket on silent. GitHub ordo-ledger of scored offices on every score.

Idle word is **appointed**, never the product name, never **missal**, never Cinch's **cinched**, never Larder's **stocked**. Do not ship Ordo, Missal, Office, Rubric, or Kalendar as the idle word.

The #90515 silent trio (Unknown command + `is_error` false + exit 0) is **silent**, never **appointed**, even when the cache file exists.

## CLI

```bash
node projects/ordo/hook/index.mjs < office.json
node projects/ordo/hook/index.mjs office.json
```

Empty stdin uses the seeded #90515 silent-unknown. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `appointed`, `sinks`.

## HTTP

```bash
node projects/ordo/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `missal`, `bail` / `appointed` / `still` / `reset` (return idle **appointed**), `control` / `healthy` / `proof` / `interactive` (same plugin command that stays **appointed**), `ledger` / `trace` / `observe` / `sound` (score the office), `restore` / `silent` / `incident` (show #90515 silent-unknown → **silent**), or `admit`. Nested `{ office, action: { ... } }` is accepted. Admit does not lie: a silent missal stays silent. Restore on an idle sacristy produces the #90515 silent-unknown.

Office: `{ command, result, numTurns, isError, exitCode, enabled, installed, cached, commandFile, resolved, storedAsResult, isBuiltin, builtinWorks, version, session, source, issue, scored }`.

Return: `{ verdict, reasons[], appointed }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/ordo/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `silent` / `hollow` / `unknown`, or `permissionDecision: "deny"`, as a stop. A written plugin command is not a hold. A healthy cache is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `ORDO_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: silent/hollow/unknown alarm…". Fires on those verdicts only. |
| `ORDO_GITHUB_TOKEN` / `GITHUB_TOKEN` | Ordo-ledger issue (private gist `ordo-ledger.jsonl`). Absent → "Would open a GitHub ordo-ledger issue…". Every scored office. |
| `ORDO_LINEAR_KEY` / `LINEAR_API_KEY` | Silent opens a missal ticket. Absent → demo row. Skip otherwise. |
| `ORDO_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/ordo/hook/ordo.test.mjs
```
