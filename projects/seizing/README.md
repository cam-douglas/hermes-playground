# Seizing

A **sailmaker's / bosun's seizing bench** — tarred hemp, spun yarn, wooden fid, copper nails, oak block, dark loft, salt air; Libre Caslon Text + Sora + Inconsolata — for a real Claude Code defect: **AN EDR'S TRANSIENT SECOND HARD LINK (`nlink` 1→2→1, SAME INODE) FALSE-TRIGGERS THE BASH OUTPUT-FILE IDENTITY CHECK, THEN SIGTERM→SIGKILL (~5s) WITH EXIT 137 AND "OUTPUT FILE WAS REPLACED OR COULD NO LONGER BE VERIFIED".** Short commands like `pwd` run and the output file has the correct content, but read-back is reported failed. When nlink=1 identity holds and the command survives (**sole**), that is the hold path.

Primary:

- [anthropics/claude-code#92586](https://github.com/anthropics/claude-code/issues/92586) (OPEN, bug, has repro, platform:macos, area:bash, area:sandbox). Title: `Bash tool kills every command after ~5s ("output file was replaced or could no longer be verified") when an EDR transiently hard-links new files`. Updated 2026-09-07T03:33:08Z. Reporter: jskoo-dp. Claude Code 2.1.263 (also 2.1.260). macOS 26.3 Darwin 25.3.0 Apple Silicon. Genian Insights EDR (system extension).

13:50 seizing: a bosun's seizing bench that should keep the Bash output eye sole through an EDR's transient second hard link but instead culls every command at ~5s when nlink spikes (#92586). Score culled or admit sole.

Idle word: **culled** (command killed on false replacement / nlink spike). Seeded state: **sole** / #92586 — nlink=1 identity holds; command survives. Never idle as stripped, packed, unanswered, roused, slipped, sighted, riven, argbound, accruing, cleared, sheared, fayed, overladen, trimmed, defocused, sharp, skimmed, intact, mislabeled, scoped, saturating, or vented.

**Seizing** = the temporary spun-yarn binding that doubles a rope eye. Claude Code treats an EDR's extra hard link on the same inode as a replaced output file, so every Bash call is culled at ~5s.

- **culled** = IDLE: nlink spike treated as replacement; command killed, exit 137
- **sole** = seeded word: nlink=1 identity holds; command survives
- **nlink-spike** = `stat -f %l` 1→2→1 on boot-volume new files; inode never changes
- **sigkill-5s** = trap recorded SIGTERM at exactly +5s from parent `claude`; then SIGKILL
- **ramdisk-ok** = `CLAUDE_CODE_TMPDIR` on APFS ramdisk or sparseimage — nlink stays 1
- **cousins** = cite-only #92590 (sandbox.enabled leaves $TMPDIR read-only when CLAUDE_CODE_TMPDIR is set)

Verdicts: culled, sole, nlink-spike, sigkill-5s, ramdisk-ok, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether an EDR transient hard link would leave the seizing **culled** or already **sole**. Fixtures use the issue's error, nlink poll, headless repro, and environment only.

Hypothesis only (NON-BINDING): the identity check may be using nlink or a fingerprint that breaks when an EDR adds a transient hard link. Verify nothing in closed source — encode issue facts only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92586](https://github.com/anthropics/claude-code/issues/92586)
- Cousins cite-only (NOT primary): [anthropics/claude-code#92590](https://github.com/anthropics/claude-code/issues/92590) — sandbox.enabled leaves $TMPDIR read-only when CLAUDE_CODE_TMPDIR is set (Linux bubblewrap; related TMPDIR surface, different failure)

What happened (from the issue body — do not invent):

- Every Bash tool call (foreground or background, sandboxed or `dangerouslyDisableSandbox`) dies ~5s after start, exit 137.
- Error: `Command killed: its output file was replaced or could no longer be verified` plus bash output unavailable for `/private/tmp/claude-501/<project>/<session>/tasks/<id>.output` (unknown), blaming another Claude Code process startup cleanup.
- Short commands like `pwd` also fail: the command runs and the output file has correct content, but read-back is reported failed. The Read tool reads the same file fine. No other Claude Code process is active.
- Root cause as published: EDR adds a second hard link to every newly created file on the boot volume for ~1–8s then removes it. `stat` shows `nlink=2` then `nlink=1`. Inode, size, owner, mode, content never change.
- Claude Code output-file identity check (since 2.1.251, "sandboxed command cannot redirect or replace them") treats this as replaced → SIGTERM then SIGKILL; trap recorded SIGTERM at exactly +5s from parent `claude`.
- Evidence: polling `stat -f %l` on new files in /tmp, $HOME, ~/.claude, 0700 dir → nlink 1→2→1 within ~8s. On a separately mounted APFS RAM disk or sparse image, nlink stays 1.
- Headless repro `claude -p "run: echo hi && sleep 7 && echo alive" --allowedTools 'Bash(echo:*)'`:
  - default tmp: killed 137
  - `CLAUDE_CODE_TMPDIR=~/cctmp` on boot volume 0700: killed 137
  - `CLAUDE_CODE_TMPDIR` on APFS ramdisk or sparseimage volume: works
- Expected: a transient extra hard link with unchanged dev/inode is NOT a replaced file; compare device+inode (and maybe owner/mode), or retry before killing. The error message is misleading.
- Workaround: point `CLAUDE_CODE_TMPDIR` at a directory on a separately mounted volume (settings.json `env` works).
- Claude Code 2.1.263 (also 2.1.260); macOS 26.3 Darwin 25.3.0 Apple Silicon; Genian Insights EDR (system extension).

Same-issue follow-up on the thread (not a cousin; not closed-source verification): a second reporter reproduced on Linux with a plain `ln` of the task `.output` file — nlink 1→2 on the same inode, then kill 137. Encoded as confirmation that a second hard link is enough; do not treat bundle internals as verified facts.

Problem found: an EDR transient extra hard link (`nlink>1`, same inode) false-triggers the Bash output-file replacement check; every command is culled at ~5s.

Why this solution: a diagnostic scorer for the culled → sole seizing chain, so a reader can admit idle culled, pin seeded sole, and score nlink-spike / sigkill-5s / ramdisk-ok / cousins against the published facts.

## Why not a clone

This is specifically: **EDR transient hard-link (nlink>1, same inode) false-triggers Bash output-file replacement check → kill at ~5s.**

**NOT #92590** — sandbox.enabled leaves $TMPDIR read-only when CLAUDE_CODE_TMPDIR is set (Linux bubblewrap). Related TMPDIR surface, different failure. Cite only as a cousin.

**NOT Scarph/#92543** — Windows Bash -c ~8181 truncate + backslash halving.

**NOT Kerf/#92539** — Remove-Item spaced-path false positive.

**NOT Cringle/#92542** — deny unwrap 8-item wrapper bypass.

**NOT Gland/#92533** — Bash function-hook strips worktree isolation.

**NOT Demurrage/#92548** — daemon chat process leak.

**NOT Larum/#92563** — task-notification with no assistant turn.

**NOT Oubliette/#92095** — cold parent voids child-completion queue.

**NOT Holdfast/#92112** — mid-session `--worktree` cwd guard.

Cousins cite-only (NOT primary): #92590.

Stay OFF all prior catalog slugs/paradigms.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle stripped / packed / unanswered / roused / slipped / sighted / riven / argbound / accruing / cleared / sheared / fayed / overladen / trimmed / defocused / sharp / skimmed / intact / mislabeled / scoped / saturating / vented.

Different surface: EDR-transient-hard-link-false-replacement vs Windows path guards / deny unwrap / worktree isolation hooks / TMPDIR read-only sandbox / process-overstay.

Product name stays **Seizing**. Name/slug `seizing` confirmed unused in catalog.json (196 products).

Different UI: sailmaker / bosun seizing bench / tarred hemp / spun yarn / wooden fid / copper nails / oak block / dark loft / salt air. Libre Caslon Text / Sora / Inconsolata. NOT Lora/Plus Jakarta/Martian Mono. NOT Alegreya/Source Sans 3/Fira Code. NOT Libre Baskerville/DM Sans/Space Mono. NOT Cormorant/Outfit/Roboto Mono. NOT Spectral/Karla. NOT Fraunces/Manrope/JetBrains Mono. NOT Newsreader/Public Sans/IBM Plex Mono. NOT Petrona. NOT Bebas/Barlow/Source Code Pro. NOT Syne/Figtree.

Different verbs: score culled, admit sole, seize the eye, cull the yarn, load #92586 fixture, score the seizing.

Different idle: **culled**. Different seeded: **sole**. HOLD: **sole** / **ramdisk-ok**. ALARM: **culled** / **nlink-spike** / **sigkill-5s** / **cousins**.
