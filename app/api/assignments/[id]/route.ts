import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

// ■ GET /api/assignments/:id
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.error();
  const assignment = await prisma.assignment.findFirst({
    where: { id: params.id, authorId: session.user.id },
  });
  if (!assignment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(assignment);
}

// ■ DELETE /api/assignments/:id
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.error();
  await prisma.assignment.deleteMany({
    where: { id: params.id, authorId: session.user.id },
  });
  return NextResponse.json({ id: params.id });
}
