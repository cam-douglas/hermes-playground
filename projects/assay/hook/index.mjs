#!/usr/bin/env node
/**
 * Assay PreToolUse hook. A parsed call is not a hold.
 * Heat the envelope. Weigh delivered arguments. Name the impurity or admit intact.
 *
 *   echo '{"action":"weigh","charge":{...}}' | node index.mjs
 *   node index.mjs --listen 9070
 *
 * Env:
 *   ASSAY_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   ASSAY_GITHUB_TOKEN   Private gist assay-ledger.jsonl. Absent → demo ledger.
 *   ASSAY_LINEAR_KEY     Ghost / absorb incident. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed84405 } from "./assay.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed84405());
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
  return Boolean(result.alarm) || Boolean(result.refused && result.verdict !== "intact");
}

function denyMessage(result) {
  if (result.verdict === "ghost") {
    return "Assay ghost. Parse succeeded, but a delivered string contains an adjacent parameter's boundary tag.";
  }
  if (result.verdict === "absorb") {
    return "Assay absorb. A declared field vanished; its parameter grammar sits in a host field.";
  }
  if (result.verdict === "mix") {
    return "Assay mix. Legacy XML tool-use leaked into a JSON tool call.";
  }
  if (result.verdict === "prefix") {
    return "Assay prefix. Stray token or dropped antml: namespace on the envelope.";
  }
  if (result.verdict === "silent") {
    return "Assay silent. A required argument arrived as an empty string.";
  }
  if (result.verdict === "retry") {
    return "Assay retry. The tool call could not be parsed, and retry also failed.";
  }
  if (result.verdict === "mangled") {
    return "Assay mangled. Envelope is unparseable, truncated, or the wrong type.";
  }
  return "Assay refuse. Cupel is not intact.";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "PreToolUse",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Assay intact. Delivered arguments match the schema and the raw markup. Idle word is intact.",
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

export function listen(port = 9070) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "assay",
        hook: "PreToolUse",
        verbs: "intact|ghost|absorb|mix|prefix|silent|retry|mangled",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a charge action { action, charge? }." });
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
    process.stderr.write(`assay hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9070);
    listen(Number.isFinite(port) ? port : 9070);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
