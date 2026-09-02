# Hawser hook

Tiny dockyard hawser / process-reap classifier for the Claude Code defect where Windows desktop idle warm sessions never release MCP child processes. WarmLifecycle logs `Idle timeout reached, disconnecting` but the per-session `claude.exe` + MCP children are never reaped. 1 → 1182 children / 32.9 GB RSS in one day. Reporter megzieberr. Filed 2026-09-02. Labels: bug, has-repro, platform:windows, area:mcp, area:desktop.

Idle word is **slipped**. Seeded state is fouled / #91578 (idle disconnect logged; children never reaped; 1 → 1182 / 32.9 GB RSS). Never idle as verbatim / mangled / moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

```bash
node projects/hawser/hook/hawser.mjs projects/hawser/data/91578.json
node projects/hawser/hook/hawser.mjs projects/hawser/data/slipped.json
echo '{"children":1182,"reaped":false}' | node projects/hawser/hook/hawser.mjs
node --test projects/hawser/hook/hawser.test.mjs
```

Empty stdin uses the idle **slipped** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `slipped`, `fouled`, `unreaped`, `hold`, `alarm`, `idleWord`.

Given `{ persistReap, slipped, fouled, children, childrenAfterIdle, reaped, unreaped, idleDisconnect, idleTimeout, warmlifecycle, processTree, rssClimb, gpuCrash, monotonic, perSessionCost }`:

- **SLIPPED** if idle disconnect reaped the hawser (children returned to 1)
- **FOULED** if WarmLifecycle disconnect logged and children never reaped (#91578)
- **UNREAPED** if idle disconnect fired and child count never decreased
- **IDLE-TIMEOUT** if WarmLifecycle started a 900s idle timeout then disconnected without slip
- **WARMLIFECYCLE** if `WarmLifecycle:session` logged disconnect but the tree never slipped
- **PROCESS-TREE** if the tree grew 1 → 1182 across 08:49–20:30
- **RSS-CLIMB** if children RSS climbed 38 MB → 32.9 GB
- **GPU-CRASH** if the run ended GPU process gone exitCode 101457950
- **MONOTONIC** if child count never decreased after idle disconnects
- **PER-SESSION-COST** if ~5 restored sessions produced 50 children / ~2 GB
- **HOLD** if the bitts hold (idle disconnect reaped the hawser)

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the hawser slipped or the warm children already fouled.

Primary: [anthropics/claude-code#91578](https://github.com/anthropics/claude-code/issues/91578). Cousin (cite only, not primary): [#77593](https://github.com/anthropics/claude-code/issues/77593) Windows background Bash orphans.

Hypothesis only (NON-BINDING): WarmLifecycle disconnects the session IPC but does not terminate the per-session `claude.exe` + MCP child tree on Windows (no Job Object / no cascading kill). Each subsequent warm adds another unreaped copy. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.

NOT leftover proof-desk caret / harbor-buoy / solecism usage-desk / coffer vault / codicil probate / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging / reglet letterpress. Product name stays Hawser.
