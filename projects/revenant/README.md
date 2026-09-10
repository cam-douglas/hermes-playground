# Revenant

A **Victorian séance parlor / process-tomb graveyard** — charcoal bone, cold violet, rust commit-meter, candle soot. Fonts **Young Serif** (display) + **Mulish** (body) + **DM Mono** (mono). Palette: charcoal bone, cold violet, rust commit-meter, candle soot — for a real Claude Code defect: **WINDOWS PEER-SESSION LIVENESS PROBE (POWERSHELL + GET-CIMINSTANCE WIN32_PROCESS, 1 S TIMEOUT) LEAVES UNKILLABLE ORPHAN PROCESSES → COMMIT EXHAUSTION → CRASH 0xC0000409.**

Primary:

- [anthropics/claude-code#93274](https://github.com/anthropics/claude-code/issues/93274) (OPEN, bug, has repro, platform:windows, area:core). Title: `[BUG] Windows: peer-session liveness probe (powershell + Get-CimInstance Win32_Process, 1 s timeout) leaves unkillable orphan processes -> commit exhaustion -> crash 0xC0000409`. Versions 2.1.263 / 2.1.266 / 2.1.267. OS Windows 11 Pro 10.0.26200. Filed by goldencircle1109 2026-09-10. On Windows, Claude Code checks peer sessions in `%USERPROFILE%\.claude\sessions\<PID>.<hash>.key` for liveness. The `bun:ffi` OpenProcess/GetProcessTimes fast path is unavailable on the reporter's machine, so every check falls back to spawning `powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \"ProcessId=${e}\").CreationDate.Ticks"` with Node timeout 1000ms. `Get-CimInstance Win32_Process -Filter ProcessId=N` enumerates every process then filters (~1.45ms/proc). On a ~500–1200 process machine the probe takes 0.8–2.0s and structurally exceeds the 1s timeout. When Node kills powershell mid WMI/DCOM RPC, the process never finishes tearing down: HasExited=True, taskkill/Stop-Process claim success, yet ~43MB commit + one thread Wait/Executive remain until reboot. Every session probes every peer with 3–4 retries; zombies raise process count → slower probes → more timeouts → self-acceleration; eventually commit exhaustion / crash 0xC0000409. Stale keys after reboot (PID reuse by non-claude) amplify probes. Not related to Remote Control (`disableRemoteControl` verified no effect).

16:50 revenant: a Victorian séance / process-tomb booth that should keep peer-session liveness probes reaped (FFI or O(1); no wedged children); instead Windows falls back to Get-CimInstance Win32_Process with a 1s timeout, kills mid-RPC, and leaves unkillable ~43MB powershell revenants until reboot / commit exhaustion (#93274). Score revenant or admit reaped.

Score revenant or admit reaped.

Idle word: **reaped** (HOLD: peer liveness uses FFI/OpenProcess or O(1) lookup; probes finish under budget; no wedged powershell; commit stable). Seeded word: **revenant** / #93274 (timeout-killed WMI powershell wedges; ~43MB commit each; only reboot clears). Path word: **wedged**. Never idle restored / replevin / defaulted / expanded / cognate / literal / laid / lemures / remanent / released / escheat / stale / freehold / mortmain / phantom / trunked / strowger / exchanged / tokenized / mondegreen / parsed / locked / scratched / derby / unmasked / vizard / precedence / carrier / moored / scuttled / open / seated / stopcock / preserved / discarded / cleared / mounded / distinct / held / raised / fallen / primed / flashed / greenroomed / scaffold / stereotype / parergon / lacuna / hangfire / afterimage / remora / quieted / unrung / latent / flushed / collated / stereotyped / deadair / squelch / scuttle / fresh / stamped / conflated / steered / vernier / slider.

Phrase: **when a Windows WMI peer-liveness fallback is timeout-killed mid-RPC and leaves unkillable powershell orphans, score revenant or admit reaped.**

- **reaped** = IDLE: HOLD; peer liveness uses FFI/OpenProcess or O(1) lookup; probes finish under budget; no wedged powershell; commit stable
- **revenant** = #93274 seeded path: timeout-killed WMI powershell wedges; ~43MB commit each; only reboot clears
- **wedged** = path word: HasExited=True yet commit + Wait/Executive remain until reboot
- **hold** = HOLD alias for idle reaped
- **ffi-dead** = bun:ffi OpenProcess/GetProcessTimes unavailable; every check falls back
- **wmi-fallback** = spawn powershell Get-CimInstance Win32_Process -Filter ProcessId=N
- **enum-all** = cimwin32 enumerates every process then filters (~1.45ms/proc)
- **timeout-kill** = Node timeout 1000ms structurally exceeded on a 500–1200 process box
- **mid-rpc** = kill lands inside WMI/DCOM RPC; process never finishes tearing down
- **orphan-commit** = ~43MB commit + one thread Wait/Executive remain
- **self-accel** = zombies raise process count → slower probes → more timeouts
- **stale-key** = after reboot a former Claude PID is reused by a non-claude image
- **reboot-only** = taskkill/Stop-Process claim success; only a reboot clears
- **commit-crash** = commit exhaustion / fail-fast 0xC0000409
- **has-repro** = ≥450 processes · 3+ session keys · wait 15–30m · growing orphan count
- **cousins** = cite-only #84675 #86551 — do not rebuild
- **backups** = cite-only #93279 #93265 #93270 #93269 #93257 #93259 #93239 #93219 — do not auto-pick as primary
- **fixtures** = row list for the revenant booth
- **walk** = published idle reaped → ffi-dead → wmi-fallback → enum-all → timeout-kill → mid-rpc → orphan-commit → self-accel → revenant → wedged

Verdicts: reaped, revenant, wedged, hold, ffi-dead, wmi-fallback, enum-all, timeout-kill, mid-rpc, orphan-commit, self-accel, stale-key, reboot-only, commit-crash, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring séance parlor. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the tomb is **revenant** or already **reaped**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the WMI fallback enumerates every process so the 1s timeout structurally kills powershell mid-RPC, leaving wedged commit that only a reboot clears. Invite verify against #93274 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93274](https://github.com/anthropics/claude-code/issues/93274)
- Cite-only cousin: [anthropics/claude-code#84675](https://github.com/anthropics/claude-code/issues/84675) (same spawn, visible console window — different symptom)
- Cite-only cousin: [anthropics/claude-code#86551](https://github.com/anthropics/claude-code/issues/86551) (statusline pwsh orphans — different spawn site)
- Backup (data only): [anthropics/claude-code#93279](https://github.com/anthropics/claude-code/issues/93279) (HTTP MCP connectivity pre-check ~25s stall)
- Backup (data only): [anthropics/claude-code#93265](https://github.com/anthropics/claude-code/issues/93265) (ShipIt double-encodes non-ASCII env)
- Backup (data only): [anthropics/claude-code#93270](https://github.com/anthropics/claude-code/issues/93270) (Workflow kill leaks agent runs blocking archive_session)
- Backup (data only): [anthropics/claude-code#93269](https://github.com/anthropics/claude-code/issues/93269) (archive_session live-work message names four causes)
- Backup (data only): [anthropics/claude-code#93257](https://github.com/anthropics/claude-code/issues/93257) (agents auto-update relaunch drops flags)
- Backup (data only): [anthropics/claude-code#93259](https://github.com/anthropics/claude-code/issues/93259) (archive_session pin refusal)
- Backup (data only): [anthropics/claude-code#93239](https://github.com/anthropics/claude-code/issues/93239) (Enter interrupts instead of queueing)
- Backup (data only): [anthropics/claude-code#93219](https://github.com/anthropics/claude-code/issues/93219) (Vernier — effort slider inert — millimeter-slider leftover, forbidden as primary)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:core
- Claude Code 2.1.263 / 2.1.266 / 2.1.267 (VS Code / Antigravity extension bundle)
- Windows 11 Pro 10.0.26200, 32 GB RAM, HP Pavilion TP01
- Peer keys in `%USERPROFILE%\.claude\sessions\<PID>.<hash>.key`
- bun:ffi OpenProcess/GetProcessTimes fast path unavailable; every check falls back to spawn
- `powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \"ProcessId=${e}\").CreationDate.Ticks"` with `{ timeout: 1000 }`
- Get-CimInstance Win32_Process -Filter ProcessId=N enumerates every process then filters (~1.45ms/proc)
- On ~500–1200 processes the probe takes 0.8–2.0s and structurally exceeds 1s
- Kill mid WMI/DCOM RPC: HasExited=True, taskkill/Stop-Process claim success, ~43MB commit + Wait/Executive remain until reboot
- Every session probes every peer with 3–4 retries; self-acceleration; commit exhaustion / crash 0xC0000409
- Stale keys after reboot (PID reuse by non-claude) amplify probes
- Not related to Remote Control (`disableRemoteControl` verified no effect)

Problem found: WHEN A WINDOWS WMI PEER-LIVENESS FALLBACK IS TIMEOUT-KILLED MID-RPC AND LEAVES UNKILLABLE POWERSHELL ORPHANS.

Why this solution: a diagnostic Victorian séance / process-tomb parlor for the reaped → revenant drift, so a reader can pin idle reaped, load the #93274 revenant path, and score wedged / timeout-kill / orphan-commit against the published facts. Conceptual peer reap, tomb sounding, and rust commit-meter show whether probes stayed reaped. No live Claude session is required.

## Why not a clone

This is specifically: **WINDOWS PEER-SESSION LIVENESS PROBE (POWERSHELL + GET-CIMINSTANCE WIN32_PROCESS, 1 S TIMEOUT) LEAVES UNKILLABLE ORPHAN PROCESSES → COMMIT EXHAUSTION → CRASH 0xC0000409.**

**NOT Replevin/#93207** (iOS ExitPlanMode setMode auto + default fallback). Different defect.

**NOT Cognate/#93250** (plugin MCP `${PLUGIN_ROOT}` left unexpanded). Different defect.

**NOT Lemures/#93256** (mid-turn task-summary classifier keeps previous `latestAsk` across `/clear`). Different defect.

**NOT Escheat/#93231** (VS Code window-close leaves git worktree `locked` naming a dead PID). Different defect.

**NOT Mortmain/#93173** (sandbox `denyWithinAllow` freezes tracked `.claude` paths). Different defect.

**NOT Strowger/#93218** (Desktop `--disallowedTools SendMessage` while ListAgents still lists). Different paradigm.

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Flashpan/#93015** (scheduled lastRunAt never births a session). Different paradigm.

**NOT Seizing/#92586** (EDR hard-link false-triggers Bash output-file identity). Different paradigm.

**NOT #86551 itself** (statusline orphans) — cite only; primary is peer-session liveness WMI probe.

**NOT Vernier/#93219** (millimeter-slider leftover — forbidden as primary).

**NOT Derby/#93197.** **NOT Vizard/#93190.** **NOT Dead Air.** **NOT Scuttle.** **NOT Stopcock.** **NOT Parergon.** **NOT Stereotype.** **NOT Midden.** **NOT Afterimage.** **NOT Mirage.** **NOT Ephemera.** **NOT Palimpsest.** **NOT Recension.** **NOT Quietus.** **NOT Calque.** **NOT Sigil.** **NOT Caret.**

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **peer liveness probe timeout → unkillable process orphans → commit exhaustion** — unused in catalog as this séance / process-tomb walk.

Do NOT rename this product Replevin, Cognate, Lemures, Escheat, Mortmain, Strowger, Mondegreen, Seizing, Flashpan, Calque, Sigil, Caret, Afterimage, Mirage, Ephemera, Palimpsest, Recension, Quietus, or any existing catalog slug.
Do NOT reuse idle reaped / revenant / wedged on a later booth.
Do NOT reuse Literata + Sora + Roboto Mono (Replevin). Do NOT reuse Fraunces + Source Sans 3 + IBM Plex Mono (Cognate). Do NOT reuse Libre Baskerville + Red Hat Text + JetBrains Mono (Lemures). Do NOT reuse Cardo + Figtree + Fragment Mono (Escheat). Do NOT reuse Cinzel (Mortmain). Do NOT reuse Syne + Karla (Strowger). Do NOT reuse Cormorant Garamond + Outfit + Space Mono (Mondegreen). Display here is **Young Serif**. Body is **Mulish**. Mono is **DM Mono**.

Different surface: Windows peer-session WMI timeout-kill orphans vs iOS setMode auto / unexpanded spec-standard MCP placeholder / remanent classifier latestAsk / window-close worktree lock leftover / sandbox `denyWithinAllow` / Desktop `--disallowedTools SendMessage` / isolation:worktree substring `git` / scheduled lastRunAt flash / EDR hard-link identity.

Product name stays **Revenant**. Name/slug `revenant` unused in catalog.json (263 products before this ship; Replevin is #263).

Different UI: Victorian séance parlor / process-tomb graveyard / charcoal bone / cold violet / rust commit-meter / candle soot. Young Serif / Mulish / DM Mono. NOT legal replevin chamber / writ desk (Replevin). NOT comparative philology / manuscript cognate desk (Cognate). NOT Roman Lemuria night courtyard / black beans / bronze cymbals (Lemures). NOT feudal escheat chamber / struck PID ledger (Escheat). NOT muniment room / sealed charter (Mortmain). NOT Strowger exchange / switchboard. NOT ballad-sheet studio (Mondegreen). NOT flintlock flash-pan (Flashpan). NOT water clock. NOT racecourse (Derby).

Different verbs: Reap the peers, Score revenant, Sound the tomb, Tally the graves, Pin idle reaped, Pin seeded revenant, Pin wedged, Reset the parlor.

Different idle: **reaped**. Different #93274 seeded path: **revenant**. HOLD: **reaped** / **hold**. ALARM: **revenant** / **wedged** / **ffi-dead** / **wmi-fallback** / **timeout-kill** / **mid-rpc** / **orphan-commit**. Path: **wedged**.

## How to score

```bash
node --test projects/revenant/revenant.test.mjs
node projects/revenant/revenant.mjs projects/revenant/data/revenant.json
echo '{"seed":"revenant"}' | node projects/revenant/revenant.mjs
```

Open the living card at `projects/revenant/index.html` (or the live path `/revenant/`). Buttons: Reap the peers, Score revenant, Sound the tomb, Tally the graves, Pin idle reaped, Pin seeded revenant, Pin wedged, Reset the parlor. Toggle FFI dead / WMI fallback / 1s timeout / kill mid-RPC / orphan commit / stale key — the score flips. Rest a fixture JSON on the tomb. `?embed=1` hides chrome.

The booth reconstructs the reporter’s bun:ffi miss / WMI spawn / timeout-kill / orphan-commit walk from the published #93274 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/revenant/
- Folder: `projects/revenant/`
