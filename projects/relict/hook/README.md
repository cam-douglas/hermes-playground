# Relict hook

Tiny glacial-relict / fossil-outcrop classifier for the Claude Desktop (Windows/MSIX) defect where "launch at startup" writes a versioned `WindowsApps` path to `HKCU\Run`, so it silently breaks at the next auto-update. Reporter iamsteamboat. Filed 2026-09-04. Labels: invalid. Claude Desktop 1.46388.1.0 MSIX `Claude_pzs8sxrjxfjjc`. Windows 11 Home 10.0.26200.

Idle word is **live**. Seeded state is orphaned / #92173 (stale versioned Run key; package folder gone; silent fail every logon). Never idle as set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled.

```bash
node projects/relict/hook/relict.mjs projects/relict/data/92173.json
node projects/relict/hook/relict.mjs projects/relict/data/live.json
echo '{"runKeyWritten":true,"testPath":false}' | node projects/relict/hook/relict.mjs
node --test projects/relict/hook/relict.test.mjs
```

Empty stdin uses the idle **live** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `live`, `orphaned`, `hold`, `alarm`, `idleWord`.

Given an outcrop-shaped payload `{ runKeyWritten, runKeyPath, runKeyVersion, currentPackageVersion, packageFolderExists, testPath, startupApproved, startupTaskState, silentFail, mechanism }`:

- **LIVE** if StartupTask API keeps the path current / the task stays enabled
- **ORPHANED** if a stale versioned Run key points at a gone folder (#92173)
- **VERSIONED** if HKCU\Run writes a versioned WindowsApps path
- **SILENT** if logon launch fails silently
- **DEMOTED** if ClaudeStartup State=0 / UserEnabledStartupOnce=0
- **APPROVED** if the entry was never under Explorer\StartupApproved\Run
- **STARTUP-TASK** if the package declares windows.startupTask but the task stays Disabled
- **RUN-KEY** if the toggle wrote HKCU\Run instead of enabling the task
- **MISSING-FOLDER** if Test-Path is False after the next auto-update
- **BOUND** if the StartupTask stays enabled on a follow-the-package ticket

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the StartupTask stayed live or the Run key already orphaned the path.

Primary: [anthropics/claude-code#92173](https://github.com/anthropics/claude-code/issues/92173). Cousins (cite only, not primary): [#92167](https://github.com/anthropics/claude-code/issues/92167), [#89912](https://github.com/anthropics/claude-code/issues/89912), [#91482](https://github.com/anthropics/claude-code/issues/91482), [#85689](https://github.com/anthropics/claude-code/issues/85689). Different-class cite: [#91750](https://github.com/anthropics/claude-code/issues/91750).

Hypothesis only (NON-BINDING): toggle wrote a versioned HKCU\Run instead of enabling the StartupTask API; updates do not refresh Run; silent fail. Discard if issue evidence disagrees. Do not claim Claude Desktop source you have not seen.

NOT leftover letterpress hellbox / bone-ash cupel / stone-pit oubliette / cream wick-lit ephemera / commutator drum / vault reliquary. Product name stays Relict.
