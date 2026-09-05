# Elision

A **copy-editor blue-pencil / manuscript abridgment / elision-mark desk** — cream folio pages, cobalt blue pencil, scissors marks ‹…›, ink margins, soft desk lamp over walnut night-desk — Newsreader + Figtree + IBM Plex Mono — for a real Claude Code defect: **"SUMMARIZE UP TO HERE" SILENTLY DROPS EARLIER COMPACT SUMMARIES LOCATED AFTER THE ANCHOR — PERMANENT CONTEXT LOSS.**

Primary:

- [anthropics/claude-code#92347](https://github.com/anthropics/claude-code/issues/92347) (OPEN, bug, has repro, platform:windows, area:core, data-loss). Title: `[Bug] "Summarize up to here" silently drops earlier compact summaries located after the anchor - permanent context loss`. Filed 2026-09-05. Reporter: oskar-gm.

05:50 elision: a blue-pencil that cuts the standing summary out of the kept suffix is not an abridgment — it is already elided. Score the mark or admit the folio already elided.

Idle word: **intact**. Seeded state: **elided** / #92347 — "up to here" filters prior compact summaries from the preserved suffix. Never idle as cleared, grafted, frozen, adrift, leaked, miskeyed, razed, doubled, stuck, missed, gated, spilled, hushed, blurted, lit, blanked, cold, voided, banked, rewritten, discarded, or any prior catalog idle.

**Elision** is copy-desk work: an abridgment is supposed to keep the standing type after the caret. Here "Summarize up to here" rebuilds the preserved suffix by filtering compact boundaries **and** prior compact-summary messages (`type === "user" && isCompactSummary`). Excluding stale boundary markers is fine. Applying the same filter to summary messages deletes irreplaceable content, because a summary is the only in-context representative of hundreds of already-compacted messages. Entries remain in the session `.jsonl` but live context loses them permanently.

- **intact** = HOLD: prior compact summaries after the anchor stay in the preserved suffix like any other post-anchor content
- **elided** = #92347: "up to here" silently removes those summaries from the live context
- **preserved-suffix** = kept [X … end] except the filtered summaries
- **filtered-summary** = `type === "user" && isCompactSummary` dropped from the rebuild list
- **boundary-ok** = excluding stale compact-boundary markers is the correct half of the filter
- **warn-discard** = expected alternative: warn that N earlier summaries will be discarded
- **absorb-compact** = workaround: `/compact` absorbs every summary in context (verified)
- **from-here-safe** = workaround: "Summarize from here" keeps everything before its anchor intact (verified)
- **up-to-here-unsafe** = anchoring "up to here" before an existing summary
- **context-loss** = everything that existed only inside that summary is lost, with no warning
- **file-refs-survived** = Case A: re-attached file references belonging to those summarized ranges survived, while the summaries themselves did not
- **live-gone** = entries remain in the session `.jsonl`; live context loses them permanently

Verdicts: intact, elided, preserved-suffix, filtered-summary, boundary-ok, warn-discard, absorb-compact, from-here-safe, up-to-here-unsafe, context-loss, file-refs-survived, live-gone.

This is a diagnostic scoring desk. Not an exploit. No secrets. No live Claude sessions. Score whether a partial "up to here" cut would leave prior summaries intact or already elided. Fixtures use the issue's cases A/B/C, the published `preservedMessages` count, and the published filter predicate only.

Hypothesis only (NON-BINDING): stop filtering `isCompactSummary` messages from the preserved suffix (keep filtering boundary markers only); or warn before discard. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92347](https://github.com/anthropics/claude-code/issues/92347)

What happened (from the issue — do not invent):

- Environment: Claude Code behavior read in v2.1.246; observed live on v2.1.246, v2.1.258 and v2.1.259. OS: Windows 11 Pro.
- Partial compaction **"Summarize up to here"** keeps everything after the anchor **except** prior compact summaries. Any earlier summary (e.g. from a previous "Summarize from here") that sits after the anchor is silently removed from the live context — it is neither summarized (it lies outside the summarized range) nor preserved (it is filtered out of the kept suffix). Everything that existed only inside that summary is lost, with no warning to the user or the model.
- "Summarize up to here" anchored at message X summarizes the range [start … X] and preserves [X … end]. When rebuilding the preserved suffix, the client filters out compact boundaries **and prior compact-summary messages** (entries with `type === "user"` and `isCompactSummary`).
- The entries remain in the session's `.jsonl` transcript file, but the live context loses them permanently. Since a summary is the **only in-context representative of hundreds of already-compacted messages**, dropping it deletes real information — decisions, task state, pending work — silently.
- Root cause (from the issue): the preserved-suffix reconstruction excludes entries matching compact boundaries and prior summary messages (predicate equivalent to `!isCompactBoundary(entry) && !(entry.type === "user" && entry.isCompactSummary)`). Excluding stale *boundary markers* makes sense; applying the same filter to *summary messages* deletes irreplaceable content.
- Expected: prior compact summaries located after the anchor should be preserved like any other post-anchor content — or, at minimum, the operation should warn that N earlier summaries will be discarded.
- Workaround: never anchor "up to here" before an existing summary; prefer `/compact` (absorbs every summary in context — verified) or "Summarize from here" (absorbs summaries after its anchor and keeps everything before it intact — verified).
- Reproduced: create "Summarize from here" near the end → then "Summarize up to here" on a message older than that summary's anchor → prior summary S is gone, with no warning.

Evidence cases from the issue (audited transcripts; no invented UUIDs):

| case | version / day | what the cut did |
|---|---|---|
| A | v2.1.246, Aug 31 | one "up to here" cut dropped **four** earlier "from here" summaries (04:14, 05:07, 06:52, 08:10). `preservedMessages` had 153 entries — none a summary. Re-attached file refs survived; summaries did not. |
| B | v2.1.259, Sep 4 | chain of four partials (two "from here", two "up to here") then a plain `/compact`: the two "up to here" cuts discarded **three** of the four summaries, so the final compaction only had one summary left to absorb. |
| C | v2.1.259, Sep 4 | "from here" preserved an initial summary before its anchor (UUID in the preserved-messages list); next "up to here" anchored before a "from here" summary did not — UUID missing from the rebuild list even though its position fell inside the preserved range. Session later reported only one summary. |

Verified across four cuts in three different sessions.

Suggested fix from the issue (document only): stop filtering `isCompactSummary` from the preserved suffix, or warn that N earlier summaries will be discarded. Keep filtering boundary markers.

## Why not a clone

This is specifically: **partial-compaction preserved-suffix filter / standing-summary elision during "up to here".**

NOT Oxbow — stranded meander / abandoned transcript branch. Elision is an active destructive filter on prior summaries during "up to here".
NOT Tabula — wax wipe on deep-link match. Elision is not a wax tablet.
NOT Ephemera — 5m ephemeral cache TTL rewrite. Elision is not a wick-lit folio.
NOT Lacuna / Palimpsest — different gathering/undertext paradigms. Elision is not a collation scrape or PreToolUse undertext.
NOT Graft/#92354 — plugin-cache copy-forward. Elision is not an orchard grafting bench.
NOT Sostenuto/#92360 — CoreAudio hold-to-talk freeze. Elision is not an ebony piano.
NOT Jetsam/#92338 — stale tracking-ref Stop hook. Elision is not a teak quay.
NOT Priory/#92345 — MSIX priconfig leak. Elision is not a limestone cloister.
NOT Oubliette — cold-parent child notices. Elision is not a stone pit.

Different surface: partial-compaction preserved-suffix filter vs those.

Cousins cite-only (NOT primary):

- [#83225](https://github.com/anthropics/claude-code/issues/83225) — partial compaction desktop UI (no Summarize in the app Rewind dialog; CLI trim ignored)
- [#92089](https://github.com/anthropics/claude-code/issues/92089) — second `/compact` re-appends history; transcript grows quadratically
- [#89281](https://github.com/anthropics/claude-code/issues/89281) — compaction summaries grow / inherit across the session boundary
- [#86359](https://github.com/anthropics/claude-code/issues/86359) — continuation bypasses CLAUDE.md in favor of the compaction summary
- [#90406](https://github.com/anthropics/claude-code/issues/90406) — auto-compact silent at ~1M tokens on large-context models

Backups (document only, do not auto-switch unless slug `elision` collides): [#92365](https://github.com/anthropics/claude-code/issues/92365) sandbox fail-open (non-string deny silently disables permissions); [#92353](https://github.com/anthropics/claude-code/issues/92353) UserPromptSubmit never fires Git Bash; [#92335](https://github.com/anthropics/claude-code/issues/92335) Chrome silent re-auth.

Product name stays **Elision**. Do not rename to Graft, Oxbow, Tabula, Ephemera, Lacuna, Palimpsest, Sostenuto, Jetsam, Priory, Oubliette, or any existing catalog slug.

Different UI: night copy-editor desk / cream folio + cobalt blue-pencil + scissors ‹…› + ink margins + lamp pool. Newsreader + Figtree + IBM Plex Mono. NOT Literata / DM Sans (Graft). NOT Fraunces / Outfit (Sostenuto). NOT Instrument Serif / Manrope (Jetsam). NOT Cormorant Garamond (Latchkey). Stay OFF orchard grafting / ebony piano / teak quay / limestone cloister / latchkey board / wax tablet / oxbow floodplain / wick-lit folio / stone pit.

Different verbs: Score the mark, pin idle intact, pin seeded elided, admit the folio already elided, load fixtures, reset to intact.

Different idle: **intact**. Different seeded: **elided**.

## Live catalog path

`/elision/` is this static blue-pencil scoring desk. Path `https://hermes-playground-green.vercel.app/elision/` and subdomain `https://elision.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `05:50 / hermes catalog #165 / #92347`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **elided** — "up to here" filter; prior summaries after the anchor gone; Case A four summaries dropped; 153 preservedMessages, none a summary.
2. Idle **intact** → prior compact summaries after the anchor stay in the kept suffix; idle word intact.
3. Desk UI: night walnut desk, lamp pool, cream folio, blue pencil, scissors elision marks, ink margins, summary gatherings, case A/B/C table, shipped / keep-summaries / warn-discard paths. Elided = standing summary cut from the kept suffix. Intact = STET on the post-anchor gatherings.
4. Stay-off strip: Graft / Oxbow / Tabula / Ephemera / Lacuna / Palimpsest / Sostenuto / Jetsam / Priory / Oubliette. Primary stays #92347.
5. **Score the mark** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Desk simulator chips rewrite cut kind (up-to-here / from-here / compact) and whether prior summaries sit after the anchor.

## How to score

Open `projects/elision/index.html` in a browser, or serve the repo root and visit `/elision/` (Vercel rewrite → `/projects/elision`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **intact** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **elided**.
