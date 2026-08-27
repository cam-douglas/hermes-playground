# Sliver

The cut is done, but a sliver still sits. Move the leftover sliver. See the residual thin sliver still sitting on a fixed cut edge.

This is not a shaving. Shaving is leftover residual curl of shaving still sitting after a plane pass. This is not a chip. Chip is leftover residual discrete chip still sitting after a chisel cut. This is not a stub. Stub is leftover residual short remnant still sitting after a cut. This is not an overcut. Overcut is leftover residual extra run still sitting past a fixed stop. This is not tearout. Tearout is leftover residual torn fibres still sitting at the cut. This is not a clock. This is not cut advice. This is not a mill sign-off. Sliver answers “how much leftover sliver still sits on a fixed cut edge.”

## Problem

The cut is done, but a sliver still sits:

- how much leftover sitting sliver still sits on the cut edge?
- is the leftover clear, or showing?
- when is the leftover sliver obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover kink, leftover flash, leftover pinhole, leftover craze, leftover bloom, leftover relish, leftover smear, leftover gap, leftover shaving, leftover holiday, leftover stub, leftover chip, leftover tearout, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover sliver — leftover residual thin sliver still sitting on a fixed cut edge, not a plane shaving curl, not a chisel chip, not a stub remnant, not an overcut, not tearout.

## Users

- people who already know a cut can still leave leftover sliver sitting as a residual thin detached or hanging fibre on a fixed cut edge after the cut
- anyone who refuses to treat a shaving curl, a chip, a stub remnant, an overcut, tearout, a packed sky, or a clock as this leftover
- desks that want sliver as a sketch, not a mill sign-off, and not cut advice
- teams that want a no-backend, local-only pass — not a shaving, not a chip, not a stub, not tearout, not a paste well

## Workflow

1. Load the seed: 2 mm of leftover sliver — already showing, not a clear-only edge
2. Read the scene: one workpiece, one cut that is already done, a leftover whose leftover is one leftover residual thin sliver still sitting on that fixed cut edge, leftover labelled as a sketch
3. Move leftover sliver (or use the arrow keys on the focused slider); leftover names showing or clear
4. Drop the leftover toward 0 mm and the edge looks clear / no leftover sliver; raise it and a longer leftover sliver still sits on a fixed cut edge
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover sliver as leftover residual thin sliver that still sits on a fixed cut edge:

- `sliver` — millimetres of leftover sitting sliver length/extent on the cut edge (default 2)

Derived picture:

- leftover labelled as a sketch (clear / showing), not a mill sign-off
- leftover sliver labelled as a sketch
- clear / no leftover sliver when sliver ≤ 0 mm (integer slider means 0)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named clear — not “sliver”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a cut that is already done and one leftover residual thin sliver still sitting on that fixed cut edge (not a plane shaving curl, not a chisel chip, not a stub remnant, not an overcut, not tearout)
- moving a control redraws the leftover immediately; the cut edge’s true line does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual thin sliver still sitting on a fixed cut edge, not a shaving as the hero, not a chip as the hero, not a stub as the hero, not tearout as the hero, not a clock
- seeded demo already shows a visible leftover (not a clear-only edge)
- live leftover sliver, leftover labelled as a sketch (clear / showing)
- keyboard moves the focused control
- SVG text alternative names whether the sliver is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/sliver/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual thin sliver still sitting on a fixed cut edge) is in the DOM
- seeded leftover is visible (showing — not clear)
- changing a control redraws and updates the readout; the cut’s true edge stays fixed
- empty state is named clear — not “sliver”
- no paste-well hero, no shaving as the hero, no chip as the hero, no stub as the hero, no tearout as the hero, no clock face
