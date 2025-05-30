"use client";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">サインイン</h1>
      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="px-6 py-3 m-2 bg-purple-700 text-white rounded-md cursor-pointer"
      >
        Githubでログイン
      </button>
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="px-6 py-3 m-2 bg-blue-500 text-white rounded-md cursor-pointer"
      >
        Googleでログイン
      </button>
    </div>
  );
}
