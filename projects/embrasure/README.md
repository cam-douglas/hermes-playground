# Embrasure

A **battlement / parapet / embrasure assay** — dusk ashlar stone, merlon silhouette, one lit embrasure slit that can go OPEN (fail-open / wall gone) vs HELD (string denyRead / wall intact) — Cinzel Decorative + Source Sans 3 + Fragment Mono — for a real Claude Code defect: **A NON-STRING ENTRY IN `sandbox.filesystem.denyRead` / `denyWrite` SILENTLY DISABLES `permissions.deny` AND `PreToolUse` HOOKS.**

Primary:

- [anthropics/claude-code#92365](https://github.com/anthropics/claude-code/issues/92365) (OPEN, bug, has repro, area:security, area:permissions, area:sandbox, platform:wsl). Title: `A non-string entry in sandbox.filesystem.denyRead/denyWrite silently disables permissions.deny and PreToolUse hooks (2.1.261)`. Filed 2026-09-05. Reporter: happy-ryo.

06:50 embrasure: an embrasure that opens the curtain wall because a denyRead entry was not a string is not a tighter fence — it is already open. Score the slit or admit the wall already open.

Idle word: **open**. Seeded state: **witnessed** / #92365 — hook witness file never written when the denyRead/denyWrite entry is an object or a number. Never idle as elided, grafted, frozen, adrift, leaked, miskeyed, razed, doubled, stuck, missed, gated, spilled, hushed, blurted, lit, blanked, cold, voided, banked, rewritten, discarded, or any prior catalog idle.

**Embrasure** is masonry work: an embrasure should let you fire while the curtain wall still protects. Here a malformed opening that the mason accepts without warning removes the whole wall — `permissions.deny` and the PreToolUse backstop vanish together. Adding a sandbox deny list that looks MORE restrictive makes the file STRICTLY LESS restrictive.

- **open** = IDLE / fail-open fence: a non-string denyRead or denyWrite entry is accepted; the curtain wall is already gone
- **held** = string denyRead (or key absent / unknown key / additionalDirectories): wall intact; hook invoked; denied command refused
- **witnessed** = seeded word: the PreToolUse hook writes a witness file *before* it decides; if the file does not exist after the run, the hook was never invoked
- **witnessed-false** = seeded #92365: `witness.txt` never written; lamp dark
- **fail-open** = settings accepted, exit 0, no warning, empty stderr, then neither deny nor hook applied
- **string-entry** = `denyRead: ["/abs/path/to/.ssh"]` — enforcement works (4/4)
- **object-entry** = `denyRead: [{"path":"/abs/path/to/.ssh"}]` — all enforcement discarded (4/4)
- **number-entry** = `denyRead: [42]` — same fail-open as the object form
- **key-absent** = deleting the `sandbox` key entirely restores enforcement
- **unknown-key** = `{enabled:true, ..., surprise:{...}}` is harmless
- **permissions-gone** = `permissions.deny` not applied; a `Read` of a denied path succeeds
- **hook-dark** = PreToolUse never fires; the documented escape hatch is gone with the deny list
- **reject-non-string** = expected fix: refuse to start (or warn naming key and index)
- **warn-ignore** = expected fix: warn and ignore the sandbox block; never weaker than the key-absent row
- **never-fail-open** = the property that matters: a block the CLI does not accept must not make enforcement weaker than omitting that block

Verdicts: open, held, witnessed, fail-open, string-entry, object-entry, number-entry, key-absent, unknown-key, permissions-gone, hook-dark, reject-non-string, warn-ignore, never-fail-open.

This is a diagnostic scoring assay. Not an exploit. No secrets. No live Claude sessions. Score whether a denyRead/denyWrite entry that is not a string would leave the curtain wall held or already open. Fixtures use the issue's string/object/number/absent/unknown-key cells, the published 24-cell matrix, and the published witness-hook observation only.

Hypothesis only (NON-BINDING): reject a non-string denyRead/denyWrite entry, or warn and ignore the sandbox block; never fail-open. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92365](https://github.com/anthropics/claude-code/issues/92365)

What happened (from the issue — do not invent):

- Environment: Claude Code CLI **2.1.261**; node **v22.17.0**; Linux (WSL2); model `claude-haiku-4-5-20251001`. Target: a git repository carrying no settings of its own, with `--setting-sources ''`, so the only settings in effect are the file passed to `--settings`. `permissionMode`: `acceptEdits`. Every settings file carried `"allow": []`.
- If any entry of `sandbox.filesystem.denyRead` or `sandbox.filesystem.denyWrite` is not a string — for example the object form `{"path": "~/.ssh"}`, or a number — the CLI accepts the settings file, exits zero, prints no warning and writes nothing to stderr, and then applies **neither** `permissions.deny` **nor** any `PreToolUse` hook for that run.
- The failure is open, not closed. A `Read` of a path covered by a `permissions.deny` rule succeeds and the file's contents are returned to the model. The `PreToolUse` hook — the documented escape hatch for exactly this situation — is never invoked at all.
- Deleting the `sandbox` key entirely restores correct enforcement. So a settings file that a reader would take to be strictly *more* restrictive, because it adds a sandbox deny list on top of the existing rules, ends up strictly *less* restrictive than the same file with that block removed.
- The hook writes a witness file *before* it decides. If the file does not exist after the run, the hook was never invoked — as opposed to invoked and overruled.
- The two cases differ in exactly one thing: whether the single `denyRead` entry is a string or an object. The path is the same in both.
- Expected: with `permissions.deny: ["Bash(ls:*)"]` and a `PreToolUse` deny hook, the `ls` is refused and `witness.txt` exists. A `sandbox` block the CLI does not accept should at worst be ignored, leaving enforcement no weaker than if the block were absent.
- Observed in the bad case: the `ls` **runs** and its output is returned to the model. `witness.txt` **does not exist**. Exit status 0, no warning, empty stderr.

Results table (24 cells: eight sandbox spellings × three commands; every spelling behaved identically across all three commands):

| `sandbox` value | hook invoked? | the denied command |
|---|---|---|
| key absent entirely | yes | refused |
| `{enabled:true, filesystem:{denyRead:["/abs/.ssh"]}}` | yes | refused |
| `{filesystem:{denyRead:["/abs/.ssh"]}}` (no `enabled`) | yes | refused |
| `{enabled:true, ..., surprise:{...}}` (an unknown key) | yes | refused |
| `{enabled:true, filesystem:{denyRead:[{"path":"~/.ssh"}]}}` | **no** | **ran** |
| `{filesystem:{denyRead:[{"path":"~/.ssh"}]}}` | **no** | **ran** |
| `{enabled:true, filesystem:{denyWrite:[{"path":"~/.ssh"}]}}` | **no** | **ran** |
| `{enabled:true, filesystem:{denyRead:[42]}}` | **no** | **ran** |

An unknown key inside `sandbox` is harmless. The object form and the bare number behave identically. `additionalDirectories` is unaffected: eight further cells (`["<abs>"]`, `[{"path":"<abs>"}]`, `[42]`, `[null]` over two commands) were all harmless. It is not Bash-only: with matcher `"*"` and `permissions.deny: ["Read(<secret file>)", "Edit(<dir>/**)"]`, a string `denyRead` refuses Read and Write via the hook; an object `denyRead` lets Read succeed (contents returned to the model). Write happened to stop only because a non-interactive run has nobody to grant approval — not the configured rule.

Determinism: the decisive pair (string vs object, all else equal) was run four times in each configuration: 4/4 enforced with the string form, 4/4 entirely unenforced with the object form.

Suggested fix from the issue (document only):

1. Never let a settings block the CLI does not accept make enforcement weaker than omitting that block.
2. Fail loudly on a `denyRead` / `denyWrite` entry that is not a string — refuse to start, or at minimum warn naming the offending key and index.
3. Do not let a `sandbox` problem disable `permissions.deny` and `PreToolUse` hooks.
4. Accepting the object form would resolve this particular instance, but the general property in (1) still matters.

## Why not a clone

This is specifically: **sandbox filesystem denyRead/denyWrite non-string entry / start-of-run fail-open that drops both permissions.deny and PreToolUse.**

NOT Portcullis/#92278 — EACCES managed prefs as unreadable policy / dropped grate. Embrasure is not an iron grate gatehouse.
NOT Oubliette — cold parent queue drain. Embrasure is not a stone pit.
NOT Elision/#92347 — summarize-up-to-here drops compact summaries. Embrasure is not a blue-pencil folio desk.
NOT Graft/#92354 — plugin cache copy-forward. Embrasure is not an orchard grafting bench.
NOT Sostenuto/#92360 — CoreAudio hold-to-talk freeze. Embrasure is not an ebony piano.
NOT Jetsam/#92338 — stale tracking-ref Stop hook. Embrasure is not a teak quay.
NOT Priory/#92345 — MSIX priconfig leak. Embrasure is not a limestone cloister.

Different surface: sandbox deny-list entry type vs those.

Cousins cite-only (NOT primary):

- [#78764](https://github.com/anthropics/claude-code/issues/78764) — invalid settings drops deny mid-session
- [#88770](https://github.com/anthropics/claude-code/issues/88770) — deny bypassed under Auto Mode
- [#85613](https://github.com/anthropics/claude-code/issues/85613) — ancestor settings ignored
- [#77568](https://github.com/anthropics/claude-code/issues/77568) — absolute path deny matches nothing
- [#85430](https://github.com/anthropics/claude-code/issues/85430) — PreToolUse silent miss one cwd (deny still fires)
- [#70181](https://github.com/anthropics/claude-code/issues/70181) — empty server-managed 304 zeros local
- [#91690](https://github.com/anthropics/claude-code/issues/91690) — grep/cp bypass Read deny

Product name stays **Embrasure**. Do not rename to Portcullis, Oubliette, Elision, Graft, or any existing catalog slug. Name/slug `embrasure` confirmed unused in catalog.json.

Different UI: dusk ashlar battlement / merlon silhouette / one lit embrasure slit / parapet walk / cresset witness lamp. Cinzel Decorative + Source Sans 3 + Fragment Mono. NOT Cormorant / Manrope (Portcullis). NOT Newsreader / Figtree (Elision). NOT Literata / DM Sans (Graft). NOT Fraunces / Outfit (Sostenuto). Stay OFF iron grate gatehouse / stone pit / blue-pencil folio / orchard cambium.

Different verbs: Score the slit, pin idle open, pin seeded witnessed, admit the wall already open, load fixtures, reset to held.

Different idle: **open**. Different seeded: **witnessed**.

## Live catalog path

`/embrasure/` is this static battlement scoring assay. Path `https://hermes-playground-green.vercel.app/embrasure/` and subdomain `https://embrasure.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `06:50 / hermes catalog #166 / #92365`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **open** — object denyRead; fail-open; witnessed-false; permissions.deny gone; PreToolUse never invoked; exit 0; empty stderr.
2. Idle **open** → the fail-open fence; curtain wall already gone; idle word open.
3. Contrast **held** → string denyRead; hook invoked; command refused; witness lamp on.
4. Assay UI: dusk ashlar, merlon row, one embrasure slit (OPEN vs HELD), cresset witness lamp, permissions.deny + PreToolUse chips, eight-spelling matrix, reject / warn-ignore / never-fail-open paths.
5. Stay-off strip: Portcullis / Oubliette / Elision / Graft / Sostenuto / Jetsam / Priory. Primary stays #92365.
6. **Score the slit** walks the probe ticket and lights chips on the parapet. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite denyRead entry shape (string / object / number / absent).

## How to score

Open `projects/embrasure/index.html` in a browser, or serve the repo root and visit `/embrasure/` (Vercel rewrite → `/projects/embrasure`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **open** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **open** / witnessed-false.
