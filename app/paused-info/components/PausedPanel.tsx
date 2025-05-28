"use client";
import { useActionState } from "react";
import { createResumeRequest } from "@/app/actions/userRequests";

export default function PausedPanel({
  userId,
  waiting,
}: {
  userId: string;
  waiting: boolean;
}) {
  const [state, submit, isPending] = useActionState(createResumeRequest, {
    waiting,
  });

  const disabled = state.waiting || isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md space-y-4">
        <p className="text-xl font-semibold">現在、休会中です。</p>
        {state.waiting ? (
          <p className="text-gray-600">
            復帰リクエストを承認待ちです。しばらくお待ちください。
          </p>
        ) : (
          <>
            <p className="text-gray-600">
              復帰をご希望の場合は、以下のボタンでリクエストしてください。
            </p>

            <form
              action={submit}
              onSubmit={(e) => {
                if (
                  !window.confirm("復帰をリクエストします。よろしいですか？")
                ) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="userId" value={userId} />
              <button
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                disabled={disabled}
              >
                復帰をリクエスト
              </button>
            </form>
          </>
        )}

        {isPending && <p className="text-sm text-gray-500">送信中…</p>}
      </div>
    </div>
  );
}
