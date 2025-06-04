import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import { MembershipStatus } from "@/lib/constants";

const config: NextAuthConfig = {
  providers: [
    GitHub,
    Google
  ],
  session: { strategy: "jwt", updateAge: 0 },
  callbacks: {
    /** ① JWT 生成・更新フェーズ */
    async jwt({ token, user }) {
      if (token.sub) {
        if (user) {
          // ログイン直後: DB から来た User オブジェクトに status がある
          token.status = (user as AdapterUser & { status?: MembershipStatus }).status;
        } else if (process.env.NEXT_RUNTIME === "edge") {
          // Edge Runtime では内部 API 経由で取得
          const base =
            process.env.NEXTAUTH_URL ??
            (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ??
            "http://localhost:3000";
          const res = await fetch(`${base}/api/user-status/${token.sub}`);
          if (res.ok) {
            const data = (await res.json()) as { status?: MembershipStatus };
            token.status = data.status;
          }
        } else {
          // Node.js 環境では直接 DB から取得
          const { prisma } = await import("./lib/prisma");
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
};

if (process.env.NEXT_RUNTIME !== "edge") {
  const { PrismaAdapter } = await import("@auth/prisma-adapter");
  const { prisma } = await import("./lib/prisma");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - adapter is conditionally added only in Node.js
  config.adapter = PrismaAdapter(prisma);
}

export const { handlers, auth, signIn, signOut } = NextAuth(config);
