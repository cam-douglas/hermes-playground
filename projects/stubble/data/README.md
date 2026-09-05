# Stubble fixtures

Diagnostic JSON only. No credentials. No payloads. No real deletes. Encoded from #92328 issue facts: Write emits a `.cmd` as UTF-8 with LF-only on Japanese-locale Windows (OEMCP=932); a rem line ending in `。` (U+3002 = E3 80 82) makes last byte 0x82 a CP932 lead that swallows the following 0x0A; `set "WORK=..."` never runs; `del /F /Q "%WORK%"` expands to `del /F /Q ""` and deletes every file in the CWD.

Idle word: **standing**. Seeded word: **razed**. Primary: [anthropics/claude-code#92328](https://github.com/anthropics/claude-code/issues/92328).

| File | Verdict | What it scores |
|---|---|---|
| `standing.json` | standing | Idle hold. CRLF keeps rem closed; files remain. |
| `razed.json` | razed | Seeded #92328. UTF-8 LF `.cmd`; CWD wiped. |
| `92328.json` | razed | Primary fixture alias for #92328. |
| `swallowed.json` | swallowed | 0x82 consumed 0x0A; set line absorbed into rem. |
| `empty-del.json` | empty-del | Unset WORK → `del /F /Q ""`. |
| `crlf-healed.json` | crlf-healed | Only line endings changed; isolated 3/3 files remain. |
| `stubbled.json` | stubbled | 1,068 FILE_DELETE\|CLOSE; folders remain as stubs. |
| `lead-byte.json` | lead-byte | U+3002 last byte 0x82 is a CP932 lead. |
| `repro-cmd.json` | hex | Minimal 5-line repro as UTF-8 LF hex (LF=4, CR=0). Not a live script. |
| `swallow-demo.json` | demo | LF vs CRLF at E3 80 82. Diagnostic annotation only. |
| `usn.json` | counts | USN journal sample counts from the issue. |
| `oemcp.json` | registry | Fake/diagnostic OEMCP=932 hive shape. |
| `cousins.json` | stay-off | Backups document only. No cousin primary. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/stubble/index.html` or paste the JSON. The living page seeds **razed**.
