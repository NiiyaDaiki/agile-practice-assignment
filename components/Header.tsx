"use client";
import { useSession } from "next-auth/react";
import { SignOutButton } from "./SignOutButton";
import Link from "next/link";
import Logo from "@/public/logo.png";
import Image from "next/image";

export function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <header className="h-20 p-4 flex items-center bg-green-200 text-black shadow">
        <p>Loading...</p>
      </header>
    );
  }

  return (
    <header className="h-20 p-4 flex justify-between items-center bg-green-200 text-black shadow">
      <nav className="flex items-center space-x-6">
        {/* ブランドロゴ／TOP ページ */}
        <Link href="/" className="flex items-center hover:opacity-80">
          <Image
            src={Logo}
            alt="Agile Practice Assignment Logo"
            width={60}
            height={60}
          />
        </Link>

        {/* ログイン済みユーザー向け：課題編集ページへのリンク */}
        {/* {session && (
          <Link
            href="/assignments"
            className="hover:underline hover:text-gray-500"
          >
            課題編集
          </Link>
        )} */}
      </nav>

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
