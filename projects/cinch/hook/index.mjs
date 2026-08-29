#!/usr/bin/env node
/**
 * Cinch tack-room hook. A written Trusted-folders list is not a hold.
 * Score the girth or admit cinched.
 *
 *   echo '{"expected":[],"mounted":[]}' | node index.mjs
 *   node index.mjs pack.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   CINCH_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   CINCH_GITHUB_TOKEN   Cinch-ledger issue. Absent → demo ledger.
 *   CINCH_LINEAR_KEY     Omitted / delivered ticket. Absent → demo row.
 *
 * NOT Fusee / Wicket / Larder / Hasp / Sprag / Ullage / leftover woodworking.
 * Idle word is cinched, never the product name, never mount.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedOmitted } from "./cinch.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedOmitted());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedOmitted();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && (parsed.action || parsed.pack || parsed.probe || parsed.expected || parsed.mounted)) {
      return parsed.action || parsed.pack || parsed.probe ? parsed : { action: "score", pack: parsed };
    }
    if (Array.isArray(parsed)) return { action: "score", pack: { expected: parsed, session: "stdin", scored: true } };
  } catch {
    const pack = parseSessionTrace(text);
    if ((pack.expected && pack.expected.length) || pack.leafProceed || pack.shipped) {
      return { action: "score", pack };
    }
    return { error: "unparseable", raw: text };
  }
  const pack = parseSessionTrace(text);
  return { action: "score", pack };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "omitted") {
    return "Cinch omitted. Surviving leaf treated as proceed. Two sections missing. A written Trusted-folders list is not a hold.";
  }
  if (result.verdict === "delivered") {
    return "Cinch delivered. Incomplete pack presented as complete to recipients.";
  }
  if (result.verdict === "dropped") {
    return "Cinch dropped. Two or more expected folders missing this run.";
  }
  if (result.verdict === "slipped") {
    return "Cinch slipped. One trusted folder missing this run.";
  }
  if (result.verdict === "phantom") {
    return "Cinch phantom. Listed / trusted / connected but unreachable at the session mount.";
  }
  if (result.verdict === "loose") {
    return "Cinch loose. The cinch reads tight while the pack has shifted.";
  }
  return "Cinch refuse. A written Trusted-folders list is not a hold.";
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
          : "Cinch cinched. Every expected folder is mounted and reachable. Idle word is cinched.",
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
        product: "cinch",
        hook: "UserPromptSubmit",
        verbs: "cinched|slipped|dropped|phantom|omitted|partial|trusted|loose|delivered|halted",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a pack action { action, pack? }." });
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
    process.stderr.write(`cinch hook listening on http://127.0.0.1:${port}\n`);
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
