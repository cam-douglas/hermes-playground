# Placet hook

Tiny congregation / assent-desk classifier for the Claude Code defect where `ExitPlanMode` offers **Accept** and **Accept and start implementing**, but choosing the narrower **Accept** still delivers a tool result that says `You can now start coding` and `You have exited plan mode. You can now make edits, run tools, and take actions`. Reporter renelaerke. Filed 2026-09-04. Labels: bug, has repro, platform:macos, area:core, area:permissions. Claude Desktop Code tab, claude-opus-5, macOS Darwin 25.6.0, Apple Silicon. Session permission mode Manual. Observed 2026-09-04. Bundle version not surfaced.

Idle word is **withheld**. Seeded state is enacted / #92040 (plain Accept still returns start-coding + exited-plan-mode make-edits language). Never idle as masked / bled / sounded / muted / slipped / fouled / verbatim / mangled / moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

```bash
node projects/placet/hook/placet.mjs projects/placet/data/92040.json
node projects/placet/hook/placet.mjs projects/placet/data/withheld.json
echo '{"buttonChoice":"Accept","startCodingLanguage":true,"exitedPlanEdits":true}' | node projects/placet/hook/placet.mjs
node --test projects/placet/hook/placet.test.mjs
```

Empty stdin uses the idle **withheld** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `withheld`, `enacted`, `hold`, `alarm`, `idleWord`.

Given `{ persistHold, withheld, enacted, buttonChoice, planAssented, implementationAuthorised, startCodingLanguage, exitedPlanEdits, permissionMode }`:

- **WITHHELD** if plan assented and implementation is NOT authorised and the result has no start-coding / make-edits language
- **ENACTED** if plain Accept still returns start-coding or exited-plan make-edits language (#92040)
- **ACCEPT-NARROW** if the user pressed Accept, not Accept and start implementing, and the result still authorised implementation
- **ACCEPT-AND-IMPLEMENT** if the broader seal was the chosen fiat
- **START-CODING-LANGUAGE** if the tool result contains `You can now start coding`
- **EXITED-PLAN-EDITS** if the appended block says `You can now make edits, run tools, and take actions`
- **MANUAL-MODE** if session permission mode was Manual and the result reads as blanket clearance
- **SCOPE-MISMATCH** if consent for scope A (save the plan) is reported as A+B (start coding)
- **HOLD** if the chamber withholds implementation

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the chamber withheld or already enacted a fiat.

Primary: [anthropics/claude-code#92040](https://github.com/anthropics/claude-code/issues/92040). Cousins (cite only, not primary): [#74256](https://github.com/anthropics/claude-code/issues/74256) PermissionRequest allow for ExitPlanMode discarded, [#90685](https://github.com/anthropics/claude-code/issues/90685) PermissionRequest systemMessage never rendered at the ExitPlanMode prompt.

Hypothesis only (NON-BINDING): ExitPlanMode tool-result template may not branch on Accept vs Accept and start implementing. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.

NOT leftover print-shop frisket / clavichord tangent / dockyard hawser / proof-desk caret / harbor-buoy / solecism usage-desk / coffer vault / codicil probate / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging. Product name stays Placet.
