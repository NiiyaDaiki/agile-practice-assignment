"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ResumeSchema = z.object({ userId: z.string().cuid() });

export async function requestResume(
  _prev: { waiting: boolean },
  formData: FormData
) {
  const { userId } = ResumeSchema.parse(Object.fromEntries(formData));

  const exists = await prisma.userRequest.findFirst({
    where: { userId, type: "RESUME", status: "PENDING" },
  });
  if (!exists) {
    await prisma.userRequest.create({ data: { userId, type: "RESUME" } });
  }

  return { waiting: true };
}
