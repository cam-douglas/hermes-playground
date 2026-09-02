# Scotch hook

Tiny wagon scotch-block classifier for the Windows SCM recovery-actions miss. Packaged Windows service `CoworkVMService` / `cowork-svc.exe` logs every start in `C:\ProgramData\Claude\Logs\cowork-service.log` a warning: failed to configure recovery actions (a crashed service will stay down until reboot): open service: Access is denied. Matching stop warning: failed to disarm recovery actions… Access is denied. Once the service dies uncleanly, Windows will not bring it back — reboot-only reclaim.

Idle word is **chocked**. Seeded state is rolled / #91324 (Access is denied configuring recovery actions; crashed service stays down until reboot). Never idle as rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked.

```bash
node projects/scotch/hook/scotch.mjs projects/scotch/data/91324.json
node projects/scotch/hook/scotch.mjs projects/scotch/data/chocked.json
echo '{"recoveryConfigured":false,"accessDenied":true,"openServiceDenied":true,"uncleanDeath":true,"rebootRequired":true,"crashStaysDown":true}' | node projects/scotch/hook/scotch.mjs
node --test projects/scotch/hook/scotch.test.mjs
```

Empty stdin uses the idle **chocked** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `chocked`, `rolled`, `hold`, `alarm`, `idleWord`.

Given `{ recoveryConfigured, accessDenied, openServiceDenied, crashStaysDown, rebootRequired, uncleanDeath }`:

- **CHOCKED** if recovery actions configured successfully; unclean service death would auto-restart; no Access is denied on open service
- **ROLLED** if Access is denied configuring recovery actions; crashed service stays down until reboot (#91324)
- **ACCESS-DENIED** if the start log warns `open service: Access is denied`
- **RECOVERY-ACTIONS** if configure / disarm recovery actions both fail
- **OPEN-SERVICE** if `open service: Access is denied` on the CoworkVMService handle
- **REBOOT-ONLY** if a crashed service stays down until reboot; Task Manager kill left it down permanently
- **UNCLEAN-DEATH** if Desktop window deaths leave the service down uncleanly
- **GPU-ADJACENT** if `GPU process gone` at death (cite-only cousin #90105)
- **MSIX-ADJACENT** if pending MSIX 1.40609.0.0 → 1.40609.1.0 (cite-only cousins)
- **SECOND-INSTANCE** if main process stayed alive with no window; second-instance suppressed
- **HAS-REPRO** if the recovery-actions warning logs every start; labels include has repro
- **HOLD** if the block is chocked (recovery armed; unclean death would auto-restart)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the block is chocked or rolled.

Primary: [anthropics/claude-code#91324](https://github.com/anthropics/claude-code/issues/91324). Cousins (cite only, not primaries): [#90105](https://github.com/anthropics/claude-code/issues/90105) GPU orphan; [#89912](https://github.com/anthropics/claude-code/issues/89912) / [#89692](https://github.com/anthropics/claude-code/issues/89692) / [#89648](https://github.com/anthropics/claude-code/issues/89648) / [#89687](https://github.com/anthropics/claude-code/issues/89687) MSIX update reboot loops.

Hypothesis only (NON-BINDING): service process lacks privilege / wrong identity to call ChangeServiceConfig2 for failure actions, so recovery never arms. Do not claim a root cause in Claude Code source you have not seen.

NOT leftover woodworking / mm-slider. Product name stays Scotch. Do not rename to Recovery / Service / SCM / Cowork / Reboot / Access / Fibula / Virgule / Riddle / Garner / Pintle.
