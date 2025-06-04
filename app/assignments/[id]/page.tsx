// app/assignments/[id]/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProgressSelect from "@/components/ProgressSelect";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { unstable_ViewTransition as ViewTransition } from "react";
import { GENRE_STYLE, DEFAULT_STYLE } from "@/lib/constants";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ViewAssignmentPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const assignment = await prisma.assignment.findFirst({
    where: {
      id: (await params).id,
      isPublic: true,
      genre: { GenreAccess: { some: { userId: session.user.id } } },
    },
    include: { genre: true },
  });
  if (!assignment) redirect("/");

  const progress = await prisma.assignmentProgress.findUnique({
    where: {
      userId_assignmentId: {
        userId: session.user.id,
        assignmentId: assignment.id,
      },
    },
  });
  const currentStatus = progress?.status ?? "NOT_STARTED";

  const style = GENRE_STYLE[assignment.genre?.name ?? ""] ?? DEFAULT_STYLE;

  return (
    <ViewTransition name={`assignment-${assignment.id}`}>
      <article
        className={`flex flex-col max-w-2xl mx-auto p-6 space-y-4 shadow hover:shadow-md rounded-lg m-5 h-4/5
                    border-l-4 ${style.border}`}
      >
        {/* ジャンル見出し */}
        {assignment.genre && (
          <span
            className={`inline-block text-sm font-semibold mb-1 ${style.text}`}
          >
            {assignment.genre.name}
          </span>
        )}

        <h1 className="text-3xl font-bold">{assignment.title}</h1>

        <p className="text-sm text-gray-500">
          最終更新: {new Date(assignment.updatedAt).toLocaleString()}
        </p>

        {/* Markdown 本文 */}
        <div className="prose max-h-[60vh] overflow-auto rounded border border-gray-200 bg-white">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {assignment.content}
          </ReactMarkdown>
        </div>

        {/* 進捗セレクト */}
        <ProgressSelect
          assignmentId={assignment.id}
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
      </article>
    </ViewTransition>
  );
}
