# Slype

Cathedral **slype** — a Purbeck-stone covered passage from cloister to precinct, a brass house-roster plate, and two leaf-doors — for a real Claude Code defect: the sandboxed session allow-lists System32 `powershell.exe` (Windows PowerShell 5.1) and denies `pwsh.exe` from Program Files (PowerShell 7) with Permission denied / exit 126. The PowerShell tool is dead. Bash exec of the same `pwsh.exe` also returns 126, even with `dangerouslyDisableSandbox` true. Legacy `powershell.exe` in System32 runs in the same session. `pwsh` runs outside the sandbox on the same machine.

Primary: [anthropics/claude-code#90676](https://github.com/anthropics/claude-code/issues/90676) (OPEN, filed 2026-08-30). Title: PowerShell tool: pwsh.exe fails with Permission denied (exit 126) inside sandboxed session, while powershell.exe works fine.

A garrison on the roster is not a visiting friar. Score the passage or admit **passed**.

Idle word: **passed** (honest control: `pwsh.exe` is actually executable in the session).
NEVER use passed for a failure. NEVER use the product name slype / undercroft / narthex / galilee / postern / yett / collet / chuck / mandrel / portcullis / turnstile / lodge / porter / barbican / sallyport / boom / wicket / pale / grille / cotter / empty / silent / mute / idle / squared / bound / girt / sheltered / alongside / seated / credited / level / verbatim / fronted / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / nested / cut / switched / spilled / true / home / gripped / swung as the idle/state word.

Verdicts: **passed**, **126**, **system32-ok**, **programfiles-denied**, **sandbox**, **pwsh-dead**, **powershell-ok**, **path-blocked**, **allowlist-miss**, **msix-store**. Slack chip + Linear ticket on 126 / programfiles-denied / sandbox / pwsh-dead / path-blocked / allowlist-miss / system32-ok / powershell-ok. GitHub slype-ledger of scored intakes on every score.

The #90676 126 board (Program Files `pwsh.exe` exits 126 + System32 `powershell.exe` exits 0 + sandbox session + outside ok) is **126**, never **passed**. Unique nearby flags win their own seeds because those seeds do not carry the #90676 triad. openai/codex#35871 MSIX/Store `CreateProcessAsUserW` error 5 is labeled **msix-store**, not this defect.

## Why not a clone

NOT **Calque** — PowerShell Spanish `del` false alias ([#90645](https://github.com/anthropics/claude-code/issues/90645)).
NOT **Sear** — Bash `set -e` structurally inert ([#90611](https://github.com/anthropics/claude-code/issues/90611)).
NOT **Clew** — sandbox deny-list E2BIG ([#90569](https://github.com/anthropics/claude-code/issues/90569)).
NOT **Grille** — bypass-permissions Bash-steered edits ([#90599](https://github.com/anthropics/claude-code/issues/90599)).
NOT **Waif** — orphan process tree ([#90672](https://github.com/anthropics/claude-code/issues/90672)).
NOT **Pale** — hooks silently absent when the project root is not the repo root ([#90683](https://github.com/anthropics/claude-code/issues/90683)).
NOT **Chatelaine** — nested MCP OAuth ([#90647](https://github.com/anthropics/claude-code/issues/90647)).
NOT **Tally** — exit birth-count false-loss ([#90692](https://github.com/anthropics/claude-code/issues/90692)).
NOT **Cotter** — machine-shop cotter-pin tray. Do not ship another machine-shop bench.
NOT leftover woodworking / millimetre-slider / Tudor oak pale / Victorian chatelaine / foundling ward / harbour berth / dock tally clones.
Do NOT ship alternate names Yett, Postern, Collet, Chuck, Mandrel, Portcullis, Turnstile, Lodge, Porter, Narthex, Galilee, Barbican, Sallyport, Boom, Undercroft, Wicket, Pale. Product name is **Slype** only.

Different problem: the sandbox binary-path allow-list admits System32 `powershell.exe` and 126-denies Program Files `pwsh.exe`.
Different UI: cathedral slype, Purbeck-stone undercroft passage, brass house-roster plate, two doors cloister vs precinct, cassock-black plus candle-amber plus verdigris. Fraunces + Source Serif 4 + IBM Plex Mono. Not a dock tally, not a Tudor pale, not a waist-chain, not a foundling home, not a harbour berth, not a machine-shop cotter tray.
Different idle word: **passed**.

## Live catalog path

`/slype/` is this static cathedral-slype desk. Demo works with no secrets and no npm. Mark: `17:50 Sydney · slype`.

1. Seeded `#90676` **126** is already on the ledger: `pwsh.exe` Program Files → 126; `powershell.exe` System32 ok; sandbox session; outside ok → **126**. Never passed.
2. Switch **system32-ok** — garrison door opens; System32 `powershell.exe` (5.1) runs; that is not proof pwsh is allowed.
3. Switch **programfiles-denied** — visiting-friar door 126s; Program Files PowerShell 7 `pwsh.exe` is the denied path.
4. Switch **sandbox** — the block is the Claude Code sandboxed session, not the OS install.
5. Switch **pwsh-dead** — the PowerShell tool targets pwsh 7 and is dead.
6. Switch **powershell-ok** — Bash plus `powershell.exe` works; contrast, not a hold.
7. Switch **path-blocked** — sandbox restricts subprocesses to system-path binaries and does not allow-list `pwsh.exe`.
8. Switch **allowlist-miss** — pwsh is missing from the sandbox allow-list / system-path roster.
9. Switch **msix-store** — Codex #35871 contrast, labeled not this.
10. Switch **honest passed** — `pwsh` actually runs in-session → **passed** true.
11. **Score** scores. **Admit passed** scores honestly. **Restore · #90676** shows the 126 board. Admit does not lie.

## Hook

`projects/slype/hook/` scores a probe `{ pwshPath, powershellPath, pwshExit, powershellExit, pwshStderr, sandbox, outsideOk, dangerouslyDisableSandbox, tool, os }` and returns `{ verdict, reasons[], passed }`. See `hook/README.md`.

```bash
node projects/slype/hook/index.mjs --listen 9090
node --test projects/slype/hook/slype.test.mjs
```

`passed` is true ONLY when the verdict is passed (idle, or honest control: `pwshExit` 0 in session). Seeded 90676 numbers must produce 126 / `passed=false`. Honest control with `pwshExit` 0 produces `passed=true`. A 126 board is never passed.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90676](https://github.com/anthropics/claude-code/issues/90676) — OPEN, filed 2026-08-30. Title: PowerShell tool: pwsh.exe fails with Permission denied (exit 126) inside sandboxed session, while powershell.exe works fine. Windows 11, Claude Code CLI. PowerShell tool fails immediately even on `Write-Host hello`. Bash exec of `pwsh.exe` under Program Files PowerShell 7 returns Permission denied exit 126, regardless of quoting, cwd, or `dangerouslyDisableSandbox`. File is executable, Authenticode ok, no Zone.Identifier, Defender clean. Legacy `powershell.exe` in System32 runs fine via Bash in the same session. `pwsh` runs fine outside the sandbox. Suspected: sandbox restricts subprocesses to system-path binaries and does not allow-list `pwsh.exe`.

Same-class / nearby (cite as contrast, not as this product):

- [anthropics/claude-code#90077](https://github.com/anthropics/claude-code/issues/90077) — OPEN. Opposite pole: hooks with shell powershell spawn pwsh with no powershell.exe fallback.
- [anthropics/claude-code#89884](https://github.com/anthropics/claude-code/issues/89884) — OPEN. Opposite pole: chat code-block Run button always uses powershell.exe 5.1.
- [anthropics/claude-code#85475](https://github.com/anthropics/claude-code/issues/85475) — OPEN. Nearby: hook targeting Windows App Execution Alias (pwsh.exe) reports Executable not found in PATH.
- [anthropics/claude-code#78596](https://github.com/anthropics/claude-code/issues/78596) — OPEN. Nearby: desktop integrated terminal hardcodes powershell.exe; CreateProcess 1260 when 5.1 is policy-blocked.
- [anthropics/claude-code#77470](https://github.com/anthropics/claude-code/issues/77470) — OPEN. Nearby: clipboard helper spawns powershell 5.1; should prefer pwsh.exe.
- [anthropics/claude-code#86551](https://github.com/anthropics/claude-code/issues/86551) — OPEN. Nearby but different: statusline pwsh.exe processes never exit. Not this.
- [openai/codex#38222](https://github.com/openai/codex/issues/38222) — OPEN. Cross-ecosystem: Windows sandbox restricted token cannot enumerate/execute under the user profile.
- [openai/codex#35871](https://github.com/openai/codex/issues/35871) — OPEN. Cross-ecosystem contrast: CreateProcessAsUserW error 5 when the resolved shell is the MSIX Store build of pwsh. Label **msix-store**, not 126.
- [openai/codex#37592](https://github.com/openai/codex/issues/37592) — OPEN. Cross-ecosystem: Windows sandbox inconsistently fails to start PowerShell with CreateProcessAsUserW error 5.

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Calque #90645, Sear #90611, Clew #90569, Grille #90599, Waif #90672, Pale #90683, Chatelaine #90647, Tally #90692, Cotter, leftover woodworking.

Suggested consumer fix from #90676 (document, do not implement against Claude Code itself): allow-list `pwsh.exe` (Program Files and App Execution Alias) inside the sandbox, or make the PowerShell tool fall back to System32 `powershell.exe` when pwsh 126s, and surface the denied path instead of a blank exit 1.
