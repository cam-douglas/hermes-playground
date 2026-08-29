# Spile hook

Cooper's-spile scorer for Claude Code hook stdin that stays open without EOF, while the declared per-hook timeout is not enforced parent-side. An unbounded stdin read then blocks for as long as the pipe stays open (measured hours). POST `{ action, spile? }` or pipe a probe; get `bunged`, `open-pipe`, `no-eof`, `timeout-ignored`, `wedge`, `hours-held`, `script-alive`, `parent-blind`, `self-timeout`, or `unretracted`.

This is not Sounder's missed background Bash wakeup. It is not Tappet's silent hook injection. It is not Quench's circuit breaker. It is not Leat's sleep-blocked until-loop. It is not Ullage's silent context drop / cooper gauging desk. A harness calls it when an open spile is not a hold, and the declared timeout did not reseat the bung.

An open spile is not a hold. Score the tap. Name the class or admit **bunged**. Slack alarm on wedge / hours-held / timeout-ignored / open-pipe / no-eof / script-alive / parent-blind / unretracted. Linear ticket on wedge / hours-held / timeout-ignored / open-pipe. GitHub spile-ledger of scored taps on every score.

Idle word is **bunged**, never the product name, never **empty**, never silent / mute / idle / dead, never Bollard's **belayed**, never Sounder's **keyed**, never Ullage's **gauged**. Do not ship Spile, Bung, Deadman, Petcock, Flume, Sluice, Lanyard, Dashpot, Watchdog, Empty, Silent, Mute, Idle, or Dead as the idle word.

The #90585 wedge (pipe open no EOF for hours, declared timeout 5s ignored, session frozen on hook statusMessage, notifications held until interrupt) is **wedge**, never **bunged**. Unique nearby flags win their own seeds because those seeds do not carry the wedge pentad.

Priority when multiple match: **wedge** > **hours-held** > **timeout-ignored** > **open-pipe** > **no-eof** > **script-alive** > **parent-blind** > **unretracted** > **self-timeout** > **bunged**.

The hook scores pipe-open, EOF, declared timeout, observed block, hook liveness, parent enforcement, stuck statusMessage, held notifications, and a self-timeout wrap — never invents extra issues.

Primary: [anthropics/claude-code#90585](https://github.com/anthropics/claude-code/issues/90585). Same-class: [#87289](https://github.com/anthropics/claude-code/issues/87289) (timeout does not apply while blocked on stdin) [#85250](https://github.com/anthropics/claude-code/issues/85250) (timeout not enforced parent-side) [#78756](https://github.com/anthropics/claude-code/issues/78756) (Windows client never closes hook stdin). Nearby shape only: [#48009](https://github.com/anthropics/claude-code/issues/48009) [#38162](https://github.com/anthropics/claude-code/issues/38162). NOT Sounder / Tappet / Quench / Leat / Ullage / Bollard / Clew. Cross-ecosystem: [openai/codex#27550](https://github.com/openai/codex/issues/27550).

## CLI

```bash
node projects/spile/hook/index.mjs < spile.json
node projects/spile/hook/index.mjs spile.json
```

Empty stdin uses the seeded #90585 wedge tap. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `bunged`, `sinks`.

## HTTP

```bash
node projects/spile/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `bunged` / `still` / `reset` (return idle **bunged**), `control` / `healthy` / `proof` / `tap` / `cellar` (EOF path that classifies **bunged** with `bunged` true), `ledger` / `trace` / `observe` / `seat` (score the tap), `restore` / `wedge` / `incident` (show #90585 wedge → **wedge**), or `admit`. Nested `{ spile, action: { ... } }` is accepted. Admit does not lie: a wedge tap stays wedge. Restore on an idle bench produces the #90585 wedge tap.

Probe: `{ session, issue, source, pipeOpen, eofDelivered, declaredTimeoutSec, observedBlockSec, hookStillAlive, parentEnforcedTimeout, statusMessageStuck, notificationsHeld, selfTimeoutWrapped, scored }`.

Return: `{ verdict, reasons[], bunged }`.

`bunged` is true ONLY when the pipe is closed with EOF, the declared timeout would be enforceable / was honored, the hook is not wedging, and the verdict is not a failure class. Seeded 90585 numbers must produce wedge / `bunged=false`. Control EOF path must produce `bunged=true`. Self-timeout classifies **self-timeout** with `bunged=false`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/spile/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `wedge` / `hours-held` / `timeout-ignored` / `open-pipe` / `no-eof` / `script-alive` / `parent-blind` / `unretracted`, or `permissionDecision: "deny"`, as a stop. An open spile is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `SPILE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: wedge/hours-held/… alarm…". Fires on those verdicts only. |
| `SPILE_GITHUB_TOKEN` / `GITHUB_TOKEN` | Spile-ledger issue (private gist `spile-ledger.jsonl`). Absent → "Would open a GitHub spile-ledger issue…". Every scored tap. |
| `SPILE_LINEAR_KEY` / `LINEAR_API_KEY` | Wedge / hours-held / timeout-ignored / open-pipe opens a tap ticket. Absent → demo row. Skip otherwise. |
| `SPILE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/spile/hook/spile.test.mjs
```
