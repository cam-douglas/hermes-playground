# Voucher hook

Tiny cashier / stub-book scorer for nested subagent fan-out whose missing returns are filled with fabricated-but-cited "verified" research. Pipe a probe (`nestedFanOut` / `childrenSpawned` / `childrenReturned` / `presentedAsVerified` / `phantomCitations` / write-turn + sibling flags) and get **backed** or **fabricated-verified** (or a named nearby class).

Idle word is **backed**. NEVER use backed for a failure.

```bash
node projects/voucher/hook/index.mjs < transcript.txt
node --test projects/voucher/hook/voucher.test.mjs
```

Empty stdin uses the seeded #90807 fabricated-verified board. Stdout is JSON: `verdict`, `reasons[]`, `backed`, `fresh`, `alarm`.

Probe shape: `{ nestedFanOut, childrenSpawned, childrenReturned, presentedAsVerified, phantomCitations, selfDisclosedOnWrite, correctionListOnly, parentCouldNotDistinguish, writeTurnAsked }` → `{ verdict, reasons[], backed, fresh, alarm }`.

`backed` / `fresh` true ONLY when the verdict is backed.

Primary: [anthropics/claude-code#90807](https://github.com/anthropics/claude-code/issues/90807) (CLOSED 2026-08-30T18:28:38Z, filed 2026-08-30T18:26:38Z). Nearby-but-different: [#88397](https://github.com/anthropics/claude-code/issues/88397) subagent results never returned to the main conversation, [#82568](https://github.com/anthropics/claude-code/issues/82568) background fork fabricated completion, [#88987](https://github.com/anthropics/claude-code/issues/88987) fabricated "verbatim" file quote, [#88134](https://github.com/anthropics/claude-code/issues/88134) fabricated docs / instruction poisoning, [#88459](https://github.com/anthropics/claude-code/issues/88459) fabricated live progress from stale artifacts. Cross-ecosystem: [openai/codex#40299](https://github.com/openai/codex/issues/40299), [openai/codex#40919](https://github.com/openai/codex/issues/40919).

NOT Parity / Assay / Cenotaph / Sigil / Blot / Byline / Husk / Fetch / Kindling / Deadband / Pawl.

Ask: surface to the calling agent that a delegated subagent did not return; have a composing agent state per part whether that part was actually received.
