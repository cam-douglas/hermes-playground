# Moviola

A **1924 Moviola film-editing machine** — projector-black enamel, brass fittings, red safelight, ground-glass viewer, sprocketed print, hanging trim bin — for a real Claude Code defect: **image eviction in a long session silently recuts the conversation prefix, so every later impression is a full reprint at cache-creation rates**.

Primary:

- [anthropics/claude-code#90716](https://github.com/anthropics/claude-code/issues/90716) (OPEN, filed 2026-08-30T09:40:19Z by Bewelge). Title: [BUG] Image eviction in long sessions mutates the conversation prefix, forcing a full context re-cache on every subsequent image read. Labels: bug, has repro, platform:windows, area:cost, area:core. Claude Code **2.1.220**. Windows / Anthropic API.

A recut print is not a hold. Score the splice or admit **latched**.

Idle word: **latched**. Seeded state: **recut** / #90716 — earliest images dropped, prefix mutated, full re-cache. Never idle as "moviola" / "film" / "trim" / "cache" / "image" / "prefix".

- **latched** = hold: prefix byte-stable, cache_read still amortizing (~658,681), cache_creation per image ~3,439, no eviction splice
- **recut** = #90716 primary — earliest images dropped, prefix mutated, full re-cache
- **mutated** = prefix rewritten; burn numbers not yet on the counter
- **evicted** = earliest image-frames in the trim bin
- **recached** = 600–740k context rewritten as cache-creation
- **burned** = 5.7× burn; 5-hour allowance gone in 31 minutes
- **collapsed** = cache_read at the system+tools floor (~26,314)
- **silent** = no error, no warning, `context_management` null
- **one-in-one-out** = promptTotal +113–149 after collapse
- **prefix-rewritten** = cache breakpoints after system/tools invalidated

Verdicts: latched, recut, mutated, evicted, recached, burned, collapsed, silent, one-in-one-out, prefix-rewritten.

## Why not a clone

This is specifically: **SILENT PREFIX RECUT**. The trim bin *is* the conversation prefix. Pulling an early page-sized image-frame from the reel mutates every cache breakpoint after the system/tools block. The print looks continuous. The reprint lamp is the only tell: `cache_read` has collapsed to 26,314.

NOT **Carcase** ([#90867](https://github.com/anthropics/claude-code/issues/90867)) — stealth-relaunch chrome.
NOT **Callboard** ([#90858](https://github.com/anthropics/claude-code/issues/90858)) — skill autocomplete.
NOT **Leaven** ([#90782](https://github.com/anthropics/claude-code/issues/90782)) — bootstrap contamination.
NOT **Hydra** ([#90856](https://github.com/anthropics/claude-code/issues/90856)) — marketplace dual-ledger.
NOT **Limpet** ([#89275](https://github.com/anthropics/claude-code/issues/89275)) — process leak.
NOT **Scion** ([#90815](https://github.com/anthropics/claude-code/issues/90815)) — empty fork.
NOT **Almanac** ([#90804](https://github.com/anthropics/claude-code/issues/90804)) — ghost Loop.
NOT **Voucher** ([#90807](https://github.com/anthropics/claude-code/issues/90807)) — nested fabrication.
NOT **Kindling** ([#90798](https://github.com/anthropics/claude-code/issues/90798)) — WarmLifecycle mint.
NOT **Palimpsest** ([#90725](https://github.com/anthropics/claude-code/issues/90725)) — PreToolUse whole-replace.
NOT **Fetch** ([#90755](https://github.com/anthropics/claude-code/issues/90755)) — ghost text.
NOT **Cenotaph** ([#90771](https://github.com/anthropics/claude-code/issues/90771)) — orphaned tool_result.
Nearby only (do not ship): **Weir** #90802 1MB JSON-RPC buffer; **Cartouche** #90881 phantom /clear chip; #72226; #61091.

Different UI: 1924 Moviola. Projector-black, enamel green, brass, red safelight, ground-glass cream. Special Elite + Source Serif 4 + Share Tech Mono. NOT oak cabinet, NOT bakery, NOT marble, NOT stage-door.

Different idle: **latched**.

## Live catalog path

`/moviola/` is this static editing machine. Demo works with no secrets and no npm. Mark: `12:50 / hermes catalog #86 / #90716`.

1. Seeded demo loads **recut** (#90716 — earliest images dropped, prefix mutated, full re-cache). Reprint lamp on. Burn-rate gauge at 5.7×.
2. Admit latched → film latched, strip continuous, lamp off.
3. Chip-switch seeds: recut / latched / mutated / evicted / recached / burned / collapsed / silent / one-in-one-out / prefix-rewritten.
4. Paste or drop a ticket JSON and score the splice.
5. Parse a session JSONL usage dump, replay the 40-image PDF→PNG threshold, and read the cache-breakpoint map.

## How to score

Open `projects/moviola/index.html` in a browser, or serve the repo root and visit `/moviola/` (Vercel rewrite → `/projects/moviola`). No build step. Optional hook:

```bash
node projects/moviola/hook/moviola.mjs < projects/moviola/data/90716.json
node projects/moviola/hook/moviola.mjs projects/moviola/data/latched.json
node --test projects/moviola/hook/moviola.test.mjs
```

Recut seed → recut/alarm. Latched seed → latched/hold.

`projects/moviola/hook/moviola.mjs` scores a probe ticket `{ imageCount, prefixMutated, cacheRead, cacheCreation, earliestDropped, evictedCount, burnRate, tokensPerHour, contextManagement, promptTotalDelta, oneInOneOut, breakpointsInvalidated }` and returns `{ verdict, chips[], reasons[], latched, recut, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90716.json`, `data/latched.json`, `data/recut.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`. Evidence only from issue facts.

## Native integrations

1. Session JSONL usage parser (textarea / drop) — extract `cache_read_input_tokens` vs `cache_creation_input_tokens` and flag a floor collapse.
2. Anthropic prompt-cache stats — footage counters for cache_read vs cache_creation.
3. PDF page-to-PNG threshold replay — 40-image / 20-full-page vs crop.
4. Cache-breakpoint map — system/tools floor (~26,314) vs message prefix.
5. Live fetch `https://api.github.com/repos/anthropics/claude-code/issues/90716`. Unauthenticated. See `.env.example`.

## Sources

- [anthropics/claude-code#90716](https://github.com/anthropics/claude-code/issues/90716) OPEN
- Same-class (cite, not primary): [#86075](https://github.com/anthropics/claude-code/issues/86075) tool-result eviction sentinel; [#89418](https://github.com/anthropics/claude-code/issues/89418) request-size pruning; [#90363](https://github.com/anthropics/claude-code/issues/90363) failed-image cache poison; [#90675](https://github.com/anthropics/claude-code/issues/90675) 5-hour allowance in ~23 min; [openai/codex#35925](https://github.com/openai/codex/issues/35925) silent context pruning
- Nearby (boundary only): #72226, #61091, Cartouche #90881, Weir #90802
