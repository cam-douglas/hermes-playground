# Still Inside

A local leftover-access board for people who already left. Offboarding closes the HR ticket. Badges, seats, and break-glass keys stay live. This desk tracks who left, what still opens, a named revoker, and the red rail of “they can still get in.”

This is not Ghost Briefs. Ghost Briefs answers “who can still brief a subsystem.” Still Inside answers “what still opens after they left.” Distinct axis: physical and digital access after exit, not fluency. Not Renew Trap (vendor money). Not Quiet Landing (timezone courtesy).

## Problem

Exit tickets close. Access does not. A badge still beeps at the turnstile. A billed SaaS seat is still in the workspace. A break-glass SSH key and a VPN profile still authenticate. A shared 1Password vault still lists a leaver. Existing tools cluster around fluency maps, contract notice windows, dispatch clocks, and skill scanners. They do not answer:

- who left, and on which day?
- what kind of access is still live — badge, seat, key, VPN, vault?
- when was it last used?
- who is named to revoke it, or is the hook vacant?
- how many days has the oldest live grant been inside after exit?

## Users

- security and facilities owners who refuse “the ticket is closed”
- IT ops collecting leftover SaaS seats after a leaving week
- on-call leads who inherited a break-glass key that still works
- teams that need a no-backend leftover-access desk before the next badge swipe

## Workflow

1. Load the leftover-access board (open, lingering, revoked, ownerless)
2. Apply the demo fixture to put at least two open / ownerless grants on the red rail
3. Pick a row and name a revoker, or mark it revoked
4. Watch still-inside and ownerless counts fall
5. Export or import JSON
6. Reset restores the seed

## Data model

Each leftover grant tracks:

- `id`
- `person` — who left
- `leftOn` — exit date
- `kind` — `badge` | `seat` | `key` | `vpn` | `vault`
- `system` — the door, seat, host, network, or vault that still opens
- `lastUsed`
- `revoker` — named human, or vacant
- `revoked` — true when the grant was pulled

Derived values:

- `daysSinceExit` — days from `leftOn` to today
- `status` — `revoked` | `ownerless` (no named revoker, still live) | `lingering` (last-used after exit) | `open`
- `still-inside count` — `open` + `lingering`
- `ownerless count` — vacant revoker, still live
- `oldest live grant` — largest `daysSinceExit` among grants that are not revoked

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- `localStorage` persistence for the access desk
- JSON export / import for a portable copy
- leftover status derived in the browser from exit date, last-used, revoker, and revoked

## UX

- security / ops access desk (badge reader, key hooks, amber LED — not a fluency dossier, not a night-sky clock, not a finance renewals desk)
- live clock and acting-as revoker field
- still-inside count, ownerless count, and days since the oldest live exit
- red “they can still get in” rail
- row board: person (left-on), access kind, system, last-used, named revoker (or vacant), status
- name a revoker, mark revoked, demo fixture, and one-click seed reset

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/still-inside/`

## Verification

- page loads in a browser without build tooling
- demo fixture produces at least two open / ownerless grants on the rail
- naming a revoker drops ownerless count; marking revoked drops still-inside count
- refresh keeps the board
- export / import round-trips the same state
- reset restores the seed
