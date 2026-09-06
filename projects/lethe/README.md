# Lethe

A **classical underworld ferry quay** — dark river water, stone quay, ferry boat, washed token-coins downstream, account stone on the bank, mist, ferry lantern, crossing gauges — Cormorant Garamond + Manrope + IBM Plex Mono — for a real Claude in Chrome defect: **AFTER ANYTHING THAT ENDS THE CHROME BROWSER SESSION, CLAUDE IN CHROME 1.0.91 SHOWS SIGN IN WHILE `claude.ai` STAYS LOGGED IN; SILENT RE-AUTH NEVER RESTORES THE SESSION.**

Primary:

- [anthropics/claude-code#92335](https://github.com/anthropics/claude-code/issues/92335) (OPEN, bug, has-repro, platform:linux, area:auth, area:chrome). Title: `[BUG] Claude in Chrome 1.0.91: Sign-in screen after every browser-session end (reboot / profile switch) — silent re-auth never restores the session while claude.ai stays logged in`. Filed 2026-09-05. Reporter: musaad-sharikh.

09:50 lethe: a ferry that leaves the account stone on the bank after the session tokens wash downstream, then never docks the silent re-auth, is not a sign-out — it is already washed. Score the crossing or admit the traveler already stranded.

Idle word: **washed**. Seeded state: **stranded** / #92335 — Sign-in screen while claude.ai still logged in; accountUuid/tokenOrg intact on the local bank. Never idle as unstruck, leaked, nixied, settled, open, elided, grafted, frozen, adrift, cold, voided, banked, rewritten, discarded, held, witnessed, or any prior catalog idle.

**Lethe** is underworld-river work. Lethe is the classical river of forgetfulness. RAM-only tokens wash into the river when the browser session ends; the account stone (`accountUuid`) remains on the bank; the silent-reauth ferry exists but never docks, so the traveler sees Sign-in while the far shore (claude.ai tab) is still awake. Score whether a crossing (session-end vs silent-reauth vs manual Sign in) would stay washed, restore, or leave the traveler stranded.

- **washed** = IDLE / session-token wash: browser session ended; `accessToken` / `refreshToken` / `tokenExpiry` absent from `chrome.storage.session`; silent re-auth did not restore
- **stranded** = seeded word: side panel shows Sign in; claude.ai tab still authenticated; accountUuid and tokenOrg intact on `chrome.storage.local`
- **restored** = contrast hold: silent re-auth succeeded; `Bs()` returned success; session tokens restored; already signed in
- **signed-out-clean** = contrast hold: full sign-out routine cleared accountUuid — a real sign-out, not a wash
- **stale-bound** = contrast hold: cite-only #82455 opposite — extension stays bound to a stale account
- **silent-reauth-exists** = `Bs()` / `cic_ext_silent_reauth` path present in the 1.0.91 bundle
- **tokens-session-only** = tokens routed to `chrome.storage.session` by design; refresh-token path cannot run after session end
- **account-banked** = LevelDB has accountUuid + tokenOrg; zero token keys
- **no-failure-reason** = `lastAuthFailureReason` never written — not account_mismatch / consent_required
- **not-signed-out** = full sign-out routine did not run; logout is passive
- **ferry-timeout** = 8s bootstrap + 5s non-interactive `launchWebAuthFlow`; may contribute after boot; does not explain warm-network cases
- **manual-sign-in-works** = clicking Sign in completes without re-entering credentials
- **profile-switch** = same Sign-in after profile switch; user-visible; not instrumented
- **disabled-by-gate** / **authorize-failed** / **never-reached** = leftover `Bs()` branches after the ruled-out terminals
- **log-bs-return** = expected diagnostic: name the `Bs()` return in the service-worker console
- **silent-restore** = expected fix: first service-worker start after session end silently re-authenticates from the live claude.ai session

Verdicts: washed, stranded, silent-reauth-exists, tokens-session-only, account-banked, no-failure-reason, not-signed-out, ferry-timeout, manual-sign-in-works, profile-switch, restored, signed-out-clean, stale-bound, disabled-by-gate, authorize-failed, never-reached, log-bs-return, silent-restore.

This is a diagnostic scoring assay. Not an exploit. No secrets. No live Claude sessions. Score whether a browser-session end would leave the traveler washed or already stranded. Fixtures use the issue's on-disk LevelDB keys, session-vs-local routing, silent-reauth bundle path, ruled-out terminals, timeouts, and published workaround only.

Hypothesis only (NON-BINDING): on first service-worker start after a browser session ends, silently re-authenticate from the live claude.ai session and open already signed in; log the `Bs()` return. RAM-only token storage is intentional; the defect is that the covering silent re-auth does not complete. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92335](https://github.com/anthropics/claude-code/issues/92335)

What happened (from the issue — do not invent):

- Environment: Claude in Chrome **1.0.91** (`fcoeoabgfenejglbffodgkkbkcdhcgfn`), Chrome Web Store; Chrome **152.0.7977.82**, Flatpak `com.google.Chrome`; Fedora Linux 44; Wayland (niri compositor), no GNOME/KDE shell. Chrome's "clear cookies on exit" is not set; no cleanup script runs at boot.
- After anything that ends the browser session for a Chrome profile, the Claude in Chrome side panel shows the **Sign in** screen — while `claude.ai` in a normal tab is still fully logged in and unrelated sites keep their sessions.
- The extension still knows the account (`accountUuid` and `tokenOrg` are intact on disk), so this is not a sign-out. The in-memory tokens are gone and nothing restores them, even though the bundle ships a silent re-auth path that appears designed to cover exactly this case.
- Expected: on the first service-worker start after a browser session ends, the extension should silently re-authenticate from the live `claude.ai` session and open already signed in, with no user interaction.
- Repro: sign in to the extension; confirm `claude.ai` is logged in; reboot (or fully quit Chrome); start Chrome and open the Claude side panel. Observed: Sign in. `claude.ai` still logged in. Unrelated Google/YouTube login keeps its session.
- Additional observation — not instrumented: switching from this Chrome profile to a second profile and back reproduces the same Sign-in screen without a reboot. `chrome.storage.session` was not instrumented across that transition. Reported only as a user-visible observation. The reboot path is the one the on-disk evidence covers.

Evidence (read-only inspection of the shipped 1.0.91 bundle and on-disk profile data):

1. Auth tokens are routed to `chrome.storage.session` (RAM-only), by design. A Set holds `accessToken`, `refreshToken`, `tokenExpiry`, `startupReauthState`, `posture`, `pairingOrgMismatch`. Those keys go to session; every other key goes to `chrome.storage.local`.
2. Confirmed on disk in `Default/Local Extension Settings/fcoeoabgfenejglbffodgkkbkcdhcgfn/`: LevelDB contains `accountUuid`, `tokenOrg`, `lastActiveOrgHint`, `oauthState`, `codeVerifier` — and **zero** occurrences of `accessToken`, `refreshToken` or `tokenExpiry`. Tokens were never persisted.
3. `refreshToken` is session-scoped too, so the `grant_type=refresh_token` path against `https://platform.claude.com/v1/oauth/token` cannot run after a session ends. Only a full authorize round can recover.
4. Silent re-auth exists (`Ms = "cic_ext_silent_reauth"`; `async function Bs()`), preceded by `fetch("https://claude.ai/api/bootstrap", {credentials:"include", cache:"no-store"})` with an 8000 ms abort, then `chrome.identity.launchWebAuthFlow({interactive:false, timeoutMsForNonInteractive:5000})` raced against an outer 15000 ms timeout. It is not restoring the session here.
5. Two failure branches ruled out by on-disk state:
   - `accountUuid` is present, so `Bs()` cannot be returning `no_stored_account`.
   - `lastAuthFailureReason` was **never written**. That key is only written on the `account_mismatch` / `consent_required` terminal path.
   - `accountUuid` and `tokenOrg` both survive, so the full sign-out routine did not run. The logout is passive.

That leaves `disabled_by_gate`, `authorize_failed`, or the path never being reached.

Likely cause (issue analysis of the shipped bundle, not verified against source): RAM-only token storage is intentional; the defect is that the silent re-auth that covers it does not complete. Tight timeouts may contribute on a slow link immediately after boot (reporter on a metered mobile link) but would not explain warm-network occurrences.

What could not be determined: whether silent re-auth runs at all, and what the `cic_ext_silent_reauth` gate value is. No user-visible signal either way. A log line naming the `Bs()` return would make this diagnosable.

Workaround from the issue (document only): none automatic. Clicking **Sign in** completes without re-entering credentials, because the `claude.ai` session is alive — but it is a manual step after every browser session.

## Why not a clone

This is specifically: **Claude in Chrome 1.0.91 Sign-in after every browser-session end; silent re-auth never restores while claude.ai stays logged in; tokens session-scoped; accountUuid intact.**

NOT Frizzen/#92353 — UserPromptSubmit listed-but-never-invoked. Lethe is not a flintlock bench.
NOT Nixie/#92383 — postal undeliverable send / 45s no-ack settle. Lethe is not a USPS nixie desk.
NOT Embrasure/#92365 — denyRead fail-open. Lethe is not a battlement embrasure.
NOT Elision/#92347 — summary cut. Lethe is not a blue-pencil folio.
NOT Graft/#92354 — plugin cache copy-forward. Lethe is not an orchard grafting bench.
NOT Sostenuto/#92360 — CoreAudio hold-to-talk freeze. Lethe is not an ebony piano.
NOT Jetsam/#92338 — stale tracking-ref Stop hook. Lethe is not a teak quay.
NOT Priory/#92345 — MSIX priconfig leak. Lethe is not a limestone cloister.
NOT Latchkey/#92330 — Remote Control OAuth false /login. Lethe is not a brass latchkey board.
NOT Portcullis/#92278 — EACCES managed prefs. Lethe is not an iron grate.
NOT Portfire / Matchlock / Touchhole — leftover flintlock names. Do not reuse.

Different surface: Chrome extension silent re-auth / session-scoped tokens vs UserPromptSubmit hooks vs send_message nixie vs sandbox denyRead fail-open.

Cousins cite-only (NOT primary):

- [#57365](https://github.com/anthropics/claude-code/issues/57365) CLOSED — forced logout from a 403 WebSocket retry loop *during* a session
- [#82455](https://github.com/anthropics/claude-code/issues/82455) OPEN — opposite: extension stays bound to a stale account
- [#82074](https://github.com/anthropics/claude-code/issues/82074) OPEN — grant remains authenticated after global logout

Product name stays **Lethe**. Do not rename to Frizzen, Nixie, Embrasure, Portfire, Matchlock, Touchhole, Fairlead, Chock, Gypsy, Wildcat, Fulcrum, Trunnion, or any existing catalog slug. Name/slug `lethe` confirmed unused in catalog.json.

Different UI: classical underworld ferry quay / dark river / stone quay / ferry boat / washed token-coins / account stone / mist / ferry lantern. Cormorant Garamond + Manrope + IBM Plex Mono. NOT Bodoni Moda / Commissioner / Space Mono (Frizzen walnut-steel-brass). NOT Libre Baskerville / DM Sans / JetBrains Mono (Nixie oak-kraft-nixie-red). NOT Cinzel / Source Sans 3 (Embrasure). Stay OFF flintlock lockplate / postal pigeonholes / battlement merlons.

Different verbs: Score the crossing, pin idle washed, pin seeded stranded, admit the traveler already stranded, flip session-end vs silent-reauth vs manual Sign in, load fixtures, reset to restored.

Different idle: **washed**. Different seeded: **stranded**. Contrast: **restored** / **signed-out-clean** / **stale-bound**.

## Live catalog path

`/lethe/` is this static ferry-quay scoring assay. Path `https://hermes-playground-green.vercel.app/lethe/` and subdomain `https://lethe.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `09:50 / hermes catalog #169 / #92335`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **stranded** — Sign-in on the side panel; claude.ai tab still awake; account stone on the bank; tokens washed.
2. Idle **washed** → the session-token wash; coins downstream; idle word washed.
3. Contrast **restored** → silent re-auth succeeded; ferry docks; already signed in.
4. Contrast **signed-out-clean** → accountUuid cleared; a real sign-out.
5. Contrast **stale-bound** → #82455 opposite; stays bound to a stale account.
6. Assay UI: dark river, stone quay, ferry boat, washed token-coins, account stone, mist, ferry lantern, crossing gauges, LevelDB slip.
7. Stay-off strip: Frizzen / Nixie / Embrasure / Elision / Graft / Sostenuto / Jetsam / Priory / Latchkey / Portcullis / Portfire / Matchlock / Touchhole. Primary stays #92335.
8. **Score the crossing** walks the probe ticket and lights chips on the quay. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the crossing (session-end / silent-reauth / manual Sign in).

## How to score

Open `projects/lethe/index.html` in a browser, or serve the repo root and visit `/lethe/` (Vercel rewrite → `/projects/lethe`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **washed** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **stranded** / Sign-in while claude.ai stays logged in.
