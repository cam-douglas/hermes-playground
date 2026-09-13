# Mojibake

A **compositor / foul-proof / geta-tofu print shop booth** — Korean type case, rice-paper galley proof, foul-proof stamp, � tofu tiles in the chase. Fonts **Syne** (display) + **Source Sans 3** (body) + **JetBrains Mono** (chips). Palette: rice-paper `#F4EFE6`, ink `#1A1612`, geta magenta `#C41E6A`, foul-proof amber `#C9892E`, cache-hit teal `#1F6F6A`, slate rule `#3D3832`. NOT Scissel (mint/argv-trunc), NOT Feoffee (feoffment/TCC/preview-eperm), NOT Apograph (reopen-fork), NOT Airlock (socat-race), NOT Scotoma (command-args-blind), NOT Aneroid (wrong-window-ring), NOT Simulacrum (phantom-navigate), NOT Solenoid (warm-before-message), NOT Scotia (decstbm-undershoot), NOT Canard (onedrive-cwd), NOT Stet/Blindside/Interdict/Schism/Gleaner/Waif/Ashpan/Snatch/Disseisin. Completely different UI/UX/metaphor. This is specifically: **WINDOWS EMBEDDED CLAUDE.md UTF-8 CODEPOINT → THREE U+FFFD INTERMITTENTLY, DEFEATING PROMPT CACHE.**

The chase should stay **verbatim** (HOLD: CLAUDE.md UTF-8 reaches the API intact; prompt-cache prefix stable every request). Instead the booth was **mojibaked** after an **fffd-spall**.

Primary:

- [anthropics/claude-code#93848](https://github.com/anthropics/claude-code/issues/93848) (OPEN, has repro). Title: `[BUG] Embedded CLAUDE.md intermittently reaches the API with one multibyte character replaced by three U+FFFD, changing the prompt prefix mid-session and defeating prompt caching (2.1.258, Windows)`. Labels: bug, has repro, platform:windows, area:core. In headless sessions (`claude -p`) on Windows, the text of the user's global `CLAUDE.md` that Claude Code embeds in the first user message (`messages[0].content[0].text`, inside the `<system-reminder>` "Codebase and user instructions are shown below") intermittently arrives at the API with **one multibyte character replaced by three U+FFFD replacement characters**. The file on disk is valid UTF-8 and never changes. Environment: Claude Code 2.1.258 native Windows; Windows 11 22H2 (10.0.22621); PowerShell 7; global `%USERPROFILE%\.claude\CLAUDE.md` 19,597 bytes UTF-8 without BOM, Korean prose; `bytes.decode('utf-8')` in strict mode succeeds. Session form: `claude -p` child sessions with `--allowedTools` (used as workers); API traffic observed through a local proxy set with `ANTHROPIC_BASE_URL` that records `system`, `messages[0]` and the tool names of every outgoing request. Over one 20-turn session, `messages[0].content[0].text` came in two variants differing in exactly one place: clean (14 of 17) `'바람이 불어 창문이 흔들리는 탓에 …'`; corrupted (3 of 17) `'바람이 ���어 창문이 흔들리는 탓에 …'`. `difflib` opcodes `[('replace', 3615, 3616, 3615, 3618)]` — the single character `불` (UTF-8 `EB B6 88`) became three replacement characters. Character index 3615 of the 19,136-character block; UTF-8 byte offset 7,982 inside the block; byte offset 7,665 inside the file. Neither offset is a 4 KiB / 8 KiB / 16 KiB boundary. The position is identical in every corrupted request across four separate sessions; only *whether* a given request is corrupted varies. Clean and corrupted interleave; the file was not modified. Per-request `sid` = first 8 hex chars of `sha256(system + messages[0])`: clean `600ce64a`; corrupted `8fdae59a` (full miss). With corruption on about a fifth of the requests, sessions read 75-76% of input from cache; with a proxy substituting the clean text, the same task reads 91.6% from cache and uncached token volume drops from about 300k to 93k. Cousins cite-only: #40396 (closed; Korean U+FFFD in responses on macOS — request-side vs response-side); #88836 (AskUserQuestion option descriptions: newlines replaced with U+FFFD since 2.1.235). Backups cite-only (next focus only — do not auto-pick): #93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93929 #93924 #93925.

12:50 mojibake: a compositor / foul-proof / geta-tofu booth for #93848. Idle **verbatim** / seeded **mojibaked** / path **fffd-spall**. Score mojibake or admit verbatim.

Score mojibake or admit verbatim.

Idle word: **verbatim** (HOLD: CLAUDE.md UTF-8 reaches the API intact; prompt-cache prefix stable every request). HOLD aliases: verbatim, intact-utf8, cache-hit, prefix-stable, hangul-kept. Seeded word: **mojibaked** / #93848 (Windows embedded CLAUDE.md UTF-8 codepoint → three U+FFFD intermittently). Path word: **fffd-spall**. Product score: **mojibake**. Never idle plenary / vested / singular / equalized / legible / calibrated / tethered / engaged / flush / candid / stetted / sighted / scoped / keyed / gleaned / live / intact / armed / coil-pulled / scisselled / unseised / apographed.

Phrase: **Score mojibake or admit verbatim.**

- **verbatim** = IDLE: HOLD; CLAUDE.md UTF-8 reaches the API intact; prompt-cache prefix stable every request
- **mojibaked** = #93848 seeded path: one Hangul codepoint → three U+FFFD; prefix changes
- **mojibake** = product score word for the compositor / foul-proof booth
- **fffd-spall** = path word: tofu-tile substitution vs hangul-kept sort
- **hold** = HOLD alias for idle verbatim
- **intact-utf8** = HOLD alias: file decode and embed stay UTF-8
- **cache-hit** = HOLD alias: prompt-cache prefix reused
- **prefix-stable** = HOLD alias: messages[0] text identical every request
- **hangul-kept** = HOLD alias: `불` stays `불`
- **clean-variant** = 14 of 17 requests; sid `600ce64a`
- **corrupted-variant** = 3 of 17 requests; sid `8fdae59a`
- **cache-miss** = corrupted prefix → full prompt-cache miss
- **hangul-불** = the single syllable at char index 3615 (UTF-8 `EB B6 88`)
- **has-repro** = published shape: Win 11 22H2 / 2.1.258 / 19,597 bytes / 3615
- **cousins** = cite-only #40396, #88836
- **backups** = cite-only #93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93929 #93924 #93925 — do not auto-pick
- **fixtures** = rice-paper / ink / geta magenta / foul-proof amber
- **walk** = published idle verbatim → fffd-spall → mojibaked → mojibake

Verdicts: verbatim, mojibaked, mojibake, fffd-spall, hold, intact-utf8, cache-hit, prefix-stable, hangul-kept, clean-variant, corrupted-variant, cache-miss, hangul-불, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **mojibaked** / **mojibake** or already **verbatim**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): an encoding-boundary or Windows wchar round-trip on the embed path may substitute three U+FFFD for one Hangul syllable (`불`, UTF-8 `EB B6 88`) at a fixed chase cell that is not a 4/8/16 KiB boundary. The reporter could not find the pattern that decides which request is corrupted. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93848](https://github.com/anthropics/claude-code/issues/93848)
- Cite-only cousins: #40396 (closed; Korean U+FFFD in *responses* on macOS — this report is the *request* side and the embedded instructions file, on Windows); #88836 (AskUserQuestion option descriptions: newlines replaced with U+FFFD since 2.1.235; possibly the same decoding path, different surface). Do not rebuild as separate booths.
- Backups (data only; next focus only — do not auto-pick): #93772, #93770, #93777, #93782, #93889, #93821, #93811, #93809, #93823, #93929, #93924, #93925

What happened (from the issue text — do not invent):

- OPEN, has repro
- Labels: bug, has repro, platform:windows, area:core
- Environment: Claude Code 2.1.258 native Windows; Windows 11 22H2 (10.0.22621); PowerShell 7
- Global `%USERPROFILE%\.claude\CLAUDE.md` 19,597 bytes UTF-8 without BOM, Korean prose; `bytes.decode('utf-8')` strict OK
- Session form: `claude -p` workers; local proxy on `ANTHROPIC_BASE_URL` recording `system` + `messages[0]`
- Two variants of `messages[0].content[0].text` differing in exactly one place
- clean: `'바람이 불어 창문이 흔들리는 탓에 …'` (14 of 17)
- corrupted: `'바람이 ���어 창문이 흔들리는 탓에 …'` (`불` U+BD88 / UTF-8 `EB B6 88` → three U+FFFD)
- `difflib` replace at char index 3615; UTF-8 byte offset 7,982 in the block; 7,665 in the file — NOT a 4/8/16 KiB boundary
- Same position across four sessions; only *whether* a request is corrupted varies; clean and corrupted interleave; file never modified
- Effect: prompt prefix changes → full prompt-cache miss for the whole conversation on corrupted requests
- Cache: 75-76% with corruption vs 91.6% with a proxy substituting the clean text; uncached 300k → 93k

Problem found: WINDOWS EMBEDDED CLAUDE.md UTF-8 CODEPOINT INTERMITTENTLY BECOMES THREE U+FFFD; THE PROMPT-CACHE PREFIX IS NO LONGER STABLE.

Why this solution: living catalog page + node diagnostic encoding idle **verbatim** / seeded **mojibaked** / path **fffd-spall** so operators can score whether the booth is a **mojibake** or already **verbatim**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Stable UTF-8 embed of CLAUDE.md so the prompt prefix is identical every request
2. No intermittent U+FFFD substitution of a Hangul syllable
3. Prompt-cache prefix remains cache-hit across the whole conversation

## Why not a clone

This is specifically: **WINDOWS EMBEDDED CLAUDE.md UTF-8 CODEPOINT → THREE U+FFFD INTERMITTENTLY, DEFEATING PROMPT CACHE.**

Novel paradigm: compositor / foul-proof / geta-tofu print shop — Korean type case, rice-paper proof, foul-proof stamp, tofu tiles in the chase.

**NOT Scissel/#93915** (Windows Bash argv `-c` 8203 truncation / `\\` collapse). Different defect. NOT mint / coin-press / punch-and-scissel. Do not reuse plenary / scisselled / argv-trunc.

**NOT Feoffee/#93863** (preview_start getcwd EPERM despite parent FDA). Different defect. NOT medieval feoffment / livery-of-seisin / chancery. Do not reuse vested / unseised / preview-eperm.

**NOT Apograph/#93859** (Desktop reopen forks a full transcript copy). Different defect. NOT scriptorium / stacked parchment leaves / session-ID wax seals. Do not reuse singular / apographed / reopen-fork.

**NOT Airlock/#93862** (sandbox socat proxy readiness race). Different defect. NOT submarine / spacecraft pressure-lock. Do not reuse equalized / blown / socat-race.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT ophthalmology / Humphrey bowl / perimetry. Do not reuse legible / scotomized / command-args-blind.

**NOT Aneroid/#93901** (VS Code context ring ignores autoCompactWindow). Different defect. NOT aneroid-barometer / instrument-panel / sealed gauge. Do not reuse calibrated / aneroided / wrong-window-ring.

**NOT Simulacrum/#93751** (Claude-in-Chrome hollow MCP success). Different defect. NOT Baudrillard / hyperreality museum. Do not reuse tethered / hollow / phantom-navigate.

**NOT Solenoid/#93754** (Desktop Settings RC toggle fidelity). Different defect. NOT industrial switchgear / solenoid-coil. Do not reuse engaged / inert / warm-before-message.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows). Different defect. NOT limestone / shadow-gap. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd). Different defect. NOT press-room. Do not reuse candid / canarded / onedrive-cwd.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work). Different defect. NOT sideline-scout. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Schism/#93797** (SendMessage resumes a second LIVE workflow agent). Different defect. NOT twin-authority glass. Do not reuse live / schismed / resume-while-live.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs). Different defect. NOT wheat leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Waif** (prior catalog). Different defect. Do not reuse that slug.

**NOT Ashpan/#93780** (delete_session burns ledger, jsonl remains). Different defect. NOT industrial grate. Do not reuse swept / ashpanned / orphan-jsonl.

**NOT Snatch** (prior catalog). Different defect. Do not reuse that slug.

**NOT Disseisin/#93574** (Cowork session home evaporates on VM restart). Different defect. NOT court of novel disseisin / freehold manor roll. Do not reuse seised / disseised / home-evaporated.

Do NOT rename Mojibake to any existing catalog slug. Catalog currently has 329 products; Mojibake is #330 after Scissel #329.
Do NOT reuse idle plenary / vested / unseised / preview-eperm / singular / apographed / reopen-fork / equalized / blown / socat-race / legible / scotomized / command-args-blind / calibrated / aneroided / wrong-window-ring / tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / gleaned / orphaned / inherited / seised / disseised / intact / armed / coil-pulled / scisselled / argv-trunc.

Display here is **Syne**. Body is **Source Sans 3**. Mono is **JetBrains Mono**.

Different surface: Windows embedded CLAUDE.md UTF-8 → three U+FFFD vs argv `-c` truncation vs preview_start getcwd EPERM vs Desktop sidebar reopen session-ID fork vs sandbox socat race vs Stop-condition evaluator vs VS Code context-ring vs Claude-in-Chrome MCP hollow registration vs Settings toggle fidelity vs DECSTBM blank-row undershoot vs VS Code OneDrive spawn mislabel vs Cowork home evaporate.

Different UI: rice-paper / ink / geta magenta / foul-proof amber / cache-hit teal / slate rule / Korean type case / tofu tiles / compositor chase. Syne / Source Sans 3 / JetBrains Mono. NOT slag floor copper die. NOT oak panel parchment. NOT cream parchment scriptorium. NOT navy hull. NOT Humphrey bowl. NOT sealed gauge. NOT museum vitrine. NOT coil-plunger. NOT limestone column. NOT aged newsprint. NOT court of novel disseisin.

Different verbs: Admit verbatim, Score mojibake, Walk fffd-spall, Compare verbatim / mojibaked, Pin idle verbatim, Pin seeded mojibaked, Pin fffd-spall, Ink the forme.

Different idle: **verbatim**. Different #93848 seeded path: **mojibaked**. HOLD: **verbatim** / **hold**. ALARM: **mojibaked** / **mojibake** / **fffd-spall** / **cache-miss**. Path: **fffd-spall**.

## How to score

```bash
node --test projects/mojibake/mojibake.test.mjs
node projects/mojibake/mojibake.mjs projects/mojibake/data/mojibaked.json
echo '{"seed":"mojibaked"}' | node projects/mojibake/mojibake.mjs
```

Open the living card at `projects/mojibake/index.html` (or the live path `/mojibake/`). Buttons: Admit verbatim, Score mojibake, Walk fffd-spall, Compare verbatim / mojibaked, Pin idle verbatim, Pin seeded mojibaked, Pin fffd-spall, Ink the forme. Toggle chips for: fffd-spall, cache-miss, corrupted-variant, hangul-불 — the score flips. Lay a fixture JSON on the rice-paper proof. `?embed=1` hides chrome.

The booth reconstructs the reporter’s 3615 / 7982 / 7665 / `불` → U+FFFD walk from the published #93848 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/mojibake/
- Folder: `projects/mojibake/`
