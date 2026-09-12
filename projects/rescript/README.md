# Rescript

An **imperial chancery / wax-seal / scrolled-rescript booth** — a rescript is a rewritten decree issued from the chancery scroll the session still holds. The disk charter should be merged, but `/model` save-as-default scrapes and rewrites the whole parchment from the in-session scroll. Fonts **Big Shoulders Display** (display) + **Atkinson Hyperlegible** (sans) + **Red Hat Mono** (mono). Palette: parchment `#F4EBD0`, ink `#1B1A17`, seal `#8B2E2E`, brass `#C4A35A`, soot `#3A342C`, wax-ribbon `#6B3A3A`. Chancery lectern / wax-seal / scrolled-rescript UI. NOT a trig survey, clerk desk, followspot, stone calendar, mill weir, sailing irons, bow cathead, film continuity, Nullarbor, petard, manuscript speech-break, novel disseisin, flashback desk, monstrance, cipherlock, attainder court, palimpsest, palinode, or any prior catalog paradigm.

A disk charter (`~/.claude/settings.json`) should take a merge. Instead accepting "saved as your default for new sessions" from `/model` scrapes the entire parchment from the scroll the session still holds.

Primary:

- [anthropics/claude-code#93742](https://github.com/anthropics/claude-code/issues/93742) (OPEN). Title: `/model save-as-default rewrites all of settings.json from a stale session snapshot, silently reverting hooks`. Labels: bug, has repro, platform:linux, area:core, area:hooks, data-loss. Accepting "saved as your default for new sessions" from `/model` rewrites the ENTIRE user `~/.claude/settings.json` from an in-session snapshot rather than merging into the file on disk. Long-lived/resumed session reverts settings to whatever that session last loaded; discards everything added since. Incident: 19 local hook entries; 5 PreToolUse/PostToolUse security/verification hooks vanished; disarmed ~3 days across every session; looked normal. Bisect by add-date: vanished hooks first seen 2026-09-07 22:16 → 2026-09-08 00:18; survivors 2026-08-27 and earlier. No exceptions either direction → coherent older snapshot, not truncation/corruption. Three signals: (1) point-in-time content split, (2) serializer fingerprint — every `\uXXXX` escape became literal UTF-8 (Node JSON.stringify; intentional CLI complete save), (3) forward model key + backward hooks = current change on older base (snapshot-write, not read-modify-write). No agent Write/Edit/Bash touched the path in transcripts. Timeline UTC: hooks added 2026-09-08 04:16–06:18; session originally started 2026-08-13 resumed 2026-09-08 15:17; `/model` save 2026-09-10 14:30:46 "Set model to Fable 5.1 and saved as your default for new sessions"; missing hooks noticed 2026-09-11. Env: Claude Code v2.1.269 (also 2.1.267/2.1.268), Linux Ubuntu 26.04 bash; settings.json symlink into git-tracked dotfiles. Repro: hooks in settings → long-lived/resumed session → add new hook on disk from elsewhere → `/model` save-as-default in old session → new entry gone, model updated. A newly opened session save does NOT reproduce. Impact: hook absence undetectable at runtime; anything protecting settings.json from inside settings.json is removed by the same write. Cousins cite-only: #76749 (closed, `{"env":{}}` overwrite around /model), #93469 (`{"model":"opus[1m]"}` reset), #79403 (VS Code /model malformed JSON), #89215 (Web repo settings ignored). Backups cite-only (next focus only — do not auto-pick): #93722 #93743 #93745 #93672 #93652 #93680 #93618 #93694.

09:50 rescript: an imperial chancery / wax-seal / scrolled-rescript booth for #93742. Idle **intact** / seeded **scraped** / path **snapshot-write**. Score rescript or admit intact.

Score rescript or admit intact.

Idle word: **intact** (HOLD: disk charter merged; hooks remain; no snapshot scrape). Seeded word: **scraped** / #93742 (entire settings.json rewritten from an in-session scroll). Path word: **snapshot-write**. Product score: **rescript**. Never idle fresh / residual / monadnock / plain / ridden / rider / lit / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / nullarbor / standing / petard / raised / aposiopesis / seised / disseisin / ordered / analepsis / viewed / monstrance / sealed / cipherlock / untainted / attainder / voiced / sourdine / kindled / foxfire / flushed / pentimento or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score rescript or admit intact.**

- **intact** = IDLE: HOLD; disk charter merged; hooks remain; no snapshot scrape
- **scraped** = #93742 seeded path: entire settings.json rewritten from an in-session scroll
- **rescript** = product score word for a chancery whose press issued a rewritten decree from the older scroll
- **snapshot-write** = path word: complete scrape of the session scroll onto the disk charter
- **hold** = HOLD alias for idle intact
- **merge-to-disk** = expected write: new model key merged into the file on disk
- **stale-scroll** = session originally started 2026-08-13, resumed 2026-09-08 15:17; scroll older than the charter
- **forward-model** = model key updated to Fable 5.1 on top of the older scroll
- **backward-hooks** = hooks revert to whatever the session last loaded
- **serializer-fingerprint** = every `\uXXXX` escape became literal UTF-8 (Node JSON.stringify complete save)
- **nineteen-hooks** = 19 local hook entries on the quire
- **five-vanished** = 5 PreToolUse/PostToolUse security/verification hooks vanished
- **three-days** = disarmed ~3 days across every session; looked normal
- **has-repro** = published shape: Linux Ubuntu 26.04 bash; v2.1.269; 19 hooks; 5 vanished; 3 days; serializer fingerprint
- **cousins** = cite-only #76749 #93469 #79403 #89215 — do not rebuild
- **backups** = cite-only #93722 #93743 #93745 #93672 #93652 #93680 #93618 #93694 — do not auto-pick
- **fixtures** = disk charter / session scroll / wax press / hook quire / ink fingerprint
- **walk** = published idle intact → merge-to-disk → stale-scroll → nineteen-hooks → forward-model → backward-hooks → serializer-fingerprint → five-vanished → three-days → snapshot-write → rescript

Verdicts: intact, scraped, rescript, snapshot-write, hold, merge-to-disk, stale-scroll, forward-model, backward-hooks, serializer-fingerprint, nineteen-hooks, five-vanished, three-days, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the chancery is **scraped** / **rescript** or already **intact**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): save-as-default may serialize an in-memory settings snapshot taken at session load and write it whole, applying only the new model key on top. Invite verify against #93742 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93742](https://github.com/anthropics/claude-code/issues/93742)
- Cite-only cousins: #76749 (CLOSED — settings.json overwritten with `{"env":{}}` stale in-memory around /model; different defect), #93469 (`~/.claude` reset; settings reduced to `{"model":"opus[1m]"}`; different defect), #79403 (VS Code /model toggle intermittently corrupts settings.json — malformed JSON; different defect), #89215 (Web: repo `.claude/settings.json` silently ignored so hooks never run; different defect)
- Backups (data only; next focus only — do not auto-pick): #93722, #93743, #93745, #93672, #93652, #93680, #93618, #93694

What happened (from the issue text — do not invent):

- OPEN.
- Labels: bug / has repro / platform:linux / area:core / area:hooks / data-loss
- Claude Code v2.1.269 (also 2.1.267/2.1.268)
- Linux Ubuntu 26.04 bash
- `settings.json` symlink into git-tracked dotfiles
- Accepting "saved as your default for new sessions" from `/model` rewrites the ENTIRE user `~/.claude/settings.json` from an in-session snapshot
- Does not merge into the file on disk
- Long-lived/resumed session reverts settings to whatever that session last loaded
- Discards everything added since
- Incident: 19 local hook entries
- 5 PreToolUse/PostToolUse security/verification hooks vanished
- Disarmed ~3 days across every session; looked normal
- Bisect by add-date: vanished hooks first seen 2026-09-07 22:16 → 2026-09-08 00:18
- Survivors 2026-08-27 and earlier
- No exceptions either direction → coherent older snapshot, not truncation/corruption
- Three signals: (1) point-in-time content split, (2) serializer fingerprint — every `\uXXXX` escape became literal UTF-8 (Node JSON.stringify; intentional CLI complete save), (3) forward model key + backward hooks = current change on older base (snapshot-write, not read-modify-write)
- No agent Write/Edit/Bash touched the path in transcripts
- Timeline UTC: hooks added 2026-09-08 04:16–06:18; session originally started 2026-08-13 resumed 2026-09-08 15:17; `/model` save 2026-09-10 14:30:46; missing hooks noticed 2026-09-11
- Repro: hooks in settings → long-lived/resumed session → add new hook on disk from elsewhere → `/model` save-as-default in old session → new entry gone, model updated
- A newly opened session save does NOT reproduce
- Impact: hook absence undetectable at runtime; anything protecting settings.json from inside settings.json is removed by the same write

Problem found: `/MODEL` SAVE-AS-DEFAULT REWRITES THE ENTIRE USER `~/.claude/settings.json` FROM AN IN-SESSION SNAPSHOT RATHER THAN MERGING INTO THE FILE ON DISK; A RESUMED SESSION DISCARDS HOOKS ADDED SINCE IT LAST LOADED.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the chancery stayed **intact** or went **scraped**. Educational chancery booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Merge the new model key into the file on disk; keep hooks added since the session last loaded; do not rewrite the entire `~/.claude/settings.json` from an in-session snapshot

## Why not a clone

This is specifically: **`/MODEL` SAVE-AS-DEFAULT SCRAPES THE WHOLE DISK CHARTER FROM THE IN-SESSION SCROLL; FORWARD MODEL KEY + BACKWARD HOOKS; SERIALIZER FINGERPRINT.**

Novel paradigm: imperial chancery / wax-seal / scrolled rescript whose press should merge a new clause into the living disk charter; instead it issues a rewritten decree from the scroll the session still holds.

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

Do NOT rename Rescript to any existing catalog slug. Catalog currently has 302 products; Rescript is #303.
Do NOT reuse idle fresh / residual / monadnock / plain / ridden / rider / lit / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / standing / raised / seised / ordered / viewed / sealed / untainted / voiced / kindled / flushed, or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted.
Display here is **Big Shoulders Display**. Body is **Atkinson Hyperlegible**. Mono is **Red Hat Mono**.

Different surface: `/model` save-as-default whole-file snapshot-write of user `settings.json` vs nested-submodule worktree base vs tool-result attachment rider vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist vs scheduled WebSearch hang vs xnu ptmx race vs cloud pre-warm checkout vs MEMORY.md retract vs scraped-vellum palimpsest.

Different UI: disk charter / session scroll / wax press / hook quire / ink fingerprint. Big Shoulders Display / Atkinson Hyperlegible / Red Hat Mono. Parchment with ink, seal, brass, soot, wax-ribbon. NOT granite survey. NOT parchment clerk desk. NOT stage black. NOT marble fasti. NOT mill-house. NOT Atlantic sailing. NOT oak timber.

Different verbs: Merge the charter, Score rescript, Walk the chancery, Compare intact / scraped, Pin idle intact, Pin seeded scraped, Pin snapshot-write, Hold the intact.

Different idle: **intact**. Different #93742 seeded path: **scraped**. HOLD: **intact** / **hold**. ALARM: **scraped** / **rescript** / **snapshot-write** / **stale-scroll**. Path: **snapshot-write**.

## How to score

```bash
node --test projects/rescript/rescript.test.mjs
node projects/rescript/rescript.mjs projects/rescript/data/scraped.json
echo '{"seed":"scraped"}' | node projects/rescript/rescript.mjs
```

Open the living card at `projects/rescript/index.html` (or the live path `/rescript/`). Buttons: Merge the charter, Score rescript, Walk the chancery, Compare intact / scraped, Pin idle intact, Pin seeded scraped, Pin snapshot-write, Hold the intact. Toggle chips for: stale-scroll, forward-model, backward-hooks, serializer-fingerprint, nineteen-hooks, five-vanished, three-days — the score flips. Lay a fixture JSON on the quire tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s snapshot-write walk from the published #93742 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/rescript/
- Folder: `projects/rescript/`
