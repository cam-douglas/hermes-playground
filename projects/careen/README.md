# Careen

A **maritime careening-yard scoring desk** — tide teal, barnacle copper, hull black, scraper's brass, chalk white — Newsreader + Figtree + IBM Plex Mono — for a real Claude Windows desktop defect: **WINDOWS DESKTOP APP SELF-UPDATES AND RESTARTS OVER A RUNNING SESSION — NINE FORCED RESTARTS IN NINE DAYS, NO OPT-OUT.**

Primary:

- [anthropics/claude-code#92246](https://github.com/anthropics/claude-code/issues/92246) (OPEN, bug, has-repro, platform:windows, area:desktop, filed 2026-09-05T00:28:28Z, updated 2026-09-05T00:33:29Z). Title: `Windows desktop app self-updates and restarts over a running session — nine forced restarts in nine days, no opt-out`. Reporter Maison. Claude 1.46388.3.0 x64 · Windows 11 Home 10.0.26200 · package family `Claude_<demo-pfn>` · SignatureKind **Developer** (sideloaded MSIX from anthropic.com, **not** Store) · locale UTC+09:30. The app updates itself by stopping CoworkVMService, swapping its MSIX package, and restarting. Any work running at that moment ends. There is no prompt, no deferral, and no setting to postpone it. Nine versions in nine days on one machine, including three mid-day applies and one at 03:17 local that ended roughly seven hours of unattended overnight work. The visible dialog says another program is using the file — the program is Claude holding its own files. Crashpad is empty; the Application log has no fault. Orchestrated self-update, not a crash. `updaterBannerStagedAt` suggests the intended behaviour is to offer the update, not apply it unattended. Store update settings do not apply. No AppInstaller / Claude scheduled task on the OS side. Config holds updater *state*, not an updater *setting*.

10:50 careen: a careen that scrapes the hull while the voyage is still underway is not a deferred haulout — it is a passage already careened. Score the yard or admit the hull already careened.

Idle word: **afloat**. Seeded state: **careened** / #92246 — live mid-session forced MSIX swap that kills running work; no prompt, no deferral, no opt-out. Never idle as caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted / ringing.

**Careen** is a careening yard: a hull heeled on the tide to scrape barnacles. A scrape while the voyage is still underway is already careened, not a deferred haulout.

- **afloat** = HOLD: session-busy / defer-until-idle held; stage for the next clean start; CoworkVMService left running
- **careened** = #92246: forced MSIX swap over a running session; voyage scraped mid-passage
- **nine-versions** = nine registered versions in nine days (AppX event 400 floor, log retention from 2026-08-27)
- **overnight-kill** = 2026-09-05 03:17 local; ~7h unattended work lost as elapsed time
- **midday-update** = three of nine landed mid-day (2026-09-03 08:34, 12:41; 2026-09-04 11:55)
- **no-deferral** = no prompt; "later" is not honoured; no defer-until-idle gate
- **no-opt-out** = `%APPDATA%\Claude\<demo-config>.json` holds updater state, not an updater setting
- **msix-swap** = package folder moved to `WindowsApps\Deleted\<demo>` mid-session
- **cowork-vm-stop** = CoworkVMService stopped then started in the same minute
- **false-file-lock-dialog** = dialog blames "another program"; the program is Claude
- **developer-sideload-not-store** = SignatureKind Developer; Store settings do not apply
- **orchestrated-not-crash** = Crashpad empty; no fault entry; self-update, not a crash

Verdicts: afloat, careened, nine-versions, overnight-kill, midday-update, no-deferral, no-opt-out, msix-swap, cowork-vm-stop, false-file-lock-dialog, developer-sideload-not-store, orchestrated-not-crash.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the yard deferred the haulout or the hull already careened. Fixtures use fictionalized paths (`C:\Program Files\WindowsApps\Claude_<demo-ver>_x64__<demo-pfn>`, `%APPDATA%\Claude\<demo-config>.json`).

Hypothesis only (NON-BINDING): updater treats any process state as interruptible and has no "session busy / defer until idle" gate on Developer-sideloaded MSIX. Discard if evidence disagrees. Encoded from the issue’s mechanism. Do not claim unseen source.

## Why not a clone

This is specifically: **WINDOWS DESKTOP APP SELF-UPDATES AND RESTARTS OVER A RUNNING SESSION — NINE FORCED RESTARTS IN NINE DAYS, NO OPT-OUT.**

NOT Relict ([#92173](https://github.com/anthropics/claude-code/issues/92173)) — orphaned WindowsApps Run path after MSIX folder gone (startup leftover). Careen is **live mid-session** forced MSIX swap that kills running work.
NOT Snuff ([#92207](https://github.com/anthropics/claude-code/issues/92207)) — macOS stealth-update **after idle** severs Remote Control bridges; Careen is Windows **active/unattended mid-work** stop with no deferral.
NOT [#92196](https://github.com/anthropics/claude-code/issues/92196) — macOS auto-update **crashes** unattended desktop sessions (relaunch banner, then crash). Careen is Windows **orchestrated** MSIX swap, not a crash.
NOT [#92202](https://github.com/anthropics/claude-code/issues/92202) — Windows AppX 0x80070020 file-in-use **on launch** (labeled duplicate; same MSIX swap surface). Careen is the live mid-session scrape, not the leftover launch lock.
NOT Ratchet ([#92242](https://github.com/anthropics/claude-code/issues/92242)) — `/goal` stop-hook re-fire after AskUserQuestion BLOCKED.
NOT Forme ([#92203](https://github.com/anthropics/claude-code/issues/92203)) — TUI completed-turn scrollback wipe.
NOT Tabula ([#92210](https://github.com/anthropics/claude-code/issues/92210)) — deep-link same-folder scratch.
NOT Oxbow ([#92197](https://github.com/anthropics/claude-code/issues/92197)) — transcript forest largest≠newest.
NOT Hellbox ([#92168](https://github.com/anthropics/claude-code/issues/92168)) — sticky CLAUDE_PROJECT_DIR.
NOT Cupel ([#92122](https://github.com/anthropics/claude-code/issues/92122)) — MCP draft-07.
NOT Oubliette ([#92095](https://github.com/anthropics/claude-code/issues/92095)) — cold-parent Dispatch.
NOT Ephemera ([#92090](https://github.com/anthropics/claude-code/issues/92090)) — 5m subagent cache.
NOT Caisson / Hawser / Buoy / Deadeye UIs.

Different surface: Developer-sideloaded Windows MSIX live-session swap vs startup Run leftover / macOS idle stealth relaunch / `/goal` hooks / TUI scrollback / deep-link / transcript forest. Completely different UI (maritime careening yard — tide teal, barnacle copper, hull black, scraper's brass, chalk white), backend (probe-shaped JSON of afloat / careened / nine-versions / overnight-kill / msix-swap rows), and UX (voyage-underway vs forced-careen simulator, afloat/careened state machine, yard plates).

Cousins are cite-only on a cousin strip; primary stays #92246.

- [#92207](https://github.com/anthropics/claude-code/issues/92207) — OPEN — macOS stealth-update after idle severs Remote Control bridges (Snuff). Cite-only.
- [#92173](https://github.com/anthropics/claude-code/issues/92173) — OPEN — versioned WindowsApps Run path orphan after MSIX folder gone (Relict). Cite-only.
- [#92196](https://github.com/anthropics/claude-code/issues/92196) — OPEN — macOS auto-update crashes unattended desktop sessions (relaunch banner mid-session, then crash). Cite-only.
- [#92202](https://github.com/anthropics/claude-code/issues/92202) — OPEN, duplicate — Windows AppX 0x80070020 file-in-use on launch; same MSIX swap surface. Cite-only.
- [#89992](https://github.com/anthropics/claude-code/issues/89992) — OPEN — Windows MSIX auto-update terminates running app; same false file-in-use dialog. Cite-only.
- [#92167](https://github.com/anthropics/claude-code/issues/92167) — OPEN — MSIX stealth update leaves app unlaunchable 0x80070020 (Helium hive). Cite-only.

Backups (document only, do not build): [#92244](https://github.com/anthropics/claude-code/issues/92244) (Clevis — agent-team duplicate identical-timestamp delivery), [#92219](https://github.com/anthropics/claude-code/issues/92219) (Folio — VSCode session tab X closes others), [#92236](https://github.com/anthropics/claude-code/issues/92236) (Thole — all-archived sessions hide UI).

Product name stays **Careen**. Do not rename to Ratchet, Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle, Detent, Snuff, Doublet, Lintel or any existing catalog slug.

Different UI: maritime careening yard + tide teal + barnacle copper + hull black + scraper's brass / chalk white. Newsreader + Figtree + IBM Plex Mono. NOT Outfit / Source Serif 4 / Fragment Mono (Ratchet). NOT Literata / Manrope (Forme). NOT Fraunces / Source Sans 3 (Tabula). NOT Crimson Pro / Work Sans / Space Mono (Oxbow). NOT Spectral / Manrope / JetBrains Mono (Relict). Stay OFF workshop ratchet / imposing-stone / wax tablet / oxbow floodplain / glacial relict slab / hellbox melt / cupel assay / oubliette pit / caisson lock-gate.

Different verbs: Score the yard, pin idle afloat, pin seeded careened, admit the hull already careened, load fixtures, reset to afloat. Score the yard is this desk’s phrase.

Different idle: **afloat**.

## Live catalog path

`/careen/` is this static maritime careening-yard scoring desk. Path `https://hermes-playground-green.vercel.app/careen/` and subdomain `https://careen.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `10:50 / hermes catalog #146 / #92246`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **careened** — voyage still underway; updater staged at 03:07 and applied at 03:17; CoworkVMService stopped; MSIX swapped; no prompt, no deferral, no opt-out; overnight unattended work killed; the hull is already careened.
2. Idle **afloat** → session-busy / defer-until-idle held; stage for the next clean start; CoworkVMService left running; the hull stays afloat.
3. Yard UI: heeled hull for careened vs upright hull for afloat, voyage/careen state machine, chalk plates. Afloat = haulout deferred. Careened = scraper on the live hull.
4. Cousin cite strip labeled cousin-not-primary: [#92207](https://github.com/anthropics/claude-code/issues/92207), [#92173](https://github.com/anthropics/claude-code/issues/92173), [#92196](https://github.com/anthropics/claude-code/issues/92196), [#92202](https://github.com/anthropics/claude-code/issues/92202), [#89992](https://github.com/anthropics/claude-code/issues/89992), [#92167](https://github.com/anthropics/claude-code/issues/92167). Cite only. Primary stays #92246.
5. **Score the yard** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Voyage simulator chips rewrite whether the updater observes a busy session. Careen machine steps voyage → stage → stop-vm → swap → restart → careen.

## How to score

Open `projects/careen/index.html` in a browser, or serve the repo root and visit `/careen/` (Vercel rewrite → `/projects/careen`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/careen/hook/README.md
```

Empty paste scores the idle **afloat** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **careened**.
