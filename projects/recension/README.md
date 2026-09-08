# Recension

A **scriptorium / textual-criticism collation desk** — dark manuscript oak, iron-gall ink, parchment witnesses, stemma of versions A–F; fonts **Literata** (display) + **Public Sans** (body) + **JetBrains Mono** (mono) — for a real Claude Code defect: **AFTER AN AUTO-COMPACTION, THE `CLAUDE.md` / `MEMORY.md` CONTENT RE-INJECTED INTO CONTEXT IS THE COPY CAPTURED AT THE LAST USER PROMPT, NOT THE ON-DISK FILE. DISK IS CONSULTED ONLY WHEN THE NEXT USER PROMPT ARRIVES.**

Primary:

- [anthropics/claude-code#92949](https://github.com/anthropics/claude-code/issues/92949) (OPEN, bug, has repro, area:core, memory). Title: `[BUG] Auto-compaction re-injects the CLAUDE.md/MEMORY.md copy from the last user prompt, not the on-disk file; disk re-read only happens at the next prompt`. Claude Code 2.1.260→2.1.261; macOS Darwin 25.4; desktop Code tab; model `claude-fable-5-1`. Filed 2026-09-08T23:04:10Z by openaidachenguo000-ship-it.

08:50 recension: a scriptorium collation desk that should keep instruction files **collated** — auto-compact re-reads CLAUDE.md/MEMORY.md from disk; instead the last-user-prompt snapshot is **stereotyped** back into context and disk is ignored until the next user prompt — score stereotyped or admit collated.

Score stereotyped or admit collated.

Idle word: **collated** (HOLD: at auto-compact, CLAUDE.md/MEMORY.md re-read from disk and injected; matches the exemplar; docs-true). #92949 path: **stereotyped**. Seeded late-correct: **emended**. Never idle confirmed / loosed / banked / intact / enrolled / as-penned / rove / vaulted / cleared. Never path miraged / clung / rewritten / fouled.

**Recension** = the textual critic's systematic comparison of witnesses against an exemplar. Auto-compact should collate the disk exemplar. Instead it reprints a stereotyped last-prompt witness, so mid-turn edits stay silently absent from context until the user types something.

- **collated** = IDLE: HOLD; auto-compact re-reads disk; witness matches exemplar
- **stereotyped** = #92949 path: auto-compact reprints last-user-prompt snapshot; disk ignored
- **emended** = next user prompt writes `changed:true reason:compaction` from disk (correct but late)
- **compact-boundary** = `instructions` attachment at `compact_boundary`; `changed` absent
- **last-prompt-witness** = in-memory snapshot captured at the last user prompt
- **disk-exemplar** = on-disk file; docs say "Re-injected from disk"
- **late-refresh** = refresh mechanism works; it runs at the next user prompt
- **user-level** = `~/.claude/CLAUDE.md` 3060-char 21:37 copy still injected at 21:55
- **auto-memory** = `MEMORY.md` same last-prompt witness pattern
- **cousins** = cite-only #91243 #88886 #87937 #88023 — do not clone
- **before-after** = before stereotyped D/F; after expected collated F/F
- **fixtures** = row list for the collation desk

Verdicts: collated, stereotyped, emended, compact-boundary, last-prompt-witness, disk-exemplar, late-refresh, user-level, auto-memory, cousins, before-after, fixtures.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No Desktop hooks. No payloads. No secrets. No network to Anthropic. Score whether an auto-compact attachment is **stereotyped** or already **collated**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): auto-compact writes the instructions attachment from an in-memory last-prompt snapshot; disk re-read is deferred to the next user prompt. Invite verify against #92949 text only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92949](https://github.com/anthropics/claude-code/issues/92949)
- Cite-only: [anthropics/claude-code#91243](https://github.com/anthropics/claude-code/issues/91243)
- Cite-only: [anthropics/claude-code#88886](https://github.com/anthropics/claude-code/issues/88886)
- Cite-only: [anthropics/claude-code#87937](https://github.com/anthropics/claude-code/issues/87937)
- Cite-only: [anthropics/claude-code#88023](https://github.com/anthropics/claude-code/issues/88023)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, area:core, memory
- Claude Code 2.1.260 → 2.1.261; macOS Darwin 25.4; desktop Code tab; model `claude-fable-5-1`
- `CLAUDE_CODE_AUTO_COMPACT_WINDOW=300000`; 5 auto-compactions in one session
- Docs ("Context window" → *What survives compaction*) say project-root `CLAUDE.md` and auto memory are "Re-injected from disk"
- In practice they are re-injected from an in-memory snapshot captured at the last user prompt
- Any edit made during a long autonomous turn that spans an auto-compaction is silently reverted in the model's context until the user types something
- Every compaction writes an `attachment` of `type: "instructions"` next to the `compact_boundary`
- Every user prompt after a compaction may write another with `changed: true, reason: "compaction"`
- Published table (UTC): 20:42 start A/A; 20:55 / 21:11 / 21:29 auto-compact ×3 injected A (disk A / B edited 21:03 / B); 21:37 prompt C from disk; 21:55 compact C while disk D (edited 21:44); 22:00 prompt D; 22:49 compact D while disk F (edited 22:09 → E, 22:46 → F); 22:52 prompt F from disk
- At 22:49 the compaction re-injected a copy 40 minutes and two edits behind disk
- Same pattern for `~/.claude/CLAUDE.md` (edited 21:45 and 21:53; 21:55 compact still injected the 21:37 copy, 3060 chars; 22:00 refresh delivered 2610 chars) and for auto-memory `MEMORY.md`
- The refresh mechanism itself works. It just runs at the next user prompt instead of at the compaction
- Repro: long task through auto-compact; mid-turn append a marker to project `CLAUDE.md`; after compact the instructions attachment hash is unchanged (no marker); marker appears only at the next user prompt's `changed:true` compaction record
- Expected: at compaction, re-read from disk (as documented), or run the same re-read/inject step that currently runs at the next user prompt
- Workaround noted: `SessionStart` hook matcher `compact` listing instruction files whose mtime is newer than session start

Problem found: A COLLATION DESK THAT SHOULD KEEP THE DISK EXEMPLAR COLLATED AT AUTO-COMPACT INSTEAD STEREOTYPES THE LAST-PROMPT WITNESS BACK INTO CONTEXT.

Why this solution: a diagnostic collation desk for the collated → stereotyped drift, so a reader can pin idle collated, load the #92949 stereotyped path, and score emended / compact-boundary / last-prompt-witness / disk-exemplar / late-refresh / user-level / auto-memory / cousins / before-after against the published facts.

## Why not a clone

This is specifically: **MID-TURN AUTO-COMPACT SERVES A STEREOTYPED LAST-PROMPT WITNESS INSTEAD OF THE DISK EXEMPLAR.**

**NOT Mirage/#92920** (renderer ack without session; stale clear; lastRunAt lie). Cite only. Do not touch Mirage.

**NOT Remora/#92934** (PostToolUse child cling). Cite only. Do not touch Remora.

**NOT Palimpsest** (scraped undertext — different bug; name already used). Cite only.

**NOT Ephemera** (5m cache TTL). **NOT Setoff/#92750** (MEMORY on subagent first request). **NOT Veto** (standing CLAUDE.md overlay). **NOT Fathom** (compact drops standing rules). **NOT Hangfire/#92478** (queued /compact). **NOT Rubric/#92855** (TUI ordered-list renumber — also a scriptorium, different defect).

Cousins cite-only #91243 #88886 #87937 #88023 — compact / memory snapshot neighbours. Do not clone those products.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. NOT a Desktop automation.

Different paradigm: **the last-prompt witness is stereotyped at auto-compact; the disk exemplar is ignored until the next user prompt.**

Do NOT rename this product Mirage, Remora, Palimpsest, Rubric, or any existing catalog slug.
Do NOT reuse idle confirmed / loosed / banked / intact / enrolled / as-penned / rove / vaulted / cleared.
Do NOT reuse path miraged / clung / rewritten / fouled.

Different surface: mid-turn auto-compact instruction re-inject vs renderer-ack oasis / PostToolUse child-hold / scraped undertext / MEMORY-on-subagent-first-request / TUI list renumber.

Product name stays **Recension**. Name/slug `recension` unused in catalog.json (234 products before this ship; Mirage is #234).

Different UI: scriptorium collation desk / parchment witnesses / iron-gall / stemma / dark oak / candle. Literata / Public Sans / JetBrains Mono. NOT Newsreader + Lexend + Fragment Mono (Mirage desert). NOT Ibarra Real Nova + Red Hat Text + Red Hat Mono (Remora hull). NOT Cardo + Figtree + Source Code Pro (Rubric vermilion). NOT Cormorant Garamond + Source Serif 4 (Palimpsest).

Different verbs: Score stereotyped, Admit collated, Emend the late prompt, Load #92949, Reset to collated.

Different idle: **collated**. Different #92949 path: **stereotyped**. HOLD: **collated**. ALARM: **stereotyped** / **emended** / **compact-boundary** / **last-prompt-witness** / **disk-exemplar** / **late-refresh** / **user-level** / **auto-memory** / **cousins** / **before-after** / **fixtures**. Seeded late-correct: **emended**.

## How to score

```bash
node --test projects/recension/recension.test.mjs
node projects/recension/recension.mjs projects/recension/data/92949.json
node projects/recension/recension.mjs projects/recension/data/collated.json
echo '{"seed":"stereotyped"}' | node projects/recension/recension.mjs
```

Open the living card at `projects/recension/index.html` (or the live path `/recension/`). Buttons: Score stereotyped, Admit collated, Emend the late prompt, Load #92949, Load fixtures, Reset to collated. Toggle last-prompt witness vs disk exemplar — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/recension/
- Folder: `projects/recension/`
