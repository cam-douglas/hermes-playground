# Squeeze

The joint is closed, but the squeeze-out still sits along the seam. Move the leftover glue squeeze-out. See the residual bead still sitting immediately outside a closed joint after clamping.

This is not Drip. Drip is leftover vertical run in figure. This is not Bead. Bead is leftover round moulding on an edge. This is not Stain. Stain is leftover wash on a face. This is not Shoulder. Shoulder is leftover bearing face at a joint. This is not adhesive advice. This is not a mill sign-off. Squeeze answers “how much leftover glue squeeze-out still sits outside a closed seam.”

## Problem

The joint is closed, but the squeeze-out still sits along the seam:

- how much leftover glue still sits immediately outside a closed joint after clamping?
- is the leftover wiped, or showing?
- when is the leftover squeeze obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover vertical runs, leftover round moulding, leftover wash, leftover joint geometry, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover squeeze — leftover glue squeeze-out that remains outside a closed joint after clamping, leftover irregular translucent bead sitting immediately outside a fixed closed seam, not Drip leftover run, not Bead leftover round.

## Users

- people who already know a closed, clamped joint can still leave leftover glue sitting outside the seam
- anyone who refuses to treat a dripping run, a decorative round bead, a stain wash, a packed sky, or a clock as this leftover
- desks that want squeeze as a sketch, not a mill sign-off, and not adhesive advice
- teams that want a no-backend, local-only pass — not Drip, not Bead, not Stain, not a paste well

## Workflow

1. Load the seed: 6 mm of leftover squeeze — already showing, not a wiped-only joint
2. Read the scene: two fixed joined boards, a closed seam, a leftover whose leftover is the squeeze, leftover labelled as a sketch
3. Move leftover squeeze (or use the arrow keys on the focused slider); leftover names showing or wiped
4. Drop the leftover toward 0 mm and the seam looks wiped / no leftover squeeze; raise it and a wider irregular glue bead still sits immediately outside a fixed closed seam
5. Reset restores the seeded leftover showing

## Data model

Two fixed joined boards with leftover squeeze as leftover glue squeeze-out that remains outside a closed joint after clamping:

- `squeeze` — millimetres of leftover seam bead width (default 6)

Derived picture:

- leftover labelled as a sketch (wiped / showing), not a mill sign-off
- leftover squeeze labelled as a sketch
- wiped / no leftover squeeze when squeeze ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: two fixed joined boards with a closed seam — a leftover whose leftover is the squeeze; leftover is leftover irregular translucent glue bead sitting immediately outside the closed seam (not a dripping run, not a decorative round bead, not a wash)
- moving a control redraws the leftover immediately; the seam and the two boards do not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover irregular glue bead sitting immediately outside a fixed closed seam, not a run as the hero, not a moulding as the hero, not a wash as the hero, not a clock
- seeded demo already shows a visible leftover (not a wiped-only joint)
- live leftover squeeze, leftover labelled as a sketch (wiped / showing)
- keyboard moves the focused control
- SVG text alternative names whether the squeeze is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/squeeze/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (two joined boards / leftover irregular glue bead outside a fixed closed seam) is in the DOM
- seeded leftover is visible (showing — not wiped)
- changing a control redraws and updates the readout; the seam stays closed and fixed
- empty state is named wiped — not “squeeze”
- no paste-well hero, no drip as the hero, no decorative bead as the hero, no clock face
