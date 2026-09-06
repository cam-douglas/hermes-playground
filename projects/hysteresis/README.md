# Hysteresis

A **magnetic hysteresis / materials-lab assay** — iron-oxide rust, ferrite charcoal, cobalt blue B-H curve glow, remanence amber tick marks — Syne + Figtree + IBM Plex Mono — for a real Claude Code defect: **`/EFFORT` MID-SESSION INVALIDATES THE PROMPT CACHE ON SONNET 5 AND OPUS 5 (FULL REWRITE ON OPUS), DOCS SAY NO EFFECT; FABLE 5.1 UNAFFECTED.** Turning the effort dial should leave the prompt-cache remanent. On Sonnet the curve droops (partial rewrite). On Opus the loop snaps open (`read=0`). Score the remanence or admit the cache already rewritten.

Primary:

- [anthropics/claude-code#92444](https://github.com/anthropics/claude-code/issues/92444) (OPEN, bug, documentation, has repro, area:cost). Title: `[BUG] /effort mid-session invalidates the prompt cache on Sonnet 5 and Opus 5 (full rewrite on Opus), docs say no effect; Fable 5.1 unaffected`. Filed 2026-09-06T06:44:01Z. Reporter: by-carlos.

21:50 hysteresis: a materials lab that should leave the prompt-cache remanent when the effort dial turns — docs say no effect — but Sonnet droops a partial rewrite and Opus snaps the loop open (read=0). Score the remanence or admit the cache already rewritten.

Idle word: **remanent** (prompt-cache holds after mid-session `/effort`, as docs claim). Seeded state: **rewritten** / #92444 — Sonnet partial rewrite; Opus full rewrite (`read=0`); docs say no effect. Never idle as cleared, maxed, mute, inherited, freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, misaimed, cold, voided, alongside, shed, latched, quiet, bound, or open. Never seeded as refused, hardwired, rostered, collided, doubled, clobbered, retried, cohabited, vanished, or clamped.

**Hysteresis** is a magnetic materials / B-H curve lab. Turning `/effort` mid-session should leave the prompt-cache remanent. Instead Sonnet droops and Opus snaps the loop open.

- **remanent** = IDLE: prompt-cache holds after mid-session `/effort` (docs + idle fence)
- **rewritten** = seeded word: mid-session `/effort` invalidated the cache on Sonnet 5 / Opus 5
- **sonnet-partial** = Sonnet 5 high→low read 51.3K / write 26.5K; low→medium read 45.4K / write 32.5K
- **opus-full** = Opus 5 both switches read=0 / write≈ctx; entire prefix rewritten
- **fable-preserved** = contrast hold: Fable 5.1 all switches remanent / free (~66.8K read, ~0.13-0.22K write)
- **docs-mismatch** = docs say effort is not part of the cache key; empirically false on two of three families
- **dialog-false-alarm** = in-app confirmation warns of a cache miss unconditionally; false alarm on Fable
- **mid-session-switch** = control high→high holds; switches invalidate on Sonnet/Opus
- **cousins** = cite-only #61984 CLOSED and #63962 CLOSED

Verdicts: remanent, rewritten, sonnet-partial, opus-full, fable-preserved, docs-mismatch, dialog-false-alarm, mid-session-switch, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a mid-session `/effort` change would leave the cache remanent or already rewritten. Fixtures use the issue's transcript table (`cache_read_input_tokens` / `cache_creation_input_tokens`), the docs claim, the family split, and the unconditional dialog only.

Hypothesis only (NON-BINDING): effort may be included in the cache key for Sonnet/Opus families despite docs; Fable omits it. Verify nothing — encode issue table only. Encoded from the issue body only. Do not invent runtime source claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92444](https://github.com/anthropics/claude-code/issues/92444)
- Cousins cite-only (NOT primary): [anthropics/claude-code#61984](https://github.com/anthropics/claude-code/issues/61984), [anthropics/claude-code#63962](https://github.com/anthropics/claude-code/issues/63962)

What happened (from the issue — do not invent):

- Anthropic prompt-caching docs say effort is "not part of the cache key... changing it mid-session has no effect on the cache" (https://code.claude.com/docs/en/prompt-caching).
- Empirically true only for Fable 5.1. On Sonnet 5 and Opus 5, a mid-session `/effort` change invalidates the cache — partially on Sonnet, fully on Opus.
- Resolves the apparent contradiction between #61984 (Opus 4.7: full/near-full cache miss on effort change) and #63962 (repro showing cache fully preserved, model unspecified but consistent with Fable): both were correct, for different models. Both auto-closed by the stale bot.
- Repro: one interactive session per model, ~65-78K token base context, effort held steady for a control turn, then switched twice. Numbers are `cache_read_input_tokens` / `cache_creation_input_tokens` from each session's transcript.
- Sonnet 5 control high→high: read 77.4K / write 0.17K. high→low: read 51.3K / write 26.5K. low→medium: read 45.4K / write 32.5K.
- Opus 5 control high→high: read 65.7K / write 0.13K. high→low: read **0** / write **65.9K**. low→medium: read **0** / write **66.1K**.
- Fable 5.1: all switches preserve cache (~66.8K read, ~0.13-0.22K write).
- Impact: docs wrong for two of three model families; users think effort change is free when it is not. In-app confirmation dialog warns of cache miss unconditionally — correct for Sonnet/Opus, false alarm for Fable.
- Suggested fix (cite only): differentiate docs + confirmation dialog by model family.

Problem found: mid-session `/effort` → Sonnet partial rewrite / Opus full rewrite (`read=0`) → docs still claim remanent / no effect.

Why this solution: a diagnostic scorer for the remanent cache → rewritten loop chain, so a reader can pin idle remanent, seed rewritten, and score sonnet-partial / opus-full / fable-preserved / docs-mismatch / dialog-false-alarm / mid-session-switch / cousins against the published facts.

## Why not a clone

This is specifically: **mid-session `/effort` invalidates the prompt cache on Sonnet 5 (partial) and Opus 5 (full rewrite), while docs say no effect and Fable 5.1 stays remanent.**

NOT Rheostat/#92436 — bakelite effort dial for `code-review --level low` still running high-effort pipeline template. Hysteresis is prompt-cache invalidation when `/effort` changes mid-session (cost/cache), not review-effort hardwiring.
NOT Hardstand/#92452 — Dispatch exclusive-cwd refusal. Different paradigm entirely.
NOT Aphonia/#92409, Fulcrum/#92377, Wildcat/#92399, Clobber/#92419, Ephemera/#92090 (cache TTL), Commutator, Watchdog, Understudy, Fairlead, and all prior catalog desks.
Skipped #92462 (stale non-archived blocks Linux) because same Dispatch exclusive-cwd paradigm as Hardstand.
Do NOT name this Rheostat, Hardstand, Aphonia, Fulcrum, Wildcat, Clobber, Ephemera, Commutator, or any existing catalog slug.
Do NOT reuse idle cleared / maxed / mute / inherited / freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / misaimed / cold / voided / alongside / shed / latched / quiet / bound / open.
Do NOT reuse seeded refused / hardwired / rostered / collided / doubled / clobbered / retried / cohabited / vanished / clamped.

Different surface: mid-session `/effort` prompt-cache invalidation (family-split remanence) vs review-skill `--level` hardwiring / Dispatch exclusive-cwd / ListAgents-SendMessage / naming collision / bg completion / inode watcher.

Product name stays **Hysteresis**. Name/slug `hysteresis` confirmed unused in catalog.json (180 products).

Different UI: magnetic hysteresis / materials lab / iron-oxide rust / ferrite charcoal / cobalt B-H curve / remanence amber ticks. Syne / Figtree / IBM Plex Mono. NOT asphalt/sodium taxiway (Hardstand — Chakra Petch / Manrope / Share Tech Mono). NOT bakelite/oxanium dial bench (Rheostat — Oxanium / Lexend / Kode Mono). Stay OFF night apron / bakelite dial / laryngoscope tray / brass beam / windlass deck / forme/ink/plate.

Different verbs: pin idle remanent, pin seeded rewritten, score remanence vs rewritten, flip remanent vs rewritten, load fixtures, reset to remanent.

Different idle: **remanent**. Different seeded: **rewritten**. Contrast: **remanent** / **fable-preserved** (free). Diagnostic: **sonnet-partial** / **opus-full** / **docs-mismatch** / **dialog-false-alarm** / **mid-session-switch**.

Cousins cite-only (NOT primary):

- [#61984](https://github.com/anthropics/claude-code/issues/61984) (CLOSED) — Opus 4.7 full/near-full cache miss on effort change. Auto-closed by stale bot. #92444 says this was correct for Opus.
- [#63962](https://github.com/anthropics/claude-code/issues/63962) (CLOSED) — cache fully preserved (model unspecified but consistent with Fable). Auto-closed by stale bot. Also the source cited for the in-app confirmation dialog.

## Live catalog path

`/hysteresis/` is this static magnetic remanence scoring assay. Path `https://hermes-playground-green.vercel.app/hysteresis/` and subdomain `https://hysteresis.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `21:50 Sydney · hysteresis`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **rewritten** — Sonnet partial / Opus `read=0` / docs say no effect.
2. Idle **remanent** → prompt-cache holds after mid-session `/effort`.
3. Diagnostic **sonnet-partial** → curve droops; 51.3K / 26.5K and 45.4K / 32.5K.
4. Diagnostic **opus-full** → loop snaps open; both switches `read=0`.
5. Contrast **fable-preserved** → remanent / free on every switch.
6. Diagnostic **docs-mismatch** → advertised remanent; live rewritten on two families.
7. Diagnostic **dialog-false-alarm** → unconditional miss warning; false on Fable.
8. Diagnostic **mid-session-switch** → control holds; switches rewrite Sonnet/Opus.
9. Assay UI: B-H curve board, three model lanes, remanence faceplate, transcript table, cobalt glow, amber ticks.
10. Stay-off strip: Rheostat / Hardstand / Aphonia / Fulcrum / Wildcat / Clobber / Ephemera / Commutator. Primary stays #92444.
11. **Score the remanence** walks the probe ticket and lights chips on the ferrite. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the loop (remanent / rewritten / sonnet / opus).

## How to score

Open `projects/hysteresis/index.html` in a browser, or serve the repo root and visit `/hysteresis/` (Vercel rewrite → `/projects/hysteresis`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/hysteresis/hook/hysteresis.test.mjs
```

Empty paste scores the idle **remanent** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **rewritten** / Sonnet partial / Opus `read=0` / docs mismatch.

## Hook

`projects/hysteresis/hook/` scores a probe `{ seed, remanent, rewritten, sonnetPartial, opusFull, fablePreserved, docsMismatch, dialogFalseAlarm, midSessionSwitch }` and returns `{ verdict, reasons[], remanent, rewritten, chips[] }`. See `hook/README.md`.

```bash
node projects/hysteresis/hook/index.mjs projects/hysteresis/data/rewritten.json
echo '{"seed":"remanent","remanent":true,"rewritten":false,"cachePreserved":true}' | node projects/hysteresis/hook/index.mjs
```

`remanent` is true ONLY when the verdict is remanent or fable-preserved (idle, or honest Fable hold). Seeded 92444 numbers must produce rewritten / `remanent=false`. A rewritten cache is never remanent.
