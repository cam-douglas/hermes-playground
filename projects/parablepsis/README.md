# Parablepsis

A **paleography / collation-desk / apparatus-criticus booth** — cool vellum, indigo ink, oxblood lemma, brass folio numbers, a scholarly edition table where the collator's eye skips and the Latin-1 exemplar is mangled. Fonts **Cormorant Garamond** (display) + **Source Serif 4** (body) + **IBM Plex Mono** (chips). Palette: cool vellum `#E2E6EC`, indigo ink `#1F2B4D`, oxblood lemma `#7C2434`, brass folio `#B8944A`, slate `#4D5A6A`, ink `#1A2034`. Fresh trio — not Demesne's UnifrakturMaguntia/Epilogue/Inconsolata, not Cartouche's Cinzel, not Mojibake's compositor faces. NOT Demesne/#93989. NOT Cartouche/#93772. NOT Attaint/#93821. NOT Oriel/#93809. NOT Anarthria/#93782. NOT Trismus/#93823. NOT Foundling/#93889. NOT Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma. Completely different UI/UX/metaphor. This is specifically: **LATIN-1 EDIT WIPE — EDIT/WRITE UTF-8-DECODES LATIN-1/WINDOWS-1252 PHP AND SILENTLY WIPES NON-ASCII BYTES ACROSS THE WHOLE FILE.**

The folio should stay **diplomatic** (HOLD: byte-exact / preserve original). Instead the booth was **parablepsis** after a **latin1-edit-wipe**.

Primary:

- [anthropics/claude-code#93954](https://github.com/anthropics/claude-code/issues/93954) (OPEN). Title: `[BUG] Byte corruption of Latin-1/Windows-1252 single-byte characters`. Labels: bug, has-repro, platform:macos, area:tools. Created 2026-09-13. PHP/legacy web files store special characters (¢, ½, •, ü, smart quotes/dashes) as raw single-byte Latin-1/Windows-1252, matching `charset=iso-8859-1` (browsers render 0x80–0x9F as Windows-1252 per WHATWG). A raw byte like `0xA2` (¢) is not valid UTF-8 alone. Claude Code Edit/Write that reads the file as UTF-8 text and writes it back silently replaces every undecodable byte with the Unicode replacement character — corruption hits EVERY other special character elsewhere in the file, not just the edited line. Confirmed 2026-09-12: 162 characters across 11 files between 2026-05-25 and 2026-09-11; several introducing commits Claude-Code-authored; live Edit meant to fix one line wiped every other correctly-restored byte. Repro: create PHP with `<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />` and ¢/½ strings; ask Claude to edit (add a comment); view saved file — special chars corrupted. Cousin cite-only: #93848 Mojibake (U+FFFD of multibyte Korean in CLAUDE.md reaching the API — read-path, not Edit/Write of Latin-1 PHP). Backups cite-only (next focus only — do not auto-pick): #93770 #93777 #93811 #93924 #93925 #93967 #93957 #93987. Stay off Parablepsis/Demesne/Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis/Tessera/Mojibake paradigms.

23:50 parablepsis: a paleography / collation-desk / apparatus-criticus booth for #93954. Edit/Write UTF-8-decodes Latin-1/Windows-1252 PHP files and silently wipes non-ASCII bytes (¢ ½ • ü) across the whole file — 162 chars / 11 files confirmed. Idle **diplomatic** / seeded **parablepsis** / path **latin1-edit-wipe**. Score parablepsis or admit diplomatic.

Score parablepsis or admit diplomatic.

Idle word: **diplomatic** (HOLD: byte-exact / preserve original). HOLD aliases: diplomatic, byte-exact, latin1-preserved, charset-safe, no-rewrite. Seeded word: **parablepsis** / #93954 (the Latin-1 Edit/Write wipe). Path word: **latin1-edit-wipe**. Product score: **parablepsis**. Never idle demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / singular / equalized / legible / calibrated / tethered / engaged / flush / candid or seeded demesne / cartouche / attaint / oriel / anarthria / trismus / foundling / crasis / tessera / mojibake / scissel / feoffee / apograph / airlock.

Phrase: **Score parablepsis or admit diplomatic.**

- **diplomatic** = IDLE: HOLD; byte-exact Latin-1 preserved; the exemplar is not rewritten
- **parablepsis** = #93954 seeded path and product score: Edit/Write UTF-8-decodes and wipes
- **latin1-edit-wipe** = path word: collator's eye skips; Latin-1 bytes seen as invalid UTF-8
- **hold** = HOLD alias for idle diplomatic
- **byte-exact** = HOLD alias: preserve original bytes
- **latin1-preserved** = HOLD alias: ¢ ½ • ü stay single-byte
- **charset-safe** = HOLD alias: iso-8859-1 files are not rewritten
- **no-rewrite** = HOLD alias: Edit/Write does not UTF-8-decode then re-encode
- **replacement-char** = every undecodable byte becomes U+FFFD
- **whole-file-wipe** = corruption hits every other special character elsewhere in the file
- **latin1-byte** = a raw byte like `0xA2` (¢) is not valid UTF-8
- **windows-1252** = browsers render 0x80–0x9F as Windows-1252 per WHATWG
- **iso-8859-1** = `charset=iso-8859-1` on PHP/legacy web files
- **edit-write-decode** = reads as UTF-8 text and writes it back
- **php-legacy** = PHP/legacy web files with special characters
- **confirmed-162** = 162 characters across 11 files, 2026-05-25 to 2026-09-11
- **live-edit-wipe** = live Edit meant to fix one line wiped every other restored byte
- **landing** = collation-desk landing / folio sill
- **has-repro** = published shape: macOS / CLI 2.1.269 / charset=iso-8859-1 / ¢ ½ wiped
- **cousins** = cite-only #93848 Mojibake U+FFFD read-path — do not conflate
- **backups** = cite-only #93770 #93777 #93811 #93924 #93925 #93967 #93957 #93987 — do not auto-pick
- **fixtures** = cool vellum / indigo ink / oxblood lemma / brass folio
- **walk** = published idle diplomatic → latin1-edit-wipe → parablepsis

Verdicts: diplomatic, parablepsis, latin1-edit-wipe, hold, byte-exact, latin1-preserved, charset-safe, no-rewrite, replacement-char, whole-file-wipe, latin1-byte, windows-1252, iso-8859-1, edit-write-decode, php-legacy, confirmed-162, live-edit-wipe, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **parablepsis** or already **diplomatic**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Edit/Write decode-as-UTF-8 then re-encode. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93954](https://github.com/anthropics/claude-code/issues/93954)
- Cousins: #93848 cite-only (Mojibake — intermittent U+FFFD of multibyte Korean in CLAUDE.md reaching the API / prompt-cache. Read-path, not Edit/Write of Latin-1 PHP). Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #93770, #93777, #93811, #93924, #93925, #93967, #93957, #93987

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has-repro, platform:macos, area:tools
- Created 2026-09-13
- Claude Code CLI v2.1.269, macOS, Terminal.app, Sonnet (default)
- PHP files declare `charset=iso-8859-1` and store ¢ ½ • ü as raw Latin-1/Windows-1252
- A raw byte like `0xA2` (¢) is not valid UTF-8 on its own
- Edit/Write reads as UTF-8 text and writes it back; undecodable bytes become U+FFFD
- Corruption hits every other special character elsewhere in the file, not just the edited line
- Confirmed 2026-09-12: 162 characters across 11 files between 2026-05-25 and 2026-09-11
- Several introducing commits Claude-Code-authored; live one-line Edit wiped restored bytes
- Expected (issue text only): do not silently corrupt; preserve byte-exact or refuse with a warning

Problem found: LATIN-1 EDIT WIPE — EDIT/WRITE UTF-8-DECODES LATIN-1/WINDOWS-1252 PHP AND SILENTLY WIPES NON-ASCII BYTES ACROSS THE WHOLE FILE.

Why Parablepsis: in textual criticism, parablepsis is an eye-skip / mis-seeing error when copying — the collator's eye jumps and the exemplar is mangled. Here Edit/Write "eyes" Latin-1 bytes as invalid UTF-8 and wipes them. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: living catalog page + node diagnostic encoding idle **diplomatic** / seeded **parablepsis** / path **latin1-edit-wipe** so operators can score whether the booth is **parablepsis** or already **diplomatic**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Preserve Latin-1/Windows-1252 bytes byte-exact (diplomatic transcription) when Edit/Write touches the file
2. Or refuse to edit a non-UTF-8 file with a clear warning instead of silently rewriting
3. Do not silently substitute U+FFFD for undecodable single-byte characters (¢ ½ • ü)
4. An Edit meant to change one line must not wipe every other special character elsewhere in the file
5. Legacy PHP/web files declaring charset=iso-8859-1 should survive Edit/Write without whole-file corruption

## Why not a clone

This is specifically: **LATIN-1 EDIT WIPE — EDIT/WRITE UTF-8-DECODES LATIN-1/WINDOWS-1252 PHP AND SILENTLY WIPES NON-ASCII BYTES ACROSS THE WHOLE FILE.**

Novel paradigm: paleography / collation desk / apparatus criticus — cool vellum, indigo ink, oxblood lemma, brass folio numbers, witness columns, eye-skip. New issue, new paradigm (latin1-edit-wipe), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Mojibake/#93848** (intermittent U+FFFD of multibyte Korean in CLAUDE.md reaching the API / prompt-cache — read-path, not Edit/Write of Latin-1 PHP). Different defect. Do not reuse verbatim / mojibaked / fffd-spall.

**NOT Crasis/#93960** (non-injective store slug). Different defect. Do not reuse injective / crased / store-slug-collide.

**NOT Apograph/#93859** (Desktop reopen forks a full transcript copy). Different defect. Do not reuse singular / apographed / reopen-fork.

**NOT Demesne/#93989** (bwrap binds entire `/home` instead of `$HOME`). Different defect. NOT manor charter. Do not reuse demesned / demesne / home-bind-overreach.

**NOT Cartouche/#93772** (ask-for-diagram defaults to a section-summary poster). Different defect. NOT Egyptian name-oval. Do not reuse diagrammed / cartouche / section-poster.

**NOT Attaint/#93821** (cyber-safeguard false-positive; one flag stains the session). Different defect. NOT court-roll attainder. Do not reuse unattainted / attaint / session-attainder.

**NOT Oriel/#93809** (macOS Desktop pop-out/maximised plan window does not reflow). Different defect. Do not reuse reflowed / oriel / plan-no-reflow.

**NOT Anarthria/#93782** (Wispr Flow clipboard+Ctrl+V silently dropped). Different defect. Do not reuse articulate / anarthria / dictation-paste-drop.

**NOT Trismus/#93823** (macOS UNUserNotification / XPC lock-order deadlock). Different defect. Do not reuse limber / trismus / notif-xpc-deadlock.

**NOT Foundling/#93889** (subagent lifecycle does not reap `run_in_background` Bash). Different defect. Do not reuse filiated / foundling / subagent-bash-outlive. Skip Foundling-adjacent #93996 (orphaned bash).

**NOT Tessera/#93776-family** (macOS version-named binary path → TCC). Different defect. Do not reuse unitary / tessellated / version-path-tcc.

**NOT Scissel/#93915** (Windows Bash argv `-c` 8203 truncation). Different defect. Do not reuse plenary / scisselled / argv-trunc.

**NOT Feoffee/#93863** (preview_start getcwd EPERM / FDA inheritance). Different defect. Do not reuse vested / unseised / preview-eperm.

**NOT Airlock/#93862** (sandbox socat listener race before first network call). Different defect. Do not reuse equalized / blown / socat-race.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. Do not reuse legible / scotomized / command-args-blind.

Do NOT rename Parablepsis to any existing catalog slug. Catalog currently has 339 products; Parablepsis is #340 after Demesne #339.
Do NOT reuse idle demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary or seeded demesne / cartouche / attaint / oriel / anarthria / trismus / foundling / crasis / tessera / mojibake.

Display here is **Cormorant Garamond**. Body is **Source Serif 4**. Mono is **IBM Plex Mono**.

Different surface: latin1-edit-wipe (Edit/Write UTF-8-decode of Latin-1 PHP) vs home-bind overreach vs wrong diagram type vs session-flag contamination vs plan-window no-reflow vs dictation paste swallow vs Mojibake read-path Korean U+FFFD.

Different UI: cool vellum / indigo ink / oxblood lemma / brass folio / collation witnesses / apparatus criticus / eye-skip pulse. Cormorant Garamond / Source Serif 4 / IBM Plex Mono. NOT parchment / oak / heraldic green. NOT limestone / lapis / gold. NOT compositor / foul-proof / geta-tofu.

Different verbs: Admit diplomatic, Score parablepsis, Walk latin1-edit-wipe, Compare diplomatic / parablepsis, Pin idle diplomatic, Pin seeded parablepsis, Pin latin1-edit-wipe, Open the folio.

Different idle: **diplomatic**. Different #93954 seeded path: **parablepsis**. HOLD: **diplomatic** / **hold**. ALARM: **parablepsis** / **latin1-edit-wipe** / **replacement-char** / **whole-file-wipe**. Path: **latin1-edit-wipe**.

## How to score

```bash
node --test projects/parablepsis/parablepsis.test.mjs
node projects/parablepsis/parablepsis.mjs projects/parablepsis/data/parablepsis.json
echo '{"seed":"parablepsis"}' | node projects/parablepsis/parablepsis.mjs
```

Open the living card at `projects/parablepsis/index.html` (or the live path `/parablepsis/`). Buttons: Admit diplomatic, Score parablepsis, Walk latin1-edit-wipe, Compare diplomatic / parablepsis, Pin idle diplomatic, Pin seeded parablepsis, Pin latin1-edit-wipe, Open the folio, Score booth. Toggle chips for: latin1-edit-wipe, replacement-char, whole-file-wipe, iso-8859-1 — the score flips. Lay a fixture JSON on the collation desk. `?embed=1` hides chrome.

The booth reconstructs the reporter’s `charset=iso-8859-1` / ¢ ½ / U+FFFD whole-file wipe walk from the published #93954 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/parablepsis/
- Folder: `projects/parablepsis/`
