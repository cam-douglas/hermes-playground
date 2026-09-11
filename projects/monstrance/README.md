# Monstrance

A **sanctuary monstrance / exposition booth** — gilt rays, luna glass, altar step, phantom DENY ribbon, sacristy shelf. Fonts **Gilda Display** (display) + **Mulish** (body) + **Anonymous Pro** (mono). Palette: sanctuary night — deep nave `#140E18`, gilt `#D4A84B`, brass `#8C6A2F`, ivory host `#F4EBD8`, sanctuary crimson `#8B1E2D`, incense smoke `#6B6570` — dark sanctuary night, NOT cloister dusk indigo/candle, NOT bank vault steel/brass cipherlock, NOT parchment court, NOT concert-hall velvet, NOT municipal grate, NOT marsh foxfire.

A monstrance is the vessel that should hold the consecrated host (the live artifact) up for viewing. Instead the luna glass is veiled by a phantom “deny” while the real substitute vessel (`mcp__workspace__web_fetch`) sits unused in the sacristy.

Primary:

- [anthropics/claude-code#93563](https://github.com/anthropics/claude-code/issues/93563) (OPEN, bug, platform:macos, area:cowork; has a published repro). Title: `[BUG] Artifact tool cannot read live artifacts in Cowork — read path binds to native WebFetch, which Cowork substitutes with mcp__workspace__web_fetch`. Claude desktop app **1.49585.0** (Cowork surface) — prod build, commit timestamp 2026-09-08. Not the npm CLI. Opus. macOS. Anthropic API. Personal Claude Pro. In Cowork, host-executing tools Bash/WebFetch/etc. are withdrawn and replaced by `mcp__workspace__bash` / `mcp__workspace__web_fetch`. Artifact still loads (on the allowed list) but its **read** path looks for **native WebFetch**, which no longer exists in the session. Refusal message falsely blames `your WebFetch deny rule (WebFetch)` even when no deny rule exists in any settings file (user hunted phantom config: `~/.claude/settings.json` no permissions block, `settings.local.json` absent, `~/.claude.json` zero WebFetch matches, `managed-settings.json` absent, project `.claude` absent, Cowork session `.claude/settings.json` is `{}`). Because publish to an existing artifact requires reading the live version first, publish is also refused unless `force: true`. Session that CREATED the artifact can publish without read (bug invisible until a later session updates it). Contrast: Claude Code surface with native WebFetch present — read succeeds. Evidence from the issue: Bash 0, WebFetch 0, `mcp__workspace__bash` 2935, `mcp__workspace__web_fetch` 1024, WebSearch / Read / Artifact 596 / 414 / 21. Cousins cite-only: Artifact publish/version #89786 #89990 #90468 #89793 #91126 #87734 #87962 #93005. Paradigm cousins already shipped: Imprimatur (#92740 Artifact approval under Skip-all), Ukase (`mcp__workspace__bash` permission), Understudy (miscast substitute), Fetch (keyed reply) — cite only, never re-ship.

17:50 monstrance: a sanctuary monstrance / exposition booth for #93563. Idle **viewed** / seeded **withheld** / path **phantom-deny**. Score monstrance or admit viewed.

Score monstrance or admit viewed.

Idle word: **viewed** (HOLD: live artifact readable via the fetch Cowork actually provides). Seeded word: **withheld** / #93563 (phantom WebFetch deny; content withheld). Path word: **phantom-deny**. Product score: **monstrance**. Never idle closed / lingering / unrung / compline / sealed / blanked / concurrent-write / cipherlock / untainted / attainted / attainder / voiced / muted / sourdine / lodged / dropped / forksink.

Phrase: **Score monstrance or admit viewed.**

- **viewed** = IDLE: HOLD; live artifact readable via `mcp__workspace__web_fetch` (or native WebFetch on the Claude Code surface)
- **withheld** = #93563 seeded path: Artifact hunts native WebFetch; live content withheld
- **monstrance** = product score word for the sanctuary whose luna is veiled by a phantom deny
- **phantom-deny** = path word: refusal invents `your WebFetch deny rule (WebFetch)` that does not exist
- **hold** = HOLD alias for idle viewed
- **native-webfetch** = Artifact read path binds to native WebFetch, which Cowork withdrew
- **mcp-substitute** = `mcp__workspace__web_fetch` provided (1024 successful calls) but unused by Artifact
- **force-true** = publish to an existing artifact refused unless `force: true`
- **created-session-ok** = session that CREATED the artifact can publish without a read
- **later-session-refuse** = a later Cowork session cannot read an artifact it did not create
- **deny-rule-absent** = no WebFetch deny in any settings file the reporter searched
- **artifact-read** = expected: Artifact read via the fetch Cowork actually provides
- **artifact-publish** = publish also refused because it requires the read first
- **host-withdrawn** = Cowork withdraws native Bash / WebFetch and substitutes MCP workspace tools
- **luna-veiled** = luna glass does not show the consecrated host (live artifact)
- **sacristy-unused** = substitute vessel sits unused on the sacristy shelf
- **phantom-ribbon** = crimson DENY ribbon is a false accusation
- **cowork-surface** = Claude desktop app Cowork surface (1.49585.0)
- **code-surface** = positive control: Claude Code surface with native WebFetch present — read succeeds
- **has-repro** = published repro: new Cowork session → Artifact read refused → publish refused → force: true succeeds
- **cousins** = cite-only #89786 #89990 #90468 #89793 #91126 #87734 #87962 #93005 + Imprimatur / Ukase / Understudy / Fetch — do not rebuild
- **backups** = cite-only #93530 #93556 #93553 #93544 #93439 #93438 #93475 #93534 #93508 #93532 — do not auto-pick
- **fixtures** = luna / rays / host / sacristy / ribbon table for the monstrance booth
- **walk** = published idle viewed → host-withdrawn → mcp-substitute → native-webfetch → luna-veiled → phantom-deny → withheld → later-session-refuse → force-true → monstrance

Verdicts: viewed, withheld, monstrance, phantom-deny, hold, native-webfetch, mcp-substitute, force-true, created-session-ok, later-session-refuse, deny-rule-absent, artifact-read, artifact-publish, host-withdrawn, luna-veiled, sacristy-unused, phantom-ribbon, cowork-surface, code-surface, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the host is **withheld** / **monstrance** or already **viewed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Cowork disallow list includes WebFetch; Artifact still wired to native WebFetch; absence is surfaced as a user deny rule. Invite verify against #93563 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93563](https://github.com/anthropics/claude-code/issues/93563)
- Cite-only cousin: [anthropics/claude-code#89786](https://github.com/anthropics/claude-code/issues/89786) (co-written Artifact version-conflict; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#89990](https://github.com/anthropics/claude-code/issues/89990) (false identical-content gate; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#90468](https://github.com/anthropics/claude-code/issues/90468) (publish-refusal loop; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#89793](https://github.com/anthropics/claude-code/issues/89793) (viewed-check then resent-unchanged; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#91126](https://github.com/anthropics/claude-code/issues/91126) (Artifact disabled mid-session; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#87734](https://github.com/anthropics/claude-code/issues/87734) (auto-armed Monitor; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#87962](https://github.com/anthropics/claude-code/issues/87962) (monitor_ws linger; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#93005](https://github.com/anthropics/claude-code/issues/93005) (iframe microphone allow; do not rebuild)
- Cite-only paradigm: Imprimatur #92740, Ukase #92833, Understudy #92426, Fetch #90755 — already shipped; do not re-ship
- Backup (data only): #93530 #93556 #93553 #93544 #93439 #93438 #93475 #93534 #93508 #93532

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, platform:macos, area:cowork. Published repro in the issue body.
- Claude desktop app **1.49585.0** (Cowork surface); commit timestamp 2026-09-08; not the npm CLI
- Opus; macOS; Anthropic API; Personal Claude Pro (no managed org / admin policy)
- Cowork withdraws native Bash / WebFetch; substitutes `mcp__workspace__bash` / `mcp__workspace__web_fetch`
- Artifact still on the allowed list so it loads; read path binds native WebFetch
- Refusal: live content withheld by `your WebFetch deny rule (WebFetch)` — no such rule exists
- Publish to an existing artifact also refused unless `force: true`
- Creating session can publish without read; later session cannot
- Claude Code surface with native WebFetch present — read succeeds
- Transcript counts: Bash 0, WebFetch 0, mcp bash 2935, mcp web_fetch 1024, Artifact 21

Problem found: ARTIFACT READ IN COWORK BINDS NATIVE WEBFETCH AFTER COWORK WITHDREW IT → live content withheld; phantom deny rule; publish needs force: true.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the host stayed **viewed** or was **withheld**. Educational sanctuary booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Artifact should read the live artifact via the fetch capability Cowork actually provides (`mcp__workspace__web_fetch`)
2. Publish should proceed normally without `force: true` — the same way it works on the Claude Code surface
3. When a tool genuinely is unavailable, the error should not attribute it to a user-configured deny rule that does not exist

## Why not a clone

This is specifically: **ARTIFACT READ IN COWORK BINDS NATIVE WEBFETCH AFTER COWORK WITHDREW IT → live content withheld; phantom deny rule; publish needs force: true.**

**NOT Compline/#93549** (remote-control bridge never sends `end_session`). Different defect. NOT cloister dusk.

**NOT Cipherlock/#93537** (concurrent Keychain MCP OAuth wipe). NOT vault/brass dial.

**NOT Attainder/#93529** (parked-permission false user-rejected). NOT parchment court.

**NOT Sourdine/#93531** (MessageDisplay mute). NOT concert hall.

**NOT Forksink/#93458** (SessionStart additionalContext drop on fork). NOT municipal grate.

**NOT Foxfire/#93502.** **NOT Pentimento/#93482.** **NOT Vinculum/#93485.** **NOT Cachet/#93490.**

**NOT Imprimatur/#92740** (Artifact approval under Skip-all — first publish card never renders). Cite only; do not re-ship.

**NOT Ukase/#92833** (`mcp__workspace__bash` permission deny on scheduled Cowork). Cite only; do not re-ship.

**NOT Understudy/#92426** (miscast substitute inherits the lead). Cite only; do not re-ship.

**NOT Fetch/#90755** (keyed reply vs ghost suggestion). Cite only; do not re-ship.

**NOT #89786/#89990/#90468/#89793/#91126/#87734/#87962/#93005** — Artifact publish/version cousins only; this booth is Cowork native-WebFetch bind + phantom deny + unused `mcp__workspace__web_fetch`.

Do NOT rename Monstrance to any existing catalog slug. Catalog currently has 288 products; Monstrance is #289.
Do NOT reuse idle closed / lingering / unrung, sealed / blanked / concurrent-write, untainted / attainted, voiced / muted, lodged / dropped, or other prior booth verbs.
Display here is **Gilda Display**. Body is **Mulish**. Mono is **Anonymous Pro**.

Different surface: Cowork Artifact read binds withdrawn native WebFetch vs routine `end_session` leak vs concurrent Keychain wipe vs parked-permission false user-rejected vs MessageDisplay narration mute vs SessionStart fork drop vs Skip-all Artifact approval card.

Different UI: luna / gilt rays / host / sacristy-shelf / phantom-DENY-ribbon gauges. Gilda Display / Mulish / Anonymous Pro. Dark sanctuary night. NOT cloister dusk. NOT bank vault. NOT parchment court. NOT concert-hall velvet. NOT municipal grate. NOT marsh lantern.

Different verbs: Expose the host, Score monstrance, Open the luna, Compare viewed / withheld, Pin idle viewed, Pin seeded withheld, Pin phantom-deny, Clear the altar.

Different idle: **viewed**. Different #93563 seeded path: **withheld**. HOLD: **viewed** / **hold**. ALARM: **withheld** / **monstrance** / **phantom-deny** / **native-webfetch**. Path: **phantom-deny**.

## How to score

```bash
node --test projects/monstrance/monstrance.test.mjs
node projects/monstrance/monstrance.mjs projects/monstrance/data/withheld.json
echo '{"seed":"withheld"}' | node projects/monstrance/monstrance.mjs
```

Open the living card at `projects/monstrance/index.html` (or the live path `/monstrance/`). Buttons: Expose the host, Score monstrance, Open the luna, Compare viewed / withheld, Pin idle viewed, Pin seeded withheld, Pin phantom-deny, Clear the altar. Toggle chips for: host tools withdrawn, native WebFetch missing, mcp substitute unused, Artifact still loaded, deny rule absent, later session, publish needs force, created session ok, Claude Code surface — the score flips. Lay a fixture JSON on the altar tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s withheld walk from the published #93563 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/monstrance/
- Folder: `projects/monstrance/`
