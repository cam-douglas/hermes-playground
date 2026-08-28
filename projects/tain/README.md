# Tain

Night window / one-way glass for Claude-in-Chrome pairing identity split. A silvered tain is not a hold. Compare the extension claim to the session list. Name the class or admit **paired**.

The tain is the silver backing of a one-way mirror. Claude-in-Chrome pairing is a two-sided channel: what the extension claims, and what the agent session lists. Those two sides routinely disagree. The extension live-renders a session that gets `[]` from `list_connected_browsers`. Two native-host manifests claim the same extension id. Cowork binds actions to a browser on another machine. `isLocal: true` for a remote box. Assigned names collapse to "Browser 1/2". A silvered tain is not a hold.

Idle word: **paired** (both sides name the same live device; glass is clear both ways).
When the glass is one-way: **silvered**.

Verdicts: **paired**, **silvered**, **ghost**, **strayed**, **claimed**, **nameless**, **stale**, **split**, **dark**. Slack alarm on silvered / strayed. Linear stray-browser ticket on strayed. GitHub pairing-ledger issue on every scored probe.

## Why not a clone

Reed is MCP registry contacts (`alive` / `handshake` / `listed` / `callable`). Tain is the Chrome pairing channel itself: native host + `list_connected_browsers` + `isLocal` + profile name.

NOT Husk (hollow headless success). NOT Snib (Trusted Devices fail-open). NOT Veto (heron_brook injection). NOT Assay (tool-arg corruption). NOT Wicket (worktree isolation). NOT Sigil (thinking signatures). NOT Stencil (plan bleed). NOT Suture (stream tear). NOT Blot (image poison). NOT Coda (silent text loss). NOT Fathom (standing-rules after compact). NOT Hasp (file lease). NOT Parity (claim-vs-reality of shipped work). NOT Reveille (living muster). NOT Quench (token-burn fuse). NOT Scrim (I/O DLP). NOT Knock (permission-gate stalls).

Different failure, different UI (night window / mercury glass, not a barn floor, brass latch, furnace, or surgical tray), different backend, different idle word (**paired**).

## Live catalog path

`/tain/` is this static night window. Mercury, tain-silver, night glass, cool pewter. Demo works with no secrets and no npm.

1. Seeded `#90257` silvered is already on the glass: extension live-renders this session; `list_connected_browsers` is `[]` → **silvered**.
2. Switch paired — both sides name Studio on this machine → **paired**.
3. Switch `#83518` ghost — installed, enabled, signed in; MCP tools say not connected → **ghost**.
4. Switch `#86937` strayed — Cowork binds Chrome actions to another physical machine → **strayed**.
5. Switch `#74667` claimed — `isLocal:true` for a browser on laptop-berlin → **claimed**.
6. Switch `#74902` nameless — listed names Browser 1/2; assigned name lost (`#90153`) → **nameless**.
7. Switch `#78096` stale — `connectedAt` frozen; rename does not appear (`#89302`) → **stale**.
8. Switch `#90257` split — Claude.app and Claude Code both claim the same extension id → **split**.
9. Switch dark — neither side connected → **dark**.
10. **Face** scores. **Lift** names whether the tain is up. **Admit paired** does not lie. **Clear · paired** empties the window to the idle word.

## Hook

`projects/tain/hook/` scores a pairing probe `{ extensionInstalled, liveRendersSession, browsers, mcpConnected, nativeHosts, thisMachine, boundMachine, assignedName, … }` and returns `{ verdict, reasons[], tainSilvered, tainLifted }`. See `hook/README.md`.

```bash
node projects/tain/hook/index.mjs --listen 9025
node --test projects/tain/hook/tain.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90257](https://github.com/anthropics/claude-code/issues/90257) — one-way channel: extension live-renders the same session that gets `[]` from `list_connected_browsers`; two native-host manifests (Claude.app + Claude Code) claim the same extension id
- [anthropics/claude-code#83518](https://github.com/anthropics/claude-code/issues/83518) — extension connected & signed in; MCP tools report not connected; list returns `[]` after mid-session re-login
- [anthropics/claude-code#78096](https://github.com/anthropics/claude-code/issues/78096) — `list_connected_browsers` stale/cached; `isLocal` misreports host; name↔deviceId cannot be joined
- [anthropics/claude-code#86937](https://github.com/anthropics/claude-code/issues/86937) — Cowork binds Chrome actions to a browser on another machine
- [anthropics/claude-code#74667](https://github.com/anthropics/claude-code/issues/74667) — `isLocal:true` for a browser on a different physical machine

Corroboration:

- [anthropics/claude-code#89551](https://github.com/anthropics/claude-code/issues/89551) — Cowork cloud: extension never registers
- [anthropics/claude-code#74902](https://github.com/anthropics/claude-code/issues/74902) — cannot distinguish two Chrome profiles; generic Browser 1/2; wrong-profile risk
- [anthropics/claude-code#90153](https://github.com/anthropics/claude-code/issues/90153) — assigned names never surface; picker unusable
- [anthropics/claude-code#89302](https://github.com/anthropics/claude-code/issues/89302) — `switch_browser` name does not persist in `list_connected_browsers`
- [anthropics/claude-code#82412](https://github.com/anthropics/claude-code/issues/82412) — empty list despite valid native-host install
