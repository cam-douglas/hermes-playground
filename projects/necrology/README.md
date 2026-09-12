# Necrology

A **parish necrology / death-register / sexton-desk booth** — one incomplete census of the living wrongly enters a still-living model onto the death roll and blocks the user with that false assertion. Fonts **Cardo** (display) + **Sora** (UI) + **JetBrains Mono** (chips/mono). Palette: parchment cream `#EDE3C8`, memorial black `#1A1410`, oxidized green `#3F6B55`, sealing crimson `#A02A38`, ledger rule grey `#8D8576`. Open folio / ruled death-register columns / torn census strip / sexton ink pot / visitation ribbon / locked sexton question. NOT an innominate nameplate (Innominate), NOT a candle-snuffer taper (Snuffer), NOT a fairy-court cradle-swap (Changeling), NOT a lexicographer/homograph desk (Homograph), NOT a printer-galley wet-proof (Galley), NOT a chancery/wax-seal (Rescript), NOT trig survey (Monadnock), NOT parliamentary rider (Rider), NOT theatrical followspot (Followspot), NOT calendar / weir / sailing / cathead, NOT Quench / Stopcock / Hasp / Scuttle / Aphonia / Muzzle / Escutcheon / Lacuna / Palimpsest / Oubliette / Ephemera / Annunciator / Tocsin / Knell / Wraith / Scrim / Knock, NOT a millimeter-slider or woodworking leftover.

The living name should stay **attested** after a second witness (authenticated per-model, web search, or ask the user). Instead one incomplete `/models` listing **necrologized** it after an **incomplete-listing**.

Primary:

- [anthropics/claude-code#93774](https://github.com/anthropics/claude-code/issues/93774) (OPEN). Title: `Model asserts a provider model "does not exist" after one incomplete API listing instead of cross-checking`. Labels: bug, area:model, area:providers. Environment: Claude Code CLI, model claude-fable-5. While switching an image-generation pipeline to a newly released provider model (released 3 days prior), Claude Code fetched the provider's public /models listing once — the first attempt returned non-JSON and was retried — did not find the model id, and then told the user the model "does not exist on this provider" inside a blocking multiple-choice question, offering three older models as the only options. The user had to disprove it with a screenshot of the provider's own model page; a follow-up authenticated request to the provider's per-model endpoint resolved the id immediately. Expected: treat "absent from one listing response" as "not found via this endpoint" and cross-check (authenticated/per-model endpoint, web search, or ask the user what they saw) before asserting non-existence — especially for very recent releases, and especially when the same endpoint had just returned a malformed response in the same session. Cousins cite-only (do not rebuild): #91161 (hardcoded /v1/models discovery), #84159 (discoverable model list / offline fallback), #88345 (gateway capability discovery / stale selection), #88659 (gateway model-discovery pricing ignored by /usage), #90591 (invalid model name for Fable). Backups cite-only (next focus only — do not auto-pick): #93766 #93764 #93754 #93751 #93744 #93772 #93770.

15:50 necrology: a parish necrology / death-register booth for #93774. Idle **attested** / seeded **necrologized** / path **incomplete-listing**. Score necrology or admit attested.

Score necrology or admit attested.

Idle word: **attested** (HOLD: model presence confirmed / cross-checked before any non-existence claim). Seeded word: **necrologized** / #93774 (declared dead / "does not exist" after one incomplete listing). Path word: **incomplete-listing**. Product score: **necrology**. Never idle named / blank / innominate / icon-only / lit / snuffed / snuffer / ganged-or / pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / stop-dirty / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / nullarbor / standing / petard / raised / aposiopesis / seised / disseisin / ordered / analepsis / viewed / monstrance / sealed / cipherlock / untainted / attainder / voiced / sourdine / kindled / foxfire / flushed / pentimento or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score necrology or admit attested.**

- **attested** = IDLE: HOLD; model presence confirmed / cross-checked before any non-existence claim
- **necrologized** = #93774 seeded path: declared dead / "does not exist" after one incomplete listing
- **necrology** = product score word for a still-living model entered on the death roll
- **incomplete-listing** = path word: one torn census page treated as the whole roll
- **hold** = HOLD alias for idle attested
- **malformed-then-retry** = first /models attempt returned non-JSON and was retried
- **blocking-choice** = assertion inside a blocking multiple-choice question
- **three-older** = three older models offered as the only options
- **recent-release** = newly released provider model (released 3 days prior)
- **screenshot-disprove** = user disproved the death entry with the provider's own model page
- **per-model-resolve** = authenticated per-model endpoint resolved the id immediately
- **cross-check** = authenticated/per-model, web search, or ask the user what they saw
- **absent-not-dead** = absent from one listing is "not found via this endpoint", not a death
- **non-json-first** = first attempt returned non-JSON
- **does-not-exist** = told the user the model "does not exist on this provider"
- **has-repro** = published shape: incomplete listing; malformed then retry; blocking choice; three older
- **cousins** = cite-only #91161 #84159 #88345 #88659 #90591 — do not rebuild
- **backups** = cite-only #93766 #93764 #93754 #93751 #93744 #93772 #93770 — do not auto-pick
- **fixtures** = open folio / ruled death-register columns / torn census strip / sexton ink pot / visitation ribbon / locked sexton question
- **walk** = published idle attested → malformed-then-retry → non-json-first → incomplete-listing → recent-release → does-not-exist → blocking-choice → three-older → screenshot-disprove → per-model-resolve → cross-check → incomplete-listing → necrology

Verdicts: attested, necrologized, necrology, incomplete-listing, hold, malformed-then-retry, blocking-choice, three-older, recent-release, screenshot-disprove, per-model-resolve, cross-check, absent-not-dead, non-json-first, does-not-exist, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **necrologized** / **necrology** or already **attested**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): after a malformed or incomplete /models listing, refuse to assert non-existence until an authenticated per-model check (or user confirmation) runs — especially for models released in the last few days. Invite verify against #93774 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93774](https://github.com/anthropics/claude-code/issues/93774)
- Cite-only cousins: #91161 (hardcoded /v1/models discovery), #84159 (discoverable model list / offline fallback), #88345 (gateway capability discovery / stale selection), #88659 (gateway model-discovery pricing ignored by /usage), #90591 (invalid model name for Fable). Related provider/model discovery noise, not this exact incomplete-listing→false non-existence path.
- Backups (data only; next focus only — do not auto-pick): #93766, #93764, #93754, #93751, #93744, #93772, #93770

What happened (from the issue text — do not invent):

- OPEN.
- Labels: bug / area:model / area:providers
- Environment: Claude Code CLI, model claude-fable-5
- While switching an image-generation pipeline to a newly released provider model (released 3 days prior)
- Claude Code fetched the provider's public /models listing once
- The first attempt returned non-JSON and was retried
- Did not find the model id
- Then told the user the model "does not exist on this provider" inside a blocking multiple-choice question
- Offered three older models as the only options
- The user had to disprove it with a screenshot of the provider's own model page
- A follow-up authenticated request to the provider's per-model endpoint resolved the id immediately
- Expected: treat "absent from one listing response" as "not found via this endpoint" and cross-check (authenticated/per-model endpoint, web search, or ask the user what they saw) before asserting non-existence — especially for very recent releases, and especially when the same endpoint had just returned a malformed response in the same session

Problem found: ONE INCOMPLETE /MODELS CENSUS (MALFORMED THEN RETRIED) WAS TREATED AS A DEATH, SO A STILL-LIVING RECENT MODEL WAS ENTERED ON THE NECROLOGY AND THE USER WAS BLOCKED WITH THREE OLDER OPTIONS.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the booth stayed **attested** or went **necrologized**. Educational parish necrology / death-register booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Treat "absent from one listing response" as "not found via this endpoint" and cross-check (authenticated/per-model endpoint, web search, or ask the user what they saw) before asserting non-existence — especially for very recent releases, and especially when the same endpoint had just returned a malformed response in the same session

## Why not a clone

This is specifically: **ONE INCOMPLETE PUBLIC /MODELS LISTING (MALFORMED THEN RETRIED) WAS TREATED AS PROOF THE MODEL DOES NOT EXIST, BLOCKING THE USER WITH THREE OLDER OPTIONS UNTIL A PER-MODEL VISITATION RESOLVED THE ID.**

Novel paradigm: parish necrology / death-register / sexton-desk booth — one incomplete census of the living wrongly enters a still-living model onto the death roll.

**NOT Innominate/#93769** (Send/Stop empty accessible name). Different defect. NOT innominate nameplate / blank-escutcheon. Do not reuse named / blank / icon-only.

**NOT Snuffer/#93746** (`enableArtifact: false` kills scratchpad). Different defect. NOT candle-snuffer / taper / ganged OR. Do not reuse lit / snuffed / ganged-or.

**NOT Changeling/#93757** (remote reconnect discards `/model`). Different defect. NOT fairy-court / cradle-swap. Do not reuse pledged / swapped / remote-reattach.

**NOT Homograph/#93743** (non-ASCII path slug collision). Different defect. NOT lexicographer / headword / lemma. Do not reuse distinct / collided / lossy-slug.

**NOT Galley/#93745** (Stop dirty-tree full-turn bill). Different defect. NOT printer’s tray / unbound sheets. Do not reuse dry / billed / stop-dirty.

**NOT Rescript/#93742** (`/model` save-as-default scrapes settings.json). Different defect. NOT chancery / wax-seal. Do not reuse intact / scraped / snapshot-write.

**NOT Monadnock/#93703** (nested submodule worktree from local main). Different defect. NOT trig survey / residual mountain. Do not reuse fresh / residual / submodule-base.

**NOT Rider/#93683** (tool-result `type=attachment` rider). Different defect. NOT parliamentary clerk desk / bill-rider. Do not reuse plain / ridden / attachment-rider.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Idle **attested** here means presence confirmed — not a followspot cue. Do not reuse dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Quench / Stopcock / Hasp / Scuttle / Aphonia / Muzzle / Escutcheon / Lacuna / Palimpsest / Oubliette / Ephemera / Annunciator / Tocsin / Knell / Wraith / Scrim / Knock** (different metaphors). Different defects. Do not rebuild.

Do NOT rename Necrology to any existing catalog slug. Catalog currently has 308 products; Necrology is #309.
Do NOT reuse idle named / blank / innominate / icon-only / lit / snuffed / snuffer / ganged-or / pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / standing / raised / seised / ordered / viewed / sealed / untainted / voiced / kindled / flushed, or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted.
Display here is **Cardo**. Body is **Sora**. Mono is **JetBrains Mono**.

Different surface: one incomplete /models listing asserted as non-existence vs Send/Stop empty accessible name vs artifact/scratchpad ganged OR vs remote reconnect `/model` swap vs non-ASCII slug collision vs Stop dirty-tree full-turn bill vs `/model` snapshot-write vs nested-submodule worktree base vs tool-result attachment rider vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist vs scheduled WebSearch hang vs xnu ptmx race.

Different UI: open folio / ruled death-register columns / torn census strip / sexton ink pot / visitation ribbon / locked sexton question. Cardo / Sora / JetBrains Mono. Parchment cream with memorial black, oxidized green, sealing crimson, ledger rule grey. NOT void/amber/teal nameplate. NOT beeswax/snuffer brass. NOT moonlit moss / fairy-gold. NOT dictionary cream/indigo. NOT printer-galley soot/brass. NOT parchment chancery. NOT granite survey. NOT parchment clerk desk. NOT stage black. NOT marble fasti. NOT mill-house. NOT Atlantic sailing. NOT oak timber.

Different verbs: Attest the living, Score necrology, Walk the incomplete listing, Compare attested / necrologized, Pin idle attested, Pin seeded necrologized, Pin incomplete-listing, Hold the attested.

Different idle: **attested**. Different #93774 seeded path: **necrologized**. HOLD: **attested** / **hold**. ALARM: **necrologized** / **necrology** / **incomplete-listing** / **malformed-then-retry**. Path: **incomplete-listing**.

## How to score

```bash
node --test projects/necrology/necrology.test.mjs
node projects/necrology/necrology.mjs projects/necrology/data/necrologized.json
echo '{"seed":"necrologized"}' | node projects/necrology/necrology.mjs
```

Open the living card at `projects/necrology/index.html` (or the live path `/necrology/`). Buttons: Attest the living, Score necrology, Walk the incomplete listing, Compare attested / necrologized, Pin idle attested, Pin seeded necrologized, Pin incomplete-listing, Hold the attested. Toggle chips for: incomplete-listing, malformed-then-retry, blocking-choice, three-older, recent-release, does-not-exist, cross-check — the score flips. Lay a fixture JSON on the sexton blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s incomplete-listing walk from the published #93774 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/necrology/
- Folder: `projects/necrology/`
