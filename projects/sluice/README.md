# Sluice

A **millrace / sluice-gate / pool-gauge desk** — deep race-water indigo/teal, wet slate, brass gate wheel, pale foam, timber mill deck; Fraunces + Source Sans 3 + IBM Plex Mono — for a real Desktop defect: **Claude Desktop's Cowork VM stack leaks kernel pool objects (Toke / File / SeAt) until only a reboot reclaims them**. Driver-allocated, charged to no user-mode process. After 3–4 days paged pool >~5 GB → 50–200 ms stalls in window dragging / Alt+Tab / input. Fresh signature is Toke/File/SeAt paged-pool + UI jank, not only NtFC nonpaged.

Primary:

- [anthropics/claude-code#91265](https://github.com/anthropics/claude-code/issues/91265) (OPEN, bug, has repro, platform:windows, perf:memory, area:cowork, area:desktop, filed 2026-09-01T16:26:00Z). Title: Cowork VM causes persistent kernel pool leak (Toke/File/SeAt) leading to system-wide UI degradation on Windows. Desktop 1.40609.0.0 (WindowsApps MSIX). Windows 11 Pro 10.0.26200. Reporter milandin-hash.

A sluice that never drains leaves the mill pond rising until the whole yard floods. Score the race or admit **drained**.

Idle word: **drained**. Seeded state: **pooled** / #91265 — Cowork stack ON, Toke 2,719,886 (~4,975 MB) ~2/s, File 6,644,575 (~2,534 MB) ~11/s, SeAt 10,855,380 (~994 MB), unaccounted 7.68 GB vs user-mode 0.29 GB, UI jank 50–200 ms, only reboot reclaims. Never idle as pooled / sluice / limpet / quench / bulla / carcase / wraith / alidade / parison / cockade / lye / stationed / displaced / hung / marvered / unpinned / shed / sealed / blown.

A **sluice** is the gate on a millrace. Metaphor: a sluice that never drains leaves the mill pond rising until the whole yard floods (system-wide UI jank). Score whether the Cowork race is **drained** (pool tags flat / stack OFF / reboot-cleared) vs **pooled** (Toke/File/SeAt climbing while user-mode looks fine).

- **pooled** = #91265 primary: Toke/File/SeAt climbing, Cowork stack ON
- **toke-climbing** = Toke access-token objects rising (~2/s)
- **file-climbing** = File objects rising (~11/s)
- **seat-climbing** = SeAt security-attribute objects rising
- **minifilter-held** = wcifs/bindflt + CoworkVMService still attached
- **unaccounted** = driver-allocated paged pool ~7.68 GB vs user-mode 0.29 GB
- **janky** = 50–200 ms UI stalls after paged pool >~5 GB
- **reboot-only** = only a full system restart reclaims
- **drained** = HOLD: pool tags quiet, stack OFF or freshly rebooted, UI responsive
- **stack-off** = HOLD: Cowork stack OFF; A/B cuts Toke −50% / File −60%
- **ntfC-cousin** = NtFC family cite (#45921/#85480/WSL#40804), not this pond
- **watchdog** = #67819 NtFC 12–16 GB/h + watchdog; cousin, not primary

Verdicts: drained, pooled, toke-climbing, file-climbing, seat-climbing, minifilter-held, unaccounted, janky, reboot-only, stack-off, ntfC-cousin, watchdog.

This is a diagnostic scoring bench. Not an exploit, attack PoC, or remote-access how-to. No payloads. No reproduction procedures. Score whether the Cowork race is drained or pooled.

Hypothesis only (NON-BINDING): treat this as Cowork VM + wcifs/bindflt minifilter retention of kernel pool tags, charged to no user-mode process, reclaimable only by reboot. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **KERNEL-POOL RETENTION vs COWORK MINIFILTER STACK — Toke/File/SeAt paged-pool climb + system-wide UI jank. Driver-allocated. User-mode looks fine. Only reboot reclaims.**

NOT **Limpet** ([#89275](https://github.com/anthropics/claude-code/issues/89275)) — OS process-pair cling after end_turn.
NOT **Quench** — token-spend fuse.
NOT **Bulla** ([#90891](https://github.com/anthropics/claude-code/issues/90891)) — MSIX integrity seal.
NOT **Wraith** — live-image unlink.
NOT **Carcase** ([#90867](https://github.com/anthropics/claude-code/issues/90867)) — stealth relaunch empty chrome.
NOT **Alidade** ([#91055](https://github.com/anthropics/claude-code/issues/91055)) — foreign tool host / station plate.
NOT **Parison / Cockade / Lye**. Product name stays **Sluice**. Do not rename to Millrace / Flume / Tailrace / Spillway / Penstock / Leat / Sump.

Different UI: millrace / sluice-gate / pool-gauge. Deep race-water indigo/teal, wet slate, brass gate wheel, pale foam, timber mill deck. Fraunces + Source Sans 3 + IBM Plex Mono. NOT Alidade Libre Caslon / Public Sans plane-table. NOT Parison EB Garamond glasshouse. NOT Bulla Cormorant lead-seal. NOT Limpet tide-pool. NOT a leftover woodworking instrument. NOT a millimeter-slider.

Different verbs: score the race, pin idle drained, pin seeded pooled, admit drained, load fixtures, reset to drained. Not "Score the peg" / "Score the gather" / "Pry the shell".

Different idle: **drained**.

## Live catalog path

`/sluice/` is this static millrace. Path `https://hermes-playground-green.vercel.app/sluice/` and subdomain `https://sluice.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `02:50 / hermes catalog #103 / #91265`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **drained** — pool tags quiet, Cowork stack OFF or freshly rebooted 0.07 h, UI responsive.
2. Seed **pooled** → #91265: Toke 2,719,886 / File 6,644,575 / SeAt 10,855,380, unaccounted 7.68 GB.
3. Mill pond + brass gate wheel. Pond floods when pooled. Wheel holds when the sluice is closed.
4. Pool-tag rate board (Toke / File / SeAt) with ON vs OFF A/B strip.
5. Reboot-only reclaim docket + UI-jank ms gauge.
6. NtFC cousin cite strip (#45921/#67819/#85480/WSL#40804) labeled cousin, not primary.
7. **Score the race** walks the probe ticket and lights chips on the deck. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/sluice/index.html` in a browser, or serve the repo root and visit `/sluice/` (Vercel rewrite → `/projects/sluice`). No build step. Optional hook:

```bash
node projects/sluice/hook/sluice.mjs projects/sluice/data/91265.json
node projects/sluice/hook/sluice.mjs projects/sluice/data/drained.json
node --test projects/sluice/hook/sluice.test.mjs
```

Pooled seed → pooled/alarm. Drained seed → drained/hold.

`projects/sluice/hook/sluice.mjs` classifies a probe ticket JSON `{ coworkStackOn, tokeRatePerSec, fileRatePerSec, seatRatePerSec, tokeObjects, fileObjects, seatObjects, pagedPoolGB, unaccountedGB, userModePagedGB, uiJankMs, rebootClears, ntfCCousin }` and returns `{ verdict, chips[], reasons[], drained, pooled, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91265.json`, `data/pooled.json`, `data/drained.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`. Evidence only from issue facts. No invented pool-tag counts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91265](https://github.com/anthropics/claude-code/issues/91265). Unauthenticated. Cousins cited on the ledger. See `.env.example`.
2. Paste/drop a probe ticket JSON and score it.
3. Pool-tag rate board (Toke / File / SeAt) with ON vs OFF A/B strip.
4. Reboot-only reclaim docket + UI-jank ms gauge.
5. NtFC cousin cite strip (#45921/#67819/#85480/WSL#40804) labeled cousin, not primary.

## Sources

- [anthropics/claude-code#91265](https://github.com/anthropics/claude-code/issues/91265) OPEN
- Family / cousins (cite, not primaries): [#55361](https://github.com/anthropics/claude-code/issues/55361) NtFC / wcifs-bindflt; [#45889](https://github.com/anthropics/claude-code/issues/45889); [#48813](https://github.com/anthropics/claude-code/issues/48813); [#45921](https://github.com/anthropics/claude-code/issues/45921) claudevm.bundle .wvm-tmp → NtFC; [#67819](https://github.com/anthropics/claude-code/issues/67819) NtFC 12–16 GB/h + watchdog; [#85480](https://github.com/anthropics/claude-code/issues/85480) ~2.2 GB/h NtFC; [microsoft/WSL#40804](https://github.com/microsoft/WSL/issues/40804) NtFC host-NTFS corroboration.
