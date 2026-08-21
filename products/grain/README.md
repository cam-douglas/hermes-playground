# Grain

A board looks ready until you see the grain. Move the cut. See the leftover mismatch.

This is not Offcut. Offcut is leftover millimetres after placing cuts on a stick. This is not Fold Sheet. Fold Sheet is creases on a page. This is not Sightline. Sightline is an eye line vs a partition. Grain answers “how far is the cut from the grain, and is that with, across, or against.”

## Problem

A board looks ready until you see the grain:

- which way do the fibres run?
- where does the saw sit?
- how many leftover degrees sit between the cut and the grain?
- is that with, across, or against — as a sketch, not a mill sign-off?

Existing tools in this catalogue place leftover millimetres on a stick, crease a sheet, and block an eye line. They do not show leftover mismatch on a plank.

## Users

- people who already know a board can look ready and still cut across the grain
- anyone who refuses to treat leftover millimetres, creases, or a partition as this leftover
- desks that want the mismatch as a picture, not a sign-off
- teams that want a no-backend, local-only pass — not a stock bar, not a fold, not a room

## Workflow

1. Load the seed: cut already across the grain at 64°, grain drifting 8°, leftover 56°
2. Read the plank: grain lines, a saw line, an arc naming the leftover
3. Move the cut (or use the arrow keys on the focused slider); the leftover names with / across / against
4. Drift the grain if you want the fibres to lean; it stays secondary
5. Reset restores the seeded across-cut

## Data model

One plank:

- `cut` — degrees of the saw line (default 64)
- `grain` — degrees of fibre direction (default 8)

Derived picture:

- leftover = smallest angle between cut and grain, folded to 0–90
- 0° is with the grain
- named stop: with (&lt; 18°), across (18–62°), against (&gt; 62°)
- the leftover is the mismatch, not leftover millimetres
- labelled as a sketch, not a mill sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a plank, grain lines, and a cut
- cut angle redraws the saw immediately; grain direction is secondary
- no network, no npm, no localStorage

## UX

- one plank, not a spreadsheet, not a Gantt, not a floor plan, not a stock bar, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a clock
- seeded demo already shows a cut across the grain
- live leftover degrees and a named stop
- keyboard moves the focused control
- SVG text alternative names the mismatch
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/grain/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (plank, grain, cut) is in the DOM
- seeded cut is across the grain (~64° on an 8° grain; leftover ~56°)
- changing the cut redraws the saw and updates the readout
- no paste-well hero, no leftover millimetres as the leftover, no creases, no partition
