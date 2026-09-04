# Ephemera

An **archive / wick-lit folio atelier** — five-minute candle wick (subagent ephemeral TTL), stacked ephemera (conversation tokens), folio/token ledger (the ten rewrite rows), banked cream lamp / rewritten crimson reprint, parallel-agent paper slips; paper cream / faded ink slate / wick amber / rewrite crimson-copper — Newsreader + Figtree + Source Code Pro — for a real Claude Code defect: **FABLE 5.1 BACKGROUND SUBAGENT 5-MINUTE EPHEMERAL PROMPT-CACHE REWRITE UNDER LONG TURNS; AREA:COST + AREA:AGENTS; PLATFORM:MACOS.**

Primary:

- [anthropics/claude-code#92090](https://github.com/anthropics/claude-code/issues/92090) (OPEN, bug, has repro, platform:macos, area:cost, area:agents, filed 2026-09-04T13:49:33Z, updated 2026-09-04T13:50:34Z). Title: `Fable 5.1 subagents re-cache their entire context (200-430K tokens) turn after turn: the 5-minute subagent TTL expires inside Fable 5.1's long turns. 8 parallel agents re-wrote 2.9M tokens in 40 min; 0 such rewrites on Opus 5 / Fable 5 subagents in the same week`. Reporter lucascampolina. Claude Code 2.1.258 (data); 2.1.260 installed, not yet re-measured. Also seen on 2.1.255. macOS 26 (Darwin 25.6.0). `claude-fable-5-1` parent and subagents. Max 20x subscription. Desktop Code tab and zsh terminal.

a ephemera that rewrites the whole folio when the five-minute wick burns out mid-turn is not a warm cache — it is a bank already rewritten. Score the wick or admit the folio already rewritten.

Idle word: **banked**. Seeded state: **rewritten** / #92090 — Fable 5.1 background subagents use the 5-minute ephemeral prompt-cache TTL; a single turn (thinking + tools) often takes 5–10 minutes, so by the next request the 5m cache entry is gone. On affected turns `cache_read_input_tokens` pins at the shared system prefix (~33,578) while `cache_creation.ephemeral_5m_input_tokens` rewrites the entire conversation (213K–432K). Never idle as keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / crossed / homed / slipped / fouled / mangled / verbatim / unbolted / snagged.

**Ephemera** is short-lived printed matter — handbills, tickets, transient papers. The subagent's 5m cache is a wick-lit stack of ephemera: when the turn outlasts the wick, the next request must reprint the whole folio (**rewritten**) instead of reading the **banked** stack.

- **rewritten** = #92090: `cache_creation.ephemeral_5m` is huge and `cache_read` ≈ system prefix on a non-first call
- **ephemeral-5m** = documented 5-minute subagent TTL bucket; every affected request is on that wick
- **system-prefix** = `cache_read_input_tokens` pinned at 33,578
- **cache-creation** = `usage.cache_creation.ephemeral_5m_input_tokens` equals the rest of the context (213K–432K)
- **cache-read** = the read side collapsed to the prefix; the folio is not being read from the bank
- **fable-5-1** = same-week comparison: Fable 5 (0) and Opus 5 (0); Fable 5.1 had all 10
- **parallel-eight** = one parent launched 8 research subagents; 10 rewrites across 6 of 8 agents in under 40 minutes (2.88M tokens, ~$36 at $12.50/MTok)
- **hold** = the wick holds; `cache_read` is the folio; `ephemeral_5m` is only the new leaf
- **banked** = HOLD: cache_read is the conversation; ephemeral_5m is only the new leaf; idle word banked

Verdicts: banked, rewritten, ephemeral-5m, system-prefix, cache-creation, cache-read, fable-5-1, parallel-eight, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the wick banked the folio or already reprinted it. Fixtures use the real `requestId`s from the issue.

Hypothesis only (NON-BINDING): background subagents sit on the documented 5-minute ephemeral prompt-cache TTL; a single Fable 5.1 turn (thinking + tools) often takes 5–10 minutes, so the next request reprints the folio at cache-write rates. Discard if issue evidence disagrees. Encoded from the issue's usage table, same-week model compare, and expected-behavior note. Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **5-MINUTE EPHEMERAL SUBAGENT CACHE REWRITE UNDER LONG FABLE 5.1 TURNS — area:cost + area:agents.**

NOT Commutator ([#91958](https://github.com/anthropics/claude-code/issues/91958)) — streamable-http concurrent batch JSON-RPC id mis-correlation.
NOT Hectograph ([#92056](https://github.com/anthropics/claude-code/issues/92056)) — OTEL `tool_input` / `tool_parameters` scrub-flag leak.
NOT Placet ([#92040](https://github.com/anthropics/claude-code/issues/92040)) — ExitPlanMode Accept vs Accept-and-implement consent-scope mismatch.
NOT Frisket ([#91574](https://github.com/anthropics/claude-code/issues/91574)) — PreToolUse deny unenforced on Write-family.
NOT Ullage / Fathom / Reveille — compaction / standing-rules / living-muster products. This is not a compaction product.
NOT Fusee — scheduled-task early dispatch. This is not a cron fusee.
NOT Clepsydra / Tocsin / Heddle or any existing catalog slug.

Different surface: diagnostic scoring of 5m ephemeral subagent cache rewrite under long Fable 5.1 turns. Completely different UI (wick gauge + stacked folio + reprint lamp + usage ledger), backend (usage-shaped JSON of the ten rewrite rows + model compare), and UX.

Cousins are cite-only on a cousin strip; primary stays #92090.

- [#84289](https://github.com/anthropics/claude-code/issues/84289) — OPEN — docs vs reality on subagent TTL. Related TTL mention, not the Fable 5.1 mid-turn rewrite. Cite-only.
- [#87215](https://github.com/anthropics/claude-code/issues/87215) — OPEN — parked subagent wake re-caches everything, 2.1.233. Related re-cache, different trigger. Cite-only.
- [#89621](https://github.com/anthropics/claude-code/issues/89621) — OPEN — large multimodal subagent full re-cache, 2.1.245. Related re-cache, different payload class. Cite-only.
- [#91289](https://github.com/anthropics/claude-code/issues/91289) — OPEN — Fable 5.1 burning limits. Related cost surface, not the 5m wick. Cite-only.

Backups (document only, do not build): [#92089](https://github.com/anthropics/claude-code/issues/92089) (second `/compact` re-appends history → quadratic transcript), [#92074](https://github.com/anthropics/claude-code/issues/92074) (PreToolUse/UserPromptSubmit hooks silent in VS Code), [#92076](https://github.com/anthropics/claude-code/issues/92076) (left-arrow mash agent-view debounce).

Product name stays **Ephemera**. Do not rename to Clepsydra, Fusee, Ullage, Fathom, Reveille, Tocsin, Commutator, Heddle, Hectograph, Placet, Frisket or any existing catalog slug.

Different UI: wick-lit archive desk + stacked folio papers + 5-minute wick gauge + banked/rewritten lamp + parallel-agent slips + usage ledger / paper cream / faded ink slate / wick amber / rewrite crimson-copper. Newsreader + Figtree + Source Code Pro. NOT Source Serif 4 / Libre Franklin / JetBrains Mono (Commutator). NOT Fraunces / Outfit / Fira Code (Hectograph). Stay OFF rotary copper drum / gelatin hectograph / congregation chamber / print-shop frisket / compaction ullage / clockmaker fusee.

Different verbs: Score the wick, pin idle banked, pin seeded rewritten, admit the folio already rewritten, load fixtures, reset to banked. Score the wick is this desk's phrase.

Different idle: **banked**.

## Live catalog path

`/ephemera/` is this static archive / wick-lit folio atelier. Path `https://hermes-playground-green.vercel.app/ephemera/` and subdomain `https://ephemera.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `23:50 / hermes catalog #137 / #92090`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **banked** — `cache_read` is the folio (e.g. 304,655); `ephemeral_5m` is only the new leaf (1,595); the wick holds.
2. Seed **rewritten** → #92090: `cache_read` pins at 33,578 (or 0); `cache_creation.ephemeral_5m` reprints 213K–432K on turns 8–14; 10 full-context rewrites = 2.88M tokens.
3. Atelier UI: wick gauge / stacked folio / reprint lamp / agent slips / usage ledger. Banked = the wick holds. Rewritten = the folio already reprinted.
4. Cousin cite strip labeled cousin-not-primary: [#84289](https://github.com/anthropics/claude-code/issues/84289), [#87215](https://github.com/anthropics/claude-code/issues/87215), [#89621](https://github.com/anthropics/claude-code/issues/89621), [#91289](https://github.com/anthropics/claude-code/issues/91289). Cite only. Primary stays #92090.
5. **Score the wick** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/ephemera/index.html` in a browser, or serve the repo root and visit `/ephemera/` (Vercel rewrite → `/projects/ephemera`). No build step. Optional hook:

```bash
node projects/ephemera/hook/ephemera.mjs projects/ephemera/data/92090.json
node --test projects/ephemera/hook/ephemera.test.mjs
```

Empty stdin scores the idle **banked** ticket. Paste a probe on the page or drop a fixture from `data/`.
