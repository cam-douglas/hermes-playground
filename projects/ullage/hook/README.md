# Ullage hook

Cooper's gauging desk for silent context ullage (no compaction ticket) plus prompt-cache prefix thrash. POST `{ action, cask? }` or pipe JSON / JSONL; get `gauged`, `ullaged`, `thrashed`, `frozen`, `leaked`, `rewritten`, `doubled`, `healed`, `silent`, or `bunged`.

This is not Fathom's standing-rule drop after a recorded compact. It is not Quench's subagent-spawn fuse. It is not Coda's dropped assistant text. It is not Visa's missing OAuth `resource`. It is not Sprag's boot-cached MCP attach. A harness calls it when a missing compaction ticket is not a hold, and the bung weeps because `cache_read` froze at the system-prompt prefix.

A missing compaction ticket is not a hold. Score the cask. Name the class or admit **gauged**. Slack thrash alarm on thrashed / frozen / ullaged / leaked / silent. Linear waste ticket when wasted weighted tokens exceed 1,000,000. GitHub ullage-ledger issue on every scored cask.

Idle word is **gauged**, never the product name, never **empty**, never Visa's **stamped**, never Sprag's **overrun**. Do not ship Ullage, Empty, Compact, Cache, or Leak as the idle word.

Weighted waste (as used in #90509): `input×1 + cache_read×0.1 + cache_creation×2 + output×5`. Deduplicate assistant usage rows by `message.id` / `requestId` before you trust the number.

## CLI

```bash
node projects/ullage/hook/index.mjs < trace.json
node projects/ullage/hook/index.mjs trace.jsonl
```

Empty stdin uses the seeded #90509 ullaged drop. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `gauged`, `ullaged`, `thrashed`, `waste`, `sinks`.

## HTTP

```bash
node projects/ullage/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `stamp` / `dip`, `bail` / `gauged` / `still` / `reset` (return idle **gauged**), `control` / `healthy` / `proof` (concurrent session that stays **gauged**), `ledger` / `trace` / `observe` / `sound` / `gauge` (sound the cask), `restore` / `ullaged` / `leak` / `cellar` (show #90509 unexplained drop → **ullaged**), or `admit`. Nested `{ cask, action: { ... } }` is accepted. Admit does not lie: an ullaged cask stays ullaged. Restore on an idle cellar produces the #90509 drop.

Cask: `{ turns[], tickets[], errors[], session, source, issue, scored }`. Each turn: `{ at, messageId, requestId, context, cacheRead, cacheCreation, input, output, compactMetadata?, appliedEdits?, error? }`.

Return: `{ verdict, reasons[], cluster[], gauged, ullaged, thrashed, waste }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/ullage/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `ullaged` / `thrashed` / `frozen` / `leaked` / `silent`, or `permissionDecision: "deny"`, as a stop. A missing compaction ticket is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `ULLAGE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: thrashed/frozen/ullaged/leaked/silent alarm…". Fires on those verdicts only. |
| `ULLAGE_GITHUB_TOKEN` / `GITHUB_TOKEN` | Ullage-ledger issue (private gist `ullage-ledger.jsonl`). Absent → "Would open a GitHub ullage-ledger issue…". Every scored cask. |
| `ULLAGE_LINEAR_KEY` / `LINEAR_API_KEY` | Waste over 1,000,000 weighted tokens opens a cellar ticket. Absent → demo row. Skip otherwise. |
| `ULLAGE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/ullage/hook/ullage.test.mjs
```
