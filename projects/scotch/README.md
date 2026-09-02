# Scotch

A **railway wagon scotch-block atelier** desk — timber scotch under a wagon wheel, iron rail, chalk marks on sleeper, oil lantern, switchman's hut; coal-dust and oak on a cool slate ground; Spectral + Sora + IBM Plex Mono — for a real Claude Desktop defect: packaged Windows service **CoworkVMService** / `cowork-svc.exe` **fails to configure Windows SCM recovery actions** with `open service: Access is denied`. Unclean death → reboot-only reclaim.

Primary:

- [anthropics/claude-code#91324](https://github.com/anthropics/claude-code/issues/91324) (OPEN, bug, has repro, platform:windows, area:cowork, area:desktop, filed 2026-09-01T21:25:43Z). Title: Windows: CoworkVMService can't set its own crash recovery ("Access is denied") — once it dies, only a reboot brings Claude back. Reporter danarkind.

A scotch that cannot arm recovery is not a hold. Score the block or admit **chocked**.

Idle word: **chocked**. Seeded state: **rolled** / #91324 — Access is denied configuring recovery actions; crashed service stays down until reboot. Never idle as rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked.

A **scotch** is a timber block chocked under a railway wagon wheel. After an unclean `CoworkVMService` death the block should **chock** so Windows SCM recovery auto-restarts the service. Instead `open service: Access is denied` leaves recovery unarmed and the wagon **rolls** until reboot.

- **rolled** = #91324: Access is denied configuring recovery actions; crashed service stays down until reboot
- **access-denied** = start log: failed to configure recovery actions (a crashed service will stay down until reboot): open service: Access is denied
- **recovery-actions** = configure recovery actions fails; matching stop warning failed to disarm recovery actions… Access is denied
- **open-service** = `open service: Access is denied` on the CoworkVMService handle
- **reboot-only** = a crashed service stays down until reboot; Task Manager kill of the service left it down permanently until reboot; reporter rebooted three times in one day
- **unclean-death** = Desktop window deaths; once the service dies uncleanly Windows will not bring it back; main process stayed alive with no window
- **gpu-adjacent** = twice the log shows `GPU process gone` at death (11:29:12 and 12:50:44); cite-only cousin #90105
- **msix-adjacent** = pending MSIX update 1.40609.0.0 → 1.40609.1.0; cite-only cousins #89912 / #89692 / #89648 / #89687
- **second-instance** = after death the main process stayed alive with no window; `second-instance: suppressing duplicate argv`; "Claude is being used by another program"
- **has-repro** = packaged Windows service logs the recovery-actions warning every start in `C:\ProgramData\Claude\Logs\cowork-service.log`; labels include has repro
- **hold** = recovery actions configured successfully; unclean service death would auto-restart; no Access is denied on open service; the block is chocked
- **chocked** = HOLD: recovery actions configured successfully; unclean service death would auto-restart; no Access is denied on open service

Verdicts: chocked, rolled, access-denied, recovery-actions, open-service, reboot-only, unclean-death, gpu-adjacent, msix-adjacent, second-instance, has-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the block is chocked or rolled.

Hypothesis only (NON-BINDING): service process lacks privilege / wrong identity to call ChangeServiceConfig2 for failure actions, so recovery never arms. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **CoworkVMService FAILS TO CONFIGURE WINDOWS SCM RECOVERY ACTIONS WITH `open service: Access is denied`; UNCLEAN DEATH → REBOOT-ONLY RECLAIM.**

NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork Toke/File/SeAt kernel paged-pool leak / millrace.
NOT **Bulla** ([#90891](https://github.com/anthropics/claude-code/issues/90891)) — MSIX seal / package corruption.
NOT **Limpet** ([#89275](https://github.com/anthropics/claude-code/issues/89275)) — session process still clamped after done.
NOT **Damper/Kist/Bollard** — Remote Control settings/roster/hawser cluster.
NOT #90105 / #89692 / #89912 / #89648 / #89687 (GPU orphan + MSIX update reboot loops — cite-only cousins that become reboot-only when recovery cannot arm).
NOT **Fibula** ([#91306](https://github.com/anthropics/claude-code/issues/91306)) — mute DISPLAY clipboard hang.
NOT **Virgule** ([#91337](https://github.com/anthropics/claude-code/issues/91337)) — slash/skills menu trigger bound to message index 0 / composing stick.
NOT **Riddle** ([#91327](https://github.com/anthropics/claude-code/issues/91327)) — Devcontainer ipset duplicate + set -e firewall abort / mesh sieve.
NOT **Garner** ([#91246](https://github.com/anthropics/claude-code/issues/91246)) — Desktop archive-to-pool no TTL / loft.
NOT **Pintle** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — PreToolUse Bash relative-path cwd-drift deadlock.
NOT **Carillon** ([#91250](https://github.com/anthropics/claude-code/issues/91250)) — plugin SessionStart first-wins.
NOT **Postern** ([#91223](https://github.com/anthropics/claude-code/issues/91223)) — socket-dir squat.
NOT leftover woodworking / mm-slider.

Cousins are cite-only on a cousin strip; primary stays #91324.

Product name stays **Scotch**. Do not rename to Recovery, Service, SCM, Cowork, Reboot, Access, Fibula, Virgule, Riddle, Garner, Pintle.

Different UI: timber scotch-block under a wagon wheel / iron rail / chalk marks on sleeper / oil lantern / switchman's hut / coal-dust and oak / cool slate ground. Spectral + Sora + IBM Plex Mono. NOT Cormorant/Outfit/Fira (Fibula). NOT Libre Baskerville/Work Sans/JetBrains (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair (Carillon). NOT Cinzel (Postern).

Different verbs: score the block, pin idle chocked, pin seeded rolled, admit chocked, load fixtures, reset to chocked. Not "Score the pin/stick/mesh/loft/hinge/peal/peg/postern/race".

Different idle: **chocked**.

## Live catalog path

`/scotch/` is this static wagon scotch-block atelier desk. Path `https://hermes-playground-green.vercel.app/scotch/` and subdomain `https://scotch.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `10:50 / hermes catalog #111 / #91324`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **chocked** — recovery actions configured successfully; unclean service death would auto-restart; no Access is denied on open service.
2. Seed **rolled** → #91324: Access is denied configuring recovery actions; crashed service stays down until reboot.
3. Atelier UI: timber scotch-block under a wagon wheel / iron rail / chalk marks on sleeper / oil lantern / switchman's hut. Chocked = block under the flange, wagon held. Rolled = Access is denied, recovery unarmed, wagon rolls.
4. Cousin cite strip labeled cousin-not-primary: [#90105](https://github.com/anthropics/claude-code/issues/90105) / [#89912](https://github.com/anthropics/claude-code/issues/89912) / [#89692](https://github.com/anthropics/claude-code/issues/89692) / [#89648](https://github.com/anthropics/claude-code/issues/89648) / [#89687](https://github.com/anthropics/claude-code/issues/89687). Cite only. Primary stays #91324.
5. **Score the block** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/scotch/index.html` in a browser, or serve the repo root and visit `/scotch/` (Vercel rewrite → `/projects/scotch`). No build step. Optional hook:

```bash
node projects/scotch/hook/scotch.mjs projects/scotch/data/91324.json
node projects/scotch/hook/scotch.mjs projects/scotch/data/chocked.json
node --test projects/scotch/hook/scotch.test.mjs
```

Rolled seed → rolled/alarm. Chocked seed → chocked/hold.

`projects/scotch/hook/scotch.mjs` classifies a probe ticket JSON `{ recoveryConfigured, accessDenied, openServiceDenied, crashStaysDown, rebootRequired, uncleanDeath }` and returns `{ verdict, chips[], reasons[], chocked, rolled, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91324.json`, `data/rolled.json`, `data/chocked.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts. Use CoworkVMService, cowork-svc.exe, Access is denied, recovery actions, reboot-only, GPU process gone adjacent, MSIX 1.40609, ProgramData Claude Logs. Never invent counts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91324](https://github.com/anthropics/claude-code/issues/91324). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Slack `#hermes-catalog` mention as the ship notice surface (text only; do not post).
3. Claude Desktop CoworkVMService / Windows SCM recovery path as the third native surface. Paste or drop a probe ticket JSON and score it.
4. Atelier UI (timber scotch-block under a wagon wheel / iron rail / chalk marks on sleeper / oil lantern / switchman's hut). Chocked = block under the flange, rolled = Access is denied leaves recovery unarmed.
5. Cousin-not-primary cite strip: #90105, #89912, #89692, #89648, #89687.

## Sources

- [anthropics/claude-code#91324](https://github.com/anthropics/claude-code/issues/91324) OPEN — primary. Product stays Scotch.
- Packaged Windows service CoworkVMService / cowork-svc.exe logs every start in `C:\ProgramData\Claude\Logs\cowork-service.log`.
- Warning: `failed to configure recovery actions (a crashed service will stay down until reboot): open service: Access is denied.`
- Matching stop warning: failed to disarm recovery actions… Access is denied.
- Reporter rebooted three times in one day after Desktop window deaths (twice with `GPU process gone` at 11:29:12 and 12:50:44; once silent stop).
- After death: main process stayed alive with no window; second-instance suppressed (`second-instance: suppressing duplicate argv`; Not main instance, returning early from app ready); Task Manager kill of the service left it down permanently until reboot.
- At the 12:50 death the app's own memory line read: `[process-memory] tree_rss_sum=15216MB electron(14)=2597MB children(251)=12618MB ... sys_free=21688MB/65209MB`.
- Pending MSIX update 1.40609.0.0 → 1.40609.1.0 and GPU/orphan paths noted as adjacent; recovery-actions warning is the newly filed piece.
- Env: Claude Desktop MSIX 1.40609.0.0 → 1.40609.1.0, Windows 11 Pro 10.0.26200, x64, 64 GB RAM.
- Cousins (cite, not primaries):
  - [#90105](https://github.com/anthropics/claude-code/issues/90105) — GPU orphan path (cite; GPU/orphan side looks like #90105).
  - [#89912](https://github.com/anthropics/claude-code/issues/89912) — MSIX update reboot loop (cite).
  - [#89692](https://github.com/anthropics/claude-code/issues/89692) — MSIX update reboot loop (cite).
  - [#89648](https://github.com/anthropics/claude-code/issues/89648) — MSIX update reboot loop (cite).
  - [#89687](https://github.com/anthropics/claude-code/issues/89687) — MSIX update reboot loop (cite).
