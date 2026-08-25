# Fuzz

A surface looks finished until the light catches the fuzz. Move the leftover fibres. See the raised fibres still standing after sanding.

This is not Tearout. Tearout is leftover splinter that still sits at the cut. This is not Wane. Wane is leftover bark edge. This is not Chatter. Chatter is leftover ripple that still sits from the cut. This is not Burn. Burn is leftover scorch that still sits from the cut. This is not Grain. Grain is leftover mismatch between the cut and the grain. This is not Pith. Pith is leftover spongy center. This is not a cut-list. This is not a paste well. This is not a clock. Fuzz answers “how much leftover fibre still stands after sanding.”

## Problem

A surface looks finished until the light catches the fuzz:

- how much leftover fibre still stands after sanding?
- is the leftover smooth, or showing?
- when is the leftover fuzz obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover splinter at the cut, leftover bark edge, leftover ripple from the cut, leftover scorch from the cut, leftover grain mismatch, leftover millimetres of stock, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover fuzz — leftover fibres that still stand after sanding, leftover fuzz still sitting after sanding, not Tearout leftover splinter at the cut, not Chatter leftover ripple from the cut.

## Users

- people who already know a sanded face can look finished until leftover fibres catch the light
- anyone who refuses to treat a tearout splinter, a bark edge, a chatter ripple, a burn scorch, a packed sky, or a clock as this leftover
- desks that want fuzz as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Tearout, not Wane, not Chatter, not Burn, not a paste well

## Workflow

1. Load the seed: 6 mm of leftover fuzz — already showing, not a smooth-only face
2. Read the scene: one sanded face, a leftover whose leftover is the fuzz, leftover labelled as a sketch
3. Move leftover fuzz (or use the arrow keys on the focused slider); leftover names showing or smooth
4. Drop the leftover toward 0 mm and the face looks smooth / no leftover fuzz; raise it and taller leftover fibres still stand after sanding
5. Reset restores the seeded leftover showing

## Data model

One sanded face with leftover fuzz as leftover fibres that still stand after sanding:

- `fuzz` — millimetres of leftover standing fibre (default 6)

Derived picture:

- leftover labelled as a sketch (smooth / showing), not a mill sign-off
- leftover fibre labelled as a sketch
- smooth / no leftover fuzz when fibre ≤ 1 mm (the face looks finished, no leftover fibres)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one sanded face — a leftover whose leftover is the fuzz; leftover is leftover fibres that still stand after sanding (not a tearout splinter, not a bark edge, not a chatter ripple, not a burn scorch)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover raised fibres still standing after sanding on one sanded face, not a tearout splinter as the hero, not a bark edge as the hero, not a chatter ripple as the hero, not a burn scorch as the hero, not a clock
- seeded demo already shows a visible leftover (not a smooth-only face)
- live leftover fuzz, leftover labelled as a sketch (smooth / showing)
- keyboard moves the focused control
- SVG text alternative names whether the fuzz is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/fuzz/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one sanded face / leftover fuzz field) is in the DOM
- seeded leftover is visible (showing — not smooth)
- changing a control redraws and updates the readout
- no paste-well hero, no tearout splinter as the hero, no bark edge as the hero, no chatter ripple as the hero, no burn scorch as the hero, no clock face
