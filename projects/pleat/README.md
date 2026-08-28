# Pleat

Tailor's pressing board / accordion-pleat desk for Claude Code Desktop collapsing assistant text written *between* tool calls under the "Ran N commands" fold. Users only reliably see the final text block of a turn. Mid-turn substantive answers (numbered steps, requested explanations) are silently hidden with no hint that collapsed prose exists. The model believes it answered; the user sees tool-call chrome and a fragment. A rendered fold is **not** a hold. Score the cloth or admit **flat**.

Idle word: **flat** (pleat pressed open; prose visible).
NEVER use the product name pleat as the idle/state word.
NEVER use empty.
NEVER reuse fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed (as idle), quiet, seised. Do not ship Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Livery, Nixie, Crypt, Fold, Accordion, or Bellows.

Verdicts: **flat**, **pleated**, **buried**, **folded**, **swallowed**, **midturn**, **chrome**, **fragment**, **ghosted**, **aired**. Slack pleat alarm on pleated / buried / swallowed / ghosted. Linear ticket on buried / ghosted. GitHub pleat-ledger of cloth events on every scored probe.

## Why not a clone

NOT Aside (wing desk / preamble side-channel). Aside is preamble vs answer channel; Pleat is mid-turn prose swallowed by the tool fold.
NOT Coda (splice desk / last text block). Coda concatenates every block vs last-block illusion; Pleat is UI fold hiding between-tool prose that already exists.
NOT Chad (hanging-chad AskUserQuestion phantom selection).
NOT Blot (darkroom / unreadable image kills later turns).
NOT Scant / Kist / Wraith / Gasket / Damper / Cote / Larder / Tappet / Chute / Tain / Husk / Snib / Veto / Assay / Wicket / Sigil / Stencil / Suture / Reed / Fathom / Hasp / Parity / Reveille / Quench / Scrim / Knock.
NOT leftover woodworking / millimetre-slider clones. A pleat is a tailor's fold metaphor for a diagnostic desk, not a leftover instrument.
Do NOT ship Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Livery, Nixie, Crypt, Fold, Accordion, Bellows as alternate product names this hour. Product name is **Pleat** only.

Different problem: desktop fold hides mid-turn answers.
Different UI: tailor pressing board / accordion pleats / chalk lines / fabric grain. Dark shop, wool felt, chalk, needle, pressing iron. NOT timber yard. NOT ballot. NOT coffin. NOT steam flange.
Different idle word: **flat**.

## Live catalog path

`/pleat/` is this static pressing board. Accordion cloth, chalk lines, needle, iron. Demo works with no secrets and no npm. Mark: `05:50 Sydney · pleat`.

1. Seeded `#90425` **pleated** is already on the board: assistant text between tool calls collapsed under Ran N commands → **pleated** (cluster buried / folded / swallowed / midturn / chrome / fragment / ghosted).
2. Switch **buried** — requested explanation exists in transcript but hidden in fold → **buried**.
3. Switch **folded** — turn shows tool chrome + final fragment only → **folded**.
4. Switch **swallowed** — numbered list appears to start mid-sequence (earlier items in fold) → **swallowed**.
5. Switch **midturn** — prose written between tool_use blocks (the dangerous zone) → **midturn**.
6. Switch **chrome** — user sees "Ran N commands" with no hint of hidden prose → **chrome**.
7. Switch **fragment** — only trailing short status visible as "the answer" → **fragment**.
8. Switch **ghosted** — model believes it answered; user never saw it → **ghosted**.
9. Switch **aired** — fold expanded / prose recovered to visible surface → **aired**.
10. Switch **Flatten · flat** — pleat pressed open, nothing scored → **flat**. Idle word is **flat** when the probe is idle.
11. **Score** scores. **Flatten** returns idle flat. **Crease** shows the collapsed fold. **Air** shows recovered prose. Admit does not lie: a pleated probe stays pleated.

## Hook

`projects/pleat/hook/` scores a probe `{ midTurnProse, foldCollapsed, requestedExplanation, explanationInTranscript, explanationHiddenInFold, toolChromeOnly, finalFragmentOnly, numberedListStartsMid, proseBetweenToolUse, ranNCommandsVisible, noHintOfHiddenProse, trailingStatusOnly, modelBelievesAnswered, userNeverSaw, foldExpanded, proseRecovered, midTurnProseVisible }` and returns `{ verdict, reasons[], cluster[], flat, pleated, buried }`. See `hook/README.md`.

```bash
node projects/pleat/hook/index.mjs --listen 9060
node --test projects/pleat/hook/*.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90425](https://github.com/anthropics/claude-code/issues/90425) — Desktop app collapses assistant text written between tool calls; substantive answers silently hidden under 'Ran N commands'. Two repros: numbered list appears to start at 4; requested explanation collapsed entirely.

Corroboration (cite as shape, not a new primary):

- [anthropics/claude-code#67071](https://github.com/anthropics/claude-code/issues/67071) — Assistant text between tool calls not rendered in GUI/CLI though fully persisted in session JSONL.
- [anthropics/claude-code#75500](https://github.com/anthropics/claude-code/issues/75500) — Assistant answers visually buried behind tool-call/wakeup blocks.
- [anthropics/claude-code#85061](https://github.com/anthropics/claude-code/issues/85061) — Text block preceding AskUserQuestion in same assistant message not rendered.
- [anthropics/claude-code#74184](https://github.com/anthropics/claude-code/issues/74184) — Assistant message text hidden when turn ends with ScheduleWakeup.
- [anthropics/claude-code#84065](https://github.com/anthropics/claude-code/issues/84065) — AskUserQuestion dialog obscures preceding assistant output.
- [anthropics/claude-code#89318](https://github.com/anthropics/claude-code/issues/89318) — Focus mode hides standalone final text-only message.
- [anthropics/claude-code#77007](https://github.com/anthropics/claude-code/issues/77007) — VS Code: assistant text reply hidden when turn ends with ExitPlanMode.
