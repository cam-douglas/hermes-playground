# Thimblerig

A **street-corner cups-and-pea / carnival tent / chalk tally booth** — canvas tent, walnut board, three cups, pea, gold trim. Fonts **Rye** (display) + **DM Sans** (body) + **IBM Plex Mono** (mono). Palette: tent canvas `#E8DCC8`, board walnut `#3A2A1A`, pea green `#3D8B4F`, cup crimson `#B83232`, chalk white `#F4F0E6`, shadow indigo `#1E1A2E`, gold trim `#C9A227`. Fresh trio. NOT Fetchling/#94065. NOT Souffleur/#94031. NOT Epitome/#94032. NOT Diabolica/#94040. NOT Sallyport/#94082. NOT Palilalia/#94041. NOT Sepulchre/#94055. NOT Sneck/#94052. NOT Drawbridge/#94049. NOT Chirograph/#94045. NOT Titulus. NOT Derelict. NOT Vestry. NOT Mondegreen. NOT Afterimage/#92596. NOT Phosphene. NOT Scotoma. NOT Scrim. NOT Aphonia/#92409. NOT Sourdine/#93531. NOT Anarthria/#93782. Completely different UI/UX/metaphor. This is specifically: **`/context` CARVES THE SKILLS LISTING FROM A SYSTEM-TOOLS ROW THAT NEVER CONTAINED IT, SO CUPS TRADE THE PEA 1:1 AND THE CHALK TOTAL STAYS FROZEN.**

The board should stay **additive** (HOLD: honest-total / settled / true-sum / skills-additive / account-true). Instead the booth was **thimblerig** after a **skill-row-carve**.

Primary:

- [anthropics/claude-code#94174](https://github.com/anthropics/claude-code/issues/94174) (OPEN). Title: `[BUG] /context: hiding skills moves tokens from Skills to System tools 1:1, total never drops (re-open of #85439, closed as stale)`. Labels: bug, has repro, area:tui. Re-open of #85439 (auto-closed stale 2026-09-13 despite `reproduced` + maintainer confirmation). Hiding skills (`disable-model-invocation: true`, `disableBundledSkills: true`, etc.) makes `/context` **Skills** row go down, but **System tools** row goes up by exactly the same amount. **Total never changes.** Maintainer on #85439 (2.1.233): skill listing is NOT part of tool definitions; sent as a separate note alongside the first message. `/context` still computes System tools as "tools minus the skill listing", carving Skills out of a number that never contained it — rows trade tokens; total doesn't move. Confirmed reporting bug; payload really shrinks; display lies. Measurements A/B/C: Skills 3.9k→2.8k→800; System tools 18k→19.1k→21.1k; Total stuck at **27.1k** all three. Current reporter on 2.1.270; no changelog fix. Cousins cite-only (do NOT rebuild / do NOT conflate): #85439 original closed-stale report (same bug); #92255 MCP schemas still consuming after disable (different); #92877 /context dollar cost feature; #92881 /context min-token threshold feature; #87281 background job missing skills listing reminder. Backups cite-only (next focus only — do not auto-pick): #94029, #93987, #93924, #93770, #93777, #94059, #94053, #94151, #94064. Stay off Fetchling/Souffleur/Epitome/Diabolica/Sallyport/Palilalia/Sepulchre/Sneck/Drawbridge/Chirograph/Titulus/Derelict/Vestry/Mondegreen/Afterimage/Phosphene/Scotoma/Scrim/Aphonia/Sourdine/Anarthria paradigms.

15:50 thimblerig: a street-corner cups-and-pea / carnival thimblerig booth for #94174. Re-open of #85439: hiding skills makes /context Skills row go down but System tools row goes up 1:1; total stuck at 27.1k. Maintainer: skill listing is a separate note, not tool definitions; /context carves Skills from a tools number that never contained it. Idle **additive** / seeded **thimblerig** / path **skill-row-carve**. Score thimblerig or admit additive.

Score thimblerig or admit additive.

Idle word: **additive** (HOLD: Skills row additive; total moves when you trim). HOLD aliases: additive, honest-total, settled, true-sum, skills-additive, account-true. Seeded word: **thimblerig** / #94174 (the skill-row-carve path). Path word: **skill-row-carve**. Product score: **thimblerig**. Never idle literal / echoing / unabridged / innocent / sealed / silenced / living / cleared / spanned / matched / inscribed / berthed / pegged / latent / flushed / articulate / limber / primed / lit / voiced / mute / rostered / quieted / unrung / demesned / diagrammed / traced / damped / mounted / warm / honest (as sole idle) / afloat / concordant / routed / bound / preserved / raised or seeded fetchling / souffleur / epitome / diabolica / sallyport / palilalia / sepulchre / sneck / drawbridge / chirograph / titulus / derelict / vestry / mondegreen / afterimage / phosphene / scotoma / scrim / aphonia / sourdine / anarthria / skill-dollar-swap / app-switch-echo-loss / summarized-thinking-force / cannot-show-not-git / reminder-secret-bypass / goal-stop-refire / bash-nul-poison.

Phrase: **Score thimblerig or admit additive.**

- **additive** = IDLE: HOLD; Skills row on top; chalk total a true sum; cups still
- **thimblerig** = #94174 seeded path and product score: cups trade the pea 1:1; tally frozen
- **skill-row-carve** = path word: `/context` carves Skills from a tools row that never contained the listing
- **hold** = HOLD alias for idle additive
- **honest-total** = HOLD alias: chalk total is a true sum
- **settled** = HOLD alias: cups stay still; pea counted on top
- **true-sum** = HOLD alias: total moves when you trim skills
- **skills-additive** = HOLD alias: Skills row counted on top of System tools
- **account-true** = HOLD alias: System tools show the real tool-definition size
- **frozen-total** = A/B/C totals all 27.1k
- **row-trade** = Skills↓ System tools↑ 1:1
- **carved-listing** = tools − skill listing even though listing was never in tools
- **baseline-a** = Skills 3.9k (49); tools 18k; total 27.1k
- **disable-invocation-b** = Skills 2.8k (22); tools 19.1k; total 27.1k
- **disable-bundled-c** = Skills 800 (7); tools 21.1k; total 27.1k
- **reporting-lie** = `/context` display lies; payload really shrinks
- **payload-shrinks** = hiding skills shrinks what is sent; chalk does not show it
- **landing** = canvas tent / walnut board / three cups / chalk tally
- **has-repro** = published shape: 2.1.270 · /context TUI · A/B/C 27.1k frozen · re-open of #85439
- **cousins** = cite-only #85439 #92255 #92877 #92881 #87281 — do not rebuild; do not conflate
- **backups** = cite-only #94029 #93987 #93924 #93770 #93777 #94059 #94053 #94151 #94064 — do not auto-pick
- **fixtures** = canvas tent / walnut board / three cups / chalk tally
- **walk** = published idle additive → skill-row-carve → thimblerig

Verdicts: additive, thimblerig, skill-row-carve, hold, honest-total, settled, true-sum, skills-additive, account-true, frozen-total, row-trade, carved-listing, baseline-a, disable-invocation-b, disable-bundled-c, reporting-lie, payload-shrinks, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **thimblerig** or already **additive**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): `/context` System-tools = tools−skillListing even though listing was never in tools; make Skills additive. Invite verify against #94174 / #85439 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94174](https://github.com/anthropics/claude-code/issues/94174)
- Cousins (cite-only — do NOT rebuild / do NOT conflate): #85439 original closed-stale report (same bug). #92255 MCP schemas still consuming after disable (different). #92877 /context dollar cost feature. #92881 /context min-token threshold feature. #87281 background job missing skills listing reminder. #94174 is specifically the /context skill-row-carve.
- Backups (data only; next focus only — do not auto-pick): #94029, #93987, #93924, #93770, #93777, #94059, #94053, #94151, #94064

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, area:tui
- Re-open of #85439 (auto-closed stale 2026-09-13 despite `reproduced` + maintainer confirmation)
- Hiding skills (`disable-model-invocation: true`, `disableBundledSkills: true`, etc.)
- Skills row goes down; System tools row goes up by exactly the same amount
- Total never changes
- Maintainer on #85439 (2.1.233): skill listing is NOT part of tool definitions; sent as a separate note alongside the first message
- `/context` still computes System tools as "tools minus the skill listing"
- Carves Skills out of a number that never contained it
- Confirmed reporting bug; payload really shrinks; display lies
- Measurements A/B/C: Skills 3.9k→2.8k→800; System tools 18k→19.1k→21.1k; Total stuck at 27.1k
- Current reporter on 2.1.270; no changelog fix

Problem found: SKILL-ROW-CARVE — `/context` carves Skills from a tools row that never contained the listing; cups trade 1:1; total frozen at 27.1k.

Why Thimblerig: A *thimblerig* is a street-corner cups-and-pea swindle. The pea (skill listing) was never under the tools cup. The carny (`/context`) lifts that cup anyway and "finds" the pea by carving it out — Skills and System tools trade, the chalk total never moves. Fetchling/#94065 was a Skill-path dollar-token swap (coin-ledger). Souffleur/#94031 was typing-echo loss after app switch (theatre wings). Epitome/#94032 was scriptorium abridgement. This booth is specifically a /context tally lie — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: additive catalog page + node diagnostic encoding idle **additive** / seeded **thimblerig** / path **skill-row-carve** so operators can score whether the booth is **thimblerig** or already **additive**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The Skills row should be counted on top of System tools, not subtracted from it
2. System tools should show the real size of the tool definitions
3. The total should go down when you hide skills
4. Hiding skills with disable-model-invocation / disableBundledSkills should move the chalk total, not just slide tokens between cups
5. `/context` should not carve a skill listing out of a tools number that never contained it

## Why not a clone

This is specifically: **`/context` CARVES THE SKILLS LISTING FROM A SYSTEM-TOOLS ROW THAT NEVER CONTAINED IT, SO CUPS TRADE THE PEA 1:1 AND THE CHALK TOTAL STAYS FROZEN.**

Novel paradigm: street-corner carnival tent / cups-and-pea / chalk tally — canvas, walnut, crimson cups, pea green, gold trim. New issue, new paradigm (skill-row-carve), new UI/UX/fonts/colors, new scoring vocabulary. A canvas tent with three cups and a chalk board, not a twilight coin-ledger, theatre prompt-corner, scriptorium desk, inquisitorial court, or fortress sallyport.

**NOT Fetchling/#94065** (skill-dollar-swap). Different defect. NOT fae twilight / coin-ledger. Do not reuse literal / fetchling / skill-dollar-swap.

**NOT Souffleur/#94031** (app-switch-echo-loss). Different defect. NOT theatre wings / prompt-corner. Do not reuse echoing / souffleur / app-switch-echo-loss.

**NOT Epitome/#94032** (summarized-thinking-force). Different defect. NOT classical scriptorium. Do not reuse unabridged / epitome / summarized-thinking-force.

**NOT Diabolica/#94040** (cannot-show-not-git). Different defect. NOT inquisitorial parchment-court. Do not reuse innocent / diabolica / cannot-show-not-git.

**NOT Sallyport/#94082** (reminder-secret-bypass). Different defect. NOT fortress / gatehouse. Do not reuse sealed / sallyport / reminder-secret-bypass.

**NOT Palilalia/#94041** (goal-stop-refire). Different defect. NOT speech-pathology / phonograph-groove. Do not reuse silenced / palilalia / goal-stop-refire.

**NOT Sepulchre/#94055** (bash-nul-poison). Different defect. NOT stone burial vault / ossuary. Do not reuse living / sepulchre / bash-nul-poison.

**NOT Sneck/#94052** (chip dismiss ephemeral). Different defect. NOT Northern cottage / brass sneck-latch. Do not reuse cleared / sneck / chip-dismiss-ephemeral.

**NOT Drawbridge/#94049** (RC bridge auto-update drop). Different defect. NOT raised span / bailey. Do not reuse spanned / drawbridge / rc-bridge-update-drop.

**NOT Chirograph/#94045** (recorded branch never refreshed after `git branch -m`). Different defect. NOT medieval lectern / indenture. Do not reuse matched / chirograph / worktree-rename-stale.

**NOT Titulus** (iOS rename vs desktop sidebar / resume-stale-title). Different defect. NOT Roman marble plaque. Do not reuse inscribed / titulus.

**NOT Derelict** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict.

**NOT Vestry** (Linux bwrap placeholder mount cleanup is per-process). Different defect. NOT liturgical sacristy. Do not reuse pegged / vestry.

**NOT Mondegreen** (substring "git" false-positive). Different defect. NOT lyric-ballad / mishearing.

**NOT Afterimage/#92596** (Windows text paint latency). Different defect. NOT CRT phosphor.

**NOT Phosphene** (WindowServer CA layer-tree thrash). Different defect. NOT vision flash.

**NOT Scotoma.** Different defect. NOT vision gap.

**NOT Scrim** (runtime DLP redaction). Different product. Do not reuse flushed / scrim.

**NOT Aphonia/#92409** (missing SendMessage). Different defect. NOT ENT roster.

**NOT Sourdine/#93531** (mid-narration mute). Different defect. NOT concert mute.

**NOT Anarthria/#93782** (dictation paste drop). Different defect. NOT laryngology.

Live: https://hermes-playground-green.vercel.app/thimblerig/

```
node --test projects/thimblerig/thimblerig.test.mjs
node projects/thimblerig/thimblerig.mjs projects/thimblerig/data/thimblerig.json
```
