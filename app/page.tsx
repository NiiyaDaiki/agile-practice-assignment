// app/page.tsx
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PublicAssignments from "@/components/PublicAssignments";
import PausedBanner from "@/components/PausedBanner";

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

  /* ユーザーステータス確認 */
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true },
  });

  if (user?.status === "PAUSED") {
    const pendingResume = await prisma.userRequest.findFirst({
      where: { userId: session.user.id, type: "RESUME", status: "PENDING" },
    });
    return (
      <PausedBanner userId={session.user.id} waiting={Boolean(pendingResume)} />
    ); // 休会中UI
  }

  // ログイン済みなら公開課題一覧を表示
  const list = await prisma.assignment.findMany({
    where: { isPublic: true },
    orderBy: { title: "asc" },
    select: { id: true, title: true, content: true },
  });

  // 100文字の抜粋を作成
  const assignments = list.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.content.length > 100 ? `${a.content.slice(0, 100)}…` : a.content,
  }));

  return <PublicAssignments assignments={assignments} />;
}
