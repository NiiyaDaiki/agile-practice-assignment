import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/* GET: 受講生が見る一覧 --------------- */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const genres: {
    id: string;
    name: string;
    _count: { assignments: number };
    GenreAccess: unknown[];
    AssignmentRequest: { status: string }[];
  }[] = await prisma.genre.findMany({
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
    isOpen: g._count.assignments > 0 && g.GenreAccess.length > 0,
    request: g.AssignmentRequest[0] ?? null, // {status:"PENDING"…} or null
  }));

  return NextResponse.json(result);
}

/* POST: 新規リクエスト --------------- */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const { genreId } = await req.json();
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
