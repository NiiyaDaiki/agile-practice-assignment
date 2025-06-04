import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { AdapterUser } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import { MembershipStatus } from "@/lib/constants";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Google
  ],
  session: { strategy: "jwt" },
  callbacks: {
    /** ① JWT 生成・更新フェーズ */
    async jwt({ token, user }) {
      if (token.sub) {
        if (user) {
          // ログイン直後: DB から来た User オブジェクトに status がある
          token.status = (user as AdapterUser & { status?: MembershipStatus }).status;
        } else {
          // 毎回 DB から最新 status を取得
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { status: true },
          });
          token.status = dbUser?.status as MembershipStatus;
        }
      }
      return token;
    },

    /** ② JWT → Session へコピー */
    async session({ session, token }) {
      session.user.id = token.sub!;
      if (token.status) {
        session.user.status = token.status as MembershipStatus;
      }
      return session;
    },
  },
});
