# Pasteboard

A **compositor paste-up / kraft pasteboard** atelier — kraft board, rubber-cement amber pot, cyan registration crosses, newsprint cream sheet, steel T-square — Alegreya + Source Sans 3 + Ubuntu Mono — for a real Claude Code defect: **PLATFORM-CONDITIONAL DEFAULT KEYBINDING SUBSTITUTES `Alt+V` AWAY ON LINUX/MACOS → NO WORKING IMAGE PASTE WHEN THE TERMINAL OWNS `Ctrl+V`; WSL GETS BOTH ADDITIVELY; AREA:TUI+KEYBINDINGS.**

Primary:

- [anthropics/claude-code#92312](https://github.com/anthropics/claude-code/issues/92312) (OPEN, bug, has repro, platform:linux, area:tui, keybindings). Title: `[BUG] Linux: Alt+V image paste does nothing — chat:imagePaste is bound to Alt+V only on Windows/WSL, so default shortcuts differ per OS`. Filed 2026-09-05. Reporter: g-i-o-r-g-i-o.

21:50 pasteboard: a pasteboard that binds Alt+V only on Windows is not a cross-platform shortcut — it is already missed. Score the chord or admit the image already never stuck.

Idle word: **stuck**. Seeded state: **missed** / #92312 — Alt+V no-op on Linux; pasteboard blank. Never idle as gated, spilled, hushed, blurted, single, maculed, stilled, rung, barred, dropped, pared, raw, cast, fouled, flowing, snubbed, matched, warded, lit, blanked, afloat, careened, caught, slipping, locked, wiped, seated, channel, stranded, scratched, live, orphaned, set, scrapped, pure, scorched, cold, voided, banked, rewritten, or any prior catalog idle.

**Pasteboard** is the compositor’s kraft board — the sheet that should take an image chip when the operator presses the image-paste chord. Here the default table substitutes `Alt+V` away off Windows/WSL, so a VTE terminal that already owns `Ctrl+V` leaves Linux with a blank board.

- **stuck** = HOLD: image chip affixed via a working `chat:imagePaste` chord
- **missed** = #92312: Alt+V no-op on Linux; pasteboard blank
- **windows-alt** = Windows: `Alt+V` for `chat:imagePaste`
- **wsl-both** = WSL: both `Alt+V` and `Ctrl+V`
- **linux-ctrl-only** = Linux/macOS: `Ctrl+V` only
- **terminal-steals-ctrlv** = VTE (ddterm, GNOME Terminal, Tilix, Konsole) owns `Ctrl+V`; Linux left with zero working image-paste shortcut
- **additive-fix** = proposed: bind `Alt+V` additively on every platform, exactly as WSL already does
- **has-clear-repro** = issue labeled has repro; screenshot on clipboard is `image/png`
- **hold** = persistHold / chip stays affixed

Verdicts: stuck, missed, windows-alt, wsl-both, linux-ctrl-only, terminal-steals-ctrlv, additive-fix, has-clear-repro, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real hooks that mutate Claude Code. Score whether the image-paste chord affixed the chip or the pasteboard already stayed blank. Fixtures use diagnostic shapes only (`chat:imagePaste`, `Alt+V`, `Ctrl+V`, platform windows/wsl/linux/macos, `image/png`, ddterm/VTE, proposed additive bind).

Hypothesis only (NON-BINDING): default keybinding table substitutes rather than adds `Alt+V` off Windows/WSL. Do not claim source beyond the issue’s quoted binding snippet and measured repro. Discard if evidence disagrees.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92312](https://github.com/anthropics/claude-code/issues/92312)
- Cousin cite-only (NOT primary): [#74424](https://github.com/anthropics/claude-code/issues/74424), [#88898](https://github.com/anthropics/claude-code/issues/88898), [#8324](https://github.com/anthropics/claude-code/issues/8324)

What happened (from the issue):

- On Linux, `Alt+V` does nothing in the Claude Code prompt. `chat:imagePaste` is bound to `Alt+V` only on Windows and WSL; Linux and macOS get `Ctrl+V` only. The same CLI has different default shortcuts depending on the OS, and the one that differs is image paste.
- Default keybindings (identical 2.1.120→2.1.261):

  ```js
  de = (platform === "windows" || platform === "wsl") ? "alt+v" : "ctrl+v"
  [de]: "chat:imagePaste",
  ...(platform === "wsl" && { "ctrl+v": "chat:imagePaste" })
  ```

- Linux/macOS: `Ctrl+V` only for `chat:imagePaste`. Windows: `Alt+V`. WSL: both `Alt+V` and `Ctrl+V`.
- Repro: Ubuntu 24.04 (GNOME, Wayland), Claude Code 2.1.261, VTE-based terminal. Copy a screenshot (`wl-paste --list-types` → `image/png`). Press `Alt+V` in the prompt.
- Expected: an `[Image #1]` chip, as on Windows.
- Actual: nothing — no chip, no hint, no error.
- Terminals that bind `Ctrl+V` for their own paste (ddterm, GNOME Terminal, Tilix, Konsole) leave Linux with **no working image-paste key**. On the reporter’s setup the only thing that attaches an image is accidental `Ctrl+Shift+V` (same byte as `Ctrl+V`), undocumented.
- Proposed fix: bind `Alt+V` to `chat:imagePaste` on every platform, additively, exactly as WSL already does. Platform-specific keys should be added, never substituted.
- Environment: Claude Code 2.1.261, native install; Ubuntu 24.04.4 LTS, GNOME, Wayland, ddterm (VTE 0.76). Same user on Windows 10, where `Alt+V` works as documented.

## Why not a clone

This is specifically: **PLATFORM-CONDITIONAL DEFAULT KEYBINDING SUBSTITUTES Alt+V AWAY ON LINUX/MACOS → NO WORKING IMAGE PASTE WHEN TERMINAL OWNS Ctrl+V; WSL GETS BOTH ADDITIVELY; AREA:TUI+KEYBINDINGS.**

NOT Spillway ([#92311](https://github.com/anthropics/claude-code/issues/92311)) — ultracode concurrency dam bypass. Pasteboard is not a hydroelectric desk.
NOT Blurt ([#92275](https://github.com/anthropics/claude-code/issues/92275)) — XTVERSION+Primary DA cooked-ECHO VTE leak. Pasteboard is not a CRT atelier.
NOT Macule ([#92294](https://github.com/anthropics/claude-code/issues/92294)) — show_widget duplicate card. Pasteboard is not a letterpress.
NOT Alarum ([#92283](https://github.com/anthropics/claude-code/issues/92283)) — post-goodbye background-kill wake.
NOT Portcullis ([#92278](https://github.com/anthropics/claude-code/issues/92278)) — managed-preferences EACCES fail-close.
NOT Frisket ([#91574](https://github.com/anthropics/claude-code/issues/91574)) / Tangent ([#92021](https://github.com/anthropics/claude-code/issues/92021)).
NOT #88898 / #8324 as primary — those are clipboard tooling, different root cause.

Different surface: default image-paste chord substituted per OS vs ultracode cap skip vs TUI ECHO race vs widget macule vs watchtower.

Cousins are cite-only on a cousin strip; primary stays #92312.

- [#74424](https://github.com/anthropics/claude-code/issues/74424) — closed stale. Same reporter; same Linux Alt+V image-paste symptom, filed as a regression. Cite-only. Do not ship as primary.
- [#88898](https://github.com/anthropics/claude-code/issues/88898) — open. Wayland + xclip silently pastes text instead of the image. Clipboard tooling, not the key. Cite-only.
- [#8324](https://github.com/anthropics/claude-code/issues/8324) — open. Can’t paste image from clipboard on Linux (Ubuntu). Clipboard tooling, not the key. Cite-only.

Backups (document only, do not build): [#92305](https://github.com/anthropics/claude-code/issues/92305) (Intake), [#92286](https://github.com/anthropics/claude-code/issues/92286) (Cresset), [#92292](https://github.com/anthropics/claude-code/issues/92292) (Symlink).

Product name stays **Pasteboard**. Do not rename to Spillway, Blurt, Macule, Alarum, Portcullis, Skive, Lagan, Snub, Ward, Deadlight, Careen, Ratchet, Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator or any existing catalog slug.

Different UI: compositor paste-up / kraft pasteboard atelier — kraft brown board, rubber-cement amber pot, cyan registration crosses, newsprint cream sheet, steel T-square, Alt+V chord lamp vs Ctrl+V terminal-steal dial. Palette: kraft brown, rubber-cement amber, cyan register, newsprint cream, graphite. Alegreya + Source Sans 3 + Ubuntu Mono. NOT Teko/Hind/Fira Code (Spillway). NOT Syne/IBM Plex Sans/IBM Plex Mono (Blurt). NOT Bodoni Moda/Barlow/Share Tech Mono (Macule). NOT Fraunces/Outfit/IBM Plex Mono (Alarum). NOT Cormorant Garamond/Manrope/JetBrains Mono (Portcullis). Stay OFF spillway dam / blurt CRT / macule letterpress / alarum watchtower / portcullis grate / skive tannery / lagan salvage / snub post / ward keyway / deadlight shutter.

Different verbs: Affix the chip, Pin idle stuck, Pin seeded missed, Admit the image already never stuck, Load fixtures, Reset to stuck. Affix the chip is this desk’s phrase.

Different idle: **stuck**.

## Live catalog path

`/pasteboard/` is this static paste-up scoring desk. Path `https://hermes-playground-green.vercel.app/pasteboard/` and subdomain `https://pasteboard.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `21:50 / hermes catalog #157 / #92312`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **missed** — Linux/macOS `Ctrl+V` only; `Alt+V` unbound; ddterm (VTE) owns `Ctrl+V`; screenshot `image/png` on the clipboard; operator presses `Alt+V`; nothing — no chip, no hint, no error.
2. Idle **stuck** → a working `chat:imagePaste` chord affixes `[Image #1]`; idle word stuck.
3. Desk UI: kraft board, rubber-cement pot, cyan registration crosses, newsprint cream sheet, steel T-square. Stuck = image chip affixed on the sheet. Missed = blank board. Platform strip: Windows `Alt+V` / WSL both / Linux+macOS Ctrl-only. Chord lamp vs terminal-steal dial. Additive `Alt+V` fix callout.
4. Cousin cite strip labeled cousin-not-primary: [#74424](https://github.com/anthropics/claude-code/issues/74424), [#88898](https://github.com/anthropics/claude-code/issues/88898), [#8324](https://github.com/anthropics/claude-code/issues/8324). Cite only. Primary stays #92312.
5. **Affix the chip** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Pasteboard simulator chips rewrite platform (windows / wsl / linux / macos), terminal steal (none / VTE Ctrl+V), and binding (substituted / additive).

## How to score

Open `projects/pasteboard/index.html` in a browser, or serve the repo root and visit `/pasteboard/` (Vercel rewrite → `/projects/pasteboard`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/pasteboard/hook/README.md
```

Empty paste scores the idle **stuck** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **missed**.
