# Springe

A **trapper's springe / snare-setter bench** — woodland parchment, bronze snare wire, moss, field-journal folio; Bodoni Moda + Nunito Sans + IBM Plex Mono — for a real Claude Code defect: **PLUGIN-NATIVE PRETOOLUSE HOOKS (AUTO-DISCOVERED VIA HOOKS/HOOKS.JSON) ARE NOT ENFORCED IN INTERACTIVE SESSIONS.** When the deny is correctly enforced, the springe is **sprung**.

Primary:

- [anthropics/claude-code#92675](https://github.com/anthropics/claude-code/issues/92675) (OPEN, bug, has repro, platform:windows, area:hooks, area:plugins, area:permissions). Title: `Plugin-native PreToolUse hooks (auto-discovered via hooks/hooks.json) are not enforced in interactive sessions — exit-2 works only in print mode, JSON permissionDecision:"deny" doesn't work in either mode`. Filed 2026-09-07T14:23:15Z. Updated 2026-09-07T14:24:27Z. Reporter: BuildSmarterAI. 0 comments.

02:50 springe: a trapper's springe bench that should catch a plugin-native PreToolUse deny but instead slips in the interactive session — exit-2 works only in print mode; JSON permissionDecision:"deny" fails in both modes; settings.json exit-2 is the control that still blocks (#92675). Score slipped or admit sprung.

Idle word: **slipped** (ALARM: plugin hook deny silently no-ops). Seeded state: **sprung** / HOLD (deny correctly enforced). Never idle as misrouted, severed, adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled. Never seeded as addressed, remoored, reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole.

**Springe** = a hunter's snare / springe that should catch but slips. A plugin-native PreToolUse hook auto-discovered from `hooks/hooks.json` should be enforced identically to a `settings.json`-declared hook. Instead the noose **slipped**.

- **slipped** = IDLE: ALARM; plugin deny silently no-ops
- **sprung** = seeded word: deny correctly enforced
- **settings-exit2-blocks** = control: settings.json deploy-guard.js exit-2 blocked interactively
- **plugin-exit2-interactive-slip** = plugin block-no-verify.js exit-2 did not block interactive
- **plugin-exit2-print-blocks** = same plugin exit-2 hook does block print mode
- **plugin-json-deny-both-modes-slip** = plugin JSON permissionDecision deny slips interactive and print
- **matcher-general-not-bash-only** = config-protection.js Edit|Write also slips interactive
- **hook-logic-correct-standalone** = module / dispatcher / bootstrap emit correct deny JSON
- **cache-byte-identical** = cached ecc@ecc 2.2.1 snapshot matches source
- **three-axis-isolation** = source × protocol × mode
- **cousins** = cite-only #10875 / #52822 / #31250
- **has-clear-repro** = issue labeled has repro

Verdicts: slipped, sprung, settings-exit2-blocks, plugin-exit2-interactive-slip, plugin-exit2-print-blocks, plugin-json-deny-both-modes-slip, matcher-general-not-bash-only, hook-logic-correct-standalone, cache-byte-identical, three-axis-isolation, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a plugin-native PreToolUse deny would leave the springe **slipped** or already **sprung**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): the interactive path may load/execute plugin hooks without gating tool calls on their result; JSON permissionDecision may never be consumed for plugin-sourced PreToolUse results even when the process runs correctly. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92675](https://github.com/anthropics/claude-code/issues/92675)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#10875](https://github.com/anthropics/claude-code/issues/10875) — closed; plugin hook stdout not captured
  - [anthropics/claude-code#52822](https://github.com/anthropics/claude-code/issues/52822) — closed; permissionDecision allow not honored interactively
  - [anthropics/claude-code#31250](https://github.com/anthropics/claude-code/issues/31250) — closed/stale; PreToolUse silent fail

What happened (from the issue body — do not invent):

- OS: Windows 11 (10.0.26200); Git Bash; Claude Code 2.1.263; plugin `everything-claude-code` / `ecc@ecc` v2.2.1
- Matrix:
  1. settings.json-declared + exit-2 → blocks interactive AND print
  2. plugin-native hooks/hooks.json + exit-2 → does NOT block interactive; DOES block print
  3. plugin-native + JSON permissionDecision:"deny" → does NOT block interactive OR print
- Control: settings.json deploy-guard.js blocked the interactive deploy-shaped probe
- Plugin exit-2 Bash matcher (block-no-verify.js): interactive probe ran to completion; print mode blocked with expected stderr
- Plugin exit-2 Edit|Write (config-protection.js): interactive edit of a protected-config-shaped file not blocked
- Plugin JSON deny (gateguard-fact-force.js): interactive and print both executed; hook module/dispatcher/bootstrap all emit correct deny JSON when run standalone; cached plugin snapshot byte-identical to source

Problem found: PLUGIN-NATIVE PRETOOLUSE DENY IS NOT ENFORCED INTERACTIVELY — JSON DENY FAILS IN BOTH MODES.

Why this solution: a diagnostic scorer for the slipped → sprung springe chain, so a reader can admit idle slipped, pin seeded sprung, and score settings-exit2-blocks / plugin-exit2-interactive-slip / plugin-exit2-print-blocks / plugin-json-deny-both-modes-slip / matcher-general-not-bash-only / hook-logic-correct-standalone / cache-byte-identical / three-axis-isolation / cousins against the published facts.

## Why not a clone

This is specifically: **PLUGIN-NATIVE PRETOOLUSE HOOKS AUTO-DISCOVERED FROM HOOKS/HOOKS.JSON ARE NOT ENFORCED IN INTERACTIVE SESSIONS.**

**NOT Waybill #92624** (named spawn foreign session id).

**NOT Snatch #92583** (session-end never reaps auto-backgrounded Bash orphans).

**NOT Speakpipe #92646** (Desktop overbroad SendMessage ban).

**NOT Afterimage #92596 / Limber #92590 / Chock #92582 / Deadman #92593 / Eidolon #92601 / Gangway / Oubliette #92095.**

**NOT Bitts / Sounder / Callboard / Knock / Annunciator.**

Cousins cite-only (NOT primary): #10875, #52822, #31250. Different surfaces. Do not auto-pick as thesis.

Do NOT rename this product Waybill, Snatch, Speakpipe, Afterimage, Limber, Chock, Deadman, Eidolon, Gangway, Oubliette, Sounder, Callboard, Knock, or Annunciator.
Do NOT reuse idle misrouted / severed / adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled.
Do NOT reuse seeded addressed / remoored / reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole.

Different surface: PLUGIN-NATIVE PRETOOLUSE ENFORCEMENT vs named-spawn foreign session id / session-end unreaped Bash orphans / Desktop overbroad SendMessage ban / Windows text paint deferral / unexpanded `$TMPDIR` / settings-layer read-fence miss / mid-incident timeout leftover / ENOENT fake notice.

Product name stays **Springe**. Name/slug `springe` confirmed unused in catalog.json (208 products before this ship; Gangway is #208).

Different UI: trapper's springe / snare-setter desk / woodland parchment / bronze snare wire / moss / field-journal folio / source×protocol×mode matrix. Bodoni Moda / Nunito Sans / IBM Plex Mono. NOT Oswald/Source Sans 3. NOT Newsreader/Figtree/Fragment Mono. NOT Big Shoulders Display/Public Sans/Roboto Mono.

Different verbs: Score the springe, Pin idle slipped, Pin seeded sprung, Admit sprung, Load fixtures, Reset to sprung, Tension the wire, Spring the noose.

Different idle: **slipped**. Different seeded: **sprung**. HOLD: **sprung**. ALARM: **slipped** / **settings-exit2-blocks** / **plugin-exit2-interactive-slip** / **plugin-exit2-print-blocks** / **plugin-json-deny-both-modes-slip** / **matcher-general-not-bash-only** / **hook-logic-correct-standalone** / **cache-byte-identical** / **three-axis-isolation** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/springe/hook/springe.test.mjs
node projects/springe/hook/index.mjs projects/springe/data/92675.json
echo '{"seed":"sprung","sprung":true}' | node projects/springe/hook/index.mjs
```

Open the living card at `projects/springe/index.html` (or the live path). Buttons: Score the springe, Pin idle slipped, Pin seeded sprung, Admit sprung, Load fixtures, Reset to sprung. Tension the wire. Spring the noose. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/springe/
- Subdomain: https://springe.hermes-playground-green.vercel.app
- Folder: `projects/springe/`
