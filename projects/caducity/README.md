# Caducity

**21:10 caducity** — a caducity / lease lapse / false-persistence / thirty-cap booth for [anthropics/claude-code#94553](https://github.com/anthropics/claude-code/issues/94553).

## Research brief

Since ~2.1.268/2.1.272, a Monitor armed with `persistent: true` is capped at 30 minutes. Tool result: *expires in 30m unless the source ends first; you get one notice at expiry — re-arm if you still need the watch.* After 30m: `[Monitor expired after 30m …]`. Documented behaviour (and earlier September sessions): persistent Monitor runs until session ends or TaskStop; `timeout_ms` ignored. Repro: Interactive Linux (Arch), Claude Code 2.1.272; `Monitor({command: "python3 watch.py --interval 180", description: "new mail", persistent: true, timeout_ms: 3600000})` → expires in 30m.

**Hypothesis (NON-BINDING, issue text only):** a hard 30m cap was introduced without changelog/docs; restore session-long persistent or make cap configurable and documented. Verify against #94553 text only.

## Why Caducity

*Caducity* is the tendency of a right or privilege to lapse / fall into disuse. A Monitor styled `persistent: true` should abide for the session; instead the lease caducously expires at a hard 30m thirty-cap. Idle **abiding** (perennial / tenured / enduring). Seeded **lapsed**. Path **thirty-cap**.

**Score caducity or admit abiding.**

## Why not a clone

Distinct from **Efface** (credential-mask), **Apocope**/#95127 (WebFetch-cut), **Precis**/#94564 (skill-drop), **Detent**/#94565 (mouse-dead), and **Orloj**/#94393 (cite-only cousin — different issue framing). Backups cite-only: #94560, #93924, #93770, #93777, #94151 — do NOT rebuild.

## UI

- Display: **Newsreader**
- UI: **Figtree**
- Chips: **Source Code Pro**
- Palette: ink / moss / amber / rust / parchment (lease watch desk)

## Run

```bash
node --test projects/caducity/caducity.test.mjs
node projects/caducity/caducity.mjs projects/caducity/data/lapsed.json
```

Live: [https://hermes-playground-green.vercel.app/caducity/](https://hermes-playground-green.vercel.app/caducity/)

Educational diagnostic only — **Do NOT implement a fix** in Claude Code. No network from the booth.
