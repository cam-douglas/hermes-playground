# Nixie

A **USPS-style nixie / undeliverable-mail sorting desk** — oak pigeonholes, rubber date stamps, amber desk lamp, kraft envelopes, franking marks, red nixie stamp, sorting bins labeled MAPPED vs NIXIED — Libre Baskerville + DM Sans + JetBrains Mono — for a real Claude Code defect: **CROSS-SESSION `send_message` FROM AN AUTO-PERMISSION-MODE SENDER IS SILENTLY DROPPED (45s NO-ACK SETTLE / NO MAPPING LINE); `bypassPermissions` DELIVERS.**

Primary:

- [anthropics/claude-code#92383](https://github.com/anthropics/claude-code/issues/92383) (OPEN, bug, has repro, platform:windows, area:permissions, area:desktop). Title: `[BUG] Cross-session send_message from an auto-permission-mode sender is silently dropped (45s no-ack settle); bypassPermissions sender delivers`. Filed 2026-09-05. Reporter: cyber2e.

07:50 nixie: a send that reports Message sent/queued but never maps, then settles as undelivered after 45s no-ack, is not a delivered report-back — it is already nixied. Score the frank or admit the piece already nixied.

Idle word: **nixied**. Seeded state: **settled** / #92383 — no Mapping line; settled as undelivered after 45s no-ack. Never idle as open, held, witnessed, elided, grafted, frozen, adrift, cold, voided, banked, rewritten, discarded, or any prior catalog idle.

**Nixie** is postal work. A nixie is mail that cannot be delivered or returned — stamped undeliverable. Here the send reports success but never maps; after the ack timeout it is settled as undelivered and discarded with no retry. Score whether a send from auto vs bypassPermissions would map or be nixied.

- **nixied** = IDLE / undeliverable-mail fence: auto-mode send reports sent but never maps; already undeliverable
- **settled** = seeded word: no Mapping line; `settled as undelivered` after 45s (sometimes 90s) no-ack
- **mapped** = contrast hold: Mapping line appears within seconds; user turn written; model turn runs
- **undelivered** = synonym for nixied; the settle stamp on the piece
- **auto-drop** = sender permission mode is `auto`; 14/14 dropped
- **bypass-deliver** = sender permission mode is `bypassPermissions`; every delivered send
- **false-sent** = tool result still reports "Message sent/queued"
- **no-ack** = peer input drew no acknowledgement from the CLI in 45001ms
- **no-mapping** = no Mapping line ever appears in main.log
- **no-retry** = discarded with no retry and no transcript entry beyond the sender's tool_use
- **no-transcript** = no user turn written to the recipient transcript
- **no-model-turn** = no model turn runs on the recipient
- **optimistic-ui** = recipient conversation UI may render the message block anyway
- **14/14** = 14/14 dropped sends from auto-mode senders
- **25-settle** = 25 `settled as undelivered` events in one main.log across 6 days
- **switch-bypass** = issue workaround: switch report-back senders to bypassPermissions
- **grep-settle** = issue workaround: verification script greps the settle signature, then resends

Verdicts: nixied, settled, mapped, undelivered, auto-drop, bypass-deliver, false-sent, no-ack, no-mapping, no-retry, no-transcript, no-model-turn, optimistic-ui, 14/14, 25-settle, switch-bypass, grep-settle.

This is a diagnostic scoring assay. Not an exploit. No secrets. No live Claude sessions. Score whether a send from auto vs bypassPermissions would map or be nixied. Fixtures use the issue's A/B, log signatures, 14/14 count, and published workarounds only.

Hypothesis only (NON-BINDING): treat auto-mode cross-session send as undelivered unless Mapping appears; surface settle-as-undelivered to the sender instead of false success; allow retry. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92383](https://github.com/anthropics/claude-code/issues/92383)

What happened (from the issue — do not invent):

- Environment: Claude Desktop for Windows **1.46388.3** (MSIX); Windows 11 Pro 26100; Code tab sessions; ccd_session_mgmt `send_message`.
- A cross-session `send_message` from a sender session whose **permission mode is `auto` is silently discarded**. The same message from a `bypassPermissions` sender delivers normally.
- The sender's tool result still reports "Message sent/queued", and the recipient's conversation UI renders the message block optimistically — but no user turn is ever written to the recipient's transcript and no model turn runs.
- Delivered send — a Mapping line follows within seconds:

```
21:41:34 [info] Sending message to session local_<recipient>
21:41:34 [info] Mapping internal session local_<recipient> to CLI session <uuid>
```

- Dropped send — no Mapping line ever appears; 45s (sometimes 90s) later:

```
[warn] [LocalSessionManager] peer input <uuid> for local_<recipient> drew no acknowledgement from the CLI in 45001ms — settled as undelivered (ownedCycle=true)
[info] [LocalSessionManager] CLI undelivered input <uuid> for local_<recipient> without running it — settled (hold=false cycle=true next=false)
[info] [CCD CycleHealth] healthy cycle for local_<recipient> (45s, hadFirstResponse=false)
```

- The message is then discarded with no retry and no transcript entry on either side beyond the sender's tool_use record.
- Decisive A/B: one hand-opened session, same cwd, same everything: in `auto` permission mode its pings to an idle recipient were settled-as-undelivered at 45s; after flipping only the permission mode to `bypassPermissions`, the very next ping delivered instantly and the Mapping line appeared. `classifierSummaryEnabled` was unchanged (true) across the flip.
- Correlation: 14/14 dropped sends came from `auto`-mode senders; every delivered send came from a `bypassPermissions` sender.
- Ruled out by direct testing: recipient busy vs idle (drops occur against a verified-idle recipient), sender model (opus and a Claude 5 model both), chip/spawn_task-derived vs hand-opened sender, fresh CLI process (close and reopen still drops), cwd, recipient session identity (multiple recipients affected).
- Impact: unattended execution sessions typically run in `auto` mode; their report-back messages are lost in batches with a false "sent" result on the sender side. 25 `settled as undelivered` events in one machine's main.log across 6 days.

Workarounds from the issue (document only):

1. Switch sessions that must report back via `send_message` to bypass permissions.
2. A verification script + hooks: after each send, a detached checker greps main.log for the settle signature and the recipient transcript for a message fingerprint, then instructs the sender to resend on a confirmed drop.

## Why not a clone

This is specifically: **cross-session `send_message` from auto-permission-mode sender silently drops (45s no-ack settle / no Mapping line); bypassPermissions delivers.**

NOT Embrasure/#92365 — sandbox denyRead fail-open. Nixie is not a battlement embrasure.
NOT Elision/#92347 — summarize-up-to-here drops compact summaries. Nixie is not a blue-pencil folio desk.
NOT Graft/#92354 — plugin cache copy-forward. Nixie is not an orchard grafting bench.
NOT Sostenuto/#92360 — CoreAudio hold-to-talk freeze. Nixie is not an ebony piano.
NOT Jetsam/#92338 — stale tracking-ref Stop hook. Nixie is not a teak quay.
NOT Priory/#92345 — MSIX priconfig leak. Nixie is not a limestone cloister.
NOT Latchkey/#92330 — Remote Control OAuth false /login. Nixie is not a brass latchkey board.
NOT Portcullis/#92278 — EACCES managed prefs as unreadable policy. Nixie is not an iron grate gatehouse.
NOT Oubliette — cold parent queue drain. Nixie is not a stone pit.
NOT Knock — permission grant stall. Nixie is not a knocker.
NOT Deadband / Deadeye / Deadlight — different dead* paradigms. Do **not** name this Deadletter despite the postal metaphor; name is Nixie.

Different surface: sender permission-mode correlate on cross-session `send_message` vs those.

Cousins cite-only (NOT primary):

- [#86014](https://github.com/anthropics/claude-code/issues/86014) — sent-but-never-delivered / success with 0/4 delivery
- [#86059](https://github.com/anthropics/claude-code/issues/86059) — recipient interrupted / loses message knowledge

Product name stays **Nixie**. Do not rename to Deadletter, Embrasure, Elision, Graft, Sostenuto, or any existing catalog slug. Name/slug `nixie` confirmed unused in catalog.json.

Different UI: mid-century USPS nixie desk / oak pigeonholes / kraft envelopes / red nixie stamp / MAPPED vs NIXIED bins / amber desk lamp. Libre Baskerville + DM Sans + JetBrains Mono. NOT Cinzel (Embrasure). NOT Newsreader / Figtree (Elision). NOT Literata (Graft). NOT Fraunces / Outfit (Sostenuto). Stay OFF battlement / blue-pencil folio / orchard cambium / ebony piano.

Different verbs: Score the frank, pin idle nixied, pin seeded settled, admit the piece already nixied, flip auto vs bypass, load fixtures, reset to mapped.

Different idle: **nixied**. Different seeded: **settled**.

## Live catalog path

`/nixie/` is this static postal scoring assay. Path `https://hermes-playground-green.vercel.app/nixie/` and subdomain `https://nixie.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `07:50 / hermes catalog #167 / #92383`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **settled** — auto-mode send; no Mapping; 45s no-ack; settled as undelivered; false sent; no retry.
2. Idle **nixied** → the undeliverable-mail fence; piece already stamped; idle word nixied.
3. Contrast **mapped** → bypassPermissions sender; Mapping line within seconds; user turn written; model turn ran.
4. Assay UI: oak pigeonholes, kraft envelope, amber lamp, red nixie stamp, MAPPED vs NIXIED bins, A/B flip, log signature slips, switch-bypass / grep-settle paths.
5. Stay-off strip: Embrasure / Elision / Graft / Sostenuto / Jetsam / Priory / Latchkey / Portcullis / Oubliette / Knock / Deadband / Deadeye / Deadlight. Primary stays #92383.
6. **Score the frank** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite sender permission mode (auto / bypass).

## How to score

Open `projects/nixie/index.html` in a browser, or serve the repo root and visit `/nixie/` (Vercel rewrite → `/projects/nixie`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **nixied** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **settled** / no Mapping.
