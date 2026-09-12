# Innominate

An **innominate nameplate / blank-escutcheon booth** — the plate that should carry the accessible name of the chat Send/Stop control is blank, so screen readers and voice control cannot read or invoke it. Fonts **Fraunces** (display) + **Atkinson Hyperlegible** (UI — Braille Institute a11y face) + **IBM Plex Mono** (chips/mono). Palette: high-contrast ink `#12141A`, plate silver `#D7DCE5`, focus amber `#E8A317`, void `#0B0D12`, named teal `#2A9D8F`, blank crimson `#C1121F`. Blank nameplate / dual-state Send-Stop / focus-ring halo / live-region ticker / UIA Name meter / WCAG 4.1.2 plaque. NOT a candle-snuffer taper (Snuffer), NOT a fairy-court cradle-swap (Changeling), NOT a lexicographer/homograph desk (Homograph), NOT a printer-galley wet-proof (Galley), NOT a chancery/wax-seal (Rescript), NOT trig survey (Monadnock), NOT parliamentary rider (Rider), NOT theatrical followspot (Followspot), NOT calendar / weir / sailing / cathead, NOT Quench / Stopcock / Hasp / Scuttle / Aphonia / Muzzle / Escutcheon / Lacuna / Palimpsest / Oubliette / Ephemera / Annunciator / Tocsin / Knell, NOT a millimeter-slider or woodworking leftover.

The Send/Stop plate should stay **named** with a state-aware accessible name. Instead UIA Name is empty `""` in both states because children are **icon-only** and no aria-label is set.

Primary:

- [anthropics/claude-code#93769](https://github.com/anthropics/claude-code/issues/93769) (OPEN). Title: `Chat panel: Send/Stop button has no accessible name — breaks screen readers and voice control (WCAG 4.1.2), plus no documented way to stop an agent`. Labels: bug, has repro, area:a11y, platform:vscode. Claude Code for VS Code 2.1.268 / 2.1.269 (Windows 10); also checked 2.1.209 → 2.1.269. Main chat footer Send/Stop button is one `type:submit` control that flips Send↔Stop; children are icon-only. Measured with Windows UI Automation: UIA Name is empty `""` in BOTH states; no aria-label / aria-labelledby / title; AriaRole=button unlabeled. Screen readers hear only "button" (send vs stop indistinguishable); voice control cannot invoke it (needs accessible name). WCAG 2.2 SC 4.1.2 Name Role Value Level A failure on the control that can discard in-progress work. Live region announces "Claude is working." / "Ready for your input." etc. but does NOT give the button a name; mitigates event-stream users only. Same bundle correctly labels 23 other controls including sibling "Send side question". Button has been unlabeled across 2.1.209, 2.1.236 (when screen-reader support shipped), 2.1.259, 2.1.268/269 — not a recent regression. Docs advertise screen-reader support but document no way to STOP/interrupt; Enter sends; stop undocumented. Meta: a11y scoped as blind+hands-capable; motor-impaired voice users who see fine are also blocked by the same missing name. Suggested fix in the issue (narrative only — DO NOT implement in Claude Code): `aria-label={busy ? "Stop response" : "Send message"}` plus docs for interrupt. Cousins cite-only (do not rebuild): #86874 (transcript unnavigable block), #91606 (desktop tray empty tooltip), #89002 #88221 #87123 (AX screen-reader mode), #88839 (AskUserQuestion NVDA), #91058 (VoiceOver box-drawing), #70425 #74694 (broader a11y). Backups cite-only (next focus only — do not auto-pick): #93744 #93766 #93764 #93754 #93751 #93722 #93672 #93652 #93680 #93618 #93694 #93761.

14:50 innominate: an innominate nameplate / blank-escutcheon booth for #93769. Idle **named** / seeded **blank** / path **icon-only**. Score innominate or admit named.

Score innominate or admit named.

Idle word: **named** (HOLD: button has state-aware accessible name). Seeded word: **blank** / #93769 (empty UIA Name / no aria-label). Path word: **icon-only**. Product score: **innominate**. Never idle lit / snuffed / snuffer / ganged-or / pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / stop-dirty / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / nullarbor / standing / petard / raised / aposiopesis / seised / disseisin / ordered / analepsis / viewed / monstrance / sealed / cipherlock / untainted / attainder / voiced / sourdine / kindled / foxfire / flushed / pentimento or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score innominate or admit named.**

- **named** = IDLE: HOLD; button has a state-aware accessible name
- **blank** = #93769 seeded path: empty UIA Name / no aria-label
- **innominate** = product score word for a nameless plate over Send/Stop
- **icon-only** = path word: children are icon-only; visual swap is not a name
- **hold** = HOLD alias for idle named
- **label-button** = expected write: `aria-label={busy ? "Stop response" : "Send message"}`
- **empty-uia-name** = Windows UIA Name is empty `""` in both Send and Stop states
- **no-aria-label** = no aria-label / aria-labelledby / title on the footer button
- **live-region-only** = live region announces state; it does not name the plate
- **sibling-labeled** = same bundle labels 23 other controls including "Send side question"
- **wcag-412** = WCAG 2.2 SC 4.1.2 Name Role Value Level A
- **send-stop** = one `type:submit` control that flips Send↔Stop
- **voice-control** = voice control cannot invoke a nameless button
- **docs-gap** = docs advertise screen-reader support; stop / interrupt undocumented
- **long-standing** = unlabeled across 2.1.209, 2.1.236, 2.1.259, 2.1.268/269
- **has-repro** = published shape: UIA Name empty in both states; sibling labeled; live region talks
- **cousins** = cite-only #86874 #91606 #89002 #88221 #87123 #88839 #91058 #70425 #74694 — do not rebuild
- **backups** = cite-only #93744 #93766 #93764 #93754 #93751 #93722 #93672 #93652 #93680 #93618 #93694 #93761 — do not auto-pick
- **fixtures** = blank nameplate / dual-state Send-Stop / focus-ring halo / live-region ticker / UIA Name meter / WCAG 4.1.2 plaque
- **walk** = published idle named → send-stop → empty-uia-name → no-aria-label → icon-only → live-region-only → sibling-labeled → wcag-412 → voice-control → docs-gap → long-standing → icon-only → innominate

Verdicts: named, blank, innominate, icon-only, hold, label-button, empty-uia-name, no-aria-label, live-region-only, sibling-labeled, wcag-412, send-stop, voice-control, docs-gap, long-standing, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **blank** / **innominate** or already **named**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): `aria-label={busy ? "Stop response" : "Send message"}` plus docs for interrupt. Invite verify against #93769 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93769](https://github.com/anthropics/claude-code/issues/93769)
- Cite-only cousins: #86874 (transcript unnavigable block), #91606 (desktop tray empty tooltip), #89002 #88221 #87123 (AX screen-reader mode), #88839 (AskUserQuestion NVDA), #91058 (VoiceOver box-drawing), #70425 #74694 (broader a11y). Related a11y, not the main Send/Stop empty name.
- Backups (data only; next focus only — do not auto-pick): #93744, #93766, #93764, #93754, #93751, #93722, #93672, #93652, #93680, #93618, #93694, #93761

What happened (from the issue text — do not invent):

- OPEN.
- Labels: bug / has repro / area:a11y / platform:vscode
- Claude Code for VS Code 2.1.268 / 2.1.269 (Windows 10); also checked 2.1.209 → 2.1.269
- Main chat footer Send/Stop button is one `type:submit` control that flips Send↔Stop; children are icon-only
- Measured with Windows UI Automation: UIA Name is empty `""` in BOTH states; no aria-label / aria-labelledby / title; AriaRole=button unlabeled
- Screen readers hear only "button" (send vs stop indistinguishable); voice control cannot invoke it (needs accessible name)
- WCAG 2.2 SC 4.1.2 Name Role Value Level A failure on the control that can discard in-progress work
- Live region announces "Claude is working." / "Ready for your input." etc. but does NOT give the button a name; mitigates event-stream users only
- Same bundle correctly labels 23 other controls including sibling "Send side question"
- Button has been unlabeled across 2.1.209, 2.1.236 (when screen-reader support shipped), 2.1.259, 2.1.268/269 — not a recent regression
- Docs advertise screen-reader support but document no way to STOP/interrupt; Enter sends; stop undocumented
- Meta: a11y scoped as blind+hands-capable; motor-impaired voice users who see fine are also blocked by the same missing name
- Suggested fix in the issue (narrative only): `aria-label={busy ? "Stop response" : "Send message"}` plus docs for interrupt

Problem found: THE MOST CONSEQUENTIAL CHAT CONTROL (SEND/STOP) HAS NO ACCESSIBLE NAME IN EITHER STATE, SO SCREEN READERS AND VOICE CONTROL CANNOT DISTINGUISH OR INVOKE IT (WCAG 4.1.2), DESPITE ADVERTISED SCREEN-READER SUPPORT.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the booth stayed **named** or went **blank**. Educational innominate-plate / blank-escutcheon booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Give the button a state-aware accessible name (`aria-label={busy ? "Stop response" : "Send message"}`) and document how to interrupt

## Why not a clone

This is specifically: **THE MAIN SEND/STOP SUBMIT CONTROL SHIPS WITH AN EMPTY ACCESSIBLE NAME (ICON-ONLY CHILDREN) WHILE A LIVE REGION EXISTS AND SIBLING CONTROLS ARE LABELED.**

Novel paradigm: innominate nameplate / blank-escutcheon booth — the plate that should carry the accessible name is blank, so voice and screen readers cannot read or click it.

**NOT Snuffer/#93746** (`enableArtifact: false` kills scratchpad). Different defect. NOT candle-snuffer / taper / ganged OR. Do not reuse lit / snuffed / ganged-or.

**NOT Changeling/#93757** (remote reconnect discards `/model`). Different defect. NOT fairy-court / cradle-swap. Do not reuse pledged / swapped / remote-reattach.

**NOT Homograph/#93743** (non-ASCII path slug collision). Different defect. NOT lexicographer / headword / lemma. Do not reuse distinct / collided / lossy-slug.

**NOT Galley/#93745** (Stop dirty-tree full-turn bill). Different defect. NOT printer’s tray / unbound sheets. Do not reuse dry / billed / stop-dirty.

**NOT Rescript/#93742** (`/model` save-as-default scrapes settings.json). Different defect. NOT chancery / wax-seal. Do not reuse intact / scraped / snapshot-write.

**NOT Monadnock/#93703** (nested submodule worktree from local main). Different defect. NOT trig survey / residual mountain. Do not reuse fresh / residual / submodule-base.

**NOT Rider/#93683** (tool-result `type=attachment` rider). Different defect. NOT parliamentary clerk desk / bill-rider. Do not reuse plain / ridden / attachment-rider.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Idle **named** here means the Send/Stop plate has a name — not a followspot cue. Do not reuse dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Quench / Stopcock / Hasp / Scuttle / Aphonia / Muzzle / Escutcheon / Lacuna / Palimpsest / Oubliette / Ephemera / Annunciator / Tocsin / Knell** (different metaphors). Different defects. Do not rebuild.

Do NOT rename Innominate to any existing catalog slug. Catalog currently has 307 products; Innominate is #308.
Do NOT reuse idle lit / snuffed / snuffer / ganged-or / pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / standing / raised / seised / ordered / viewed / sealed / untainted / voiced / kindled / flushed, or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted.
Display here is **Fraunces**. Body is **Atkinson Hyperlegible**. Mono is **IBM Plex Mono**.

Different surface: main Send/Stop empty accessible name vs artifact/scratchpad ganged OR vs remote reconnect `/model` swap vs non-ASCII slug collision vs Stop dirty-tree full-turn bill vs `/model` snapshot-write vs nested-submodule worktree base vs tool-result attachment rider vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist vs scheduled WebSearch hang vs xnu ptmx race.

Different UI: blank nameplate / dual-state Send-Stop / focus-ring halo / live-region ticker / UIA Name meter / WCAG 4.1.2 plaque. Fraunces / Atkinson Hyperlegible / IBM Plex Mono. Void ink with plate silver, focus amber, named teal, blank crimson. NOT beeswax/snuffer brass. NOT moonlit moss / fairy-gold. NOT dictionary cream/indigo. NOT printer-galley soot/brass. NOT parchment chancery. NOT granite survey. NOT parchment clerk desk. NOT stage black. NOT marble fasti. NOT mill-house. NOT Atlantic sailing. NOT oak timber.

Different verbs: Name the plate, Score innominate, Walk the footer, Compare named / blank, Pin idle named, Pin seeded blank, Pin icon-only, Hold the named.

Different idle: **named**. Different #93769 seeded path: **blank**. HOLD: **named** / **hold**. ALARM: **blank** / **innominate** / **icon-only** / **empty-uia-name**. Path: **icon-only**.

## How to score

```bash
node --test projects/innominate/innominate.test.mjs
node projects/innominate/innominate.mjs projects/innominate/data/blank.json
echo '{"seed":"blank"}' | node projects/innominate/innominate.mjs
```

Open the living card at `projects/innominate/index.html` (or the live path `/innominate/`). Buttons: Name the plate, Score innominate, Walk the footer, Compare named / blank, Pin idle named, Pin seeded blank, Pin icon-only, Hold the named. Toggle chips for: empty-uia-name, no-aria-label, icon-only, live-region-only, sibling-labeled, send-stop, wcag-412 — the score flips. Lay a fixture JSON on the plate blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s icon-only walk from the published #93769 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/innominate/
- Folder: `projects/innominate/`
