# Bolter

A **flour-mill bolting-cloth** atelier — millstone mesh plaque, flagless-pass vs option-token-snag dial, bare `--` catch lamp, `rm -rf` asymmetry callout, dontAsk equal-breadth strip; flour-dust cream / millstone grey / iron-oxide rust — Piazzolla + Nunito + Roboto Mono — for a real Claude Code defect: **DONTASK + EQUAL-BREADTH BASH(CP:*)/(MV:*) REFUSE ANY OPTION TOKEN INCL BARE -- WHILE BARE FORMS AND RM -RF RUN; MATCHER ARTIFACT NOT SAFETY POLICY; AREA:BASH+PERMISSIONS.**

Primary:

- [anthropics/claude-code#91422](https://github.com/anthropics/claude-code/issues/91422) (OPEN, bug, has repro, area:bash, area:permissions, filed 2026-09-02T07:28:49Z, updated 2026-09-02T07:29:54Z). Title: `--permission-mode dontAsk`: `cp`/`mv` refuse any option token (including bare `--`) while the flagless form runs; `rm` is unaffected. Reporter alfalcon90. Measured on Claude Code 2.1.251, run E.

a bolter that catches every option token — even bare -- — while rm -rf slips the same mesh is not a safety policy; it is a snagged matcher. Score the cloth or admit the allow-rule already lied.

Idle word: **unbolted**. Seeded state: **snagged** / #91422 — any option token on cp/mv refused; rm -rf unaffected; matcher artifact. Never idle as creased / bled / latched / vanished / sealed / rebound / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed / reeved / fouled.

A **bolter** is the mill cloth that should sift under a **fair mesh**: with `--permission-mode dontAsk` and equal-breadth Bash allow rules (`Bash(cp:*)`, `Bash(mv:*)`, `Bash(rm:*)`), flagged and flagless forms of each should pass or fail together. Instead the matcher **snags every option token** on `cp`/`mv` — including inert bare POSIX `--` — while their flagless forms run, and `rm -f` / `rm -rf` (far more destructive) slip the identical mesh. This is a matcher artifact, not a considered safety policy. Project guidance that requires force flags on `cp`/`mv` (shell aliases to `-i` hang noninteractive agents) becomes unfollowable under dontAsk.

- **snagged** = #91422: any option token on cp/mv refused; rm -rf unaffected; matcher artifact
- **dontask** = `--permission-mode dontAsk`
- **option-token** = REFUSED: `cp -f`, `cp -v`, `cp --`, `mv -v`
- **bare-end-of-options** = `cp --` is POSIX end-of-options with no force semantics — refusing it proves this is not a deliberate force-flag gate
- **flagless-runs** = bare `cp` RAN; bare `mv` RAN
- **rm-rf-slips** = `rm -f` RAN; `rm -rf` RAN under identical `Bash(rm:*)` — a real force/destructive policy would refuse `rm` first
- **equal-breadth** = `Bash(cp:*)`, `Bash(mv:*)`, `Bash(rm:*)` at the same breadth
- **matcher-artifact** = not a considered safety policy — the matcher snags every option token on cp/mv including inert bare POSIX `--`
- **force-flag-unfollowable** = agent guidance to always pass force flags on cp/mv (avoid `-i` alias hang) is unfollowable; teams wrote flagless-form exemptions
- **not-path-class** = `cp -f` with relative paths still REFUSED (not absolute-vs-relative)
- **deterministic** = repeated arms in one session still REFUSED (not a race)
- **has-clear-repro** = alfalcon90 filed #91422; has repro; area:bash; area:permissions; Claude Code 2.1.251; run E
- **hold** = flagged cp/mv including `cp --` pass the allow-rule mesh under dontAsk
- **unbolted** = HOLD: flagged cp/mv including `cp --` pass the allow-rule mesh under dontAsk

Verdicts: unbolted, snagged, dontask, option-token, bare-end-of-options, flagless-runs, rm-rf-slips, equal-breadth, matcher-artifact, force-flag-unfollowable, not-path-class, deterministic, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the cloth is unbolted or snagged.

Hypothesis only (NON-BINDING): dontAsk matcher may classify any token after `cp`/`mv` as a gated option, including bare `--`, while `rm` uses a different code path. Do not claim source you have not seen beyond the issue's measured repro.

## Why not a clone

This is specifically: **DONTASK + EQUAL-BREADTH BASH(CP:*)/(MV:*) REFUSE ANY OPTION TOKEN INCL BARE -- WHILE BARE FORMS AND RM -RF RUN; MATCHER ARTIFACT NOT SAFETY POLICY; AREA:BASH+PERMISSIONS.**

NOT **Deadeye** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — relative PreToolUse Bash hook path × drifted cwd → permanent Bash deadlock.
NOT **Reglet** ([#91443](https://github.com/anthropics/claude-code/issues/91443)) — CRLF / empty-index stageCheckout before `.gitattributes`.
NOT **Reliquary** ([#91433](https://github.com/anthropics/claude-code/issues/91433)) — aarch64 O_* EINVAL session vanish / data-loss — cite as stay-off.
NOT **Annunciator** ([#91419](https://github.com/anthropics/claude-code/issues/91419)) — StopFailure false alarms on parent — loud polarity — cite as stay-off.
NOT **Caisson** ([#91405](https://github.com/anthropics/claude-code/issues/91405)) — worktree pool wrong rebind + dirty wipe — cite as stay-off.
NOT **Spindle** ([#91402](https://github.com/anthropics/claude-code/issues/91402)) — startup cleanup deletes live sibling Bash outputs — cite as stay-off.
NOT **Knell** ([#91298](https://github.com/anthropics/claude-code/issues/91298)) — Agent-tool silent child death.
NOT **Tumbler**.
NOT **Escapement**.
NOT **Geneva** / **Scotch** / **Carillon** / **Pintle** / **Fibula**.
NOT **Virgule** / **Riddle** / **Garner** / **Postern** / **Sluice**.
NOT **Reveille** / standing-rigging deadeye metaphors.
NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / berth clones / letterpress galley Reglet UI.
NOT **Toggle** — this hour ships **Bolter**.

Cousins are cite-only on a cousin strip; primary stays #91422.

- [#74567](https://github.com/anthropics/claude-code/issues/74567) — open — dontAsk denies Write/Edit regardless of allow rules.
- [#76867](https://github.com/anthropics/claude-code/issues/76867) — open — dontAsk denied tool still reports success.
- [#76490](https://github.com/anthropics/claude-code/issues/76490) — open — Bash allow-list fails Windows drive-letter paths; defaultMode dontAsk.
- [#91479](https://github.com/anthropics/claude-code/issues/91479) — open — blockReadsOutsideWorkingDirectories prompts for allowlisted gh; flag values misidentified as paths.

Related mentions inside #91422 (cite only, not primaries): #16449 quoted arguments starting with `-` misparsed; #30519 permission matching megathread.

Backups (do not ship unless primary blocked): **Clepsydra** / #91414 — MCP HTTP subscriptions/listen first-turn freeze. **Skipjack** / #91480 — auto-update skipped with --effort max. **Platen** / #91438 — detached window preview click no-op.

Product name stays **Bolter**. Do not rename to Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Carillon, Sluice, Alidade, Cockade, Lye, Clew, Hasp, Berth, Bollard, Reveille, Callboard.

Different UI: flour-mill bolting-cloth / millstone mesh plaque + flagless-pass vs option-token-snag dial + bare `--` catch lamp + `rm -rf` asymmetry callout + dontAsk equal-breadth strip / flour-dust cream / millstone grey / iron-oxide rust. Piazzolla + Nunito + Roboto Mono. NOT Literata/Red Hat Text/Red Hat Mono (Deadeye). NOT EB Garamond/Hanken Grotesk/Noto Sans Mono (Reglet). Stay OFF deadeye standing-rigging / reglet letterpress / reliquary vault-latch / annunciator lamps / caisson berth / spindle chip-sweep / knell mute-bell / tumbler keyway / escapement pallet / carillon peal / sluice millrace / reveille muster.

Different verbs: Bolt the cloth, pin idle unbolted, pin seeded snagged, admit the allow-rule already lied, load fixtures, reset to unbolted. Not "Score the reeve/strip/latch/seal/purge/mute/keyway/pallet/cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race". Score the cloth is this desk's phrase.

Different idle: **unbolted**.

## Live catalog path

`/bolter/` is this static flour-mill bolting-cloth atelier desk. Path `https://hermes-playground-green.vercel.app/bolter/` and subdomain `https://bolter.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `21:50 / hermes catalog #122 / #91422`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **unbolted** — flagged cp/mv including `cp --` pass the allow-rule mesh under dontAsk.
2. Seed **snagged** → #91422: any option token on cp/mv refused; rm -rf unaffected; matcher artifact; force-flag guidance unfollowable.
3. Atelier UI: millstone mesh plaque / flagless-pass vs option-token-snag dial / bare `--` catch lamp / `rm -rf` asymmetry callout / dontAsk equal-breadth strip. Unbolted = fair mesh. Snagged = option tokens catch; rm -rf slips.
4. Cousin cite strip labeled cousin-not-primary: [#74567](https://github.com/anthropics/claude-code/issues/74567) / [#76867](https://github.com/anthropics/claude-code/issues/76867) / [#76490](https://github.com/anthropics/claude-code/issues/76490) / [#91479](https://github.com/anthropics/claude-code/issues/91479). Cite only. Primary stays #91422.
5. **Bolt the cloth** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/bolter/index.html` in a browser, or serve the repo root and visit `/bolter/` (Vercel rewrite → `/projects/bolter`). No build step. Optional hook:

```bash
node projects/bolter/hook/bolter.mjs projects/bolter/data/91422.json
node --test projects/bolter/hook/bolter.test.mjs
```

Empty stdin scores the idle **unbolted** ticket. Paste a probe on the page or drop a fixture from `data/`.
