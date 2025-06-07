"use client";
import { approve, reject } from "../actions";
import type { AssignmentRequest, User, Genre } from "@prisma/client";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";

export type FullAssignmentRequest = AssignmentRequest & {
  user: Pick<User, "name" | "email">;
  genre: Pick<Genre, "name">;
};

export default function Row({ r }: { r: FullAssignmentRequest }) {
  const qc = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const onSubmit =
    (action: (fd: FormData) => Promise<void>) => (fd: FormData) => {
      startTransition(async () => {
        await action(fd);
        qc.invalidateQueries({ queryKey: ["assignment-pending-count"] });
      });
    };

  return (
    <tr className="border-b" key={r.id}>
      <td className="border px-3 py-2">{r.user.name ?? r.user.email}</td>
      <td className="border px-3 py-2">{r.genre.name}</td>
      <td className="border px-3 py-2">{r.createdAt.toLocaleString()}</td>
      <td className="border px-3 py-2">
        {isPending ? "処理中...." : r.status === "PENDING" ? (
          <span className="text-yellow-600">未処理</span>
        ) : r.status === "APPROVED" ? (
          <span className="text-green-600">承認済み</span>
        ) : (
          <span className="text-gray-500">却下</span>
        )}
      </td>
      <td className="border px-3 py-2 w-32">
        {r.status === "PENDING" && (
          <div className="flex gap-1 justify-center">
            <form action={onSubmit(approve)}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="genreId" value={r.genreId} />
              <button className="px-2 py-1 bg-green-500 text-white rounded text-xs">
                承認
              </button>
            </form>
            <form action={onSubmit(reject)}>
              <input type="hidden" name="id" value={r.id} />
              <button className="px-2 py-1 bg-gray-400 text-white rounded text-xs">
                却下
              </button>
            </form>
          </div>
        )}
      </td>
    </tr>
  );
}
