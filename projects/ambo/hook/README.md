# Ambo hook

Raised-ambo / pulpit scorer for Claude Code's PermissionRequest hook that accepts, validates, and logs a `systemMessage` as success, then never renders it at the ExitPlanMode "Ready to code?" approval prompt. POST `{ action, ambo? }` or pipe a `hookEvent` / `tool` / `systemMessage` / `hookLogSuccess` / `parsedValidated` / `rendered` / `tuiRendered` / `vscodeRendered` / `permissionDecision` / `terminalSequence` / `docsClaimAllHooks` / `deferredPath` / `prompt` / `version` probe; get `unheard`, `logged-success`, `plan-card`, `silent-surface`, `tui-blank`, `vscode-blank`, `decision-free`, `terminal-sequence-ok`, `docs-all-hooks`, or `deferred-path`.

This is not Slype's sandbox pwsh 126 vs System32 powershell. It is not Tally's exit birth-count false-loss. It is not Pale's silent-absent hooks. It is not Chatelaine's nested MCP OAuth. It is not Waif's orphan process tree. It is not Berth's shared spawn tree. It is not Carrel's launch.json session cwd. It is not Cotter's machine-shop cotter-pin tray. It is not the per-surface drops (#80693 #78266 #86168 #80882 #76736) where the terminal sometimes works.

The pulpit spoke; the nave never heard. Score the card. Name the class or admit **unheard**. Slack chip + Linear ticket on logged-success / plan-card / silent-surface / tui-blank / vscode-blank / decision-free / terminal-sequence-ok / docs-all-hooks / deferred-path when this bug. GitHub ambo-ledger of scored intakes on every score.

Idle word is **unheard**, never the product name, never **empty**, never Slype's **passed**, never Tally's **squared**, never Pale's **bound**, never Chatelaine's **girt**, never Waif's **sheltered**, never Berth's **alongside**. Do not ship Pulpit, Lectern, Lecturn, Rostrum, Dais, Nave, Chancel, Altar, Slype, Wicket, Pale, Grille, Cotter, Yett, Postern, Narthex, Galilee, Undercroft as the idle word.

The #90685 logged-success board (PermissionRequest + ExitPlanMode + systemMessage validated + not rendered) is **logged-success**, never **unheard**. Unique nearby flags win their own seeds because those seeds do not carry the #90685 triad.

Priority when multiple match: unique nearby contrast seeds keep their labels > **logged-success** > **silent-surface** > **plan-card** > **tui-blank** > **vscode-blank** > **decision-free** > **terminal-sequence-ok** > **docs-all-hooks** > **deferred-path** > **unheard**.

The hook scores `{ hookEvent, tool, systemMessage, hookLogSuccess, parsedValidated, rendered, tuiRendered, vscodeRendered, permissionDecision, terminalSequence, docsClaimAllHooks, deferredPath, prompt, version }` — never invents extra issues.

Primary: [anthropics/claude-code#90685](https://github.com/anthropics/claude-code/issues/90685). Contrast (not this): [#80693](https://github.com/anthropics/claude-code/issues/80693) [#78266](https://github.com/anthropics/claude-code/issues/78266) [#86168](https://github.com/anthropics/claude-code/issues/86168) [#80882](https://github.com/anthropics/claude-code/issues/80882) [#76736](https://github.com/anthropics/claude-code/issues/76736). Cross-ecosystem: [openai/codex#17745](https://github.com/openai/codex/issues/17745) [#35906](https://github.com/openai/codex/issues/35906) [#33020](https://github.com/openai/codex/issues/33020). NOT Slype / Tally / Pale / Chatelaine / Waif / Berth / Carrel / Cotter.

## CLI

```bash
node projects/ambo/hook/index.mjs < ambo.json
node projects/ambo/hook/index.mjs ambo.json
```

Empty stdin uses the seeded #90685 logged-success board. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `unheard`, `sinks`.

## HTTP

```bash
node projects/ambo/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `still` / `reset` (return idle **unheard**), `control` / `healthy` / `proof` / `hold` (honest path that classifies **unheard** with `unheard` true), `ledger` / `trace` / `observe` / `score-ambo` (score the card), `restore` / `incident` / `90685` / `logged-success` (show #90685 logged-success → **logged-success**), or `admit`. Nested `{ ambo, action: { ... } }` is accepted. Admit does not lie: a logged-success board stays logged-success. Restore on an idle board produces the #90685 logged-success board.

Probe: `{ hookEvent, tool, systemMessage, hookLogSuccess, parsedValidated, rendered, tuiRendered, vscodeRendered, permissionDecision, terminalSequence, docsClaimAllHooks, deferredPath, prompt, version }`.

Return: `{ verdict, reasons[], unheard }`.

`unheard` is true ONLY when the verdict is unheard (idle, or honest control: systemMessage actually rendered on the approval card). Seeded 90685 numbers must produce logged-success / `unheard=false`. Control with `rendered` true must produce `unheard=true`. A logged-success board is never unheard.

## Harness sketch

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/ambo/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `logged-success` / `plan-card` / `silent-surface` / `tui-blank` / `vscode-blank` / `decision-free` / `terminal-sequence-ok` / `docs-all-hooks` / `deferred-path`, or `permissionDecision: "deny"`, as a stop. The pulpit spoke; the nave never heard.

## Env

| Variable | Meaning |
| --- | --- |
| `AMBO_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: Ambo logged-success · …". Fires on fail verdicts only (this bug, not labeled contrast). |
| `AMBO_GITHUB_TOKEN` / `GITHUB_TOKEN` | Ambo-ledger (private gist `ambo-ledger.jsonl`). Absent → "Would append a GitHub ambo-ledger row…". Every scored intake. |
| `AMBO_LINEAR_KEY` / `LINEAR_API_KEY` | Ambo-card alarm opens a ticket. Absent → demo row. Skip otherwise. |
| `AMBO_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/ambo/hook/ambo.test.mjs
```
