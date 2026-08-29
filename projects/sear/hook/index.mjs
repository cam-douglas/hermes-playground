#!/usr/bin/env node
/**
 * Sear bench hook. A fallen sear is
 * not a hold. Score the bench or
 * admit caught.
 *
 *   echo '{"setEPresent":true,"wrapperEvalNonFinalAnd":true}' | node index.mjs
 *   node index.mjs sear.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   SEAR_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   SEAR_GITHUB_TOKEN   Sear-ledger issue. Absent → demo ledger.
 *   SEAR_LINEAR_KEY     Wiped / phantom-ok / inert ticket. Absent → demo row.
 *
 * NOT Spile / Grille / Scant /
 * Sounder / Leat / Clew / Cubby /
 * Bollard / leftover woodworking.
 * Idle word is caught, never the
 * product name, never empty, never
 * silent / mute / idle / dead.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedInert } from "./sear.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedInert());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedInert();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.sear ||
        parsed.probe ||
        parsed.setEPresent != null ||
        parsed.wrapperEvalNonFinalAnd != null ||
        parsed.falseThenEchoSurvived != null ||
        parsed.wipeAfterFailedCopy != null)
    ) {
      return parsed.action || parsed.sear || parsed.probe
        ? parsed
        : { action: "score", sear: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", sear: { session: "stdin", scored: true } };
    }
  } catch {
    const sear = parseSessionTrace(text);
    if (
      sear.setEPresent ||
      sear.wrapperEvalNonFinalAnd ||
      sear.falseThenEchoSurvived ||
      sear.wipeAfterFailedCopy ||
      sear.freshBashEc
    ) {
      return { action: "score", sear };
    }
    return { error: "unparseable", raw: text };
  }
  const sear = parseSessionTrace(text);
  return { action: "score", sear };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "inert") {
    return "Sear inert. set -e present but structurally suppressed. eval is a non-final && list member. A fallen sear is not a hold.";
  }
  if (result.verdict === "survived") {
    return "Sear survived. Execution continued past a failing line. echo survived after false. #90611 repro.";
  }
  if (result.verdict === "nonfinal") {
    return "Sear nonfinal. User command eval is a non-final && member. Wrapper still runs pwd -P after eval.";
  }
  if (result.verdict === "phantom-ok") {
    return "Sear phantom-ok. Tool/report exit 0 despite mid-script failure. Failure invisible to the model.";
  }
  if (result.verdict === "continued") {
    return "Sear continued. Script ran lines after a failed command. set -e did not abort.";
  }
  if (result.verdict === "wiped") {
    return "Sear wiped. Destructive cleanup ran after earlier fail. cp failed then rm -rf sources. #90611 incident.";
  }
  if (result.verdict === "suppressed") {
    return "Sear suppressed. POSIX/bash documented errexit suppression in &&/|| list context, including subshells.";
  }
  return "Sear refuse. A fallen sear is not a hold.";
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
          : "Sear caught. set -e would abort. Fresh bash -ec or final-member context. Wrapper does not suppress. Idle word is caught.",
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
        product: "sear",
        hook: "UserPromptSubmit",
        verbs: "caught|inert|survived|nonfinal|phantom-ok|continued|wiped|chained|freshbash|suppressed",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a sear action { action, sear? }." });
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
    process.stderr.write(`sear hook listening on http://127.0.0.1:${port}\n`);
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
