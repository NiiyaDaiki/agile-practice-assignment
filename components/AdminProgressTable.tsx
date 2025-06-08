"use client";

import {
  STATUS_INFO,
  ProgressStatus,
  GENRE_STYLE,
  DEFAULT_STYLE,
} from "@/lib/constants";

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
  const grouped = assignments.reduce<Record<string, Assignment[]>>((acc, a) => {
    (acc[a.genre] ||= []).push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([genre, list]) => {
        const style = GENRE_STYLE[genre] ?? DEFAULT_STYLE;
        return (
          <div key={genre} className="overflow-auto">
            <h2 className={`font-semibold mb-2 ${style.text}`}>{genre}</h2>
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border px-3 py-2 whitespace-nowrap text-left">
                    受講生
                  </th>
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
          </div>
        );
      })}
    </div>
  );
}
