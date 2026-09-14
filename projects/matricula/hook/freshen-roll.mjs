#!/usr/bin/env node
/**
 * Educational census note for Matricula / #93987.
 * Does NOT patch Claude Code. Does NOT install a hook.
 * Shows a live (no changes) stamp against a disk set that
 * already contains reload-probe.
 */
import {
  diskHasProbe,
  freshProcessSees,
  reloadReport,
  scoreCensus,
} from "../matricula.mjs";

const disk = ["alpha", "beta", "reload-probe"];
const session = ["alpha", "beta"];
const fresh = ["alpha", "beta", "reload-probe"];
const live = reloadReport({ beforeCount: 72, afterCount: 72 });
const honest = reloadReport({ beforeCount: 72, afterCount: 73 });
const grown = scoreCensus({
  diskSkills: disk,
  sessionSkills: session,
  freshSkills: fresh,
  beforeCount: 72,
  afterCount: 72,
  noChanges: true,
  report: live.text,
});

console.log(JSON.stringify({
  note: "Educational only. Not a Claude Code fix. Invite verify against #93987 text only.",
  diskHasProbe: diskHasProbe(disk),
  sessionListsProbe: session.includes("reload-probe"),
  freshProcessSees: freshProcessSees(fresh),
  liveStamp: live.text,
  honestStamp: honest.text,
  reloadBlind: grown.reloadBlind,
}, null, 2));
