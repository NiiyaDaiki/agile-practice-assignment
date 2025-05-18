// app/assignments/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AssignmentsList, { Assignment } from "@/components/AssignmentsList";

export default async function AssignmentsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // サーバーで一度だけ取得
  const list = await prisma.assignment.findMany({
    where: { authorId: session.user.id },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      isPublic: true,
    },
  });

  // Date → ISO 文字列に変換してクライアントへ
  const initialAssignments: Assignment[] = list.map((a) => ({
    id: a.id,
    title: a.title,
    createdAt: a.createdAt.toISOString(),
    isPublic: a.isPublic,
  }));

  return <AssignmentsList initialAssignments={initialAssignments} />;
}
