# Palinode

A **scriptorium retract / palinode booth** — wax tablet, iron stylus, scraped vellum leaf, retract strip, ink pot, ruling lines; warm parchment + iron-gall dark palette; fonts **Cardo** (display) + **Nunito Sans** (body) + **IBM Plex Mono** (mono) — for a real Claude Code defect: **AUTO-MEMORY MEMORY.md APPEND + BOTTOM TRUNCATION DISCARDS NEWEST ENTRIES (INCLUDING CORRECTIONS/SUPERSESSIONS) WHILE SUPERSEDED TEXT STAYS LOADED; WRITE REPORTS SUCCESS; ~25k BYTE CAP BINDS BEFORE 200-LINE CAP; AGE-PRUNE EXHAUSTED.**

Primary:

- [anthropics/claude-code#92998](https://github.com/anthropics/claude-code/issues/92998) (OPEN, bug, area:core, memory). Title: `Auto-memory: MEMORY.md overflow silently discards the NEWEST entries, so corrections are lost while the text they correct stays loaded`. Authored 2026-09-09T04:47:31Z by No-Smoke.

14:50 palinode: a scriptorium retract booth that should keep newest MEMORY.md corrections **emended** (truncate oldest/top); instead overflow truncates from the bottom so newest supersessions are shed **unretracted** while the text they correct stays authoritative — score unretracted or admit emended.

Score unretracted or admit emended.

Idle word: **emended** (HOLD: truncate from the top / validate on write / newest corrections retained; budget visible; frontmatter well-formed). Seeded word: **unretracted** / #92998 (append succeeds past cap; bottom truncation discards newest supersessions; older contradicted text stays authoritative; later-session warning only; 0 age-prune eligible; ~25k byte ceiling binds first). Path word: **palinoded**. Never idle unretracted / ephemeral / passable / admitted / deeded / collated / stereotyped / voided / rebound / fouled / cold / banked.

Phrase: **a palinode that sheds the newest retraction is not a correction — it is the superseded claim still loaded. Score the retract or admit emended.**

- **emended** = IDLE: HOLD; truncate from the top; newest corrections retained; write validated; budget visible; frontmatter well-formed
- **unretracted** = #92998 seeded path: append succeeds past cap; bottom truncation discards newest supersessions; superseded text stays loaded
- **palinoded** = path word: a palinode that sheds the newest retraction
- **bottom-truncate** = overflow truncates from the bottom
- **newest-discarded** = most recently written entries discarded
- **supersession-lost** = correction discarded; superseded claim stays authoritative
- **write-reports-success** = write reports success; no error at write time
- **later-session-warning** = loss surfaces only as a later-session warning
- **byte-cap-25k** = ~25,000 byte ceiling binds first
- **line-cap-200** = MEMORY.md loads up to 200 lines
- **age-prune-zero** = 30-day floor returned 0 eligible
- **frontmatter-lost** = memory file lost frontmatter; still occupies an index line; no flag
- **truncate-from-top** = ranked ask (1): truncate from the top, not the bottom
- **budget-surface** = ranked ask (3): surface budget after write
- **has-repro** = concrete silo of 199 memories at 201/200 lines
- **hold** = HOLD alias for idle emended
- **cousins** = cite-only #25006 #33143 #38452 #39811 #57574 CLOSED — do not clone
- **fixtures** = row list for the palinode booth

Verdicts: emended, unretracted, bottom-truncate, newest-discarded, supersession-lost, write-reports-success, later-session-warning, byte-cap-25k, line-cap-200, age-prune-zero, frontmatter-lost, truncate-from-top, budget-surface, has-repro, hold, palinoded, cousins, fixtures, chips, fingerprints.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the retract is **unretracted** or already **emended**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): load/truncate path treats MEMORY.md as a bottom-capped append log without write-time budget checks, so newest lines are the first discarded. Invite verify against #92998 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92998](https://github.com/anthropics/claude-code/issues/92998)
- Cite-only: [anthropics/claude-code#25006](https://github.com/anthropics/claude-code/issues/25006) (CLOSED — docs/feature 200-line hard limit)
- Cite-only: [anthropics/claude-code#33143](https://github.com/anthropics/claude-code/issues/33143) (CLOSED — remove arbitrary 200-line limit)
- Cite-only: [anthropics/claude-code#38452](https://github.com/anthropics/claude-code/issues/38452) (CLOSED — increase MEMORY.md line limit)
- Cite-only: [anthropics/claude-code#39811](https://github.com/anthropics/claude-code/issues/39811) (CLOSED — entries silently dropped past 200 lines, no write warning)
- Cite-only: [anthropics/claude-code#57574](https://github.com/anthropics/claude-code/issues/57574) (CLOSED — silently truncated at ~25KB; recent rules lost)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, area:core, memory
- Re-file after stale-bot closed #25006, #33143, #38452, #39811, #57574 — docs gap from #25006 is fixed (200-line load documented); silent write-path failure is not
- MEMORY.md loads up to 200 lines / ~25,000 bytes; entries append at the bottom; truncation is from the bottom
- Overflow discards the most recently written entries with no error at write time — write reports success; loss surfaces only as a later-session warning after the model already ran without those facts
- Corrections that supersede earlier memories are always newer, so truncation preferentially discards supersessions and leaves superseded text loaded → silo degrades toward confidently wrong, not merely less information
- Concrete: project silo of 199 memories at 201/200 lines; the single entry past the cap described an in-flight operation and contradicted an earlier still-loaded instruction — acting on the older one would corrupt a running build chain
- Age profile at cap: current month 96, previous month 91, older than ~5 weeks 12; automated retirement of never-consulted at 30-day floor returned **0** eligible — age-based prune cannot rescue an active project
- Byte cap binds before line cap almost everywhere (description-truncation ladder still ~22.7–22.9k bytes while lines stay under 200 until hooks are truncated to nothing)
- Related silent failure: a memory file that lost its frontmatter entirely still occupied an index line while invisible to frontmatter-keyed paths, with no flag
- Asks ranked: (1) truncate from the top not the bottom; (2) validate/warn on write past cap; (3) surface budget after write; (4) well-formedness check on memory files — raising the cap alone is not the fix

Problem found: A PALINODE THAT SHEDS THE NEWEST RETRACTION IS NOT A CORRECTION — IT IS THE SUPERSEDED CLAIM STILL LOADED.

Why this solution: a diagnostic scriptorium retract booth for the emended → unretracted drift, so a reader can pin idle emended, load the #92998 unretracted path, and score palinoded / bottom-truncate / newest-discarded / supersession-lost / write-reports-success / later-session-warning / byte-cap-25k / line-cap-200 / age-prune-zero / frontmatter-lost / truncate-from-top / budget-surface / has-repro against the published facts.

## Why not a clone

This is specifically: **AUTO-MEMORY MEMORY.md APPEND + BOTTOM TRUNCATION DISCARDS NEWEST ENTRIES (INCLUDING CORRECTIONS/SUPERSESSIONS) WHILE SUPERSEDED TEXT STAYS LOADED; WRITE REPORTS SUCCESS; ~25k BYTE CAP BINDS BEFORE 200-LINE CAP; AGE-PRUNE EXHAUSTED.**

**NOT Oxbow** (transcript keeps stranded abandoned meander vs live newest days). Different paradigm.

**NOT Recension/#92949** (auto-compact re-injects CLAUDE.md/MEMORY.md from last-user-prompt snapshot, not disk). Different paradigm.

**NOT Setoff** (subagent first requests carry MEMORY.md + skill_listing attachments contrary to docs). Different paradigm.

**NOT Palimpsest** (scraped undertext / underwrit holding). Different paradigm.

**NOT Ephemera/#92090** (5m ephemeral cache TTL forces full context rewrite). Different paradigm.

**NOT Lethe / Codicil / Coffer / Reliquary** paradigms.

**NOT Ferrule/#92968** (Desktop MCP OAuth hardcoded TCP 53280). Different paradigm.

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session.

Different paradigm: **MEMORY.md overflow truncates from the bottom so newest supersessions are shed while superseded text stays loaded; write reports success; ~25k byte cap binds first; age-prune exhausted.**

Do NOT rename this product Oxbow, Recension, Setoff, Palimpsest, Ephemera, Ferrule, or any existing catalog slug.
Do NOT reuse idle unretracted / ephemeral / passable / admitted / deeded / collated / stereotyped / voided / rebound / fouled / cold / banked.
Do NOT reuse Oswald + Source Sans 3 + Share Tech Mono (Ferrule). Do NOT reuse Chakra Petch + Hind (Interlock). Do NOT reuse Literata + Public Sans + JetBrains Mono (Recension). Do NOT reuse Newsreader + Lexend + Fragment Mono (Mirage).

Different surface: MEMORY.md write-path bottom truncation vs transcript meander / last-prompt compact snapshot / subagent first-request attachments / scraped undertext / Desktop OAuth port clamp.

Product name stays **Palinode**. Name/slug `palinode` unused in catalog.json (240 products before this ship; Ferrule is #240).

Different UI: wax tablet / iron stylus / scraped vellum leaf / retract strip / ink pot / ruling lines / warm parchment + iron-gall. Cardo / Nunito Sans / IBM Plex Mono. NOT metalwork ferrule gunmetal/cyan. NOT plant interlock. NOT river-ford watchword. NOT collation desk / stemma.

Different verbs: Score the retract, Pin idle emended, Pin seeded unretracted, Admit emended, Load fixtures, Reset to emended.

Different idle: **emended**. Different #92998 seeded path: **unretracted**. HOLD: **emended**. ALARM: **unretracted** / **palinoded** / **bottom-truncate** / **newest-discarded** / **supersession-lost** / **write-reports-success** / **later-session-warning** / **byte-cap-25k** / **line-cap-200** / **age-prune-zero** / **frontmatter-lost** / **truncate-from-top** / **budget-surface** / **has-repro** / **cousins** / **fixtures**. Path: **palinoded**.

## How to score

```bash
node --test projects/palinode/palinode.test.mjs
node projects/palinode/palinode.mjs projects/palinode/data/92998.json
node projects/palinode/palinode.mjs projects/palinode/data/emended.json
echo '{"seed":"unretracted"}' | node projects/palinode/palinode.mjs
```

Open the living card at `projects/palinode/index.html` (or the live path `/palinode/`). Buttons: Score the retract, Pin idle emended, Pin seeded unretracted, Admit emended, Load fixtures, Reset to emended. Toggle truncate bottom / top / newest discarded / supersession lost / write success / budget — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/palinode/
- Folder: `projects/palinode/`
