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

const fetchCount = async () =>
  (await fetch("/api/requests/pending-count")).json() as Promise<{
    count: number;
  }>;

const fetchAssignmentCount = async () =>
  (await fetch("/api/assignment-requests/pending-count")).json() as Promise<{
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

  const { data: assignmentData } = useQuery({
    queryKey: ["assignment-pending-count"],
    queryFn: fetchAssignmentCount,
    enabled: inAdmin,
    staleTime: 30_000,
  });

  const pendingRequestCount = data?.count ?? 0;
  const pendingAssignmentRequestCount = assignmentData?.count ?? 0;

  if (status === "loading") {
    return (
      <header className="p-4 bg-black text-white">
        <p>Loading...</p>
      </header>
    );
  }

  return (
    <header className="p-4 bg-black text-white relative">
      <div className="flex justify-between items-center">
        {/* ブランド */}
        <Link href="/" className="flex items-center hover:opacity-80">
          <Image src={Logo} alt="APA Logo" width={40} height={40} />
          <span className="ml-2 font-bold text-xl">
            Agile Practice Assignment
          </span>
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
                <Link href="/admin/assignment-requests" className="relative">
                  課題公開リクエスト
                  {pendingAssignmentRequestCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-2">
                      {pendingAssignmentRequestCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            {session && !inAdmin && (
              <div className="space-x-6">
                <Link href="/" className="hover:underline hover:text-gray-300">
                  課題一覧
                </Link>
                <Link
                  href="/settings"
                  className="hover:underline hover:text-gray-300"
                >
                  設定
                </Link>
              </div>
            )}
          </nav>

          <div className="hidden md:block">
            {session ? (
              <SignOutButton />
            ) : (
              <Link
                href="/signin"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                サインイン
              </Link>
            )}
          </div>

          {/* ハンバーガー */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="メニューを開閉"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* スマホメニュー */}
      <div
        className={`md:hidden fixed inset-0 bg-black/85 z-40  flex flex-col items-center p-6 gap-4 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-6 items-center text-white mt-12 text-2xl">
          {inAdmin && (
            <>
              <Link
                href="/admin/assignments"
                className="hover:underline hover:text-gray-300"
                onClick={() => setOpen(false)}
              >
                課題編集
              </Link>
              <Link
                href="/admin/progress"
                className="hover:underline hover:text-gray-300"
                onClick={() => setOpen(false)}
              >
                進捗一覧
              </Link>
              <Link
                href="/admin/requests"
                className="relative"
                onClick={() => setOpen(false)}
              >
                休会・退会リクエスト
                {pendingRequestCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-2">
                    {pendingRequestCount}
                  </span>
                )}
              </Link>
              <Link
                href="/admin/assignment-requests"
                className="relative"
                onClick={() => setOpen(false)}
              >
                課題公開リクエスト
                {pendingAssignmentRequestCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-2">
                    {pendingAssignmentRequestCount}
                  </span>
                )}
              </Link>
            </>
          )}
          {session && !inAdmin && (
            <>
              <Link
                href="/"
                className="hover:underline hover:text-gray-300"
                onClick={() => setOpen(false)}
              >
                課題一覧
              </Link>
              <Link
                href="/settings"
                className="hover:underline hover:text-gray-300"
                onClick={() => setOpen(false)}
              >
                設定
              </Link>
            </>
          )}
          <div>
            {session ? (
              <SignOutButton />
            ) : (
              <Link
                href="/signin"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition block text-center"
                onClick={() => setOpen(false)}
              >
                サインイン
              </Link>
            )}
          </div>
        </nav>
        <button
          onClick={() => setOpen(false)}
          className="mt-auto px-4 py-2 rounded border border-white text-white hover:bg-white/20 transition w-full"
        >
          閉じる
        </button>
      </div>
    </header>
  );
}
