# hermes-playground

An hourly catalogue of local-first instruments — clocks, boards, paste wells, a clause loupe, and one inventory cockpit — built as static HTML and kept on one desk.

Open the hub to browse fourteen prototypes. A tag constellation maps them in space by related tags; click a star to open it. Search by name, blurb, slug, or tag; search and tag compose with AND. Dated archive shelves group ships by day (20 / 19 / 18 Aug). A filtered desk is pasteable as `?q=` / `?tag=` / `?view=compact`. Press `/` to focus search; Escape clears filters.

This hour’s featured card is Clause Lens. The other thirteen stay first-class on the shelves. Product folders for the earlier ships are unchanged.

## Active products

- **Clause Lens** (featured this hour · 20 Aug 2026, 11:50 Sydney) — paste a signed clause and see auto-renew, assignment, and unilateral-change tripwires highlighted in place. `products/clause-lens/` · legal, paste, contracts
- **Twin Face** (archive · 20 Aug 2026, 09:50 Sydney) — one pasted timestamp decoded onto two analog faces, with a date-split flag and a compact hours/minutes delta. `products/twin-face/` · time, paste, clock
- **Quote Drift** (archive · 20 Aug 2026, 07:50 Sydney) — a two-well paste instrument for quote vs invoice: money delta and a stacked strip of matched / extra / missing. `products/quote-drift/` · ops, money, paste
- **Hold Stack** (archive · 20 Aug 2026, 06:50 Sydney) — a day-strip map of overlapping calendar holds, with lanes, heat, and a play-head you can scrub. `products/hold-stack/` · ops, calendar, overlap
- **Pager Face** (archive · 20 Aug 2026, 05:50 Sydney) — a 24-hour pager clock for on-call rotations: shift arcs, a now-hand, and who is inside their own quiet hours. `products/pager-face/` · ops, oncall, clock
- **Still Inside** (archive · 20 Aug 2026, 03:50 Sydney) — a leftover-access board for people who already left: badges, seats, break-glass keys, and a named revoker. `products/still-inside/` · ops, offboarding, access
- **Quiet Landing** (archive · 20 Aug 2026, 02:50 Sydney) — a landing clock for scheduled Slack and email: their timezone, their quiet hours, and pings that hit them asleep. `products/quiet-landing/` · ops, timezone, courtesy
- **Renew Trap** (archive · 20 Aug 2026, 01:50 Sydney) — a notice-window board for vendor auto-renewals: cancel-by dates, a named owner, and silence that still bills you. `products/renew-trap/` · ops, contracts, renewals
- **Reread Clock** (archive · 19 Aug 2026, 23:50 Sydney) — a half-life board for attestations that are still live while nobody has re-read the pack. `products/reread-clock/` · trust, half-life, attestation
- **Vouch Slip** (archive · 19 Aug 2026, 22:50 Sydney) — a named-owner attestation board for inbound skill packs: who read this pack, and who owns what it does. `products/vouch-slip/` · trust, attestation, inbound
- **Unseen Ink** (archive · 19 Aug 2026, 21:50 Sydney) — a local inspector for inbound hidden Unicode in PRs, READMEs, and skill files. `products/unseen-ink/` · unicode, inbound, review
- **Skill Clash** (archive · 19 Aug 2026, 20:50 Sydney) — a collision board for stacked agent skills: MUST/NEVER contradictions, overlapping domains, injection-shaped lines. `products/skill-clash/` · skills, collision, review
- **Ghost Briefs** (archive · 19 Aug 2026) — a fluency map of shipped subsystems: who can still brief each surface in ninety seconds, and which are ghosts after an agent-heavy week. `products/ghost-briefs/` · fluency, ownership, handoff
- **Reorder Radar** (archive · 18 Aug 2026) — a local inventory cockpit for pop-up shops and kiosks: low-stock SKUs, a buy-now queue, reorder quantities and lead days. `products/reorder-radar/` · inventory, ops

## Research signal

The GitHub feed is agent harnesses — skill packs, token compression, graphs. This catalogue is the other desk: human-ops instruments that sit beside that feed. Clocks, leftover-access boards, paste wells, fluency maps. Local-first, no backend, no new cron.

## Repository shape

- `index.html` — searchable catalogue hub (tag constellation, this hour vs dated archive shelves, live search, tags, URL-persisted `q` / `tag` / `view`)
- `products/clause-lens/` — featured this-hour product prototype
- `products/twin-face/` — archive product prototype
- `products/quote-drift/` — archive product prototype
- `products/hold-stack/` — archive product prototype
- `products/pager-face/` — archive product prototype
- `products/still-inside/` — archive product prototype
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

Each hourly run logs headless checks in `runs/`.
