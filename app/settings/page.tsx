// app/settings/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsPanel from "./components/SettingPanel";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      userRequest: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">アカウント設定</h1>
      <SettingsPanel
        initialMembership={user!.status}
        initialLastReq={
          user!.userRequest[0]
            ? {
                type: user!.userRequest[0].type,
                status: user!.userRequest[0].status,
              }
            : undefined
        }
        userId={user!.id}
      />
    </div>
  );
}
