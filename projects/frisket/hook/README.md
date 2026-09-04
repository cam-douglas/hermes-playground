# Frisket hook

Tiny print-shop / frisket-resist classifier for the Claude Code defect where a sync PreToolUse hook on `Write|Edit|MultiEdit|NotebookEdit` returns `permissionDecision` deny (canary proves deny computed) but the write still completes, while PostToolUse on the identical matcher fires every time. `--debug hooks` shows Post registering/firing and Pre never appearing. Reporter technoashu. Filed 2026-09-02. Labels: bug, has repro, platform:macos, area:hooks. CLI 2.1.245 on macOS Darwin 25.3.0. Commenter yurukusa on Linux/WSL 2.1.258 could NOT reproduce.

Idle word is **masked**. Seeded state is bled / #91574 (Pre deny returned or never invoked; Write still completes; Post fires). Never idle as sounded / muted / slipped / fouled / verbatim / mangled / moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

```bash
node projects/frisket/hook/frisket.mjs projects/frisket/data/91574.json
node projects/frisket/hook/frisket.mjs projects/frisket/data/masked.json
echo '{"preInvoked":false,"permissionDecision":"deny","writeCompleted":true,"postFired":true}' | node projects/frisket/hook/frisket.mjs
node --test projects/frisket/hook/frisket.test.mjs
```

Empty stdin uses the idle **masked** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `masked`, `bled`, `hold`, `alarm`, `idleWord`.

Given `{ persistMask, masked, bled, preInvoked, permissionDecision, writeCompleted, postFired, platform, cliVersion, canaryResult, permissionMode }`:

- **MASKED** if PreToolUse deny seats before Write (`preInvoked && deny && !writeCompleted && !postFired`)
- **BLED** if Write completed and (deny returned or Pre never invoked) and Post fired (#91574 macOS 2.1.245)
- **PRE-SKIPPED** if Pre was never invoked and Write completed
- **DENY-IGNORED** if Pre invoked, returned deny, and Write still completed
- **POST-FIRED** if PostToolUse fired after the write
- **CANARY-DENY** if the canary captured `DENY` but the write landed
- **MACOS-ONLY** if the bleed is the macOS 2.1.245 pattern vs Linux hold
- **LINUX-HOLD** if the commenter pattern: Pre invoked, deny, write held
- **BYPASS-MODE** if the bleed reproduced under `bypassPermissions`
- **HOLD** if the mask seats (deny held; file not created)

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the frisket masked or the plate already bled.

Primary: [anthropics/claude-code#91574](https://github.com/anthropics/claude-code/issues/91574). Cousins (cite only, not primary): [#89251](https://github.com/anthropics/claude-code/issues/89251) permission-mode Bash routing, [#82642](https://github.com/anthropics/claude-code/issues/82642) discarded decisionReason, [#88896](https://github.com/anthropics/claude-code/issues/88896) Windows Pre never fires, [#77735](https://github.com/anthropics/claude-code/issues/77735) schema-invalid settings skip Pre.

Hypothesis only (NON-BINDING): PreToolUse matcher for Write-family may fail to register on macOS paths while PostToolUse on the same matcher registers; or deny decision ignored between 2.1.245–2.1.258. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.

NOT leftover clavichord tangent / dockyard hawser / proof-desk caret / harbor-buoy / solecism usage-desk / coffer vault / codicil probate / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging. Product name stays Frisket.
