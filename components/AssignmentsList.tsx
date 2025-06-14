"use client";

import { useState } from "react";
import Link from "next/link";
import { GENRE_STYLE, DEFAULT_STYLE } from "@/lib/constants";
import { Input } from "@/components/ui/input";

export type Assignment = {
  id: string;
  title: string;
  isPublic: boolean;
  genre: string;
};

type Props = {
  initialAssignments: Assignment[];
};

export default function AssignmentsList({ initialAssignments }: Props) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [query, setQuery] = useState("");

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/assignments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } else {
      console.error("Failed to delete", await res.text());
    }
  };

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">課題編集</h1>
        <Link
          href="/admin/assignments/new"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          課題追加
        </Link>
      </div>

      <div className="mb-4">
        <Input
          type="search"
          placeholder="タイトル検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">課題がありません</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((a) => {
            const style = GENRE_STYLE[a.genre ?? ""] ?? DEFAULT_STYLE;
            return (
              <li
                key={a.id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  {/* タイトル */}
                  <Link
                    href={`/admin/assignments/${a.id}/edit`}
                    className="font-medium"
                  >
                    {a.title}
                  </Link>
                  <span
                    className={`px-2 py-0.5 text-xs text-white rounded ${style.bg}`}
                  >
                    {a.genre}
                  </span>
                  {/* 公開ステータスバッジ */}
                  <span
                    className={
                      a.isPublic
                        ? "px-2 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded"
                        : "px-2 py-0.5 text-xs font-medium text-gray-800 bg-gray-200 rounded"
                    }
                  >
                    {a.isPublic ? "公開中" : "非公開"}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(a.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  削除
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href={`/`}
        className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        生徒側課題一覧ページへ
      </Link>
    </div>
  );
}
