# Hawser

A **dockyard hawser / process-reap bench** — process-tree step ladder from 1→1182, RSS sounding well climbing to 32.9 GB, WarmLifecycle disconnect that fails to slip the line, MCP-child rope coils that never get reaped; hemp / tar / iron / fog / signal amber — Fraunces + Outfit + IBM Plex Mono — for a real Claude Code defect: **WINDOWS DESKTOP APP IDLE WARM SESSIONS NEVER RELEASE MCP CHILD PROCESSES (1 TO 1,182 CHILDREN / 33 GB RSS IN ONE DAY, ENDS IN GPU PROCESS CRASH); AREA:MCP; AREA:DESKTOP; PLATFORM:WINDOWS.**

Primary:

- [anthropics/claude-code#91578](https://github.com/anthropics/claude-code/issues/91578) (OPEN, bug, has-repro, platform:windows, area:mcp, area:desktop, filed 2026-09-02T19:08:38Z, updated 2026-09-02T19:18:33Z). Title: Windows desktop app: idle warm sessions never release MCP child processes (1 to 1,182 children / 33 GB RSS in one day, ends in GPU process crash). Reporter megzieberr. Claude Desktop for Windows 1.40609.1 (Microsoft Store / MSIX). Bundled Claude Code 2.1.255. Windows 11 Pro, build 10.0.26200, x64, 28 GB RAM. ~10 MCP servers / toolCount=92.

a hawser that never slips after idle is not a release — it is a fouled pile. Score the reap or admit the warm children already fouled.

Idle word: **slipped**. Seeded state: **fouled** / #91578 — every warmed local session spawns `claude.exe` plus a full copy of configured MCP servers. When WarmLifecycle logs `Idle timeout reached, disconnecting ...`, child processes are NEVER reaped. Process tree grows monotonically (~+100 children/hour) until the GPU process dies and the app exits. Telemetry from one day (2026-09-02, started 08:49, died 20:30): 08:49 → 1 child / 38 MB; 20:30 → **1182 children / 32.9 GB RSS**. Idle disconnects fire but child count never decreases. After a clean restart, warming ~5 restored sessions produced 50 children (~2 GB) within 90 seconds (~10 processes per warm). Never idle as verbatim / mangled / moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

A **hawser** should slip the bitts when an idle warm session disconnects. The Windows desktop WarmLifecycle path logs the disconnect and leaves the children piled.

- **fouled** = #91578: WarmLifecycle `Idle timeout reached, disconnecting` but children never reaped; 1 → 1182 / 32.9 GB RSS
- **unreaped** = idle disconnect fired; child count never decreased
- **idle-timeout** = WarmLifecycle starts a 900s idle timeout then disconnects; the line never slips
- **warmlifecycle** = `WarmLifecycle:session` logs disconnect but the process tree never slips
- **process-tree** = 1 → 1182 children across 08:49–20:30; tree grows monotonically
- **rss-climb** = children RSS 38 MB → 32.9 GB; system free 17.7 GB → 4.5 GB
- **gpu-crash** = GPU process gone, reason crashed, exitCode 101457950; last log line of the run
- **monotonic** = child count never decreases after idle disconnects; still 1182 immediately after
- **per-session-cost** = ~5 restored sessions → 50 children / ~2 GB / ~10 processes per warm
- **hold** = idle disconnect reaped the hawser; children returned to 1; the bitts hold
- **slipped** = HOLD: idle disconnect reaped the hawser; children returned to 1 / 38 MB

Verdicts: slipped, fouled, unreaped, idle-timeout, warmlifecycle, process-tree, rss-climb, gpu-crash, monotonic, per-session-cost, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the hawser slipped or the warm children already fouled.

Hypothesis only (NON-BINDING): WarmLifecycle disconnects the session IPC but does not terminate the per-session `claude.exe` + MCP child tree on Windows (no Job Object / no cascading kill). Each subsequent warm adds another unreaped copy. Discard if issue evidence disagrees. Encoded from the issue's telemetry table and WarmLifecycle log lines. Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **WINDOWS DESKTOP APP IDLE WARM SESSIONS NEVER RELEASE MCP CHILD PROCESSES (1 TO 1,182 CHILDREN / 33 GB RSS IN ONE DAY, ENDS IN GPU PROCESS CRASH); AREA:MCP; AREA:DESKTOP; PLATFORM:WINDOWS.**

NOT Caret ([#91526](https://github.com/anthropics/claude-code/issues/91526)) — Windows stdio MCP password arguments corrupted when Claude Code launches npx through cmd.exe.
NOT Buoy ([#91569](https://github.com/anthropics/claude-code/issues/91569)) — macOS main window left at Floating level (layer=3) after Computer Use side panel restores.
NOT Solecism ([#91558](https://github.com/anthropics/claude-code/issues/91558)) — worktree provisioning writes the git exclude to a literal `--git-common-dir/` directory.
NOT Coffer ([#91571](https://github.com/anthropics/claude-code/issues/91571)) — Windows OAuth file-store refresh rotation never persisted; failed refresh blanks tokens.
NOT Codicil ([#91513](https://github.com/anthropics/claude-code/issues/91513)) — shared multi-agent worktree; `git commit --amend` does not re-check HEAD.
NOT Crimp ([#91520](https://github.com/anthropics/claude-code/issues/91520)) — settings.json unlocked RMW; concurrent sessions tear the file.
NOT Jackfield ([#91511](https://github.com/anthropics/claude-code/issues/91511)) — desktop cross-machine session mix-up.
NOT Tocsin ([#91503](https://github.com/anthropics/claude-code/issues/91503)) — idle-wake / background Bash; subagent completion queued with no idle-wake consumer.
NOT Caret / Buoy / Solecism / Coffer / Codicil / Crimp / Jackfield / Tocsin / Bolter / Deadeye / Reglet paradigms.
NOT leftover proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging / reglet letterpress.

Cousins are cite-only on a cousin strip; primary stays #91578.

- [#77593](https://github.com/anthropics/claude-code/issues/77593) — OPEN — Windows background Bash tool processes orphaned across sessions (no cascading process-tree kill; suggested Job Object). Cited in the primary as possibly related in symptom, different mechanism. Cite-only.

Backups (do not ship unless primary blocked): **Frisket** / #91574.

Product name stays **Hawser**. Do not rename to Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet.

Different UI: dockyard hawser / process-reap bench + process-tree step ladder + RSS sounding well + WarmLifecycle plaque + MCP-child rope coils / hemp / tar / iron / fog / signal amber. Fraunces + Outfit + IBM Plex Mono. NOT Playfair/DM Sans/Fragment Mono (Caret). NOT Petrona/Sora/Fira (Buoy). NOT Source Serif 4/Work Sans/Inconsolata (Solecism). NOT Spectral/Karla (Coffer pairing). NOT Cormorant/Figtree/Azeret (Codicil). NOT Newsreader/Manrope/JetBrains (Crimp). NOT Brygada/Atkinson/DM Mono (Jackfield). Stay OFF proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging / reglet letterpress.

Different verbs: Score the reap, pin idle slipped, pin seeded fouled, admit the warm children already fouled, load fixtures, reset to slipped. Score the reap is this desk's phrase.

Different idle: **slipped**.

## Live catalog path

`/hawser/` is this static dockyard bench. Path `https://hermes-playground-green.vercel.app/hawser/` and subdomain `https://hawser.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `08:50 / hermes catalog #131 / #91578`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **slipped** — idle disconnect reaped the hawser; children returned to 1 / 38 MB.
2. Seed **fouled** → #91578: WarmLifecycle disconnect logged; children never reaped; 1 → 1182 / 32.9 GB RSS; GPU process gone exitCode 101457950.
3. Atelier UI: bitts + hawser coil / process-tree step ladder / RSS sounding well / MCP-child rope coils. Slipped = clean mooring release. Fouled = pile of unreaped children.
4. Cousin cite strip labeled cousin-not-primary: [#77593](https://github.com/anthropics/claude-code/issues/77593). Cite only. Primary stays #91578.
5. **Score the reap** walks the probe ticket and lights chips on the bench. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/hawser/index.html` in a browser, or serve the repo root and visit `/hawser/` (Vercel rewrite → `/projects/hawser`). No build step. Optional hook:

```bash
node projects/hawser/hook/hawser.mjs projects/hawser/data/91578.json
node --test projects/hawser/hook/hawser.test.mjs
```

Empty stdin scores the idle **slipped** ticket. Paste a probe on the page or drop a fixture from `data/`.
