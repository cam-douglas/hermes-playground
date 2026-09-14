# Lictor

A **Roman lictor / fasces / magistrate-procession / wax-tablet ledger / iron-rod bundle / curule-chair / torch-lit forum aisle booth** — the herald who must precede the magistrate, brass-bound rods, wax tablet, ivory-and-brass curule seat, torch sconces along the aisle. Fonts **Cormorant Garamond** (display) + **Source Sans 3** (body) + **IBM Plex Mono** (mono). Palette: deep imperial purple `#2B1B3D`, brass fasces `#C4A35A`, parchment `#F3EDE0`, iron `#1C1C1C`, marble white `#F7F4EE`, torch `#E07A3D`. Fresh trio. NOT Lychgate/#94059. NOT Ouster/#94221. NOT Proscription/#94202. NOT Rescript/#93742. NOT Changeling/#93757. NOT Thimblerig. NOT Fetchling. NOT Souffleur. NOT Epitome. NOT Diabolica. NOT Sallyport. NOT Palilalia. NOT Sepulchre. NOT Sneck. NOT Drawbridge. NOT Interdict. NOT Veto. NOT Wicket. NOT Postern. NOT Airlock. NOT Ratchet. NOT Greenroom. Completely different UI/UX/metaphor. This is specifically: **DESKTOP CODE-TAB MODEL PICKER BYPASSES PREMODELSWITCH AND POSTMODELSWITCH — CLI /MODEL STILL DISPATCHES BOTH; THE MAGISTRATE SITS WITHOUT THE LICTOR.**

The aisle should stay **attested** (HOLD: heralded / preceded / dispatched / logged / bound). Instead the booth was **lictor** after a **picker-bypass**.

Primary:

- [anthropics/claude-code#94053](https://github.com/anthropics/claude-code/issues/94053) (OPEN). Title: `Desktop app model picker does not dispatch PreModelSwitch/PostModelSwitch hooks (CLI /model does)`. Labels: bug, has repro, platform:macos, area:hooks, area:desktop. Env: macOS Darwin 25.4.0 arm64; Desktop Claude.app 1.52386.3; desktop-bundled Claude Code 2.1.266; CLI 2.1.258; hooks in ~/.claude/settings.json empty matcher; builds above 2.1.251 minimum for these events. Changing the session model from the Claude desktop app Code-tab model picker does NOT dispatch PreModelSwitch or PostModelSwitch. CLI `/model` in a TUI session DOES dispatch both, same hook config, same machine. Desktop binary contains the dispatch symbols and the UI string `Running PreModelSwitch hooks…`, but the picker changes the model without entering that code path. Other hooks (SessionStart, UserPromptSubmit, PreToolUse, SubagentStart, Stop) fire normally in the same desktop sessions. Impact: PreModelSwitch can block switches (cost/policy/audit); desktop picker silently bypasses — no error, no log row. Cousins cite-only (do NOT rebuild / do NOT conflate): CLI `/model` is the working control. #93742 — Rescript: /model save-as-default wipes settings.json. #93757 — Changeling: remote reconnect reinjects default model. #90817 — model-conditional plugins/hooks. #93919 — export model id / PostModelSwitch sidecar. #91767 — hook payloads missing model. Related but different. This booth is specifically desktop picker bypasses Pre/PostModelSwitch while CLI `/model` still dispatches both. Backups cite-only (next focus only — do not auto-pick): #94029, #93987, #93924, #93770, #93777, #94151, #94064, #94174. Stay off Lictor/Lychgate/Ouster/Proscription/Thimblerig/Fetchling/Souffleur/Epitome/Diabolica/Sallyport/Palilalia/Sepulchre paradigms.

21:20 lictor: a Roman lictor / fasces / magistrate-procession / wax-tablet ledger / iron-rod bundle / curule-chair / torch-lit forum aisle booth for #94053. Desktop Code-tab model picker does not dispatch PreModelSwitch or PostModelSwitch; CLI /model does, same hooks, same machine. Desktop binary has the symbols and `Running PreModelSwitch hooks…` but the picker never enters that path. Other hooks fire. Silent policy bypass. macOS Darwin 25.4.0; Claude.app 1.52386.3; bundled 2.1.266; CLI 2.1.258. Idle **attested** / seeded **lictor** / path **picker-bypass**. Score lictor or admit attested.

Score lictor or admit attested.

Idle word: **attested** (HOLD: hooks fired in order; Pre then Post rows written; policy gate held). HOLD aliases: heralded, preceded, dispatched, logged, bound. Seeded word: **lictor** / #94053 (the picker-bypass path). Path word: **picker-bypass**. Product score: **lictor**. Never idle reaped / tenanted / barred / additive / literal / echoing / unabridged / innocent / sealed / silenced / living / cleared / spanned / matched / inscribed / berthed / pegged / latent / flushed / articulate / limber / primed / lit / voiced / mute / rostered / quieted / unrung / vested / plenary / equalized / legible / calibrated / engaged / flush / candid / stetted / sighted or seeded lychgate / ouster / proscription / thimblerig / fetchling / souffleur / epitome / diabolica / sallyport / palilalia / sepulchre / interdict / veto / wicket / postern or path bg-task-stale / inherited-worktree-yank / deny-list-hollow / skill-row-carve / skill-dollar-swap.

Phrase: **Score lictor or admit attested.**

- **attested** = IDLE HOLD: hooks fired in order; Pre then Post rows written; policy gate held
- **lictor** = seeded path / product score: desktop picker bypasses Pre/PostModelSwitch
- **picker-bypass** = path word
- **hold** = HOLD alias for idle attested
- **heralded** = HOLD alias: fasces raised before the chair
- **preceded** = HOLD alias: lictor walked the aisle first
- **dispatched** = HOLD alias: Pre then Post hooks dispatched
- **logged** = HOLD alias: wax tablet wrote both rows
- **bound** = HOLD alias: iron rods bound; policy gate held
- **pre-model-switch** = fasces must rise before the switch is applied
- **post-model-switch** = fasces must attest after the switch is applied
- **desktop-picker** = Code-tab picker takes the curule chair
- **cli-model** = CLI `/model` still dispatches both — the working control
- **zero-rows** = two picker changes; zero Pre/Post rows
- **silent-bypass** = no error, no log row; policy never ran
- **policy-gate** = PreModelSwitch can block; picker never asks
- **landing** = torch-lit forum aisle / fasces / curule chair / wax tablet
- **has-repro** = published shape: 1.52386.3 · 2.1.266 · 2.1.258 · Darwin 25.4.0
- **cousins** = cite-only #93742 #93757 #90817 #93919 #91767 — do not rebuild; do not conflate
- **backups** = cite-only #94029 #93987 #93924 #93770 #93777 #94151 #94064 #94174 — do not auto-pick
- **fixtures** = forum aisle / fasces / curule chair / wax tablet
- **walk** = published idle attested → picker-bypass → lictor
- **closed** = closed chip (not a hold)

Verdicts: attested, lictor, picker-bypass, hold, heralded, preceded, dispatched, logged, bound, pre-model-switch, post-model-switch, desktop-picker, cli-model, zero-rows, silent-bypass, policy-gate, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **lictor** or already **attested**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the desktop Code-tab model picker applies the session model without entering the hook-dispatch path that CLI `/model` uses, even though the desktop binary contains the symbols and the `Running PreModelSwitch hooks…` string. Invite verify against #94053 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94053](https://github.com/anthropics/claude-code/issues/94053)
- Cousins (cite-only — do NOT rebuild / do NOT conflate): CLI `/model` is the working control (same hooks, same machine). #93742 Rescript — /model save wipes settings (different). #93757 Changeling — remote reconnect reinjects default (different). #90817 model-conditional plugins/hooks (enhancement). #93919 export model id / PostModelSwitch sidecar (enhancement). #91767 hook payloads missing model (enhancement). #94053 is specifically desktop picker bypasses Pre/PostModelSwitch while CLI `/model` still dispatches both.
- Backups (data only; next focus only — do not auto-pick): #94029, #93987, #93924, #93770, #93777, #94151, #94064, #94174

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:hooks, area:desktop
- Env: macOS Darwin 25.4.0 arm64; Desktop Claude.app 1.52386.3; desktop-bundled Claude Code 2.1.266; CLI 2.1.258
- Hooks in `~/.claude/settings.json`, empty matcher on both events
- Builds above the documented 2.1.251 minimum for these events
- CLI `/model` in a TUI session dispatches both PreModelSwitch and PostModelSwitch
- TUI shows `Running PreModelSwitch hooks… (Esc to cancel)` then Pre then Post rows in the same second (`from=claude-sonnet-5` `to=claude-haiku-4-5-20251001`)
- Desktop Code-tab model picker: two hand changes produced **zero** rows for either event
- Across the whole log neither event name has ever appeared from a desktop session
- Other hooks fire normally in the same desktop sessions: SessionStart, UserPromptSubmit, PreToolUse, SubagentStart, Stop
- During the second picker switch alone, 66 rows were written across nine concurrent sessions — only the two model-switch events are missing
- Newly added `SubagentStart` fired one minute later on an already-running session, so “the session predates the hook” does not explain it
- Desktop binary contains the feature (`PreModelSwitch` 40, `PostModelSwitch` 17, `Running PreModelSwitch hooks` 3 — same UI string as CLI)
- Delivery does not depend on authentication — CLI positive control showed `Not logged in` and the hooks fired anyway
- Impact: PreModelSwitch can block a switch (cost/policy/audit); desktop picker silently bypasses — no error, no log row
- PostModelSwitch also covers switches Claude Code makes itself (e.g. restoring the model on resume), so the same gap affects passive audit

Problem found: PICKER-BYPASS — desktop Code-tab model picker changes the session model without entering the Pre/PostModelSwitch dispatch path; CLI `/model` still attests both; the magistrate sits, the lictor never precedes.

Why Lictor: A Roman *lictor* walks ahead of a magistrate with the fasces (a bundle of iron rods and an axe). The chair is not taken until the herald has raised the rods (PreModelSwitch) and then attested the seat (PostModelSwitch). The desktop picker lets the magistrate sit from a side door — no horn, no tablet row, no chance for the rods to block. Proscription/#94202 was a hollow outlaw list (Cinzel marble senate). Rescript/#93742 was a scraped charter on `/model` save. Changeling/#93757 was a swapped heir on reconnect. Lychgate/#94059 was a stale parish roll. This booth is specifically picker-bypass on the desktop model picker — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: attested catalog page + node diagnostic encoding idle **attested** / seeded **lictor** / path **picker-bypass** so operators can score whether the booth is **lictor** or already **attested**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Both surfaces dispatch PreModelSwitch before the switch is applied and PostModelSwitch after
2. Hooks documentation: PreModelSwitch fires before Claude Code applies a model switch that you or a client requested
3. Desktop Code-tab model picker must enter the same dispatch path CLI `/model` already walks (symbols and `Running PreModelSwitch hooks…` already exist in the desktop binary)
4. PreModelSwitch must be able to block a switch (cost/policy/audit) on the desktop picker, not only on CLI `/model`
5. A silent bypass with zero rows and no error is not an attested procession

## Why not a clone

This is specifically: **DESKTOP CODE-TAB MODEL PICKER BYPASSES PREMODELSWITCH AND POSTMODELSWITCH — CLI /MODEL STILL DISPATCHES BOTH; THE MAGISTRATE SITS WITHOUT THE LICTOR.**

Novel paradigm: Roman lictor / fasces / magistrate-procession / wax-tablet ledger / iron-rod bundle / curule-chair / torch-lit forum aisle — imperial purple, brass, parchment, iron, marble white, torch. New issue, new paradigm (picker-bypass), new UI/UX/fonts/colors, new scoring vocabulary. A herald-and-fasces aisle, not a parish porch, bailiff desk, or Cinzel marble senate.

**NOT Lychgate/#94059** (bg-task-stale). Different defect. NOT parish lychgate porch. Do not reuse reaped / lychgate / bg-task-stale.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Cinzel marble senate / wax-tablet forum. Do not reuse barred / proscription / deny-list-hollow.

**NOT Rescript/#93742** (/model save wipes settings). Related model-switch surface, different defect (charter scraped). Do not rebuild. Do not conflate.

**NOT Changeling/#93757** (remote reconnect reinjects default). Related model-identity surface, different defect (heir swapped). Do not rebuild. Do not conflate.

**NOT Thimblerig** (skill-row-carve). Different defect. NOT carnival cups.

**NOT Fetchling** (skill-dollar-swap). Different defect. NOT fae twilight.

**NOT Souffleur** (app-switch-echo-loss). Different defect. NOT theatre wings.

**NOT Epitome** (summarized-thinking-force). Different defect. NOT classical scriptorium.

**NOT Diabolica** (cannot-show-not-git). Different defect. NOT inquisitorial court.

**NOT Sallyport** (reminder-secret-bypass). Different defect. NOT fortress gatehouse.

**NOT Palilalia** (goal-stop-refire). Different defect. NOT phonograph groove.

**NOT Sepulchre** (bash-nul-poison). Different defect. NOT stone burial vault.

**NOT Sneck. NOT Drawbridge. NOT Interdict. NOT Veto. NOT Wicket. NOT Postern. NOT Airlock. NOT Ratchet. NOT Greenroom.** Different products.

Live: https://hermes-playground-green.vercel.app/lictor/

```
node --test projects/lictor/lictor.test.mjs
node projects/lictor/lictor.mjs projects/lictor/data/lictor.json
```
