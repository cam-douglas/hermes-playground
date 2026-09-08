# Setoff

A **letterpress set-off bench** — soft north light, dampened tympan sheets, offset ink halo on the facing sheet (oxidized ink vs clean lean sheet), graphite attachment ledger; DM Serif Display + Commissioner + Azeret Mono — for a real Claude Code defect: **SUBAGENT FIRST REQUESTS CARRY MEMORY.MD + SKILL_LISTING ATTACHMENTS CONTRARY TO DOCS (EVEN WITH CUSTOM AGENTS AND TOOL ALLOWLISTS).** When a hypothetical strip wipes auto-memory + skill_listing, the tympan is **shed**.

Primary:

- [anthropics/claude-code#92750](https://github.com/anthropics/claude-code/issues/92750) (OPEN, bug, has repro, platform:macos, area:agents). Title: `Sub-agents receive the auto-memory index and skill listing, contrary to the docs — custom agent definitions included`. Filed 2026-09-07T23:38:05Z.

10:50 setoff: a letterpress set-off bench that shows subagent first requests carrying MEMORY.md + skill_listing attachments contrary to docs (even with custom agents and tool allowlists); score laden or admit shed.

Score laden or admit shed.

Idle word: **lean** (HOLD: neither memory instructions nor skill_listing on the first request). Seeded state: **laden** / #92750. Admit word: **shed**. Never idle as attentive, waived, clear, bricked, unrung, porous, slipped, severed, misrouted, adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled, unanswered, stripped, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, ambered. Never seeded as deaf, refused, imprinted, ambered, bynamed, crenelled, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole, packed, roused, sighted, argbound, cleared.

**Setoff** = letterpress transfer: wet ink from a printed sheet offsetting onto the facing tympan. Docs say the facing sheet stays lean. Measured, MEMORY.md + skill_listing halo the first request.

- **lean** = IDLE: HOLD; neither MEMORY.md `instructions` nor `skill_listing` on the first request
- **laden** = seeded word / #92750 path: first request carries MEMORY.md (~19,850 chars) as `instructions` AND `skill_listing` (~24–26k chars, ~49 skills)
- **shed** = admit hold: hypothetical strip of auto-memory + skill_listing; halo wiped
- **memory-attached** = MEMORY.md as `instructions` attachment (CLAUDE.md is documented as loading)
- **skill-listing** = pre-populated `skill_listing` contrary to docs
- **custom-agent-unchanged** = custom `.claude/agents/*.md` replace the system prompt; memory+skills+CLAUDE.md arrive unchanged
- **allowlist-residual** = 8-tool allowlist still 27,832; residual ~24k is memory + skills + CLAUDE.md
- **token-table** = 45,907 / 33,244 / 27,832 cold tokens
- **docs-vs-measured** = docs say not loaded (except forks); measured both arrive
- **cousins** = prefer none; no verified cite-only cousins about subagent context
- **has-clear-repro** = issue labeled has repro

Verdicts: lean, laden, shed, memory-attached, skill-listing, custom-agent-unchanged, allowlist-residual, token-table, docs-vs-measured, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a subagent first request would leave the tympan **laden** or already **shed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): attachment pipeline for subagents may reuse parent session bootstrap and forget to strip auto-memory + skill_listing except for forks. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92750](https://github.com/anthropics/claude-code/issues/92750)
- Cousins cite-only (NOT primary): prefer none. No verified related OPEN issues about subagent context claimed.

What happened (from the issue body — do not invent):

- Claude Code 2.1.263 (also 2.1.261 / 2.1.258); macOS 15; Claude Max; models `claude-fable-5-1` and `claude-opus-5`; filed 2026-09-07T23:38:05Z; labels bug, has repro, platform:macos, area:agents; OPEN
- Docs expected: "The main conversation's auto memory isn't loaded into subagents; the exception is a fork." and "Subagents don't receive a pre-populated listing [of skills and MCP tools]."
- Actual: first request attachments include full project MEMORY.md (~19,850 chars) as `instructions` AND `skill_listing` (~24–26k chars, ~49 skills)
- Affects built-in `general-purpose` AND custom `.claude/agents/*.md`
- Tokens (cold cache): general-purpose 45,907; custom no tools 33,244; custom 8-tool allowlist 27,832 — residual ~24k is memory index + skill listing + CLAUDE.md
- Custom agent defs replace system prompt and tools allowlist trims schemas, but memory+skills+CLAUDE.md arrive unchanged
- Repro: create probe agent, dispatch `Agent(subagent_type="probe", prompt="Reply with exactly the single word DONE...")`, inspect `~/.claude/projects/<project>/<session-id>/subagents/agent-*.jsonl`

Problem found: SUBAGENT FIRST REQUESTS CARRY MEMORY.MD + SKILL_LISTING ATTACHMENTS CONTRARY TO DOCS (EVEN WITH CUSTOM AGENTS AND TOOL ALLOWLISTS).

Why this solution: a diagnostic scorer for the lean → laden / shed tympan chain, so a reader can pin idle lean, seed laden (#92750 path), and score memory-attached / skill-listing / custom-agent-unchanged / allowlist-residual / token-table / docs-vs-measured / cousins against the published facts.

## Why not a clone

This is specifically: **SUBAGENT FIRST REQUESTS CARRY MEMORY.MD + SKILL_LISTING ATTACHMENTS CONTRARY TO DOCS (EVEN WITH CUSTOM AGENTS AND TOOL ALLOWLISTS)**.

**NOT Espagnolette/#92694** (AskUserQuestion selection keys dead after window refocus — already shipped). Do not touch Espagnolette.

**NOT Imprimatur/#92740** (Skip Artifact first-publish — already shipped). Do not touch Imprimatur.

**NOT Byname/#92738** (Desktop slash false-negative on a bare plugin-skill byname — already shipped). Do not touch Byname.

**NOT Crenel/#92729** (empty-object `resources:{}` capability treated as absent — already shipped). Do not touch Crenel.

**NOT Quietus/#92716**. **NOT Cribble/#92684**. **NOT Springe/#92675**.

Different paradigm: **SUBAGENT FIRST-REQUEST MEMORY INDEX + SKILL LISTING SET-OFF**.

Cousins cite-only (NOT primary): prefer none. Do not auto-pick as thesis.

Do NOT rename this product Espagnolette, Imprimatur, Byname, Crenel, Quietus, Cribble, Springe, Gangway, Waybill, Snatch, Speakpipe, or Afterimage.
Do NOT reuse idle attentive / waived / clear / bricked / unrung / porous / slipped / severed / misrouted / adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled / unanswered / stripped / quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / ambered.
Do NOT reuse seeded deaf / refused / imprinted / ambered / bynamed / crenelled / quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole / packed / roused / sighted / argbound / cleared.

Different surface: subagent first-request attachments vs AskUserQuestion dead keys / Skip-mode first Artifact publish / Desktop slash false-negative byname / empty-object resources capability / SubagentStop kill path / denyWrite mid-path wildcards / plugin-native PreToolUse interactive slip.

Product name stays **Setoff**. Name/slug `setoff` confirmed unused in catalog.json (215 products before this ship; Espagnolette is #215).

Different UI: letterpress proofing room / dampened tympan / offset ink halo / oxidized ink vs clean lean sheet / graphite attachment ledger / soft north light. DM Serif Display / Commissioner / Azeret Mono. NOT Instrument Serif / Figtree / JetBrains Mono (Espagnolette). NOT Playfair Display / DM Sans / Fira Code (Imprimatur). NOT Newsreader / Sora (Byname). NOT Ibarra Real Nova / Plus Jakarta / Geist Mono (Crenel). NOT Cardo / Public Sans / Fragment Mono (Quietus). NOT Young Serif / Karla (Cribble). NOT Bodoni / Nunito (Springe). NOT weathered sash / brass rod / dead-key iron.

Different verbs: Score laden, Admit shed, Pin idle lean, Seed laden, Reset to lean, Load fixtures, Dampen tympan, Wipe the halo.

Different idle: **lean**. Different seeded: **laden**. HOLD: **lean** / **shed**. ALARM: **laden** / **memory-attached** / **skill-listing** / **custom-agent-unchanged** / **allowlist-residual** / **token-table** / **docs-vs-measured** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/setoff/hook/setoff.test.mjs
node projects/setoff/hook/setoff.mjs projects/setoff/data/92750.json
node projects/setoff/hook/setoff.mjs projects/setoff/data/lean.json
echo '{"seed":"laden","laden":true}' | node projects/setoff/hook/index.mjs
```

Open the living card at `projects/setoff/index.html` (or the live path `/setoff/`). Buttons: Score laden, Admit shed, Pin idle lean, Seed laden, Load fixtures, Reset to lean. Dampen tympan. Wipe the halo. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/setoff/
- Subdomain: https://setoff.hermes-playground-green.vercel.app
- Folder: `projects/setoff/`
