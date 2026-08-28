# Scant hook

Scantling-yard scorer for Claude Code Windows Desktop shell-snapshot truncation at the ~7.2 KB / cmd.exe 8191 wall. POST `{ action, probe? }`; get `fit`, `scant`, `clipped`, `open`, `poisoned`, `bloated`, `stubbed`, `mute`, `sealed`, or `true`.

This is not a plugin-store freeze. It is not MCP registry death. It is not tool-arg impurity. It is not a spend fuse. It is not a live-image unlink. A harness calls it when a shell snapshot is silently truncated mid-`export PATH='...'` so every Bash call fails unexpected EOF.

A written shell snapshot is not a hold. Score the board. Name the class or admit **fit**. Slack scant alarm on scant / clipped / poisoned / bloated. Linear scantling ticket on poisoned / clipped. GitHub scant-ledger issue on every scored probe.

Idle word is **fit**, never the product name, never **empty**, never Chad's **spoilt**, never Kist's **laid**, never Wraith's **unlinked**. Do not ship Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, or Ferrule.

## CLI

```bash
node projects/scant/hook/index.mjs < probe.json
```

Empty stdin uses the seeded scant board (`#90421`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `fit`, `scant`, `clipped`, `measure`, `sinks`.

## HTTP

```bash
node projects/scant/hook/index.mjs --listen 9421
curl -s -X POST http://127.0.0.1:9421 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `measure`, `fit` / `seat` / `rack` (return idle **fit**), `ledger` / `trace` / `observe` / `chalk` (check the board), `clip` / `saw` (show #90421 cut board → **scant**), `true` (measured full length would have fit → **true**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90421` scant. Admit does not lie: a scant probe stays scant. Clip on an idle rack produces a scant board. `true` is the healthy hold, never idle.

Probe: `{ snapshot, measuredFullLength, pluginCount, pluginPathBytes, pluginPathBloat, snapshotDeleted, silentNoOpBash, onDiskRepairAttempted, sessionStillDead, bashUnexpectedEof }`. Snapshot text is measured: byte length, unclosed PATH quote, mid-PATH cut, wall hit.

Return: `{ verdict, reasons[], cluster[], fit, scant, clipped, measure }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/scant/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `scant` / `clipped` / `poisoned` / `bloated`, or `permissionDecision: "deny"`, as a stop. A written shell snapshot is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `SCANT_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: scant/clipped/poisoned/bloated alarm…". Fires on those verdicts only. |
| `SCANT_GITHUB_TOKEN` / `GITHUB_TOKEN` | Scant-ledger issue (private gist `scant-ledger.jsonl`). Absent → "Would open a GitHub scant-ledger issue…". Every scored probe. |
| `SCANT_LINEAR_KEY` / `LINEAR_API_KEY` | Poisoned / clipped opens a scantling ticket. Absent → demo row. Skip otherwise. |
| `SCANT_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/scant/hook/scant.test.mjs
```
