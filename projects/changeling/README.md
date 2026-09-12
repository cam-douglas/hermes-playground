# Changeling

A **fairy-court / cradle-swap booth** — the pledged heir is swapped for a lookalike while the court ledger still names the rightful child. Fonts **Cinzel** (display) + **Lexend** (UI) + **JetBrains Mono** (chips). Palette: moonlit moss `#1B2A24`, pale linen `#E8E2D4`, fairy-gold `#C6A15B`, bruise-violet `#5C4A7A`, ash `#2E2E2E`. Cradle / court ledger / swapped swaddling / remote latch / model identity token / invisible reinjection. NOT a lexicographer/homograph desk (Homograph), NOT a printer-galley wet-proof (Galley), NOT a chancery/wax-seal (Rescript), NOT trig survey (Monadnock), NOT parliamentary rider (Rider), NOT theatrical followspot (Followspot), NOT calendar/weir/sailing/cathead/anachronism.

A session pledged with `/model` should stay on that heir. Instead remote reconnect re-injects the global default from `settings.json`, with no notification, while the ledger still names the pledged child.

Primary:

- [anthropics/claude-code#93757](https://github.com/anthropics/claude-code/issues/93757) (OPEN). Title: `Session reconnect silently discards an explicit /model choice and falls back to the global default`. Labels: bug, has repro, platform:windows, area:cost, area:model. Attaching to a session by remote control from another machine, then resuming it on its host, replaces the model the user set with `/model` with the global default from `settings.json`, with no notification. Every `remote_session_change` re-injects a model identity attachment; the value re-asserted is the global default rather than the session's explicit choice. UI and session metadata continue to report the user's chosen model, so the substitution is invisible inside the app. Reporter: session ran 293 calls on `claude-fable-5-1` over ~16 hours while the app reported `claude-opus-5` throughout. Further defects: `set_session_model` reported success without taking effect; only `/model` inside the session could fix it. Environment: Claude Code desktop 1.52386.0 (Code tab), Agent SDK 0.3.266, Windows 11 Pro; global default `fable[1m]` in settings.json; session in app worktree. Repro: set global default → start session → `/model claude-opus-5` (confirmed) → attach via remote control from second machine → return to host and resume → next messages silently on global default; model picker still shows Opus. Detection only via `message.model` in raw transcript under `~/.claude/projects/**/*.jsonl`. Expected: keep chosen model, or clearly say it reset to default. Cousins cite-only: #82466 (settings.json default / `/model` switch), #78654 (`/model` Enter persists globally), #87334 (picker overrides `[1m]` default), #93154 (Remote SSH reconnect destroys sessions), #92235 (mobile duplicate session on reconnect). Backups cite-only (next focus only — do not auto-pick): #93746 #93744 #93722 #93672 #93652 #93680 #93618 #93694.

12:50 changeling: a fairy-court / cradle-swap booth for #93757. Idle **pledged** / seeded **swapped** / path **remote-reattach**. Score changeling or admit pledged.

Score changeling or admit pledged.

Idle word: **pledged** (HOLD: session keeps explicit `/model` choice). Seeded word: **swapped** / #93757 (remote reconnect reinjects global default). Path word: **remote-reattach**. Product score: **changeling**. Never idle distinct / collided / lossy-slug / homograph / dry / billed / stop-dirty / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / lit / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / nullarbor / standing / petard / raised / aposiopesis / seised / disseisin / ordered / analepsis / viewed / monstrance / sealed / cipherlock / untainted / attainder / voiced / sourdine / kindled / foxfire / flushed / pentimento or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score changeling or admit pledged.**

- **pledged** = IDLE: HOLD; session keeps explicit `/model` choice
- **swapped** = #93757 seeded path: remote reconnect reinjects global default
- **changeling** = product score word for a pledged heir swapped for a lookalike
- **remote-reattach** = path word: attach via remote control, then host resume
- **hold** = HOLD alias for idle pledged
- **keep-chosen** = expected write: re-assert the session's explicit `/model` choice
- **notify-reset** = expected write: clearly say the model reset to default
- **remote-latch** = attach from a second machine
- **identity-token** = model identity attachment re-injected on `remote_session_change`
- **invisible-reinject** = value re-asserted is the global default; no notification
- **ledger-lie** = UI and session metadata still name the pledged model
- **fable-default** = global default `fable[1m]` / 293 calls on `claude-fable-5-1`
- **opus-pledged** = session `/model claude-opus-5` (confirmed)
- **host-resume** = return to host and resume
- **set-session-noop** = `set_session_model` reported success without taking effect
- **transcript-only** = detection only via `message.model` in `~/.claude/projects/**/*.jsonl`
- **has-repro** = published shape: `/model` Opus → remote attach → host resume → silent fable; picker still Opus
- **cousins** = cite-only #82466 #78654 #87334 #93154 #92235 — do not rebuild
- **backups** = cite-only #93746 #93744 #93722 #93672 #93652 #93680 #93618 #93694 — do not auto-pick
- **fixtures** = cradle / court ledger / swapped swaddling / remote latch / model identity token / invisible reinjection
- **walk** = published idle pledged → opus-pledged → remote-latch → host-resume → remote-reattach → identity-token → invisible-reinject → ledger-lie → fable-default → transcript-only → changeling

Verdicts: pledged, swapped, changeling, remote-reattach, hold, keep-chosen, notify-reset, remote-latch, identity-token, invisible-reinject, ledger-lie, fable-default, opus-pledged, host-resume, set-session-noop, transcript-only, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **swapped** / **changeling** or already **pledged**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): on `remote_session_change`, re-assert the session's explicit `/model` choice (or notify on reset). Invite verify against #93757 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93757](https://github.com/anthropics/claude-code/issues/93757)
- Cite-only cousins: #82466 (settings.json default not honored; `/model` switch unreliable), #78654 (`/model` Enter persists globally vs session scope), #87334 (picker overrides saved `[1m]` default), #93154 (Remote SSH reconnect destroys sessions instead of reattaching), #92235 (mobile duplicate session on every remote reconnect)
- Backups (data only; next focus only — do not auto-pick): #93746, #93744, #93722, #93672, #93652, #93680, #93618, #93694

What happened (from the issue text — do not invent):

- OPEN.
- Labels: bug / has repro / platform:windows / area:cost / area:model
- Attaching to a session by remote control from another machine, then resuming it on its host, replaces the model the user set with `/model` with the global default from `settings.json`, with no notification
- Every `remote_session_change` re-injects a model identity attachment; the value re-asserted is the global default rather than the session's explicit choice
- UI and session metadata continue to report the user's chosen model, so the substitution is invisible inside the app
- Reporter: session ran 293 calls on `claude-fable-5-1` over ~16 hours while the app reported `claude-opus-5` throughout
- `set_session_model` reported success without taking effect; only `/model` inside the session could fix it
- Environment: Claude Code desktop 1.52386.0 (Code tab), Agent SDK 0.3.266, Windows 11 Pro; global default `fable[1m]` in settings.json; session in app worktree
- Repro: set global default → start session → `/model claude-opus-5` (confirmed) → attach via remote control from second machine → return to host and resume → next messages silently on global default; model picker still shows Opus
- Detection only via `message.model` in raw transcript under `~/.claude/projects/**/*.jsonl`
- Expected: keep chosen model, or clearly say it reset to default

Problem found: SESSION RECONNECT SILENTLY DISCARDS AN EXPLICIT `/MODEL` CHOICE AND FALLS BACK TO THE GLOBAL DEFAULT WHILE THE UI STILL NAMES THE PLEDGED MODEL.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the booth stayed **pledged** or went **swapped**. Educational fairy-court / cradle-swap booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Keep the session's explicit `/model` choice across remote attach and host resume, or clearly say the model reset to the global default; on `remote_session_change`, re-assert the session choice rather than `settings.json`

## Why not a clone

This is specifically: **REMOTE RECONNECT RE-INJECTS THE GLOBAL DEFAULT ON `remote_session_change` SO A SESSION PLEDGED WITH `/MODEL` RUNS ON THE LOOKALIKE WHILE THE COURT LEDGER STILL NAMES THE RIGHTFUL CHILD.**

Novel paradigm: fairy-court / cradle-swap booth — the pledged heir is swapped for a lookalike while the court ledger still names the rightful child.

**NOT Homograph** (non-ASCII path slug collision). Different defect. NOT lexicographer / headword / lemma. Do not reuse distinct / collided / lossy-slug.

**NOT Galley/#93745** (Stop dirty-tree full-turn bill). Different defect. NOT printer’s tray / unbound sheets. Do not reuse dry / billed / stop-dirty.

**NOT Rescript/#93742** (`/model` save-as-default scrapes settings.json). Different defect. NOT chancery / wax-seal. Do not reuse intact / scraped / snapshot-write.

**NOT Monadnock/#93703** (nested submodule worktree from local main). Different defect. NOT trig survey / residual mountain. Do not reuse fresh / residual / submodule-base.

**NOT Rider/#93683** (tool-result `type=attachment` rider). Different defect. NOT parliamentary clerk desk / bill-rider. Do not reuse plain / ridden / attachment-rider.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Do not reuse lit / dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Anachronism/#93585** (cloud pre-warm vs session-start checkout race). Different defect. NOT continuity slate / darkroom. Do not reuse tip / prewarm-latch.

Do NOT rename Changeling to any existing catalog slug. Catalog currently has 305 products; Changeling is #306.
Do NOT reuse idle distinct / collided / lossy-slug / homograph / dry / billed / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / lit / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / standing / raised / seised / ordered / viewed / sealed / untainted / voiced / kindled / flushed, or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted.
Display here is **Cinzel**. Body is **Lexend**. Mono is **JetBrains Mono**.

Different surface: remote reconnect `/model` swap vs non-ASCII slug collision vs Stop dirty-tree full-turn bill vs `/model` snapshot-write vs nested-submodule worktree base vs tool-result attachment rider vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist vs scheduled WebSearch hang vs xnu ptmx race vs cloud pre-warm checkout.

Different UI: cradle / court ledger / swapped swaddling / remote latch / model identity token / invisible reinjection. Cinzel / Lexend / JetBrains Mono. Moonlit moss with pale linen, fairy-gold, bruise-violet, ash. NOT dictionary cream/indigo. NOT printer-galley soot/brass. NOT parchment chancery. NOT granite survey. NOT parchment clerk desk. NOT stage black. NOT marble fasti. NOT mill-house. NOT Atlantic sailing. NOT oak timber.

Different verbs: Keep the heir pledged, Score changeling, Walk the cradle-swap, Compare pledged / swapped, Pin idle pledged, Pin seeded swapped, Pin remote-reattach, Hold the pledged.

Different idle: **pledged**. Different #93757 seeded path: **swapped**. HOLD: **pledged** / **hold**. ALARM: **swapped** / **changeling** / **remote-reattach** / **invisible-reinject**. Path: **remote-reattach**.

## How to score

```bash
node --test projects/changeling/changeling.test.mjs
node projects/changeling/changeling.mjs projects/changeling/data/swapped.json
echo '{"seed":"swapped"}' | node projects/changeling/changeling.mjs
```

Open the living card at `projects/changeling/index.html` (or the live path `/changeling/`). Buttons: Keep the heir pledged, Score changeling, Walk the cradle-swap, Compare pledged / swapped, Pin idle pledged, Pin seeded swapped, Pin remote-reattach, Hold the pledged. Toggle chips for: remote-latch, invisible-reinject, remote-reattach, ledger-lie, fable-default, host-resume, identity-token — the score flips. Lay a fixture JSON on the court blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s remote-reattach walk from the published #93757 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/changeling/
- Folder: `projects/changeling/`
