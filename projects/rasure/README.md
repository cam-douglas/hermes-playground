# Rasure

A **parchment rasure / scriptorium scraping booth** — writing is scraped off the parchment leaf until CreationTime of `~/.claude` is new. Fonts **Crimson Pro** (display) + **Manrope** (body) + **Source Code Pro** (mono). Palette: parchment `#F4ECD8`, ink `#1C1917`, scraped-ghost `#C4B8A0`, wax-seal `#7A1F1F`, margin-rule `#8B7355`, lampblack `#2A2520`. Scraped parchment leaf / margin rules / wax seal chip / CreationTime stamp flip / blank `.claude.json` stub / secrets-folder badge / backup-timestamp chip. NOT Ashpan (foundry grate: delete_session clears index but orphan CLI-uuid jsonl lingers — opposite polarity leftover-vs-wipe). NOT Outrider (cavalry / headersHelper race). NOT Necrology (parish death-register / incomplete listing). NOT Snuffer (candle / ganged OR). NOT Reliquary / Cenotaph / Wraith / Afterimage / Midden / Oubliette, NOT Innominate/Changeling/Homograph/Galley/Rescript/Monadnock/Rider/Followspot/Calends/Weir/Irons/Cathead/Anachronism, NOT Aphonia/Muzzle/Escutcheon/Lacuna/Annunciator/Tocsin/Scrim/Knock/Quench, NOT millimeter-slider or woodworking leftover. This is specifically the wholesale `~/.claude` wipe+recreate: CreationTime flips, stubs replace the leaf.

The leaf should stay **intact** (HOLD: CreationTime stable; config survives). Instead a wholesale wipe **rasured** the folder after a **creation-time-flip**.

Primary:

- [anthropics/claude-code#93791](https://github.com/anthropics/claude-code/issues/93791) (OPEN, has repro). Title: `~/.claude config directory silently wiped and recreated - 4 incidents, matches #41415/#34330 pattern`. Labels: bug, has repro, platform:windows, area:core, data-loss. Environment: Windows 11 Pro; native install (`~/.local/bin/claude`); auto-update channel; version 2.1.269 at most recent incidents (updated cleanly from 2.1.268 the evening before — no update at incident times per `.last-update-result.json`). `~/.claude` deleted and recreated wholesale **four times** since late August; folder **CreationTime** flips (full delete+recreate, not content edits). `.claude.json` regenerates blank; prompt history and transcripts zero out; settings.json reverts to a stub missing most hooks. Incident 4 (~2026-09-12 ~09:28, within ~2h of incident 3) wiped the entire folder again including `secrets/` (19 files of unrelated local API tokens). Incident 3 at 2026-09-12 07:29:35 wiped 7,462 transcripts + full config mid/after recovery work; chat vanished mid-session on a prior occurrence. Reporter ruled out: scheduled tasks, antivirus/OneDrive sync scope, suspicious startup entries; Windows auto-update of Claude Code completed hours earlier. A `~/.claude/backups/` folder with `.claude.json.backup.<timestamp>` appeared after one incident — looks written by Claude Code itself (internal config-repair/backup mechanism). Cousins cite-only (do not rebuild): #41415 (`~/.claude/agents/` silently emptied by Claude Code's own node process; closed not planned), #34330 (`.claude/skills/` deleted within ~300ms of creation; closed duplicate), #70052 / #54092 (transcripts vanishing), #93742 (settings snapshot rewrite via `/model` save-as-default — different mechanism). Backups cite-only (next focus only — do not auto-pick): #93788 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782.

18:50 rasure: a parchment rasure / scriptorium scraping booth for #93791. Idle **intact** / seeded **rasured** / path **creation-time-flip**. Score rasure or admit intact.

Score rasure or admit intact.

Idle word: **intact** (HOLD: CreationTime stable; config survives — the hold/good path). Seeded word: **rasured** / #93791 (wholesale wipe+recreate). Path word: **creation-time-flip**. Product score: **rasure**. Never idle swept / ashpanned / ashpan / orphan-jsonl / credentialed / outridden / outrider / early-connect / attested / necrologized / necrology / incomplete-listing / named / innominate / icon-only / lit / snuffed / snuffer / ganged-or / pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / stop-dirty / galley / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / nullarbor / standing / petard / raised / aposiopesis / seised / disseisin / ordered / analepsis / viewed / monstrance / sealed / cipherlock / untainted / attainder / voiced / sourdine / kindled / foxfire / flushed / pentimento or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score rasure or admit intact.**

- **intact** = IDLE: HOLD; CreationTime stable; config survives
- **rasured** = #93791 seeded path: wholesale wipe+recreate of `~/.claude`
- **rasure** = product score word for the scraped leaf
- **creation-time-flip** = path word: folder CreationTime of the leaf is new
- **hold** = HOLD alias for idle intact
- **wholesale-wipe** = four incidents since late August; full delete+recreate, not content edits
- **blank-claude-json** = `.claude.json` regenerates blank; prompt history and transcripts zero out
- **stubs-settings** = settings.json reverts to a stub missing most hooks
- **secrets-lost** = incident 4 wiped `secrets/` (19 files of unrelated local API tokens)
- **backup-stamp** = `~/.claude/backups/.claude.json.backup.<timestamp>` appeared after one incident
- **has-repro** = published shape: wholesale-wipe; CreationTime flip; blank stub; secrets lost
- **cousins** = cite-only #41415 #34330 #70052 #54092 #93742 — do not rebuild
- **backups** = cite-only #93788 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 — do not auto-pick
- **fixtures** = scraped parchment leaf / margin rules / wax seal chip / CreationTime stamp flip / blank `.claude.json` stub / secrets-folder badge / backup-timestamp chip
- **walk** = published idle intact → wholesale-wipe → blank-claude-json → stubs-settings → secrets-lost → backup-stamp → creation-time-flip → rasure

Verdicts: intact, rasured, rasure, creation-time-flip, hold, wholesale-wipe, blank-claude-json, stubs-settings, secrets-lost, backup-stamp, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **rasured** / **rasure** or already **intact**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): an internal cloud-sync/repair path may clear `~/.claude` instead of merging (matching the #41415 theory). Invite verify against #93791 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93791](https://github.com/anthropics/claude-code/issues/93791)
- Cite-only cousins: #41415 (`~/.claude/agents/` silently emptied twice by Claude Code's own background process; reporter's filesystem trace showed the CLI's own node process doing the delete; theorized "a cloud-agent sync path that clears the local directory instead of merging into it." Closed not planned, no root cause published), #34330 (`.claude/skills/` actively watched and deleted by the CLI process within ~300ms of file creation, v2.1.76. Closed as duplicate), #70052 / #54092 (transcripts vanishing from `.claude/projects/`), #93742 (`/model` save-as-default scrapes settings.json — different mechanism: settings.json rewrite vs wholesale directory recreate). Related wipe / data-loss class, not this exact CreationTime-flip recreate.
- Backups (data only; next focus only — do not auto-pick): #93788 (ESC-sequence keys dead 2.1.269), #93766 (OneDrive musl/glibc false error), #93764 (DECSTBM blank rows), #93754 (remoteControlAtStartup toggle), #93751, #93744, #93772, #93770, #93777, #93782

What happened (from the issue text — do not invent):

- OPEN, has repro
- Labels: bug / has repro / platform:windows / area:core / data-loss
- Environment: Windows 11 Pro; native install (`~/.local/bin/claude`); auto-update channel
- Version at most recent incidents: 2.1.269 (updated cleanly from 2.1.268 the evening before, per `.last-update-result.json` — no update ran at the actual incident times)
- `~/.claude` deleted and recreated wholesale **four times** since late August
- Folder CreationTime changes (full delete+recreate, not content edits)
- `.claude.json` regenerates blank; prompt history and transcripts zero out
- settings.json reverts to a stub missing most hooks
- Incident 1 (~2026-08-25/26): ~3,572 transcripts, skills, plugins, hooks — recovered from a Windows shadow copy
- Incident 2 (~2026-09-08): entire folder — manual copy salvaged beforehand
- Incident 3 (2026-09-12 07:29:35): 7,462 transcripts, full config — shadow copy + incremental backup script
- Incident 4 (2026-09-12 ~09:28, within ~2h of incident 3's recovery finishing): entire folder again, including `secrets/` (19 files of unrelated local API tokens)
- Chat vanished mid-session on a prior occurrence
- Ruled out: scheduled tasks, antivirus/OneDrive/Google Drive File Stream sync scope, suspicious startup entries, Windows auto-update of Claude Code at the exact incident time
- A `~/.claude/backups/` folder containing `.claude.json.backup.<timestamp>` files appeared after one incident — looks written by Claude Code itself

Problem found: ~/.CLAUDE WAS DELETED AND RECREATED WHOLESALE — CREATIONTIME OF THE LEAF FLIPS; STUBS REPLACE HISTORY, HOOKS, AND (ON INCIDENT 4) SECRETS/.

Why this solution: living catalog page + node diagnostic encoding idle **intact** / seeded **rasured** / path **creation-time-flip** so operators can score whether the booth is a **rasure** or already **intact**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Confirmation of whether an internal cloud-sync/repair mechanism can, under some condition, clear `~/.claude` instead of merging into it (matching the #41415 theory)
2. Any telemetry/logging that could correlate with the published timestamps if provided privately

## Why not a clone

This is specifically: **THE WHOLESALE ~/.CLAUDE WIPE+RECREATE — CREATIONTIME FLIPS, STUBS REPLACE THE LEAF.**

Novel paradigm: parchment rasure / scriptorium scraping booth — writing is scraped off the parchment until CreationTime of the leaf is new.

**NOT Ashpan/#93780** (foundry grate: delete_session clears index but orphan CLI-uuid jsonl lingers — opposite polarity leftover-vs-wipe). Different defect. NOT industrial grate / ashpan / foundry. Do not reuse swept / ashpanned / orphan-jsonl.

**NOT Outrider/#93776** (headersHelper timing race). Different defect. NOT cavalry outrider / dispatch-rider / sealed pouch. Do not reuse credentialed / outridden / early-connect.

**NOT Necrology/#93774** (incomplete `/models` listing asserted as death). Different defect. NOT parish necrology / death-register / incomplete listing. Do not reuse attested / necrologized / incomplete-listing.

**NOT Innominate/#93769** (Send/Stop empty accessible name). Different defect. NOT innominate nameplate / blank-escutcheon. Do not reuse named / icon-only.

**NOT Snuffer/#93746** (`enableArtifact: false` kills scratchpad). Different defect. NOT candle-snuffer / taper / ganged OR. Do not reuse lit / snuffed / ganged-or.

**NOT Changeling/#93757** (remote reconnect discards `/model`). Different defect. NOT fairy-court / cradle-swap. Do not reuse pledged / swapped / remote-reattach.

**NOT Homograph/#93743** (non-ASCII path slug collision). Different defect. NOT lexicographer / headword / lemma. Do not reuse distinct / collided / lossy-slug.

**NOT Galley/#93745** (Stop dirty-tree full-turn bill). Different defect. NOT printer’s tray / unbound sheets. Do not reuse dry / billed / stop-dirty.

**NOT Rescript/#93742** (`/model` save-as-default scrapes settings.json). Cite as cousin only. Different mechanism: settings.json rewrite vs wholesale directory recreate. NOT chancery / scrolled-rescript / lectern. Do not reuse scraped / snapshot-write as this booth's path.

**NOT Monadnock/#93703** (nested submodule worktree from local main). Different defect. NOT trig survey / residual mountain. Do not reuse fresh / residual / submodule-base.

**NOT Rider/#93683** (tool-result `type=attachment` rider). Different defect. NOT parliamentary clerk desk / bill-rider. Do not reuse plain / ridden / attachment-rider.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Do not reuse dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Anachronism/#93707** (prewarm latch / stale take). Different defect. NOT continuity slate. Do not reuse tip / stale / prewarm-latch.

**NOT Reliquary** (latch). Different defect. NOT reliquary latch. Do not rebuild.

**NOT Cenotaph** (vacant monument). Different defect. NOT vacant monument. Do not rebuild.

**NOT Wraith**. Different defect. Do not rebuild.

**NOT Afterimage** (CRT residual). Different defect. Do not rebuild.

**NOT Midden** (GC refuse). Different defect. Do not rebuild.

**NOT Oubliette**. Different defect. Do not rebuild.

**NOT Aphonia / Muzzle / Escutcheon / Lacuna / Annunciator / Tocsin / Scrim / Knock / Quench** (different metaphors). Different defects. Do not rebuild. NOT Aphonia. NOT Muzzle. NOT Escutcheon. NOT Lacuna. NOT Annunciator. NOT Tocsin. NOT Wraith. NOT Scrim. NOT Knock. NOT Quench.

Do NOT rename Rasure to any existing catalog slug. Catalog currently has 311 products; Rasure is #312.
Do NOT reuse idle swept / ashpanned / ashpan / orphan-jsonl / credentialed / outridden / outrider / early-connect / attested / necrologized / necrology / incomplete-listing / named / innominate / icon-only / lit / snuffed / snuffer / ganged-or / pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / galley / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / standing / raised / seised / ordered / viewed / sealed / untainted / voiced / kindled / flushed, or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted.
Display here is **Crimson Pro**. Body is **Manrope**. Mono is **Source Code Pro**.

Different surface: wholesale `~/.claude` wipe+recreate (CreationTime flips; stubs replace the leaf) vs leftover jsonl after index delete vs headersHelper timing race vs incomplete `/models` death-roll vs Send/Stop empty accessible name vs artifact/scratchpad ganged OR vs remote reconnect `/model` swap vs non-ASCII slug collision vs Stop dirty-tree full-turn bill vs `/model` snapshot-write vs nested-submodule worktree base vs tool-result attachment rider vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist vs scheduled WebSearch hang vs xnu ptmx race.

Different UI: scraped parchment leaf / margin rules / wax seal chip / CreationTime stamp flip / blank `.claude.json` stub / secrets-folder badge / backup-timestamp chip. Crimson Pro / Manrope / Source Code Pro. Parchment with ink, scraped-ghost, wax-seal, margin-rule, lampblack. NOT foundry iron/ember. NOT cavalry navy/khaki. NOT parchment death-register. NOT void/amber/teal nameplate. NOT beeswax/snuffer brass. NOT moonlit moss / fairy-gold. NOT dictionary cream/indigo. NOT printer-galley soot/brass. NOT granite survey. NOT parchment clerk desk. NOT stage black. NOT marble fasti. NOT mill-house. NOT Atlantic sailing. NOT oak timber.

Different verbs: Hold the parchment, Score rasure, Walk the creation-time-flip, Compare intact / rasured, Pin idle intact, Pin seeded rasured, Pin creation-time-flip, Hold the intact.

Different idle: **intact**. Different #93791 seeded path: **rasured**. HOLD: **intact** / **hold**. ALARM: **rasured** / **rasure** / **creation-time-flip** / **wholesale-wipe**. Path: **creation-time-flip**.

## How to score

```bash
node --test projects/rasure/rasure.test.mjs
node projects/rasure/rasure.mjs projects/rasure/data/rasured.json
echo '{"seed":"rasured"}' | node projects/rasure/rasure.mjs
```

Open the living card at `projects/rasure/index.html` (or the live path `/rasure/`). Buttons: Hold the parchment, Score rasure, Walk the creation-time-flip, Compare intact / rasured, Pin idle intact, Pin seeded rasured, Pin creation-time-flip, Hold the intact. Toggle chips for: creation-time-flip, wholesale-wipe, blank-claude-json, stubs-settings, secrets-lost, backup-stamp — the score flips. Lay a fixture JSON on the scriptorium blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s creation-time-flip walk from the published #93791 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/rasure/
- Folder: `projects/rasure/`
