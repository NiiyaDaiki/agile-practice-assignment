"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ApproveRequestSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  type: z.enum(["PAUSE", "WITHDRAW", "RESUME"]),
});

export async function approve(formData: FormData) {
  const { id, type, userId } = ApproveRequestSchema.parse(
    Object.fromEntries(formData)
  );

  const newUserStatus =
    type === "PAUSE" ? "PAUSED" :
      type === "RESUME" ? "ACTIVE" :
        "WITHDRAWN";

  await prisma.$transaction([
    prisma.userRequest.update({
      where: { id },
      data: { status: "APPROVED", actedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { status: newUserStatus },
    }),
  ]);

  revalidatePath("/admin/requests");
}

const RejectRequestSchema = z.object({
  id: z.string().cuid(),
});
export async function reject(formData: FormData) {
  const { id } = RejectRequestSchema.parse(Object.fromEntries(formData));

  await prisma.userRequest.update({
    where: { id },
    data: { status: "REJECTED", actedAt: new Date() },
  });

  revalidatePath("/admin/requests");
}