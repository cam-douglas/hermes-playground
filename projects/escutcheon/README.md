# Escutcheon

A locksmith's **keyhole plate** — brushed brass escutcheon, gunmetal screws, steel key blanks, dark workshop lamp, mount-table readout, D-Bus socket ghost — for a real Claude Code defect: on Linux the sandbox mounts a fresh empty tmpfs over `/run/user`, so `$XDG_RUNTIME_DIR` and the D-Bus session bus socket vanish inside sandboxed Bash. `DBUS_SESSION_BUS_ADDRESS` stays exported and still points at the now-missing path. Tools that store credentials in the system keyring (libsecret/gnome-keyring over D-Bus) fail; `gh` reports **"The token in default is invalid."** and blames the credential instead of the sandbox. The only workaround that works is `gh auth login --insecure-storage` (plaintext `hosts.yml`).

Primary: [anthropics/claude-code#90717](https://github.com/anthropics/claude-code/issues/90717) (OPEN, filed 2026-08-30). Title: Linux sandbox replaces `/run/user` with an empty tmpfs, so sandboxed commands cannot reach the D-Bus session bus or the system keyring. Labels: bug / has-repro / platform:linux / area:sandbox. Observed on 2.1.236 (Ubuntu 22.04.5, bubblewrap 0.6.1, gh 2.96.0).

An empty plate is not a keyhole. Score the door or admit **plated**.

Idle word: **plated** (honest control: real `$XDG_RUNTIME_DIR` bound, D-Bus socket present, keyring reachable, `gh` valid).
NEVER use plated for a failure. NEVER use the product name escutcheon / keyhole / lacuna / collated / ambo / unheard / slype / passed / tally / gasket / clew / fob / hung / chatelaine / girt / empty / silent / mute / idle as the idle/state word.

Verdicts: **plated**, **blamed**, **masked**, **lying-address**, **sockets-inert**, **excluded-inert**, **still-masks**, **plaintext-forced**, **deny-breaks**.

The #90717 blamed board (empty tmpfs + lying D-Bus address + `gh` token-blame) is **blamed**, never **plated**. Unique nearby flags win their own seeds. Admit does not lie: a blamed probe stays blamed.

## Why not a clone

NOT **Slype** — sandbox that allow-lists System32 `powershell.exe` and 126-denies Program Files `pwsh.exe` ([#90676](https://github.com/anthropics/claude-code/issues/90676)).
NOT **Gasket** — project-scoped strictAllowlist silent discard ([#90355](https://github.com/anthropics/claude-code/issues/90355)).
NOT **Clew** — sandbox deny-list E2BIG at MAX_ARG_STRLEN ([#90569](https://github.com/anthropics/claude-code/issues/90569)).
NOT **Fob** — macOS Keychain credential litter ([#90527](https://github.com/anthropics/claude-code/issues/90527)).
NOT **Chatelaine** — mcpOAuth nested inside the Anthropic Keychain item ([#90647](https://github.com/anthropics/claude-code/issues/90647)).
NOT **Lacuna** — silent mid-session task-store scrape.
NOT **Ambo** — unheard PermissionRequest systemMessage.
NOT **Tally** — exit birth-count false-loss.

Different problem: baseline empty-tmpfs mount mask over `/run/user`. The env address lies. Tools blame the credential. Plaintext is the only escape.
Different UI: locksmith bench, brushed brass plate, gunmetal, key blanks, dark workshop, keyhole diagram, mount-table readout, D-Bus socket ghost. Bebas Neue + Figtree + IBM Plex Mono. Not oak/vellum collation, not a night pulpit, not a cathedral slype, not dock chalk, not a hotel key-rack, not a waist-chain.
Different idle word: **plated**.

## Live catalog path

`/escutcheon/` is this static locksmith desk. Demo works with no secrets and no npm. Mark: `20:50 Sydney · escutcheon`.

1. Seeded `#90717` **blamed** is already on the bench: empty tmpfs + lying address + token-blame → **blamed**. Never plated.
2. File **masked** — empty tmpfs over `/run/user`.
3. File **lying-address** — `DBUS_SESSION_BUS_ADDRESS` still points at the missing bus.
4. File **sockets-inert** — `allowUnixSockets` names the bus; Linux never implements it (#44180).
5. File **excluded-inert** — `excludedCommands: ["gh *"]` still sandboxes `gh` (#89931).
6. File **still-masks** — `dangerouslyDisableSandbox` leaves the empty tmpfs.
7. File **plaintext-forced** — only `gh auth login --insecure-storage` works.
8. File **deny-breaks** — `Read(~/.config/gh/hosts.yml)` in `permissions.deny` breaks `gh` itself.
9. Contrast **not slype** — pwsh 126 is a different layer.
10. **Stamp** the matching class. Wrong stamps bind the key. **Admit plated** unlocks only on the honest plate (real runtime dir bound). **Restore · #90717** shows the blamed board.

## Hook

`projects/escutcheon/hook/` scores a probe transcript `{ mountinfo, dbusAddress, ghStatus, runtimeExists, … }` and returns `{ verdict, reasons[], plated }`. See `hook/README.md`.

```bash
node projects/escutcheon/hook/index.mjs < transcript.txt
node --test projects/escutcheon/hook/escutcheon.test.mjs
```

`plated` is true ONLY when the verdict is plated (idle, or honest control: real `$XDG_RUNTIME_DIR` bound + D-Bus socket present + keyring reachable). Seeded 90717 numbers must produce blamed / `plated=false`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90717](https://github.com/anthropics/claude-code/issues/90717) — OPEN, filed 2026-08-30. Linux sandbox empty tmpfs over `/run/user`. `DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus` still exported. `ls /run/user/1000` → No such file or directory. `gh auth status` → The token in default is invalid. Control outside the sandbox: Logged in (keyring). mountinfo: tmpfs over `/run/user`. Version 2.1.236.

Same-class macOS:

- [anthropics/claude-code#87008](https://github.com/anthropics/claude-code/issues/87008) — sandboxed commands can't reach the macOS keychain; tools blame the credential.

Related levers on this door:

- [anthropics/claude-code#44180](https://github.com/anthropics/claude-code/issues/44180) — `allowUnixSockets` not implemented on Linux.
- [anthropics/claude-code#89931](https://github.com/anthropics/claude-code/issues/89931) — `excludedCommands` inert.

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Slype #90676, Gasket #90355, Clew #90569, Fob #90527, Chatelaine #90647, Lacuna, Ambo, Tally.

Suggested consumer fix from #90717: bind the real `$XDG_RUNTIME_DIR` — or at minimum the D-Bus session bus socket — into the sandbox, or provide a working Linux `allowUnixSockets` / filesystem allow that can re-expose a baseline-masked path. Do not force plaintext credentials.

## Env

| Variable | Meaning |
| --- | --- |
| `ESCUTCHEON_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Unused at page runtime. Absent → honest demo. |
| `ESCUTCHEON_GITHUB_TOKEN` / `GITHUB_TOKEN` | Unused at page runtime. |

Missing secrets stay in honest demo mode. The static page does not need them.
