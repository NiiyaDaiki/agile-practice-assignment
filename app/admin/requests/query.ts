import { prisma } from "@/lib/prisma";

export async function fetchRequests() {
  return prisma.userRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

}
