import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { status } = await req.json(); // "APPROVED" | "REJECTED"
  if (!["APPROVED", "REJECTED"].includes(status))
    return NextResponse.json("Invalid", { status: 400 });

  const request = await prisma.userRequest.update({
    where: { id: (await (params)).id },
    data: {
      status,
      actedAt: new Date(),
      // actedBy: <管理者ID> (ロール実装時)
    },
    include: { user: true },
  });

  /* カスケード更新 */
  if (status === "APPROVED") {
    const newStatus = request.type === "PAUSE" ? "PAUSED" : "WITHDRAWN";
    await prisma.user.update({
      where: { id: request.userId },
      data: { status: newStatus },
    });
  }

  return NextResponse.json(request);
}
