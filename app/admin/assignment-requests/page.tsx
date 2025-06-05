import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { approve, reject } from "./actions";

export default async function AdminAssignmentRequestsPage() {
  /* 認証チェック（簡易） */
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");
  // 本番では role === "ADMIN" などチェック推奨

  /* 一覧取得 */
  const requests = await prisma.assignmentRequest.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { name: true, email: true } },
      genre: true,
    },
  });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-6">新しい課題公開リクエスト</h1>

      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">受講生</th>
            <th className="border px-3 py-2">ジャンル</th>
            <th className="border px-3 py-2 whitespace-nowrap">申請日時</th>
            <th className="border px-3 py-2">ステータス</th>
            <th className="border px-3 py-2 w-32">操作</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-b">
              {/* 受講生 */}
              <td className="border px-3 py-2">
                {r.user.name ?? r.user.email}
              </td>

              {/* ジャンル */}
              <td className="border px-3 py-2">{r.genre.name}</td>

              {/* 申請日時 */}
              <td className="border px-3 py-2">
                {r.createdAt.toLocaleString()}
              </td>

              {/* ステータス */}
              <td className="border px-3 py-2">
                {
                  {
                    PENDING: <span className="text-yellow-600">未処理</span>,
                    APPROVED: <span className="text-green-600">承認済み</span>,
                    REJECTED: <span className="text-gray-500">却下</span>,
                  }[r.status]
                }
              </td>

              {/* 操作ボタン */}
              <td className="border px-3 py-2">
                {r.status === "PENDING" && (
                  <div className="flex gap-1 justify-center">
                    <form action={approve}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="genreId" value={r.genreId} />
                      <button className="px-2 py-1 bg-green-500 text-white rounded text-xs">
                        承認
                      </button>
                    </form>

                    <form action={reject}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="px-2 py-1 bg-gray-400 text-white rounded text-xs">
                        却下
                      </button>
                    </form>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
