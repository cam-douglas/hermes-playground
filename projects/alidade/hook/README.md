# Alidade hook

Tiny plane-table classifier for Desktop session-host identity. Opening a session created on another machine silently attaches that machine's tool host. The session chrome has no station plate. Writes and elevation land on the foreign desk. Parent leak #90433 is sidebar title only.

Idle word is **stationed**. Seeded state is displaced / #91055 (foreign host attached, no plate, account-global list, shared profile path). Never idle as displaced / alidade / noria / pelorus / strowger / hung / marvered / unpinned / cocked / rinsed / vacant / reserved / fronted / silvered / defaulted / kisted / belayed / misrouted.

```bash
node projects/alidade/hook/alidade.mjs projects/alidade/data/91055.json
node projects/alidade/hook/alidade.mjs projects/alidade/data/stationed.json
echo '{"viewerHost":"HOME-DESK","toolHost":"DESKTOP-JNMKF1S","platePresent":false}' | node projects/alidade/hook/alidade.mjs
node --test projects/alidade/hook/alidade.test.mjs
```

Empty stdin uses the idle **stationed** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`.

- **STATIONED** if the viewer host matches the tool host, the station plate is shown, and writes land on this desk
- **DISPLACED** if a foreign host is attached with no plate (#91055)
- **FOREIGN-HOST** if the tool host is not the viewing station
- **NO-PLATE** if session chrome has no host badge
- **HOST-MATCH** if viewer hostname equals tool host (hold)
- **PLATED** if the station plate names the executing host (hold)
- **LOCAL-SCOPE** if the session list is scoped to this machine (hold)
- **SHARED-PATH** if the same profile path exists on both stations
- **SILENT-UAC** if elevation consent hangs on the unseen host
- **ACCOUNT-LIST** if Desktop lists sessions from every machine on the shared account

This is a diagnostic scoring bench. Not an exploit, attack PoC, or remote-access how-to. No payloads. Score whether the Desktop session's tool host matches the machine you are on.

Primary: [anthropics/claude-code#91055](https://github.com/anthropics/claude-code/issues/91055). Same-class extra: [#90433](https://github.com/anthropics/claude-code/issues/90433) sidebar title leak only. Cousins (not primaries): Fascia #90638, Tain #90257, Damper #90341, Kist #90387, Bollard #90581, Shunt #90463.

Hypothesis only (NON-BINDING): account-global session listing plus resume that binds the original machine's tool host, with zero chrome that the viewer is not that host. Do not claim a root cause in Claude Code source you have not seen.

NOT Fascia / Tain / Damper / Kist / Bollard / Shunt / Parison. Product name stays Alidade. Do not rename to Noria / Pelorus / Strowger.
