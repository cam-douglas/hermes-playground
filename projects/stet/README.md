# Stet

A **copy-desk / blue-pencil / galley-proof margin-mark booth** — the proofreader's "let it stand" in the margin. Fonts **Playfair Display** (display) + **Figtree** (body) + **Fragment Mono** (mono; swapped from IBM Plex Mono to avoid the Blindside clash). Palette: cream paper `#F4EFE6`, ink `#1C1917`, blue pencil `#2B5EA7`, margin stet red `#B33A3A`, graphite `#57534E`, quiet `#A8A29E`. Margin rules, stet. underlines, blue-pencil strokes, proof slip cards. NOT Blindside (sideline scout / turf), NOT Interdict (papal/vellum), NOT Simplex (radio chassis), NOT Deadkey (typewriter platen), NOT Gleaner (wheat leftover-harvest), NOT Schism (twin glass), NOT Rasure (parchment scrape), NOT Ashpan (foundry ashpan), NOT Sourdine (practice mute), NOT Sostenuto (mic HAL stall), NOT Aphonia, NOT Tabula, NOT Rescript / Cachet / Ukase (wax seals). This is specifically: **DICTATION BUFFER RESTORES OVER MANUAL COMPOSER EDITS ON MIC RESUME.**

The galley should stay **stetted** (HOLD: user edit stands; box + cursor are source of truth; mic appends to current contents). Instead the booth was **rewound** after a **mic-resume-wipe**.

Primary:

- [anthropics/claude-code#93778](https://github.com/anthropics/claude-code/issues/93778) (OPEN). Title: `Dictation: speaking after a manual edit discards the edit and resumes from the old text`. Labels: bug, has repro, platform:windows, area:a11y, area:desktop. Claude Code desktop (Windows 11 Pro 26200) dictation / voice input in the message box. Dictate a sentence, click in and correct it by hand without stopping the microphone, then speak again — the manual edit is wiped; the box is restored to the text dictation last produced, and the new speech is appended to *that*. Paste text, Shift+Enter blank lines, start speaking — the blank lines are discarded and speech is glued onto the pasted text. Requested fix (scoring narrative only — do NOT implement a Claude Code fix): treat the text box as the source of truth; on resume, append at the cursor to current contents including whitespace. Cousins cite-only (distinct, do not treat as same bug): #91202, #93165, #93636, #93782. Backups cite-only (next focus only — do not auto-pick): #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 #93800 #93809 #93807 #93808 #93795 #93821 #93811 #93834 #93823 #93825 #93779.

01:50 stet: a copy-desk / blue-pencil / proof-margin booth for #93778. Idle **stetted** / seeded **rewound** / path **mic-resume-wipe**. Score stet or admit stetted.

Score stet or admit stetted.

Idle word: **stetted** (HOLD: user edit stands; box + cursor are source of truth; mic appends to current contents). HOLD aliases: stetted, box-source-of-truth, cursor-honored, edit-stands. Seeded word: **rewound** / #93778 (dictation restored previous buffer over manual edits / whitespace). Path word: **mic-resume-wipe**. Product score: **stet**. Never idle sighted / blindsided / blindside / compare-ref-unreachable / scoped / interdicted / interdict / chrome-prohibit-bleed / duplex / simplexed / simplex / mobile-uplink-silent / keyed / deadkeyed / deadkey / esc-csi-dead / gleaned / orphaned / gleaner / unreaped-ampersand / live / schismed / schism / resume-while-live / intact / rasured / rasure / creation-time-flip / swept / ashpanned / ashpan / orphan-jsonl / voiced / muted / sourdine / mid-narration / released / frozen / sostenuto / tabula / rescript / cachet / ukase.

Phrase: **Score stet or admit stetted.**

- **stetted** = IDLE: HOLD; user edit stands; box + cursor are source of truth
- **rewound** = #93778 seeded path: dictation restored the previous buffer over the live box
- **stet** = product score word for the copy-desk booth
- **mic-resume-wipe** = path word: resume appends to the old buffer, not the cursor
- **hold** = HOLD alias for idle stetted
- **manual-edit-wiped** = hand-edit discarded when speech resumes
- **blank-lines-discarded** = Shift+Enter blanks discarded; speech glued onto pasted text
- **box-source-of-truth** = requested hold: treat the live box as truth
- **buffer-restore** = prior dictation buffer written back over the galley
- **cursor-ignored** = new speech does not begin where the cursor is
- **has-repro** = published shape: Windows desktop dictation; edit wiped; blanks discarded
- **cousins** = cite-only #91202 #93165 #93636 #93782 — do not rebuild
- **backups** = cite-only #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 #93800 #93809 #93807 #93808 #93795 #93821 #93811 #93834 #93823 #93825 #93779 — do not auto-pick
- **fixtures** = cream paper / margin rule / blue pencil / stet. underline / proof slip
- **walk** = published idle stetted → mic-resume-wipe → rewound → stet

Verdicts: stetted, rewound, stet, mic-resume-wipe, hold, manual-edit-wiped, blank-lines-discarded, box-source-of-truth, buffer-restore, cursor-ignored, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **rewound** / **stet** or already **stetted**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): dictation keeps an internal buffer and on resume overwrites the composer from that buffer instead of reading current DOM/value + selection. Invite verify against #93778 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93778](https://github.com/anthropics/claude-code/issues/93778)
- Cite-only cousins: #91202 (cannot append second dictation). Distinct: here the second speech does land, but it lands on a restored prior buffer. #93165 (mic button disappears once text). Distinct: the mic stays available; the wipe is on resume. #93636 (dictation audio no transcript). Distinct: speech is transcribed; the wrong buffer is restored. #93782 (dictation-tool paste WSL regression). Distinct: this is desktop Windows message-box dictation, not a WSL paste path. Do not rebuild.
- Backups (data only; next focus only — do not auto-pick): #93766, #93764, #93754, #93751, #93744, #93772, #93770, #93777, #93782, #93800, #93809, #93807, #93808, #93795, #93821, #93811, #93834, #93823, #93825, #93779

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:windows, area:a11y, area:desktop
- Environment: Claude Code desktop app (Windows 11 Pro 26200); dictation / voice input in the message box; Jabra Link 390 USB headset
- Problem 1: dictate a sentence → click in and edit by hand without stopping the mic → speak again → manual edit is wiped; box restores the last dictation buffer and appends new speech to that
- Workaround: switch the microphone off before touching the keyboard
- Problem 2: paste text → Shift+Enter blank lines → start speaking → blank lines discarded; speech glued onto pasted text
- Same requested fix: treat the text box as source of truth; on resume, append at the cursor to current contents including whitespace
- Problem 3: words dropped and substituted often enough that a sentence frequently has to be corrected before sending, which then runs straight into Problem 1
- Heavy daily dictation user — long technical sessions, most input dictated rather than typed

Problem found: DICTATION BUFFER RESTORES OVER MANUAL COMPOSER EDITS ON MIC RESUME.

Why this solution: living catalog page + node diagnostic encoding idle **stetted** / seeded **rewound** / path **mic-resume-wipe** so operators can score whether the booth is a **stet** or already **stetted**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. New speech is appended to the text as it now stands after a manual edit
2. New speech begins where the cursor is, after any blank lines the user added
3. Dictation treats the text box as the source of truth and never restores a previous dictation buffer over the user's own edits or whitespace

## Why not a clone

This is specifically: **DICTATION BUFFER RESTORES OVER MANUAL COMPOSER EDITS ON MIC RESUME.**

Novel paradigm: copy-desk / blue-pencil / galley-proof margin mark — "let it stand."

**NOT Blindside/#93786** (diff pane cannot see committed worktree work; compare ref unreachable). Different defect. NOT sideline-scout / night turf / floodlight. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum / wax seal / diocese. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Simplex/#93801** (mobile Remote Control send vanishes while desktop→phone still reads). Different defect. NOT radio chassis / RX downlink / TX uplink / PTT. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen / dead-key lever. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat/field leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage to a LIVE Workflow agent resumes a second copy). Different defect. NOT twin glass / dual-writer. Do not reuse live / schismed / resume-while-live.

**NOT Rasure/#93791** (`~/.claude` wipe + CreationTime flip). Different defect. NOT parchment rasure / wholesale recreate. Do not reuse intact / rasured / creation-time-flip.

**NOT Ashpan/#93780** (delete_session leftover jsonl). Different defect. NOT industrial grate / ashpan / foundry. Do not reuse swept / ashpanned / orphan-jsonl.

**NOT Sourdine** (practice mute / mid-narration mute). **NOT Sostenuto** (mic HAL stall hold). **NOT Aphonia**. **NOT Tabula**. **NOT Rescript / Cachet / Ukase** (wax seals). Different defects. Do not reuse their metaphors or idle/seed words. Do not rebuild.

Do NOT rename Stet to any existing catalog slug. Catalog currently has 318 products; Stet is #319 after Blindside #318.
Do NOT reuse idle sighted / blindsided / scoped / interdicted / duplex / simplexed / keyed / deadkeyed / gleaned / orphaned / live / schismed / intact / rasured / swept / ashpanned / voiced / muted / released / frozen.

Display here is **Playfair Display**. Body is **Figtree**. Mono is **Fragment Mono**.

Different surface: desktop Windows dictation buffer-over-edit vs worktree compare-ref gap vs chrome MCP jurisdiction bleed vs mobile Remote Control uplink vanish vs ESC-CSI dead composer vs unreaped Bash `&` jobs.

Different UI: cream paper / margin rule / blue pencil / stet. underline / proof slip. Playfair Display / Figtree / Fragment Mono. Cream / ink / blue pencil / stet red / graphite. NOT night turf. NOT papal vellum. NOT radio chassis. NOT typewriter platen. NOT wheat field. NOT twin glass. NOT parchment scrape. NOT foundry grate.

Different verbs: Admit stetted, Score stet, Walk mic-resume-wipe, Compare stetted / rewound, Pin idle stetted, Pin seeded rewound, Pin mic-resume-wipe, Hold the stetted.

Different idle: **stetted**. Different #93778 seeded path: **rewound**. HOLD: **stetted** / **hold**. ALARM: **rewound** / **stet** / **mic-resume-wipe** / **manual-edit-wiped**. Path: **mic-resume-wipe**.

## How to score

```bash
node --test projects/stet/stet.test.mjs
node projects/stet/stet.mjs projects/stet/data/rewound.json
echo '{"seed":"rewound"}' | node projects/stet/stet.mjs
```

Open the living card at `projects/stet/index.html` (or the live path `/stet/`). Buttons: Admit stetted, Score stet, Walk mic-resume-wipe, Compare stetted / rewound, Pin idle stetted, Pin seeded rewound, Pin mic-resume-wipe, Hold the stetted. Toggle chips for: mic-resume-wipe, manual-edit-wiped, blank-lines-discarded, buffer-restore, cursor-ignored — the score flips. Lay a fixture JSON on the proof slip. `?embed=1` hides chrome.

The booth reconstructs the reporter’s mic-resume-wipe walk from the published #93778 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/stet/
- Folder: `projects/stet/`
