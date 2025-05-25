"use client";
import { useActionState } from "react";
import { createRequest } from "../actions";
import {
  MEMBERSHIP_LABEL,
  REQUEST_STATUS_LABEL,
  REQUEST_TYPE_LABEL,
  MembershipStatus,
  RequestType,
  RequestStatus,
} from "@/lib/constants";

type PanelProps = {
  initialMembership: MembershipStatus;
  initialLastReq?: {
    type: RequestType;
    status: RequestStatus;
  };
  userId: string;
};

export type RequestState = {
  membership: MembershipStatus;
  lastReq?: { type: RequestType; status: RequestStatus };
};

export default function SettingsPanel({
  initialMembership,
  initialLastReq,
  userId,
}: PanelProps) {
  const [state, submit, isPending] = useActionState<RequestState, FormData>(
    createRequest,
    {
      membership: initialMembership,
      lastReq: initialLastReq,
    }
  );

  const { membership, lastReq } = state;
  /* PENDING 中はボタン disable */
  const disabled = lastReq?.status === "PENDING";

  return (
    <div className="space-y-6">
      <p>
        現在のステータス:{" "}
        <span className="font-semibold">{MEMBERSHIP_LABEL[membership]}</span>
      </p>

      <form
        action={submit}
        onSubmit={(e) => {
          const submitter = (e.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement;
          const kind = submitter?.value === "PAUSE" ? "休会" : "退会";
          if (!window.confirm(`${kind}をリクエストします。よろしいですか？`)) {
            e.preventDefault();
          }
        }}
        className="flex gap-4"
      >
        <input type="hidden" name="userId" value={userId} />
        {/* 休会 */}
        <button
          name="type"
          value="PAUSE"
          className="px-4 py-2 bg-yellow-400 rounded cursor-pointer disabled:opacity-50"
          disabled={isPending || disabled}
        >
          休会をリクエスト
        </button>
        {/* 退会 */}
        <button
          name="type"
          value="WITHDRAW"
          className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer disabled:opacity-50"
          disabled={isPending || disabled}
        >
          退会をリクエスト
        </button>
      </form>

      {lastReq && (
        <p className="text-sm text-gray-600">
          最終リクエスト: {REQUEST_TYPE_LABEL[lastReq.type]}（
          {REQUEST_STATUS_LABEL[lastReq.status]}）
        </p>
      )}
    </div>
  );
}
