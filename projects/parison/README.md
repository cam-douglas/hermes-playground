# Parison

A **glasshouse / glory-hole studio** — ember glory-hole orange, kiln brick, soot black, steel marver plate, cherry-red glass gather, lime-ash, iron tools, wet-wood blowpipe; EB Garamond + Mulish + IBM Plex Mono — for a real Agent SDK defect: **headless sessions on claude-fable-5 at xhigh effort with heavy parallel Task fan-out enter a permanent silent wedge**. Subagents complete real work (clearest occurrence: 256+ files of research output written to the workspace) but results are never reconciled back to the parent. The parent ledger keeps `activeTaskIds` full, `resultCount = 0`, `awaiting_post_task_result = true`. The SDK event stream stops entirely — no assistant messages, no task events, no activity pings — while the container stays healthy. No terminal `result` is emitted, so `total_cost_usd` is never reported. Reproduced 3 times across `@anthropic-ai/claude-agent-sdk` 0.3.197 and 0.3.251 (TypeScript), headless `query()`, streaming input, Bun 1.3.x, Linux Docker. Same harness/prompt/tools complete on claude-opus-5 and on non-Anthropic models.

Primary:

- [anthropics/claude-code#91037](https://github.com/anthropics/claude-code/issues/91037) (OPEN, bug, has repro, platform:linux, area:agents, area:agent-sdk, filed 2026-08-31T17:08:37Z). Title: [BUG] claude-fable-5 (xhigh): parent session permanently wedges — parallel subagent results never reconcile, event stream goes silent (repro 3x, 0.3.197 & 0.3.251).

A parison hung in the glory hole after the boys have already blown the piece is not a hold. Score the gather or admit **marvered**.

Idle word: **marvered**. Seeded state: **hung** / #91037 — occurrence 3 fingerprint: 34 active, 0 results, 256+ files, silent 900s, SDK 0.3.251. Never idle as hung / parison / glory / noria / dry / stilled / unpinned / cocked / rinsed / scrubbed / vacant / reserved / shed / clamped / sealed / torn / cauterized.

A **parison** is the intermediate glass bubble on the blowpipe. Metaphor: the boys (subagents) already blew the piece (files exist) but the parison hangs in the glory hole and never reaches the punty / gaffer (parent ledger). A hung parison is not a hold. Score the gather or admit marvered.

- **hung** = #91037 primary: parent wedged, results 0, files exist, stream silent
- **silent-stream** = event stream stopped, container healthy
- **unreconciled** / **ledger-full** / **zero-results** / **awaiting-post** = `activeTaskIds` full, `resultCount` 0, `awaiting_post_task_result` true
- **files-written** = 256+ files exist while parent has 0 results (occurrence 3)
- **cost-unreported** = no terminal result ⇒ `total_cost_usd` never emitted
- **fable-xhigh** / **sdk-wedge** = Fable 5 xhigh + Agent SDK 0.3.197 / 0.3.251
- **marvered** = HOLD: parent received results, stream live, cost reported, ledger settled
- **transferred** = HOLD: parison taken onto the punty; parent has results matching files
- **opus-holds** = same harness completes on opus-5 (contrast chip, not the idle word)

Verdicts: hung, silent-stream, unreconciled, ledger-full, zero-results, files-written, cost-unreported, fable-xhigh, sdk-wedge, awaiting-post, marvered, transferred, opus-holds.

Hypothesis only (NON-BINDING): treat this as a parent-side result-reconciliation wedge on Fable-5 xhigh parallel Task fan-out in the Agent SDK. Children finish (files on disk); the parent ledger never advances; the event stream goes silent; cost is never reported. Do not claim a root cause in Claude Code or SDK source you have not seen.

## Why not a clone

This is specifically: **PARENT-SIDE RESULT RECONCILIATION FAILURE FOR PARALLEL TASK SUBAGENTS ON FABLE-5 XHIGH IN THE AGENT SDK — children finish (files on disk), parent ledger never advances, event stream goes silent, cost never reported.**

NOT **Suture** ([#46987](https://github.com/anthropics/claude-code/issues/46987) class) — SSE/stream tear of the main turn; last complete tool_use/tool_result boundary. Parison's stream is a silent parent with completed children, not a torn token stream.
NOT **Limpet** ([#89275](https://github.com/anthropics/claude-code/issues/89275)) — OS process still resident after end_turn / session marked done. Opposite polarity: Parison never gets a terminal result.
NOT **Reveille** — heartbeats survive compaction; duplicate dispatch held.
NOT **Hydra** — settings cut that regrows from a known settings ledger.
NOT **Almanac** — fired one-shot Loop ghost.
NOT **Cockade** ([#91033](https://github.com/anthropics/claude-code/issues/91033)) — undocumented ultracode arm + header xhigh mask.
NOT **Lye** ([#91020](https://github.com/anthropics/claude-code/issues/91020)) — `CLAUDE_CONFIG_DIR` subprocess scrub.
NOT **Advowson** ([#91005](https://github.com/anthropics/claude-code/issues/91005)) — Workflow name silent built-in.
NOT **Pawl** — sticky stop / wrong ratchet stroke.
NOT **Tappet** — hook spawn vs seated injection.
NOT **Leat** ([#90475](https://github.com/anthropics/claude-code/issues/90475)) — Bash guidance that promotes unbounded until-loops. Also: do not reuse Leat's mill-race UI or the banned name Noria.
NOT **#47936** — inverse: subagents stop early but are reported completed.
NOT **#59962** — broader in_progress leftover after completed work (cousin, not this product's primary).
NOT millimetre sliders, leftover woodworking, or clones of existing catalog folders.

Different UI: glasshouse / glory-hole shop. Ember orange, kiln brick, soot, steel marver, cherry-red gather, lime-ash, iron tools, wet-wood blowpipe. EB Garamond + Mulish + IBM Plex Mono. NOT Cockade Playfair / Nunito felt/crimson-silk. NOT Lye Libre Baskerville / Source Sans 3 wet-stone. NOT Puncheon Cinzel / Outfit walnut/gold. NOT Limpet / Advowson Cormorant. NOT Leat mill-race greens.

Different verbs: score the gather, pin idle marvered, pin seeded hung, admit marvered, load fixtures, reset to marvered. Not "Score the brim" / "Pin idle unpinned" / "Score the vat" / "Pin idle rinsed".

Different idle: **marvered**.

## Live catalog path

`/parison/` is this static glasshouse. Path `https://hermes-playground-green.vercel.app/parison/` and subdomain `https://parison.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `03:50 / hermes catalog #101 / #91037`.

1. Idle demo loads **marvered** — parent received results, stream live, cost reported, ledger settled.
2. Seed **hung** → #91037 occurrence 3: 34 active, 0 results, 256+ files, silent 900s, SDK 0.3.251.
3. Glory hole with a hanging parison (visible when hung, gone when marvered).
4. Steel marver + iron stamps for verdict chips.
5. Gaffer ledger board: active tasks vs resultCount vs files-written.
6. Event-stream plaque (live vs silent) and cost plaque (reported vs unreported).
7. **Score the gather** walks the ticket and lights chips on the marver.

## How to score

Open `projects/parison/index.html` in a browser, or serve the repo root and visit `/parison/` (Vercel rewrite → `/projects/parison`). No build step. Optional hook:

```bash
node projects/parison/hook/parison.mjs projects/parison/data/91037.json
node projects/parison/hook/parison.mjs projects/parison/data/marvered.json
node --test projects/parison/hook/parison.test.mjs
```

Hung seed → hung/alarm. Marvered seed → marvered/hold.

`projects/parison/hook/parison.mjs` classifies a gather/ledger trace JSON and returns `{ verdict, chips[], reasons[], hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91037.json`, `data/hung.json`, `data/marvered.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`. Evidence only from issue facts. No invented session IDs.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91037](https://github.com/anthropics/claude-code/issues/91037). Unauthenticated. See `.env.example`.
2. Glory hole / hanging parison / steel marver / gaffer ledger board.
3. Pin idle marvered / pin seeded hung / score the gather / admit marvered / load fixtures / reset to marvered.
4. Event-stream plaque (live vs silent; container healthy).
5. Cost plaque (reported vs unreported; no terminal result).
6. Gaffer ledger (active tasks vs resultCount vs files-written).

## Sources

- [anthropics/claude-code#91037](https://github.com/anthropics/claude-code/issues/91037) OPEN
- Cousins (cite, not primaries): [#47936](https://github.com/anthropics/claude-code/issues/47936) inverse polarity (closed); [#59962](https://github.com/anthropics/claude-code/issues/59962) leftover in_progress (closed); also [#37521](https://github.com/anthropics/claude-code/issues/37521) [#61547](https://github.com/anthropics/claude-code/issues/61547) [#28482](https://github.com/anthropics/claude-code/issues/28482).
