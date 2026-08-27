import { NextResponse } from "next/server";
import { decideKnock } from "@/lib/engine";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { decision?: string; actor?: string };
  const result = await decideKnock(id, body.decision || "deny", body.actor || "inbox");
  if (!result.ok) {
    return NextResponse.json({ error: result.error, knock: result.knock }, { status: result.status });
  }
  return NextResponse.json(result);
}
