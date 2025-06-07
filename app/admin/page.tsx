import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminHome() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  return (
    <main className="max-w-7xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">管理者ダッシュボード</h1>

      <div className=" grid md:grid-cols-2 gap-6">
        {/* カード：課題編集 */}
        <Link
          href="/admin/assignments"
          className="block bg-white shadow hover:shadow-md transition rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-2">課題編集</h2>
          <p className="text-gray-600">
            課題の新規追加・公開/非公開切替・編集・削除を行います。
          </p>
        </Link>

        {/* カード：進捗一覧 */}
        <Link
          href="/admin/progress"
          className="block bg-white shadow hover:shadow-md transition rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-2">進捗一覧</h2>
          <p className="text-gray-600">
            受講生 × 課題の進捗ステータスを表形式で確認します。
          </p>
        </Link>
        <Link
          href="/admin/assignment-requests"
          className="block bg-white shadow hover:shadow-md transition rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-2">休会・退会リクエスト</h2>
          <p className="text-gray-600">
            受講生からの休会・退会リクエストを確認します。
          </p>
        </Link>
        <Link
          href="/admin/assignment-requests"
          className="block bg-white shadow hover:shadow-md transition rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-2">課題公開リクエスト</h2>
          <p className="text-gray-600">
            受講生からの課題公開リクエストを確認します。
          </p>
        </Link>
      </div>
    </main>
  );
}
