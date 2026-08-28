# Kist hook

Funeral scorer for Claude Code Remote Control teardown-archive that never unarchives. POST `{ action, probe? }`; get `laid`, `kisted`, `risen`, `hollow`, `stuck`, `lost`, `sealed`, `recalled`, `split`, or `veiled`.

This is not an afterimage. It is not a chimney damper. It is not a leftover millimetre slider. A harness calls it when an auto-update or app quit archives every running Remote Control session and never unarchives it: sessions vanish from the mobile default list, local unarchive has no follow-on CCR, reopen reattaches the bridge id, and the cloud session stays archived.

A session still on the default list is not a hold. Score the lid. Name the class or admit **laid**. Slack kist alarm on kisted / hollow / stuck / lost / sealed. Linear session-lost ticket on kisted / lost / sealed. GitHub kist-ledger issue on every scored probe.

Idle word is **laid**, never the product name, never **empty**, never Wraith's **unlinked**, never Damper's **banked**. Do not ship Livery.

## CLI

```bash
node projects/kist/hook/index.mjs < probe.json
```

Empty stdin uses the seeded kisted funeral (`#90387`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `laid`, `kisted`, `hollow`, `sinks`.

## HTTP

```bash
node projects/kist/hook/index.mjs --listen 9029
curl -s -X POST http://127.0.0.1:9029 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `lift`, `shut` / `seat` / `clear` (return idle **laid**), `ledger` / `trace` / `observe` (check the funeral counts), `kist` / `archive` (show teardown-archive → **kisted**), `unarchive` / `rise` (mobile/web unarchive → **risen**), `reopen` (local reopen → **recalled**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90387` kisted. Admit does not lie: a kisted probe stays kisted. Kist on an idle lid produces a kisted funeral.

Probe: `{ teardownCause, ccrArchiveRequested, ccrUnarchiveRequested, localUnarchiveRan, reopenedLocally, onMobileDefaultList, vanishedFromDefault, archivedFilterOnly, cloudStillArchived, localSessionActive, reattachedBridgeId, archiveStateDiffersPerClient, noDesktopRestore }`.

Return: `{ verdict, reasons[], cluster[], laid, kisted, hollow }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/kist/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `kisted` / `hollow` / `stuck` / `lost` / `sealed`, or `permissionDecision: "deny"`, as a stop. A session still on the default list is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `KIST_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: kisted/hollow/stuck/lost/sealed alarm…". Fires on those verdicts only. |
| `KIST_GITHUB_TOKEN` / `GITHUB_TOKEN` | Kist-ledger issue (private gist `kist-ledger.jsonl`). Absent → "Would open a GitHub kist-ledger issue…". Every scored probe. |
| `KIST_LINEAR_KEY` / `LINEAR_API_KEY` | Kisted / lost / sealed opens a session-lost ticket. Absent → demo row. Skip otherwise. |
| `KIST_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/kist/hook/kist.test.mjs
```
