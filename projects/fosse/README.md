# Fosse

An **earthwork / defensive-ditch booth** — wet clay trench cut, sod lip, chalk survey marks, iron spike markers, mist over the fosse, cross-section of a ditch with host bank vs guest void. Fonts **Source Serif 4** (display) + **Karla** (body) + **Roboto Mono** (mono). Palette: trench ink `#12100e`, wet clay `#3d3429`, chalk `#d4cfc4`, iron `#6b6560`, sod `#2d4a3e`, mist haze — dark earthwork, not desert ash/ochre.

Primary:

- [anthropics/claude-code#93358](https://github.com/anthropics/claude-code/issues/93358) (OPEN, bug, has repro, platform:windows, area:cowork). Title: `[BUG] Cowork (Windows 10 22H2): all Plan9 shares fail with "Plan9 mount failed: invalid argument" after September 2026 cumulative — 4/4 → 0/4, host reports hr=0x0`. Filed by djionut13 2026-09-10. Windows 10 Pro 22H2, build **19045.7725**, x64, CPU 13th Gen i5-1345U. Claude Desktop **1.49585.0.0** (MSIX); CoworkVMService Running (Automatic); vmcompute Running (Manual). VirtualMachinePlatform Enabled; HypervisorPlatform not present; Microsoft-Hyper-V-All Disabled. Host-side Plan9 share attach reports complete success (`HcsModifyComputeSystem` hr=0x0 for all four shares) while the guest mounts **0/4** with `Plan9 mount failed: invalid argument`, including share `c` (plain local NTFS). User-facing: `sandbox-helper: no Plan9 drive shares mounted under /mnt/.virtiofs-root/shared`. Cumulative rewrote `vmcompute.exe` and `vmwp.exe`. KB5124008 is *not* installed and not applicable — this is the Win10 22H2 counterpart of Win11 #92984, not a clone of it.

00:50 fosse: an earthwork / defensive-ditch booth for #93358. Idle **mounted** / seeded **fossed** / path **plan9**. Score fosse or admit mounted.

Score fosse or admit mounted.

Idle word: **mounted** (HOLD: 4/4 Plan9 shares under `/mnt/.virtiofs-root/shared`; sandbox usable; host hr=0x0 AND guest mounts succeed). Seeded word: **fossed** / #93358 (after Sep cumulative → guest 0/4 EINVAL while host still reports hr=0x0). Path word: **plan9**. Product score: **fosse**. Never idle honest / scapegoated / ungranted / scapegoat / bound / accreted / session-url / cartulary / sealed / mismatched / issuer / paraph / routed / inherited / cascade / appanage / afloat / washed / pontoon / concordant / concordat / reaped / revenant / restored / expanded / laid / released / freehold / trunked / tokenized / locked / scratched / unmasked / replevin / cognate / lemures / escheat / mortmain / strowger / mondegreen / derby / vizard / oubliette / voided / ephemera / commutator / heddle.

Phrase: **when host Plan9 attach returns hr=0x0 but the guest mounts 0/4 with invalid argument after the Win10 Sep cumulative, score fosse or admit mounted.**

- **mounted** = IDLE: HOLD; 4/4 Plan9 shares under `/mnt/.virtiofs-root/shared`; sandbox usable; host hr=0x0 AND guest mounts succeed
- **fossed** = #93358 seeded path: after Sep cumulative → guest 0/4 EINVAL while host still reports hr=0x0
- **fosse** = product score word for the trench that kept the host bank honest and the guest void empty
- **plan9** = path word: host attach vs guest mount after Win10 22H2 Sep cumulative
- **hold** = HOLD alias for idle mounted
- **host-bank** = all four `HcsModifyComputeSystem` return hr=0x0
- **guest-void** = guest log `mounted 0/4 Plan9 shares`
- **einval** = `Plan9 mount failed: invalid argument`
- **share-c** = plain local NTFS volume `c` fails identically
- **sandbox-helper** = user-facing `no Plan9 drive shares mounted under /mnt/.virtiofs-root/shared`
- **sep-cumulative** = KB5122878 / KB5122877 / KB5126421 — only change in the window
- **kb5124008-na** = KB5124008 is not installed and not applicable on 19045.7725
- **vmcompute** = cumulative rewrote `vmcompute.exe` and `vmwp.exe`
- **has-repro** = Claude Desktop 1.49585.0.0 · djionut13 · Windows 10 Pro 22H2 19045.7725 · 13th Gen i5-1345U
- **cousins** = cite-only #92984 #92958 #43290 #47570 #44486 — do not rebuild
- **backups** = cite-only #93356 #93354 #93345 #93341 #93338 #93279 #93270 #93269 #93265 #93280 #93257; Vernier/#93219 leftover — do not auto-pick
- **fixtures** = host-bank / guest-void / share table for the fosse booth
- **walk** = published idle mounted → nine-good-boots → sep-cumulative → vmcompute-rewrite → host-attach-hr0 → guest-c-einval → guest-xyz-einval → guest-0-of-4 → sandbox-helper-lie → kb5124008-na → win10-counterpart → fossed → plan9 → fosse

Verdicts: mounted, fossed, fosse, plan9, hold, host-bank, guest-void, einval, share-c, sandbox-helper, sep-cumulative, kb5124008-na, vmcompute, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the trench is **fossed** / **fosse** or already **mounted**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): post-Sep vmcompute/vmwp Plan9 option negotiation rejects guest mount args with EINVAL while host HCS modify still returns success. Invite verify against #93358 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93358](https://github.com/anthropics/claude-code/issues/93358)
- Cite-only cousin: [anthropics/claude-code#92984](https://github.com/anthropics/claude-code/issues/92984) (identical error string, Windows 11 26200, KB5124008 — uninstall restores; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#92958](https://github.com/anthropics/claude-code/issues/92958) (ARM64/x64 Sep cumulative breaks Plan9 attach; add_plan9_shares reports success but attaches nothing; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#43290](https://github.com/anthropics/claude-code/issues/43290) (Win10 22H2 Plan9 share access denied after update; closed; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#47570](https://github.com/anthropics/claude-code/issues/47570) (mounts nonexistent drive letter; closed; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#44486](https://github.com/anthropics/claude-code/issues/44486) (service crashes when a drive cannot mount; closed; do not rebuild)
- Backup (data only): #93356 hooks fail on Windows username with space
- Backup (data only): #93354 Wayland Bone layout physical key code
- Backup (data only): #93345 RC worktrees deleted before archive
- Backup (data only): #93341 /code-review stale local main in worktrees
- Backup (data only): #93338 Desktop OTEL_RESOURCE_ATTRIBUTES never emitted
- Backup (data only): #93279 HTTP MCP ~25s stall
- Backup (data only): #93270 Workflow kill leaks agents blocking archive
- Backup (data only): #93269
- Backup (data only): #93265
- Backup (data only): #93280
- Backup (data only): #93257
- Backup (data only): #93219 Vernier millimeter-slider leftover — do not ship

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:cowork
- OS: Windows 10 Pro 22H2, build **19045.7725**, x64, CPU 13th Gen i5-1345U
- Claude Desktop **1.49585.0.0** (MSIX); CoworkVMService Running (Automatic); vmcompute Running (Manual)
- VirtualMachinePlatform Enabled; HypervisorPlatform not present; Microsoft-Hyper-V-All Disabled
- Before: nine consecutive boots 28 Jul–8 Sep 2026 mounted **4/4** successfully (last good `2026/09/08 22:12:01`)
- After Sep cumulative only change: first **0/4** boot (`2026/09/10 13:15:31`)
- Guest log `Plan9 mount failed: invalid argument` including share `c` (plain local NTFS) via vsock 9902; x/y/z via 9923/9924/9925
- Host: all four `HcsModifyComputeSystem` return **hr=0x0** — failure only visible in guest console
- User-facing: `sandbox-helper: no Plan9 drive shares mounted under /mnt/.virtiofs-root/shared`
- Cumulative rewrote `vmcompute.exe` and `vmwp.exe` (10.0.19041.1, LastWriteTime 09/09/2026)
- Updates in the window: KB5122877, KB5122878, KB5126421
- KB5124008 is *not* installed / not applicable on this build
- Explicitly the Win10 22H2 counterpart of #92984 (Win11 26200 + KB5124008)

Problem found: WHEN HOST PLAN9 ATTACH RETURNS hr=0x0 BUT THE GUEST MOUNTS 0/4 WITH INVALID ARGUMENT AFTER THE WIN10 SEP CUMULATIVE.

Why this solution: a diagnostic earthwork / defensive-ditch booth for the mounted → fossed drift, so a reader can pin idle mounted, load the #93358 fossed path, and score plan9 against the published facts. Conceptual host bank, sod lip, chalk survey marks, and guest void show whether attach success reached the guest. No live Claude session is required.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Surface guest mount EINVAL to the user (not just "sandbox down")
2. Log 9p mount args on EINVAL
3. Consider flags=0x10 hasToken=true negotiation vs post-Sep Plan9 server on 19041 servicing branch
4. Make individual share failures non-fatal (`c` alone often enough)

## Why not a clone

This is specifically: **HOST-HONEST PLAN9 ATTACH (hr=0x0) VS GUEST 0/4 EINVAL AFTER WIN10 22H2 SEP CUMULATIVE** — earthwork fosse, not desert altar / monastic cartulary / harbor pontoon.

**NOT Scapegoat/#93348** (ungranted chrome host executeScript hang/blame page). Different defect. NOT desert ash altar.

**NOT Hibernacle/#93372** (Windows idle working-set trim / majflt stall). Different defect. NOT winter den.

**NOT Cartulary/#93331** (mcpOAuth session-url accretion). Different defect. NOT oak scriptorium.

**NOT Paraph/#93327** (BYO OAuth issuer `%22`). Different defect. NOT notarial seal.

**NOT Appanage/#93307** (code-review fable crown inheritance). Different defect.

**NOT Pontoon/#93288** (Desktop restart washes RC bridges). Different defect. NOT harbor pontoon.

**NOT Concordat/#93290**. **NOT Revenant/#93274**.

Also not a clone of a #92984 booth if any existed — #93358 is Win10 22H2 / different KBs / KB5124008 inapplicable.

**NOT Replevin/#93207.** **NOT Cognate/#93250.** **NOT Lemures/#93256.** **NOT Escheat/#93231.** **NOT Mortmain/#93173.** **NOT Strowger/#93218.** **NOT Mondegreen/#93193.** **NOT Derby/#93197.** **NOT Vizard/#93190.** **NOT Oubliette.** **NOT Ephemera.** **NOT Commutator.** **NOT Heddle.** **NOT Buoy.** **NOT leftover woodworking / mm-slider Vernier/#93219.**

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **host-bank Plan9 attach (hr=0x0) vs guest 0/4 EINVAL after Win10 22H2 Sep cumulative** — unused in catalog as this earthwork / defensive-ditch walk.

Do NOT rename this product Scapegoat, Cartulary, Paraph, Appanage, Pontoon, Concordat, Revenant, Replevin, Cognate, Lemures, Escheat, Mortmain, Strowger, Mondegreen, Derby, Vizard, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, or any existing catalog slug.
Do NOT reuse idle mounted / fossed / plan9 on a later booth.
Do NOT reuse Libre Bodoni, Fraunces, Literata, Playfair Display, Petrona, Vollkorn, Outfit, or IBM Plex. Display here is **Source Serif 4**. Body is **Karla**. Mono is **Roboto Mono**.

Different surface: Win10 22H2 Cowork Plan9 host-attach vs guest-mount EINVAL vs Chrome extension host-grant / executeScript timeout / credential-store accretion / Desktop issuer-quote formatter / skill-fork model inherit / Desktop RC wash / MCP header↔`_meta` discord / WMI timeout-kill orphans.

Product name stays **Fosse**. Name/slug `fosse` unused in catalog.json (272 products before this ship; Scapegoat is #272).

Different UI: earthwork / defensive-ditch / wet clay trench cut / sod lip / chalk survey marks / iron spike markers / mist over the fosse / host bank vs guest void. Source Serif 4 / Karla / Roboto Mono. NOT desert ritual / ash altar / goat-bell (Scapegoat). NOT oak lectern / bound quires (Cartulary). NOT notarial instrument / wax press (Paraph). NOT royal-grant / heraldic inheritance desk (Appanage). NOT harbor pontoon / floating-bridge pier (Pontoon). NOT diplomatic chancery (Concordat). NOT Victorian séance parlor (Revenant). NOT millimeter-slider.

Different verbs: Cut the trench, Score fosse, Walk the bank, Survey the shares, Pin idle mounted, Pin seeded fossed, Pin plan9, Backfill the fosse.

Different idle: **mounted**. Different #93358 seeded path: **fossed**. HOLD: **mounted** / **hold**. ALARM: **fossed** / **fosse** / **plan9** / **einval** / **guest-void**. Path: **plan9**.

## How to score

```bash
node --test projects/fosse/fosse.test.mjs
node projects/fosse/fosse.mjs projects/fosse/data/fossed.json
echo '{"seed":"fossed"}' | node projects/fosse/fosse.mjs
```

Open the living card at `projects/fosse/index.html` (or the live path `/fosse/`). Buttons: Cut the trench, Score fosse, Walk the bank, Survey the shares, Pin idle mounted, Pin seeded fossed, Pin plan9, Backfill the fosse. Toggle host attach hr=0x0 / guest 0/4 EINVAL / share c EINVAL / Sep cumulative / KB5124008 N/A / sandbox-helper cue / vmcompute rewrite — the score flips. Lay a fixture JSON on the sod lip. `?embed=1` hides chrome.

The booth reconstructs the reporter’s nine 4/4 boots / Sep cumulative / host hr=0x0 / guest 0/4 EINVAL walk from the published #93358 body. This page did not run Claude or Cowork live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/fosse/
- Folder: `projects/fosse/`
