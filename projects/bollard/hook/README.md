# Bollard hook

Dock-bollard scorer for Claude Code remote-control environment retention. A long-lived `claude rc` supervisor can exit for transient reasons; a 1–3 s gap preserves the environment and a ~10–11 s gap lets the server GC it, issuing a new environment ID and permanently orphaning every previously attached session. POST `{ action, bollard? }` or pipe a probe; get `belayed`, `gap-short`, `gap-fatal`, `poll-401`, `orphaned`, `sessions-dead`, `cred-stale`, `mem-thrash`, `offline-lie`, or `reattach-denied`.

This is not Clew's ARG_MAX / deny-list E2BIG. It is not Sounder's missed background Bash wakeup. It is not Reveille's living muster across compaction. It is not Cote's `--resume` team-hub identity split. It is not Binnacle's TUI origin split. It is not Hasp / Wicket / Parity. A harness calls it when a slack hawser is not a hold, and the environment ID did not survive the supervisor gap.

A slack hawser is not a hold. Score the bollard. Name the class or admit **belayed**. Slack alarm on orphaned / gap-fatal / sessions-dead / poll-401 / offline-lie / mem-thrash / cred-stale / reattach-denied. Linear ticket on orphaned / gap-fatal / sessions-dead / poll-401. GitHub bollard-ledger of scored piers on every score.

Idle word is **belayed**, never the product name, never **empty**, never silent / mute / idle / dead, never Clew's **rove**, never Sounder's **keyed**. Do not ship Bollard, Hawser, Hawse, Painter, Kedge, Warp, Berth, Empty, Silent, Mute, Idle, or Dead as the idle word.

The #90581 orphaned (~10–11s gap, environment cleaned up, 14 sessions unresumable, mobile “environment deleted”) is **orphaned**, never **belayed**. Unique nearby flags win their own seeds because those seeds do not carry the orphaned pentad.

Priority when multiple match: **orphaned** > **gap-fatal** > **sessions-dead** > **poll-401** > **offline-lie** > **mem-thrash** > **cred-stale** > **reattach-denied** > **gap-short** > **belayed**.

The hook scores supervisor gap, environment retention, session teardown, poll 401, credential reload, RSS/swap, journal continuity, and re-attach permission — never invents extra issues.

Primary: [anthropics/claude-code#90581](https://github.com/anthropics/claude-code/issues/90581). Same-class: [#87213](https://github.com/anthropics/claude-code/issues/87213) (resume replays dead RC binding) [#33041](https://github.com/anthropics/claude-code/issues/33041) (RC disconnects frequently) [#78597](https://github.com/anthropics/claude-code/issues/78597) [#78607](https://github.com/anthropics/claude-code/issues/78607) [#90577](https://github.com/anthropics/claude-code/issues/90577) [#78778](https://github.com/anthropics/claude-code/issues/78778) [#85639](https://github.com/anthropics/claude-code/issues/85639). NOT Clew / Sounder / Reveille / Cote / Binnacle / Hasp / Wicket / Parity. Cross-ecosystem: [openai/codex#35217](https://github.com/openai/codex/issues/35217) + [openai/codex#39863](https://github.com/openai/codex/issues/39863) + [openai/codex#36189](https://github.com/openai/codex/issues/36189).

## CLI

```bash
node projects/bollard/hook/index.mjs < bollard.json
node projects/bollard/hook/index.mjs bollard.json
```

Empty stdin uses the seeded #90581 orphaned bollard. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `belayed`, `sinks`.

## HTTP

```bash
node projects/bollard/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `belayed` / `still` / `reset` (return idle **belayed**), `control` / `healthy` / `proof` / `pier` / `plate` (1–3s clean restart that classifies **gap-short** with `belayed` true), `ledger` / `trace` / `observe` / `belay` (score the pier), `restore` / `orphaned` / `incident` (show #90581 orphaned → **orphaned**), or `admit`. Nested `{ bollard, action: { ... } }` is accepted. Admit does not lie: an orphaned bollard stays orphaned. Restore on an idle pier produces the #90581 orphaned bollard.

Probe: `{ session, issue, source, supervisorGapSec, envPreserved, envDeleted, newEnvId, sessionsShutDown, sessionsUnresumable, poll401, credsWorkedAfterRestart, rssGiB, swapGiB, stillLogging, serverSaidOffline, reattachAllowed, scored }`.

Return: `{ verdict, reasons[], belayed }`.

`belayed` is true ONLY when the environment is retained and sessions are resumable and the verdict is not a failure class. Seeded 90581 numbers must produce orphaned / `belayed=false`. Gap-short must produce `belayed=true`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/bollard/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `orphaned` / `gap-fatal` / `sessions-dead` / `poll-401` / `offline-lie` / `mem-thrash` / `cred-stale` / `reattach-denied`, or `permissionDecision: "deny"`, as a stop. A slack hawser is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `BOLLARD_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: orphaned/gap-fatal/… alarm…". Fires on those verdicts only. |
| `BOLLARD_GITHUB_TOKEN` / `GITHUB_TOKEN` | Bollard-ledger issue (private gist `bollard-ledger.jsonl`). Absent → "Would open a GitHub bollard-ledger issue…". Every scored pier. |
| `BOLLARD_LINEAR_KEY` / `LINEAR_API_KEY` | Orphaned / gap-fatal / sessions-dead / poll-401 opens a pier ticket. Absent → demo row. Skip otherwise. |
| `BOLLARD_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/bollard/hook/bollard.test.mjs
```
