# Alarum

A **night watchtower / copper-bell desk** — indigo dusk, hanging copper bell, lantern ember, night-slate stone, muted mist — Fraunces + Outfit + IBM Plex Mono — for a real Claude Code defect: **A BACKGROUND-TASK KILL/COMPLETION NOTIFICATION WAKES AN ENDED SESSION AND RE-READS FULL CONTEXT, COSTING A FULL MODEL TURN WITH NO USER INPUT.**

Primary:

- [anthropics/claude-code#92283](https://github.com/anthropics/claude-code/issues/92283) (OPEN, enhancement, platform:windows, area:cost, area:core, filed ~2026-09-05). Title: `Background task kill/completion notification wakes the session and re-reads full context -- costs a full turn with no user input`.

17:50 alarum: an alarum that rings after the watch has stood down is not a needed call to arms — it is a bell already rung. Score the tower or admit the watch already rung.

Idle word: **stilled**. Seeded state: **rung** / #92283 — post-goodbye kill notification woke the ended session; full context re-read; reply spent; ~10% usage. Never idle as barred / dropped / pared / raw / cast / fouled / flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / careted / ringing / home / indexed / jumped.

**Alarum** is an alarm cry / call to arms that rings after the night watch has already stood down. The session said goodbye; the background kill still rings the bell and burns a full turn.

- **stilled** = HOLD: session ended; background event deferred; no model turn
- **rung** = #92283: kill/completion notification woke ended session; full context re-read; reply spent
- **deferred** = notification queued for next real user input
- **spent** = usage burned with no user present
- **coldwake** = wake after goodbye with no pending tool state
- **fullreread** = entire transcript reloaded for an informational notice
- **lowmemkill** = OS killed background Bash for memory; notification still fires
- **goodbye** = conversational close already happened
- **absent** = nobody present to read the reply
- **taxed** = ~10% usage drop measured

Verdicts: stilled, rung, deferred, spent, coldwake, fullreread, lowmemkill, goodbye, absent, taxed.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the tower is stilled or already rung. Fixtures use diagnostic shapes only (session close, background Bash, OS low-memory kill, notification wake, full-context reread, usage tax).

Hypothesis only (NON-BINDING): the desk should make "post-goodbye informational kill notice ≠ a needed call to arms" visceral via a copper bell that still rings after the watch has stood down. Discard if evidence disagrees. Encoded from the issue’s facts. Do not claim unseen source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92283](https://github.com/anthropics/claude-code/issues/92283)
- Cousin cite-only (active waiting loop while still in session — different paradigm): [#92062](https://github.com/anthropics/claude-code/issues/92062)

What happened (from the issue):

- User started a local dev server as background Bash (`run_in_background: true`) mid-session.
- Conversation concluded normally (user said goodbye; assistant said goodbye back). No further input expected.
- Hours later the machine slept then woke; OS killed the background process for low memory.
- The task-notification ("...was killed because the system is running low on memory") arrived and re-invoked the model, which re-read the entire all-day conversation and replied.
- Usage dropped ~10% despite zero user typing since goodbye.

Why surprising:

- Notification is purely informational — no pending user request.
- Cost scales with conversation size, not notification importance.
- No opt-out for a visibly-ended session from "wake and react" on background-task events.

Suggested fixes in the issue (any one):

1. Ended session (last turn conversational close, no pending tool state) suppresses/defers background-task wake turns until next real user input.
2. Don't re-read entire transcript for a turn only reporting an unrelated background process finishing/dying.
3. Surface estimated cost of a notification-driven turn before it runs (related to #92062).

## Why not a clone

This is specifically: **POST-GOODBYE BACKGROUND-TASK KILL/COMPLETION NOTIFICATION WAKES AN ENDED SESSION AND SPENDS A FULL TURN IMMEDIATELY.**

NOT Oubliette ([#92095](https://github.com/anthropics/claude-code/issues/92095)) — child-completion voided against a cold parent / drains on the next unrelated wake. Alarum is the opposite timing: the notice spends a full turn *immediately* after goodbye, rather than sitting in a pit until the next user turn.
NOT #92062 — Waiting on background tasks: repeated no-op status probes silently multiply usage (active waiting loop while still in session). Cite in `cousins.json` only. Alarum is not an in-session probe loop.
NOT Portcullis ([#92278](https://github.com/anthropics/claude-code/issues/92278)) — managed-preferences EACCES fail-close. Alarum is not a castle grate.
NOT Skive ([#92271](https://github.com/anthropics/claude-code/issues/92271)) — Bash-first `thrifty_sonic` skive of rules / nested `CLAUDE.md` / hooks.
NOT Lagan ([#92266](https://github.com/anthropics/claude-code/issues/92266)) — leftover `claude` children after desktop close.
NOT Snub ([#92262](https://github.com/anthropics/claude-code/issues/92262)) — Bash-tool heredoc pipe deadlock.
NOT Ward ([#92252](https://github.com/anthropics/claude-code/issues/92252)) — Keychain default-path mis-ward.
NOT Deadlight ([#92249](https://github.com/anthropics/claude-code/issues/92249)) — ListAgents/SendMessage blank in unattended Desktop.
NOT Tocsin / Knell / Annunciator / Reveille — other bell/alarm catalog products with different defects.

Different surface: post-goodbye informational kill notice that still spends a full turn vs cold-parent queue / in-session probe loop / managed-policy grate / leftover children. Completely different UI (night watchtower — hanging copper bell, indigo dusk, lantern ember, night-slate, muted mist — not Portcullis castle grate, not Skive leather tannery, not Lagan night-harbor brine, not Oubliette stone-pit), backend (probe-shaped JSON of stilled / rung / deferred / spent / coldwake / fullreread / lowmemkill / goodbye / absent / taxed rows), and UX (bell that rings after the watch has stood down + usage-tax dish at ~10% + night-watch hour stave).

Cousins are cite-only on a cousin strip; primary stays #92283.

- [#92062](https://github.com/anthropics/claude-code/issues/92062) — OPEN, waiting-on-background no-op probes while still in session. Cite-only. Do not ship as primary.

Backups (document only, do not build): [#92286](https://github.com/anthropics/claude-code/issues/92286) (Cresset — fabricated user/system lines), [#92275](https://github.com/anthropics/claude-code/issues/92275) (Blurt — ECHO leak), [#92280](https://github.com/anthropics/claude-code/issues/92280) (Drift — marketplace git branch).

Product name stays **Alarum**. Do not rename to Portcullis, Skive, Lagan, Snub, Ward, Deadlight, Careen, Ratchet, Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Tocsin, Knell, Bolter, Annunciator, Reveille or any existing catalog slug.

Different UI: hanging copper bell + night-watch hour stave + lantern well + usage-tax dish. Fraunces + Outfit + IBM Plex Mono. NOT Cormorant Garamond / Manrope / JetBrains Mono (Portcullis). NOT Newsreader / Source Sans 3 / IBM Plex Mono (Skive). NOT Spectral / Inter / Fira Code (Lagan). NOT Eczar / Schibsted Grotesk / Martian Mono (Oubliette). Stay OFF castle portcullis, leather tannery, harbor brine, snub pipe, keychain ward, deadlight porthole, oubliette pit, wick folio.

Different verbs: Score the tower, pin idle stilled, pin seeded rung, admit the watch already rung, load fixtures, reset to stilled. Score the tower is this desk’s phrase.

Different idle: **stilled**.

## Live catalog path

`/alarum/` is this static night-watchtower scoring desk. Path `https://hermes-playground-green.vercel.app/alarum/` and subdomain `https://alarum.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `17:50 / hermes catalog #153 / #92283`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **rung** — goodbye already said; hours later the machine slept then woke; OS killed the background Bash for low memory; the kill notification re-invoked the model; the entire all-day conversation was re-read; the model replied; usage dropped ~10%; the bell is already rung.
2. Idle **stilled** → ended session (last turn conversational close, no pending tool state) suppresses/defers the background-task wake; no model turn; lantern banked; idle word stilled.
3. Desk UI: watchtower with hanging copper bell, night-watch hour stave, lantern well, usage-tax dish. Stilled = clapper muffled, watch stood down. Rung = bell swings after goodbye, tax dish at ~10%.
4. Cousin cite strip labeled cousin-not-primary: [#92062](https://github.com/anthropics/claude-code/issues/92062). Cite only. Primary stays #92283.
5. **Score the tower** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Alarum simulator chips rewrite watch (stood-down / still-watching), event (lowmem-kill / completion / none), policy (suppress / wake / cost-preview), and context (full-reread / notice-only).

## How to score

Open `projects/alarum/index.html` in a browser, or serve the repo root and visit `/alarum/` (Vercel rewrite → `/projects/alarum`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/alarum/hook/README.md
```

Empty paste scores the idle **stilled** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **rung**.
