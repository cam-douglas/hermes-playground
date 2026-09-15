# Cenotaph

A **memorial / empty-tomb / sepulchre / cenotaph-yard booth** — a *cenotaph* is a monument for someone buried elsewhere; here `installLocation` is a carved stone pointing at a path that no longer exists while the living `source.path` still stands. Every launch re-polishes the plaque (`lastUpdated`) but never moves the stone. Fonts **Newsreader** (display) + **Karla** (UI) + **Fragment Mono** (mono). Palette: marble bone `#E8E2D6`, bronze `#8B6914`, moss `#3F5A45`, ash `#5C5650`, ink `#1A1814`, plaque `#C4B59A`, void `#0E0D0B`. Fresh trio. Completely different UI/UX/metaphor — carved stone / bronze plaque / living source / void path / moss yard. NOT a geology core-sample desk. NOT a manuscript parchment desk. NOT a cavalry lantern. NOT a Prague clock tower. NOT a herald's college. NOT a wax-tablet scriptorium. NOT an Elizabethan mask booth. NOT a confectionery kitchen. NOT a sleep ward. NOT a night-wall inhibitor. NOT a dictation recorder. NOT a household shrine. NOT a binder folio. NOT a theater tapestry. NOT a letterpress foundry. NOT a wax-cachet desk. NOT the older vacant-monument / #90771 booth that previously occupied this slug. NOT a Sepulchre burial vault.

The yard should stay **homed** (HOLD: rewrite `installLocation` to live `source.path` when ENOENT on re-fetch). Instead the booth was **cenotaph** after a **dead-install**.

Primary:

- [anthropics/claude-code#94452](https://github.com/anthropics/claude-code/issues/94452) (OPEN). Title: `A directory marketplace whose recorded installLocation no longer exists never loads again: every launch re-fetches from source but keeps the dead path, and claude plugin marketplace update fails on it`. Labels: bug, has repro, platform:wsl, area:plugins. Environment: Claude Code 2.1.272; isolated config dir repro; no login needed (plugin loading before auth). A `directory`-source marketplace records `installLocation` in `known_marketplaces.json` pointing at a path that no longer exists while `source.path` still exists. Every launch: `Cache corrupted or missing for marketplace mkt-a, re-fetches from source: ENOENT`. Bumps `lastUpdated` but leaves `installLocation` pointing at the dead path — rewritten every launch, never the wrong field. `claude plugin marketplace update mkt-a` fails on the dead path instead of resolving from `source`. `claude plugin list` shows cache-miss; no recovery guidance. Only recovery: `remove` then `add` — but `remove` also deletes the marketplace's plugins from `enabledPlugins`, so after recovering the plugin stays disabled. For directory source, Claude Code itself records `installLocation` equal to `source.path` on add; once they diverge (config carried across machines / dirs; cf. #36575, #82272), the entry stays stuck even though the correct value sits in the same entry. Stay off Stratum/Tmesis/Vedette/Orloj/Brisure/Diptych/Vizard/Treacle/Somnus/Cresset/Dictabelt/Lemure/Cancellans/Arras/Cachet/Stereotype paradigms.

23:50 cenotaph: a memorial / empty-tomb / sepulchre / cenotaph-yard booth for #94452. A directory marketplace whose recorded `installLocation` no longer exists never loads again: every launch re-fetches from source but keeps the dead path, and marketplace update fails on it. Idle **homed** / seeded **cenotaph** / path **dead-install**. Score cenotaph or admit homed.

Score cenotaph or admit homed.

Idle word: **homed** (HOLD: rewrite `installLocation` to live `source.path` when ENOENT on re-fetch). HOLD aliases: repointed, relocated, settled. Seeded word: **cenotaph** / #94452 (the dead-install path). Path word: **dead-install**. Product score: **cenotaph**. Never idle shared / contiguous / stationed / lasting / enrolled / single / pledged / brisk / cadence / verbatim / quiet / intact / cleared or seeded Stratum / Tmesis / Vedette / Orloj / Brisure / Diptych / Vizard / Treacle / Somnus / Cresset / Dictabelt / Lemure / Cancellans / Arras / Cachet or path names from those booths.

Phrase: **Score cenotaph or admit homed.**

- **homed** = IDLE HOLD: rewrite `installLocation` to live `source.path` when ENOENT on re-fetch
- **cenotaph** = seeded path / product score: stone points at a dead path; plaque is polished
- **dead-install** = path word: recorded `installLocation` is ENOENT while `source.path` lives
- **repointed** = HOLD alias: stone rewritten to live `source.path`
- **relocated** = HOLD alias: `installLocation` matches `source.path`
- **settled** = HOLD alias: marketplace update resolves from source
- **cache-miss** = `claude plugin list` shows cache-miss; no recovery guidance
- **last-updated** = plaque re-polished every launch; stone unmoved
- **marketplace-update** = update opens the dead path instead of source
- **remove-add** = only recovery is remove then add
- **enabled-cleared** = remove deletes the marketplace's plugins from `enabledPlugins`
- **94452** = issue number seed
- **landing** = memorial / empty-tomb / sepulchre / cenotaph-yard
- **has-repro** = published shape: Claude Code 2.1.272 · isolated config dir · no login
- **cousins** = cite-only #94451 #82272 #36575 #94516 — do not rebuild; do not conflate
- **backups** = cite-only #94451 #94430 #94458 #93924 #93770 #93777 #94151 #94496 #94499 #94522 #94520 #94509 #94507 — do not auto-pick
- **fixtures** = living source / carved stone / bronze plaque
- **walk** = published idle homed → dead-install → cenotaph
- **closed** = #94452 remains OPEN — cite only; not this booth

Verdicts: homed, cenotaph, dead-install, repointed, relocated, settled, cache-miss, last-updated, marketplace-update, remove-add, enabled-cleared, 94452, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **cenotaph** or already **homed**. Fixtures use the issue's published incident only. Request reconstructions from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): when a directory marketplace's recorded `installLocation` is ENOENT, the re-fetch path bumps `lastUpdated` but never rewrites `installLocation` from live `source.path`, so every launch misses the same way and `marketplace update` also opens the dead path. Invite verify against #94452 text only. Do not claim a root cause in Claude Code source you have not seen.

The slug `projects/cenotaph/` previously held a 2026-08-31 vacant-monument booth for #90771 (idle **stood**). That historical catalog card stays listed and unfeatured. This ship remasks the folder as catalog #383 for #94452.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94452](https://github.com/anthropics/claude-code/issues/94452)
- Cousins: do NOT rebuild / do NOT conflate: #94451 (known_marketplaces.json never repaired once invalid), #82272 (installLocation string-prefix vs realpath), #36575 CLOSED (portable installLocation), #94516 (marketplace refresh stale content).
- Backups (data only; next focus only — do not auto-pick): #94451, #94430, #94458, #93924, #93770, #93777, #94151, #94496, #94499, #94522, #94520, #94509, #94507

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:wsl, area:plugins
- Environment: Claude Code 2.1.272; isolated config dir repro; no login needed (plugin loading before auth)
- `directory`-source marketplace; `installLocation` in `known_marketplaces.json` points at a path that no longer exists while `source.path` still exists
- Every launch: `Cache corrupted or missing for marketplace mkt-a, re-fetches from source: ENOENT`
- Bumps `lastUpdated` but leaves `installLocation` pointing at the dead path — rewritten every launch, never the wrong field
- `claude plugin marketplace update mkt-a` fails on the dead path instead of resolving from `source`
- `claude plugin list` shows cache-miss; no recovery guidance
- Only recovery: `remove` then `add` — but `remove` also deletes the marketplace's plugins from `enabledPlugins`
- For directory source, Claude Code itself records `installLocation` equal to `source.path` on add; once they diverge (config carried across machines / dirs), the entry stays stuck even though the correct value sits in the same entry

Problem found: DEAD-INSTALL — recorded `installLocation` is ENOENT; re-fetch polishes `lastUpdated` and never rewrites the stone from live `source.path`.

Why Cenotaph: A *cenotaph* is a monument for someone buried elsewhere. `installLocation` is a carved stone pointing at a path that no longer exists while the living `source.path` still stands. Every launch re-polishes the plaque (`lastUpdated`) but never moves the stone. #94451 is a parse/lastUpdated invalidation that disables ALL marketplaces — DIFFERENT. #82272 is prefix-not-realpath validation — DIFFERENT. #36575 is portable paths — DIFFERENT. #94516 is stale refresh content — DIFFERENT. This booth is specifically **directory marketplace dead `installLocation` never rewritten from live `source.path`**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores dead-install honesty (homed vs cenotaph) so operators can see the six-row evidence table and the unmoved stone without needing a Claude session. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. On re-fetch because recorded `installLocation` is missing, write resolved `source.path` back as `installLocation`
2. `claude plugin marketplace update` should resolve from `source`
3. remove then add should not be the only recovery

## Why not a clone

This is specifically: **DIRECTORY MARKETPLACE WHOSE RECORDED INSTALLLOCATION IS ENOENT NEVER LOADS AGAIN. EVERY LAUNCH RE-FETCHES FROM SOURCE, BUMPS LASTUPDATED, AND LEAVES THE DEAD PATH. MARKETPLACE UPDATE FAILS ON THE DEAD PATH. CLAUDE CODE 2.1.272; ISOLATED CONFIG DIR; NO LOGIN.**

Novel paradigm: memorial / empty-tomb / sepulchre / cenotaph-yard / carved stone / bronze plaque / living source / void path — marble bone, bronze, moss. New issue, new paradigm (dead-install), new UI/UX/fonts/colors, new scoring vocabulary. A memorial yard, not a geology core, manuscript parchment desk, cavalry lantern, Prague clock tower, herald's college, wax-tablet scriptorium, Elizabethan mask atelier, confectionery kitchen, sleep clinic, night-wall inhibitor, voice recorder, household shrine, binder folio, theater tapestry, or burial vault.

**NOT #94451** (known_marketplaces.json never repaired once invalid). DIFFERENT. Do not conflate.

**NOT #82272** (installLocation validated by string prefix not realpath). DIFFERENT. Do not rebuild.

**NOT #36575** (CLOSED — portable paths for installLocation). DIFFERENT. Do not rebuild.

**NOT #94516** (marketplace refresh can install unmerged/stale content). DIFFERENT. Do not rebuild.

**NOT Stratum/#94417** (layer-unsealed project-context). Different defect. Do not reuse shared / Stratum / layer-unsealed.

**NOT Tmesis/#86198** (mid-inject slash splice). Different defect. Do not reuse contiguous / Tmesis / mid-inject.

**NOT Vedette/#94392** (headless `-p` idle-exit / false success). Different defect. Do not reuse stationed / Vedette / idle-exit.

**NOT Orloj/#94393** (Monitor schema cap / half-life during an active session). Different defect. Do not reuse lasting / Orloj / half-life.

**NOT Brisure/#94396** (fork-resume never becomes Remote Control eligible). Different defect. Do not reuse enrolled / Brisure / fork-resume.

**NOT Diptych/#94397** (brief-echo). Different defect. Do not reuse single / Diptych / brief-echo.

**NOT Vizard/#94398** (background-reset to Opus 4.8). Different defect. Do not reuse pledged / Vizard / background-reset.

**NOT Treacle/#94344** (Windows PowerShell streaming-stall). Different defect. Do not reuse brisk / Treacle / streaming-stall.

**NOT Somnus/#94415** (Cowork cloud schedule `device_absent`). Different defect. Do not reuse cadence / Somnus / device-absent.

**NOT Cresset/#94420** (keep-awake hold-leak). Different defect. Do not reuse released / Cresset / hold-leak.

**NOT Dictabelt/#94406** (voice-dictation fragment path). Different defect. Do not reuse verbatim / Dictabelt / segment-drop.

**NOT Lemure/#94410** (orphan scheduled-task ticks). Different defect. Do not reuse quiet / Lemure / orphan-tick.

**NOT Cancellans/#94400** (deferred-delta / tools-array drop). Different defect. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Cachet/#93490** (resume flatten). Different defect.

**NOT Stereotype** (plugin freshness). Different defect.

**NOT the older vacant-monument / #90771 booth** (advisor pair widow). Different defect. Historical catalog card stays listed.

**NOT Sepulchre** (burial-vault / session-dead). Different defect.

Live: https://hermes-playground-green.vercel.app/cenotaph/

```
node --test projects/cenotaph/cenotaph.test.mjs
node projects/cenotaph/cenotaph.mjs projects/cenotaph/data/cenotaph.json
```
