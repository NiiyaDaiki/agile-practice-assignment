// global.d.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // これで globalThis.prisma を PrismaClient | undefined 型として認識させる
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export { };
