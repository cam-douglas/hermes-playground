#!/usr/bin/env node
/**
 * Fob night-clerk hook. A new login is not a hold.
 * Score the rack or admit hung.
 *
 *   echo '{"items":[]}' | node index.mjs
 *   node index.mjs rack.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   FOB_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   FOB_GITHUB_TOKEN   Fob-ledger issue. Absent → demo ledger.
 *   FOB_LINEAR_KEY     Minted / hoard / split ticket. Absent → demo row.
 *
 * NOT Visa / Snib / Chute / Wraith / Iota / Ordo / Cinch / Ullage /
 * leftover woodworking. Idle word is hung, never the product name,
 * never empty, never keychain.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedMinted } from "./fob.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedMinted());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedMinted();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action || parsed.rack || parsed.board || parsed.items || parsed.liveService)
    ) {
      return parsed.action || parsed.rack || parsed.board ? parsed : { action: "score", rack: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", rack: { items: parsed, session: "stdin", scored: true } };
    }
  } catch {
    const rack = parseSessionTrace(text);
    if ((rack.items && rack.items.length) || rack.minted || rack.loginReportedSuccess || rack.loginExpired) {
      return { action: "score", rack };
    }
    return { error: "unparseable", raw: text };
  }
  const rack = parseSessionTrace(text);
  return { action: "score", rack };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "minted") {
    return "Fob minted. A new Claude Code-credentials-<8hex> was written. A new login is not a hold.";
  }
  if (result.verdict === "hoard") {
    return "Fob hoard. Unbounded Keychain items, never garbage-collected.";
  }
  if (result.verdict === "split") {
    return "Fob split. Keychain and .credentials.json diverged. Token family later revoked.";
  }
  if (result.verdict === "false-cut") {
    return "Fob false-cut. /login reported success but credentials never persisted.";
  }
  if (result.verdict === "scope-key") {
    return "Fob scope-key. CLI vs desktop scope sets diverge so CredentialKey hashes never share.";
  }
  return "Fob refuse. A new login is not a hold.";
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
          : "Fob hung. One live service, stores agree, no stale litter. Idle word is hung.",
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
        product: "fob",
        hook: "UserPromptSubmit",
        verbs: "hung|minted|hoard|split|false-cut|scope-key",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a rack action { action, rack? }." });
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
    process.stderr.write(`fob hook listening on http://127.0.0.1:${port}\n`);
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
