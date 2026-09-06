# Heliostat

A **rooftop observatory / brass heliostat mount** — copper dome, silvered mirror disc, sun-path dial, dawn-locked aim gauge, OSC-11 sky swatches (light `fafa` vs dark `2828`), DECSET-2031 silent bell that never rings, inject-997 override lever — Instrument Serif + Sora + IBM Plex Mono — for a real Claude Code defect: **`"theme": "auto"` NEVER FOLLOWS A LIVE LIGHT/DARK SWITCH ON WINDOWS TERMINAL BECAUSE RESAMPLE IS GATED SOLELY ON DECSET 2031, WHICH WT DOES NOT IMPLEMENT.**

Primary:

- [anthropics/claude-code#92389](https://github.com/anthropics/claude-code/issues/92389) (OPEN, bug, has-repro, platform:windows, area:tui). Title: `theme: "auto" never updates on Windows Terminal — resample is gated solely on DECSET 2031, which WT does not implement`. Filed 2026-09-05. Reporter: rodchristiansen.

10:50 heliostat: a heliostat that stays aimed at the dawn sky after the terminal's sun has moved because the only wake bell is DECSET 2031 and this terminal never rings it, is not a broken photometer — it is already dawnlocked. Score the track or admit the beam already misaimed.

Idle word: **dawnlocked**. Seeded state: **misaimed** / #92389 — OS/terminal flipped dark; WT OSC 11 already holds `rgb:2828/2c2c/3434`; Claude Code still light. Never idle as washed, stranded, unstruck, leaked, nixied, settled, open, elided, grafted, frozen, adrift, cold, voided, banked, rewritten, discarded, held, witnessed, or any prior catalog idle.

**Heliostat** is observatory work. A heliostat should continuously re-aim so the reflected beam stays on target as the sun (OS/terminal theme) moves. Here the mirror is locked to the dawn reading: the only wake signal is DECSET 2031, which this terminal never rings, while OSC 11 already holds the new sky color. Score whether a track (OS flip vs inject-997 vs `/theme`) would stay dawnlocked, track, or leave the beam misaimed.

- **dawnlocked** = IDLE / detect-once fence: `"theme": "auto"` resolves once at startup; resample waits for DECSET 2031; this terminal never rings it
- **misaimed** = seeded word: OS flipped dark; WT reports `rgb:2828/2c2c/3434`; Claude Code stays light (`rgb:fafa/fafa/fafa` dawn reading)
- **tracking** = contrast hold: resample ran; OSC 11 re-queried; beam on the live sky
- **manual-theme** = contrast hold: `/theme` or restart re-resolves by hand — not a live track
- **injected-997** = contrast hold: `ESC [ ? 997 ; 2 n` into the console input buffer immediately re-queries OSC 11 and switches; `;1n` switches back
- **unrecognized-2031** = `DECRQM ? 2031` → `0` NOT RECOGNIZED; microsoft/terminal#20335 closed 2026-07-31
- **osc11-fresh** = WT reports the new background immediately; Claude Code never asks again
- **focus-gated-daemon** = focus-driven re-query already in the binary, gated behind `CLAUDE_BG_BACKEND === "daemon"` rather than 2031 support
- **stdin-silent** = `?2031` enabled; several OS flips; 45s; nothing arrives on stdin
- **controls-supported** = `?2026` and `?2004` ARE supported, so the `0` is real
- **focus-requery** = expected fix: when 2031 is unrecognized, re-query OSC 11 on focus regain
- **interval-requery** = expected fix: when 2031 is unrecognized, re-query OSC 11 on an interval

Verdicts: dawnlocked, misaimed, tracking, manual-theme, injected-997, unrecognized-2031, osc11-fresh, focus-gated-daemon, stdin-silent, controls-supported, focus-requery, interval-requery.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a live OS theme flip on Windows Terminal would leave the mount dawnlocked or already misaimed. Fixtures use the issue's DECRQM table, OSC 11 before/after, 45s stdin silence, inject-997 confirmation, published repro, and the requested 2031-unrecognized fallback only.

Hypothesis only (NON-BINDING): when `DECRQM ? 2031` is unrecognized, fall back to OSC 11 re-query on focus regain and/or interval. Reuse the existing focus-driven path whenever 2031 is unavailable, not only when `CLAUDE_BG_BACKEND === "daemon"`. Detection is fine; the trigger is missing. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92389](https://github.com/anthropics/claude-code/issues/92389)

What happened (from the issue — do not invent):

- Environment: win32 (Windows 11 Enterprise 26200); Windows Terminal **1.24.11911.0**; Claude Code **2.1.261**; `settings.json`: `"theme": "auto"`.
- `"theme": "auto"` never follows a live light/dark switch on Windows Terminal. It resolves once at startup and then stays wrong until Claude Code is restarted, so a user who switches appearance once in the morning and once at night has to run `/theme` twice a day.
- The detection itself is fine. Only the **trigger** is missing: the resample is gated solely on DECSET 2031, which Windows Terminal does not implement — and has explicitly declined to implement.
- Claude Code enables `CSI ? 2031 h`, parses `CSI ? 997 ; [12] n` off stdin, and re-queries the background with OSC 11 when that report arrives. If the terminal never sends the report, the re-query never runs.
- Windows Terminal rejected mode 2031 in microsoft/terminal#20335 (closed 2026-07-31, "somewhat under-specified"). Maintainer guidance: applications should figure out the prevailing color-scheme background with an xterm color resource query (`11;?`) and make lightness decisions based on that.
- Queried from a live console on WT 1.24.11911.0 + Claude Code 2.1.261:

| Query | Reply |
|---|---|
| `DECRQM ? 2031` (theme notify) | `0` — **NOT RECOGNIZED** |
| `DECRQM ? 2026` (sync update, control) | supported |
| `DECRQM ? 2004` (bracketed paste, control) | supported |
| `OSC 11` before flip (light) | `ESC]11;rgb:fafa/fafa/fafa` |
| `OSC 11` after flip (dark) | `ESC]11;rgb:2828/2c2c/3434` |

- The two controls answering "supported" confirm the `0` is a real unrecognized-mode reply, not a probe artifact. Windows Terminal reports the **new** background immediately after the theme flip. The information Claude Code needs is available the whole time; nothing ever asks for it again.
- With `?2031` enabled and the OS theme flipped, nothing arrives on stdin — confirmed over a 45-second window across several flips.
- Injecting `ESC [ ? 997 ; 2 n` into the session's console input buffer makes Claude Code immediately re-query OSC 11 and switch to the correct theme, in a running session, with no restart. Injecting `;1n` switches it back. So the OSC 11 path, the parser, and the repaint all work — they are simply never invoked on this terminal.
- Repro: Windows 11 + Windows Terminal, profile `colorScheme` a `{ "dark": ..., "light": ... }` pair; `"theme": "auto"`; start light; switch OS to dark → terminal repaints; Claude Code keeps the light theme until restart or `/theme`.
- Request: when `DECRQM ? 2031` reports the mode as unrecognized, fall back to re-querying OSC 11 on focus regain, on an interval, or both. The binary already contains a focus-driven re-query path gated behind `CLAUDE_BG_BACKEND === "daemon"` rather than behind 2031 support.

## Why not a clone

This is specifically: **theme auto never updates on Windows Terminal because resample is gated solely on DECSET 2031, which WT does not implement; OSC 11 already holds the new sky; inject-997 proves the path works.**

NOT Lethe/#92335 — Chrome silent re-auth after session end. Heliostat is not an underworld ferry quay.
NOT Frizzen/#92353 — UserPromptSubmit listed-but-never-invoked. Heliostat is not a flintlock bench.
NOT Nixie/#92383 — postal undeliverable send / 45s no-ack settle. Heliostat is not a USPS nixie desk.
NOT Embrasure/#92365 — denyRead fail-open. Heliostat is not a battlement embrasure.
NOT Elision/#92347 — summary cut. Heliostat is not a blue-pencil folio.
NOT Graft/#92354 — plugin cache copy-forward. Heliostat is not an orchard grafting bench.
NOT Sostenuto/#92360 — CoreAudio hold-to-talk freeze. Heliostat is not an ebony piano.
NOT Jetsam/#92338 — stale tracking-ref Stop hook. Heliostat is not a teak quay.
NOT Priory/#92345 — MSIX priconfig leak. Heliostat is not a limestone cloister.
NOT Latchkey/#92330 — Remote Control OAuth false /login. Heliostat is not a brass latchkey board.

Different surface: Windows Terminal DECSET 2031 unrecognized / theme-auto detect-once vs those.

Cousins cite-only (NOT primary):

- [#63433](https://github.com/anthropics/claude-code/issues/63433) CLOSED not planned — macOS ask for auto to follow system appearance
- [#86048](https://github.com/anthropics/claude-code/issues/86048) OPEN — auto picks dark on a light terminal (inverted, different)
- [#75586](https://github.com/anthropics/claude-code/issues/75586) OPEN — auto palettes ≠ standalone Light/Dark
- [#92299](https://github.com/anthropics/claude-code/issues/92299) OPEN — feature: auto-daltonized

Product name stays **Heliostat**. Do not rename to Lethe, Frizzen, Nixie, Embrasure, Elision, Graft, Stroboscope, Flutter, Fairlead, Chock, Gypsy, Wildcat, Fulcrum, Trunnion, Aphonia, or any existing catalog slug. Name/slug `heliostat` confirmed unused in catalog.json.

Different UI: rooftop observatory / copper dome / brass heliostat mount / silvered mirror disc / sun-path dial / dawn-locked aim gauge / OSC-11 sky swatches / silent 2031 bell / inject-997 lever. Instrument Serif + Sora + IBM Plex Mono. NOT Cormorant Garamond / Manrope / IBM Plex Mono (Lethe river-mist). NOT Bodoni Moda / Commissioner / Space Mono (Frizzen walnut-steel-brass). Stay OFF underworld ferry quay / flintlock lockplate / postal pigeonholes / battlement merlons / blue-pencil folio / orchard cambium.

Different verbs: Score the track, pin idle dawnlocked, pin seeded misaimed, admit the beam already misaimed, flip OS theme vs inject-997 vs `/theme`, load fixtures, reset to tracking.

Different idle: **dawnlocked**. Different seeded: **misaimed**. Contrast: **tracking** / **manual-theme** / **injected-997**.

## Live catalog path

`/heliostat/` is this static observatory scoring assay. Path `https://hermes-playground-green.vercel.app/heliostat/` and subdomain `https://heliostat.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `10:50 / hermes catalog #170 / #92389`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **misaimed** — OS dark; WT OSC 11 `rgb:2828/2c2c/3434`; Claude still light.
2. Idle **dawnlocked** → detect-once fence; 2031 never rings; idle word dawnlocked.
3. Contrast **tracking** → resample ran; beam on the live sky.
4. Contrast **manual-theme** → `/theme` or restart; photometer works by hand.
5. Contrast **injected-997** → inject `CSI ? 997 ; 2 n`; live OSC 11 re-query.
6. Assay UI: copper dome, brass mount, silvered mirror, sun-path dial, dawn-locked needle, OSC-11 cuvettes, silent 2031 bell, inject-997 lever, mode lamps.
7. Stay-off strip: Lethe / Frizzen / Nixie / Embrasure / Elision / Graft / Sostenuto / Jetsam / Priory / Latchkey. Primary stays #92389.
8. **Score the track** walks the probe ticket and lights chips on the mount. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the track (OS flip / inject-997 / `/theme`).

## How to score

Open `projects/heliostat/index.html` in a browser, or serve the repo root and visit `/heliostat/` (Vercel rewrite → `/projects/heliostat`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **dawnlocked** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **misaimed** / OSC 11 fresh / Claude still light.
