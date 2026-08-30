#!/usr/bin/env node
/**
 * Chatelaine housekeeper hook. A
 * nested ring is not a hold.
 * Score the chain or admit girt.
 *
 *   echo '{"accountLogoutFired":true}' | node index.mjs
 *   node index.mjs chatelaine.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   CHATELAINE_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   CHATELAINE_GITHUB_TOKEN  Chatelaine-ledger. Absent → demo ledger.
 *   CHATELAINE_LINEAR_KEY    Nested-ring ticket. Absent → demo row.
 *
 * NOT Fob / Visa / Chute /
 * leftover woodworking.
 * Idle word is girt, never the
 * product name, never empty, never
 * sheltered / hung / stamped.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseChatelaineJson, seedCut } from "./chatelaine.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedCut());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedCut();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.chatelaine ||
        parsed.probe ||
        parsed.intake ||
        parsed.chain ||
        parsed.mcpNestedInAccountItem != null ||
        parsed.accountLogoutFired != null ||
        parsed.separateMcpStore != null)
    ) {
      return parsed.action || parsed.chatelaine || parsed.probe || parsed.intake || parsed.chain
        ? parsed
        : { action: "score", chatelaine: parseChatelaineJson(parsed) };
    }
  } catch {
    const chatelaine = parseChatelaineJson(text);
    if (
      chatelaine.mcpNestedInAccountItem != null ||
      chatelaine.accountLogoutFired != null
    ) {
      return { action: "score", chatelaine };
    }
    return { error: "unparseable", raw: text };
  }
  const chatelaine = parseChatelaineJson(text);
  return { action: "score", chatelaine };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "cut") {
    return "Chatelaine cut. Logout discarded still-valid MCP grants nested inside the Anthropic credential.";
  }
  if (result.verdict === "nested") {
    return "Chatelaine nested. mcpOAuth lives inside the same Keychain item as claudeAiOauth.";
  }
  if (result.verdict === "switched") {
    return "Chatelaine switched. Per-account items have no mcpOAuth; a switch cannot reuse a valid grant.";
  }
  if (result.verdict === "spilled") {
    return "Chatelaine spilled. Every configured HTTP MCP server came back unauthenticated.";
  }
  if (result.verdict === "unexpired") {
    return "Chatelaine unexpired. Measured tokens were still valid at forced re-auth.";
  }
  if (result.verdict === "rebound") {
    return "Chatelaine rebound. Consecutive /mcp browser auths in one session.";
  }
  if (result.verdict === "tokenless") {
    return "Chatelaine tokenless. A tokenless stub blocks Keychain refresh.";
  }
  if (result.verdict === "blanked") {
    return "Chatelaine blanked. Keychain blob has accessToken/refreshToken blanked.";
  }
  if (result.verdict === "wiped") {
    return "Chatelaine wiped. Desktop update wiped claudeAiOauth from .credentials.json.";
  }
  return "Chatelaine refuse. A nested ring is not a hold.";
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
          : "Chatelaine girt. mcpOAuth lives on its own ring. Hold is quiet. Idle word is girt.",
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
        product: "chatelaine",
        hook: "UserPromptSubmit",
        verbs: "girt|nested|cut|switched|spilled|unexpired|rebound|tokenless|blanked|wiped",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a chatelaine action { action, chatelaine? }." });
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
    process.stderr.write(`chatelaine hook listening on http://127.0.0.1:${port}\n`);
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
