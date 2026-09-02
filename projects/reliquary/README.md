# Reliquary

A **vault-latch / relic-case** atelier — brass latch plate, relic-case plaque with an overnight session slot, aarch64 vs x86 `O_*` bit dial (`0o200000` as `O_DIRECT` poison), `EINVAL` (-22) latch fault, regression timeline 2.1.237→2.1.247, sidebar-vs-CLI transcript split; cool vault brass / deep umber / parchment-ink — Crimson Pro + Plus Jakarta Sans + Ubuntu Mono — for a real Claude Code defect: **Desktop Linux ARM64 session registry saves fail with EINVAL because hardcoded x86 `O_DIRECTORY|O_NOFOLLOW` bits mean `O_DIRECT` on aarch64; silent overnight sidebar vanish / data-loss; CLI transcript still resumes; regression 2.1.237→2.1.247; area:desktop.**

Primary:

- [anthropics/claude-code#91433](https://github.com/anthropics/claude-code/issues/91433) (OPEN, bug, has repro, platform:linux, regression, data-loss, area:desktop, filed 2026-09-02T08:33:26Z, updated 2026-09-02T08:34:41Z, 0 comments). Title: [BUG] Desktop (Linux ARM64): session registry saves fail with EINVAL — sessions vanish from sidebar on restart. Reporter usman1501.

a reliquary that rejects the overnight session is not a vault. Score the latch or admit the relic never seated.

Idle word: **latched**. Seeded state: **vanished** / #91433 — `EINVAL` latch on aarch64; overnight session missing from sidebar plaque while CLI transcript body still exists. Never idle as sealed / rebound / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

A **reliquary** is the vault that should **latch** each Desktop sidebar session under `~/.config/Claude/claude-code-sessions`. Storage-dir verification opens with hardcoded x86-64 `O_DIRECTORY|O_NOFOLLOW` bit values. On **aarch64 Linux** those bits mean **`O_DIRECT`**, so `open()` on the directory returns **EINVAL (-22)**. Every sidebar session save fails silently. Sessions work in memory, then **vanish** from the sidebar (and Archived) after restart — silent overnight history loss — while CLI transcripts under `~/.claude/projects/` still resume with `claude --resume`.

- **vanished** = #91433: EINVAL latch on aarch64; overnight session missing from sidebar plaque while CLI transcript body still exists
- **einval-open** = `EINVAL: invalid argument, open '…/claude-code-sessions/<account>/<org>'`; errno **-22**
- **odirect-poison** = on aarch64, x86-64's `O_DIRECTORY` (**0o200000**) is `O_DIRECT`; `open()` on a directory with `O_DIRECT` returns EINVAL
- **hardcoded-x86-flags** = bundler shim / constants-browserify-style hardcodes x86-64 `O_DIRECTORY|O_NOFOLLOW` instead of runtime `fs.constants`
- **aarch64-native-ok** = native aarch64 `os.O_RDONLY|os.O_DIRECTORY|os.O_NOFOLLOW` succeed; `0o200000|0o400000` reproduce EINVAL
- **sidebar-vanish** = after quit/reopen the session is gone from the sidebar and Archived
- **cli-resume-survives** = CLI transcripts under `~/.claude/projects/` still resume with `claude --resume`
- **seventy-three-einval** = **73** EINVAL lines in `~/.config/Claude/logs/main.log` since the update
- **runtime-regression** = last successful `local_*.json` **2026-09-01 08:26**; failures from **09:07**; embedded runtime **2.1.237→2.1.247**
- **overnight-session-lost** = author lost a full overnight working session from the sidebar; silent history loss
- **ensure-storage-dir** = `mkdirPrivate` → `ensureStorageDir` → `writeSessionToDisk` open of `claude-code-sessions`
- **has-clear-repro** = usman1501 filed #91433; has repro; Linux ARM64; aarch64; data-loss; area:desktop; Claude Desktop 1.40609.0 deb arm64
- **hold** = vault latched closed; overnight session relic seated in the case; native aarch64 flags succeed
- **latched** = HOLD: vault latched closed; overnight session relic seated in the case; nothing to mourn

Verdicts: latched, vanished, einval-open, odirect-poison, hardcoded-x86-flags, aarch64-native-ok, sidebar-vanish, cli-resume-survives, seventy-three-einval, runtime-regression, overnight-session-lost, ensure-storage-dir, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the vault is latched or vanished.

Hypothesis only (NON-BINDING): bundler may have inlined x86-64 O_* numeric literals into the Desktop embed path (constants-browserify-style). Do not claim a root cause in Claude Code source you have not seen beyond the issue's measured repro.

## Why not a clone

This is specifically: **DESKTOP LINUX ARM64 SESSION REGISTRY SAVES FAIL WITH EINVAL BECAUSE HARDCODED X86 O_DIRECTORY|O_NOFOLLOW BITS MEAN O_DIRECT ON AARCH64; SILENT OVERNIGHT SIDEBAR VANISH / DATA-LOSS; CLI TRANSCRIPT STILL RESUMES; REGRESSION 2.1.237→2.1.247; AREA:DESKTOP.**

NOT **Annunciator** ([#91419](https://github.com/anthropics/claude-code/issues/91419)) — StopFailure false alarms on parent — loud polarity — cite as stay-off.
NOT **Caisson** ([#91405](https://github.com/anthropics/claude-code/issues/91405)) — worktree pool wrong rebind + dirty wipe — cite as stay-off.
NOT **Spindle** ([#91402](https://github.com/anthropics/claude-code/issues/91402)) — startup cleanup deletes live sibling Bash outputs — cite as stay-off.
NOT **Knell** ([#91298](https://github.com/anthropics/claude-code/issues/91298)) — Agent-tool silent child death.
NOT **Tumbler** ([#74256](https://github.com/anthropics/claude-code/issues/74256)) — PermissionRequest ExitPlanMode allow discarded.
NOT **Escapement** / **Geneva** / **Scotch** / **Carillon** / **Pintle** / **Fibula**.
NOT **Reveille** / **callboard** / slype muster-roster ink metaphors (sidebar-list surface — stay off).
NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / berth clones.
NOT **Berth** catalog entries (different product — do not clone their UI).
NOT **Bollard** catalog entries (different product — do not clone their UI).

Cousins are cite-only on a cousin strip; primary stays #91433.

- [#91409](https://github.com/anthropics/claude-code/issues/91409) — Windows: app state silently lost when `%APPDATA%\Claude` is a junction — data directory not configurable.
- [#88747](https://github.com/anthropics/claude-code/issues/88747) — Worktree creation writes an ABSOLUTE `core.hooksPath` into `config.worktree`.
- [#91400](https://github.com/anthropics/claude-code/issues/91400) — Desktop app scheduled-task runs never exit their claude session process.
- [#91392](https://github.com/anthropics/claude-code/issues/91392) — Same session appears under three independently-generated names.

Backups (do not ship unless primary blocked): **Jalousie** / #87730 — Inline `` !`cmd` `` preprocessor executes fenced markdown examples. **Fairlead** / #88423 — In-process subagent bg Bash/Monitor completions enqueue to lead, deliver to no one. **Cartouche** / #91392 — Same sessionId, three independently-generated names across Desktop/mobile/ListAgents.

Product name stays **Reliquary**. Do not rename to Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Carillon, Sluice, Alidade, Cockade, Lye, Clew, Hasp, Berth, Bollard, Reveille, Callboard.

Different UI: vault-latch / relic-case / brass latch plate + relic-case plaque with overnight session slot + aarch64 vs x86 O_* bit dial (`0o200000` as `O_DIRECT` poison) + EINVAL (-22) latch fault + regression timeline 2.1.237→2.1.247 + sidebar-vs-CLI transcript split / cool vault brass / deep umber / parchment-ink. Crimson Pro + Plus Jakarta Sans + Ubuntu Mono. NOT Chakra Petch/Barlow/Share Tech Mono (Annunciator). NOT Zilla Slab/Epilogue/Overpass Mono (Caisson). NOT Cardo/Hind/Cousine (Spindle). NOT Bitter/Karla/Inconsolata (Knell). NOT Young Serif/Figtree/Fragment Mono (Tumbler). NOT Instrument Serif/Manrope/Azeret Mono (Escapement). NOT Bodoni/Jost/Space Mono (Geneva). NOT Spectral/Sora/IBM Plex Mono (Scotch). NOT Cormorant/Outfit/Fira (Fibula). NOT Libre Baskerville/Work Sans/JetBrains (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair/Source Serif 4 (Carillon). NOT Cinzel (Postern). Stay OFF annunciator lamps / caisson berth / spindle chip-sweep / knell mute-bell / tumbler keyway / escapement pallet / carillon peal / sluice millrace / reveille muster / callboard roster / berth-card clone / bollard clone.

Different verbs: Latch the vault, pin idle latched, pin seeded vanished, admit the relic never seated, load fixtures, reset to latched. Not "Score the seal/purge/mute/keyway/pallet/cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race". Score the latch is this desk's phrase.

Different idle: **latched**.

## Live catalog path

`/reliquary/` is this static vault-latch / relic-case atelier desk. Path `https://hermes-playground-green.vercel.app/reliquary/` and subdomain `https://reliquary.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `18:50 / hermes catalog #119 / #91433`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **latched** — vault latched closed; overnight session relic seated in the case; native aarch64 flags succeed; nothing to mourn.
2. Seed **vanished** → #91433: EINVAL latch on aarch64; overnight session missing from sidebar plaque; CLI transcript still resumes; 73 EINVAL lines; runtime 2.1.237→2.1.247.
3. Atelier UI: relic-case plaque / bit dial / EINVAL latch fault / regression timeline / sidebar-vs-CLI split. Latched = relic seated, latch closed. Vanished = plaque empty, latch fault, CLI body still present.
4. Cousin cite strip labeled cousin-not-primary: [#91409](https://github.com/anthropics/claude-code/issues/91409) / [#88747](https://github.com/anthropics/claude-code/issues/88747) / [#91400](https://github.com/anthropics/claude-code/issues/91400) / [#91392](https://github.com/anthropics/claude-code/issues/91392). Cite only. Primary stays #91433.
5. **Latch the vault** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/reliquary/index.html` in a browser, or serve the repo root and visit `/reliquary/` (Vercel rewrite → `/projects/reliquary`). No build step. Optional hook:

```bash
node projects/reliquary/hook/reliquary.mjs projects/reliquary/data/91433.json
node --test projects/reliquary/hook/reliquary.test.mjs
```

Empty stdin scores the idle **latched** ticket. Paste a probe on the page or drop a fixture from `data/`.
