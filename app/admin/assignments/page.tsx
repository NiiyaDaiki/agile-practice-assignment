import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AssignmentsList from "@/components/AssignmentsList";

export default async function AssignmentsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // サーバーで一度だけ取得
  const list = await prisma.assignment.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      isPublic: true,
      assignmentProgress: {
        where: { userId: session.user.id },
        select: { status: true },
      },
    },
  });

  // Date → ISO 文字列に変換してクライアントへ
  const initialAssignments = list.map((a) => ({
    id: a.id,
    title: a.title,
    isPublic: a.isPublic,
  }));

  return <AssignmentsList initialAssignments={initialAssignments} />;
}
