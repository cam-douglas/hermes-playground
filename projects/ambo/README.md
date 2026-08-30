# Ambo

Raised stone **ambo** — a pulpit overlooking a nave, lectern slope, open book, candle, stone steps, pews fading below, and an ExitPlanMode "Ready to code?" approval-card overlay — for a real Claude Code defect: a `PermissionRequest` hook matching `ExitPlanMode` returns a valid `systemMessage`. Claude Code accepts it, validates it, and logs success — then the approval card never shows it. Reproduced in the terminal TUI and the VS Code extension. Hook side effects run. Only display is missing. Docs say `systemMessage` displays for all hooks. Workaround: `terminalSequence` (OSC 9 / OSC 777 / BEL) reaches the user — plumbing intact, display path missing.

Primary: [anthropics/claude-code#90685](https://github.com/anthropics/claude-code/issues/90685) (OPEN, filed 2026-08-30). Title: PermissionRequest hook systemMessage is accepted and logged as success but never rendered at the ExitPlanMode approval prompt. Reproduced on 2.1.119 and still on 2.1.251.

The pulpit spoke; the nave never heard. Score the card or admit **unheard**.

Idle word: **unheard** (honest control: `systemMessage` actually rendered on the approval card).
NEVER use unheard for a failure. NEVER use the product name ambo / pulpit / lectern / lecturn / nave / rostrum / dais / chancel / altar / slype / tally / pale / chatelaine / waif / berth / carrel / cotter / grille / wicket / yett / postern / narthex / galilee / undercroft / empty / silent / mute / idle / passed / squared / bound / girt / sheltered / alongside / seated / credited / level / verbatim / fronted / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug as the idle/state word.

Verdicts: **unheard**, **logged-success**, **plan-card**, **silent-surface**, **tui-blank**, **vscode-blank**, **decision-free**, **terminal-sequence-ok**, **docs-all-hooks**, **deferred-path**. Slack chip + Linear ticket on logged-success / plan-card / silent-surface / tui-blank / vscode-blank / decision-free / terminal-sequence-ok / docs-all-hooks / deferred-path when this bug. GitHub ambo-ledger of scored intakes on every score.

The #90685 logged-success board (PermissionRequest + ExitPlanMode + systemMessage validated + not rendered) is **logged-success**, never **unheard**. Unique nearby flags win their own seeds because those seeds do not carry the #90685 triad. Per-surface drops (#78266 and kin) are labeled contrast, not this defect.

## Why not a clone

NOT **Slype** — sandbox that allow-lists System32 `powershell.exe` and 126-denies Program Files `pwsh.exe` ([#90676](https://github.com/anthropics/claude-code/issues/90676)).
NOT **Tally** — exit birth-count false-loss ([#90692](https://github.com/anthropics/claude-code/issues/90692)).
NOT **Pale** — hooks silently absent when the project root is not the repo root ([#90683](https://github.com/anthropics/claude-code/issues/90683)).
NOT **Chatelaine** — nested MCP OAuth ([#90647](https://github.com/anthropics/claude-code/issues/90647)).
NOT **Waif** — orphan process tree ([#90672](https://github.com/anthropics/claude-code/issues/90672)).
NOT **Berth** — shared spawn tree.
NOT **Carrel** — launch.json session cwd.
NOT **Byline** — phantom hook agent id.
NOT **Cotter** — machine-shop cotter-pin tray. Do not ship another machine-shop bench.
NOT leftover woodworking / millimetre-slider / Tudor oak pale / Victorian chatelaine / foundling ward / harbour berth / dock tally / cathedral slype clones.
Do NOT ship alternate names Pulpit, Lectern, Lecturn, Rostrum, Dais, Nave, Chancel, Altar, Slype, Wicket, Pale, Grille, Cotter, Yett, Postern, Narthex, Galilee, Undercroft. Product name is **Ambo** only.

Different problem: PermissionRequest at the plan-approval prompt renders `systemMessage` on **no** surface, terminal included. The nearby cluster is per-surface drops where the terminal sometimes works.
Different UI: raised stone ambo, lectern slope, open book, nave pews fading below, ExitPlanMode approval-card overlay, night-indigo plus beeswax plus claret. Cinzel + Libre Baskerville + Fira Code. Not a cloister passage, not two leaf-doors, not a house-roster plate, not Purbeck slype.
Different idle word: **unheard**.

## Live catalog path

`/ambo/` is this static raised-ambo desk. Demo works with no secrets and no npm. Mark: `18:50 Sydney · ambo`.

1. Seeded `#90685` **logged-success** is already on the ledger: PermissionRequest + ExitPlanMode + systemMessage validated + card blank → **logged-success**. Never unheard.
2. Switch **plan-card** — ExitPlanMode Ready-to-code approval card is the surface that never shows the pulpit.
3. Switch **silent-surface** — no surface (TUI and VS Code) renders the systemMessage.
4. Switch **tui-blank** — terminal TUI approval card stays blank.
5. Switch **vscode-blank** — VS Code approval card stays blank.
6. Switch **decision-free** — inform-only systemMessage with no allow/deny decision.
7. Switch **terminal-sequence-ok** — OSC 9 / OSC 777 / BEL workaround reaches the user.
8. Switch **docs-all-hooks** — docs claim systemMessage displays for all hooks.
9. Switch **deferred-path** — result never reaches the renderer other hook events use.
10. Switch **contrast #78266** — per-surface VS Code drop; labeled, not this.
11. Switch **honest unheard** — systemMessage actually rendered on the card → **unheard** true.
12. **Score** scores. **Admit** applies the honest control (systemMessage rendered → **unheard**). **Restore · #90685** shows the logged-success board. Admit does not lie when the probe is already a fail.

## Hook

`projects/ambo/hook/` scores a probe `{ hookEvent, tool, systemMessage, hookLogSuccess, parsedValidated, rendered, tuiRendered, vscodeRendered, permissionDecision, terminalSequence, docsClaimAllHooks, deferredPath, prompt, version }` and returns `{ verdict, reasons[], unheard }`. See `hook/README.md`.

```bash
node projects/ambo/hook/index.mjs --listen 9090
node --test projects/ambo/hook/ambo.test.mjs
```

`unheard` is true ONLY when the verdict is unheard (idle, or honest control: systemMessage actually rendered on the approval card). Seeded 90685 numbers must produce logged-success / `unheard=false`. Honest control with `rendered` true produces `unheard=true`. A logged-success board is never unheard.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90685](https://github.com/anthropics/claude-code/issues/90685) — OPEN, filed 2026-08-30. Title: PermissionRequest hook systemMessage is accepted and logged as success but never rendered at the ExitPlanMode approval prompt. Claude Code 2.1.119, still on 2.1.251. macOS. Reproduced in the terminal TUI and the VS Code extension. Hook prints `{ systemMessage: 'HELLO FROM THE HOOK' }` and exits 0, decision-free. Debug log: `Successfully parsed and validated hook JSON output` and `Hook PermissionRequest:ExitPlanMode (PermissionRequest) success`. Nothing on the "Ready to code?" card. Side effects (file write, clipboard) run. Workaround: `terminalSequence` with OSC 9 / OSC 777 / BEL reaches the user.

Same-class / nearby (cite as contrast, not as this product — those are per-surface drops where terminal sometimes works):

- [anthropics/claude-code#80693](https://github.com/anthropics/claude-code/issues/80693) — OPEN. PreToolUse ask decisions don't render permissionDecisionReason / systemMessage.
- [anthropics/claude-code#78266](https://github.com/anthropics/claude-code/issues/78266) — OPEN. UserPromptSubmit systemMessage dropped in Desktop and VS Code.
- [anthropics/claude-code#86168](https://github.com/anthropics/claude-code/issues/86168) — OPEN. Stop-hook systemMessage not in VS Code (works in terminal).
- [anthropics/claude-code#80882](https://github.com/anthropics/claude-code/issues/80882) — OPEN. SessionStart systemMessage not in VS Code side panel (works in CLI).
- [anthropics/claude-code#76736](https://github.com/anthropics/claude-code/issues/76736) — OPEN. VS Code SessionStart systemMessage / statusMessage / additionalContext never reach the user.
- [openai/codex#17745](https://github.com/openai/codex/issues/17745) — OPEN. Cross-ecosystem: Codex ignores approval rejection messages.
- [openai/codex#35906](https://github.com/openai/codex/issues/35906) — OPEN. Cross-ecosystem: MCP form elicitation newlines collapse in approval UI.
- [openai/codex#33020](https://github.com/openai/codex/issues/33020) — OPEN. Cross-ecosystem: PermissionDecision hook observability proposal.

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Slype #90676, Tally #90692, Pale #90683, Chatelaine #90647, Waif #90672, Berth, Carrel, Cotter, leftover woodworking.

Backups only if #90685 vanishes (prefer #90685): [#90688](https://github.com/anthropics/claude-code/issues/90688) / [#90697](https://github.com/anthropics/claude-code/issues/90697) OAuth refresh race; [#90677](https://github.com/anthropics/claude-code/issues/90677) VS Code GitHub MCP Authorization header malformed.

Suggested consumer fix from #90685 (document, do not implement against Claude Code itself): render `systemMessage` from PermissionRequest hooks above the approval prompt, as happens for other hook events.

## Env

| Variable | Meaning |
| --- | --- |
| `AMBO_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Incoming webhook. Absent → honest demo "Would post…". |
| `AMBO_GITHUB_TOKEN` / `GITHUB_TOKEN` | Ambo-ledger. Absent → demo ledger. |
| `AMBO_LINEAR_KEY` / `LINEAR_API_KEY` | Card ticket. Absent → demo row. |

Missing secrets stay in honest demo mode. Never a fake live 200. The static page does not need them.
