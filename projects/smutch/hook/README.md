# Smutch hook

Tiny binder's smutch-bench classifier for the Claude Desktop Icon\r crawl. Since the ~2026-08-27 desktop update (app 1.40609.0, engine 2.1.247), a background process stamps a custom folder icon across working directories of registered sessions. Classic `Icon\r`: **0-byte data fork**, `com.apple.FinderInfo` (32 bytes) + `com.apple.ResourceFork` (**163,057 bytes**, identical everywhere, `icns` at offset 260). Sets `kHasCustomIcon` (`0x04` at byte 8). The stamped image is always the stock macOS home-folder icon. ~20,000 files in 3 days. Breaks `git fetch` (`fatal: bad object refs/Icon`) and Python venvs (3,689 files).

Idle word is **plain**. Seeded state is smutched / #90993. Never idle as "smutch" / "smutched" / "icon" / "stamp" / "provenance" / "crawl" / "bitting" / "seated" / "bound" / "hallmarked" / "pointed" / "collapsed" / "spoiled" / "banked" / "misstruck" / "hunting" / "traced".

```bash
node projects/smutch/hook/smutch.mjs projects/smutch/data/90993.json
node projects/smutch/hook/smutch.mjs projects/smutch/data/plain.json
echo '{"iconR":true,"resourceFork":true}' | node projects/smutch/hook/smutch.mjs
node --test projects/smutch/hook/smutch.test.mjs
```

Empty stdin uses the idle **plain** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`.

- **PLAIN** if the folder is unmarked, no Icon\r, FinderInfo clean
- **SMUTCHED** if the desktop crawl stamped the home-folder Icon\r (#90993)
- **ICON-R** if a classic Icon\r sits in the folder
- **ZERO-BYTE** if the data fork is 0 bytes
- **RESOURCE-FORK** if `com.apple.ResourceFork` is 163,057 bytes
- **FINDERINFO** if `com.apple.FinderInfo` is 32 bytes
- **KHAS-CUSTOM-ICON** if `kHasCustomIcon` (`0x04` at byte 8) is set
- **HOME-ICON** if the stamp is the stock macOS home-folder icon
- **PROVENANCE-KEY** if the folder carries Claude Desktop's `com.apple.provenance` key
- **GIT-REFS-POISON** if git reports `fatal: bad object refs/Icon`
- **VENV-POISON** if Python `.venv` trees are stamped (3,689 files)
- **LOCAL-SESSIONS-CRAWL** if timing coincides with `LocalSessions` / `getPrChecks`
- **ICNS-IDENTICAL** if the `icns` at offset 260 is identical everywhere
- **CONTINUOUS-CRAWL** if the stamp keeps walking day and night (~20,000 in 3 days)

Primary: [anthropics/claude-code#90993](https://github.com/anthropics/claude-code/issues/90993). Same-class (not primary): [#90996](https://github.com/anthropics/claude-code/issues/90996) (duplicate). History only: isolated bursts 2026-05-11, 2026-07-27.

NOT Bitting / Puncheon / Gnomon / Spoil / Bulla / Carcase / Hydra.
