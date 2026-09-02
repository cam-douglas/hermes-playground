# Buoy

A **harbor layer sounding board** — layer 0 (normal document) vs layer 3 (floating) stack, dock→restore timeline of `cu-side-panel` pairs, stealth-relaunch `wasAlwaysOnTop` latch gauge; deep navy / foam white / buoy orange / graphite — Petrona + Sora + Fira Code — for a real Claude Code defect: **MACOS MAIN WINDOW LEFT AT FLOATING LEVEL (LAYER=3) AFTER COMPUTER USE SIDE PANEL RESTORES; AREA:DESKTOP; PLATFORM:MACOS.**

Primary:

- [anthropics/claude-code#91569](https://github.com/anthropics/claude-code/issues/91569) (OPEN, bug, has-repro, platform:macos, area:desktop, filed 2026-09-02T18:18:25Z, updated 2026-09-02T18:19:36Z). Title: macOS main window left at Floating level (layer=3) after Computer Use side panel restores. Reporter junqiu-lei. Measured on Desktop app 1.40609.1 (bundled CLI 2.1.255); macOS Darwin 25.5.0; Claude Desktop app.

a buoy that never settles back to the waterline is not a mooring — it is a float stuck aloft. Score the layer or admit the latch already captured.

Idle word: **moored**. Seeded state: **aloft** / #91569 — after Computer Use, main window stays at `kCGWindowLayer=3` (`NSFloatingWindowLevel`); normal is layer=0. Measured via `CGWindowListCopyWindowInfo` while idle (no CU session): `num=26927 layer=3 alpha=1 name= bounds={Height=869; Width=1512; X=49; Y=38;}`. Full-size main window, not the side panel. No user setting / no always-on-top key in prefs. Logs show stealth-relaunch (12:15:36, update 1.40609.0 → 1.40609.1) then four balanced `cu-side-panel` docked/restored pairs; window still floating next day (2026-09-02). Workaround: full quit (Cmd+Q) clears it. Never idle as resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

A **buoy** should return to `kCGWindowLayer=0` after Computer Use releases the desktop-control lock. The `cu-side-panel` restore path instead re-applies a captured `wasAlwaysOnTop` latch.

- **aloft** = #91569: layer=3 floating sticky; `wasAlwaysOnTop` latch true
- **floating** = `kCGWindowLayer=3` is `NSFloatingWindowLevel`; normal document window is layer=0
- **latch-captured** = `wasAlwaysOnTop` captured true at dock; every restore re-applies `setAlwaysOnTop(true, 'floating')`
- **stealth-relaunch** = 2026-09-01 12:15:36 `setAlwaysOnTop(true, 'normal', -1)` until `once('focus')`; update 1.40609.0 → 1.40609.1
- **cu-side-panel** = dock saves `wasAlwaysOnTop` then `setAlwaysOnTop(true, 'floating')`; restore writes the captured value back
- **docked-restored** = four balanced `cu-side-panel` docked/restored pairs on 2026-09-01; window still floating next day
- **layer-3-sticky** = measured idle no CU session: `num=26927 layer=3`; full-size main window not side panel; still floating 2026-09-02
- **no-always-on-top-pref** = no user setting / no always-on-top key in prefs
- **full-quit-clears** = workaround: full quit (Cmd+Q) clears the floating level; merely closing the window does not
- **hold** = layer=0; `wasAlwaysOnTop` latch clear; the waterline holds
- **moored** = HOLD: `kCGWindowLayer=0`; normal document z-order

Verdicts: moored, aloft, floating, latch-captured, stealth-relaunch, cu-side-panel, docked-restored, layer-3-sticky, no-always-on-top-pref, full-quit-clears, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the main window layer is moored or aloft.

Hypothesis only (NON-BINDING): stealth-relaunch `setAlwaysOnTop(true)` until focus; if CU docks before clear, `wasAlwaysOnTop` captured true and every restore re-applies `setAlwaysOnTop(true, 'floating')`; discard if issue evidence disagrees. Encoded from the issue's filed timeline (stealth-relaunch 12:15:36; four pairs; measured 2026-09-02). Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **MACOS MAIN WINDOW LEFT AT FLOATING LEVEL (LAYER=3) AFTER COMPUTER USE SIDE PANEL RESTORES; AREA:DESKTOP; PLATFORM:MACOS.**

NOT Solecism ([#91558](https://github.com/anthropics/claude-code/issues/91558)) — worktree provisioning writes the git exclude to a literal `--git-common-dir/` directory.
NOT Coffer ([#91571](https://github.com/anthropics/claude-code/issues/91571)) — Windows OAuth file-store refresh rotation never persisted; failed refresh blanks tokens.
NOT Codicil ([#91513](https://github.com/anthropics/claude-code/issues/91513)) — shared multi-agent worktree; `git commit --amend` does not re-check HEAD; silently rewrites a concurrent teammate's commit message.
NOT Crimp ([#91520](https://github.com/anthropics/claude-code/issues/91520)) — settings.json unlocked RMW; concurrent sessions tear the file and drop keys.
NOT Jackfield ([#91511](https://github.com/anthropics/claude-code/issues/91511)) — desktop cross-machine session mix-up; Windows input executes on unrelated macOS session.
NOT Tocsin ([#91503](https://github.com/anthropics/claude-code/issues/91503)) — idle-wake / background Bash; subagent completion queued with no idle-wake consumer.
NOT Solecism / Coffer / Codicil / Crimp / Jackfield / Tocsin / Bolter / Deadeye / Reglet paradigms.
NOT leftover usage-desk / vault-coffer / probate will-chamber / crimp pliers/foil / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging / reglet letterpress.

Cousins are cite-only on a cousin strip; primary stays #91569.

- [#89467](https://github.com/anthropics/claude-code/issues/89467) — OPEN — Windows counterpart (`WS_EX_TOPMOST` left set) — cite-only.
- [#66516](https://github.com/anthropics/claude-code/issues/66516) — CLOSED as invalid — same macOS floating-window symptom — cite-only.
- [#91230](https://github.com/anthropics/claude-code/issues/91230) — OPEN — macOS Computer Use moving/maximizing the window; same subsystem — cite-only.

Backups (do not ship unless primary blocked): **Caret** / #91526. **Hawser** / #91578. **Frisket** / #91574.

Product name stays **Buoy**. Do not rename to Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet.

Different UI: harbor layer sounding board + layer 0 vs layer 3 stack + dock→restore timeline + `wasAlwaysOnTop` latch gauge / deep navy / foam white / buoy orange / graphite. Petrona + Sora + Fira Code. NOT Source Serif 4/Work Sans/Inconsolata (Solecism). NOT Spectral/Karla/IBM Plex Mono (Coffer). NOT Cormorant/Figtree/Azeret (Codicil). NOT Newsreader/Manrope/JetBrains (Crimp). NOT Brygada/Atkinson/DM Mono (Jackfield). NOT Fraunces/Source Sans 3 (Tocsin). Stay OFF usage-desk / vault-coffer / probate parchment / crimp pliers/foil / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging / reglet letterpress.

Different verbs: Score the layer, pin idle moored, pin seeded aloft, admit the latch already captured, load fixtures, reset to moored. Score the layer is this board's phrase.

Different idle: **moored**.

## Live catalog path

`/buoy/` is this static harbor layer sounding board. Path `https://hermes-playground-green.vercel.app/buoy/` and subdomain `https://buoy.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `06:50 / hermes catalog #129 / #91569`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **moored** — `kCGWindowLayer=0`; normal document z-order; `wasAlwaysOnTop` latch clear.
2. Seed **aloft** → #91569: layer=3 `NSFloatingWindowLevel`; latch captured; stealth-relaunch then four balanced dock/restore pairs; still floating next day; full quit clears it.
3. Atelier UI: layer stack / dock→restore timeline / latch gauge. Moored = waterline hold. Aloft = latch already captured.
4. Cousin cite strip labeled cousin-not-primary: [#89467](https://github.com/anthropics/claude-code/issues/89467), [#66516](https://github.com/anthropics/claude-code/issues/66516), [#91230](https://github.com/anthropics/claude-code/issues/91230). Cite only. Primary stays #91569.
5. **Score the layer** walks the probe ticket and lights chips on the board. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/buoy/index.html` in a browser, or serve the repo root and visit `/buoy/` (Vercel rewrite → `/projects/buoy`). No build step. Optional hook:

```bash
node projects/buoy/hook/buoy.mjs projects/buoy/data/91569.json
node --test projects/buoy/hook/buoy.test.mjs
```

Empty stdin scores the idle **moored** ticket. Paste a probe on the page or drop a fixture from `data/`.
