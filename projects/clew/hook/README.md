# Clew hook

Rigger's clew scorer for a sandbox deny list that winds two entries per registered git worktree onto a single `/bin/bash -c "<bwrap …>"` argument until Linux `MAX_ARG_STRLEN` (128 KB) and every Bash spawn dies with E2BIG. POST `{ action, clew? }` or pipe a probe; get `rove`, `fouled`, `overcoiled`, `choked`, `twinned`, `swollen`, `jammed`, `pruned`, `cached`, or `globbed`.

This is not Wicket's isolation leak. Wicket scores whether isolation holds; Clew scores whether the CVE-mitigation deny list still lets `/bin/bash` spawn. Isolation *working* (`isolation: "worktree"` agent fan-outs, #82840) is what stuffs the clew. It is not Scant's PATH truncation inside a shell snapshot. It is not Sump's literal `/dev/null` LFS hooks. It is not Cinch's silent partial mounts. It is not Hasp's file lease. It is not Sounder's missed background wakeup. It is not #51126 as a fix (closed not-planned: configure fewer user denies — #90569 has no user-configured deny rules). A harness calls it when a working-size coil is not a hold, and even `sleep 5` dies.

A working-size coil is not a hold. Score the clew. Name the class or admit **rove**. Slack alarm on fouled / overcoiled / choked / jammed / swollen / cached / globbed. Linear ticket on fouled / choked / jammed. GitHub clew-ledger of scored coils on every score.

Idle word is **rove**, never the product name, never **empty**, never silent / mute / idle / dead, never Sounder's **keyed**, never Wicket's **home**. Do not ship Clew, Empty, Silent, Mute, Idle, or Dead as the idle word.

The #90569 fouled (261 worktrees, 524 worktree denies, 130.7KB single arg, E2BIG, even sleep 5 fails) is **fouled**, never **rove**. The cliff is sudden: cleanup that would shrink the list also dies (HEADLESS-BRICK / self-heal-none). Sweep + `git worktree prune` without a process restart is **cached**, never **rove**. Only rebuild-after-restart can be pruned/rove.

Priority when multiple match: **fouled** > **cached** > **overcoiled** > **choked** > **twinned** > **swollen** > **jammed** > **globbed** > **pruned** > **rove**.

The hook scores worktree count, worktree denies, baseline vs total deny count, largest argv bytes, E2BIG, spawn / sleep / echo / monitor failure, session-cached profiles, per-file glob expansion, and ancestor expansion — never invents extra issues.

Primary: [anthropics/claude-code#90569](https://github.com/anthropics/claude-code/issues/90569). Same-class: [#82840](https://github.com/anthropics/claude-code/issues/82840) (profile cached; sweep stale; Workflow fan-outs) [#73468](https://github.com/anthropics/claude-code/issues/73468) (macOS sandbox-exec -p vs ARG_MAX ~1000 trees) [#73437](https://github.com/anthropics/claude-code/issues/73437) (2.1.196; ancestor expander; ~50-tree cliff) #74081 #82173 #78253. [#51126](https://github.com/anthropics/claude-code/issues/51126) is the rejected pole (closed not-planned: configure fewer user denies — not a fix). #46461 #74032. NOT Wicket / Scant / Sump / Cinch / Hasp / Sounder. Cross-ecosystem: [openai/codex#33479](https://github.com/openai/codex/issues/33479) + [openai/codex#37632](https://github.com/openai/codex/issues/37632) (writable roots 5→253 until E2BIG), [openai/codex#34878](https://github.com/openai/codex/issues/34878) (notify as one argv). Suggested remediations from the issue (not shipped here): bwrap real argv / `--args-fd`, or deny `.git/worktrees/` once and allow back only the current session’s admin dir (O(1)).

## CLI

```bash
node projects/clew/hook/index.mjs < clew.json
node projects/clew/hook/index.mjs clew.json
```

Empty stdin uses the seeded #90569 fouled clew. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `rove`, `sinks`.

## HTTP

```bash
node projects/clew/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `wind`, `bail` / `rove` / `still` / `reset` (return idle **rove**), `control` / `healthy` / `proof` / `bench` / `loft` (working-size coil that stays **rove**), `ledger` / `trace` / `observe` / `coil` (score the coil), `restore` / `fouled` / `incident` (show #90569 fouled → **fouled**), or `admit`. Nested `{ clew, action: { ... } }` is accepted. Admit does not lie: a fouled clew stays fouled. Restore on an idle loft produces the #90569 fouled clew.

Probe: `{ session, issue, source, worktreeCount, worktreeDenyCount, baselineDenyCount, totalDenyCount, largestArgBytes, maxArgStrlen, e2big, spawnFailed, sleepFailed, echoFailed, monitorFailed, profileCached, prunedButNotRestarted, globExpandedPerFile, ancestorExpanded, scored }`.

Return: `{ verdict, reasons[], rove }`.

`rove` is true ONLY when spawn lives and `largestArgBytes` < `maxArgStrlen` and `e2big` is false and the session profile is not cached (`profileCached` / `prunedButNotRestarted` are false). Seeded 90569 numbers must produce fouled / `rove=false`. Sweep + prune without restart must produce cached / `rove=false`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/clew/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `fouled` / `overcoiled` / `choked` / `jammed` / `swollen` / `cached` / `globbed`, or `permissionDecision: "deny"`, as a stop. A working-size coil is not a hold. Dropping the denies is not the ask.

## Env

| Variable | Meaning |
| --- | --- |
| `CLEW_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: fouled/overcoiled/… alarm…". Fires on those verdicts only. |
| `CLEW_GITHUB_TOKEN` / `GITHUB_TOKEN` | Clew-ledger issue (private gist `clew-ledger.jsonl`). Absent → "Would open a GitHub clew-ledger issue…". Every scored coil. |
| `CLEW_LINEAR_KEY` / `LINEAR_API_KEY` | Fouled / choked / jammed opens a coil ticket. Absent → demo row. Skip otherwise. |
| `CLEW_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/clew/hook/clew.test.mjs
```
