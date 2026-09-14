#!/usr/bin/env node
/**
 * Educational header-rename note for Nameplate / #94349.
 * Does NOT patch Claude Code. Does NOT install a hook.
 * Shows published header vs list rename shapes
 * against the HOLD affixed path.
 */
import {
  MISSING_RENAME,
  adoptPersistedTitle,
  renameSessionOnCli,
  scoreHeaderRename,
} from "../nameplate.mjs";

const header = renameSessionOnCli({
  channelOnSession: true,
  renameSessionExists: false,
});
const list = renameSessionOnCli({
  channelOnSession: false,
  renameSessionExists: false,
});
const hold = renameSessionOnCli({
  channelOnSession: true,
  renameSessionExists: false,
  affixed: true,
});
const echo = adoptPersistedTitle({
  summary: "New Room",
  newTitle: "New Room",
});

console.log(JSON.stringify({
  note: "Educational only. Not a Claude Code fix. Invite verify against #94349 text only.",
  header,
  list,
  hold,
  echo,
  scoredHeader: scoreHeaderRename({
    origin: "header",
    hasLiveChannel: true,
    renameSessionExists: false,
  }),
  leak: MISSING_RENAME,
}, null, 2));
