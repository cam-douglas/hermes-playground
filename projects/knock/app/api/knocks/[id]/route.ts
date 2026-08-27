import { NextResponse } from "next/server";
import { getPublicKnock } from "@/lib/engine";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const knock = await getPublicKnock(id);
  if (!knock) return NextResponse.json({ error: "knock not found" }, { status: 404 });
  return NextResponse.json({ knock });
}
