# Sluice hook

Tiny millrace classifier for Cowork kernel-pool retention. Claude Desktop's Cowork VM stack (`CoworkVMService`, `wcifs`/`bindflt` minifilters, WSL2 infra) leaks Toke / File / SeAt until only a reboot reclaims them. User-mode looks fine. After 3–4 days the yard floods: 50–200 ms UI jank.

Idle word is **drained**. Seeded state is pooled / #91265 (Toke 2,719,886 ~2/s, File 6,644,575 ~11/s, SeAt 10,855,380, unaccounted 7.68 GB vs user-mode 0.29 GB). Never idle as pooled / sluice / limpet / quench / bulla / alidade / parison / stationed / displaced / hung / marvered.

```bash
node projects/sluice/hook/sluice.mjs projects/sluice/data/91265.json
node projects/sluice/hook/sluice.mjs projects/sluice/data/drained.json
echo '{"coworkStackOn":true,"tokeRatePerSec":2,"fileRatePerSec":11}' | node projects/sluice/hook/sluice.mjs
node --test projects/sluice/hook/sluice.test.mjs
```

Empty stdin uses the idle **drained** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `drained`, `pooled`, `hold`, `alarm`, `idleWord`.

- **DRAINED** if pool tags are quiet, Cowork stack is OFF or freshly rebooted, and UI is responsive
- **POOLED** if Toke and File climb on a Cowork-ON race (#91265)
- **TOKE-CLIMBING** if Toke objects rise at a sustained rate (~2/s)
- **FILE-CLIMBING** if File objects rise at a sustained rate (~11/s)
- **SEAT-CLIMBING** if SeAt objects rise
- **MINIFILTER-HELD** if wcifs/bindflt / CoworkVMService still attached
- **UNACCOUNTED** if driver-allocated paged pool dwarfs user-mode
- **JANKY** if UI stalls 50–200 ms after paged pool >~5 GB
- **REBOOT-ONLY** if only a full restart reclaims
- **STACK-OFF** if Cowork stack OFF (A/B cuts Toke −50% / File −60%) (hold)
- **NTFC-COUSIN** if the ticket is an NtFC family cite, not this pond
- **WATCHDOG** if the ticket is #67819 NtFC + watchdog

This is a diagnostic scoring bench. Not an exploit, attack PoC, or remote-access how-to. No payloads. Score whether the Cowork race is drained or pooled.

Primary: [anthropics/claude-code#91265](https://github.com/anthropics/claude-code/issues/91265). Cousins (not primaries): #45921, #67819, #85480, #55361, #45889, #48813, microsoft/WSL#40804.

Hypothesis only (NON-BINDING): Cowork VM + wcifs/bindflt minifilter retention of kernel pool tags, charged to no user-mode process, reclaimable only by reboot. Do not claim a root cause in Claude Code source you have not seen.

NOT Limpet / Quench / Bulla / Wraith / Carcase / Alidade / Parison. Product name stays Sluice. Do not rename to Millrace / Flume / Tailrace.
