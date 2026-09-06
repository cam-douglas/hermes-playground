# Diopter

An **optical diopter trial-lens tray / refraction bench** — cool steel, cyan lens flare, dark slate, phoropter wells, collimation axis, UUID trial lenses, prefix-diff ledger, measured-cost chronograph; Petrona + Outfit + Fragment Mono — for a real Claude Code defect: **THE PER-SESSION SCRATCHPAD UUID IN THE SYSTEM PROMPT IS THE ONLY CROSS-SESSION PROMPT DIFF, AND IT INVALIDATES THE CACHED PREFIX ON EVERY NEW SESSION.** Consecutive `claude -p "hi"` runs in the same project are byte-identical in tools + messages; only the system block differs at the scratchpad UUID path — and that one refractive element **defocuses** the entire prefix cache. When the UUID is normalised / the scratchpad path is moved out of the cached prefix (**sharp**), that is the hold path.

Primary:

- [anthropics/claude-code#92524](https://github.com/anthropics/claude-code/issues/92524) (OPEN, bug, has repro, platform:macos, area:cost, area:core). Title: `Per-session scratchpad UUID in the system prompt is the only cross-session prompt diff, invalidating the cached prefix on every new session`. Filed 2026-09-06T17:45:58Z. Reporter: nikolai-vysotskyi. Claude Code 2.1.260, macOS 26.5, M5 Max. Repro via `ANTHROPIC_BASE_URL` capture server.

05:50 diopter: an optical diopter trial-lens tray that should keep the system+tools prefix collimated across sessions but instead seats a per-session scratchpad UUID lens in the system prompt and defocuses the entire cache (#92524). Score defocused or admit sharp.

Idle word: **defocused** (UUID lens in system prompt throws the whole cached prefix out of focus on every new session). Seeded state: **sharp** / #92524 — UUID normalised / scratchpad path moved out of cached prefix → cache hit. Never idle as skimmed, intact, mislabeled, scoped, saturating, vented, preheating, lit, hangfired, executed, thrashing, responsive, leaking, excised, remanent, rewritten, or any prior catalog pair.

**Diopter** = a trial lens whose power is measured in dioptres. The system+tools prefix should stay collimated. Here a per-session UUID is seated as a refractive element inside the cached system block.

- **defocused** = IDLE: UUID lens in the system prompt; entire prefix cache thrown out of focus
- **sharp** = seeded word: UUID normalised / path moved out of cached prefix → cache hit
- **uuid-diff** = tools 223,596 chars + messages 50,534 chars byte-identical; system 7,483 chars differs at one UUID
- **cache-miss** = new session writes system+tools instead of reading them
- **rewrite-16157** = next session only-UUID-differs: 30.6 s / 16,157 input_tokens
- **normalized-hit** = same request with UUID normalised: 0.4 s / 5; MCP e2e 131.7 → 17.3 → 8.3
- **cousins** = cite-only #77306 #92033 #90953

Verdicts: defocused, sharp, uuid-diff, cache-miss, rewrite-16157, normalized-hit, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No capture server. Score whether the bench would defocus on a new-session UUID or already sit sharp. Fixtures use the issue's measured times, token counts, block sizes, and published UUIDs only.

Encoded from the issue body only. Do not invent source-code claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92524](https://github.com/anthropics/claude-code/issues/92524)
- Cousins cite-only (NOT primary): [anthropics/claude-code#77306](https://github.com/anthropics/claude-code/issues/77306), [anthropics/claude-code#92033](https://github.com/anthropics/claude-code/issues/92033), [anthropics/claude-code#90953](https://github.com/anthropics/claude-code/issues/90953)

What happened (from the issue — do not invent):

- Environment: Claude Code 2.1.260, macOS 26.5, M5 Max. Reproduced by pointing `ANTHROPIC_BASE_URL` at a local capture server and diffing two request bodies.
- Symptom: the system prompt embeds the scratchpad directory path, which contains a per-session UUID. That UUID is the only thing that differs between two otherwise byte-identical requests from consecutive sessions in the same project — and because it sits inside the cached prefix, everything after it is invalidated on every new session.
- Diff of two consecutive `claude -p "hi"` runs in the same directory:
  - `tools` (137 MCP tools): 223,596 chars — **byte-identical, same order**
  - `messages`: 50,534 chars — **byte-identical**
  - `system`: 7,483 chars — differs at exactly one place
- The single difference:
  ```
  ...-scratchpad/fc9aab5b-da05-4cc7-bbe2-410a1c472151/scratchpad
  ...-scratchpad/88966ec9-2cb4-4872-bc6b-624b66257462/scratchpad
  ```
  from `/private/tmp/claude-501/<project>/<SESSION-UUID>/scratchpad`.
- Same UUID also appears in `metadata.user_id` (not part of the prompt; harmless).
- Measured against a local model (warm M5 Max), 65,303-token prompt:

  | request | wall | input_tokens |
  |---|---|---|
  | cold | 104.3 s | 65,303 |
  | identical prompt again | 0.3 s | 5 |
  | next session — only UUID differs | 30.6 s | 16,157 |
  | same request with UUID normalised | 0.4 s | 5 |

- Normalising that one UUID in a proxy turns a 30.6 s re-prefill into 0.4 s.
- End-to-end with MCP enabled, three consecutive real sessions went 131.7 s → 17.3 s → 8.3 s.
- Hosted side not measured. The issue notes the mechanism is not local-specific (volatile UUID sits in `system`, ahead of tool definitions and the conversation) but does not claim a hosted number.
- Suggested fixes from the issue (cheapest first) — assay rails, not claimed implemented code:
  1. Move the scratchpad path out of the cached prefix (last user turn / late system-reminder)
  2. Make the path derivable and stable per project
  3. Place the volatile segment as late as possible so tools (223 KB) stay in the shared prefix

Problem found: cross-session prefix invalidation from a volatile UUID *inside* the cached system block → 30.6 s / 16,157 vs 0.4 s / 5 when normalised.

Why this solution: a diagnostic scorer for the defocused → sharp refraction chain, so a reader can admit idle defocused, pin seeded sharp, and score uuid-diff / cache-miss / rewrite-16157 / normalized-hit / cousins against the published facts.

## Why not a clone

This is specifically: **cross-session prefix invalidation from a volatile UUID inside the cached system block.**

NOT Decant/#92515 — macOS Desktop login-shell env decanted to PATH-only (gravity-pour cellar rack).
NOT Catachresis/#92518 — MCP 403 `insufficient_scope` stamped as token expired (lexicographer stamp desk).
NOT Bourdon/#92510 — Cowork Apple Virtualization host fd climb.
NOT Glowplug/#85050 — Windows silent startup preheat gaps.
NOT Hangfire/#92478 — queued `/compact` demoted to a plain prompt.
NOT Thrash/#88257 — first-prompt event-loop stall / RSS.
NOT Muzzle/#92459 — safe-mode skill_listing attachment leak.
NOT Hysteresis/#92444 — mid-session `/effort` cache remanence (different mechanism: effort key vs UUID-in-system).

Stay OFF all prior catalog slugs/paradigms: Decant / Catachresis / Bourdon / Glowplug / Hangfire / Thrash / Muzzle / Hysteresis / Hardstand / Rheostat / Aphonia / Solecism / Oubliette / Ephemera / Commutator / Heddle and every existing slug in catalog.json.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle skimmed / intact / mislabeled / scoped / saturating / vented / preheating / lit / hangfired / executed / thrashing / responsive / leaking / excised / remanent / rewritten.
Do NOT reuse seeded intact / scoped / lit / executed / responsive / excised / rewritten / vented.

Different surface: cross-session UUID-in-system prefix miss vs PATH skim / OAuth mislabel / VM fd leak / Windows preheat / compact demotion / effort remanence.

Product name stays **Diopter**. Name/slug `diopter` confirmed unused in catalog.json (188 products).

Different UI: optical diopter trial-lens tray / refraction bench / cool steel / cyan lens flare / dark slate / phoropter wells / collimation axis / UUID trial lenses / prefix-diff ledger / measured-cost chronograph. Petrona / Outfit / Fragment Mono. NOT Spectral/Karla/Roboto Mono (Decant). NOT Fraunces/Manrope/JetBrains Mono (Catachresis). NOT Archivo Black/Sora/IBM Plex (Bourdon). NOT Teko/Outfit/Share Tech (Glowplug). NOT Anybody/Source Sans/JetBrains (Hangfire). NOT cellar rack, NOT stamp desk, NOT brass Bourdon gauge, NOT diesel bay, NOT chronograph, NOT CRT, NOT magnetic remanence.

Different verbs: admit defocused, pin seeded sharp, score defocused vs sharp, load #92524 fixture, score the lens.

Different idle: **defocused**. Different seeded: **sharp**. HOLD: **sharp**. ALARM: **defocused** / **uuid-diff** / **cache-miss** / **rewrite-16157** / **normalized-hit** / **cousins**.

Cousins cite-only (NOT primary):

- [#77306](https://github.com/anthropics/claude-code/issues/77306) — forks forfeit conversation cache: session-id-bearing scratchpad path in system (cache-diagnosis: system_changed). Primary stays #92524.
- [#92033](https://github.com/anthropics/claude-code/issues/92033) — mid-conversation tool/MCP list changes invalidate prefix within a session. Same cache, different trigger. Primary stays #92524.
- [#90953](https://github.com/anthropics/claude-code/issues/90953) — feature request for a “why did this cache miss” diagnostic. Primary stays #92524.

Same cache class; this product is specifically the cross-session UUID lens in the cached system block.

## Live catalog path

`/diopter/` is this static optical trial-lens scoring assay. Path `https://hermes-playground-green.vercel.app/diopter/` and subdomain `https://diopter.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `05:50 Sydney · diopter · catalog #189 · #92524`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **defocused** → UUID lens in system; entire prefix out of focus.
2. Seeded **sharp** → UUID normalised / path moved out of cached prefix → cache hit.
3. Diagnostic **uuid-diff** → tools + messages identical; system differs at one UUID.
4. Diagnostic **cache-miss** → new session writes system+tools instead of reading them.
5. Diagnostic **rewrite-16157** → 30.6 s / 16,157 when only the UUID differs.
6. Diagnostic **normalized-hit** → 0.4 s / 5; MCP 131.7 → 17.3 → 8.3.
7. Diagnostic **cousins** → #77306 #92033 #90953 cite-only.
8. Assay UI: trial-lens tray, phoropter wells, collimation axis, timing chronograph, prefix-diff ledger, three prescription rails.
9. Stay-off strip: Decant cellar / Catachresis stamp desk / Bourdon-tube gauge / diesel glow-plug / delayed-primer / CRT paging-storm / olive suppressor / magnetic remanence. Primary stays #92524.
10. **Score the lens** walks the probe ticket and lights chips on the bench. Chip-switch every verdict. Paste or drop JSON. Bench simulator chips rewrite the refraction (defocused / sharp / uuid-diff / rewrite).

## How to score

Open `projects/diopter/index.html` in a browser, or serve the repo root and visit `/diopter/` (Vercel rewrite → `/projects/diopter`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/diopter/hook/diopter.test.mjs
```

Empty paste scores the idle **defocused** ticket if you admit defocused. Paste a probe on the page or drop a fixture from `data/`. The living page admits **defocused** / UUID lens / #92524.

## Hook

`projects/diopter/hook/` scores a probe `{ seed, defocused, sharp, request, wall, input_tokens, toolsIdentical, messagesIdentical, systemDiffers, uuidNormalized }` and returns `{ verdict, reasons[], defocused, sharp, chips[], lens }`. See `hook/README.md`.

```bash
node projects/diopter/hook/index.mjs projects/diopter/data/92524.json
echo '{"seed":"sharp","sharp":true,"uuidNormalized":true,"input_tokens":5}' | node projects/diopter/hook/index.mjs
```

`sharp` is true ONLY when the verdict is sharp or normalized-hit (the UUID is out of the cached prefix / the cache hits). Seeded 92524 numbers must produce defocused / `sharp=false` on the next-session glass. A defocused refraction is never the hold path.
