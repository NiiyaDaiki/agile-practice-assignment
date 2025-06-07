import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/* GET: 受講生が見る一覧 --------------- */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const genres = await prisma.genre.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { assignments: { where: { isPublic: true } } } },
      GenreAccess: { where: { userId: session.user.id } },
      AssignmentRequest: {
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const result = genres.map((g) => ({
    id: g.id,
    name: g.name,
    isOpen: g.GenreAccess.length > 0,
    canRequest: g._count.assignments > 0,
    request: g.AssignmentRequest[0] ?? null, // {status:"PENDING"…} or null
  }));

  return NextResponse.json(result);
}

/* POST: 新規リクエスト --------------- */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const { genreId } = await req.json();

  // 公開されている課題が一つもない場合はリクエスト不可
  const publicCount = await prisma.assignment.count({
    where: { genreId, isPublic: true },
  });
  if (publicCount === 0)
    return NextResponse.json({}, { status: 400 });

  // 既にPENDINGがあるなら409
  const dup = await prisma.assignmentRequest.findFirst({
    where: { userId: session.user.id, genreId, status: { in: ["PENDING", "APPROVED"] }, },
  });
  if (dup) return NextResponse.json({}, { status: 409 });

  const created = await prisma.assignmentRequest.create({
    data: { userId: session.user.id, genreId },
  });
  return NextResponse.json(created, { status: 201 });
}
