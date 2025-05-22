// app/assignments/[id]/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProgressSelect from "@/components/ProgressSelect";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ViewAssignmentPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const assignment = await prisma.assignment.findFirst({
    where: { id: (await params).id },
  });
  if (!assignment) {
    redirect("/admin/assignments");
  }

  const progress = await prisma.assignmentProgress.findUnique({
    where: {
      userId_assignmentId: {
        userId: session.user.id,
        assignmentId: (await params).id,
      },
    },
  });
  const currentStatus = progress?.status ?? "NOT_STARTED";

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">{assignment.title}</h1>
      <p className="text-sm text-gray-500">
        最終更新: {new Date(assignment.updatedAt).toLocaleString()}
      </p>
      <div className="prose">
        <p>{assignment.content}</p>
      </div>
      <p>
        ステータス:{" "}
        <span
          className={
            assignment.isPublic
              ? "px-2 py-1 text-white bg-green-500 rounded"
              : "px-2 py-1 text-white bg-gray-500 rounded"
          }
        >
          {assignment.isPublic ? "公開中" : "非公開"}
        </span>
      </p>
      <ProgressSelect
        assignmentId={(await params).id}
        initialStatus={currentStatus}
      />
      <div className="flex space-x-4">
        <Link
          href="/"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          一覧へ戻る
        </Link>
      </div>
    </div>
  );
}
