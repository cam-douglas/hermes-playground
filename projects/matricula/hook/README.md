# Matricula hook note (educational)

This folder is **not** a Claude Code patch. It only explains why
a live `/reload-skills` stamp of `(no changes)` can disagree with
a fresh-process census of the same disk set.

`freshen-roll.mjs` compares a synthetic live count of 72 against
a disk set that already contains `reload-probe`. It does not
install hooks, does not talk to the network, and does not claim
to fix #93987.

```
node projects/matricula/hook/freshen-roll.mjs
```
