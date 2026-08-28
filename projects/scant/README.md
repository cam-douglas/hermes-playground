# Scant

Timber scantling yard / measuring bench for Claude Code on Windows Desktop: the Bash tool's shell snapshot is **silently truncated at ~7.2 KB** (≈ Windows `cmd.exe` 8191 command-line limit) when plugin PATH bloat pushes the snapshot past that wall. Truncation cuts mid-`export PATH='...'` so the quote never closes. Every subsequent Bash call fails with `unexpected EOF while looking for matching '''`. On-disk repair of the snapshot file does not heal the session (content is captured in memory). Deleting the snapshot makes commands silently no-op (exit 0, no output). Disabling plugins "fixes" it — not viable. A written shell snapshot is **not** a hold. Score the board or admit **fit**.

Idle word: **fit** (board true to length; snapshot closes clean).
NEVER use the product name scant as the idle/state word.
NEVER use empty.
NEVER reuse Chad's spoilt, Kist's laid, Wraith's unlinked, Gasket's tight, Damper's banked, Cote's roosted, Larder's stocked, Tappet's seated, Aside's heard, Chute's clear, Tain's paired, Husk's kernel, Snib's latched, Veto's upheld, Assay's sterling, Wicket's home, Sigil's valid, Stencil's dry, Suture's sealed (as idle), Reveille's quiet, Livery's seised. Do not ship Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, or Ferrule as product names this hour. Product name is **Scant** only.

Verdicts: **fit**, **scant**, **clipped**, **open**, **poisoned**, **bloated**, **stubbed**, **mute**, **sealed**, **true**.
- **fit** — idle / full snapshot closed clean, Bash would work
- **scant** — truncated mid-PATH, unclosed quote
- **clipped** — hit the ~8191 / ~7.2KB wall
- **open** — unclosed quote detected
- **poisoned** — every Bash call fails with unexpected EOF
- **bloated** — plugin PATH contribution pushed length over the wall
- **stubbed** — file ends mid-entry / mid-PATH segment
- **mute** — snapshot deleted → silent no-op Bash
- **sealed** — on-disk repair attempted but session still dead (in-memory capture)
- **true** — measured full length would have fit under the wall

Slack scant alarm on scant / clipped / poisoned / bloated. Linear scantling ticket on poisoned / clipped. GitHub scant-ledger of board events on every scored probe.

## Why not a clone

NOT Larder (plugin-store freeze: sync stamp advances, folders stand still). Larder is marketplace sync lying green; Scant is snapshot writer clipping PATH so Bash dies.
NOT Reed (MCP tool-registry death / four contacts). Reed is registry vs connected; Scant is shell-snapshot length.
NOT Assay (tool-arg furnace / parse corruption). Assay is wire-format impurity; Scant is PATH truncation at OS cmdline limit.
NOT Quench (token-burn fuse). Quench kills on spend; Scant diagnoses truncated shell env.
NOT Wraith (live binary unlink mid-session). Wraith is image pruned under grants; Scant is snapshot clipped under plugins.
NOT Chad / Kist / Gasket / Damper / Cote / Tappet / Aside / Chute / Tain / Husk / Snib / Veto / Wicket / Sigil / Stencil / Suture / Blot / Coda / Fathom / Hasp / Parity / Reveille / Scrim / Knock.
NOT leftover woodworking / millimetre-slider clones. Scantling is a timber-yard metaphor for a diagnostic desk, not a leftover instrument.
Do NOT ship Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule as product names this hour. Product name is **Scant** only.

Different problem: snapshot writer clips PATH at the Windows cmdline wall so Bash dies.
Different UI: timber scantling yard / lumber rack / measuring bench. Sawdust, chalk marks, steel rule, end-grain stamps, stack of boards cut short, fluorescent shop light. NOT hanging-chad ballot booth (Chad). NOT undertaker oak (Kist). NOT frost afterimage (Wraith). NOT steam flange (Gasket). NOT chimney soot (Damper). NOT dove loft (Cote). NOT stillroom (Larder).
Different idle word: **fit**.

## How to score

Paste a shell-snapshot (or load a canned board). Scant measures UTF-8 bytes against the 7187–7195 / 8191 wall, finds `export PATH='`, and names whether the quote closes. First match wins. Idle **fit** is first.

1. Seeded `#90421` **scant** is already on the slab: snapshot cut at 7191 bytes mid-PATH; quote never closes → **scant** (cluster clipped / open / bloated / stubbed).
2. Switch **clipped** — hit the ~7.2KB wall; PATH quote closed → **clipped**.
3. Switch **open** `#85111` — unclosed PATH quote under the wall → **open**.
4. Switch **poisoned** — every Bash call unexpected EOF → **poisoned**.
5. Switch **bloated** — plugin PATH contribution would push over the wall → **bloated**.
6. Switch **stubbed** `#83243` — file ends mid-entry / mid-PATH segment → **stubbed**.
7. Switch **mute** — snapshot deleted; Bash silently no-ops → **mute**.
8. Switch **sealed** — on-disk repair attempted; session still dead → **sealed**.
9. Switch **true** — measured full length would have fit; quote closed → **true**.
10. Switch **Rack · fit** — board true to length, nothing scored → **fit**. Idle word is **fit** when the probe is idle.
11. **Score** scores. **Rack** returns idle fit. **Clip** shows the #90421 cut board. **True** shows a board that would have fit. Admit does not lie: a scant probe stays scant.

## Live catalog path

`/scant/` is this static scantling yard. Lumber rack, steel rule, end-grain stamp, chalk line, sawdust. Demo works with no secrets and no npm. Mark: `04:50 Sydney · scant`.

## Hook

`projects/scant/hook/` scores a probe `{ snapshot, measuredFullLength, pluginCount, pluginPathBloat, snapshotDeleted, silentNoOpBash, onDiskRepairAttempted, sessionStillDead, bashUnexpectedEof }` and returns `{ verdict, reasons[], cluster[], fit, scant, clipped, measure }`. Snapshot text is measured: byte length, unclosed PATH quote, mid-PATH cut, wall hit. See `hook/README.md`.

```bash
node projects/scant/hook/index.mjs --listen 9421
node --test projects/scant/hook/scant.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90421](https://github.com/anthropics/claude-code/issues/90421) — filed 2026-08-28 by keyzone11. Labels: bug, has repro, platform:windows, area:bash, area:plugins, area:desktop. Shell snapshot silently truncated at 7187–7195 bytes on Windows Desktop; every Bash fails `unexpected EOF while looking for matching '''`. Truncation always mid-PATH, no closing quote, no trailing newline. Each plugin contributes ~105 chars. Truncation size + wrapper ≈ 8191 (`cmd.exe` command-line limit). On-disk repair does not recover the session (in-memory capture). Deleting the snapshot makes commands silently no-op. Disabling plugins "fixes" it — not viable.

Corroboration (cite as shape, not a new primary):

- [anthropics/claude-code#88311](https://github.com/anthropics/claude-code/issues/88311) — Windows: Bash permanently broken in long-lived sessions; inlined shell snapshot exceeds command-line length and is truncated.
- [anthropics/claude-code#85111](https://github.com/anthropics/claude-code/issues/85111) — Bash silently truncates commands over ~8 KB and reports quoting error.
- [anthropics/claude-code#83243](https://github.com/anthropics/claude-code/issues/83243) — Bash unexpected EOF line 86 on Windows.
- [anthropics/claude-code#81732](https://github.com/anthropics/claude-code/issues/81732) — Windows/Git-Bash valid snapshots fail in host bash -c wrapper.
