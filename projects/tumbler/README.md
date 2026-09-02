# Tumbler

A **locksmith pin-tumbler / keyway atelier** desk — brass pin-tumbler lock, keyway, shear line, bolt, strike plate, pin stacks, plug, ward cuts; cool steel-and-brass on a dark iron ground; hairline keyway graduations; Young Serif + Figtree + Fragment Mono — for a real Claude Code defect: **PermissionRequest hook returns `allow` for `ExitPlanMode` but the decision is silently discarded so the plan-approval chooser still blocks; `updatedPermissions` dropped; deny path still works; last good 2.1.198; first broken 2.1.199; confirmed on 2.1.258.**

Primary:

- [anthropics/claude-code#74256](https://github.com/anthropics/claude-code/issues/74256) (OPEN, bug, documentation, has repro, platform:macos, area:core, area:hooks, regression, reproduced, filed 2026-07-04T18:49:46Z). Title: [BUG] PermissionRequest hook 'allow' for ExitPlanMode is ignored since v2.1.199 — plan-approval chooser still blocks. Reporter blimmer.

a tumbler that discards an allow is not a hold. Score the keyway or admit **discarded**.

Idle word: **honored**. Seeded state: **discarded** / #74256 — hook returns allow; decision silently discarded; chooser still blocks; updatedPermissions dropped. Never idle as jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / indexed / arrested / skipped.

A **tumbler** is a pin stack that should **honor** a PermissionRequest key so `ExitPlanMode` allow retracts the bolt. Instead the tumblers **accept the key** (hook fires, stdin delivered, stdout allow read) then **silently discard** the decision so the plan-approval chooser still **blocks**.

- **discarded** = #74256: hook returns allow; decision silently discarded; chooser still blocks; updatedPermissions dropped
- **chooser-blocks** = native plan-approval chooser still displayed: "Claude has written up a plan and is ready to execute. Would you like to proceed?"
- **allow-ignored** = variants ignored on 2.1.201: allow+updatedPermissions (setMode acceptEdits), bare allow, PreToolUse permissionDecision allow
- **deny-still-works** = deny path still works; deny+message round-trips; model revises and retries ExitPlanMode
- **updatedinput-workaround** = echo tool_input as decision.updatedInput skips chooser; confirmed by blimmer and jbeno on 2.1.238 and 2.1.258
- **updatedpermissions-dropped** = updatedPermissions (setMode acceptEdits) dropped; hello.txt never created; bcherny on 2.1.233
- **docs-gap** = PermissionRequest docs never mention updatedInput requirement; bare allow silently discarded with no warning to hook author
- **has-clear-repro** = blimmer filed #74256; bcherny reproduced on 2.1.233; jbeno confirmed 2.1.258; PermissionRequest ExitPlanMode; plan mode; hello.txt
- **hold** = PermissionRequest allow applied; chooser skipped; updatedPermissions take effect; plan implements; the keyway is honored
- **honored** = HOLD: PermissionRequest allow applied; chooser skipped; updatedPermissions take effect; plan implements

Verdicts: honored, discarded, chooser-blocks, allow-ignored, deny-still-works, updatedinput-workaround, updatedpermissions-dropped, docs-gap, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the keyway is honored or discarded.

Hypothesis only (NON-BINDING): since 2.1.199, PermissionRequest allow for tools whose approval card is the user interaction is discarded unless updatedInput is present; deny untouched; docs under-specify. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **PERMISSIONREQUEST HOOK RETURNS `allow` FOR `ExitPlanMode` BUT THE DECISION IS SILENTLY DISCARDED SO THE PLAN-APPROVAL CHOOSER STILL BLOCKS; `updatedPermissions` DROPPED; DENY PATH STILL WORKS; LAST GOOD 2.1.198; FIRST BROKEN 2.1.199; CONFIRMED ON 2.1.258.**

NOT **Geneva** ([#91296](https://github.com/anthropics/claude-code/issues/91296)) — settings.local.json bypassPermissions / Shift+Tab — cite as stay-off.
NOT **Carillon** ([#91250](https://github.com/anthropics/claude-code/issues/91250)) — plugin SessionStart first-wins — already shipped; Sheaf/#91250 is a clone — do not ship.
NOT **Pintle** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — PreToolUse Bash relative-path cwd deadlock.
NOT **Escapement** ([#91371](https://github.com/anthropics/claude-code/issues/91371)) — local scheduled mid-run isRunning stall → Skipped.
NOT **Scotch** ([#91324](https://github.com/anthropics/claude-code/issues/91324)) — SCM recovery Access denied.
NOT **Fibula** ([#91306](https://github.com/anthropics/claude-code/issues/91306)) — mute DISPLAY clipboard hang.
NOT **Virgule** ([#91337](https://github.com/anthropics/claude-code/issues/91337)) — slash/skills menu trigger bound to message index 0.
NOT **Riddle** ([#91327](https://github.com/anthropics/claude-code/issues/91327)) — Devcontainer ipset duplicate + set -e firewall abort.
NOT **Garner** ([#91246](https://github.com/anthropics/claude-code/issues/91246)) — Desktop archive-to-pool no TTL.
NOT **Postern** ([#91223](https://github.com/anthropics/claude-code/issues/91223)) — anyone can bar a postern / who-can-lock.
NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork Toke/File/SeAt leak.
NOT [#90685](https://github.com/anthropics/claude-code/issues/90685) — systemMessage never rendered — cite-only cousin.
NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross / escapement pallet-fork.

Cousins are cite-only on a cousin strip; primary stays #74256.

Product name stays **Tumbler**. Do not rename to Lock, Keyway, Permission, Plan, Hooks, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Escapement, Carillon.

Different UI: locksmith's bench / brass pin-tumbler lock + keyway + shear line + bolt + strike plate / pin stacks / plug / ward cuts / cool steel-and-brass / dark iron / hairline keyway graduations. Young Serif + Figtree + Fragment Mono. NOT Instrument Serif/Manrope/Azeret Mono (Escapement). NOT Bodoni/Jost/Space Mono (Geneva). NOT Spectral/Sora/IBM Plex Mono (Scotch). NOT Cormorant/Outfit/Fira (Fibula). NOT Libre Baskerville/Work Sans/JetBrains (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair (Carillon). NOT Cinzel (Postern). NOT Libre Caslon (Alidade).

Different verbs: score the keyway, pin idle honored, pin seeded discarded, admit discarded, load fixtures, reset to honored. Not "Score the pallet/cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race".

Different idle: **honored**.

## Live catalog path

`/tumbler/` is this static locksmith pin-tumbler atelier desk. Path `https://hermes-playground-green.vercel.app/tumbler/` and subdomain `https://tumbler.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `13:50 / hermes catalog #114 / #74256`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **honored** — PermissionRequest allow applied; chooser skipped; updatedPermissions take effect; plan implements.
2. Seed **discarded** → #74256: hook returns allow; decision silently discarded; chooser still blocks; updatedPermissions dropped.
3. Atelier UI: brass pin-tumbler lock / keyway / shear line / bolt / strike plate / pin stacks / plug / ward cuts. Honored = pins at the shear line, bolt retracts. Discarded = key accepted, decision discarded, bolt stays thrown.
4. Cousin cite strip labeled cousin-not-primary: [#90685](https://github.com/anthropics/claude-code/issues/90685) / [#71061](https://github.com/anthropics/claude-code/issues/71061) / [#50660](https://github.com/anthropics/claude-code/issues/50660) / [#84098](https://github.com/anthropics/claude-code/issues/84098) / [#89251](https://github.com/anthropics/claude-code/issues/89251). Cite only. Primary stays #74256.
5. **Score the keyway** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/tumbler/index.html` in a browser, or serve the repo root and visit `/tumbler/` (Vercel rewrite → `/projects/tumbler`). No build step. Optional hook:

```bash
node projects/tumbler/hook/tumbler.mjs projects/tumbler/data/74256.json
node projects/tumbler/hook/tumbler.mjs projects/tumbler/data/honored.json
node --test projects/tumbler/hook/tumbler.test.mjs
```

Discarded seed → discarded/alarm. Honored seed → honored/hold.

`projects/tumbler/hook/tumbler.mjs` classifies a probe ticket JSON `{ hookEvent, toolName, decisionBehavior, decisionDiscarded, chooserBlocks, allowApplied }` and returns `{ verdict, chips[], reasons[], honored, discarded, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/74256.json`, `data/discarded.json`, `data/honored.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts. Use PermissionRequest, ExitPlanMode, decision.behavior: "allow", chooser "Would you like to proceed?", deny still works, 2.1.198 honored, 2.1.199 first broken, updatedPermissions / setMode acceptEdits, updatedInput workaround, blimmer, bcherny, 2.1.233, 2.1.258, hello.txt, plan mode. Never invent counts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#74256](https://github.com/anthropics/claude-code/issues/74256). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Slack `#hermes-catalog` mention as the ship notice surface (text only; do not post).
3. Claude Code PermissionRequest / ExitPlanMode / plan mode as the third native surface. Paste or drop a probe ticket JSON and score it.
4. Atelier UI (locksmith's bench / brass pin-tumbler lock / keyway / shear line / bolt / strike plate / pin stacks / plug / ward cuts). Honored = pins at the shear line, discarded = key accepted and the allow discarded.
5. Cousin-not-primary cite strip: #90685, #71061, #50660, #84098, #89251.

## Sources

- [anthropics/claude-code#74256](https://github.com/anthropics/claude-code/issues/74256) OPEN — primary. Product stays Tumbler.
- `PermissionRequest` hook returning `decision.behavior: "allow"` for `ExitPlanMode` is executed (stdin delivered, stdout read) but decision discarded.
- Native plan-approval chooser still displayed: "Claude has written up a plan and is ready to execute. Would you like to proceed?"
- Blocks session until answered manually; breaks out-of-band / browser plan-approval UIs.
- Variants ignored on 2.1.201: allow+updatedPermissions (setMode acceptEdits), bare allow, PreToolUse permissionDecision allow.
- Deny path still works (deny+message round-trips; model revises and retries ExitPlanMode).
- Version bracket: 2.1.198 allow honored (chooser skipped, plan implemented); 2.1.199 and 2.1.201 allow ignored (chooser blocks).
- Reproduced programmatically against TUI and in desktop app; model-independent (Haiku 4.5 and Opus-class).
- Staff (bcherny) reproduced on v2.1.233: hook runs; chooser shows Yes auto-accept / Yes manually approve / Tell Claude what to change; hello.txt never created; updatedPermissions dropped.
- Workaround confirmed by author and by jbeno on 2.1.238 and 2.1.258: echo tool_input as decision.updatedInput skips chooser.
- Staff assessment notes: PermissionRequest docs never mention updatedInput requirement; bare allow silently discarded with no warning to hook author.
- Cousins (cite, not primaries):
  - [#90685](https://github.com/anthropics/claude-code/issues/90685) — systemMessage never rendered (cite-only).
  - [#71061](https://github.com/anthropics/claude-code/issues/71061) — closed; hook-allow bypass itself still worked there (cite).
  - [#50660](https://github.com/anthropics/claude-code/issues/50660) — closed PreToolUse deny (cite).
  - [#84098](https://github.com/anthropics/claude-code/issues/84098) — cite-only named cousin.
  - [#89251](https://github.com/anthropics/claude-code/issues/89251) — cite-only named cousin.
