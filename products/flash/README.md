# Flash

The trim is done, but a flash still sits. Move the leftover flash. See the residual thin flash still sitting on a fixed trimmed edge.

This is not Stub. Stub is leftover residual short remnant still sitting after a cut. This is not Shaving. Shaving is leftover residual curl of shaving still sitting after a plane pass. This is not Proud. Proud is leftover residual high still sitting above the surrounding face. This is not Smear. Smear is leftover residual smear still sitting on a fixed face after a wipe. This is not a clock. This is not trim advice. This is not a mill sign-off. Flash answers “how much leftover flash still sits on a fixed trimmed edge.”

## Problem

The trim is done, but a flash still sits:

- how much leftover sitting flash still sits on the trimmed edge?
- is the leftover clean, or showing?
- when is the leftover flash obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover pinhole, leftover craze, leftover bloom, leftover relish, leftover smear, leftover gap, leftover shaving, leftover holiday, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover flash — leftover residual thin flash still sitting on a fixed trimmed edge, not Stub leftover cut remnant, not Shaving leftover plane curl, not Proud leftover high spot, not Smear leftover wipe film.

## Users

- people who already know a trimmed edge can still leave leftover flash sitting as a residual thin excess film after the trim
- anyone who refuses to treat a stub remnant, a plane shaving curl, a proud high spot, a smear, a packed sky, or a clock as this leftover
- desks that want flash as a sketch, not a mill sign-off, and not trim advice
- teams that want a no-backend, local-only pass — not Stub, not Shaving, not Proud, not Smear, not a paste well

## Workflow

1. Load the seed: 2 mm of leftover flash — already showing, not a clean-only edge
2. Read the scene: one workpiece, one trim that is already done, a leftover whose leftover is one leftover residual thin flash still sitting on that fixed trimmed edge, leftover labelled as a sketch
3. Move leftover flash (or use the arrow keys on the focused slider); leftover names showing or clean
4. Drop the leftover toward 0 mm and the edge looks clean / no leftover flash; raise it and a thicker leftover flash still sits on a fixed trimmed edge
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover flash as leftover residual thin flash that still sits on a fixed trimmed edge:

- `flash` — millimetres of leftover sitting flash thickness/extent on the trimmed edge (default 2)

Derived picture:

- leftover labelled as a sketch (clean / showing), not a mill sign-off
- leftover flash labelled as a sketch
- clean / no leftover flash when flash ≤ 0 mm (integer slider means 0)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named clean — not “flash”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a trim that is already done and one leftover residual thin flash still sitting on that fixed trimmed edge (not a stub cut remnant, not a plane shaving curl, not a proud high spot)
- moving a control redraws the leftover immediately; the trimmed edge does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual thin flash still sitting on a fixed trimmed edge, not a stub as the hero, not a shaving as the hero, not proud as the hero, not a smear as the hero, not a clock
- seeded demo already shows a visible leftover (not a clean-only edge)
- live leftover flash, leftover labelled as a sketch (clean / showing)
- keyboard moves the focused control
- SVG text alternative names whether the flash is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/flash/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual thin flash still sitting on a fixed trimmed edge) is in the DOM
- seeded leftover is visible (showing — not clean)
- changing a control redraws and updates the readout; the trimmed edge stays fixed
- empty state is named clean — not “flash”
- no paste-well hero, no stub as the hero, no shaving as the hero, no proud as the hero, no smear as the hero, no clock face
