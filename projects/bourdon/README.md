# Bourdon

A **Bourdon-tube pressure gauge bay** — brass/bronze bezel, coiled copper tube uncoiling under host fd pressure, dark instrument panel, needle climbing toward the red `kern.maxfiles` zone, virtiofs manifold — Archivo Black + Sora + IBM Plex Mono — for a real Claude Code defect: **COWORK/CODE VM LEAKS HOST FILE DESCRIPTORS (~400K) UNTIL MACOS EXHAUSTS `KERN.MAXFILES` AND PANICS/REBOOTS.** A Bourdon tube should hold when the system is idle. The Cowork/Code Apple Virtualization VM instead lets host fd pressure climb while idle (**saturating**). When Cmd+Q Desktop releases the descriptors (**vented**), that is the hold path.

Primary:

- [anthropics/claude-code#92510](https://github.com/anthropics/claude-code/issues/92510) (OPEN, bug, has repro, platform:macos, area:cowork). Title: `[BUG] Cowork/Code VM leaks host file descriptors (~400k) until macOS exhausts kern.maxfiles and panics/reboots`. Filed 2026-09-06T15:24:53Z. Reporter: gweston-2022. Claude Desktop (Cowork/Code VM), current release as of 2026-09-06 — not the CLI.

02:50 bourdon: a bourdon-tube pressure bay that should hold steady when Cowork is idle but instead lets the host Apple Virtualization VM saturate toward kern.maxfiles (~409k fds, guest still clean) until macOS panics — Cmd+Q vents it. Score saturating or admit vented.

Idle word: **saturating** (fd pressure climbs while idle toward kern.maxfiles). Seeded state: **vented** / #92510 — Cmd+Q Desktop releases descriptors. Never idle as preheating, hangfired, thrashing, leaking, remanent, rewritten, cleared, maxed, mute, inherited, freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, cold, voided, alongside, shed, latched, quiet, bound, open, sostenutoed, or frozen.

**Bourdon** is a pressure-element bay. A curved tube should stay coiled at idle. Here the host VM uncoils toward rupture.

- **saturating** = IDLE: host-side Apple Virtualization VM fds climb continuously, including while completely idle
- **vented** = seeded word: Cmd+Q Claude Desktop releases the descriptors immediately
- **host-fd-409600** = snapshot ~409,600 host fds (~71% of kern.maxfiles, ~130x next-largest)
- **guest-clean-512** = guest `/proc/sys/fs/file-nr` ~512; ~5 processes; leak is host-side
- **idle-12h-after-prompt** = count still climbing 12 hours after the last prompt
- **virtiofs-suspect** = issue's own most-likely: virtiofs / shared-folder host handles (NON-BINDING)
- **cmdq-releases** = Cmd+Q / kill VM PID / smaller subfolder — descriptors released
- **cli-no-vm-clean** = Terminal CLI without VM does not exhibit this
- **cousins** = cite-only #79920 #92069 #29573 #26087 #47829 #26646 #65239 #47644

Verdicts: saturating, vented, host-fd-409600, guest-clean-512, idle-12h-after-prompt, virtiofs-suspect, cmdq-releases, cli-no-vm-clean, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a Cowork/Code VM would saturate host fds toward `kern.maxfiles` or already vent. Fixtures use the issue's pressure snapshot, guest file-nr, idle-12h note, and workarounds only.

Hypothesis only (NON-BINDING): most likely the virtiofs / shared-folder layer not releasing host handles for files the guest has touched. Verify nothing — encode the issue body only. Encoded from the issue body only. Do not invent source-code claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92510](https://github.com/anthropics/claude-code/issues/92510)
- Cousins cite-only (NOT primary): [anthropics/claude-code#79920](https://github.com/anthropics/claude-code/issues/79920), [anthropics/claude-code#92069](https://github.com/anthropics/claude-code/issues/92069), [anthropics/claude-code#29573](https://github.com/anthropics/claude-code/issues/29573), [anthropics/claude-code#26087](https://github.com/anthropics/claude-code/issues/26087), [anthropics/claude-code#47829](https://github.com/anthropics/claude-code/issues/47829), [anthropics/claude-code#26646](https://github.com/anthropics/claude-code/issues/26646), [anthropics/claude-code#65239](https://github.com/anthropics/claude-code/issues/65239), [anthropics/claude-code#47644](https://github.com/anthropics/claude-code/issues/47644)

What happened (from the issue — do not invent):

- Environment: macOS 26.4 (Darwin 25.4.0), Apple Silicon, Claude Desktop with Cowork. Connected folder: `/development` (~300k files).
- Symptom: the Apple Virtualization VM that Cowork/Code launches accumulates host-side open file descriptors continuously, including while completely idle.
- A preserved pressure snapshot showed the VM process holding ~409,600 fds — about 71% of the system total (`kern.maxfiles`) and roughly 130x the next-largest process.
- The count keeps growing with no prompt running; one occurrence hit 12 hours after the last prompt.
- When the system-wide limit is exhausted, macOS panics and reboots. Quitting Claude Desktop releases the descriptors. This happens 1–5x per day if not caught manually.
- Guest side is clean: inside the VM, `/proc/sys/fs/file-nr` reports ~512 open files and ~5 processes shortly after boot (uptime 2 min; top process holds 4 fds), so the leak is in the host-side VM process.
- Process coalition: associated with Claude, not Docker. Codex/Node processes were also present (~106k fds in an earlier snapshot) but were a secondary contributor, not the dominant holder.
- Workarounds found: Cmd+Q Claude Desktop; `kill` the VM PID (Claude relaunches it on next use); connect a smaller subfolder.
- Expected: the VM should release host file descriptors when the guest closes files and when a session ends, keeping the fd count bounded. An idle VM should not grow its fd usage, and the app should never be able to push the host past `kern.maxfiles`.
- Watch: `sudo lsof -n | awk '{print $2}' | sort | uniq -c | sort -rn | head -5` — the VM process climbs steadily over hours.
- Additional: Claude session start times match the VM's launch time, and Claude died during the final collapse. Multiple Cowork sessions may have the same folder connected concurrently. Claude Code run from Terminal (no VM) does not exhibit this.
- Existing VM reports (#26087, #47829, #26646, #65239, #47644) cover guest kernel panics and disk-write limits, not host fd exhaustion.

Problem found: Cowork/Code Apple Virtualization VM → host fds climb while idle (~409,600 / ~71% of kern.maxfiles) → guest still ~512 → exhaustion → macOS kernel panic + reboot. Cmd+Q vents it.

Why this solution: a diagnostic scorer for the saturating tube → vented bezel chain, so a reader can admit idle saturating, pin seeded vented, and score host-fd-409600 / guest-clean-512 / idle-12h-after-prompt / virtiofs-suspect / cmdq-releases / cli-no-vm-clean / cousins against the published facts.

## Why not a clone

This is specifically: **host-side Apple Virtualization VM file-descriptor accumulation under Cowork/Code shared folders → kern.maxfiles exhaustion → kernel panic.**

NOT Glowplug/#85050 — Windows silent startup preheat gaps ending at `[skills] idle` / ScheduledTasks. Bourdon is macOS Cowork VM host fd climb, not a diesel preheat soak.
NOT Hangfire/#92478 — queued `/compact` demoted to a plain prompt (`promptSource:queued`).
NOT Thrash/#88257 — first-prompt event-loop stall / RSS balloon.
NOT Muzzle/#92459 — safe-mode skill_listing attachment leak.
NOT Hysteresis/#92444 — `/effort` cache remanence.
NOT Hardstand/#92452 — Dispatch exclusive-cwd.
NOT Rheostat/#92436 — `--level low` hardwired high.
NOT Clobber/#92419 — inode rename watcher deafness.
NOT Waif — orphan process trees.
NOT Hawser — MCP child reap.
NOT Aphonia/Fulcrum/Wildcat/Watchdog/Understudy or any prior catalog slug.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle preheating / hangfired / thrashing / leaking / remanent / rewritten / cleared / maxed / mute / inherited / freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / cold / voided / alongside / shed / latched / quiet / bound / open / sostenutoed / frozen.
Do NOT reuse seeded lit / executed / responsive / excised / rewritten / refused / hardwired.

Different surface: host-side Cowork/Code VM fd accumulation vs Windows silent startup / queued slash demotion / paging-storm stall / attachment-strip leak / cache remanence / exclusive-cwd / effort-dial.

Product name stays **Bourdon**. Name/slug `bourdon` confirmed unused in catalog.json (185 products).

Different UI: Bourdon-tube pressure gauge bay / brass-bronze bezel / coiled copper tube / dark instrument panel / red maxfiles zone / virtiofs manifold. Archivo Black / Sora / IBM Plex Mono. NOT diesel glow-plug bay (Glowplug — Teko + Outfit + Share Tech Mono). NOT cordite/brass chronograph (Hangfire — Anybody + Source Sans 3 + JetBrains Mono). NOT phosphor CRT (Thrash — IBM Plex + Orbitron). NOT olive suppressor (Muzzle). Stay OFF diesel preheat / cartridge primer / CRT paging-storm / olive range / magnetic loop / night apron / bakelite rheostat.

Different verbs: admit saturating, pin seeded vented, score saturating vs vented, load #92510 fixture, score probes.

Different idle: **saturating**. Different seeded: **vented**. HOLD: **vented**. ALARM: **saturating** / **host-fd-409600** / **guest-clean-512** / **idle-12h-after-prompt** / **virtiofs-suspect** / **cousins**. Control: **cli-no-vm-clean**. Workaround: **cmdq-releases**.

Cousins cite-only (NOT primary):

- [#79920](https://github.com/anthropics/claude-code/issues/79920) — background-session daemon fd storm → ENFILE → launchd SIGBUS → kernel panic (different trigger: roster stampede, not Cowork VM host handles).
- [#92069](https://github.com/anthropics/claude-code/issues/92069) — Desktop over SSH / launchd 256 fd limit (soft 256 on remote `--serve`, not host VM ~409k).
- [#29573](https://github.com/anthropics/claude-code/issues/29573) — long-session file-limit filesystem bug.
- [#26087](https://github.com/anthropics/claude-code/issues/26087) [#47829](https://github.com/anthropics/claude-code/issues/47829) [#26646](https://github.com/anthropics/claude-code/issues/26646) [#65239](https://github.com/anthropics/claude-code/issues/65239) [#47644](https://github.com/anthropics/claude-code/issues/47644) — guest kernel panics and disk-write limits, not host fd exhaustion.

## Live catalog path

`/bourdon/` is this static Bourdon-tube scoring assay. Path `https://hermes-playground-green.vercel.app/bourdon/` and subdomain `https://bourdon.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `02:50 Sydney · bourdon · catalog #186 · #92510`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **saturating** → host fd pressure climbs while idle toward kern.maxfiles.
2. Seeded **vented** → Cmd+Q Desktop releases descriptors immediately.
3. Diagnostic **host-fd-409600** → ~409,600 host fds; ~71% of kern.maxfiles; ~130x next.
4. Diagnostic **guest-clean-512** → guest file-nr ~512; leak is host-side.
5. Diagnostic **idle-12h-after-prompt** → still climbing 12h after last prompt.
6. Diagnostic **virtiofs-suspect** → shared-folder host handles; NON-BINDING.
7. Workaround **cmdq-releases** → Cmd+Q / kill VM PID / smaller subfolder.
8. Control **cli-no-vm-clean** → Terminal CLI without VM does not exhibit this.
9. Diagnostic **cousins** → #79920 #92069 #29573 #26087 #47829 #26646 #65239 #47644 cite-only.
10. Assay UI: brass bezel, coiled Bourdon tube, red maxfiles zone, virtiofs manifold, host/guest faceplates, 12h idle climb strip.
11. Stay-off strip: diesel glow-plug / delayed-primer chronograph / CRT paging-storm / olive suppressor / magnetic remanence / night apron / bakelite dial. Primary stays #92510.
12. **Score probes** walks the probe ticket and lights chips on the bay. Chip-switch every verdict. Paste or drop JSON. Bay simulator chips rewrite the gauge (saturating / vented / host-fd / guest-clean).

## How to score

Open `projects/bourdon/index.html` in a browser, or serve the repo root and visit `/bourdon/` (Vercel rewrite → `/projects/bourdon`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/bourdon/hook/bourdon.test.mjs
```

Empty paste scores the idle **saturating** ticket if you admit saturating. Paste a probe on the page or drop a fixture from `data/`. The living page admits **saturating** / host-fd climb / guest still clean / #92510.

## Hook

`projects/bourdon/hook/` scores a probe `{ seed, saturating, vented, hostFd, guestFd, idleHoursAfterPrompt, virtiofsSuspect, cmdq, cliNoVm }` and returns `{ verdict, reasons[], saturating, vented, chips[] }`. See `hook/README.md`.

```bash
node projects/bourdon/hook/index.mjs projects/bourdon/data/92510.json
echo '{"seed":"vented","vented":true,"cmdq":true,"hostFd":0}' | node projects/bourdon/hook/index.mjs
```

`vented` is true ONLY when the verdict is vented, cmdq-releases, or cli-no-vm-clean (the tube already vented / CLI never entered the VM). Seeded 92510 numbers must produce saturating / `vented=false` on the host-fd climb. A saturating tube is never the hold path.
