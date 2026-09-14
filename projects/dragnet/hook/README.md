# Dragnet hook note (educational)

This folder is **not** a Claude Code patch. It only explains why
a desktop `/usr/bin/find` rooted at `/` can disagree with a
project-scoped walk of the open case folder.

`fence-net.mjs` compares a synthetic walk root of `/` against a
synthetic project cwd. It does not install hooks, does not walk
the live filesystem, does not talk to the network, and does not
claim to fix #94064.

```
node projects/dragnet/hook/fence-net.mjs
```
