# Bulla hook

Tiny papal lead-bulla / sealed-package scorer for an in-place MSIX mutate: the Claude Desktop updater writes files inside the immutable package directory (`C:\Program Files\WindowsApps\Claude_…`). `AppxMetadata\CodeIntegrity.cat` goes missing. Windows Code Integrity Event **3010** (STATUS_OBJECT_PATH_NOT_FOUND `0xC000003A`) then Event **3033** blocks `claude.exe` loading `app\vk_swiftshader.dll`. The GPU process dies (`exitCode: 101457950`), Electron tears down the whole app, and every embedded Claude Code session is killed. Package status: **Modified, NeedsRemediation**. Standalone unpackaged Claude Code is unaffected. Pipe a probe ticket (`inPlaceWrite` / `catPresent` / `event3010` / `event3033` / `gpuCrashed` / `sessionsKilled` / `packageStatus` / `unpackagedOk` / `dllBlocked`) and get **blown** or **sealed**.

Idle word is **sealed**. Seeded state is blown / #90891. Never idle as "bulla" / "wax" / "lead" / "papal" / "chancery" / "msix" / "package" / "gpu" / "cat" / "desktop".

```bash
node projects/bulla/hook/bulla.mjs < projects/bulla/data/90891.json
node projects/bulla/hook/bulla.mjs projects/bulla/data/sealed.json
node --test projects/bulla/hook/bulla.test.mjs
```

Empty stdin uses the seeded #90891 blown ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `sealed`, `blown`, `hold`, `alarm`, `idleWord`.

- **SEALED** if intact MSIX seal, `CodeIntegrity.cat` present, GPU alive, embedded sessions running, package Ok
- **BLOWN** if in-place mutate of the sealed MSIX → catalog missing → Event 3010 → Event 3033 → GPU dead → sessions killed (#90891)
- **IN-PLACE** if the updater wrote files inside the immutable `WindowsApps` package directory
- **CAT-MISSING** if `AppxMetadata\CodeIntegrity.cat` is absent (`Test-Path` = False)
- **GPU-DEAD** if `GPU process gone … exitCode: 101457950`
- **SESSIONS-KILLED** if Electron tore down the app and every embedded session died
- **NEEDS-REMEDIATION** if package status is Modified, NeedsRemediation
- **UNPACKAGED-CLEAR** if standalone unpackaged Claude Code 2.1.251 stays clear (witness)
- **SWIFTSHADER-BLOCKED** if `claude.exe` was blocked loading `app\vk_swiftshader.dll`
- **CATALOG-VOID** if the per-file CI catalog is missing so package integrity cannot validate
- **EVENT-3010** if Code Integrity could not load `CodeIntegrity.cat` — `0xC000003A`
- **EVENT-3033** if the SwiftShader load failed Microsoft signing-level requirements

Primary: [anthropics/claude-code#90891](https://github.com/anthropics/claude-code/issues/90891). Same-class (cite, not primary): [#89112](https://github.com/anthropics/claude-code/issues/89112) catalog never shipped / Event 3010/3033; [#81341](https://github.com/anthropics/claude-code/issues/81341) CIG + vendor-signed `vk_swiftshader.dll`; [#89016](https://github.com/anthropics/claude-code/issues/89016) GPU exit 101457950 / NeedsRemediation. Updater-family (different symptom): [#81875](https://github.com/anthropics/claude-code/issues/81875), [#89687](https://github.com/anthropics/claude-code/issues/89687). Cross-ecosystem: [electron/electron#51761](https://github.com/electron/electron/issues/51761) GPU goodbye on Windows from zombie SID DACL, not catalog-missing.

NOT Wraith / Carcase / Damper / Livery / Trompe / Davy / Assay / Sigil.
