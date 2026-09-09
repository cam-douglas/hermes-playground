# Shibboleth

A **river-ford / border watchword booth** — dusk indigo bank, wet-stone grey stepping stones, parchment lantern amber, password lodge at the crossing; fonts **Cormorant Infant** (display) + **Manrope** (body) + **JetBrains Mono** (mono) — for a real Claude Code defect: **THE BUNDLED GROWTHBOOK `clientKey` `sdk-zAZezfDKGoZuXXKe` IS REJECTED BY `cdn.growthbook.io` WITH HTTP 400 `Invalid API Key`; ZERO FLAGS LOAD; `claude doctor` REPORTS THE FEATURE-FLAG SERVICE AS UNREACHABLE SO REMOTE CONTROL FAILS CLOSED.**

Primary:

- [anthropics/claude-code#92966](https://github.com/anthropics/claude-code/issues/92966) (OPEN, bug, has repro, platform:macos, area:core). Title: `[BUG] Bundled GrowthBook clientKey still returns 400 "Invalid API Key" on 2.1.266 — Remote Control fails closed (regression/reopen of #64151)`. Claude Code 2.1.266; macOS arm64. Authored 2026-09-09T01:50:25Z by achobgood.

11:50 shibboleth: a river-ford watchword booth that should keep Remote Control **admitted** — GrowthBook flags load; instead the bundled clientKey returns 400 Invalid API Key, zero flags load, and doctor misreports the flag service as unreachable so Remote Control fails closed — score shibbolethed or admit admitted.

Score shibbolethed or admit admitted.

Idle word: **admitted** (HOLD: key accepted, flags load, Remote Control eligibility verified). #92966 path: **shibbolethed**. Seeded recover: **countersigned**. Never idle deeded / parked / epitaphed / inscribed / collated / stereotyped / emended / confirmed / miraged / loosed / clung / banked / intact / culled / enrolled / escheated.

**Shibboleth** = the watchword a traveler must speak at the river-ford. The booth should admit the right word. Instead an expired countersign is refused at the gate while the sentry reports the road washed out.

- **admitted** = IDLE: HOLD; key accepted; flags load; Remote Control open
- **shibbolethed** = #92966 path: bundled clientKey → 400 Invalid API Key → zero flags → doctor says unreachable → Remote Control fails closed
- **countersigned** = rotated/restored key accepted; honest Invalid-API-Key surface instead of fake offline
- **invalid-api-key** = CDN body `{"status":400,"error":"Invalid API Key"}`
- **zero-flags** = no feature flags load after the key is refused
- **doctor-unreachable** = `claude doctor` frames a key reject as offline/blocked
- **remote-control-closed** = Remote Control eligibility cannot be verified; the ford stays shut
- **channels-dark** = Channels silently unavailable per #64151, cited from #92966 impact
- **key-hardcoded** = `sdk-zAZezfDKGoZuXXKe` still in the 2.1.266 binary (`strings`)
- **curl-400** = live curl 2026-09-09, 5/5 consecutive, no auth required
- **proxy-ruled-out** = `cdn.growthbook.io` reachable with valid TLS
- **env-ruled-out** = telemetry/GrowthBook kill-switches unset; claude.ai Max auth valid
- **cousins** = cite-only #64151 #92661 #91717 #89292 #92683 #33041 #66556 #92760 #91459 — do not clone
- **before-after** = before shibbolethed expired word; after expected admitted
- **fixtures** = row list for the watchword booth

Verdicts: admitted, shibbolethed, countersigned, invalid-api-key, zero-flags, doctor-unreachable, remote-control-closed, channels-dark, key-hardcoded, curl-400, cousins, before-after, fixtures, proxy-ruled-out, env-ruled-out.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No Desktop automation. No payloads. No secrets beyond the already-public clientKey. No network to Anthropic required for scoring. Score whether the GrowthBook watchword is **shibbolethed** or already **admitted**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): hardcoded GrowthBook clientKey rejected upstream → flags fail closed → eligibility check misreports as network unreachable. Invite verify against #92966 text only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92966](https://github.com/anthropics/claude-code/issues/92966)
- Cite-only: [anthropics/claude-code#64151](https://github.com/anthropics/claude-code/issues/64151)
- Cite-only Remote Control cousins: #92661 #91717 #89292 #92683 #33041 #66556 #92760 #91459

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:core
- Claude Code 2.1.266; macOS arm64
- Bundled GrowthBook clientKey `sdk-zAZezfDKGoZuXXKe`, apiHost `https://cdn.growthbook.io`
- Repro: `curl https://cdn.growthbook.io/api/features/sdk-zAZezfDKGoZuXXKe` → `{"status":400,"error":"Invalid API Key"}` (5/5 on 2026-09-09)
- Key still hardcoded in the 2.1.266 binary via `strings`
- Zero feature flags load
- `claude doctor` Remote Control: feature-flag service was unreachable (offline or blocked); availability could not be verified (no server response this session)
- Ruled out: corporate proxy (CDN reachable, valid TLS), DISABLE_TELEMETRY / DISABLE_GROWTHBOOK / CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC / DO_NOT_TRACK unset, valid claude.ai Max auth
- Impact: Remote Control (and Channels per #64151) silently unavailable; users chase VPN/proxy/certs instead of a server-side key problem
- Regression/reopen of closed #64151

Problem found: A WATCHWORD BOOTH THAT SHOULD KEEP REMOTE CONTROL ADMITTED INSTEAD SHIBBOLETHS AN EXPIRED COUNTERSIGN AND TELLS THE TRAVELER THE ROAD IS WASHED OUT.

Why this solution: a diagnostic river-ford bench for the admitted → shibbolethed drift, so a reader can pin idle admitted, load the #92966 shibbolethed path, and score countersigned / invalid-api-key / zero-flags / doctor-unreachable / remote-control-closed / channels-dark / key-hardcoded / curl-400 / cousins / before-after against the published facts.

## Why not a clone

This is specifically: **A BUNDLED GROWTHBOOK CLIENTKEY RETURNS 400 INVALID API KEY; ZERO FLAGS LOAD; DOCTOR SAYS UNREACHABLE; REMOTE CONTROL FAILS CLOSED.**

**NOT Homestead/#92932** (HOME-cwd file-index hang). Different paradigm.

**NOT Procrustes/#92900** (MCP boolean schema drops a whole tool palette). Different paradigm.

**NOT #64151** (closed stale, intermittent Invalid API Key). Cite only — this reopens it.

**NOT** open Remote Control cousins #92661 #91717 #89292 #92683 #33041 #66556 #92760 #91459. Cite only.

NOT Epitaph / Recension / Mirage / Remora / Cadastre / Rubric / Sheave / Mailslot / Ukase / Scabbard. Do not ship Quill / Colophon / Sallyport this run.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. NOT a Desktop automation.

Different paradigm: **invalid upstream clientKey + misdiagnosed Remote Control eligibility.**

Do NOT rename this product Homestead, Procrustes, Epitaph, or any existing catalog slug.
Do NOT reuse idle deeded / parked / epitaphed / inscribed / collated / stereotyped / emended / confirmed / miraged / loosed / clung / enrolled / escheated.
Do NOT reuse Playfair Display + Figtree + Fira Code (Homestead). Do NOT reuse Old Standard TT + Work Sans + Ubuntu Mono (Epitaph). Do NOT reuse Vollkorn + Cabin + Ubuntu Mono (Procrustes).

Different surface: GrowthBook watchword reject vs HOME file-index hang / MCP schema drop / false-completed agent.

Product name stays **Shibboleth**. Name/slug `shibboleth` unused in catalog.json (237 products before this ship; Homestead is #237).

Different UI: river-ford / indigo bank / wet-stone grey / parchment lantern amber / password lodge. Cormorant Infant / Manrope / JetBrains Mono. NOT prairie gold. NOT memorial charcoal. NOT iron-bed blacksmith. NOT desert haze.

Different verbs: Score shibbolethed, Admit admitted, Countersign the booth, Load #92966, Reset to admitted.

Different idle: **admitted**. Different #92966 path: **shibbolethed**. HOLD: **admitted**. ALARM: **shibbolethed** / **countersigned** / **invalid-api-key** / **zero-flags** / **doctor-unreachable** / **remote-control-closed** / **channels-dark** / **key-hardcoded** / **curl-400** / **cousins** / **before-after** / **fixtures** / **proxy-ruled-out** / **env-ruled-out**. Seeded recover: **countersigned**.

## How to score

```bash
node --test projects/shibboleth/shibboleth.test.mjs
node projects/shibboleth/shibboleth.mjs projects/shibboleth/data/92966.json
node projects/shibboleth/shibboleth.mjs projects/shibboleth/data/admitted.json
echo '{"seed":"shibbolethed"}' | node projects/shibboleth/shibboleth.mjs
```

Open the living card at `projects/shibboleth/index.html` (or the live path `/shibboleth/`). Buttons: Score shibbolethed, Admit admitted, Countersign the booth, Load #92966, Load fixtures, Reset to admitted. Toggle key accepted / flags load / doctor unreachable / Remote Control open — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/shibboleth/
- Folder: `projects/shibboleth/`
