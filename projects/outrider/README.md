# Outrider

A **cavalry outrider / dispatch-rider / ahead-of-baggage-train booth** — the connect request rides ahead of the sealed credentials; the headersHelper pouch arrives 135ms too late and is discarded; the gate marks the courier needs-auth for the whole session. Fonts **Archivo Black** (display) + **Barlow** (UI) + **Share Tech Mono** (chips/mono). Palette: dust-road khaki `#C4A574`, night navy `#0B1C2C`, signal amber `#E8A317`, leather brown `#5C3A21`, chalk `#F4EFE6`, iron `#3A4550`. Cavalry outrider silhouette / sealed dispatch pouch / unfinished helpers racing / bare-header gate stamp / timeline chips (helper invoked → early POST 403 → token +135ms discarded) / needs-auth branding iron. NOT Necrology (death-register / incomplete /models), NOT Innominate (a11y blank name), NOT Snuffer (artifact OR scratchpad), NOT Changeling (model swap on reconnect), NOT Homograph/Galley/Rescript/Monadnock/Rider/Followspot/Calends/Weir/Irons/Cathead/Anachronism, NOT Aphonia/Muzzle/Escutcheon/Lacuna/Annunciator/Tocsin/Wraith/Scrim/Knock/Quench, NOT millimeter-slider or woodworking leftover. This is specifically the headersHelper timing race: connect fires before helper resolves; valid bearer discarded; silent needs-auth.

The courier should stay **credentialed** (HOLD: connect waits until headersHelper returns / timeout). Instead a bare connect **outridden** the pouch after an **early-connect**.

Primary:

- [anthropics/claude-code#93776](https://github.com/anthropics/claude-code/issues/93776) (OPEN, has repro). Title: `MCP connect is issued before headersHelper resolves — slow helpers silently lose their auth header`. Labels: bug, has repro, platform:windows, area:mcp. Environment: Claude Code 2.1.266 desktop, Windows 11. MCP servers configured with `headersHelper`. Initial connect request issued WITHOUT waiting for helper to finish. If helper still running → request goes with NO Authorization header → 401/403 → server marked "requires authentication" for entire session. Helper is NOT cancelled; completes moments later with valid credential which is then discarded. Documented 10s helper timeout never reached; connect fires well before. Different subset of servers fails each launch (depends on helper speed) → looks like per-server problem. Evidence table: helper invoked 05:57:47.227; client POST 05:57:52.593 HTTP 403 no Authorization; helper returns valid token 05:57:52.728 — 135ms too late; helper elapsed 5,501 ms; client waited ~5.37s then sent anyway. Same window: some servers with finished helpers bound (400 with valid bearer); others 403 no bearer. Retry ~250ms later fails identically because helper still running. Helpers shell out to cloud CLI (AWS Secrets Manager); 1.7–5.5s under load. Expected: do not send connect until helper resolves or timeout; OR retry 401/403 AFTER helper resolves; surface log line. Related cite: #84778 (failed attach at startup is terminal). Workaround (not fix): cache credential so helper returns in ms. Cousins cite-only (do not rebuild): #84778 (startup attach terminal), #80635 (needs-auth cache poisoned), #93595 (HTTP MCP ${VAR} header empty), #84367 (Authorization header badly built), #90677 (GitHub MCP Authorization badly formatted). Backups cite-only (next focus only — do not auto-pick): #93766 #93764 #93754 #93751 #93744 #93772 #93770.

16:50 outrider: a cavalry outrider / dispatch-rider booth for #93776. Idle **credentialed** / seeded **outridden** / path **early-connect**. Score outrider or admit credentialed.

Score outrider or admit credentialed.

Idle word: **credentialed** (HOLD: connect waits until headersHelper returns / timeout). Seeded word: **outridden** / #93776 (bare connect rode ahead; 403; needs-auth; valid token discarded 135ms later). Path word: **early-connect**. Product score: **outrider**. Never idle attested / necrologized / necrology / incomplete-listing / named / blank / innominate / icon-only / lit / snuffed / snuffer / ganged-or / pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / stop-dirty / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / nullarbor / standing / petard / raised / aposiopesis / seised / disseisin / ordered / analepsis / viewed / monstrance / sealed / cipherlock / untainted / attainder / voiced / sourdine / kindled / foxfire / flushed / pentimento or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted / dropped / painted / lagged / twinlinked / flattened.

Phrase: **Score outrider or admit credentialed.**

- **credentialed** = IDLE: HOLD; connect waits until headersHelper returns / timeout
- **outridden** = #93776 seeded path: bare connect rode ahead; 403; needs-auth; valid token discarded 135ms later
- **outrider** = product score word for a courier that rode ahead of the sealed pouch
- **early-connect** = path word: connect fires before helper resolves
- **hold** = HOLD alias for idle credentialed
- **helper-invoked** = helper invoked 05:57:47.227
- **bare-post** = client POST 05:57:52.593 HTTP 403 no Authorization
- **discarded-token** = helper returns valid token 05:57:52.728 — 135ms too late — discarded
- **needs-auth** = server marked "requires authentication" for the entire session
- **helper-pending** = helper is NOT cancelled; still running at connect
- **ten-second-timeout** = documented 10s helper timeout never reached
- **concurrent-helpers** = helpers 1.7–5.5s under load; different subset fails each launch
- **access-log-split** = same window: some servers 400 with valid bearer; others 403 no bearer
- **retry-same-pending** = retry ~250ms later fails identically because helper still running
- **has-repro** = published shape: helper invoked; early POST 403; token +135ms discarded
- **cousins** = cite-only #84778 #80635 #93595 #84367 #90677 — do not rebuild
- **backups** = cite-only #93766 #93764 #93754 #93751 #93744 #93772 #93770 — do not auto-pick
- **fixtures** = cavalry outrider silhouette / sealed dispatch pouch / unfinished helpers racing / bare-header gate stamp / timeline chips / needs-auth branding iron
- **walk** = published idle credentialed → helper-invoked → early-connect → bare-post → needs-auth → helper-pending → discarded-token → retry-same-pending → concurrent-helpers → access-log-split → ten-second-timeout → early-connect → outrider

Verdicts: credentialed, outridden, outrider, early-connect, hold, helper-invoked, bare-post, discarded-token, needs-auth, helper-pending, ten-second-timeout, concurrent-helpers, access-log-split, retry-same-pending, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **outridden** / **outrider** or already **credentialed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): await headersHelper before first connect (bounded by 10s timeout); on 401/403 retry after helper resolves; log when helper did not resolve before connect. Invite verify against #93776 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93776](https://github.com/anthropics/claude-code/issues/93776)
- Cite-only cousins: #84778 (failed attach at startup is terminal), #80635 (needs-auth cache poisoned), #93595 (HTTP MCP ${VAR} header empty), #84367 (Authorization header badly built), #90677 (GitHub MCP Authorization badly formatted). Related MCP attach / Authorization noise, not this exact headersHelper timing race.
- Backups (data only; next focus only — do not auto-pick): #93766, #93764, #93754, #93751, #93744, #93772, #93770

What happened (from the issue text — do not invent):

- OPEN, has repro
- Labels: bug / has repro / platform:windows / area:mcp
- Environment: Claude Code 2.1.266 desktop, Windows 11
- MCP servers configured with `headersHelper`
- Initial connect request issued WITHOUT waiting for helper to finish
- If helper still running → request goes with NO Authorization header → 401/403 → server marked "requires authentication" for entire session
- Helper is NOT cancelled; completes moments later with valid credential which is then discarded
- Documented 10s helper timeout never reached; connect fires well before
- Different subset of servers fails each launch (depends on helper speed) → looks like per-server problem
- Evidence table: helper invoked 05:57:47.227; client POST 05:57:52.593 HTTP 403 no Authorization; helper returns valid token 05:57:52.728 — 135ms too late; helper elapsed 5,501 ms; client waited ~5.37s then sent anyway
- Same window: some servers with finished helpers bound (400 with valid bearer); others 403 no bearer
- Retry ~250ms later fails identically because helper still running
- Helpers shell out to cloud CLI (AWS Secrets Manager); 1.7–5.5s under load
- Expected: do not send connect until helper resolves or timeout; OR retry 401/403 AFTER helper resolves; surface log line
- Related cite: #84778 (failed attach at startup is terminal)
- Workaround (not fix): cache credential so helper returns in ms

Problem found: THE CONNECT REQUEST RODE AHEAD OF THE HEADERSHELPER POUCH. THE BARE POST GOT 403 WITH NO AUTHORIZATION; THE GATE STAMPED NEEDS-AUTH FOR THE SESSION; THE VALID TOKEN ARRIVED 135MS TOO LATE AND WAS DISCARDED.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the booth stayed **credentialed** or went **outridden**. Educational cavalry outrider / dispatch-rider booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Do not send connect until helper resolves or timeout
2. OR retry 401/403 AFTER helper resolves
3. Surface a log line when helper did not resolve before connect

## Why not a clone

This is specifically: **THE HEADERSHELPER TIMING RACE — CONNECT FIRES BEFORE THE HELPER RESOLVES; THE REQUEST GOES WITH NO AUTHORIZATION; 403; THE SERVER IS MARKED NEEDS-AUTH FOR THE SESSION; A VALID BEARER ARRIVES 135MS LATER AND IS DISCARDED.**

Novel paradigm: cavalry outrider / dispatch-rider / ahead-of-baggage-train booth — the connect request rides ahead of the sealed credentials.

**NOT Necrology/#93774** (incomplete `/models` listing asserted as death). Different defect. NOT parish necrology / death-register / incomplete listing. Do not reuse attested / necrologized / incomplete-listing.

**NOT Innominate/#93769** (Send/Stop empty accessible name). Different defect. NOT innominate nameplate / blank-escutcheon. Do not reuse named / blank / icon-only.

**NOT Snuffer/#93746** (`enableArtifact: false` kills scratchpad). Different defect. NOT candle-snuffer / taper / ganged OR. Do not reuse lit / snuffed / ganged-or.

**NOT Changeling/#93757** (remote reconnect discards `/model`). Different defect. NOT fairy-court / cradle-swap. Do not reuse pledged / swapped / remote-reattach.

**NOT Homograph/#93743** (non-ASCII path slug collision). Different defect. NOT lexicographer / headword / lemma. Do not reuse distinct / collided / lossy-slug.

**NOT Galley/#93745** (Stop dirty-tree full-turn bill). Different defect. NOT printer’s tray / unbound sheets. Do not reuse dry / billed / stop-dirty.

**NOT Rescript/#93742** (`/model` save-as-default scrapes settings.json). Different defect. NOT chancery / wax-seal. Do not reuse intact / scraped / snapshot-write.

**NOT Monadnock/#93703** (nested submodule worktree from local main). Different defect. NOT trig survey / residual mountain. Do not reuse fresh / residual / submodule-base.

**NOT Rider/#93683** (tool-result `type=attachment` rider). Different defect. NOT parliamentary clerk desk / bill-rider. Do not reuse plain / ridden / attachment-rider. Outrider is a cavalry courier, not a legislative rider.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Idle **credentialed** here means the pouch is bound — not a followspot cue. Do not reuse dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Anachronism/#93707** (prewarm latch / stale take). Different defect. NOT continuity slate. Do not reuse tip / stale / prewarm-latch.

**NOT Aphonia / Muzzle / Escutcheon / Lacuna / Annunciator / Tocsin / Wraith / Scrim / Knock / Quench** (different metaphors). Different defects. Do not rebuild. NOT Aphonia. NOT Muzzle. NOT Escutcheon. NOT Lacuna. NOT Annunciator. NOT Tocsin. NOT Wraith. NOT Scrim. NOT Knock. NOT Quench.

Do NOT rename Outrider to any existing catalog slug. Catalog currently has 309 products; Outrider is #310.
Do NOT reuse idle attested / necrologized / necrology / incomplete-listing / named / blank / innominate / icon-only / lit / snuffed / snuffer / ganged-or / pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / galley / intact / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / stamped / standing / raised / seised / ordered / viewed / sealed / untainted / voiced / kindled / flushed, or seeded residual / ridden / dark / misfired / dammed / becalmed / raced / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / attainted / muted.
Display here is **Archivo Black**. Body is **Barlow**. Mono is **Share Tech Mono**.

Different surface: headersHelper timing race (connect before helper) vs incomplete `/models` death-roll vs Send/Stop empty accessible name vs artifact/scratchpad ganged OR vs remote reconnect `/model` swap vs non-ASCII slug collision vs Stop dirty-tree full-turn bill vs `/model` snapshot-write vs nested-submodule worktree base vs tool-result attachment rider vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist vs scheduled WebSearch hang vs xnu ptmx race.

Different UI: cavalry outrider silhouette / sealed dispatch pouch / unfinished helpers racing / bare-header gate stamp / timeline chips / needs-auth branding iron. Archivo Black / Barlow / Share Tech Mono. Night navy with dust-road khaki, signal amber, leather brown, chalk, iron. NOT parchment death-register. NOT void/amber/teal nameplate. NOT beeswax/snuffer brass. NOT moonlit moss / fairy-gold. NOT dictionary cream/indigo. NOT printer-galley soot/brass. NOT parchment chancery. NOT granite survey. NOT parchment clerk desk. NOT stage black. NOT marble fasti. NOT mill-house. NOT Atlantic sailing. NOT oak timber.

Different verbs: Hold the courier, Score outrider, Walk the early-connect, Compare credentialed / outridden, Pin idle credentialed, Pin seeded outridden, Pin early-connect, Hold the credentialed.

Different idle: **credentialed**. Different #93776 seeded path: **outridden**. HOLD: **credentialed** / **hold**. ALARM: **outridden** / **outrider** / **early-connect** / **helper-invoked**. Path: **early-connect**.

## How to score

```bash
node --test projects/outrider/outrider.test.mjs
node projects/outrider/outrider.mjs projects/outrider/data/outridden.json
echo '{"seed":"outridden"}' | node projects/outrider/outrider.mjs
```

Open the living card at `projects/outrider/index.html` (or the live path `/outrider/`). Buttons: Hold the courier, Score outrider, Walk the early-connect, Compare credentialed / outridden, Pin idle credentialed, Pin seeded outridden, Pin early-connect, Hold the credentialed. Toggle chips for: early-connect, helper-invoked, bare-post, discarded-token, needs-auth, helper-pending, retry-same-pending — the score flips. Lay a fixture JSON on the dispatch blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s early-connect walk from the published #93776 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/outrider/
- Folder: `projects/outrider/`
