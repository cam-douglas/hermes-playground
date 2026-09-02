# Crimp

A **bench / crimping-pliers** atelier — brass jaw pliers, `settings.json` copper-foil strip (parse OK vs torn tail), concurrent-session pliers count, permission/hooks drop banner, truncate vs stale-tail shape lamps; bench charcoal / copper crimp / oxidised teal / shear-red / foil silver — Spectral + Public Sans + JetBrains Mono — for a real Claude Code defect: **SETTINGS.JSON UNLOCKED NON-ATOMIC RMW — CONCURRENT SESSIONS TEAR FILE + LOST UPDATE; SILENT PERMISSION/HOOK DROP; AREA:CORE.**

Primary:

- [anthropics/claude-code#91520](https://github.com/anthropics/claude-code/issues/91520) (OPEN, bug, has repro, area:core, platform:vscode, platform:wsl, filed 2026-09-02T14:21:59Z, updated 2026-09-02T14:23:14Z). Title: settings.json is written with an unlocked, non-atomic read-modify-write: concurrent sessions tear it ("Settings file failed to parse") and silently drop each other's keys (2.1.258, with repro). Reporter Lukasmolvaer. Measured on Claude Code CLI 2.1.258 / VS Code extension 2.1.246→2.1.258; Ubuntu WSL2; up to ten concurrent Claude Code processes.

a crimp that tears under concurrent pliers is not a sealed join — it is a sheared foil. Score the swage or admit the settings already tore.

Idle word: **swaged**. Seeded state: **torn** / #91520 — unlocked non-atomic RMW; reader sees 0-byte mid-truncate OR valid JSON + stale trailing bytes; later writer silently discards other session's keys. Never idle as homed / armed / unheard / unbolted / snagged / reeved / fouled / creased / bled / latched / vanished / sealed / rebound / dark / spurious / fenced / swept / tolled / mute / discarded / arrested / indexed / chocked / clasped / sprung / hinged / pealed / crossed.

A **crimp** should swage `~/.claude/settings.json` into an atomic hold: write a sibling, `rename(2)` over the target, hold a lock across the read-modify-write. `writeUserSettingsAndPush` instead does read → mutate → `writeFile` with no lock and no tmp+rename. Concurrent sessions tear the foil.

- **torn** = #91520: unlocked non-atomic RMW; 0-byte mid-truncate OR valid JSON + stale trailing bytes; later writer discards other session's keys
- **truncate** = 0-byte window between `open(O_TRUNC)` and write; banked `settings.json.corrupt.20260830T211332` is 0 B
- **stale-tail** = complete valid JSON followed by the tail of a longer earlier serialisation; 293 × valid JSON + 313 stale trailing bytes under load; banked 131 B / 10-byte stale tail (` false\n}`)
- **lost-update** = two sessions each read, mutate and write; the later write wins and silently discards the other session's keys
- **permissions-drop** = `Settings file is not valid JSON` → fallback to defaults → silently drops permissions behind a dismissable banner
- **hooks-drop** = same fallback silently drops hooks
- **has-clear-repro** = Lukasmolvaer filed #91520; has repro; area:core; platform:vscode; platform:wsl; CLI 2.1.258; VS Code 2.1.246→2.1.258; Ubuntu WSL2; 1.3% torn (2791/213861); write-to-sibling+rename → 0 torn of 162217; nine wild occurrences
- **hold** = writeUserSettingsAndPush uses tmp+rename + lock; concurrent sessions cannot tear the file or clobber keys
- **swaged** = HOLD: the crimp is an atomic join

Verdicts: swaged, torn, truncate, stale-tail, lost-update, permissions-drop, hooks-drop, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the settings join is swaged or torn.

Hypothesis only (NON-BINDING): concurrent `writeFile` without flock/tmp+rename is the root; discard if issue evidence disagrees. Encoded from the issue's measured claim (1.3% torn under load; 0 torn after sibling+rename). Do not claim Claude Code source you have not seen beyond the issue's `writeUserSettingsAndPush` excerpt.

## Why not a clone

This is specifically: **SETTINGS.JSON UNLOCKED NON-ATOMIC RMW — CONCURRENT SESSIONS TEAR FILE + LOST UPDATE; SILENT PERMISSION/HOOK DROP; AREA:CORE.**

NOT Jackfield ([#91511](https://github.com/anthropics/claude-code/issues/91511)) — desktop cross-machine session mix-up; Windows input executes on unrelated macOS session.
NOT Tocsin ([#91503](https://github.com/anthropics/claude-code/issues/91503)) — idle-wake / background Bash; subagent completion queued with no idle-wake consumer.
NOT Bolter ([#91422](https://github.com/anthropics/claude-code/issues/91422)) — dontAsk option-token matcher.
NOT Deadeye ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — hook path × cwd deadlock.
NOT Reglet ([#91443](https://github.com/anthropics/claude-code/issues/91443)) — CRLF before `.gitattributes`.
NOT **Reliquary** / **Annunciator** / **Caisson** / **Spindle** / **Knell** / **Tumbler** / **Escapement** / **Geneva** / **Scotch** / **Pintle** paradigms.
NOT leftover jackfield channel-strip / tocsin watchhouse / bolter flour-mill / deadeye standing-rigging / reglet letterpress / vault-latch / annunciator lamps.

Cousins are cite-only on a cousin strip; primary stays #91520.

- [#79403](https://github.com/anthropics/claude-code/issues/79403) — VS Code model toggle corrupts settings.json (same symptom, diagnosed there as a partial/append write) — cite-only.
- [#82167](https://github.com/anthropics/claude-code/issues/82167) / [#76749](https://github.com/anthropics/claude-code/issues/76749) — lost update / stale in-memory config re-persisted — cite-only.
- [#2810](https://github.com/anthropics/claude-code/issues/2810) — cite-only.
- [#78764](https://github.com/anthropics/claude-code/issues/78764) / #79403 — impact cousins for permission posture — cite-only.

Backups (do not ship unless primary blocked): **Codicil** / #91513. **Caret** / #91526. **Accrete** / #91512.

Product name stays **Crimp**. Do not rename to Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle.

Different UI: crimping-bench / pliers / copper-foil settings strip + brass jaw pliers + parse-OK vs torn-tail foil + concurrent-session pliers count + permission/hooks drop banner + truncate vs stale-tail shape lamps / bench charcoal / copper / oxidised teal / shear-red / foil silver. Spectral + Public Sans + JetBrains Mono. NOT Brygada/Atkinson/DM Mono (Jackfield). NOT Fraunces/Source Sans 3/IBM Plex (Tocsin). NOT Piazzolla/Nunito/Roboto Mono (Bolter). NOT Literata/Red Hat (Deadeye). NOT EB Garamond/Hanken/Noto Sans Mono (Reglet). NOT Crimson Pro/Plus Jakarta/Ubuntu Mono (Reliquary). Stay OFF jackfield channel-strip / tocsin watchhouse / bolter flour-mill / deadeye standing-rigging / reglet letterpress / vault-latch / annunciator lamps.

Different verbs: Crimp the join, pin idle swaged, pin seeded torn, admit the settings already tore, load fixtures, reset to swaged. Score the swage is this desk's phrase.

Different idle: **swaged**.

## Live catalog path

`/crimp/` is this static crimping-bench atelier desk. Path `https://hermes-playground-green.vercel.app/crimp/` and subdomain `https://crimp.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `02:50 / hermes catalog #125 / #91520`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **swaged** — writeUserSettingsAndPush uses tmp+rename + lock; concurrent sessions cannot tear settings.json or silently drop keys.
2. Seed **torn** → #91520: unlocked non-atomic RMW; 0-byte mid-truncate OR valid JSON + stale trailing bytes; later writer discards other session's keys; 1.3% torn; nine wild occurrences; permissions and hooks drop behind a dismissable banner.
3. Atelier UI: brass crimp pliers / settings.json foil strip / concurrent-session pliers count / permission/hooks drop banner / truncate vs stale-tail shape lamps. Swaged = atomic hold. Torn = sheared foil.
4. Cousin cite strip labeled cousin-not-primary: [#79403](https://github.com/anthropics/claude-code/issues/79403) / [#82167](https://github.com/anthropics/claude-code/issues/82167) / [#76749](https://github.com/anthropics/claude-code/issues/76749) / [#2810](https://github.com/anthropics/claude-code/issues/2810) / [#78764](https://github.com/anthropics/claude-code/issues/78764). Cite only. Primary stays #91520.
5. **Crimp the join** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/crimp/index.html` in a browser, or serve the repo root and visit `/crimp/` (Vercel rewrite → `/projects/crimp`). No build step. Optional hook:

```bash
node projects/crimp/hook/crimp.mjs projects/crimp/data/91520.json
node --test projects/crimp/hook/crimp.test.mjs
```

Empty stdin scores the idle **swaged** ticket. Paste a probe on the page or drop a fixture from `data/`.
