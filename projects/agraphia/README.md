# Agraphia

A **clinical agraphia / neurology writing-desk booth** — speech intact (UI still shows the words), writing hand fails (JSONL drops the text blocks), quill lifts before the tool-seal, chart clipboard, aphasia-clinic adjacent but **NOT Palilalia** (that was `/goal` Stop re-fire). This is specifically **loss of written record while spoken/UI speech remains**. Fonts **Crimson Pro** (display) + **Outfit** (body) + **JetBrains Mono** (mono). Palette: clinic chalk white `#F4F1EA`, slate blue `#3A4F66`, chart-ink black `#14181F`, soft warning amber `#D4A04A`, steel `#6B8499`. Fresh trio. NOT Gauntlet iron/crimson. NOT Lictor purple. NOT Rasure parchment-scrape as the hero metaphor. Completely different UI/UX/metaphor.

The chart should stay **penned** (HOLD: pre-tool assistant text blocks still written into session JSONL; hooks can read the marker). Instead the booth was **agraphia** after a **pre-tool-omit**.

Primary:

- [anthropics/claude-code#94251](https://github.com/anthropics/claude-code/issues/94251) (OPEN). Title: `[BUG] 2.1.270: session transcript JSONL omits most assistant text written before a tool call (interactive CLI)`. Labels: bug, has repro, platform:macos, area:core, area:hooks, regression. Environment: Claude Code 2.1.270, macOS 26.5 (Darwin 25.5.0), zsh, iTerm2. Since upgrading 2.1.267 → 2.1.270, session transcript `projects/<project>/<session>.jsonl` is missing most assistant `text` blocks that come before a `tool_use` in the same response. Text still shows in the terminal as normal. `thinking` and `tool_use` rows still written (tool_use with full input). End-of-turn text affected much less. A phrase from a UI reply appears only inside later tool inputs that quote it — not as its own text block. Share of assistant rows with a text block: profile A 26.4%→12.8%, profile B 27.6%→2.9%. Text rows with `stop_reason: tool_use` as a share of tool calls: 51.7%→13.6% (A) and 53.7%→1.9% (B). One session resumed across the upgrade went from 372 text blocks in 1,262 assistant rows (2.1.263) to 3 in 40 (2.1.270). Haiku sessions that never call tools record text on every response on both versions. Hooks that read `transcript_path` to check what the model said before a tool call can no longer see it; PreToolUse payload carries no assistant text; a PreToolUse hook requiring a written marker before certain commands became impossible on 2.1.270. Cousins cite-only (do NOT rebuild / do NOT conflate): #65051 (daemon sessions, 2.1.161) and #76668 (desktop app) — same shape on other entrypoints; this booth is the interactive CLI. Backups cite-only (next focus only — do not auto-pick): #93987, #93924, #93770, #93777, #94151, #94064, #94256, #94277, #94275, #94274, #94273, #94267. Stay off Gauntlet/Lictor/Lychgate/Ouster/Proscription/Thimblerig/Fetchling/Souffleur/Epitome/Diabolica/Sallyport (and Palilalia/Sepulchre/Rasure) paradigms.

22:50 agraphia: a clinical agraphia / neurology writing-desk booth for #94251. Interactive CLI 2.1.270 session transcript JSONL omits most assistant text written before a tool_use; terminal still shows the words; thinking and tool_use still written; hooks reading transcript_path go blind. Idle **penned** / seeded **agraphia** / path **pre-tool-omit**. Score agraphia or admit penned.

Score agraphia or admit penned.

Idle word: **penned** (HOLD: pre-tool assistant text blocks still written into session JSONL; hooks can read the marker). HOLD aliases: recorded, retained, charted, filed, marked. Seeded word: **agraphia** / #94251 (the pre-tool-omit path). Path word: **pre-tool-omit**. Product score: **agraphia**. Never idle inked / ungloved / attested / reaped / tenanted / barred / additive / literal / echoing / unabridged / innocent / sealed / silenced / living / cleared / spanned / matched / inscribed / berthed / pegged / latent / flushed / articulate / limber / primed / lit / voiced / mute / rostered / quieted / unrung / vested / plenary / equalized / legible / calibrated / engaged / flush / candid / stetted / sighted / intact or seeded Rasure / gauntlet / lictor / lychgate / ouster / proscription / thimblerig / fetchling / souffleur / epitome / diabolica / sallyport / palilalia / sepulchre or path attach-mouse / picker-bypass / bg-task-stale / inherited-worktree-yank / deny-list-hollow / skill-row-carve / skill-dollar-swap / reminder-secret-bypass / cannot-show-not-git / goal-stop-refire.

Phrase: **Score agraphia or admit penned.**

- **penned** = IDLE HOLD: pre-tool assistant text still written into session JSONL; hooks can read the marker
- **agraphia** = seeded path / product score: writing hand fails while speech stays intact
- **pre-tool-omit** = path word
- **hold** = HOLD alias for idle penned
- **recorded** = HOLD alias: text block recorded in JSONL
- **retained** = HOLD alias: pre-tool text retained
- **charted** = HOLD alias: chart clipboard still has the line
- **filed** = HOLD alias: transcript file still holds the block
- **marked** = HOLD alias: hooks can read the written marker
- **text-omit** = most assistant text before tool_use missing from JSONL
- **hook-blind** = hooks that read transcript_path can no longer see what the model said
- **pretool-empty** = PreToolUse payload carries no assistant text
- **quote-only** = UI phrase appears only inside later tool inputs that quote it
- **share-drop** = published share drop A 26.4%→12.8% / B 27.6%→2.9%
- **haiku-ok** = Haiku no-tool sessions still record text on both versions
- **end-of-turn** = end-of-turn text affected much less
- **profile-a** = profile A measurements
- **profile-b** = profile B measurements
- **landing** = clinic desk / writing hand / chart clipboard
- **has-repro** = published shape: 2.1.270 macOS interactive CLI
- **cousins** = cite-only #65051 #76668 — do not rebuild; do not conflate
- **backups** = cite-only #93987 #93924 #93770 #93777 #94151 #94064 #94256 #94277 #94275 #94274 #94273 #94267 — do not auto-pick
- **fixtures** = clinic desk / writing hand / chart clipboard
- **walk** = published idle penned → pre-tool-omit → agraphia
- **closed** = cousins remain OPEN — cite only; not this booth

Verdicts: penned, agraphia, pre-tool-omit, hold, recorded, retained, charted, filed, marked, text-omit, hook-blind, pretool-empty, quote-only, share-drop, haiku-ok, end-of-turn, profile-a, profile-b, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **agraphia** or already **penned**. Fixtures use the issue's published incident only. Transcript excerpts are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): interactive CLI persistence of assistant content blocks before tool_use regressed between 2.1.267 and 2.1.270 so JSONL omits those text blocks while UI still renders them; hooks reading transcript_path go blind. Invite verify against #94251 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94251](https://github.com/anthropics/claude-code/issues/94251)
- Cousins (cite-only — do NOT rebuild / do NOT conflate): #65051 — daemon sessions, 2.1.161 — same shape on other entrypoints. #76668 — desktop app — same shape on other entrypoints. #94251 is specifically the interactive CLI on 2.1.270.
- Backups (data only; next focus only — do not auto-pick): #93987, #93924, #93770, #93777, #94151, #94064, #94256, #94277, #94275, #94274, #94273, #94267

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:core, area:hooks, regression
- Environment: Claude Code 2.1.270, macOS 26.5 (Darwin 25.5.0), zsh, iTerm2
- Since upgrading 2.1.267 → 2.1.270, session transcript `projects/<project>/<session>.jsonl` is missing most assistant `text` blocks that come before a `tool_use` in the same response
- Text still shows in the terminal as normal
- `thinking` and `tool_use` rows still written, the latter with full input
- End-of-turn text affected much less
- A phrase from a reply shown in the UI appears only inside later tool inputs that quote it
- Measurements, all assistant rows over six days, one machine, `claude-opus-5`, `entrypoint: cli`, two `CLAUDE_CONFIG_DIR` profiles:

| version | profile | assistant rows | rows with a `text` block | share |
|---|---|---:|---:|---:|
| 2.1.267 | A | 6,712 | 1,771 | 26.4% |
| 2.1.267 | B | 12,427 | 3,427 | 27.6% |
| 2.1.270 | A | 1,970 | 253 | 12.8% |
| 2.1.270 | B | 2,536 | 74 | 2.9% |

- Text rows with `stop_reason: tool_use`, as a share of tool calls: 51.7% → 13.6% in profile A and 53.7% → 1.9% in profile B
- One session resumed across the upgrade went from 372 text blocks in 1,262 assistant rows (2.1.263) to 3 in 40 (2.1.270)
- Haiku sessions that never call tools record text on every response on both versions
- Both profiles share `settings.json`. Profile B signs in with `forceLoginMethod: "claudeai"` to an organisation account
- Why it matters: hooks that read `transcript_path` can no longer see what the model said before a tool call; PreToolUse payload carries no assistant text; a PreToolUse hook requiring a written marker before certain commands became impossible on 2.1.270

Problem found: PRE-TOOL-OMIT — interactive CLI 2.1.270 scrapes the written record before the tool-seal while the spoken/UI speech remains.

Why Agraphia: Clinical *agraphia* is loss of the ability to write while speech can remain. The terminal still speaks the reply; the JSONL chart does not keep it. The quill lifts before the tool-seal. Hooks that read the chart go blind. Palilalia/#94041 was a `/goal` Stop re-fire (speech-pathology clinic) — DIFFERENT. Rasure/#93791 was a parchment wipe of `~/.claude` (creation-time-flip) — DIFFERENT. Gauntlet/#94029 was attach-mouse — DIFFERENT. This booth is specifically pre-tool-omit on the interactive CLI transcript — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: penned catalog page + node diagnostic encoding idle **penned** / seeded **agraphia** / path **pre-tool-omit** so operators can score whether the booth is **agraphia** or already **penned**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Assistant text blocks written before a tool_use in the same response should remain in the session JSONL
2. Hooks that read transcript_path should still see what the model said before a tool call
3. PreToolUse payload (or the transcript it points at) should expose the written marker
4. A PreToolUse hook requiring a written marker before certain commands should remain satisfiable
5. Haiku no-tool sessions already record text on every response — that control should stay penned
6. UI already shows the text; the writing hand (JSONL) should match the spoken/UI speech

## Why not a clone

This is specifically: **INTERACTIVE CLI 2.1.270 SESSION TRANSCRIPT OMITS MOST ASSISTANT TEXT WRITTEN BEFORE A TOOL CALL — TERMINAL STILL SHOWS THE WORDS; HOOKS READING TRANSCRIPT_PATH GO BLIND.**

Novel paradigm: clinical agraphia / neurology writing-desk / speech intact vs writing-hand fail / chart clipboard / quill lift before the tool-seal — chalk white, slate blue, chart-ink, warning amber. New issue, new paradigm (pre-tool-omit), new UI/UX/fonts/colors, new scoring vocabulary. A neurology writing desk, not a tilting-yard glove, purple fasces aisle, parish porch, bailiff desk, Roman tablet, carnival tent, twilight coin-ledger, theatre prompt-corner, scriptorium scrape, inquisitorial court, fortress sallyport, or `/goal` speech clinic.

**NOT Gauntlet/#94029** (attach-mouse). Different defect. NOT tilting-yard / iron glove. Do not reuse ungloved / gauntlet / attach-mouse.

**NOT Lictor/#94053** (picker-bypass). Different defect. NOT purple fasces aisle. Do not reuse attested / lictor / picker-bypass.

**NOT Lychgate/#94059** (bg-task-stale). Different defect. NOT parish porch. Do not reuse reaped / lychgate / bg-task-stale.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / proscription / deny-list-hollow.

**NOT Thimblerig/#94174** (skill-row-carve). Different defect. NOT carnival cups. Do not reuse additive / thimblerig / skill-row-carve.

**NOT Fetchling/#94065** (skill-dollar-swap). Different defect. NOT fae twilight. Do not reuse literal / fetchling / skill-dollar-swap.

**NOT Souffleur/#94031** (app-switch-echo-loss). Different defect. NOT theatre wings. Do not reuse echoing / souffleur.

**NOT Epitome/#94032** (summarized-thinking-force). Different defect. NOT classical scriptorium abridgement. Do not reuse unabridged / epitome.

**NOT Diabolica/#94040** (cannot-show-not-git). Different defect. NOT inquisitorial court. Do not reuse innocent / diabolica / cannot-show-not-git.

**NOT Sallyport/#94082** (reminder-secret-bypass). Different defect. NOT fortress gatehouse. Do not reuse sealed / sallyport / reminder-secret-bypass.

**NOT Palilalia/#94041** (goal-stop-refire). Different defect. NOT `/goal` Stop re-fire. Do not reuse silenced / palilalia / goal-stop-refire.

**NOT Rasure/#93791** (creation-time-flip). Different defect. NOT parchment wipe of `~/.claude`. Do not reuse intact / rasure / creation-time-flip.

**NOT Anarthria/#93782**. Different defect. NOT Wispr Flow clipboard drop. ENT/voice clinic, not writing-hand agraphia.

Live: https://hermes-playground-green.vercel.app/agraphia/

```
node --test projects/agraphia/agraphia.test.mjs
node projects/agraphia/agraphia.mjs projects/agraphia/data/agraphia.json
```
