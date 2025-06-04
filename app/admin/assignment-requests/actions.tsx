"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/* 承認 */
export async function approve(formData: FormData) {
  const id = formData.get("id") as string;
  const genreId = formData.get("genreId") as string;

  const request = await prisma.assignmentRequest.update({
    where: { id },
    data: { status: "APPROVED", actedAt: new Date() },
  });

  await prisma.genreAccess.upsert({
    where: { userId_genreId: { userId: request.userId, genreId } },
    create: { userId: request.userId, genreId },
    update: {},
  });

  revalidatePath("/admin/assignment-requests");
}

/* 却下 */
export async function reject(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.assignmentRequest.update({
    where: { id },
    data: { status: "REJECTED", actedAt: new Date() },
  });
  revalidatePath("/admin/assignment-requests");
}
