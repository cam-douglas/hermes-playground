# Slipway

A **slipway / pier / undock / NIC-handoff / mid-stream-cut booth** — *Slipway* is the inclined dock where a hull slides from land into the fairway. When you undock (Ethernet NIC goes away), the stream should re-seize the new Wi-Fi fairway — not abandon the turn. Windows Ethernet→Wi-Fi undock kills the in-flight streaming turn with `API Error: Connection lost mid-response` and **no retry**. No `Retrying (n/10)`, no `system`/`api_error` JSONL record. Background sessions (`sessionKind: "bg"`) silently idle for hours. Fonts **Spectral** (display) + **Manrope** (UI) + **Source Code Pro** (chips). Palette: harbor navy `#06141F`, rusted iron `#A34428`, sodium amber `#EFA31A`, fog grey `#B7C2CC`, wet pier green `#1E5346`, plank `#0C1C22`. Fresh trio. Completely different UI/UX/metaphor — keel cradle / sodium lamp / eth dock / wifi fairway / undock cut / bg-idle hull / dry-dock night. NOT a river floodplain gauge. NOT a pottery repair bench. NOT a marble memorial yard. NOT a geology core-sample desk. NOT a manuscript parchment desk. NOT a cavalry lantern. NOT a Prague clock tower. NOT a hemp process bench.

The cradle should stay **moored** (HOLD: turn survives iface swap via retry). Instead the booth was **slipped** after an **iface-swap**.

Primary:

- [anthropics/claude-code#94458](https://github.com/anthropics/claude-code/issues/94458) (OPEN). Title: `[BUG] Windows: undock (Ethernet->Wi-Fi interface swap) ends the in-flight turn with no retry, silently killing background sessions`. Labels: bug, has repro, platform:windows, area:core, area:networking, area:agent-view. Environment: Claude Code 2.1.272 (also 2.1.270, 2.1.251, 2.1.233); Windows 11 Pro 10.0.26200 x64; Node v24.20.0; claude-opus-5; Realtek USB 2.5GbE dock → Intel Wi-Fi 7 BE211. Undock kills the in-flight stream. Path healthy in ~2s. Every other app rides through. Six occurrences, all `sessionKind: bg`, same-second with NetworkProfile id=10001 Disconnected. Stay off Freshet/Kintsugi/Cenotaph/Stratum/Tmesis/Vedette/Orloj/hawser/bollard/gangway paradigms.

00:50 slipway: a slipway / pier / undock / NIC-handoff booth for #94458. Windows Ethernet→Wi-Fi undock ends mid-stream turn with no retry; background sessions silently idle. Idle **moored** / seeded **slipped** / path **iface-swap**. Score slipway or admit moored.

Score slipway or admit moored.

Idle word: **moored** (HOLD: turn survives iface swap via retry). HOLD aliases: lashed, warped, fendered. Seeded word: **slipped** / #94458 (the iface-swap path). Path word: **iface-swap**. Product score: **slipway**. Never idle buoyed / mended / homed / shared / contiguous / stationed / lasting / enrolled / cleared or seeded Freshet / Kintsugi / Cenotaph / Stratum / Tmesis / Vedette / Orloj or path names from those booths.

Phrase: **Score slipway or admit moored.**

- **moored** = IDLE HOLD: turn survives iface swap via retry
- **slipped** = seeded path: undock ends turn, no retry, bg idle
- **iface-swap** = path word: Ethernet→Wi-Fi NIC handoff treated as terminal
- **lashed** = HOLD alias: lines still hold the hull
- **warped** = HOLD alias: hull still warped along the pier
- **fendered** = HOLD alias: fenders still between hull and dock
- **nic-handoff** = USB-dock Ethernet goes away; Wi-Fi takes over
- **mid-stream-cut** = Connection lost mid-response treated as a terminal turn
- **no-retry** = no Retrying (n/10); no system/api_error JSONL
- **bg-idle** = sessionKind bg silently idle; nobody to press enter
- **ethernet-drop** = Realtek USB 2.5GbE vanishes; interface index changes
- **wifi-reseize** = Intel Wi-Fi 7 BE211 Up in ~2s; every other app rides through
- **connection-lost** = assistant synthetic error then turn_duration
- **turn-abandoned** = recovery never came from a retry
- **94458** = issue number seed
- **landing** = slipway / pier / undock / NIC-handoff
- **has-repro** = published shape: CLI 2.1.272 · Windows 11 · ETH→Wi-Fi · sessionKind bg
- **cousins** = cite-only #87987 #89552 — do not rebuild; do not conflate
- **backups** = cite-only #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = keel cradle / sodium lamp / eth dock
- **walk** = published idle moored → iface-swap → slipped
- **closed** = #94458 remains OPEN — cite only; not this booth

Verdicts: moored, slipped, iface-swap, lashed, warped, fendered, nic-handoff, mid-stream-cut, no-retry, bg-idle, ethernet-drop, wifi-reseize, connection-lost, turn-abandoned, 94458, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **slipway** or already **moored**. Fixtures use the issue's published incident only. Request reconstructions from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): a mid-stream socket loss should be retried like any other transient network error — re-resolve, open a fresh TCP connection on the current default route, and resume the turn. At minimum a background session whose turn was terminated by a network error should not silently go idle. Invite verify against #94458 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94458](https://github.com/anthropics/claude-code/issues/94458)
- Cousins: do NOT rebuild / do NOT conflate: #87987 (subagent stream no-retry but parent logged api_error), #89552 (macOS Wi-Fi drop sticky ECONNRESET).
- Backups (data only; next focus only — do not auto-pick): #93924, #93770, #93777, #94151

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:windows, area:core, area:networking, area:agent-view
- Environment: Claude Code 2.1.272 (also 2.1.270, 2.1.251, 2.1.233); Windows 11 Pro 10.0.26200; Node v24.20.0; claude-opus-5
- Wired NIC: Realtek USB 2.5GbE (dock). Wireless: Intel Wi-Fi 7 BE211. Interface index changes across dock cycles
- Undock kills the in-flight stream with `API Error: Connection lost mid-response`
- No `Retrying (n/10)`; no `system`/`api_error` JSONL record — unlike #87987 where the parent loop logged and recovered
- Path healthy within ~2 seconds (`id=10000 Connected`); every other program rides through
- Six occurrences, all `sessionKind: "bg"`; five same-second with NetworkProfile id=10001 Disconnected
- One background session dead 16 hours; another queued task-notifications 25 minutes later still produced no turn
- Recovery never came from a retry — only from a later queued turn or a human typing

Problem found: IFACE-SWAP — Windows Ethernet→Wi-Fi undock ends the mid-stream turn as a terminal outcome; background sessions silently idle.

Why Slipway: A *slipway* is the inclined dock that launches a hull into the fairway. Undocking is sliding off the pier. The new Wi-Fi path is the fairway that should be re-seized. Instead the winch lets go and the unmanned background hull sits in the drink. #87987 is a subagent stream whose parent *did* log `api_error` — DIFFERENT. #89552 is a macOS Wi-Fi drop that poisons the client until reboot — DIFFERENT. #94430 is a desktop initialize flood — DIFFERENT. This booth is specifically **Windows Ethernet→Wi-Fi undock / missing mid-stream retry / silent bg death**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores iface-swap honesty (moored vs slipped) so operators can see the six-row evidence table and the unmanned cradle without needing a Claude session. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A mid-stream socket loss should be retried like any other transient network error
2. The client should re-resolve, open a fresh TCP connection on the current default route, and resume the turn
3. A background session whose turn was terminated by a network error should not silently go idle; retry or surface a task notification

## Why not a clone

This is specifically: **WINDOWS UNDOCK (ETHERNET→WI-FI NIC SWAP) ENDS THE IN-FLIGHT TURN WITH NO RETRY. NO RETRYING (N/10). NO SYSTEM/API_ERROR JSONL. BACKGROUND SESSIONS SILENTLY IDLE. PATH BACK IN ~2S. CLI 2.1.272; WINDOWS 11; SESSIONKIND BG.**

Novel paradigm: slipway / pier / undock / NIC-handoff / keel cradle / sodium lamp / eth dock / wifi fairway / undock cut / bg-idle hull — harbor navy, rusted iron, sodium amber, wet pier green. New issue, new paradigm (iface-swap), new UI/UX/fonts/colors, new scoring vocabulary. A dry-dock night booth, not a river floodplain gauge, pottery bench, memorial yard, geology core, manuscript desk, cavalry lantern, Prague clock, or hemp process bench.

**NOT #87987** (subagent stream no-retry but parent logged api_error). DIFFERENT. Do not conflate.

**NOT #89552** (macOS Wi-Fi drop sticky ECONNRESET). DIFFERENT. Do not rebuild.

**NOT #94430** (desktop Remote Control initialize flood). DIFFERENT. Do not rebuild.

**NOT Freshet/#94430** (initialize flood / No messages yet). Different defect. Do not reuse buoyed / Freshet / init-flood.

**NOT Kintsugi/#94451** (marketplace rewrite never lands). Different defect. Do not reuse mended / Kintsugi / heal-abort.

**NOT Cenotaph/#94452** (dead-install / plaque polished, stone never moved). Different defect. Do not reuse homed / Cenotaph / dead-install.

**NOT Stratum/#94417** (layer-unsealed project-context). Different defect.

**NOT Tmesis/#86198** (mid-inject slash splice). Different defect.

**NOT Vedette/#94392** (headless `-p` idle-exit / false success). Different defect.

**NOT Orloj/#94393** (Monitor schema cap / half-life). Different defect.

**NOT hawser / bollard / gangway** (hemp process benches). Different metaphor. Do not reuse those yards.

Live: https://hermes-playground-green.vercel.app/slipway/

```
node --test projects/slipway/slipway.test.mjs
node projects/slipway/slipway.mjs projects/slipway/data/slipped.json
```
