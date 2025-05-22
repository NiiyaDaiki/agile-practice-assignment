import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminProgressTable from "@/components/AdminProgressTable";

export default async function AdminProgressPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  /* 課題一覧 */
  const assignments = await prisma.assignment.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "asc" },
  });

  /* 全ユーザー＋進捗 */
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      assignmentProgress: {
        select: { assignmentId: true, status: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">受講生 × 課題 進捗一覧</h1>
      <AdminProgressTable assignments={assignments} users={users} />
    </div>
  );
}
