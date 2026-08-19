# Quiet Landing

A local landing clock for scheduled Slack and email sends that are timestamped in the sender’s zone. Recipients eat 2am pings. This desk tracks a send, their timezone, their quiet hours, and the red rail of “this hits them asleep.”

This is not Renew Trap. Renew Trap answers “which contracts will charge if nobody cancels.” Quiet Landing answers “does this ping land in their workday, or while they are asleep.” Distinct axis: timezone courtesy, not money. Not a skill/attestation tool.

## Problem

Scheduled sends inherit the sender’s clock. A 02:50 Sydney queue looks fine on the composer and lands as lunch, evening, or 2am on the other side. Quiet hours and weekends are local to the recipient. Existing tools cluster around contract notice windows, half-life labs, wax-seal clerks, and skill scanners. They do not answer:

- what local time does this send actually land?
- is that inside their quiet hours (default 22:00–07:00)?
- does it hit their Saturday or Sunday?
- which queued pings have no timezone at all?
- when is the next open window for this person?

## Users

- ops owners who refuse 2am Slack in someone else’s zone
- on-call leads sending pager follow-ups across Berlin / Tokyo / NYC
- anyone composing “quick FYIs” from Sydney into a workday they cannot see
- teams that need a no-backend courtesy clock before the next scheduled blast

## Workflow

1. Load the dispatch board (ok, quiet, weekend, unknown-zone, held)
2. Apply the demo fixture to put at least two quiet / weekend hits on the red rail
3. Pick a row and hold it (do not send), or retarget to the next open window
4. Watch quiet-hit count fall; set or clear a zone on unknown rows
5. Export or import JSON
6. Reset restores the seed

## Data model

Each queued send tracks:

- `id`
- `title` — the send, e.g. ship notes to NYC
- `fromZone` — IANA zone the schedule is composed in (Sydney default)
- `toPerson` — named recipient
- `toZone` — IANA zone, or empty when unknown
- `quietStart` / `quietEnd` — local window, default `22:00` / `07:00`
- `scheduledAt` — wall time in `fromZone` (`YYYY-MM-DDTHH:MM:SS`)
- `held` — true when the operator pulled it off the wire

Derived values:

- `landsAt` — the same instant formatted in `toZone`
- `status` — `held` | `unknown-zone` | `weekend` (Sat/Sun local) | `quiet` (inside quiet hours) | `ok`
- `quiet-hit count` — queued rows whose status is `quiet` or `weekend`
- `unknown-zone count` — rows with no `toZone`, not held
- `next-safe-send` — earliest next open window (weekday, outside quiet hours) among quiet/weekend hits

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- `localStorage` persistence for the dispatch desk
- JSON export / import for a portable copy
- landing times computed in the browser from IANA zones (`Intl`), not copied from the sender clock

## UX

- night-sky dispatch clock (meridian ticks, cyan open / magenta asleep — not a finance ledger, not an inventory cockpit, not a wax seal)
- live Sydney clock and 24-hour landing dial
- quiet-hit count, unknown-zone count, and next-safe-send suggestion
- red “this hits them asleep” rail
- row board: send, from-zone, to-person, to-zone, quiet hours, scheduled-at, lands-at local, status
- hold, retarget to next open window, set / clear zone, demo fixture, and one-click seed reset

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/quiet-landing/`

## Verification

- page loads in a browser without build tooling
- demo fixture produces at least two quiet / weekend hits on the rail
- holding or retargeting to the next open window drops quiet-hit count
- a NYC row scheduled 02:50 Sydney shows a computed New York local time, not a copy of 02:50
- refresh keeps the board
- export / import round-trips the same state
- reset restores the seed
