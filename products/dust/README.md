# Dust

The cut is open, but the dust is still in it. Move the leftover sawdust. See how much loose particulate remains in a kerf after cutting.

This is not Fuzz. Fuzz is leftover standing fibres after sanding. This is not Burn. Burn is leftover scorch from the cut. This is not Tearout. Tearout is leftover splinter at the cut. This is not Chatter. Chatter is leftover ripple from the cut. This is not Kerf. Kerf is leftover removed gap. This is not Stain. Stain is leftover wash in the figure. This is not Mottle. Mottle is leftover blotch in the figure. This is not extraction advice. This is not a mill sign-off. Dust answers “how much leftover loose sawdust still sits in the cut.”

## Problem

The cut is open, but the dust is still in it:

- how much leftover loose sawdust still sits in a kerf after cutting?
- is the leftover swept, or showing?
- when is the leftover dust obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover fibres, leftover scorch, leftover splinter, leftover ripple, leftover removed gap, leftover wash, leftover layout line, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover dust — leftover sawdust that still sits in the cut, leftover loose particulate still sitting in a kerf after cutting, not Fuzz leftover standing fibres, not Burn leftover scorch.

## Users

- people who already know an open cut can still hold leftover loose sawdust in the kerf
- anyone who refuses to treat standing fibres, a scorch, one splinter, a ripple, a stain wash, a packed sky, or a clock as this leftover
- desks that want dust as a sketch, not a mill sign-off, and not extraction advice
- teams that want a no-backend, local-only pass — not Fuzz, not Burn, not Tearout, not Chatter, not a paste well

## Workflow

1. Load the seed: 8 mm of leftover dust — already showing, not a swept-only cut
2. Read the scene: one workpiece, a leftover whose leftover is the dust, leftover labelled as a sketch
3. Move leftover dust (or use the arrow keys on the focused slider); leftover names showing or swept
4. Drop the leftover toward 0 mm and the cut looks swept / no leftover dust; raise it and a deeper, denser loose sawdust bed still sits inside the fixed kerf
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover dust as leftover loose sawdust that still sits in the cut:

- `dust` — millimetres of leftover settled sawdust in the kerf (default 8)

Derived picture:

- leftover labelled as a sketch (swept / showing), not a mill sign-off
- leftover dust labelled as a sketch
- swept / no leftover dust when dust ≤ 1 mm (the cut is open, no leftover sawdust)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a finished kerf/cut — a leftover whose leftover is the dust; leftover is leftover loose sawdust that still sits in the cut (not standing fibres, not scorch, not one splinter, not a ripple, not a stain, not a changing kerf width)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover loose sawdust still sitting in the cut on one workpiece, not raised fibres as the hero, not scorch as the hero, not one splinter as the hero, not a ripple as the hero, not a stain as the hero, not a clock
- seeded demo already shows a visible leftover (not a swept-only cut)
- live leftover dust, leftover labelled as a sketch (swept / showing)
- keyboard moves the focused control
- SVG text alternative names whether the dust is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/dust/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover particulate bed in a fixed kerf) is in the DOM
- seeded leftover is visible (showing — not swept)
- changing a control redraws and updates the readout
- no paste-well hero, no standing fibres as the hero, no scorch as the hero, no one splinter as the hero, no ripple as the hero, no stain as the hero, no clock face
