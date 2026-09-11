# Analepsis

A **manuscript flashback / collation-desk booth** — verso folio, recto gathering, splice gutter, dusk horizon, stuck quill. Fonts **Libre Baskerville** (display) + **Figtree** (body) + **IBM Plex Mono** (mono). Palette: vellum dusk — pale paper `#F3E6CE`, ink `#2A1A14`, foxing `#C17A45`, dusk `#3E2C38`, violet-brown `#6A4556`, gutter rust `#9A4034` — manuscript flashback, NOT sanctuary gilt/crimson, NOT cloister dusk, NOT vault steel, NOT parchment court, NOT concert velvet.

Analepsis is a literary flashback: an earlier narrative stretch is re-inserted after the present, so the reader (the feed bottom) lands in the past.

Primary:

- [anthropics/claude-code#93569](https://github.com/anthropics/claude-code/issues/93569) (OPEN, bug, has repro, platform:macos, area:desktop). Title: `[BUG] Desktop: older turns get re-delivered behind a background_tasks_redelivered marker and rendered last, so the feed ends on a turn from hours earlier`. Claude Code **2.1.260**, bundled in Claude desktop **1.49585.0** (2.1.266 arrived the morning after). Code tab. macOS 26.5.1 (25F80). Opus. Anthropic API. A Desktop session ended on a reply from 19:25 with a working marker below it, although sixteen turns had completed since (last at 22:30) and the reporter had been working in that window until 22:13. It stayed that way for an hour and a half, through session switches and a popout. Transcript on disk was complete and in order. The page had all the data too, only in the wrong order. React tree: 4,438 stream messages in order up to 22:30:16, then a synthetic row `{"type":"system","subtype":"background_tasks_redelivered","tasks":[],"source_uuid":"…","session_id":"…"}` without uuid or timestamp, then 477 rows from 18:32:26 to 19:24:37. No uuid appeared twice — the stretch was moved, not duplicated. Rendered feed (161 entries) put those eight exchanges after the 22:30 turn, so a bottom-anchored list ended on 19:24; because the list ends on a task notification rather than a `result`, the working marker stuck. The marker is not a CLI message; the main process builds it from a `background_tasks_changed` event whose `source_uuid` pointed at 17:01:26, the last before `/compact`. Reloading (Cmd+R) fixed it. Cousins cite-only: #92197 #92089 #88428 #84858 #83247 #92610.

18:50 analepsis: a manuscript flashback / collation-desk booth for #93569. Idle **ordered** / seeded **redelivered** / path **marker-misorder**. Score analepsis or admit ordered.

Score analepsis or admit ordered.

Idle word: **ordered** (HOLD: disk, React tree, and feed agree on chronology). Seeded word: **redelivered** / #93569 (older stretch re-inserted after the present). Path word: **marker-misorder**. Product score: **analepsis**. Never idle viewed / withheld / monstrance / phantom-deny / closed / lingering / unrung / compline / sealed / blanked / concurrent-write / cipherlock / untainted / attainted / attainder / voiced / muted / sourdine / lodged / dropped / forksink.

Phrase: **Score analepsis or admit ordered.**

- **ordered** = IDLE: HOLD; disk folio, React tree, and feed bottom stay chronological
- **redelivered** = #93569 seeded path: older stretch moved after present behind the marker
- **analepsis** = product score word for the gathering whose recto re-inserts an earlier stretch
- **marker-misorder** = path word: the synthetic `background_tasks_redelivered` splice is the cut
- **hold** = HOLD alias for idle ordered
- **disk-intact** = transcript on disk complete and in order (~7,600 rows, 30 MB)
- **tree-spliced** = React tree runs to 22:30:16, then the marker, then 477 moved rows
- **feed-bottom-early** = 161 rendered entries; 145–160 are the eight flashback exchanges
- **working-stuck** = list ends on a task notification rather than a result
- **moved-not-copied** = no uuid appeared twice
- **no-uuid-dup** = stretch was moved, not duplicated
- **marker-no-stamp** = synthetic row has no uuid and no timestamp
- **source-pre-compact** = `source_uuid` pointed at `background_tasks_changed` of 17:01:26
- **main-process-built** = main process builds the marker from `background_tasks_changed`
- **not-cli** = CLI binary does not contain the string
- **reload-fixes** = Cmd+R rebuilt the page; everything came back in order
- **popout-inherited** = popout window showed the same mis-ordered feed
- **ipc-only** = transcript reaches the page over IPC; HAR holds only shell / telemetry
- **compact-then-idle** = `/compact` at 17:10, idle disconnect at 17:42, warmup at 18:30
- **mid-turn-unfocus** = switched away mid-turn at 19:24 and again at 22:13
- **has-repro** = published shape: long session, compact, idle disconnect, mid-turn unfocus, later finish unfocused
- **cousins** = cite-only #92197 #92089 #88428 #84858 #83247 #92610 — do not rebuild
- **backups** = cite-only #93574 #93576 #93556 #93553 #93546 #93530 #93570 — do not auto-pick
- **fixtures** = disk / tree / gutter / feed / quill table for the analepsis booth
- **walk** = published idle ordered → compact-then-idle → mid-turn-unfocus → disk-intact → marker-splice → tree-spliced → feed-bottom-early → working-stuck → source-pre-compact → marker-misorder → analepsis

Verdicts: ordered, redelivered, analepsis, marker-misorder, hold, disk-intact, tree-spliced, feed-bottom-early, working-stuck, moved-not-copied, no-uuid-dup, marker-no-stamp, source-pre-compact, main-process-built, not-cli, reload-fixes, popout-inherited, ipc-only, compact-then-idle, mid-turn-unfocus, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the gathering is **redelivered** / **analepsis** or already **ordered**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): treat the synthetic `background_tasks_redelivered` marker as the splice point that reorders the feed. Main process builds it from a `background_tasks_changed` event (source_uuid pointed at the last such event before compaction). Invite verify against #93569 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93569](https://github.com/anthropics/claude-code/issues/93569)
- Cite-only cousin: [anthropics/claude-code#92197](https://github.com/anthropics/claude-code/issues/92197) (older branch after compaction; content missing rather than reordered; survives restarts)
- Cite-only cousin: [anthropics/claude-code#92089](https://github.com/anthropics/claude-code/issues/92089) (same shape after a second `/compact`)
- Cite-only cousin: [anthropics/claude-code#88428](https://github.com/anthropics/claude-code/issues/88428) (reopen after restart shows no transcript)
- Cite-only cousin: [anthropics/claude-code#84858](https://github.com/anthropics/claude-code/issues/84858) (empty reopen cousin)
- Cite-only cousin: [anthropics/claude-code#83247](https://github.com/anthropics/claude-code/issues/83247) (scroll left where it was)
- Cite-only cousin: [anthropics/claude-code#92610](https://github.com/anthropics/claude-code/issues/92610) (`WarmLifecycle:preview` tearing down a different surface)
- Backup (data only): #93574 #93576 #93556 #93553 #93546 #93530 #93570

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:desktop.
- Claude Code **2.1.260**; Claude desktop **1.49585.0**; Code tab; macOS 26.5.1
- Session UI ended on a 19:25 reply with a working marker, although later turns ran to 22:30
- Transcript on disk complete and ordered; the page had all the data in the wrong order
- React tree: 4,438 rows to 22:30:16, then `background_tasks_redelivered` (no uuid/timestamp), then 477 moved rows (18:32–19:24)
- Rendered feed: 161 entries; 145–160 are the eight flashback exchanges; bottom is 19:24
- Marker built by the main process from `background_tasks_changed`; `source_uuid` at 17:01:26 (last before compaction)
- Stuck through session switches, popout, ~1.5 hours; Cmd+R restored order
- No conversation data on the network; transcript reaches the page over IPC

Problem found: SYNTHETIC `background_tasks_redelivered` MARKER SPLICES AN OLDER STRETCH AFTER THE PRESENT → feed bottom lands on an hours-earlier turn; working marker sticks because the list ends on a task notification.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the gathering stayed **ordered** or was **redelivered**. Educational collation desk for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A re-delivered batch merges into the list by uuid at its original position, or replaces the list wholesale
2. It never lands after newer messages
3. The feed bottom should be the latest result, not an hours-earlier task notification

## Why not a clone

This is specifically: **SYNTHETIC `background_tasks_redelivered` MARKER SPLICES AN OLDER STRETCH AFTER THE PRESENT → feed ends on an hours-earlier turn.**

**NOT Monstrance/#93563** (Artifact read binds withdrawn native WebFetch). Different defect. NOT sanctuary gilt/crimson.

**NOT Compline/#93549** (remote-control bridge never sends `end_session`). NOT cloister dusk.

**NOT Cipherlock/#93537** (concurrent Keychain MCP OAuth wipe). NOT vault/brass dial.

**NOT Attainder/#93529** (parked-permission false user-rejected). NOT parchment court.

**NOT Sourdine/#93531** (MessageDisplay mute). NOT concert hall.

**NOT Forksink/#93458** (SessionStart additionalContext drop on fork). NOT municipal grate.

**NOT Foxfire/#93502.** **NOT Pentimento/#93482.** **NOT Vinculum/#93485.** **NOT Cachet/#93490.**

**NOT #92197/#92089** — older branch after compaction hides newest days (content missing, survives restarts). Cite only; this booth is a moved stretch after a synthetic marker, and a reload fixed it.

**NOT #88428/#84858** — empty reopen. **NOT #83247** — scroll position. **NOT #92610** — WarmLifecycle teardown of a different surface.

Do NOT rename Analepsis to any existing catalog slug. Catalog currently has 289 products; Analepsis is #290.
Do NOT reuse idle viewed / withheld / phantom-deny, closed / lingering / unrung, sealed / blanked / concurrent-write, untainted / attainted, voiced / muted, lodged / dropped, or other prior booth verbs.
Display here is **Libre Baskerville**. Body is **Figtree**. Mono is **IBM Plex Mono**.

Different surface: Desktop Code-tab feed redelivery vs Cowork Artifact native-WebFetch bind vs routine `end_session` leak vs concurrent Keychain wipe vs parked-permission false user-rejected vs MessageDisplay narration mute.

Different UI: verso folio / recto gathering / splice gutter / dusk horizon / stuck quill. Libre Baskerville / Figtree / IBM Plex Mono. Vellum dusk. NOT sanctuary night. NOT cloister dusk. NOT bank vault. NOT parchment court. NOT concert-hall velvet.

Different verbs: Collate the quires, Score analepsis, Open the splice, Compare disk / tree, Pin idle ordered, Pin seeded redelivered, Pin marker-misorder, Restack the gathering.

Different idle: **ordered**. Different #93569 seeded path: **redelivered**. HOLD: **ordered** / **hold**. ALARM: **redelivered** / **analepsis** / **marker-misorder** / **tree-spliced**. Path: **marker-misorder**.

## How to score

```bash
node --test projects/analepsis/analepsis.test.mjs
node projects/analepsis/analepsis.mjs projects/analepsis/data/redelivered.json
echo '{"seed":"redelivered"}' | node projects/analepsis/analepsis.mjs
```

Open the living card at `projects/analepsis/index.html` (or the live path `/analepsis/`). Buttons: Collate the quires, Score analepsis, Open the splice, Compare disk / tree, Pin idle ordered, Pin seeded redelivered, Pin marker-misorder, Restack the gathering. Toggle chips for: disk intact, tree spliced, feed bottom early, working stuck, moved not copied, marker no stamp, source pre-compact, reload restores order — the score flips. Lay a fixture JSON on the blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s redelivered walk from the published #93569 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/analepsis/
- Folder: `projects/analepsis/`
