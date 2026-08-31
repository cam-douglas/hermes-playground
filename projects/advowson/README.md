# Advowson

A **diocesan registry / patronage desk** — parchment folio, wax seals, ledger columns for presentation vs collation; Cormorant Garamond + Karla + Roboto Mono — for a real Claude Code defect: **`Workflow({name})` silently resolves to the built-in workflow even when a same-named local `~/.claude/workflows/<name>.js` exists**. The tool description says a `name` resolves to "a predefined workflow (built-in or from `.claude/workflows/`)". In practice the built-in always wins. No error, no warning. Explicit `Workflow({scriptPath})` correctly runs the local file. A unique marker in local `meta.description` never appears in the tool `Summary`. The persisted run script (`workflows/scripts/deep-research-.js`) keeps the original built-in schema. Skills that hardcode `Invoke: Workflow({ name: "x" })` inherit the trap — local overrides are unreachable through the normal skill path.

Primary:

- [anthropics/claude-code#91005](https://github.com/anthropics/claude-code/issues/91005) (OPEN, bug, has-repro, platform:linux, area:tools, filed 2026-08-31T14:59:44Z by Habriel). Title: Workflow({name}) silently resolves to the built-in workflow even when a same-named local `.claude/workflows/<name>.js` exists — no error, no indication.

A reserved living that silent-collates the built-in is not a hold. Score the presentation or admit **vacant**.

Idle word: **vacant**. Seeded state: **reserved** / #91005 — the living is reserved to the crown/built-in incumbent; the patron's local letters sit at the side door. Never idle as "reserved" / "collated" / "advowson" / "built-in" / "silent" / "presentation" / "smutch" / "plain" / "seated" / "bound" / "hallmarked" / "pointed" / "collapsed" / "spoiled" / "banked" / "misstruck" / "hunting" / "traced".

An **advowson** is the right of presentation to a benefice (a living). The name is reserved to the crown incumbent; local letters of presentation are accepted at the side door (`scriptPath`) but never reach the bishop when the name is used.

- **vacant** = hold: no name collision; no silent override
- **reserved** = #91005 primary — built-in wins; local ignored
- **presented** = hold: `scriptPath` used the local file
- **collated** = silent collation of the built-in incumbent
- **built-in-wins** = name resolution chose the built-in
- **local-ignored** = `~/.claude/workflows/<name>.js` existed and was skipped
- **scriptPath-ok** = hold: side door ran the local letters
- **marker-missing** = unique marker in local `meta.description` never reached Summary
- **summary-echo** = Summary echoed the built-in description
- **skill-hardcode** = skill `Invoke: Workflow({ name })` inherited the trap
- **name-vs-path** = name and scriptPath disagree
- **no-warning** = skip was silent
- **deep-research-override** = the living is `deep-research`
- **silent-collation** = built-in won with no error and no warning

Verdicts: reserved, vacant, presented, collated, built-in-wins, local-ignored, scriptPath-ok, marker-missing, summary-echo, skill-hardcode, name-vs-path, no-warning, deep-research-override, silent-collation.

Overlapping proof from the issue: marker technique (local `meta.description` vs Summary) plus the persisted run script still carrying the original schema. The local file is independently loadable via `scriptPath`.

## Why not a clone

This is specifically: **WORKFLOW NAME RESOLUTION + SILENT BUILT-IN COLLATION + LOCAL `~/.claude/workflows` OVERRIDE IGNORED + scriptPath SIDE DOOR + SKILL HARDCODE TRAP**.

NOT **Smutch** ([#90993](https://github.com/anthropics/claude-code/issues/90993)) — desktop Icon\r crawl.
NOT **Bitting** ([#90970](https://github.com/anthropics/claude-code/issues/90970)) — Slack MCP most-recent-mint exclusivity.
NOT **Puncheon** ([#90962](https://github.com/anthropics/claude-code/issues/90962)) — Write-tool BOM-less `.ps1`.
NOT **Gnomon** ([#90954](https://github.com/anthropics/claude-code/issues/90954)) — shared mtime closed transcripts.
NOT **Spoil** ([#90943](https://github.com/anthropics/claude-code/issues/90943)) — stale private `GIT_INDEX_FILE`.
NOT **Bulla** ([#90891](https://github.com/anthropics/claude-code/issues/90891)) — MSIX integrity crash.
NOT **Carcase** ([#90867](https://github.com/anthropics/claude-code/issues/90867)) — stealth relaunch.
NOT **Hydra** ([#90856](https://github.com/anthropics/claude-code/issues/90856)) — marketplace re-clone.

Different UI: diocesan registry / patronage desk. Parchment #f4e8cf, violet ink #5a3a6e, wax seal #9a2a3c, ribbon gold #c4a050. Cormorant Garamond + Karla + Roboto Mono. NOT Smutch Fraunces / DM Sans / IBM Plex blotter/brass. NOT Bitting Libre Bodoni / Figtree / JetBrains felt-green. NOT Puncheon Cinzel / Outfit / Spline walnut/gold/oxblood.

Different verbs: score the presentation, pin idle vacant, pin seeded reserved, admit vacant, load fixtures, reset to vacant. Not "Score the smutch" / "Pin idle plain" / "Score the bitting" / "Score the gold".

Different idle: **vacant**.

## Live catalog path

`/advowson/` is this static registry desk. Demo works with no secrets and no npm. Mark: `00:50 / hermes catalog #98 / #91005`.

1. Idle demo loads **vacant** — no name collision; no silent override.
2. Seed **reserved** → #91005 ticket: `Workflow({name: "deep-research"})` silent-collates the built-in; local `~/.claude/workflows/deep-research.js` ignored.
3. Living / registry board: name-resolution path with presentation vs collation columns.
4. Wax seals: vacant / reserved / presented.
5. Marker plaque: unique string in local `meta.description` never reaches Summary.
6. Persisted-script plaque: `workflows/scripts/deep-research-.js` keeps the original schema.
7. Side-door plaque: `Workflow({scriptPath})` correctly runs the local file.
8. **Score the presentation** walks the ticket and lights chips on the rail.

## How to score

Open `projects/advowson/index.html` in a browser, or serve the repo root and visit `/advowson/` (Vercel rewrite → `/projects/advowson`). No build step. Optional hook:

```bash
node projects/advowson/hook/advowson.mjs projects/advowson/data/91005.json
node projects/advowson/hook/advowson.mjs projects/advowson/data/vacant.json
node --test projects/advowson/hook/advowson.test.mjs
```

Reserved seed → reserved/alarm. Vacant seed → vacant/hold. scriptPath seed → presented or scriptPath-ok / hold.

`projects/advowson/hook/advowson.mjs` classifies a resolution trace and returns `{ verdict, chips[], reasons[], hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91005.json`, `data/reserved.json`, `data/vacant.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91005](https://github.com/anthropics/claude-code/issues/91005). Unauthenticated. See `.env.example`.
2. Living / registry board of the name-resolution path; wax-seal the folio.
3. Pin idle vacant / pin seeded reserved / score the presentation / admit vacant / load fixtures / reset to vacant.
4. Marker plaque (local `meta.description` vs Summary).
5. Persisted-script plaque (`workflows/scripts/deep-research-.js`).
6. Side-door plaque (`Workflow({scriptPath})`).

## Sources

- [anthropics/claude-code#91005](https://github.com/anthropics/claude-code/issues/91005) OPEN
- Same-class (cite, not primary): [#79019](https://github.com/anthropics/claude-code/issues/79019) / [#75086](https://github.com/anthropics/claude-code/issues/75086) — StructuredOutput corruption in the Scope phase (why a local `deep-research` override was written).
