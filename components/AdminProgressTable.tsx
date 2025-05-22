// components/AdminProgressTable.tsx
"use client";

import { STATUS_LABEL } from "@/lib/constants";

type Assignment = { id: string; title: string };
type User = {
  id: string;
  name: string | null;
  email: string;
  assignmentProgress: {
    assignmentId: string;
    status: keyof typeof STATUS_LABEL;
  }[];
};

export default function AdminProgressTable({
  assignments,
  users,
}: {
  assignments: Assignment[];
  users: User[];
}) {
  /* ヘッダー行: 課題タイトル */
  return (
    <div className="overflow-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 whitespace-nowrap">受講生</th>
            {assignments.map((a) => (
              <th key={a.id} className="border px-2 py-1 whitespace-nowrap">
                {a.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            /* 各課題のステータスを辞書化 */
            const map = Object.fromEntries(
              u.assignmentProgress.map((p) => [p.assignmentId, p.status])
            );
            return (
              <tr key={u.id}>
                <td className="border px-2 py-1 whitespace-nowrap font-medium">
                  {u.name ?? u.email}
                </td>
                {assignments.map((a) => {
                  const st = map[a.id] ?? "NOT_STARTED";
                  return (
                    <td key={a.id} className="border px-2 py-1 text-center">
                      {STATUS_LABEL[st]}
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
}
