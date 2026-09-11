# Sourdine

A **concert-hall practice-mute / brass-mute booth** — velvet curtain, warm stage lamp, brass mute, sheet-music stand. Fonts **Cormorant Garamond** (display) + **Outfit** (body) + **JetBrains Mono** (mono). Palette: velvet `#1a1218`, brass `#C9A227`, stage warm `#F2C14E`, curtain wine `#6B2D3C`, sheet `#EDE6D9`, ink `#120e12` — light-on-dark hall, not municipal storm-drain, not marsh foxfire, not conservation atelier, not chain-forge, not wax blotter, not hangar strobe.

Sourdine is the practice mute whose attack and cadence still speak through MessageDisplay, while the mid-phrase is muted from hooks even though the audience still hears the summarized narration on stage.

Primary:

- [anthropics/claude-code#93531](https://github.com/anthropics/claude-code/issues/93531) (OPEN, bug, has repro, platform:windows, platform:vscode, area:hooks, regression). Title: `[BUG] MessageDisplay no longer fires for text between tool calls (regression)`. Filed by Liv3wir3d 2026-09-11. Claude Code runtime **2.1.267** (VS Code extension); last working **2.1.266**. Mid-turn prose between tool calls is replaced server-side by summarized thinking blocks tagged `block_kind: narration` and shown with a `(summarized)` label. `MessageDisplay` no longer fires for those updates. Only the first message of a turn and the final answer still reach the hook. Original prose is not stored. Impact: TTS/read-aloud hooks go silent mid-turn; redaction hooks cannot catch narration that users still see on screen. `CLAUDE_CODE_ENABLE_NARRATION=0` does not restore MessageDisplay for these blocks (it appears to control the spinner status line, `querySource: "narration"`). Environment: Windows; VS Code integrated terminal; Opus (`claude-opus-5`); Anthropic API. Repro: register an http MessageDisplay hook at `http://localhost:8765/hooks/message`; give Claude a multi-step task that writes findings between tool calls. Trivial batched tool calls may not repro. Timeline: 03:14:03 first text fires; 03:14:08–03:14:23 four `(summarized)` narration rows with no hook; 03:14:35 final fires. Feedback ID `043a59d5-4228-4590-a7cc-c6903546840f`. Cousins cite-only: #88646 (MessageDisplay dual-hook race), #82001 (UserInputChange feature mirroring MessageDisplay), #85773 (closed: TUI drops displayContent), #88338 (PostToolUse rewrite collisions).

13:50 sourdine: a concert-hall practice-mute / sourdine booth for #93531. Idle **voiced** / seeded **muted** / path **mid-narration**. Score sourdine or admit voiced.

Score sourdine or admit voiced.

Idle word: **voiced** (HOLD: MessageDisplay fires for opening text + final answer as expected). Seeded word: **muted** / #93531 (narration/summarized mid-turn updates never call MessageDisplay). Path word: **mid-narration**. Product score: **sourdine**. Never idle lodged / dropped / forksink / source-fork / kindled / painted / foxfire / never-turns / flushed / lagged / one-behind / pentimento / solitary / twinlinked / bridge-refuse / vinculum / hit / flattened / string-carrier / cachet / steady / strobing / off-label / strobe.

Phrase: **when mid-turn prose is replaced by summarized narration that the hall still hears while MessageDisplay stays silent, score sourdine or admit voiced.**

- **voiced** = IDLE: HOLD; MessageDisplay fires for first+final
- **muted** = #93531 seeded path: narration blocks skip the hook while the hall still hears `(summarized)`
- **sourdine** = product score word for the practice mute whose attack and cadence speak while the mid-phrase is muted from hooks
- **mid-narration** = path word: `block_kind: narration` between tool calls
- **hold** = HOLD alias for idle voiced
- **first-fires** = 03:14:03 opening text still reaches MessageDisplay
- **mid-summarized** = `(summarized)` narration painted on stage
- **hook-silent** = MessageDisplay never called for those updates
- **final-fires** = 03:14:35 final answer still reaches MessageDisplay
- **narration** = thinking blocks tagged `block_kind: narration`
- **summarized** = UI label; original prose is not stored
- **block-kind** = server summaries of the prose between tool calls, not the model's own reasoning
- **tts-silent** = read-aloud hooks go silent mid-turn
- **redaction-miss** = redaction hooks cannot catch narration the user still sees
- **env-no-effect** = `CLAUDE_CODE_ENABLE_NARRATION=0` does not restore MessageDisplay
- **trivial-no-repro** = batched tool calls with no prose between them do not reproduce
- **multi-step** = multi-step task needed
- **http-hook** = http MessageDisplay hook at localhost:8765
- **has-repro** = Claude Code 2.1.267 · Liv3wir3d · Windows · VS Code extension
- **cousins** = cite-only #88646 #82001 #85773 #88338 — do not rebuild
- **backups** = cite-only #93475 #93439 #93438 #93466 #93495 #93529 #93508 — do not auto-pick
- **fixtures** = attack / phrase / cadence / mute table for the sourdine booth
- **walk** = published idle voiced → first-fires → mid-summarized → hook-silent → final-fires → mid-narration → sourdine

Verdicts: voiced, muted, sourdine, mid-narration, hold, first-fires, mid-summarized, hook-silent, final-fires, narration, summarized, block-kind, tts-silent, redaction-miss, env-no-effect, trivial-no-repro, multi-step, http-hook, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the mute is **muted** / **sourdine** or already **voiced**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): server-side narration replacement (`block_kind: narration`) may bypass the MessageDisplay hook pipeline while still rendering summarized text in the UI. The env var appears to control the spinner status line (`querySource: "narration"`), not this path. Invite verify against #93531 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93531](https://github.com/anthropics/claude-code/issues/93531)
- Cite-only cousin: [anthropics/claude-code#88646](https://github.com/anthropics/claude-code/issues/88646) (OPEN MessageDisplay dual-hook race; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#82001](https://github.com/anthropics/claude-code/issues/82001) (OPEN UserInputChange feature mirroring MessageDisplay; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#85773](https://github.com/anthropics/claude-code/issues/85773) (CLOSED TUI drops displayContent; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#88338](https://github.com/anthropics/claude-code/issues/88338) (OPEN PostToolUse rewrite collisions; do not rebuild)
- Backup (data only): #93475 Effort selector needs a very tall terminal
- Backup (data only): #93439 Binary Read skips PreToolUse
- Backup (data only): #93438 Worktree cwd bleed
- Backup (data only): #93466 Directory Plugins duplicate cards
- Backup (data only): #93495 Desktop UNUserNotificationCenter deadlock
- Backup (data only): #93529 Parked-permission retirement always stamps toolDenialKind: user-rejected
- Backup (data only): #93508 Documents preview_start TCC getcwd deny

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, platform:vscode, area:hooks, regression
- Claude Code **2.1.267**; last working **2.1.266**; reporter Liv3wir3d; Windows; VS Code extension
- First text and final answer still fire MessageDisplay
- Four `(summarized)` narration rows between tool calls never call the hook
- `CLAUDE_CODE_ENABLE_NARRATION=0` does not restore MessageDisplay
- Multi-step task needed; trivial batched tool calls may not repro

Problem found: MESSAGEDISPLAY NO LONGER FIRES FOR TEXT BETWEEN TOOL CALLS — NARRATION BLOCKS SKIP THE HOOK WHILE THE HALL STILL HEARS SUMMARIZED PROSE.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the mute stayed **voiced** or was **muted**. Educational concert-hall practice-mute booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. MessageDisplay fires for every update shown on screen, including narration blocks — ideally with a field marking them as narration
2. or a setting turns server-side narration off so updates between tool calls arrive as normal text again
3. `CLAUDE_CODE_ENABLE_NARRATION=0` currently does not restore MessageDisplay for these blocks
4. TTS/read-aloud hooks stay silent mid-turn; redaction hooks cannot catch narration the user still sees

## Why not a clone

This is specifically: **MESSAGEDISPLAY NO LONGER FIRES FOR NARRATION BETWEEN TOOL CALLS** — concert-hall practice-mute booth, not municipal storm-drain grate, not marsh foxfire lantern, not conservation atelier pentimento, not chain-forge vinculum, not wax-cachet blotter, not hangar strobe.

**NOT Forksink/#93458** (SessionStart additionalContext drop on source=fork). Different defect. NOT municipal grate / sodium lamp.

**NOT Foxfire/#93502** (Remote Control idle composer paint-without-turn). Different defect. NOT marsh lantern / peat / bioluminescence.

**NOT Pentimento/#93482** (device_commit_files overwrite one-behind). Different defect. NOT art-conservation / underpainting atelier.

**NOT Vinculum/#93485** (local-mode hardlink / cloud bridge-refuse). Different defect. NOT chain-forge / nlink gauges.

**NOT Cachet/#93490** (Fable resume string-carrier bust). Different defect. NOT diplomatic wax-cachet blotter.

**NOT Strobe/#93468.** **NOT Sump.** **NOT Spillway.** **NOT Quietus.** **NOT Rubric.** **NOT Recension.** **NOT Afterimage.** Different defects.

**NOT Procrustes** (MCP tool cull / iron bed). Different defect. This booth is a concert-hall mute for hall-hears vs hook-silent gauges.

Do NOT rename this product Forksink, Foxfire, Pentimento, Vinculum, Cachet, Strobe, Counterfoil, Lucida, Fomite, Snubber, Fosse, Hibernacle, Sump, Spillway, or any existing catalog slug.
Do NOT reuse idle voiced / muted / mid-narration on a later booth.
Display here is **Cormorant Garamond**. Body is **Outfit**. Mono is **JetBrains Mono**.

Different surface: MessageDisplay narration mute vs SessionStart fork drop vs idle Remote Control paint-without-turn vs overwrite one-behind.

Different UI: velvet curtain / brass mute / stage lamp / music-stand gauges. Cormorant Garamond / Outfit / JetBrains Mono. Warm hall. NOT municipal grate. NOT marsh lantern. NOT conservation atelier. NOT chain-forge. NOT wax-cachet blotter. NOT hangar strobe.

Different verbs: Seat the hall, Score sourdine, Sound the mute, Compare hall / hook, Pin idle voiced, Pin seeded muted, Pin mid-narration, Clear the stand.

Different idle: **voiced**. Different #93531 seeded path: **muted**. HOLD: **voiced** / **hold**. ALARM: **muted** / **sourdine** / **mid-narration** / **hook-silent**. Path: **mid-narration**.

## How to score

```bash
node --test projects/sourdine/sourdine.test.mjs
node projects/sourdine/sourdine.mjs projects/sourdine/data/muted.json
echo '{"seed":"muted"}' | node projects/sourdine/sourdine.mjs
```

Open the living card at `projects/sourdine/index.html` (or the live path `/sourdine/`). Buttons: Seat the hall, Score sourdine, Sound the mute, Compare hall / hook, Pin idle voiced, Pin seeded muted, Pin mid-narration, Clear the stand. Toggle first-fires / (summarized) / hook-silent / final-fires / block_kind / env-no-effect — the score flips. Lay a fixture JSON on the music stand. `?embed=1` hides chrome.

The booth reconstructs the reporter’s mid-narration walk from the published #93531 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/sourdine/
- Folder: `projects/sourdine/`
