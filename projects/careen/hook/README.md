# Careen hook

Tiny maritime careening-yard classifier notes for the Claude Windows desktop defect where a Developer-sideloaded MSIX self-update stops CoworkVMService, swaps the package, and restarts over a running session — nine forced restarts in nine days, no opt-out. Reporter Maison. Filed 2026-09-05. Labels: bug, has-repro, platform:windows, area:desktop. Claude 1.46388.3.0 · Windows 11 Home 10.0.26200 · SignatureKind Developer.

Idle word is **afloat**. Seeded state is careened / #92246 (live mid-session forced MSIX swap; no prompt, no deferral, no opt-out; overnight 03:17 kill). Never idle as caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted / ringing.

This stub is documentation only. The living page at `projects/careen/index.html` scores probes in-browser. No npm. No secrets. No real hooks.

Given a probe-shaped payload `{ sessionUnderway, deferUntilIdle, sessionBusyGate, nineVersions, overnightKill, middayUpdate, noDeferral, noOptOut, msixSwap, coworkVmStop, falseFileLockDialog, developerSideloadNotStore, orchestratedNotCrash, log }`:

- **AFLOAT** if a session-busy / defer-until-idle gate holds and the haulout waits for the next clean start
- **CAREENED** if the updater swaps the MSIX over a running session (#92246)
- **NINE-VERSIONS** if nine versions registered in nine days
- **OVERNIGHT-KILL** if the 03:17 local apply ended unattended overnight work
- **MIDDAY-UPDATE** if an apply landed during working hours
- **NO-DEFERRAL** if there is no prompt and "later" is not honoured
- **NO-OPT-OUT** if config holds updater state and no updater setting
- **MSIX-SWAP** if the package folder moved mid-session
- **COWORK-VM-STOP** if CoworkVMService stopped then started in the same minute
- **FALSE-FILE-LOCK-DIALOG** if the dialog blames another program and the program is Claude
- **DEVELOPER-SIDELOAD-NOT-STORE** if SignatureKind is Developer (not Store)
- **ORCHESTRATED-NOT-CRASH** if Crashpad is empty and there is no fault entry

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the yard deferred the haulout or the hull already careened.

Primary: [anthropics/claude-code#92246](https://github.com/anthropics/claude-code/issues/92246). Cousins (cite only, not primary): [#92207](https://github.com/anthropics/claude-code/issues/92207), [#92173](https://github.com/anthropics/claude-code/issues/92173), [#89992](https://github.com/anthropics/claude-code/issues/89992), [#92167](https://github.com/anthropics/claude-code/issues/92167).

Hypothesis only (NON-BINDING): updater treats any process state as interruptible and has no "session busy / defer until idle" gate on Developer-sideloaded MSIX. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Relict glacial slab / Snuff idle stealth / workshop ratchet / imposing-stone / wax tablet / oxbow floodplain / hellbox melt / cupel assay / oubliette pit / caisson lock-gate. Product name stays Careen.
