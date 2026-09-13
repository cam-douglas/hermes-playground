# Sepulchre

A **stone sepulchre / burial vault / sealed tomb / ossuary niche / limestone lintel / extinguished-lamp booth** — limestone slabs, soot-dark vault, lamp-oil amber, cold iron grate, bone tablets. Fonts **Cardo** (display) + **Figtree** (body) + **IBM Plex Mono** (chips). Palette: limestone `#D6C7A8`, soot `#161310`, lamp-oil amber `#C67A28`, vault shadow `#2C241C`, cold iron `#3E434A`, bone `#EDE4D4`, niche `#8C6B48`, wick `#E8A44A`. Fresh trio. NOT Sneck/#94052. NOT Drawbridge/#94049. NOT Chirograph/#94045. NOT Titulus/#94025. NOT Derelict/#93996. NOT Vestry/#94008. NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Parablepsis/#93954. NOT Demesne/#93989. NOT Nullarbor/#93595. NOT Sigil. Completely different UI/UX/metaphor. This is specifically: **BASH RESULT WITH NUL BYTES → NEXT REQUEST BODY TRUNCATED → PERMANENT 400 UNEXPECTED END OF DATA → SESSION DEAD FOREVER.**

The vault should stay **living** (HOLD: unsealed / breathing / open-vault / intact). Instead the booth was **sepulchre** after a **bash-nul-poison**.

Primary:

- [anthropics/claude-code#94055](https://github.com/anthropics/claude-code/issues/94055) (OPEN). Title: `Session dies permanently with 400 ... unexpected end of data after a Bash result containing NUL bytes`. Labels: bug, has repro, platform:linux, area:bash. If a Bash tool result contains NUL characters (U+0000), the next API request is sent with a truncated body. Server returns `400 invalid_request_error` / `The request body is not valid JSON: unexpected end of data`. The session never recovers — every following turn rebuilds the same poisoned body. Automatic model fallback retries the same body against a second model and cannot help (rejected before any model sees it). Reading any binary as text is enough. Reproduced 10/10 on Claude Code 2.1.270 with a two-step prompt: Bash greps 80-byte windows near `.lsp.json` from a renamed release binary (`poison`), then a follow-up turn fails. First turn completes; second and all later requests fail. Truncation column ranged ~87869–88442 across runs. The grep succeeds and returns 80 byte windows of the file's string table, which contain NUL padding (37 NUL bytes sit within 80 bytes of the `.lsp.json` string). The two-step prompt matters only because a second request is needed to carry the poisoned tool result. Any follow-up turn fails. The cut point tracks the position of the NUL, not the size of the body. Shortest form: `head -c 300 /bin/bash` (ELF header, 225 of them NUL). Bash already rejects control characters in the command; the Read tool detects a binary and never emits raw bytes; Bash tool output has no equivalent check. A 4 KB result containing 76 NUL characters is accepted with `is_error: false`. Not a context window problem. Not payload size. Not the model. Sessions cannot be rescued from inside the product; resuming replays the stored transcript. Cousins cite-only: #91003 (JSON Parse Unexpected EOF discards turns mid-stream), #85842 (Edit tool silently corrupts pre-existing non-UTF-8 bytes), #92562 (Large Bash tool-call payloads not shown in UI). Backups cite-only (next focus only — do not auto-pick): #94059 #94053 #94041 #94032 #94031 #94029 #93987 #93924 #93770 #93777. Stay off Sneck/Drawbridge/Chirograph/Titulus/Derelict/Vestry/Surfeit/Phosphene/Parablepsis/Demesne/Nullarbor/Sigil paradigms.

08:50 sepulchre: a stone sepulchre / burial-vault / sealed-tomb / ossuary-niche / limestone-lintel / extinguished-lamp booth for #94055. If a Bash tool result contains NUL characters (U+0000), the next API request is sent with a truncated body; server returns 400 invalid_request_error / unexpected end of data; the session never recovers — every following turn rebuilds the same poisoned body; automatic model fallback retries the same body against a second model and cannot help. Idle **living** / seeded **sepulchre** / path **bash-nul-poison**. Score sepulchre or admit living.

Score sepulchre or admit living.

Idle word: **living** (HOLD: unsealed / breathing). HOLD aliases: living, unsealed, breathing, open-vault, intact. Seeded word: **sepulchre** / #94055 (the bash-nul-poison path). Path word: **bash-nul-poison**. Product score: **sepulchre**. Never idle cleared / spanned / matched / inscribed / berthed / pegged / tempered / quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / singular / equalized / legible / calibrated / tethered / engaged / flush / candid / stetted / lit / primed / raised / preserved / tokenized / sprung / unpinned / latched / sealed / liveried / stamped / emptied / warm / mounted / traced / damped / afloat / concordant / routed / bound / honest / fossed / scapegoated / accreted / mismatched / inherited / washed or seeded sneck / drawbridge / chirograph / titulus / derelict / vestry / surfeit / phosphene / parablepsis / demesne / cartouche / nullarbor / sigil / chip-dismiss-ephemeral / rc-bridge-update-drop / worktree-rename-stale.

Phrase: **Score sepulchre or admit living.**

- **living** = IDLE: HOLD; vault stays unsealed; lamp still burns; JSON stream intact
- **sepulchre** = #94055 seeded path and product score: NUL cuts the next request; session entombed forever
- **bash-nul-poison** = path word: next body truncated at the first NUL; 400 unexpected end of data
- **hold** = HOLD alias for idle living
- **unsealed** = HOLD alias: the vault stays unsealed
- **breathing** = HOLD alias: the lamp still breathes
- **open-vault** = HOLD alias: the ossuary niche stays an open vault
- **intact** = HOLD alias: the JSON stream stays intact
- **nul-bytes** = Bash result contains NUL characters (U+0000)
- **truncated-body** = next API request is sent with a truncated body
- **unexpected-end** = 400 invalid_request_error / unexpected end of data
- **session-dead** = every following turn rebuilds the same poisoned body
- **model-fallback-useless** = fallback retries the same body against a second model
- **binary-as-text** = reading any binary as text is enough
- **two-step-prompt** = first turn completes; follow-up fails
- **landing** = limestone lintel landing / ossuary niche / extinguished lamp
- **has-repro** = published shape: 2.1.270 two-step poison grep / NUL windows / col ~87869–88442 / 10/10
- **cousins** = cite-only #91003 #85842 #92562 — do not conflate
- **backups** = cite-only #94059 #94053 #94041 #94032 #94031 #94029 #93987 #93924 #93770 #93777 — do not auto-pick
- **fixtures** = limestone / soot / amber / vault / iron / bone
- **walk** = published idle living → bash-nul-poison → sepulchre

Verdicts: living, sepulchre, bash-nul-poison, hold, unsealed, breathing, open-vault, intact, nul-bytes, truncated-body, unexpected-end, session-dead, model-fallback-useless, binary-as-text, two-step-prompt, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **sepulchre** or already **living**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): NUL bytes from a Bash tool result are stored verbatim in the session transcript and reach the next request body, which is truncated at the first NUL; every following turn rebuilds the same poisoned body so the session stays dead; model fallback retries the same body. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94055](https://github.com/anthropics/claude-code/issues/94055)
- Cousins: #91003 cite-only (JSON Parse Unexpected EOF discards turns mid-stream). #85842 cite-only (Edit tool silently corrupts pre-existing non-UTF-8 bytes). #92562 cite-only (Large Bash tool-call payloads not shown in UI). Adjacent only. Different defects. Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #94059, #94053, #94041, #94032, #94031, #94029, #93987, #93924, #93770, #93777

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:linux, area:bash
- Claude Code 2.1.270 (also seen on 2.1.266 and 2.1.218); Linux aarch64; CLI directly
- If a Bash tool result contains NUL characters (U+0000), the next API request is sent with a truncated body
- Server returns `400 invalid_request_error` / `The request body is not valid JSON: unexpected end of data`
- The session never recovers — every following turn rebuilds the same poisoned body
- Automatic model fallback retries the same body against a second model and cannot help
- Reading any binary as text is enough
- Reproduced 10/10 on 2.1.270 with a two-step prompt
- Bash greps 80-byte windows near `.lsp.json` from a renamed release binary (`poison`)
- First turn completes; second and all later requests fail
- Truncation column ranged ~87869–88442 across runs
- 37 NUL bytes sit within 80 bytes of the `.lsp.json` string
- Shortest form: `head -c 300 /bin/bash` (225 NUL); not the primary repro because `/bin/bash` differs between machines
- Bash already rejects control characters in the command; Read tool detects a binary; Bash output has no equivalent check
- A 4 KB result containing 76 NUL characters is accepted with `is_error: false`
- Not a context window problem; not payload size; not the model
- Sessions cannot be rescued from inside the product; resuming replays the stored transcript

Problem found: BASH RESULT WITH NUL BYTES → NEXT REQUEST BODY TRUNCATED → PERMANENT 400 UNEXPECTED END OF DATA → SESSION DEAD FOREVER.

Why Sepulchre: a sepulchre is a stone burial vault. The first turn still walks the aisle (the Bash grep completes). The NUL is a cut in the limestone tablet — the next request body ends mid-glyph. The lamp goes out. Every later turn rebuilds the same entombed body. Model fallback is a second niche in the same sealed vault. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: living catalog page + node diagnostic encoding idle **living** / seeded **sepulchre** / path **bash-nul-poison** so operators can score whether the booth is **sepulchre** or already **living**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Control characters that cannot survive the request path are stripped or escaped before the body is built
2. Or the tool result is rejected at capture time with a clear error
3. Bash tool output should have an equivalent check to the Read tool binary detection
4. A 4 KB result containing NUL characters must not be accepted with `is_error: false`
5. Sessions must be recoverable; sanitise where the request body is built so replayed transcripts resume

## Why not a clone

This is specifically: **BASH RESULT WITH NUL BYTES → NEXT REQUEST BODY TRUNCATED → PERMANENT 400 UNEXPECTED END OF DATA → SESSION DEAD FOREVER.**

Novel paradigm: stone sepulchre / burial vault / ossuary niche / limestone lintel / extinguished lamp — limestone, soot, amber, vault, iron, bone. New issue, new paradigm (bash-nul-poison), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Sneck/#94052** (chip dismiss ephemeral). Different defect. NOT Northern cottage / brass sneck-latch. Do not reuse cleared / sneck / chip-dismiss-ephemeral.

**NOT Drawbridge/#94049** (RC bridge auto-update drop). Different defect. NOT castle gatehouse / portcullis / bailey. Do not reuse spanned / drawbridge / rc-bridge-update-drop.

**NOT Chirograph/#94045** (recorded branch never refreshed after `git branch -m`). Different defect. NOT medieval lectern / indenture. Do not reuse matched / chirograph / worktree-rename-stale.

**NOT Titulus/#94025** (iOS rename vs desktop sidebar / resume-stale-title). Different defect. NOT Roman marble plaque. Do not reuse inscribed / titulus.

**NOT Derelict/#93996** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict.

**NOT Vestry/#94008** (Linux bwrap placeholder mount cleanup is per-process). Different defect. NOT liturgical sacristy. Do not reuse pegged / vestry.

**NOT Surfeit/#94012** (workflow keeps spawning after terminal session-limit). Different defect.

**NOT Phosphene/#94003** (WindowServer CA layer-tree thrash). Different defect.

**NOT Parablepsis / Demesne / Cartouche.** Different defects.

**NOT Nullarbor/#93595** (empty-expand path — different defect). Do not reuse nullarbor.

**NOT Sigil** (hollow thinking seal). Different paradigm.

Live: https://hermes-playground-green.vercel.app/sepulchre/

```
node --test projects/sepulchre/sepulchre.test.mjs
node projects/sepulchre/sepulchre.mjs projects/sepulchre/data/sepulchre.json
```
