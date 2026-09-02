# Tumbler hook

Tiny locksmith pin-tumbler / keyway classifier for the PermissionRequest allow-discarded on ExitPlanMode. A `PermissionRequest` hook returning `decision.behavior: "allow"` for `ExitPlanMode` is executed (stdin delivered, stdout read) but the decision is discarded. Native plan-approval chooser still displayed: "Would you like to proceed?" `updatedPermissions` dropped. Deny path still works. Last good 2.1.198. First broken 2.1.199. Confirmed on 2.1.258.

Idle word is **honored**. Seeded state is discarded / #74256 (hook returns allow; decision silently discarded; chooser still blocks; updatedPermissions dropped). Never idle as jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / indexed / arrested / skipped.

```bash
node projects/tumbler/hook/tumbler.mjs projects/tumbler/data/74256.json
node projects/tumbler/hook/tumbler.mjs projects/tumbler/data/honored.json
echo '{"hookEvent":"PermissionRequest","toolName":"ExitPlanMode","decisionBehavior":"allow","decisionDiscarded":true}' | node projects/tumbler/hook/tumbler.mjs
node --test projects/tumbler/hook/tumbler.test.mjs
```

Empty stdin uses the idle **honored** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `honored`, `discarded`, `hold`, `alarm`, `idleWord`.

Given `{ hookEvent, toolName, decisionBehavior, decisionDiscarded, chooserBlocks, allowApplied }`:

- **HONORED** if PermissionRequest allow applied; chooser skipped; updatedPermissions take effect; plan implements
- **DISCARDED** if hook returns allow; decision silently discarded; chooser still blocks; updatedPermissions dropped (#74256)
- **CHOOSER-BLOCKS** if native plan-approval chooser still displayed ("Would you like to proceed?")
- **ALLOW-IGNORED** if allow+updatedPermissions / bare allow / PreToolUse permissionDecision allow ignored on 2.1.201
- **DENY-STILL-WORKS** if deny+message round-trips; model revises and retries ExitPlanMode
- **UPDATEDINPUT-WORKAROUND** if echo tool_input as decision.updatedInput skips chooser
- **UPDATEDPERMISSIONS-DROPPED** if updatedPermissions (setMode acceptEdits) dropped; hello.txt never created
- **DOCS-GAP** if PermissionRequest docs never mention updatedInput; bare allow silently discarded
- **HAS-CLEAR-REPRO** if blimmer filed #74256; bcherny 2.1.233; jbeno 2.1.258; plan mode
- **HOLD** if the keyway is honored (allow applied; chooser skipped)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the keyway is honored or discarded.

Primary: [anthropics/claude-code#74256](https://github.com/anthropics/claude-code/issues/74256). Cousins (cite only, not primaries): [#90685](https://github.com/anthropics/claude-code/issues/90685) systemMessage never rendered; [#71061](https://github.com/anthropics/claude-code/issues/71061) closed; [#50660](https://github.com/anthropics/claude-code/issues/50660) closed PreToolUse deny; [#84098](https://github.com/anthropics/claude-code/issues/84098); [#89251](https://github.com/anthropics/claude-code/issues/89251).

Hypothesis only (NON-BINDING): since 2.1.199, PermissionRequest allow for tools whose approval card is the user interaction is discarded unless updatedInput is present; deny untouched; docs under-specify. Do not claim a root cause in Claude Code source you have not seen.

NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross / escapement pallet-fork. Product name stays Tumbler. Do not rename to Lock / Keyway / Permission / Plan / Hooks / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Postern / Escapement / Carillon.
