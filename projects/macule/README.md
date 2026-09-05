# Macule

A **letterpress / proofing-press atelier** — warm cream paper, ink-black type, vermilion registration marks, soft graphite guides, slight press-bed shadow — Bodoni Moda + Barlow + Share Tech Mono — for a real Claude Code defect: **VALIDATION-FAILED `show_widget` STILL RENDERS, THEN A SAME-TITLE RETRY ACCUMULATES A PERSISTENT DUPLICATE CARD (SCHEMA SAYS TITLE OPTIONAL; BACKEND REQUIRES IT).**

Primary:

- [anthropics/claude-code#92294](https://github.com/anthropics/claude-code/issues/92294) (OPEN, bug, has repro, platform:macos, area:mcp, area:ui). Title: `[BUG] show_widget: failed validation call + retry with same title leaves duplicate widget rendered`.

18:50 macule: a macule that prints a second impression after the failed pull is not a clean proof — it is already doubled. Score the sheet or admit the impression already maculed.

Idle word: **single**. Seeded state: **maculed** / #92294 — failed call already printed a ghost card; retry printed a second; two cards remain. Never idle as stilled, rung, barred, dropped, pared, raw, cast, fouled, flowing, snubbed, matched, warded, lit, blanked, afloat, careened, caught, slipping, locked, wiped, seated, channel, stranded, scratched, live, orphaned, set, scrapped, pure, scorched, cold, voided, banked, rewritten, keyed, strayed, scrubbed, pulled, enacted, withheld, masked, bled, careted, ringing, home, indexed, jumped, or any prior catalog idle.

**Macule** is a blot / double-impression defect on the printed sheet. Here a validation-failed `mcp__visualize__show_widget` pull still inks a card, and the same-title retry inks a second — so the proof is already doubled.

- **single** = HOLD: one card; validation failure never printed
- **maculed** = #92294: failed call printed a ghost; same-title retry printed a second; two cards remain
- **ghosted** = failed validation still rendered a widget card
- **validated** = retry with title included succeeded
- **mismatched** = schema lists title optional; backend requires title
- **retried** = same-title retry after the failed pull
- **persisted** = ghost card remains alongside the success card
- **cleared** = expected: validation failure never renders UI
- **schema** = declared required list is `["loading_messages"]` only
- **backend** = backend throws MCP `-32602` when title is missing

Verdicts: single, maculed, ghosted, validated, mismatched, retried, persisted, cleared, schema, backend.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the sheet is single or already maculed. Fixtures use diagnostic shapes only (show_widget args, -32602 validation error, title omit/include, duplicate cards, schema required list).

Hypothesis only (NON-BINDING): the desk should make "validation-failed show_widget still prints, then same-title retry doubles the sheet" visceral via two overlapping impressions on a proof. Discard if evidence disagrees. Encoded from the issue’s facts. Do not claim unseen source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92294](https://github.com/anthropics/claude-code/issues/92294)
- Cousin cite-only (closed/stale, different final symptom): [#53030](https://github.com/anthropics/claude-code/issues/53030), [#60052](https://github.com/anthropics/claude-code/issues/60052)

What happened (from the issue):

- Calling `mcp__visualize__show_widget` (visualize MCP app): a first call that fails input validation, followed by a retry with the same `title`, leaves TWO duplicate widget cards in the chat UI.
- The failed call is not supposed to render anything, but it does, and that rendered content persists after the retry succeeds (does not disappear).
- Schema/backend mismatch: declared JSON schema lists `required: ["loading_messages"]` only (`title` optional per schema), but backend enforces `title` and throws MCP error `-32602` when missing. That mismatch produces the first failed call in practice.

Repro (from the issue — document only):

1. Call show_widget with widget_code + loading_messages, omit title → `-32602` invalid_type path title.
2. Retry with title included → succeeds.
3. UI shows two "Widget from visualize show_widget" cards.

Expected (from the issue):

- Schema should mark title required OR backend accept missing title.
- Validation failure must never render UI.
- Retry with same title must not accumulate a second card.

Live-reproduced 2026-09-05 on Claude Code desktop (Code tab), macOS, Claude Code 2.1.220.

Related but different: #53030 (widget renders then disappears on HTTP 400 — transient, self-corrects). Here the failed-call duplicate *persists* alongside the success card.

## Why not a clone

This is specifically: **VALIDATION-FAILED show_widget STILL RENDERS, THEN SAME-TITLE RETRY ACCUMULATES A PERSISTENT DUPLICATE CARD (schema says title optional; backend requires it).**

NOT Alarum ([#92283](https://github.com/anthropics/claude-code/issues/92283)) — post-goodbye kill notification wakes ended session. Macule is not a night watchtower bell.
NOT #53030 — transient widget then disappear on HTTP 400. Cite in `cousins.json` only. Macule is the persistent duplicate, not a self-correcting vanish.
NOT #60052 — deferred MCP first-call validation / ToolSearch. Cite only. Different surface.
NOT Portcullis ([#92278](https://github.com/anthropics/claude-code/issues/92278)) — managed-preferences EACCES fail-close.
NOT Skive ([#92271](https://github.com/anthropics/claude-code/issues/92271)) — Bash-first `thrifty_sonic` skive of rules / nested `CLAUDE.md` / hooks.
NOT Lagan ([#92266](https://github.com/anthropics/claude-code/issues/92266)) — leftover `claude` children after desktop close.
NOT Snub ([#92262](https://github.com/anthropics/claude-code/issues/92262)) — Bash-tool heredoc pipe deadlock.
NOT Ward ([#92252](https://github.com/anthropics/claude-code/issues/92252)) — Keychain default-path mis-ward.
NOT Deadlight ([#92249](https://github.com/anthropics/claude-code/issues/92249)) — ListAgents/SendMessage blank in unattended Desktop.
NOT Careen, Ratchet, Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator, or any existing catalog slug.

Different surface: MCP visualize widget card idempotency / pre-success render vs watchtower kill-wake vs managed-prefs gate vs Bash-first steer vs leftover children vs heredoc hang vs Keychain vs tool registry. Completely different UI (letterpress proofing-press — warm cream paper, ink-black type, vermilion registration marks, soft graphite guides, press-bed shadow — not Alarum indigo night watchtower, not Portcullis castle iron, not Skive leather tannery, not Lagan harbor brine, not snub post, not keychain ward, not deadlight shutter, not oubliette pit, not wick folio), backend (probe-shaped JSON of single / maculed / ghosted / validated / mismatched / retried / persisted / cleared / schema / backend rows), and UX (proof sheet with two overlapping cards when maculed + schema-vs-backend mismatch strip + registration pull counter).

Cousins are cite-only on a cousin strip; primary stays #92294.

- [#53030](https://github.com/anthropics/claude-code/issues/53030) — closed/stale. Widget renders then disappears on HTTP 400 — transient, self-corrects. Cite-only. Do not ship as primary.
- [#60052](https://github.com/anthropics/claude-code/issues/60052) — closed/stale. Deferred MCP first-call validation / ToolSearch. Cite-only. Do not ship as primary.

Backups (document only, do not build): [#92275](https://github.com/anthropics/claude-code/issues/92275) (Blurt — TUI ECHO leak), [#92286](https://github.com/anthropics/claude-code/issues/92286) (Cresset — fabricated user/system lines), [#92292](https://github.com/anthropics/claude-code/issues/92292) (desktop dir symlink as file).

Product name stays **Macule**. Do not rename to Alarum, Portcullis, Skive, Lagan, Snub, Ward, Deadlight, Careen, Ratchet, Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator or any existing catalog slug.

Different UI: cream proof sheet + vermilion registration marks + overlapping widget cards + schema/backend mismatch strip + pull counter. Bodoni Moda + Barlow + Share Tech Mono. NOT Fraunces / Outfit / IBM Plex Mono (Alarum). NOT Cormorant Garamond / Manrope / JetBrains Mono (Portcullis). NOT Newsreader / Source Sans 3 (Skive). NOT Spectral / Inter / Fira Code (Lagan). NOT Eczar / Schibsted Grotesk / Martian Mono (Oubliette). Stay OFF indigo night watchtower, castle portcullis iron, leather tannery, harbor brine, snub post, keychain ward, deadlight shutter, oubliette pit, wick folio.

Different verbs: Score the sheet, pin idle single, pin seeded maculed, admit the impression already maculed, load fixtures, reset to single. Score the sheet is this desk’s phrase.

Different idle: **single**.

## Live catalog path

`/macule/` is this static letterpress scoring desk. Path `https://hermes-playground-green.vercel.app/macule/` and subdomain `https://macule.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `18:50 / hermes catalog #154 / #92294`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **maculed** — first show_widget call omitted title; schema allowed it (`required: ["loading_messages"]` only); backend threw `-32602` invalid_type path title; the failed call still printed a ghost card; retry with the same title succeeded; two "Widget from visualize show_widget" cards remain; the ghost did not disappear.
2. Idle **single** → validation failure never printed; one crisp card; idle word single.
3. Desk UI: proof sheet on a press bed, vermilion registration marks, graphite guides. Single = one crisp card. Maculed = two overlapping semi-transparent cards. Schema chip says title optional; backend chip says title required; `-32602` flash. Pull counter: failed pull printed anyway; successful pull adds second impression.
4. Cousin cite strip labeled cousin-not-primary: [#53030](https://github.com/anthropics/claude-code/issues/53030), [#60052](https://github.com/anthropics/claude-code/issues/60052). Cite only. Primary stays #92294.
5. **Score the sheet** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Macule simulator chips rewrite title (omit / include), first pull (fail-and-print / never-render / success), retry (same-title / none), and accumulate policy (accumulate / replace / never-print-fail).

## How to score

Open `projects/macule/index.html` in a browser, or serve the repo root and visit `/macule/` (Vercel rewrite → `/projects/macule`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/macule/hook/README.md
```

Empty paste scores the idle **single** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **maculed**.
