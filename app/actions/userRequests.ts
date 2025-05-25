"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ResumeSchema = z.object({
  userId: z.string().cuid(),
});

export async function createResumeRequest(_prev: { waiting: boolean }, formData: FormData) {
  const { userId } = ResumeSchema.parse(Object.fromEntries(formData));

  // 既にペンディング中なら再発行しない
  const exists = await prisma.userRequest.findFirst({
    where: { userId, type: "RESUME", status: "PENDING" },
  });
  if (!exists) {
    await prisma.userRequest.create({ data: { userId, type: "RESUME" } });
  }

  return { waiting: true };
}
