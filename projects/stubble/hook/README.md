# Stubble hook

Tiny harvested-stubble-field classifier notes for the Claude Code defect where Write emits a `.cmd` as UTF-8 with LF-only on Japanese-locale Windows (OEM codepage 932). A rem line ending in `。` (U+3002 = E3 80 82) makes its last byte 0x82 look like a CP932 lead, which consumes the following 0x0A. The next `set` never runs. `del /F /Q "%WORK%"` expands to `del /F /Q ""` and deletes every file in the CWD. OPEN. Labels: bug, has repro, platform:windows, area:tools, high-priority, data-loss.

IDLE_WORD=standing. SEEDED_WORD=razed. Seeded state is razed / #92328 (UTF-8 LF `.cmd` under CP932; empty del; CWD wiped). Never idle as once / doubled / stuck / missed / spilled / hushed / blurted / single / maculed / gated / rung / barred / dropped.

This stub is documentation only. The living page at `projects/stubble/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. No real deletes. Diagnostic shapes only (UTF-8 LF hex, CP932 lead-byte swallow, OEMCP=932, USN FILE_DELETE\|CLOSE counts, simulated `del /F /Q ""` expansion). No payloads.

Preferred fix / detection (document only — do not treat this stub as a live hook):

1. Write `.cmd` / `.bat` on Windows with CRLF (or preserve an existing file's line endings), or
2. Warn when a `.cmd` / `.bat` contains non-ASCII while the OEM codepage is not UTF-8, and
3. Check line endings and charset before executing a batch generated in the same turn.

Detection: if Write emitted a `.cmd` as UTF-8 LF-only, OEMCP is 932 (or another DBCS OEM), a rem (or other) line ends in a UTF-8 tail whose last byte is a CP932 lead immediately followed by 0x0A, the following `set` is absorbed, and `del /F /Q "%VAR%"` expands to `del /F /Q ""`, the field is already razed.

Given a probe-shaped payload `{ lineEndings, oemcp, encoding, remTailHex, swallow, workSet, expandedDel, usnDeleteClose, usnRename, unrecoverable, persistHold, standing, razed, log }`:

- **STANDING** if CRLF (or OEM that does not swallow) keeps rem closed and WORK is set
- **RAZED** if LF-only + CP932 lead-byte swallow + empty del wipes the CWD (#92328)
- **SWALLOWED** if 0x82 consumed 0x0A and the next line stayed inside rem
- **EMPTY-DEL** if `%WORK%` is unset and expansion is `del /F /Q ""`
- **CRLF-HEALED** if only line endings changed and isolated files remain
- **STUBBLED** if USN shows FILE_DELETE\|CLOSE with 0 RENAME and folders remain
- **LEAD-BYTE** if the decisive offset is U+3002 = E3 80 82 whose last byte is a CP932 lead

This is a diagnostic scoring desk. Not an exploit. No payloads. No real deletes. Score whether the furrow is standing or already razed.

Primary: [anthropics/claude-code#92328](https://github.com/anthropics/claude-code/issues/92328). No cousin primary. Backups document only: [#92286](https://github.com/anthropics/claude-code/issues/92286) Cresset, [#92292](https://github.com/anthropics/claude-code/issues/92292) Symlink, [#92321](https://github.com/anthropics/claude-code/issues/92321), [#92325](https://github.com/anthropics/claude-code/issues/92325).

Hypothesis only (NON-BINDING): cmd.exe OEM DBCS parsing + LF-only generated `.cmd` is the wipe path. The issue's CRLF-only control makes the bug disappear. Discard if issue evidence disagrees.

NOT leftover Intake gauge-house / Pasteboard kraft / Spillway dam / Blurt CRT / Macule letterpress / Alarum watchtower. Product name stays Stubble.
