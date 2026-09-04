# Relict

A **glacial-relict / fossil-outcrop diagnostic desk** — museum slab, sedimentary strata, amber resin vein, bone-white calcite, iron-oxide stain, slate — Spectral + Manrope + JetBrains Mono — for a real Claude Desktop defect: **CLAUDE DESKTOP (WINDOWS/MSIX) "LAUNCH AT STARTUP" WRITES A VERSIONED WINDOWSAPPS PATH TO HKCU\RUN, SO IT SILENTLY BREAKS AT THE NEXT AUTO-UPDATE; AREA:DESKTOP; PLATFORM:WINDOWS.**

Primary:

- [anthropics/claude-code#92173](https://github.com/anthropics/claude-code/issues/92173) (OPEN, invalid, filed 2026-09-04T17:51:50Z, updated 2026-09-04T17:52:47Z). Title: `[BUG] Claude Desktop (Windows/MSIX): "launch at startup" writes a versioned WindowsApps path to HKCU\Run, so it silently breaks at the next auto-update`. Reporter iamsteamboat. Claude Desktop 1.46388.1.0 MSIX `Claude_pzs8sxrjxfjjc`. Windows 11 Home 10.0.26200. Toggle enabled on 1.24012.11.0; next update 1.25927.0.0 removed the folder; nine updates later Run still points at 1.24012.11.0; Test-Path False.

a relict that keeps a versioned WindowsApps Run path after the MSIX folder is gone is not a live startup — it is an outcrop already orphaned. Score the relict or admit the path already orphaned.

Idle word: **live**. Seeded state: **orphaned** / #92173 — stale versioned Run key + package folder gone + silent fail every logon. Never idle as set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled.

**Relict** is a glacial leftover: an organism or outcrop that survived after the ice withdrew. A versioned `WindowsApps\Claude_<ver>_x64__…\app\claude.exe` path written into `HKCU\…\Run` is that leftover (**orphaned**) instead of a **live** StartupTask that keeps the path current.

- **orphaned** = #92173: stale versioned Run key; package folder gone; silent fail every logon
- **versioned** = HKCU\Run writes a versioned WindowsApps path; MSIX installs into a version-named folder
- **silent** = at every logon Windows tries to launch a path that does not exist and fails silently
- **demoted** = ClaudeStartup State=0 Disabled / UserEnabledStartupOnce=0 — the toggle used the wrong mechanism
- **approved** = entry was never under Explorer\StartupApproved\Run, so Settings → Apps → Startup never shows it failing
- **startup-task** = package manifest declares `windows.startupTask` (`ClaudeStartup`) but the task stays Disabled
- **run-key** = HKCU\Software\Microsoft\Windows\CurrentVersion\Run\Claude still points at 1.24012.11.0
- **missing-folder** = next auto-update 1.25927.0.0 removed the version folder; Test-Path False; nine updates later still gone
- **bound** = StartupTask API keeps the path current / the task stays enabled
- **live** = HOLD: StartupTask API keeps the path current / the task stays enabled; idle word live

Verdicts: live, orphaned, versioned, silent, demoted, approved, startup-task, run-key, missing-folder, bound.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the StartupTask stayed live or the Run key already orphaned the path. Fixtures use the path stamps and package versions from the issue.

Hypothesis only (NON-BINDING): toggle wrote a versioned HKCU\Run instead of enabling the StartupTask API; updates do not refresh Run; silent fail. Discard if issue evidence disagrees. Encoded from the issue's versioned Run key, missing folder, disabled ClaudeStartup, and nine-update silent fail. Do not claim Claude Desktop source you have not seen.

## Why not a clone

This is specifically: **VERSIONED WINDOWSAPPS PATH WRITTEN TO HKCU\RUN ON CLAUDE DESKTOP MSIX, THEN THE NEXT AUTO-UPDATE REMOVES THAT VERSION FOLDER AND THE RUN ENTRY IS NEVER REWRITTEN — SILENT LOGON FAIL — area:desktop + platform:windows.**

NOT Hellbox ([#92168](https://github.com/anthropics/claude-code/issues/92168)) — sticky CLAUDE_PROJECT_DIR ENOENT exit-2 erase.
NOT Cupel ([#92122](https://github.com/anthropics/claude-code/issues/92122)) — era-legacy shared-pool then draft-07 outputSchema refusal.
NOT Oubliette ([#92095](https://github.com/anthropics/claude-code/issues/92095)) — cold-parent Dispatch child-completion queue.
NOT Ephemera ([#92090](https://github.com/anthropics/claude-code/issues/92090)) — Fable 5.1 five-minute subagent cache wick rewrite.
NOT Commutator ([#91958](https://github.com/anthropics/claude-code/issues/91958)) — streamable-http concurrent batch JSON-RPC id mis-correlation.
NOT Reliquary (existing catalog) — different product; do not confuse names.
NOT Heddle — stay off.
NOT Hectograph ([#92056](https://github.com/anthropics/claude-code/issues/92056)) — OTEL `tool_input` / `tool_parameters` scrub-flag leak.

Different surface: Windows packaging / autostart registry vs agent hooks/MCP/dispatch/cache. Completely different UI (glacial-relict fossil outcrop / museum slab desk — slate, amber resin, bone-white calcite, iron-oxide), backend (outcrop-shaped JSON of versioned Run / missing folder / disabled StartupTask rows), and UX.

Cousins are cite-only on a cousin strip; primary stays #92173.

- [#92167](https://github.com/anthropics/claude-code/issues/92167) — OPEN — MSIX stealth update 0x80070020 Helium hive. Cite-only.
- [#89912](https://github.com/anthropics/claude-code/issues/89912) — OPEN — MSIX stealth update relaunch 0x80070020. Cite-only.
- [#91482](https://github.com/anthropics/claude-code/issues/91482) — OPEN — MSIX auto-update leaves package unlaunchable 0x80070020. Cite-only.
- [#85689](https://github.com/anthropics/claude-code/issues/85689) — OPEN — MSIX update destroys data. Cite-only.

Different-class cite:

- [#91750](https://github.com/anthropics/claude-code/issues/91750) — OPEN — file-handler registration — not Run. Cite-only.

Backups (document only, do not build): [#92187](https://github.com/anthropics/claude-code/issues/92187) (Revenant — /exit backgrounds + killed reclaim), [#92171](https://github.com/anthropics/claude-code/issues/92171) (Kern — slash $1 drop), [#92166](https://github.com/anthropics/claude-code/issues/92166) (Ashbin — /tmp scratchpad wipe).

Product name stays **Relict**. Do not rename to Hellbox, Cupel, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle, Homograph, Deckle, Damper or any existing catalog slug.

Different UI: glacial-relict fossil outcrop / museum slab desk + sedimentary strata + amber resin vein + bone-white calcite + iron-oxide stain / slate. Spectral + Manrope + JetBrains Mono. NOT Fraunces / DM Sans / IBM Plex Mono (Hellbox). NOT Bodoni Moda / Outfit (Cupel). NOT Eczar / Schibsted Grotesk / Martian Mono (Oubliette). NOT Newsreader / Figtree / Source Code Pro (Ephemera). Stay OFF Hellbox letterpress / Cupel assay office / Oubliette dungeon / Ephemera wick atelier / rotary copper drum / vault reliquary.

Different verbs: Score the relict, pin idle live, pin seeded orphaned, admit the path already orphaned, load fixtures, reset to live. Score the relict is this desk's phrase.

Different idle: **live**.

## Live catalog path

`/relict/` is this static glacial-relict fossil-outcrop desk. Path `https://hermes-playground-green.vercel.app/relict/` and subdomain `https://relict.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `04:50 / hermes catalog #141 / #92173`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **orphaned** — stale versioned Run key; package folder gone; ClaudeStartup Disabled; silent fail every logon; the outcrop is already orphaned.
2. Idle **live** → StartupTask API keeps the path current / the task stays enabled; the outcrop stays live.
3. Museum-slab UI: sedimentary strata / amber resin vein / bone-white calcite / iron-oxide stain. Live = the StartupTask keeps the path current. Orphaned = the versioned Run key is already a fossil.
4. Cousin cite strip labeled cousin-not-primary: [#92167](https://github.com/anthropics/claude-code/issues/92167), [#89912](https://github.com/anthropics/claude-code/issues/89912), [#91482](https://github.com/anthropics/claude-code/issues/91482), [#85689](https://github.com/anthropics/claude-code/issues/85689). Different-class: [#91750](https://github.com/anthropics/claude-code/issues/91750). Cite only. Primary stays #92173.
5. **Score the relict** walks the probe ticket and lights chips on the slab. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/relict/index.html` in a browser, or serve the repo root and visit `/relict/` (Vercel rewrite → `/projects/relict`). No build step. Optional hook:

```bash
node projects/relict/hook/relict.mjs projects/relict/data/92173.json
node --test projects/relict/hook/relict.test.mjs
```

Empty stdin scores the idle **live** ticket. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **orphaned**.
