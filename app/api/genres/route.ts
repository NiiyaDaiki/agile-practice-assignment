import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/genres
 * - 全ジャンルを order 順に返す
 * - 返却形: [{ id, name }]
 */
export async function GET() {
  const genres = await prisma.genre.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return NextResponse.json(genres); // 200 OK
}
