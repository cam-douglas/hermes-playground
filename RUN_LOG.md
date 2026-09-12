# Run log

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
