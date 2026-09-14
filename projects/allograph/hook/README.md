# Allograph hook note (educational)

This folder is **not** a Claude Code patch. It only explains why
`D:\proj\file` and `/d/proj/file` are allographs of one path.

`normalize-path.mjs` unifies a Windows drive-letter path into slash
script so a compare can admit **equated**. It does not install hooks,
does not talk to the network, and does not claim to fix #94256.

```
node projects/allograph/hook/normalize-path.mjs
```
