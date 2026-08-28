# Sump hook

Pit scorer for Claude Code worktree provisioning that writes Git LFS hooks into a literal relative path `dev/null/`. POST `{ action, probe? }`; get `drained`, `silted`, `clogged`, `fouled`, `pooled`, `diverted`, `littered`, `phantom`, `absolute`, or `hooked`.

This is not a worktree isolation pin. It is not a PATH truncation. It is not a mid-turn fold. A harness calls it when a worktree's `git status` shows an untracked `dev/null/` directory of LFS hook shims: the real `core.hookspath` is already correct, the files never fire, and a path that should vanish into null became a shelf of silt.

A null path is not a hold. Score the silt. Name the class or admit **drained**. Slack sump alarm on silted / clogged / fouled / littered. Linear ticket on silted / clogged / fouled. GitHub sump-ledger issue on every scored probe.

Idle word is **drained**, never the product name, never **empty**, never Pleat's **flat**, never Scant's **fit**, never Wicket's **home**. Do not ship Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Livery, Nixie, Crypt, Fold, Accordion, Bellows, Drain, Null, Sink, Gutter, Pit, Ash, Ashcan, Sluice, Culvert, Weir, Bung, Void, Limbo, or Oubliette.

## CLI

```bash
node projects/sump/hook/index.mjs < probe.json
```

Empty stdin uses the seeded silted pit (`#90456`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `drained`, `silted`, `clogged`, `sinks`.

## HTTP

```bash
node projects/sump/hook/index.mjs --listen 9070
curl -s -X POST http://127.0.0.1:9070 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `pump` / `stamp`, `shut` / `bail` / `drain` / `drained` (return idle **drained**), `ledger` / `trace` / `observe` / `sound` (sound the pit), `silt` / `flood` / `foul` (show #90456 populated pit → **silted**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90456` silted. Admit does not lie: a silted probe stays silted. Silt on an idle pit produces a silted grate.

Probe: `{ literalNullDir, hookFiles, emptyNullDir, fullyPopulated, hooksLandedInNull, hooksAreLfsShims, gitStatusUntracked, pathResolvedRelative, hooksNeverFire, hooksLookReal, realHookspathCorrect, hookspathClaimed, hookspathIsAbsolute, relativeNullWrite, lfsInstallRaced, lfsShimsPresent }`.

Return: `{ verdict, reasons[], cluster[], drained, silted, clogged }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/sump/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `silted` / `clogged` / `fouled` / `littered`, or `permissionDecision: "deny"`, as a stop. A null path is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `SUMP_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: silted/clogged/fouled/littered alarm…". Fires on those verdicts only. |
| `SUMP_GITHUB_TOKEN` / `GITHUB_TOKEN` | Sump-ledger issue (private gist `sump-ledger.jsonl`). Absent → "Would open a GitHub sump-ledger issue…". Every scored probe. |
| `SUMP_LINEAR_KEY` / `LINEAR_API_KEY` | Silted / clogged / fouled opens a silt ticket. Absent → demo row. Skip otherwise. |
| `SUMP_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/sump/hook/*.test.mjs
```
