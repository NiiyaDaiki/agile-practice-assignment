import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const id = (await params).id;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { status: true },
  });
  return NextResponse.json(user);
}
