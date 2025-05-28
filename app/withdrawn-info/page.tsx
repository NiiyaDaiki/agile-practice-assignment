export default function WithdrawnInfo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded shadow space-y-4">
        <h1 className="text-2xl font-bold text-red-600">
          退会済みアカウントです
        </h1>
        <p className="text-gray-700">
          ご利用ありがとうございました。アカウントは削除されました。
        </p>
      </div>
    </div>
  );
}
