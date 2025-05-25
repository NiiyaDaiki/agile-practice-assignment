"use server";
import { RequestState } from "@/app/settings/components/SettingPanel";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RequestSchema = z.object({
  userId: z.string().cuid(),
  type: z.enum(["PAUSE", "WITHDRAW"] as const),
});

export async function createRequest(prev: RequestState, formData: FormData) {
  const { userId, type } = RequestSchema.parse(Object.fromEntries(formData));
  const newReq = await prisma.userRequest.create({
    data: { userId, type },
  });

  /* 返り値: 直近リクエスト & 現在ステータス */
  return {
    ...prev,
    lastReq: {
      type: newReq.type,
      status: newReq.status,
    }
  };
}
