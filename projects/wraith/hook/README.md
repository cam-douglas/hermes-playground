# Wraith hook

Afterimage scorer for Claude Code auto-updater live-image unlink. POST `{ action, probe? }`; get `unlinked`, `pruned`, `ghosted`, `voided`, `orphaned`, `severed`, `stale`, `resurfaced`, `ejected`, or `held`.

This is not a steam flange. It is not a chimney damper. It is not a manor-court livery of seisin. A harness calls it when the updater deletes the running version's on-disk binary while a session is still live: TCC fails against the deleted signature, grants stay ON, reads return EPERM mid-session with no warning.

A grant that is still ON is not a hold. Score the image. Name the class or admit **unlinked**. Slack alarm on pruned / ghosted / voided / orphaned / severed. Linear incident on pruned / orphaned / severed. GitHub wraith-ledger issue on every scored probe.

Idle word is **unlinked**, never the product name, never **empty**, never Gasket's **tight**, never Damper's **banked**, never Livery's **seised**. Livery must not ship.

## CLI

```bash
node projects/wraith/hook/index.mjs < probe.json
```

Empty stdin uses the seeded pruned afterimage (`#90373`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `unlinked`, `ghosted`, `pruned`, `sinks`.

## HTTP

```bash
node projects/wraith/hook/index.mjs --listen 9073
curl -s -X POST http://127.0.0.1:9073 \
  -H 'content-type: application/json' \
  -d '{"action":"press"}'
```

`action` may be `press` / `score`, `seat` / `clear` (return idle **unlinked**), `trace` / `observe` (check lsof / proc exe), `unlink` (show prune), `hold` (current-image hold → **held**), `restart` (only restart restores → **ejected**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90373` pruned. Admit does not lie: a pruned probe stays pruned. Unlink on an idle pane produces a pruned afterimage.

Probe: `{ imageDeleted, updaterPrunedRunningVersion, lsofOrProcExeDeleted, grantsStillOn, inAppGrantSuccessNoOp, bashEperm, readEperm, postUpdateSessionReadsOk, spawnSuccessEnoent, remoteControlGreenButEperm, restartRestores }`.

Return: `{ verdict, reasons[], unlinked, ghosted, pruned }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/wraith/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `pruned` / `ghosted` / `voided` / `orphaned` / `severed`, or `permissionDecision: "deny"`, as a stop. A grant that is still ON is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `WRAITH_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: pruned/ghosted/voided/orphaned/severed alarm…". Fires on those verdicts only. |
| `WRAITH_GITHUB_TOKEN` / `GITHUB_TOKEN` | Wraith-ledger issue (private gist `wraith-ledger.jsonl`). Absent → "Would open a GitHub wraith-ledger issue…". Every scored probe. |
| `WRAITH_LINEAR_KEY` / `LINEAR_API_KEY` | Pruned / orphaned / severed opens a ticket. Absent → demo row. Skip otherwise. |
| `WRAITH_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/wraith/hook/wraith.test.mjs
```
