# Replevin

A **legal replevin / writ desk** — bond parchment, court green, bronze seal, ink black. Fonts **Literata** (display) + **Sora** (body) + **Roboto Mono** (mono). Palette: bond parchment, court green, bronze seal, ink black — for a real Claude Code defect: **APPROVING A PLAN FROM THE iOS APP SENDS SETMODE 'AUTO', DISCARDING THE SESSION'S PREPLANMODE; THE REJECTION PATH THEN FALLS BACK TO 'DEFAULT'.**

Primary:

- [anthropics/claude-code#93207](https://github.com/anthropics/claude-code/issues/93207) (OPEN, bug, platform:ios, area:permissions). Title: `Approving a plan from the iOS app sends setMode 'auto', discarding the session's prePlanMode; the rejection path then falls back to 'default'`. Claude Code CLI 2.1.267, macOS 15 (Darwin 25.6.0). Filed by miridius 2026-09-09. A local session in `bypassPermissions` enters plan mode (`prepareContextForPlanMode` records `prePlanMode=bypassPermissions`). Approving `ExitPlanMode` from the Claude iOS app uses the primary button labelled "Exit and auto mode", which sends `updatedPermissions: [{type:"setMode", mode:"auto"}]` regardless of the recorded `prePlanMode`. That overrides the CLI restore (`ExitPlanModeV2Tool` would set `mode: prePlanMode`). When `disableAutoMode` rejects `setMode 'auto'`, the bridge falls back to hardcoded `'default'` — not `prePlanMode`. The session then prompts for every tool. CLI TUI and Android approve with no bridge `setMode` and land in `bypassPermissions`. On iOS there is no permission-mode indicator.

15:50 replevin: a legal replevin / writ-desk booth that should keep prePlanMode **restored** after ExitPlanMode; instead iOS approval sends setMode auto and the rejection path falls back to default, displacing bypassPermissions (#93207). Score replevin or admit restored.

Score replevin or admit restored.

Idle word: **restored** (HOLD: ExitPlanMode restores prePlanMode; session returns to prior mode). Seeded word: **replevin** / #93207 (iOS forces setMode auto; rejection path defaults). Path word: **defaulted**. Never idle expanded / cognate / literal / laid / lemures / remanent / released / escheat / stale / freehold / mortmain / phantom / trunked / strowger / exchanged / tokenized / mondegreen / parsed / locked / scratched / derby / unmasked / vizard / precedence / carrier / moored / scuttled / open / seated / stopcock / preserved / discarded / cleared / mounded / distinct / held / raised / fallen / primed / flashed / greenroomed / scaffold / stereotype / parergon / lacuna / hangfire / afterimage / remora / quieted / unrung / latent / flushed / collated / stereotyped / deadair / squelch / scuttle / fresh / stamped / conflated / steered / vernier / slider.

Phrase: **when iOS plan approval displaces prePlanMode with setMode auto (and rejection falls back to default), score replevin or admit restored.**

- **restored** = IDLE: HOLD; ExitPlanMode restores prePlanMode; session returns to the prior mode
- **replevin** = #93207 seeded path: iOS forces setMode auto; rejection path defaults; bypassPermissions displaced
- **defaulted** = path word: rejection fallback lands on hardcoded default, not prePlanMode
- **hold** = HOLD alias for idle restored
- **preplan** = `prepareContextForPlanMode` records `prePlanMode=bypassPermissions`
- **setmode-auto** = iOS sends `updatedPermissions: [{type:"setMode", mode:"auto"}]`
- **bridge-override** = bridge `setMode` arrives first and overrides the CLI restore
- **reject-fallback** = rejected `setMode 'auto'` falls back to `'default'`
- **bypass-displaced** = session leaves plan mode in default and prompts for every tool
- **ios-surface** = iOS button labelled "Exit and auto mode"
- **android-correct** = Android button is a plain "Approve plan"; no bridge setMode
- **cli-correct** = CLI TUI offers "Yes, and bypass permissions"; restores prePlanMode
- **disable-automode** = host setting rejects auto; same defect, different landing (`default` vs `auto`)
- **no-indicator** = iOS has no permission-mode indicator and no dropdown
- **has-repro** = bypassPermissions → plan → iOS Approve → setMode auto → reject → default
- **cousins** = cite-only #79990 #80812 — do not rebuild
- **backups** = cite-only #93219 #93239 #93259 #93257 — do not auto-pick as primary
- **fixtures** = row list for the replevin booth
- **walk** = published idle restored → preplan → enter-plan → ios-approve → setmode-auto → disable-automode → reject-fallback → bypass-displaced → replevin → defaulted

Verdicts: restored, replevin, defaulted, hold, preplan, setmode-auto, bridge-override, reject-fallback, bypass-displaced, ios-surface, android-correct, cli-correct, disable-automode, no-indicator, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring writ desk. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the writ is **replevin** or already **restored**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): iOS approval hardcodes setMode auto and bridge rejection fallback is hardcoded default instead of prePlanMode. Invite verify against #93207 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93207](https://github.com/anthropics/claude-code/issues/93207)
- Cite-only cousin: [anthropics/claude-code#79990](https://github.com/anthropics/claude-code/issues/79990) (mobile/web mode dropdown knocks out bypassPermissions — different defect: manual dropdown tap, not plan approval)
- Cite-only cousin: [anthropics/claude-code#80812](https://github.com/anthropics/claude-code/issues/80812) (Remote Control offers Auto with disableAutoMode — different shape: app mode handling does not consult the host gate)
- Backup (data only): [anthropics/claude-code#93219](https://github.com/anthropics/claude-code/issues/93219) (Vernier — effort slider inert — millimeter-slider leftover, forbidden as primary)
- Backup (data only): [anthropics/claude-code#93239](https://github.com/anthropics/claude-code/issues/93239) (Enter interrupts instead of queueing)
- Backup (data only): [anthropics/claude-code#93259](https://github.com/anthropics/claude-code/issues/93259) (archive_session pin refusal message collapse)
- Backup (data only): [anthropics/claude-code#93257](https://github.com/anthropics/claude-code/issues/93257) (agents auto-update relaunch drops bypass flags)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, platform:ios, area:permissions
- Claude Code CLI 2.1.267, macOS 15 (Darwin 25.6.0), terminal-hosted session driven from the Claude iOS app
- Settings: `defaultMode: bypassPermissions`, `disableAutoMode: disable`
- `prepareContextForPlanMode` records `prePlanMode=bypassPermissions` on plan entry
- iOS primary button is labelled "Exit and auto mode"
- iOS sends `updatedPermissions: [{type:"setMode", mode:"auto"}]` regardless of `prePlanMode`
- CLI `ExitPlanModeV2Tool` would restore `mode: prePlanMode`; the bridge `setMode` arrives first and overrides that
- Debug: `bridge setMode 'auto' rejected (Cannot set permission mode to auto: auto mode disabled by settings); falling back to 'default'`
- Session leaves plan mode in `default` and prompts for every tool call
- Without `disableAutoMode`, `setMode 'auto'` is accepted and the session lands in auto
- Contrast table: CLI TUI ✅ / Android ✅ / iOS ❌ — CLI and Android send no `bridge setMode`
- On iOS there is no permission-mode indicator and no dropdown
- Expected: restore `prePlanMode`; iOS should send no `setMode` on plain approval (matching Android) or request `prePlanMode`; rejection fallback should be `prePlanMode` rather than `default`

Problem found: WHEN iOS PLAN APPROVAL DISPLACES PREPLANMODE WITH SETMODE AUTO (AND REJECTION FALLS BACK TO DEFAULT).

Why this solution: a diagnostic legal replevin / writ-desk chamber for the restored → replevin drift, so a reader can pin idle restored, load the #93207 replevin path, and score defaulted / setmode-auto / reject-fallback against the published facts. Conceptual writ restore, bond seal, and surface comparison show whether the prior mode was restored. No live Claude session is required.

## Why not a clone

This is specifically: **APPROVING A PLAN FROM THE iOS APP SENDS SETMODE 'AUTO', DISCARDING THE SESSION'S PREPLANMODE; THE REJECTION PATH THEN FALLS BACK TO 'DEFAULT'.**

**NOT Cognate/#93250** (plugin MCP `${PLUGIN_ROOT}` left unexpanded). Different defect.

**NOT Lemures/#93256** (mid-turn task-summary classifier keeps previous `latestAsk` across `/clear`). Different defect.

**NOT Escheat/#93231** (VS Code window-close leaves git worktree `locked` naming a dead PID). Different defect.

**NOT Mortmain/#93173** (sandbox `denyWithinAllow` freezes tracked `.claude` paths). Different defect.

**NOT Strowger/#93218** (Desktop `--disallowedTools SendMessage` while ListAgents still lists). Different paradigm.

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Derby/#93197.** **NOT Vizard/#93190.** **NOT Dead Air.** **NOT Scuttle.** **NOT Stopcock.** **NOT Parergon.** **NOT Stereotype.** **NOT Midden.** **NOT Afterimage.** **NOT Mirage.** **NOT Ephemera.** **NOT Palimpsest.** **NOT Recension.** **NOT Quietus.** **NOT Calque.** **NOT Sigil.** **NOT Caret.**

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **iOS ExitPlanMode approval displaces recorded prePlanMode via setMode auto + default fallback** — unused in catalog as this replevin / writ walk.

Do NOT rename this product Cognate, Lemures, Escheat, Mortmain, Strowger, Mondegreen, Calque, Sigil, Caret, Afterimage, Mirage, Ephemera, Palimpsest, Recension, Quietus, or any existing catalog slug.
Do NOT reuse idle restored / replevin / defaulted on a later booth.
Do NOT reuse Fraunces + Source Sans 3 + IBM Plex Mono (Cognate). Do NOT reuse Libre Baskerville + Red Hat Text + JetBrains Mono (Lemures). Do NOT reuse Cardo + Figtree + Fragment Mono (Escheat). Do NOT reuse Cinzel (Mortmain). Do NOT reuse Syne + Karla (Strowger). Do NOT reuse Cormorant Garamond + Outfit + Space Mono (Mondegreen). Display here is **Literata**. Body is **Sora**. Mono is **Roboto Mono**.

Different surface: iOS ExitPlanMode setMode auto vs unexpanded spec-standard MCP placeholder / remanent classifier latestAsk / window-close worktree lock leftover / sandbox `denyWithinAllow` / Desktop `--disallowedTools SendMessage` / isolation:worktree substring `git`.

Product name stays **Replevin**. Name/slug `replevin` unused in catalog.json (262 products before this ship; Cognate is #262).

Different UI: legal replevin chamber / writ desk / bond parchment / court green / bronze seal / ink black. Literata / Sora / Roboto Mono. NOT comparative philology / manuscript cognate desk (Cognate). NOT Roman Lemuria night courtyard / black beans / bronze cymbals (Lemures). NOT feudal escheat chamber / struck PID ledger (Escheat). NOT muniment room / sealed charter (Mortmain). NOT Strowger exchange / switchboard. NOT ballad-sheet studio (Mondegreen). NOT racecourse (Derby).

Different verbs: Restore the writ, Score replevin, Seal the bond, Compare surfaces, Pin idle restored, Pin seeded replevin, Pin defaulted, Reset the chamber.

Different idle: **restored**. Different #93207 seeded path: **replevin**. HOLD: **restored** / **hold**. ALARM: **replevin** / **defaulted** / **preplan** / **setmode-auto** / **bridge-override** / **reject-fallback** / **bypass-displaced** / **ios-surface**. Path: **defaulted**.

## How to score

```bash
node --test projects/replevin/replevin.test.mjs
node projects/replevin/replevin.mjs projects/replevin/data/replevin.json
echo '{"seed":"replevin"}' | node projects/replevin/replevin.mjs
```

Open the living card at `projects/replevin/index.html` (or the live path `/replevin/`). Buttons: Restore the writ, Score replevin, Seal the bond, Compare surfaces, Pin idle restored, Pin seeded replevin, Pin defaulted, Reset the chamber. Toggle iOS approve / setMode auto / disableAutoMode / reject fallback / bypass displaced / no indicator — the score flips. Rest a fixture JSON on the writ. `?embed=1` hides chrome.

The booth reconstructs the reporter’s prepareContextForPlanMode / iOS Approve / setMode auto / reject-fallback walk from the published #93207 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/replevin/
- Folder: `projects/replevin/`
