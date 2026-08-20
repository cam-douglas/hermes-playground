# Claim Scale

Two claims sit in a thread. The weight lives on the beam. Put them on the pans. See the tilt.

This is not Skill Clash. Skill Clash is a collision board of MUST/NEVER. This is not Quote Drift. Quote Drift is two paste wells. This is not Kit Weight. Kit Weight is grams in a bag. Claim Scale answers “which side of the thread is heavier, and which way does the beam go.” Not a board. Not a paste. Not grams of kit.

## Problem

Two claims sit in a thread. The weight lives on the beam:

- what evidence sits on the left?
- what evidence sits on the right?
- which side is down?
- how far does the beam tip before it is obvious?

Existing tools in this catalogue map leftover grams in a bag, leftover millimetres on a stick, and creases on a sheet. They do not put claims on a beam.

## Users

- people arguing two sides of a ship thread who already know the claims and need the tilt visible
- anyone who refuses to treat a paste of arguments as the product
- desks that want the weight as a picture, not a scorecard
- teams that want a no-backend, local-only pass — not a board, not a paste well, not a bag of grams

## Workflow

1. Load the seed: a beam already carrying a partial, slightly tipped load
2. Read the scale: left pan, right pan, live totals, which side is down
3. Click Left or Right on a tray claim to send it onto a pan
4. Click a claim on a pan to return it to the tray
5. The beam rotates with (right weight − left weight), clamped so it stays in frame
6. Adding one custom claim (short label + weight 1–5) is a secondary control

## Data model

Each claim:

- `id` — stable local id
- `label` — short claim
- `weight` — evidence weight 1–5
- `side` — `tray` | `left` | `right`

Derived picture:

- left weight, right weight
- delta (right − left)
- which side is down (or level)
- beam angle, clamped at a maximum so the pans do not leave the frame

Nothing is persisted. Refresh restores the seeded partial load.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG balance beam with a fulcrum and two pans
- rotation maps to (right weight − left weight); neutral is level
- no network, no npm, no localStorage

## UX

- one beam, not a spreadsheet, not a Gantt, not a floor plan, not a stock bar, not a bag, not a crease diagram, not a two-column paste
- tray of seeded short claims; two actions send a claim left or right
- click a pan claim to return it
- live left weight, right weight, delta, and which side is down
- overwhelming tilt is visually obvious; the beam is clamped
- keyboard sends the focused claim left / right or returns it
- SVG text alternative reports left/right totals and which side is down
- seeded partial load is already a picture on load

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/claim-scale/`

## Verification

- page loads in a browser without build tooling
- one SVG beam with pans is in the DOM
- seeded load is not level
- moving a tray claim onto a pan changes the tilt
- returning it restores the previous tilt
- live left/right totals are visible
- no paste-well hero, no MUST/NEVER board, no bag of grams
