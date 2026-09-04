# Frisket

A **print-shop / frisket-resist scoring desk** — paper press, frisket mask strip, Pre vs Post hook timeline, canary lamp (deny-computed vs write-landed), plate bleed gauge, macOS/Linux contrast plaque; cream paper / ink black / vermilion resist / soft graphite / plate gray / mask edge — Libre Baskerville + Karla + IBM Plex Mono — for a real Claude Code defect: **PRETOOLUSE HOOK ON WRITE/EDIT/MULTIEDIT/NOTEBOOKEDIT IS NOT ENFORCED (POSTTOOLUSE ON SAME MATCHER FIRES RELIABLY); AREA:HOOKS; PLATFORM:MACOS.**

Primary:

- [anthropics/claude-code#91574](https://github.com/anthropics/claude-code/issues/91574) (OPEN, bug, has repro, platform:macos, area:hooks, filed 2026-09-02T18:56:28Z, updated 2026-09-03T20:42:25Z). Title: `PreToolUse hook on Write/Edit/MultiEdit/NotebookEdit is not enforced (PostToolUse on same matcher fires reliably)`. Reporter technoashu. Claude Code 2.1.245 on macOS Darwin 25.3.0. Commenter yurukusa on Linux/WSL 2.1.258 could NOT reproduce.

a frisket that never seats before the press is not a resist — it is a bleed already printed. Score the mask or admit the plate already bled.

Idle word: **masked**. Seeded state: **bled** / #91574 — sync PreToolUse on `Write|Edit|MultiEdit|NotebookEdit` returns `permissionDecision` deny (canary proves deny computed) but the write still completes; PostToolUse on the identical matcher fires every time; `--debug hooks` shows PostToolUse registering/firing and PreToolUse never appearing. Never idle as sounded / muted / slipped / fouled / verbatim / mangled / moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

A **frisket** is the paper mask that seats before the press so ink cannot reach reserved areas. PreToolUse is the frisket; if it never seats, the plate bleeds.

- **bled** = #91574: PreToolUse deny returned or never invoked; Write still completes; PostToolUse fires
- **pre-skipped** = PreToolUse never invoked; Write completed; `--debug hooks` shows no Pre registration
- **deny-ignored** = PreToolUse invoked and returned deny; Write still completed
- **post-fired** = PostToolUse on the identical matcher fires after the write lands
- **canary-deny** = canary captured `DENY` but the write landed
- **macos-only** = CLI 2.1.245 on macOS Darwin 25.3.0; Linux/WSL 2.1.258 commenter could not reproduce
- **linux-hold** = commenter pattern: Pre fired; deny held; file not created; Post did not fire
- **bypass-mode** = reproduced under `--permission-mode bypassPermissions` and under normal permission mode
- **hold** = PreToolUse deny seats before Write; the mask seats
- **masked** = HOLD: PreToolUse deny seats before Write; file not created; PostToolUse does not fire

Verdicts: masked, bled, pre-skipped, deny-ignored, post-fired, canary-deny, macos-only, linux-hold, bypass-mode, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the frisket masked or the plate already bled.

Hypothesis only (NON-BINDING): PreToolUse matcher for Write-family may fail to register on macOS paths while PostToolUse on the same matcher registers; or deny decision ignored between 2.1.245–2.1.258. Discard if issue evidence disagrees. Encoded from the issue's canary, debug-hooks omission, and Linux comment. Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **PRETOOLUSE HOOK ON WRITE/EDIT/MULTIEDIT/NOTEBOOKEDIT IS NOT ENFORCED (POSTTOOLUSE ON SAME MATCHER FIRES RELIABLY); AREA:HOOKS; PLATFORM:MACOS.**

NOT Tangent ([#92021](https://github.com/anthropics/claude-code/issues/92021)) — WezTerm CSI-u shifted-field parse.
NOT Hawser ([#91578](https://github.com/anthropics/claude-code/issues/91578)) — Windows idle warm MCP unreaped children.
NOT Caret ([#91526](https://github.com/anthropics/claude-code/issues/91526)) — npx cmd.exe argv reparse.
NOT Buoy / Solecism / Coffer / Codicil / Crimp / Jackfield / Tocsin / Bolter / Deadeye / Reglet / Reliquary / Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Pintle paradigms.
NOT leftover clavichord tangent / dockyard hawser / proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging.

Different surface: hooks Pre vs Post enforcement on Write-family tools (macOS 2.1.245 vs Linux/WSL 2.1.258).

Cousins are cite-only on a cousin strip; primary stays #91574.

- [#89251](https://github.com/anthropics/claude-code/issues/89251) — OPEN — Permission-mode system prompt instructs the model to edit via Bash, routing writes around PreToolUse on Write|Edit|NotebookEdit (security/hooks). Cite-only.
- [#82642](https://github.com/anthropics/claude-code/issues/82642) — OPEN — PreToolUse denials discard decisionReason at transcript-write time. Cite-only.
- [#88896](https://github.com/anthropics/claude-code/issues/88896) — OPEN — PreToolUse hooks never fire on Windows (v2.1.240). Cite-only.
- [#77735](https://github.com/anthropics/claude-code/issues/77735) — OPEN — PreToolUse not invoked for schema-invalid edits to `.claude/settings.json`. Cite-only.

Product name stays **Frisket**. Do not rename to Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle. Do not reuse quoin.

Different UI: paper press desk + frisket mask strip + Pre vs Post hook timeline + canary lamp + plate bleed gauge + macOS/Linux contrast plaque / cream paper / ink black / vermilion resist / plate gray. Libre Baskerville + Karla + IBM Plex Mono. NOT Instrument Serif/Albert Sans/Spline Sans Mono (Tangent). NOT Playfair/DM Sans/Fragment Mono (Caret). NOT Petrona/Sora/Fira (Buoy). Stay OFF clavichord keycaps / hawser bitts / proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell.

Different verbs: Score the mask, pin idle masked, pin seeded bled, admit the plate already bled, load fixtures, reset to masked. Score the mask is this desk's phrase.

Different idle: **masked**.

## Live catalog path

`/frisket/` is this static print-shop desk. Path `https://hermes-playground-green.vercel.app/frisket/` and subdomain `https://frisket.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `19:50 / hermes catalog #133 / #91574`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **masked** — PreToolUse deny seats before Write; file not created; PostToolUse does not fire.
2. Seed **bled** → #91574: PreToolUse deny returned or never invoked; Write still completes; PostToolUse fires; canary `DENY`; `--debug hooks` Post registers, Pre never appears.
3. Atelier UI: frisket mask strip / Pre vs Post timeline / canary lamp / plate bleed gauge / macOS/Linux contrast plaque. Masked = frisket seated. Bled = deny computed or Pre skipped; the plate already printed.
4. Cousin cite strip labeled cousin-not-primary: [#89251](https://github.com/anthropics/claude-code/issues/89251), [#82642](https://github.com/anthropics/claude-code/issues/82642), [#88896](https://github.com/anthropics/claude-code/issues/88896), [#77735](https://github.com/anthropics/claude-code/issues/77735). Cite only. Primary stays #91574.
5. **Score the mask** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/frisket/index.html` in a browser, or serve the repo root and visit `/frisket/` (Vercel rewrite → `/projects/frisket`). No build step. Optional hook:

```bash
node projects/frisket/hook/frisket.mjs projects/frisket/data/91574.json
node --test projects/frisket/hook/frisket.test.mjs
```

Empty stdin scores the idle **masked** ticket. Paste a probe on the page or drop a fixture from `data/`.
