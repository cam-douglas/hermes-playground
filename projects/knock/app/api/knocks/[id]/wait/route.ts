import { NextResponse } from "next/server";
import { hookDecisionPayload } from "@/lib/core.mjs";
import { getPublicKnock, waitForDecision } from "@/lib/engine";
import type { KnockRecord } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const url = new URL(request.url);
  const timeoutMs = Math.min(25_000, Number(url.searchParams.get("timeoutMs") || 20_000));
  const knock = (await waitForDecision(id, timeoutMs)) as KnockRecord | null;
  if (!knock) return NextResponse.json({ error: "knock not found" }, { status: 404 });
  return NextResponse.json({
    knock,
    decided: knock.status !== "pending",
    ...hookDecisionPayload(knock),
  });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return GET(request, context);
}

export async function GET_STATUS(id: string) {
  return getPublicKnock(id);
}
