# Attainder

A **parchment bill-of-attainder / court-of-attainder booth** — wax seal, iron stamp, rolled parchment, clerk desk. Fonts **Old Standard TT** (display) + **Public Sans** (body) + **IBM Plex Mono** (mono). Palette: parchment `#E8DFC8`, ink `#1A1510`, wax-seal crimson `#8B1E1E`, iron `#4A4A48`, blot `#2C2416`, candle `#F0E6A8` — warm parchment court, not concert-hall velvet, not municipal storm-drain, not marsh foxfire, not conservation atelier, not chain-forge, not scapegoat altar.

Attainder is the court bill whose wax seal is stamped `user-rejected` after parked-permission retirement from an internal session reset, even though no prompt appeared and no keypress occurred.

Primary:

- [anthropics/claude-code#93529](https://github.com/anthropics/claude-code/issues/93529) (OPEN, bug, has repro, platform:windows, area:tools, area:core, area:mcp). Title: `Parked-permission "retirement" always stamps toolDenialKind:"user-rejected", even when the actual cause is an internal session reset (e.g. after /mcp reconnect), not a real user action`. Filed by dpc00 2026-09-11. Claude Code runtime **claude.exe v2.1.268** native Windows x64. Tool already in `settings.json` `permissions.allow`; **no permission prompt appeared**; user did not Esc/Ctrl+C. Internal parked-permission state machine tracks a tool awaiting `control_response`. Session-reset path `md()` aborts `abortController` and, unless `retireParkedPermission:false`, calls resume/retirement `Lo()` with default reason `"interrupt"`. Inside retirement, `toolDenialKind` / `non_execution_kind` is hardcoded to `"user-rejected"` with fixed denial string "The user doesn't want to proceed with this tool use..." even when the reason was an internal interrupt/session reset. Recurs after `/mcp` reconnect followed by calls to a different unrelated MCP server. Reproduced via `mcp__sublime-mcp__batch`; zero visible prompt. Distinct from #86001 (mid-execution interrupt wrong label — user DID interrupt) and #51674 (closed `not_planned`, same symptom/workaround, root cause unknown — this is the follow-up). Also related cite-only #47282 (earlier wording problem, stale-closed). Suggested fix direction in the issue: thread the real reason into `toolDenialKind`; reserve `user-rejected` for a genuine prompt "no". Cousins cite-only: #86001, #51674, #47282.

14:50 attainder: a parchment bill-of-attainder / court booth for #93529. Idle **untainted** / seeded **attainted** / path **retire-parked**. Score attainder or admit untainted.

Score attainder or admit untainted.

Idle word: **untainted** (HOLD: honest path when a real user rejection of a shown prompt is correctly labeled). Seeded word: **attainted** / #93529 (false user-rejected stamp from parked-permission retirement after internal session reset). Path word: **retire-parked**. Product score: **attainder**. Never idle voiced / muted / sourdine / mid-narration / lodged / dropped / forksink / source-fork / kindled / painted / foxfire / never-turns / flushed / lagged / one-behind / pentimento / solitary / twinlinked / bridge-refuse / vinculum / honest / scapegoated / ungranted / scapegoat.

Phrase: **when parked-permission retirement after an internal session reset stamps toolDenialKind user-rejected with no prompt and no keypress, score attainder or admit untainted.**

- **untainted** = IDLE: HOLD; a real user rejection of a shown prompt is correctly labeled
- **attainted** = #93529 seeded path: parked-permission retirement stamps `user-rejected` with no prompt and no keypress
- **attainder** = product score word for the court bill whose wax seal is falsely stamped
- **retire-parked** = path word: `md()` → `Lo("interrupt")` → `Uu()` retirement
- **hold** = HOLD alias for idle untainted
- **allow-listed** = tool already in `settings.json` `permissions.allow`
- **no-prompt** = no permission prompt appeared
- **no-keypress** = user did not Esc/Ctrl+C
- **session-reset** = `md()` aborts `abortController`
- **parked-permission** = state machine tracks a tool awaiting `control_response`
- **control-response** = parked entry has no persisted `control_response`
- **default-interrupt** = `Lo()` default reason `"interrupt"`
- **hardcoded-denial** = `toolDenialKind` / `non_execution_kind` hardcoded to `"user-rejected"`
- **user-rejected-stamp** = fixed denial string emitted for every affected `tool_use_id`
- **mcp-reconnect** = `/mcp` reconnect of an unrelated server, then calls to a different MCP
- **sublime-batch** = reproduced via `mcp__sublime-mcp__batch`
- **retire-parked-false** = unless `retireParkedPermission:false`
- **honest-outcome** = already-computed `retired_unanswered` / `retire_superseded` / `retire_write_failed`
- **genuine-no** = permission prompt shown and answered "no" — the honest `user-rejected`
- **has-repro** = claude.exe v2.1.268 · dpc00 · native Windows x64
- **cousins** = cite-only #86001 #51674 #47282 — do not rebuild
- **backups** = cite-only #93475 #93439 #93438 #93466 #93495 #93508 #93507 #93512 — do not auto-pick
- **fixtures** = roll / desk / stamp / seal table for the attainder booth
- **walk** = published idle untainted → allow-listed → no-prompt → no-keypress → mcp-reconnect → session-reset → parked-permission → default-interrupt → hardcoded-denial → retire-parked → attainder

Verdicts: untainted, attainted, attainder, retire-parked, hold, allow-listed, no-prompt, no-keypress, session-reset, parked-permission, control-response, default-interrupt, hardcoded-denial, user-rejected-stamp, mcp-reconnect, sublime-batch, retire-parked-false, honest-outcome, genuine-no, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the seal is **attainted** / **attainder** or already **untainted**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): session-reset path `md()` may abort `abortController` and, unless `retireParkedPermission:false`, call resume/retirement `Lo()` with default reason `"interrupt"`; inside retirement, `toolDenialKind` / `non_execution_kind` is hardcoded to `"user-rejected"` with a fixed denial string even when the reason was an internal interrupt/session reset. The already-computed outcome (`retired_unanswered` / `retire_superseded` / `retire_write_failed`) is discarded for the denial kind. Invite verify against #93529 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93529](https://github.com/anthropics/claude-code/issues/93529)
- Cite-only cousin: [anthropics/claude-code#86001](https://github.com/anthropics/claude-code/issues/86001) (OPEN mid-execution interrupt wrong label — user DID interrupt; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#51674](https://github.com/anthropics/claude-code/issues/51674) (CLOSED `not_planned`; same symptom/workaround; root cause unknown; this is the follow-up; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#47282](https://github.com/anthropics/claude-code/issues/47282) (CLOSED earlier wording problem, stale-closed; do not rebuild)
- Backup (data only): #93475 Effort selector needs a very tall terminal
- Backup (data only): #93439 Binary Read skips PreToolUse
- Backup (data only): #93438 Worktree cwd bleed
- Backup (data only): #93466 Directory Plugins duplicate cards
- Backup (data only): #93495 Desktop UNUserNotificationCenter deadlock
- Backup (data only): #93508 Documents preview_start TCC getcwd deny
- Backup (data only): #93507 Cowork egress allowlist regression
- Backup (data only): #93512 Cowork egress allowlist regression (sibling)

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:tools, area:core, area:mcp
- claude.exe **v2.1.268**; reporter dpc00; native Windows x64
- Tool already in `settings.json` `permissions.allow`
- No permission prompt appeared; user did not Esc/Ctrl+C
- Parked-permission state machine tracks a tool awaiting `control_response`
- `md()` aborts `abortController` and, unless `retireParkedPermission:false`, calls `Lo()` with default reason `"interrupt"`
- Retirement hardcodes `toolDenialKind` / `non_execution_kind` to `"user-rejected"`
- Recurs after `/mcp` reconnect followed by calls to a different unrelated MCP server
- Reproduced via `mcp__sublime-mcp__batch`; zero visible prompt

Problem found: PARKED-PERMISSION RETIREMENT ALWAYS STAMPS TOOLDENIALKIND USER-REJECTED AFTER AN INTERNAL SESSION RESET — NO PROMPT, NO KEYPRESS.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the seal stayed **untainted** or was **attainted**. Educational parchment court booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Thread the real reason (`timeout`, `denied`, `interrupt`, session reset) into `toolDenialKind` / `non_execution_kind`
2. Reserve `toolDenialKind:"user-rejected"` for cases where a permission prompt genuinely was shown and answered "no"
3. Every other path (timeout, session reset, reconnect-driven retirement, write failure) should use a distinct, honest `non_execution_kind`
4. Already-computed outcomes `retired_unanswered` / `retire_superseded` / `retire_write_failed` should not be discarded for a hardcoded user-rejected stamp

## Why not a clone

This is specifically: **PARKED-PERMISSION RETIREMENT STAMPS USER-REJECTED AFTER AN INTERNAL SESSION RESET** — parchment bill-of-attainder / court booth, not concert-hall velvet mute, not municipal storm-drain grate, not marsh foxfire lantern, not conservation atelier pentimento, not chain-forge vinculum, not scapegoat altar.

**NOT Sourdine/#93531** (MessageDisplay narration mute). Different defect. NOT concert-hall velvet / brass mute.

**NOT Forksink/#93458** (SessionStart additionalContext drop on source=fork). Different defect. NOT municipal grate / sodium lamp.

**NOT Foxfire/#93502** (Remote Control idle composer paint-without-turn). Different defect. NOT marsh lantern / peat / bioluminescence.

**NOT Pentimento/#93482** (device_commit_files overwrite one-behind). Different defect. NOT art-conservation / underpainting atelier.

**NOT Vinculum/#93485** (local-mode hardlink / cloud bridge-refuse). Different defect. NOT chain-forge / nlink gauges.

**NOT Scapegoat/#93348** (ungranted host blamed as page-loading). Different defect. NOT desert scapegoat altar.

**NOT Cachet/#93490.** **NOT Strobe.** **NOT Sump.** **NOT Spillway.** **NOT Quietus.** **NOT Rubric.** **NOT Recension.** **NOT Afterimage.** Different defects.

**NOT Procrustes** (MCP tool cull / iron bed). Different defect. This booth is a court of attainder for honest-label vs false-stamp gauges.

Do NOT rename this product Sourdine, Forksink, Foxfire, Pentimento, Vinculum, Scapegoat, Cachet, Strobe, Counterfoil, Lucida, Fomite, Snubber, Fosse, Hibernacle, Sump, Spillway, or any existing catalog slug.
Do NOT reuse idle untainted / attainted / retire-parked on a later booth.
Display here is **Old Standard TT**. Body is **Public Sans**. Mono is **IBM Plex Mono**.

Different surface: parked-permission retirement false user-rejected vs MessageDisplay narration mute vs SessionStart fork drop vs idle Remote Control paint-without-turn vs overwrite one-behind.

Different UI: wax seal / iron stamp / rolled parchment / clerk-desk gauges. Old Standard TT / Public Sans / IBM Plex Mono. Warm parchment court. NOT concert-hall velvet. NOT municipal grate. NOT marsh lantern. NOT conservation atelier. NOT chain-forge. NOT scapegoat altar.

Different verbs: Unroll the bill, Score attainder, Stamp the seal, Compare clerk / court, Pin idle untainted, Pin seeded attainted, Pin retire-parked, Clear the docket.

Different idle: **untainted**. Different #93529 seeded path: **attainted**. HOLD: **untainted** / **hold**. ALARM: **attainted** / **attainder** / **retire-parked** / **hardcoded-denial**. Path: **retire-parked**.

## How to score

```bash
node --test projects/attainder/attainder.test.mjs
node projects/attainder/attainder.mjs projects/attainder/data/attainted.json
echo '{"seed":"attainted"}' | node projects/attainder/attainder.mjs
```

Open the living card at `projects/attainder/index.html` (or the live path `/attainder/`). Buttons: Unroll the bill, Score attainder, Stamp the seal, Compare clerk / court, Pin idle untainted, Pin seeded attainted, Pin retire-parked, Clear the docket. Toggle allow-listed / no-prompt / no-keypress / session-reset / parked-permission / hardcoded-denial — the score flips. Lay a fixture JSON on the clerk desk. `?embed=1` hides chrome.

The booth reconstructs the reporter’s retire-parked walk from the published #93529 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/attainder/
- Folder: `projects/attainder/`
