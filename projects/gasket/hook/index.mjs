#!/usr/bin/env node
/**
 * Gasket flange hook. A written project key is not a seal.
 * Score the joint or admit tight.
 *
 *   echo '{"action":"press","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9355
 *
 * Env:
 *   GASKET_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   GASKET_GITHUB_TOKEN   Gasket-ledger issue. Absent → demo ledger.
 *   GASKET_LINEAR_KEY     Dropped/blown/open ticket. Absent → demo row.
 *
 * NOT Damper / Tappet / Snib / Knock / Reed / leftover woodworking.
 * Project-scoped strictAllowlist silent discard. Idle word is tight,
 * never the product name, never empty.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90355Dropped } from "./gasket.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90355Dropped());
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({ error: "unparseable", raw });
      }
    });
    stdin.on("error", reject);
  });
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "dropped") {
    return "Gasket dropped. Project key written. Discarded at resolution. Surfaces stay silent.";
  }
  if (result.verdict === "blown") {
    return "Gasket blown. Sandbox looks on. Non-allowlisted host still reached. Fail-open.";
  }
  if (result.verdict === "nested") {
    return "Gasket nested. Parent workspace sandbox replaced by a nested project's settings.";
  }
  if (result.verdict === "open") {
    return "Gasket open. Allowlist theater. No sandbox runtime. Traffic unrestricted.";
  }
  if (result.verdict === "sheared") {
    return "Gasket sheared. Schema UNDOCUMENTED. No scope note. Runtime drops the key.";
  }
  return "Gasket refuse. A written project key is not a seal.";
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
          : "Gasket tight. Joint made. Packing compressed. Idle word is tight.",
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

export function listen(port = 9355) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "gasket",
        hook: "UserPromptSubmit",
        verbs: "tight|dropped|blown|nested|skipped|open|dry|warned|sheared|made",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a probe action { action, probe? }." });
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    let payload = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      send(res, 400, { ok: false, error: "JSON body required." });
      return;
    }
    const out = await handle(payload);
    send(res, 200, out);
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(`gasket hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9355);
    listen(Number.isFinite(port) ? port : 9355);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
