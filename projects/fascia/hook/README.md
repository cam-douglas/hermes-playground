# Fascia hook

Shopfront-fascia scorer for Claude Code trust-path consent lie: clicking "Start with worktree" on a suggested-task chip shows a "Trust this workspace?" modal that names the `cwd` passed to `spawn_task`, but the session runs in a freshly created worktree under `.claude/worktrees/`. POST `{ action, fascia? }` or pipe a probe; get `fronted`, `misnamed`, `diverted`, `approved-blind`, `spawn-cwd`, `worktree-elsewhere`, `trust-lie`, `chip-start`, or `account-split`.

This is not Wicket's isolation escape. It is not Snib's Trusted Devices fail-open. It is not Iota's path-key identity. A harness calls it when a misnamed fascia is not a hold, and the consent label lied about the door.

A misnamed fascia is not a hold. Score the shopfront. Name the class or admit **fronted**. Slack alarm on misnamed / diverted / approved-blind / trust-lie / worktree-elsewhere. Linear ticket on misnamed / trust-lie. GitHub fascia-ledger of scored probes on every score.

Idle word is **fronted**, never the product name, never **empty**, never silent / mute / idle / dead / sealed / locked, never Quoin's **locked**, never Gaff's **yanked**, never Sear's **caught**, never Cubby's **stowed**, never Wicket's **home**. Do not ship Fascia, Placard, Shingle, Marquee, Lintel, Escutcheon, Signboard, Trustgate, or WorktreeTrust as the idle word.

The #90638 misnamed shopfront (dialog names spawn_task cwd + session runs in `.claude/worktrees`) is **misnamed**, never **fronted**. Unique nearby flags win their own seeds because those seeds do not carry the misnamed triad.

Priority when multiple match: **misnamed** > **diverted** > **approved-blind** > **trust-lie** > **worktree-elsewhere** > **spawn-cwd** > **chip-start** > **account-split** > **fronted**.

The hook scores `{ dialogNamedPath, actualRunPath, spawnTaskCwd, button, configDir, trustPresentInActiveConfig, trustPresentInOtherAccount, platform, issue }` — never invents extra issues.

Primary: [anthropics/claude-code#90638](https://github.com/anthropics/claude-code/issues/90638). Related (not identical): [#54628](https://github.com/anthropics/claude-code/issues/54628) [#87325](https://github.com/anthropics/claude-code/issues/87325) [#67319](https://github.com/anthropics/claude-code/issues/67319) [#90041](https://github.com/anthropics/claude-code/issues/90041) [#74794](https://github.com/anthropics/claude-code/issues/74794). NOT this (Wicket): [#74726](https://github.com/anthropics/claude-code/issues/74726) [#81333](https://github.com/anthropics/claude-code/issues/81333) [#86584](https://github.com/anthropics/claude-code/issues/86584) [#85448](https://github.com/anthropics/claude-code/issues/85448). NOT Wicket / Snib / Iota / Damper / Hasp / Cubby / Quoin / Gaff. Cross-ecosystem: [openai/codex#16525](https://github.com/openai/codex/issues/16525).

## CLI

```bash
node projects/fascia/hook/index.mjs < fascia.json
node projects/fascia/hook/index.mjs fascia.json
```

Empty stdin uses the seeded #90638 misnamed shopfront. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `fronted`, `sinks`.

## HTTP

```bash
node projects/fascia/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `fronted` / `still` / `reset` (return idle **fronted**), `control` / `healthy` / `proof` / `shopfront` / `desk` (honest path that classifies **fronted** with `fronted` true), `ledger` / `trace` / `observe` / `score-shopfront` (score the shopfront), `restore` / `misnamed` / `incident` (show #90638 misnamed → **misnamed**), or `admit`. Nested `{ fascia, action: { ... } }` is accepted. Admit does not lie: a misnamed shopfront stays misnamed. Restore on an idle shopfront produces the #90638 misnamed shopfront.

Probe: `{ session, issue, source, dialogNamedPath, actualRunPath, spawnTaskCwd, button, configDir, trustPresentInActiveConfig, trustPresentInOtherAccount, platform, approved, namedPathNeverRan, scored }`.

Return: `{ verdict, reasons[], fronted }`.

`fronted` is true ONLY when normalized dialogNamedPath === normalized actualRunPath AND the verdict is not a failure class. Seeded 90638 numbers must produce misnamed / `fronted=false`. Control matching paths must produce `fronted=true`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/fascia/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `misnamed` / `diverted` / `approved-blind` / `trust-lie` / `worktree-elsewhere`, or `permissionDecision: "deny"`, as a stop. A misnamed fascia is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `FASCIA_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: misnamed/diverted/… alarm…". Fires on those verdicts only. |
| `FASCIA_GITHUB_TOKEN` / `GITHUB_TOKEN` | Fascia-ledger issue (private gist `fascia-ledger.jsonl`). Absent → "Would open a GitHub fascia-ledger issue…". Every scored probe. |
| `FASCIA_LINEAR_KEY` / `LINEAR_API_KEY` | Misnamed / trust-lie opens a shopfront ticket. Absent → demo row. Skip otherwise. |
| `FASCIA_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/fascia/hook/fascia.test.mjs
```
