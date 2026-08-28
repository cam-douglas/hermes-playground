# Damper

Chimney damper / flue plate for Claude Code Remote Control that auto-enables without user consent. A settings toggle that reads off is not a hold. Score the draft or admit **banked**.

Remote Control opens a remote bridge. Tool results and file contents can cross it. Docs list only explicit activation paths (`/rc`, `--rc`, `claude remote-control`). In the wild, new sessions start with RC already on. `disableClaudeAiConnectors: true` does not stop it. UI "Enable remote control by default" can read off while the session is live-bridged. Only an explicit `remoteControlAtStartup: false` stops some surfaces. VS Code tabs ignore `remoteControl=default`. `~/.claude.json` contains `seenNotifications["remote-control-auto-on"]`, which looks like intentional auto-on.

Idle word: **banked** (fire banked, damper closed, no remote draft).
NEVER use the product name damper as the idle/state word.
NEVER use empty.

Verdicts: **banked**, **drawn**, **vented**, **ajar**, **forced**, **defaulted**, **bridged**, **disclosed**, **sealed**, **lit**. Slack alarm on defaulted / drawn / forced / disclosed. Linear incident on defaulted / disclosed. GitHub damper-ledger issue on every scored probe.

## Why not a clone

NOT Snib (Trusted Devices fail-open: revoke / Not now leaves an already-attached session steerable). Damper is RC *starting* / auto-enabling without opt-in. The flue opens before you throw anything.
NOT Knock (fail-loud permission grant stalls).
NOT Hasp (file-path lease).
NOT Cote / Nixie (`--resume` team-hub identity split).
NOT Larder / Tappet / Aside / Chute / Tain / Husk / Veto / Assay / Wicket / Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom / Parity / Quench / Scrim / Reveille.
NOT leftover woodworking / millimeter-slider clones.

Different problem: Remote Control **auto-enable** without consent. A settings toggle that reads off is not a hold. The flue opens before you throw anything.
Different UI: a chimney / flue / brass damper-plate / draft-gauge desk. Soot wash, ember accents, cast-iron plate, flue thermometer. NOT Snib's dark door / Yale lock. NOT Larder's zinc stillroom. NOT Tappet's oil-black bay.
Different idle word: **banked**.

## Live catalog path

`/damper/` is this static chimney desk. Soot, ember, cast iron, brass plate, draft gauge. Demo works with no secrets and no npm.

1. Seeded `#90341` **defaulted** is already on the plate: new session, never ran `/rc`, `disableClaudeAiConnectors` true, RC active, live remote URL, tool results crossing → **defaulted**.
2. Switch **drawn** — RC on, never `/rc`, draft pulling → **drawn**.
3. Switch **ajar** `#89568` — UI toggle off, session still connected → **ajar**.
4. Switch **forced** `#89146` — VS Code new tab auto-on, `remoteControl=default` ignored → **forced**.
5. Switch **lit** `#77517` — RC auto-triggered with no explicit path → **lit**.
6. Switch **bridged** — live URL plus file disclosure → **bridged**.
7. Switch **disclosed** — tool results crossing without consent → **disclosed**.
8. Switch **sealed** — explicit `remoteControlAtStartup:false` holds → **sealed**.
9. Switch **vented** — you threw `/rc`; plate open on purpose → **vented**.
10. Switch **Clear · banked** — RC off, no bridge → **banked**. Idle word is **banked** when the probe is idle.
11. **Throw** scores. **Bank** closes the plate. **Draw** opens the draft. **Observe** checks the notification stamp and settings. **Sever** disconnects RC.

## Hook

`projects/damper/hook/` scores a probe `{ neverInvokedRc, uiDefaultToggleOff, remoteControlAtStartupAbsent, remoteControlAtStartupFalse, disableClaudeAiConnectorsTrue, rcActive, liveRemoteUrl, toolResultsCrossing, fileContentsExposed, seenAutoOnNotification, vscodeNewTab, surface }` and returns `{ verdict, reasons[], flueOpen, damperClosed, consented, bridged }`. See `hook/README.md`.

```bash
node projects/damper/hook/index.mjs --listen 9341
node --test projects/damper/hook/damper.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90341](https://github.com/anthropics/claude-code/issues/90341) — Remote Control auto-enables on new sessions without `/rc` / `--rc`; `disableClaudeAiConnectors` true ignored; `seenNotifications` `remote-control-auto-on`; tool results cross the bridge including file contents; docs describe no automatic behaviour. Filed 2026-08-28. darwin, 2.1.250.

Corroboration:

- [anthropics/claude-code#89568](https://github.com/anthropics/claude-code/issues/89568) — Desktop: "Enable remote control by default" reads off; session still connected with live `claude.ai/code` URL; only explicit `remoteControlAtStartup:false` stops it.
- [anthropics/claude-code#89146](https://github.com/anthropics/claude-code/issues/89146) — VS Code extension: every new tab auto-enables RC, ignoring `remoteControl=default`.
- [anthropics/claude-code#77517](https://github.com/anthropics/claude-code/issues/77517) — RC sessions auto-triggering without an explicit trigger.

Related (not primary):

- [anthropics/claude-code#87118](https://github.com/anthropics/claude-code/issues/87118) — FR for inactivity-based auto-disable. Users want the opposite of silent auto-on.
