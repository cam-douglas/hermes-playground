# Tabula

A **wax-tablet / scriptorium / blank-slate scoring desk** — beeswax amber, soot-ink black, bone-stylus ivory, burnt-umber margins, warm parchment — Fraunces + Source Sans 3 + IBM Plex Mono — for a real Claude Desktop defect: **DESKTOP DEEP-LINK SAME-FOLDER STRING COMPARE → createScratchWorkspace — area:desktop + platform:windows + has-repro.**

Primary:

- [anthropics/claude-code#92210](https://github.com/anthropics/claude-code/issues/92210) (OPEN, bug, has-repro, platform:windows, area:desktop, filed 2026-09-04T20:41:22Z, updated 2026-09-04T20:42:21Z). Title: `Desktop 1.46388: claude://code/new?folder= starts a scratch workspace when the folder equals the currently selected folder`. Reporter PedroGiudice. Claude Desktop 1.46388.3 (Windows 11, Microsoft Store / MSIX), bundled engine 2.1.260. Deep link `claude://code/new?folder=<absolute path>&q=<text>` shows Trust for the right folder; after Trust the composer chip and prompt are correct; Enter starts a freshly minted scratch workspace under `%APPDATA%\Claude\scratch-workspaces\…` listed as **No folder**. Log: `LocalSessions.checkTrust` → `saveTrust` → `createScratchWorkspace` → Starting local session in scratch-…. Trigger: folder string in the link equals the folder already selected in the composer. Same link works when the selected folder differs. Forward-slash and lowercase-drive spellings also work but create separate sidebar groups — not a usable workaround. Points to plain string comparison in the renderer. Regression: 1.37937.3 / 1.40609.0 did not have this; 1.46388.3 does. Reproduced 4 times in a row.

a tabula that wipes the wax when the deep-link folder already matches the composer is not a seated path — it is a tablet already scratched. Score the stylus or admit the scratch already minted.

Idle word: **seated**. Seeded state: **scratched** / #92210 — same-folder string-eq; Trust ok; Enter mints scratch; No folder list. Never idle as channel / stranded / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted.

**Tabula** is a Roman wax tablet: a blank slate you inscribe with a stylus, then wipe. Seating the path keeps the inscription. Matching the composer wipes the wax and mints a scratch.

- **seated** = HOLD: selected folder differs; session starts in the link folder
- **scratched** = #92210: link folder === composer folder; Enter mints scratch
- **trust-ok** = Trust dialog names the right folder; composer chip is correct
- **string-eq** = plain string compare of the two folder fields
- **slash-variant** = `C:/Users/…` vs `C:\Users\…` seats the session
- **case-variant** = lowercase drive of the same path seats the session
- **scratch-mint** = `createScratchWorkspace` after `saveTrust`
- **sidebar-split** = slash/case spellings become separate sidebar groups
- **regression** = 1.37937.3 / 1.40609.0 seated; 1.46388.3 scratched
- **deep-link** = `claude://code/new?folder=&q=`
- **composer-match** = selected folder equals the link folder
- **no-folder** = minted session listed under "No folder"; prompt intact

Verdicts: seated, scratched, trust-ok, string-eq, slash-variant, case-variant, scratch-mint, sidebar-split, regression, deep-link, composer-match, no-folder.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the stylus seated the path or the tablet already scratched. Fixtures use the log sequence, version stamps, and fictionalized paths from the issue (`C:\Users\<me>\cases\demo-folder`).

Hypothesis only (NON-BINDING): renderer compares folder strings with `===` (or equivalent) and, on equality, takes the "already have this folder" branch that mints a scratch instead of seating the trusted cwd. Slash and case spellings miss that branch, so they work and then split the sidebar. Discard if evidence disagrees. Encoded from the issue's log, trigger, and spelling experiments. Do not claim Desktop source you have not seen.

## Why not a clone

This is specifically: **DESKTOP DEEP-LINK SAME-FOLDER STRING COMPARE → createScratchWorkspace — area:desktop + platform:windows + has-repro.**

NOT Oxbow ([#92197](https://github.com/anthropics/claude-code/issues/92197)) — transcript forest largest≠newest.
NOT Relict ([#92173](https://github.com/anthropics/claude-code/issues/92173)) — versioned WindowsApps Run path orphan.
NOT Hellbox ([#92168](https://github.com/anthropics/claude-code/issues/92168)) — sticky CLAUDE_PROJECT_DIR ENOENT erase.
NOT Cupel ([#92122](https://github.com/anthropics/claude-code/issues/92122)) — era-legacy shared-pool then draft-07 outputSchema refusal.
NOT Oubliette ([#92095](https://github.com/anthropics/claude-code/issues/92095)) — cold-parent Dispatch child-completion queue.
NOT Ephemera ([#92090](https://github.com/anthropics/claude-code/issues/92090)) — Fable 5.1 five-minute subagent cache wick rewrite.
NOT Commutator ([#91958](https://github.com/anthropics/claude-code/issues/91958)) — streamable-http concurrent batch JSON-RPC id mis-correlation.

Different surface: Desktop Code-tab deep-link folder seating vs transcript forest / packaging / hooks / MCP / dispatch / cache. Completely different UI (wax-tablet / scriptorium / blank-slate desk — beeswax amber, soot-ink black, bone-stylus ivory, burnt-umber margins, warm parchment), backend (probe-shaped JSON of deep-link / composer / string-eq / scratch-mint / version rows), and UX (deep-link simulator chips, trust/scratch state machine, version regression table).

Cousins are cite-only on a cousin strip; primary stays #92210.

- [#91991](https://github.com/anthropics/claude-code/issues/91991) — OPEN — Remote Control "New session" attaches to most recent instead of creating new. Cite-only.
- [#89748](https://github.com/anthropics/claude-code/issues/89748) — OPEN — New session not initiating after multiple clicks. Cite-only.
- [#87779](https://github.com/anthropics/claude-code/issues/87779) — OPEN — Agent View: add project folder without relaunching. Cite-only.

Backups (document only, do not build): [#92203](https://github.com/anthropics/claude-code/issues/92203) (Forme — TUI completed turns repainted; scrollback loses recent conversation; Ink Static fix suggested), [#92194](https://github.com/anthropics/claude-code/issues/92194) (Catafalque — Remote Control archives live sessions after network give-up; bypass preserveOnShutdown), [#92179](https://github.com/anthropics/claude-code/issues/92179) (Schism — sidebar sessions oscillate between folder-name vs git-remote-name groups).

Product name stays **Tabula**. Do not rename to Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle, Homograph, Deckle, Damper, Revenant, Kern, Ashbin, Belay, Capstan, Detent, Holdfast, Wastegate or any existing catalog slug.

Different UI: wax-tablet / scriptorium / blank-slate desk + beeswax amber + soot-ink black + bone-stylus ivory + burnt-umber margins / warm parchment. Fraunces + Source Sans 3 + IBM Plex Mono. NOT Crimson Pro / Work Sans / Space Mono (Oxbow). NOT Spectral / Manrope / JetBrains Mono (Relict). NOT Fraunces / DM Sans / IBM Plex Mono (Hellbox — letterpress, not wax). NOT Bodoni Moda / Outfit (Cupel). NOT Eczar / Schibsted Grotesk / Martian Mono (Oubliette). NOT Newsreader / Figtree / Source Code Pro (Ephemera). Stay OFF Oxbow floodplain / Relict glacial fossil slab / Hellbox letterpress / Cupel assay office / Oubliette dungeon / Ephemera wick atelier.

Different verbs: Score the stylus, pin idle seated, pin seeded scratched, admit the scratch already minted, load fixtures, reset to seated. Score the stylus is this desk's phrase.

Different idle: **seated**.

## Live catalog path

`/tabula/` is this static wax-tablet scriptorium desk. Path `https://hermes-playground-green.vercel.app/tabula/` and subdomain `https://tabula.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `06:50 / hermes catalog #143 / #92210`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **scratched** — link folder equals composer folder; Trust dialog is correct; Enter mints `scratch-2026-09-04-43ac21` under AppData\Roaming\Claude\scratch-workspaces; listed as No folder; the tablet is already scratched.
2. Idle **seated** → selected folder differs; same link seats the path; `saveTrust` → `checkGhAvailable` → session in the requested folder; the stylus stays seated.
3. Wax-tablet UI: diptych leaves for composer vs deep-link, stylus, trust/scratch state machine, version seals. Seated = the path is inscribed and kept. Scratched = the wax is wiped and a scratch is minted.
4. Cousin cite strip labeled cousin-not-primary: [#91991](https://github.com/anthropics/claude-code/issues/91991), [#89748](https://github.com/anthropics/claude-code/issues/89748), [#87779](https://github.com/anthropics/claude-code/issues/87779). Cite only. Primary stays #92210.
5. **Score the stylus** walks the probe ticket and lights chips on the tablet. Chip-switch every verdict. Paste or drop JSON. Deep-link simulator chips rewrite the folder spelling. Trust/scratch machine steps checkTrust → saveTrust → Enter.

## How to score

Open `projects/tabula/index.html` in a browser, or serve the repo root and visit `/tabula/` (Vercel rewrite → `/projects/tabula`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/tabula/hook/README.md
```

Empty paste scores the idle **seated** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **scratched**.
