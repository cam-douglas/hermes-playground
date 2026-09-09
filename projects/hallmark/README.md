# Hallmark

A **silversmith hallmark / assay booth** — warm silver punch, pewter cupel, ink-black ledger, the `[1m]` purity mark that proves the million-token window; warm silver / pewter / ink-black assay-lab palette; fonts **Cinzel** (display) + **Lato** (body) + **Fira Code** (mono) — for a real Claude Code defect: **`--resume` LOSES `[1m]` CONTEXT WINDOW ON NON-FIRST-PARTY `ANTHROPIC_BASE_URL` WHEN SESSION MODEL DIFFERS FROM DEFAULT.**

Primary:

- [anthropics/claude-code#93021](https://github.com/anthropics/claude-code/issues/93021) (OPEN, bug, has repro, platform:macos, area:core, area:providers). Title: `[BUG] --resume loses [1m] context window on non-first-party ANTHROPIC_BASE_URL when session model differs from default`. Authored 2026-09-09T07:47:27Z by DimitarKrastev. Product: Claude Code 2.1.266, macOS, Terminal.app. Auth: Anthropic OAuth (claude.ai subscription), not an API key. Reproduced 100% across three session ids on macOS 26 (Darwin 25.4.0).

17:50 hallmark: a silversmith hallmark / assay booth that should keep the `[1m]` purity mark **sterling** (resume restores exact modelId with `[1m]`, contextWindow 1000000, anthropic-beta carries context-1m-2025-08-07, regardless of ANTHROPIC_BASE_URL host and settings default); instead the hallmark is **rubbed** — resume restores bare `claude-fable-5-1`, contextWindow 200000, beta header missing, when BASE_URL is non-first-party and settings model differs — score debased or admit sterling.

Score debased or admit sterling.

Idle word: **sterling** (HOLD: resume restores exact modelId with `[1m]`, contextWindow 1000000, anthropic-beta carries context-1m-2025-08-07, regardless of host and settings default). Seeded word: **debased** / #93021 (resume restores bare model without `[1m]`, contextWindow 200000, beta header missing, when BASE_URL is non-first-party and settings model differs). Path word: **rubbed**. Never idle primed / flashed / flashpanned / unshorn / sheared / secateured / emended / unretracted / palinoded / ephemeral / voided / fouled / cold / banked.

Phrase: **a hallmark that loses [1m] on resume through a non-first-party gate is not sterling — it is debased metal after the purity mark was rubbed. Score debased or admit sterling.**

- **sterling** = IDLE: HOLD; resume restores exact modelId with `[1m]`; 1M window; beta header present; regardless of host and settings default
- **debased** = #93021 seeded path: resume restores bare id; contextWindow 200000; beta header missing; non-first-party BASE_URL + settings mismatch
- **rubbed** = path word: a hallmark whose `[1m]` purity mark was rubbed off
- **bare-model-id** = resume writes a second `attachment.type=model` record with bare `claude-fable-5-1`
- **missing-1m-suffix** = `modelUsage` key loses `[1m]`
- **context-window-200k** = resume `contextWindow` 200000; auto-compaction kicks in at 200K
- **beta-header-missing** = `anthropic-beta` no longer carries `context-1m-2025-08-07`
- **non-first-party-base-url** = `ANTHROPIC_BASE_URL=http://127.0.0.1:8798` is not a first-party Anthropic host
- **settings-model-mismatch** = settings `model` is `opus[1m]`; session started with `claude-fable-5-1[1m]`
- **transcript-modelId-ignored** = fresh `modelId` with `[1m]` ignored; second record is bare
- **api-echoed-bare-id** = assistant messages carry API-echoed `"model":"claude-fable-5-1"` (never includes `[1m]`)
- **proxy-masked-on-first-party** = control: without the proxy, against `api.anthropic.com`, both runs report 1000000
- **matching-settings-keeps-1m** = control: through the proxy with matching settings model, resume keeps `[1m]` at 1000000
- **has-repro** = proxy + settings mismatch + three session ids at 100% on macOS 26
- **hold** = HOLD alias for idle sterling
- **cousins** = cite-only #64771 #60548 #80272 #67806 #81142 #88345 #81068 #90325 #90324 — do not clone
- **fixtures** = row list for the hallmark booth
- **walk** = published non-first-party-base-url → settings-model-mismatch → transcript-modelId-ignored → bare-model-id → missing-1m-suffix → api-echoed-bare-id → context-window-200k → beta-header-missing

Verdicts: sterling, debased, bare-model-id, missing-1m-suffix, context-window-200k, beta-header-missing, non-first-party-base-url, settings-model-mismatch, transcript-modelId-ignored, api-echoed-bare-id, proxy-masked-on-first-party, matching-settings-keeps-1m, has-repro, hold, rubbed, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the piece is **debased** or already **sterling**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): resume may fall back to the API-echoed bare model id / settings default when the host is non-first-party instead of restoring the transcript's modelId with `[1m]` and the beta header. Invite verify against #93021 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93021](https://github.com/anthropics/claude-code/issues/93021)
- Cite-only: [anthropics/claude-code#64771](https://github.com/anthropics/claude-code/issues/64771) (CLOSED — Resumed sessions ignore [1m] context spec again)
- Cite-only: [anthropics/claude-code#60548](https://github.com/anthropics/claude-code/issues/60548) (CLOSED — Resumed sessions ignore [1m], fall back to 200k)
- Cite-only: [anthropics/claude-code#80272](https://github.com/anthropics/claude-code/issues/80272) (CLOSED — Statusline missing "1M context" on resume)
- Cite-only: [anthropics/claude-code#67806](https://github.com/anthropics/claude-code/issues/67806) (CLOSED — desktop-app resume disarms 1M-context sessions)
- Cite-only: [anthropics/claude-code#81142](https://github.com/anthropics/claude-code/issues/81142) (OPEN — Auto mode classifier sends [1m] without 1M beta header)
- Cite-only: [anthropics/claude-code#88345](https://github.com/anthropics/claude-code/issues/88345) (OPEN — Third-party gateway: 1M silently capped at 200k)
- Cite-only: [anthropics/claude-code#81068](https://github.com/anthropics/claude-code/issues/81068) (OPEN — Bedrock Opus budgeted 200K)
- Cite-only: [anthropics/claude-code#90325](https://github.com/anthropics/claude-code/issues/90325) / [#90324](https://github.com/anthropics/claude-code/issues/90324) (OPEN — Desktop picker drops 1M-context label)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:core, area:providers
- Product: Claude Code 2.1.266, macOS, Terminal.app
- Auth: Anthropic OAuth (claude.ai subscription), not an API key
- Reproduced 100% across three session ids on macOS 26 (Darwin 25.4.0)
- When `ANTHROPIC_BASE_URL` points at a non-first-party host (corporate gateway / proxy in front of `api.anthropic.com`) AND the session model differs from the `model` key in settings.json, `claude --resume` restores the model as bare `claude-fable-5-1` with a 200,000 context window instead of `claude-fable-5-1[1m]` with 1,000,000
- Not cosmetic: the resumed session also stops sending `context-1m-2025-08-07` in the `anthropic-beta` request header, so the API is asked for a 200K window and auto-compaction kicks in at 200K
- Fresh run writes `attachment.type=model` with `modelId` `claude-fable-5-1[1m]`. Resume ignores it and writes a second record with bare `modelId` `claude-fable-5-1`
- Assistant messages carry API-echoed `"model":"claude-fable-5-1"` (never includes `[1m]`), which looks like what resume falls back to
- On `api.anthropic.com` directly the bare id already means 1M, so the bug is masked there. Also does not occur when settings default equals the session model
- Expected: `--resume` restores the exact model started with, keeps the 1,000,000 window and the `context-1m-2025-08-07` beta header, regardless of host and settings default
- Repro: transparent reverse proxy to `api.anthropic.com` on `http://127.0.0.1:8798`; settings override with different default model (`opus[1m]`); fresh `--model 'claude-fable-5-1[1m]'` then `--resume` same SID → `modelUsage` key loses `[1m]`, `contextWindow` 200000, beta header missing
- Controls: without proxy both 1000000; through proxy with matching settings model keeps `[1m]`
- Impact: serious for companies running their own gateways for security/compliance. Also reported after idle sessions

Problem found: A HALLMARK THAT LOSES `[1m]` ON RESUME THROUGH A NON-FIRST-PARTY GATE IS NOT STERLING — IT IS DEBASED METAL AFTER THE PURITY MARK WAS RUBBED.

Why this solution: a diagnostic silversmith hallmark booth for the sterling → debased drift, so a reader can pin idle sterling, load the #93021 debased path, and score rubbed / bare-model-id / missing-1m-suffix / context-window-200k / beta-header-missing / non-first-party-base-url / settings-model-mismatch / transcript-modelId-ignored / api-echoed-bare-id / proxy-masked-on-first-party / matching-settings-keeps-1m / has-repro against the published facts.

## Why not a clone

This is specifically: **`--resume` LOSES `[1m]` CONTEXT WINDOW ON NON-FIRST-PARTY `ANTHROPIC_BASE_URL` WHEN SESSION MODEL DIFFERS FROM DEFAULT.**

**NOT Flashpan/#93015** (`lastRunAt` stamps without a session birth). Different paradigm.

**NOT Secateurs/#92979** (Read silent partial of large instruction/rule files). Different paradigm.

**NOT Palinode/#92998** (MEMORY.md bottom truncation of newest corrections). Different paradigm.

**NOT Ferrule/#92968** (Desktop MCP OAuth hardcoded TCP 53280). Different paradigm.

**NOT Interlock/#92976**. **NOT Assay** (tool-argument cupellation / #84405 tainted parse — different defect; Assay also used idle sterling for a different surface). **NOT Hangfire**. **NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **`--resume` restores a bare model id without `[1m]`, drops the window to 200k, and omits the 1M beta header — only when the host is non-first-party and the settings default differs.**

Do NOT rename this product Flashpan, Secateurs, Palinode, Ferrule, Interlock, Assay, or any existing catalog slug.
Do NOT reuse idle primed / flashed / flashpanned / unshorn / sheared / secateured / emended / unretracted / palinoded / ephemeral / voided / fouled / cold / banked.
Do NOT reuse Newsreader + Manrope + JetBrains Mono (Flashpan). Do NOT reuse Bitter + Figtree (Secateurs). Do NOT reuse Cardo + Nunito Sans (Palinode). Do NOT reuse Oswald + Source Sans 3 + Share Tech Mono (Ferrule). Do NOT reuse Chakra Petch + Hind (Interlock). Do NOT reuse Spectral + Fragment Mono (Assay).

Different surface: CLI `--resume` loses `[1m]` through a corporate gateway vs scheduled-task `lastRunAt` without birth / Read silent partial / MEMORY.md write-path bottom truncation / Desktop OAuth port clamp / plant-floor cwd interlock / tool-argument cupellation.

Product name stays **Hallmark**. Name/slug `hallmark` unused in catalog.json (243 products before this ship; Flashpan is #243).

Different UI: silversmith hallmark / assay booth / warm silver punch / pewter cupel / ink-black ledger / `[1m]` purity mark. Cinzel / Lato / Fira Code. NOT flintlock flash-pan. NOT garden pruning bench. NOT scriptorium wax/vellum. NOT metalwork ferrule gunmetal/cyan. NOT plant interlock. NOT Assay brick furnace.

Different verbs: Assay the strike, Pin idle sterling, Pin seeded debased, Admit sterling, Load fixtures, Reset to sterling.

Different idle: **sterling**. Different #93021 seeded path: **debased**. HOLD: **sterling**. ALARM: **debased** / **rubbed** / **bare-model-id** / **missing-1m-suffix** / **context-window-200k** / **beta-header-missing** / **non-first-party-base-url** / **settings-model-mismatch** / **transcript-modelId-ignored** / **api-echoed-bare-id** / **has-repro** / **cousins** / **fixtures**. Path: **rubbed**.

## How to score

```bash
node --test projects/hallmark/hallmark.test.mjs
node projects/hallmark/hallmark.mjs projects/hallmark/data/93021.json
node projects/hallmark/hallmark.mjs projects/hallmark/data/sterling.json
echo '{"seed":"debased"}' | node projects/hallmark/hallmark.mjs
```

Open the living card at `projects/hallmark/index.html` (or the live path `/hallmark/`). Buttons: Assay the strike, Pin idle sterling, Pin seeded debased, Admit sterling, Load fixtures, Reset to sterling. Toggle `[1m]` suffix / 1M window / beta header / first-party host / settings match / transcript honored — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/hallmark/
- Folder: `projects/hallmark/`
