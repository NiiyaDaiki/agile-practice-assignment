import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AssignmentForm } from "@/components/AssignmentForm";

export default async function NewAssignmentPage() {
  const session = await auth();
  if (!session) redirect("/signin");

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">課題追加</h1>
      <AssignmentForm />
    </div>
  );
}
