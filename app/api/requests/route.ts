import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { RequestStatus } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");

  // status が指定され、かつ列挙値と一致する場合のみ where に含める
  const where: { status?: RequestStatus } = {};
  if (statusParam && ["PENDING", "APPROVED", "REJECTED"].includes(statusParam)) {
    where.status = statusParam as RequestStatus;
  }

  const requests = await prisma.userRequest.findMany({
    where,
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, email: true } } },
  });
  return NextResponse.json(requests);
}


export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json("Unauthorized", { status: 401 });

  const { type } = await req.json(); // "PAUSE" or "WITHDRAW"

  // 既にペンディング中なら再作成しない
  const existing = await prisma.userRequest.findFirst({
    where: { userId: session.user.id, type, status: "PENDING" },
  });
  if (existing) return NextResponse.json(existing);

  const created = await prisma.userRequest.create({
    data: { userId: session.user.id, type },
  });
  return NextResponse.json(created);
}
