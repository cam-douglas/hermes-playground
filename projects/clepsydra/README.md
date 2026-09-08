# Clepsydra

A **marble cistern / bronze-spout water-clock atelier** — stone basin, teal water column, bronze fittings, soft limestone paper; EB Garamond + Barlow + Source Code Pro — for a real Claude Code defect: **OTEL TOKEN.USAGE / COST.USAGE / ACTIVE_TIME.TOTAL SILENTLY STOP RECORDING MAIN-LOOP TURNS MID-SESSION WHILE EXPORTER STAYS HEALTHY AND OTHER INSTRUMENTS KEEP ADVANCING.** When a hypothetical whole-session credit path keeps every turn on the meter, the cistern is **credited**.

Primary:

- [anthropics/claude-code#92776](https://github.com/anthropics/claude-code/issues/92776) (OPEN, bug, has repro, platform:macos, area:core, platform:aws-bedrock). Title: `[BUG] OTel token.usage / cost.usage silently stop recording main-loop turns mid-session (3% of actual captured)`. Filed 2026-09-08T04:33:31Z.

14:50 clepsydra: a marble clepsydra / water-clock meter that should keep token and cost drips credited for the whole session; instead the OTel spout arrests mid-session while other instruments keep advancing; score arrested or admit credited.

Score arrested or admit credited.

Idle word: **dripping** (HOLD: token and cost drips credited for the whole session). Seeded state: **arrested** / #92776. Admit word: **credited**. Never idle as chorded, flattened, meshed, piped, swallowed, unbound, berthed, lean, attentive, waived, bricked, unrung, echoed, laden, deaf, shed, remounted, refused, imprinted. Never seeded as chorded, flattened, meshed, piped, swallowed, unbound.

**Clepsydra** = a water-clock that should keep token and cost drips credited for the whole session. Measured, the OTel spout arrests mid-session.

- **dripping** = IDLE: HOLD; token and cost drips credited for the whole session
- **arrested** = seeded word / #92776 path: `token.usage` / `cost.usage` / `active_time.total` stop recording main-loop turns
- **credited** = admit hold: every API request's usage recorded for the life of the session
- **partial-credit** = after onset only five further credits in 2.5h each matching exactly one request; 50/207 credited in full, 157 dropped
- **exporter-healthy** = exporter, transport and auth stay healthy (15 samples / 15m)
- **other-instruments-advance** = `lines_of_code.count` +1,021, `code_edit_tool.decision` +13, `commit.count` +2
- **onset-sharp** = tracks the transcript request-for-request then stops
- **process-age-guess** = NON-BINDING: process age or cumulative turn count; possibly a per-turn guard (`ty = "credited"`) persisting or usage object staying null
- **ruled-out-matrix** = restart, sleep/resume, idle duration, compaction, auto-update, auth/transport, query-source relabelling eliminated
- **transcript-ground-truth** = session `53dd124d` vs `message.usage` deduped by `message.id`
- **cousins** = cite-only #33904 CLOSED; primary stays #92776
- **has-clear-repro** = issue labeled has repro

Verdicts: dripping, arrested, credited, partial-credit, exporter-healthy, other-instruments-advance, onset-sharp, process-age-guess, ruled-out-matrix, transcript-ground-truth, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a long-lived session would leave the cistern **arrested** or already **credited**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): something tied to process age or cumulative turn count; possibly a per-turn guard (`ty = "credited"`) persisting across turns or the usage object staying null. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92776](https://github.com/anthropics/claude-code/issues/92776)
- Cousins cite-only (NOT primary): [anthropics/claude-code#33904](https://github.com/anthropics/claude-code/issues/33904) CLOSED — Session Recording Failure & Massive Token Usage Surge (Windows/VS Code, needs-repro, different shape).

What happened (from the issue body — do not invent):

- Claude Code 2.1.263 (macOS arm64, BUILD_TIME 2026-09-06T01:08:56Z, GIT_SHA 37ae3f38d765199d54a6913cd61c6c9ad8576cc6); AWS Bedrock; iTerm2; Opus; filed 2026-09-08T04:33:31Z; labels bug, has repro, platform:macos, area:core, platform:aws-bedrock; OPEN
- Reporter: stevec-dubber
- Session `53dd124d` vs transcript ground truth (`message.usage` deduped by `message.id`)
- 4 Sep: 22,994,009 consumed, 5,797,429 recorded, 25%
- 7 Sep: 1,508,313 / 1,508,313, 100% (method validates — input 22, output 9,595, cacheRead 956,931, cacheCreation 541,765; cost $4.1042 vs $4.1045)
- 8 Sep: 21,861,971 consumed, 0 (main) recorded, 0%; cost $2.62 vs ~$25.98 incurred
- Onset sharp: tracks request-for-request then stops; after onset only five further credits in 2.5h each matching exactly one request; 50/207 credited in full, 157 dropped
- `active_time.total` pinned at 197.968 for 24h+
- Exporter 15 samples / 15m throughout
- Other instruments keep advancing: `lines_of_code.count` +1,021, `code_edit_tool.decision` +13, `commit.count` +2
- Ruled out: process restart/counter reset; sleep/resume; idle duration; compaction (first isCompactSummary 16m after onset); auto-update; auth/transport; query-source relabelling

Problem found: OTEL TOKEN.USAGE / COST.USAGE / ACTIVE_TIME.TOTAL SILENTLY STOP RECORDING MAIN-LOOP TURNS MID-SESSION WHILE EXPORTER STAYS HEALTHY AND OTHER INSTRUMENTS KEEP ADVANCING.

Why this solution: a diagnostic scorer for the dripping → arrested / credited cistern chain, so a reader can pin idle dripping, seed arrested (#92776 path), and score partial-credit / exporter-healthy / other-instruments-advance / onset-sharp / process-age-guess / ruled-out-matrix / transcript-ground-truth / cousins against the published facts.

## Why not a clone

This is specifically: **OTEL TOKEN.USAGE / COST.USAGE / ACTIVE_TIME.TOTAL SILENTLY STOP RECORDING MAIN-LOOP TURNS MID-SESSION WHILE EXPORTER STAYS HEALTHY AND OTHER INSTRUMENTS KEEP ADVANCING**.

**NOT Letoff/#92771** (libuv Shift+Enter flatten — already shipped). Do not touch Letoff.

**NOT Ptybind/#92757** (Ctrl+G ConPTY editor input dead — already shipped). Do not touch Ptybind.

**NOT Dunnage/#92746** (RemoteTrigger list cursor). **NOT Setoff/#92750** (subagent MEMORY.md + skill_listing). **NOT Espagnolette/#92694**. **NOT Imprimatur/#92740**. **NOT Byname/#92738**.

**NOT Portage/#92734** (teleport handoff — backup only). **NOT Clevis/#92769** (disable-model-invocation hides skills — backup only). **NOT Scuttle/#92700** (colored emoji TUI — backup only).

NOT a cost-dashboard clone, not a generic OTel viewer, not Heliostat, not Quench spend fuse.

Different paradigm: **OTel main-loop usage meter arrests mid-session; exporter healthy; other instruments keep advancing**.

Cousins cite-only (NOT primary): #33904 CLOSED. Do not auto-pick as thesis.

Do NOT rename this product Letoff, Ptybind, Dunnage, Setoff, Espagnolette, Imprimatur, or Byname.
Do NOT reuse idle chorded / flattened / meshed / piped / swallowed / unbound / berthed / lean / attentive / waived / bricked / unrung / echoed / laden / deaf / shed / remounted / refused / imprinted.

Different surface: silent OTel main-loop meter arrest vs libuv Shift+Enter flatten / Ctrl+G ConPTY mux editor input race / RemoteTrigger list cursor ignore / subagent first-request attachments / AskUserQuestion dead keys.

Product name stays **Clepsydra**. Name/slug `clepsydra` confirmed unused in catalog.json (219 products before this ship; Letoff is #219).

Different UI: marble cistern / bronze spout water-clock / stone basin / teal water column / limestone paper. EB Garamond / Barlow / Source Code Pro. NOT Lora / Plus Jakarta / Cousine (Letoff). NOT Newsreader / Karla / IBM Plex Mono (Ptybind). NOT Literata / Red Hat Text / Fira Code (Dunnage). NOT DM Serif Display / Commissioner / Azeret (Setoff). NOT Instrument Serif / Figtree / JetBrains (Espagnolette). NOT piano cream/ebony. NOT CRT phosphor green. NOT stevedore wood. NOT letterpress ink. NOT locksmith brass.

Different verbs: Score arrested, Admit credited, Pin idle dripping, Seed arrested, Reset to dripping, Load fixtures, Arrest the spout, Credit the basin.

Different idle: **dripping**. Different seeded: **arrested**. HOLD: **dripping** / **credited**. ALARM: **arrested** / **partial-credit** / **exporter-healthy** / **other-instruments-advance** / **onset-sharp** / **process-age-guess** / **ruled-out-matrix** / **transcript-ground-truth** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/clepsydra/hook/clepsydra.test.mjs
node projects/clepsydra/hook/clepsydra.mjs projects/clepsydra/data/92776.json
node projects/clepsydra/hook/clepsydra.mjs projects/clepsydra/data/dripping.json
echo '{"seed":"arrested","arrested":true}' | node projects/clepsydra/hook/index.mjs
```

Open the living card at `projects/clepsydra/index.html` (or the live path `/clepsydra/`). Buttons: Score arrested, Admit credited, Pin idle dripping, Seed arrested, Load fixtures, Reset to dripping. Arrest the spout. Credit the basin. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/clepsydra/
- Subdomain: https://clepsydra.hermes-playground-green.vercel.app
- Folder: `projects/clepsydra/`
