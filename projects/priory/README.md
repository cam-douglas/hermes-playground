# Priory

A **limestone priory / makepri scriptorium / AppX resource-index desk** — cool stone, vellum, iron-gall ink, pale cloister light, package-tree and HRESULT panes — Alegreya + Nunito Sans + Source Code Pro — for a real Claude Desktop defect: **STRAY `priconfig.xml` IN THE SHIPPED MSIX ROOT MAKES WINDOWS LOOK FOR RESOURCE PACKAGES THAT WERE NEVER PACKED.**

Primary:

- [anthropics/claude-code#92345](https://github.com/anthropics/claude-code/issues/92345) (OPEN, bug, has repro, platform:windows, area:cowork, area:installation, area:desktop). Title: `[BUG] Stray priconfig.xml in Desktop MSIX breaks installation with 0x80073CF9`. Filed 2026-09-05. Reporter: byalvaroft.

01:50 priory: a cloister that lets makepri's priconfig.xml walk into the shipped MSIX root is not an admin lockout — it is already leaked. Score the index or admit the resource packages were never packed.

Idle word: **sealed**. Seeded state: **leaked** / #92345 — `priconfig.xml` present in package root → phantom resource lookup → `0x80070490` → `0x80073CF9`; false admin/Cowork message. Never idle as waiting, standing, razed, once, doubled, stuck, missed, gated, spilled, lit, blanked, cold, voided, banked, rewritten, miskeyed, or any prior catalog idle.

**Priory** is the stone scriptorium where `priconfig.xml` is the illuminator's recipe. The recipe must never leave the cloister into the shipped MSIX. When it leaks into the package root, Windows rings the resource-package bell for Language / Scale / DXFeatureLevel packages that were never packed — ERROR_NOT_FOUND — then the porter falsely blames the abbot (admin) and Cowork.

- **sealed** = HOLD: `priconfig.xml` not in package root; install proceeds; Cowork included
- **leaked** = #92345: `priconfig.xml` (~1480 bytes) in the MSIX root
- **phantom** = `autoResourcePackage` Language | Scale | DXFeatureLevel on a single (non-bundle) MSIX
- **wrap** = `0x80073CF9` ERROR_INSTALL_FAILED wrapping `0x80070490`
- **not-found** = `0x80070490` ERROR_NOT_FOUND during Evaluated / resource-indexing
- **false-abbot** = installer says administrator access is required; log already `Is elevated: true`
- **cowork-lie** = "install without Cowork" — Cowork is not the failure
- **excised** = delete that one file; ~627 MB package installs; `CoworkVMService` Running
- **spanish-guess** = unverified: es-ES display vs package `Language=en-US`
- **stage-zero** = Stage required cost 0 ms after the Evaluated fail

Verdicts: sealed, leaked, phantom, wrap, not-found, false-abbot, cowork-lie, excised, spanish-guess, stage-zero.

This is a diagnostic scoring desk. Not an exploit. No secrets. No live AppX install. Score whether the package is sealed or already leaked. Fixtures use published HRESULTs, event ids, and package identity from the issue only.

Hypothesis only (NON-BINDING): Spanish display language vs package default `Language=en-US` may make the phantom lookup fatal. Reporter did not test a language switch. Treat as a guess. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92345](https://github.com/anthropics/claude-code/issues/92345)

What happened (from the issue — do not invent):

- Environment: Windows 11 Pro, build 10.0.26100 (24H2), x64; system display language Spanish (es-ES); Claude Setup 1.46388.4.0 and 1.10628.2.0 (both fail identically). Sideloading and Developer Mode enabled, no MDM, no domain join. Fails since ~June 2026 on the reporter's machine.
- Installer UI: `Installation failed: AddPackage failed: AddPackage failed with HRESULT 0x80073CF9` then `Administrator access is required to install Claude with full features. You can try again or install without Cowork.`
- The second message is misleading. The installer's own log shows `Is elevated: true` and failed identically, in under a second.
- `0x80073CF9` is `ERROR_INSTALL_FAILED`, a generic wrapper. `Microsoft-Windows-AppXDeploymentServer/Operational` wraps `0x80070490` ERROR_NOT_FOUND during the Evaluated state handler (events 605 / 401 / 404 / 613). Indexing cost 62 ms, Evaluation 47 ms, Hardlinking evaluation 47 ms, Stage required cost 0 ms.
- Process Monitor: no file or registry operation fails at the moment of the error — internal lookup, not a missing file on disk.
- Root cause: `priconfig.xml` (~1,480 bytes) sits in the package root and declares `<autoResourcePackage>` for Language, Scale, and DXFeatureLevel. That tells Windows resources live in separate resource packages. The MSIX is a single package, not a bundle, so they do not exist.
- Unverified sub-hypothesis: Spanish display vs package default `Language=en-US` may make the phantom lookup fatal. Not tested. Cite as a guess.
- Isolation: automated delta-debug packed, signed, and installed subsets; isolated `priconfig.xml` out of 3,058 candidate files in 11 steps. Official package minus that one file installs. `CoworkVMService` registers and starts (`PackageFullName : Claude_1.46388.4.0_x64__pzs8sxrjxfjjc`).
- Ruled out by direct test: leftover `CoworkVMService`, orphaned StateRepository rows, stale PackageRepository extensions, missing VCLibs / WindowsAppRuntime / UI.Xaml, permissions/elevation, Anthropic signing chain, AppX volume health, SisPath, KnownFolder descriptors, catalog database, and a fresh Windows user (machine-level, not per-profile).
- Suggested fix from the issue (document only): exclude `priconfig.xml` from the packaging step. It is a `makepri` build input, not a runtime asset. Check the package root for other stray build artifacts. A self-signed rebuild loses Anthropic auto-update and will reintroduce the file.

## Why not a clone

This is specifically: **installer / MSIX packaging leak / AppX resource indexing.**

NOT Latchkey ([#92330](https://github.com/anthropics/claude-code/issues/92330)) — Remote Control auto-start false `/login` while refreshToken still renewable.
NOT Stubble ([#92328](https://github.com/anthropics/claude-code/issues/92328)) — Write UTF-8 LF `.cmd` + CP932 empty del / CWD wipe.
NOT Intake ([#92305](https://github.com/anthropics/claude-code/issues/92305)) — piped stdin double-composition.
NOT Pasteboard ([#92312](https://github.com/anthropics/claude-code/issues/92312)) — platform-conditional Alt+V image-paste miss.
NOT Spillway ([#92311](https://github.com/anthropics/claude-code/issues/92311)) — ultracode concurrency cap bypass.
NOT Relict ([#92173](https://github.com/anthropics/claude-code/issues/92173)) — versioned WindowsApps Run path after MSIX update. Same store, leftover Run, not a packaging leak.
NOT Tabula — wax-tablet / blank-slate composer desk. Priory is stone cloister + HRESULT panes, not a wiped wax tablet.
NOT Blurt / Macule / Alarum / Portcullis / Skive / Lagan / Snub / Ward / Deadlight / Oubliette / Ephemera / Commutator.

Different surface: MSIX `priconfig.xml` leak vs OAuth startup-guard vs Write `.cmd` OEM wipe vs piped-stdin token double-count vs image-paste chord vs ultracode cap skip vs leftover Run key.

Cousins cite-only (NOT primary):

- [#88727](https://github.com/anthropics/claude-code/issues/88727) — MSIX install `0x80073CF6`
- [#89108](https://github.com/anthropics/claude-code/issues/89108) — leftover CoworkVMService `0x80073CF6` / `0x80073CF9` (ruled out on this machine)
- [#90411](https://github.com/anthropics/claude-code/issues/90411) — same false "Administrator access required (Cowork)" banner

Product name stays **Priory**. Do not rename to Latchkey, Stubble, Intake, Pasteboard, Spillway, Relict, Tabula, or any existing catalog slug.

Different UI: limestone priory / scriptorium / AppX resource-index desk — pale stone, vellum, iron-gall ink, cloister arcade, package tree, HRESULT chain, qualifier bells. Alegreya + Nunito Sans + Source Code Pro. NOT Cormorant Garamond / Outfit / IBM Plex Mono (Latchkey). NOT oak/brass latchkey board. NOT stubble field. NOT kraft/dam/CRT. NOT Tabula wax tablet.

Different verbs: Score the index, pin idle sealed, pin seeded leaked, admit the resource packages were never packed, excise priconfig.xml, load fixtures, reset to sealed.

Different idle: **sealed**. Different seeded: **leaked**.

## Live catalog path

`/priory/` is this static cloister scoring desk. Path `https://hermes-playground-green.vercel.app/priory/` and subdomain `https://priory.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `01:50 / hermes catalog #161 / #92345`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **leaked** — `priconfig.xml` in the package root; phantom Language|Scale|DXFeatureLevel lookup; `0x80070490` → `0x80073CF9`; false admin/Cowork banner; `Is elevated: true`.
2. Idle **sealed** → recipe stayed in the cloister; install proceeds; Cowork included; idle word sealed.
3. Desk UI: limestone arcade, vellum folio, package tree, qualifier bells, HRESULT panes, iron-gall log, GitHub issue chip. Leaked = bells ringing, recipe stained at the root. Sealed = bells still, folio clean.
4. Stay-off strip: Latchkey / Stubble / Intake / Pasteboard / Spillway / Relict / Tabula. Primary stays #92345.
5. **Score the index** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Cloister simulator chips rewrite recipe (in-root / excised), bundle (single / real-bundle), elevation (true / false), and language (es-ES / en-US).

## How to score

Open `projects/priory/index.html` in a browser, or serve the repo root and visit `/priory/` (Vercel rewrite → `/projects/priory`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/priory/hook/README.md
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **sealed** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **leaked**.
