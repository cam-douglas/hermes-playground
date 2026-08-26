# Smear

The wipe has passed, but a smear still sits. Move the leftover smear. See the residual smear still sitting on a fixed face after a wipe.

This is not Creep. Creep is a thin line of glue still sitting along a closed seam. This is not Scuff. Scuff is a shallow abraded mark after abrasion. This is not Stain. Stain is a leftover wash in the face. This is not Holiday. Holiday is a missed bare patch after a brush coat. This is not a clock. This is not wipe advice. This is not a mill sign-off. Smear answers “how much leftover smear still sits on a fixed face after a wipe.”

## Problem

The wipe has passed, but a smear still sits:

- how much leftover sitting smear still sits on the face after the wipe?
- is the leftover clear, or showing?
- when is the leftover smear obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover gap, leftover shaving, leftover holiday, leftover stub, leftover creep, leftover scuff, leftover stain, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover smear — leftover residual smear still sitting on a fixed face after a wipe, not Creep leftover glue line, not Scuff leftover abrasion, not Stain leftover wash, not Holiday leftover finish miss.

## Users

- people who already know a wipe can still leave one leftover smear sitting on the face as a residual streak or patch
- anyone who refuses to treat a glue creep line, a scuff, a stain wash, a holiday, a packed sky, or a clock as this leftover
- desks that want smear as a sketch, not a mill sign-off, and not wipe advice
- teams that want a no-backend, local-only pass — not Creep, not Scuff, not Stain, not Holiday, not a paste well

## Workflow

1. Load the seed: 3 mm of leftover smear — already showing, not a clear-only face
2. Read the scene: one workpiece, one face that is already wiped, a leftover whose leftover is one leftover residual smear still sitting on that face after the wipe, leftover labelled as a sketch
3. Move leftover smear (or use the arrow keys on the focused slider); leftover names showing or clear
4. Drop the leftover toward 0 mm and the face looks clear / no leftover smear; raise it and a larger leftover smear streak still sits on a fixed face after a wipe
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover smear as leftover residual streak or patch that still sits on a fixed face after a wipe:

- `smear` — millimetres of leftover sitting smear extent after the wipe (default 3)

Derived picture:

- leftover labelled as a sketch (clear / showing), not a mill sign-off
- leftover smear labelled as a sketch
- clear / no leftover smear when smear ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named clear — not “smear”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a face that is already wiped and one leftover residual smear still sitting on that face after the wipe (not a glue creep line, not an abraded scuff, not a stain wash, not a holiday)
- moving a control redraws the leftover immediately; the face does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual smear still sitting on a fixed face after a wipe, not a glue line as the hero, not a scuff as the hero, not a stain as the hero, not a holiday as the hero, not a clock
- seeded demo already shows a visible leftover (not a clear-only face)
- live leftover smear, leftover labelled as a sketch (clear / showing)
- keyboard moves the focused control
- SVG text alternative names whether the smear is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/smear/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual smear still sitting on a fixed face after a wipe) is in the DOM
- seeded leftover is visible (showing — not clear)
- changing a control redraws and updates the readout; the face stays fixed
- empty state is named clear — not “smear”
- no paste-well hero, no creep as the hero, no scuff as the hero, no stain as the hero, no holiday as the hero, no clock face
