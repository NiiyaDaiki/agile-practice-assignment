"use client";
import { approve, reject } from "../../actions";
import { REQUEST_STATUS_LABEL, REQUEST_TYPE_LABEL } from "@/lib/constants";
import type { UserRequest, User } from "@prisma/client";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";

export type FullRequest = UserRequest & { user: Pick<User, "name" | "email"> };

export default function Row({ r }: { r: FullRequest }) {
  const qc = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const onSubmit =
    (action: (fd: FormData) => Promise<void>) => (fd: FormData) => {
      startTransition(async () => {
        await action(fd); // Server Action
        qc.invalidateQueries({ queryKey: ["pending-count"] }); // バッジ再フェッチ
      });
    };
  return (
    <tr key={r.id}>
      <td className="border px-3 py-2">{r.user.name ?? r.user.email}</td>
      <td className="border px-3 py-2">{REQUEST_TYPE_LABEL[r.type]}</td>
      <td className="border px-3 py-2">{r.createdAt.toLocaleString()}</td>
      <td className="border px-3 py-2">
        {isPending ? "処理中...." : REQUEST_STATUS_LABEL[r.status]}
      </td>
      <td className="border px-3 py-2">
        {r.status === "PENDING" && (
          <div className="flex gap-1 justify-evenly">
            <form action={onSubmit(approve)}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="type" value={r.type} />
              <input type="hidden" name="userId" value={r.userId} />
              <button
                disabled={isPending}
                className="btn-approve cursor-pointer"
              >
                承認
              </button>
            </form>
            <form action={onSubmit(reject)}>
              <input type="hidden" name="id" value={r.id} />
              <button
                disabled={isPending}
                className="btn-reject cursor-pointer"
              >
                却下
              </button>
            </form>
          </div>
        )}
      </td>
    </tr>
  );
}
