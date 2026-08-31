# Advowson hook

Tiny diocesan-registry classifier for the Workflow name silent built-in. The `Workflow` tool description says a `name` resolves to "a predefined workflow (built-in or from `.claude/workflows/`)". In practice, when a built-in and a local `~/.claude/workflows/<name>.js` share a name, `Workflow({name})` always runs the built-in and silently ignores the local file — no error, no warning. Explicit `Workflow({scriptPath})` correctly runs the local file. Marker in local `meta.description` never appears in tool Summary. Persisted run script keeps the original built-in schema. Skills that hardcode `Invoke: Workflow({ name: "x" })` inherit the trap.

Idle word is **vacant**. Seeded state is reserved / #91005. Never idle as "reserved" / "collated" / "advowson" / "built-in" / "silent" / "presentation" / "smutch" / "plain" / "seated" / "bound" / "hallmarked" / "pointed" / "collapsed" / "spoiled" / "banked" / "misstruck" / "hunting" / "traced".

```bash
node projects/advowson/hook/advowson.mjs projects/advowson/data/91005.json
node projects/advowson/hook/advowson.mjs projects/advowson/data/vacant.json
echo '{"localExists":true,"resolvedBuiltin":true,"invokedByName":true}' | node projects/advowson/hook/advowson.mjs
node --test projects/advowson/hook/advowson.test.mjs
```

Empty stdin uses the idle **vacant** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`.

- **VACANT** if there is no name collision and no silent override
- **RESERVED** if `Workflow({name})` hit the built-in while a same-named local file existed (#91005)
- **PRESENTED** if `scriptPath` used the local file
- **COLLATED** if the bishop silent-collated the crown incumbent
- **BUILT-IN-WINS** if name resolution chose the built-in
- **LOCAL-IGNORED** if `~/.claude/workflows/<name>.js` existed and was skipped
- **SCRIPTPATH-OK** if the side door ran the local letters (hold)
- **MARKER-MISSING** if a unique marker in local `meta.description` never reached Summary
- **SUMMARY-ECHO** if Summary echoed the built-in description
- **SKILL-HARDCODE** if a skill's `Invoke: Workflow({ name })` inherited the trap
- **NAME-VS-PATH** if name and scriptPath disagree
- **NO-WARNING** if the skip was silent
- **DEEP-RESEARCH-OVERRIDE** if the living is `deep-research`
- **SILENT-COLLATION** if built-in won with no error and no warning

Primary: [anthropics/claude-code#91005](https://github.com/anthropics/claude-code/issues/91005). Same-class (not primary): [#79019](https://github.com/anthropics/claude-code/issues/79019) / [#75086](https://github.com/anthropics/claude-code/issues/75086) StructuredOutput corruption in Scope (the reason a local override was written).

NOT Smutch / Bitting / Puncheon / Gnomon / Spoil / Bulla / Carcase / Hydra.
