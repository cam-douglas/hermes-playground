# Seizing fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92586 issue facts: an EDR's transient second hard link (`nlink` 1→2→1, same inode/dev/size/owner/mode/content) false-triggers the Bash output-file identity check, then SIGTERM→SIGKILL (~5s) with exit 137. Score culled or admit sole.

Idle word: **culled**. Seeded word: **sole**. HOLD: **sole** / **ramdisk-ok**. ALARM: **culled** / **nlink-spike** / **sigkill-5s** / **cousins**. Primary: [anthropics/claude-code#92586](https://github.com/anthropics/claude-code/issues/92586).

Fixtures record the published error, nlink poll, headless repro, and environment. No live session. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `culled.json` | culled | Idle bench. Output-file identity check treats nlink spike as replacement; command killed. |
| `sole.json` | sole | Seeded hold. nlink=1 identity holds; command survives. |
| `92586.json` | culled | Primary fixture alias for #92586. |
| `nlink-spike.json` | nlink-spike | `stat -f %l` 1→2→1 on boot-volume new files; inode never changes. |
| `sigkill-5s.json` | sigkill-5s | Trap recorded SIGTERM at exactly +5s from parent `claude`; exit 137. |
| `ramdisk-ok.json` | ramdisk-ok | `CLAUDE_CODE_TMPDIR` on APFS ramdisk or sparseimage; nlink stays 1. |
| `cousins.json` | cousins | Cite-only #92590 (TMPDIR read-only sandbox). Primary stays #92586. |
| `fixtures.json` | index | Row list for the seizing bench. |

Drop any file onto `projects/seizing/index.html` or paste the JSON. The living page admits **culled** / EDR-transient-hard-link-false-replacement / #92586.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
