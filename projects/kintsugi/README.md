# Kintsugi

An **urushi lacquer / gold seam / broken ceramic / kiln / repair-bench booth** — *Kintsugi* is the Japanese craft of repairing broken pottery with lacquer and gold. Claude Code already attempts a rebuild (treat-as-empty + reinstall), but every write still presses the unbroken crack — the writer re-reads the corrupt vessel and aborts — so the gold never sets. One hairline fracture (missing `lastUpdated`) shatters the whole cupboard of marketplaces. Fonts **Libre Baskerville** (display) + **Outfit** (UI) + **JetBrains Mono** (chips). Palette: urushi black `#110C09`, ceramic clay `#C47A4A`, gold `#C9A227`, lacquer red `#9E1B1B`, ceramic `#E8C9A8`, kiln `#3A1C14`, seam `#E4C04A`. Fresh trio. Completely different UI/UX/metaphor — cracked bowl / gold seam / kiln mouth / urushi pot / shard tray / repair bench. NOT a marble memorial yard. NOT a geology core-sample desk. NOT a manuscript parchment desk. NOT a cavalry lantern. NOT a Prague clock tower. NOT a herald's college. NOT a wax-tablet scriptorium. NOT an Elizabethan mask booth. NOT a confectionery kitchen. NOT a sleep ward. NOT a night-wall inhibitor. NOT a dictation recorder. NOT a household shrine. NOT a binder folio. NOT a theater tapestry. NOT a letterpress foundry. NOT a wax-cachet desk.

The bench should stay **mended** (HOLD: quarantine+rebuild or per-entry validate so the gold can set). Instead the booth was **kintsugi** after a **heal-abort**.

Primary:

- [anthropics/claude-code#94451](https://github.com/anthropics/claude-code/issues/94451) (OPEN). Title: `[BUG] known_marketplaces.json is never repaired once invalid: one entry missing lastUpdated (or a parse error) disables plugins from every marketplace, and the reconciler, marketplace add and marketplace remove all fail re-reading it`. Labels: bug, has repro, platform:linux, platform:wsl, area:plugins. Environment: Claude Code 2.1.272; isolated config dir; no login needed (plugin loading and the reconciler run before the auth check). When `known_marketplaces.json` fails to load, the reconciler logs `failed to load known_marketplaces.json, treating as empty` and tries to reinstall each marketplace declared in `extraKnownMarketplaces`. Every install fails because the install write path re-reads and re-validates the same invalid file and aborts. The file is never repaired on that launch or any later one. `claude plugin list` still reports plugins `✔ enabled` while every launch loads zero. A *missing* file heals; an *invalid* file does not. Only recovery today: delete the file by hand. Two triggers, same outcome: (1) one entry missing `lastUpdated` → whole-file schema reject; installing valid mkt-b fails with mkt-a's error. (2) truncated/parse-error file → same reconciler sequence. Stay off Cenotaph/Stratum/Tmesis/Vedette/Orloj/Brisure/Diptych/Vizard/Treacle/Somnus/Cresset/Dictabelt/Lemure/Cancellans/Arras/Cachet/Stereotype paradigms.

00:50 kintsugi: an urushi lacquer / gold seam / broken ceramic / kiln / repair-bench booth for #94451. `known_marketplaces.json` is never repaired once invalid: one entry missing `lastUpdated` (or a parse error) disables plugins from every marketplace; the reconciler, marketplace add and marketplace remove all fail re-reading it. Idle **mended** / seeded **kintsugi** / path **heal-abort**. Score kintsugi or admit mended.

Score kintsugi or admit mended.

Idle word: **mended** (HOLD: false promise that the repair landed — quarantine+rebuild or per-entry validate). HOLD aliases: healed, gilded, fused. Seeded word: **kintsugi** / #94451 (the heal-abort path). Path word: **heal-abort**. Product score: **kintsugi**. Never idle homed / shared / contiguous / stationed / lasting / enrolled / cleared / repointed / relocated / settled or seeded Cenotaph / Stratum / Tmesis / Vedette / Orloj / Brisure / Diptych / Vizard / Treacle / Somnus / Cresset / Dictabelt / Lemure / Cancellans / Arras / Cachet or path names from those booths.

Phrase: **Score kintsugi or admit mended.**

- **mended** = IDLE HOLD: quarantine+rebuild or per-entry validate so the gold can set
- **kintsugi** = seeded path / product score: gold never sets; writer re-reads the corrupt vessel
- **heal-abort** = path word: rebuild is attempted; the writer aborts
- **healed** = HOLD alias: per-entry validate keeps the rest
- **gilded** = HOLD alias: gold set on the crack
- **fused** = HOLD alias: corrupt vessel moved aside and rebuilt
- **lastUpdated-missing** = one entry missing `lastUpdated` → whole-file schema reject
- **parse-error** = truncated file; JSON Parse error: Unterminated string
- **treat-as-empty** = reconciler logs treating as empty; rebuild never lands
- **rewrite-abort** = install write re-reads the same invalid file and aborts
- **marketplace-remove** = remove fails re-reading the invalid file
- **marketplace-add** = add fails re-reading the invalid file
- **plugin-list-lie** = plugin list reports ✔ enabled while every launch loads zero
- **94451** = issue number seed
- **landing** = urushi / gold seam / broken ceramic / kiln / repair-bench
- **has-repro** = published shape: Claude Code 2.1.272 · isolated config dir · no login
- **cousins** = cite-only #84501 #19065 #56967 #94516 #94452 — do not rebuild; do not conflate
- **backups** = cite-only #94430 #94458 #93924 #93770 #93777 #94151 #94496 #94499 #94522 #94520 #94509 #94507 #94547 #94546 #94530 — do not auto-pick
- **fixtures** = cracked vessel / gold seam / kiln bench
- **walk** = published idle mended → heal-abort → kintsugi
- **closed** = #94451 remains OPEN — cite only; not this booth

Verdicts: mended, kintsugi, heal-abort, healed, gilded, fused, lastUpdated-missing, parse-error, treat-as-empty, rewrite-abort, marketplace-remove, marketplace-add, plugin-list-lie, 94451, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **kintsugi** or already **mended**. Fixtures use the issue's published incident only. Request reconstructions from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): when `known_marketplaces.json` is invalid, the reconciler treats it as empty and schedules reinstalls, but the install/write path re-reads and re-validates the same invalid file and aborts, so repair never lands; per-entry validate or quarantine+rebuild aside would heal. Invite verify against #94451 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94451](https://github.com/anthropics/claude-code/issues/94451)
- Cousins: do NOT rebuild / do NOT conflate: #84501 (UTF-8 BOM trigger), #19065 (zero-byte hang), #56967 (trailing comma writer), #94516 (marketplace refresh stale content), #94452 (directory marketplace dead `installLocation`).
- Backups (data only; next focus only — do not auto-pick): #94430, #94458, #93924, #93770, #93777, #94151, #94496, #94499, #94522, #94520, #94509, #94507, #94547, #94546, #94530

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:linux, platform:wsl, area:plugins
- Environment: Claude Code 2.1.272; isolated config dir; no login needed (plugin loading and the reconciler run before the auth check)
- `known_marketplaces.json` invalid: one entry missing `lastUpdated`, or a truncated parse-error file
- Reconciler: `failed to load known_marketplaces.json, treating as empty`
- Reinstalls each marketplace declared in `extraKnownMarketplaces`
- Every install write re-reads and re-validates the same invalid file and aborts
- Installing valid mkt-b fails with mkt-a's error
- `claude plugin marketplace remove` and `marketplace add` fail the same way
- `claude plugin list` reports both plugins `✔ enabled` while every launch loads zero
- A *missing* file heals (delete by hand; first launch rebuilds; second loads both plugins). An *invalid* file does not.

Problem found: HEAL-ABORT — reconciler treats the invalid file as empty and schedules reinstalls; the writer re-reads the same corrupt vessel and aborts, so the gold never sets.

Why Kintsugi: *Kintsugi* is the Japanese craft of repairing broken pottery with lacquer and gold. Claude Code already attempts a rebuild, but every write still presses the unbroken crack. #94452 / Cenotaph is a directory marketplace dead `installLocation` never rewritten — DIFFERENT. #84501 is a UTF-8 BOM trigger — DIFFERENT. #19065 is a zero-byte hang — DIFFERENT. #56967 is a trailing-comma writer — DIFFERENT. #94516 is stale refresh content — DIFFERENT. This booth is specifically **known_marketplaces.json never repaired once invalid / one bad entry poisons all / reconciler heal-abort on rewrite**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores heal-abort honesty (mended vs kintsugi) so operators can see the six-row evidence table and the unset gold without needing a Claude session. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Validate per entry — skip or quarantine an entry that fails the schema and keep loading the rest
2. When the file cannot be loaded at all, move it aside and rebuild from `extraKnownMarketplaces`
3. `claude plugin marketplace remove` should work on an invalid file

## Why not a clone

This is specifically: **KNOWN_MARKETPLACES.JSON NEVER REPAIRED ONCE INVALID. ONE ENTRY MISSING LASTUPDATED (OR A PARSE ERROR) DISABLES PLUGINS FROM EVERY MARKETPLACE. THE RECONCILER, MARKETPLACE ADD AND MARKETPLACE REMOVE ALL FAIL RE-READING IT. CLAUDE CODE 2.1.272; ISOLATED CONFIG DIR; NO LOGIN.**

Novel paradigm: urushi lacquer / gold seam / broken ceramic / kiln / repair-bench / cracked bowl / shard tray — urushi black, clay, gold, lacquer red. New issue, new paradigm (heal-abort), new UI/UX/fonts/colors, new scoring vocabulary. A repair bench, not a memorial yard, geology core, manuscript parchment desk, cavalry lantern, Prague clock tower, herald's college, wax-tablet scriptorium, Elizabethan mask atelier, confectionery kitchen, sleep clinic, night-wall inhibitor, voice recorder, household shrine, binder folio, or theater tapestry.

**NOT #94452** (directory marketplace dead `installLocation` ENOENT while `source.path` lives). DIFFERENT. Do not conflate.

**NOT #84501** (UTF-8 BOM trigger). DIFFERENT. Do not rebuild.

**NOT #19065** (zero-byte hang). DIFFERENT. Do not rebuild.

**NOT #56967** (trailing comma writer). DIFFERENT. Do not rebuild.

**NOT #94516** (marketplace refresh can install unmerged/stale content). DIFFERENT. Do not rebuild.

**NOT Cenotaph/#94452** (dead-install / plaque polished, stone never moved). Different defect. Do not reuse homed / Cenotaph / dead-install.

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

Live: https://hermes-playground-green.vercel.app/kintsugi/

```
node --test projects/kintsugi/kintsugi.test.mjs
node projects/kintsugi/kintsugi.mjs projects/kintsugi/data/kintsugi.json
```
