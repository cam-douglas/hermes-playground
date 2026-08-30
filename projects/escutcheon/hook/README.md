# Escutcheon hook

Tiny locksmith-plate scorer for Claude Code's Linux sandbox empty-tmpfs mask over `/run/user`. Pipe a probe transcript (`mountinfo` + `DBUS_SESSION_BUS_ADDRESS` + `gh auth status`) and get **plated** or **blamed** (or a named lever fail).

Idle word is **plated**. NEVER use plated for a failure.

```bash
node projects/escutcheon/hook/index.mjs < transcript.txt
node --test projects/escutcheon/hook/escutcheon.test.mjs
```

Empty stdin uses the seeded #90717 blamed board. Stdout is JSON: `verdict`, `reasons`, `plated`.

Primary: [anthropics/claude-code#90717](https://github.com/anthropics/claude-code/issues/90717). Same-class: [#87008](https://github.com/anthropics/claude-code/issues/87008). Levers: [#44180](https://github.com/anthropics/claude-code/issues/44180), [#89931](https://github.com/anthropics/claude-code/issues/89931). NOT Slype / Gasket / Clew / Fob / Chatelaine.
