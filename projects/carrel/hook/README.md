# Carrel hook

Library carrel scorer for Claude Code `preview_start` discovery: the tool matches `name` against the orchestrator session's `.claude/launch.json`, not the calling subagent's own file in its git worktree. A lane with `isolation:"worktree"` cannot have private preview config. POST `{ action, carrel? }` or pipe a `sessionCwd` / `callerCwd` / `launch.json` / `preview_start` triple; get `seated`, `borrowed`, `misfiled`, `contended`, `overwritten`, `sibling-served`, `lane-blind`, `nested-miss`, `main-spawn`, `fallback-ok`, or `off-shelf`.

This is not Wicket's isolation escape. It is not Fascia's trust-dialog cwd lie. It is not Hasp's generic file lease. A harness calls it when a borrowed carrel is not a hold, and `preview_start` consulted the communal catalog.

A borrowed carrel is not a hold. Score the reading room. Name the class or admit **seated**. Slack alarm on borrowed / misfiled / contended / overwritten / sibling-served / lane-blind / nested-miss / main-spawn. Linear ticket on borrowed / misfiled / sibling-served / contended. GitHub carrel-ledger of scored rooms on every score.

Idle word is **seated**, never the product name, never **empty**, never silent / mute / idle, never Byline's **credited**, never Datum's **level**, never Calque's **verbatim**, never Fascia's **fronted**. Do not ship Carrel, Stall, Booth, Desk, Alcove, Nook, Stack, Folio, or Catalog as the idle word.

The #90661 borrowed room (session file used + caller has its own file + session cwd ≠ caller cwd — cleanest: `lane-web` missing from the session catalog, attempt proceeds against `root-web` / port 3000) is **borrowed**, never **seated**. Unique nearby flags win their own seeds because those seeds do not carry the borrowed triad.

Priority when multiple match: **off-shelf** > **sibling-served** > **overwritten** > **contended** > **nested-miss** > **main-spawn** > **borrowed** > **misfiled** > **lane-blind** > **fallback-ok** > **seated**.

The hook scores `{ sessionCwd, callerCwd, launchJsonPathUsed, requestedName, configsInScope, spawnCwd, port, siblingWrites }` — never invents extra issues.

Primary: [anthropics/claude-code#90661](https://github.com/anthropics/claude-code/issues/90661). Same-class nearby: [#63008](https://github.com/anthropics/claude-code/issues/63008) [#76496](https://github.com/anthropics/claude-code/issues/76496). Related, different (label, not this): [#86039](https://github.com/anthropics/claude-code/issues/86039) [#85319](https://github.com/anthropics/claude-code/issues/85319). Cross-ecosystem: [openai/codex#18969](https://github.com/openai/codex/issues/18969) [#23095](https://github.com/openai/codex/issues/23095) [#30570](https://github.com/openai/codex/issues/30570). Downstream: narduk-enterprises/agent-infrastructure#845. NOT Wicket / Fascia / Hasp / Iota / Cinch / Cubby / Byline.

## CLI

```bash
node projects/carrel/hook/index.mjs < carrel.json
node projects/carrel/hook/index.mjs carrel.json
```

Empty stdin uses the seeded #90661 borrowed room. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `seated`, `sinks`.

## HTTP

```bash
node projects/carrel/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `seated` / `still` / `reset` (return idle **seated**), `control` / `healthy` / `proof` / `desk` / `room` (honest path that classifies **seated** with `seated` true), `ledger` / `trace` / `observe` / `score-room` (score the room), `restore` / `borrowed` / `incident` / `90661` (show #90661 borrowed → **borrowed**), or `admit`. Nested `{ carrel, action: { ... } }` is accepted. Admit does not lie: a borrowed room stays borrowed. Restore on an idle room produces the #90661 borrowed room.

Probe: `{ sessionCwd, callerCwd, launchJsonPathUsed, requestedName, sessionConfigs[], callerConfigs[], spawnCwd, port, siblingWrites }`.

Return: `{ verdict, reasons[], seated }`.

`seated` is true ONLY when the verdict is seated (idle, or honest control: launch.json resolved from the calling agent's worktree). Seeded 90661 numbers must produce borrowed / `seated=false`. Control with caller-file discovery must produce `seated=true`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/carrel/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `borrowed` / `misfiled` / `contended` / `overwritten` / `sibling-served` / `lane-blind` / `nested-miss` / `main-spawn`, or `permissionDecision: "deny"`, as a stop. A borrowed carrel is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `CARREL_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: borrowed/misfiled/… alarm…". Fires on those verdicts only. |
| `CARREL_GITHUB_TOKEN` / `GITHUB_TOKEN` | Carrel-ledger issue (private gist `carrel-ledger.jsonl`). Absent → "Would open a GitHub carrel-ledger issue…". Every scored room. |
| `CARREL_LINEAR_KEY` / `LINEAR_API_KEY` | Borrowed / misfiled / sibling-served / contended opens a room ticket. Absent → demo row. Skip otherwise. |
| `CARREL_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/carrel/hook/carrel.test.mjs
```
