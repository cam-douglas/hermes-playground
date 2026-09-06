# Bourdon fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92510 issue facts: on macOS Apple Silicon, the Apple Virtualization VM that Claude Desktop Cowork/Code launches accumulates host-side open file descriptors continuously — including while completely idle. Snapshot ~409,600 fds (~71% of `kern.maxfiles`, ~130x next-largest process). Guest side is clean (~512 open files). Quitting Claude Desktop releases the descriptors. Score saturating or admit vented.

Idle word: **saturating**. Seeded word: **vented**. HOLD: **vented**. ALARM: **saturating** / **host-fd-409600** / **guest-clean-512** / **idle-12h-after-prompt** / **virtiofs-suspect** / **cousins**. Control: **cli-no-vm-clean**. Workaround: **cmdq-releases**. Primary: [anthropics/claude-code#92510](https://github.com/anthropics/claude-code/issues/92510). Seed primary as saturating / host-fd climb / guest still clean.

| File | Verdict | What it scores |
|---|---|---|
| `saturating.json` | saturating | Idle Bourdon fence. Host fd pressure climbs while idle toward kern.maxfiles. |
| `vented.json` | vented | Seeded hold. Cmd+Q Desktop releases descriptors immediately. |
| `92510.json` | saturating | Primary fixture alias for #92510. |
| `host-fd-409600.json` | host-fd-409600 | Host snapshot ~409,600 fds (~71% of kern.maxfiles, ~130x next). |
| `guest-clean-512.json` | guest-clean-512 | Guest `/proc/sys/fs/file-nr` ~512; ~5 processes; leak is host-side. |
| `idle-12h-after-prompt.json` | idle-12h-after-prompt | Count still climbing 12h after last prompt. |
| `virtiofs-suspect.json` | virtiofs-suspect | Issue's own most-likely: virtiofs / shared-folder host handles. NON-BINDING. |
| `cmdq-releases.json` | cmdq-releases | Cmd+Q / kill VM PID / smaller subfolder — descriptors released. |
| `cli-no-vm-clean.json` | cli-no-vm-clean | Terminal CLI without VM does not exhibit this. |
| `cousins.json` | cousins | Cite-only #79920 #92069 #29573 #26087 #47829 #26646 #65239 #47644. |
| `fixtures.json` | index | Row list for the Bourdon-tube pressure bay. |

Drop any file onto `projects/bourdon/index.html` or paste the JSON. The living page admits **saturating** / host-fd climb / guest still clean / #92510.
