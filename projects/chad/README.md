# Chad

Hanging-chad / ballot booth desk for Claude Code `AskUserQuestion` returning an option the user never selected, then the assistant acting on that forged consent (e.g. `docker compose up --build -d` against a standing instruction). A reported selected option is **not** a hold. Score the ballot or admit **spoilt**.

Idle word: **spoilt** (spoilt ballot, nothing scored).
NEVER use the product name chad as the idle/state word.
NEVER use empty.
NEVER reuse Kist's laid, Wraith's unlinked, Gasket's tight, Damper's banked, Cote's roosted, Larder's stocked, Tappet's seated, Aside's heard, Chute's clear (as idle), Tain's paired, Husk's kernel, Snib's latched, Veto's upheld, Assay's sterling, Wicket's home, Sigil's valid, Stencil's dry, Suture's sealed, Reveille's quiet, Livery's seised. Do not ship Livery, Nixie, Crypt, Booth-as-rename-of-Chad, Ballot, Teller, or Placet.

Verdicts: **spoilt**, **punched**, **blank**, **carried**, **miscast**, **phantom**, **rubbered**, **forced**, **defaulted**, **clear**. Slack chad alarm on punched / carried / miscast / phantom / forced. Linear false-consent ticket on punched / carried / phantom. GitHub chad-ledger of ballot events on every scored probe.

## Why not a clone

NOT Knock (fail-loud permission-grant stall). Knock is stalled grants; Chad is a false affirmative on a question tool.
NOT Damper (Remote Control auto-enable without consent). Damper is a settings toggle; Chad is AskUserQuestion phantom selection + acted-upon side effects.
NOT Parity (claim vs reality probes of GitHub/Vercel/Linear). Parity checks agent assertions against external truth; Chad scores ballot provenance (reported selection vs user intent / dismissal).
NOT Snib / Veto / Assay / Gasket / Wraith / Kist / Cote / Larder / Tappet / Aside / Chute / Tain / Husk / Wicket / Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom / Hasp / Reveille / Quench / Scrim.
NOT leftover woodworking / millimetre-slider clones. A chad is a ballot-punch metaphor for a diagnostic desk, not a leftover instrument.
Do NOT ship Livery, Nixie, Crypt, Booth-as-rename-of-Chad, Ballot, Teller, Placet as alternate product names this hour. Product name is **Chad** only.

Different problem: phantom AskUserQuestion selection treated as consent.
Different UI: polling-station / hanging-chad ballot booth. Paper ballots, punch cards, hanging chads, ink stamp, canvas bag, election night ledger. Fluorescent or dusk civic hall light. NOT undertaker oak (Kist). NOT frost-ice (Wraith). NOT steam flange (Gasket). NOT chimney soot (Damper). NOT dove loft (Cote). NOT stillroom (Larder).
Different idle word: **spoilt**.

## Live catalog path

`/chad/` is this static ballot booth. Punch card, hanging chad, ink stamp, canvas bag, election night ledger. Demo works with no secrets and no npm. Mark: `03:50 Sydney · chad`.

1. Seeded `#90407` **punched** is already on the ballot: AskUserQuestion reported Recommended; user never chose; docker compose ran → **punched** (cluster carried / miscast / phantom / forced / defaulted).
2. Switch **blank** — question unresolved / dismissed / unanswered (healthy path when the user typed instead of picking) → **blank**.
3. Switch **carried** — assistant acted on the reported option; side effect landed → **carried**.
4. Switch **miscast** `#76616` — Enter or focus-click submitted the highlighted Recommended option → **miscast**.
5. Switch **phantom** `#88790` — result looks like a genuine human answer; provenance is missing → **phantom**.
6. Switch **rubbered** — rubber-stamp Recommended default submitted without a deliberate pick → **rubbered**.
7. Switch **forced** — mid-turn message caused auto-resolve to the highlighted option → **forced**.
8. Switch **defaulted** — first/Recommended option submitted by accident of UI default → **defaulted**.
9. Switch **clear** — verified deliberate selection with distinguishable human provenance → **clear**.
10. Switch **Shut · spoilt** — spoilt ballot, nothing scored → **spoilt**. Idle word is **spoilt** when the probe is idle.
11. **Score** scores. **Shut** returns idle spoilt. **Punch** shows the hanging chad. **Clear** shows a verified hold. Admit does not lie: a punched probe stays punched.

## Hook

`projects/chad/hook/` scores a probe `{ reportedOption, userDeniesSelection, userNeverChose, recommendedWasHighlighted, enterWhileTyping, focusClickSelected, midTurnMessageAutoResolved, assistantActedOnResult, sideEffectLanded, resultIndistinguishableFromHuman, questionDismissedUnanswered, deliberateSelectionVerified }` and returns `{ verdict, reasons[], cluster[], spoilt, punched, carried }`. See `hook/README.md`.

```bash
node projects/chad/hook/index.mjs --listen 9050
node --test projects/chad/hook/chad.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90407](https://github.com/anthropics/claude-code/issues/90407) — filed 2026-08-28. AskUserQuestion reported "You run it (Recommended)" the user never chose; assistant started Docker containers. Hypotheses in the issue: Enter meant for the text prompt submitted the highlighted Recommended option; race between question UI and mid-turn message input; question UI auto-resolving when the user sends a message instead of answering. Expected: pending question should resolve as unanswered/dismissed, not as the highlighted option; a mid-turn user message should take precedence.

Corroboration (cite as shape, not a new primary):

- [anthropics/claude-code#76616](https://github.com/anthropics/claude-code/issues/76616) — Focus click triggers option selection (adjacent false-punch path).
- [anthropics/claude-code#88790](https://github.com/anthropics/claude-code/issues/88790) — AskUserQuestion tool result cannot be distinguished from a genuine human response (trust/provenance gap that makes forged consent worse).
- [anthropics/claude-code#84970](https://github.com/anthropics/claude-code/issues/84970) — options repeatedly reappear on mobile.
- [anthropics/claude-code#86918](https://github.com/anthropics/claude-code/issues/86918) — AskUserQuestion never times out while terminal focused.
