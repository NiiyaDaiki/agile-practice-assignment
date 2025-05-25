"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { SignOutButton } from "./SignOutButton";
import Logo from "@/public/logo.png";
import { useEffect, useState } from "react";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname(); // ★ 現在のパスを取得
  const inAdmin = pathname.startsWith("/admin");

  const [pendingCount, setCount] = useState(0);
  useEffect(() => {
    if (inAdmin) {
      fetch("/api/requests?status=PENDING")
        .then((r) => r.json())
        .then((data) => setCount(data.length));
    }
  }, [inAdmin]);

  if (status === "loading") {
    return (
      <header className="p-4 bg-black text-white">
        <p>Loading...</p>
      </header>
    );
  }

  return (
    <header className="p-4 flex justify-between items-center bg-black text-white">
      {/* -------- 左側：ブランド＆（必要に応じて）管理メニュー -------- */}
      <nav className="flex items-center space-x-6">
        <Link href="/" className="flex items-center hover:opacity-80">
          <Image src={Logo} alt="APA Logo" width={40} height={40} />
          <span className="ml-2 font-bold text-xl">
            Agile Practice Assignment
          </span>
        </Link>

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
              リクエスト
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-2">
                  {pendingCount}
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

      {/* -------- 右側：サインイン／アウト -------- */}
      <div>
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
    </header>
  );
}
