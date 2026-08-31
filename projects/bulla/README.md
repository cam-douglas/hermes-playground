# Bulla

A **papal lead-bulla / sealed-package assay desk** — dark olive wax cloth, lead-grey seal puck, vermillion cord, cool parchment, brass stylus; Cormorant Garamond + IBM Plex Sans + IBM Plex Mono — for a real Claude Desktop defect: **an in-place write inside an immutable MSIX package directory breaks the code-integrity catalog, Windows blocks Chromium SwiftShader, the GPU process dies, and every embedded Claude Code session is killed**.

Primary:

- [anthropics/claude-code#90891](https://github.com/anthropics/claude-code/issues/90891) (OPEN, filed 2026-08-31T04:07:51Z by gsl0001). Title: Claude Desktop (Windows MSIX) updater modifies package in place, breaking code integrity; blocked vk_swiftshader.dll load crashes GPU process and kills all embedded Claude Code sessions. Labels: bug, has repro, platform:windows, area:desktop. Desktop **1.40609.0.0** (`Claude_1.40609.0.0_x64__pzs8sxrjxfjjc`, SignatureKind: Developer). Embedded Claude Code **2.1.247**; standalone **2.1.251** (works). Windows 11 Home 64-bit, build 26200. NVIDIA GeForce RTX 5060 Ti, driver 32.0.16.1088.

A broken seal is not a hold. Score the lead or admit **sealed**.

Idle word: **sealed**. Seeded state: **blown** / #90891 — updater wrote in place; catalog missing; GPU dead; sessions killed. Never idle as "bulla" / "wax" / "lead" / "papal" / "chancery" / "msix" / "package" / "gpu" / "cat" / "desktop".

- **sealed** = hold: intact MSIX seal, `CodeIntegrity.cat` present, GPU alive, embedded sessions running, package Ok
- **blown** = #90891 primary — in-place mutate of the sealed MSIX → catalog missing → Event 3010 → Event 3033 → GPU dead → Electron tear-down → all embedded sessions killed; package NeedsRemediation
- **in-place** = updater wrote files inside `C:\Program Files\WindowsApps\Claude_…`
- **cat-missing** = `AppxMetadata\CodeIntegrity.cat` absent (`Test-Path` = False)
- **gpu-dead** = `GPU process gone … exitCode: 101457950`
- **sessions-killed** = Electron tore down the whole app; every embedded session died
- **needs-remediation** = package status Modified, NeedsRemediation
- **unpackaged-clear** = standalone unpackaged Claude Code 2.1.251 stays clear
- **swiftshader-blocked** = `claude.exe` blocked loading `app\vk_swiftshader.dll`
- **catalog-void** = per-file CI catalog missing; package integrity cannot validate
- **event-3010** = Code Integrity unable to load `CodeIntegrity.cat` — `0xC000003A` STATUS_OBJECT_PATH_NOT_FOUND
- **event-3033** = load of `app\vk_swiftshader.dll` failed Microsoft signing-level requirements

Verdicts: sealed, blown, in-place, cat-missing, gpu-dead, sessions-killed, needs-remediation, unpackaged-clear, swiftshader-blocked, catalog-void, event-3010, event-3033.

## Why not a clone

This is specifically: **IN-PLACE MUTATE OF A SEALED MSIX**. The updater writes inside the immutable package directory. The CI catalog goes missing. Windows Code Integrity Event 3010 then Event 3033 blocks SwiftShader. The GPU process dies and Electron kills every embedded session. The lead bulla is the package seal; a broken seal is not a hold.

NOT **Wraith** ([#90373](https://github.com/anthropics/claude-code/issues/90373)) — updater *unlinks* the on-disk image mid-session; grants stay ON. Bulla is *in-place mutate* of a sealed MSIX → CI catalog missing → GPU crash.
NOT **Carcase** ([#90867](https://github.com/anthropics/claude-code/issues/90867)) — stealth relaunch restores window/nav after onQuitCleanup guts sessions.
NOT **Damper / #90874 / #90877** — Remote Control live-card / computer_unreachable family.
NOT **Livery** ([#90748](https://github.com/anthropics/claude-code/issues/90748)) — TCC path churn on a versioned bundle path.
NOT **Trompe** ([#90881](https://github.com/anthropics/claude-code/issues/90881)) — painted false /clear chip.
NOT **Davy** ([#90886](https://github.com/anthropics/claude-code/issues/90886)) — false boot-canary.
NOT **Assay / Sigil** — different metaphors already used; this is a lead **bulla** seal desk.

Different UI: papal chancery / lead-bulla assay desk. Dark olive wax cloth, lead-grey seal puck, vermillion cord, cool parchment, brass stylus. Cormorant Garamond + IBM Plex Sans + IBM Plex Mono. NOT Trompe plaster/gilt/Playfair. NOT Davy pit-black/brass gauze/Cinzel. NOT Moviola projector-black/safelight.

Different idle: **sealed**.

## Live catalog path

`/bulla/` is this static assay desk. Demo works with no secrets and no npm. Mark: `15:50 / hermes catalog #89 / #90891`.

1. Idle demo loads **sealed** — intact MSIX seal, `CodeIntegrity.cat` present, GPU alive, embedded sessions running, sconce/seal = sealed.
2. Seed **blown** → updater writes in place → cat missing → Event 3010 → Event 3033 blocks `vk_swiftshader.dll` → GPU dead → Electron tear-down → all embedded sessions killed; package NeedsRemediation. Standalone unpackaged counter stays clear.
3. Chip-switch seeds for every verdict.
4. Paste or drop a probe ticket JSON and score the seal.
5. Event 3010/3033 timeline paired with `main.log` GPU crash lines for the five 2026-08-30 local crashes.

## How to score

Open `projects/bulla/index.html` in a browser, or serve the repo root and visit `/bulla/` (Vercel rewrite → `/projects/bulla`). No build step. Optional hook:

```bash
node projects/bulla/hook/bulla.mjs projects/bulla/data/90891.json
node projects/bulla/hook/bulla.mjs projects/bulla/data/sealed.json
node --test projects/bulla/hook/bulla.test.mjs
```

Blown seed → blown/alarm. Sealed seed → sealed/hold.

`projects/bulla/hook/bulla.mjs` scores a probe ticket `{ inPlaceWrite, catPresent, event3010, event3033, gpuCrashed, sessionsKilled, packageStatus, unpackagedOk, dllBlocked }` and returns `{ verdict, chips[], reasons[], sealed, blown, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90891.json`, `data/blown.json`, `data/sealed.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#90891](https://github.com/anthropics/claude-code/issues/90891). Unauthenticated. See `.env.example`.
2. Paste/drop a probe ticket JSON and score the seal.
3. Event 3010/3033 + `main.log` crash-timeline register (five local times on 2026-08-30).
4. Standalone unpackaged counter (2.1.251) that stays clear while the packaged host dies.
5. Package-status docket: Ok vs Modified, NeedsRemediation.

## Sources

- [anthropics/claude-code#90891](https://github.com/anthropics/claude-code/issues/90891) OPEN
- Same-class (cite, not primary): [#89112](https://github.com/anthropics/claude-code/issues/89112) catalog never shipped / Event 3010/3033 / NeedsRemediation after WebGPU `requestAdapter` (packaging defect, not in-place mutate); [#81341](https://github.com/anthropics/claude-code/issues/81341) CIG + vendor-signed `vk_swiftshader.dll` kills GPU on browser preview, unpackaged `--exe` clear; [#89016](https://github.com/anthropics/claude-code/issues/89016) GPU exit 101457950 / NeedsRemediation on preview surfaces. Updater-family (different symptom): [#81875](https://github.com/anthropics/claude-code/issues/81875) hung auto-update uninstalls Desktop; [#89687](https://github.com/anthropics/claude-code/issues/89687) updater force-registers at quit. Cross-ecosystem: [electron/electron#51761](https://github.com/electron/electron/issues/51761) Electron GPU goodbye on Windows from zombie SID DACL — different mechanism, not catalog-missing.
- Rejected this hour: #90889 Limpet-class process leak; #90890 Shunt-class SendMessage drop; #90874/#90877 Damper/Carcase RC; #90881 Trompe; #90886 Davy; #90893 thin model scaffolding; #90895 thin auth logout; #90882 thin feedback TUI. #90892 browser-pane external https crash is a strong alt — different failure mode, save for later. #90896/#90900 Fable 5 safeguard false positives — model/cost class.
