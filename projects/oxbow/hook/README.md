# Oxbow hook

Tiny floodplain / oxbow-lake classifier notes for the Claude Desktop defect where the Code tab renders an older branch of the session transcript forest (largest by entry count), hiding the most recent days while the data stays intact on disk. Reporter tonymontezuma. Filed 2026-09-04. Labels: bug, has repro, platform:macos, area:desktop. Claude Desktop 1.46388.3 Code tab. macOS 27.0 arm64.

Idle word is **channel**. Seeded state is stranded / #92197 (largest≠newest; UI stuck on older branch ending 09-02; recent days hidden; data intact). Never idle as live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled.

This stub is documentation only. The living page at `projects/oxbow/index.html` scores probes in-browser. No npm. No secrets.

Given a probe-shaped payload `{ sessionId, entries, roots, leaves, newestBranch, largestBranch, largestEqualsNewest, hiddenRecentEntries, parentChainIntact, compactFork, selection }`:

- **CHANNEL** if the UI follows the newest-message branch / live channel (largest==newest)
- **STRANDED** if largest≠newest and the viewport sits on the older meander (#92197)
- **FOREST** if the transcript has multiple roots
- **ROOTS** if `/compact` and resumes left extra roots
- **LEAVES** if the newest leaf is not on the largest branch
- **LARGEST** if the UI selected by entry count
- **NEWEST** if the live channel (newest-message branch) is the one that should render
- **MISMATCH** if largest branch is not the newest-message branch
- **INTACT** if the parent chain walks to `parentUuid: null`
- **TRUNCATED-UI** if recent entries exist on disk and are not displayed
- **COMPACT-FORK** if `/compact` or a resume created extra roots
- **PARENT-CHAIN** if the chain is intact — selection failure, not corruption

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the UI followed the live channel or already stranded on the largest abandoned meander.

Primary: [anthropics/claude-code#92197](https://github.com/anthropics/claude-code/issues/92197). Cousins (cite only, not primary): [#86851](https://github.com/anthropics/claude-code/issues/86851), [#73422](https://github.com/anthropics/claude-code/issues/73422), [#79940](https://github.com/anthropics/claude-code/issues/79940), [#24304](https://github.com/anthropics/claude-code/issues/24304). Open family: [#92009](https://github.com/anthropics/claude-code/issues/92009), [#89740](https://github.com/anthropics/claude-code/issues/89740), [#86277](https://github.com/anthropics/claude-code/issues/86277).

Hypothesis only (NON-BINDING): UI picks largest branch by entry count instead of the branch holding the newest message; `/compact` multi-root forests trigger MISMATCH. Discard if issue evidence disagrees. Do not claim Desktop source you have not seen.

NOT leftover glacial relict / letterpress hellbox / bone-ash cupel / stone-pit oubliette / cream wick-lit ephemera / commutator drum. Product name stays Oxbow.
