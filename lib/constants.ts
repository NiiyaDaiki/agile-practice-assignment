export const STATUS_INFO = {
  NOT_STARTED: { label: "未着手", bg: "bg-gray-200", text: "text-gray-800" },
  IN_PROGRESS: { label: "着手中", bg: "bg-yellow-200", text: "text-yellow-900" },
  IN_REVIEW: { label: "レビュー中", bg: "bg-blue-200", text: "text-blue-900" },
  DONE: { label: "完了", bg: "bg-green-200", text: "text-green-900" },
} as const;

export type ProgressStatus = keyof typeof STATUS_INFO;


/* 会員ステータスの日本語ラベル */
export const MEMBERSHIP_LABEL = {
  ACTIVE: "受講中",
  PAUSED: "休会中",
  WITHDRAWN: "退会済み",
} as const;

/* リクエスト種別・状態の日本語ラベル */
export const REQUEST_TYPE_LABEL = {
  PAUSE: "休会",
  WITHDRAW: "退会",
  RESUME: "復帰",
} as const;

export const REQUEST_STATUS_LABEL = {
  PENDING: "未処理",
  APPROVED: "承認済み",
  REJECTED: "却下",
} as const;

export type MembershipStatus = keyof typeof MEMBERSHIP_LABEL;
export type RequestType = keyof typeof REQUEST_TYPE_LABEL;
export type RequestStatus = keyof typeof REQUEST_STATUS_LABEL;

export const GENRE_STYLE: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  データベース: {
    bg: "bg-teal-50",
    border: "border-teal-500",
    text: "text-teal-600",
  },
  アーキテクチャ: {
    bg: "bg-indigo-50",
    border: "border-indigo-500",
    text: "text-indigo-600",
  },
  バックエンド: {
    bg: "bg-amber-50",
    border: "border-amber-500",
    text: "text-amber-600",
  },
  フロントエンド: {
    bg: "bg-rose-50",
    border: "border-rose-500",
    text: "text-rose-600",
  },
  テスト: {
    bg: "bg-emerald-50",
    border: "border-emerald-500",
    text: "text-emerald-600",
  },
};

export const DEFAULT_STYLE = {
  bg: "bg-gray-50",
  border: "border-gray-400",
  text: "text-gray-600",
};