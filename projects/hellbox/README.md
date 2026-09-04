# Hellbox

A **letterpress composing-room desk** — lead type, composing stick, standing line, hellbox (bin for discarded/broken type), ink-black + warm paper cream + vermilion scrap marks + brass rules — Fraunces + DM Sans + IBM Plex Mono — for a real Claude Code defect: **CHANGE_DIRECTORY LEAVES $CLAUDE_PROJECT_DIR AT THE LAUNCH PROJECT, AND THE RESULTING ENOENT SILENTLY ERASES EVERY USER PROMPT (EXIT 2 READS AS DENY); AREA:HOOKS + DATA-LOSS; PLATFORM:MACOS.**

Primary:

- [anthropics/claude-code#92168](https://github.com/anthropics/claude-code/issues/92168) (OPEN, bug, has-repro, platform:macos, area:hooks, data-loss, filed 2026-09-04T17:30:41Z, updated 2026-09-04T17:32:10Z). Title: `change_directory leaves $CLAUDE_PROJECT_DIR at the launch project, and the resulting ENOENT silently erases every user prompt (exit 2 reads as deny)`. Reporter Rasherb69 (Lewis Bacon). Claude Code 2.1.204. Failing session in Claude desktop app. macOS 26.5.2 arm64. Node v24.15.0. python3 3.14.5. Shell-form hooks.

a hellbox that melts the standing line when sticky CLAUDE_PROJECT_DIR ENOENT exits 2 is read as deny — it is type already scrapped. Score the form or admit the line already scrapped.

Idle word: **set**. Seeded state: **scrapped** / #92168 — sticky launch `$CLAUDE_PROJECT_DIR` + UserPromptSubmit ENOENT + python3/argparse exit 2 read as deny + silent erase. Never idle as pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled.

**Hellbox** is a printer's discard bin for broken or discarded type. Sticky launch `CLAUDE_PROJECT_DIR` plus exit-2 ENOENT dumps every user line into the hellbox (**scrapped**) instead of leaving type **set** in the form.

- **scrapped** = #92168: sticky launch pin + ENOENT + exit 2 read as deny + silent erase
- **sticky** = `change_directory` loads new project hooks/settings but does not repoint `$CLAUDE_PROJECT_DIR`; stays at launch dir
- **enoent** = newly-adopted UserPromptSubmit hooks resolve under the old launch path → ENOENT
- **exit2** = python3 exits 2 on missing script; argparse also exits 2; UserPromptSubmit treats exit 2 as deny
- **erase** = prompt never reaches the model; four consecutive prompts erased in 33 seconds; asking what is wrong is itself a prompt
- **launch-pin** = `$CLAUDE_PROJECT_DIR` stays at the launch project (often scratch workspace); SessionStart does not fire on mid-session `change_directory`
- **hold** = CLAUDE_PROJECT_DIR follows change_directory; the standing line stayed set
- **set** = HOLD: CLAUDE_PROJECT_DIR follows change_directory; the form stayed locked; idle word set

Verdicts: set, scrapped, sticky, enoent, exit2, erase, launch-pin, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the form held or already scrapped the standing line. Fixtures use the path stamps and exit codes from the issue.

Hypothesis only (NON-BINDING): change_directory loads the new project's hooks and settings but leaves $CLAUDE_PROJECT_DIR pinned at the launch directory (often a scratch workspace). Newly-adopted UserPromptSubmit hooks resolve under that old path, miss the script (ENOENT), python3/argparse exit 2, and UserPromptSubmit treats exit 2 as deny — so the prompt is erased and never reaches the model. SessionStart does not fire on mid-session change_directory, so the pin is never repaired. Discard if issue evidence disagrees. Encoded from the issue's launch-pin, ENOENT, exit-2 deny, and four-prompt erase. Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **STICKY LAUNCH $CLAUDE_PROJECT_DIR AFTER change_directory, THEN USERPROMPTSUBMIT ENOENT EXIT 2 READ AS DENY, SILENT PROMPT ERASE ON CLAUDE CODE 2.1.204 DESKTOP — area:hooks + data-loss.**

NOT Cupel ([#92122](https://github.com/anthropics/claude-code/issues/92122)) — era-legacy shared-pool then draft-07 outputSchema refusal.
NOT Oubliette ([#92095](https://github.com/anthropics/claude-code/issues/92095)) — cold-parent Dispatch child-completion queue.
NOT Ephemera ([#92090](https://github.com/anthropics/claude-code/issues/92090)) — Fable 5.1 five-minute subagent cache wick rewrite.
NOT Commutator ([#91958](https://github.com/anthropics/claude-code/issues/91958)) — streamable-http concurrent batch JSON-RPC id mis-correlation.
NOT Heddle — stay off.
NOT Hectograph ([#92056](https://github.com/anthropics/claude-code/issues/92056)) — OTEL `tool_input` / `tool_parameters` scrub-flag leak.
NOT Placet ([#92040](https://github.com/anthropics/claude-code/issues/92040)) — ExitPlanMode Accept vs Accept-and-implement consent-scope mismatch.
NOT Frisket ([#91574](https://github.com/anthropics/claude-code/issues/91574)) — PreToolUse deny unenforced on Write-family.
NOT Hawser ([#91578](https://github.com/anthropics/claude-code/issues/91578)) — Windows desktop idle warm sessions never release MCP child processes.

Different surface: diagnostic scoring of sticky launch `$CLAUDE_PROJECT_DIR` plus exit-2 ENOENT erase. Completely different UI (lead type + composing stick + hellbox bin + vermilion scrap + brass rules), backend (form-shaped JSON of launch-pin / ENOENT / exit2 / erase rows), and UX.

Cousins are cite-only on a cousin strip; primary stays #92168.

- [#88830](https://github.com/anthropics/claude-code/issues/88830) — OPEN — invisible hook failures. Cite-only.
- [#81291](https://github.com/anthropics/claude-code/issues/81291) — OPEN — stale CLAUDE_PROJECT_DIR after mid-session cd. Cite-only.
- [#87890](https://github.com/anthropics/claude-code/issues/87890) — OPEN — EnterWorktree hooks. Cite-only.

Different-class cite:

- [#92074](https://github.com/anthropics/claude-code/issues/92074) — OPEN — hooks don't fire in VS Code — not erase. Cite-only.

Backups (document only, do not build): [#92171](https://github.com/anthropics/claude-code/issues/92171) (Belay — slash $1 drop), [#92166](https://github.com/anthropics/claude-code/issues/92166) (Ashbin — /tmp scratchpad reboot wipe), [#92158](https://github.com/anthropics/claude-code/issues/92158) (Capstan — sandbox clones never GC'd).

Product name stays **Hellbox**. Do not rename to Cupel, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Homograph, Deckle, Damper or any existing catalog slug.

Different UI: letterpress composing-room desk + lead type + composing stick + hellbox discard bin + vermilion scrap marks / ink-black / paper cream / brass. Fraunces + DM Sans + IBM Plex Mono. NOT Bodoni Moda / Outfit (Cupel). NOT Eczar / Schibsted Grotesk / Martian Mono (Oubliette). NOT Newsreader / Figtree / Source Code Pro (Ephemera). Stay OFF Cupel assay office / Oubliette dungeon / Ephemera wick atelier / rotary copper drum / gelatin hectograph / congregation chamber / print-shop frisket / dockyard hawser.

Different verbs: Score the form, pin idle set, pin seeded scrapped, admit the line already scrapped, load fixtures, reset to set. Score the form is this desk's phrase.

Different idle: **set**.

## Live catalog path

`/hellbox/` is this static letterpress composing room. Path `https://hermes-playground-green.vercel.app/hellbox/` and subdomain `https://hellbox.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `03:50 / hermes catalog #140 / #92168`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **scrapped** — sticky launch pin; UserPromptSubmit ENOENT; exit 2 read as deny; four prompts erased in 33 seconds; the standing line is already in the hellbox.
2. Idle **set** → CLAUDE_PROJECT_DIR follows change_directory; the standing line stayed set; the form is locked.
3. Composing-room UI: job case / composing stick / hellbox discard bin / brass rules / vermilion scrap marks. Set = the standing line stayed in the form. Scrapped = the line already melted into the hellbox.
4. Cousin cite strip labeled cousin-not-primary: [#88830](https://github.com/anthropics/claude-code/issues/88830), [#81291](https://github.com/anthropics/claude-code/issues/81291), [#87890](https://github.com/anthropics/claude-code/issues/87890). Different-class: [#92074](https://github.com/anthropics/claude-code/issues/92074). Cite only. Primary stays #92168.
5. **Score the form** walks the probe ticket and lights chips on the bench. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/hellbox/index.html` in a browser, or serve the repo root and visit `/hellbox/` (Vercel rewrite → `/projects/hellbox`). No build step. Optional hook:

```bash
node projects/hellbox/hook/hellbox.mjs projects/hellbox/data/92168.json
node --test projects/hellbox/hook/hellbox.test.mjs
```

Empty stdin scores the idle **set** ticket. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **scrapped**.
