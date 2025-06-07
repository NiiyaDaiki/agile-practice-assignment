// app/page.tsx
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PublicAssignments from "@/components/PublicAssignments";
import { ProgressStatus } from "@/lib/constants";

export default async function HomePage() {
  const session = await auth();

  // 未ログインならログイン案内を出す
  if (!session?.user?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-lg mb-4">
            このページを表示するにはログインが必要です。
          </p>
          <Link href="/signin">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              ログインページへ
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ログイン済みなら公開課題一覧を表示
  const list = await prisma.assignment.findMany({
    where: {
      isPublic: true,
      genre: { GenreAccess: { some: { userId: session.user.id } } },
    },
    include: {
      genre: true,
      assignmentProgress: {
        where: { userId: session.user.id },
        select: { status: true },
      },
    },
    orderBy: [{ genre: { order: "asc" } }, { createdAt: "asc" }],
  });

  // 100文字の抜粋を作成
  const assignments = list.map((a) => ({
    id: a.id,
    title: a.title,
    genre: a.genre?.name ?? "未分類",
    excerpt: a.content.length > 100 ? `${a.content.slice(0, 100)}…` : a.content,
    status: a.assignmentProgress[0]?.status ?? "NOT_STARTED",
  }));

  return <PublicAssignments assignments={assignments} />;
}
