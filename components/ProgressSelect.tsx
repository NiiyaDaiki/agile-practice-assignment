"use client";
import { useState } from "react";

const statusLabel: Record<string, string> = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "着手中",
  IN_REVIEW: "レビュー中",
  DONE: "完了",
};

export default function ProgressSelect({
  assignmentId,
  initialStatus,
}: {
  assignmentId: string;
  initialStatus: keyof typeof statusLabel;
}) {
  const [status, setStatus] = useState(initialStatus);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as keyof typeof statusLabel;
    setStatus(newStatus); // 楽観更新
    const res = await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId, status: newStatus }),
    });
    if (!res.ok) {
      // 失敗したら元に戻す
      setStatus(initialStatus);
      alert("更新に失敗しました");
    }
  }

  return (
    <div className="space-x-2">
      <label htmlFor="progress" className="font-medium">
        進捗ステータス:
      </label>
      <select
        id="progress"
        className="border rounded p-1"
        value={status}
        onChange={handleChange}
      >
        {Object.entries(statusLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
