import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await prisma.assignmentRequest.count({ where: { status: "PENDING" } });
  return NextResponse.json({ count }, { headers: { "cache-control": "no-store" } });
}
