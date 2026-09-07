# Imprimatur

A **censor's imprimatur / nihil-obstat stamp desk** — crimson wax seal, parchment blotter, ink-black desk, brass stamp handle, Skip-mode free-pass ticket vs Auto classifier path, first-publish gate ledger; Playfair Display + DM Sans + Fira Code — for a real Claude Code defect: **COWORK DESKTOP (WINDOWS) FIRST ARTIFACT PUBLISH FAILS IN "SKIP ALL APPROVALS" BECAUSE IT STILL DEMANDS AN APPROVAL CARD THAT NEVER RENDERS; "AUTOMATICALLY APPROVE" WORKS.** When Skip is treated like Auto at the Artifact publish gate (or the gate is documented/routed), the folio is **imprinted**.

Primary:

- [anthropics/claude-code#92740](https://github.com/anthropics/claude-code/issues/92740) (OPEN, bug, has repro, platform:windows, area:cowork, area:permissions). Title: `[BUG] Cowork Desktop (Windows): first Artifact publish fails in "Skip all approvals" mode because it still demands an approval card; "Automatically approve" works`. Filed 2026-09-07T21:55:35Z.

08:50 imprimatur: a censor's imprimatur / nihil-obstat stamp desk that should waive the stamp under Skip all approvals but instead refuses the first Artifact publish — demands an approval card that never appears; Automatically approve works; gate recognises only Auto (#92740). Score refused or admit imprinted.

Idle word: **waived** (HOLD: Skip all approvals would cover the built-in Artifact tool; no first-publish refusal). Seeded state: **refused** / #92740. Admit word: **imprinted**. Never idle as clear, bricked, unrung, porous, slipped, severed, misrouted, adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled, unanswered, stripped, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, ambered. Never seeded as ambered, bynamed, crenelled, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole, packed, roused, sighted, argbound.

**Imprimatur** = a censor's stamp of permission. Skip all approvals should waive that stamp for the built-in Artifact tool. The desk still refuses the first publish and asks for a card that never arrives.

- **waived** = IDLE: HOLD; Skip would cover Artifact; no first-publish refusal
- **refused** = seeded word / #92740 path: first publish under Skip all approvals fails immediately, demanding an approval card that is never rendered
- **imprinted** = admit hold: Skip treated like Auto at the Artifact publish gate, or the gate is documented/routed
- **skip-refuses** = Skip all approvals; first publish of a new Artifact fails immediately; 100% repro
- **auto-succeeds** = Automatically approve on the same account/machine/build publishes normally
- **no-card-rendered** = no approval card is ever rendered; tool refuses at once (does not wait)
- **first-publish-gate** = first publish needs the approval card; regression after 19 August 2026 live-artifacts migration; old `mcp__cowork__update_artifact` could be auto-approved
- **noninteractive-self-report** = session reported itself as non-interactive (OAuth cannot run) while user was typing
- **cousins** = cite-only #88997, #89967, #91883 (cloud routines Artifact permission gate family)
- **has-clear-repro** = issue labeled has repro

Verdicts: waived, refused, imprinted, skip-refuses, auto-succeeds, no-card-rendered, first-publish-gate, noninteractive-self-report, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a Skip-mode first Artifact publish would leave the folio **refused** or already **imprinted**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): Artifact publish gate only recognises Auto mode / a wired approval channel; Skip leaves no card responder so the first-publish gate refuses immediately. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92740](https://github.com/anthropics/claude-code/issues/92740)
- Cousins cite-only (NOT primary): #88997, #89967, #91883 (cloud routines Artifact permission gate family)

What happened (from the issue body — do not invent):

- Claude Desktop 1.46388.4 (Cowork, MSIX Claude_pzs8sxrjxfjjc), Windows 11 Pro build 26100 x64; filed 2026-09-07T21:55:35Z; labels bug, has repro, platform:windows, area:cowork, area:permissions; OPEN
- With approval mode "Skip all approvals", the first publish of a new Artifact fails immediately with: `The first publish to an Artifact from this Cowork session needs the approval card, and no one can answer it in this session. Do not retry the publish in this session.`
- No approval card is ever rendered. Tool refuses at once (does not wait). 100% repro across sessions/artifacts.
- Same account/machine/build with "Automatically approve" publishes normally.
- Session also reported itself as non-interactive (OAuth cannot run) while user was typing — suggests no approval channel under Skip.
- Regression: yes — worked before 19 August 2026 live-artifacts migration; old `mcp__cowork__update_artifact` could be auto-approved.
- Expected: Skip all approvals covers the built-in Artifact tool like everything else (docs: "Get started with Claude Cowork" — nothing is checked; no carve-out). Or the error should name the remedy (switch to Automatically approve).

Problem found: COWORK DESKTOP FIRST-PUBLISH ARTIFACT GATE REFUSES UNDER SKIP ALL APPROVALS; NO CARD RENDERED; AUTO WORKS.

Why this solution: a diagnostic scorer for the waived → refused / imprinted folio chain, so a reader can pin idle waived, seed refused (#92740 path), and score skip-refuses / auto-succeeds / no-card-rendered / first-publish-gate / noninteractive-self-report / cousins against the published facts.

## Why not a clone

This is specifically: **COWORK DESKTOP FIRST-PUBLISH ARTIFACT GATE REFUSES UNDER SKIP ALL APPROVALS; NO CARD RENDERED; AUTO WORKS**.

**NOT #88997** (cloud routines Artifact permission gate family — cite-only).

**NOT #89967** (cloud routines Artifact permission gate family — cite-only).

**NOT #91883** (cloud routines Artifact permission gate family — cite-only).

**NOT Byname/#92738** (Desktop slash false-negative on a bare plugin-skill byname — already shipped). Do not touch Byname.

**NOT Crenel/#92729** (empty-object `resources:{}` capability treated as absent — already shipped). Do not touch Crenel.

Different paradigm: **COWORK DESKTOP FIRST-PUBLISH ARTIFACT GATE REFUSES UNDER SKIP ALL APPROVALS**.

Cousins cite-only (NOT primary): #88997, #89967, #91883. Different surfaces. Do not auto-pick as thesis.

Do NOT rename this product Byname, Crenel, Quietus, Cribble, Springe, Gangway, Waybill, Snatch, Speakpipe, or Afterimage.
Do NOT reuse idle clear / bricked / unrung / porous / slipped / severed / misrouted / adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled / unanswered / stripped / quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / ambered.
Do NOT reuse seeded ambered / bynamed / crenelled / quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole / packed / roused / sighted / argbound.

Different surface: COWORK DESKTOP Skip-mode first Artifact publish vs Desktop slash false-negative byname / empty-object resources capability / SubagentStop kill path / denyWrite mid-path wildcards / plugin-native PreToolUse interactive slip / Chrome never-redial / named-spawn foreign session / cloud routines Artifact permission gate family.

Product name stays **Imprimatur**. Name/slug `imprimatur` confirmed unused in catalog.json (213 products before this ship; Byname is #213).

Different UI: censor's stamp desk / papal imprimatur folio / crimson wax seal / nihil-obstat vs refused ribbon / Skip-mode free-pass ticket vs Auto classifier path / first-publish gate ledger. Playfair Display / DM Sans / Fira Code. Deep crimson wax / parchment / ink-black / brass stamp accents. NOT Newsreader / Sora / IBM Plex Mono (Byname). NOT Ibarra Real Nova / Plus Jakarta / Geist Mono (Crenel). NOT Cardo / Public Sans / Fragment Mono (Quietus). NOT herald parchment-indigo. NOT battlement limestone.

Different verbs: Score refused, Admit imprinted, Pin idle waived, Seed refused, Reset to waived, Load fixtures, Stamp the Skip ticket, Classify Auto.

Different idle: **waived**. Different seeded: **refused**. HOLD: **waived** / **imprinted**. ALARM: **refused** / **skip-refuses** / **auto-succeeds** / **no-card-rendered** / **first-publish-gate** / **noninteractive-self-report** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/imprimatur/hook/imprimatur.test.mjs
node projects/imprimatur/hook/imprimatur.mjs projects/imprimatur/data/92740.json
node projects/imprimatur/hook/imprimatur.mjs projects/imprimatur/data/waived.json
echo '{"seed":"refused","refused":true}' | node projects/imprimatur/hook/index.mjs
```

Open the living card at `projects/imprimatur/index.html` (or the live path `/imprimatur/`). Buttons: Score refused, Admit imprinted, Pin idle waived, Seed refused, Load fixtures, Reset to waived. Stamp the Skip ticket. Classify Auto. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/imprimatur/
- Subdomain: https://imprimatur.hermes-playground-green.vercel.app
- Folder: `projects/imprimatur/`
