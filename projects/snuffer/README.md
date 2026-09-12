# Snuffer

A **candle-snuffer / taper booth** — snuffing the artifact flame also extinguishes the scratchpad taper because the two wicks share a ganged OR gate. Fonts **Playfair Display** (display) + **Source Sans 3** (UI) + **Fira Code** (chips/mono). Palette: warm beeswax `#F3E5C5`, soot `#1A1510`, brass snuffer `#B08D57`, ember `#C45C26`, wick-cream `#FFF8EC`. Artifact flame / scratchpad taper / brass snuffer cup / ganged-or bar / environment strip / one-way door. NOT a fairy-court cradle-swap (Changeling), NOT a lexicographer/homograph desk (Homograph), NOT a printer-galley wet-proof (Galley), NOT a chancery/wax-seal (Rescript), NOT trig survey (Monadnock), NOT parliamentary rider (Rider), NOT theatrical followspot (Followspot), NOT calendar / weir / sailing / cathead, NOT Quench / Stopcock / Hasp / Scuttle (different plumbing metaphors), NOT a millimeter-slider or woodworking leftover.

The scratchpad taper should stay **lit** when only the artifact flame is snuffed. Instead `enableArtifact: false` also removes `Scratchpad directory:` because scratchpad eligibility wrongly ORs artifact eligibility after 2.1.186.

Primary:

- [anthropics/claude-code#93746](https://github.com/anthropics/claude-code/issues/93746) (OPEN). Title: `[BUG] enableArtifact: false also disables the scratchpad directory`. Labels: bug, has repro, area:core. Setting `"enableArtifact": false` in `~/.claude/settings.json` also removes the `Scratchpad directory:` line from the system prompt / environment block. Artifact publishing and the agent's session temp (scratchpad) directory are unrelated features that became wrongly coupled. Coupling: `isScratchpadEnabled() = P("tengu_scratch", false) || isArtifactToolEligible()`; `isArtifactToolEligible() = !br() && vl()` where `br()` reflects enableArtifact / disableArtifact / CLAUDE_CODE_DISABLE_ARTIFACT. The `|| isArtifactToolEligible()` arm entered in 2.1.186. In 2.1.185 and earlier the expression was `P("tengu_scratch", false)` alone, so the artifact setting could not affect the scratchpad. With `tengu_scratch` off (its default), `enableArtifact: false` alone now disables the scratchpad. There is no local opt-in for `tengu_scratch` (getEnvironmentOverrides null; readConfigOverrides undefined; cachedGrowthBookFeatures skipped when remoteEvalFeatureValues.size > 0). Turning artifacts off is a one-way door for scratchpad. Coupling absent in builds 121, 161, 174, 179, 183, 185; present in 186+ through 269. Repro: interactive session shows Scratchpad directory → set enableArtifact false → Environment update says scratchpad no longer available → set true → line returns. Expected: scratchpad gated on its own setting, not on enableArtifact. Platform: Windows; Claude Code 2.1.269; Anthropic API; PowerShell. Cousins cite-only (few, related artifact/scratchpad settings — do not rebuild): #87734 (CLAUDE_CODE_DISABLE_ARTIFACT as only Monitor opt-out), #91395 (artifact schema no opt-out except deny), #92166 (scratchpad /tmp volatility), #78013 (export scratchpad path), #80606 (enableArtifact true still misses Artifact in `claude -p`). Backups cite-only (next focus only — do not auto-pick): #93744 #93722 #93672 #93652 #93680 #93618 #93694 #93751 #93761.

13:50 snuffer: a candle-snuffer / taper booth for #93746. Idle **lit** / seeded **snuffed** / path **ganged-or**. Score snuffer or admit lit.

Score snuffer or admit lit.

Idle word: **lit** (HOLD: scratchpad directory still announced). Seeded word: **snuffed** / #93746 (enableArtifact false kills scratchpad). Path word: **ganged-or**. Product score: **snuffer**. Never idle pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / stop-dirty / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / nullarbor / standing / petard / raised / aposiopesis / seised / disseisin / ordered / analepsis / viewed / monstrance / sealed / cipherlock / untainted / attainder / voiced / sourdine / kindled / foxfire / flushed / pentimento or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score snuffer or admit lit.**

- **lit** = IDLE: HOLD; scratchpad directory still announced
- **snuffed** = #93746 seeded path: enableArtifact false kills scratchpad
- **snuffer** = product score word for a brass cup that covers both wicks
- **ganged-or** = path word: scratchpad eligibility ORs artifact eligibility
- **hold** = HOLD alias for idle lit
- **decouple-gates** = expected write: scratchpad gated on tengu_scratch (or a dedicated local setting) independent of isArtifactToolEligible
- **tengu-scratch** = GrowthBook flag `tengu_scratch` off (default); no local opt-in
- **artifact-gate** = `isArtifactToolEligible() = !br() && vl()`; `br()` reflects enableArtifact / disableArtifact / CLAUDE_CODE_DISABLE_ARTIFACT
- **one-way-door** = getEnvironmentOverrides null; readConfigOverrides undefined; cachedGrowthBookFeatures skipped when remoteEvalFeatureValues.size > 0
- **environment-update** = `# Environment update: The scratchpad directory announced earlier is no longer available`
- **scratchpad-line** = `Scratchpad directory:` vanishes from the environment block
- **enable-artifact-false** = `"enableArtifact": false` in `~/.claude/settings.json`
- **regression-186** = coupling absent through 2.1.185; present from 2.1.186 through 2.1.269
- **has-repro** = published shape: Scratchpad directory announced → enableArtifact false → environment update withdraws it → set true → line returns
- **cousins** = cite-only #87734 #91395 #92166 #78013 #80606 — do not rebuild
- **backups** = cite-only #93744 #93722 #93672 #93652 #93680 #93618 #93694 #93751 #93761 — do not auto-pick
- **fixtures** = artifact flame / scratchpad taper / brass snuffer cup / ganged-or bar / environment strip / one-way door
- **walk** = published idle lit → enable-artifact-false → tengu-scratch → artifact-gate → ganged-or → environment-update → scratchpad-line → one-way-door → regression-186 → ganged-or → snuffer

Verdicts: lit, snuffed, snuffer, ganged-or, hold, decouple-gates, tengu-scratch, artifact-gate, one-way-door, environment-update, scratchpad-line, enable-artifact-false, regression-186, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **snuffed** / **snuffer** or already **lit**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): restore scratchpad gate to tengu_scratch (or a dedicated local setting) independent of isArtifactToolEligible. Invite verify against #93746 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93746](https://github.com/anthropics/claude-code/issues/93746)
- Cite-only cousins: #87734 (CLAUDE_CODE_DISABLE_ARTIFACT as only opt-out for artifact-armed Monitor), #91395 (artifact tool schema loads with no opt-out except a deny rule), #92166 (scratchpad under /tmp erased on reboot), #78013 (export session scratchpad path as CLAUDE_SCRATCHPAD), #80606 (Artifact tool not loaded in `claude -p` even with enableArtifact true). Few cousins: related artifact/scratchpad settings, not the ganged-or eligibility bug.
- Backups (data only; next focus only — do not auto-pick): #93744, #93722, #93672, #93652, #93680, #93618, #93694, #93751, #93761

What happened (from the issue text — do not invent):

- OPEN.
- Labels: bug / has repro / area:core
- Setting `"enableArtifact": false` in `~/.claude/settings.json` also removes the `Scratchpad directory:` line from the system prompt / environment block
- Artifact publishing and the agent's session temp (scratchpad) directory are unrelated features that became wrongly coupled
- `isScratchpadEnabled() = P("tengu_scratch", false) || isArtifactToolEligible()`
- `isArtifactToolEligible() = !br() && vl()` where `br()` reflects enableArtifact / disableArtifact / CLAUDE_CODE_DISABLE_ARTIFACT
- The `|| isArtifactToolEligible()` arm entered in 2.1.186
- In 2.1.185 and earlier the expression was `P("tengu_scratch", false)` alone, so the artifact setting could not affect the scratchpad
- With `tengu_scratch` off (its default), `enableArtifact: false` alone now disables the scratchpad
- There is no local opt-in for `tengu_scratch`: getEnvironmentOverrides returns null; readConfigOverrides returns undefined; cachedGrowthBookFeatures is skipped whenever remoteEvalFeatureValues.size > 0
- Turning artifacts off is therefore a one-way door
- Coupling absent in 121, 161, 174, 179, 183, 185; present in 186, 187, 202, 224, 236, 238, 240, 241, 242, 258, 259, 267, 268, 269
- Repro: open an interactive session; the `# Environment` block names a `Scratchpad directory:` → set `"enableArtifact": false` → the session receives `# Environment update: The scratchpad directory announced earlier is no longer available` → set it back to `true`; the line returns
- Expected: the scratchpad is gated on its own setting, not on `enableArtifact`
- Environment: Claude Code 2.1.269; last working 2.1.185; Windows; PowerShell; Anthropic API

Problem found: DISABLING ARTIFACTS ALSO DISABLES THE SCRATCHPAD BECAUSE SCRATCHPAD ELIGIBILITY WRONGLY ORs ARTIFACT ELIGIBILITY.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the booth stayed **lit** or went **snuffed**. Educational candle-snuffer / taper booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Gate scratchpad on its own setting (tengu_scratch, or a dedicated local setting), independent of isArtifactToolEligible; turning artifacts off must not extinguish the session temp directory

## Why not a clone

This is specifically: **ARTIFACT SETTING GANGS SCRATCHPAD ELIGIBILITY AFTER 2.1.186 — `enableArtifact: false` KILLS THE SCRATCHPAD TAPER BECAUSE `isScratchpadEnabled()` WRONGLY ORs `isArtifactToolEligible()` WHILE `tengu_scratch` HAS NO LOCAL OPT-IN.**

Novel paradigm: candle-snuffer / taper booth — snuffing the artifact flame also extinguishes the scratchpad taper because the two wicks share a ganged OR gate.

**NOT Changeling/#93757** (remote reconnect discards `/model`). Different defect. NOT fairy-court / cradle-swap. Do not reuse pledged / swapped / remote-reattach.

**NOT Homograph/#93743** (non-ASCII path slug collision). Different defect. NOT lexicographer / headword / lemma. Do not reuse distinct / collided / lossy-slug.

**NOT Galley/#93745** (Stop dirty-tree full-turn bill). Different defect. NOT printer’s tray / unbound sheets. Do not reuse dry / billed / stop-dirty.

**NOT Rescript/#93742** (`/model` save-as-default scrapes settings.json). Different defect. NOT chancery / wax-seal. Do not reuse intact / scraped / snapshot-write.

**NOT Monadnock/#93703** (nested submodule worktree from local main). Different defect. NOT trig survey / residual mountain. Do not reuse fresh / residual / submodule-base.

**NOT Rider/#93683** (tool-result `type=attachment` rider). Different defect. NOT parliamentary clerk desk / bill-rider. Do not reuse plain / ridden / attachment-rider.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Idle **lit** here means the scratchpad taper is still announced — not a followspot cue. Do not reuse dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Quench / Stopcock / Hasp / Scuttle** (different plumbing metaphors). Different defects. Do not rebuild.

Do NOT rename Snuffer to any existing catalog slug. Catalog currently has 306 products; Snuffer is #307.
Do NOT reuse idle pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / standing / raised / seised / ordered / viewed / sealed / untainted / voiced / kindled / flushed, or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted.
Display here is **Playfair Display**. Body is **Source Sans 3**. Mono is **Fira Code**.

Different surface: artifact setting gangs scratchpad eligibility vs remote reconnect `/model` swap vs non-ASCII slug collision vs Stop dirty-tree full-turn bill vs `/model` snapshot-write vs nested-submodule worktree base vs tool-result attachment rider vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist vs scheduled WebSearch hang vs xnu ptmx race.

Different UI: artifact flame / scratchpad taper / brass snuffer cup / ganged-or bar / environment strip / one-way door. Playfair Display / Source Sans 3 / Fira Code. Beeswax with soot, brass, ember, wick-cream. NOT moonlit moss / fairy-gold. NOT dictionary cream/indigo. NOT printer-galley soot/brass. NOT parchment chancery. NOT granite survey. NOT parchment clerk desk. NOT stage black. NOT marble fasti. NOT mill-house. NOT Atlantic sailing. NOT oak timber.

Different verbs: Keep the taper lit, Score snuffer, Walk the wicks, Compare lit / snuffed, Pin idle lit, Pin seeded snuffed, Pin ganged-or, Hold the lit.

Different idle: **lit**. Different #93746 seeded path: **snuffed**. HOLD: **lit** / **hold**. ALARM: **snuffed** / **snuffer** / **ganged-or** / **one-way-door**. Path: **ganged-or**.

## How to score

```bash
node --test projects/snuffer/snuffer.test.mjs
node projects/snuffer/snuffer.mjs projects/snuffer/data/snuffed.json
echo '{"seed":"snuffed"}' | node projects/snuffer/snuffer.mjs
```

Open the living card at `projects/snuffer/index.html` (or the live path `/snuffer/`). Buttons: Keep the taper lit, Score snuffer, Walk the wicks, Compare lit / snuffed, Pin idle lit, Pin seeded snuffed, Pin ganged-or, Hold the lit. Toggle chips for: tengu-scratch, one-way-door, ganged-or, environment-update, scratchpad-line, enable-artifact-false, artifact-gate — the score flips. Lay a fixture JSON on the atelier blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s ganged-or walk from the published #93746 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/snuffer/
- Folder: `projects/snuffer/`
