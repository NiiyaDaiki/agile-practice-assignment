"use client";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";
import {
  GENRE_STYLE,
  DEFAULT_STYLE,
  STATUS_INFO,
  ProgressStatus,
} from "@/lib/constants";
import { CheckCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type PublicAssignment = {
  id: string;
  title: string;
  genre: string;
  excerpt: string;
  status: ProgressStatus;
};

interface Props {
  assignments: PublicAssignment[];
}

type GenreInfo = {
  id: string;
  name: string;
  isOpen: boolean; // 公開済みか
  canRequest: boolean;
  request: { status: "PENDING" } | null;
};

export default function PublicAssignments({ assignments }: Props) {
  const qc = useQueryClient();
  const { data: genreInfo } = useQuery<GenreInfo[]>({
    queryKey: ["genre-requests"],
    queryFn: () => fetch("/api/genre-requests").then((r) => r.json()),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (genreId: string) =>
      fetch("/api/genre-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genreId }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["genre-requests"] }),
  });

  /* ---------- ジャンルごとにグループ化 ---------- */
  const grouped = assignments.reduce<Record<string, PublicAssignment[]>>(
    (acc, a) => {
      (acc[a.genre] ||= []).push(a);
      return acc;
    },
    {}
  );

  return (
    <section className="mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-bold text-center mb-10">課題一覧</h1>

      {/* データが無い場合だけメッセージ */}
      {assignments.length === 0 ? (
        <p className="text-center text-gray-500">
          現在、公開中の課題はありません。
        </p>
      ) : (
        /* ---------- 各ジャンル ---------- */
        Object.entries(grouped).map(([genre, list]) => {
          const style = GENRE_STYLE[genre] ?? DEFAULT_STYLE;
          return (
            <div key={genre} className="mb-12">
              <h2 className={`text-2xl font-semibold mb-4 ${style.text}`}>
                {genre}
              </h2>

              {/* 横スクロールコンテナ */}
              <div className="flex gap-4 overflow-x-auto scroll-smooth pb-2">
                {list.map((a) => (
                  <ViewTransition
                    key={`assignment-${a.id}`}
                    name={`assignment-${a.id}`}
                  >
                    <Link
                      href={`/assignments/${a.id}`}
                      className={`relative w-72 shadow hover:shadow-md p-6 rounded-lg shrink-0 border-l-4  ${style.border}`}
                    >
                      <span
                        className={`absolute top-1 right-1 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
                          STATUS_INFO[a.status].bg
                        } ${STATUS_INFO[a.status].text}`}
                      >
                        {a.status === "DONE" && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        {STATUS_INFO[a.status].label}
                      </span>
                      <h3 className="text-xl font-medium mb-2 truncate">
                        {a.title}
                      </h3>
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {a.excerpt}
                      </p>
                    </Link>
                  </ViewTransition>
                ))}
              </div>
            </div>
          );
        })
      )}
      {genreInfo?.map((g) =>
        g.canRequest && !g.isOpen ? (
          <div key={g.id} className="my-8 flex items-center gap-4">
            <span className="text-lg font-medium">{g.name}</span>
            {g.request?.status === "PENDING" ? (
              <span className="text-sm text-yellow-600">承認待ち</span>
            ) : (
              <button
                onClick={() => mutate(g.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                disabled={isPending}
              >
                公開をリクエスト
              </button>
            )}
          </div>
        ) : null
      )}
    </section>
  );
}
