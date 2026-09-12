# Homograph

A **lexicographer’s homograph desk / dictionary headword-collision booth** — two different lemmas that look identical after diacritics and script marks are stripped; shelf marks collapse; the wrong volume opens. Fonts **EB Garamond** (display/serif headwords) + **Nunito Sans** (UI) + **IBM Plex Mono** (chips/mono). Palette: dictionary cream `#EFE6D2`, ivory `#F8F3E6`, indigo ink `#1A2748`, vermilion lemma markers `#C94A32`, graphite rules `#3F3F3D`. Lemma slips / shelf marks / volume spines / collation desk / orphan quire. NOT a printer-galley wet-proof (Galley), NOT a chancery/wax-seal (Rescript), NOT trig survey (Monadnock), NOT parliamentary rider (Rider), NOT theatrical followspot (Followspot), NOT calendar/weir/sailing.

Two Korean-named folders should keep **distinct** shelves. Instead the slug derivation collapses non-ASCII path characters to a generic `-`, so a new project silently inherits memory from an unrelated — even deleted — project.

Primary:

- [anthropics/claude-code#93743](https://github.com/anthropics/claude-code/issues/93743) (OPEN). Title: `Project memory/session storage collides across different projects due to non-ASCII path slug encoding`. Labels: bug, platform:windows, area:core. Claude Code derives `~/.claude/projects/<slug>/` by converting the working-directory path into a slug. Non-ASCII characters (e.g. Korean) appear to be collapsed into a generic `-` regardless of their actual content, so two completely different folder names can produce the *identical* slug. When that happens, the new project silently inherits (and can overwrite) the memory/session data of an unrelated — even long-deleted — project. Repro on Windows: folder A `C:\Users\<user>\Downloads\근평 웹만들기` writes memory; delete A; folder B `C:\Users\<user>\Downloads\비계량지표평가` loads A's Supabase HR-app memory into an unrelated HWP/PDF tool session, because both paths encoded to `C--Users-<user>-Downloads--------` (dash count happened to match). Expected: unique per real path (hash of the full absolute path, or percent-encode UTF-8). Storage for a path that no longer exists should not be silently reused. Impact: cross-project memory/session leakage. Environment: Windows 11 Pro (10.0.26200), Git Bash / PowerShell, desktop app Code tab. Cousins cite-only: #91735 (same non-ASCII collide), #70076 (all non-alnum → `-`), #69752 (absolute-path key orphans on move), #89915 (wrong project hash), #85595 (memory vs transcript key inconsistency). Backups cite-only (next focus only — do not auto-pick): #93757 #93746 #93744 #93722 #93672 #93652 #93680 #93618 #93694.

11:50 homograph: a lexicographer’s headword-collision booth for #93743. Idle **distinct** / seeded **collided** / path **lossy-slug**. Score homograph or admit distinct.

Score homograph or admit distinct.

Idle word: **distinct** (HOLD: paths keep separate memory). Seeded word: **collided** / #93743 (lossy dash-collapse merges memories). Path word: **lossy-slug**. Product score: **homograph**. Never idle dry / billed / stop-dirty / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / lit / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / nullarbor / standing / petard / raised / aposiopesis / seised / disseisin / ordered / analepsis / viewed / monstrance / sealed / cipherlock / untainted / attainder / voiced / sourdine / kindled / foxfire / flushed / pentimento or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score homograph or admit distinct.**

- **distinct** = IDLE: HOLD; paths keep separate memory
- **collided** = #93743 seeded path: lossy dash-collapse merges memories
- **homograph** = product score word for two lemmas that share one shelf mark
- **lossy-slug** = path word: non-ASCII path characters collapse to a generic dash
- **hold** = HOLD alias for idle distinct
- **hashed-path** = expected write: slug is a hash of the full absolute path
- **percent-encode** = expected write: percent-encode UTF-8 instead of collapsing non-ASCII
- **orphan-store** = deleted-path store remains and can silent-revive
- **dash-collapse** = non-ASCII runes map to a generic `-`; distinguishing bytes thrown away
- **lemma-a** = folder A `근평 웹만들기` (Supabase HR evaluation web app)
- **lemma-b** = folder B `비계량지표평가` (HWP/PDF parsing tool)
- **shelf-merge** = same dash count — two shelf marks become one
- **memory-leak** = B loads A's `memory/*.md` — HR-app notes in an HWP/PDF session
- **silent-revive** = deleted-path store loads for an unrelated new path; no adopt step
- **ascii-prefix** = reporter stopgap (rename with an ASCII prefix); not the real fix
- **has-repro** = published shape: two Korean folders; same all-dash slug; orphan revive; cross-project leak
- **cousins** = cite-only #91735 #70076 #69752 #89915 #85595 — do not rebuild
- **backups** = cite-only #93757 #93746 #93744 #93722 #93672 #93652 #93680 #93618 #93694 — do not auto-pick
- **fixtures** = lemma slips / shelf mark / volume spine / collation desk / orphan quire
- **walk** = published idle distinct → lemma-a → dash-collapse → orphan-store → lemma-b → lossy-slug → shelf-merge → memory-leak → silent-revive → lossy-slug → homograph

Verdicts: distinct, collided, homograph, lossy-slug, hold, hashed-path, percent-encode, orphan-store, dash-collapse, lemma-a, lemma-b, shelf-merge, memory-leak, silent-revive, ascii-prefix, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the desk is **collided** / **homograph** or already **distinct**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): slug should hash the full absolute path or percent-encode UTF-8; orphan stores for deleted paths should not silent-revive. Invite verify against #93743 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93743](https://github.com/anthropics/claude-code/issues/93743)
- Cite-only cousins: #91735 (same non-ASCII collide), #70076 (all non-alnum → `-` guaranteed collisions), #69752 (absolute-path key orphans on move), #89915 (wrong project hash), #85595 (memory vs transcript key inconsistency)
- Backups (data only; next focus only — do not auto-pick): #93757, #93746, #93744, #93722, #93672, #93652, #93680, #93618, #93694

What happened (from the issue text — do not invent):

- OPEN.
- Labels: bug / platform:windows / area:core
- Claude Code derives `~/.claude/projects/<slug>/` by converting the working-directory path into a slug
- Non-ASCII characters (e.g. Korean) appear to be collapsed into a generic `-` regardless of their actual content
- Two completely different folder names can produce the identical slug
- The new project silently inherits (and can overwrite) the memory/session data of an unrelated — even long-deleted — project
- Folder A: `C:\Users\<user>\Downloads\근평 웹만들기` writes `memory/*.md`
- Folder A deleted from disk
- Folder B: `C:\Users\<user>\Downloads\비계량지표평가` opens an unrelated HWP/PDF tool session
- B loads A's Supabase-based HR evaluation web-app memory
- Both paths encoded to `C--Users-<user>-Downloads--------` (dash count happened to match)
- Multiple distinct Korean-named folders under the same parent produced slugs that differ only in dash *count*
- The stale project's storage was never cleaned up after its source folder was deleted, and was silently revived
- Reporter stopgap: ASCII prefix rename (`eval-근평 웹만들기`) so the slug no longer collapses to an all-dash string
- Users should not have to rename working folders (already referenced in shortcuts, docs, other tools)
- Environment: Windows 11 Pro (10.0.26200); Git Bash / PowerShell; desktop app, Code tab

Problem found: PROJECT MEMORY/SESSION STORAGE COLLIDES ACROSS DIFFERENT PROJECTS BECAUSE NON-ASCII PATH SLUG ENCODING COLLAPSES DISTINCT FOLDERS ONTO ONE SHELF MARK.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the desk stayed **distinct** or went **collided**. Educational lexicographer booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Unique per real path (hash of the full absolute path, or percent-encode UTF-8 instead of collapsing non-ASCII to a fixed placeholder); do not silent-revive orphan stores for deleted paths

## Why not a clone

This is specifically: **NON-ASCII PATH CHARACTERS COLLAPSE TO A GENERIC DASH SO TWO DISTINCT FOLDERS SHARE ONE `~/.claude/projects/<slug>/` STORE; A DELETED PATH'S MEMORY SILENT-REVIVES IN AN UNRELATED SESSION.**

Novel paradigm: lexicographer’s homograph desk / dictionary headword collision — two lemmas that look identical after script marks are stripped; shelf marks collapse; the wrong volume opens.

**NOT Galley** (printer’s wet-proof booth for a different defect). NOT printer’s tray / unbound sheets. Do not reuse that booth’s idle / seeded / path words.

**NOT Rescript/#93742** (`/model` save-as-default scrapes settings.json). Different defect. NOT chancery / wax-seal. Do not reuse intact / scraped / snapshot-write.

**NOT Monadnock/#93703** (nested submodule worktree from local main). Different defect. NOT trig survey / residual mountain. Do not reuse fresh / residual / submodule-base.

**NOT Rider/#93683** (tool-result `type=attachment` rider). Different defect. NOT parliamentary clerk desk / bill-rider. Do not reuse plain / ridden / attachment-rider.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Do not reuse lit / dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Anachronism/#93585** (cloud pre-warm vs session-start checkout race). Different defect. NOT continuity slate / darkroom. Do not reuse tip / prewarm-latch.

**NOT Nullarbor/#93595** (plugin HTTP MCP `${VAR}` header expands empty). Different defect. NOT saltbush / empty-bearer. Do not reuse stamped / emptied / empty-expand.

**NOT Petard/#93607** (Linux Bash-tool `pkill -f` matches wrapper argv). Different defect. NOT siege petard. Do not reuse standing / hoisted / wrapper-argv.

**NOT Palimpsest** (slug taken — scraped-vellum underpainting / prior catalog paradigm). Different defect. Do not rebuild.

**NOT Palinode/#92998** (MEMORY.md overflow sheds newest corrections). Different defect. NOT scriptorium retract. Do not rebuild.

**NOT Homonym** (slug taken — different catalog product). Homograph is the dictionary collision of two lemmas that look identical after marks are stripped. Do not rebuild.

Do NOT rename Homograph to any existing catalog slug. Catalog currently has 304 products; Homograph is #305.
Do NOT reuse idle dry / billed / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / lit / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / standing / raised / seised / ordered / viewed / sealed / untainted / voiced / kindled / flushed, or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted.
Display here is **EB Garamond**. Body is **Nunito Sans**. Mono is **IBM Plex Mono**.

Different surface: non-ASCII slug collision + orphan-store revive vs Stop dirty-tree full-turn bill vs `/model` snapshot-write vs nested-submodule worktree base vs tool-result attachment rider vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist vs scheduled WebSearch hang vs xnu ptmx race vs cloud pre-warm checkout vs MEMORY.md retract vs scraped-vellum palimpsest.

Different UI: lemma slips / shelf mark / volume spine / collation desk / orphan quire. EB Garamond / Nunito Sans / IBM Plex Mono. Dictionary cream with indigo ink, vermilion lemma markers, graphite rules. NOT printer-galley soot/brass. NOT parchment chancery. NOT granite survey. NOT parchment clerk desk. NOT stage black. NOT marble fasti. NOT mill-house. NOT Atlantic sailing. NOT oak timber.

Different verbs: Keep shelves distinct, Score homograph, Walk the headwords, Compare distinct / collided, Pin idle distinct, Pin seeded collided, Pin lossy-slug, Hold the distinct.

Different idle: **distinct**. Different #93743 seeded path: **collided**. HOLD: **distinct** / **hold**. ALARM: **collided** / **homograph** / **lossy-slug** / **dash-collapse**. Path: **lossy-slug**.

## How to score

```bash
node --test projects/homograph/homograph.test.mjs
node projects/homograph/homograph.mjs projects/homograph/data/collided.json
echo '{"seed":"collided"}' | node projects/homograph/homograph.mjs
```

Open the living card at `projects/homograph/index.html` (or the live path `/homograph/`). Buttons: Keep shelves distinct, Score homograph, Walk the headwords, Compare distinct / collided, Pin idle distinct, Pin seeded collided, Pin lossy-slug, Hold the distinct. Toggle chips for: dash-collapse, orphan-store, lossy-slug, shelf-merge, memory-leak, silent-revive, lemma-b — the score flips. Lay a fixture JSON on the collation blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s lossy-slug walk from the published #93743 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/homograph/
- Folder: `projects/homograph/`
