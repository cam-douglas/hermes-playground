# Arras

A **theater / tapestry / curtain-aisle / gallery-wing booth** — an *arras* is a heavy tapestry hung as a screen (Polonius behind the arras). The approval card is hung behind the curtain — the house never sees it — then the next message stabs through and the pending call dies as cancelled. Fonts **Playfair Display** (display) + **Source Sans 3** (body) + **JetBrains Mono** (mono). Palette: deep stage velvet `#1A0F1C`, tapestry gold `#C9A227`, linen `#F3EDE0`, curtain crimson `#8B1E3F`, footlight cyan `#4ECDC4`. Fresh trio. Completely different UI/UX/metaphor — curtain aisle / phantom card / next-message dagger / bypass footlight. NOT a wax-seal atelier. NOT a hotel door-plate. NOT a lacquer nesting doll. NOT a night blotter. NOT an enrollment desk. NOT a type-foundry. NOT a neurology desk. NOT a gauntlet/lictor/lychgate/ouster/proscription booth. NOT Knock / Oubliette / Eidolon / Quietus / Aphonia / Sourdine / Wraith / Mirage / Afterimage / Scrim / Cachet / Veto.

The aisle should stay **cleared** (HOLD: approval card surfaced / path clear). Instead the booth was **arras** after a **phantom-prompt**.

Primary:

- [anthropics/claude-code#94348](https://github.com/anthropics/claude-code/issues/94348) (OPEN). Title: `[BUG] Desktop Code tab (Auto mode): permission prompt never renders — call hangs then is silently killed as "cancelled" on the next message`. Labels: bug, has-repro, platform:macos, area:permissions, area:desktop. Environment: CLI/core 2.1.270; Desktop app 1.52386.6; macOS Darwin 25.6.0. In Claude Desktop Code tab, Auto permission mode: some tool calls that need classifier escalation to a user-approval prompt never render that prompt anywhere in the UI — no card, no notification. Call sits "running." When the user sends the next chat message, the pending call is killed and reported as `toolDenialKind: "cancelled"` with a fake user-refusal string. Distinct from classifier deny (bracketed reason like `[Self-Modification]`). Mid-session Bypass Permissions toggle writes config and shows Bypass selected while the CLI rejects because the session was not launched with `--dangerously-skip-permissions`. Stay off Frangible/Nameplate/Matryoshka/Dragnet/Matricula/Allograph/Agraphia/Gauntlet/Lictor/Lychgate/Ouster/Proscription/Frisket/Scant/Knock paradigms.

08:50 arras: a theater / tapestry / curtain-aisle / gallery-wing booth for #94348. Desktop Code tab Auto mode: classifier-escalated tool calls never render an approval prompt — no card, no notification; the call sits running until the next chat message kills it as toolDenialKind cancelled with a fake user-refusal string. Mid-session Bypass Permissions toggle writes config and shows Bypass selected while the CLI rejects (session was not launched with --dangerously-skip-permissions). Idle **cleared** / seeded **arras** / path **phantom-prompt**. Score arras or admit cleared.

Score arras or admit cleared.

Idle word: **cleared** (HOLD: approval card surfaced / path clear). HOLD aliases: draped-open, card-shown, prompt-visible, aisle-clear, curtain-raised. Seeded word: **arras** / #94348 (the phantom-prompt path). Path word: **phantom-prompt**. Product score: **arras**. Never idle armed / affixed / unpacked / scoped / enrolled or seeded Frangible / Nameplate / Matryoshka / Dragnet or path chmod-failopen / header-rename / subst-nest / root-find.

Phrase: **Score arras or admit cleared.**

- **cleared** = IDLE HOLD: approval card surfaced; curtain raised; aisle clear
- **arras** = seeded path / product score: card hung behind the tapestry; next message cancels
- **phantom-prompt** = path word
- **hold** = HOLD alias for idle cleared
- **draped-open** = HOLD alias: tapestry drawn so the house can see
- **card-shown** = HOLD alias: approval card surfaced
- **prompt-visible** = HOLD alias: prompt rendered in the aisle
- **aisle-clear** = HOLD alias: gallery wing open
- **curtain-raised** = HOLD alias: arras up
- **cancelled** = `toolDenialKind: "cancelled"` with a fake user-refusal; house never chose
- **bypass-lie** = UI shows Bypass on after writing config; CLI rejects bypassPermissions
- **card-hidden** = no card, no notification
- **classifier-deny** = distinct path — bracketed reason like `[Self-Modification]`
- **next-message** = next chat stabs the hung call
- **running-hang** = call sits running with no prompt
- **landing** = theater / tapestry / curtain-aisle / gallery-wing
- **has-repro** = published shape: 2.1.270 Desktop 1.52386.6 macOS
- **cousins** = cite-only #92053 #85588 #92817 #86478 — do not rebuild; do not conflate
- **backups** = cite-only #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = curtain aisle / phantom card
- **walk** = published idle cleared → phantom-prompt → arras
- **closed** = #94348 remains OPEN — cite only; not this booth

Verdicts: cleared, arras, phantom-prompt, hold, draped-open, card-shown, prompt-visible, aisle-clear, curtain-raised, cancelled, bypass-lie, card-hidden, classifier-deny, next-message, running-hang, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **arras** or already **cleared**. Fixtures use the issue's published incident only. Phantom-prompt rows are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): classifier-escalated Desktop Auto-mode calls sometimes never emit/render the approval card; the next user message cancels the hung call as toolDenialKind cancelled with a fake user-refusal string; a mid-session Bypass toggle can write config while the CLI rejects the mode change. Invite verify against #94348 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94348](https://github.com/anthropics/claude-code/issues/94348)
- Cousins: do NOT rebuild / do NOT conflate: #92053 (cancelled on backgrounding/channel loss), #85588 (Auto silent classifier deny), #92817 / #86478 (bypass mode not respected). None of them covers a Desktop Auto approval card that never renders, then dies as cancelled on the next message.
- Backups (data only; next focus only — do not auto-pick): #93924, #93770, #93777, #94151
- Do NOT pick #94336

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has-repro, platform:macos, area:permissions, area:desktop
- Environment: CLI/core 2.1.270; Desktop app 1.52386.6; macOS Darwin 25.6.0
- Desktop Code tab Auto permission mode
- Classifier-escalated tool call never renders an approval prompt — no card, no notification
- Call sits "running"
- Next chat message kills the pending call as `toolDenialKind: "cancelled"` with a fake user-refusal string
- Distinct from classifier deny (bracketed reason like `[Self-Modification]`)
- Non-deterministic: `grep` matching `Bash(grep:*)` silently escalated and killed
- Mid-session Bypass Permissions toggle writes config and shows Bypass selected; CLI rejects because the session was not launched with `--dangerously-skip-permissions`

Problem found: PHANTOM-PROMPT — approval card hung behind the arras; next message cancels as a fake refusal.

Why Arras: An *arras* is a heavy tapestry / curtain hung as a screen. The approval card is hung behind it so the house never sees the prompt. The next message is the dagger. Bypass footlight glows while the prompter still refuses the cue. Frangible/#94362 was a wax-seal atelier / chmod-failopen — DIFFERENT. Nameplate/#94349 was a hotel door-plate / header-rename — DIFFERENT. Matryoshka/#94350 was a lacquer nesting-doll / subst-nest — DIFFERENT. Dragnet/#94064 was a night blotter / root-find — DIFFERENT. This booth is specifically phantom-prompt on a Desktop Auto approval card that never renders. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: interactive educational booth that scores idle **cleared** / seeded **arras** / path **phantom-prompt** so the failure mode is legible. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Every classifier-escalated tool call must render a visible approval prompt — no silent hangs
2. If mode switch to bypassPermissions fails server-side, UI must not show mode as active — surface the error
3. Killed-by-race tool call must never be reported as user refusal; use honest did not complete (same class as #92053)

## Why not a clone

This is specifically: **DESKTOP CODE TAB AUTO MODE: CLASSIFIER-ESCALATED TOOL CALLS NEVER RENDER AN APPROVAL PROMPT; THE CALL SITS RUNNING UNTIL THE NEXT CHAT MESSAGE KILLS IT AS `toolDenialKind` CANCELLED WITH A FAKE USER-REFUSAL STRING; MID-SESSION BYPASS TOGGLE CAN WRITE CONFIG AND SHOW BYPASS SELECTED WHILE THE CLI REJECTS.**

Novel paradigm: theater / tapestry / curtain-aisle / gallery-wing — velvet, gold, linen, crimson, footlight cyan. New issue, new paradigm (phantom-prompt), new UI/UX/fonts/colors, new scoring vocabulary. A hung tapestry, not a wax-seal atelier, hotel door-plate, nesting-doll workshop, night blotter, enrollment desk, type-foundry ledger, neurology clinic, tilting-yard glove, purple fasces aisle, parish porch, bailiff desk, or Roman tablet.

**NOT Frangible/#94362** (chmod-failopen). Different defect. NOT wax-seal atelier. Do not reuse armed / Frangible / chmod-failopen.

**NOT Nameplate/#94349** (header-rename). Different defect. NOT hotel door-plate. Do not reuse affixed / Nameplate / header-rename.

**NOT Matryoshka/#94350** (subst-nest). Different defect. NOT lacquer nesting-doll. Do not reuse unpacked / Matryoshka / subst-nest.

**NOT Dragnet/#94064** (root-find). Different defect. NOT night blotter. Do not reuse scoped / Dragnet / root-find.

**NOT Matricula/#93987** (reload-blind). Different defect. NOT enrollment desk. Do not reuse enrolled / Matricula / reload-blind.

**NOT Allograph/#94256** (win-posix-mismatch). Different defect. NOT type-foundry / punchcutter. Do not reuse equated / Allograph / win-posix-mismatch.

**NOT Agraphia/#94251** (pre-tool-omit). Different defect. NOT clinical writing-desk. Do not reuse penned / Agraphia / pre-tool-omit.

**NOT Gauntlet/#94029** (attach-mouse). Different defect. NOT tilting-yard / iron glove. Do not reuse ungloved / Gauntlet / attach-mouse.

**NOT Lictor/#94053** (picker-bypass). Different defect. NOT purple fasces aisle. Do not reuse attested / Lictor / picker-bypass.

**NOT Lychgate/#94059** (bg-task-stale). Different defect. NOT parish porch. Do not reuse reaped / Lychgate / bg-task-stale.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / Ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / Proscription / deny-list-hollow.

**NOT Knock.** Fail-loud stalled grants. Different catalog paradigm. Do not reuse Knock.

**NOT Oubliette. NOT Eidolon. NOT Quietus. NOT Aphonia. NOT Sourdine. NOT Wraith. NOT Mirage. NOT Afterimage. NOT Scrim. NOT Cachet. NOT Veto.**

**NOT Frisket.** Different catalog paradigm. Do not reuse Frisket.

**NOT Scant.** Different catalog paradigm. Do not reuse Scant.

Live: https://hermes-playground-green.vercel.app/arras/

```
node --test projects/arras/arras.test.mjs
node projects/arras/arras.mjs projects/arras/data/arras.json
```
