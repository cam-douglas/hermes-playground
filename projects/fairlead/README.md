# Fairlead

A **ship-deck hawse-pipe / chock-rail / URI-scheme fairlead lab** — night-sea plates, salt-steel rails, hawse-brass pipe, scheme gauges (`file://` vs `vscode-remote://`), overlay veil that still appears when the helper returns null, rope that either threads or goes overboard — Fraunces + Outfit + Fragment Mono — for a real Claude Code defect: **SHIFT+DRAGGING A FILE FROM THE VS CODE EXPLORER INTO THE CLAUDE CODE PANEL SILENTLY DOES NOTHING ON REMOTE-WSL / REMOTE-SSH / DEV CONTAINERS BECAUSE THE WEBVIEW DROP HANDLER ACCEPTS ONLY `file://` URIS.**

Primary:

- [anthropics/claude-code#92403](https://github.com/anthropics/claude-code/issues/92403) (OPEN, bug, has-repro, platform:windows, area:ide, platform:vscode, platform:wsl). Title: `[BUG] Drag & drop from the VS Code Explorer silently does nothing in Remote-WSL/SSH/Dev Containers — drop handler only accepts \`file://\` URIs`. Filed 2026-09-05. Reporter: AndresDiagoM.

12:50 fairlead: a fairlead that only guides file:// and returns null on vscode-remote:// is not a remote-ready drop — it is already unguided. Score the lead or admit the path already dropped.

Idle word: **unguided**. Seeded state: **dropped** / #92403 — remote Explorer drop produced `vscode-remote://`; helper returned null; no `@mention`, no attachment, no error. Never idle as strobing, stolen, dawnlocked, misaimed, washed, stranded, unstruck, leaked, nixied, settled, open, elided, grafted, frozen, adrift, cold, voided, banked, rewritten, discarded, held, witnessed, or any prior catalog idle.

**Fairlead** is deck work. A fairlead should guide any legal line through the hawse-pipe. Here the guide only accepts `file://`, so a remote `vscode-remote://` line returns null and goes overboard with no shout. Score whether a lead (normalize vs fsPath-prefer vs local-file-ok vs workaround) would stay unguided, lead, or leave the path already dropped.

- **unguided** = IDLE / scheme fence: helper only guides `file://`; remote windows already unguided
- **dropped** = seeded word: `vscode-remote://` helper-null; drop discarded silently
- **led** = contrast hold: rope through the fairlead; `@mention` inserted
- **normalized** = contrast hold: map `vscode-remote://authority/path` → `file:///path` before existing logic
- **fsPath-prefer** = contrast hold: `codeeditors` branch prefers `resource.fsPath` over `resource.external`
- **local-file-ok** = contrast hold: local window `file://` drop still inserts `@path`
- **remote-null** = helper `eG0`/`OJ0` returns null unless URI starts with `file://`
- **overlay-lies** = drag detection is scheme-agnostic; overlay appears; failure looks like a no-op
- **codeeditors-external** = `resource.external || resource.fsPath` prefers the `vscode-remote://` string
- **ruled-out-or-workarounds** = type `@` and pick; OS Explorer `dataTransfer.files`; Copy Relative Path paste

Verdicts: unguided, dropped, led, normalized, fsPath-prefer, local-file-ok, remote-null, overlay-lies, codeeditors-external, ruled-out-or-workarounds.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a remote Explorer drop would leave the rail unguided or already dropped. Fixtures use the issue's helper guard, published Remote-WSL repro, overlay-lies, codeeditors-external, local-file-ok contrast, normalize table, fsPath-prefer, and the three workarounds only.

Hypothesis only (NON-BINDING): normalize `vscode-remote://<authority>/<path>` to `file:///<path>` before the existing helper, and prefer `resource.fsPath` in the `codeeditors` branch. The fairlead that only guides `file://` is not remote-ready. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92403](https://github.com/anthropics/claude-code/issues/92403)

What happened (from the issue — do not invent):

- Environment: Extension `Anthropic.claude-code` **2.1.261** (also **2.1.259**); VS Code **1.136.1**; Client Windows 11; Remote WSL2 Ubuntu.
- Shift+dragging a file from the VS Code Explorer into the Claude Code panel does nothing when the window is connected to a remote (Remote-WSL, Remote-SSH, Dev Containers). No `@mention` is inserted, no attachment appears, no error is shown. The same drag works in a local window.
- Cause: the webview drop handler accepts only `file://` URIs; remote windows produce `vscode-remote://` URIs. Helper (`eG0` in 2.1.261, `OJ0` in 2.1.259) returns null unless the trimmed URI starts with `file://`.
- Local Explorer hands over `file:///c%3A/Users/...`, which passes. Remote Explorer hands over `vscode-remote://wsl%2BUbuntu/home/user/project/src/app.ts`, which fails.
- The `codeeditors` branch reads `q.resource.external || q.resource.fsPath`. `external` is the `vscode-remote://` string, so it also fails the `file://` check. Preferring `fsPath` (`/home/user/project/src/app.ts`) would have worked.
- Drag detection is scheme-agnostic (`Files` / `resourceurls` / `codeeditors`), which is why the overlay still appears and the failure looks like a no-op.
- Suggested normalize: map `vscode-remote://authority/path` → `file:///path` before existing logic. Local patch made drag & drop behave exactly as on a local window. Verified table in the issue (cwd `/home/user/project`):
  - `vscode-remote://wsl%2BUbuntu/home/user/project/src/app.ts` → `src/app.ts`
  - `vscode-remote://wsl%2BUbuntu/home/user/notes.md` → `/home/user/notes.md`
  - `file:///home/user/project/README.md` → `README.md`
  - `vscode-remote://badauthority` → `null`
  - `https://example.com/x` → `null`
- Workarounds: type `@` and pick; drag from Windows Explorer (`dataTransfer.files`); Copy Relative Path paste.

## Why not a clone

This is specifically: **URI-scheme fairlead / silent remote Explorer drop discard because the helper only accepts `file://`.**

NOT Stroboscope/#92395 — Desktop Code-tab Terminal panel flicker + focus steal. Fairlead is not an optics strobe bench.
NOT Heliostat/#92389 — theme auto never resamples because DECSET 2031 unrecognized on WT. Fairlead is not an observatory heliostat.
NOT Lethe/#92335 — Chrome silent re-auth / session tokens. Fairlead is not an underworld ferry.
NOT Frizzen/#92353 — UserPromptSubmit listed-but-never-invoked. Fairlead is not a flintlock desk.
NOT Nixie/#92383 — auto-mode send_message 45s no-ack settle. Fairlead is not a USPS nixie desk.
NOT Embrasure/#92365 — sandbox denyRead fail-open. Fairlead is not a battlement.
NOT Elision/#92347 — summarize-up-to-here drops summaries. Fairlead is not a blue-pencil folio.
NOT Graft/#92354 — plugin-cache copy-forward. Fairlead is not an orchard grafting bench.
NOT Hawser / Buoy / Clew / Bollard — different rope products already catalogued. Fairlead is URI-scheme guide / silent remote drop, not those desks.
NOT Pasteboard — shortcut. Fairlead is not a pasteboard.
Do NOT name this Chock, Gypsy, Wildcat, Fulcrum, Trunnion, or Aphonia.

Different surface: VS Code webview drop handler `file://`-only vs remote `vscode-remote://` URIs.

Cousins cite-only (NOT primary):

- [#21044](https://github.com/anthropics/claude-code/issues/21044) CLOSED — same bug on Remote-SSH (Cursor), closed as not planned; guessed at `vscode-remote://` with no code-level confirmation
- [#25128](https://github.com/anthropics/claude-code/issues/25128) OPEN — drag & drop failing in the VS Code panel on macOS; may or may not be the same root cause

Product name stays **Fairlead**. Do not rename to Stroboscope, Heliostat, Lethe, Frizzen, Nixie, Embrasure, Elision, Graft, Hawser, Buoy, Clew, Bollard, Chock, Gypsy, Wildcat, Fulcrum, Trunnion, Aphonia, or any existing catalog slug. Name/slug `fairlead` confirmed unused in catalog.json.

Different UI: night-sea deck / hawse-pipe / chock rail / scheme gauges / overlay veil / overboard rope. Fraunces + Outfit + Fragment Mono. NOT Syne / Manrope / IBM Plex Mono (Stroboscope optics). NOT Bricolage Grotesque / Sora / JetBrains Mono (Heliostat observatory). NOT Cormorant Garamond (Lethe river-mist). NOT Bodoni Moda / Commissioner / Space Mono (Frizzen walnut-steel-brass). Stay OFF optics strobe / rooftop observatory / underworld ferry quay / flintlock lockplate / postal pigeonholes / battlement merlons / blue-pencil folio / orchard cambium.

Different verbs: Score the lead, pin idle unguided, pin seeded dropped, admit the path already dropped, flip remote vs local vs normalize vs fsPath, load fixtures, reset to led.

Different idle: **unguided**. Different seeded: **dropped**. Contrast: **led** / **normalized** / **fsPath-prefer** / **local-file-ok**.

## Live catalog path

`/fairlead/` is this static hawse-pipe scoring assay. Path `https://hermes-playground-green.vercel.app/fairlead/` and subdomain `https://fairlead.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `12:50 / hermes catalog #172 / #92403`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **dropped** — `vscode-remote://` helper-null; silent discard.
2. Idle **unguided** → helper only guides `file://`; remote scheme already unguided.
3. Contrast **led** → rope through the fairlead; `@mention` inserted.
4. Contrast **normalized** → `vscode-remote://authority/path` → `file:///path`.
5. Contrast **fsPath-prefer** → `codeeditors` prefers `resource.fsPath`.
6. Contrast **local-file-ok** → local window `file://` still inserts `@path`.
7. Assay UI: night-sea deck, hawse-pipe, chock rail, scheme gauges, overlay veil, overboard rope, Claude panel drop zone.
8. Stay-off strip: Stroboscope / Heliostat / Lethe / Frizzen / Nixie / Embrasure / Elision / Graft / Hawser / Buoy / Clew / Bollard. Primary stays #92403.
9. **Score the lead** walks the probe ticket and lights chips on the rail. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the line (remote / local / normalize / fsPath).

## How to score

Open `projects/fairlead/index.html` in a browser, or serve the repo root and visit `/fairlead/` (Vercel rewrite → `/projects/fairlead`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **unguided** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **dropped** / vscode-remote helper-null / silent discard.
