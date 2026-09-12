# Interdict

An **ecclesiastical interdict / papal-bull / diocese-seal booth** — a ban that forbids rites across an entire territory, not just the chapel that issued it. Fonts **Cinzel** (display) + **Lora** (body) + **JetBrains Mono** (mono). Palette: papal cloth `#1A0B18` / `#3A1638`, vellum `#F3E2B8`, wax seal `#8E1530`, illuminated gold `#C9A227`, cardinal `#6E1230`, ink `#1C0E08`. Papal vellum / parish chapel / diocese territory / wax seal / bull register / seal press. NOT Simplex (radio chassis), NOT Deadkey (typewriter platen), NOT Dead Air (broadcast ON-AIR rack), NOT Gleaner (wheat/field leftover-harvest), NOT Schism (twin glass / dual-writer), NOT Rasure (parchment scrape), NOT Ashpan (foundry grate), NOT Outrider/Necrology/Innominate/Snuffer/Changeling/Homograph/Galley/Rescript/Aphonia/Muzzle/Escutcheon/Lacuna/Lazaret. This is specifically: browser-tool safety text becomes a diocese-wide interdict over Bash/SSH.

The bull should stay **scoped** (HOLD: prohibitions stay limited to browser/chrome tools — the good path). Instead the chapel was **interdicted** after a **chrome-prohibit-bleed**.

Primary:

- [anthropics/claude-code#93798](https://github.com/anthropics/claude-code/issues/93798) (OPEN). Title: `[BUG] claude-in-chrome MCP server's generic "Prohibited actions" instructions govern unrelated Bash/SSH behavior for the rest of the session`. Labels: bug, platform:macos, area:mcp, area:chrome. When `claude-in-chrome` is loaded (default-on via Conductor), its MCP `instructions` include a generic Action-categories safety framework (Prohibited / Explicit permission required / Regular). Language is not scoped to browser actions (e.g. "Permanently deleting data…" with no browser qualifier). The model then refuses a plain `rm` over SSH on the user's own server even after repeated explicit authorization, because the instruction says prohibitions stay prohibited when the user asks/authorizes. Same session with Chrome toggled off (`/chrome`) runs the command normally, citing only CLAUDE.md. Has published repro. Cousins cite-only (distinct, do not treat as same bug): #83702, #43474, #76372. Backups cite-only (next focus only — do not auto-pick): #93786 #93778 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 #93800 #93795.

23:50 interdict: an ecclesiastical interdict / papal-bull booth for #93798. Idle **scoped** / seeded **interdicted** / path **chrome-prohibit-bleed**. Score interdict or admit scoped.

Score interdict or admit scoped.

Idle word: **scoped** (HOLD: prohibitions stay limited to browser/chrome tools — the hold/good path). HOLD aliases: scoped, parish-only, chapel-bound, browser-only. Seeded word: **interdicted** / #93798 (chrome-prohibit bleed). Path word: **chrome-prohibit-bleed**. Product score: **interdict**. Never idle duplex / simplexed / simplex / mobile-uplink-silent / keyed / deadkeyed / deadkey / esc-csi-dead / gleaned / orphaned / gleaner / unreaped-ampersand / live / schismed / schism / resume-while-live / intact / rasured / rasure / creation-time-flip / swept / ashpanned / ashpan / orphan-jsonl / credentialed / outridden / outrider / early-connect / attested / necrologized / necrology / incomplete-listing / named / innominate / icon-only / lit / snuffed / snuffer / pledged / swapped / changeling / distinct / collided / homograph / carrier / deadair / squelch / aphonia / muzzle / leaking / excised / lazaret.

Phrase: **Score interdict or admit scoped.**

- **scoped** = IDLE: HOLD; prohibitions stay limited to browser/chrome tools
- **interdicted** = #93798 seeded path: chapel bull covers Bash/SSH
- **interdict** = product score word for the ecclesiastical interdict booth
- **chrome-prohibit-bleed** = path word: generic Prohibited language becomes diocese-wide
- **hold** = HOLD alias for idle scoped
- **parish** = claude-in-chrome chapel issued the bull
- **diocese** = generic Prohibited language covers the session territory
- **bleed** = Permanently deleting data… listed under Prohibited with no browser qualifier
- **mcp-instructions** = Action-categories framework injected session-wide
- **bash-ssh-refuse** = plain rm over SSH on the user's own server is refused
- **explicit-auth-ignored** = repeated explicit authorization still stays prohibited
- **chrome-on-vs-off** = Chrome off: the same command runs, citing only CLAUDE.md
- **has-repro** = published shape: Chrome on refuses; Chrome off runs; auth ignored
- **cousins** = cite-only #83702 #43474 #76372 — do not rebuild
- **backups** = cite-only #93786 #93778 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 #93800 #93795 — do not auto-pick
- **fixtures** = papal vellum / parish chapel / diocese territory / wax seal / bull register
- **walk** = published idle scoped → chrome-prohibit-bleed → interdicted → interdict

Verdicts: scoped, interdicted, interdict, chrome-prohibit-bleed, hold, parish, diocese, bleed, mcp-instructions, bash-ssh-refuse, explicit-auth-ignored, chrome-on-vs-off, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **interdicted** / **interdict** or already **scoped**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): MCP server `instructions` are injected session-wide without tool-namespace scoping, so generic Prohibited language outranks user authorization for Bash/SSH. Invite verify against #93798 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93798](https://github.com/anthropics/claude-code/issues/93798)
- Cite-only cousins: #83702 (token-cost / context floor of unconditional MCP `instructions` injection). Distinct: this booth encodes the behavior/jurisdiction side. #43474 (silent truncation of MCP instructions). #76372 (built-in instructions over the 2KB cap). Do not rebuild.
- Backups (data only; next focus only — do not auto-pick): #93786, #93778, #93766, #93764, #93754, #93751, #93744, #93772, #93770, #93777, #93782, #93800, #93795

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, platform:macos, area:mcp, area:chrome
- Environment: Claude Code via Conductor (Mac app); Model: Claude Sonnet 5; `claude-in-chrome` enabled via Conductor's "Use Claude Code with Chrome" toggle (default-on)
- When `claude-in-chrome` is loaded, its `instructions` include a generic Action-categories safety framework (Prohibited / Explicit permission required / Regular)
- Language is not scoped to browser actions (e.g. "Permanently deleting data…" with no browser qualifier)
- Model refuses a plain `rm` over SSH on the user's own home server
- Keeps refusing after repeated explicit authorization — the instruction says prohibitions stay prohibited when the user asks or authorizes
- Same session with Chrome toggled off (`/chrome`) runs the command normally, citing only CLAUDE.md
- Related, not duplicate: #83702 (same injection; that issue is token-cost)

Problem found: CLAUDE-IN-CHROME MCP INSTRUCTIONS GOVERN UNRELATED BASH/SSH FOR THE REST OF THE SESSION.

Why this solution: living catalog page + node diagnostic encoding idle **scoped** / seeded **interdicted** / path **chrome-prohibit-bleed** so operators can score whether the booth is an **interdict** or already **scoped**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. `claude-in-chrome` safety instructions should be explicitly scoped to browser-initiated actions only
2. If session-wide policy is intentional, it should be documented and surfaced, not silently inherited
3. Explicit repeated authorization of an unrelated `rm` over SSH should not stay prohibited because a browser tool listed generic deletions

## Why not a clone

This is specifically: **CLAUDE-IN-CHROME MCP INSTRUCTIONS GOVERN UNRELATED BASH/SSH FOR THE REST OF THE SESSION.**

Novel paradigm: ecclesiastical interdict / papal-bull / diocese-seal booth — a chapel's ban covering the whole territory.

**NOT Simplex/#93801** (mobile Remote Control send vanishes while desktop→phone still reads). Different defect. NOT radio chassis / RX downlink / TX uplink / PTT. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen / dead-key lever. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Dead Air/#93155** (requests silently stall 900s with TCP ACKs and zero log). Different defect. NOT broadcast ON-AIR rack / copper mic grille. Do not reuse carrier / deadair / squelch as idle/seeded/path.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat/field leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage to a LIVE Workflow agent resumes a second copy). Different defect. NOT twin glass / dual-writer. Do not reuse live / schismed / resume-while-live.

**NOT Rasure/#93791** (`~/.claude` wipe + CreationTime flip). Different defect. NOT parchment rasure / wholesale recreate. Do not reuse intact / rasured / creation-time-flip.

**NOT Ashpan/#93780** (delete_session leftover jsonl). Different defect. NOT industrial grate / ashpan / foundry. Do not reuse swept / ashpanned / orphan-jsonl.

**NOT Outrider/#93776** (headersHelper timing race). Different defect. NOT cavalry outrider / dispatch-rider / sealed pouch. Do not reuse credentialed / outridden / early-connect.

**NOT Necrology / Innominate / Snuffer / Changeling / Homograph / Galley / Aphonia / Muzzle / Lazaret**. Different defects. Do not rebuild.

Do NOT rename Interdict to any existing catalog slug. Catalog currently has 316 products; Interdict is #317 after Simplex #316.
Do NOT reuse idle duplex / simplexed / keyed / deadkeyed / gleaned / orphaned / live / schismed / intact / rasured / swept / ashpanned / credentialed / outridden / attested / necrologized / named / innominate / lit / snuffed / pledged / swapped / distinct / collided / carrier / deadair / squelch.

Display here is **Cinzel**. Body is **Lora**. Mono is **JetBrains Mono**.

Different surface: Chrome MCP jurisdiction bleed vs mobile Remote Control uplink vanish vs ESC-CSI dead composer vs 900s silent HTTP stall vs unreaped Bash `&` jobs.

Different UI: papal vellum / parish chapel / diocese territory / wax seal / bull register / seal press. Cinzel / Lora / JetBrains Mono. Papal cloth / vellum / wax / gold / cardinal / ink. NOT radio chassis. NOT typewriter platen. NOT wheat field. NOT twin glass. NOT parchment scrape. NOT foundry grate.

Different verbs: Admit scoped, Score interdict, Walk chrome-prohibit-bleed, Compare scoped / interdicted, Pin idle scoped, Pin seeded interdicted, Pin chrome-prohibit-bleed, Hold the scoped.

Different idle: **scoped**. Different #93798 seeded path: **interdicted**. HOLD: **scoped** / **hold**. ALARM: **interdicted** / **interdict** / **chrome-prohibit-bleed** / **bash-ssh-refuse**. Path: **chrome-prohibit-bleed**.

## How to score

```bash
node --test projects/interdict/interdict.test.mjs
node projects/interdict/interdict.mjs projects/interdict/data/interdicted.json
echo '{"seed":"interdicted"}' | node projects/interdict/interdict.mjs
```

Open the living card at `projects/interdict/index.html` (or the live path `/interdict/`). Buttons: Admit scoped, Score interdict, Walk chrome-prohibit-bleed, Compare scoped / interdicted, Pin idle scoped, Pin seeded interdicted, Pin chrome-prohibit-bleed, Hold the scoped. Toggle chips for: chrome-prohibit-bleed, bleed, mcp-instructions, bash-ssh-refuse, explicit-auth-ignored, chrome-on-vs-off — the score flips. Lay a fixture JSON on the vellum blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s chrome-prohibit-bleed walk from the published #93798 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/interdict/
- Folder: `projects/interdict/`
