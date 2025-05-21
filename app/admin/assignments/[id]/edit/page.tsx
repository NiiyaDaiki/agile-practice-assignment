import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AssignmentForm } from "@/components/AssignmentForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAssignmentPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/signin");

  const assignment = await prisma.assignment.findFirst({
    where: { id },
  });
  if (!assignment) redirect("/admin/assignments");

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">課題編集</h1>
      <AssignmentForm
        initial={{
          id: assignment.id,
          title: assignment.title,
          content: assignment.content,
          isPublic: assignment.isPublic,
        }}
      />
    </div>
  );
}
