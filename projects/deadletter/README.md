# Deadletter

A **postal dead-letter / undeliverable-mail bench** — sorting desk, pigeonholes, stamped envelopes, undeliverable tray; Newsreader + Figtree + JetBrains Mono — for a real Claude Code defect: **AFTER A WORKTREE TRANSITION THE FIRST BASH OR POWERSHELL TOOL CALL CAN COMPLETE WITH `tool_dispatch_end outcome=ok` YET NEVER PERSIST A MATCHING `tool_result`.** When a hypothetical filed letter closes/consumes the PostToolUse stream after the transition, the packet is **filed**.

Primary:

- [anthropics/claude-code#90049](https://github.com/anthropics/claude-code/issues/90049) (OPEN, bug, has repro, platform:windows, area:bash). Title: `Interactive CLI loses completed shell results after worktree transitions with PostToolUse hooks on Windows`. Filed 2026-08-27T09:59:22Z.

19:50 deadletter: a postal dead-letter bench that should keep completed shell tool_results receipted into the interactive transcript after worktree transitions; instead PostToolUse orchestration loses the result after tool_dispatch_end outcome=ok while print/SDK still delivers; score lost or admit receipted.

Score lost or admit filed.

Idle word: **receipted** (HOLD: completed shell `tool_result`s stay receipted into the interactive transcript after worktree transitions). #90049 path: **lost**. Admit word: **filed**. Never idle as fused, dry, bonded, closed, leaked, matched, orphaned, keyed, lit, dripping, chorded. Never use fused / dry / bonded as the #90049-path word either.

**Deadletter** = a packet that *left the dispatch window* (`outcome=ok`, command side-effects real) but never reached the next pigeonhole (`tool_result` missing). The interactive tray stays busy with no shell child. Print/SDK still delivers. `async: true` on PostToolUse avoids the blocking path.

- **receipted** = IDLE: HOLD; completed `tool_result` stays receipted after session start / EnterWorktree / ExitWorktree
- **lost** = #90049 path: `tool_dispatch_end outcome=ok` then no persist; transcript ends at `tool_use`
- **filed** = admit hold: hypothetical interactive consumer closes/consumes the PostToolUse stream after a worktree transition
- **dispatch-ok-no-persist** = dispatch start → end `outcome=ok` `durationMs` recorded; command completed; no matching `tool_result`
- **posttooluse-orchestration** = `await tool.call` → dispatch-ok → async PostToolUse iteration → construct/push `tool_result`; interactive consumer fails to close/consume
- **worktree-transition** = first Bash or PowerShell call after session start / EnterWorktree / ExitWorktree; repeat often fine
- **print-sdk-ok** = `cc_entrypoint=cli` hangs; `cc_entrypoint=sdk-cli` `claude -p` succeeds with the same hooks
- **async-hook-mitigation** = `async:true` PostToolUse completes and persists `tool_result` (`async_hook_33956`)
- **bash-and-powershell** = not Bash-specific; native PowerShell also loses the completed result
- **cousins** = cite-only #84154 CLOSED/stale; primary stays #90049
- **has-clear-repro** = issue labeled has repro

Verdicts: receipted, lost, filed, dispatch-ok-no-persist, posttooluse-orchestration, worktree-transition, print-sdk-ok, async-hook-mitigation, bash-and-powershell, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No network to Anthropic. Score whether a completed shell call after a worktree transition would leave the letter **lost** or already **filed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): interactive PostToolUse stream orchestration after worktree transitions fails to close/consume so completed tool_results never reach the interactive consumer; print/SDK and async:true bypass. Verify against #90049 text only; do not claim unread source. Do NOT implement a fix in anthropics/claude-code; this catalog product only reconstructs the published diagnostic.

## Research brief

Sources:

- Primary: [anthropics/claude-code#90049](https://github.com/anthropics/claude-code/issues/90049)
- Cousins cite-only (NOT primary): [anthropics/claude-code#84154](https://github.com/anthropics/claude-code/issues/84154) CLOSED/stale — Bash intermittently minutes to return despite command finishing in <10ms (same early symptom class; not the #90049 PostToolUse localization).

What happened (from the issue body + reporter comments — do not invent):

- Filed ~2026-08-27; updated diagnosis 2026-09-07/08 by simon-bauer-sonarsource
- Observed on Claude Code 2.1.247 → 2.1.263, Windows 11 Pro 10.0.26100
- `tool_dispatch_start` → `tool_dispatch_end outcome=ok` with `durationMs` recorded (PowerShell `toolu_01J7bPw5ZW4YSjTkJRCwtZDM`: start 2026-09-07T19:38:42.198Z, end 2026-09-07T19:38:45.356Z, durationMs=3158)
- Command completed (e.g. git worktree created; timestamps inside the interval)
- No matching `tool_result` persisted; transcript ends at assistant `tool_use`
- Interactive process alive/busy; no shell child left
- Bash AND native PowerShell both affected
- First call after EnterWorktree / ExitWorktree / session start; repeat often fine
- Proxy A/B: reproduces with and without local proxy; SSE `tool_use` sequence complete at proxy (not drop/truncate)
- Hooks A/B: without PostToolUse / PostToolUseFailure → success; with hooks restored → hang after dispatch-ok; duplicate hooks NOT required
- `async: true` on PostToolUse completes and persists `tool_result` (`async_hook_33956`)
- Localization: after `await tool.call` → `tool_dispatch_end ok` → async PostToolUse iteration → construct/push `tool_result` (interactive consumer fails to close/consume the stream after a worktree transition)
- Print/SDK path succeeds with the same hooks
- Original pre-spawn hang diagnosis was incorrect

Problem found: AFTER A WORKTREE TRANSITION THE FIRST BASH OR POWERSHELL TOOL CALL CAN COMPLETE WITH `TOOL_DISPATCH_END OUTCOME=OK` YET NEVER PERSIST A MATCHING `TOOL_RESULT`.

Why this solution: a diagnostic scorer for the receipted → lost / filed tray chain, so a reader can pin idle receipted, load the #90049 lost path, and score dispatch-ok-no-persist / posttooluse-orchestration / worktree-transition / print-sdk-ok / async-hook-mitigation / bash-and-powershell / cousins against the published facts.

## Why not a clone

This is specifically: **AFTER A WORKTREE TRANSITION THE FIRST BASH OR POWERSHELL TOOL CALL CAN COMPLETE WITH `tool_dispatch_end outcome=ok` YET NEVER PERSIST A MATCHING `tool_result`**.

**NOT Dryjoint/#92809** (VS Code chat anchors never call open_file — already shipped). Do not touch Dryjoint.

**NOT Dinkus/#92798** (plugin-settings sed frontmatter range — already shipped). Do not touch Dinkus.

**NOT Homonym/#92787** (Desktop UUID connector mounts — already shipped). Do not touch Homonym.

**NOT Rushlight/#92784** (session-scoped TCC AppData — already shipped). Do not touch Rushlight.

**NOT Clepsydra/#92776** (OTel token.usage mid-session arrest — already shipped). Do not touch Clepsydra.

**NOT Letoff/#92771**. **NOT Ptybind/#92757**. **NOT Espagnolette/#92694**. **NOT Caisson/#91405**. **NOT Crenel/#92729**.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session.

Different paradigm: **the dispatch window stamps `outcome=ok` and the command is real, but the interactive tray never receipts the `tool_result` after a worktree transition when PostToolUse is on the blocking path**.

Cousins cite-only (NOT primary): #84154 CLOSED/stale. Do not auto-pick as thesis.

Backups cite in this README only — do NOT auto-pick as primary: [anthropics/claude-code#88418](https://github.com/anthropics/claude-code/issues/88418) (path-spelling split in `.claude.json`), [anthropics/claude-code#89395](https://github.com/anthropics/claude-code/issues/89395) (`/diff` git without `useCwd`), [anthropics/claude-code#87289](https://github.com/anthropics/claude-code/issues/87289) (hook timeout while stdin blocked), [anthropics/claude-code#87777](https://github.com/anthropics/claude-code/issues/87777) (RC auto-enable first turn only), [anthropics/claude-code#92788](https://github.com/anthropics/claude-code/issues/92788) (AskUserQuestion free-text discard / alt Quill), [anthropics/claude-code#92794](https://github.com/anthropics/claude-code/issues/92794) (classic mouse dead Ptyxis).

Do NOT rename this product Dryjoint, Dinkus, Homonym, Rushlight, Clepsydra, Letoff, Ptybind, Espagnolette, Caisson, or Crenel.
Do NOT reuse idle fused / dry / bonded / closed / leaked / matched / orphaned / keyed / lit / dripping / chorded. Do NOT reuse seeded fused / dry / bonded.

Different surface: interactive PostToolUse stream after worktree transition vs VS Code chat-anchor `open_file` / plugin-settings sed frontmatter / Desktop UUID mounts / OTel meter arrest / session-scoped TCC / libuv Shift+Enter flatten.

Product name stays **Deadletter**. Name/slug `deadletter` confirmed unused in catalog.json (224 products before this ship; Dryjoint is #224).

Different UI: postal dead-letter office / sorting desk / pigeonholes / stamped envelopes / undeliverable tray. Newsreader / Figtree / JetBrains Mono. NOT Space Grotesk / Manrope / IBM Plex Mono (Dryjoint). NOT Zilla Slab / Atkinson Hyperlegible (Dinkus). NOT Fraunces / Outfit (Homonym). NOT Petrona / Manrope / IBM Plex Mono as a trio with Petrona (Rushlight). NOT EB Garamond / Barlow / Source Code Pro (Clepsydra). NOT Lora / Plus Jakarta / Cousine (Letoff). NOT PCB copper flux. NOT compositor galley. NOT lexicographer desk.

Different verbs: Score lost, Admit filed, Pin idle receipted, Load the #90049 path, Reset to receipted, Stamp the tray, File the letter.

Different idle: **receipted**. Different #90049 path: **lost**. HOLD: **receipted** / **filed**. ALARM: **lost** / **dispatch-ok-no-persist** / **posttooluse-orchestration** / **worktree-transition** / **print-sdk-ok** / **async-hook-mitigation** / **bash-and-powershell** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/deadletter/hook/deadletter.test.mjs
node projects/deadletter/hook/deadletter.mjs projects/deadletter/data/90049.json
node projects/deadletter/hook/deadletter.mjs projects/deadletter/data/receipted.json
echo '{"seed":"lost","lost":true}' | node projects/deadletter/hook/index.mjs
```

Open the living card at `projects/deadletter/index.html` (or the live path `/deadletter/`). Buttons: Score lost, Admit filed, Pin idle receipted, Load lost, Load fixtures, Reset to receipted. Stamp the tray. File the letter. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/deadletter/
- Folder: `projects/deadletter/`
