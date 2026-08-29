# Grille hook

Bank-teller scorer for Claude Code permission-mode system-prompt steering that sends file mutations through Bash (sed / heredoc / short script) instead of Edit/Write. Edit/Write tool cards render diffs; Bash does not. So diffs vanish, Write|Edit hooks never fire, and path-deny / `paths:` frontmatter go blind. POST `{ action, grille? }` or pipe a probe; get `posted`, `slotted`, `steered`, `unreceipted`, `unhooked`, `killed`, `overlay`, `ungated`, `allowlisted`, or `restored`.

This is not Stencil's plan-mode fence. It is not Veto's heron_brook Agent-tool veto. It is not Tappet's silent hook injection. It is not Spile's stdin-EOF wedge. A harness calls it when a night drop through the slot is not a hold, and the audited Edit path was abandoned.

A night drop through the slot is not a hold. Score the grille. Name the class or admit **posted**. Slack alarm on slotted / steered / unreceipted / unhooked / killed / allowlisted. Linear ticket on slotted / steered / unhooked / killed. GitHub grille-ledger of scored probes on every score.

Idle word is **posted**, never the product name, never **empty**, never silent / mute / idle / dead, never Spile's **bunged**, never Stencil's **dry**. Do not ship Grille, Grill, Galley, Chase, Stick, Proof, Slug, Empty, Silent, Mute, Idle, or Dead as the idle word.

The #90599 steered desk (bypass directive present, Bash write-capable, Edit/Write unused, diffs would not render, Write|Edit hooks would not fire) is **steered**, never **posted**. Unique nearby flags win their own seeds because those seeds do not carry the steered pentad.

Priority when multiple match: **killed** > **ungated** > **steered** > **allowlisted** > **slotted** > **unreceipted** > **unhooked** > **overlay** > **restored** > **posted**.

The hook scores tool-path (Edit/Write vs Bash write-capable), whether a diff would render, whether Write|Edit hooks would fire, Windows heredoc kill, allowlist, and overlay-only workaround — never invents extra issues.

Primary: [anthropics/claude-code#90599](https://github.com/anthropics/claude-code/issues/90599). Same-class: [#90597](https://github.com/anthropics/claude-code/issues/90597) (Windows ungated heredoc) [#89251](https://github.com/anthropics/claude-code/issues/89251) (PreToolUse Write|Edit never called; [#63786](https://github.com/anthropics/claude-code/issues/63786) predecessor; [#87575](https://github.com/anthropics/claude-code/issues/87575) rewind; referenced by [#89716](https://github.com/anthropics/claude-code/issues/89716)) [#85511](https://github.com/anthropics/claude-code/issues/85511) (Bash python/sed allowlist) [#29709](https://github.com/anthropics/claude-code/issues/29709) (Edit blocked then Bash python) [#31292](https://github.com/anthropics/claude-code/issues/31292) (disallowedTools Write/Edit bypassed). NOT Stencil / Hasp / Coda / Veto / Tappet / Assay / Spile / Scant / Knock / Gasket / Iota / Blot / Wicket. Cross-ecosystem: [openai/codex#10330](https://github.com/openai/codex/issues/10330) [#16397](https://github.com/openai/codex/issues/16397) [#17899](https://github.com/openai/codex/issues/17899).

## CLI

```bash
node projects/grille/hook/index.mjs < grille.json
node projects/grille/hook/index.mjs grille.json
```

Empty stdin uses the seeded #90599 steered desk. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `posted`, `sinks`.

## HTTP

```bash
node projects/grille/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `posted` / `still` / `reset` (return idle **posted**), `control` / `healthy` / `proof` / `teller` / `desk` (Edit/Write path that classifies **posted** with `posted` true), `ledger` / `trace` / `observe` / `stamp` (score the desk), `restore` / `steered` / `incident` (show #90599 steered → **steered**), or `admit`. Nested `{ grille, action: { ... } }` is accepted. Admit does not lie: a steered desk stays steered. Restore on an idle bench produces the #90599 steered desk.

Probe: `{ session, issue, source, permissionMode, bypassDirectivePresent, toolUsed, bashWriteCapable, editWriteUsed, diffWouldRender, preToolUseEditWriteWouldFire, windowsPlatform, heredocPrescribed, writeFailedOrTruncated, allowlistBashWrite, claudeMdOverrideOnly, noSettingToggle, acceptEditsRestored, scored }`.

Return: `{ verdict, reasons[], posted }`.

`posted` is true ONLY when Edit/Write was used, a diff would render, Write|Edit hooks would fire, and the verdict is not a failure class. Seeded 90599 numbers must produce steered / `posted=false`. Control Edit/Write path must produce `posted=true`. Restored classifies **restored** with `posted=false` (recovery, not idle control).

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/grille/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `slotted` / `steered` / `unreceipted` / `unhooked` / `killed` / `allowlisted`, or `permissionDecision: "deny"`, as a stop. A night drop through the slot is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `GRILLE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: slotted/steered/… alarm…". Fires on those verdicts only. |
| `GRILLE_GITHUB_TOKEN` / `GITHUB_TOKEN` | Grille-ledger issue (private gist `grille-ledger.jsonl`). Absent → "Would open a GitHub grille-ledger issue…". Every scored probe. |
| `GRILLE_LINEAR_KEY` / `LINEAR_API_KEY` | Slotted / steered / unhooked / killed opens a desk ticket. Absent → demo row. Skip otherwise. |
| `GRILLE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/grille/hook/grille.test.mjs
```
