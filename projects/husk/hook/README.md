# Husk hook

Scores a headless Claude Code / Agent SDK **result JSON envelope** (and optional stream-json lines) → `{ verdict, reasons[], signals }`.

A husk is not a hold. Score the envelope. Name the class or admit **kernel**. Treat **husked** as failure even when `claude -p` exited 0.

This is not Knock (permission-grant stalls). Not Coda (last-text-block loss after a real turn). Not Assay (tool-arg corruption). Not Suture (stream tear). Not Reed (MCP contacts). Not Snib / Veto / Wicket / Sigil / Stencil / Blot / Fathom / Hasp / Parity / Reveille / Quench / Scrim.

Idle word is **kernel**, never the product name. When hollow: **husked**.

## CLI

```bash
claude -p "/skill" --output-format json | node projects/husk/hook/index.mjs
claude -p "/skill" --output-format stream-json --verbose | node projects/husk/hook/index.mjs
node projects/husk/hook/index.mjs --seed 87159
```

Empty stdin admits **kernel**. Stdout is JSON: `verdict`, `reasons`, `signals`. Exit `0` only for kernel. Every hollow class (`husked`, `aborted`, `denied`, `nested`, `contended`, `zeroed`, `ghosted`) exits `1` — even when the envelope is `subtype:"success"` and Claude itself exited 0.

Orchestrators should fail the job on a non-zero husk exit. Do not key off Claude's exit code alone.

## Score rules

| Verdict | When |
| --- | --- |
| **kernel** | `num_turns >= 1` with non-empty result or real usage / `duration_api_ms > 0`. Also the idle / empty envelope. |
| **husked** | subtype success (or `is_error:false`) AND `num_turns===0` AND empty/missing result |
| **denied** | `<local-command-stderr>` / permission-denial prose in stream or side-channel while typed `permission_denials` is empty |
| **aborted** | failing preamble / `probe stderr boom` |
| **nested** | nested `claude -p` / CLAUDECODE / parent session |
| **contended** | global single-flight lock without a nested-p skill path |
| **zeroed** | GHA / Max OAuth corroboration of the hollow zero-usage shape |
| **ghosted** | stream present but no user event and no assistant — the abort left no typed trace |

## Harness sketch

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/husk/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Or pipe the `--output-format json` result from any orchestrator. If `verdict` is not `kernel`, the model never ran — do not treat the job as success.

```bash
node --test projects/husk/hook/husk.test.mjs
```
