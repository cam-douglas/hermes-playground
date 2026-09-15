# Dictabelt

A **dictabelt / wax-belt / stenotype / belt-dictation booth** — a Dictabelt is a mid-century analog voice medium: a thin plastic belt engraved by a live stylus while the drum turns. Desktop voice dictation should stay **verbatim** (continuous speech lands as one joined transcript comparable to batch dictation on the same hardware). Instead the live stylus finalizes segments as it goes, and each boundary can drop audio, so the belt comes off as isolated recognized chunks. Fonts **Playfair Display** (display) + **Manrope** (body) + **IBM Plex Mono** (mono). Palette: belt-amber `#C9893A`, wax-cream `#F4EFE4`, carbon `#1A1612`, mic-red `#D64545`, steel `#4A5560`, verdant hold `#2F6B4F`. Fresh trio. Completely different UI/UX/metaphor — wax drum / live stylus / gap groove / stenotype bank / gooseneck mic. NOT a phonograph (palilalia). NOT a theatre souffleur. NOT clinical agraphia / anarthria. NOT lararium / lemure. NOT binder / cancellans. NOT tapestry / arras. NOT Frangible / Nameplate / Matryoshka / Dragnet.

The belt should stay **verbatim** (HOLD: continuous speech lands as one joined transcript comparable to batch dictation on the same hardware). Instead the booth was **dictabelt** after a **segment-drop**.

Primary:

- [anthropics/claude-code#94406](https://github.com/anthropics/claude-code/issues/94406) (OPEN). Title: `Voice dictation in the desktop app drops words throughout the recording — output is fragments, not a transcript (macOS, v2.1.237)`. Labels: bug, has repro, platform:macos, area:desktop. Environment: Claude Code desktop app v2.1.237; macOS Darwin 25.6.0; built-in MacBook Pro microphone, 48 kHz, input level ~57%. Reproduces in en AND de. BOTH hold and tap mode. Voice dictation loses speech continuously throughout a recording — beginning, middle, and end. Output is fragments: isolated recognized chunks with connecting speech missing. Every dictated prompt rewritten by hand. Same machine / mic / sentence: ChatGPT dictation essentially verbatim; Claude Code returns fragments. de vs en no difference. Hold vs tap no difference (so not only documented hold-mode warmup dropping first words). 15s silence auto-stop and 2 minute maximum compound (tracked separately in #74534). Stay off Anarthria/Souffleur/Palilalia/Agraphia/Mondegreen/Sostenuto/Sourdine/Aphonia/Aposiopesis/Lemure/Cancellans/Arras/Frangible/Nameplate/Matryoshka/Dragnet paradigms.

12:50 dictabelt: a dictabelt / wax-belt / stenotype / belt-dictation booth for #94406. Desktop voice dictation (v2.1.237, macOS) drops words throughout the recording — output is fragments not a transcript; same mic/sentence ChatGPT batch is essentially verbatim; en and de; hold and tap both fail; loss spread across whole take (not only hold warmup); 15s silence auto-stop and 2m max compound. Idle **verbatim** / seeded **dictabelt** / path **segment-drop**. Score dictabelt or admit verbatim.

Score dictabelt or admit verbatim.

Idle word: **verbatim** (HOLD: continuous speech lands as one joined transcript comparable to batch dictation on the same hardware). HOLD aliases: continuous, joined, seamless, fluent, batch-ok. Seeded word: **dictabelt** / #94406 (the segment-drop path). Path word: **segment-drop**. Product score: **dictabelt**. Never idle quiet / intact / cleared / armed / affixed / unpacked / scoped / enrolled / equated / penned or seeded lemure / cancellans / arras / frangible / nameplate / matryoshka / dragnet or path orphan-tick / deferred-delta / phantom-prompt / chmod-failopen / header-rename / subst-nest / root-find.

Phrase: **Score dictabelt or admit verbatim.**

- **verbatim** = IDLE HOLD: continuous speech lands as one joined transcript comparable to batch dictation on the same hardware
- **dictabelt** = seeded path / product score: streaming finalize drops mid-utterance audio into fragment transcripts
- **segment-drop** = path word
- **hold** = HOLD alias for idle verbatim
- **continuous** = HOLD alias: speech never breaks at a live cut
- **joined** = HOLD alias: chunks splice into one slip
- **seamless** = HOLD alias: no groove gap on the belt
- **fluent** = HOLD alias: the take reads as spoken
- **batch-ok** = HOLD alias: same-hardware batch control matches
- **fragment** = isolated recognized chunks; connecting speech missing
- **gap-spread** = loss across beginning, middle, and end — not only one end
- **hold-and-tap** = both modes fail; not only documented hold warmup
- **bilingual** = en and de both fragment on matching speech
- **silence-autostop** = 15s silence cut before a real dictated prompt finishes
- **two-minute-cap** = 2 minute maximum also cuts before a real prompt finishes
- **landing** = dictabelt / wax-belt / stenotype / belt-dictation
- **has-repro** = published shape: desktop v2.1.237 · Darwin 25.6.0 · 48 kHz ~57%
- **cousins** = cite-only #93782 #94031 #94041 #94251 #93193 — do not rebuild; do not conflate
- **backups** = cite-only #94344 #94398 #94397 #94396 #94393 #94392 #86198 #93924 #93770 #93777 #94151 #94420 #94417 #94415 — do not auto-pick
- **fixtures** = batch-ok belt / fragment belt
- **walk** = published idle verbatim → segment-drop → dictabelt
- **closed** = #94406 remains OPEN — cite only; not this booth

Verdicts: verbatim, dictabelt, segment-drop, hold, continuous, joined, seamless, fluent, batch-ok, fragment, gap-spread, hold-and-tap, bilingual, silence-autostop, two-minute-cap, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **dictabelt** or already **verbatim**. Fixtures use the issue's published incident only. Fragment rows are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): streaming transcription finalizes segments live; each segment boundary can drop audio; loss spread evenly across the take fits; ChatGPT records the full utterance then batch-transcribes. Invite verify against #94406 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94406](https://github.com/anthropics/claude-code/issues/94406)
- Cousins: do NOT rebuild / do NOT conflate: #93782 (Wispr Flow clipboard+Ctrl+V paste drop), #94031 (VoiceOver/app-switch echo loss), #94041 (/goal Stop hook re-fires stale text), #94251 (transcript JSONL omits pre-tool assistant text), #93193 (Bash isolation false-block on substring git). Sostenuto / Sourdine / Aphonia / Aposiopesis are different speech metaphors — do not copy their UI. None of them covers live streaming voice-dictation segment boundaries dropping mid-utterance audio into fragment transcripts vs batch verbatim.
- Backups (data only; next focus only — do not auto-pick): #94344, #94398, #94397, #94396, #94393, #94392, #86198, #93924, #93770, #93777, #94151, #94420, #94417, #94415

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:desktop
- Environment: Claude Code desktop app v2.1.237; macOS Darwin 25.6.0; built-in MacBook Pro microphone, default input, 48 kHz, input level ~57%
- Dictation language: reproduces in both `en` and `de`
- Reproduces in both hold and tap mode — switching to tap makes no observable difference
- Loses speech continuously throughout a recording — beginning, middle, and end
- Result is fragments: isolated recognized chunks with connecting speech missing entirely
- Every dictated prompt has to be rewritten by hand
- Same machine, same microphone, same spoken sentence, back to back: ChatGPT's dictation transcribes it essentially verbatim; Claude Code returns fragments
- `de` vs `en` makes no difference
- Not only the documented hold-mode warmup dropping the first words
- Recording limits compound: 15s silence auto-stop and 2 minute maximum both cut before a real dictated prompt finishes (tracked separately in #74534)
- Overlaps a locked 2026 cluster (#43240 umbrella, #40528 start dropped, #46154 cuts after 2-5 words, #47592 truncated after ~4 sentences) — filing fresh against 2.1.237 as the lock message instructs
- Comparable open issue #80277 is scoped to the VS Code extension
- Expected: a complete transcript accurate enough to send without manual repair — comparable to batch dictation on the same hardware

Problem found: SEGMENT-DROP — live streaming voice-dictation segment boundaries drop mid-utterance audio into fragment transcripts.

Why Dictabelt: A *dictabelt* is a wax/plastic belt that a live stylus engraves while the drum turns. The take should stay verbatim — one joined slip, comparable to a batch booth on the same hardware. Instead the stylus lifts at every live cut and the belt comes off as chips. Anarthria/#93782 dropped a clipboard paste — DIFFERENT. Souffleur/#94031 lost an accessibility echo — DIFFERENT. Palilalia/#94041 re-fired stale hook text — DIFFERENT. Agraphia/#94251 omitted written pre-tool text — DIFFERENT. Mondegreen/#93193 false-blocked a git substring — DIFFERENT. This booth is specifically **live streaming voice-dictation segment boundaries dropping mid-utterance audio into fragment transcripts** vs **batch verbatim**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores the segment-drop path (fragment belt) vs a verbatim/batch-ok hold — makes the invisible mid-utterance audio loss legible. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A dictated passage should come back as a complete transcript
2. Accurate enough to send without manual repair
3. Comparable to what batch dictation in other assistants delivers on the same hardware

## Why not a clone

This is specifically: **LIVE STREAMING VOICE-DICTATION SEGMENT BOUNDARIES DROPPING MID-UTTERANCE AUDIO INTO FRAGMENT TRANSCRIPTS VS BATCH VERBATIM. DESKTOP APP V2.1.237 ON MACOS LOSES SPEECH CONTINUOUSLY THROUGHOUT A RECORDING — BEGINNING, MIDDLE, AND END; OUTPUT IS ISOLATED RECOGNIZED CHUNKS; SAME MIC/SENTENCE CHATGPT BATCH IS ESSENTIALLY VERBATIM; EN AND DE; HOLD AND TAP BOTH FAIL; 15S SILENCE AUTO-STOP AND 2M MAX COMPOUND.**

Novel paradigm: dictabelt / wax-belt / stenotype / belt-dictation — belt-amber, wax-cream, carbon, mic-red, steel, verdant hold. New issue, new paradigm (segment-drop), new UI/UX/fonts/colors, new scoring vocabulary. A wax-belt recorder booth, not a phonograph groove, theatre prompt-box, clinical writing-desk, ENT clinic, household shrine, binder folio, or theater tapestry.

**NOT Anarthria/#93782** (Wispr Flow clipboard+Ctrl+V paste drop). Different defect. NOT ENT / laryngology clinic. Do not reuse articulate / Anarthria.

**NOT Souffleur/#94031** (VoiceOver/app-switch echo loss). Different defect. NOT theatre prompt-box. Do not reuse Souffleur.

**NOT Palilalia/#94041** (/goal Stop hook re-fires stale text). Different defect. NOT phonograph-groove. Do not reuse Palilalia.

**NOT Agraphia/#94251** (transcript JSONL omits pre-tool assistant text). Different defect. NOT clinical writing-desk. Do not reuse penned / Agraphia / pre-tool-omit.

**NOT Mondegreen/#93193** (Bash isolation false-block on substring git). Different defect. NOT tokenization. Do not reuse Mondegreen.

**NOT Sostenuto / Sourdine / Aphonia / Aposiopesis** — different speech metaphors; do not copy their UI.

**NOT Lemure/#94410** (orphan-tick). Different defect. NOT lararium / salt-bean. Do not reuse quiet / Lemure / orphan-tick.

**NOT Cancellans/#94400** (deferred-delta). Different defect. NOT binder folio. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Frangible/#94362** (chmod-failopen). Different defect. NOT wax-seal atelier. Do not reuse armed / Frangible / chmod-failopen.

**NOT Nameplate/#94349** (header-rename). Different defect. NOT hotel door-plate. Do not reuse affixed / Nameplate / header-rename.

**NOT Matryoshka/#94350** (subst-nest). Different defect. NOT lacquer nesting-doll. Do not reuse unpacked / Matryoshka / subst-nest.

**NOT Dragnet/#94064** (root-find). Different defect. NOT night blotter. Do not reuse scoped / Dragnet / root-find.

Live: https://hermes-playground-green.vercel.app/dictabelt/

```
node --test projects/dictabelt/dictabelt.test.mjs
node projects/dictabelt/dictabelt.mjs projects/dictabelt/data/dictabelt.json
```
