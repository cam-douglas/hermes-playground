# Sear

Gunsmith's sear desk for a real Claude Code failure: **the Bash tool makes `set -e` structurally inert**. User commands run inside `eval '...'` that is a **non-final** member of a `&&` list in the tool wrapper, so POSIX/bash suppress errexit for the whole script (and subshells). A defensive `set -e; false; echo survived` prints `survived` and the tool call can still exit 0 if the last line succeeds — the failure is invisible to the model. Real incident in the primary issue: copy-then-cleanup (`set -e`, several `cp`, then `rm -rf` sources) had `cp` fail; `set -e` did not stop; `rm -rf` deleted the sources; tool still exited 0.

Wrapper shape from the issue (`ps -o args`):

`bash -c "source <snapshot>.sh 2>/dev/null || true && shopt -u extglob ... && eval '<user command>' < /dev/null && pwd -P >| /tmp/claude-<n>-cwd"`

Workarounds that work but are undiscoverable: `bash -ec '...'` (fresh bash, own errexit context) or `&&`-chaining lines.

Primary: [anthropics/claude-code#90611](https://github.com/anthropics/claude-code/issues/90611) (open, filed 2026-08-29, labels bug/has repro/area:bash). Title: Bash tool: `set -e` is structurally inert -- command runs as `eval` in a non-final `&&` list member, so errexit is suppressed for the whole script.

A fallen sear is not a hold. Score the bench or admit **caught**.

Idle word: **caught** (sear engaged — errexit would abort; wrapper does not suppress).
NEVER use the product name sear / empty / silent / mute / idle / dead as the idle/state word.
NEVER reuse prior idles: posted, bunged, belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, rung, moored, stowed.

Verdicts: **caught**, **inert**, **survived**, **nonfinal**, **phantom-ok**, **continued**, **wiped**, **chained**, **freshbash**, **suppressed**. Slack alarm on inert / survived / nonfinal / phantom-ok / continued / wiped / suppressed. Linear ticket on wiped / phantom-ok / inert. GitHub sear-ledger of scored probes on every score.

The #90611 inert bench (set -e present, eval in non-final &&, false then echo survived, tool exit 0, wipe after failed cp) is **inert**, never **caught**. Unique nearby flags win their own seeds because those seeds do not carry the inert pentad.

## Why not a clone

NOT **Spile** — hook stdin wedge / unenforced timeout (EOF pipe, timeout not enforced). Sear is wrapper `&&`/eval making errexit inert.
NOT **Grille** — bypass-permissions Bash-steered sed/heredoc edits bypassing Edit/Write hooks. Sear is fail-fast `set -e` suppressed, not edit path.
NOT **Scant** — Windows shell-snapshot PATH truncation at ~7.2KB.
NOT **Sounder** — background Bash completion notification never re-invokes session.
NOT **Leat** — sleep-block unbounded until-loop.
NOT **Clew** — sandbox deny-list E2BIG / ARG_MAX.
NOT **Cubby** — wrong-ancestor auto-memory cache.
NOT **Bollard** — RC environment orphan after supervisor gap.
Do NOT ship leftover woodworking / millimetre-slider clones.
Do NOT ship alternate names Trap, Fuse, Fusee (exists), Pawl, Detent, Trip, Catch, Escapement, Trigger, Hammer, Striker, Hairpin, Bail, Dog, Chock, Latch, Keeper, Deadman, Failsafe, Errexit, Stopcock, Governor, Ratchet, Tripwire, Snubber, Sear-block. Product name is **Sear** only.

Different problem: BASH TOOL WRAPPER RUNS USER COMMAND AS EVAL IN A NON-FINAL && LIST MEMBER → SET -E IS STRUCTURALLY INERT.
Different UI: gunsmith's **sear desk** — blued steel, walnut stock wood, brass pins, oil-lamp amber, charcoal. Sear notch (caught vs fallen hammer), wrapper `&&` chain lamp, eval-nonfinal badge, survived-echo stamp, wipe-after-failed-cp incident card. NOT a mailroom cubby, NOT a bank teller grille, NOT a cellar bung, NOT a wet pier, NOT a sail loft.
Different idle word: **caught**.

## Live catalog path

`/sear/` is this static gunsmith sear desk. Blued steel, walnut stock, brass pins, oil-lamp amber, charcoal. Demo works with no secrets and no npm. Mark: `03:50 Sydney · sear`.

1. Seeded `#90611` **inert** is already on the desk: hammer fallen, eval-nonfinal badge lit, survived-echo stamp, wipe-after-failed-cp incident card → **inert** / **survived**. Never caught.
2. Switch **inert** — set -e present but structurally suppressed (eval in non-final &&).
3. Switch **survived** — execution continued past a failing line (echo survived after false).
4. Switch **nonfinal** — user command eval is non-final && member.
5. Switch **phantom-ok** — tool/report exit 0 despite mid-script failure.
6. Switch **continued** — script ran lines after a failed command.
7. Switch **wiped** — destructive cleanup ran after earlier fail (cp-fail then rm -rf class).
8. Switch **chained** — &&-chain workaround in use (not true errexit).
9. Switch **freshbash** — bash -ec workaround applied (recovery/class, caught may still be false).
10. Switch **suppressed** — POSIX/bash documented errexit suppression in &&/|| list context.
11. Switch **control caught** / **Reset · caught** — sear engaged, set -e would abort → **caught** true.
12. **Score** scores. **Admit caught** scores honestly. **Restore · #90611** shows the inert/survived desk. Admit does not lie.

## Hook

`projects/sear/hook/` scores a probe `{ session, issue, source, setEPresent, wrapperEvalNonFinalAnd, falseThenEchoSurvived, toolExitZeroDespiteMidFail, continuedPastFail, wipeAfterFailedCopy, chainedWorkaround, freshBashEc, subshellAlsoSurvived, scored }` and returns `{ verdict, reasons[], caught }`. See `hook/README.md`.

```bash
node projects/sear/hook/index.mjs --listen 9090
node --test projects/sear/hook/sear.test.mjs
```

`caught` is true ONLY when set -e would actually abort (fresh bash -ec / final-member context) and the verdict is not a failure class. Seeded 90611 numbers must produce inert / `caught=false`. Control fresh-bash / final-member path produces `caught=true`. Freshbash classifies **freshbash** with `caught=false` (recovery, not idle control).

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90611](https://github.com/anthropics/claude-code/issues/90611) — open, filed 2026-08-29, labels bug/has repro/area:bash. Title: Bash tool: `set -e` is structurally inert -- command runs as `eval` in a non-final `&&` list member, so errexit is suppressed for the whole script.

Same-class / nearby bash area (cite as corroboration of shell-wrapper harm, not as the same bug):

- [anthropics/claude-code#90118](https://github.com/anthropics/claude-code/issues/90118) — Messages sent during a Bash tool call are silently destroyed when the call returns is_error: true (adjacent: Bash result channel lies/drops).
- [anthropics/claude-code#62297](https://github.com/anthropics/claude-code/issues/62297) — Intentional kill of backgrounded Bash reported as failed exit 144 (opposite pole: status misreported).

Cross-check nearby bugs are DIFFERENT (cite only as “not this”):

- NOT Spile. Hook stdin wedge / unenforced timeout.
- NOT Grille. Bash-steered edits under bypass-permissions.
- NOT Scant. Windows shell-snapshot PATH truncation at ~7.2KB.
- NOT Sounder. Background Bash completion notification never re-invokes session.
- NOT Leat. Sleep-block unbounded until-loop.
- NOT Clew. Sandbox deny-list E2BIG / ARG_MAX.
- NOT Cubby. Wrong-ancestor auto-memory cache.
- NOT Bollard. RC environment orphan after supervisor gap.

Cross-ecosystem (shell status / wrapper lies):

- [openai/codex#34866](https://github.com/openai/codex/issues/34866) — "Script completed" reported while nested shell session still running.
- [openai/codex#41534](https://github.com/openai/codex/issues/41534) — nested-quote corruption in pwsh -Command exec_command.

## Integrations

Slack alarm on inert / survived / nonfinal / phantom-ok / continued / wiped / suppressed. Linear ticket on wiped / phantom-ok / inert. GitHub sear-ledger of scored probes on every score. Demo mode needs no Slack / GitHub / Linear secrets and no npm. Native stubs fire in the UI (ledger tape / alarm card) without requiring live tokens.
