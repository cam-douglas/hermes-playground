#!/usr/bin/env node
/**
 * Carrel reading-room hook. A borrowed
 * carrel is not a hold. Score the
 * reading room or admit seated.
 *
 *   echo '{"sessionCwd":"..."}' | node index.mjs
 *   node index.mjs carrel.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   CARREL_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   CARREL_GITHUB_TOKEN  Carrel-ledger issue. Absent → demo ledger.
 *   CARREL_LINEAR_KEY    Borrowed / misfiled / sibling-served / contended ticket. Absent → demo row.
 *
 * NOT Wicket / Fascia / Hasp / Iota /
 * Cinch / Cubby / Byline / leftover
 * woodworking.
 * Idle word is seated, never the
 * product name, never empty, never
 * silent / mute / idle / credited.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseCarrelJson, seedBorrowed } from "./carrel.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedBorrowed());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedBorrowed();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.carrel ||
        parsed.probe ||
        parsed.room ||
        parsed.sessionCwd != null ||
        parsed.callerCwd != null ||
        parsed.preview_start != null ||
        parsed.launchJsonPathUsed != null)
    ) {
      return parsed.action || parsed.carrel || parsed.probe || parsed.room
        ? parsed
        : { action: "score", carrel: parseCarrelJson(parsed) };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", carrel: parseCarrelJson(parsed) };
    }
  } catch {
    const carrel = parseCarrelJson(text);
    if (carrel.requestedName || carrel.sessionCwd || carrel.callerCwd) {
      return { action: "score", carrel };
    }
    return { error: "unparseable", raw: text };
  }
  const carrel = parseCarrelJson(text);
  return { action: "score", carrel };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "borrowed") {
    return "Carrel borrowed. preview_start resolved launch.json from the session cwd, not the calling agent's.";
  }
  if (result.verdict === "misfiled") {
    return "Carrel misfiled. Name matched against orchestrator configurations; lane name missing.";
  }
  if (result.verdict === "contended") {
    return "Carrel contended. N lanes writing one shared launch.json.";
  }
  if (result.verdict === "overwritten") {
    return "Carrel overwritten. Last-writer-wins on the communal catalog, no error.";
  }
  if (result.verdict === "sibling-served") {
    return "Carrel sibling-served. Preview is serving a sibling worktree under this lane's port.";
  }
  if (result.verdict === "lane-blind") {
    return "Carrel lane-blind. Caller cwd ignored for launch.json discovery.";
  }
  if (result.verdict === "nested-miss") {
    return "Carrel nested-miss. File exists in nested .claude/worktrees/<name>/ but lookup failed.";
  }
  if (result.verdict === "main-spawn") {
    return "Carrel main-spawn. Spawn cwd is the main repo, not the worktree.";
  }
  return "Carrel refuse. A borrowed carrel is not a hold.";
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
          : "Carrel seated. preview_start resolved launch.json from the calling agent's own worktree. Hold is quiet. Idle word is seated.",
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
        product: "carrel",
        hook: "UserPromptSubmit",
        verbs: "seated|borrowed|misfiled|contended|overwritten|sibling-served|lane-blind|nested-miss|main-spawn|fallback-ok|off-shelf",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a carrel action { action, carrel? }." });
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
    process.stderr.write(`carrel hook listening on http://127.0.0.1:${port}\n`);
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
