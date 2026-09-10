# Cachet

A **diplomatic / notarial wax-cachet blotter desk** — burgundy wax press, aged parchment folio, gold-leaf ribbon, ink, green blotter. Fonts **Cormorant Infant** (display) + **Figtree** (body) + **IBM Plex Mono** (mono). Palette: wax `#5c0a1a`, parchment `#f3e6c8`, gold leaf `#c9a227`, ink `#1a1208`, blotter green `#1f3d2a` — light parchment field with dark wax accents, not hangar strobe, cheque counterfoil, camera lucida, sterile lab, pulse-damper, earthwork fosse, hibernacle, or paraph issuer-seal.

Primary:

- [anthropics/claude-code#93490](https://github.com/anthropics/claude-code/issues/93490) (OPEN, bug, has repro, platform:macos, area:cost, area:core, performance). Title: `[BUG] --resume never hits the prompt cache past the static prefix on Fable 5.1 (opus hits): session-start context message is replayed as a plain string instead of the content blocks it was sent with`. Filed by vvasic 2026-09-10. Claude Code **2.1.268**. Every `--resume` (headless and interactive) re-writes the whole conversation into the cache even when warm: `cache_read` stays at the tools+system floor; `cache_creation` is the rest. Proxy capture: tools identical, system blocks identical, messages[0] identical byte-for-byte. First difference is messages[1] role:system (SessionStart hook output + # Environment): fresh start content is ARRAY with one text block + `cache_control {type: ephemeral, ttl: 1h}`; resume content is a PLAIN STRING, same text/length (26285 chars), NO cache_control. Prefix stops matching there; everything behind rewritten. Small probe ~18-25k tokens; real session 385k rewrite (background fork: read 27k, wrote 385k). Not TTL/settings/hooks: two fresh launches 30s apart hit each others cache completely (231238 read, 0 written). Model-specific: opus `--model opus` resumes HIT (write tiny / read full); fable 5.1 `--model fable` resumes MISS every time (write≈fresh write, read stuck at floor). Cousins cite-only: #91971 symptom without cause; #83913 same mechanism different message (PreToolUse/PostToolUse); #44045 closed covered messages[0]. Fable 5.1 docs note editing earlier turns invalidates thinking blocks — related platform constraint, cite only.

09:50 cachet: a diplomatic wax-cachet / notarial seal desk for #93490. Idle **hit** / seeded **flattened** / path **string-carrier**. Score cachet or admit hit.

Score cachet or admit hit.

Idle word: **hit** (HOLD: fresh+resume keep block carrier + cache_control; prefix matches; cache_read past floor). Seeded word: **flattened** / #93490 (Fable resume stringifies messages[1], drops cache_control). Path word: **string-carrier**. Product score: **cachet**. Never idle steady / strobing / off-label / strobe / matched / skewed / headers-hash / counterfoil / traced / pathless / image-cache / lucida / scrubbed / contaminated / fomite / gitignore / damped / spinning / mux / snubber / mounted / fossed / plan9 / fosse / warm / paged-out / majflt / hibernacle / sealed / mismatched / issuer / paraph / sterling / debased / hallmark / remanent / collimated / diopter / hysteresis / banked / ephemera.

Phrase: **when --resume on Fable 5.1 replays the session-start context as a plain string instead of sealed content blocks and busts the prompt-cache prefix, score cachet or admit hit.**

- **hit** = IDLE: HOLD; fresh+resume keep block carrier + cache_control; prefix matches; cache_read past floor
- **flattened** = #93490 seeded path: Fable resume stringifies messages[1], drops cache_control
- **cachet** = product score word for the wax-cachet that failed to re-affix on Fable `--resume`
- **string-carrier** = path word: resume replays the session-start context as a plain string instead of content blocks
- **hold** = HOLD alias for idle hit
- **fable-miss** = `--model fable` resumes MISS every time (write≈fresh write, read stuck at floor)
- **opus-hit** = `--model opus` resumes HIT (write tiny / read full)
- **resume** = every `--resume` (headless and interactive) re-writes the folio on Fable
- **fresh-start** = ARRAY with one text block + cache_control `{type: ephemeral, ttl: 1h}`
- **array-carrier** = content is ARRAY with one text block
- **plain-string** = same text, same length (26285 chars), no cache_control
- **cache-control** = `{type: ephemeral, ttl: 1h}`
- **prefix-bust** = prefix stops matching at messages[1]; everything behind rewritten
- **rewrite** = real session 385k rewrite (background fork: read 27k, wrote 385k)
- **session-start** = messages[1] role:system carries SessionStart hook output + # Environment
- **environment** = `# Environment` block rides in the session-start folio
- **background-fork** = `/background` fork of a long session: read 27k, wrote 385k
- **probe** = small probe ~18-25k tokens
- **has-repro** = Claude Code 2.1.268 · vvasic · macos · Fable 5.1 · 26285 chars
- **cousins** = cite-only #91971 #83913 #44045 — do not rebuild
- **backups** = cite-only #93485 #93458 #93439 #93475 #93438 #93466 — do not auto-pick
- **fixtures** = press / ribbon / folio / meter table for the cachet booth
- **walk** = published idle hit → fresh-start → cross-hit → prefix-identical → session-start → plain-string → prefix-bust → opus-hit → fable-miss → string-carrier → cachet

Verdicts: hit, flattened, cachet, string-carrier, hold, fable-miss, opus-hit, resume, fresh-start, array-carrier, plain-string, cache-control, prefix-bust, rewrite, session-start, environment, background-fork, probe, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the blotter is **flattened** / **cachet** or already **hit**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Fable 5.1 resume may flatten messages[1] from ARRAY+cache_control to a plain string, so the prompt-cache prefix stops matching and the folio is rewritten. Opus `--resume` still hits. Two fresh launches 30s apart hit each others cache completely, so this is not TTL/settings/hooks. Fable 5.1 docs note editing earlier turns invalidates thinking blocks — related platform constraint, cite only. Invite verify against #93490 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93490](https://github.com/anthropics/claude-code/issues/93490)
- Cite-only cousin: [anthropics/claude-code#91971](https://github.com/anthropics/claude-code/issues/91971) (symptom without a cause; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#83913](https://github.com/anthropics/claude-code/issues/83913) (same mechanism, different message — PreToolUse/PostToolUse; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#44045](https://github.com/anthropics/claude-code/issues/44045) (closed; covered messages[0]; do not rebuild)
- Backup (data only): #93485 Cowork hardlink upload cache
- Backup (data only): #93458 SessionStart hook additionalContext silently dropped when source=fork
- Backup (data only): #93439 Read tool never triggers PreToolUse hooks for binary files
- Backup (data only): #93475 Effort selector requires a very tall terminal
- Backup (data only): #93438 Agent dispatch isolation worktree cwd bleed
- Backup (data only): #93466 Desktop Directory → Plugins duplicate cards / no uninstall

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:cost, area:core, performance
- Claude Code **2.1.268**; reporter vvasic; macos; iTerm2 / zsh
- Every `--resume` (headless and interactive) re-writes the conversation even when warm
- `cache_read` stays at the tools+system floor; `cache_creation` is the rest
- Proxy: tools identical, system identical, messages[0] identical
- First difference is messages[1] role:system (SessionStart hook output + # Environment)
- Fresh: ARRAY + `cache_control {type: ephemeral, ttl: 1h}`
- Resume: PLAIN STRING, 26285 chars, no cache_control
- Probe ~18-25k tokens; real session 385k rewrite (read 27k / wrote 385k)
- Two fresh launches 30s apart hit each others cache completely
- Opus `--resume` HIT; Fable `--resume` MISS every time
- Fable 5.1 docs: editing earlier turns invalidates thinking blocks (cite only)

Problem found: FABLE 5.1 `--RESUME` FLATTENS THE SESSION-START CONTEXT TO A PLAIN STRING AND BUSTS THE PROMPT-CACHE PREFIX.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the wax-cachet stayed **hit** or was **flattened**. Educational diplomatic / notarial blotter for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A rebuilt history reproduces the request that was already sent, byte for byte, same carrier, same block shape, same cache_control
2. Fable `--resume` keeps messages[1] as ARRAY with one text block + cache_control `{type: ephemeral, ttl: 1h}`
3. `cache_read` on `--resume` moves past the tools+system floor the way opus `--resume` already does
4. The prompt-cache prefix keeps matching after the session-start context message

## Why not a clone

This is specifically: **FABLE 5.1 `--RESUME` REPLAYS THE SESSION-START CONTEXT AS A PLAIN STRING INSTEAD OF CONTENT BLOCKS AND BUSTS THE PROMPT-CACHE PREFIX** — diplomatic wax-cachet / notarial blotter desk, not hangar strobe, not cheque counterfoil, not camera-lucida atelier.

**NOT Strobe/#93468** (off-label ScheduleWakeup). Different defect. NOT hangar strobe-beacon.

**NOT Counterfoil/#93446** (add-json `--client-secret` headers-hash). Different defect. NOT cheque-counter / ticket-stub.

**NOT Lucida/#93429** (Desktop Code tab paste drops the image source path). Different defect. NOT camera-lucida / drafting plate.

**NOT Fomite/#93423.** **NOT Snubber/#93398.** **NOT Fosse/#93358.** **NOT Hibernacle/#93372.** **NOT Scapegoat/#93348.** **NOT Cartulary/#93331.** **NOT Paraph/#93327** (issuer-seal quotes). Different defect. NOT paraph issuer-seal.

**NOT Hallmark** (sterling/debased). **NOT Diopter / Hysteresis / Ephemera.** Those catalog paradigms are different mechanisms — this booth is specifically Fable resume string-carrier bust.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **wax-cachet blotter — the resume path should re-affix the same ephemeral cachet (content-block carrier + cache_control) so the prompt-cache prefix hits; instead Fable resume flattens messages[1] to a plain string and the whole folio is rewritten.**

Do NOT rename this product Strobe, Counterfoil, Lucida, Fomite, Snubber, Fosse, Hibernacle, Scapegoat, Cartulary, Paraph, Hallmark, Diopter, Hysteresis, Ephemera, or any existing catalog slug.
Do NOT reuse idle hit / flattened / string-carrier on a later booth.
Display here is **Cormorant Infant**. Body is **Figtree**. Mono is **IBM Plex Mono**.

Different surface: Fable resume string-carrier bust vs off-label ScheduleWakeup vs add-json headers-hash vs desktop image-cache omit.

Product name stays **Cachet**. Name/slug `cachet` unused in catalog.json (279 products before this ship; Strobe is #279).

Different UI: wax-cachet press / folio strip / cache hit-miss meters / Fable vs Opus compare chip. Cormorant Infant / Figtree / IBM Plex Mono. Light parchment field. NOT hangar strobe. NOT cheque-counterfoil. NOT camera-lucida atelier. NOT sterile lab. NOT pulse-damper. NOT earthwork fosse.

Different verbs: Press the cachet, Score cachet, Affix the folio, Compare Fable / Opus, Pin idle hit, Pin seeded flattened, Pin string-carrier, Clear the blotter.

Different idle: **hit**. Different #93490 seeded path: **flattened**. HOLD: **hit** / **hold**. ALARM: **flattened** / **cachet** / **string-carrier** / **prefix-bust**. Path: **string-carrier**.

## How to score

```bash
node --test projects/cachet/cachet.test.mjs
node projects/cachet/cachet.mjs projects/cachet/data/flattened.json
echo '{"seed":"flattened"}' | node projects/cachet/cachet.mjs
```

Open the living card at `projects/cachet/index.html` (or the live path `/cachet/`). Buttons: Press the cachet, Score cachet, Affix the folio, Compare Fable / Opus, Pin idle hit, Pin seeded flattened, Pin string-carrier, Clear the blotter. Toggle `--resume` / Fable 5.1 / Opus / STRING carrier / cache_control dropped / prefix bust — the score flips. Lay a fixture JSON on the blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s Fable `--resume` / STRING carrier / dropped cache_control / prefix-bust walk from the published #93490 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/cachet/
- Folder: `projects/cachet/`
