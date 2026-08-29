#!/usr/bin/env node
/**
 * Calque folio hook. Quoted string
 * content is not a command. Score
 * the folio or admit verbatim.
 *
 *   echo '{"command":"...","tool":"PowerShell","blocked":true}' | node index.mjs
 *   node index.mjs calque.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   CALQUE_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   CALQUE_GITHUB_TOKEN  Calque-ledger issue. Absent → demo ledger.
 *   CALQUE_LINEAR_KEY    Calqued / spanish-del / commit-blocked ticket. Absent → demo row.
 *
 * NOT Visa / Fob / Snib / Knock /
 * Veto / Quoin / Sear / Gaff /
 * Grille / Spile / Fascia / Wicket /
 * Iota / leftover woodworking.
 * Idle word is verbatim, never the
 * product name, never empty, never
 * silent / mute / idle / dead /
 * sealed / fronted.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedCalqued } from "./calque.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedCalqued());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedCalqued();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.calque ||
        parsed.probe ||
        parsed.command != null ||
        parsed.tool != null ||
        parsed.messageText != null ||
        parsed.blocked != null)
    ) {
      return parsed.action || parsed.calque || parsed.probe
        ? parsed
        : { action: "score", calque: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", calque: { session: "stdin", scored: true } };
    }
  } catch {
    const calque = parseSessionTrace(text);
    if (calque.command || calque.tool || calque.messageText || calque.blocked) {
      return { action: "score", calque };
    }
    return { error: "unparseable", raw: text };
  }
  const calque = parseSessionTrace(text);
  return { action: "score", calque };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "calqued") {
    return "Calque calqued. PowerShell guard reads Spanish del inside quotes as Remove-Item. Quote-split path starts with a quote. Quoted string content is not a command.";
  }
  if (result.verdict === "spanish-del") {
    return "Calque spanish-del. Spanish del inside quotes treated as Remove-Item. Verb-side hallucination.";
  }
  if (result.verdict === "aliased") {
    return "Calque aliased. Unquoted del / Remove-Item token scanned as the deletion alias.";
  }
  if (result.verdict === "quote-blind") {
    return "Calque quote-blind. Whitespace split without respecting quotes. Extracted fragment is not the quoted path.";
  }
  if (result.verdict === "frag-quote") {
    return "Calque frag-quote. Extracted path begins with a quote. Tokenization is already wrong.";
  }
  if (result.verdict === "commit-blocked") {
    return "Calque commit-blocked. A plain git commit was denied before execution.";
  }
  if (result.verdict === "path-lie") {
    return "Calque path-lie. Block claims a protected system path that is a fabricated fragment.";
  }
  return "Calque refuse. Quoted string content is not a command.";
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
          : "Calque verbatim. Quoted string content is not scanned as commands. Hold is quiet. Idle word is verbatim.",
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
        product: "calque",
        hook: "UserPromptSubmit",
        verbs: "verbatim|calqued|aliased|quote-blind|frag-quote|commit-blocked|bash-ok|path-lie|spanish-del",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a calque action { action, calque? }." });
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
    process.stderr.write(`calque hook listening on http://127.0.0.1:${port}\n`);
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
