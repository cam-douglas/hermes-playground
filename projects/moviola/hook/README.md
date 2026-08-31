# Moviola hook

Tiny 1924 film-editing-machine scorer for a prefix-mutating image eviction: once a session accumulates ~40 page-sized images, Claude Code drops the earliest frames from the conversation it sends. That recuts the prefix. Every later impression is a full reprint at cache-creation rates. `cache_read` collapses to the system+tools floor (~26314). `cache_creation` jumps to ~590k and stays there. Pipe a probe ticket (`imageCount` / `prefixMutated` / `cacheRead` / `cacheCreation` / `earliestDropped` / `burnRate`) and get **recut** or **latched**.

Idle word is **latched**. Seeded state is recut / #90716. Never idle as "moviola" / "film" / "trim" / "cache" / "image" / "prefix".

```bash
node projects/moviola/hook/moviola.mjs < projects/moviola/data/90716.json
node projects/moviola/hook/moviola.mjs projects/moviola/data/latched.json
node --test projects/moviola/hook/moviola.test.mjs
```

Empty stdin uses the seeded #90716 recut ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `latched`, `recut`, `hold`, `alarm`, `idleWord`.

- **LATCHED** if the prefix is byte-stable, cache_read still amortizing (~658k class), cache_creation per image ~3.4k, no eviction splice
- **RECUT** if earliest images dropped, prefix mutated, full re-cache (#90716)
- **MUTATED** if the prefix was rewritten but burn numbers are not yet on the counter
- **EVICTED** if earliest image-frames sit in the trim bin
- **RECACHED** if 600–740k context was rewritten as cache-creation
- **BURNED** if the 5.7× burn ate a 5-hour allowance in 31 minutes
- **COLLAPSED** if cache_read sits at the system+tools floor (~26314)
- **SILENT** if there is no error, no warning, and `context_management` is null
- **ONE-IN-ONE-OUT** if promptTotal moves +113–149 after collapse
- **PREFIX-REWRITTEN** if cache breakpoints after system/tools were invalidated

Primary: [anthropics/claude-code#90716](https://github.com/anthropics/claude-code/issues/90716). Same-class (cite, not primary): [#86075](https://github.com/anthropics/claude-code/issues/86075), [#89418](https://github.com/anthropics/claude-code/issues/89418), [#90363](https://github.com/anthropics/claude-code/issues/90363), [#90675](https://github.com/anthropics/claude-code/issues/90675), [openai/codex#35925](https://github.com/openai/codex/issues/35925). Nearby (do not ship): Weir #90802, Cartouche #90881, #72226, #61091.

NOT Carcase / Callboard / Leaven / Hydra / Limpet / Scion / Almanac / Voucher / Kindling / Palimpsest / Fetch / Cenotaph.
