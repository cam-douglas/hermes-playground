# Pale hook

Tudor jurisdiction-pale scorer for Claude Code project hooks that fail open with zero signal when the session's project root is not the directory that holds `.claude/settings.json`. POST `{ action, pale? }` or pipe a `settingsPresentOnDisk` / `sessionProjectRoot` / `settingsDir` / `rootsMatch` / `hooksRegisteredCount` / `warningEmitted` / `startedAboveRepo` / `startedInSubdir` / `walkUpAttempted` / `toolProceededUnhooked` / `nearbySubdirMiss` / `nearbyWebIgnore` / `nearbyCloudEmpty` probe; get `bound`, `beyond`, `unhooked`, `rootless`, `silent`, `above`, `subdir`, `walkless`, `fail-open`, or `off-pale`.

This is not Chatelaine's nested mcpOAuth-in-identity burn. It is not Waif's abandoned Bash child tree. A harness calls it when a session started above (or otherwise outside) the repo that holds settings, and every PreToolUse / PostToolUse / Stop hook is silently absent.

A session beyond the pale is not a hold. Score the fence. Name the class or admit **bound**. Slack chip + Linear ticket on beyond / unhooked / rootless / silent / above / subdir / walkless / fail-open. GitHub pale-ledger of scored intakes on every score.

Idle word is **bound**, never the product name, never **empty**, never Chatelaine's **girt**, never Waif's **sheltered**, never Berth's **alongside**. Do not ship Pale, Bailey, Soke, Stile, Limen, Verge, Franchise, Bailiwick as the idle word.

The #90683 beyond fence (wrong project root + settings present below/elsewhere + hooks absent with no warning) is **beyond**, never **bound**. Unique nearby flags win their own seeds because those seeds do not carry the beyond triad.

Priority when multiple match: unique nearby without the triad (**subdir** / **silent** / **rootless** / **off-pale**) > **beyond** > **fail-open** > **unhooked** > **above** > **walkless** > **silent** > **rootless** > **bound**.

The hook scores `{ settingsPresentOnDisk, sessionProjectRoot, settingsDir, rootsMatch, hooksRegisteredCount, warningEmitted, startedAboveRepo, startedInSubdir, walkUpAttempted, toolProceededUnhooked, nearbySubdirMiss, nearbyWebIgnore, nearbyCloudEmpty }` — never invents extra issues.

Primary: [anthropics/claude-code#90683](https://github.com/anthropics/claude-code/issues/90683). Same-class nearby: [#76441](https://github.com/anthropics/claude-code/issues/76441) [#79111](https://github.com/anthropics/claude-code/issues/79111) [#86187](https://github.com/anthropics/claude-code/issues/86187) [#79480](https://github.com/anthropics/claude-code/issues/79480) [#89215](https://github.com/anthropics/claude-code/issues/89215) [#78505](https://github.com/anthropics/claude-code/issues/78505) [#88871](https://github.com/anthropics/claude-code/issues/88871). Related, different (label, not this): [#90647](https://github.com/anthropics/claude-code/issues/90647) Chatelaine [#90672](https://github.com/anthropics/claude-code/issues/90672) Waif [#90668](https://github.com/anthropics/claude-code/issues/90668) Berth [#90661](https://github.com/anthropics/claude-code/issues/90661) Carrel [#90662](https://github.com/anthropics/claude-code/issues/90662) Byline [#90638](https://github.com/anthropics/claude-code/issues/90638) Fascia. Cross-ecosystem: [openai/codex#28903](https://github.com/openai/codex/issues/28903) [#30789](https://github.com/openai/codex/issues/30789) [#38065](https://github.com/openai/codex/issues/38065). NOT Chatelaine / Waif / leftover woodworking.

## CLI

```bash
node projects/pale/hook/index.mjs < pale.json
node projects/pale/hook/index.mjs pale.json
```

Empty stdin uses the seeded #90683 beyond fence. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `bound`, `sinks`.

## HTTP

```bash
node projects/pale/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `bound` / `still` / `reset` (return idle **bound**), `control` / `healthy` / `proof` / `hold` (honest path that classifies **bound** with `bound` true), `ledger` / `trace` / `observe` / `score-pale` (score the fence), `restore` / `beyond` / `incident` / `90683` (show #90683 beyond → **beyond**), or `admit`. Nested `{ pale, action: { ... } }` is accepted. Admit does not lie: a beyond fence stays beyond. Restore on an idle fence produces the #90683 beyond fence.

Probe: `{ settingsPresentOnDisk, sessionProjectRoot, settingsDir, rootsMatch, hooksRegisteredCount, warningEmitted, startedAboveRepo, startedInSubdir, walkUpAttempted, toolProceededUnhooked, nearbySubdirMiss, nearbyWebIgnore, nearbyCloudEmpty }`.

Return: `{ verdict, reasons[], bound }`.

`bound` is true ONLY when the verdict is bound (idle, or honest control: session project root == directory containing `.claude/settings.json`; hooks registered and would fire). Seeded 90683 numbers must produce beyond / `bound=false`. Control with a matching root must produce `bound=true`. A session beyond the pale is never bound.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/pale/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `beyond` / `unhooked` / `rootless` / `silent` / `above` / `subdir` / `walkless` / `fail-open`, or `permissionDecision: "deny"`, as a stop. A session beyond the pale is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `PALE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: Pale beyond · …". Fires on fail verdicts only. |
| `PALE_GITHUB_TOKEN` / `GITHUB_TOKEN` | Pale-ledger (private gist `pale-ledger.jsonl`). Absent → "Would append a GitHub pale-ledger row…". Every scored intake. |
| `PALE_LINEAR_KEY` / `LINEAR_API_KEY` | Pale-fence alarm opens a ticket. Absent → demo row. Skip otherwise. |
| `PALE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/pale/hook/pale.test.mjs
```
