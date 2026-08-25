# Witness

The cut is done, but the layout line gives it away. Move the leftover line. See how much pencil or knife mark still sits past the finished cut.

This is not Stain. Stain is leftover wash in the figure. This is not Ribbon. Ribbon is leftover stripe in the figure. This is not Grain. Grain is leftover mismatch between the cut and the grain. This is not Chatter. Chatter is leftover ripple that still sits from the cut. This is not Tearout. Tearout is leftover splinter that still sits at the cut. This is not Kerf. Kerf is leftover removed gap. This is not Scribe. Scribe is leftover nest against the molding. This is not a cut-list. This is not a paste well. This is not a clock. Witness answers “how much leftover layout line still sits past the cut.”

## Problem

The cut is done, but the layout line gives it away:

- how much leftover layout line still sits past the finished cut?
- is the leftover clean, or showing?
- when is the leftover witness obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover wash, leftover stripe, leftover grain mismatch, leftover ripple, leftover splinter, leftover removed gap, leftover millimetres of stock, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover witness — leftover layout line that still sits past the cut, leftover pencil or knife mark still sitting past the finished cut, not Stain leftover wash, not Chatter leftover ripple from the cut.

## Users

- people who already know a finished cut can still show leftover pencil or knife line past the edge
- anyone who refuses to treat a stain wash, a ribbon stripe, a grain mismatch, a chatter ripple, a tearout splinter, a packed sky, or a clock as this leftover
- desks that want witness as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Stain, not Ribbon, not Chatter, not Tearout, not a paste well

## Workflow

1. Load the seed: 18 mm of leftover witness — already showing, not a clean-only cut
2. Read the scene: one workpiece, a leftover whose leftover is the witness, leftover labelled as a sketch
3. Move leftover witness (or use the arrow keys on the focused slider); leftover names showing or clean
4. Drop the leftover toward 0 mm and the cut looks clean / no leftover witness; raise it and a longer leftover layout line still sits past the cut
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover witness as leftover layout line that still sits past the cut:

- `witness` — millimetres of leftover layout line past the cut (default 18)

Derived picture:

- leftover labelled as a sketch (clean / showing), not a mill sign-off
- leftover line labelled as a sketch
- clean / no leftover witness when line ≤ 2 mm (the cut is done, no leftover layout line)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a finished cut/kerf — a leftover whose leftover is the witness; leftover is leftover layout line that still sits past the cut (not a stain wash, not a ribbon stripe, not a grain mismatch, not a chatter ripple, not a tearout splinter)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover layout line still sitting past the finished cut on one workpiece, not a stain wash as the hero, not a ribbon stripe as the hero, not a chatter ripple as the hero, not a tearout splinter as the hero, not a clock
- seeded demo already shows a visible leftover (not a clean-only cut)
- live leftover witness, leftover labelled as a sketch (clean / showing)
- keyboard moves the focused control
- SVG text alternative names whether the witness is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/witness/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover witness line) is in the DOM
- seeded leftover is visible (showing — not clean)
- changing a control redraws and updates the readout
- no paste-well hero, no stain wash as the hero, no ribbon stripe as the hero, no chatter ripple as the hero, no tearout splinter as the hero, no clock face
