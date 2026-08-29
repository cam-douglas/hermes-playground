# Quoin hook

Letterpress-quoin scorer for Claude Code Bash-tool unescaping inside a quoted heredoc (`<<'EOF'`): one backslash-unescape pass runs on the body before the shell sees it, so `\\` collapses to `\` while `\U` is left alone. POSIX requires a quoted delimiter to suppress all expansion. POST `{ action, quoin? }` or pipe a probe; get `locked`, `shifted`, `collapsed`, `unescaped`, `misattributed`, `path-broke`, `regex-broke`, `double-slash`, or `sealed-open`.

This is not Scant's PATH truncation. It is not Sear's inert `set -e`. It is not Grille's Bash-steered edits. A harness calls it when a shifted form is not a hold, and the quoted delimiter lied.

A shifted form is not a hold. Score the chase. Name the class or admit **locked**. Slack alarm on shifted / collapsed / misattributed / path-broke / regex-broke. Linear ticket on shifted / misattributed. GitHub quoin-ledger of scored probes on every score.

Idle word is **locked**, never the product name, never **empty**, never silent / mute / idle / dead / sealed, never Gaff's **yanked**, never Sear's **caught**, never Cubby's **stowed**, never Grille's **posted**. Do not ship Quoin, Bodkin, Chase, Galley, Slug, Wafer, Cachet, Escaper, Heredoc, or Quote as the idle word.

The #90630 shifted chase (quoted delimiter + one unescape pass that collapses `\\` to `\`) is **shifted**, never **locked**. Unique nearby flags win their own seeds because those seeds do not carry the shifted pair.

Priority when multiple match: **shifted** > **misattributed** > **path-broke** > **regex-broke** > **collapsed** > **double-slash** > **unescaped** > **sealed-open** > **locked**.

The hook scores `{ composedBody, receivedBody, delimiterQuoted, tool, platform, traceback, issue }` — never invents extra issues.

Primary: [anthropics/claude-code#90630](https://github.com/anthropics/claude-code/issues/90630). Same class: [#88561](https://github.com/anthropics/claude-code/issues/88561) [#89392](https://github.com/anthropics/claude-code/issues/89392) [#85856](https://github.com/anthropics/claude-code/issues/85856). Nearby (not this): [#72957](https://github.com/anthropics/claude-code/issues/72957) (Write/Edit `\uXXXX`) [#90597](https://github.com/anthropics/claude-code/issues/90597) (platform heredoc prescription). NOT Scant / Sear / Grille / Assay / Stencil / Gaff. Cross-ecosystem: [openai/codex#41534](https://github.com/openai/codex/issues/41534).

## CLI

```bash
node projects/quoin/hook/index.mjs < quoin.json
node projects/quoin/hook/index.mjs quoin.json
```

Empty stdin uses the seeded #90630 shifted chase. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `locked`, `sinks`.

## HTTP

```bash
node projects/quoin/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `locked` / `still` / `reset` (return idle **locked**), `control` / `healthy` / `proof` / `letterpress` / `chase` (verbatim quoted-heredoc path that classifies **locked** with `locked` true), `powershell` / `pwsh` (PowerShell `@'...'@` control → **locked**), `ledger` / `trace` / `observe` / `score-chase` (score the chase), `restore` / `shifted` / `incident` (show #90630 shifted → **shifted**), or `admit`. Nested `{ quoin, action: { ... } }` is accepted. Admit does not lie: a shifted chase stays shifted. Restore on an idle chase produces the #90630 shifted chase.

Probe: `{ session, issue, source, composedBody, receivedBody, delimiterQuoted, tool, platform, traceback, commandTextCollapse, windowsStrip, windowsHalve, regexChanged, unescapeApplied, sealedLook, powershellHereString, scored }`.

Return: `{ verdict, reasons[], locked }`.

`locked` is true ONLY when composed === received (verbatim) under a quoted delimiter, OR when the PowerShell here-string / no-unescape control holds, and the verdict is not a failure class. Seeded 90630 numbers must produce shifted / `locked=false`. Control verbatim / PowerShell path must produce `locked=true`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/quoin/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `shifted` / `collapsed` / `misattributed` / `path-broke` / `regex-broke`, or `permissionDecision: "deny"`, as a stop. A shifted form is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `QUOIN_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: shifted/collapsed/… alarm…". Fires on those verdicts only. |
| `QUOIN_GITHUB_TOKEN` / `GITHUB_TOKEN` | Quoin-ledger issue (private gist `quoin-ledger.jsonl`). Absent → "Would open a GitHub quoin-ledger issue…". Every scored probe. |
| `QUOIN_LINEAR_KEY` / `LINEAR_API_KEY` | Shifted / misattributed opens a chase ticket. Absent → demo row. Skip otherwise. |
| `QUOIN_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/quoin/hook/quoin.test.mjs
```
