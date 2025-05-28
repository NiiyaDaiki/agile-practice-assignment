// app/paused-info/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PausedPanel from "./components/PausedPanel";

export default async function PausedInfoPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const waiting = await prisma.userRequest.findFirst({
    where: {
      userId: session.user.id,
      type: "RESUME",
      status: "PENDING",
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <PausedPanel userId={session.user.id} waiting={Boolean(waiting)} />
    </div>
  );
}
