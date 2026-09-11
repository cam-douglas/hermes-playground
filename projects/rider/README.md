# Rider

A **parliamentary clerk desk / bill-rider booth** — a rider clause stapled onto every tool-result attachment that rides past the user's instruction with no kill switch. Fonts **Libre Baskerville** (display) + **Source Sans 3** (sans) + **IBM Plex Mono** (mono). Palette: parchment cream `#F4EFE4`, iron-gall ink `#1A1F2B`, sealing-wax `#9B2D2D`, brass `#B08D57`, slate `#5C6570`, blot `#2E3644`. Light parchment desk UI. NOT theatrical followspot, NOT stone calendar / fasti, NOT mill weir, NOT sailing irons, NOT bow cathead, NOT film continuity, NOT Nullarbor, NOT petard, NOT greenroom, NOT attainder court.

A clerk blotter should show only the tool payload. Instead a planning directive is clipped onto essentially every tool result as `type=attachment`, outranks explicit user instruction, and has no documented opt-out.

Primary:

- [anthropics/claude-code#93683](https://github.com/anthropics/claude-code/issues/93683) (OPEN). Title: `Instruction injected into every tool result overrides explicit user instruction and has no opt-out`. Claude Code 2.1.268 · macOS darwin 25.6.0 · Model Opus 4.5 (1M). A directive is appended to essentially every tool result as a `type=attachment` entry: `First privately list what you need next; then request every item that doesn't depend on another's result in this one response.` It is not in any user configuration. It caused planning narration (`Privately, what I need next: 1. …`) before nearly every tool call across days/sessions/repos. User corrected **five times**; behavior regenerated each time because the instruction was re-injected on the next tool call. Evidence from one transcript: **195** `type=attachment` injections, **138** assistant reproductions, **5** user corrections; first injection at the session's first tool call. Ruled out: `~/.claude/CLAUDE.md`, UserPromptSubmit/PostToolUse hooks (timestamp only), settings.json, output-styles, project configs. No documented opt-out. Silently outranks explicit user instruction. Also teaches the wrong trust boundary (genuine instruction in the tool-result channel). Labels: bug, has repro, platform:macos, area:core. Cousins cite-only: #84070 CLOSED (injected system prompt lines override user CLAUDE.md/memory — related class; different injection surface); #64539 CLOSED (harness-injected control text and tool-result content share one untagged channel); #93673 OPEN (`/btw` appends "Never consult the advisor tool." to the user message — different path). Backups cite-only (next focus only — do not auto-pick): #93703 Monadnock, #93672 `idle_prompt` while background subagents running, #93652 Remote Control capacity silent session substitution, #93680 Bash mkdir via `/proc/self/fd`, #93618 Windows/Git Bash truncation+backslash, #93694 WSL Open-in paths, #93722 worktree connector disable-list (umbilical-candidate).

07:50 rider: a parliamentary clerk desk / bill-rider booth for #93683. Idle **plain** / seeded **ridden** / path **attachment-rider**. Score rider or admit plain.

Score rider or admit plain.

Idle word: **plain** (HOLD: tool results carry only their payload; user instruction prevails; no rider). Seeded word: **ridden** / #93683 (attachment rider re-injected every tool result). Path word: **attachment-rider**. Product score: **rider**. Never idle lit / due / flowing / underway / seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / untainted / voiced / lodged / kindled / flushed / solitary / hit or seeded dark / misfired / dammed / becalmed / raced / stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score rider or admit plain.**

- **plain** = IDLE: HOLD; tool results carry only their payload; user instruction prevails; no rider
- **ridden** = #93683 seeded path: attachment rider re-injected every tool result
- **rider** = product score word for a clerk desk whose dockets never stay payload-only
- **attachment-rider** = path word: rider clause rides past the user's instruction with no opt-out
- **hold** = HOLD alias for idle plain
- **staple** = planning directive clipped onto the docket as `type=attachment`
- **injection** = 195 `type=attachment` injections; first injection at the session's first tool call
- **correction** = five user corrections; each overwritten when the next tool result re-staples the rider
- **no-opt-out** = no documented kill switch in settings, CLAUDE.md, hooks, or output-styles
- **planning-narration** = assistant reproduces `Privately, what I need next: 1. …` (138 reproductions)
- **trust-boundary** = genuine instruction arrives in the tool-result channel
- **payload-only** = clerk blotter shows the tool payload alone
- **has-repro** = published shape: macOS 2.1.268; 195 attachments; 138 reproductions; 5 corrections
- **cousins** = cite-only #84070 #64539 #93673 — do not rebuild
- **backups** = cite-only #93703 #93672 #93652 #93680 #93618 #93694 #93722 — do not auto-pick
- **fixtures** = clerk blotter / house instruction / staple / wax well / trust channel
- **walk** = published idle plain → payload-only → injection → staple → planning-narration → correction → no-opt-out → trust-boundary → attachment-rider → rider

Verdicts: plain, ridden, rider, attachment-rider, hold, staple, injection, correction, no-opt-out, planning-narration, trust-boundary, payload-only, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the clerk desk is **ridden** / **rider** or already **plain**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): harness may be appending a planning directive as `type=attachment` on tool results outside user-configurable surfaces, so user corrections cannot stick. Invite verify against #93683 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93683](https://github.com/anthropics/claude-code/issues/93683)
- Cite-only cousins: #84070 (CLOSED — system-prompt injection vs CLAUDE.md; different surface), #64539 (CLOSED — untagged shared channel), #93673 (OPEN — `/btw` user-message append; different path)
- Backups (data only; next focus only — do not auto-pick): #93703, #93672, #93652, #93680, #93618, #93694, #93722

What happened (from the issue text — do not invent):

- OPEN.
- Claude Code 2.1.268 · macOS darwin 25.6.0 · Model Opus 4.5 (1M)
- Directive appended to essentially every tool result as `type=attachment`
- Text: `First privately list what you need next; then request every item that doesn't depend on another's result in this one response.`
- Not in any user configuration
- Planning narration before nearly every tool call across days/sessions/repos
- Five user corrections; behavior regenerated on the next tool call
- Transcript tally: 195 injections / 138 reproductions / 5 corrections
- First injection at the session's first tool call
- Ruled out: `~/.claude/CLAUDE.md`, UserPromptSubmit/PostToolUse hooks (timestamp only), settings.json, output-styles, project configs
- No documented opt-out
- Silently outranks explicit user instruction
- Wrong trust boundary: genuine instruction in the tool-result channel
- Labels: bug / has repro / platform:macos / area:core

Problem found: A PLANNING DIRECTIVE IS APPENDED TO ESSENTIALLY EVERY TOOL RESULT AS `type=attachment`; IT IS NOT USER-CONFIGURABLE, HAS NO OPT-OUT, AND OUTRANKS EXPLICIT USER INSTRUCTION.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the clerk desk stayed **plain** or went **ridden**. Educational bill-rider booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. User-configurable / settings or CLAUDE.md override; OR delivered via a system channel not tool output; OR explicit user instruction takes precedence

## Why not a clone

This is specifically: **A PLANNING DIRECTIVE IS STAPLED ONTO EVERY TOOL RESULT AS `type=attachment`; NO OPT-OUT; USER INSTRUCTION IS OUTRANKED.**

Novel paradigm: parliamentary clerk desk / bill-rider booth whose blotter should show only the tool payload; instead a rider clause is stapled onto every tool-result attachment and rides past the user's instruction with no kill switch.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Do not reuse lit / dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Anachronism/#93585** (cloud pre-warm vs session-start checkout race). Different defect. NOT continuity slate / darkroom. Do not reuse tip / stale / prewarm-latch.

**NOT Nullarbor/#93595** (plugin HTTP MCP `${VAR}` header expands empty). Different defect. NOT saltbush / empty-bearer. Do not reuse stamped / emptied / empty-expand.

**NOT Petard/#93607** (Linux Bash-tool `pkill -f` matches wrapper argv). Different defect. NOT siege petard. Do not reuse standing / hoisted / wrapper-argv.

**NOT Greenroom** (slug taken — theater green room / offstage waiting / mid-turn queue inject). Different defect. Do not reuse held / steered / greenroomed.

**NOT Attainder/#93529** (parked-permission retirement stamps `user-rejected`). Different defect. NOT court-of-attainder. Do not reuse untainted / attainted / retire-parked.

**NOT #84070** — cite only (system-prompt injection vs CLAUDE.md; different surface).

**NOT #64539** — cite only (untagged shared channel).

**NOT #93673** — cite only (`/btw` user-message append; different path).

Do NOT rename Rider to any existing catalog slug. Catalog currently has 300 products; Rider is #301.
Do NOT reuse idle lit / due / flowing / underway / seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / untainted / voiced / lodged / kindled / flushed / solitary / hit, or seeded dark / misfired / dammed / becalmed / raced / stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.
Display here is **Libre Baskerville**. Body is **Source Sans 3**. Mono is **IBM Plex Mono**.

Different surface: tool-result `type=attachment` rider vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist ignore vs scheduled WebSearch hang vs xnu ptmx race vs cloud pre-warm checkout vs lastRunAt-without-birth vs mid-turn queue inject vs parked-permission attainder.

Different UI: clerk blotter / house instruction / staple / wax well / trust channel. Libre Baskerville / Source Sans 3 / IBM Plex Mono. Parchment cream with iron-gall ink, sealing-wax, brass, slate, blot. NOT stage black. NOT marble fasti. NOT mill-house parchment. NOT Atlantic sailing. NOT oak timber. NOT green-room velvet. NOT court attainder.

Different verbs: Unstaple the rider, Score rider, Walk the bill, Compare plain / ridden, Pin idle plain, Pin seeded ridden, Pin attachment-rider, Hold the plain.

Different idle: **plain**. Different #93683 seeded path: **ridden**. HOLD: **plain** / **hold**. ALARM: **ridden** / **rider** / **attachment-rider** / **staple**. Path: **attachment-rider**.

## How to score

```bash
node --test projects/rider/rider.test.mjs
node projects/rider/rider.mjs projects/rider/data/ridden.json
echo '{"seed":"ridden"}' | node projects/rider/rider.mjs
```

Open the living card at `projects/rider/index.html` (or the live path `/rider/`). Buttons: Unstaple the rider, Score rider, Walk the bill, Compare plain / ridden, Pin idle plain, Pin seeded ridden, Pin attachment-rider, Hold the plain. Toggle chips for: staple, injection, correction, no-opt-out, planning-narration, trust-boundary, payload-only — the score flips. Lay a fixture JSON on the clerk blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s attachment-rider walk from the published #93683 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/rider/
- Folder: `projects/rider/`
