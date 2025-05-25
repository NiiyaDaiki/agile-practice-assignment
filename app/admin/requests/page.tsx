import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { REQUEST_STATUS_LABEL, REQUEST_TYPE_LABEL } from "@/lib/constants";

export default async function AdminRequestsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const list = await prisma.userRequest.findMany({
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">休会・退会リクエスト</h1>
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">受講生</th>
            <th className="border px-3 py-2">種別</th>
            <th className="border px-3 py-2">申請日時</th>
            <th className="border px-3 py-2">ステータス</th>
            <th className="border px-3 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.id}>
              <td className="border px-3 py-2">
                {r.user.name ?? r.user.email}
              </td>
              <td className="border px-3 py-2">{REQUEST_TYPE_LABEL[r.type]}</td>
              <td className="border px-3 py-2">
                {r.createdAt.toLocaleString()}
              </td>
              <td className="border px-3 py-2">
                {REQUEST_STATUS_LABEL[r.status]}
              </td>
              <td className=" border px-3 py-2 space-x-2">
                <div className="flex gap-1 justify-evenly">
                  {r.status === "PENDING" && (
                    <>
                      <form
                        action={async () => {
                          "use server";
                          await prisma.userRequest.update({
                            where: { id: r.id },
                            data: {
                              status: "APPROVED",
                              actedAt: new Date(),
                            },
                          });
                          // User.status も更新
                          await prisma.user.update({
                            where: { id: r.userId },
                            data: {
                              status:
                                r.type === "PAUSE" ? "PAUSED" : "WITHDRAWN",
                            },
                          });
                        }}
                      >
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                          type="submit"
                        >
                          承認
                        </button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await prisma.userRequest.update({
                            where: { id: r.id },
                            data: { status: "REJECTED", actedAt: new Date() },
                          });
                        }}
                      >
                        <button
                          className="px-2 py-1 bg-gray-400 text-white rounded text-xs"
                          type="submit"
                        >
                          却下
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
