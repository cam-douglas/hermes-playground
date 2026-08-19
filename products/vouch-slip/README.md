# Vouch Slip

A local, named-owner attestation board for inbound skill packs. Anyone can drop a `SKILL.md` into a stack. Unseen Ink shows hidden glyphs; Skill Clash shows contradictions. This page asks the quieter question: who read this pack and will own what it does?

## Problem

Skill files arrive from gists, vendors, and mystery pastes. Reviewers can inspect bytes and clash rules, then still merge a pack that nobody will be paged for. Existing tools cluster around strippers, collision boards, fluency maps, and inventory. They do not answer:

- who vouches for this inbound pack, by name?
- what do they believe it is allowed to do?
- what will they be paged for if it misbehaves?
- which slips are unsigned, expired, or revoked?

## Users

- engineers reviewing inbound `SKILL.md` / `AGENTS.md` fragments
- on-call owners who refuse anonymous packs
- teams stacking third-party skills after a gist dump
- anyone who needs a no-backend, named attestation before a pack stays armed

## Workflow

1. Load the inbound slip board (mix of live, expiring, unsigned, expired, revoked)
2. Apply the demo fixture to put at least two unsigned / expired orphans on the red rail
3. Pick a slip, sign as a named human, and file a two-sentence vouch
4. Watch unsigned count fall and coverage rise when a live named vouch lands
5. Revoke or renew a slip; export or import JSON
6. Reset restores the seed

## Data model

Each inbound slip tracks:

- `id`
- `name`
- `source`
- `firstSeen`
- `vouchedBy` (optional)
- `vouchedOn` (optional)
- `expiresOn` (optional)
- `revoked`
- `allowed` — what the signer believes the pack is allowed to do
- `pagedFor` — what the signer will be paged for if it misbehaves

Derived values:

- `status` — `unsigned` | `live` | `expiring` | `expired` | `revoked`
- `unsigned count` — slips with no named signer
- `expired count` — slips past `expiresOn` and not revoked
- `coverage score` — share of packs that currently hold a live named vouch (`live` or `expiring`)

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- `localStorage` persistence for slips and signer
- JSON export / import for a portable copy
- deterministic status and coverage scoring

## UX

- wax-seal clerk desk (vermillion stamps, brass live marks — not a Ghost Briefs dossier and not a Skill Clash fuse box)
- signer field and live clock
- unsigned count, expired count, and coverage score
- red unsigned / expired rail
- perforated slip cards with vacant-or-named vouches
- inspector for the two-sentence attestation
- revoke, renew, demo fixture, and one-click seed reset

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/vouch-slip/`

## Verification

- page loads in a browser without build tooling
- demo fixture produces at least two unsigned / expired orphans on the rail
- filing a named vouch drops unsigned count and raises coverage
- refresh keeps slips and signer
- export / import round-trips the same state
- reset restores the seed
