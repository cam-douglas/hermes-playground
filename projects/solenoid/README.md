# Solenoid

An **industrial switchgear / solenoid-coil atelier** — a copper coil that should pull the plunger at session warm. Fonts **Big Shoulders Display** (display) + **Barlow** (UI) + **IBM Plex Mono** (mono). Palette: slate steel `#8B95A3`, panel slate `#24303C`, copper coil amber `#E07A28`, deep navy void `#0A1424`, mint engaged `#2FDBA0`, rust inert `#C4452A`. Coil/plunger diagram, Settings toggle vs `settings.json` fidelity rail, warm→focus→pty→(gap)→first-message timeline, mobile Mac-absent vs Win-disconnected chips. NOT Scotia (limestone / shadow-gap / column-molding), NOT Canard (press-room / newspaper-canard), NOT Stet (copy-desk / blue-pencil / galley), NOT Blindside (sideline scout / turf), NOT Interdict (papal/vellum), NOT Pontoon (harbor pier / onQuitCleanup wash), NOT Outrider (cavalry / early-connect), NOT Simplex (radio chassis), NOT Deadkey (typewriter platen), NOT Gleaner (wheat leftover-harvest). This is specifically: **SETTINGS TOGGLE FIDELITY + ARM-AT-WARM VS ARM-AT-FIRST-MESSAGE.**

The coil should stay **engaged** (HOLD: RC bridge arms at session warm/focus, before any message). Instead the booth was **inert** after a **warm-before-message**.

Primary:

- [anthropics/claude-code#93754](https://github.com/anthropics/claude-code/issues/93754) (OPEN). Title: `Desktop app (macOS): "Enable remote control by default" Settings toggle flips but has no effect, and remoteControlAtStartup only takes effect on first message, not session open`. Labels: bug, has repro, platform:macos, area:desktop. Claude Desktop, macOS 15.7.7 (24G720), Code tab, interactive (non-headless) local session. The Settings panel has an "Enable Remote Control for all sessions" switch. Flipping it on produces no change — new local sessions still do not get Remote Control by default. The only way to actually enable it was editing `~/.claude/settings.json` directly with `remoteControlAtStartup: true` and `remoteControlEnabled: true`. Even with those keys set, opening/warming a local session does not trigger auto-connect — it only activates once the first message is sent. Published `~/Library/Logs/Claude/main.log`: `21:21:22` WarmLifecycle + setFocusedSession + startShellPty with no RC activity; `21:21:50` sendMessage then "Enabling remote control" → bridge ready/connected. No manual toggle in the ~28s gap. Comparison via Claude iOS: Windows PC asleep sessions still appear as "disconnected"; Mac idle (RC not yet active) sessions do not appear at all until a message is sent, then appear as "connected" with no disconnected placeholder. Cousins cite-only: #84502 (headless Windows session-start), #48949 (remoteControlAtStartup not honored), #90768 (same-toggle fidelity), #84994 (mobile unreachable unless desktop keeps running). Backups cite-only (next focus only — do not auto-pick): #93751 #93744 #93772 #93770 #93777 #93782 #93821 #93811 #93809 #93823.

04:50 solenoid: an industrial switchgear / solenoid-coil atelier booth for #93754. Idle **engaged** / seeded **inert** / path **warm-before-message**. Score solenoid or admit engaged.

Score solenoid or admit engaged.

Idle word: **engaged** (HOLD: RC bridge arms at session warm/focus, before any message). HOLD aliases: engaged, armed, coil-pulled, bridge-ready, warm-armed. Seeded word: **inert** / #93754 (toggle/settings present but coil does not pull until first message). Path word: **warm-before-message**. Product score: **solenoid**. Never idle scotia / scotiated / decstbm-undershoot / canard / candid / canarded / onedrive-cwd-mislabel / stet / stetted / rewound / mic-resume-wipe / sighted / blindsided / blindside / compare-ref-unreachable / scoped / interdicted / interdict / chrome-prohibit-bleed / pontoon / washed / outrider / early-connect / duplex / simplexed / simplex / mobile-uplink-silent / keyed / deadkeyed / deadkey / esc-csi-dead / gleaned / orphaned / gleaner / unreaped-ampersand / live / schismed / schism / resume-while-live / intact / rasured / rasure / creation-time-flip / swept / ashpanned / ashpan / orphan-jsonl.

Phrase: **Score solenoid or admit engaged.**

- **engaged** = IDLE: HOLD; RC bridge arms at session warm/focus, before any message
- **inert** = #93754 seeded path: toggle/settings present but coil does not pull until first message
- **solenoid** = product score word for the switchgear / solenoid-coil booth
- **warm-before-message** = path word: arm-at-warm vs arm-at-first-message
- **hold** = HOLD alias for idle engaged
- **armed** = HOLD alias: RC armed at warm/focus
- **coil-pulled** = HOLD alias: solenoid coil pulled at warm
- **bridge-ready** = HOLD alias: bridge ready/connected at warm
- **warm-armed** = HOLD alias: WarmLifecycle already Enabling remote control
- **toggle-fidelity** = Settings toggle flips visually; new local sessions still lack RC
- **first-message-arm** = RC enables only after first sendMessage
- **settings-json** = direct `~/.claude/settings.json` edit is the only write that sticks
- **mac-absent** = Mac idle sessions absent on mobile until first message
- **win-disconnected** = Windows asleep sessions show disconnected
- **has-repro** = published shape: Desktop macOS 15.7.7; toggle no-op; keys wait for sendMessage
- **cousins** = cite-only #84502 #48949 #90768 #84994
- **backups** = cite-only #93751 #93744 #93772 #93770 #93777 #93782 #93821 #93811 #93809 #93823 — do not auto-pick
- **fixtures** = slate steel / copper coil / navy void / mint engaged / rust inert / coil-plunger
- **walk** = published idle engaged → warm-before-message → inert → solenoid

Verdicts: engaged, inert, solenoid, warm-before-message, hold, armed, coil-pulled, bridge-ready, warm-armed, toggle-fidelity, first-message-arm, mac-absent, win-disconnected, settings-json, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **inert** / **solenoid** or already **engaged**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Settings UI writes a different key than `remoteControlAtStartup`, and WarmLifecycle never calls the RC enable path that `sendMessage` does. Invite verify against #93754 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93754](https://github.com/anthropics/claude-code/issues/93754)
- Cite-only cousins: #84502 (headless Code-tab subprocesses on Windows — same setting failing at session start). #48949 (desktop app not honoring `remoteControlAtStartup`). #90768 (related UI/setting-fidelity gap for the same toggle). #84994 (local sessions unreachable from mobile unless the desktop app keeps them running). Do not rebuild those as separate booths.
- Backups (data only; next focus only — do not auto-pick): #93751, #93744, #93772, #93770, #93777, #93782, #93821, #93811, #93809, #93823

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:desktop
- Environment: Claude Desktop, macOS 15.7.7 (24G720), Code tab, interactive (non-headless) local session
- Settings toggle "Enable Remote Control for all sessions" flips visually but new local sessions still lack RC by default
- Only a direct edit of `~/.claude/settings.json` with `remoteControlAtStartup: true` + `remoteControlEnabled: true` works
- Even then, WarmLifecycle / setFocusedSession / startShellPty show no RC activity
- ~28s later first `sendMessage` then "Enabling remote control" → bridge ready/connected
- Mobile: Windows asleep sessions show "disconnected"; Mac idle (RC not yet active) sessions are absent until first message then appear "connected"

Problem found: SETTINGS TOGGLE FIDELITY + ARM-AT-WARM VS ARM-AT-FIRST-MESSAGE.

Why this solution: living catalog page + node diagnostic encoding idle **engaged** / seeded **inert** / path **warm-before-message** so operators can score whether the booth is a **solenoid** or already **engaged**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Flipping "Enable Remote Control for all sessions" in Settings should have the same effect as setting `remoteControlAtStartup` / `remoteControlEnabled` in `settings.json`
2. A session should register for Remote Control at start rather than waiting for the first message
3. Dormant/inactive sessions should be represented consistently across platforms on the mobile client

## Why not a clone

This is specifically: **SETTINGS TOGGLE FIDELITY + ARM-AT-WARM VS ARM-AT-FIRST-MESSAGE.**

Novel paradigm: industrial switchgear / solenoid-coil atelier — a copper coil that should pull the plunger at warm.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows under the prompt on Linux VTE). Different defect. NOT limestone / shadow-gap / column-molding. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Pontoon/#93288** (RC bridges washed on Desktop restart / onQuitCleanup). Different defect. NOT harbor pontoon / floating-bridge pier. Do not reuse afloat / washed / bridge-loss.

**NOT Outrider/#93776** (early-connect / credentialed path — headersHelper race). Different defect. NOT cavalry outrider / dispatch-rider. Do not reuse credentialed / outridden / early-connect.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd, then a musl/glibc false headline). Different defect. NOT press-room / newspaper-canard / duck-press. Do not reuse candid / canarded / onedrive-cwd-mislabel.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits on mic resume). Different defect. NOT copy-desk / blue-pencil / galley-proof. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work; compare ref unreachable). Different defect. NOT sideline-scout / night turf / floodlight. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum / wax seal / diocese. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Simplex/#93801** (mobile Remote Control send vanishes while desktop→phone still reads). Different defect. NOT radio chassis / RX downlink / TX uplink / PTT. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen / dead-key lever. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat/field leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

Do NOT rename Solenoid to any existing catalog slug. Catalog currently has 321 products; Solenoid is #322 after Scotia #321.
Do NOT reuse idle flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / washed / outridden / duplex / simplexed / keyed / deadkeyed / gleaned / orphaned.

Display here is **Big Shoulders Display**. Body is **Barlow**. Mono is **IBM Plex Mono**.

Different surface: Desktop Settings toggle fidelity + warm-arm vs first-message-arm vs DECSTBM blank-row undershoot vs Desktop restart wash vs headersHelper early-connect vs VS Code OneDrive spawn mislabel vs dictation buffer-over-edit.

Different UI: slate steel / copper coil / navy void / mint engaged / rust inert / coil-plunger diagram / Settings vs settings.json rail / warm→focus→pty→gap timeline / Mac-absent vs Win-disconnected chips. Big Shoulders Display / Barlow / IBM Plex Mono. NOT limestone column. NOT aged newsprint. NOT cream galley. NOT harbor pier. NOT cavalry dispatch.

Different verbs: Admit engaged, Score solenoid, Walk warm-before-message, Compare engaged / inert, Pin idle engaged, Pin seeded inert, Pin warm-before-message, Hold the coil.

Different idle: **engaged**. Different #93754 seeded path: **inert**. HOLD: **engaged** / **hold**. ALARM: **inert** / **solenoid** / **warm-before-message** / **toggle-fidelity**. Path: **warm-before-message**.

## How to score

```bash
node --test projects/solenoid/solenoid.test.mjs
node projects/solenoid/solenoid.mjs projects/solenoid/data/inert.json
echo '{"seed":"inert"}' | node projects/solenoid/solenoid.mjs
```

Open the living card at `projects/solenoid/index.html` (or the live path `/solenoid/`). Buttons: Admit engaged, Score solenoid, Walk warm-before-message, Compare engaged / inert, Pin idle engaged, Pin seeded inert, Pin warm-before-message, Hold the coil. Toggle chips for: warm-before-message, toggle-fidelity, first-message-arm, settings-json, armed — the score flips. Lay a fixture JSON on the switchgear desk. `?embed=1` hides chrome.

The booth reconstructs the reporter’s Settings-toggle / warm-gap / first-message walk from the published #93754 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/solenoid/
- Folder: `projects/solenoid/`
