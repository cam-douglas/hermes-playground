# Snib

Night-latch / indoor thumb-turn for Trusted Devices fail-open on individual (Pro/Max) Claude Code Remote Control accounts. A turned snib is not a hold. Revoke is not a hold. Not now is not a hold. Throw the snib. Name the class or admit **latched**.

A snib is the small indoor thumb-turn on a Yale night latch. Turning it looks like the door is locked from inside. If the snib does not catch the strike, the door is open while looking locked. That is Trusted Devices on individual Remote Control: the control is shown, enrollment exists, and both enforcement points fail open.

Verdicts: **latched**, **dismissed**, **revoked**, **unobserved**, **attached**, **phantom**, **open**, **restored**. Idle word is **latched**. Fail-closed on dismissed / revoked / unobserved. Slack alarm on those three. Linear Trusted-device incident on dismissed / revoked. GitHub ledger row on every scored probe.

NOT Knock (fail-loud relay for stalled permission grants). Snib is device identity at remote attachment.

NOT Hasp (file-path lease between sessions). Snib is enrolled-device vs session-cookie.

NOT Wicket (worktree isolation of writes). Snib is who is steering the host.

NOT Veto (heron_brook system-prompt injection). Snib is auth / device trust.

NOT Reveille (heartbeat / muster). Snib is enrollment / revocation / decline.

NOT Assay / Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom / Parity / Quench / Scrim. Not leftover woodworking sliders.

## Live catalog path

`/snib/` is this static night-latch. A painted dark door, brass Yale lock, thumb-turn snib, strike plate, and a hanging key rack of devices. Demo works with no secrets and no npm.

1. Seeded `#90265` dismissed is already on the latch: Max individual, modal shown, Not now, live attached, tool execution outside cwd, host log silent → **dismissed**.
2. Switch `#90265` revoked — enrolled wiped, live web session still attached, no re-verify → **revoked**.
3. Switch `#90265` unobserved — same incident, host log heartbeats only, zero verify/device/trust → **unobserved**.
4. Switch `#90266` open — Pro/Max, no enforcement toggle, cookie-only attachment → **open**.
5. Switch `#87863` phantom — dead 404 environment, modal shown, auth healthy → **phantom**.
6. Switch attached — never-enrolled device, cookie only, attached → **attached**.
7. Switch restored — decline or revoke actually terminated or read-only'd the session → **restored**.
8. Switch **Clear · latched** — enrolled device, enforcement held, door shut → **latched**. Idle word is **latched** when the probe is empty.
9. **Throw** scores. **Not now** takes the dismiss path. **Revoke** wipes enrolled devices and keeps the live session. **Observe** checks the host log. **Restore** actually drops the attachment.
10. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.

## Hook

`projects/snib/hook/` scores a probe `{ plan, enrolledCount, revokedAll, liveSessionStillAttached, modalShown, modalChoice, hostLogMentionsVerify, toolExecutionAfterDecline, envGone404, enforcementToggleAvailable, cookieOnly, restored }` and returns `{ verdict, reasons[], doorAjar, snibThrown, latchInStrike, restored }`. See `hook/README.md`.

```bash
node projects/snib/hook/index.mjs --listen 9026
node --test projects/snib/hook/snib.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#90265](https://github.com/anthropics/claude-code/issues/90265) — PRIMARY. Two fail-open points on individual Remote Control: (1) revoking every Trusted Device does not force re-verification on an already-active session; (2) "Sign in again to verify your device" / Not now leaves the session attached and steerable. Host `Claude VSCode.log` shows CCRClient heartbeats with no gap and zero verify/device/trust/401/403/elevated_auth. area:security. Has repro.
- [anthropics/claude-code#90266](https://github.com/anthropics/claude-code/issues/90266) — companion FR. Pro/Max can enroll a Trusted Device but cannot REQUIRE it at Remote Control attachment. Only org-wide Team/Enterprise enforcement exists. A valid session cookie is the only gate. Sandboxing is off by default.
- [anthropics/claude-code#87863](https://github.com/anthropics/claude-code/issues/87863) — phantom contrast. The same modal fires for a dead 404 environment while auth is healthy.
- [anthropics/claude-code#55196](https://github.com/anthropics/claude-code/issues/55196) — unenrolled trusted-device failure docs.
- [anthropics/claude-code#82095](https://github.com/anthropics/claude-code/issues/82095) — single FIDO2, replace-only.
- [anthropics/claude-code#81550](https://github.com/anthropics/claude-code/issues/81550) — passkey setup prompt crashes Desktop.
- [anthropics/claude-code#83122](https://github.com/anthropics/claude-code/issues/83122) — Linux enrollment failure.
