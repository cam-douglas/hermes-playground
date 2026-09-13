# Crasis

A **manuscript crasis / vowel-fusion / orthographic-collapse booth** — vellum folios, fused ligatures, two path cards collapsing into one store drawer. Fonts **Fraunces** (display) + **Source Sans 3** (body) + **IBM Plex Mono** (chips). Palette: ink `#1A1520`, vellum `#F4ECDF`, cinnabar `#B83A2E`, verdigris `#2F6F5E`. NOT Tessera (mosaic/version-path-tcc), NOT Mojibake (compositor/fffd-spall), NOT Scissel (mint/argv-trunc), NOT Feoffee (feoffment/TCC/preview-eperm), NOT Apograph (reopen-fork), NOT Airlock (socat-race), NOT Scotoma (command-args-blind), NOT Aneroid (wrong-window-ring), NOT Simulacrum (phantom-navigate), NOT Solenoid (warm-before-message), NOT Scotia (decstbm-undershoot), NOT Canard (onedrive-cwd), NOT Stet/Blindside/Interdict/Schism/Homograph. Completely different UI/UX/metaphor. This is specifically: **PER-PROJECT STORE SLUG IS NOT INJECTIVE — TWO PATHS FUSE INTO ONE MEMORY/TRANSCRIPT DRAWER.**

The drawers should stay **injective** (HOLD: one path, one store; two sealed drawers). Instead the booth was **crased** after a **store-slug-collide**.

Primary:

- [anthropics/claude-code#93960](https://github.com/anthropics/claude-code/issues/93960) (OPEN, has repro). Title: `Store slug is not injective: different project paths silently share one memory/transcript directory (the ASCII case from #29471 still reproduces on 2.1.238)`. Labels: bug, has repro, platform:windows, area:core. Checked on Claude Code 2.1.238, Windows 11 (10.0.26200), desktop app. Per-project storage under `~/.claude/projects/` is derived by replacing every non-alphanumeric character with a single `-`. That mapping is not injective. Two collision classes, both live on 2.1.238: (1) Non-alphanumeric collapse — every non-ASCII char becomes one `-`, so only the count survives. `가나다` vs `라마바` (length 3) both → `C--Users-USER-AppData-Local-Temp-clash----`; control `가나다라` (length 4) → `…-clash-----` and does not leak. (2) Separator ambiguity — `ab-cd` vs `ab/cd` (or `a-b` vs `a\b`) both become `…-ab-cd`. This is the #29471 case, still live though that issue was bot-closed COMPLETED. Consequence: MEMORY.md from one project is injected into an unrelated session with no warning (NDA/contract blast radius). Transcripts also pool. Reporter scanned 1,085 stores: 2 stores held more than one real project; one store shared by six Korean client projects. Workaround noted (cite, not a product): `autoMemoryDirectory` isolates memory only; transcripts still pool. Cousins cite-only: #29471, #93743, #7009, #21085, #35162. Backups cite-only (next focus only — do not auto-pick): #93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93924 #93925. Stay off Tessera/Mojibake/Scissel/Feoffee/Apograph/Airlock/Scotoma/Aneroid/Simulacrum/Solenoid/Scotia/Canard/Stet/Homograph paradigms.

16:50 crasis: a manuscript crasis / fused-ligature booth for #93960. Idle **injective** / seeded **crased** / path **store-slug-collide**. Score crasis or admit injective.

Score crasis or admit injective.

Idle word: **injective** (HOLD: one path, one store; two sealed drawers). HOLD aliases: injective, distinct, sealed, separate, one-path-one-store. Seeded word: **crased** / #93960 (fused slug — two project paths share one MEMORY/transcript drawer). Path word: **store-slug-collide**. Product score: **crasis**. Never idle unitary / tessellated / tessera / version-path-tcc / verbatim / plenary / vested / singular / equalized / legible / calibrated / tethered / engaged / flush / candid / stetted / scisselled / unseised / apographed / mojibaked / mojibake / fffd-spall.

Phrase: **Score crasis or admit injective.**

- **injective** = IDLE: HOLD; one path, one store; two sealed drawers
- **crased** = #93960 seeded path: fused slug — two project paths share one MEMORY/transcript drawer
- **crasis** = product score word for the manuscript / fused-ligature booth
- **store-slug-collide** = path word: fused slug vs one-path-one-store
- **hold** = HOLD alias for idle injective
- **distinct** = HOLD alias: two paths stay two stores
- **sealed** = HOLD alias: two sealed drawers
- **separate** = HOLD alias: MEMORY.md never fuses
- **one-path-one-store** = HOLD alias: injective slug
- **non-ascii-collapse** = 가나다 vs 라마바 (length 3) share one store
- **separator-ambiguity** = ab-cd vs ab/cd — #29471 still live
- **control-length** = 가나다라 (length 4) does not collide
- **memory-leak** = ALPHA-777 from 가나다 injected into 라마바
- **transcript-pool** = transcripts pool in the colliding store
- **auto-memory-workaround** = cite only: isolates memory only; transcripts still pool
- **has-repro** = published shape: Windows 11 / 2.1.238 / 가나다 vs 라마바 / ab-cd vs ab/cd
- **cousins** = cite-only #29471, #93743, #7009, #21085, #35162
- **backups** = cite-only #93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93924 #93925 — do not auto-pick
- **fixtures** = ink / vellum / cinnabar / verdigris
- **walk** = published idle injective → store-slug-collide → crased → crasis

Verdicts: injective, crased, crasis, store-slug-collide, hold, distinct, sealed, separate, one-path-one-store, non-ascii-collapse, separator-ambiguity, control-length, memory-leak, transcript-pool, auto-memory-workaround, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **crased** / **crasis** or already **injective**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the published encoding replaces every non-alphanumeric character with a single `-`, which is not injective. Equal-length non-ASCII folder names (`가나다` vs `라마바`) and hyphen-vs-separator paths (`ab-cd` vs `ab/cd`) fuse into one store slug, so MEMORY.md and transcripts from one project are injected into another with no warning. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93960](https://github.com/anthropics/claude-code/issues/93960)
- Cite-only cousins: #29471 (CLOSED COMPLETED, still repros); #93743 (OPEN, non-ASCII case); #7009, #21085, #35162. Do not rebuild as separate booths.
- Backups (data only; next focus only — do not auto-pick): #93772, #93770, #93777, #93782, #93889, #93821, #93811, #93809, #93823, #93924, #93925

What happened (from the issue text — do not invent):

- OPEN, has repro
- Labels: bug, has repro, platform:windows, area:core
- Environment: Claude Code 2.1.238; Windows 11 (10.0.26200), desktop app
- Store slug = replace every non-alphanumeric character with a single `-`
- Mapping is not injective
- Non-ASCII collapse: `가나다` vs `라마바` (length 3) share `…-clash----`; control `가나다라` (length 4) does not
- Separator ambiguity: `ab-cd` vs `ab/cd` share `…-ab-cd` — #29471 still live
- MEMORY.md from one project injected into another with no warning (pseudonymous ALPHA-777)
- Transcripts pool
- Scan: 1,085 stores; 2 stores held >1 real project; one store shared by six Korean client projects
- Workaround cite: `autoMemoryDirectory` isolates memory only; transcripts still pool

Problem found: PER-PROJECT STORE SLUG IS NOT INJECTIVE; TWO PATHS FUSE INTO ONE MEMORY/TRANSCRIPT DRAWER.

Why this solution: living catalog page + node diagnostic encoding idle **injective** / seeded **crased** / path **store-slug-collide** so operators can score whether the booth is a **crasis** or already **injective**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The store identifier should be unique per real path
2. Append a short hash of the absolute path, or percent-encode instead of collapsing
3. Record the source path inside the store and warn on mismatch

## Why not a clone

This is specifically: **PER-PROJECT STORE SLUG IS NOT INJECTIVE — TWO PATHS FUSE INTO ONE MEMORY/TRANSCRIPT DRAWER.**

Novel paradigm: manuscript crasis / vowel-fusion / orthographic-collapse — vellum folios, fused ligatures, two path cards collapsing into one store drawer.

**NOT Tessera/#93929** (macOS version-named binary path → TCC row per release). Different defect. NOT mosaic / tesserae / privacy-pane. Do not reuse unitary / tessellated / version-path-tcc.

**NOT Mojibake/#93848** (Windows embedded CLAUDE.md UTF-8 → three U+FFFD). Different defect. NOT compositor / foul-proof / geta-tofu. Do not reuse verbatim / mojibaked / fffd-spall.

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

**NOT Homograph/#93743** (cite-only cousin — non-ASCII case, already booth'd). Different framing. Do not reuse collided / lossy-slug / dash-collapse.

Do NOT rename Crasis to any existing catalog slug. Catalog currently has 331 products; Crasis is #332 after Tessera #331.
Do NOT reuse idle unitary / tessellated / version-path-tcc / verbatim / plenary / vested / unseised / preview-eperm / singular / apographed / reopen-fork / equalized / blown / socat-race / legible / scotomized / command-args-blind / calibrated / aneroided / wrong-window-ring / tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / gleaned / orphaned / inherited / seised / disseised / intact / armed / coil-pulled / scisselled / argv-trunc / mojibaked / mojibake / fffd-spall.

Display here is **Fraunces**. Body is **Source Sans 3**. Mono is **IBM Plex Mono**.

Different surface: non-injective store slug fusing two project paths vs version-named TCC path vs Windows embedded CLAUDE.md U+FFFD vs argv `-c` truncation vs preview_start getcwd EPERM vs Desktop sidebar reopen session-ID fork vs sandbox socat race vs Stop-condition evaluator vs VS Code context-ring vs Claude-in-Chrome MCP hollow registration vs Settings toggle fidelity vs DECSTBM blank-row undershoot vs VS Code OneDrive spawn mislabel.

Different UI: ink / vellum / cinnabar / verdigris / fused ligature / two path cards / one store drawer. Fraunces / Source Sans 3 / IBM Plex Mono. NOT limestone mosaic. NOT rice-paper type case. NOT slag floor copper die. NOT oak panel parchment. NOT cream parchment scriptorium. NOT navy hull. NOT Humphrey bowl. NOT sealed gauge. NOT museum vitrine. NOT coil-plunger. NOT limestone column-molding. NOT aged newsprint. NOT court of novel disseisin.

Different verbs: Admit injective, Score crasis, Walk store-slug-collide, Compare injective / crased, Pin idle injective, Pin seeded crased, Pin store-slug-collide, Fuse the ligature.

Different idle: **injective**. Different #93960 seeded path: **crased**. HOLD: **injective** / **hold**. ALARM: **crased** / **crasis** / **store-slug-collide** / **memory-leak**. Path: **store-slug-collide**.

## How to score

```bash
node --test projects/crasis/crasis.test.mjs
node projects/crasis/crasis.mjs projects/crasis/data/crased.json
echo '{"seed":"crased"}' | node projects/crasis/crasis.mjs
```

Open the living card at `projects/crasis/index.html` (or the live path `/crasis/`). Buttons: Admit injective, Score crasis, Walk store-slug-collide, Compare injective / crased, Pin idle injective, Pin seeded crased, Pin store-slug-collide, Fuse the ligature. Toggle chips for: store-slug-collide, non-ascii-collapse, separator-ambiguity, memory-leak — the score flips. Lay a fixture JSON on the vellum folio. `?embed=1` hides chrome.

The booth reconstructs the reporter’s 가나다 / 라마바 / ab-cd vs ab/cd / ALPHA-777 walk from the published #93960 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/crasis/
- Folder: `projects/crasis/`
