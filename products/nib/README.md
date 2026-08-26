# Nib

Two cuts meet, but the corner still keeps a nib. Move the leftover corner nib. See the tiny uncut projection still standing at an inside corner after intersecting cuts.

This is not Dogbone. Dogbone is leftover round relief in a corner. This is not Finger. Finger is leftover tabs along an edge. This is not Tearout. Tearout is leftover splinter at a cut. This is not Arris. Arris is leftover sharp where two planes meet. This is not Fox. Fox is leftover hidden wedge in a tenon. This is not Shoulder. Shoulder is leftover bearing face at a joint. This is not Cheek. Cheek is leftover side face on a tenon. This is not cutting advice. This is not a mill sign-off. Nib answers “how much leftover uncut corner projection still stands after intersecting cuts.”

## Problem

Two cuts meet, but the corner still keeps a nib:

- how much leftover uncut projection still stands at an inside corner after intersecting cuts?
- is the leftover flush, or showing?
- when is the leftover nib obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover round relief, leftover tabs, leftover splinter, leftover sharp, leftover wedge, leftover bearing face, leftover tenon side, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover nib — leftover uncut corner projection that still stands after intersecting cuts, leftover compact square or triangular projection remaining exactly where two fixed cuts meet, not Dogbone leftover relief, not Finger leftover tabs.

## Users

- people who already know two intersecting cuts can still leave a leftover uncut projection at the inside corner
- anyone who refuses to treat a dogbone relief, a finger tab, a tearout splinter, an arris, a fox wedge, a packed sky, or a clock as this leftover
- desks that want nib as a sketch, not a mill sign-off, and not cutting advice
- teams that want a no-backend, local-only pass — not Dogbone, not Finger, not Tearout, not a paste well

## Workflow

1. Load the seed: 5 mm of leftover nib — already showing, not a flush-only corner
2. Read the scene: one L-shaped inside corner, two fixed intersecting cuts, a leftover whose leftover is the nib, leftover labelled as a sketch
3. Move leftover nib (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the corner looks flush / no leftover nib; raise it and a larger compact square / triangular projection still stands exactly where two fixed cuts meet
5. Reset restores the seeded leftover showing

## Data model

One L-shaped inside corner with leftover nib as leftover uncut corner projection that still stands after intersecting cuts:

- `nib` — millimetres of leftover standing corner projection (default 5)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a mill sign-off
- leftover nib labelled as a sketch
- flush / no leftover nib when nib ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one L-shaped inside corner with two fixed intersecting cut paths — a leftover whose leftover is the nib; leftover is leftover compact square / triangular uncut projection that still stands at the meeting point (not a dogbone relief, not a tab, not a splinter, not a wedge)
- moving a control redraws the leftover immediately; the two cut paths do not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover uncut corner projection still standing at the meeting of two fixed cuts, not a relief as the hero, not a tab as the hero, not a splinter as the hero, not a wedge as the hero, not a clock
- seeded demo already shows a visible leftover (not a flush-only corner)
- live leftover nib, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether the nib is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/nib/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (L-shaped inside corner / leftover uncut projection at two fixed intersecting cuts) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout; the two cut paths stay fixed
- empty state is named flush — not “nib”
- no paste-well hero, no dogbone as the hero, no tab as the hero, no splinter as the hero, no clock face
