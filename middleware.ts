import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const PUBLIC_PATHS = [
  "/favicon.ico",
  "/_next",          // Next.js assets
  "/api/auth",       // Auth.js コールバック
  "/signin",         // ログインページ
  "/paused-info",    // 休会バナー
  "/withdrawn-info", // 退会バナー
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 静的 / 公開パスは素通り
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  const session = await auth();

  // 未ログイン → /signin
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  // 休会ユーザー
  if (session.user.status === "PAUSED" && pathname !== "/paused-info") {
    return NextResponse.redirect(new URL("/paused-info", req.url));
  }
  // 退会ユーザー
  if (session.user.status === "WITHDRAWN" && pathname !== "/withdrawn-info") {
    return NextResponse.redirect(new URL("/withdrawn-info", req.url));
  }

  return NextResponse.next(); // 通常ルート
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
  // default "edge" runtime
};
