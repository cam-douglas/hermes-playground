# Detent

A **mechanical detent / ratchet / hit-test / notched-wheel atelier booth** — A *detent* is the spring-loaded pin that drops into a ratchet notch so the wheel indexes with a click you can feel. Session-row left-clicks should seat in that notch (hit-test finds the row; the detent clicks; the session opens). After 2.1.271 shared mouse dispatch, the click lands but the pin never seats — deaf click / missing detent on fullscreen macOS Terminal.app. Fonts **Fraunces** (display) + **Figtree** (UI) + **JetBrains Mono** (chips). Palette: shop graphite `#101418`, detent brass `#DBA046`, machine oil `#245E62`, safety spark `#FF6B35`, atelier bone `#F3EDE2`, notch rust `#6E2C3A`. Fresh trio. Completely different UI/UX/metaphor — ratchet wheel / detent pin / click pawl / hit plate / notched dial / index seat / workshop bench. NOT a Greek theatre. NOT a dry-dock. NOT a tilting-yard.

The ratchet should stay **notched** (HOLD: click seats in the detent; hit-test finds the row; session opens). Instead the booth was **deaf-click** after a **mouse-dead**.

Primary:

- [anthropics/claude-code#94565](https://github.com/anthropics/claude-code/issues/94565) (OPEN). Title: `Clicking a session row in claude agents does nothing since 2.1.271 (fullscreen, macOS Terminal.app)`. Labels: bug, has repro, platform:macos, area:tui, regression, area:agent-view. Environment: Claude Code 2.1.271 and 2.1.272 broken, 2.1.270 works; macOS Darwin 25.5.0; Apple Terminal.app; TERM=xterm-256color; tui fullscreen. Stay off Prosopon/Slipway/Freshet/Kintsugi/Cenotaph/Stratum/Tmesis/Vedette/Orloj/Brisure/Diptych/Vizard/Gauntlet/Cathead paradigms.

21:10 detent: a mechanical detent / ratchet / hit-test / notched-wheel atelier booth for #94565. After 2.1.271 shared mouse dispatch, claude agents session-row left-clicks land but selection does nothing — hit-test/detent feedback gone on fullscreen macOS Terminal.app. Idle **notched** / seeded **deaf-click** / path **mouse-dead**. Score detent or admit notched.

Score detent or admit notched.

Idle word: **notched** (HOLD: click seats in the detent; hit-test finds the row; session opens). HOLD aliases: engaged, indexed, seated-click. Primary idle is **notched** because Cathead already used seated. Seeded word: **deaf-click** / #94565 (the mouse-dead path). Path word: **mouse-dead**. Product score: **detent**. Never idle ascribed / moored / buoyed / mended / homed / shared / contiguous / stationed / lasting / enrolled / single / pledged / seated or seeded Prosopon / Slipway / Freshet / Kintsugi / Cenotaph / Stratum / Tmesis / Vedette / Orloj / Brisure / Diptych / Vizard / Gauntlet / Cathead or path names from those booths.

Phrase: **Score detent or admit notched.**

- **notched** = IDLE HOLD: click seats in the detent; hit-test finds the row; session opens
- **deaf-click** = seeded path: left click lands; selection does nothing
- **mouse-dead** = path word: shared hit-testing change after 2.1.271
- **engaged** = HOLD alias: the pin is still engaged
- **indexed** = HOLD alias: the wheel is still indexed
- **seated-click** = HOLD alias: the click still seats (not Cathead seated)
- **hit-test** = click position resolved to a node in a separate step
- **hover-scope** = new hover scope / elementKey mechanism
- **element-key** = elementKey added to shared mouse dispatch
- **fullscreen-tui** = tui fullscreen on Apple Terminal.app
- **row-onclick** = session row onClick looks unchanged
- **keyboard-ok** = arrows + Enter still open the session
- **shared-dispatch** = 2.1.271 shared mouse dispatch changed
- **94565** = issue number seed
- **landing** = mechanical detent / ratchet / hit-test / notched-wheel atelier
- **has-repro** = published shape: CLI 2.1.271 · macOS Terminal.app · tui fullscreen
- **cousins** = issue text names no cousin tickets
- **backups** = cite-only #94564 #94553 #94560 #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = ratchet wheel / detent pin / click pawl
- **walk** = published idle notched → mouse-dead → deaf-click
- **closed** = #94565 remains OPEN — cite only; not this booth

Verdicts: notched, deaf-click, mouse-dead, engaged, indexed, seated-click, hit-test, hover-scope, element-key, fullscreen-tui, row-onclick, keyboard-ok, shared-dispatch, terminal-app, 94565, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **detent** or already **notched**. Fixtures use the issue's published incident only. Request reconstructions from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): the shared hit-testing change looks like the likely cause, since only clicking regressed — click position is now resolved to a node in a separate step, and a new hover scope / elementKey mechanism was added. Invite verify against #94565 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94565](https://github.com/anthropics/claude-code/issues/94565)
- Cousins: issue text names no cousin tickets. Do NOT rebuild. Do NOT conflate.
- Backups (data only; next focus only — do not auto-pick): #94564, #94553, #94560, #93924, #93770, #93777, #94151

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:tui, regression, area:agent-view
- Environment: Claude Code 2.1.271 and 2.1.272 broken; 2.1.270 works; macOS Darwin 25.5.0; Apple Terminal.app; TERM=xterm-256color
- TUI mode: fullscreen via `"tui": "fullscreen"` in `~/.claude/settings.json`
- Command: `claude agents`
- Left click any session row (Pinned, Ready for review, Working, Completed) is ignored
- Keyboard navigation (arrows + Enter) still works
- Session row onClick looks unchanged; shared mouse dispatch changed — click position resolved to a node in a separate step; new hover scope / elementKey
- Workaround: pin 2.1.270 with `DISABLE_AUTOUPDATER=1`

Problem found: MOUSE-DEAD — after 2.1.271 shared mouse dispatch, session-row left-clicks land but selection does nothing; hit-test/detent feedback gone on fullscreen macOS Terminal.app.

Why Detent: A *detent* is the spring-loaded pin that drops into a ratchet notch so the wheel indexes with a click. Session-row left-clicks should seat in that notch. After the shared dispatch change the click lands but the pin never seats. This booth is specifically **deaf click / missing detent after shared hit-test**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores mouse-dead honesty (notched vs deaf-click) so operators can see the four-row published clicks and the hanging pin without needing a Claude session. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Left click on a claude agents session row opens that session
2. Hit-test / detent feedback returns on fullscreen macOS Terminal.app

## Why not a clone

This is specifically: **AFTER 2.1.271 SHARED MOUSE DISPATCH, CLAUDE AGENTS SESSION-ROW LEFT-CLICKS LAND BUT SELECTION DOES NOTHING. HIT-TEST/DETENT FEEDBACK GONE ON FULLSCREEN MACOS TERMINAL.APP. KEYBOARD ARROWS + ENTER STILL WORK. 2.1.270 RESTORES CLICK. 2.1.272 STILL AFFECTED.**

Novel paradigm: mechanical detent / ratchet / hit-test / notched-wheel atelier / detent pin / click pawl / hit plate / index seat / workshop bench — graphite, brass, oil, spark, bone, notch rust. New issue, new paradigm (mouse-dead), new UI/UX/fonts/colors, new scoring vocabulary. A workshop ratchet booth, not a Greek theatre, Renaissance masque, herald college, dry-dock, river floodplain gauge, pottery bench, memorial yard, geology core, manuscript desk, cavalry lantern, Prague clock, or ship's cathead.

**NOT #94575** (advisor-shadow / Fable paint). DIFFERENT. Do not conflate.

**NOT Prosopon/#94575** (Greek theatre advisor-shadow). Different defect. Do not reuse ascribed / miscast / advisor-shadow.

**NOT Slipway/#94458** (Windows Ethernet→Wi-Fi undock / iface-swap). Different defect. Do not reuse moored / slipped / iface-swap.

**NOT Freshet/#94430** (initialize flood / No messages yet). Different defect. Do not reuse buoyed / init-flood.

**NOT Kintsugi/#94451** (marketplace rewrite never lands). Different defect. Do not reuse mended / heal-abort.

**NOT Cenotaph/#94452** (dead-install / plaque polished, stone never moved). Different defect. Do not reuse homed / dead-install.

**NOT Stratum/#94417** (layer-unsealed project-context). Different defect.

**NOT Tmesis/#86198** (mid-inject slash splice). Different defect.

**NOT Vedette/#94392** (headless `-p` idle-exit / false success). Different defect.

**NOT Orloj/#94393** (Monitor schema cap / half-life). Different defect.

**NOT Brisure/#94396** (herald college — do NOT use heraldry/tabard/blazon). Different metaphor.

**NOT Diptych/#94397** (wax-tablet brief-echo). Different defect.

**NOT Vizard/#94398** (Renaissance masque/visor / background-reset). Different defect.

**NOT Cathead/#93624** (seated / ptmx-race). DIFFERENT; do not reuse seated.

**NOT Treacle/Somnus/Cresset/Dictabelt.** Different defects.

Live: https://hermes-playground-green.vercel.app/detent/

```
node --test projects/detent/detent.test.mjs
node projects/detent/detent.mjs projects/detent/data/deaf-click.json
```
