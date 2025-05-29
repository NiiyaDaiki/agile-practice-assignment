import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";
import { GENRE_STYLE, DEFAULT_STYLE } from "@/lib/constants";

export type PublicAssignment = {
  id: string;
  title: string;
  genre: string;
  excerpt: string;
};

interface Props {
  assignments: PublicAssignment[];
}

export default function PublicAssignments({ assignments }: Props) {
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
                      className={`w-72 shadow hover:shadow-md p-6 rounded-lg shrink-0 border-l-4  ${style.border}`}
                    >
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
    </section>
  );
}
