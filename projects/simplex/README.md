# Simplex

A **military / ham radio simplex / half-duplex uplink booth** — one-way carrier: the downlink (RX) stays phosphor-green while the uplink (TX) goes dark. Fonts **Russo One** (display) + **Sora** (body) + **Fira Code** (mono). Palette: deep night navy `#041018` / `#0B1A2E` / `#071422`, phosphor green `#4CFF9A`, amber carrier lamp `#F5A623`, charcoal panel `#161A20` / `#2A3340`. Night chassis / RX downlink meter / TX uplink meter / amber carrier lamp / QR hatch / PTT paddle / phone handset vs desk rig / dual-network stamp. NOT Deadkey (typewriter platen), NOT Dead Air (broadcast ON-AIR rack / 900s stall), NOT Gleaner (wheat/field leftover-harvest), NOT Schism (twin glass / dual-writer), NOT Rasure (parchment scrape), NOT Ashpan (foundry grate), NOT Outrider/Necrology/Innominate/Snuffer/Changeling/Homograph/Galley/Rescript/Aphonia/Muzzle/Escutcheon/Lacuna. This is specifically: mobile Remote Control send vanishes while desktop→phone read still works.

The chassis should stay **duplex** (HOLD: both legs open; phone send reaches the CLI — the good path). Instead the uplink was **simplexed** after a **mobile-uplink-silent**.

Primary:

- [anthropics/claude-code#93801](https://github.com/anthropics/claude-code/issues/93801) (OPEN). Title: `[BUG] Remote Control: sending from mobile silently fails (message disappears), reading works fine`. Labels: bug, has repro, platform:windows, area:claude-code-web, area:cli. With `claude remote-control`, messages typed and sent from the phone (mobile web session) never reach the CLI. Desktop → phone works (replies visible on the phone). Phone send: the message disappears from the input with no error, no queued/pending state, nothing arrives on the desktop. Cleared phone app data + brand-new session; same failure. Two networks (restaurant wifi + carrier 5G) — rules out local antivirus/firewall as in #62284. Regression: yes (worked previously). Version noted: 2.1.236. Native Windows `claude.exe` at `%USERPROFILE%\.local\bin`, not npm. Windows Terminal. Cousins cite-only (distinct, do not treat as same bug): #62284, #34619, #45946. Backups cite-only (next focus only — do not auto-pick): #93798 #93786 #93778 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782.

22:50 simplex: a radio simplex / half-duplex uplink booth for #93801. Idle **duplex** / seeded **simplexed** / path **mobile-uplink-silent**. Score simplex or admit duplex.

Score simplex or admit duplex.

Idle word: **duplex** (HOLD: both legs open; phone send reaches the CLI — the hold/good path). HOLD aliases: duplex, two-way, full-duplex, both-ways. Seeded word: **simplexed** / #93801 (mobile uplink silent). Path word: **mobile-uplink-silent**. Product score: **simplex**. Never idle keyed / deadkeyed / deadkey / esc-csi-dead / gleaned / orphaned / gleaner / unreaped-ampersand / live / schismed / schism / resume-while-live / intact / rasured / rasure / creation-time-flip / swept / ashpanned / ashpan / orphan-jsonl / credentialed / outridden / outrider / early-connect / attested / necrologized / necrology / incomplete-listing / named / innominate / icon-only / lit / snuffed / snuffer / pledged / swapped / changeling / distinct / collided / homograph / carrier / deadair / squelch / aphonia / muzzle / leaking / excised.

Phrase: **Score simplex or admit duplex.**

- **duplex** = IDLE: HOLD; both legs open; phone send reaches the CLI
- **simplexed** = #93801 seeded path: mobile uplink never delivers while downlink still streams
- **simplex** = product score word for the half-duplex radio chassis
- **mobile-uplink-silent** = path word: write path from the handset never delivers
- **hold** = HOLD alias for idle duplex
- **downlink-ok** = desktop → phone still streams; replies visible on the handset
- **uplink-vanish** = phone message disappears from the input; never on the CLI
- **silent-send** = no error shown, no queued/pending state
- **dual-network** = restaurant wifi + carrier 5G — rules out #62284
- **cleared-app-data** = cleared phone app data + brand-new session; same vanish
- **has-repro** = published shape: phone send vanishes; downlink still streams; dual-network
- **cousins** = cite-only #62284 #34619 #45946 — do not rebuild
- **backups** = cite-only #93798 #93786 #93778 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 — do not auto-pick
- **fixtures** = night chassis / RX downlink / TX uplink / amber carrier lamp / QR hatch / PTT
- **walk** = published idle duplex → mobile-uplink-silent → simplexed → simplex

Verdicts: duplex, simplexed, simplex, mobile-uplink-silent, hold, downlink-ok, uplink-vanish, silent-send, dual-network, cleared-app-data, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **simplexed** / **simplex** or already **duplex**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): uplink/write path from the mobile web session drops or never delivers while the downlink/read path still streams; silent fail (no error UI). Invite verify against #93801 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93801](https://github.com/anthropics/claude-code/issues/93801)
- Cite-only cousins: #62284 (antivirus blocking traffic). Distinct: this booth encodes a mobile-web uplink that vanishes after restaurant wifi + carrier 5G ruled the local path out. #34619 / #45946 (similar symptoms, different confirmed local-network root cause). Do not rebuild.
- Backups (data only; next focus only — do not auto-pick): #93798, #93786, #93778, #93766, #93764, #93754, #93751, #93744, #93772, #93770, #93777, #93782

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:windows, area:claude-code-web, area:cli
- Environment: Native Windows `claude.exe` at `%USERPROFILE%\.local\bin` (not npm); Windows Terminal; Anthropic API; 2.1.236
- With `claude remote-control`, messages typed and sent from the phone (mobile web) never reach the CLI
- Desktop → phone works: replies are visible on the phone
- Phone send: message disappears from the input with no error, no queued/pending state, nothing arrives on the desktop
- Cleared phone app data + brand-new session; same failure both times
- Two networks (restaurant wifi + carrier 5G) with identical results — rules out #62284 antivirus/firewall
- Regression: yes (worked previously). Last working version not named.

Problem found: PHONE SEND ON `claude remote-control` VANISHES WHILE DESKTOP→PHONE READ STILL WORKS.

Why this solution: living catalog page + node diagnostic encoding idle **duplex** / seeded **simplexed** / path **mobile-uplink-silent** so operators can score whether the booth is a **simplex** or already **duplex**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Messages sent from the phone during a Remote Control session should reach the CLI and appear in the conversation
2. The same way messages typed on the desktop reach the phone
3. A vanished phone send should not fail silently — error, queued, or pending state should appear

## Why not a clone

This is specifically: **PHONE SEND ON `claude remote-control` VANISHES WHILE DESKTOP→PHONE READ STILL WORKS.**

Novel paradigm: military / ham radio simplex / half-duplex uplink booth — one-way carrier, uplink dead, downlink still lit.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen / dead-key lever. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Dead Air/#93155** (requests silently stall 900s with TCP ACKs and zero log). Different defect. NOT broadcast ON-AIR rack / copper mic grille. Do not reuse carrier / deadair / squelch as idle/seeded/path.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat/field leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage to a LIVE Workflow agent resumes a second copy). Different defect. NOT twin glass / dual-writer / ecclesiastical schism. Do not reuse live / schismed / resume-while-live.

**NOT Rasure/#93791** (`~/.claude` wipe + CreationTime flip). Different defect. NOT parchment rasure / wholesale recreate. Do not reuse intact / rasured / creation-time-flip.

**NOT Ashpan/#93780** (delete_session leftover jsonl). Different defect. NOT industrial grate / ashpan / foundry. Do not reuse swept / ashpanned / orphan-jsonl.

**NOT Outrider/#93776** (headersHelper timing race). Different defect. NOT cavalry outrider / dispatch-rider / sealed pouch. Do not reuse credentialed / outridden / early-connect.

**NOT Necrology / Innominate / Snuffer / Changeling / Homograph / Galley / Aphonia / Muzzle**. Different defects. Do not rebuild.

Do NOT rename Simplex to any existing catalog slug. Catalog currently has 315 products; Simplex is #316 after Deadkey #315.
Do NOT reuse idle keyed / deadkeyed / gleaned / orphaned / live / schismed / intact / rasured / swept / ashpanned / credentialed / outridden / attested / necrologized / named / innominate / lit / snuffed / pledged / swapped / distinct / collided / carrier / deadair / squelch.

Display here is **Russo One**. Body is **Sora**. Mono is **Fira Code**.

Different surface: mobile Remote Control uplink vanish vs ESC-CSI dead composer vs 900s silent HTTP stall vs unreaped Bash `&` jobs.

Different UI: night chassis / RX downlink meter / TX uplink meter / amber carrier lamp / QR hatch / PTT paddle / phone handset vs desk rig. Russo One / Sora / Fira Code. Night navy / phosphor / amber / charcoal. NOT typewriter platen. NOT broadcast ON-AIR rack. NOT wheat field. NOT twin glass. NOT parchment. NOT foundry grate.

Different verbs: Admit duplex, Score simplex, Walk mobile-uplink-silent, Compare duplex / simplexed, Pin idle duplex, Pin seeded simplexed, Pin mobile-uplink-silent, Hold the duplex.

Different idle: **duplex**. Different #93801 seeded path: **simplexed**. HOLD: **duplex** / **hold**. ALARM: **simplexed** / **simplex** / **mobile-uplink-silent** / **uplink-vanish**. Path: **mobile-uplink-silent**.

## How to score

```bash
node --test projects/simplex/simplex.test.mjs
node projects/simplex/simplex.mjs projects/simplex/data/simplexed.json
echo '{"seed":"simplexed"}' | node projects/simplex/simplex.mjs
```

Open the living card at `projects/simplex/index.html` (or the live path `/simplex/`). Buttons: Admit duplex, Score simplex, Walk mobile-uplink-silent, Compare duplex / simplexed, Pin idle duplex, Pin seeded simplexed, Pin mobile-uplink-silent, Hold the duplex. Toggle chips for: mobile-uplink-silent, uplink-vanish, silent-send, downlink-ok, dual-network, cleared-app-data — the score flips. Lay a fixture JSON on the radio blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s mobile-uplink-silent walk from the published #93801 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/simplex/
- Folder: `projects/simplex/`
