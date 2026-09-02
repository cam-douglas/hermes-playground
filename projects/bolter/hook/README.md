# Bolter hook

Tiny flour-mill bolting-cloth classifier for the Claude Code `--permission-mode dontAsk` matcher that, with equal-breadth Bash allow rules `Bash(cp:*)`, `Bash(mv:*)`, `Bash(rm:*)`, refuses any option token on `cp`/`mv` (including inert bare POSIX `--`) while the flagless forms run and `rm -f` / `rm -rf` slip the identical mesh. Measured on Claude Code 2.1.251, run E. Reporter alfalcon90. Filed 2026-09-02.

Idle word is **unbolted**. Seeded state is snagged / #91422 (any option token on cp/mv refused; rm -rf unaffected; matcher artifact). Never idle as creased / bled / latched / vanished / sealed / rebound / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed / reeved / fouled.

```bash
node projects/bolter/hook/bolter.mjs projects/bolter/data/91422.json
node projects/bolter/hook/bolter.mjs projects/bolter/data/unbolted.json
echo '{"optionToken":true,"flaglessRuns":true}' | node projects/bolter/hook/bolter.mjs
node --test projects/bolter/hook/bolter.test.mjs
```

Empty stdin uses the idle **unbolted** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `unbolted`, `snagged`, `hold`, `alarm`, `idleWord`.

Given `{ meshFair, optionTokensPass, dontAsk, optionToken, bareEndOfOptions, flaglessRuns, rmRfSlips, equalBreadth, matcherArtifact, forceFlagUnfollowable, notPathClass, deterministic }`:

- **UNBOLTED** if flagged cp/mv including `cp --` pass the allow-rule mesh under dontAsk
- **SNAGGED** if any option token on cp/mv is refused while rm -rf slips the same mesh (#91422)
- **DONTASK** if `--permission-mode dontAsk`
- **OPTION-TOKEN** if REFUSED: `cp -f`, `cp -v`, `cp --`, `mv -v`
- **BARE-END-OF-OPTIONS** if `cp --` is POSIX end-of-options with no force semantics
- **FLAGLESS-RUNS** if bare `cp` and bare `mv` run
- **RM-RF-SLIPS** if `rm -f` / `rm -rf` run under identical `Bash(rm:*)`
- **EQUAL-BREADTH** if `Bash(cp:*)`, `Bash(mv:*)`, `Bash(rm:*)` at the same breadth
- **MATCHER-ARTIFACT** if this is not a considered safety policy
- **FORCE-FLAG-UNFOLLOWABLE** if agent guidance to always pass force flags on cp/mv is unfollowable
- **NOT-PATH-CLASS** if `cp -f` with relative paths is still REFUSED
- **DETERMINISTIC** if repeated arms in one session still REFUSED
- **HAS-CLEAR-REPRO** if alfalcon90 filed #91422; has repro; area:bash; area:permissions
- **HOLD** if the bolter is unbolted (fair mesh; flagged and flagless pass together)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the cloth is unbolted or snagged.

Primary: [anthropics/claude-code#91422](https://github.com/anthropics/claude-code/issues/91422). Cousins (cite only, not primaries): [#74567](https://github.com/anthropics/claude-code/issues/74567) dontAsk Write/Edit deny; [#76867](https://github.com/anthropics/claude-code/issues/76867) dontAsk denied-tool still reports success; [#76490](https://github.com/anthropics/claude-code/issues/76490) Bash allow-list Windows drive-letter + defaultMode dontAsk; [#91479](https://github.com/anthropics/claude-code/issues/91479) blockReadsOutsideWorkingDirectories flag values misidentified as paths.

Hypothesis only (NON-BINDING): dontAsk matcher may classify any token after `cp`/`mv` as a gated option, including bare `--`, while `rm` uses a different code path. Do not claim source you have not seen beyond the issue's measured repro.

NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / standing-rigging deadeye / letterpress galley Reglet UI. Product name stays Bolter. Do not rename to Deadeye / Reglet / Reliquary / Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew / Hasp / Berth / Bollard / Reveille / Callboard / Toggle.
