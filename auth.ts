import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
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
      if (user) {
        // ログイン直後: DB から来た User オブジェクトに status がある
        token.status = (user as any).status as MembershipStatus;
      } else if (token.sub && token.status === undefined) {
        // ページ再読込時: DB から status を取ってトークンに乗せる
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { status: true },
        });
        token.status = dbUser?.status as MembershipStatus;
        console.log(token.status)
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
