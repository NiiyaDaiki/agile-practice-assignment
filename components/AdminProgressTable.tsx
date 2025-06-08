"use client";

import { useMemo, useState } from "react";
import {
  STATUS_INFO,
  GENRE_STYLE,
  DEFAULT_STYLE,
  type ProgressStatus,
} from "@/lib/constants";
import { Switch } from "@/components/ui/switch";

type Assignment = { id: string; title: string; genre: string };
type Progress = { assignmentId: string; status: ProgressStatus };
type User = {
  id: string;
  name: string | null;
  email: string;
  assignmentProgress: Progress[];
};

export default function AdminProgressTable({
  assignments,
  users,
}: {
  assignments: Assignment[];
  users: User[];
}) {
  const [byGenre, setByGenre] = useState(false);

  const grouped = useMemo(() => {
    return assignments.reduce<Record<string, Assignment[]>>((acc, a) => {
      (acc[a.genre] ||= []).push(a);
      return acc;
    }, {});
  }, [assignments]);

  const renderTable = (list: Assignment[]) => (
    <table className="min-w-full border border-gray-300 text-sm">
      <thead className="bg-gray-100 sticky top-0">
        <tr>
          <th className="border px-3 py-2 whitespace-nowrap text-left">受講生</th>
          {list.map((a) => (
            <th key={a.id} className="border px-3 py-2 whitespace-nowrap">
              {a.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((u) => {
          const map = Object.fromEntries(
            u.assignmentProgress.map((p) => [p.assignmentId, p.status])
          );
          return (
            <tr key={u.id}>
              <td className="border px-3 py-2 whitespace-nowrap font-medium">
                {u.name ?? u.email}
              </td>
              {list.map((a) => {
                const st = map[a.id] ?? "NOT_STARTED";
                const { label, bg, text } = STATUS_INFO[st];
                return (
                  <td key={a.id} className="border px-3 py-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded ${bg} ${text}`}
                    >
                      {label}
                    </span>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <span className="text-sm">ジャンル別表示</span>
        <Switch checked={byGenre} onCheckedChange={setByGenre} />
      </label>
      {byGenre ? (
        Object.entries(grouped).map(([genre, list]) => {
          const style = GENRE_STYLE[genre] ?? DEFAULT_STYLE;
          return (
            <details key={genre} className="overflow-auto border rounded">
              <summary
                className={`px-2 py-1 mb-2 cursor-pointer select-none font-semibold ${style.text}`}
              >
                {genre}
              </summary>
              {renderTable(list)}
            </details>
          );
        })
      ) : (
        <div className="overflow-auto">{renderTable(assignments)}</div>
      )}
    </div>
  );
}
