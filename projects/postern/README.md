# Postern

A **bailey / postern-gate / night-ward desk** — ashlar night, iron strap-hinges, rust, moss in the joints, rushlight amber, charcoal sky; Cinzel + Literata + Inconsolata — for a real Claude Code defect: **the sockets directory is still first-come after 2.1.248, and a local account can squat both `/tmp/cc-socks` and the per-uid fallback**. Cross-session messaging turns off. DoS only — the owner check and `peerToken` file still hold.

Primary:

- [anthropics/claude-code#91223](https://github.com/anthropics/claude-code/issues/91223) (OPEN, bug, has repro, platform:macos, area:core, area:security, filed 2026-09-01T13:34:37Z). Title: Sockets directory is still first-come after 2.1.248, and a local account can squat both /tmp/cc-socks and the per-uid fallback. Claude Code 2.1.252, native install, macOS 25.6.0 arm64. Two local accounts uid 501 and 502. `XDG_RUNTIME_DIR` unset, `CLAUDE_CODE_TMPDIR` unset. Reporter allixsenos.

A postern that anyone in the bailey can bar is not a hold. Score the postern or admit **warded**.

Idle word: **warded**. Seeded state: **squatted** / #91223 — another uid owns primary `/tmp/cc-socks` AND per-uid fallback `/tmp/cc-socks-501`; both owner checks fail; messaging off; `peerToken` holds; no `$HOME` third door; `/status` silent. Never idle as squatted / postern / sluice / drained / pooled / stationed / displaced / hung / marvered / unpinned / shed / sealed / rinsed / vacant.

A **postern** is the secondary door in a fortification. The great gate is `/tmp/cc-socks` (first-come). The postern is `/tmp/cc-socks-<uid>` (predictable, one try, then the ward fails). There is no third door under the account's own home. Score whether the postern is **warded** (session uid owns the sockets dir it uses, or a private XDG that is honored; messaging on) vs **squatted** (both names taken; messaging off).

- **squatted** = #91223 case 2: another uid owns primary AND per-uid fallback; messaging off
- **first-come** = shared `/tmp/cc-socks` owned by whoever started first (case 1)
- **boot-order** = winner changes after `/tmp` clear / reboot
- **postern-refused** = per-uid fallback also failed the owner check
- **no-third-door** = no `$HOME` fallback before giving up
- **predictable-uid** = fallback name is public `cc-socks-<uid>`
- **workaround-xdg** = `XDG_RUNTIME_DIR=/tmp/claude-<uid>` keeps messaging (35-byte path)
- **fallback-ignores-xdg** = `nNn()` ignores `XDG_RUNTIME_DIR` / `CLAUDE_CODE_TMPDIR`
- **dos-only** = peerToken + owner check stop message theft (cite chip; not a hold)
- **peer-path-ok** = case 1 still discovers via sessions json
- **status-silent** = refusal not reported in `/status`
- **warded** = HOLD: session uid owns the sockets dir it uses (or private XDG that is honored); messaging on

Verdicts: warded, squatted, first-come, boot-order, postern-refused, no-third-door, predictable-uid, workaround-xdg, fallback-ignores-xdg, dos-only, peer-path-ok, status-silent.

This is a diagnostic scoring bench. Not an exploit, attack PoC, or remote-access how-to. No payloads. No squat cookbook. Score whether the postern is warded or squatted.

Hypothesis only (NON-BINDING): treat this as UDS messaging directory tenancy — a shared first-come primary plus a predictable per-uid postern with no third door under `$HOME`. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **UDS MESSAGING DIRECTORY TENANCY — FIRST-COME SHARED `/tmp/cc-socks` + PREDICTABLE PER-UID POSTERN WITH NO THIRD DOOR. LOCAL ACCOUNT CAN SQUAT BOTH NAMES AND TURN MESSAGING OFF. DoS ONLY (peerToken holds).**

NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork kernel Toke/File/SeAt paged-pool leak / millrace.
NOT **Alidade** ([#91055](https://github.com/anthropics/claude-code/issues/91055)) — silent foreign tool host / plane-table.
NOT **Parison** ([#91037](https://github.com/anthropics/claude-code/issues/91037)) — parent-side subagent wedge / glasshouse.
NOT **Cockade** ([#91033](https://github.com/anthropics/claude-code/issues/91033)) — ultracode silent arm / milliner.
NOT **Lye** ([#91020](https://github.com/anthropics/claude-code/issues/91020)) — config-dir scrub / fuller's vat.
NOT **Limpet** ([#89275](https://github.com/anthropics/claude-code/issues/89275)) — OS process-pair cling.
NOT **Quench** — token-spend fuse.
NOT **Bulla** ([#90891](https://github.com/anthropics/claude-code/issues/90891)) — MSIX seal.
NOT **Cubby** — do not reuse the cubby product or cubbyhole name.
NOT **Bitting / Chatelaine** — OAuth/key material.
NOT **Pale** ([#90683](https://github.com/anthropics/claude-code/issues/90683)) — silent-absent hooks when session project root ≠ repo root.
NOT **Berth** ([#90668](https://github.com/anthropics/claude-code/issues/90668)) — spawn_task sharing parent tree.
NOT leftover woodworking / mm-slider.
Product name stays **Postern**. Do not rename to Wicket, Hatch, Lodge, Scuttle, Coaming, Bailey, Gatehouse, Sallyport, Porter, Letterbox.

Different UI: night bailey / postern-gate / night-ward. Two ashlar doors, iron strap-hinges, rust, moss, rushlight amber, charcoal night sky. Cinzel + Literata + Inconsolata. NOT Fraunces/Source Sans 3 (Sluice). NOT Libre Caslon/Public Sans (Alidade). NOT EB Garamond (Parison). NOT milliner scripts. NOT Cormorant (Bulla). NOT a leftover woodworking instrument. NOT a millimeter-slider.

Different verbs: score the postern, pin idle warded, pin seeded squatted, admit warded, load fixtures, reset to warded. Not "Score the race/peg/gather/brim/vat".

Different idle: **warded**.

## Live catalog path

`/postern/` is this static night bailey. Path `https://hermes-playground-green.vercel.app/postern/` and subdomain `https://postern.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `03:50 / hermes catalog #104 / #91223`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **warded** — session uid owns the sockets dir it uses; messaging on; rushlight steady.
2. Seed **squatted** → #91223: both leaves barred; rushlight gutters; messaging off; DoS only.
3. Two ashlar doors: great gate plaque `/tmp/cc-socks` and smaller postern `/tmp/cc-socks-<uid>`. Ghosted third arch is the missing `$HOME` door.
4. Cousin cite strip labeled cousin-not-primary: claude-code UDS/sockets-dir/owner-vet [#89401](https://github.com/anthropics/claude-code/issues/89401) / [#89563](https://github.com/anthropics/claude-code/issues/89563) / [#86567](https://github.com/anthropics/claude-code/issues/86567) / [#84945](https://github.com/anthropics/claude-code/issues/84945); openai/codex shared `/tmp` IPC [codex#26761](https://github.com/openai/codex/issues/26761) / [codex#17765](https://github.com/openai/codex/issues/17765) / [codex#15435](https://github.com/openai/codex/issues/15435). Cite only. Primary stays #91223.
5. DoS-only `peerToken` chip — owner check + peerToken still stop message theft.
6. **Score the postern** walks the probe ticket and lights chips on the bailey. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/postern/index.html` in a browser, or serve the repo root and visit `/postern/` (Vercel rewrite → `/projects/postern`). No build step. Optional hook:

```bash
node projects/postern/hook/postern.mjs projects/postern/data/91223.json
node projects/postern/hook/postern.mjs projects/postern/data/warded.json
node --test projects/postern/hook/postern.test.mjs
```

Squatted seed → squatted/alarm. Warded seed → warded/hold.

`projects/postern/hook/postern.mjs` classifies a probe ticket JSON `{ sessionUid, primaryDirOwnerUid, fallbackDirOwnerUid, primaryDirExists, fallbackDirExists, messagingOn, xdgRuntimeDirSet, xdgHonoredByFallback, homeFallbackAttempted, tmpClearedSinceBoot, firstComeWinnerUid, peerTokenHolds, socketPathBytes, statusReportsRefusal }` and returns `{ verdict, chips[], reasons[], warded, squatted, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91223.json`, `data/squatted.json`, `data/warded.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`. Evidence only from issue facts. No invented uids beyond 501/502 from the issue.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91223](https://github.com/anthropics/claude-code/issues/91223). Unauthenticated. Title, state, labels — not a squat cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Paste/drop a probe ticket JSON and score it.
3. Two-door bailey (great gate + postern) with a ghosted third arch for the missing `$HOME` door.
4. DoS-only `peerToken` chip + cousin-not-primary cite strip (#89401 / #89563 / #86567 / #84945 / codex#26761 / #17765 / #15435).
5. Workaround plaque: `XDG_RUNTIME_DIR=/tmp/claude-<uid>` keeps messaging (35-byte path). Fallback `nNn()` still ignores those vars.

## Sources

- [anthropics/claude-code#91223](https://github.com/anthropics/claude-code/issues/91223) OPEN — primary. Product stays Postern.
- Cousins (cite, not primaries) — claude-code UDS / sockets-dir / owner-vet:
  - [#89401](https://github.com/anthropics/claude-code/issues/89401) CLOSED — Cross-session messaging silently disabled for secondary users on multi-user macOS (default socket dir `/tmp/cc-socks` is shared, first user owns it). 2.1.248 partial fix; #91223 documents the remaining first-come + dual-name squat.
  - [#89563](https://github.com/anthropics/claude-code/issues/89563) CLOSED — WSL2/WSLg `XDG_RUNTIME_DIR` 0777 inbox vet refuses to bind.
  - [#86567](https://github.com/anthropics/claude-code/issues/86567) CLOSED — socket-dir hardening silently disables messaging in user-namespace/chroot (uid 65534).
  - [#84945](https://github.com/anthropics/claude-code/issues/84945) OPEN — one of two identical sessions fails to bind the inbox socket.
- Cousins (cite, not primaries) — openai/codex shared `/tmp` IPC (cross-ecosystem squat / EACCES):
  - [openai/codex#26761](https://github.com/openai/codex/issues/26761) OPEN — `/tmp/codex-ipc` is not per-user.
  - [openai/codex#17765](https://github.com/openai/codex/issues/17765) OPEN — VS Code Remote-SSH global `/tmp/codex-ipc`.
  - [openai/codex#15435](https://github.com/openai/codex/issues/15435) CLOSED — EACCES on `/tmp/codex-ipc/*.sock`.
