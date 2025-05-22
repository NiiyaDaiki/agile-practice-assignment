// lib/constants.ts
export const STATUS_INFO = {
  NOT_STARTED: { label: "未着手", bg: "bg-gray-200", text: "text-gray-800" },
  IN_PROGRESS: { label: "着手中", bg: "bg-yellow-200", text: "text-yellow-900" },
  IN_REVIEW: { label: "レビュー中", bg: "bg-blue-200", text: "text-blue-900" },
  DONE: { label: "完了", bg: "bg-green-200", text: "text-green-900" },
} as const;

export type ProgressStatus = keyof typeof STATUS_INFO;
