# Ferrule

A **metalwork / plumbing / cable-clamp sizing booth** — brushed steel, gunmetal, copper ferrule highlights, oil-black bench, cool cyan instrument LEDs; fonts **Oswald** (display) + **Source Sans 3** (body) + **Share Tech Mono** (mono) — for a real Claude Code defect: **DESKTOP MCP OAUTH CALLBACK LISTENER HARDCODES TCP 53280; EXCLUDED PORT RANGE → EACCES; CLI USES PORT 0.**

Primary:

- [anthropics/claude-code#92968](https://github.com/anthropics/claude-code/issues/92968) (OPEN, bug, platform:windows, area:auth, area:mcp, area:desktop). Title: `[BUG] Claude Desktop MCP OAuth callback listener uses a hardcoded port 53280`. Desktop 1.49585.0 (41ad1d); Windows. Authored 2026-09-09T01:51:55Z by elliotsegler.

13:50 ferrule: a metalwork ferrule clamp booth that should keep the OAuth callback **ephemeral** (OS port 0); instead Desktop ferrules the listener to TCP 53280 so Hyper-V excluded ranges refuse the bind with EACCES and consent never opens — score ferruled or admit ephemeral.

Score ferruled or admit ephemeral.

Idle word: **ephemeral** (HOLD: OS-assigned port 0 / CLI-parity listening). #92968 path: **ferruled**. Seeded recover: **rebound**. Never idle passable / admitted / deeded / parked / collated / confirmed / loosed / enrolled / as-penned / rove / vaulted / cleared / fused / bound / corked / detached / countersigned / staked / inscribed / emended / miraged / rehitched / regranted / misbound / fouled / voided / dry / bonded / shibbolethed / homesteaded / epitaphed / stereotyped / clung / escheated / banked / intact / rewritten / interlocked.

**Ferrule** = a fixed metal ring that clamps a hose or cable joint to ONE diameter. Desktop ferrules the OAuth callback to port 53280; when that diameter sits inside a Hyper-V excluded range the joint cannot seat (EACCES) and consent never opens. CLI leaves the joint ephemeral (port 0).

- **ephemeral** = IDLE: HOLD; OS-assigned port 0 / CLI-parity listening; consent can open
- **ferruled** = #92968 path: hardcoded 53280 refused by excluded range 53249–53348 → EACCES → no consent
- **rebound** = bind port 0; build redirect from assigned port; retry/fallback
- **hardcoded-53280** = Desktop connector uses a hardcoded TCP port, 53280
- **excluded-range** = 53249–53348 contains 53280 (winnat/hns reservation)
- **eacces-bind** = listen EACCES: permission denied 127.0.0.1:53280
- **no-consent** = setup stops; browser consent window never opens
- **no-fallback** = connector has no fallback port
- **no-retry** = connector does not retry
- **cli-port-0** = CLI on the same machine requests OS-assigned port 0
- **cli-parity** = Desktop must match CLI
- **winnat-hns** = Hyper-V / WSL2 / Docker Desktop / Virtual Machine Platform reserve via winnat and hns
- **dynamic-range** = Start 53000 Number 1000
- **workaround-range** = published workaround: start=54000 num=11536 then reboot
- **eacces-not-eaddrinuse** = no process listens on 53280; refuse is EACCES, not EADDRINUSE
- **redirect-from-assigned** = expected: build redirect URI from the assigned port
- **cousins** = cite-only #84795 CLOSED — do not clone
- **before-after** = before ferruled 53280; after expected ephemeral port 0
- **fixtures** = row list for the ferrule booth

Verdicts: ephemeral, ferruled, rebound, hardcoded-53280, excluded-range, eacces-bind, no-consent, no-fallback, no-retry, cli-port-0, cli-parity, winnat-hns, dynamic-range, workaround-range, eacces-not-eaddrinuse, redirect-from-assigned, cousins, before-after, fixtures.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No Desktop automation. No payloads. No network to Anthropic required for scoring. Score whether the callback is **ferruled** or already **ephemeral**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Desktop binds fixed 53280; winnat/hns exclusion covering 53280 yields EACCES; CLI port 0 avoids collision. Invite verify against #92968 text only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92968](https://github.com/anthropics/claude-code/issues/92968)
- Cite-only: [anthropics/claude-code#84795](https://github.com/anthropics/claude-code/issues/84795) (CLOSED, not planned / stale)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, platform:windows, area:auth, area:mcp, area:desktop
- Desktop 1.49585.0 (41ad1d); Windows
- Claude Desktop opens a local listener for the OAuth callback on hardcoded TCP port 53280
- No fallback port, no retry; if the OS refuses the bind, setup stops; browser consent window never opens
- On Windows, Hyper-V / WSL2 / Docker Desktop / Virtual Machine Platform use winnat and hns; these reserve blocks of the TCP dynamic port range
- If a reserved/excluded block contains 53280, bind fails with EACCES (`listen EACCES: permission denied 127.0.0.1:53280`)
- Reporter example: dynamic port range Start 53000 Number 1000; excluded range 53249–53348 contains 53280 (winnat/hns reservation; no `*`)
- `netstat` shows no process listening on 53280 — this is EACCES, not EADDRINUSE
- Claude Code CLI on the SAME machine does NOT have this problem — CLI requests OS-assigned port 0 (redirect e.g. `http://localhost:44350/callback`)
- Workaround used: change Windows dynamic port range (`start=54000 num=11536`) then reboot
- Closed prior report #84795 (same hardcoded A53280 / 53280 problem, closed not planned / stale) — cite only, do not clone
- Expected: Desktop must bind OS-assigned port 0, build redirect URI from assigned port, match CLI behavior; if a port does not bind, try a different port

Problem found: A METAL FERRULE THAT CLAMPS THE OAUTH CALLBACK TO ONE DIAMETER (53280). WHEN THAT DIAMETER SITS INSIDE A HYPER-V EXCLUDED RANGE THE JOINT CANNOT SEAT AND CONSENT NEVER OPENS.

Why this solution: a diagnostic metalwork clamp booth for the ephemeral → ferruled drift, so a reader can pin idle ephemeral, load the #92968 ferruled path, and score rebound / hardcoded-53280 / excluded-range / eacces-bind / no-consent / no-fallback / no-retry / cli-port-0 / cli-parity / winnat-hns / dynamic-range / workaround-range / eacces-not-eaddrinuse / redirect-from-assigned / cousins / before-after against the published facts.

## Why not a clone

This is specifically: **DESKTOP MCP OAUTH CALLBACK LISTENER HARDCODES TCP 53280; EXCLUDED PORT RANGE → EACCES; CLI USES PORT 0.**

**NOT Mailslot/#92839** (Keychain persist fails for OAuth payloads >~4KB after browser exchange succeeds). Different paradigm.

**NOT Shibboleth/#92966** (GrowthBook Invalid API Key / Remote Control flags). Different paradigm.

**NOT Interlock/#92976** (UI-warmed idle session exclusiveCwd Dispatch lock). Different paradigm.

**NOT Speakpipe/#92646** (SendMessage missing for subagent hail). Different paradigm.

**NOT Homestead/#92932** (HOME-cwd unscoped rg TCC hang). Different paradigm.

**NOT #84795** (CLOSED not planned / stale — cite only; do not clone).

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. NOT a Desktop automation.

Different paradigm: **Desktop hardcodes 53280; winnat/hns exclusion covering 53280 yields EACCES; CLI port 0 avoids collision.**

Do NOT rename this product Mailslot, Shibboleth, Interlock, Speakpipe, Homestead, or any existing catalog slug.
Do NOT reuse idle passable / admitted / deeded / parked / collated / confirmed / loosed / enrolled / as-penned / rove / vaulted / cleared / fused / bound / corked / detached / countersigned / staked / inscribed / emended / miraged.
Do NOT reuse Chakra Petch + Hind + IBM Plex Mono (Interlock). Do NOT reuse Cormorant Infant + Manrope + JetBrains Mono (Shibboleth). Do NOT reuse Playfair Display + Figtree + Fira Code (Homestead). Do NOT reuse Old Standard TT + Work Sans + Ubuntu Mono (Epitaph). Do NOT reuse Literata + Public Sans + JetBrains Mono (Recension). Do NOT reuse Newsreader + Lexend + Fragment Mono (Mirage).

Different surface: Desktop MCP OAuth callback hardcoded port vs Keychain persist spill / GrowthBook watchword reject / Dispatch cwd lock / subagent hail / HOME file-index hang.

Product name stays **Ferrule**. Name/slug `ferrule` unused in catalog.json (239 products before this ship; Interlock is #239).

Different UI: metalwork ferrule clamp booth / brushed steel / gunmetal / copper / oil-black / cyan LEDs. Oswald / Source Sans 3 / Share Tech Mono. NOT plant-floor hazard yellow. NOT river-ford indigo. NOT prairie gold. NOT memorial charcoal. NOT scriptorium oak. NOT desert haze. No E-stop. No hazard stripes.

Different verbs: Score ferruled, Admit ephemeral, Rebound the joint, Load #92968, Reset to ephemeral.

Different idle: **ephemeral**. Different #92968 path: **ferruled**. HOLD: **ephemeral**. ALARM: **ferruled** / **rebound** / **hardcoded-53280** / **excluded-range** / **eacces-bind** / **no-consent** / **no-fallback** / **no-retry** / **cli-port-0** / **cli-parity** / **winnat-hns** / **dynamic-range** / **workaround-range** / **eacces-not-eaddrinuse** / **redirect-from-assigned** / **cousins** / **before-after** / **fixtures**. Seeded recover: **rebound**.

## How to score

```bash
node --test projects/ferrule/ferrule.test.mjs
node projects/ferrule/ferrule.mjs projects/ferrule/data/92968.json
node projects/ferrule/ferrule.mjs projects/ferrule/data/ephemeral.json
echo '{"seed":"ferruled"}' | node projects/ferrule/ferrule.mjs
```

Open the living card at `projects/ferrule/index.html` (or the live path `/ferrule/`). Buttons: Score ferruled, Admit ephemeral, Rebound the joint, Load #92968, Load fixtures, Reset to ephemeral. Toggle hardcoded 53280 / OS-assigned port 0 / excluded range / EACCES / consent / retry-fallback — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/ferrule/
- Folder: `projects/ferrule/`
