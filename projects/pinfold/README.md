# Pinfold

An English village **livestock pound** — dry-stone limestone walls, moss and lichen, weathered oak gate, iron hasp, lantern amber, indigo dusk, straw, a penned stray goat, a free ewe — for a real Claude Code defect: the PowerShell tool's harness-composed inline command is `pwsh -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command <utf8 preamble>; <tool call body>; <exit-code/pwd epilogue>`. When the inline body is a ~1–2 KB multi-line byte-read / string-replace / byte-write (ordinary agent file surgery), Defender's `Trojan:Win32/FileFix.BBA!MTB` behavioral signature matches the **CmdLine** resource (not a file). Action: Remove (process launch blocked); no file quarantined; DidThreatExecute: False. Defender operational events 1116/1117. The model and user only see:

```
EPERM: operation not permitted, uv_spawn 'C:\Users\<user>\AppData\Local\Microsoft\WindowsApps\pwsh.exe'
```

No stderr, no hint of Defender. Short commands (including file writes via cmdlets) ran fine before/between/after. Moving the identical logic into a `.ps1` on disk and invoking it by a short path ran immediately — the body never appears in the AMSI-visible command line. FileFix targets social-engineering paste-attack one-liners; the harness reproduces that shape wholesale.

Primary: [anthropics/claude-code#90706](https://github.com/anthropics/claude-code/issues/90706) (OPEN, filed 2026-08-30). Title: Windows Defender FileFix signature blocks the PowerShell tool's composed inline commands; surfaces only as bare 'EPERM uv_spawn pwsh.exe'. Labels: bug, platform:windows, area:bash. Claude Code desktop, Windows 11 Pro, pwsh 7.6.5 (WindowsApps alias), Defender real-time protection default (no exclusions).

A penned spawn is not a hold. Score the fold or admit **penned**.

Idle word: **penned** (honest control: short command line, or identical logic materialized as `.ps1` invoked by path; spawn succeeds; no FileFix match; Defender events absent).
NEVER use penned for a failure. NEVER use product name pinfold, or these stolen idles as the idle/state word: underwrit, plated, collated, unheard, passed, squared, bound, girt, sheltered, alongside, seated, credited, level, verbatim, fronted, locked, yanked, caught, posted, bunged, belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, heard, clear, paired, empty, mute, idle, silent.

Verdicts: **penned**, **flagged**, **eperm-bare**, **cmdline-shape**, **filefix**, **toast-only**, **billed-retry**, **script-clears**, **events-1116**, **undiagnosed**.

- **penned** = idle / honest control (short cmdline or `.ps1` by path; spawn ok; no FileFix)
- **flagged** = #90706 primary: FileFix.BBA!MTB on CmdLine resource
- **eperm-bare** = only visible error is `EPERM: operation not permitted, uv_spawn '...pwsh.exe'`
- **cmdline-shape** = long inline `-NoProfile -NonInteractive -ExecutionPolicy Bypass -Command` + byte-patch body
- **filefix** = threat name Trojan:Win32/FileFix.BBA!MTB
- **toast-only** = user saw Windows Security toast; model saw nothing in-band
- **billed-retry** = retries guaranteed fail and are billed
- **script-clears** = same logic in a `.ps1` invoked by path runs clean (contrast that proves the cmdline shape is the trigger)
- **events-1116** = Defender operational log 1116/1117, DidThreatExecute False, no file quarantined
- **undiagnosed** = no in-band hint this is AV vs sandbox vs broken alias

The seeded #90706 board (long Bypass -Command + FileFix.BBA!MTB + EPERM uv_spawn + events 1116) is **flagged** (or eperm-bare), never **penned**. Unique nearby flags win their own seeds. Admit does not lie: a flagged probe stays flagged. Unique nearby flags win their own seeds. **Stamp** the matching class. Wrong stamps bind the gate. **Admit penned** unlocks only on the honest fold (short command or .ps1-by-path, spawn ok). **Restore · #90706** shows the flagged board.

## Why not a clone

NOT **Slype** (#90676) — sandbox admits System32 powershell.exe and 126-denies Program Files pwsh.exe. Different: sandbox path policy vs AV cmdline signature. Slype exit 126; Pinfold spawn never starts (EPERM uv_spawn).
NOT **Escutcheon** (#90717) — Linux sandbox empty tmpfs over /run/user hides D-Bus/libsecret; gh blames the token. Different OS, different hide, different blame.
NOT **Gasket** (#90355) — sandbox.network.strictAllowlist silently discarded.
NOT **Calque** (#90645) — PowerShell safety guard treating Spanish "del" as Remove-Item alias. Different: false alias vs AV signature.
NOT **Palimpsest** (#90725) — PreToolUse updatedInput whole-replace dropping timeout. Different layer entirely.
NOT **Fob** — Keychain credential litter. Not AV.
NOT **Chatelaine** — nested MCP OAuth. Not AV.

Different problem: harness-composed long `-Command` matches FileFix paste-attack shape; spawn blocked; surfaces as bare EPERM.
Different UI: outdoor English village **pinfold** (livestock pound) at dusk — dry-stone walls, timber gate with iron hasp, lichen, lantern, a stray `pwsh -Command` goat penned inside, a `.ps1` ewe grazing free outside the fold, a FILEFIX wanted-poster on the gate, an EPERM brand on the stray. Not a cathedral slype, not a locksmith plate, not a scriptorium parchment desk.
Different idle word: **penned**.

## Live catalog path

`/pinfold/` is this static village fold. Demo works with no secrets and no npm. Mark: `21:50 Sydney · pinfold`.

1. Seeded `#90706` **flagged** is already on the fold: long Bypass -Command + FileFix.BBA!MTB + EPERM uv_spawn + events 1116 → **flagged**. Never penned.
2. File **eperm-bare** — only visible error is `EPERM: operation not permitted, uv_spawn '...pwsh.exe'`.
3. File **cmdline-shape** — long inline `-NoProfile -NonInteractive -ExecutionPolicy Bypass -Command` + byte-patch body.
4. File **filefix** — threat name Trojan:Win32/FileFix.BBA!MTB.
5. File **toast-only** — user saw a Windows Security toast; the model saw nothing in-band.
6. File **billed-retry** — retries guaranteed fail and are billed.
7. File **script-clears** — same logic in a `.ps1` invoked by path runs clean.
8. File **events-1116** — Defender operational log 1116/1117; DidThreatExecute False; no file quarantined.
9. File **undiagnosed** — no in-band hint this is AV vs sandbox vs a broken alias.
10. **Stamp** the matching class. Wrong stamps bind the gate. **Admit penned** unlocks only on the honest fold (short command or `.ps1` by path, spawn ok). **Restore · #90706** shows the flagged board.

## Hook

`projects/pinfold/hook/` scores a probe transcript `{ composedCommand, threatName, resourceType, spawnError, spawnPath, events, didThreatExecute, fileQuarantined, invokedAs, bodyKind, userSawToast, modelSawHint }` and returns `{ verdict, reasons[], penned, alarm }`. See `hook/README.md`.

```bash
node projects/pinfold/hook/index.mjs < transcript.txt
node --test projects/pinfold/hook/pinfold.test.mjs
```

`penned` is true ONLY when the verdict is penned (idle, or honest control: short command line, or identical logic materialized as `.ps1` invoked by path; spawn succeeds; no FileFix). Seeded 90706 numbers must produce flagged / `penned=false`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90706](https://github.com/anthropics/claude-code/issues/90706) — OPEN, 2026-08-30. FileFix.BBA!MTB on harness-composed -Command; bare EPERM uv_spawn pwsh.exe.

Same-class:

- [anthropics/claude-code#65627](https://github.com/anthropics/claude-code/issues/65627) — CLOSED. AV "PowerShell 脚本执行检测" intercepts Node uv_spawn; all Shell EPERM. Same surface (AV→EPERM), broader (all commands, not FileFix-on-long-inline).
- [openai/codex#15423](https://github.com/openai/codex/issues/15423) — tool-generated PowerShell blocked as Trojan:Win32/ClickFix.SA!A (ClickFix family, same paste-attack heuristic).
- [openai/codex#31419](https://github.com/openai/codex/issues/31419) — Defender flags unsigned codex-computer-use.exe command line as Trojan:Win32/ClickFix.DE!MTB; CmdLine resource; events 1116/1117.
- [openai/codex#26218](https://github.com/openai/codex/issues/26218) — Defender Severe alert from Codex-generated pwsh reflection command (Trojan:Win32/Steanoz.Z!MTB); `pwsh.exe -Command` + inline reflection.

Nearby, not this (mention only as contrast):

- [anthropics/claude-code#90676](https://github.com/anthropics/claude-code/issues/90676) — Slype; sandbox 126 on Program Files pwsh.exe.

Suggested consumer fix (from the issue, not invented): when Windows spawn fails EPERM/access-denied, hint that security software may have blocked it (or check Defender 1116/1117); consider materializing long `-Command` bodies to a temp `.ps1` invoked by path so the logic never rides the AMSI-visible command line.

## Env

| Variable | Meaning |
| --- | --- |
| `PINFOLD_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Unused at page runtime. Absent → honest demo. |
| `PINFOLD_GITHUB_TOKEN` / `GITHUB_TOKEN` | Unused at page runtime. |

Missing secrets stay in honest demo mode. The static page does not need them.
