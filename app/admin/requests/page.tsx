import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchRequests } from "./query";
import RequestTable from "./components/table/RequestTable";

export default async function AdminRequestsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const requests = await fetchRequests();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">休会・退会リクエスト</h1>
      <RequestTable requests={requests} />
    </div>
  );
}
