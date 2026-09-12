# Airlock

A **submarine / spacecraft pressure-lock booth** — an industrial hatch whose outer door must not open until the chamber equalizes (proxy listeners bound). Race = blowing the airlock. Fonts **Quantico** (display) + **Rajdhani** (body) + **Source Code Pro** (chips/log). Palette: deep navy hull `#081525`, chamber slate `#102033`, frost readout `#D6E8F2`, cyan instrument glow `#4FD4E8`, amber caution `#E89B1A`, crimson blow-out `#C4162A`. Hatch wheel, HTTP:3128 / SOCKS:1080 listener lamps, hull-vs-chamber pressure gauges, first-call timeline (3 ms shell vs 15–30 ms listen), git/curl probe strip. NOT Scotoma (perimetry / command-args-blind), NOT Aneroid (instrument-panel / wrong-window ring), NOT Simulacrum (hyperreality / phantom Chrome navigate), NOT Solenoid (switchgear / RC warm-arm), NOT Scotia (limestone / shadow-gap), NOT Canard (press-room), NOT Stet (copy-desk), NOT Blindside (sideline scout), NOT Interdict (chrome prohibit-bleed on Bash), NOT Scapegoat (Chrome grant blame), NOT Simplex (radio chassis), NOT Deadkey (typewriter platen), NOT Gleaner (wheat leftover-harvest), NOT Schism (twin-authority glass), NOT Galley (Stop hook dirty-tree billing), NOT Sprag (boot attach), NOT Leat (blocked sleep), NOT Pontoon (RC wash). This is specifically: **SANDBOX SOCAT PROXY READINESS RACE — FIRST NETWORK CALL CONNECTION-REFUSED.**

The lock should stay **equalized** (HOLD: bridges listening before command; hatch sealed until pressure equalizes). Instead the booth was **blown** after a **socat-race**.

Primary:

- [anthropics/claude-code#93862](https://github.com/anthropics/claude-code/issues/93862) (OPEN, has repro). Title: `Linux/WSL2 sandbox: socat proxy bridge starts in the background, so the first network call in a command fails`. Labels: bug, has repro, platform:linux, platform:wsl, area:sandbox. Claude Code **2.1.269** (native binary, latest); WSL2, NixOS 26.05, kernel 6.18.40.1-microsoft-standard-WSL2; bubblewrap and socat from nixpkgs. sandbox enabled with `autoAllowBashIfSandboxed`. The bwrap script starts two socat bridges in the background (`TCP-LISTEN:3128` HTTP → `/tmp/claude-http-<hex>.sock`, `TCP-LISTEN:1080` SOCKS → `/tmp/claude-socks-<hex>.sock`) then immediately runs the user command with no wait for listen sockets. Measured: inner shell ready ~3 ms; port 3128 accepts ~15–30 ms later. First `git ls-remote` / `curl` fails connection-refused to localhost:3128 after 0 ms; later calls in the same command succeed. 4 of 4 probes failed. `ss -ltn` as the first action shows no listener; 100 ms later shows `0.0.0.0:3128` and `0.0.0.0:1080`. Same symptom as closed-stale #62743 — cite only, do not treat as the product. Cousin cite-only: #62743. Backups cite-only (next focus only — do not auto-pick): #93744 #93772 #93770 #93777 #93782 #93859 #93863 #93889 #93821 #93811 #93809 #93823.

08:50 airlock: a submarine/spacecraft pressure-lock booth for #93862. Idle **equalized** / seeded **blown** / path **socat-race**. Score airlock or admit equalized.

Score airlock or admit equalized.

Idle word: **equalized** (HOLD: bridges listening before command; hatch sealed until pressure equalizes). HOLD aliases: equalized, bridges-ready, listeners-bound, hatch-sealed. Seeded word: **blown** / #93862 (first call races the bind). Path word: **socat-race**. Product score: **airlock**. Never idle scotoma / legible / scotomized / command-args-blind / aneroid / calibrated / aneroided / wrong-window-ring / simulacrum / tethered / hollow / phantom-navigate / solenoid / engaged / inert / warm-before-message / scotia / flush / scotiated / decstbm-undershoot / canard / candid / canarded / stet / stetted / rewound / blindside / sighted / blindsided / interdict / scoped / interdicted / simplex / deadkey / keyed / gleaner / gleaned / schism / live / rasure / intact / ashpan / swept / outrider / credentialed / necrology / attested / innominate / named / snuffer / lit / changeling / pledged / homograph / distinct / galley / billed / stop-dirty / primed / warm.

Phrase: **Score airlock or admit equalized.**

- **equalized** = IDLE: HOLD; bridges listening before command; hatch sealed until pressure equalizes
- **blown** = #93862 seeded path: first git/curl races the bind and is connection-refused
- **airlock** = product score word for the pressure-lock booth
- **socat-race** = path word: hatch opens before HTTP:3128 / SOCKS:1080 are bound
- **hold** = HOLD alias for idle equalized
- **bridges-ready** = HOLD alias: both listeners bound first
- **listeners-bound** = HOLD alias: accept before the first probe
- **hatch-sealed** = HOLD alias: outer hatch stays sealed until equalized
- **first-call-refused** = first git/curl fails to localhost:3128 after 0 ms
- **later-call-ok** = later calls in the same command succeed
- **no-wait-bind** = script never polls listen sockets
- **listen-latency** = inner shell ~3 ms vs listen 15–30 ms
- **bridge-http** = background `TCP-LISTEN:3128` HTTP socat
- **bridge-socks** = background `TCP-LISTEN:1080` SOCKS socat
- **has-repro** = published shape: Claude Code 2.1.269 / WSL2 NixOS; first-call race
- **cousins** = cite-only #62743
- **backups** = cite-only #93744 #93772 #93770 #93777 #93782 #93859 #93863 #93889 #93821 #93811 #93809 #93823 — do not auto-pick
- **fixtures** = navy hull / cyan glow / amber caution / crimson blow-out
- **walk** = published idle equalized → socat-race → blown → airlock

Verdicts: equalized, blown, airlock, socat-race, hold, bridges-ready, listeners-bound, hatch-sealed, first-call-refused, later-call-ok, no-wait-bind, listen-latency, bridge-http, bridge-socks, inner-shell-ready, pressure-delta, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **blown** / **airlock** or already **equalized**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the bwrap sandbox script backgrounds both socat listeners (`TCP-LISTEN:3128` HTTP and `TCP-LISTEN:1080` SOCKS) and immediately execs the user command, so the first git/curl probe hits localhost before bind. Confirming the exact script in the 2.1.269 binary is the issue's own reconstruction — offered as published evidence, not a source-root-cause claim beyond that text. Invite verify against #93862 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93862](https://github.com/anthropics/claude-code/issues/93862)
- Cite-only cousin: #62743 (same first-call connection-refused symptom, closed as stale — different ticket: this booth is the 2.1.269 mechanism + measurements). Do not rebuild as a separate booth.
- Backups (data only; next focus only — do not auto-pick): #93744, #93772, #93770, #93777, #93782, #93859, #93863, #93889, #93821, #93811, #93809, #93823

What happened (from the issue text — do not invent):

- OPEN, has repro
- Labels: bug, has repro, platform:linux, platform:wsl, area:sandbox
- Environment: Claude Code 2.1.269, WSL2, NixOS 26.05, bubblewrap + socat
- Two socat bridges started in the background (`TCP-LISTEN:3128` HTTP + `TCP-LISTEN:1080` SOCKS)
- User command runs immediately; no wait for listen sockets
- Inner shell ready ~3 ms; port 3128 accepts ~15–30 ms later
- First `git ls-remote` / `curl` fails connection-refused to localhost:3128 after 0 ms
- Later calls in the same command succeed
- 4 of 4 first-action probes failed
- `ss -ltn` as first action shows no listener; 100 ms later shows both ports
- Same symptom as closed-stale #62743 — cite only

Problem found: SANDBOX SOCAT PROXY READINESS RACE — FIRST NETWORK CALL CONNECTION-REFUSED.

Why this solution: living catalog page + node diagnostic encoding idle **equalized** / seeded **blown** / path **socat-race** so operators can score whether the booth is an **airlock** or already **equalized**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The sandbox should wait for the HTTP and SOCKS listeners to bind before running the user command
2. A first-action git ls-remote or curl should succeed against the local proxy
3. `ss -ltn` as the first action should already show `0.0.0.0:3128` and `0.0.0.0:1080`
4. A bounded `/dev/tcp` poll (or socat readiness signal) should close the 15–30 ms race

## Why not a clone

This is specifically: **SANDBOX SOCAT PROXY READINESS RACE — FIRST NETWORK CALL CONNECTION-REFUSED.**

Novel paradigm: submarine / spacecraft pressure-lock booth — an industrial hatch that must not open until the proxy listeners bind. Race = blowing the airlock.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT ophthalmology / Humphrey bowl / perimetry. Do not reuse legible / scotomized / command-args-blind.

**NOT Aneroid/#93901** (VS Code context ring ignores autoCompactWindow). Different defect. NOT aneroid-barometer / instrument-panel / sealed gauge. Do not reuse calibrated / aneroided / wrong-window-ring.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work). Different defect. NOT sideline-scout. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Galley/#93745** (Stop hook dirty-tree billing). Different defect. NOT printer's galley / wet-proof. Do not reuse dry / billed / stop-dirty.

**NOT Simulacrum/#93751** (Claude-in-Chrome hollow MCP success — list connected + Navigated stamp with no process). Different defect. NOT Baudrillard / hyperreality museum / wax-museum CRT. Do not reuse tethered / hollow / phantom-navigate.

**NOT Solenoid/#93754** (Desktop Settings RC toggle fidelity + arm-at-warm vs arm-at-first-message). Different defect. NOT industrial switchgear / solenoid-coil. Do not reuse engaged / inert / warm-before-message.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum / wax seal / diocese. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Scapegoat** (Chrome grant blame). Different defect. Do not reuse that slug.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows under the prompt on Linux VTE). Different defect. NOT limestone / shadow-gap / column-molding. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd). Different defect. NOT press-room / newspaper-canard. Do not reuse candid / canarded / onedrive-cwd-mislabel.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk / blue-pencil. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Simplex/#93801** (mobile Remote Control send vanishes). Different defect. NOT radio chassis. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage resumes a second LIVE workflow agent). Different defect. NOT twin-authority glass. Do not reuse live / schismed / resume-while-live.

**NOT Sprag** (boot attach). Different defect. Do not reuse that slug.

**NOT Leat** (blocked sleep). Different defect. Do not reuse that slug.

**NOT Pontoon/#93288** (RC restart wash). Different defect. NOT harbor pontoon / floating-bridge. Do not reuse washed / afloat / bridge-loss.

Do NOT rename Airlock to any existing catalog slug. Catalog currently has 325 products; Airlock is #326 after Scotoma #325.
Do NOT reuse idle legible / scotomized / command-args-blind / calibrated / aneroided / wrong-window-ring / tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / duplex / simplexed / keyed / deadkeyed / gleaned / primed / lit / warm.

Display here is **Quantico**. Body is **Rajdhani**. Mono is **Source Code Pro**.

Different surface: Linux/WSL2 Bash sandbox socat proxy bridges vs Stop-condition evaluator vs `/goal` command-args vs VS Code context-ring vs Claude-in-Chrome MCP hollow registration vs Settings toggle fidelity vs DECSTBM blank-row undershoot vs Chrome-MCP Bash bleed vs VS Code OneDrive spawn mislabel.

Different UI: deep navy hull / chamber slate / frost readout / cyan instrument glow / amber caution / crimson blow-out / hatch wheel / listener lamps / pressure gauges / race timeline. Quantico / Rajdhani / Source Code Pro. NOT Humphrey bowl. NOT sealed gauge. NOT museum vitrine. NOT coil-plunger. NOT limestone column. NOT aged newsprint. NOT cream galley. NOT papal vellum. NOT sideline turf.

Different verbs: Admit equalized, Score airlock, Walk socat-race, Compare equalized / blown, Pin idle equalized, Pin seeded blown, Pin socat-race, Cycle the hatch.

Different idle: **equalized**. Different #93862 seeded path: **blown**. HOLD: **equalized** / **hold**. ALARM: **blown** / **airlock** / **socat-race** / **no-wait-bind**. Path: **socat-race**.

## How to score

```bash
node --test projects/airlock/airlock.test.mjs
node projects/airlock/airlock.mjs projects/airlock/data/blown.json
echo '{"seed":"blown"}' | node projects/airlock/airlock.mjs
```

Open the living card at `projects/airlock/index.html` (or the live path `/airlock/`). Buttons: Admit equalized, Score airlock, Walk socat-race, Compare equalized / blown, Pin idle equalized, Pin seeded blown, Pin socat-race, Cycle the hatch. Toggle chips for: socat-race, no-wait-bind, first-call-refused, listen-latency, later-call-ok — the score flips. Lay a fixture JSON on the lock blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s no-wait-bind / first-call-refused / later-call-ok walk from the published #93862 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/airlock/
- Folder: `projects/airlock/`
