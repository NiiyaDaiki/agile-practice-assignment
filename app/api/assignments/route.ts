// app/api/assignments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"
import { z } from "zod";

const assignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  content: z.string().min(1),
  isPublic: z.boolean().optional(),
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
      authorId: session.user.id
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
    where: { id: data.id, authorId: session?.user?.id, },
    data: {
      title: data.title,
      content: data.content,
      isPublic: data.isPublic ?? false,
    },
  });
  return NextResponse.json(assignment);
}

// // 削除
// export async function DELETE(req: Request) {
//   const session = await auth();;
//   if (!session) return NextResponse.error();
//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get("id");
//   if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
//   await prisma.assignment.delete({ where: { id, authorId: session?.user?.id, } });
//   return NextResponse.json({ ok: true });
// }

// // 取得 (ユーザーのリスト)
// export async function GET(req: Request) {
//   const session = await auth();;
//   if (!session) return NextResponse.error();
//   const assignments = await prisma.assignment.findMany({
//     where: { authorId: session?.user?.id, },
//     orderBy: { createdAt: "desc" },
//   });
//   return NextResponse.json(assignments);
// }