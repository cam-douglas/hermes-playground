# Vestry

A **liturgical vestry / sacristy / peg-rail booth** — cool stone alcove, linen vestments, brass pegs, candle-smoke haze, indigo stole. Fonts **Cormorant Upright** (display) + **Karla** (body) + **IBM Plex Mono** (chips). Palette: stone `#C8C2B4`, indigo stole `#2C3A6E`, linen `#F4F0E6`, brass peg `#B08D57`, candle smoke `#6B6560`, ink `#1C1A17`, altar wine `#6E2432`. Fresh trio — not the last-ten catalog faces, not the prior banquet trio, not the prior ophthalmology trio, not the prior paleography trio. NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Parablepsis/#93954. NOT Demesne/#93989. NOT Cartouche/#93772. NOT Attaint/#93821. NOT Oriel/#93809. NOT Anarthria/#93782. NOT Trismus/#93823. NOT Foundling/#93889. NOT Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, Afterimage, Thrash, Gleaner. Completely different UI/UX/metaphor. This is specifically: **MOUNT-REFCOUNT RACE — LINUX BWRAP PLACEHOLDER MOUNT CLEANUP IS PER-PROCESS WITH NO CROSS-PROCESS REFCOUNT; CONCURRENT SESSIONS ON ONE PROJECT ROOT DELETE EACH OTHER'S MOUNT POINTS.**

The rail should stay **pegged** (HOLD: hung / stowed / refcounted / co-tenant). Instead the booth was **vestry** after a **mount-refcount-race**.

Primary:

- [anthropics/claude-code#94008](https://github.com/anthropics/claude-code/issues/94008) (OPEN). Title: `[BUG] Linux sandbox: bwrap mount-point cleanup is per-process with no cross-process refcount — concurrent sessions in one project root kill each other's Bash calls`. Labels: bug, has repro, platform:linux, area:sandbox. For sandbox-denied paths inside an allowed write root that do not exist on disk, Claude Code has bwrap materialise placeholders (`--ro-bind /dev/null <path>`, or empty tmpdir for dirs). Placeholders are tracked in a **module-level Set** per process; an inFlight counter decrements after each sandboxed command; when it hits zero that process unlinks every placeholder it knows. No lock, no shared registry, no refcount across `claude` processes. Two+ sessions on the same project root (interactive + cron, two terminals, session + `claude -p`): process A's cleanup deletes mount points process B just put in its bwrap argv → B dies at exec. User sees Bash tool fail for no reason, succeeds on retry. Reproduced 2.1.245–2.1.270; mechanism from 2.1.270 binary. Census: ≥84 sessions with ≥1 such failure 2026-07-07..2026-09-10. Cousins cite-only: #81602 (stray placeholders / closest neighbour, no mechanism), #77271 (read-only parent shape), #79248 (git config.lock vanish — same symptom string, different source), #46165/#78072 (stray 0-byte placeholders, opposite lifecycle direction), #89514 (WSL2+Docker unrelated shapes). Backups cite-only (next focus only — do not auto-pick): #93770 #93777 #93924 #93925 #93967 #93957 #93987 #93996. Stay off Vestry/Surfeit/Phosphene/Parablepsis/Demesne/Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis paradigms.

02:50 vestry: a liturgical vestry / sacristy / peg-rail booth for #94008. Linux bwrap placeholder mount cleanup is per-process with no cross-process refcount — concurrent sessions on one project root delete each other's mount points. Idle **pegged** / seeded **vestry** / path **mount-refcount-race**. Score vestry or admit pegged.

Score vestry or admit pegged.

Idle word: **pegged** (HOLD: hung / stowed). HOLD aliases: pegged, hung, stowed, refcounted, co-tenant. Seeded word: **vestry** / #94008 (the mount-refcount race). Path word: **mount-refcount-race**. Product score: **vestry**. Never idle tempered / quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / solvent / frugal / circuit-held / no-spawn or seeded surfeit / phosphene / parablepsis / demesne / cartouche / attaint / oriel / anarthria / trismus / foundling / crasis / tessera / mojibake / quota-spawn-cascade / layer-tree-walk / latin1-edit-wipe / home-bind-overreach / subagent-bash-outlive.

Phrase: **Score vestry or admit pegged.**

- **pegged** = IDLE: HOLD; concurrent hangers respected; shared rail keeps others' mounts
- **vestry** = #94008 seeded path and product score: attendant clears ALL pegs with no refcount
- **mount-refcount-race** = path word: process A cleanup deletes mount points process B just put in its bwrap argv
- **hold** = HOLD alias for idle pegged
- **hung** = HOLD alias: vestments hung; concurrent hangers respected
- **stowed** = HOLD alias: robes stowed; rail keeps others' mounts
- **refcounted** = HOLD alias: shared rail keeps a refcount across hangers
- **co-tenant** = HOLD alias: two acolytes share the rail without stripping each other
- **placeholder-set** = module-level Set tracks `--ro-bind /dev/null <path>`
- **inflight-zero** = inFlight hits zero; process unlinks every placeholder it knows
- **cross-process** = no lock, no shared registry, no refcount across `claude` processes
- **bash-retry** = Bash tool fails for no reason; identical command succeeds on retry
- **sessions-84** = ≥84 sessions with ≥1 such failure 2026-07-07..2026-09-10
- **ro-bind-null** = `--ro-bind /dev/null <path>` for a missing deny file
- **empty-tmpdir** = empty tmpdir `--ro-bind` for a missing deny directory
- **no-lock** = no lock around argv-build → exec window
- **landing** = sacristy landing / linen sill
- **has-repro** = published shape: 2.1.245–2.1.270 / Set / inFlight zero / ≥84
- **cousins** = cite-only #81602 #77271 #79248 #46165 #78072 — do not conflate
- **backups** = cite-only #93770 #93777 #93924 #93925 #93967 #93957 #93987 #93996 — do not auto-pick
- **fixtures** = stone / indigo stole / linen / brass peg / candle smoke / ink / altar wine
- **walk** = published idle pegged → mount-refcount-race → vestry

Verdicts: pegged, vestry, mount-refcount-race, hold, hung, stowed, refcounted, co-tenant, placeholder-set, inflight-zero, cross-process, bash-retry, sessions-84, ro-bind-null, empty-tmpdir, no-lock, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **vestry** or already **pegged**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): placeholder mount lifecycle is process-local with no cross-process refcount, so concurrent cleanups race on shared project-root placeholders. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94008](https://github.com/anthropics/claude-code/issues/94008)
- Cousins: #81602 cite-only (stray placeholders / closest neighbour, no mechanism). #77271 cite-only (read-only parent shape). #79248 cite-only (git config.lock vanish — same symptom string, different source). #46165/#78072 cite-only (stray 0-byte placeholders, opposite lifecycle direction). #89514 cite-only (WSL2+Docker unrelated shapes). Different defects. Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #93770, #93777, #93924, #93925, #93967, #93957, #93987, #93996

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:linux, area:sandbox
- Reproduced 2.1.245–2.1.270; mechanism from 2.1.270 binary
- Linux 6.8, Ubuntu, distro bubblewrap; built-in Bash sandbox enabled
- For sandbox-denied paths inside an allowed write root that do not exist on disk, bwrap materialises placeholders (`--ro-bind /dev/null <path>`, or empty tmpdir for dirs)
- Placeholders are tracked in a module-level Set per process
- An inFlight counter decrements after each sandboxed command; when it hits zero that process unlinks every placeholder it knows
- No lock, no shared registry, no refcount across `claude` processes
- Two+ sessions on the same project root: process A's cleanup deletes mount points process B just put in its bwrap argv → B dies at exec
- User sees Bash tool fail for no reason; succeeds on retry
- Census: ≥84 sessions with ≥1 such failure 2026-07-07..2026-09-10
- Expected (scoring narrative only): placeholder lifetime outlives every process that might bind it; concurrent hangers respected

Problem found: MOUNT-REFCOUNT RACE — LINUX BWRAP PLACEHOLDER MOUNT CLEANUP IS PER-PROCESS WITH NO CROSS-PROCESS REFCOUNT; CONCURRENT SESSIONS ON ONE PROJECT ROOT DELETE EACH OTHER'S MOUNT POINTS.

Why Vestry: a vestry / sacristy is the room where vestments hang on a shared peg rail. Concurrent acolytes hang garments; when one leaves, the attendant clears ALL pegs with no refcount, stripping the other hangers' garments mid-service. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: living catalog page + node diagnostic encoding idle **pegged** / seeded **vestry** / path **mount-refcount-race** so operators can score whether the booth is **vestry** or already **pegged**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Placeholder mount lifetime should outlive every process that might bind it — a shared rail keeps others' mounts
2. Cleanup must not unlink a mount point another `claude` process just put in its bwrap argv
3. inFlight hitting zero in process A must not clear placeholders process B still needs
4. Two sessions on one project root must not kill each other's Bash calls
5. A Bash tool failure from a vanished placeholder should not be the user-visible result of a process-local Set

## Why not a clone

This is specifically: **MOUNT-REFCOUNT RACE — LINUX BWRAP PLACEHOLDER MOUNT CLEANUP IS PER-PROCESS WITH NO CROSS-PROCESS REFCOUNT; CONCURRENT SESSIONS ON ONE PROJECT ROOT DELETE EACH OTHER'S MOUNT POINTS.**

Novel paradigm: liturgical vestry / sacristy / peg-rail / concurrent acolytes / attendant clearing all pegs — stone, indigo stole, linen, brass peg, candle smoke, ink, altar wine. New issue, new paradigm (mount-refcount-race), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Surfeit/#94012** (workflow keeps spawning after terminal session-limit). Different defect. NOT banquet cellar. Do not reuse tempered / surfeit / quota-spawn-cascade.

**NOT Phosphene/#94003** (WindowServer CA layer-tree thrash while streaming). Different defect. NOT ophthalmology / entoptic clinic. Do not reuse quiescent / phosphene / layer-tree-walk.

**NOT Parablepsis/#93954** (Edit/Write UTF-8-decode of Latin-1 PHP). Different defect. NOT paleography / collation desk. Do not reuse diplomatic / parablepsis / latin1-edit-wipe.

**NOT Demesne/#93989** (bwrap binds entire `/home` instead of `$HOME`). Different bwrap defect. NOT manor charter. Do not reuse demesned / demesne / home-bind-overreach.

**NOT Cartouche/#93772** (ask-for-diagram defaults to a section-summary poster). Different defect. NOT Egyptian name-oval. Do not reuse diagrammed / cartouche / section-poster.

**NOT Attaint/#93821** (cyber-safeguard false-positive; one flag stains the session). Different defect. NOT court-roll attainder. Do not reuse unattainted / attaint / session-attainder.

**NOT Oriel/#93809** (macOS Desktop pop-out/maximised plan window does not reflow). Different defect. Do not reuse reflowed / oriel / plan-no-reflow.

**NOT Anarthria/#93782** (Wispr Flow clipboard+Ctrl+V silently dropped). Different defect. Do not reuse articulate / anarthria / dictation-paste-drop.

**NOT Trismus/#93823** (macOS UNUserNotification / XPC lock-order deadlock). Different defect. Do not reuse limber / trismus / notif-xpc-deadlock.

**NOT Foundling/#93889** (subagent lifecycle does not reap `run_in_background` Bash). Different defect. Do not reuse filiated / foundling / subagent-bash-outlive.

**NOT Crasis/#93960** (non-injective store slug). Different defect. Do not reuse injective / crased / store-slug-collide.

**NOT Tessera/#93929** (macOS version-named binary path → TCC). Different defect. Do not reuse unitary / tessellated / version-path-tcc.

**NOT Mojibake/#93848** (intermittent U+FFFD of multibyte Korean in CLAUDE.md). Different defect. Do not reuse verbatim / mojibaked / fffd-spall.

**NOT Scissel / Feoffee / Apograph / Airlock** (different catalog defects).

**NOT Afterimage** (CRT phosphor residual). Different defect. NOT CRT arcade.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT Humphrey bowl.

**NOT Thrash / Gleaner** (different catalog thrash / unreaped leftovers). Different defects.

Do NOT rename Vestry to any existing catalog slug. Catalog currently has 342 products; Vestry is #343 after Surfeit #342.
Do NOT reuse idle tempered / quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / solvent / frugal / circuit-held / no-spawn or seeded surfeit / phosphene / parablepsis / demesne / cartouche / attaint / oriel / anarthria / trismus / foundling / crasis / tessera / mojibake / quota-spawn-cascade / layer-tree-walk / latin1-edit-wipe / home-bind-overreach.

Display here is **Cormorant Upright**. Body is **Karla**. Mono is **IBM Plex Mono**.

Different surface: mount-refcount-race (per-process placeholder Set + inFlight-zero cleanup) vs quota-spawn-cascade vs layer-tree-walk vs latin1-edit-wipe vs home-bind overreach vs wrong diagram type vs session-flag contamination vs plan-window no-reflow vs dictation paste swallow vs child Bash outliving a subagent.

Different UI: stone / indigo stole / linen / brass peg / candle smoke / ink / altar wine / hanging robe-rail / two-acolyte hangers. Cormorant Upright / Karla / IBM Plex Mono. NOT deep claret / candle gold / pewter. NOT charcoal / vitreous lilac / phosphene flash. NOT cool vellum / indigo / oxblood. NOT parchment / oak / heraldic green.

Different verbs: Admit pegged, Score vestry, Walk mount-refcount-race, Compare pegged / vestry, Pin idle pegged, Pin seeded vestry, Pin mount-refcount-race, Hang the rail.

Different idle: **pegged**. Different #94008 seeded path: **vestry**. HOLD: **pegged** / **hold**. ALARM: **vestry** / **mount-refcount-race** / **placeholder-set** / **inflight-zero**. Path: **mount-refcount-race**.

## How to score

```bash
node --test projects/vestry/vestry.test.mjs
node projects/vestry/vestry.mjs projects/vestry/data/vestry.json
echo '{"seed":"vestry"}' | node projects/vestry/vestry.mjs
```

Open the living card at `projects/vestry/index.html` (or the live path `/vestry/`). Buttons: Admit pegged, Score vestry, Walk mount-refcount-race, Compare pegged / vestry, Pin idle pegged, Pin seeded vestry, Pin mount-refcount-race, Hang the rail, Score booth. Toggle chips for: mount-refcount-race, placeholder-set, inflight-zero, cross-process — the score flips. Lay a fixture JSON on the linen blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s module-level Set / inFlight zero / ≥84 sessions / Bash-retry walk from the published #94008 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/vestry/
- Folder: `projects/vestry/`
