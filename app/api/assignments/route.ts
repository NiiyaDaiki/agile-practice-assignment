// app/api/assignments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"
import { z } from "zod";

const assignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
  isPublic: z.boolean().optional(),
  genreId: z.string().optional(),
});

// 作成
export async function POST(req: Request) {
  const session = await auth();;
  if (!session || !session.user || !session.user.id) return NextResponse.error();

  const data = assignmentSchema.parse(await req.json());
  const assignment = await prisma.assignment.create({
    data: {
      title: data.title,
      content: data.content,
      isPublic: data.isPublic ?? false,
      authorId: session.user.id,
      genreId: data.genreId || undefined,
    },
  });
  return NextResponse.json(assignment);
}

// 更新
export async function PUT(req: Request) {
  const session = await auth();;
  if (!session) return NextResponse.error();
  const data = assignmentSchema.parse(await req.json());
  if (!data.id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const assignment = await prisma.assignment.update({
    where: { id: data.id, },
    data: {
      title: data.title,
      content: data.content,
      isPublic: data.isPublic ?? false,
      genreId: data.genreId || undefined,
    },
  });
  return NextResponse.json(assignment);
}
