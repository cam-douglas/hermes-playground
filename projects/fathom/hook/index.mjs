#!/usr/bin/env node
/**
 * Fathom sounding hook. Pin standing rules, bind after compact, score the draft.
 *
 *   echo '{"action":"score","draft":"..."}' | node index.mjs
 *   node index.mjs --listen 8793
 *
 * Env:
 *   FATHOM_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   FATHOM_GITHUB_TOKEN   Private gist fathom-sounding.jsonl. Absent → demo ledger.
 *   FATHOM_LINEAR_KEY     Ack ticket on lost/ack/drift. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed89733 } from "./fathom.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed89733());
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

function hookEventName(action) {
  if (action === "spawn") return "SubagentStart";
  if (action === "compact" || action === "bind") return "PostCompact";
  return "Stop";
}

function shouldDeny(result) {
  return result.verdict === "lost" || result.verdict === "ack" || result.verdict === "drift";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  const hook = hookEventName(result.action);
  return {
    hook_event_name: hook,
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: hook,
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? result.verdict === "ack"
            ? "Fathom ack. The rule was acknowledged and the mechanical check failed."
            : result.verdict === "lost"
              ? "Fathom lost. Standing rules dropped after compact or spawn without inheritance."
              : "Fathom drift. The rule was bound and the draft still failed."
          : result.verdict === "bound"
            ? "Fathom bound. Draft holds against every pin."
            : "Fathom still. No pins on the sounding.",
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

export function listen(port = 8793) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "fathom",
        hook: "Stop|PostCompact|SubagentStart",
        verbs: "still|bound|drift|lost|ack",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a sounding { action, draft, board? }." });
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
    process.stderr.write(`fathom hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 8793);
    listen(Number.isFinite(port) ? port : 8793);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
