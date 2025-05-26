export default function WithdrawnBanner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md space-y-4">
        <p className="text-xl font-semibold text-red-600">
          退会済みアカウントです
        </p>
        <p className="text-gray-600">
          このアカウントでは学習サービスをご利用いただけません。
        </p>
      </div>
    </div>
  );
}
