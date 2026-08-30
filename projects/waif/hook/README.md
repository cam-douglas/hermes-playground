# Waif hook

Parish foundling-home scorer for Claude Code Bash timeout that returns an error to the model but does not kill the child process tree. POST `{ action, waif? }` or pipe a `timedOut` / `parentAlive` / `childCount` / `childrenWithDeadParent` / `processGroupKilled` / `jobObjectAttached` / `taskkillTreeUsed` / `platform` / `rssMb` / `cpuPct` / `modelSaw` probe; get `sheltered`, `abandoned`, `orphaned`, `tree-alive`, `parent-dead`, `timeout-seen`, `group-unkilled`, `job-missing`, `taskkill-skipped`, `defender-load`, or `off-ward`.

This is not Gaff's false-complete billing (timeout-kill DID happen; receipt said completed exit 0). It is not Berth's shared spawn_task tree. A harness calls it when an abandoned child is not a hold, and the orphans keep crawling after the model already saw timeout.

An abandoned child is not a hold. Score the ward. Name the class or admit **sheltered**. Slack alarm + Linear ticket on abandoned / orphaned / tree-alive / parent-dead / timeout-seen / group-unkilled / job-missing / taskkill-skipped / defender-load. GitHub waif-ledger of scored intakes on every score.

Idle word is **sheltered**, never the product name, never **empty**, never silent / mute / idle, never Gaff's **yanked**, never Berth's **alongside**, never **home**, never **orphaned**. Do not ship Waif, Foundling, Derelict, Orphan, Urchin, Stray, Remora, Jetsam, Flotsam, Latchkey, Zombie, Reaper as the idle word.

The #90672 abandoned ward (timedOut + children still running with a dead/missing parent + model already saw timeout) is **abandoned**, never **sheltered**. Unique nearby flags win their own seeds because those seeds do not carry the abandoned triad.

Priority when multiple match: **off-ward** > **abandoned** > **defender-load** > **taskkill-skipped** > **job-missing** > **group-unkilled** > **parent-dead** > **tree-alive** > **orphaned** > **timeout-seen** > **sheltered**.

The hook scores `{ timedOut, parentAlive, childCount, childrenWithDeadParent, processGroupKilled, jobObjectAttached, taskkillTreeUsed, platform, rssMb, cpuPct, modelSaw }` — never invents extra issues.

Primary: [anthropics/claude-code#90672](https://github.com/anthropics/claude-code/issues/90672). Same-class nearby: [#78030](https://github.com/anthropics/claude-code/issues/78030) [#76353](https://github.com/anthropics/claude-code/issues/76353) [#85200](https://github.com/anthropics/claude-code/issues/85200) [#84464](https://github.com/anthropics/claude-code/issues/84464) [#82433](https://github.com/anthropics/claude-code/issues/82433) [#76056](https://github.com/anthropics/claude-code/issues/76056) [#84647](https://github.com/anthropics/claude-code/issues/84647) [#79727](https://github.com/anthropics/claude-code/issues/79727). Related, different (label, not this): [#90616](https://github.com/anthropics/claude-code/issues/90616) Gaff [#90668](https://github.com/anthropics/claude-code/issues/90668) Berth [#90661](https://github.com/anthropics/claude-code/issues/90661) Carrel [#90662](https://github.com/anthropics/claude-code/issues/90662) Byline. Cross-ecosystem: [openai/codex#35393](https://github.com/openai/codex/issues/35393) [#30802](https://github.com/openai/codex/issues/30802) [#37770](https://github.com/openai/codex/issues/37770) [#25388](https://github.com/openai/codex/issues/25388). NOT Gaff / Berth / leftover woodworking.

## CLI

```bash
node projects/waif/hook/index.mjs < waif.json
node projects/waif/hook/index.mjs waif.json
```

Empty stdin uses the seeded #90672 abandoned ward. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `sheltered`, `sinks`.

## HTTP

```bash
node projects/waif/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `sheltered` / `still` / `reset` (return idle **sheltered**), `control` / `healthy` / `proof` / `ward` / `hold` (honest path that classifies **sheltered** with `sheltered` true), `ledger` / `trace` / `observe` / `score-waif` (score the ward), `restore` / `abandoned` / `incident` / `90672` (show #90672 abandoned → **abandoned**), or `admit`. Nested `{ waif, action: { ... } }` is accepted. Admit does not lie: an abandoned ward stays abandoned. Restore on an idle ward produces the #90672 abandoned ward.

Probe: `{ timedOut, parentAlive, childCount, childrenWithDeadParent, processGroupKilled, jobObjectAttached, taskkillTreeUsed, platform, rssMb, cpuPct, modelSaw }`.

Return: `{ verdict, reasons[], sheltered }`.

`sheltered` is true ONLY when the verdict is sheltered (idle, or honest control: timeout killed the whole tree via Job Object / process group). Seeded 90672 numbers must produce abandoned / `sheltered=false`. Control with a reaped tree must produce `sheltered=true`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/waif/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `abandoned` / `orphaned` / `tree-alive` / `parent-dead` / `timeout-seen` / `group-unkilled` / `job-missing` / `taskkill-skipped` / `defender-load`, or `permissionDecision: "deny"`, as a stop. An abandoned child is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `WAIF_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: abandoned/orphaned/… alarm…". Fires on those verdicts only. |
| `WAIF_GITHUB_TOKEN` / `GITHUB_TOKEN` | Waif-ledger issue (private gist `waif-ledger.jsonl`). Absent → "Would open a GitHub waif-ledger issue…". Every scored intake. |
| `WAIF_LINEAR_KEY` / `LINEAR_API_KEY` | Abandoned-tree ward opens a ticket. Absent → demo row. Skip otherwise. |
| `WAIF_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/waif/hook/waif.test.mjs
```
