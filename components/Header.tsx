"use client";
import { useSession } from "next-auth/react";
import { SignOutButton } from "./SignOutButton";
import Link from "next/link";

export function Header() {
  const { data: session, status } = useSession();

  // ローディング中は何も表示しないかプレースホルダー
  if (status === "loading") {
    return (
      <header className="p-4 bg-black">
        <p>Loading...</p>
      </header>
    );
  }

  return (
    <header className="p-4 flex justify-between items-center bg-black">
      <Link href="/" className="font-bold text-xl">
        AgilePracticeAssignment
      </Link>
      {session ? (
        <SignOutButton />
      ) : (
        <Link
          href="/signin"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          サインイン
        </Link>
      )}
    </header>
  );
}
