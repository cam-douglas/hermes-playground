# Oxbow

A **floodplain cartography / oxbow-lake survey desk** — muted teal oxbow water, sand-bar beige, willow green, contour-line slate, parchment map grid — Crimson Pro + Work Sans + Space Mono — for a real Claude Desktop defect: **DESKTOP APP RENDERS AN OLDER BRANCH OF THE SESSION TRANSCRIPT FOREST (LARGEST BY ENTRY COUNT), HIDING THE MOST RECENT DAYS EVEN THOUGH DATA IS INTACT ON DISK; AREA:DESKTOP; PLATFORM:MACOS.**

Primary:

- [anthropics/claude-code#92197](https://github.com/anthropics/claude-code/issues/92197) (OPEN, bug, has-repro, platform:macos, area:desktop, filed 2026-09-04T19:21:32Z, updated 2026-09-04T19:22:43Z). Title: `[BUG] Desktop app renders an older branch of the session transcript, hiding the most recent days (data intact on disk)`. Reporter tonymontezuma. Claude Desktop 1.46388.3 Code tab. macOS 27.0 arm64. Node v24.12.0. Claude Code 2.1.238. Session `698952e6…` 60,050 entries / 5 roots / 2,110 leaves; newest-message branch 9,340 (09-02→09-04); largest branch 13,914 (08-21→09-02). 27,594 recent entries on disk not displayed. Control session `76af434c…` largest==newest renders fine.

an oxbow that keeps the largest abandoned meander while the live channel carries the newest days is not a full transcript — it is a lake already stranded. Score the oxbow or admit the branch already stranded.

Idle word: **channel**. Seeded state: **stranded** / #92197 — largest≠newest; UI stuck on older branch ending 09-02; recent days hidden; data intact. Never idle as live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled.

**Oxbow** is a cutoff meander still holding old water while the live channel moved on. Rendering the largest old branch is stranded in the oxbow; following the newest-message branch keeps the channel.

- **channel** = HOLD: UI follows newest-message branch / live channel
- **stranded** = #92197: largest≠newest; UI stuck on older branch ending 09-02; recent days hidden; data intact
- **forest** = transcript is not a single chain; /compact and resumes leave a forest
- **roots** = 5 roots in the affected session; control has 1
- **leaves** = 2,110 leaves; newest leaf is not on the largest branch
- **largest** = 13,914 entries · 08-21 → 09-02 — exactly where the UI stops
- **newest** = 9,340 entries · 09-02 → 09-04 — the live channel the UI should follow
- **mismatch** = largest branch is not the newest-message branch
- **intact** = parent chain walks cleanly to `parentUuid: null`; data on disk
- **truncated-ui** = 27,594 recent entries present and not displayed; silent — no error
- **compact-fork** = `/compact` and resumes create multiple roots; pre-fork branch can stay larger
- **parent-chain** = chain intact — this is branch SELECTION failure, not corruption (distinct from #24304)

Verdicts: channel, stranded, forest, roots, leaves, largest, newest, mismatch, intact, truncated-ui, compact-fork, parent-chain.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the UI followed the live channel or already stranded on the largest abandoned meander. Fixtures use the session stamps, branch sizes, and date ranges from the issue.

Hypothesis only (NON-BINDING): UI picks largest branch by entry count instead of the branch holding the newest message; `/compact` multi-root forests trigger MISMATCH. Discard if evidence disagrees. Encoded from the issue's forest census, largest≠newest dates, hidden recent entries, and intact parent chain. Do not claim Desktop source you have not seen.

## Why not a clone

This is specifically: **DESKTOP CODE-TAB TRANSCRIPT FOREST BRANCH SELECTION — LARGEST≠NEWEST HIDES RECENT DAYS WHILE DATA STAYS INTACT ON DISK — area:desktop + platform:macos.**

NOT Relict ([#92173](https://github.com/anthropics/claude-code/issues/92173)) — versioned WindowsApps MSIX Run path after the folder is gone.
NOT Hellbox ([#92168](https://github.com/anthropics/claude-code/issues/92168)) — sticky CLAUDE_PROJECT_DIR ENOENT exit-2 erase.
NOT Cupel ([#92122](https://github.com/anthropics/claude-code/issues/92122)) — era-legacy shared-pool then draft-07 outputSchema refusal.
NOT Oubliette ([#92095](https://github.com/anthropics/claude-code/issues/92095)) — cold-parent Dispatch child-completion queue.
NOT Ephemera ([#92090](https://github.com/anthropics/claude-code/issues/92090)) — Fable 5.1 five-minute subagent cache wick rewrite.
NOT Commutator ([#91958](https://github.com/anthropics/claude-code/issues/91958)) — streamable-http concurrent batch JSON-RPC id mis-correlation.

Different surface: desktop transcript forest branch selection vs packaging/hooks/MCP/dispatch/cache. Completely different UI (floodplain cartography / oxbow-lake survey desk — muted teal, sand-bar beige, willow green, contour-line slate, parchment map grid), backend (probe-shaped JSON of forest / roots / largest / newest / mismatch rows), and UX.

Cousins are cite-only on a cousin strip; primary stays #92197.

- [#86851](https://github.com/anthropics/claude-code/issues/86851) — CLOSED — transient tail hide. Cite-only.
- [#73422](https://github.com/anthropics/claude-code/issues/73422) — CLOSED — empty after SSH. Cite-only.
- [#79940](https://github.com/anthropics/claude-code/issues/79940) — CLOSED — transcriptUnavailable. Cite-only.
- [#24304](https://github.com/anthropics/claude-code/issues/24304) — CLOSED — broken parent chain — distinct; ours chain intact. Cite-only.

Open family cite-only:

- [#92009](https://github.com/anthropics/claude-code/issues/92009) — OPEN — VS Code history.jsonl desync. Cite-only.
- [#89740](https://github.com/anthropics/claude-code/issues/89740) — OPEN — Session History panel fails to list/resume. Cite-only.
- [#86277](https://github.com/anthropics/claude-code/issues/86277) — OPEN — Desktop session list missing after data reset. Cite-only.

Backups (document only, do not build): [#92194](https://github.com/anthropics/claude-code/issues/92194) (Catafalque — Remote Control archives on network give-up), [#91806](https://github.com/anthropics/claude-code/issues/91806) (Diplopia — App Volumes stat/fstat dev mismatch kills shell capture), [#92195](https://github.com/anthropics/claude-code/issues/92195) (Gimlet — browser Allow-site never sticks off-localhost).

Product name stays **Oxbow**. Do not rename to Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle, Homograph, Deckle, Damper, Revenant, Kern, Ashbin, Belay, Capstan, Detent, Holdfast, Wastegate or any existing catalog slug.

Different UI: floodplain cartography / oxbow-lake survey desk + muted teal oxbow water + sand-bar beige + willow green + contour-line slate / parchment map grid. Crimson Pro + Work Sans + Space Mono. NOT Spectral / Manrope / JetBrains Mono (Relict). NOT Fraunces / DM Sans / IBM Plex Mono (Hellbox). NOT Bodoni Moda / Outfit (Cupel). NOT Eczar / Schibsted Grotesk / Martian Mono (Oubliette). NOT Newsreader / Figtree / Source Code Pro (Ephemera). Stay OFF Relict glacial fossil slab / Hellbox letterpress / Cupel assay office / Oubliette dungeon / Ephemera wick atelier.

Different verbs: Score the oxbow, pin idle channel, pin seeded stranded, admit the branch already stranded, load fixtures, reset to channel. Score the oxbow is this desk's phrase.

Different idle: **channel**.

## Live catalog path

`/oxbow/` is this static floodplain oxbow-lake survey desk. Path `https://hermes-playground-green.vercel.app/oxbow/` and subdomain `https://oxbow.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `05:50 / hermes catalog #142 / #92197`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **stranded** — largest≠newest; UI stuck on the older 13,914-entry branch ending 09-02; 27,594 recent entries hidden; parent chain intact; the lake is already stranded.
2. Idle **channel** → UI follows the newest-message branch / live channel; largest==newest on the control forest; the survey stays on the channel.
3. Floodplain-map UI: oxbow lake / live channel / sand bars / contour ticks. Channel = the UI follows the newest-message branch. Stranded = the viewport sits on the largest abandoned meander.
4. Cousin cite strip labeled cousin-not-primary: [#86851](https://github.com/anthropics/claude-code/issues/86851), [#73422](https://github.com/anthropics/claude-code/issues/73422), [#79940](https://github.com/anthropics/claude-code/issues/79940), [#24304](https://github.com/anthropics/claude-code/issues/24304). Open family: [#92009](https://github.com/anthropics/claude-code/issues/92009), [#89740](https://github.com/anthropics/claude-code/issues/89740), [#86277](https://github.com/anthropics/claude-code/issues/86277). Cite only. Primary stays #92197.
5. **Score the oxbow** walks the probe ticket and lights chips on the survey sheet. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/oxbow/index.html` in a browser, or serve the repo root and visit `/oxbow/` (Vercel rewrite → `/projects/oxbow`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/oxbow/hook/README.md
```

Empty paste scores the idle **channel** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **stranded**.
