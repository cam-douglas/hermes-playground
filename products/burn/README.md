# Burn

A cut looks cool until you see the burn. Move the scorch. See the leftover heat mark still sitting along the kerf.

This is not Flame. Flame is leftover leap that still sits in the figure. This is not Chatter. Chatter is leftover ripple that still sits from the cut. This is not Tearout. Tearout is leftover splinter that still sits at the cut. This is not Stain. Stain is leftover wash that still sits in the figure. This is not Kerf. Kerf is leftover gap the blade removed. This is not Pitch. Pitch is leftover resin. This is not a cut-list. This is not a paste well. This is not a clock. Burn answers “how much leftover scorch still sits from the cut.”

## Problem

A cut looks cool until you see the burn:

- how much leftover scorch still sits from the cut?
- is the leftover cool, or showing?
- when is the leftover burn obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover leap in the figure, leftover ripple from the cut, leftover splinter at the cut, leftover wash in the figure, leftover gap the blade removed, leftover millimetres of stock, leftover paper creases, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover burn — leftover heat mark still sitting along the kerf, leftover burn still sitting from the cut, not Flame leftover leap in the figure, not Chatter leftover ripple from the cut.

## Users

- people who already know a cut can look cool until the leftover heat mark shows along the kerf
- anyone who refuses to treat a flame leap, a chatter ripple, a tearout splinter, a stain wash, a packed sky, or a clock as this leftover
- desks that want burn as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Flame, not Chatter, not Tearout, not Stain, not a paste well

## Workflow

1. Load the seed: 7 mm of leftover burn — already showing, not a cool-only cut
2. Read the scene: one cut/kerf, a leftover whose leftover is the burn, leftover labelled as a sketch
3. Move leftover burn (or use the arrow keys on the focused slider); leftover names showing or cool
4. Drop the leftover toward 0 mm and the cut looks cool / no leftover burn; raise it and a wider leftover scorch still sits from the cut
5. Reset restores the seeded leftover showing

## Data model

One cut/kerf with leftover burn as leftover scorch that still sits from the cut:

- `burn` — millimetres of leftover scorch (default 7)

Derived picture:

- leftover labelled as a sketch (cool / showing), not a mill sign-off
- leftover scorch labelled as a sketch
- cool / no leftover burn when scorch ≤ 2 mm (the cut looks cool, no leftover scorch)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one cut/kerf — a leftover whose leftover is the burn; leftover is leftover heat mark still sitting along the kerf (not a flame leap, not a chatter ripple, not a tearout splinter, not a stain wash)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover heat mark still sitting along the kerf of one cut, not a flame leap as the hero, not a chatter ripple as the hero, not a tearout splinter as the hero, not a stain wash as the hero, not a clock
- seeded demo already shows a visible leftover (not a cool-only cut)
- live leftover burn, leftover labelled as a sketch (cool / showing)
- keyboard moves the focused control
- SVG text alternative names whether the burn is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/burn/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one cut / kerf / leftover burn) is in the DOM
- seeded leftover is visible (showing — not cool)
- changing a control redraws and updates the readout
- no paste-well hero, no flame leap as the hero, no chatter ripple as the hero, no tearout splinter as the hero, no stain wash as the hero, no clock face
