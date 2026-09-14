# Gauntlet

A **medieval tournament gauntlet / iron glove / riveted cuff / tilting-yard / mail sleeve / bare-hand vs armored fist booth** — lists, barriers, riveted cuff, mail sleeve, PRIMARY paste as an open-hand offering. Fonts **Cinzel** (display) + **Karla** (body) + **Space Mono** (mono). Palette: iron `#1F2328`, steel `#8A9199`, crimson `#8B1E2D`, parchment `#E8E0D0`, rivet gold `#B8953A`, ash `#2C3138`. Fresh trio. NOT Lictor. NOT Lychgate/#94059. NOT Ouster/#94221. NOT Proscription/#94202. NOT Thimblerig/#94174. NOT Fetchling/#94065. NOT Souffleur/#94031. NOT Epitome/#94032. NOT Diabolica/#94040. NOT Sallyport/#94082. Completely different UI/UX/metaphor. This is specifically: **ATTACHED BACKGROUND SESSIONS FORCE XTERM MOUSE CAPTURE EVEN WHEN THE USER ORDERED BARE HANDS — DIRECT LAUNCH HONORS DISABLE_MOUSE; ATTACH ALWAYS GLOVES.**

The lists should stay **ungloved** (HOLD: bare-handed / opted-out / native-select / paste-open / released). Instead the booth was **gauntlet** after an **attach-mouse**.

Primary:

- [anthropics/claude-code#94029](https://github.com/anthropics/claude-code/issues/94029) (OPEN). Title: `[BUG] claude attach ignores CLAUDE_CODE_DISABLE_MOUSE and CLAUDE_CODE_DISABLE_MOUSE_CLICKS — mouse capture always on in attached background sessions`. Labels: bug, has repro, platform:linux, area:tui, regression, area:agent-view. Version: Claude Code 2.1.270, Ubuntu/Debian Linux. Attached background sessions (`claude attach <id>`) enable xterm mouse reporting unconditionally (ESC[?1000h/1002h/1003h/1006h), ignoring both documented opt-outs. A directly-launched `claude` in the same terminal/shell/version honors CLAUDE_CODE_DISABLE_MOUSE=1 correctly (zero enables). Practical effect on Linux: middle-click PRIMARY-selection paste is swallowed while attached; Shift+middle-click is the only workaround. Same root cause named when #73443 closed (2026-08-17) — either that fix regressed or never covered `claude attach`. Docs carve out tui/CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN for attached sessions but state NO such exception for mouse opt-outs. Terminal modes ARE restored on exit (not a stale-state bug). Not #73320 (different). Evidence: Run D (direct + DISABLE_MOUSE) = correct not emitted; Run E (attach + DISABLE_MOUSE) = BUG emitted; Run G (attach + DISABLE_MOUSE_CLICKS) = BUG emitted. Cousins cite-only (do NOT rebuild / do NOT conflate): #91142 open — attach enables NO mouse modes on Windows (inverse symptom, same code path); #73443 closed — footer nav re-enabled mouse ignoring DISABLE_MOUSE; #66957 closed — original Linux PRIMARY middle-click, closed pointing at DISABLE_MOUSE=1 which doesn't reach attach; #71687 — docs gap (mouse vars only on fullscreen page); #73320 open — DO_NOT_TRACK silently disables mouse clicks (different). Direct-launch with DISABLE_MOUSE=1 is the working control. This booth is specifically attach ignoring mouse opt-outs. Backups cite-only (next focus only — do not auto-pick): #93987, #93924, #93770, #93777, #94151, #94064, #94251, #94256. Stay off Lictor/Lychgate/Ouster/Proscription/Thimblerig/Fetchling/Souffleur/Epitome/Diabolica/Sallyport paradigms.

21:50 gauntlet: a medieval tournament gauntlet / iron glove / riveted cuff / tilting-yard booth for #94029. Attached background sessions (`claude attach`) enable xterm mouse reporting unconditionally, ignoring CLAUDE_CODE_DISABLE_MOUSE and CLAUDE_CODE_DISABLE_MOUSE_CLICKS; direct launch honors DISABLE_MOUSE=1 (zero enables). Idle **ungloved** / seeded **gauntlet** / path **attach-mouse**. Score gauntlet or admit ungloved.

Score gauntlet or admit ungloved.

Idle word: **ungloved** (HOLD: bare-handed / opted-out / native-select / paste-open / released). HOLD aliases: barehanded, opted, native, released, openhand. Seeded word: **gauntlet** / #94029 (the attach-mouse path). Path word: **attach-mouse**. Product score: **gauntlet**. Never idle attested / reaped / tenanted / barred / additive / literal / echoing / unabridged / innocent / sealed / silenced / living / cleared / spanned / matched / inscribed / berthed / pegged / latent / flushed / articulate / limber / primed / lit / voiced / mute / rostered / quieted / unrung / vested / plenary / equalized / legible / calibrated / engaged / flush / candid / stetted / sighted or seeded lictor / lychgate / ouster / proscription / thimblerig / fetchling / souffleur / epitome / diabolica / sallyport / palilalia / sepulchre or path picker-bypass / bg-task-stale / inherited-worktree-yank / deny-list-hollow / skill-row-carve / skill-dollar-swap.

Phrase: **Score gauntlet or admit ungloved.**

- **ungloved** = IDLE HOLD: DISABLE_MOUSE=1 honored; zero enables; terminal handles selection natively
- **gauntlet** = seeded path / product score: attach forces the iron glove on
- **attach-mouse** = path word
- **hold** = HOLD alias for idle ungloved
- **barehanded** = HOLD alias: tilter rides with bare hands as ordered
- **opted** = HOLD alias: documented mouse opt-out honored
- **native** = HOLD alias: terminal handles selection natively
- **released** = HOLD alias: cuff released; modes not enabled
- **openhand** = HOLD alias: PRIMARY paste as open-hand offering lands
- **direct-honor** = Run D: direct + DISABLE_MOUSE = not emitted — correct
- **attach-ignore** = Run E / Run G: attach ignores both opt-outs
- **mouse-1000** = ESC[?1000h emitted on attach
- **mouse-1002** = ESC[?1002h emitted on attach
- **mouse-1003** = ESC[?1003h emitted on attach
- **mouse-1006** = ESC[?1006h emitted on attach
- **primary-paste** = middle-click PRIMARY-selection paste swallowed while attached
- **disable-mouse** = CLAUDE_CODE_DISABLE_MOUSE=1 ignored on attach
- **disable-clicks** = CLAUDE_CODE_DISABLE_MOUSE_CLICKS=1 ignored on attach
- **landing** = tilting-yard / iron glove / riveted cuff / mail sleeve
- **has-repro** = published shape: 2.1.270 Linux · Run D vs Run E vs Run G
- **cousins** = cite-only #91142 #73443 #66957 #71687 #73320 — do not rebuild; do not conflate
- **backups** = cite-only #93987 #93924 #93770 #93777 #94151 #94064 #94251 #94256 — do not auto-pick
- **fixtures** = tilting-yard / iron glove / riveted cuff / mail sleeve
- **walk** = published idle ungloved → attach-mouse → gauntlet
- **closed** = cousin #73443 closed 2026-08-17 — cite only

Verdicts: ungloved, gauntlet, attach-mouse, hold, barehanded, opted, native, released, openhand, direct-honor, attach-ignore, mouse-1000, mouse-1002, mouse-1003, mouse-1006, primary-paste, disable-mouse, disable-clicks, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **gauntlet** or already **ungloved**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the attach entry point enables mouse reporting without consulting CLAUDE_CODE_DISABLE_MOUSE / CLAUDE_CODE_DISABLE_MOUSE_CLICKS; the direct-launch path honors them (Run D not emitted; Run E / Run G emitted). Either the #73443 fix regressed or never covered `claude attach`. Invite verify against #94029 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94029](https://github.com/anthropics/claude-code/issues/94029)
- Cousins (cite-only — do NOT rebuild / do NOT conflate): #91142 open — attach enables NO mouse modes on Windows (inverse symptom, same code path). #73443 closed — footer nav re-enabled mouse ignoring DISABLE_MOUSE. #66957 closed — original Linux PRIMARY middle-click, closed pointing at DISABLE_MOUSE=1 which doesn't reach attach. #71687 — docs gap (mouse vars only on fullscreen page). #73320 open — DO_NOT_TRACK silently disables mouse clicks (different mechanism). Direct-launch with DISABLE_MOUSE=1 is the working control. #94029 is specifically attach ignoring both documented mouse opt-outs.
- Backups (data only; next focus only — do not auto-pick): #93987, #93924, #93770, #93777, #94151, #94064, #94251, #94256

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:linux, area:tui, regression, area:agent-view
- Version: Claude Code 2.1.270, Ubuntu/Debian Linux
- Attached background sessions (`claude attach <id>`) enable xterm mouse reporting unconditionally
- Modes: ESC[?1000h / 1002h / 1003h / 1006h
- Direct-launch `claude` in the same terminal/shell/version honors CLAUDE_CODE_DISABLE_MOUSE=1 (zero enables)
- Linux: middle-click PRIMARY-selection paste is swallowed while attached
- Shift+middle-click is the only workaround (not available in every terminal)
- Same root cause named when #73443 closed (2026-08-17) — either that fix regressed or never covered `claude attach`
- Docs carve out tui / CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN for attached sessions; no such exception for mouse opt-outs
- Terminal modes ARE restored on exit — not a stale-state bug
- Not #73320 (DO_NOT_TRACK / DISABLE_TELEMETRY unset)
- Evidence table: Run D (direct + DISABLE_MOUSE) = correct not emitted; Run E (attach + DISABLE_MOUSE) = BUG emitted; Run G (attach + DISABLE_MOUSE_CLICKS) = BUG emitted

Problem found: ATTACH-MOUSE — attach forces the iron glove on (mouse capture) even when the user ordered bare hands (DISABLE_MOUSE=1). Direct launch honors bare hands; attach always gloves.

Why Gauntlet: A *gauntlet* is the iron glove of the tilting-yard. The attach path forces that glove on even when the marshal (the documented opt-out) ordered bare hands. Direct launch rides ungloved. PRIMARY paste is the open-hand offering swallowed by the mailed fist. Lychgate/#94059 was a churchyard porch / stale Running record — DIFFERENT. Lictor was a purple fasces aisle — DIFFERENT. This booth is specifically attach-mouse on ignored mouse opt-outs — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: ungloved catalog page + node diagnostic encoding idle **ungloved** / seeded **gauntlet** / path **attach-mouse** so operators can score whether the booth is **gauntlet** or already **ungloved**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. CLAUDE_CODE_DISABLE_MOUSE=1 should suppress mouse capture in attached sessions as it does in directly-launched ones
2. Docs: set CLAUDE_CODE_DISABLE_MOUSE=1 to opt out of mouse capture so the terminal handles selection natively
3. Docs carve out tui and CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN for attached background sessions — no such exception for mouse opt-outs
4. CLAUDE_CODE_DISABLE_MOUSE_CLICKS=1 should also be honored on attach
5. Direct-launch with DISABLE_MOUSE=1 is the working control (Run D: not emitted)
6. Whatever lands should enable mouse reporting on attach AND honor both opt-outs

## Why not a clone

This is specifically: **ATTACHED BACKGROUND SESSIONS FORCE XTERM MOUSE CAPTURE EVEN WHEN THE USER ORDERED BARE HANDS — DIRECT LAUNCH HONORS DISABLE_MOUSE; ATTACH ALWAYS GLOVES.**

Novel paradigm: medieval tournament gauntlet / iron glove / riveted cuff / tilting-yard / mail sleeve / bare-hand vs armored fist / PRIMARY paste as open-hand offering — iron, steel, crimson, parchment, rivet gold, ash. New issue, new paradigm (attach-mouse), new UI/UX/fonts/colors, new scoring vocabulary. A tilting-yard glove, not a parish porch, purple fasces aisle, bailiff desk, Roman tablet, carnival tent, twilight coin-ledger, theatre prompt-corner, scriptorium desk, inquisitorial court, or fortress sallyport.

**NOT Lictor** (fasces-aisle). Different paradigm. Do not reuse attested / lictor.

**NOT Lychgate/#94059** (bg-task-stale). Different defect. NOT parish porch / coffin rest. Do not reuse reaped / lychgate / bg-task-stale.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / proscription / deny-list-hollow.

**NOT Thimblerig/#94174** (skill-row-carve). Different defect. NOT carnival cups / chalk tally. Do not reuse additive / thimblerig / skill-row-carve.

**NOT Fetchling/#94065** (skill-dollar-swap). Different defect. NOT fae twilight / coin-ledger. Do not reuse literal / fetchling / skill-dollar-swap.

**NOT Souffleur/#94031** (app-switch-echo-loss). Different defect. NOT theatre wings / prompt-corner. Do not reuse echoing / souffleur / app-switch-echo-loss.

**NOT Epitome/#94032** (summarized-thinking-force). Different defect. NOT classical scriptorium. Do not reuse unabridged / epitome / summarized-thinking-force.

**NOT Diabolica/#94040** (cannot-show-not-git). Different defect. NOT inquisitorial parchment-court. Do not reuse innocent / diabolica / cannot-show-not-git.

**NOT Sallyport/#94082** (reminder-secret-bypass). Different defect. NOT fortress / gatehouse. Do not reuse sealed / sallyport / reminder-secret-bypass.

Live: https://hermes-playground-green.vercel.app/gauntlet/

```
node --test projects/gauntlet/gauntlet.test.mjs
node projects/gauntlet/gauntlet.mjs projects/gauntlet/data/gauntlet.json
```
