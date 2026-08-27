#!/usr/bin/env node
/**
 * Parity claim-check hook. POST a claim + probes, get match | drift | unverified | fabricated.
 *
 *   echo '{"text":"Deployed and working."}' | node index.mjs
 *   node index.mjs --listen 8791
 *
 * Env:
 *   PARITY_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   PARITY_GITHUB_TOKEN   Gist / comment claim ledger. Absent → demo ledger.
 *   PARITY_LINEAR_KEY     Reality ticket on drift/fabricated. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seedClaim40861 } from "./parity.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({ ...seedClaim40861(), action: "check" });
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
  return result.verdict === "drift" || result.verdict === "fabricated";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  const session = result.claim?.session || "session";
  return {
    hook_event_name: "ClaimCheck",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "ClaimCheck",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? result.verdict === "fabricated"
            ? `Parity fabricated. Cited artifacts on ${session} do not exist. Do not treat the claim as done.`
            : `Parity drift. Claim on ${session} does not match GitHub / Vercel / functional probes.`
          : `Parity ${result.state}. ${result.state === "even" ? "Clear." : "Claim stands."} ${session}.`,
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

export function listen(port = 8791) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "parity",
        hook: "ClaimCheck",
        verbs: "even|match|drift|unverified|fabricated",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a claim check { text, claims?, probes?, action? }." });
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
    process.stderr.write(`parity hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 8791);
    listen(Number.isFinite(port) ? port : 8791);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
