# Tabula hook

Tiny wax-tablet / scriptorium classifier notes for the Claude Desktop defect where `claude://code/new?folder=` starts a scratch workspace when the folder string equals the folder already selected in the composer. Reporter PedroGiudice. Filed 2026-09-04. Labels: bug, has repro, platform:windows, area:desktop. Claude Desktop 1.46388.3 (Windows 11, Microsoft Store / MSIX), bundled engine 2.1.260.

Idle word is **seated**. Seeded state is scratched / #92210 (same-folder string-eq → createScratchWorkspace). Never idle as channel / stranded / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted.

This stub is documentation only. The living page at `projects/tabula/index.html` scores probes in-browser. No npm. No secrets.

Given a probe-shaped payload `{ deepLink, linkFolder, composerFolder, prompt, stringEq, slashVariant, caseVariant, trustOk, scratchMinted, sidebarSplit, noFolder, desktopVersion, sessionCwd, log }`:

- **SEATED** if the selected folder differs and the session starts in the link folder
- **SCRATCHED** if link folder === composer folder (plain string) and Enter mints a scratch workspace (#92210)
- **TRUST-OK** if the Trust dialog names the right folder
- **STRING-EQ** if the folder fields compare equal as raw strings
- **SLASH-VARIANT** if `C:/` vs `C:\` of the same path seats the session
- **CASE-VARIANT** if a lowercase drive of the same path seats the session
- **SCRATCH-MINT** if `LocalSessions.createScratchWorkspace` follows `saveTrust`
- **SIDEBAR-SPLIT** if slash/case spellings become separate sidebar groups
- **REGRESSION** if 1.37937.3 / 1.40609.0 seated and 1.46388.3 scratched
- **DEEP-LINK** if the open used `claude://code/new?folder=&q=`
- **COMPOSER-MATCH** if the selected folder equals the link folder
- **NO-FOLDER** if the minted session is listed under "No folder"

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the stylus seated the path or the tablet already scratched.

Primary: [anthropics/claude-code#92210](https://github.com/anthropics/claude-code/issues/92210). Cousins (cite only, not primary): [#91991](https://github.com/anthropics/claude-code/issues/91991), [#89748](https://github.com/anthropics/claude-code/issues/89748), [#87779](https://github.com/anthropics/claude-code/issues/87779).

Hypothesis only (NON-BINDING): renderer compares folder strings with `===` (or equivalent) and, on equality, takes the "already have this folder" branch that mints a scratch instead of seating the trusted cwd. Slash and case spellings miss that branch, so they work and then split the sidebar. Discard if issue evidence disagrees. Do not claim Desktop source you have not seen.

NOT leftover floodplain oxbow / glacial relict / letterpress hellbox / bone-ash cupel / stone-pit oubliette / cream wick-lit ephemera / commutator drum. Product name stays Tabula.
