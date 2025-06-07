"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SignOutButton } from "./SignOutButton";
import Logo from "@/public/logo.png";
import { useQuery } from "@tanstack/react-query";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const fetchCount = async () =>
  (await fetch("/api/requests/pending-count")).json() as Promise<{
    count: number;
  }>;

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname(); // ★ 現在のパスを取得
  const inAdmin = pathname.startsWith("/admin");

  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["pending-count"],
    queryFn: fetchCount,
    enabled: inAdmin, // 管理画面中のみ
    staleTime: 30_000, // 30 秒キャッシュ
  });

  const pendingRequestCount = data?.count ?? 0;

  if (status === "loading") {
    return (
      <header className="p-4 bg-gradient-to-r from-primary via-accent to-secondary text-white">
        <p>Loading...</p>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 p-4 bg-gradient-to-r from-primary via-accent to-secondary text-white relative shadow">
      <div className="flex justify-between items-center">
        {/* ブランド */}
        <Link href="/" className="flex items-center hover:opacity-80">
          <Image src={Logo} alt="APA Logo" width={40} height={40} />
          <span className="ml-2 font-bold text-xl">Agile Practice Assignment</span>
        </Link>

        {/* PC: メニュー＋サインインアウト, SP: ハンバーガー */}
        <div className="flex items-center">
          <nav className="hidden md:flex items-center space-x-6 mr-4">
            {inAdmin && (
              <>
                <Link
                  href="/admin/assignments"
                  className="hover:underline hover:text-gray-300"
                >
                  課題編集
                </Link>
                <Link
                  href="/admin/progress"
                  className="hover:underline hover:text-gray-300"
                >
                  進捗一覧
                </Link>
                <Link href="/admin/requests" className="relative">
                  休会・退会リクエスト
                  {pendingRequestCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-2">
                      {pendingRequestCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            {session && !inAdmin && (
              <Link
                href="/settings"
                className="hover:underline hover:text-gray-300"
              >
                設定
              </Link>
            )}
          </nav>

          <div className="hidden md:block">
            {session ? (
              <SignOutButton />
            ) : (
              <Link href="/signin" className={buttonVariants()}>
                サインイン
              </Link>
            )}
          </div>

          {/* ハンバーガー */}
          <button
            className="md:hidden p-2 transition-transform"
            onClick={() => setOpen((o) => !o)}
            aria-label="メニューを開閉"
          >
            {open ? (
              <X className="size-6 rotate-90 transition-transform" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* スマホメニュー */}
      <nav
        className={`md:hidden mt-2 flex flex-col gap-2 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {inAdmin && (
          <>
            <Link
              href="/admin/assignments"
              className="hover:underline hover:text-gray-300"
            >
              課題編集
            </Link>
            <Link
              href="/admin/progress"
              className="hover:underline hover:text-gray-300"
            >
              進捗一覧
            </Link>
            <Link href="/admin/requests" className="relative">
              休会・退会リクエスト
              {pendingRequestCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-2">
                  {pendingRequestCount}
                </span>
              )}
            </Link>
          </>
        )}
        {session && !inAdmin && (
          <Link
            href="/settings"
            className="hover:underline hover:text-gray-300"
          >
            設定
          </Link>
        )}
        <div>
          {session ? (
            <SignOutButton />
          ) : (
            <Link
              href="/signin"
              className={cn(buttonVariants(), "block text-center")}
            >
              サインイン
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
