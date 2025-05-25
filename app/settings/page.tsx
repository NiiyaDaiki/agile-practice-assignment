import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  MEMBERSHIP_LABEL,
  REQUEST_STATUS_LABEL,
  REQUEST_TYPE_LABEL,
} from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRequest: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!user) return <>ユーザーがいません</>;
  const lastReq = user?.userRequest[0];
  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">アカウント設定</h1>

      <p>
        現在のステータス:{" "}
        <span className="font-semibold">{MEMBERSHIP_LABEL[user.status]}</span>
      </p>

      {/* リクエストボタン (既にPENDINGならdisabled) */}
      <form
        action={async () => {
          "use server";
          await prisma.userRequest.create({
            data: { userId, type: "PAUSE" },
          });
        }}
      >
        <button
          className="px-4 py-2 bg-yellow-400 rounded mr-4 disabled:opacity-50"
          disabled={lastReq?.status === "PENDING"}
        >
          休会をリクエスト
        </button>
      </form>

      <form
        action={async () => {
          "use server";
          await prisma.userRequest.create({
            data: { userId: userId, type: "WITHDRAW" },
          });
        }}
      >
        <button
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
          disabled={lastReq?.status === "PENDING"}
        >
          退会をリクエスト
        </button>
      </form>

      {lastReq && (
        <p className="text-sm text-gray-600">
          最終リクエスト: {REQUEST_TYPE_LABEL[lastReq.type]} (
          {REQUEST_STATUS_LABEL[lastReq.status]})
        </p>
      )}
    </div>
  );
}
