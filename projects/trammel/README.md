# Trammel

A **drafting-office Archimedean trammel / split-sash desk** — mahogany board, brass grooves, ivory, india-ink, Prussian-blue construction lines; Newsreader + Sora + Red Hat Mono — for a real Claude Code VS Code defect: **two visible Claude webview panels mutually steal composer focus when the window regains OS focus, because `isVisible` ≠ `isActive` and `document.activeElement` is per-document**.

Primary:

- [anthropics/claude-code#90936](https://github.com/anthropics/claude-code/issues/90936) (OPEN, has repro, filed 2026-08-31T08:44:35Z by HwangYoonSeong). Title: [BUG] VS Code extension: focus ping-pongs between two visible Claude panels when the window regains focus (refs #71809, #79770). Labels: bug, has repro, platform:macos, area:ide, platform:vscode. Extension **anthropic.claude-code 2.1.251**. VS Code **1.134.0**. macOS arm64.

A hunting trammel is not a hold. Score the grooves or admit **traced**.

Idle word: **traced**. Seeded state: **hunting** / #90936 — two visible Claude iframes, window regain, per-document body-guard, `visibility_changed` isVisible-only, `setTimeout(..., 0)` offset loop. Never idle as "trammel" / "hunting" / "oscillating" / "stolen" / "ping-pong" / "focus" / "flicker" / "split" / "loop" / "soundpost" / "coupled" / "fallen" / "struck" / "torn" / "seated".

- **traced** = hold: only the active panel restores composer; the ellipse is true
- **hunting** = #90936 primary — two visible panels, window regain, per-document body-guard, isVisible without isActive
- **split** = two editor groups both show a Claude tab
- **visible-not-active** = `WebviewPanel.visible === true` for each group's active tab; `isActive` omitted
- **per-document** = `document.activeElement` is per-iframe
- **body-guard** = restore runs when `!activeElement || activeElement === body`
- **timeout-offset** = `setTimeout(..., 0)` keeps the two cycles offset
- **steal-loop** = the two composers mutually steal focus
- **iframe-focus** = each panel is its own iframe / document
- **no-isActive** = `visibility_changed` carries only `isVisible`; `panel.active` is not sent
- **dual-visible** = both panels report visible
- **flicker** = caret ping-pongs; typing is impossible

Verdicts: hunting, traced, split, visible-not-active, per-document, body-guard, timeout-offset, steal-loop, iframe-focus, no-isActive, dual-visible, flicker.

## Why not a clone

This is specifically: **TWO VISIBLE WEBVIEW PANELS MUTUALLY STEALING COMPOSER FOCUS ON WINDOW REGAIN**, because `isVisible` ≠ `isActive` and `activeElement` is per-document.

NOT **Soundpost** ([#90926](https://github.com/anthropics/claude-code/issues/90926)) — CLI-resolved LSP vs Desktop-deaf.
NOT **Flong** ([#90916](https://github.com/anthropics/claude-code/issues/90916)) — torn Git Bash snapshot.
NOT **Bulla** ([#90891](https://github.com/anthropics/claude-code/issues/90891)) — MSIX integrity.
NOT **Trompe** ([#90881](https://github.com/anthropics/claude-code/issues/90881)) — phantom /clear.
NOT **Davy** ([#90886](https://github.com/anthropics/claude-code/issues/90886)) — false boot-canary.
NOT **Moviola** ([#90716](https://github.com/anthropics/claude-code/issues/90716)) — prefix-mutating image eviction.
NOT **Census** ([#90927](https://github.com/anthropics/claude-code/issues/90927)) — do not ship.
NOT **Callboard** ([#90858](https://github.com/anthropics/claude-code/issues/90858)) — pre-session skill autocomplete.

Different UI: drafting trammel on a mahogany board plus a split sash (two editor groups, two Claude composers). Newsreader + Sora + Red Hat Mono. Brass / ivory / india-ink / Prussian-blue. NOT Soundpost Fraunces + Source Sans 3 + IBM Plex Mono amber/maple/spruce. NOT Flong soot/iron foundry. NOT Bulla papal lead.

Different verbs: score the grooves, pin idle traced, pin seeded hunting, regain the sash. Not "Score the plates" / "Lay idle coupled".

Different idle: **traced**.

## Live catalog path

`/trammel/` is this static drafting desk. Demo works with no secrets and no npm. Mark: `18:50 / hermes catalog #92 / #90936`.

1. Idle demo loads **traced** — only the active pane holds the caret; the ellipse is true.
2. Seed **hunting** → #90936 ticket: two visible Claude webviews, window regain, per-document body-guard, isVisible-only, setTimeout 0 offset.
3. **Regain the sash** simulates OS window focus. When hunting, the caret ping-pongs. When traced, only the active pane restores.
4. **Score the grooves** walks the ticket and lights chips on the brass pins.
5. Contrast: same editor group → only one visible → no loop.
6. Evidence drawer with the GitHub issue links. Fetch #90936 without a token (idle copy is fine).

## How to score

Open `projects/trammel/index.html` in a browser, or serve the repo root and visit `/trammel/` (Vercel rewrite → `/projects/trammel`). No build step. Optional hook:

```bash
node projects/trammel/hook/trammel.mjs projects/trammel/data/90936.json
node projects/trammel/hook/trammel.mjs projects/trammel/data/traced.json
node --test projects/trammel/hook/trammel.test.mjs
```

Hunting seed → hunting/alarm. Traced seed → traced/hold.

`projects/trammel/hook/trammel.mjs` classifies a ticket and returns `{ verdict, chips[], reasons[], hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90936.json`, `data/hunting.json`, `data/traced.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/contrast.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#90936](https://github.com/anthropics/claude-code/issues/90936). Unauthenticated. See `.env.example`.
2. Paste/edit a groove ticket JSON and score.
3. Seed chips: traced / hunting / split / visible-not-active / steal-loop / flicker.
4. Contrast plate: same-group workaround vs split dual-visible.
5. Evidence drawer: #71809, #79770, #89975, #32726, #74808.

## Sources

- [anthropics/claude-code#90936](https://github.com/anthropics/claude-code/issues/90936) OPEN
- Same-class (cite, not primary): [#71809](https://github.com/anthropics/claude-code/issues/71809) closed stale — original ping-pong, Linux, You-lius; [#79770](https://github.com/anthropics/claude-code/issues/79770) OPEN — Bug 3 rapid focus ping-pong, schneiderbruno; [#89975](https://github.com/anthropics/claude-code/issues/89975) OPEN, has repro — Windows, two split panels + `claude-vscode.focus`, doojin1016-eng; [#32726](https://github.com/anthropics/claude-code/issues/32726) open enhancement — preserveFocus / panel steal; [#74808](https://github.com/anthropics/claude-code/issues/74808) — insertAtMention steals focus via reveal without preserveFocus.
- Contrast / workaround: same editor group → only one visible → no loop.
