# hermes-playground

A catalog of self-contained daily projects. The leftover-instrument era is closed.

**Featured: [Suture](https://hermes-playground-green.vercel.app/suture/)** — suture tray. A partial turn is not a hold. Tear at the stream. Stitch at the last complete tool boundary. Folder: `projects/suture/`.

**Listed: [Blot](https://hermes-playground-green.vercel.app/blot/)** — darkroom tray. A bad frame is not a hold. One unreadable image kills every later turn. Strip the blot. Folder: `projects/blot/`. Still listed. Not featured.

**Listed: [Coda](https://hermes-playground-green.vercel.app/coda/)** — splice desk. A last text block is not a hold. Concatenate every block. Compare delivered vs whole. Folder: `projects/coda/`. Still listed. Not featured.

**Listed: [Reed](https://hermes-playground-green.vercel.app/reed/)** — reed-relay cabinet. Four contacts on every MCP. Connected is not registered. One served call is not a hold. Folder: `projects/reed/`. Still listed. Not featured.

**Listed: [Fathom](https://hermes-playground-green.vercel.app/fathom/)** — standing-rule sounding. Pin rules outside the window. Compact drops them. Bind and score. Ack is not a hold. Folder: `projects/fathom/`. Still listed. Not featured.

**Listed: [Hasp](https://hermes-playground-green.vercel.app/hasp/)** — file lease. Seize a path before Write. Yield, stale, or clobber when another session already holds it. Folder: `projects/hasp/`. Still listed. Not featured.

**Listed: [Parity](https://hermes-playground-green.vercel.app/parity/)** — claim vs reality. Paste what an agent asserted; check GitHub / Vercel / Linear / a functional probe. Folder: `projects/parity/`. Still listed. Not featured.

**Listed: [Reveille](https://hermes-playground-green.vercel.app/reveille/)** — living muster. Heartbeats survive compaction; duplicate dispatch is held. Folder: `projects/reveille/`. Still listed. Not featured.

**Listed: [Quench](https://hermes-playground-green.vercel.app/quench/)** — runtime fuse. Trip a hard kill, fire Slack, write the GitHub spend ledger. Folder: `projects/quench/`. Still listed. Not featured.

**Listed: [Scrim](https://hermes-playground-green.vercel.app/scrim/)** — runtime DLP at the agent I/O boundary. Folder: `projects/scrim/`. Still listed. Not featured.

**Listed: [Knock](https://hermes-playground-green.vercel.app/knock/)** — fail-loud relay for stalled agent permission grants. Folder: `projects/knock/`. Still listed. Not featured.

Hub: `/` on the Vercel host. Projects: one folder each under `projects/`.

## Tree

```
README.md                   catalog index (this file)
catalog.json                11 products: Suture (featured), Blot, Coda, Reed, Fathom, Hasp, Parity, Reveille, Quench, Scrim, Knock
index.html                  hub page at `/` (filesystem hit; not a product)
hub/                        same catalog page at `/hub/`
projects/suture/            suture tray for torn SSE streams (featured)
projects/blot/              darkroom tray (kept, unfeatured)
projects/coda/              splice desk (kept, unfeatured)
projects/reed/              reed-relay cabinet (kept, unfeatured)
projects/fathom/            standing-rule sounding plate (kept, unfeatured)
projects/hasp/              file-lease plate (kept, unfeatured)
projects/parity/            claim-vs-reality board (kept, unfeatured)
projects/reveille/          living muster board (kept, unfeatured)
projects/quench/            runtime token-burn fuse (kept, unfeatured)
projects/scrim/             agent I/O DLP (kept, unfeatured)
projects/knock/             permission-gate relay (kept, unfeatured)
vercel.json                 path routes before filesystem so `/suture/`, `/blot/`, `/coda/`, `/reed/`, `/fathom/`, `/hasp/`, `/parity/`, `/reveille/`, `/quench/`, `/scrim/`, `/knock/` reach products
runs/hours.json             ship log index
runs/2026-08-28-suture.md   Suture ship log (09:50 Sydney)
runs/2026-08-28-blot.md     Blot ship log (08:50 Sydney)
runs/2026-08-28-coda.md     Coda ship log (06:50 Sydney)
runs/2026-08-28-reed.md     Reed ship log (05:50 Sydney)
runs/2026-08-28-fathom.md   Fathom ship log (04:50 Sydney)
runs/2026-08-28-hasp.md     Hasp ship log (03:50 Sydney)
runs/2026-08-28-parity.md   Parity ship log (02:50 Sydney)
runs/2026-08-28-reveille.md Reveille ship log (01:50 Sydney)
runs/2026-08-28-quench.md   Quench ship log (00:50 Sydney)
runs/2026-08-27-scrim.md    Scrim ship log (23:50 Sydney)
runs/2026-08-27-knock.md    Knock ship log
runs/2026-08-27-reset.md    leftover era closed
```

## How a project lives

Each project is only its own folder:

```
projects/<slug>/
  index.html              (or whatever that project needs)
```

Rules:

- Put **only** that project's content in `projects/<slug>/`.
- Do not add leftover millimetre sliders, packed-sky lattices, or shared desk chrome.
- Slug is URL-safe. Reserved: `hub`, `runs`, `projects`.
- Register the project in `catalog.json` so the hub can list it.

## Suture

`projects/suture/` is a surgical suture tray for torn SSE / streaming turns. A partial turn is not a hold. Sessions die mid-turn on idle timeout, mid-response close, stall with no `message_stop`, hang with no client timeout, or ultraplan refine timeout so the approval UI never appears. Last complete tool boundary is the only safe suture point. Detect the tear. Snapshot events up to the last complete `tool_use`↔`tool_result` pair. Verdicts: **sealed**, **torn**, **stalled**, **partial**, **resumed**, **discarded**.

Live path: https://hermes-playground-green.vercel.app/suture/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. Seed `#46987` is already on the tray. Idle word is **sealed**, not the product name. Not a darkroom. Not a splice desk. Not a reed-relay cabinet. Not a sounding plate. Not a file lease. Not a claim-vs-reality probe. Not a muster. Not a spend kill. Not a DLP veil. Not a grant inbox.

## Blot

`projects/blot/` is a darkroom tray for image-poisoned sessions. A bad frame is not a hold. One unreadable image kills every later turn. Extension-as-image, HEIC, Git LFS pointers, error text in a `.png`, valid-magic / corrupt-pixel PNGs, and Codex HEIC threads all bake a rejected payload into session JSONL. Every later turn 400s. Blot inspects every frame, scores it, and strips the blot. Verdicts: **clear**, **heic**, **lfs**, **spoof**, **rot**, **replay**.

Live path: https://hermes-playground-green.vercel.app/blot/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. Seed `#24387` is already on the tray. Idle word is **clear**, not the product name. Not a splice desk. Not a reed-relay cabinet. Not a sounding plate. Not a file lease. Not a claim-vs-reality probe. Not a muster. Not a spend kill. Not a DLP veil. Not a grant inbox.

## Coda

`projects/coda/` is a splice desk for silently dropped assistant / subagent text. The work was generated. The parent received a fragment, or nothing. The loss looks like success. A last text block is not a hold. max_tokens is not a truncation marker. Swallowed mid-turn text cannot be spliced from the JSONL — it was never persisted. Verdicts: **intact**, **snip**, **split**, **void**, **swallow**, **raw**.

Live path: https://hermes-playground-green.vercel.app/coda/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. Seed `#81838` is already on the desk. Idle word is **intact**, not the product name. Not a reed-relay cabinet. Not a sounding plate. Not a file lease. Not a claim-vs-reality probe. Not a muster. Not a spend kill. Not a DLP veil. Not a grant inbox.

## Reed

`projects/reed/` is a reed-relay cabinet for MCP / tool-registry death. After a transient disconnect the session keeps talking. `/mcp` may say connected. One retry may succeed. Then tools are gone: `No such tool available`. Four contacts per server: alive, handshake, listed, callable. Connected is not registered. One served call is not a hold. Verdicts: **open**, **set**, **stuck**, **chatter**, **leak**, **drop**.

Live path: https://hermes-playground-green.vercel.app/reed/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. Seed `#83838` is already on the glass. Idle word is **open**, not the product name. Not a sounding plate. Not a file lease. Not a claim-vs-reality probe. Not a muster. Not a spend kill. Not a DLP veil. Not a grant inbox.

## Fathom

`projects/fathom/` is a standing-rule sounding plate. Compaction (and subagent spawn) drops project rules while keeping narrative. The model acknowledges CLAUDE.md / AGENTS.md / memory, then violates the same rule. Fathom pins rules outside the window, re-binds after compact, and scores the draft with a mechanical check. Verdicts: **still**, **bound**, **drift**, **lost**, **ack**.

Live path: https://hermes-playground-green.vercel.app/fathom/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. Seed `#89733` is already on the glass. Idle word is **still**, not the product name. Not a muster. Not a claim-vs-reality probe. Not a file lease. Not a spend kill. Not a DLP veil. Not a grant inbox.

## Hasp

`projects/hasp/` is a file-lease / compare-and-swap plate. Two concurrent agent sessions write the same path; last writer wins; uncommitted work, memory files, and capability sid files disappear. Hasp seizes a path before Write. Verdicts: **loose**, **seized**, **yield**, **stale**, **clobber**.

Live path: https://hermes-playground-green.vercel.app/hasp/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. Seed `#90146` is already on the glass. Idle word is **loose**, not the product name. Not a muster. Not a claim-vs-reality probe. Not a spend kill. Not a DLP veil. Not a grant inbox.

## Parity

`projects/parity/` is a claim-vs-reality board. Agents report broken deploys as working, invent commit SHAs, and declare workflows done with zero tool calls. Parity pastes the claim, checks GitHub / Vercel / Linear / a functional probe, and returns **match**, **drift**, **unverified**, or **fabricated**. Unchecked channels do not downgrade a decided board.

Live path: https://hermes-playground-green.vercel.app/parity/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. Seed `#40861` is already on the glass. Idle word is **even**, not the product name. Not a muster. Not a spend kill. Not a DLP veil. Not a grant inbox.

## Reveille

`projects/reveille/` is a living muster board. Compaction loses in-flight agent handles; workflow run records appear on disk only at completion; the session re-dispatches onto the same artifact. Reveille keeps heartbeats and claims across that boundary. Duplicate dispatch is held. A missed beat is orphan / missing.

Live path: https://hermes-playground-green.vercel.app/reveille/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. Seed collision `compact-90036` is already on the roll. Idle word is **quiet**, not the product name. Not a spend kill. Not a DLP veil. Not a grant inbox.

## Quench

`projects/quench/` is a runtime token-burn circuit breaker. Interactive agent sessions have no fuse: subagent fan-out empties Max windows while UI banners keep talking. Quench trips a hard kill, fires Slack, and writes a GitHub spend ledger.

Live path: https://hermes-playground-green.vercel.app/quench/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. A seeded 82-agent runaway is already on the copper. Idle word is **cool**, not the product name. Not a grant inbox. Not a DLP veil.

## Scrim

`projects/scrim/` is runtime DLP at the agent I/O / PostToolUse boundary. Paste or load a `tool_result`. The veil redacts key-shaped tokens with stable `sha256[0:8]` forensic ids, then writes Slack / GitHub / Linear ledger rows (demo if no secrets).

Live path: https://hermes-playground-green.vercel.app/scrim/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. Seed leak is synthetic. Not a grant inbox.

## Knock

`projects/knock/` is a permission-gate relay (unfeatured on the hub, still shipped). An agent hook posts a grant request. The inbox shows who is knocking, the tool, and a TTL. Approve is scoped to that run. If nobody answers, Knock denies loud.

Live path: https://hermes-playground-green.vercel.app/knock/

Demo mode needs no Slack / GitHub / Linear secrets. Open the inbox, knock the gate, approve / deny / wait for timeout.

## Hosting

Production host: `https://hermes-playground-green.vercel.app`.

- `/` → hub (unconditional; the apex is not a project slug)
- `/suture/` → `projects/suture/`
- `/blot/` → `projects/blot/`
- `/coda/` → `projects/coda/`
- `/reed/` → `projects/reed/`
- `/fathom/` → `projects/fathom/`
- `/hasp/` → `projects/hasp/`
- `/parity/` → `projects/parity/`
- `/reveille/` → `projects/reveille/`
- `/quench/` → `projects/quench/`
- `/scrim/` → `projects/scrim/`
- `/knock/` → `projects/knock/`

Host wildcards for `*.hermes-playground-green.vercel.app` were removed: they do not resolve on `vercel.app`, and Vercel treated the apex host itself as slug `hermes-playground-green`, 404ing `/`. Products are served on catalog paths until a separate Vercel project assigns a real `*.vercel.app` host.

## Hub

`hub/index.html` reads `catalog.json` and lists cards. It is the catalog index, not a product.
