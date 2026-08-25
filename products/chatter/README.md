# Chatter

A face looks smooth until you see the chatter. Move the ripple. See the leftover washboard from the cut.

This is not Tearout. Tearout is leftover splinter that still sits at the cut. This is not Mottle. Mottle is leftover blotch that still sits in the figure. This is not Quilt. Quilt is leftover blister that still sits in the figure. This is not Check. Check is leftover split that still opens in a face. This is not Drip. Drip is leftover run that still sits on the face. This is not Housing. Housing is leftover recess that still sits across the face. This is not a cut-list. This is not a paste well. This is not a clock. Chatter answers “how much leftover ripple still sits from the cut.”

## Problem

A face looks smooth until you see the chatter:

- how much leftover ripple still sits from the cut as washboard from the cutter?
- is the leftover smooth, or showing?
- when is the leftover chatter obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover torn fibres at a cut, leftover blotch in the figure, leftover blister in the figure, leftover split in a face, leftover run on the face, leftover recess across the face, leftover millimetres of stock, leftover paper creases, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover chatter — leftover washboard still sitting from the cutter, leftover ripple still sitting from the cut, not Tearout leftover splinter at a cut, not Mottle leftover blotch in the figure, not Quilt leftover blister in the figure, not Check leftover split in a face.

## Users

- people who already know a face can look smooth until the leftover ripple shows from the cut
- anyone who refuses to treat a tearout splinter, a mottle blotch, a quilt blister, a check split, a housing recess, a packed sky, or a clock as this leftover
- desks that want chatter as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Tearout, not Mottle, not Quilt, not Check, not a paste well

## Workflow

1. Load the seed: 10 mm of leftover ripple — already showing, not a smooth-only face
2. Read the scene: one face, a leftover whose leftover is the chatter, leftover labelled as a sketch
3. Move leftover chatter (or use the arrow keys on the focused slider); leftover names showing or smooth
4. Drop the leftover toward 0 mm and the face looks smooth / no leftover chatter; raise it and a taller leftover ripple still sits from the cut
5. Reset restores the seeded leftover showing

## Data model

One face/cut with leftover chatter as leftover washboard that still sits from the cutter:

- `chatter` — millimetres of leftover ripple (default 10)

Derived picture:

- leftover labelled as a sketch (smooth / showing), not a mill sign-off
- leftover ripple labelled as a sketch
- smooth / no leftover chatter when ripple ≤ 2 mm (the face looks smooth, no leftover ripple)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one face in cut — a leftover whose leftover is the chatter; leftover is leftover washboard still sitting from the cutter (not a tearout splinter at a cut, not a mottle blotch, not a quilt blister, not a check split)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover washboard still sitting from the cutter of one face, not a tearout splinter as the hero, not a mottle blotch as the hero, not a quilt blister as the hero, not a check split as the hero, not a housing recess as the hero, not a clock
- seeded demo already shows a visible leftover (not a smooth-only face)
- live leftover chatter, leftover labelled as a sketch (smooth / showing)
- keyboard moves the focused control
- SVG text alternative names whether the chatter is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/chatter/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one face / cut / leftover chatter) is in the DOM
- seeded leftover is visible (showing — not smooth)
- changing a control redraws and updates the readout
- no paste-well hero, no tearout splinter as the hero, no mottle blotch as the hero, no quilt blister as the hero, no check split as the hero, no clock face
