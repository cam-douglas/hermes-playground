# Livery

A tailor's **household livery wardrobe** — dark mahogany press, gold-braid house coats, brass CURRENT peg, version tickets, house crest, a calling-card TCC dialog — for a real Claude Code defect: the macOS Claude desktop app runs bundled Claude Code from a **version-numbered executable path**:

```
~/Library/Application Support/Claude/claude-code/<version>/claude.app/Contents/MacOS/claude
```

macOS TCC keys privacy grants to the executable path. Every desktop update creates a brand-new path with zero grants → a burst of permission dialogs (often first thing after an overnight update). The dialog shows a **bare version number** (`"2.1.NNN" wants to access files managed by "Dropbox"`) rather than an app name — easy to mistake for malware. Signing identity is already stable (`Identifier=com.anthropic.claude-code`, Team `Q6L2SF6YDW`); only path churn is the bug. FDA on `/Applications/Claude.app` does **not** cover the separately-pathed bundled child. CLI users can symlink `~/.local/bin/claude` to a fixed path; the desktop app owns and recreates `claude-code/<version>/`, so that trick is unavailable.

Primary: [anthropics/claude-code#90748](https://github.com/anthropics/claude-code/issues/90748) (OPEN, filed 2026-08-30). Title: macOS: desktop app's bundled Claude Code uses a version-numbered executable path, causing a burst of TCC permission prompts after every update. Labels: bug, platform:macos, area:packaging, area:desktop. Observed on Claude desktop, bundled Claude Code 2.1.247, macOS 26.x Apple Silicon. Cloud mounts: Dropbox, iCloud Drive, Google Drive, CloudMounter.

A new coat of the same house is not a stranger. Score the wardrobe or admit **liveried**.

Idle word: **liveried** (honest control: launch from a stable `.../claude-code/current/...` path; TCC grants persist; no burst).
NEVER use liveried for a failure. NEVER use the product name livery / penned / underwrit / plated / collated / unheard / passed / squared / bound / girt / sheltered / alongside / seated / credited / level / verbatim / fronted / locked / yanked / caught / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / fit / spoilt / laid / unlinked / tight / banked / roosted / stocked / heard / clear / paired / empty / mute / idle / silent / flat as the idle/state word.

Verdicts: **liveried**, **prompted**, **path-churn**, **bare-version**, **tcc-orphan**, **fda-inert**, **cloud-mount**, **overnight-burst**, **signed-stable**, **stranger-path**, **version-folder**, **current-shim**.

- **liveried** = idle / honest control (stable `current` path; house identity already signed; grants persist; no burst)
- **prompted** = #90748 primary failure: versioned desktop path → zero grants on the new coat → burst of TCC dialogs
- **path-churn** = every desktop update mints a new executable path under `claude-code/<version>/`
- **bare-version** = dialog shows `"2.1.NNN"` rather than an app name
- **tcc-orphan** = previous version's grants still sit on the old path; the new path has zero rows
- **fda-inert** = Full Disk Access on `/Applications/Claude.app` does not cover the separately-pathed child
- **cloud-mount** = one `kTCCServiceFileProviderDomain` prompt per cloud mount
- **overnight-burst** = stack of modal dialogs, typically first thing after an overnight update
- **signed-stable** = contrast: signing identity already stable — only path churn is the bug
- **stranger-path** = a bare version number reads as a mystery process
- **version-folder** = desktop owns and recreates `claude-code/<version>/`; CLI symlink trick is unavailable
- **current-shim** = contrast seed: launch from `.../claude-code/current/...` — the fix #90748 needs

The seeded #90748 board (versioned desktop path + bare-version dialog + zero TCC rows on the new path) is **prompted**, never **liveried**. Unique nearby flags win their own seeds. Admit does not lie: a prompted probe stays prompted.

## Why not a clone

NOT **Pinfold** — Defender FileFix CmdLine EPERM ([#90706](https://github.com/anthropics/claude-code/issues/90706)). Different: AV cmdline signature vs macOS TCC path identity.
NOT **Palimpsest** — PreToolUse `updatedInput` scrape ([#90725](https://github.com/anthropics/claude-code/issues/90725)).
NOT **Escutcheon** — Linux `/run/user` tmpfs / keyring ([#90717](https://github.com/anthropics/claude-code/issues/90717)).
NOT **Chatelaine** — mcpOAuth nested in Keychain ([#90647](https://github.com/anthropics/claude-code/issues/90647)).
NOT **Fob** — keychain litter.
NOT **Visa** — OAuth destination.
NOT **Sigil** — hollow thinking seal.
NOT **Hasp** — file lease.
NOT **Knock** — permission grant stall.
NOT **Slype** — sandbox pwsh 126 ([#90676](https://github.com/anthropics/claude-code/issues/90676)).
NOT **Pleat** — Desktop mid-turn fold collapse (tailor's pressing board). Different: pressing board vs household livery wardrobe; fold-collapse vs TCC path churn.

Different problem: macOS packaging / TCC path identity for the desktop-bundled binary, not sandbox, AV, hooks, or OAuth nesting.
Different UI: household livery wardrobe — dark mahogany press, gold-braid house coats, brass CURRENT peg, version tickets, house crest, calling-card TCC dialog. Playfair Display + Source Sans 3 + IBM Plex Mono. Not a village pound, locksmith plate, scriptorium, collation desk, or pressing board.
Different idle word: **liveried**.

## Live catalog path

`/livery/` is this static wardrobe. Demo works with no secrets and no npm. Mark: `22:50 Sydney · livery`.

1. Seeded `#90748` **prompted** is already on the wardrobe: versioned desktop path + bare dialog + zero TCC rows → **prompted**. Never liveried.
2. File **path-churn** — every desktop update mints a new executable path under `claude-code/<version>/`.
3. File **bare-version** — dialog shows `"2.1.NNN"` rather than an app name.
4. File **tcc-orphan** — previous version's grants still sit on the old path; the new path has zero rows.
5. File **fda-inert** — FDA on `/Applications/Claude.app` does not cover the child.
6. File **cloud-mount** — one FileProviderDomain prompt per cloud mount.
7. File **overnight-burst** — first thing after an overnight update.
8. Contrast **signed-stable** — signing identity already stable. Only path churn is the bug.
9. File **stranger-path** — a bare version number reads as a mystery process.
10. File **version-folder** — desktop owns and recreates `claude-code/<version>/`.
11. Contrast **current-shim** — launch from `.../current/...`. The fix #90748 needs.
12. **Stamp** the matching class. Wrong stamps bind the press. **Admit liveried** unlocks only on the honest wardrobe (stable current path, grants persist). **Restore · #90748** shows the prompted board.

## Hook

`projects/livery/hook/` scores a probe transcript `{ executablePath, dialogText, tccObservation, parentFda, grantsOnNewPath, grantsOnOldPath, overnight, cloudMounts }` and returns `{ verdict, reasons[], liveried, alarm }`. See `hook/README.md`.

```bash
node projects/livery/hook/index.mjs < transcript.txt
node --test projects/livery/hook/livery.test.mjs
```

`liveried` is true ONLY when the verdict is liveried (idle, or honest control: launch from a stable `.../claude-code/current/...` path; TCC grants persist; no burst). Seeded 90748 numbers must produce prompted / `liveried=false`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90748](https://github.com/anthropics/claude-code/issues/90748) — OPEN, filed 2026-08-30. Desktop Application Support versioned path; FDA inert; cloud-mount burst; bare version string. Labels: bug, platform:macos, area:packaging, area:desktop. Claude desktop, bundled Claude Code 2.1.247, macOS 26.x Apple Silicon.

Same-class / earlier CLI path-churn (cite as related, do not treat as this product's primary):

- [anthropics/claude-code#49282](https://github.com/anthropics/claude-code/issues/49282) — CLI `~/.local/share/claude/versions/<ver>` TCC re-register.
- [anthropics/claude-code#74234](https://github.com/anthropics/claude-code/issues/74234) — FDA prompts every auto-update (CLI `versions/`).
- [anthropics/claude-code#62240](https://github.com/anthropics/claude-code/issues/62240) — MediaLibrary TCC every update, bare version name.

Cross-ecosystem inspiration only:

- [mo22/tcc-venv](https://github.com/mo22/tcc-venv) — stable signed launcher for venv Python TCC identity.

Suggested consumer fix (from the issue, not invented): launch the bundled Claude Code from a stable path that does not contain the version number, for example `~/Library/Application Support/Claude/claude-code/current/claude.app/...`, with the versioned directories kept behind it as an implementation detail. Secondary: present a recognizable application name on the prompt instead of a bare version string.

## Env

| Variable | Meaning |
| --- | --- |
| `LIVERY_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Unused at page runtime. Absent → honest demo. |
| `LIVERY_GITHUB_TOKEN` / `GITHUB_TOKEN` | Unused at page runtime. |

Missing secrets stay in honest demo mode. The static page does not need them.
