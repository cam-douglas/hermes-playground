# Vizard

A **vizard / half-mask / masque-ball / looking-glass booth** — a *vizard* is a historical Elizabethan face-mask worn to hold an assumed identity. The session model should stay **pledged**; instead backgrounding Remote Control mobile resets it to Opus 4.8 — the mask slips. Fonts **Lora** (display) + **Public Sans** (UI) + **IBM Plex Mono** (mono). Palette: velvet `#2A1830`, gilt `#C9A227`, parchment `#F4E8D0`, ink `#1A1220`, rouge `#8B2942`, looking-glass silver `#C5CBD3`. Fresh trio. Completely different UI/UX/metaphor — gilt-edge vizard / half-mask / masque-ball / velvet ribbon / dressing-table looking-glass. NOT Treacle confectionery booth. NOT Somnus sleep clinic. NOT Cresset keep-awake hold. NOT Dictabelt voice fragments. NOT Lemure household shrine. NOT Cancellans binder. NOT Arras tapestry. NOT Frangible / Nameplate / Matryoshka. NOT Changeling cradle-swap (reconnect reinjects global default — DIFFERENT).

The looking-glass should stay **pledged** (HOLD: session model choice survives lifecycle). Instead the booth was **vizard** after a **background-reset**.

Primary:

- [anthropics/claude-code#94398](https://github.com/anthropics/claude-code/issues/94398) (OPEN). Title: `[BUG] Remote Control (mobile): backgrounding the app resets a running session's model to Opus 4.8`. Labels: bug, has repro, platform:macos, area:model, platform:ios. Environment: Claude mobile app (iOS); Host Claude desktop 1.52386.6 on macOS 26.6.2 (Mac17,9); Claude Code CLI 2.1.266. A model chosen for an existing session in the mobile app does not survive backgrounding. Background the app, reopen it, model indicator reads Opus 4.8 again. Reproduced repeatedly across several sessions on 2026-09-14; every time, not intermittent. Same reset later observed on desktop too. Stay off Treacle/Somnus/Cresset/Dictabelt/Lemure/Cancellans/Arras/Frangible paradigms.

06:50 vizard: an elizabethan vizard / half-mask / masque-ball / looking-glass booth for #94398. Remote Control (mobile): a model chosen on an existing session does not survive backgrounding — reopen and the indicator reads Opus 4.8 again (every time). Idle **pledged** / seeded **vizard** / path **background-reset**. Score vizard or admit pledged.

Score vizard or admit pledged.

Idle word: **pledged** (HOLD: session model choice survives lifecycle). HOLD aliases: held, chosen, sticky-model, retained, masked-true. Seeded word: **vizard** / #94398 (the background-reset path). Path word: **background-reset**. Product score: **vizard**. Never idle brisk / cadence / released / verbatim / quiet / intact or seeded treacle / somnus / cresset / dictabelt / lemure or path streaming-stall / device-absent / hold-leak / segment-drop / orphan-tick.

Phrase: **Score vizard or admit pledged.**

- **pledged** = IDLE HOLD: session model choice survives lifecycle
- **vizard** = seeded path / product score: backgrounding Remote Control mobile resets the indicator to Opus 4.8
- **background-reset** = path word
- **held** = HOLD alias: the chosen face stays held
- **chosen** = HOLD alias: the model chosen for this session stays
- **sticky-model** = HOLD alias: the chip stays on the pledged model
- **retained** = HOLD alias: the session record keeps the choice
- **masked-true** = HOLD alias: the vizard stays on the pledged face
- **opus-fallback** = model indicator reads Opus 4.8 after reopen
- **existing-session** = session already running; not a spawn-time chip miss
- **explicit-choice** = model selected explicitly for this session
- **no-turn-in-flight** = no turn between the correct state and the wrong one
- **background-foreground** = only event is the app going to background and coming back
- **every-time** = reproduced repeatedly across several sessions on 2026-09-14; not intermittent
- **desktop-too** = same reset later observed on the desktop app as well
- **ios-mobile** = Claude mobile app (iOS) with a macOS host
- **landing** = vizard / half-mask / masque-ball / looking-glass
- **has-repro** = published shape: desktop 1.52386.6 · CLI 2.1.266 · iOS · macOS 26.6.2
- **cousins** = cite-only #89358 #90670 — do not rebuild; do not conflate
- **backups** = cite-only #94397 #94396 #94393 #94392 #86198 #94417 #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = pledged desk / background-reset desk / opus-fallback chip
- **walk** = published idle pledged → background-reset → vizard
- **closed** = #94398 remains OPEN — cite only; not this booth

Verdicts: pledged, vizard, background-reset, held, chosen, sticky-model, retained, masked-true, opus-fallback, existing-session, explicit-choice, no-turn-in-flight, background-foreground, every-time, desktop-too, ios-mobile, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **vizard** or already **pledged**. Fixtures use the issue's published incident only. Lifecycle rows reconstructed from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): session model field is not rehydrated from durable session record on foreground; UI falls back to Opus 4.8 default. Invite verify against #94398 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94398](https://github.com/anthropics/claude-code/issues/94398)
- Cousins: do NOT rebuild / do NOT conflate: #89358 (pinned model overridden mid-session by a conservative switch on Linux), #90670 (new-session model chip ignored at spawn so the spawned session starts on the host default). None of them is a background→foreground reset on an already-running session.
- Changeling/#93757: cite only — reconnect reinjects the global default. DIFFERENT path from this background lifecycle reset to Opus 4.8.
- Backups (data only; next focus only — do not auto-pick): #94397, #94396, #94393, #94392, #86198, #94417, #93924, #93770, #93777, #94151

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:model, platform:ios
- Environment: Claude mobile app (iOS); Host Claude desktop 1.52386.6 on macOS 26.6.2 (Mac17,9); Claude Code CLI 2.1.266
- A model chosen for an existing session in the mobile app does not survive backgrounding
- Background the app, reopen it, and the session's model indicator reads Opus 4.8 again
- Reproduced repeatedly across several sessions on 2026-09-14; the reset happens every time, not intermittently
- The same reset behaviour has since been observed on the desktop app as well
- Steps: (1) mobile app, open existing session, select model other than Opus 4.8; (2) background app; (3) reopen — model indicator is Opus 4.8
- Expected: per-session model selection persists across app lifecycle until changed
- Session already running; model chosen explicitly; no turn in flight; only event is background→foreground
- No instrumented evidence: the session record stores a single `model` field and it was not sampled before and after backgrounding; filed on repeated user-visible reproduction

Problem found: BACKGROUND-RESET — a model chosen on an existing Remote Control mobile session does not survive backgrounding; reopen and the indicator reads Opus 4.8 again, every time.

Why Vizard: A *vizard* is a historical face-mask worn to hold an assumed identity. The session model should stay pledged across the looking-glass. Instead backgrounding slips the gilt-edge vizard and the chip reads Opus 4.8. #89358 is a pinned model overridden mid-session by a conservative switch (Linux) — DIFFERENT. #90670 is a new-session model chip ignored at spawn — DIFFERENT. Changeling/#93757 is a reconnect reinjection of the global default — DIFFERENT. This booth is specifically **Remote Control mobile background lifecycle reset to Opus 4.8**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores background-reset honesty (pledged vs vizard) so operators can see the lifecycle slip without needing Claude mobile. Not a Claude Code patch.

Why not a leftover millimetre-slider / woodworking leftover: this booth is a dressing-table looking-glass, not a slider or a workshop bench.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The per-session model selection persists across app lifecycle transitions until it is changed
2. Backgrounding and reopening the mobile app leaves the model indicator on the chosen model
3. An existing running session does not fall back to Opus 4.8 with no turn in flight
4. The same hold applies when the same reset is observed on desktop

## Why not a clone

This is specifically: **REMOTE CONTROL (MOBILE): A MODEL CHOSEN ON AN EXISTING SESSION DOES NOT SURVIVE BACKGROUNDING — REOPEN AND THE INDICATOR READS OPUS 4.8 AGAIN (EVERY TIME). DESKTOP 1.52386.6 / CLI 2.1.266; IOS MOBILE; MACOS 26.6.2 (MAC17,9); 2026-09-14; SAME RESET LATER OBSERVED ON DESKTOP TOO.**

Novel paradigm: Elizabethan vizard / half-mask / masque-ball / gilt-edge vizard / velvet ribbon / dressing-table looking-glass — velvet, gilt, parchment, ink, rouge, looking-glass silver. New issue, new paradigm (background-reset), new UI/UX/fonts/colors, new scoring vocabulary. A masque-ball dressing-table, not a confectionery booth, sleep clinic, night-wall inhibitor, voice recorder, household shrine, binder folio, or theater tapestry.

A 2026-09-10 catalog booth also used the slug `vizard` for #93190 (Desktop `/plan` precedence). This ship remasks the live `/vizard/` booth for #94398. The older #93190 card stays listed as historical catalog memory; do not conflate slash-plan precedence with this background lifecycle reset.

**NOT #89358** (pinned model overridden mid-session by a conservative switch, Linux). Different trigger. Cite only. Do not rebuild.

**NOT #90670** (new-session model chip ignored at spawn). Different trigger. Session here is already running. Do not rebuild. Do not conflate.

**NOT Changeling/#93757** (remote reconnect re-injects the global default). Different path: reconnect reinjection, not background lifecycle reset to Opus 4.8. Cite only.

**NOT Treacle/#94344** (Windows PowerShell first-call streaming-stall). Different defect. Do not reuse brisk / Treacle / streaming-stall.

**NOT Somnus/#94415** (Cowork cloud schedule `device_absent`). Different defect. Do not reuse cadence / Somnus / device-absent.

**NOT Cresset/#94420** (keep-awake hold-leak). Different defect. Do not reuse released / Cresset / hold-leak.

**NOT Dictabelt/#94406** (voice-dictation fragment path). Different defect. Do not reuse verbatim / Dictabelt / segment-drop.

**NOT Lemure/#94410** (orphan dispatcher ticks). Different defect. NOT household shrine. Do not reuse quiet / Lemure / orphan-tick.

**NOT Cancellans/#94400** (deferred-delta). Different defect. NOT binder folio. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Frangible/#94362** (chmod-failopen). Different defect. Do not reuse Frangible / chmod-failopen as the product.

**NOT Nameplate/#94349** (header-rename). Different defect. Do not reuse affixed / Nameplate / header-rename.

**NOT Matryoshka/#94350** (subst-nest). Different defect. Do not reuse unpacked / Matryoshka / subst-nest.

**NOT #94336.** Do not pick.

Live: https://hermes-playground-green.vercel.app/vizard/

```
node --test projects/vizard/vizard.test.mjs
node projects/vizard/vizard.mjs projects/vizard/data/vizard.json
```
