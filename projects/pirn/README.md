# Pirn

Weaver's pirn / bobbin-winder / loom-side yarn-package desk for a real Claude Code failure class: **instruction-shaped pattern truncation of subagent `idle_notification` reports**, then the harness's own "ask via SendMessage" advice that **re-runs the agent at full cost and truncates again**.

A first delivery is not a hold. Score the pirn or admit **beamed**.

Idle word: **beamed** (full report wound onto the pirn without cut; no instruction-shaped tag; single delivery; charCount below cap; runs=1).
NEVER use the product name pirn / empty / truncat* / crop / snip / cut as the idle/state word.
NEVER reuse prior idles: snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised.

Verdicts: **beamed**, **cropped**, **thrice**, **tagged**, **looped**, **midcut**. Slack alarm on cropped / thrice / tagged / looped / midcut. Linear ticket on cropped / thrice. GitHub pirn-ledger of scored pirns on every score.

The #90544 cropped (harness tagged `settings-json` AND result truncated at ~2500 with "ask via SendMessage") is **cropped**, never **beamed**, even when the green idle/complete lamps stay lit.

## Why not a clone

NOT **Shunt** (#90463) — nested SendMessage follow-up **misrouted to root**; return path closed. Pirn is delivery-layer **truncation** of a report that DID arrive on the parent, plus costly re-run loop. Same tool name, different failure class.
NOT **Cote** — resume hub identity split / success receipts that never roost.
NOT **Husk** — hollow SUCCESS envelopes with empty result.
NOT **Coda** — silently dropped assistant text blocks.
NOT **Aside** — /btw silent truncation.
NOT **Suture** — stream-tear / partial turn.
NOT **Cotter** — poison fireAt registry schema.
NOT Fob / Ordo / Cinch / Ullage / Visa / Sprag / Lazaret / Fusee / Quench / Reveille / Scrim / Knock / Pleat / Scant / Chad / Sump / Leat / Iota.
NOT leftover woodworking / millimetre-slider products.
Do NOT ship alternate names Crop, Snip, Quill, Nib, Trunc, Catch, Kerf, Stump, Bobbin, Shuttle, Thrum, Selvedge, Ravel, Clew (Shunt banned several of these as alt names). Product name is **Pirn** only.

Different problem: INSTRUCTION-SHAPED FALSE-POSITIVE → HARD CAP ~2.5k ON SUBAGENT REPORT → "FIX" THAT RE-RUNS AT FULL COST AND HITS THE SAME CAP.
Different UI: weaver's pirn-winder / loom bench — oak frame, wound yarn packages, scissors that cut mid-pick, thrice-rewound costly reels, a harness tag glowing on the pirn that mentioned settings-json, lying green "agent idle / complete" lamps.
Different idle word: **beamed**.

## Live catalog path

`/pirn/` is this static weaver's pirn-winder bench. Oak frame, wool packages, brass scissors, numbered slots, glowing harness-tag ribbon, thrice-rewound costly reels, lying green lamps. Demo works with no secrets and no npm. Mark: `19:50 Sydney · pirn`.

1. Seeded `#90544` **cropped** is already on the bench: harness tagged `settings-json`, result cut at 2500 with "ask via SendMessage" → **cropped**.
2. Switch **thrice** — same truncated report after ≥3 full agent runs → **thrice**.
3. Switch **tagged** — instruction-shaped prefix present, length not yet measured → **tagged**.
4. Switch **looped** — SendMessage re-ask caused a full transcript resume → **looped**.
5. Switch **midcut** — truncation cuts mid-sentence / mid-section → **midcut**.
6. Switch **control beamed** — full report, no tag, single delivery → **beamed**.
7. Switch **Reset · beamed** — idle bench → **beamed**. Idle word is **beamed** when the bench is reset. One beamed pirn stays on the oak; never an empty or error state.
8. **Score** scores. **Admit beamed** scores honestly. **Reset · beamed** returns idle beamed. **Restore · cropped** shows the #90544 pirn. Admit does not lie: a cropped/thrice pirn stays cropped/thrice.

## Hook

`projects/pirn/hook/` scores a probe `{ session, issue, source, harnessTag, instructionShaped, resultChars, capChars, truncated, truncationMarker, midSentence, runs, reRun, fullReportProduced, deliveredToParent, sonnetControlOk, filePathWorkaround, agentIdleGreen, scored }` and returns `{ verdict, reasons[], beamed }`. See `hook/README.md`.

```bash
node projects/pirn/hook/index.mjs --listen 9090
node --test projects/pirn/hook/pirn.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90544](https://github.com/anthropics/claude-code/issues/90544) — subagent final report delivered as `idle_notification` is truncated at ~2,500 chars whenever the harness tags output as "instruction-shaped pattern" (e.g. `settings-json` when the report mentions `~/.claude.json` / `.mcp.json`). Prefix: `[harness: subagent output matched instruction-shaped pattern(s): settings-json. ...]`. Suffix: `[result truncated — ask the agent for the rest via SendMessage]`. Parent SendMessage re-ask **resumes the subagent on its full transcript** (full re-run). Resent report truncated again at the same point. One ~1,500-word / 10-section report took **three Opus 5 runs** (~3× cost). WSL2, Claude Code 2.1.251. Parent Fable 5; subagent Opus 5. Sonnet 5 control was NOT truncated.

Same-class / shape (not new primaries):

- [anthropics/claude-code#74113](https://github.com/anthropics/claude-code/issues/74113) — agents go idle WITHOUT delivering the report; re-ping recovers it. HERE the report IS delivered but the harness cuts it; re-ping does not recover the missing tail.
- [anthropics/claude-code#86471](https://github.com/anthropics/claude-code/issues/86471) — agents complete with empty/partial output. HERE the agent produced the full output; the delivery layer removed it.
- [anthropics/claude-code#77112](https://github.com/anthropics/claude-code/issues/77112) — `claude -p` stdout silently truncated at 65536 bytes (pipe buffer). Different layer (CLI stdout), same class of silent cut.
- [anthropics/claude-code#75298](https://github.com/anthropics/claude-code/issues/75298) — "Truncated event message received" on Bedrock streams. Different (stream event), cite as nearby shape only.

Cross-check nearby bugs are DIFFERENT (cite only as “not this”):

- NOT Shunt / [anthropics/claude-code#90463](https://github.com/anthropics/claude-code/issues/90463) nested SendMessage follow-up misrouted to root.
- NOT Cote resume hub identity split.
- NOT Husk hollow SUCCESS envelopes.
- NOT Coda silently dropped assistant text.
- NOT Aside `/btw` silent truncation.
- NOT Suture stream-tear / partial turn.
- NOT Cotter poison `fireAt` registry schema.

Cross-ecosystem (real cost-multiplier / silent drop shape, not a new primary):

- [openai/codex#34468](https://github.com/openai/codex/issues/34468) — incorrect default parent behavior managing background agents → unnecessary rate-limit/token consumption.
- [openai/codex#37822](https://github.com/openai/codex/issues/37822) — spawn_agent / followup_task payload never reaches sub-agent (`encrypted_content` dropped).
