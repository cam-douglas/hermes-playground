# Placet

A **congregation chamber / placet desk** — assent ballot strip (Accept vs Accept-and-implement as two distinct seals), scope ledger (plan-assent column vs implementation-fiat column), tool-result parchment, chamber lamp (withheld green/hold vs enacted amber/breach), Manual-mode plaque; parchment ivory / ink sepia / assent teal / fiat vermilion-copper — Spectral + Figtree + JetBrains Mono — for a real Claude Code defect: **EXITPLANMODE CONSENT-SCOPE MISMATCH (ACCEPT VS ACCEPT-AND-IMPLEMENT); AREA:CORE + AREA:PERMISSIONS; PLATFORM:MACOS.**

Primary:

- [anthropics/claude-code#92040](https://github.com/anthropics/claude-code/issues/92040) (OPEN, bug, has repro, platform:macos, area:core, area:permissions, filed 2026-09-04T09:55:26Z, updated 2026-09-04T09:56:32Z). Title: `ExitPlanMode: plain "Accept" tells the model "You can now start coding", authorising implementation the user declined`. Reporter renelaerke. Claude Desktop Code tab, `claude-opus-5`, macOS Darwin 25.6.0, Apple Silicon. Session permission mode **Manual**. Observed 2026-09-04. Bundle version not surfaced.

a placet that stamps coding when the chamber only assented to the plan is not assent — it is a fiat already enacted. Score the chamber or admit implementation already started.

Idle word: **withheld**. Seeded state: **enacted** / #92040 — plain Accept still returns `You can now start coding` plus `You have exited plan mode. You can now make edits, run tools, and take actions`. Never idle as masked / bled / sounded / muted / slipped / fouled / verbatim / mangled / moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

A **placet** is the formal university/congregation vote: *it pleases* / approved. The chamber can assent to a plan without authorising implementation. A placet that stamps coding on the narrow seal is not assent — it is a fiat already enacted.

- **enacted** = #92040: plain Accept still returns start-coding + exited-plan-mode make-edits language
- **accept-narrow** = user pressed Accept, not Accept and start implementing, and the tool result still authorised implementation
- **accept-and-implement** = the broader seal was the chosen fiat (distinct from the narrow-Accept defect)
- **start-coding-language** = tool result contains `You can now start coding`
- **exited-plan-edits** = appended block says `You can now make edits, run tools, and take actions`
- **manual-mode** = session permission mode was Manual; the result text is identical regardless
- **scope-mismatch** = consent for scope A (save the plan) reported as A+B (start coding)
- **hold** = plan assented; implementation NOT authorised; the chamber holds
- **withheld** = HOLD: plan assented; implementation NOT authorised; no start-coding language; model told to wait

Verdicts: withheld, enacted, accept-narrow, accept-and-implement, start-coding-language, exited-plan-edits, manual-mode, scope-mismatch, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the chamber withheld implementation or already enacted a fiat.

Hypothesis only (NON-BINDING): ExitPlanMode tool-result template may not branch on Accept vs Accept and start implementing, so the narrow seal still emits start-coding + exited-plan make-edits language. Discard if issue evidence disagrees. Encoded from the issue's verbatim tool result, PostToolUse nudge, and Manual-mode note. Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **EXITPLANMODE CONSENT-SCOPE MISMATCH (ACCEPT VS ACCEPT-AND-IMPLEMENT).**

NOT Frisket ([#91574](https://github.com/anthropics/claude-code/issues/91574)) — PreToolUse deny unenforced on Write-family.
NOT Tangent ([#92021](https://github.com/anthropics/claude-code/issues/92021)) — WezTerm CSI-u shifted-field parse.
NOT Hawser ([#91578](https://github.com/anthropics/claude-code/issues/91578)) — Windows idle warm MCP unreaped children.
NOT Caret ([#91526](https://github.com/anthropics/claude-code/issues/91526)) — npx cmd.exe argv reparse.
NOT Buoy ([#91569](https://github.com/anthropics/claude-code/issues/91569)) — macOS window layer.
NOT Solecism / Coffer / Codicil / Crimp / Jackfield / Tocsin / Bolter / Deadeye / Reglet / Reliquary / Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Pintle paradigms.
NOT leftover print-shop frisket / clavichord tangent / dockyard hawser / proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging.

Different surface: ExitPlanMode dialog buttons vs the model-visible tool result. Consent for “save the plan” reported as “start coding”.

Cousins are cite-only on a cousin strip; primary stays #92040.

- [#74256](https://github.com/anthropics/claude-code/issues/74256) — OPEN — PermissionRequest hook allow for ExitPlanMode is ignored since v2.1.199; the plan-approval chooser still blocks. Cite-only.
- [#90685](https://github.com/anthropics/claude-code/issues/90685) — OPEN — PermissionRequest hook systemMessage is accepted and logged as success but never rendered at the ExitPlanMode approval prompt. Cite-only.

Product name stays **Placet**. Do not rename to Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle.

Different UI: congregation chamber + assent ballot strip + scope ledger + tool-result parchment + chamber lamp + Manual-mode plaque / parchment ivory / ink sepia / assent teal / fiat vermilion-copper. Spectral + Figtree + JetBrains Mono. NOT Libre Baskerville/Karla/IBM Plex Mono (Frisket). NOT Instrument Serif/Albert Sans/Spline Sans Mono (Tangent). NOT Playfair/DM Sans/Fragment Mono (Caret). NOT Petrona/Sora/Fira (Buoy). Stay OFF print-shop frisket / clavichord keycaps / hawser bitts / proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell.

Different verbs: Score the chamber, pin idle withheld, pin seeded enacted, admit implementation already started, load fixtures, reset to withheld. Score the chamber is this desk's phrase.

Different idle: **withheld**.

## Live catalog path

`/placet/` is this static congregation chamber. Path `https://hermes-playground-green.vercel.app/placet/` and subdomain `https://placet.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `20:50 / hermes catalog #134 / #92040`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **withheld** — plan assented; implementation NOT authorised; no start-coding language; model told to wait.
2. Seed **enacted** → #92040: plain Accept still returns `You can now start coding` and `You have exited plan mode. You can now make edits`; PostToolUse verification nudge; Manual mode not reflected.
3. Atelier UI: assent ballot strip / scope ledger / tool-result parchment / chamber lamp / Manual-mode plaque. Withheld = chamber holds. Enacted = the narrow seal stamped coding.
4. Cousin cite strip labeled cousin-not-primary: [#74256](https://github.com/anthropics/claude-code/issues/74256), [#90685](https://github.com/anthropics/claude-code/issues/90685). Cite only. Primary stays #92040.
5. **Score the chamber** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/placet/index.html` in a browser, or serve the repo root and visit `/placet/` (Vercel rewrite → `/projects/placet`). No build step. Optional hook:

```bash
node projects/placet/hook/placet.mjs projects/placet/data/92040.json
node --test projects/placet/hook/placet.test.mjs
```

Empty stdin scores the idle **withheld** ticket. Paste a probe on the page or drop a fixture from `data/`.
