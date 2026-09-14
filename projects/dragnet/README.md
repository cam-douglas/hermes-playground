# Dragnet

A **night blotter / police-fishing dragnet booth** — a *dragnet* is an unscoped full-disk trawl that hauls every alley (TCC-protected containers) instead of staying inside the open case folder. Fonts **Archivo Black** (display) + **Figtree** (body) + **DM Mono** (mono). Palette: night asphalt `#12151A`, blotter paper `#E8E4D9`, caution amber `#E6B422`, steel `#4A6FA5`, hairline/chalk `#8B909A`. Fresh trio. NOT Matricula ivory/oak/brass. NOT Allograph parchment/copper. Completely different UI/UX/metaphor — night street / caution tape / city-grid net / case-file blotter. NOT an enrollment desk. NOT a type-foundry. NOT a neurology desk. NOT a gauntlet/lictor/lychgate/ouster/proscription booth.

The walk should stay **scoped** (HOLD: the scan would stay inside the open project / working tree and never ask for other-apps TCC). Instead the booth was **dragnet** after a **root-find**.

Primary:

- [anthropics/claude-code#94064](https://github.com/anthropics/claude-code/issues/94064) (OPEN). Title: `Desktop app spawns a full-disk find that triggers repeated "access data from other apps" (TCC) prompts`. Labels: bug, has repro, platform:macos, area:desktop. Environment: Claude Code desktop (`com.anthropic.claude-code`, 2.1.266). The desktop app repeatedly spawns child `/usr/bin/find` that walks the filesystem starting at `/` (not scoped to the open project / cwd). The walk descends into TCC-protected locations and raises repeated macOS “claude would like to access data from other apps” consent prompts. Also touches Contacts / Desktop / Full Disk Access surfaces. Sandbox denials on Desktop, Documents, AddressBook, CallHistoryDB, CloudDocs, Safari caches, etc. Recurs roughly every 1.5–3 minutes while the app is open; no user action required. Shared app process is responsible. Evidence via `com.apple.TCC` unified log (`kTCCServiceSystemPolicyAppData`) and kernel sandbox denials proving traversal root is `/`. Cousins: none named in the #94064 issue text. Stay off Matricula/Allograph/Agraphia/Gauntlet/Lictor/Lychgate/Ouster/Proscription/Frisket/Scant paradigms.

04:50 dragnet: a night blotter / police-fishing dragnet booth for #94064. Desktop app repeatedly spawns /usr/bin/find rooted at /; walk hits TCC-protected paths and raises repeated access-data-from-other-apps prompts (~1.5–3 min) regardless of open project. Idle **scoped** / seeded **dragnet** / path **root-find**. Score dragnet or admit scoped.

Score dragnet or admit scoped.

Idle word: **scoped** (HOLD: the scan would stay inside the open project / working tree and never ask for other-apps TCC). HOLD aliases: fenced, bounded, warranted, project-rooted, cwd-scoped. Seeded word: **dragnet** / #94064 (the root-find path). Path word: **root-find**. Product score: **dragnet**. Never idle enrolled / equated / penned / ungloved / attested / reaped / tenanted / barred or seeded Matricula / Allograph / Agraphia / gauntlet / lictor / lychgate / ouster / proscription / frisket / scant or path reload-blind / win-posix-mismatch / pre-tool-omit.

Phrase: **Score dragnet or admit scoped.**

- **scoped** = IDLE HOLD: the scan would stay inside the open project / working tree and never ask for other-apps TCC
- **dragnet** = seeded path / product score: unscoped full-disk trawl that hauls TCC alleys
- **root-find** = path word
- **hold** = HOLD alias for idle scoped
- **fenced** = HOLD alias: net stays inside the case
- **bounded** = HOLD alias: warrant bound to the open folder
- **warranted** = HOLD alias: named folder only
- **project-rooted** = HOLD alias: working tree is the walk root
- **cwd-scoped** = HOLD alias: walk starts at cwd
- **full-disk-find** = child `/usr/bin/find` starts at `/`
- **tcc-prompt** = repeated “claude would like to access data from other apps”
- **other-apps** = `kTCCServiceSystemPolicyAppData`
- **sandbox-denial** = Desktop, Documents, AddressBook, CallHistoryDB, CloudDocs, Safari caches
- **alley-trawl** = TCC-protected alleys hauled
- **blotter-loop** = recurs roughly every 1.5–3 minutes while the app is open
- **shared-process** = shared app process; no user action required
- **landing** = night blotter / police-fishing dragnet
- **has-repro** = published shape: 2.1.266 desktop macOS
- **cousins** = none named in #94064 issue text — do not invent
- **backups** = cite-only #93924 #93770 #93777 #94151 #94277 — do not auto-pick
- **fixtures** = night blotter / caution tape
- **walk** = published idle scoped → root-find → dragnet
- **closed** = #94064 remains OPEN — cite only; not this booth

Verdicts: scoped, dragnet, root-find, hold, fenced, bounded, warranted, project-rooted, cwd-scoped, full-disk-find, tcc-prompt, other-apps, sandbox-denial, alley-trawl, blotter-loop, shared-process, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **dragnet** or already **scoped**. Fixtures use the issue's published incident only. Walk-root rows are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the desktop shared process repeatedly launches `/usr/bin/find` rooted at `/` rather than the open project / working tree, so the walk enters TCC-protected containers and raises repeated access-data-from-other-apps prompts. Invite verify against #94064 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94064](https://github.com/anthropics/claude-code/issues/94064)
- Cousins: none named in the #94064 issue text (do NOT invent cousins / do NOT conflate recent paradigms).
- Backups (data only; next focus only — do not auto-pick): #93924, #93770, #93777, #94151, #94277

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:desktop
- Environment: Claude Code desktop (`com.anthropic.claude-code`, 2.1.266)
- Child `/usr/bin/find` walks the filesystem starting at `/`, not the open project / cwd
- Walk descends into TCC-protected locations
- Repeated macOS “claude would like to access data from other apps” consent prompts
- Also touches Contacts / Desktop / Full Disk Access surfaces
- Sandbox denials on Desktop, Documents, AddressBook, CallHistoryDB, CloudDocs, Safari caches, etc.
- Recurs roughly every 1.5–3 minutes while the app is open
- No user action required
- Shared app process is responsible
- Evidence: `com.apple.TCC` unified log (`kTCCServiceSystemPolicyAppData`) and kernel sandbox denials proving traversal root is `/`

Problem found: ROOT-FIND — desktop `/usr/bin/find` is not scoped to the open project and hauls TCC-protected alleys.

Why Dragnet: A *dragnet* is a police or fishing net that sweeps every alley instead of staying on the named case. The open project is the warrant. A find rooted at `/` is the unscoped trawl. Matricula/#93987 was an enrollment desk / reload-blind — DIFFERENT. Allograph/#94256 was a type-foundry / win-posix-mismatch — DIFFERENT. Agraphia/#94251 was a clinical writing-desk / pre-tool-omit — DIFFERENT. This booth is specifically root-find on desktop full-disk `find` — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: scoped catalog page + node diagnostic encoding idle **scoped** / seeded **dragnet** / path **root-find** so operators can score whether the booth is **dragnet** or already **scoped**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A desktop disk walk should stay inside the open project / working tree (cwd-scoped)
2. Child `/usr/bin/find` must not start at `/` when a project folder is open
3. The app should not raise repeated access-data-from-other-apps TCC prompts with no user action
4. TCC-protected alleys stay outside the warrant
5. Contacts / Desktop / Full Disk Access surfaces should not be touched by an idle open app
6. A scoped scan would never ask for other-apps TCC

## Why not a clone

This is specifically: **DESKTOP `/usr/bin/find` ROOTED AT `/` HAULS TCC-PROTECTED ALLEYS AND RAISES REPEATED OTHER-APPS PROMPTS WHILE THE APP SITS IDLE.**

Novel paradigm: night blotter / police-fishing dragnet / caution tape / city-grid net / case-file — asphalt, blotter paper, amber, steel. New issue, new paradigm (root-find), new UI/UX/fonts/colors, new scoring vocabulary. A dragnet map, not an enrollment desk, type-foundry ledger, neurology clinic, tilting-yard glove, purple fasces aisle, parish porch, bailiff desk, or Roman tablet.

**NOT Matricula/#93987** (reload-blind). Different defect. NOT enrollment desk. Do not reuse enrolled / Matricula / reload-blind.

**NOT Allograph/#94256** (win-posix-mismatch). Different defect. NOT type-foundry / punchcutter. Do not reuse equated / Allograph / win-posix-mismatch.

**NOT Agraphia/#94251** (pre-tool-omit). Different defect. NOT clinical writing-desk. Do not reuse penned / Agraphia / pre-tool-omit.

**NOT Gauntlet/#94029** (attach-mouse). Different defect. NOT tilting-yard / iron glove. Do not reuse ungloved / gauntlet / attach-mouse.

**NOT Lictor/#94053** (picker-bypass). Different defect. NOT purple fasces aisle. Do not reuse attested / lictor / picker-bypass.

**NOT Lychgate/#94059** (bg-task-stale). Different defect. NOT parish porch. Do not reuse reaped / lychgate / bg-task-stale.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / proscription / deny-list-hollow.

**NOT Frisket.** Different catalog paradigm. Do not reuse Frisket.

**NOT Scant.** Different catalog paradigm. Do not reuse Scant.

Live: https://hermes-playground-green.vercel.app/dragnet/

```
node --test projects/dragnet/dragnet.test.mjs
node projects/dragnet/dragnet.mjs projects/dragnet/data/dragnet.json
```
