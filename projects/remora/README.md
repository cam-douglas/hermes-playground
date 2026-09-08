# Remora

A **hull-clinging remora / process-tree sounding bench** — teal-ink deep water, barnacle copper, pale foam linen, a remora still gripping the keel after the parent fish swam away; fonts **Ibarra Real Nova** (display) + **Red Hat Text** (body) + **Red Hat Mono** (mono) — for a real Claude Code defect: **A SYNCHRONOUS `PostToolUse` COMMAND HOOK CAN DELAY THE TOOL RESULT UNTIL A PERSISTENT DESCENDANT EXITS, EVEN THOUGH THE CONFIGURED HOOK PROCESS HAS ALREADY EXITED SUCCESSFULLY.**

Primary:

- [anthropics/claude-code#92934](https://github.com/anthropics/claude-code/issues/92934) (OPEN, bug, has repro, platform:windows, area:hooks). Title: `Windows: synchronous PostToolUse delays tool results until a persistent child exits`. Claude Code 2.1.263; Windows 11 Pro 10.0.26100; Interactive CLI. Filed 2026-09-08T20:56:20Z by simon-bauer-sonarsource.

06:50 remora: a hull-clinging remora bench that should score a PostToolUse wait **loosed** the moment the configured hook process exits; instead a persistent redirected child still **clings** so the `tool_result` stays held ~90s after `hook.ps1` already swam away — score clung or admit loosed.

Score clung or admit loosed.

Idle word: **loosed** (HOLD: `tool_result` delivered when the configured hook process exits; no descendant grip). #92934 path: **clung**. Seeded recovery: **rehitched**. Never idle intact / enrolled / as-penned / rove / vaulted / cleared. Never seed relisted / regranted / misbound / fouled / escheated.

**Remora** = the fish that clings to a hull after you would expect the hitch to release. The configured PostToolUse hook (parent) already swam away (exited 0), but a remora-child process still grips the result channel so the `tool_result` stays held.

- **loosed** = IDLE: HOLD; `tool_result` delivered when the configured hook process exits; no descendant grip
- **clung** = #92934 path: parent hook exited 0; persistent redirected child still delays result ~90s
- **rehitched** = seeded recovery: `async:true` / process-tree detach path that avoids the sync wait
- **parent-exited** = `hook.ps1` exits immediately with code 0 after `Start-Process`
- **child-holds** = `child.ps1` (`Start-Sleep 90`) still grips the result channel
- **redirected-stdio** = child stdin/stdout/stderr redirected to files
- **sync-stall** = `Slow PostToolUse hooks: 91931ms for PowerShell (1 hooks)`
- **async-bypass** = `async:true` on the hook avoids the blocking path in the control
- **cousins** = cite-only #90049 Deadletter — different symptom; do not re-ship
- **before-after** = sync stall ~90s clung; `async:true` rehitched
- **fixtures** = row list for the hull sounding bench

Verdicts: loosed, clung, rehitched, parent-exited, child-holds, redirected-stdio, sync-stall, async-bypass, cousins, before-after, fixtures.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No network to Anthropic. Score whether a PostToolUse wait is **clung** or already **loosed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): Job Objects / process-group wait may keep the sync PostToolUse path open on a redirected descendant after the configured hook already exited 0. The issue body says the controlled reproduction does not establish the internal mechanism. Invite verify against #92934 text only. Do NOT implement a fix in anthropics/claude-code.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92934](https://github.com/anthropics/claude-code/issues/92934)
- Cite-only: [anthropics/claude-code#90049](https://github.com/anthropics/claude-code/issues/90049) (Deadletter already catalogued) — different symptom

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:hooks
- Claude Code 2.1.263; Windows 11 Pro 10.0.26100; Interactive CLI
- Separate from #90049: does not require `EnterWorktree`; bounded wait rather than worktree-transition result-loss
- Repro: `child.ps1` is `Start-Sleep -Seconds 90`
- `hook.ps1` reads stdin, `Start-Process` powershell `child.ps1` with stdin/stdout/stderr redirected to files, then `exit 0`
- `settings.json` PostToolUse matcher `PowerShell` runs that hook with timeout 120
- Harmless tool: `Get-Date -Format o`
- Expected: the tool result is delivered when `hook.ps1` exits
- Actual: main tool completes (`durationMs=925`), `hook.ps1` exits immediately, Claude Code delays the tool result until `child.ps1` exits (~90s)
- Log: `[Stall] tool_dispatch_end tool=PowerShell toolUseId=call_JDUVNrA2A9kA9qxZ48LWiZz9 outcome=ok durationMs=925`
- Log: `Slow PostToolUse hooks: 91931ms for PowerShell (1 hooks)`
- Child has stdin, stdout, and stderr redirected to files
- `async:true` on the hook avoids the blocking path in the control
- One controlled reproduction; it does not establish the internal mechanism

Problem found: THE CONFIGURED POSTTOOLUSE HOOK PARENT ALREADY EXITED 0, BUT A PERSISTENT REDIRECTED CHILD STILL DELAYS THE TOOL_RESULT ~90s.

Why this solution: a diagnostic hull sounding for the loosed → clung grip, so a reader can pin idle loosed, load the #92934 clung path, and score parent-exited / child-holds / redirected-stdio / sync-stall / async-bypass / cousins / before-after / rehitched against the published facts.

## Why not a clone of Deadletter

**Remora is NOT Deadletter.** Deadletter/#90049 is worktree-transition `tool_result` loss: after `EnterWorktree` / `ExitWorktree` / session start, the first Bash or PowerShell call can complete with `tool_dispatch_end outcome=ok` yet never persist a matching `tool_result`. Remora/#92934 is PostToolUse waiting on a persistent child after the hook parent already exited. It does not require `EnterWorktree`. It is a bounded wait (~90s / 91931ms), not result-loss.

**NOT Procrustes/#92900** (stdio boolean-schema whole-server cull — just shipped #232). Cite only. Do not touch Procrustes.

**NOT Cadastre/#92908** (trust RMW lock). **NOT Rubric/#92855**. **NOT Sheave/#92827**. **NOT Mailslot/#92839**. **NOT Ukase/#92833**. **NOT Scabbard/#92820**. **NOT Dryjoint/#92809**. **NOT Dinkus/#92798**. **NOT Homonym/#92787**. **NOT Rushlight/#92784**. **NOT Clepsydra/#92776**. **NOT Letoff/#92771**. **NOT Springe**. Already shipped. Cite only. Do not touch.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session.

Different paradigm: **the parent hook already swam away (exit 0), but a remora-child still grips the result channel so the wait stays sync until the descendant exits**.

Different UI: ocean / ship-hull / remora — teal-ink deep water, barnacle copper, pale foam linen. Ibarra Real Nova / Red Hat Text / Red Hat Mono. NOT Vollkorn / Cabin / Ubuntu Mono (Procrustes forge/iron). NOT Newsreader / Figtree / JetBrains Mono (Deadletter postal). NOT Crimson Pro / Work Sans / Cousine (Cadastre parchment).

Different verbs: Score clung, Admit loosed, Rehitch the tree, Sound the hull, Load #92934, Reset to loosed.

Different idle: **loosed**. Different #92934 path: **clung**. HOLD: **loosed**. ALARM: **clung** / **parent-exited** / **child-holds** / **redirected-stdio** / **sync-stall** / **async-bypass** / **cousins** / **before-after** / **fixtures**. Seeded recovery: **rehitched**.

Stay off Sallyport/#92901 (security). Cite-only #90049. Do not auto-switch to Quill/#92788, Homestead/#92932, or Colophon/#92918.

## How to score

```bash
node --test projects/remora/hook/remora.test.mjs
node projects/remora/hook/remora.mjs projects/remora/data/92934.json
node projects/remora/hook/remora.mjs projects/remora/data/loosed.json
echo '{"seed":"clung","childHolds":true}' | node projects/remora/hook/index.mjs
```

Open the living card at `projects/remora/index.html` (or the live path `/remora/`). Buttons: Score clung, Admit loosed, Rehitch the tree, Sound the hull, Load #92934, Load fixtures, Reset to loosed. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/remora/
- Folder: `projects/remora/`
