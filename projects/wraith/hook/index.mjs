#!/usr/bin/env node
/**
 * Wraith afterimage hook. A grant that is still ON is not a hold.
 * Score the image or admit unlinked.
 *
 *   echo '{"action":"press","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9073
 *
 * Env:
 *   WRAITH_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   WRAITH_GITHUB_TOKEN   Wraith-ledger issue. Absent → demo ledger.
 *   WRAITH_LINEAR_KEY     Pruned/orphaned/severed ticket. Absent → demo row.
 *
 * NOT Gasket / Damper / Cote / Snib / Knock / Hasp / Husk / Parity /
 * Tain / Livery / leftover woodworking. Live-image unlink. Idle word
 * is unlinked, never the product name, never empty.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90373Pruned } from "./wraith.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90373Pruned());
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
  if (result.verdict === "pruned") {
    return "Wraith pruned. Updater deleted the running image under a live session. Grants stay ON.";
  }
  if (result.verdict === "ghosted") {
    return "Wraith ghosted. Grants still ON. In-app grant reports success. Reads still EPERM.";
  }
  if (result.verdict === "voided") {
    return "Wraith voided. TCC-protected path EPERM mid-session. No warning.";
  }
  if (result.verdict === "orphaned") {
    return "Wraith orphaned. Spawned successfully. Child ENOENT. Version dir was pruned.";
  }
  if (result.verdict === "severed") {
    return "Wraith severed. Remote-control still connected/green. Every new session EPERM.";
  }
  return "Wraith refuse. A grant that is still ON is not a hold.";
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
          : "Wraith unlinked. Image seated. Inode present. Idle word is unlinked.",
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

export function listen(port = 9073) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "wraith",
        hook: "UserPromptSubmit",
        verbs: "unlinked|pruned|ghosted|voided|orphaned|severed|stale|resurfaced|ejected|held",
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
    process.stderr.write(`wraith hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9073);
    listen(Number.isFinite(port) ? port : 9073);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
