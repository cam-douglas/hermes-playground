#!/usr/bin/env node
/**
 * Berth harbour-quay hook. A shared
 * berth is not a hold. Score the
 * quay or admit alongside.
 *
 *   echo '{"parentCwd":"..."}' | node index.mjs
 *   node index.mjs berth.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   BERTH_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   BERTH_GITHUB_TOKEN  Berth-ledger issue. Absent → demo ledger.
 *   BERTH_LINEAR_KEY    Shared-tree quay ticket. Absent → demo row.
 *
 * NOT Carrel / Fascia / Byline /
 * Datum / leftover woodworking.
 * Idle word is alongside, never the
 * product name, never empty, never
 * silent / mute / idle / seated /
 * moored.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseBerthJson, seedCohabited } from "./berth.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedCohabited());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedCohabited();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.berth ||
        parsed.probe ||
        parsed.quay ||
        parsed.dock ||
        parsed.parentCwd != null ||
        parsed.chipCwd != null ||
        parsed.spawn_task != null ||
        parsed.cwdParam != null)
    ) {
      return parsed.action || parsed.berth || parsed.probe || parsed.quay || parsed.dock
        ? parsed
        : { action: "score", berth: parseBerthJson(parsed) };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", berth: parseBerthJson(parsed) };
    }
  } catch {
    const berth = parseBerthJson(text);
    if (berth.parentCwd || berth.chipCwd || berth.promisedFresh) {
      return { action: "score", berth };
    }
    return { error: "unparseable", raw: text };
  }
  const berth = parseBerthJson(text);
  return { action: "score", berth };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "cohabited") {
    return "Berth cohabited. Chip session shares the spawning session's working tree while that session is still editing it.";
  }
  if (result.verdict === "promised-fresh") {
    return "Berth promised-fresh. Tool schema/ack/UI promised a fresh worktree but none was created.";
  }
  if (result.verdict === "same-floor") {
    return "Berth same-floor. Chip cwd is the same absolute filesystem path as the spawning session.";
  }
  if (result.verdict === "branch-stolen") {
    return "Berth branch-stolen. Chip created or checked out a branch that moved the shared tree under the parent.";
  }
  if (result.verdict === "interleaved") {
    return "Berth interleaved. Chip's uncommitted files appear in the parent's git status mid-task.";
  }
  if (result.verdict === "chip-lied") {
    return "Berth chip-lied. User/model told a separate local session / fresh worktree while cwd is the parent's.";
  }
  if (result.verdict === "primary-dock") {
    return "Berth primary-dock. Started on the primary checkout / project root with no worktree.";
  }
  if (result.verdict === "cwd-ignored") {
    return "Berth cwd-ignored. cwd param set to a git repo but still no worktree.";
  }
  if (result.verdict === "phantom-tree") {
    return "Berth phantom-tree. .claude/worktrees/<name> exists but is not a real git worktree; git resolves to parent.";
  }
  return "Berth refuse. A shared berth is not a hold.";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "UserPromptSubmit",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Berth alongside. Chip session has its own real git worktree; parent tree untouched. Hold is quiet. Idle word is alongside.",
        interrupt: deny,
      },
    },
    ...result,
    sinks: sinks.events,
  };
}

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization",
  });
  res.end(json);
}

export function listen(port = 9090) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "berth",
        hook: "UserPromptSubmit",
        verbs: "alongside|cohabited|promised-fresh|same-floor|branch-stolen|interleaved|chip-lied|primary-dock|cwd-ignored|phantom-tree|off-quay",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a berth action { action, berth? }." });
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    let payload = {};
    try {
      payload = raw ? parsePayload(raw) : {};
    } catch {
      send(res, 400, { ok: false, error: "JSON body required." });
      return;
    }
    const out = await handle(payload);
    send(res, 200, out);
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(`berth hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9090);
    listen(Number.isFinite(port) ? port : 9090);
  } else {
    const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
    let payload;
    if (fileArg) {
      payload = parsePayload(readFileSync(fileArg, "utf8"));
    } else {
      payload = await readStdin();
    }
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
