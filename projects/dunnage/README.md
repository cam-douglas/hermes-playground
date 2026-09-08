# Dunnage

A **stevedore's dunnage crib** — dark hold timber, hemp rope chalk tallies, crate stencil numbers, north-port skylight; Literata + Red Hat Text + Fira Code — for a real Claude Code defect: **REMOTETRIGGER ACTION=LIST RETURNS HAS_MORE/NEXT_CURSOR BUT IGNORES THE CURSOR ARGUMENT SO ROUTINE LISTS BEYOND 20 CANNOT BE PAGED.** When a hypothetical restow yields a distinct page 2+ or stops advertising `has_more`/`next_cursor`, the crib is **advanced**.

Primary:

- [anthropics/claude-code#92746](https://github.com/anthropics/claude-code/issues/92746) (OPEN, bug, has repro, platform:wsl, area:routines). Title: `[BUG] RemoteTrigger action=list returns has_more/next_cursor but ignores the cursor argument, so routine lists beyond 20 cannot be paged`. Filed 2026-09-07T23:00:53Z.

11:50 dunnage: a stevedore's dunnage crib that shows RemoteTrigger action=list returning has_more/next_cursor but ignoring the cursor so page 2+ never advances; score echoed or admit advanced.

Score echoed or admit advanced.

Idle word: **berthed** (HOLD: list either fits on one page with `has_more` false, or cursor advances to a distinct next page). Seeded state: **echoed** / #92746. Admit word: **advanced**. Never idle as lean, attentive, waived, clear, bricked, unrung, porous, slipped, severed, misrouted, adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled, unanswered, stripped, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, ambered. Never seeded as laden, deaf, refused, imprinted, ambered, bynamed, crenelled, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole, packed, roused, sighted, argbound, cleared.

**Dunnage** = loose timber and hemp a stevedore wedges between crates so cargo does not shift in the hold. The page ledger should walk to the next bay. Measured, walking `next_cursor` reissues the first crib.

- **berthed** = IDLE: HOLD; list either fits on one page with `has_more` false, or cursor advances to a distinct next page
- **echoed** = seeded word / #92746 path: cursor ignored; identical first page reissued (same ids, `created_at`, prompts, ~397 KB)
- **advanced** = admit hold: cursor yields a distinct page 2+ or API stops advertising `has_more`/`next_cursor` when not pageable
- **same-page** = HTTP 200 with exactly the same first page (same ids, `created_at`, prompts, same byte size ~397 KB)
- **has-more-lied** = `has_more: true` and `next_cursor` advertised; next bay unreachable
- **cursor-ignored** = `cursor` argument is not applied to `action=list`
- **twenty-cap** = 20 routines returned; routines 21+ unreachable
- **pages-incomplete** = AAINC-LAB/cc-usage-insights marks `pages_complete: false`
- **list-vs-list-runs** = tool description documents `cursor` for `list_runs` / `get_run_log`; if `list` is intentionally not pageable, `has_more` / `next_cursor` should not be returned for it
- **cousins** = cite-only #24785 CLOSED and #39586 CLOSED (MCP `tools/list` `nextCursor`); primary stays #92746
- **has-clear-repro** = issue labeled has repro

Verdicts: berthed, echoed, advanced, same-page, has-more-lied, cursor-ignored, twenty-cap, pages-incomplete, list-vs-list-runs, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a RemoteTrigger `action=list` walk would leave the crib **echoed** or already **advanced**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): list endpoint may emit pagination metadata shared with `list_runs` but never wire the cursor argument into the list query. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92746](https://github.com/anthropics/claude-code/issues/92746)
- Cousins cite-only (NOT primary): [anthropics/claude-code#24785](https://github.com/anthropics/claude-code/issues/24785) CLOSED — Claude Code does not follow MCP `tools/list` pagination (`nextCursor`). [anthropics/claude-code#39586](https://github.com/anthropics/claude-code/issues/39586) CLOSED — same title class, MCP `tools/list` `nextCursor` not followed. Same class, different surface.

What happened (from the issue body — do not invent):

- Claude Code CLI on WSL2 (Linux 6.18, Ubuntu), interactive session with Fable 5.1, 2026-09-08; filed 2026-09-07T23:00:53Z; labels bug, has repro, platform:wsl, area:routines; OPEN
- `RemoteTrigger` with `action=list` returns 20 routines plus `has_more: true` and a `next_cursor`
- Passing that `next_cursor` back as `cursor` returns HTTP 200 with **exactly the same first page** (same ids, `created_at`, prompts, same byte size ~397 KB observed)
- There is no way to retrieve routines 21+ from Claude Code
- Tool description documents `cursor` for `list_runs` / `get_run_log`; if `list` is intentionally not pageable, then `has_more` / `next_cursor` should not be returned for it
- Observed from scripted skill AAINC-LAB/cc-usage-insights that now marks such lists `pages_complete: false` and degrades to a partial result
- Impact: any consumer needing complete routine inventory (audits, usage analytics, cleanup) is capped at 20 and cannot tell which routines are missing

Problem found: REMOTETRIGGER ACTION=LIST RETURNS HAS_MORE/NEXT_CURSOR BUT IGNORES THE CURSOR ARGUMENT SO ROUTINE LISTS BEYOND 20 CANNOT BE PAGED.

Why this solution: a diagnostic scorer for the berthed → echoed / advanced crib chain, so a reader can pin idle berthed, seed echoed (#92746 path), and score same-page / has-more-lied / cursor-ignored / twenty-cap / pages-incomplete / list-vs-list-runs / cousins against the published facts.

## Why not a clone

This is specifically: **REMOTETRIGGER ACTION=LIST RETURNS HAS_MORE/NEXT_CURSOR BUT IGNORES THE CURSOR ARGUMENT SO ROUTINE LISTS BEYOND 20 CANNOT BE PAGED**.

**NOT Setoff/#92750** (subagent first-request MEMORY.md + skill_listing set-off — already shipped). Do not touch Setoff.

**NOT Espagnolette/#92694** (AskUserQuestion selection keys dead after window refocus — already shipped). Do not touch Espagnolette.

**NOT Imprimatur/#92740** (Skip Artifact first-publish — already shipped). Do not touch Imprimatur.

**NOT Byname/#92738** (Desktop slash false-negative on a bare plugin-skill byname — already shipped). Do not touch Byname.

**NOT Crenel/#92729** (empty-object `resources:{}` capability treated as absent — already shipped). Do not touch Crenel.

**NOT Quietus/#92716**. **NOT Cribble/#92684**. **NOT Springe/#92675**. **NOT Gangway/#92662**. **NOT Waybill/#92624**.

Different paradigm: **REMOTETRIGGER ACTION=LIST CURSOR IGNORE / FIRST PAGE REISSUED**.

Cousins cite-only (NOT primary): #24785 CLOSED and #39586 CLOSED. Do not auto-pick as thesis.

Do NOT rename this product Setoff, Espagnolette, Imprimatur, Byname, Crenel, Quietus, Cribble, Springe, Gangway, or Waybill.
Do NOT reuse idle lean / attentive / waived / clear / bricked / unrung / porous / slipped / severed / misrouted / adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled / unanswered / stripped / quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / ambered.
Do NOT reuse seeded laden / deaf / refused / imprinted / ambered / bynamed / crenelled / quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole / packed / roused / sighted / argbound / cleared.

Different surface: RemoteTrigger `action=list` pagination vs subagent first-request attachments / AskUserQuestion dead keys / Skip-mode first Artifact publish / Desktop slash false-negative byname / empty-object resources capability / SubagentStop kill path / denyWrite mid-path wildcards / plugin-native PreToolUse / Chrome never-redial / named-spawn foreign session id.

Product name stays **Dunnage**. Name/slug `dunnage` confirmed unused in catalog.json (216 products before this ship; Setoff is #216).

Different UI: stevedore's dunnage crib / cargo-hold page ledger / dark hold timber / hemp rope chalk tallies / crate stencil numbers / north-port skylight. Literata / Red Hat Text / Fira Code. NOT Bitter / Manrope / IBM Plex Mono (Chock). NOT Fragment Mono (Snatch / Quietus). NOT Plus Jakarta Sans (Crenel). NOT DM Serif Display / Commissioner / Azeret Mono (Setoff). NOT Instrument Serif / Figtree / JetBrains Mono (Espagnolette). NOT Playfair Display / DM Sans (Imprimatur used Fira Code in a different trio — Dunnage locks Fira Code with Literata + Red Hat Text). NOT Newsreader / Sora (Byname). NOT Ibarra Real Nova / Geist Mono. NOT Cardo / Public Sans. NOT Young Serif / Karla (Cribble). NOT Bodoni / Nunito (Springe). NOT letterpress tympan / locksmith casement / mason crenel / censor stamp / herald folio / mill cribble / trapper springe / pier gangway / freight waybill.

Different verbs: Score echoed, Admit advanced, Pin idle berthed, Seed echoed, Reset to berthed, Load fixtures, Walk the cursor, Restow the crib.

Different idle: **berthed**. Different seeded: **echoed**. HOLD: **berthed** / **advanced**. ALARM: **echoed** / **same-page** / **has-more-lied** / **cursor-ignored** / **twenty-cap** / **pages-incomplete** / **cousins** / **has-clear-repro** / **list-vs-list-runs**.

## How to score

```bash
node --test projects/dunnage/hook/dunnage.test.mjs
node projects/dunnage/hook/dunnage.mjs projects/dunnage/data/92746.json
node projects/dunnage/hook/dunnage.mjs projects/dunnage/data/berthed.json
echo '{"seed":"echoed","echoed":true}' | node projects/dunnage/hook/index.mjs
```

Open the living card at `projects/dunnage/index.html` (or the live path `/dunnage/`). Buttons: Score echoed, Admit advanced, Pin idle berthed, Seed echoed, Load fixtures, Reset to berthed. Walk the cursor. Restow the crib. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/dunnage/
- Subdomain: https://dunnage.hermes-playground-green.vercel.app
- Folder: `projects/dunnage/`
