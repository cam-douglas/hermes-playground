# Priory hook

Tiny makepri-cloister packaging-guard notes for the Claude Desktop defect where a stray `priconfig.xml` in the shipped MSIX root makes Windows look for Language / Scale / DXFeatureLevel resource packages that were never packed. The AppX Evaluated handler returns `0x80070490` ERROR_NOT_FOUND; the installer wraps that as `0x80073CF9` ERROR_INSTALL_FAILED and then lies about administrator access / Cowork. Deleting that one ~1,480-byte file from the ~627 MB package makes the install succeed, Cowork included. OPEN. Labels: bug, has repro, platform:windows, area:cowork, area:installation, area:desktop.

IDLE_WORD=sealed. SEEDED_WORD=leaked. Seeded state is leaked / #92345 (`priconfig.xml` present in package root → phantom resource lookup → `0x80070490` → `0x80073CF9`; false admin/Cowork message). Never idle as waiting / standing / razed / once / doubled / stuck / missed / gated / spilled / lit / blanked / cold / voided / banked / rewritten / miskeyed.

This stub is documentation only. It does **not** ship in Claude Code. The living page at `projects/priory/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. No live AppX install. Diagnostic shapes only (published HRESULTs, `autoResourcePackage` qualifiers, AppX event ids, installer banners, package identity `Claude_pzs8sxrjxfjjc`).

Preferred packaging guard (document only — do not treat this stub as a live hook):

1. Fail the Desktop MSIX pack if `priconfig.xml` is present in the package root, or
2. Exclude `priconfig.xml` (and other makepri / build-input leftovers) from the packaging file list, and
3. If `autoResourcePackage` qualifiers are declared, either pack a real bundle with those resource packages or omit the declaration from anything that ships as a single MSIX.

Detection: if AddPackage fails with `0x80073CF9`, AppX Operational shows `0x80070490` in Evaluated with Stage cost 0 ms, `priconfig.xml` sits in the package root declaring `<autoResourcePackage>` for Language / Scale / DXFeatureLevel, and the installer log already has `Is elevated: true`, the cloister is already leaked.

Given a probe-shaped payload `{ priconfigInRoot, autoResourcePackage, phantomLookup, resourcePackagesPacked, hresultInner, hresultWrap, elevated, falseAdminBanner, excisedPriconfig, persistHold, sealed, leaked, log }`:

- **SEALED** if `priconfig.xml` is not in the package root and the install proceeds
- **LEAKED** if `priconfig.xml` is in the root and Windows looks for resource packages that do not exist (#92345)
- **PHANTOM** if `autoResourcePackage` qualifiers are declared on a single (non-bundle) MSIX
- **WRAP** if `0x80073CF9` ERROR_INSTALL_FAILED is wrapping `0x80070490`
- **NOT-FOUND** if Evaluated / resource-indexing returned ERROR_NOT_FOUND
- **FALSE-ABBOT** if the UI demands administrator access while `Is elevated: true`
- **COWORK-LIE** if the UI offers "install without Cowork" while Cowork is not the failure
- **EXCISED** if deleting that one file makes the ~627 MB package install, Cowork included
- **SPANISH-GUESS** if citing the unverified es-ES vs `Language=en-US` sub-hypothesis
- **STAGE-ZERO** if Stage required cost is 0 ms after the Evaluated fail

This is a diagnostic scoring desk. Not an exploit. No secrets. No live install. Score whether the package is sealed or already leaked.

Primary: [anthropics/claude-code#92345](https://github.com/anthropics/claude-code/issues/92345). Cousins cite-only: [#88727](https://github.com/anthropics/claude-code/issues/88727), [#89108](https://github.com/anthropics/claude-code/issues/89108), [#90411](https://github.com/anthropics/claude-code/issues/90411). Stay off Relict [#92173](https://github.com/anthropics/claude-code/issues/92173) (versioned WindowsApps Run path — different MSIX surface).

Hypothesis only (NON-BINDING): Spanish display language vs package default `Language=en-US` may make the phantom lookup fatal. Reporter did not test a language switch. Treat as a guess. Discard if issue evidence disagrees.

NOT leftover Latchkey board / Stubble furrow / Intake gauge-house / Pasteboard kraft / Spillway dam / Relict outcrop / Tabula wax tablet. Product name stays Priory.
