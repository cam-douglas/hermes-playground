# Dryjoint

An **electronics dry-joint / cold-solder bench** — FR4 pcb, copper traces, flux stains, solder pads; Space Grotesk + Manrope + IBM Plex Mono — for a real Claude Code defect: **VS CODE CHAT MARKDOWN FILE LINKS ARE STYLED AS LINKS BUT NEVER CALL THE EXISTING OPEN_FILE BRIDGE; BINARY SHOWTEXTDOCUMENT REJECTS SILENT.** When a hypothetical bonded pad wires chat anchors to `openFile()` and gives `showTextDocument` a catch, the joint is **bonded**.

Primary:

- [anthropics/claude-code#92809](https://github.com/anthropics/claude-code/issues/92809) (OPEN, bug, has repro, platform:vscode). Title: `[BUG] VS Code extension: chat file links are never wired to the existing open_file bridge`. Filed 2026-09-08T08:45:25Z.

18:50 dryjoint: an electronics dry-joint / cold-solder bench that should keep chat markdown file links fused to the existing open_file bridge; instead VS Code chat anchors stay dry (never call the bridge) and binary opens fail silent; score dry or admit fused.

Score dry or admit bonded.

Idle word: **fused** (HOLD: chat markdown file links call the existing `open_file` bridge; binary opens have a catch). #92809 path: **dry**. Admit word: **bonded**. Never idle as bound, matched, lit, dripping, chorded. Never use leaked, orphaned, snuffed, arrested, flattened as the #92809-path word either.

**Dryjoint** = a solder pad that *looks* bonded (styled link) but carries no current (click is a silent no-op) because it was never soldered to the `open_file` bridge; a second dry joint fails open on binary `showTextDocument` without a catch.

- **fused** = IDLE: HOLD; chat anchors call the existing `open_file` bridge; binary opens have a catch
- **dry** = #92809 path: rendered `<a>` never call `openFile()`; binary `showTextDocument` rejects silent
- **bonded** = admit hold: hypothetical chat anchors call existing `openFile()`; `showTextDocument` has a rejection handler that falls back to `vscode.open`
- **unwired-anchor** = rendered `<a>` elements are styled as links but never call `openFile()`
- **bridge-exists-unused** = file chips and the diff view already use `webview openFile` → `sendRequest({type:"open_file"})` → `case "open_file"` → `this.openFile`
- **silent-binary-reject** = `showTextDocument` rejects for `.png` / `.pdf`; no `onRejected` / `.catch`; user sees nothing
- **showTextDocument-no-catch** = `vscode.window.showTextDocument(uri).then(cb)` has no rejection handler
- **markdown-mandate** = system prompt `## Code References in Text` instructs Claude to emit `[name](path)`; those links are dead on arrival
- **cousins** = cite-only #10846 #16056 #44713 #51015 #57100 #72889 CLOSED/LOCKED; primary stays #92809
- **has-clear-repro** = issue labeled has repro

Verdicts: fused, dry, bonded, unwired-anchor, bridge-exists-unused, silent-binary-reject, showTextDocument-no-catch, markdown-mandate, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No network to Anthropic. Score whether chat file-link anchors would leave the pad **dry** or already **bonded**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): chat `<a>` anchors never call the existing `openFile` bridge; `showTextDocument.then(cb)` has no catch so binary opens fail silent. Verify against issue text only; do not claim unread source. The reporter's suggested webview + host catch is cited on the issue — do NOT implement that fix in anthropics/claude-code; this catalog product only reconstructs the published diagnostic.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92809](https://github.com/anthropics/claude-code/issues/92809)
- Cousins cite-only (NOT primary): [anthropics/claude-code#10846](https://github.com/anthropics/claude-code/issues/10846) CLOSED/LOCKED — Valid markdown links in the VS Code extension do not open files (reported fixed in v2.1.4). [anthropics/claude-code#16056](https://github.com/anthropics/claude-code/issues/16056) CLOSED/LOCKED — Markdown file links not clickable on macOS. [anthropics/claude-code#44713](https://github.com/anthropics/claude-code/issues/44713) CLOSED/LOCKED — File links non-functional; regression from the v2.1.4 fix (2.1.92). [anthropics/claude-code#51015](https://github.com/anthropics/claude-code/issues/51015) CLOSED/LOCKED — clickable-styled file links do nothing; absolute / `file:///` / directory paths. [anthropics/claude-code#57100](https://github.com/anthropics/claude-code/issues/57100) CLOSED/LOCKED — clickable file links no longer open (2.1.132). [anthropics/claude-code#72889](https://github.com/anthropics/claude-code/issues/72889) CLOSED — file links look clickable but don't navigate or reveal.

What happened (from the issue body — do not invent):

- Markdown file links rendered in the VS Code extension chat panel are styled as links but clicking them does nothing — no open, no reveal, no error
- The extension's own system prompt (`## Code References in Text`) instructs Claude to emit file references as `[name](path)`
- Two independent defects, and neither is "link handling is missing"
- Defect 1: the open path is present, complete, and in active use by file chips and the diff view: `webview/index.js openFile(filePath, location)` → `sendRequest({type: "request", requestId, request: {type: "open_file", filePath, location}})` → `extension.js case "open_file"` → `this.openFile(...)`
- The host resolves relative paths against `cwd`, has fallbacks when the file is missing, and calls `revealInExplorer` for directories. The rendered `<a>` elements simply never call it
- Defect 2: the host's `openFile` ends in `vscode.window.showTextDocument(uri).then(cb)` with no rejection handler. `showTextDocument` rejects for non-text files. A link to a `.png` or `.pdf` stays dead even after the anchors are wired
- Repro: ask Claude to create `docs/note.md` and `docs/chart.png`; Claude replies with `[note.md](docs/note.md)` and `[chart.png](docs/chart.png)`; click either link — nothing. Same with absolute paths, `file:///` URLs, and directory paths (previously reported in #51015)
- Environment: Extension `anthropic.claude-code-2.1.263-linux-x64`, VS Code 1.132.0; Debian 13 (trixie), KDE Plasma on X11
- Last working version: 2.1.4 (per #10846). Recurring: broken again by v2.1.92 (#44713); again in 2.1.132 (#57100); still broken in 2.1.263
- Desktop side is not at fault: VS Code from native `.deb` (no Flatpak/Snap), `xdg-open` present, three `xdg-desktop-portal` processes, `image/png` handler registered — none of that is ever reached
- Filed 2026-09-08T08:45:25Z; labels bug, has repro, platform:vscode; OPEN
- Reporter: 0nelight
- Cited suggested fix (do not implement here): webview click of an unsized href (not `#` fragment) should parse optional `#L<n>` / `#L<n>-L<m>` into `location` and call existing `openFile()`; host should give `showTextDocument(uri).then(cb)` a rejection handler that falls back to `vscode.commands.executeCommand("vscode.open", uri)`
- Workaround cited only: https://github.com/0nelight/claude-code-vscode-linkfix

Problem found: VS CODE CHAT MARKDOWN FILE LINKS ARE STYLED AS LINKS BUT NEVER CALL THE EXISTING OPEN_FILE BRIDGE; BINARY SHOWTEXTDOCUMENT REJECTS SILENT.

Why this solution: a diagnostic scorer for the fused → dry / bonded joint chain, so a reader can pin idle fused, load the #92809 dry path, and score unwired-anchor / bridge-exists-unused / silent-binary-reject / showTextDocument-no-catch / markdown-mandate / cousins against the published facts.

## Why not a clone

This is specifically: **VS CODE CHAT MARKDOWN FILE LINKS ARE STYLED AS LINKS BUT NEVER CALL THE EXISTING OPEN_FILE BRIDGE; BINARY SHOWTEXTDOCUMENT REJECTS SILENT**.

**NOT Dinkus/#92798** (plugin-settings sed frontmatter range — already shipped). Do not touch Dinkus.

**NOT Homonym/#92787** (Desktop UUID connector mounts — already shipped). Do not touch Homonym.

**NOT Clepsydra/#92776** (OTel token.usage mid-session arrest — already shipped). Do not touch Clepsydra.

**NOT Rushlight/#92784** (session-scoped TCC AppData — already shipped). Do not touch Rushlight.

**NOT Letoff/#92771** (libuv Shift+Enter flatten — already shipped). Do not touch Letoff.

**NOT Ptybind/#92757**. **NOT Espagnolette/#92694**. **NOT Dunnage/#92746**. **NOT Setoff/#92750**. **NOT Imprimatur/#92740**. **NOT Byname/#92738**. **NOT Crenel/#92729**. **NOT Quietus/#92716**. **NOT Cribble/#92684**. **NOT Springe/#92675**. **NOT Oubliette**. **NOT Ephemera**.

NOT a clone of Claude Code. NOT a live VS Code extension patch. NOT an exploit. NOT a live Claude session.

Different paradigm: **chat `<a>` anchors look bonded but were never soldered to the existing `open_file` bridge; binary `showTextDocument` fails open without a catch**.

Cousins cite-only (NOT primary): #10846 #16056 #44713 #51015 #57100 #72889 CLOSED/LOCKED. Do not auto-pick as thesis.

Backups cite in this README only — do NOT auto-pick as primary: [anthropics/claude-code#92788](https://github.com/anthropics/claude-code/issues/92788) (AskUserQuestion free-text discard / alt Quill), [anthropics/claude-code#92794](https://github.com/anthropics/claude-code/issues/92794) (classic mouse dead Ptyxis), [anthropics/claude-code#92801](https://github.com/anthropics/claude-code/issues/92801) (workspace trust not persisted), [anthropics/claude-code#92761](https://github.com/anthropics/claude-code/issues/92761) (worktree plugin first-row / alt Cadet), [anthropics/claude-code#92769](https://github.com/anthropics/claude-code/issues/92769) (disable-model-invocation / alt Clevis), [anthropics/claude-code#92781](https://github.com/anthropics/claude-code/issues/92781) (Scrollwheel), [anthropics/claude-code#92793](https://github.com/anthropics/claude-code/issues/92793) (Bazaar), [anthropics/claude-code#92734](https://github.com/anthropics/claude-code/issues/92734) (teleport / alt Portage).

Do NOT rename this product Dinkus, Homonym, Rushlight, Clepsydra, Letoff, Ptybind, Dunnage, Setoff, Espagnolette, Imprimatur, Byname, Crenel, Quietus, Cribble, Springe, Oubliette, or Ephemera.
Do NOT reuse idle bound / matched / lit / dripping / chorded. Do NOT reuse seeded leaked / orphaned / snuffed / arrested / flattened.

Different surface: chat-panel `<a>` never wired to an existing `open_file` bridge vs plugin-settings sed frontmatter / Desktop UUID mounts / OTel meter arrest / session-scoped TCC / libuv Shift+Enter flatten.

Product name stays **Dryjoint**. Name/slug `dryjoint` confirmed unused in catalog.json (223 products before this ship; Dinkus is #223).

Different UI: electronics dry-joint / cold-solder bench / FR4 pcb / copper traces / flux stains / solder pads. Space Grotesk / Manrope / IBM Plex Mono. NOT Zilla Slab / Atkinson Hyperlegible / JetBrains Mono (Dinkus). NOT Fraunces / Outfit (Homonym). NOT Petrona / Manrope / IBM Plex Mono as a trio with Petrona (Rushlight). NOT EB Garamond / Barlow / Source Code Pro (Clepsydra). NOT Lora / Plus Jakarta / Cousine (Letoff). NOT compositor parchment. NOT lexicographer desk. NOT water-clock marble. NOT piano action-rail.

Different verbs: Score dry, Admit bonded, Pin idle fused, Load the #92809 path, Reset to fused, Lift the joint, Solder the pad.

Different idle: **fused**. Different #92809 path: **dry**. HOLD: **fused** / **bonded**. ALARM: **dry** / **unwired-anchor** / **bridge-exists-unused** / **silent-binary-reject** / **showTextDocument-no-catch** / **markdown-mandate** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/dryjoint/hook/dryjoint.test.mjs
node projects/dryjoint/hook/dryjoint.mjs projects/dryjoint/data/92809.json
node projects/dryjoint/hook/dryjoint.mjs projects/dryjoint/data/fused.json
echo '{"seed":"dry","dry":true}' | node projects/dryjoint/hook/index.mjs
```

Open the living card at `projects/dryjoint/index.html` (or the live path `/dryjoint/`). Buttons: Score dry, Admit bonded, Pin idle fused, Load dry, Load fixtures, Reset to fused. Lift the joint. Solder the pad. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/dryjoint/
- Folder: `projects/dryjoint/`
