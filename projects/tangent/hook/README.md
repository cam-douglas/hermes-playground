# Tangent hook

Tiny clavichord / keyboard-protocol classifier for the Claude Code defect where Kitty flag 4 (`ESC[>5u`) is requested but the CSI-u shifted-key field is never parsed. WezTerm encodes Shift+1 as `ESC[49:33;2u`; the parser reads the unshifted `1` and reconstructs by uppercasing — wrong for symbols, and often blank on WezTerm→ConPTY→WSL. Reporter chadkirst-authid. Filed 2026-09-04. Labels: bug, has repro, platform:windows, platform:wsl, area:tui, regression.

Idle word is **sounded**. Seeded state is muted / #92021 (`ESC[>5u]` requested; shifted sub-parameter never parsed; symbols wrong or blank). Never idle as slipped / fouled / verbatim / mangled / moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

```bash
node projects/tangent/hook/tangent.mjs projects/tangent/data/92021.json
node projects/tangent/hook/tangent.mjs projects/tangent/data/sounded.json
echo '{"sequence":"ESC[49:33;2u","parsedGlyph":"1","expectedGlyph":"!"}' | node projects/tangent/hook/tangent.mjs
node --test projects/tangent/hook/tangent.test.mjs
```

Empty stdin uses the idle **sounded** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `sounded`, `muted`, `unshifted`, `hold`, `alarm`, `idleWord`.

Given `{ persistStrike, sounded, muted, sequence, parsedGlyph, expectedGlyph, flagRequested, flag4, alternateConsumed, conptyBlank, eventTypeDrop, symbolWrong, unshiftedOnly, csiU }`:

- **SOUNDED** if Shift-only CSI-u uses the alternate field (`!` / `?` / `:` / `A` insert)
- **MUTED** if flag 4 was requested and the shifted sub-parameter was never parsed (#92021)
- **UNSHIFTED** if the parser read only the first sub-parameter and reconstructed by uppercasing
- **FLAG-4** if 2.1.247+ sent `ESC[>5u]` without consuming the field flag 4 adds
- **CSI-U** if the ticket carries a colon CSI-u (`ESC[49:33;2u`)
- **CONPTY-BLANK** if WezTerm→ConPTY→WSL colon-bearing sequences inserted nothing
- **EVENT-TYPE-DROP** if `ESC[97:65;2:1u` was dropped by a bare-modifier regex
- **SYMBOL-WRONG** if `1` / `;` / `/` landed instead of `!` / `:` / `?`
- **ALTERNATE-IGNORED** if the second (shifted) sub-parameter was never consumed
- **HOLD** if the string sounds (alternate field struck)

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the tangent sounded or the alternate field already muted.

Primary: [anthropics/claude-code#92021](https://github.com/anthropics/claude-code/issues/92021). Cousins (cite only, not primary): [#90067](https://github.com/anthropics/claude-code/issues/90067) earlier WezTerm shifted punctuation, [#71700](https://github.com/anthropics/claude-code/issues/71700) Kitty allow-list / Alacritty, [#77386](https://github.com/anthropics/claude-code/issues/77386) Ctrl non-Latin layouts.

Hypothesis only (NON-BINDING): Kitty flag 4 requests alternate keys but the CSI-u parser never consumes the shifted sub-parameter (and event-type modifier form fails the regex). Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.

NOT leftover hawser process-reap / proof-desk caret / harbor-buoy / solecism usage-desk / coffer vault / codicil probate / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging. Product name stays Tangent.
