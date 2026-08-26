# Bruise

The clamp is gone, but the face still holds the bruise. Move the leftover compression. See how much crushed fibre still sits in the wood face after pressure.

This is not Eye. Eye is leftover dimple in the figure. This is not Pecky. Pecky is leftover cavity in the face. This is not Mottle. Mottle is leftover blotch in the figure. This is not Stain. Stain is leftover wash in the face. This is not Fuzz. Fuzz is leftover standing fibres after sanding. This is not Dust. Dust is leftover loose particulate in the cut. This is not Cup. Cup is leftover dish across the width. This is not repair advice. This is not a mill sign-off. Bruise answers “how much leftover compression still sits in the wood face after pressure.”

## Problem

The clamp is gone, but the face still holds the bruise:

- how much leftover crushed fibre still sits in a wood face after pressure?
- is the leftover sprung, or showing?
- when is the leftover bruise obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover dimple in figure, leftover cavity, leftover blotch, leftover wash, leftover standing fibres, leftover loose particulate, leftover dish, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover bruise — leftover compression that still sits in the wood face after pressure, leftover crushed fibres still sitting in the face, not Eye leftover dimple, not Pecky leftover cavity.

## Users

- people who already know a released clamp can still leave leftover crushed fibre in the face
- anyone who refuses to treat a figure dimple, a cavity, a blotch, a stain wash, standing fibres, loose dust, a packed sky, or a clock as this leftover
- desks that want bruise as a sketch, not a mill sign-off, and not repair advice
- teams that want a no-backend, local-only pass — not Eye, not Pecky, not Mottle, not Stain, not a paste well

## Workflow

1. Load the seed: 3 mm of leftover bruise — already showing, not a sprung-only face
2. Read the scene: one board face, a leftover whose leftover is the bruise, leftover labelled as a sketch
3. Move leftover bruise (or use the arrow keys on the focused slider); leftover names showing or sprung
4. Drop the leftover toward 0 mm and the face looks sprung / no leftover bruise; raise it and a deeper, wider local crushed-fibre depression still sits under a fixed pressure footprint
5. Reset restores the seeded leftover showing

## Data model

One board face with leftover bruise as leftover compression that still sits in the wood face after pressure:

- `bruise` — millimetres of leftover compressed face depth (default 3)

Derived picture:

- leftover labelled as a sketch (sprung / showing), not a mill sign-off
- leftover bruise labelled as a sketch
- sprung / no leftover bruise when bruise ≤ 0.5 mm (integer slider means 0)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board face with a fixed clamp-foot / pressure reference — a leftover whose leftover is the bruise; leftover is leftover crushed-fibre depression that still sits in the face (not a figure dimple, not a cavity, not a blotch, not a stain, not standing fibres, not loose dust, not a cup)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover crushed fibre still sitting in the face on one board face, not a dimple as the hero, not a cavity as the hero, not a blotch as the hero, not a stain as the hero, not standing fibres as the hero, not loose dust as the hero, not a clock
- seeded demo already shows a visible leftover (not a sprung-only face)
- live leftover bruise, leftover labelled as a sketch (sprung / showing)
- keyboard moves the focused control
- SVG text alternative names whether the bruise is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/bruise/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one board face / leftover compressed-fibre patch under a fixed clamp footprint) is in the DOM
- seeded leftover is visible (showing — not sprung)
- changing a control redraws and updates the readout
- no paste-well hero, no dimple as the hero, no cavity as the hero, no blotch as the hero, no stain as the hero, no clock face
