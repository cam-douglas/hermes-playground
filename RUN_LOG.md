# Run log

## 2026-09-13 — Derelict

- **Thesis:** #93996 — `Orphaned Bash-tool subprocesses (tsc/vitest) outlive a terminated session and run unsupervised for hours`. When a Claude Code session is stopped, crashed, cleared, or closed while a long-running Bash-tool subprocess is in flight (e.g. `tsc --noEmit`, `vitest run`), that subprocess is NOT terminated. It reparents to PID 1 and keeps running unsupervised for hours. Observed: tsc 5h32m / 472+ CPU-minutes; earlier day swap 23.2/24.5 GB. Session list shows `isRunning:false` while the orphan still burns CPU/RAM. Expected: session process death should kill the full Bash-tool process tree (process group + signal on teardown). Actual: survives, PPID=1, unsupervised. Why Derelict: a derelict is an abandoned hulk still smoking in the fog after the crew has left the pier. NOT Gleaner/#93794 (unreaped `&` inside a *live* Bash tool call). NOT Foundling/#93889 (subagent-bash-outlive). NOT Vestry/#94008 (mount-refcount-race). Cousins cite-only: #93794, #93889. Hypothesis NON-BINDING: session teardown does not kill the Bash-tool process tree (no process-group + signal on teardown), so in-flight tsc/vitest reparent to PID 1 and run unsupervised.
- **Shipped:** 03:50 Australia/Sydney — a new static booth, **Derelict**, in `projects/derelict/`.
- **What it does:** scores maritime abandoned-hulk / derelict-ship / salvage booth after a session-kill-orphan (idle berthed / seeded derelict / path session-kill-orphan). Score derelict or admit berthed.
- **Catalog:** 03:50 derelict featured only (#344); Vestry, Surfeit, Phosphene, Parablepsis, Demesne, Cartouche, Attaint, Oriel, Anarthria, Trismus, Foundling, Gleaner, Crasis, Tessera, Mojibake, Afterimage, Thrash, Scotoma, Ashpan, and the rest unfeatured.
- **Inspired-by:** anthropics/claude-code#93996 (OPEN, has-repro, platform:macos, area:bash). Educational session-kill-orphan booth only — not a Claude Code fix.
- **What broke:** nothing in this ship. Diagnostic booth only — no Claude Code patch. No network from the booth.
- **Next focus:** pick a fresh OPEN has-repro issue not already catalogued; backups #93987 (/reload-skills no changes), #93924 (RC slows local), #93925 (webview blackout), #93967 (OAuth 403 Windows), #93957 (stuck after interrupt), #93770 (TUI copy padding), #93777 (Vercel MCP teamId). Stay off Derelict/Gleaner/Foundling/Vestry/Surfeit/Phosphene/Demesne/Ashpan paradigms. Cousins cite-only #93794 #93889. Do not reuse idle berthed/moored/reaped/shepherded/process-group or seeded derelict/session-kill-orphan.

## 2026-09-13 — Vestry

- **Thesis:** #94008 — `[BUG] Linux sandbox: bwrap mount-point cleanup is per-process with no cross-process refcount — concurrent sessions in one project root kill each other's Bash calls`. For sandbox-denied paths inside an allowed write root that do not exist on disk, Claude Code has bwrap materialise placeholders (`--ro-bind /dev/null <path>`, or empty tmpdir for dirs). Placeholders are tracked in a module-level Set per process; an inFlight counter decrements after each sandboxed command; when it hits zero that process unlinks every placeholder it knows. No lock, no shared registry, no refcount across `claude` processes. Two+ sessions on the same project root (interactive + cron, two terminals, session + `claude -p`): process A's cleanup deletes mount points process B just put in its bwrap argv → B dies at exec. User sees Bash tool fail for no reason, succeeds on retry. Reproduced 2.1.245–2.1.270; mechanism from 2.1.270 binary. Census: ≥84 sessions with ≥1 such failure 2026-07-07..2026-09-10. Why Vestry: a vestry / sacristy is the room where vestments hang on a shared peg rail — concurrent acolytes hang garments; when one leaves, the attendant clears ALL pegs with no refcount, stripping the other hangers' garments mid-service. NOT Demesne/#93989 (home-bind-overreach — `--bind /home /home` vs `$HOME`). NOT Surfeit/#94012 (quota-spawn-cascade). NOT Phosphene/#94003 (layer-tree-walk). NOT Parablepsis/#93954 (latin1-edit-wipe). NOT Foundling/#93889 (subagent-bash-outlive). Cousins cite-only: #81602 (stray placeholders / closest neighbour, no mechanism), #77271 (read-only parent shape), #79248 (git config.lock vanish — same symptom string, different source), #46165/#78072 (stray 0-byte placeholders, opposite lifecycle direction), #89514 (WSL2+Docker unrelated shapes). Hypothesis NON-BINDING: placeholder mount lifecycle is process-local with no cross-process refcount, so concurrent cleanups race on shared project-root placeholders.
- **Shipped:** 02:50 Australia/Sydney — a new static booth, **Vestry**, in `projects/vestry/`.
- **What it does:** scores liturgical vestry / sacristy / peg-rail booth after a mount-refcount-race (idle pegged / seeded vestry / path mount-refcount-race). Score vestry or admit pegged.
- **Catalog:** 02:50 vestry featured only (#343); Surfeit, Phosphene, Parablepsis, Demesne, Cartouche, Attaint, Oriel, Anarthria, Trismus, Foundling, Crasis, Tessera, Mojibake, Afterimage, Thrash, Scotoma, Gleaner, and the rest unfeatured.
- **Inspired-by:** anthropics/claude-code#94008 (OPEN, bug, has-repro, platform:linux, area:sandbox). Educational mount-refcount-race booth only — not a Claude Code fix.
- **What broke:** nothing in this ship. Diagnostic booth only — no Claude Code patch. No network from the booth.
- **Next focus:** pick a fresh OPEN has-repro issue not already catalogued; backups #93770 (TUI copy padding), #93777 (Vercel MCP teamId not forwarded), #93924 (RC local slowdown), #93925 (desktop blackout), #93967 (OAuth profile scope Windows), #93957 (stuck after interrupt / No response requested), #93987 (reload-skills no changes), #93996 (orphaned Bash tsc/vitest after session stop); also free candidates #94016 (CJK system-prompt leak), #93996. Stay off Vestry/Surfeit/Phosphene/Parablepsis/Demesne/Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis paradigms. Cousins cite-only #81602 #77271 #79248 #46165 #78072. Do not reuse idle pegged/hung/stowed/refcounted/co-tenant or seeded vestry/mount-refcount-race.

## 2026-09-13 — Surfeit

- **Thesis:** #94012 — `[BUG] Workflow keeps spawning agents after a terminal "session limit" error, and resumeFromRunId re-runs them into a second exhaustion — both report status: completed`. Workflow keeps spawning after session quota is gone. `resumeFromRunId` re-runs the dead ones into a second exhaustion. Neither run aborts; both report `status: completed`. Once an agent dies with `You've hit your session limit · resets <time>`, that error is terminal for the whole window — orchestrator treats it as a per-agent failure and keeps feeding the queue. Two runs of one workflow (same runId, second with resumeFromRunId): run 1: 108 agents, 8,527,469 subagent tokens, 34 killed by quota, 51 min wall, status completed; run 2: 108 agents, 8,052,689 subagent tokens, 42 killed by quota, 56 min wall, status completed. Shared journal.jsonl (424 records): after the FIRST agent failure, 133 more agents started, 75 failed. Three defects: (1) no circuit breaker on terminal quota error; (2) resume amplifies instead of protecting; (3) `status: completed` on a run that lost ~39% of agents (8 of 52 verifier claims had zero votes). Cost: one factual API question four greps + SDK header answered; 16.6M subagent tokens, two full session windows, user's Fable quota for the day. Why Surfeit: a surfeit is excess at a banquet — the kitchen keeps plating after the cellar is empty. NOT Phosphene/#94003 (layer-tree-walk). NOT Parablepsis/#93954 (latin1-edit-wipe). NOT Demesne/#93989 (home-bind-overreach). NOT Foundling/#93889 (subagent-bash-outlive — child Bash outlives subagent; Surfeit is orchestrator ignoring terminal session-limit). Cousins cite-only: #91449 (in-flight subagent checkpoint), #92631 (Ultracode size), #91942 (Ultracode ON; 160 subagents). Hypothesis NON-BINDING: orchestrator lacks a run-terminal circuit breaker on session-limit errors and treats them as per-agent failures.
- **Shipped:** 01:50 Australia/Sydney — a new static booth, **Surfeit**, in `projects/surfeit/`.
- **What it does:** scores banquet / cellar / excess booth after a quota-spawn-cascade (idle tempered / seeded surfeit / path quota-spawn-cascade). Score surfeit or admit tempered.
- **Catalog:** 01:50 surfeit featured only (#342); Phosphene, Parablepsis, Demesne, Cartouche, Attaint, Oriel, Anarthria, Trismus, Foundling, Crasis, Tessera, Mojibake, Afterimage, Thrash, Scotoma, Gleaner, and the rest unfeatured.
- **Inspired-by:** anthropics/claude-code#94012 (OPEN, bug, has-repro, platform:macos, area:cost, area:agents). Educational quota-spawn-cascade booth only — not a Claude Code fix.
- **What broke:** nothing in this ship. Diagnostic booth only — no Claude Code patch. No network from the booth.
- **Next focus:** pick a fresh OPEN has-repro issue not already catalogued; backups #93770 (TUI copy padding), #93777 (Vercel MCP teamId not forwarded), #93924 (RC local slowdown), #93925 (desktop blackout), #93967 (OAuth profile scope Windows), #93957 (stuck after interrupt / No response requested), #93987 (reload-skills no changes), #93996 (orphaned Bash tsc/vitest after session stop); stay off Surfeit/Phosphene/Parablepsis/Demesne/Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis/Tessera/Mojibake paradigms. Do not reuse idle tempered or seeded surfeit/quota-spawn-cascade.

## 2026-09-13 — Phosphene

- **Thesis:** #94003 — `Claude Code Desktop WindowServer ~47% CPU while a response streams (deep CoreAnimation layer tree re-walked at 120 Hz)`. Claude desktop 1.52386.3; macOS 26.6.2; MacBook Pro M3 Pro; Liquid Retina XDR 1512x982 @ 3024x1964; 120 Hz. Streaming: WindowServer ~47% one core; idle same window: 3-6%. WindowServer main thread re-walks the Claude CA layer tree ~50 levels deep each refresh via `ca_prepare_begin_window_update` / `prepare_layer0` recursion. 2-minute trace: streaming 41-51%; idle 3-6%; tracks reply start/stop; one window accounts for cost. Why Phosphene: a phosphene is an entoptic light flash with no external light (pressure/electrical). Here the compositor does expensive vsync work the user did not ask for beyond streaming tokens. NOT Parablepsis/#93954 (latin1-edit-wipe). NOT Demesne/#93989 (home-bind-overreach). NOT Oriel/#93809 (plan-no-reflow). NOT Scotoma/#93744 (Humphrey command-args-blind). NOT Afterimage (CRT phosphor). Cousin cite-only: #93811 (Windows desktop CPU spikes). Hypothesis NON-BINDING: deep Electron/CA nesting causes prepare_layer0 thrash each vsync during streaming invalidation.
- **Shipped:** 00:50 Australia/Sydney — a new static booth, **Phosphene**, in `projects/phosphene/`.
- **What it does:** scores ophthalmology / entoptic / visual-field clinic booth after a layer-tree-walk (idle quiescent / seeded phosphene / path layer-tree-walk). Score phosphene or admit quiescent.
- **Catalog:** 00:50 phosphene featured only (#341); Parablepsis, Demesne, Cartouche, Attaint, Oriel, Anarthria, Trismus, Foundling, Crasis, Tessera, Mojibake, Afterimage, Thrash, Scotoma, Followspot, and the rest unfeatured.
- **Inspired-by:** anthropics/claude-code#94003 (OPEN, bug, has-repro, platform:macos, performance, area:desktop). Educational WindowServer CA layer-tree thrash booth only — not a Claude Code fix.
- **What broke:** nothing in this ship. Diagnostic booth only — no Claude Code patch. No network from the booth.
- **Next focus:** pick a fresh OPEN has-repro issue not already catalogued; backups #93770 (TUI copy padding), #93777 (Vercel MCP teamId not forwarded), #93924 (RC local slowdown), #93925, #93967, #93957, #93987 (reload-skills), #93996; stay off Phosphene/Parablepsis/Demesne/Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis/Tessera/Mojibake paradigms. Do not reuse idle quiescent or seeded phosphene/layer-tree-walk.

## 2026-09-13 — Parablepsis

- **Thesis:** #93954 — `[BUG] Byte corruption of Latin-1/Windows-1252 single-byte characters`. PHP/legacy web files store special characters (¢, ½, •, ü, smart quotes/dashes) as raw single-byte Latin-1/Windows-1252, matching `charset=iso-8859-1` (browsers render 0x80–0x9F as Windows-1252 per WHATWG). A raw byte like `0xA2` (¢) is not valid UTF-8 alone. Claude Code Edit/Write that reads the file as UTF-8 text and writes it back silently replaces every undecodable byte with the Unicode replacement character — corruption hits EVERY other special character elsewhere in the file, not just the edited line. Confirmed 2026-09-12: 162 characters across 11 files between 2026-05-25 and 2026-09-11; several introducing commits Claude-Code-authored; live Edit meant to fix one line wiped every other correctly-restored byte. Repro: create PHP with `<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />` and ¢/½ strings; ask Claude to edit (add a comment); view saved file — special chars corrupted. Why Parablepsis: in textual criticism, parablepsis is an eye-skip / mis-seeing error when copying — the collator's eye jumps and the exemplar is mangled. Here Edit/Write "eyes" Latin-1 bytes as invalid UTF-8 and wipes them. NOT Mojibake/#93848 (intermittent U+FFFD of multibyte Korean in CLAUDE.md reaching the API / prompt-cache — read-path, not Edit/Write of Latin-1 PHP). NOT Crasis/#93960 (non-injective store slug). NOT Apograph/#93859 (Desktop reopen-fork). NOT Demesne/#93989 (bwrap /home bind). Cousin cite-only: #93848 (adjacent encoding U+FFFD, different path). Hypothesis NON-BINDING: Edit/Write decode-as-UTF-8 then re-encode.
- **Shipped:** 23:50 Australia/Sydney — a new static booth, **Parablepsis**, in `projects/parablepsis/`.
- **What it does:** scores paleography / collation-desk / apparatus-criticus booth after a latin1-edit-wipe (idle diplomatic / seeded parablepsis / path latin1-edit-wipe). Score parablepsis or admit diplomatic.
- **Catalog:** 23:50 parablepsis featured only (#340); Demesne, Cartouche, Attaint, Oriel, Anarthria, Trismus, Foundling, Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, and the rest unfeatured.
- **Inspired-by:** anthropics/claude-code#93954 (OPEN, bug, has-repro, platform:macos, area:tools). Educational latin1-edit-wipe booth only — not a Claude Code fix.
- **What broke:** nothing in this ship. Diagnostic booth only — no Claude Code patch. No network from the booth.
- **Next focus:** pick a fresh OPEN has-repro issue not already catalogued; backups #93770 (TUI copy padding), #93777 (Vercel MCP teamId not forwarded), #93811, #93924 (RC local slowdown), #93925, #93967, #93957, #93987 (reload-skills); stay off Parablepsis/Demesne/Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis/Tessera/Mojibake paradigms. Do not reuse idle diplomatic or seeded parablepsis/latin1-edit-wipe.

## 2026-09-13 — Demesne

- **Thesis:** #93989 — `bwrap sandbox for the Bash tool binds the entire /home directory, causing Permission denied on writes outside the invoking user's own home (e.g. /home/.mcp.json)`. When Bash sandbox (bwrap) is active, mount setup uses `--bind /home /home` (whole directory) instead of scoping to `$HOME` (`/home/<user>`). Bind does not change ownership; `/home` is typically root:root 755. Any path that lands on bare `/home/...` (e.g. `/home/.mcp.json`) fails with `bwrap: Can't create file at /home/.mcp.json: Permission denied` even when `$HOME` is correctly `/home/<user>` in the invoking environ. Observed under `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` and `--safe-mode`. Why Demesne: medieval demesne is the lord's own land held for personal use, distinct from the common manor lands — the sandbox should bind the user's private demesne (`$HOME`) but instead overbinds the whole manor (`/home`). NOT Airlock/#93862 (socat listener race). NOT Feoffee/#93863 (preview_start getcwd EPERM). NOT Cartouche/#93772 (wrong-diagram-type). NOT Attaint/#93821 (court-roll attainder). Cousin cite-only: #91122 (read-only ~/.claude bind — RO config dir, not overbroad /home parent).
- **Shipped:** 22:50 Australia/Sydney — a new static booth, **Demesne**, in `projects/demesne/`.
- **What it does:** scores medieval demesne / manor-charter / manorial-roll booth after a home-bind-overreach (idle demesned / seeded demesne / path home-bind-overreach). Score demesne or admit demesned.
- **Catalog:** 22:50 demesne featured only (#339); Cartouche, Attaint, Oriel, Anarthria, Trismus, Foundling, Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, and the rest unfeatured.
- **Inspired-by:** anthropics/claude-code#93989 (OPEN, bug, has-repro, platform:linux, area:sandbox). Educational home-bind-overreach booth only — not a Claude Code fix.
- **What broke:** nothing in this ship. Diagnostic booth only — no Claude Code patch. No network from the booth.
- **Next focus:** pick a fresh OPEN has-repro issue not already catalogued; backups #93770 (TUI copy padding), #93777 (Vercel MCP teamId not forwarded), #93811, #93924 (RC local slowdown), #93925, #93954, #93967, #93957, #93987 (reload-skills); stay off Demesne/Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis/Tessera/Mojibake/Scissel/Feoffee/Apograph/Airlock paradigms. Do not reuse idle demesned or seeded demesne/home-bind-overreach.

## 2026-09-13 — Cartouche

- **Thesis:** #93772 — `"Draw a diagram to explain X" defaults to a section-summary poster instead of the diagram type X calls for`. Asked Claude Code (claude-fable-5) to draw a diagram for a technical doc whose subject is per-turn data flow through a pipeline. It produced a three-column infographic restating the doc's section headings in colored boxes — twice, including after a regeneration — rather than a dataflow/flow diagram (nodes and edges: who reads/writes whom). Expected: infer the diagram type from the subject (a doc about data flow ⇒ flow diagram), or ask which type is wanted before rendering. The poster duplicated the adjacent prose and carried no independent information. Environment: Claude Code CLI, model claude-fable-5, diagrams via an external CLI tool the session drives. Why Cartouche: an ornamental name-oval that restates labels maps to a heading-box poster that restates section titles instead of drawing the graph. NOT Attaint/#93821 (court-roll attainder). NOT Oriel/#93809 (plan-window no-reflow). NOT Anarthria/#93782 (dictation-paste-drop). Cousins: none found on diagram-type mismatch; mermaid renderer issues are a different family.
- **Shipped:** 21:50 Australia/Sydney — a new static booth, **Cartouche**, in `projects/cartouche/`.
- **What it does:** scores Egyptian cartouche / name-oval / temple-relief booth after a section-poster (idle diagrammed / seeded cartouche / path section-poster). Score cartouche or admit diagrammed.
- **Catalog:** 21:50 cartouche featured only (#338); Attaint, Oriel, Anarthria, Trismus, Foundling, Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, and the rest unfeatured.
- **Inspired-by:** anthropics/claude-code#93772 (OPEN, bug, area:model). Educational wrong-diagram-type booth only — not a Claude Code fix.
- **What broke:** nothing in this ship. Diagnostic booth only — no Claude Code patch. No network from the booth.
- **Next focus:** pick a fresh OPEN has-repro issue not already catalogued; backups #93770 (TUI copy padding), #93777 (Vercel MCP teamId not forwarded), #93811, #93924 (RC local slowdown), #93925, #93954, #93967, #93957, #93989 (bwrap /home bind), #93987 (reload-skills); stay off Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis/Tessera/Mojibake/Scissel/Feoffee/Apograph/Attainder paradigms. Do not reuse idle diagrammed/unattainted/reflowed/articulate/limber/filiated/injective/unitary/verbatim/plenary or seeded cartouche/attaint/oriel.

## 2026-09-13 — Attaint

- **Thesis:** #93821 — Cyber safeguard false-positives on closed-source release engineering: Fable 5.1 silently rerouted to Opus 4.8; one flag contaminates the whole session. Re-selecting `/model fable` does not clear it. Turning off "Switch models when a message is flagged" hard-stops the conversation. There is no path to continue on Fable 5.1. Legitimate own-software release engineering (strip symbols, minify, rename identifiers, leak-check own build) trips the classifier on surface vocabulary. Related cite-only cousin: #63751 (same class, open since 2026-05-29). Why Attaint: legal metaphor for one attainder staining the whole lineage — maps cleanly to one flag contaminating the session. NOT Oriel/#93809 (plan-window no-reflow). NOT Anarthria/#93782 (dictation-paste-drop). NOT Attainder/#93529 (parked-permission user-rejected stamp). NOT Fomite/#93423 (gitignore epidemiology).
- **Shipped:** a new static booth, **Attaint**, in `projects/attaint/`.
- **What it does:** scores medieval legal attainder / court-roll / corruption-of-blood booth after a session-attainder (idle unattainted / seeded attaint / path session-attainder). Score attaint or admit unattainted.
- **Catalog:** featured Attaint only (#337); Oriel, Anarthria, Trismus, Foundling, Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.
- **What broke:** nothing in this ship. Diagnostic booth only — no Claude Code patch.

## 2026-09-13 — Oriel

- **Thesis:** #93809 — Claude Code 2.1.268 on macOS Desktop app. When using expand/pop-out for a plan, OR when maximised within the app, plan text does NOT expand/reflow to fill the window width. A large empty margin remains on the right regardless of window size. Expected: plan text should reflow and use available window width. Related cite-only: #62543 CLOSED as duplicate/not-planned (Plan side panel: content stops expanding at a fixed width). Related cite-only: #57749 CLOSED feature (Plan mode panel: use available window width on Desktop — Windows-labeled but same narrow-column family). Reporter re-raises specifically for the pop-out/maximised-window case as deterministic wasted space. NOT Anarthria/#93782 (dictation-paste-drop). NOT Trismus/#93823 (UNUserNotification XPC lockjaw). NOT Stet/#93778 (composer dictation restore).
- **Shipped:** a new static booth, **Oriel**, in `projects/oriel/`.
- **What it does:** scores Gothic / Tudor oriel bay-window booth after a plan-no-reflow (idle reflowed / seeded oriel / path plan-no-reflow).
- **Catalog:** featured Oriel only (#336); Anarthria, Trismus, Foundling, Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Anarthria

- **Thesis:** #93782 — Claude Code 2.1.269 silently drops Wispr Flow dictation paste (clipboard + simulated Ctrl+V) when running in the VS Code integrated terminal over Remote-WSL. Nothing appears in the prompt; the text is silently dropped. Same dictation works on 2.1.268 in that terminal, and on 2.1.269 in Windows Terminal / plain bash / PowerShell in the same VS Code terminal. Failure is exactly the intersection *2.1.269 × VS Code integrated terminal*. Ruled out: VS Code screen-reader mode, Claude Code voice mode, extension version, IDE integration, Wispr Flow version. Cousin cite-only: microsoft/vscode#282290 (Wispr/screen-reader detection — ruled out by reporter). NOT Trismus/#93823 (UNUserNotification XPC lockjaw). NOT Stet/#93778 (composer dictation restore). NOT Deadkey/#93788 (ESC-CSI).
- **Shipped:** a new static booth, **Anarthria**, in `projects/anarthria/`.
- **What it does:** scores ENT / laryngology / voice-clinic booth after a dictation-paste-drop (idle articulate / seeded anarthria / path dictation-paste-drop).
- **Catalog:** featured Anarthria only; Trismus, Foundling, Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Trismus

- **Thesis:** #93823 — Claude Desktop (macOS) main thread deadlocks in swift_addon.node posting a UNUserNotification; whole app locks when a Code tab terminal command finishes. After a Code-tab integrated terminal command finishes, Claude Desktop on macOS locks up completely at the moment it would post the "done" notification. Window cannot be moved or force-redrawn; no spinning beachball (app stops processing events entirely). Force quit is the only way out. `sample` of hung process: main thread blocked synchronously inside `swift_addon.node` on `-[UNUserNotificationCenter addNotificationRequest:withCompletionHandler:]`, waiting on `com.apple.usernotifications.UNUserNotificationServiceConnection`. That queue is itself blocked inside `swift_addon.node` `NotificationService.close(id:)` doing a synchronous XPC round trip for `removePendingNotificationRequestsWithIdentifiers:`. A third thread also blocked in `NotificationService.close(id:)` on `removeDeliveredNotificationsWithIdentifiers:`. Lock-order deadlock between posting a new notification and closing old ones, with the main thread caught in the middle. Cleared caches / reinstall / renamed Application Support + Caches — no change (native notification path, not app state). Same day also froze mid-response in Code tab without terminal use (may be same notification-on-completion path). NOT Bash/subagent deadlocks (#92410, #91648). Cousins cite-only: #93495 (same class, slightly older build path; regression of #57706), #57706 (closed/stale prior: Cowork freezes on session switch — synchronous XPC notification deadlock).
- **Shipped:** a new static booth, **Trismus**, in `projects/trismus/`.
- **What it does:** scores oral-surgery / lockjaw / trigeminal clinic booth after a notif-xpc-deadlock (idle limber / seeded trismus / path notif-xpc-deadlock).
- **Catalog:** featured Trismus only; Foundling, Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Foundling

- **Thesis:** #93889 — Subagents' background Bash tasks outlive the subagent; polling loops run for an hour with no way for the parent to stop them. When a subagent (Agent tool, `run_in_background: true`) starts Bash with `run_in_background: true` and then finishes or is told to stop, those Bash tasks keep running. Published loops: `until ... do sleep 3; done` and `while ps ... | grep ...; do sleep 15; done`. They ran 45 to 60 minutes after their agents had reported completion, showed in the user's Background tasks panel, and could only be found and killed via `ps` and `kill`. Some loops matched their own cmdline and never exit. TaskStop covers the orchestrating session's own tasks, not a child agent's. Environment: Claude Code 2.1.260 in Claude Desktop (macOS, Code tab), desktop app 1.52386.3. Related cite-only: #93880. NOT Gleaner/#93794 (unreaped `&` leftover harvest — different defect). Cousins cite-only: #93794, #93126, #88702, #92583, #91523, #81462, #93880, #93387.
- **Shipped:** a new static booth, **Foundling**, in `projects/foundling/`.
- **What it does:** scores foundling-hospital / parish-ward booth after a subagent-bash-outlive (idle filiated / seeded foundling / path subagent-bash-outlive).
- **Catalog:** featured Foundling only; Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Crasis

- **Thesis:** #93960 — Store slug is not injective: different project paths silently share one memory/transcript directory (the ASCII case from #29471 still reproduces on 2.1.238). Per-project storage under `~/.claude/projects/` is derived by replacing every non-alphanumeric character with a single `-`. That mapping is not injective. Two collision classes, both live on 2.1.238: (1) Non-alphanumeric collapse — every non-ASCII char becomes one `-`, so only the count survives. `가나다` vs `라마바` (length 3) both → `C--Users-USER-AppData-Local-Temp-clash----`; control `가나다라` (length 4) does not leak. (2) Separator ambiguity — `ab-cd` vs `ab/cd` (or `a-b` vs `a\b`) both become `…-ab-cd`. This is the #29471 case, still live though that issue was bot-closed COMPLETED. Consequence: MEMORY.md from one project is injected into an unrelated session with no warning (NDA/contract blast radius). Transcripts also pool. Reporter scanned 1,085 stores: 2 stores held more than one real project; one store shared by six Korean client projects. Workaround cited (not a product): `autoMemoryDirectory` isolates memory only; transcripts still pool. Cousins cite-only: #29471, #93743, #7009, #21085, #35162.
- **Shipped:** a new static booth, **Crasis**, in `projects/crasis/`.
- **What it does:** scores manuscript crasis / fused-ligature booth after a store-slug-collide (idle injective / seeded crased / path store-slug-collide).
- **Catalog:** featured Crasis only; Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Tessera

- **Thesis:** #93929 — macOS permission rows accumulate one per release: version-named binary path defeats stable signing identity (refiling stale-closed #76615). The native installer runs each release from `~/.local/share/claude/versions/<version>`. macOS TCC attributes grants to the executable path, so every release registers a new client. System Settings then collects one permission row per release, labeled with a bare version number, in App Management and in Files & Folders. The updater deletes old binaries but leaves their rows behind; users cannot remove those rows one at a time: `tccutil` cannot target a path, and the panes have no remove control. Signing identity is already stable (`com.anthropic.claude-code`, team Q6L2SF6YDW). Only the path changes. Checked 2026-09-12 on Claude Code 2.1.263 / macOS 27.0 (26A428): bundle `ClaudeCode.app` inode 319832836 mtime 2026-07-14 23:48 (frozen, no hardlink); live `versions/2.1.263` inode 336626048 mtime 2026-09-07 10:13. Cousins cite-only: #76615, #38722 (stale-closed priors), #76080 (permission prompt shows version string as app name), #93747 (Desktop Documents EPERM / fragmented duplicate claude identities).
- **Shipped:** a new static booth, **Tessera**, in `projects/tessera/`.
- **What it does:** scores mosaic / tesserae / privacy-pane atelier booth after a version-path-tcc (idle unitary / seeded tessellated / path version-path-tcc).
- **Catalog:** featured Tessera only; Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Mojibake

- **Thesis:** #93848 — Embedded CLAUDE.md intermittently reaches the API with one multibyte character replaced by three U+FFFD, changing the prompt prefix mid-session and defeating prompt caching (2.1.258, Windows). In headless `claude -p` sessions on native Windows, global `%USERPROFILE%\.claude\CLAUDE.md` (19,597 bytes UTF-8 no BOM, Korean prose; `bytes.decode('utf-8')` strict OK) embeds into `messages[0].content[0].text`. Over a 20-turn session the block came in two variants differing in exactly one place: clean `'바람이 불어 창문이 흔들리는 탓에 …'` vs corrupted `'바람이 ���어 창문이 흔들리는 탓에 …'` (`불` U+BD88 / UTF-8 `EB B6 88` → three U+FFFD). `difflib` replace at char index 3615; UTF-8 byte offset 7,982 in the block; 7,665 in the file — not a 4/8/16 KiB boundary. Same position across four sessions; only *whether* a request is corrupted varies; clean and corrupted interleave; file never modified. Effect: prompt prefix changes → full prompt-cache miss (sid `8fdae59a` vs `600ce64a`). Cache 75-76% with corruption vs 91.6% with a proxy substituting the clean text. Cousins cite-only: #40396 (response-side Korean U+FFFD on macOS), #88836 (AskUserQuestion newlines → U+FFFD since 2.1.235).
- **Shipped:** a new static booth, **Mojibake**, in `projects/mojibake/`.
- **What it does:** scores compositor / foul-proof / geta-tofu print shop booth after an fffd-spall (idle verbatim / seeded mojibaked / path fffd-spall).
- **Catalog:** featured Mojibake only; Scissel, Feoffee, Apograph, Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Scissel

- **Thesis:** #93915 — Windows Bash tool transports the whole command through argv to MSYS2 `bash -c`. Commands over ~8,203 chars are silently truncated; bash reports a bogus syntax error at a mid-payload apostrophe (`unexpected EOF while looking for matching '\''`). Line number is constant → fixed-offset cut. 30/31 failing commands pass `bash -n` when re-fed intact. Doubled backslashes (`\\`) silently collapse to a single `\` at ANY size (295 B). Both disappear on `bash -s` (byte-identical up to 259 KB). Win 11 Pro 10.0.26200; Git Bash 5.3.15; MSYS 3.6.9; `claude.exe` → `bash.exe` (no cmd.exe). Symptom 1 documented: msys2-runtime `glob()` 8192-character stack buffer (msys2-runtime#178). Symptom 2 measured; argv-escaping cause is unconfirmed inference. Cousins cite-only: openai/codex#15003, msys2-runtime#178, zetaloop/msys2-argv-fix.
- **Shipped:** a new static booth, **Scissel**, in `projects/scissel/`.
- **What it does:** scores mint / coin-press / punch-and-scissel booth after an argv-trunc (idle plenary / seeded scisselled / path argv-trunc).
- **Catalog:** featured Scissel only; Feoffee, Apograph, Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Feoffee

- **Thesis:** #93863 — preview_start named launch.json server fails with getcwd EPERM despite confirmed Full Disk Access. A `.claude/launch.json` named dev-server (`preview_start({name: "..."})`) fails when its working directory is under `~/Documents/...`, even though desktop app `com.anthropic.claudefordesktop` holds Full Disk Access confirmed via TCC DB (`kTCCServiceSystemPolicyAllFiles|com.anthropic.claudefordesktop|2`). Failure: `getcwd: cannot access parent directories: Operation not permitted` at shell-init; then python can't open the script (Errno 1). Ruled out: directory permissions, iCloud/FileProvider, missing/stale target dir, missing FDA on the desktop app itself. Unified log: System Policy (TCC) deny against spawned bash/python3 child PIDs — not Seatbelt/App-Sandbox. Contrast: Bash-tool-spawned processes under `com.anthropic.claude-code` can read/write/execute the SAME directory at the same time. Hypothesis NON-BINDING: child processes on the preview_start named-config path do not inherit / are not granted the desktop app's FDA. Cousin cite-only: #93766 Canard (OneDrive cwd mislabel — different mechanism).
- **Shipped:** a new static booth, **Feoffee**, in `projects/feoffee/`.
- **What it does:** scores medieval feoffment / livery-of-seisin / chancery chamber booth after a preview-eperm (idle vested / seeded unseised / path preview-eperm).
- **Catalog:** featured Feoffee only; Apograph, Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Apograph

- **Thesis:** #93859 — Claude Code 2.1.269; Claude Desktop 1.52386.3; macOS 26.6.2. Reopening a conversation from the Desktop app sidebar creates a new session ID and a full copy of the transcript every time, instead of appending to the existing session. After a day, one custom-titled conversation exists as 7 separate `.jsonl` files; `/resume` shows 5+ rows with the same title and different sizes. Docs say plain resume reuses session ID; only `--fork-session` / `/branch` create a new one. Desktop does not follow that. Evidence: 7 files share same customTitle, first user message, first timestamp; each later file is a superset; sizes 1.5→4.6 MB; birth times seconds after previous last write; all `entrypoint: claude-desktop`. Same conversation resumed from CLI ~32 times with no further fork. No `--fork-session`; no `.superseded-*` / `.orphaned-*`. Cousin cite-only: #93797 Schism (live dual-writer, not this mechanism).
- **Shipped:** a new static booth, **Apograph**, in `projects/apograph/`.
- **What it does:** scores scriptorium / manuscript apograph booth after a reopen-fork (idle singular / seeded apographed / path reopen-fork).
- **Catalog:** featured Apograph only; Airlock, Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Airlock

- **Thesis:** #93862 — Claude Code 2.1.269 (native binary, latest); WSL2, NixOS 26.05; bubblewrap + socat. In the Linux/WSL2 Bash sandbox a command whose first action is a network call fails with connection refused on the proxy bridge. Later calls in the same command succeed. Cause: the two socat bridges (`TCP-LISTEN:3128` HTTP + `TCP-LISTEN:1080` SOCKS) start in the background and the user command runs at once, with no wait for the listeners. Measured: inner shell ready ~3 ms; port 3128 accepts ~15–30 ms later. Same symptom as closed-stale #62743 — cite only.
- **Shipped:** a new static booth, **Airlock**, in `projects/airlock/`.
- **What it does:** scores submarine / spacecraft pressure-lock booth after a socat-race (idle equalized / seeded blown / path socat-race).
- **Catalog:** featured Airlock only; Scotoma, Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Scotoma

- **Thesis:** #93744 — Claude Code 2.1.268; macOS 15 / Opus 5. A goal set with `/goal <instruction>` is stored in the transcript only inside `<command-args>`. The Stop-condition evaluator appears not to read that field, so it repeatedly fires, cannot confirm the goal, and eventually reports its own condition as unachievable — while the goal text was present the whole time. Unattended session interrupted ~9 times; last firings produced no new work. Slash scan: `/clear` at line 7, `/goal` at line 12. Not a user Stop hook (fail-open telemetry shim). Cousins cite-only: #83266, #85182, #79981.
- **Shipped:** a new static booth, **Scotoma**, in `projects/scotoma/`.
- **What it does:** scores ophthalmology / Humphrey-style visual-field / perimetry booth after a command-args-blind (idle legible / seeded scotomized / path command-args-blind).
- **Catalog:** featured Scotoma only; Aneroid, Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Aneroid

- **Thesis:** #93901 — VS Code extension 2.1.269 (win32-x64); CLI 2.1.158; Windows 11 Enterprise; Opus 5 1M context; `autoCompactWindow: 500000` in settings.json. The context ring and hover are computed against the model's context window, not the configured one. `autoCompactWindow` does not appear in `webview/index.js` (0 hits) but appears 18 times in `bin/claude.exe`. Webview is handed `contextWindow: usageData.contextWindow - usageData.maxOutputTokens - 13000` then suppresses the ring while `U >= 50` against that wrong window. Ring first appears ~500k; auto-compaction fires almost immediately. Hover says `50% of context remaining until auto-compact` when none remains. Lowering `autoCompactWindow` to compact sooner can remove the warning entirely. Cousins cite-only: #90756, #91385.
- **Shipped:** a new static booth, **Aneroid**, in `projects/aneroid/`.
- **What it does:** scores aneroid-barometer / meteorological instrument-panel booth after a wrong-window-ring (idle calibrated / seeded aneroided / path wrong-window-ring).
- **Catalog:** featured Aneroid only; Simulacrum, Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Simulacrum

- **Thesis:** #93751 — Claude in Chrome (1.0.92) via `mcp__claude-in-chrome__*` on Windows 11 / Edge: with no browser process running, `list_connected_browsers` still reports a connected local browser (`isLocal: true`, advancing `connectedAt`). `navigate` returns `"Navigated to <url>"` with a real tab id and does nothing. Opening a real browser leaves the registration byte-identical; `switch_browser` says "No other browsers available" while the dead registration is still served. Not the stale-name cache in #78096 — there is no browser behind it. `get_page_text` hangs ~45s on `document_idle`. Manual reconnect works once; silent failure returned ~90m later (extension dir rewritten — correlation only).
- **Shipped:** a new static booth, **Simulacrum**, in `projects/simulacrum/`.
- **What it does:** scores Baudrillard / hyperreality museum booth after a phantom-navigate (idle tethered / seeded hollow / path phantom-navigate).
- **Catalog:** featured Simulacrum only; Solenoid, Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Solenoid

- **Thesis:** #93754 — Desktop Settings toggle "Enable Remote Control for all sessions" flips visually but does nothing; even a direct `~/.claude/settings.json` edit with `remoteControlAtStartup` / `remoteControlEnabled` waits for the first `sendMessage` instead of arming at WarmLifecycle. Not #93764 (Scotia DECSTBM blank rows). Not #93288 (Pontoon restart wash). Not #93776 (Outrider early-connect).
- **Shipped:** a new static booth, **Solenoid**, in `projects/solenoid/`.
- **What it does:** scores industrial switchgear / solenoid-coil atelier booth after a warm-before-message (idle engaged / seeded inert / path warm-before-message).
- **Catalog:** featured Solenoid only; Scotia, Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Scotia

- **Thesis:** #93764 — DECSTBM renderer leaves 2–3 blank rows under the prompt on Linux (VTE / Black Box). Once the conversation fills the screen the TUI stops short; blank rows sit under the bottom block and stay empty. macOS 2.1.268 kitty/iTerm/Terminal.app stays flush. Not #93766 (Canard OneDrive-cwd spawn mislabel).
- **Shipped:** a new static booth, **Scotia**, in `projects/scotia/`.
- **What it does:** scores classical scotia / shadow-gap / column-molding booth after a decstbm-undershoot (idle flush / seeded scotiated / path decstbm-undershoot).
- **Catalog:** featured Scotia only; Canard, Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Canard

- **Thesis:** #93766 — VS Code extension fails to spawn `claude` when the workspace folder is under a OneDrive-synced path. Log shows real OS error `spawn ...\claude.exe ENOENT` even though the exe exists and runs standalone; then a misleading musl/glibc dynamic-linker mismatch (Linux-only) on Windows. Same binary works from `C:\Projects\test`. Only cwd differs. Not #93778 (Stet dictation buffer).
- **Shipped:** a new static booth, **Canard**, in `projects/canard/`.
- **What it does:** scores press-room / newspaper-canard / duck-press booth after an onedrive-cwd-mislabel (idle candid / seeded canarded / path onedrive-cwd-mislabel).
- **Catalog:** featured Canard only; Stet, Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Stet

- **Thesis:** #93778 — Dictation: speaking after a manual edit discards the edit and resumes from the old text. Desktop Windows dictation restores its prior buffer over hand edits and Shift+Enter blank lines on mic resume. Not #91202 (cannot append second dictation), not #93165 (mic button disappears), not #93636 (audio no transcript), not #93782 (WSL paste).
- **Shipped:** a new static booth, **Stet**, in `projects/stet/`.
- **What it does:** scores copy-desk / blue-pencil / galley-proof margin-mark booth after a mic-resume-wipe (idle stetted / seeded rewound / path mic-resume-wipe).
- **Catalog:** featured Stet only; Blindside, Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-13 — Blindside

- **Thesis:** #93786 — Work committed in subagent worktrees under `.claude/worktrees/` is invisible to the session's diff pane, and there is no way to select a compare ref. Pane reports "no changes" while several commits exist on a worktree branch; session stays on `main`. Not #65852 (undisclosed base) and not #52179 (uncommitted changes).
- **Shipped:** a new static booth, **Blindside**, in `projects/blindside/`.
- **What it does:** scores sideline-scout / blind-side-tackle / peripheral-vision booth after a compare-ref-unreachable (idle sighted / seeded blindsided / path compare-ref-unreachable).
- **Catalog:** featured Blindside only; Interdict, Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Interdict

- **Thesis:** #93798 — claude-in-chrome MCP server's generic "Prohibited actions" instructions govern unrelated Bash/SSH behavior for the rest of the session. Language is not scoped to browser actions; the model refuses a plain `rm` over SSH even after repeated explicit authorization; Chrome toggled off runs the command normally.
- **Shipped:** a new static booth, **Interdict**, in `projects/interdict/`.
- **What it does:** scores ecclesiastical interdict / papal-bull / diocese-seal booth after a chrome-prohibit-bleed (idle scoped / seeded interdicted / path chrome-prohibit-bleed).
- **Catalog:** featured Interdict only; Simplex, Deadkey, Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Deadkey

- **Thesis:** #93788 — 2.1.269: all ESC-sequence keys (arrows, Home, End) dead in the composer; single-byte keys unaffected; 2.1.268 is fine. Fail silently; `cat -v` shows CSI intact; binary symlink swap proves build not session state.
- **Shipped:** a new static booth, **Deadkey**, in `projects/deadkey/`.
- **What it does:** scores typographic dead-key / typewriter platen booth after an esc-csi-dead (idle keyed / seeded deadkeyed / path esc-csi-dead).
- **Catalog:** featured Deadkey only; Gleaner, Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Gleaner

- **Thesis:** #93794 — Background `&` jobs in a Bash tool call are orphaned, not reaped: 39 `yes` processes pegged ~7 cores for 8h42m. They are reparented to PID 1 and keep running after the tool call, the subagent, and the session.
- **Shipped:** a new static booth, **Gleaner**, in `projects/gleaner/`.
- **What it does:** scores agricultural gleaner's field / leftover-harvest booth after an unreaped-ampersand (idle gleaned / seeded orphaned / path unreaped-ampersand).
- **Catalog:** featured Gleaner only; Schism, Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Schism

- **Thesis:** #93797 — SendMessage to a LIVE Workflow agent resumes a second copy from its transcript ("Resuming agent") while the original keeps running inside the workflow. Two writers then work the same task and the same files.
- **Shipped:** a new static booth, **Schism**, in `projects/schism/`.
- **What it does:** scores ecclesiastical schism / twin-authority glass booth after a resume-while-live (idle live / seeded schismed / path resume-while-live).
- **Catalog:** featured Schism only; Rasure, Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Rasure

- **Thesis:** #93791 — `~/.claude` (native Windows install) is deleted and recreated wholesale; the folder's own CreationTime flips (full delete+recreate, not content edits); `.claude.json` regenerates blank; prompt history and transcripts zero out; settings.json reverts to a stub missing most hooks. Four incidents since late August; incident 4 also wiped `secrets/` (19 files). A `~/.claude/backups/` folder with `.claude.json.backup.<timestamp>` appeared after one incident.
- **Shipped:** a new static booth, **Rasure**, in `projects/rasure/`.
- **What it does:** scores parchment rasure / scriptorium scraping booth after a creation-time-flip (idle intact / seeded rasured / path creation-time-flip).
- **Catalog:** featured Rasure only; Ashpan, Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Ashpan

- **Thesis:** #93780 — `delete_session` (MCP or UI) removes a spawned/child task session from the app session index, but the underlying transcript `.jsonl` named by the mapped CLI UUID stays on disk fully intact and readable. Documented unrecoverable guarantee fails for this session type.
- **Shipped:** a new static booth, **Ashpan**, in `projects/ashpan/`.
- **What it does:** scores industrial grate / ashpan / foundry booth after an orphan-jsonl (idle swept / seeded ashpanned / path orphan-jsonl).
- **Catalog:** featured Ashpan only; Outrider, Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Outrider

- **Thesis:** #93776 — MCP servers configured with `headersHelper` issue the initial connect WITHOUT waiting for the helper. If the helper is still running the request goes with no Authorization → 401/403 → server marked "requires authentication" for the entire session. Helper is not cancelled; a valid token arrives 135ms later and is discarded. Documented 10s timeout never reached. Different subset of servers fails each launch.
- **Shipped:** a new static booth, **Outrider**, in `projects/outrider/`.
- **What it does:** scores cavalry outrider / dispatch-rider booth after an early-connect (idle credentialed / seeded outridden / path early-connect).
- **Catalog:** featured Outrider only; Necrology, Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Necrology

- **Thesis:** #93774 — While switching an image-generation pipeline to a newly released provider model (released 3 days prior), Claude Code (claude-fable-5) fetched the provider's public /models listing once — the first attempt returned non-JSON and was retried — did not find the model id, and then told the user the model "does not exist on this provider" inside a blocking multiple-choice question, offering three older models as the only options. The user had to disprove it with a screenshot of the provider's own model page; a follow-up authenticated request to the provider's per-model endpoint resolved the id immediately. Expected: treat "absent from one listing response" as "not found via this endpoint" and cross-check before asserting non-existence.
- **Shipped:** a new static booth, **Necrology**, in `projects/necrology/`.
- **What it does:** scores parish necrology / death-register / sexton-desk after an incomplete-listing (idle attested / seeded necrologized / path incomplete-listing).
- **Catalog:** featured Necrology only; Innominate, Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Innominate

- **Thesis:** #93769 — The main chat footer Send/Stop button is one `type:submit` control that flips Send↔Stop; children are icon-only. Windows UI Automation Name is empty `""` in BOTH states; no aria-label / aria-labelledby / title. Screen readers hear only "button"; voice control cannot invoke it. WCAG 2.2 SC 4.1.2. A live region announces conversation state but does not name the button. The same bundle labels 23 other controls including sibling "Send side question". Unlabeled across 2.1.209 → 2.1.269. Docs advertise screen-reader support; stop / interrupt undocumented.
- **Shipped:** a new static booth, **Innominate**, in `projects/innominate/`.
- **What it does:** scores innominate nameplate / blank-escutcheon booth after an icon-only (idle named / seeded blank / path icon-only).
- **Catalog:** featured Innominate only; Snuffer, Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Snuffer

- **Thesis:** #93746 — Setting `"enableArtifact": false` in `~/.claude/settings.json` also removes the `Scratchpad directory:` line from the system prompt / environment block. Artifact publishing and the agent's session temp (scratchpad) directory are unrelated features that became wrongly coupled: `isScratchpadEnabled() = P("tengu_scratch", false) || isArtifactToolEligible()`. The `|| isArtifactToolEligible()` arm entered in 2.1.186. With `tengu_scratch` off (its default), `enableArtifact: false` alone now disables the scratchpad. There is no local opt-in. Turning artifacts off is a one-way door.
- **Shipped:** a new static booth, **Snuffer**, in `projects/snuffer/`.
- **What it does:** scores candle-snuffer / taper booth after a ganged-or (idle lit / seeded snuffed / path ganged-or).
- **Catalog:** featured Snuffer only; Changeling, Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Changeling

- **Thesis:** #93757 — Attaching to a session by remote control from another machine, then resuming it on its host, replaces the model the user set with `/model` with the global default from `settings.json`, with no notification. Every `remote_session_change` re-injects a model identity attachment; the value re-asserted is the global default rather than the session's explicit choice. UI and session metadata continue to report the user's chosen model. Reporter: 293 calls on `claude-fable-5-1` over ~16 hours while the app reported `claude-opus-5`. `set_session_model` reported success without taking effect.
- **Shipped:** a new static booth, **Changeling**, in `projects/changeling/`.
- **What it does:** scores fairy-court / cradle-swap after a remote-reattach (idle pledged / seeded swapped / path remote-reattach).
- **Catalog:** featured Changeling only; Homograph, Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Homograph

- **Thesis:** #93743 — Claude Code derives `~/.claude/projects/<slug>/` by collapsing non-ASCII path characters (e.g. Korean) into a generic `-`. Distinct folders can encode to the identical slug (same dash count), so a new project silently inherits/overwrites memory+session data of an unrelated — even deleted — project. Repro on Windows: folder A `…/근평 웹만들기` writes memory, delete A, folder B `…/비계량지표평가` loads A's Supabase HR-app memory into an unrelated HWP/PDF tool session. Both → `C--Users-<user>-Downloads--------`.
- **Shipped:** a new static booth, **Homograph**, in `projects/homograph/`.
- **What it does:** scores lexicographer’s homograph / dictionary headword-collision after a lossy-slug (idle distinct / seeded collided / path lossy-slug).
- **Catalog:** featured Homograph only; Galley, Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Galley

- **Thesis:** #93745 — Dirty-tree Stop hook fires when the working tree has uncommitted/untracked files at the moment the MAIN agent’s turn ends. With background subagents, a dirty tree at turn-end is the normal correct state (subagent writes for minutes, commits last). The hook cannot tell in-progress-by-design from abandoned mid-edit, so it fires every main turn for the whole subagent run. Stop exit 2 injects a synthetic user turn and re-invokes the model against the entire conversation. Acting on the message would race the subagent. Measured one session: 4 firings, $3.25, ~5.5M billable tokens; ~85% cache reads. The hook never fires for the subagents themselves — tax hits the main session (largest context) which is NOT writing. Stop payload already knows about background work elsewhere (`idle_prompt` / #93672 has `background_tasks`); this path does not skip when agents are live.
- **Shipped:** a new static booth, **Galley**, in `projects/galley/`.
- **What it does:** scores printer’s galley / wet-proof / unbound-signature after a stop-dirty (idle dry / seeded billed / path stop-dirty).
- **Catalog:** featured Galley only; Rescript, Monadnock, Rider, Followspot, Calends, Weir, Irons, and Cathead unfeatured.

## 2026-09-12 — Monadnock

- **Thesis:** #93703 — Desktop-app worktree session rooted inside a git submodule branches from local `main` instead of `refs/remotes/origin/main` and does not fetch first. If local main is behind, the session silently starts on old code. Measured: month-old base, 204 commits behind origin/main. CLI does not have this problem. Same desktop app is correct at the superproject. Reflog spelling differs: desktop records a raw SHA; CLI records a ref name. `worktree.baseRef` unset; documented `fresh` default should apply. Expected: Created from refs/remotes/origin/main.
- **Shipped:** a new static booth, **Monadnock**, in `projects/monadnock/`.
- **What it does:** scores geological monadnock / residual mountain / trig survey after a submodule-base (idle fresh / seeded residual / path submodule-base).
- **Catalog:** featured Monadnock only; Rider, Followspot, Calends, Weir, Irons, Cathead, Anachronism, and Nullarbor unfeatured.

## 2026-09-12 — Rider

- **Thesis:** #93683 — A planning directive is appended to essentially every tool result as a `type=attachment` entry. It is not in any user configuration. Five user corrections do not stick because the rider is re-injected on the next tool call. 195 injections / 138 reproductions / 5 corrections. No documented opt-out. Outranks explicit user instruction. Wrong trust boundary (instruction in the tool-result channel).
- **Shipped:** a new static booth, **Rider**, in `projects/rider/`.
- **What it does:** scores parliamentary clerk desk / bill-rider after an attachment-rider (idle plain / seeded ridden / path attachment-rider).
- **Catalog:** featured Rider only; Followspot, Calends, Weir, Irons, Cathead, Anachronism, and Nullarbor unfeatured.

## 2026-09-12 — Calends

- **Thesis:** #93687 — Desktop Scheduled Tasks missed-run catch-up fires without re-validating day-of-week (and possibly date) of the cron. Five weekly tasks (Fri-only, Wed-only×2, Mon-only, Thu-only) all fired ~12:15–12:19 AM local on a Friday. Misfires report `status: succeeded`. No disable-catch-up setting.
- **Shipped:** a new static booth, **Calends**, in `projects/calends/`.
- **What it does:** scores stone calendar / fasti after a catchup-dow (idle due / seeded misfired / path catchup-dow).
- **Catalog:** featured Calends only; Weir, Irons, Cathead, Anachronism, Nullarbor, Petard, and Aposiopesis unfeatured.

## 2026-09-12 — Weir

- **Thesis:** #93589 — Cowork Desktop (macOS, Individual Pro) after a background ShipIt auto-update on 2026-09-11 (~02:36 local): Claude desktop 1.52386.0, Cowork VM 2.1.260 → 2.1.266. Custom remote MCP `request_upload_url` still succeeds via the MCP proxy; sandbox direct egress PUT `--data-binary` to the returned custom-domain URL is rejected with 403 at the egress proxy (`host_not_allowed` / blocked-by-allowlist). Destination host is never contacted. Additional allowed domains and Domain allowlist = All domains do not help. Identical settings worked on VM 2.1.260 the day before.
- **Shipped:** a new static booth, **Weir**, in `projects/weir/`.
- **What it does:** scores mill weir / millrace after an egress-allowlist (idle flowing / seeded dammed / path egress-allowlist).
- **Catalog:** featured Weir only; Irons, Cathead, Anachronism, Nullarbor, Petard, Aposiopesis, and Disseisin unfeatured.

## 2026-09-12 — Irons

- **Thesis:** #93615 — scheduled / cron / background Claude Code sessions hang indefinitely on WebSearch (no result, no error, no timeout; `lastActivityAt` freezes; session stays running). Identical query in an interactive session on the same machine/account returns in seconds. Cap of 2 still hangs on the first call.
- **Shipped:** a new static booth, **Irons**, in `projects/irons/`.
- **What it does:** scores sailing in-irons / head-to-wind after a cron-websearch (idle underway / seeded becalmed / path cron-websearch).
- **Catalog:** featured Irons only; Cathead, Anachronism, Nullarbor, Petard, Aposiopesis, Disseisin, and Analepsis unfeatured.

## 2026-09-12 — Cathead

- **Thesis:** #93624 — macOS teammate spawn `fork failed: Device not configured` (ENXIO). TmuxBackend `split-window … -- cat` then `respawn-pane -k` races xnu `ptmx_clone` / `ptmx_get_ioctl` at a 16-slot boundary; grow skipped; vector never shrinks.
- **Shipped:** a new static booth, **Cathead**, in `projects/cathead/`.
- **What it does:** scores bow cathead / anchor-timber after a ptmx-race (idle seated / seeded raced / path ptmx-race).
- **Catalog:** featured Cathead only; Anachronism, Nullarbor, Petard, Aposiopesis, Disseisin, Analepsis, and Monstrance unfeatured.

## 2026-09-12 — Anachronism

- **Thesis:** #93585 — Cloud session checks out stale local branch when a commit is pushed between container pre-warm and session start. Harness DID re-fetch and detach HEAD on the new tip, then `git checkout <branch>` resolved the pre-warm local; `origin/<branch>` rewritten to the old sha so status lies up to date. SessionStart hooks ran on the stale checkout.
- **Shipped:** a new static booth, **Anachronism**, in `projects/anachronism/`.
- **What it does:** scores film continuity / slate chronometer after a prewarm-latch (idle tip / seeded stale / path prewarm-latch).
- **Catalog:** featured Anachronism only; Nullarbor, Petard, Aposiopesis, Disseisin, Analepsis, Monstrance, and Compline unfeatured.

## 2026-09-11 — Nullarbor

- **Thesis:** #93595 — Plugin HTTP MCP `${VAR}` header expansion resolves to empty in 2.1.260 (works in 2.1.247 / 2.1.223) — bearer token never sent. Direct POST: expanded → 200; literal unexpanded `${VAR}` → 403; `Bearer ` empty → 401. 2.1.260 matches the empty case. Reproduces from a plain shell; desktop happens to bundle 2.1.260.
- **Shipped:** a new static booth, **Nullarbor**, in `projects/nullarbor/`.
- **What it does:** scores Nullarbor Plain / empty-bearer after an empty-expand (idle stamped / seeded emptied / path empty-expand).
- **Catalog:** featured Nullarbor only; Petard, Aposiopesis, Disseisin, Analepsis, Monstrance, Compline, and Cipherlock unfeatured.

## 2026-09-11 — Petard

- **Thesis:** #93607 — Bash tool (Linux): pkill -f / pgrep -f match the tool's own bash -c … eval wrapper (exit 144, phantom PIDs); 2.1.214 guard covers only the CLI process. procps-ng / BusyBox exclude only pkill itself, not the parent wrapper. macOS ancestors OK. Bracket idiom only helps cross-call.
- **Shipped:** a new static booth, **Petard**, in `projects/petard/`.
- **What it does:** scores siege petard / powder-charge after a wrapper-argv hoist (idle standing / seeded hoisted / path wrapper-argv).
- **Catalog:** featured Petard only; Aposiopesis, Disseisin, Analepsis, Monstrance, Compline, Cipherlock, and Attainder unfeatured.

## 2026-09-11 — Aposiopesis

- **Thesis:** #93588 — 2.1.268: statusLine command is never invoked when cwd is a git repo (works in a non-git cwd) — regression from 2.1.267. Git clone and git worktree never spawn; rail stays empty with no error and no debug line. cwd=$HOME still renders. Concurrent 2.1.267 still invokes. Workspace trust is not the discriminator. Git-cwd vs project-level settings/hooks remains confounded.
- **Shipped:** a new static booth, **Aposiopesis**, in `projects/aposiopesis/`.
- **What it does:** scores manuscript speech-break after a git-cwd mute (idle raised / seeded furled / path git-cwd-mute).
- **Catalog:** featured Aposiopesis only; Disseisin, Analepsis, Monstrance, Compline, Cipherlock, Attainder, and Sourdine unfeatured.

## 2026-09-11 — Disseisin

- **Thesis:** #93574 — Cowork loses a session's home directory on VM restart, and the connected folder goes with it. Recovery looks for `/sessions/<rcw-…>`, fails when the home is gone, and the UI still presents the folder as connected while every tool call fails. Pair ~30× across 14 days aligned with VM starts. Host disk-low ruled out.
- **Shipped:** a new static booth, **Disseisin**, in `projects/disseisin/`.
- **What it does:** scores court-of-novel-disseisin / freehold manor-roll after a VM-home evaporation (idle seised / seeded disseised / path home-evaporated).
- **Catalog:** featured Disseisin only; Analepsis, Monstrance, Compline, Cipherlock, Attainder, Sourdine, and Forksink unfeatured.

## 2026-09-11 — Analepsis

- **Thesis:** #93569 — Desktop: older turns get re-delivered behind a `background_tasks_redelivered` marker and rendered last, so the feed ends on a turn from hours earlier. Transcript on disk is complete and ordered; the React tree moves the 18:32–19:24 stretch after 22:30. Working marker sticks because the list ends on a task notification rather than a result.
- **Shipped:** a new static booth, **Analepsis**, in `projects/analepsis/`.
- **What it does:** scores manuscript flashback / collation after a marker splice (idle ordered / seeded redelivered / path marker-misorder).
- **Catalog:** featured Analepsis only; Monstrance, Compline, Cipherlock, Attainder, Sourdine, Forksink, and Foxfire unfeatured.

## 2026-09-11 — Monstrance

- **Thesis:** #93563 — Artifact tool cannot read live artifacts in Cowork: read path binds to native WebFetch, which Cowork substitutes with mcp__workspace__web_fetch. Refusal falsely blames a WebFetch deny rule that does not exist; publish needs force: true. Creating session can publish without read; a later session cannot.
- **Shipped:** a new static booth, **Monstrance**, in `projects/monstrance/`.
- **What it does:** scores sanctuary monstrance / exposition after a phantom deny (idle viewed / seeded withheld / path phantom-deny).
- **Catalog:** featured Monstrance only; Compline, Cipherlock, Attainder, Sourdine, Forksink, and Foxfire unfeatured.

## 2026-09-11 — Compline

- **Thesis:** #93549 — remote-control: routine sessions are never sent end_session on completion, and when it is sent the harness exits non-zero. Print-resume child stays resident holding a concurrent-session slot; archive path exits non-zero and flips UI to cancelled while API stays SUCCEEDED.
- **Shipped:** a new static booth, **Compline**, in `projects/compline/`.
- **What it does:** scores cloister / evening-office / compline after a silent completion (idle closed / seeded lingering / path unrung).
- **Catalog:** featured Compline only; Cipherlock, Attainder, Sourdine, Forksink, and Foxfire unfeatured.

## 2026-09-11 — Cipherlock

- **Thesis:** #93537 — macOS: concurrent claude processes zero MCP OAuth entries in shared Keychain blob despite valid refresh tokens. Notion/atlassian blanked; Slack may stay intact. Distinct from #91009.
- **Shipped:** a new static booth, **Cipherlock**, in `projects/cipherlock/`.
- **What it does:** scores vault / bank-safe / cipher-lock combination after concurrent Keychain wipe (idle sealed / seeded blanked / path concurrent-write).
- **Catalog:** featured Cipherlock only; Attainder, Sourdine, Forksink, Foxfire, and Pentimento unfeatured.

## 2026-09-11 — Attainder

- **Thesis:** #93529 — Parked-permission retirement always stamps toolDenialKind: user-rejected, even when the actual cause is an internal session reset (e.g. after /mcp reconnect), not a real user action. Tool already allow-listed; no prompt; no Esc/Ctrl+C.
- **Shipped:** a new static booth, **Attainder**, in `projects/attainder/`.
- **What it does:** scores parchment court-of-attainder wax seals after parked-permission retirement (idle untainted / seeded attainted / path retire-parked).
- **Catalog:** featured Attainder only; Sourdine, Forksink, Foxfire, Pentimento, and Vinculum unfeatured.

## 2026-09-11 — Sourdine

- **Thesis:** #93531 — MessageDisplay no longer fires for text between tool calls (regression). Mid-turn prose is replaced by summarized `block_kind: narration` blocks shown as `(summarized)`; only first+final still reach the hook.
- **Shipped:** a new static booth, **Sourdine**, in `projects/sourdine/`.
- **What it does:** scores concert-hall practice-mute attack/phrase/cadence after narration mute (idle voiced / seeded muted / path mid-narration).
- **Catalog:** featured Sourdine only; Forksink, Foxfire, Pentimento, Vinculum, and Cachet unfeatured.

## 2026-09-11 — Forksink

- **Thesis:** #93458 — SessionStart hook additionalContext silently dropped when source=fork (rewind); startup/compact inject normally. Hook ran, exit 0, valid JSON, but the model never received the text.
- **Shipped:** a new static booth, **Forksink**, in `projects/forksink/`.
- **What it does:** scores municipal storm-drain grate runoff after rewind fork drop (idle lodged / seeded dropped / path source-fork).
- **Catalog:** featured Forksink only; Foxfire, Pentimento, Vinculum, Cachet, and Strobe unfeatured.

## 2026-09-11 — Foxfire

- **Thesis:** #93502 — Remote Control message paints in idle CLI composer but never starts a turn. Dim composer text only; no transcript user row; no queue-operation; session stays idle until local Escape/retype.
- **Shipped:** a new static booth, **Foxfire**, in `projects/foxfire/`.
- **What it does:** scores marsh-lantern glow after idle Remote Control paint-without-turn (idle kindled / seeded painted / path never-turns).
- **Catalog:** featured Foxfire only; Pentimento, Vinculum, Cachet, Strobe, and Counterfoil unfeatured.

## 2026-09-11 — Pentimento

- **Thesis:** #93482 — Cowork `device_commit_files` reports overwrite success (`{"written":[path],"rejected":[]}`) with a fresh mtime, but on-disk content lags exactly one commit. Create is clean. Second identical commit lands.
- **Shipped:** a new static booth, **Pentimento**, in `projects/pentimento/`.
- **What it does:** scores conservation-atelier underpainting after overwrite lag (idle flushed / seeded lagged / path one-behind).
- **Catalog:** featured Pentimento only; Vinculum, Cachet, Strobe, Counterfoil, and Lucida unfeatured.

## 2026-09-11 — Vinculum

- **Thesis:** #93485 — Cowork local agent mode hardlinks workspace files into its session upload cache (`%APPDATA%\Claude\local-agent-mode-sessions\...\uploads\`), and the cloud file bridge then refuses to read them (`nlink > 1`).
- **Shipped:** a new static booth, **Vinculum**, in `projects/vinculum/`.
- **What it does:** scores chain-forge nlink bonds after local-mode hardlink (idle solitary / seeded twinlinked / path bridge-refuse).
- **Catalog:** featured Vinculum only; Cachet, Strobe, Counterfoil, Lucida, and Fomite unfeatured.

## 2026-09-11 — Cachet

- **Thesis:** #93490 — Fable 5.1 `--resume` replays the session-start context message (SessionStart hook output + # Environment) as a plain string instead of the ARRAY + cache_control seal it was sent with, so the prompt-cache prefix stops matching and the folio is rewritten. Opus `--resume` still hits.
- **Shipped:** a new static booth, **Cachet**, in `projects/cachet/`.
- **What it does:** scores wax-cachet folio carriers after Fable resume (idle hit / seeded flattened / path string-carrier).
- **Catalog:** featured Cachet only; Strobe, Counterfoil, Lucida, and Fomite unfeatured.

## 2026-09-11 — Strobe

- **Thesis:** #93468 — ScheduleWakeup used off-label outside `/loop` (the only wakeup primitive; skills instruct a bounded idle wait) paints a spurious "Claude resuming /loop wakeup (...)" banner, truncates skills to "1 skill available", and may redeliver the prior prompt.
- **Shipped:** a new static booth, **Strobe**, in `projects/strobe/`.
- **What it does:** scores hangar strobe-beacon false-positives after off-label ScheduleWakeup (idle steady / seeded strobing / path off-label).
- **Catalog:** featured Strobe only; Counterfoil, Lucida, Fomite, and Snubber unfeatured.

## 2026-09-11 — Counterfoil

- **Thesis:** #93446 — `claude mcp add-json --client-secret` stores the OAuth client secret under a headers-stripped `keyFor`, while `claude mcp login` looks it up under a headers-included key; lookup misses and token exchange goes out with no `client_secret`.
- **Shipped:** a new static booth, **Counterfoil**, in `projects/counterfoil/`.
- **What it does:** scores cheque-counterfoil serials after add-json client-secret store (idle matched / seeded skewed / path headers-hash).
- **Catalog:** featured Counterfoil only; Lucida, Fomite, Snubber, and Fosse unfeatured.

## 2026-09-11 — Lucida

- **Thesis:** #93429 — Desktop Code tab paste drops the image source path: pasted images never hit image-cache and no `[Image: source: path]` companion is injected (0/4 claude-desktop vs 4/4 cli).
- **Shipped:** a new static booth, **Lucida**, in `projects/lucida/`.
- **What it does:** scores camera-lucida plate traceability (idle traced / seeded pathless / path image-cache).
- **Catalog:** featured Lucida only; Fomite, Snubber, Fosse, and Hibernacle unfeatured.

## 2026-09-11 — Snubber

- **Thesis:** #93398 — Killed sandboxed command leaks its SOCKS socket; main thread then spins on EPIPE at 100%+ CPU.
- **Shipped:** a new static booth, **Snubber**, in `projects/snubber/`.
- **What it does:** scores mux-peer teardown after SIGKILL mid-stream (idle damped / seeded spinning / path mux).
- **Catalog:** featured Snubber only; Fosse, Hibernacle, Scapegoat, Cartulary, Paraph, Appanage, Pontoon, Concordat, and Revenant unfeatured.

## 2026-09-11 — Fosse

- **Thesis:** #93358 — Cowork (Windows 10 22H2): all Plan9 shares fail with `Plan9 mount failed: invalid argument` after September 2026 cumulative — 4/4 → 0/4, host reports hr=0x0.
- **Shipped:** a new static booth, **Fosse**, in `projects/fosse/`.
- **What it does:** scores host-honest Plan9 attach vs guest 0/4 EINVAL (idle mounted / seeded fossed / path plan9).
- **Catalog:** featured Fosse only; Hibernacle, Scapegoat, Cartulary, Paraph, Appanage, Pontoon, Concordat, and Revenant unfeatured.

## 2026-09-11 — Hibernacle

- **Thesis:** #93372 — Windows idle working-set trim storms majflt on first Enter after idle and a second Enter double-submits.
- **Shipped:** a new static booth, **Hibernacle**, in `projects/hibernacle/`.
- **What it does:** scores idle working-set warmth (idle warm / seeded paged-out / path majflt).
- **Catalog:** listed unfeatured after Fosse ship.

## 2026-09-10 — Scapegoat

- **Thesis:** #93348 — claude-in-chrome: an UNGRANTED host makes executeScript-based tools hang their full timeout and blame the page, instead of denying.
- **Shipped:** a new static booth, **Scapegoat**, in `projects/scapegoat/`.
- **What it does:** scores host-grant honesty (idle honest / seeded scapegoated / path ungranted).
- **Catalog:** featured Scapegoat only; Cartulary, Paraph, Appanage, Pontoon, Concordat, and Revenant unfeatured.

## 2026-09-10 — Cartulary

- **Thesis:** #93331 — `~/.claude/.credentials.json` → `mcpOAuth` grows without bound because every session re-stores identical claude.ai connector tokens under a new session-scoped `serverUrl` (1,681 records / 906 KB, same token ×113).
- **Shipped:** a new static booth, **Cartulary**, in `projects/cartulary/`.
- **What it does:** scores credential-store accretion (idle bound / seeded accreted / path session-url).
- **Catalog:** featured Cartulary only; Paraph, Appanage, Pontoon, Concordat, and Revenant unfeatured.

## 2026-09-10 — Paraph

- **Thesis:** #93327 — Desktop BYO OAuth MCP connect fails the version-negotiation probe with a malformed RFC 8414 §3.3 Issuer mismatch whose quotes open real and close `%22`; CLI against the same server succeeds; no browser OAuth window.
- **Shipped:** a new static booth, **Paraph**, in `projects/paraph/`.
- **What it does:** scores issuer-seal quotes (idle sealed / seeded mismatched / path issuer).
- **Catalog:** featured Paraph only; Appanage, Pontoon, Concordat, and Revenant unfeatured.

## 2026-09-10 — Appanage

- **Thesis:** #93307 — bundled `code-review` skill fork dispatches finder/verifier Agent children with no `model`; they inherit the parent `claude-fable-5-1` tier; model-initiated invoke has no cost gate; SessionStart policy cannot reach children inside the fork.
- **Shipped:** a new static booth, **Appanage**, in `projects/appanage/`.
- **What it does:** scores child-model routing (idle routed / seeded inherited / path cascade).
- **Catalog:** featured Appanage only; Pontoon, Concordat, and Revenant unfeatured.

## 2026-09-10 — Pontoon

- **Thesis:** #93288 — Desktop restart / onQuitCleanup washes every Remote Control session bridge; sidebar still looks intact; phone list empty.
- **Shipped:** a new static booth, **Pontoon**, in `projects/pontoon/`.
- **What it does:** scores RC bridge liveness (idle afloat / seeded washed / path bridge-loss).
- **Catalog:** featured Pontoon only; Concordat and Revenant unfeatured.

## 2026-09-10 — Concordat

- **Thesis:** #93290 — Desktop/CLI send `Mcp-Protocol-Version: 2025-11-25` with `_meta` `2026-07-28`; stateless servers reject `-32020`.
- **Shipped:** a new static booth, **Concordat**, in `projects/concordat/`.
- **What it does:** scores header↔body version concord (idle concordant / seeded mismatched / path header-mismatch).
- **Catalog:** featured Concordat only; Revenant and drift/reorder-radar leftovers unfeatured.

## 2026-09-10 — Drift Radar

- **Thesis:** autonomous work needs recovery tooling, not just more autonomy.
- **Shipped:** a new static product, **Drift Radar**, in `products/drift-radar/`.
- **What it does:** scores step drift, classifies blockers, ranks a recovery queue, and keeps edits in `localStorage`.
- **Inspiration:** current GitHub trend signals around agent harnesses, terminal tools, local-first AI, and practical observability.
- **What broke:** no major blocker; the only risk was making the drift score too abstract, so the prototype keeps the scoring and actions explicit.
- **Catalog entry:** root catalogue now links both `Reorder Radar` and `Drift Radar`.
- **Tomorrow's focus:** test whether the recovery console should auto-generate a one-screen restart packet from the last good step.
