# Trismus

A **oral-surgery / lockjaw / trigeminal clinic booth** — enamel chair, forceps tray, nerve chart, clamped jaw when the completion chime posts, steel instruments, clinical tile. Fonts **Archivo Black** (display) + **Figtree** (body) + **IBM Plex Mono** (chips). Palette: enamel `#F4F1EA`, clinic ink `#1A1F24`, trismus crimson `#B33A3A`, forceps steel `#7A858F`, nerve amber `#C4922A`, tile `#E8ECE8`, phosphor `#2F6F6A`. (Syne+Figtree+IBM Plex Mono is already Hysteresis, so display moved to Archivo Black.) NOT Foundling/#93889 (subagent Bash orphaning). NOT Gleaner/#93794 (unreaped `&`). NOT Schism/#93797 (dual-writer). NOT Tessera (mosaic), NOT Crasis (vellum/ligature), NOT Mojibake (compositor), NOT Scissel (mint), NOT Feoffee (chancery), NOT Apograph (scriptorium leaves), NOT Airlock (pressure-lock), NOT Scotoma (perimetry), NOT Aneroid (barometer), NOT Simulacrum (museum mannequins), NOT Solenoid (switchgear), NOT Scotia (molding), NOT Canard (press room), NOT Stet (copy desk), NOT Deadkey (platen), NOT Rasure (parchment scrape). Completely different UI/UX/metaphor. This is specifically: **MAIN THREAD SYNCHRONOUSLY DEADLOCKS INSIDE swift_addon.node WHEN POSTING A UNUserNotification WHILE NotificationService.close HOLDS THE XPC PATH — WHOLE DESKTOP UI FREEZES ON CODE-TAB TERMINAL COMPLETION.**

The chair should stay **limber** (HOLD: main thread free; notification post/close never blocks UI; jaw opens). Instead the booth was **trismus** after a **notif-xpc-deadlock**.

Primary:

- [anthropics/claude-code#93823](https://github.com/anthropics/claude-code/issues/93823) (OPEN). Title: `[BUG] Claude Desktop (macOS) main thread deadlocks in swift_addon.node posting a UNUserNotification; whole app locks when a Code tab terminal command finishes`. Labels: bug, platform:macos, area:desktop. Claude Desktop on macOS locks up completely after a Code-tab integrated terminal command finishes — at the moment it would post the "done" notification. Window cannot be moved or force-redrawn; no spinning beachball (app stops processing events entirely). Force quit is the only way out. `sample` of hung process: main thread blocked synchronously inside `swift_addon.node` on `-[UNUserNotificationCenter addNotificationRequest:withCompletionHandler:]`, waiting on `com.apple.usernotifications.UNUserNotificationServiceConnection`. That queue is itself blocked inside `swift_addon.node` `NotificationService.close(id:)` doing a synchronous XPC round trip for `removePendingNotificationRequestsWithIdentifiers:`. A third thread also blocked in `NotificationService.close(id:)` on `removeDeliveredNotificationsWithIdentifiers:`. Lock-order deadlock between posting a new notification and closing old ones, with the main thread caught in the middle. Cleared caches / reinstall / renamed Application Support + Caches — no change (native notification path, not app state). Same day also froze mid-response in Code tab without terminal use (may be same notification-on-completion path). **NOT #92410 / #91648** (Bash/subagent deadlocks — different defects). Cousins cite-only: #93495 (same class, slightly older build path; regression of #57706), #57706 (closed/stale prior: Cowork freezes on session switch — synchronous XPC notification deadlock). Backups cite-only (next focus only — do not auto-pick): #93772 #93770 #93777 #93782 #93821 #93811 #93809 #93924 #93925 #93954 #93967 #93957. Stay off Foundling/Gleaner/Schism/Crasis/Tessera/Mojibake/Scissel/Feoffee/Apograph/Airlock/Scotoma/Aneroid/Simulacrum/Solenoid/Scotia/Canard/Stet/Deadkey/Rasure paradigms.

17:50 trismus: an oral-surgery / lockjaw / trigeminal clinic booth for #93823. Idle **limber** / seeded **trismus** / path **notif-xpc-deadlock**. Score trismus or admit limber.

Score trismus or admit limber.

Idle word: **limber** (HOLD: main thread free; notification post/close never blocks UI; jaw opens). HOLD aliases: limber, unlocked, responsive, async-notif, free-main, unclenched. Seeded word: **trismus** / #93823 (Code-tab terminal done chime deadlocks main thread inside swift_addon.node UNUserNotification XPC). Path word: **notif-xpc-deadlock**. Product score: **trismus**. Never idle filiated / injective / crased / unitary / tessellated / verbatim / plenary / vested / singular / equalized / legible / calibrated / tethered / engaged / flush / candid / stetted / scisselled / unseised / apographed / mojibaked / fffd-spall / gleaned / orphaned / intact / rasured / bonded / registered / warded / parented.

Phrase: **Score trismus or admit limber.**

- **limber** = IDLE: HOLD; main thread free; notification post/close never blocks UI; jaw opens
- **trismus** = #93823 seeded path and product score: Code-tab terminal done chime deadlocks main thread on UNUserNotification XPC
- **notif-xpc-deadlock** = path word: addNotificationRequest vs NotificationService.close lock-order on the main thread
- **hold** = HOLD alias for idle limber
- **unlocked** = HOLD alias: jaw unlocked; bite opens
- **responsive** = HOLD alias: Desktop still processes events after the chime
- **async-notif** = HOLD alias: notification post/close stay async off the main thread
- **free-main** = HOLD alias: main thread never waits on UNUserNotification XPC
- **unclenched** = HOLD alias: masseter unclenched; forceps tray idle
- **main-blocked** = main thread blocked synchronously inside swift_addon.node on addNotificationRequest
- **xpc-close** = NotificationService.close holds the XPC path
- **add-notification** = posting the terminal-done UNUserNotification while close still holds the queue
- **force-quit-only** = no beachball; window cannot be moved; force quit only
- **code-tab-terminal-done** = Code-tab integrated terminal command finishes; freeze at the done chime
- **has-repro** = published shape: macOS Desktop / Code tab / add vs close XPC / force quit
- **cousins** = cite-only #93495, #57706
- **backups** = cite-only #93772 #93770 #93777 #93782 #93821 #93811 #93809 #93924 #93925 #93954 #93967 #93957 — do not auto-pick
- **fixtures** = enamel / clinic ink / trismus crimson / forceps steel / nerve amber / tile / phosphor
- **walk** = published idle limber → notif-xpc-deadlock → trismus

Verdicts: limber, trismus, notif-xpc-deadlock, hold, unlocked, responsive, async-notif, free-main, unclenched, main-blocked, xpc-close, add-notification, force-quit-only, code-tab-terminal-done, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **trismus** or already **limber**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): NotificationService.close and addNotificationRequest take XPC locks in opposite order on the main thread / sync bridge. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93823](https://github.com/anthropics/claude-code/issues/93823)
- Cite-only cousins: #93495 (same class, slightly older build path; regression of #57706); #57706 (closed/stale prior: Cowork freezes on session switch — synchronous XPC notification deadlock). Do not rebuild as separate booths.
- Do NOT confuse with Bash/subagent deadlocks (#92410, #91648) — those are different defects.
- Backups (data only; next focus only — do not auto-pick): #93772, #93770, #93777, #93782, #93821, #93811, #93809, #93924, #93925, #93954, #93967, #93957

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, platform:macos, area:desktop
- Claude Desktop on macOS locks up completely after a Code-tab integrated terminal command finishes — at the moment it would post the "done" notification
- Window cannot be moved or force-redrawn; no spinning beachball (app stops processing events entirely)
- Force quit is the only way out
- `sample` of hung process: main thread blocked synchronously inside `swift_addon.node` on `-[UNUserNotificationCenter addNotificationRequest:withCompletionHandler:]`, waiting on `com.apple.usernotifications.UNUserNotificationServiceConnection`
- That queue is itself blocked inside `swift_addon.node` `NotificationService.close(id:)` doing a synchronous XPC round trip for `removePendingNotificationRequestsWithIdentifiers:`
- A third thread also blocked in `NotificationService.close(id:)` on `removeDeliveredNotificationsWithIdentifiers:`
- Lock-order deadlock between posting a new notification and closing old ones, with the main thread caught in the middle
- Cleared caches / reinstall / renamed Application Support + Caches — no change (native notification path, not app state)
- Same day also froze mid-response in Code tab without terminal use (may be same notification-on-completion path)

Problem found: MAIN THREAD SYNCHRONOUSLY DEADLOCKS INSIDE swift_addon.node WHEN POSTING A UNUserNotification WHILE NotificationService.close HOLDS THE XPC PATH — WHOLE DESKTOP UI FREEZES ON CODE-TAB TERMINAL COMPLETION.

Why this solution: living catalog page + node diagnostic encoding idle **limber** / seeded **trismus** / path **notif-xpc-deadlock** so operators can score whether the booth is **trismus** or already **limber**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Posting or clearing a macOS notification must never block the main thread
2. App stays responsive after a terminal command completes
3. Notification post/close use async APIs / consistent lock order so XPC cannot deadlock UI

## Why not a clone

This is specifically: **MAIN THREAD SYNCHRONOUSLY DEADLOCKS INSIDE swift_addon.node WHEN POSTING A UNUserNotification WHILE NotificationService.close HOLDS THE XPC PATH — WHOLE DESKTOP UI FREEZES ON CODE-TAB TERMINAL COMPLETION.**

Novel paradigm: oral-surgery / lockjaw / trigeminal clinic — enamel chair, forceps tray, nerve chart, clamped jaw when the completion chime posts.

**NOT Foundling/#93889** (subagent lifecycle does not reap `run_in_background` Bash). Different defect. NOT foundling-hospital / parish-ward / foundling-wheel. Do not reuse filiated / foundling / subagent-bash-outlive. Foundling is subagent Bash orphaning; Trismus is macOS UNUserNotification / XPC lock-order main-thread deadlock on the terminal-done chime.

**NOT Gleaner/#93794** (Background `&` jobs in a Bash tool call orphaned to PID 1). Different defect. NOT agricultural leftover-harvest / wheat / stubble / sickle. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage resumes a second copy while the original still runs). Different defect. NOT twin-authority glass / dual-writer. Do not reuse live / schismed / resume-while-live.

**NOT Crasis/#93960** (non-injective store slug fuses two project paths). Different defect. NOT manuscript crasis / fused ligature / vellum drawers. Do not reuse injective / crased / store-slug-collide.

**NOT Tessera/#93929** (macOS version-named binary path → TCC row per release). Different defect. NOT mosaic / tesserae / privacy-pane. Do not reuse unitary / tessellated / version-path-tcc.

**NOT Mojibake/#93848** (Windows embedded CLAUDE.md UTF-8 → three U+FFFD). Different defect. NOT compositor / foul-proof / geta-tofu. Do not reuse verbatim / mojibaked / fffd-spall.

**NOT Scissel/#93915** (Windows Bash argv `-c` 8203 truncation / `\\` collapse). Different defect. NOT mint / coin-press / punch-and-scissel. Do not reuse plenary / scisselled / argv-trunc.

**NOT Feoffee/#93863** (preview_start getcwd EPERM despite parent FDA). Different defect. NOT medieval feoffment / livery-of-seisin / chancery. Do not reuse vested / unseised / preview-eperm.

**NOT Apograph/#93859** (Desktop reopen forks a full transcript copy). Different defect. NOT scriptorium / stacked parchment leaves / session-ID wax seals. Do not reuse singular / apographed / reopen-fork.

**NOT Airlock/#93862** (sandbox socat proxy readiness race). Different defect. NOT submarine / spacecraft pressure-lock. Do not reuse equalized / blown / socat-race.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT ophthalmology / Humphrey bowl / perimetry. Do not reuse legible / scotomized / command-args-blind.

**NOT Aneroid/#93901** (VS Code context ring ignores autoCompactWindow). Different defect. NOT aneroid-barometer / instrument-panel / sealed gauge. Do not reuse calibrated / aneroided / wrong-window-ring.

**NOT Simulacrum/#93751** (Claude-in-Chrome hollow MCP success). Different defect. NOT Baudrillard / hyperreality museum. Do not reuse tethered / hollow / phantom-navigate.

**NOT Solenoid/#93754** (Desktop Settings RC toggle fidelity). Different defect. NOT industrial switchgear / solenoid-coil. Do not reuse engaged / inert / warm-before-message.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows). Different defect. NOT limestone / shadow-gap. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd). Different defect. NOT press-room. Do not reuse candid / canarded / onedrive-cwd.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Deadkey/#93788** (ESC-CSI never resolve). Different defect. NOT typewriter platen. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Rasure/#93791** (CreationTime flip / parchment scrape). Different defect. Do not reuse intact / rasured / creation-time-flip.

**NOT Hysteresis** (B-H curve / remanence / Syne+Figtree+IBM Plex Mono). Different defect and exact font trio already taken — display here is Archivo Black.

**NOT Limber/#92590** (bilge limber-hole / `$TMPDIR` silt). Different product; idle word **limber** here means an unlocked jaw, not a drain board.

Do NOT rename Trismus to any existing catalog slug. Catalog currently has 333 products; Trismus is #334 after Foundling #333.
Do NOT reuse idle filiated / injective / crased / store-slug-collide / unitary / tessellated / version-path-tcc / verbatim / plenary / vested / unseised / preview-eperm / singular / apographed / reopen-fork / equalized / blown / socat-race / legible / scotomized / command-args-blind / calibrated / aneroided / wrong-window-ring / tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / gleaned / orphaned / inherited / unreaped-ampersand / credentialed / outridden / early-connect / intact / rasured / creation-time-flip / scisselled / argv-trunc / mojibaked / mojibake / fffd-spall / bonded / registered / warded / parented.

Display here is **Archivo Black**. Body is **Figtree**. Mono is **IBM Plex Mono**.

Different surface: macOS UNUserNotification / XPC lock-order main-thread deadlock on the terminal-done chime vs subagent `run_in_background` Bash that outlives the child agent vs Bash-call `&` leftover harvest vs dual-writer resume vs non-injective store slug vs version-named TCC path vs Windows embedded CLAUDE.md U+FFFD vs argv `-c` truncation vs preview_start getcwd EPERM vs Desktop sidebar reopen session-ID fork vs sandbox socat race.

Different UI: enamel / clinic ink / trismus crimson / forceps steel / nerve amber / tile / phosphor / jaw clamp / forceps tray / trigeminal nerve chart / enamel chair. Archivo Black / Figtree / IBM Plex Mono. NOT linen hatch. NOT wheat stubble. NOT twin pulpits. NOT vellum ligature. NOT limestone mosaic. NOT rice-paper type case. NOT slag floor copper die. NOT oak panel parchment. NOT cream parchment scriptorium. NOT navy hull. NOT Humphrey bowl. NOT sealed gauge. NOT museum vitrine. NOT coil-plunger. NOT limestone column-molding. NOT aged newsprint. NOT B-H remanence curve. NOT bilge limber-hole.

Different verbs: Admit limber, Score trismus, Walk notif-xpc-deadlock, Compare limber / trismus, Pin idle limber, Pin seeded trismus, Pin notif-xpc-deadlock, Unclamp the jaw.

Different idle: **limber**. Different #93823 seeded path: **trismus**. HOLD: **limber** / **hold**. ALARM: **trismus** / **notif-xpc-deadlock** / **main-blocked** / **xpc-close**. Path: **notif-xpc-deadlock**.

## How to score

```bash
node --test projects/trismus/trismus.test.mjs
node projects/trismus/trismus.mjs projects/trismus/data/trismus.json
echo '{"seed":"trismus"}' | node projects/trismus/trismus.mjs
```

Open the living card at `projects/trismus/index.html` (or the live path `/trismus/`). Buttons: Admit limber, Score trismus, Walk notif-xpc-deadlock, Compare limber / trismus, Pin idle limber, Pin seeded trismus, Pin notif-xpc-deadlock, Unclamp the jaw. Toggle chips for: notif-xpc-deadlock, main-blocked, xpc-close, add-notification — the score flips. Lay a fixture JSON on the enamel tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s Code-tab terminal-done / addNotificationRequest ↔ close / force-quit walk from the published #93823 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/trismus/
- Folder: `projects/trismus/`
