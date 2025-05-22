import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json("Unauthorized", { status: 401 });

  const { assignmentId, status } = await req.json(); // status = "IN_PROGRESS" 等

  const updated = await prisma.assignmentProgress.upsert({
    where: { userId_assignmentId: { userId: session.user.id, assignmentId } },
    create: { userId: session.user.id, assignmentId, status },
    update: { status },
  });
  return NextResponse.json(updated);
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const assignmentId = url.searchParams.get("assignmentId")!;
  const progress = await prisma.assignmentProgress.findUnique({
    where: { userId_assignmentId: { userId: session.user.id, assignmentId } },
  });
  return NextResponse.json(progress); // null -> 未着手
}
