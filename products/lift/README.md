# Lift

The glue is set, but a sheet still sits lifted off the face. Move the leftover lift. See the residual veneer leaf still sitting off the substrate after glue-up.

This is not Proud. Proud is leftover high of the joint itself. This is not Squeeze. Squeeze is leftover glue bead hugging a seam. This is not Inlay. Inlay is the inlay set in. This is not Fuzz. Fuzz is leftover standing fibres after sanding. This is not Bruise. Bruise is leftover compressed depression. This is not repair advice. This is not a mill sign-off. Lift answers “how much leftover veneer still sits lifted off a substrate face.”

## Problem

The glue is set, but a sheet still sits lifted off the face:

- how much leftover veneer still stands off the substrate after glue-up?
- is the leftover seated, or showing?
- when is the leftover lift obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover joint highs, leftover glue beads, leftover inlays, leftover standing fibres, leftover compressed depressions, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover lift — leftover veneer that still stands off the substrate after glue-up, leftover veneer leaf sitting off a fixed substrate face, not Proud leftover high, not Squeeze leftover glue, not Inlay leftover the inlay, not Fuzz leftover fibres.

## Users

- people who already know a glued veneer can still leave a leftover leaf sitting off the substrate
- anyone who refuses to treat a proud joint high, a glue bead, an inlay, a field of fuzz, a bruise depression, a packed sky, or a clock as this leftover
- desks that want lift as a sketch, not a mill sign-off, and not repair advice
- teams that want a no-backend, local-only pass — not Proud, not Squeeze, not Inlay, not a paste well

## Workflow

1. Load the seed: 4 mm of leftover lift — already showing, not a seated-only sheet
2. Read the scene: one substrate, one fixed face, a leftover whose leftover is the lift, leftover labelled as a sketch
3. Move leftover lift (or use the arrow keys on the focused slider); leftover names showing or seated
4. Drop the leftover toward 0 mm and the sheet looks seated / no leftover lift; raise it and a taller leftover veneer leaf still sits off a fixed substrate face
5. Reset restores the seeded leftover showing

## Data model

One substrate face with leftover lift as leftover veneer that still stands off the substrate after glue-up:

- `lift` — millimetres of leftover raised sheet height (default 4)

Derived picture:

- leftover labelled as a sketch (seated / showing), not a mill sign-off
- leftover lift labelled as a sketch
- seated / no leftover lift when lift ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named seated — not “lift”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one substrate face with a thin leftover veneer leaf — leftover is leftover veneer leaf sitting off the face (not a proud joint high, not a glue bead, not an inlay, not a field of fuzz, not a bruise depression)
- moving a control redraws the leftover immediately; the substrate face does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover veneer leaf sitting off a fixed substrate face, not a proud joint as the hero, not a glue bead as the hero, not an inlay as the hero, not fibres as the hero, not a depression as the hero, not a clock
- seeded demo already shows a visible leftover (not a seated-only sheet)
- live leftover lift, leftover labelled as a sketch (seated / showing)
- keyboard moves the focused control
- SVG text alternative names whether the lift is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/lift/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one substrate / leftover veneer leaf off a fixed face) is in the DOM
- seeded leftover is visible (showing — not seated)
- changing a control redraws and updates the readout; the substrate face stays fixed
- empty state is named seated — not “lift”
- no paste-well hero, no proud as the hero, no squeeze as the hero, no inlay as the hero, no fuzz as the hero, no bruise as the hero, no clock face
