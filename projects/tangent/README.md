# Tangent

A **clavichord / keyboard-protocol sounding board** — keycap strip, CSI-u decode tape (`49:33;2u`), flag plaque (`>1u` vs `>5u`), ConPTY mute lamp, alternate-field gauge; walnut / ivory key / signal brass / ink mute — Instrument Serif + Albert Sans + Spline Sans Mono — for a real Claude Code defect: **SHIFTED KEYS LOST IN WEZTERM SINCE 2.1.247: KITTY "REPORT ALTERNATE KEYS" FLAG IS REQUESTED BUT THE SHIFTED-KEY FIELD IS NEVER PARSED; AREA:TUI; PLATFORM:WINDOWS; PLATFORM:WSL; REGRESSION.**

Primary:

- [anthropics/claude-code#92021](https://github.com/anthropics/claude-code/issues/92021) (OPEN, bug, has repro, platform:windows, platform:wsl, area:tui, regression, filed 2026-09-04T08:16:01Z, updated 2026-09-04T08:17:09Z). Title: `[BUG] Shifted keys lost in WezTerm since 2.1.247: Kitty "report alternate keys" flag is requested but the shifted-key field is never parsed`. Reporter chadkirst-authid. Claude Code 2.1.260 (verified 2.1.247 / 2.1.258 / 2.1.259 / 2.1.260). Last working 2.1.246. WezTerm 20240203-110809-5046fc22 on Windows 11 hosting WSL2 Ubuntu.

a tangent that never strikes the shifted pitch is not a keyed note — it is a muted string. Score the strike or admit the alternate field already muted.

Idle word: **sounded**. Seeded state: **muted** / #92021 — 2.1.247+ sends `ESC[>5u` (Kitty flag 4 = report alternate keys); 2.1.246 sent `ESC[>1u`. WezTerm encodes Shift+1 as `ESC[49:33;2u` (unshifted 1, shifted !). The CSI-u parser reads the first sub-parameter and reconstructs by uppercasing — wrong for symbols. On WezTerm→ConPTY→WSL colon-bearing sequences often insert nothing. Shift+Tab / Shift+Enter still work. Never idle as slipped / fouled / verbatim / mangled / moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

A **tangent** should drive into the string at the pitched (shifted) contact when the protocol reports an alternate key. Flag 4 asks for the shifted pitch; the parser strikes only the unshifted string (or mutes entirely on ConPTY).

- **muted** = #92021: `ESC[>5u]` requested; shifted sub-parameter never parsed; symbols wrong or blank on WezTerm/WSL
- **unshifted** = parser reads first sub-parameter only and reconstructs by uppercasing
- **flag-4** = 2.1.247+ sends `ESC[>5u]`; requesting flag 4 without consuming the field it adds
- **csi-u** = WezTerm encodes Shift+1 as `ESC[49:33;2u` (unshifted 1, shifted !)
- **conpty-blank** = WezTerm→ConPTY→WSL colon-bearing sequences insert nothing; Shift+Tab / Shift+Enter still work
- **event-type-drop** = `ESC[97:65;2:1u` dropped by a regex that only accepts a bare modifier number
- **symbol-wrong** = `1` / `;` / `/` land instead of `!` / `:` / `?`
- **alternate-ignored** = second (shifted) field never consumed
- **hold** = Shift-only CSI-u uses the alternate field; the string sounds
- **sounded** = HOLD: Shift-only CSI-u uses alternate field; `!` / `?` / `:` / `A` insert correctly

Verdicts: sounded, muted, unshifted, flag-4, csi-u, conpty-blank, event-type-drop, symbol-wrong, alternate-ignored, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the tangent sounded or the alternate field already muted.

Hypothesis only (NON-BINDING): Kitty flag 4 requests alternate keys but the CSI-u parser never consumes the shifted sub-parameter (and event-type modifier form fails the regex). Discard if issue evidence disagrees. Encoded from the issue's startup sequences and insert table. Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **SHIFTED KEYS LOST IN WEZTERM SINCE 2.1.247: KITTY "REPORT ALTERNATE KEYS" FLAG IS REQUESTED BUT THE SHIFTED-KEY FIELD IS NEVER PARSED; AREA:TUI; PLATFORM:WINDOWS; PLATFORM:WSL; REGRESSION.**

NOT Hawser ([#91578](https://github.com/anthropics/claude-code/issues/91578)) — Windows idle warm MCP unreaped children.
NOT Caret ([#91526](https://github.com/anthropics/claude-code/issues/91526)) — npx cmd.exe argv reparse.
NOT Buoy ([#91569](https://github.com/anthropics/claude-code/issues/91569)) — macOS floating window layer.
NOT Solecism / Coffer / Codicil / Crimp / Jackfield / Tocsin / Bolter / Deadeye / Knock paradigms.
NOT leftover hawser process-reap / proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging.

Different surface: TUI Kitty CSI-u shifted-field parse on WezTerm/WSL.

Cousins are cite-only on a cousin strip; primary stays #92021.

- [#90067](https://github.com/anthropics/claude-code/issues/90067) — OPEN — earlier same WezTerm shifted-punctuation regression (Linux/WSL; decoder snippet captures group 2 unused). Cite-only.
- [#71700](https://github.com/anthropics/claude-code/issues/71700) — OPEN — Kitty protocol gated on terminal-name allow-list (Alacritty) — different surface. Cite-only.
- [#77386](https://github.com/anthropics/claude-code/issues/77386) — OPEN — Ctrl shortcuts non-Latin layouts — related family, different bug. Cite-only.

Backups (do not ship unless primary blocked): Frisket / #91574 is reserved elsewhere. Lock-hang / #91987 was the unused backup.

Product name stays **Tangent**. Do not rename to Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Knock. Do not reuse quoin.

Different UI: clavichord desk + keycap strip + CSI-u decode tape + flag plaque + ConPTY mute lamp + alternate-field gauge / walnut / ivory key / signal brass / ink mute. Instrument Serif + Albert Sans + Spline Sans Mono. NOT Fraunces/Outfit/IBM Plex Mono (Hawser). NOT Playfair/DM Sans/Fragment Mono (Caret). NOT Petrona/Sora/Fira (Buoy). Stay OFF hawser bitts / proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell.

Different verbs: Score the strike, pin idle sounded, pin seeded muted, admit the alternate field already muted, load fixtures, reset to sounded. Score the strike is this desk's phrase.

Different idle: **sounded**.

## Live catalog path

`/tangent/` is this static clavichord desk. Path `https://hermes-playground-green.vercel.app/tangent/` and subdomain `https://tangent.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `08:50 / hermes catalog #132 / #92021`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **sounded** — Shift-only CSI-u uses alternate field; `!` / `?` / `:` / `A` insert correctly.
2. Seed **muted** → #92021: `ESC[>5u]` requested; shifted sub-parameter never parsed; `ESC[49:33;2u]` inserts `1` not `!`; WezTerm/WSL colon sequences often blank.
3. Atelier UI: keycap strip / CSI-u decode tape / flag plaque / ConPTY mute lamp / alternate-field gauge. Sounded = tangent struck the shifted pitch. Muted = flag 4 asked; the string never sounded.
4. Cousin cite strip labeled cousin-not-primary: [#90067](https://github.com/anthropics/claude-code/issues/90067), [#71700](https://github.com/anthropics/claude-code/issues/71700), [#77386](https://github.com/anthropics/claude-code/issues/77386). Cite only. Primary stays #92021.
5. **Score the strike** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/tangent/index.html` in a browser, or serve the repo root and visit `/tangent/` (Vercel rewrite → `/projects/tangent`). No build step. Optional hook:

```bash
node projects/tangent/hook/tangent.mjs projects/tangent/data/92021.json
node --test projects/tangent/hook/tangent.test.mjs
```

Empty stdin scores the idle **sounded** ticket. Paste a probe on the page or drop a fixture from `data/`.
