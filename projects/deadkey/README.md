# Deadkey

A **typographic dead-key / typewriter platen booth** — a composing key that should combine, but here ESC-CSI never resolve: arrows/Home/End stay permanently dead while single-byte keys still type. Fonts **Special Elite** (display/typewriter) + **IBM Plex Sans** (UI) + **IBM Plex Mono** (chips/logs). Palette: near-black platen `#0A0908`, ivory paper `#F5EFE3`, carbon ink `#1C1915`, muted red error ribbon `#9C2F2A`, brass `#B8924A`, paper `#EDE4D2`, soot `#161412`. Carbon platen / ivory sheet / dead-key lever / mute-red ribbon / brass typebar / CSI sequence chips (ESC [ D/C/A/B/H/F) / single-byte 0x7F chip / silent-fail ribbon / 2.1.268↔2.1.269 binary-swap stamp / cat -v tape / fullscreen TUI badge / AbsoluteTelnet host chip. NOT Gleaner (wheat/field leftover-harvest), NOT Schism (twin glass / dual-writer), NOT Rasure (parchment scrape), NOT Ashpan (foundry grate), NOT Outrider/Necrology/Innominate/Snuffer/Changeling/Homograph/Galley/Rescript/Aphonia/Muzzle/Escutcheon/Lacuna/Annunciator/Tocsin/Oubliette/Ephemera/Followspot/Mondegreen/Parergon/Guillotine/Flashpan/Clepsydra/Springe/Deadlight/Damper/Sounder, NOT millimeter-slider or woodworking leftover. This is specifically: ESC-prefixed CSI keys dead in the 2.1.269 composer while single-byte keys still type.

The platen should stay **keyed** (HOLD: CSI keys act; cursor moves; composing key combines — the good path). Instead ESC-CSI were **deadkeyed** after an **esc-csi-dead**.

Primary:

- [anthropics/claude-code#93788](https://github.com/anthropics/claude-code/issues/93788) (OPEN). Title: `2.1.269: all ESC-sequence keys (arrows, Home, End) dead in the composer; single-byte keys unaffected; 2.1.268 is fine`. Environment: macOS arm64, AbsoluteTelnet over SSH, TERM xterm-256color, tui fullscreen (set since 2026-07-30; not the variable), no keybindings.json, no vim mode. On 2.1.269 every key that sends an ESC-prefixed escape/CSI sequence is dead in the composer; every single-byte key still works. Reverting to 2.1.268 restores them with nothing else changed. Dead: Left/Right/Up/Down (ESC [ D/C/A/B), Home/End (ESC [ H/F). Still working: Backspace 0x7F, Ctrl-A/E/B/F/P/N and other single control bytes. Fail silently — no echo, cursor does not move. Same terminal `cat -v` shows CSI intact; only Claude Code fails to act. `/exit` + `--continue` still dead; binary symlink swap 2.1.268↔2.1.269 in same tab proves build not session state. Workaround: Ctrl-B/F/A/E still move cursor. Cousins cite-only (distinct, do not treat as same bug): #88249 (TUI raw mode after SIGCONT), #91142 (wheel becomes arrows without mouse tracking). Backups cite-only (next focus only — do not auto-pick): #93801 #93798 #93786 #93778 #93800 #93795 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782.

21:50 deadkey: a typographic dead-key / typewriter platen booth for #93788. Idle **keyed** / seeded **deadkeyed** / path **esc-csi-dead**. Score deadkey or admit keyed.

Score deadkey or admit keyed.

Idle word: **keyed** (HOLD: CSI keys act; cursor moves; composing key combines — the hold/good path). HOLD aliases: keyed, composed, resolved, cursor-moves. Seeded word: **deadkeyed** / #93788 (ESC-CSI dead). Path word: **esc-csi-dead**. Product score: **deadkey**. Never idle gleaned / orphaned / gleaner / unreaped-ampersand / live / schismed / schism / resume-while-live / intact / rasured / rasure / creation-time-flip / swept / ashpanned / ashpan / orphan-jsonl / credentialed / outridden / outrider / early-connect / attested / necrologized / necrology / incomplete-listing / named / innominate / icon-only / lit / snuffed / snuffer / ganged-or / pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / stop-dirty / galley / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / eidolon or seeded schismed / rasured / ashpanned / outridden / necrologized / blank / snuffed / swapped / collided / billed / residual / ridden / dark / misfired / dammed / becalmed / raced.

Phrase: **Score deadkey or admit keyed.**

- **keyed** = IDLE: HOLD; CSI keys act; cursor moves; composing key combines
- **deadkeyed** = #93788 seeded path: ESC-CSI never resolve on the platen
- **deadkey** = product score word for the typographic dead-key platen
- **esc-csi-dead** = path word: ESC-prefixed sequences never resolve
- **hold** = HOLD alias for idle keyed
- **csi-left** = Left ESC [ D dead in the composer
- **csi-right** = Right ESC [ C dead
- **csi-up** = Up ESC [ A dead
- **csi-down** = Down ESC [ B dead
- **home-end** = Home/End ESC [ H/F dead
- **single-byte-ok** = Backspace 0x7F and Ctrl-A/E/B/F/P/N still type
- **silent-fail** = no echo; cursor does not move
- **binary-swap** = 2.1.268↔2.1.269 symlink swap in the same tab — build not session state
- **fullscreen-tui** = tui fullscreen set since 2026-07-30; not the variable
- **has-repro** = published shape: ESC-CSI dead on 2.1.269; single-byte ok; cat -v intact
- **cousins** = cite-only #88249 #91142 — do not rebuild
- **backups** = cite-only #93801 #93798 #93786 #93778 #93800 #93795 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 — do not auto-pick
- **fixtures** = carbon platen / ivory paper / dead-key lever / mute-red ribbon / brass typebar / CSI chips / 0x7F / silent-fail / binary-swap / cat -v / fullscreen TUI
- **walk** = published idle keyed → esc-csi-dead → deadkeyed → deadkey

Verdicts: keyed, deadkeyed, deadkey, esc-csi-dead, hold, csi-left, csi-right, csi-up, csi-down, home-end, single-byte-ok, silent-fail, binary-swap, fullscreen-tui, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **deadkeyed** / **deadkey** or already **keyed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): fullscreen/TUI input path in 2.1.269 stopped recognizing CSI/ESC-prefixed sequences while single-byte readline still works. Invite verify against #93788 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93788](https://github.com/anthropics/claude-code/issues/93788)
- Cite-only cousins: #88249 (TUI raw mode after SIGCONT). Distinct: this booth encodes ESC-CSI keys dead in the 2.1.269 composer, not SIGCONT raw-mode loss. #91142 (wheel becomes arrows without mouse tracking). Distinct: here CSI arrows themselves are dead; the wheel is not the subject. Do not rebuild.
- Backups (data only; next focus only — do not auto-pick): #93801, #93798, #93786, #93778, #93800, #93795, #93766, #93764, #93754, #93751, #93744, #93772, #93770, #93777, #93782

What happened (from the issue text — do not invent):

- OPEN
- Environment: macOS arm64, AbsoluteTelnet over SSH, TERM xterm-256color, tui fullscreen (set since 2026-07-30; not the variable), no keybindings.json, no vim mode
- On 2.1.269 every key that sends an ESC-prefixed escape/CSI sequence is dead in the composer
- Every single-byte key still works
- Reverting to 2.1.268 restores them with nothing else changed
- Dead: Left/Right/Up/Down (ESC [ D/C/A/B), Home/End (ESC [ H/F)
- Still working: Backspace 0x7F, Ctrl-A/E/B/F/P/N and other single control bytes
- Fail silently — no echo, cursor does not move
- Same terminal `cat -v` shows CSI intact; only Claude Code fails to act
- `/exit` + `--continue` still dead
- Binary symlink swap 2.1.268↔2.1.269 in the same tab proves build not session state
- Workaround: Ctrl-B/F/A/E still move cursor

Problem found: ON 2.1.269 EVERY ESC-PREFIXED CSI KEY IS DEAD IN THE COMPOSER WHILE SINGLE-BYTE KEYS STILL TYPE.

Why this solution: living catalog page + node diagnostic encoding idle **keyed** / seeded **deadkeyed** / path **esc-csi-dead** so operators can score whether the booth is a **deadkey** or already **keyed**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Composer should act on ESC-prefixed CSI sequences (arrows, Home, End) as it did in 2.1.268
2. Single-byte keys should continue to type (already do)
3. A dead CSI key should not fail silently — cursor should move or the sequence should be visible

## Why not a clone

This is specifically: **ESC-PREFIXED CSI KEYS DEAD IN THE 2.1.269 COMPOSER WHILE SINGLE-BYTE KEYS STILL TYPE.**

Novel paradigm: typographic dead-key / typewriter platen booth — a composing key that should combine, but here ESC-CSI never resolve.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat/field leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage to a LIVE Workflow agent resumes a second copy). Different defect. NOT twin glass / dual-writer / ecclesiastical schism. Do not reuse live / schismed / resume-while-live.

**NOT Rasure/#93791** (`~/.claude` wipe + CreationTime flip). Different defect. NOT parchment rasure / wholesale recreate. Do not reuse intact / rasured / creation-time-flip.

**NOT Ashpan/#93780** (delete_session leftover jsonl). Different defect. NOT industrial grate / ashpan / foundry. Do not reuse swept / ashpanned / orphan-jsonl.

**NOT Outrider/#93776** (headersHelper timing race). Different defect. NOT cavalry outrider / dispatch-rider / sealed pouch. Do not reuse credentialed / outridden / early-connect.

**NOT Necrology/#93774** (incomplete `/models` listing asserted as death). Different defect. NOT parish necrology / death-register / incomplete listing. Do not reuse attested / necrologized / incomplete-listing.

**NOT Innominate/#93769** (Send/Stop empty accessible name). Different defect. NOT innominate nameplate / blank-escutcheon. Do not reuse named / icon-only.

**NOT Snuffer/#93746** (`enableArtifact: false` kills scratchpad). Different defect. NOT candle-snuffer / taper / ganged OR. Do not reuse lit / snuffed / ganged-or.

**NOT Changeling/#93757** (remote reconnect discards `/model`). Different defect. NOT fairy-court / cradle-swap. Do not reuse pledged / swapped / remote-reattach.

**NOT Homograph/#93743** (non-ASCII path slug collision). Different defect. NOT lexicographer / headword / lemma. Do not reuse distinct / collided / lossy-slug.

**NOT Galley/#93745** (Stop dirty-tree full-turn bill). Different defect. NOT printer’s tray / unbound sheets. Do not reuse dry / billed / stop-dirty.

**NOT Aphonia / Muzzle / Escutcheon / Lacuna / Annunciator / Tocsin / Oubliette / Ephemera / Followspot / Mondegreen / Parergon / Guillotine / Flashpan / Clepsydra / Springe / Deadlight / Damper / Sounder**. Different defects. Do not rebuild.

Do NOT rename Deadkey to any existing catalog slug. Catalog currently has 314 products; Deadkey is #315 after Gleaner #314.
Do NOT reuse idle gleaned / orphaned / live / schismed / intact / rasured / swept / ashpanned / credentialed / outridden / attested / necrologized / named / innominate / lit / snuffed / pledged / swapped / distinct / collided / dry / billed / scraped / fresh / residual / plain / ridden / dark / due / flowing / underway / seated / tip / stale / eidolon.

Display here is **Special Elite**. Body is **IBM Plex Sans**. Mono is **IBM Plex Mono**.

Different surface: ESC-CSI dead in the 2.1.269 composer vs unreaped Bash `&` jobs vs dual-writer resume of a still-running workflow agent vs wholesale `~/.claude` recreate vs leftover spawned-child jsonl.

Different UI: carbon platen / ivory paper / dead-key lever / mute-red ribbon / brass typebar / CSI chips / 0x7F / silent-fail ribbon / binary-swap stamp / cat -v tape / fullscreen TUI badge. Special Elite / IBM Plex Sans / IBM Plex Mono. Platen / ivory / carbon / ribbon / brass. NOT wheat field. NOT twin glass. NOT parchment. NOT foundry grate.

Different verbs: Admit keyed, Score deadkey, Walk esc-csi-dead, Compare keyed / deadkeyed, Pin idle keyed, Pin seeded deadkeyed, Pin esc-csi-dead, Hold the keyed.

Different idle: **keyed**. Different #93788 seeded path: **deadkeyed**. HOLD: **keyed** / **hold**. ALARM: **deadkeyed** / **deadkey** / **esc-csi-dead** / **csi-left**. Path: **esc-csi-dead**.

## How to score

```bash
node --test projects/deadkey/deadkey.test.mjs
node projects/deadkey/deadkey.mjs projects/deadkey/data/deadkeyed.json
echo '{"seed":"deadkeyed"}' | node projects/deadkey/deadkey.mjs
```

Open the living card at `projects/deadkey/index.html` (or the live path `/deadkey/`). Buttons: Admit keyed, Score deadkey, Walk esc-csi-dead, Compare keyed / deadkeyed, Pin idle keyed, Pin seeded deadkeyed, Pin esc-csi-dead, Hold the keyed. Toggle chips for: esc-csi-dead, csi-left, single-byte-ok, silent-fail, binary-swap, fullscreen-tui — the score flips. Lay a fixture JSON on the platen blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s esc-csi-dead walk from the published #93788 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/deadkey/
- Folder: `projects/deadkey/`
