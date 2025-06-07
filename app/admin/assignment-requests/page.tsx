import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { approve, reject } from "./actions";
import Row, { FullAssignmentRequest } from "./components/Row";

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
      genre: { select: { name: true } },
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
            <Row key={r.id} r={r as FullAssignmentRequest} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
