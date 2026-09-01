# Riddle

A **foundry / mining riddle-sieve** — wire mesh in an oak frame, ore grit, chalk tally on the rim, copper rivets, coal-iron straps; cold iron mesh / ore grit / chalk white / coal strap / copper rivet; Newsreader + Public Sans + Source Code Pro — for a real Claude Code defect: the official stock `.devcontainer` / `init-firewall.sh` **aborts on boot when two allowlisted domains resolve to the same IP** (`ipset` duplicate + `set -e`).

Primary:

- [anthropics/claude-code#91327](https://github.com/anthropics/claude-code/issues/91327) (OPEN, bug, has repro, area:sandbox, filed 2026-09-01T21:44:23Z). Title: Devcontainer: init-firewall.sh aborts on boot when two allowlisted domains resolve to the same IP (ipset duplicate + set -e). Reporter pedro-silva-hub.

A riddle that jams on a duplicate pour is not a hold. Score the mesh or admit **sifted**.

Idle word: **sifted**. Seeded state: **jammed** / #91327 — two domains → one IP; `ipset add` without `-exist`; set -e abort; postStartCommand exit 1; firewall unfinished. Never idle as jammed / stocked / aired / drained / hinged / pealed / warded / first-wins / seized / pooled.

A **riddle** is a coarse sieve: grain/ore that already passed the mesh must not jam the next pour. Firewall init should accept a duplicate IP (`ipset add -exist`). Instead the stock script treats a second add of the same IP as a hard error under `set -e` — ore that already sifted jams the next pour.

- **jammed** = #91327: two domains → one IP; `ipset add` without `-exist`; set -e abort; postStartCommand exit 1; firewall unfinished
- **duplicate-ip** = `marketplace.visualstudio.com` and `vscode.blob.core.windows.net` both resolved to `150.171.74.16`
- **set-e-abort** = `init-firewall.sh` runs under `set -euo pipefail`; second `ipset add` errors; `set -e` aborts the script
- **poststart-exit-1** = `postStartCommand` from `devcontainer.json` failed with exit code 1
- **firewall-unfinished** = container comes up without completing firewall initialization
- **ipset-without-exist** = per-domain loop does `ipset add allowed-domains "$ip"` without `-exist`
- **shared-cdn-ip** = CDN-fronted allowlist domains sharing `150.171.74.16`
- **allowlist-cdn-domains** = `marketplace.visualstudio.com` and `vscode.blob.core.windows.net` on the stock allowlist
- **hold** = `ipset add -exist`; duplicate IPs accepted; firewall init finishes; postStartCommand 0; default-deny still holds
- **sifted** = HOLD: `ipset add -exist`; duplicate IPs accepted; firewall init finishes; postStartCommand 0

Verdicts: sifted, jammed, duplicate-ip, set-e-abort, poststart-exit-1, firewall-unfinished, ipset-without-exist, shared-cdn-ip, allowlist-cdn-domains, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the mesh is sifted or jammed.

Hypothesis only (NON-BINDING): treat missing `ipset add -exist` (or dedupe before add) under `set -e` as the defect; CDN-fronted allowlist domains sharing an IP is expected; aborting firewall init on a duplicate is unhealthy. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **DEVCONTAINER FIREWALL INIT ABORTS WHEN TWO ALLOWLISTED DOMAINS SHARE ONE IP (ipset duplicate + set -e).**

NOT **Garner** ([#91246](https://github.com/anthropics/claude-code/issues/91246)) — Desktop archive-to-pool no TTL / loft.
NOT **Pintle** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — PreToolUse Bash relative-path cwd-drift deadlock.
NOT **Carillon** ([#91250](https://github.com/anthropics/claude-code/issues/91250)) — plugin SessionStart first-wins.
NOT **Postern** ([#91223](https://github.com/anthropics/claude-code/issues/91223)) — socket-dir squat.
NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork Toke/File/SeAt kernel pool leak / millrace.
NOT **Alidade** ([#91055](https://github.com/anthropics/claude-code/issues/91055)) — silent foreign host.
NOT **Slype** ([#90676](https://github.com/anthropics/claude-code/issues/90676)) — sandbox System32 powershell vs Program Files pwsh 126.
NOT Gasket (sandbox project key seal).
NOT Wicket (isolation pin / gatehouse).
NOT leftover woodworking / mm-slider.
NOT #35197 alone (closed stale, same class, not the 2026-09-01 live observation).
NOT #15611 alone (closed stale; PR #19871 existed for `-exist` fix).
NOT #67130 alone (had to comment out marketplace/vscode.blob domains — different exit symptom).
NOT openai/codex#22471 (CNAME alongside A records — cross-ecosystem, cite only).

Cousins are cite-only on a cousin strip; primary stays #91327.

Product name stays **Riddle**. Do not rename to Sieve, Mesh, Screen, Grate, Filter, Hopper, Garner, Pintle, Carillon, Postern, Sluice.

Different UI: cold iron mesh / ore grit / chalk white / coal strap / copper rivet. Newsreader + Public Sans + Source Code Pro. NOT Literata/Atkinson/IBM Plex Mono (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair (Carillon). NOT Cinzel (Postern). NOT Libre Caslon (Alidade).

Different verbs: score the mesh, pin idle sifted, pin seeded jammed, admit sifted, load fixtures, reset to sifted. Not "Score the loft/hinge/peal/peg/postern/race".

Different idle: **sifted**.

## Live catalog path

`/riddle/` is this static mesh desk. Path `https://hermes-playground-green.vercel.app/riddle/` and subdomain `https://riddle.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `07:50 / hermes catalog #108 / #91327`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **sifted** — `ipset add -exist`; duplicate IPs accepted; firewall init finishes; postStartCommand 0.
2. Seed **jammed** → #91327: two domains → one IP; `ipset add` without `-exist`; set -e abort; postStartCommand exit 1; firewall unfinished.
3. Mesh UI: oak frame / wire mesh / copper rivet / coal strap. Sifted = clear mesh. Jammed = grit stuck on a duplicate pour.
4. Cousin cite strip labeled cousin-not-primary: [#35197](https://github.com/anthropics/claude-code/issues/35197) / [#15611](https://github.com/anthropics/claude-code/issues/15611) / [#67130](https://github.com/anthropics/claude-code/issues/67130) / [openai/codex#22471](https://github.com/openai/codex/issues/22471). Cite only. Primary stays #91327.
5. **Score the mesh** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/riddle/index.html` in a browser, or serve the repo root and visit `/riddle/` (Vercel rewrite → `/projects/riddle`). No build step. Optional hook:

```bash
node projects/riddle/hook/riddle.mjs projects/riddle/data/91327.json
node projects/riddle/hook/riddle.mjs projects/riddle/data/sifted.json
node --test projects/riddle/hook/riddle.test.mjs
```

Jammed seed → jammed/alarm. Sifted seed → sifted/hold.

`projects/riddle/hook/riddle.mjs` classifies a probe ticket JSON `{ ipsetAddExist, duplicateIp, setEAbort, postStartExit, firewallFinished, ipsetWithoutExist, resolvedIp, ipsetError }` and returns `{ verdict, chips[], reasons[], sifted, jammed, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91327.json`, `data/jammed.json`, `data/sifted.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts. Use `150.171.74.16`, the two domain names, exit code 1, and the exact ipset error string. Never invent counts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91327](https://github.com/anthropics/claude-code/issues/91327). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Slack `#hermes-catalog` mention as the ship notice surface (text only; do not post).
3. Devcontainers / ipset / Docker Desktop as the third native surface. Paste or drop a probe ticket JSON and score it.
4. Mesh UI (oak frame / wire mesh / copper rivet / coal strap). Sifted = clear mesh, jammed = grit stuck on a duplicate pour.
5. Cousin-not-primary cite strip: #35197, #15611, #67130, openai/codex#22471.

## Sources

- [anthropics/claude-code#91327](https://github.com/anthropics/claude-code/issues/91327) OPEN — primary. Product stays Riddle.
- Observed live 2026-09-01: Docker Desktop on Windows 11 + `@devcontainers/cli`; `marketplace.visualstudio.com` and `vscode.blob.core.windows.net` both resolved to `150.171.74.16`.
- Minimal fix proposed: `ipset add -exist allowed-domains "$ip"`.
- Cherry-pick ready at [pedro-silva-hub/claude-code@001c048d6eba062d8bbf7f7e2d538f00e833e28b](https://github.com/pedro-silva-hub/claude-code/commit/001c048d6eba062d8bbf7f7e2d538f00e833e28b) (branch `fix/devcontainer-ipset-exist`) — cite only; do not claim merged upstream.
- After the fix (reporter): container boots clean; default-deny still holds; non-allowlisted blocked; `registry.npmjs.org` reachable; `sudo -n iptables` denied for node user.
- Cousins (cite, not primaries):
  - [#35197](https://github.com/anthropics/claude-code/issues/35197) closed stale — same class: init-firewall fails on duplicate IPs from DNS.
  - [#15611](https://github.com/anthropics/claude-code/issues/15611) closed stale — same class; PR #19871 existed for `-exist` fix.
  - [#67130](https://github.com/anthropics/claude-code/issues/67130) closed — related: had to comment out marketplace/vscode.blob domains to launch (different exit symptom).
  - [openai/codex#22471](https://github.com/openai/codex/issues/22471) OPEN — cross-ecosystem: secure devcontainer firewall aborts when DNS returns CNAME alongside A records.
