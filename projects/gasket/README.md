# Gasket

Steam-fitter's flange / packing-ring desk for Claude Code `sandbox.network.strictAllowlist` that is **silently discarded from project settings**. A written project key is not a seal. Score the joint or admit **tight**.

The operator puts `sandbox.enabled: true` and `sandbox.network.strictAllowlist: true` in `.claude/settings.json` or `.claude/settings.local.json`. The key is accepted. Schema validation flags nothing. Startup, `--debug`, `/status`, `/sandbox`, and `claude doctor` stay silent. The restriction is only honored from user, managed/policy, or CLI `--settings` scope — project files are dropped at resolution. Every other signal says the config took. The network seal is open.

This is a **fail-open security boundary**, not a consent/auto-enable bug.

Idle word: **tight** (joint made, packing compressed, no leak).
NEVER use the product name gasket as the idle/state word.
NEVER use empty.
NEVER reuse Damper's banked, Tappet's seated, Snib's latched, Larder's stocked, Cote's roosted.

Verdicts: **tight**, **dropped**, **blown**, **nested**, **skipped**, **open**, **dry**, **warned**, **sheared**, **made**. Slack alarm on dropped / blown / nested / open / sheared. Linear incident on dropped / blown / open. GitHub gasket-ledger issue on every scored probe.

## Why not a clone

NOT Damper (Remote Control auto-enable without consent; a settings *toggle that reads off* is not a hold; chimney/flue). Gasket is a *written project security key discarded at resolution* while every other signal stays green. Fail-open of a network seal, not unauthorized opening of a remote bridge.
NOT Tappet (silent hook injection / valve train / engine bay). Gasket is not hooks, not UserPromptSubmit, not an engine bay. Steam-fitter / boiler-flange / packing-ring, never tappets, cams, valves, oil-black bays.
NOT Snib (Trusted Devices fail-open on an already-attached session).
NOT Knock (permission-grant stalls).
NOT Reed (MCP tool-registry death / four contacts).
NOT Husk (hollow headless success envelopes).
NOT Assay (tool-arg wire-format corruption).
NOT Cote / Nixie (`--resume` team-hub identity split).
NOT Larder (plugin-store freeze).
NOT Stencil (plan-mode bleed).
NOT leftover woodworking / millimeter-slider clones.

Different problem: project-scoped `strictAllowlist` silently discarded. A written key is not a seal.
Different UI: steam-fitter's bench. Linen lagging, brass union, red-lead paste, graphite packing ring, bourdon-tube pressure gauge, hand pump, hessian. NOT Damper soot/ember/chimney. NOT Tappet oil-black bay. NOT Larder zinc stillroom. NOT Cote whitewash loft. NOT Snib Yale lock.
Different idle word: **tight**.

## Live catalog path

`/gasket/` is this static steam-fitter desk. Linen lagging, brass, red-lead, graphite, bourdon gauge, packing ring, hessian. Demo works with no secrets and no npm. Mark: `00:50 Sydney · steam flange`.

1. Seeded `#90355` **dropped** is already on the flange: project `.claude/settings.json` carries `strictAllowlist`, discarded at resolution, no warning at startup / debug / status / sandbox / doctor → **dropped**.
2. Switch **blown** — sandbox looks on, allowlist present, non-allowlisted host still reached → **blown**.
3. Switch **nested** `#83035` — parent workspace sandbox replaced by a nested project's settings file → **nested**.
4. Switch **skipped** `#89762` — Bash/curl gated, WebFetch or Write not gated → **skipped**.
5. Switch **open** — allowlist theater: no sandbox runtime, network keys in a file, traffic unrestricted → **open**.
6. Switch **dry** `#87163` — network keys set, `sandbox.enabled` false or absent → **dry**.
7. Switch **warned** — missing socat/bwrap, but a warning actually fired → **warned**.
8. Switch **sheared** — schema copy UNDOCUMENTED, no scope note, runtime drops the key → **sheared**.
9. Switch **made** — user / managed / CLI `--settings` scope, sandbox enabled, Bash denied → **made**.
10. Switch **Seat · tight** — packing compressed, no leak → **tight**. Idle word is **tight** when the probe is idle.
11. **Press** scores. **Seat** returns idle tight. **Observe** checks schema / doctor / status. **Cut** shows fail-open. **Make** seats a right-scope hold. Admit does not lie: a dropped probe stays dropped.

## Hook

`projects/gasket/hook/` scores a probe `{ projectSettingsHasStrictAllowlist, userOrManagedOrCliScope, sandboxEnabled, startupWarning, debugMentionsDiscard, statusMentionsDiscard, sandboxPanelMentionsDiscard, doctorMentionsDiscard, schemaMarksScope, schemaSaysUndocumented, bashEgressBlocked, webfetchEgressBlocked, writeGated, nestedProjectReplacedParent, socatOrBwrapMissing, warningFired, nonAllowlistedHostReached }` and returns `{ verdict, reasons[], sealed, leak, discarded, skipped }`. See `hook/README.md`.

```bash
node projects/gasket/hook/index.mjs --listen 9355
node --test projects/gasket/hook/gasket.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90355](https://github.com/anthropics/claude-code/issues/90355) — `[BUG] sandbox.network.strictAllowlist is silently discarded from project settings — no warning at startup, in --debug, /status, /sandbox, or doctor`. Filed 2026-08-28. Labels: bug, platform:macos, area:security, area:sandbox. SchemaStore copy still says UNDOCUMENTED with no scope note; five sibling scope-restricted keys carry one. Embedded binary description does state the restriction. Runtime is silent.

Corroboration (same fail-open / silent-discard class, not a new primary):

- [anthropics/claude-code#89762](https://github.com/anthropics/claude-code/issues/89762) — open. Sandbox policy covers Bash only; Write and WebFetch are not gated. Bash curl blocked, WebFetch returns the page.
- [anthropics/claude-code#87545](https://github.com/anthropics/claude-code/issues/87545) — open. `autoMode` in project settings silently ignored; schema does not mark it user-only, unlike sibling restricted keys. Same class of defect, different key.
- [anthropics/claude-code#87296](https://github.com/anthropics/claude-code/issues/87296) — open. Three sandbox settings interactions that silently remove a control.
- [anthropics/claude-code#34044](https://github.com/anthropics/claude-code/issues/34044) — closed. `sandbox.enabled: true` silently ignored when socat is not installed (Linux, no warning).
- [anthropics/claude-code#83035](https://github.com/anthropics/claude-code/issues/83035) — closed. Workspace sandbox config silently dropped for sessions/subagents rooted in nested project directories (nested file replaces parent; sandbox escape).

Related, not primary:

- [anthropics/claude-code#87163](https://github.com/anthropics/claude-code/issues/87163) — closed as configuration (network keys without `sandbox.enabled`). A later comment on that thread reported the project-scope case; #90355 is the clean primary for that.
- [anthropics/claude-code#30112](https://github.com/anthropics/claude-code/issues/30112) — open. Cowork network egress allowlist 403. Different mechanism (over-blocking custom domains), cite only as contrast: Gasket is fail-open discard, not a 403.
