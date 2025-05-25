import Row from "./Row";
import type { FullRequest } from "./Row";

export default function RequestTable({
  requests,
}: {
  requests: FullRequest[];
}) {
  return (
    <table className="min-w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-3 py-2">受講生</th>
          <th className="border px-3 py-2">種別</th>
          <th className="border px-3 py-2">申請日時</th>
          <th className="border px-3 py-2">ステータス</th>
          <th className="border px-3 py-2">操作</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => (
          <Row key={r.id} r={r} />
        ))}
      </tbody>
    </table>
  );
}
