# hermes-playground

Daily product-catalogue loop for the Campbell playground.

The hub is a **catalogue desk**: live search, tags, this-hour vs archive, and **URL-persisted filters** (`?q=` / `?tag=`) over nine products. A filtered desk is pasteable.

## Active products

- **Still Inside** (featured this hour · shipped 20 Aug 2026, 03:50 Sydney) — a local leftover-access board for people who already left. Badges, seats, and break-glass keys stay live after the HR ticket closes. A named revoker, and the red rail of “they can still get in.” Access after exit, not fluency. Tags: ops, offboarding, access.
  - Path: `products/still-inside/`
  - Live page: `/products/still-inside/`
- **Quiet Landing** (archive · 20 Aug 2026, 02:50 Sydney) — a local landing clock for scheduled Slack and email. A send, their timezone, their quiet hours, and the red rail of pings that hit them asleep. Timezone courtesy, not money. Tags: ops, timezone, courtesy.
  - Path: `products/quiet-landing/`
  - Live page: `/products/quiet-landing/`
- **Renew Trap** (archive · 20 Aug 2026, 01:50 Sydney) — a local notice-window board for vendor auto-renewals. Cancel-by dates, a named owner, and the red rail of silence that still bills you. Contracts, not SKUs. Tags: ops, contracts, renewals.
  - Path: `products/renew-trap/`
  - Live page: `/products/renew-trap/`
- **Reread Clock** (archive · 19 Aug 2026, 23:50 Sydney) — a local half-life board for attestations that are still live while nobody has re-read the pack. Calendar expiry is the wrong signal. Trust decays by last open. Tags: trust, half-life, attestation.
  - Path: `products/reread-clock/`
  - Live page: `/products/reread-clock/`
- **Vouch Slip** (archive · 19 Aug 2026, 22:50 Sydney) — a local named-owner attestation board for inbound skill packs. Who read this pack, and who owns what it does? Tags: trust, attestation, inbound.
  - Path: `products/vouch-slip/`
  - Live page: `/products/vouch-slip/`
- **Unseen Ink** (archive · 19 Aug 2026, 21:50 Sydney) — a local inspector for inbound hidden Unicode in PRs, READMEs, and skill files. Lights ZWSP, bidi overrides, tag characters, and homoglyph-adjacent lookalikes instead of stripping them. Tags: unicode, inbound, review.
  - Path: `products/unseen-ink/`
  - Live page: `/products/unseen-ink/`
- **Skill Clash** (archive · 19 Aug 2026, 20:50 Sydney) — a local collision board for stacked agent skills (`SKILL.md` / `AGENTS.md`). Flags MUST/NEVER contradictions, overlapping domains, and injection-shaped lines, then scores stack coherence. Tags: skills, collision, review.
  - Path: `products/skill-clash/`
  - Live page: `/products/skill-clash/`
- **Ghost Briefs** (archive · 19 Aug 2026) — a local, human-only map of which shipped subsystems still have a named person who can brief them. Tags: fluency, ownership, handoff.
  - Path: `products/ghost-briefs/`
  - Live page: `/products/ghost-briefs/`
- **Reorder Radar** (archive · 18 Aug 2026) — a lightweight inventory and replenishment cockpit for pop-up shops, kiosks, and small retailers. Tags: inventory, ops.
  - Path: `products/reorder-radar/`
  - Live page: `/products/reorder-radar/`

## Research signal

The feed is all agents (harnesses, skill packs, token compression, graphs). This hour does not add a tenth product. Nine prototypes, and a filter dies on refresh: persist search in `q` and the active tag in `tag` so a filtered desk is shareable. Still Inside stays featured. Distinct from cloning leftover access, another scanner, or a row-board.

## Repository shape

- `index.html` — searchable catalogue hub (this hour vs archive, live search, tags, URL-persisted `q` / `tag`)
- `products/still-inside/` — featured this-hour product prototype
- `products/quiet-landing/` — archive product prototype
- `products/renew-trap/` — archive product prototype
- `products/reread-clock/` — archive product prototype
- `products/vouch-slip/` — archive product prototype
- `products/unseen-ink/` — archive product prototype
- `products/skill-clash/` — archive product prototype
- `products/ghost-briefs/` — archive product prototype
- `products/reorder-radar/` — archive product prototype
- `runs/` — daily and hourly ship logs

## Verification

- Static site loads without a build step
- Catalogue links resolve to all nine product folders
- `/?q=unicode` on load shows Unseen Ink, hides Reorder Radar, and fills the search field
- `/?tag=inventory` on load shows only Reorder Radar with that tag active
- `/?q=skill&tag=review` ANDs (Skill Clash visible; Unseen Ink hidden)
- Typing a search updates `location.search` via `replaceState` (no extra history entries)
- Clearing filters restores all nine and strips the query string
- Empty query `/?q=zzzz-no-match` shows an empty state that names the query
- Copy desk link yields a URL containing the current `q` and/or `tag`
- Featured this-hour card for Still Inside
- All nine product pages still load
