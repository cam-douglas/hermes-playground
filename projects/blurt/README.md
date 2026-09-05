# Blurt

A **CRT / phosphor terminal atelier** — deep charcoal chassis, phosphor green, amber lamps, scanline bloom, bezel chrome — Syne + IBM Plex Sans + IBM Plex Mono — for a real Claude Code defect: **TERMINAL ID PROBES (XTVERSION + Primary DA) EMITTED INSIDE A ~50ms COOKED ECHO WINDOW AFTER FOCUS/BRACKETED-PASTE TEARDOWN, LEAKING VTE REPLIES AS CARET-NOTATION GARBAGE ABOVE THE BANNER.**

Primary:

- [anthropics/claude-code#92275](https://github.com/anthropics/claude-code/issues/92275) (OPEN, bug, has repro, platform:linux, area:tui). Title: `Terminal identification queries are sent during a ~50ms window where ECHO is re-enabled, leaking replies to the screen at startup`.

19:50 blurt: a blurt that leaks XTVERSION and DA replies through a cooked ECHO window is not a clean banner — it is already echoed. Score the hush or admit the probes already blurted.

Idle word: **hushed**. Seeded state: **blurted** / #92275 — probes already fired inside the cooked ECHO window; VTE replies leaked as caret notation. Never idle as single, maculed, stilled, rung, barred, dropped, pared, raw, cast, fouled, flowing, snubbed, matched, warded, lit, blanked, afloat, careened, caught, slipping, locked, wiped, seated, channel, stranded, scratched, live, orphaned, set, scrapped, pure, scorched, cold, voided, banked, rewritten, or any prior catalog idle.

**Blurt** is an involuntary utterance / leaked reply. Here the terminal answers XTVERSION and DA into a cooked ECHO window and the kernel blurts those replies onto the screen before the banner.

- **hushed** = HOLD: ECHO stays off; probes only after raw mode; clean banner
- **blurted** = #92275: probes fired inside cooked ECHO window; VTE replies leaked as caret notation
- **cooked** = ECHO re-enabled after focus/bracketed-paste teardown
- **probed** = XTVERSION + Primary DA emitted
- **leaked** = kernel line discipline echoed replies above banner
- **retried** = same probes resent ~110ms later with ECHO off (works)
- **cleaned** = raw mode held through identification; no caret garbage

Verdicts: hushed, blurted, cooked, probed, leaked, retried, cleaned.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the hush held or the probes already blurted. Fixtures use diagnostic shapes only (CSI sequences, ECHO on/off timestamps, VTE caret-notation fragments).

Hypothesis only (NON-BINDING): the desk should make “XTVERSION + Primary DA emitted inside a cooked ECHO window after focus/bracketed-paste teardown” visceral via a phosphor screen that already shows caret garbage above the banner. Discard if evidence disagrees. Encoded from the issue’s facts. Do not claim unseen source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92275](https://github.com/anthropics/claude-code/issues/92275)
- Cousin cite-only (different symptom): [#91530](https://github.com/anthropics/claude-code/issues/91530), [#87459](https://github.com/anthropics/claude-code/issues/87459)

What happened (from the issue):

- On startup Claude Code briefly restores the tty to cooked mode (ECHO on) and, inside that window, emits terminal identification queries `CSI > 0 q` (XTVERSION) and `CSI c` (Primary DA).
- Any terminal that answers quickly gets its replies echoed by the kernel line discipline in caret notation, printing garbage above the banner.
- Same queries are re-sent ~110ms later with ECHO correctly off, so the probe itself works — only the first premature emission leaks.
- Environment: Claude Code 2.1.261 (also 2.1.260; appeared in 2.1.251→2.1.259 range); Arch Linux; xfce4-terminal 1.2.0 / VTE 0.84.1; TERM=xterm-256color.
- User sees fragments like `^[[I`, `^[P>|VTE(...)`, `…1;22;28c` interleaved with the banner (focus-in, XTVERSION reply, Primary DA reply).
- Timestamped pty evidence: ECHO on→off correctly at ~0.040; later at ~0.202 ECHO restored ON after focus/bracketed-paste teardown; at ~0.206 XTVERSION+DA sent with ECHO on (BUG); at ~0.253 ECHO off again; at ~0.317 same queries correctly with ECHO off.
- Follow-up: VTE replies in ~0.1–14ms median — well inside the ~47–51ms cooked window.
- Expected: never emit identification queries while ECHO is on; keep raw mode through the probe; no caret-notation leak above the banner.

## Why not a clone

This is specifically: **TERMINAL ID PROBES (XTVERSION + Primary DA) EMITTED INSIDE A ~50ms COOKED ECHO WINDOW AFTER FOCUS/BRACKETED-PASTE TEARDOWN, LEAKING VTE REPLIES AS CARET-NOTATION GARBAGE ABOVE THE BANNER.**

NOT Macule ([#92294](https://github.com/anthropics/claude-code/issues/92294)) — show_widget validation-fail still renders + same-title duplicate. Blurt is not a letterpress proof.
NOT Alarum ([#92283](https://github.com/anthropics/claude-code/issues/92283)) — post-goodbye background kill wakes ended session. Blurt is not a night watchtower bell.
NOT Portcullis ([#92278](https://github.com/anthropics/claude-code/issues/92278)), Skive, Lagan, Snub, Ward, Deadlight, Careen, Ratchet, Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator, or any existing catalog slug.
NOT #91530 (tmux resume probe-as-input) and NOT #87459 (mouse tracking echo) — cousins only.

Different surface: TUI tty ECHO/raw-mode race at startup probes vs MCP widget card vs watchtower kill-wake.

Cousins are cite-only on a cousin strip; primary stays #92275.

- [#91530](https://github.com/anthropics/claude-code/issues/91530) — `claude --resume` under tmux — probe replies read as input. Cite-only. Do not ship as primary.
- [#87459](https://github.com/anthropics/claude-code/issues/87459) — Windows Terminal PowerShell: raw ANSI mouse tracking sequences echoed to screen. Cite-only. Do not ship as primary.

Backups (document only, do not build): [#92286](https://github.com/anthropics/claude-code/issues/92286) (Cresset), [#92292](https://github.com/anthropics/claude-code/issues/92292) (Symlink), [#92269](https://github.com/anthropics/claude-code/issues/92269) (Louver).

Product name stays **Blurt**. Do not rename to Macule, Alarum, Portcullis, Skive, Lagan, Snub, Ward, Deadlight, Careen, Ratchet, Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator or any existing catalog slug.

Different UI: CRT / phosphor terminal atelier — deep charcoal chassis, phosphor green (#7CFF9A-ish), amber lamps, scanline texture, soft bloom, bezel chrome, mono readout of CSI sequences and caret-notation fragments. Syne + IBM Plex Sans + IBM Plex Mono. NOT cream paper / vermilion letterpress (Macule). NOT indigo night watchtower (Alarum). NOT grate/portcullis. Stay OFF Bodoni Moda / Barlow / Share Tech Mono (Macule). Stay OFF Fraunces / Outfit (Alarum).

Different verbs: Score the hush, pin idle hushed, pin seeded blurted, admit the probes already blurted, load fixtures, reset to hushed. Score the hush is this desk’s phrase.

Different idle: **hushed**.

## Live catalog path

`/blurt/` is this static CRT scoring desk. Path `https://hermes-playground-green.vercel.app/blurt/` and subdomain `https://blurt.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `19:50 / hermes catalog #155 / #92275`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **blurted** — ECHO restored ON at ~0.202 after focus/bracketed-paste teardown; XTVERSION + Primary DA sent at ~0.206 with ECHO on; VTE replies in ~0.1–14ms leak as `^[[I`, `^[P>|VTE(...)`, `…1;22;28c` above the banner; same queries correctly re-sent at ~0.317 with ECHO off.
2. Idle **hushed** → ECHO stays off; probes only after raw mode; clean banner; idle word hushed.
3. Desk UI: charcoal CRT chassis, phosphor screen, amber lamps, scanline bloom. Hushed = clean banner. Blurted = caret-notation garbage above the mark. Timeline of ECHO on/off vs probe emissions. Fixture cards for XTVERSION / DA / focus-in fragments.
4. Cousin cite strip labeled cousin-not-primary: [#91530](https://github.com/anthropics/claude-code/issues/91530), [#87459](https://github.com/anthropics/claude-code/issues/87459). Cite only. Primary stays #92275.
5. **Score the hush** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Blurt simulator chips rewrite ECHO (raw / cooked), probe timing (after-raw / inside-window), VTE speed (fast / slow), and retry (resent-off / none).

## How to score

Open `projects/blurt/index.html` in a browser, or serve the repo root and visit `/blurt/` (Vercel rewrite → `/projects/blurt`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/blurt/hook/README.md
```

Empty paste scores the idle **hushed** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **blurted**.
