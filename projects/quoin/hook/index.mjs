#!/usr/bin/env node
/**
 * Quoin chase hook. A shifted form
 * is not a hold. Score the chase or
 * admit locked.
 *
 *   echo '{"composedBody":"C:\\\\Users","receivedBody":"C:\\Users","delimiterQuoted":true}' | node index.mjs
 *   node index.mjs quoin.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   QUOIN_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   QUOIN_GITHUB_TOKEN  Quoin-ledger issue. Absent → demo ledger.
 *   QUOIN_LINEAR_KEY    Shifted / misattributed ticket. Absent → demo row.
 *
 * NOT Scant / Sear / Grille / Assay /
 * Stencil / Gaff / leftover
 * woodworking.
 * Idle word is locked, never the
 * product name, never empty, never
 * silent / mute / idle / dead /
 * sealed.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedShifted } from "./quoin.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedShifted());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedShifted();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.quoin ||
        parsed.probe ||
        parsed.composedBody != null ||
        parsed.receivedBody != null ||
        parsed.delimiterQuoted != null ||
        parsed.traceback != null)
    ) {
      return parsed.action || parsed.quoin || parsed.probe
        ? parsed
        : { action: "score", quoin: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", quoin: { session: "stdin", scored: true } };
    }
  } catch {
    const quoin = parseSessionTrace(text);
    if (
      quoin.composedBody ||
      quoin.receivedBody ||
      quoin.delimiterQuoted ||
      quoin.traceback ||
      quoin.powershellHereString
    ) {
      return { action: "score", quoin };
    }
    return { error: "unparseable", raw: text };
  }
  const quoin = parseSessionTrace(text);
  return { action: "score", quoin };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "shifted") {
    return "Quoin shifted. One unescape pass. \\\\ collapsed to \\ inside <<'EOF'. A shifted form is not a hold.";
  }
  if (result.verdict === "collapsed") {
    return "Quoin collapsed. Double slash became single in command text. #88561.";
  }
  if (result.verdict === "misattributed") {
    return "Quoin misattributed. SyntaxError / traceback points at a line the model never wrote. Rewriting Python cannot help.";
  }
  if (result.verdict === "path-broke") {
    return "Quoin path-broke. Windows absolute path backslashes corrupted. #89392 / #85856.";
  }
  if (result.verdict === "regex-broke") {
    return "Quoin regex-broke. \\\\d / \\\\\\\\ patterns silently changed.";
  }
  return "Quoin refuse. A shifted form is not a hold.";
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
          : "Quoin locked. Quoted delimiter held. Composed === shell body. No unescape pass. Idle word is locked.",
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
        product: "quoin",
        hook: "UserPromptSubmit",
        verbs: "locked|shifted|collapsed|unescaped|misattributed|path-broke|regex-broke|double-slash|sealed-open",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a quoin action { action, quoin? }." });
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
    process.stderr.write(`quoin hook listening on http://127.0.0.1:${port}\n`);
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
